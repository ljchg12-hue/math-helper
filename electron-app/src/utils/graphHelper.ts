/**
 * 그래프 생성을 위한 유틸리티 함수들
 * ✅ v1.0.32: 참조 자료 기반 전면 개선
 *
 * function-plot 라이브러리는 math.js 표현식 파서를 사용합니다.
 * @see https://mathjs.org/docs/expressions/syntax.html
 */

// 수학 함수 및 상수 목록 (변수에서 제외)
const MATH_KEYWORDS = new Set([
  // 삼각함수
  'sin', 'cos', 'tan', 'cot', 'sec', 'csc',
  'asin', 'acos', 'atan', 'atan2',
  'sinh', 'cosh', 'tanh', 'asinh', 'acosh', 'atanh',
  // 로그/지수
  'log', 'ln', 'log10', 'log2', 'exp',
  // 제곱근
  'sqrt', 'cbrt', 'nthRoot',
  // 기타 함수
  'abs', 'floor', 'ceil', 'round', 'sign',
  'min', 'max', 'pow', 'mod',
  'factorial', 'gamma',
  // 상수
  'pi', 'PI', 'e', 'E', 'i', 'I',
  'NaN', 'Infinity', 'inf',
  // 특수
  'true', 'false', 'null'
])

/**
 * 수식에서 변수를 추출합니다
 */
export function extractVariables(expression: string): string[] {
  if (!expression) return []

  // 알파벳 단어 추출
  const matches = expression.match(/[a-zA-Z_][a-zA-Z0-9_]*/g) || []

  // 수학 키워드 제외
  const variables = matches.filter(word =>
    !MATH_KEYWORDS.has(word) && !MATH_KEYWORDS.has(word.toLowerCase())
  )

  // 중복 제거
  return [...new Set(variables)]
}

/**
 * 수식이 그래프로 표현 가능한지 확인합니다
 */
export function isGraphable(expression: string, mode: string): boolean {
  if (!expression || !expression.trim()) return false

  // 방정식은 solve 모드에서만 (단, 함수 정의 형식은 제외)
  const isFunctionDef = /^[a-zA-Z]\s*=/.test(expression.trim()) &&
    !/^[a-zA-Z]\s*=\s*[a-zA-Z]\s*$/.test(expression.trim())

  if (expression.includes('=') && mode !== 'solve' && !isFunctionDef) {
    return false
  }

  const variables = extractVariables(expression)

  // 1~2개 변수만 그래프 가능
  // 0개: 상수 (그래프 불가)
  // 1개: 2D 그래프
  // 2개: 3D/등고선 (추후)
  // 3개+: 미지원
  return variables.length >= 1 && variables.length <= 2
}

/**
 * 수식을 function-plot 형식으로 변환합니다
 *
 * function-plot은 math.js 문법을 사용:
 * - ^ 또는 ** : 거듭제곱
 * - sin, cos, tan, log, sqrt, abs, exp 등 지원
 * - 암묵적 곱셈 미지원 (2x → 2*x 변환 필요)
 *
 * @see https://mauriciopoppe.github.io/function-plot/
 */
export function convertToPlotFormat(expression: string, variable: string = 'x'): string {
  let expr = expression.trim()

  // 빈 문자열
  if (!expr) return variable

  // 1. 함수 정의 형식 처리 (y=sin(x) → sin(x), f(x)=x^2 → x^2)
  expr = expr.replace(/^[a-zA-Z](\s*\([a-zA-Z]\))?\s*=\s*/, '')

  // 2. 방정식 형식 처리 (x^2 - 4 = 0 → x^2 - 4)
  if (expr.includes('=')) {
    const [left, right] = expr.split('=').map(s => s.trim())
    if (right === '0' || right === '') {
      expr = left
    } else {
      expr = `(${left}) - (${right})`
    }
  }

  // 3. 암묵적 곱셈 변환
  // 3a. 숫자 + 변수/함수: 2x → 2*x, 3sin → 3*sin
  expr = expr.replace(/(\d)([a-zA-Z])/g, '$1*$2')

  // 3b. 닫는 괄호 + 문자/숫자/여는 괄호: )x → )*x, )2 → )*2, )( → )*(
  expr = expr.replace(/\)([a-zA-Z0-9(])/g, ')*$1')

  // 3c. 변수 + 여는 괄호 (함수 호출 제외): x( → x*(
  // 함수 목록 제외
  const funcPattern = /([a-zA-Z_][a-zA-Z0-9_]*)\(/g
  const funcNames = [...MATH_KEYWORDS]
  let result = ''
  let lastIndex = 0
  let match

  while ((match = funcPattern.exec(expr)) !== null) {
    const funcName = match[1].toLowerCase()
    result += expr.slice(lastIndex, match.index)

    if (funcNames.includes(funcName) || MATH_KEYWORDS.has(funcName)) {
      // 함수 호출 유지
      result += match[0]
    } else {
      // 변수 * 괄호
      result += match[1] + '*('
    }
    lastIndex = match.index + match[0].length
  }
  expr = result + expr.slice(lastIndex)

  // 4. 특수 문자 변환
  // π → pi
  expr = expr.replace(/π/g, 'pi')
  // ln → log (function-plot/math.js는 log가 자연로그)
  expr = expr.replace(/\bln\b/gi, 'log')
  // 단독 e 상수 (exp 함수와 구분)
  expr = expr.replace(/\be\b(?![a-zA-Z])/g, 'E')

  // 5. 공백 정리
  expr = expr.replace(/\s+/g, '')

  return expr || variable
}

/**
 * X축 범위 자동 계산
 */
export function calculateDomain(expression: string): [number, number] {
  const expr = expression.toLowerCase()

  // 삼각함수: [-2π, 2π]
  if (/\b(sin|cos|tan|cot|sec|csc)\b/.test(expr)) {
    return [-2 * Math.PI, 2 * Math.PI]
  }

  // 로그 함수: [0.1, 10] (양수만)
  if (/\b(log|ln)\b/.test(expr)) {
    return [0.1, 20]
  }

  // 지수 함수: [-5, 5]
  if (/\bexp\b/.test(expr)) {
    return [-5, 5]
  }

  // 제곱근: [0, 20] (음수 제외)
  if (/\bsqrt\b/.test(expr)) {
    return [0, 20]
  }

  // 고차 다항식 (^3, ^4 등): 더 넓은 범위
  if (/\^[3-9]|\^\d{2,}/.test(expr)) {
    return [-5, 5]
  }

  // 기본값
  return [-10, 10]
}

/**
 * Y축 범위 자동 계산
 */
export function calculateRange(expression: string): [number, number] {
  const expr = expression.toLowerCase()

  // 지수 함수: [0, 50]
  if (/\bexp\b/.test(expr)) {
    return [-5, 50]
  }

  // 삼각함수: [-2, 2]
  if (/\b(sin|cos)\b/.test(expr)) {
    return [-2, 2]
  }

  // tan: [-10, 10] (점근선 고려)
  if (/\btan\b/.test(expr)) {
    return [-10, 10]
  }

  // 로그: [-5, 10]
  if (/\b(log|ln)\b/.test(expr)) {
    return [-5, 10]
  }

  // 고차 다항식
  if (/\^[3-9]|\^\d{2,}/.test(expr)) {
    return [-100, 100]
  }

  // 기본값
  return [-10, 10]
}

/**
 * 그래프 제목 생성
 */
export function generateGraphTitle(expression: string, mode: string, variable: string = 'x'): string {
  // 긴 수식은 축약
  const shortExpr = expression.length > 30
    ? expression.substring(0, 27) + '...'
    : expression

  switch (mode) {
    case 'differentiate':
      return `f'(${variable})`
    case 'integrate':
      return `∫f(${variable})d${variable}`
    case 'solve':
      return `근 탐색: ${shortExpr}`
    default:
      return `f(${variable}) = ${shortExpr}`
  }
}
