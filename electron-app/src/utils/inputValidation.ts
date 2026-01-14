/**
 * 입력 검증 유틸리티
 * - 수식 입력의 사전 검증
 * - 에러 발생 전 문제점 감지
 *
 * @version 1.0.25
 */

import { CalculatorMode } from '../types'

/**
 * 입력 검증 결과
 */
export interface ValidationResult {
  valid: boolean
  error?: string
  warning?: string
  suggestion?: string
}

/**
 * 입력 값 사전 검증
 *
 * @param input - 사용자 입력 문자열
 * @param mode - 현재 계산 모드
 * @returns 검증 결과 (valid: true면 통과, false면 error 포함)
 */
export function validateInput(input: string, mode: CalculatorMode): ValidationResult {
  // 빈 입력은 허용 (계산 시점에 처리)
  if (!input.trim()) {
    return { valid: true }
  }

  // 1. 등호(=) 검증
  const equalsValidation = validateEquals(input, mode)
  if (!equalsValidation.valid) {
    return equalsValidation
  }

  // 2. 괄호 짝 검증
  const parenthesesValidation = validateParentheses(input)
  if (!parenthesesValidation.valid) {
    return parenthesesValidation
  }

  // 3. 연속된 연산자 검증
  const operatorValidation = validateOperators(input)
  if (!operatorValidation.valid) {
    return operatorValidation
  }

  // 4. 빈 괄호 검증
  const emptyParenthesesValidation = validateEmptyParentheses(input)
  if (!emptyParenthesesValidation.valid) {
    return emptyParenthesesValidation
  }

  // 모든 검증 통과
  return { valid: true }
}

/**
 * 등호(=) 사용 검증
 * - solve 모드가 아닌 경우 등호 사용 금지
 * - 비교 연산자 (==, !=, <=, >=)는 허용
 */
function validateEquals(input: string, mode: CalculatorMode): ValidationResult {
  // solve 모드에서는 등호 허용
  if (mode === 'solve') {
    return { valid: true }
  }

  // 비교 연산자 제거 후 검사
  // ==, !=, <=, >=, <, > 는 허용
  const cleanedInput = input
    .replace(/==/g, '')   // == 제거
    .replace(/!=/g, '')   // != 제거
    .replace(/<=/g, '')   // <= 제거
    .replace(/>=/g, '')   // >= 제거

  // 등호가 남아있으면 에러
  if (cleanedInput.includes('=')) {
    return {
      valid: false,
      error: '등호(=)는 방정식 모드(Solve)에서만 사용할 수 있습니다',
      suggestion: '방정식을 풀려면 "Solve" 모드로 전환하세요'
    }
  }

  return { valid: true }
}

/**
 * 괄호 짝 검증
 */
function validateParentheses(input: string): ValidationResult {
  const openParens = (input.match(/\(/g) || []).length
  const closeParens = (input.match(/\)/g) || []).length

  if (openParens !== closeParens) {
    const diff = Math.abs(openParens - closeParens)
    const missingType = openParens > closeParens ? '닫는' : '여는'

    return {
      valid: false,
      error: `괄호가 맞지 않습니다 (${missingType} 괄호 ${diff}개 부족)`,
      suggestion: `${missingType} 괄호 '${openParens > closeParens ? ')' : '('}' 를 추가하세요`
    }
  }

  // 대괄호 검증 (행렬/배열)
  const openBrackets = (input.match(/\[/g) || []).length
  const closeBrackets = (input.match(/\]/g) || []).length

  if (openBrackets !== closeBrackets) {
    const diff = Math.abs(openBrackets - closeBrackets)
    const missingType = openBrackets > closeBrackets ? '닫는' : '여는'

    return {
      valid: false,
      error: `대괄호가 맞지 않습니다 (${missingType} 대괄호 ${diff}개 부족)`,
      suggestion: `${missingType} 대괄호 '${openBrackets > closeBrackets ? ']' : '['}' 를 추가하세요`
    }
  }

  return { valid: true }
}

/**
 * 연속된 연산자 검증
 * - ++, --, **, // 등 연속 연산자 감지
 * - 단, ** (거듭제곱)은 허용
 */
function validateOperators(input: string): ValidationResult {
  // ** (거듭제곱)은 허용하므로 제외
  const cleanedInput = input.replace(/\*\*/g, '^')

  // 연속된 연산자 패턴
  // +-, -+, */, /* 등
  const invalidPatterns = [
    { pattern: /[+\-*/]{3,}/, message: '연산자가 너무 많이 연속됩니다' },
    { pattern: /[+*/]{2,}/, message: '연산자가 연속으로 사용되었습니다' },
    { pattern: /--/, message: '--를 사용하셨습니다. 음수를 빼려면 -(-n) 형태로 입력하세요' },
  ]

  for (const { pattern, message } of invalidPatterns) {
    if (pattern.test(cleanedInput)) {
      return {
        valid: false,
        error: message,
        warning: '연산자 사이에 숫자나 변수가 필요합니다'
      }
    }
  }

  // 연산자로 시작하는 경우 (단, +, - 는 부호로 허용)
  if (/^[*/^]/.test(input.trim())) {
    return {
      valid: false,
      error: '수식이 연산자로 시작할 수 없습니다',
      suggestion: '숫자나 변수로 시작하세요'
    }
  }

  // 연산자로 끝나는 경우
  if (/[+\-*/^]$/.test(input.trim())) {
    return {
      valid: true,  // 경고만 표시 (입력 중일 수 있음)
      warning: '수식이 연산자로 끝납니다. 계속 입력하세요.'
    }
  }

  return { valid: true }
}

/**
 * 빈 괄호 검증
 */
function validateEmptyParentheses(input: string): ValidationResult {
  // () 빈 괄호
  if (/\(\s*\)/.test(input)) {
    return {
      valid: false,
      error: '빈 괄호가 있습니다',
      suggestion: '괄호 안에 내용을 입력하세요'
    }
  }

  // [] 빈 대괄호
  if (/\[\s*\]/.test(input)) {
    return {
      valid: false,
      error: '빈 대괄호가 있습니다',
      suggestion: '배열/행렬에 값을 입력하세요'
    }
  }

  return { valid: true }
}

/**
 * 실시간 입력 검증 (경고 레벨)
 * - 에러가 아닌 경고만 반환
 * - 사용자가 입력 중일 때 사용
 */
export function validateInputRealtime(input: string, mode: CalculatorMode): ValidationResult {
  if (!input.trim()) {
    return { valid: true }
  }

  // 등호 경고 (solve 모드 아닐 때)
  if (mode !== 'solve' && input.includes('=')) {
    // 비교 연산자 제외
    const cleanedInput = input
      .replace(/==/g, '')
      .replace(/!=/g, '')
      .replace(/<=/g, '')
      .replace(/>=/g, '')

    if (cleanedInput.includes('=')) {
      return {
        valid: true,  // 경고만
        warning: '등호(=)는 Solve 모드에서만 사용 가능합니다'
      }
    }
  }

  // 괄호 불균형 경고
  const openParens = (input.match(/\(/g) || []).length
  const closeParens = (input.match(/\)/g) || []).length
  if (openParens !== closeParens) {
    return {
      valid: true,
      warning: `괄호 ${Math.abs(openParens - closeParens)}개가 맞지 않습니다`
    }
  }

  return { valid: true }
}

/**
 * 특정 모드에 맞는 입력인지 검증
 */
export function validateInputForMode(input: string, mode: CalculatorMode): ValidationResult {
  switch (mode) {
    case 'solve':
      // 방정식에는 등호 또는 부등호가 필요
      if (!input.includes('=') && !/[<>]/.test(input)) {
        return {
          valid: true,
          warning: '방정식에는 등호(=) 또는 부등호(<, >)가 필요합니다'
        }
      }
      break

    case 'differentiate':
    case 'integrate':
      // 변수가 포함되어야 함
      if (!/[a-zA-Z]/.test(input)) {
        return {
          valid: true,
          warning: '미분/적분을 위해 변수(예: x)가 필요합니다'
        }
      }
      break

    case 'factor':
      // 다항식이어야 함
      if (!/[a-zA-Z]/.test(input) && !/\^/.test(input)) {
        return {
          valid: true,
          warning: '인수분해를 위해 변수가 포함된 다항식이 필요합니다'
        }
      }
      break

    case 'limit':
      // 변수가 포함되어야 함
      if (!/[a-zA-Z]/.test(input)) {
        return {
          valid: true,
          warning: '극한 계산을 위해 변수(예: x)가 필요합니다'
        }
      }
      break
  }

  return { valid: true }
}
