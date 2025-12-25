/**
 * 사용자 친화적 에러 메시지 생성
 *
 * 기술적인 API 에러를 사용자가 이해하기 쉬운 메시지로 변환
 */

import { ParsedInput } from './smartParser'

export interface FriendlyError {
  message: string // 사용자 친화적 메시지
  technical?: string // 기술적 에러 메시지 (디버깅용)
  suggestion?: string // 해결 제안
}

/**
 * 에러를 사용자 친화적 메시지로 변환
 *
 * @param error - 원본 에러
 * @param intent - 입력 의도
 * @returns 친화적 에러 정보
 */
export function getUserFriendlyError(
  error: Error | string,
  intent: ParsedInput['intent']
): FriendlyError {
  const errorMessage = typeof error === 'string' ? error : error.message
  const lowerMessage = errorMessage.toLowerCase()

  // 1. nerdamer/mathjs API 에러
  if (lowerMessage.includes('is not a function')) {
    if (intent === 'derivative') {
      return {
        message: '미분을 계산할 수 없습니다',
        technical: errorMessage,
        suggestion: '변수가 포함된 식을 입력해주세요 (예: x^2 + 3x)'
      }
    }

    if (intent === 'integral') {
      return {
        message: '적분을 계산할 수 없습니다',
        technical: errorMessage,
        suggestion: '변수가 포함된 식을 입력해주세요 (예: 2x + 1)'
      }
    }

    if (intent === 'equation') {
      return {
        message: '방정식을 풀 수 없습니다',
        technical: errorMessage,
        suggestion: '입력 형식을 확인해주세요 (예: 2x + 4 = 10)'
      }
    }

    return {
      message: '계산 중 오류가 발생했습니다',
      technical: errorMessage,
      suggestion: '입력 형식을 확인해주세요'
    }
  }

  // 2. 파싱 에러 (문자 위치 정보 포함)
  if (lowerMessage.includes('char') || lowerMessage.includes('unexpected')) {
    const charMatch = errorMessage.match(/char[acter]*\s+(\d+)/i)
    const charPos = charMatch ? charMatch[1] : null

    if (charPos) {
      return {
        message: `${charPos}번째 문자 근처에 오류가 있습니다`,
        technical: errorMessage,
        suggestion: '괄호나 연산자가 올바른지 확인해주세요'
      }
    }

    return {
      message: '수식 형식이 올바르지 않습니다',
      technical: errorMessage,
      suggestion: '괄호와 연산자를 확인해주세요'
    }
  }

  // 3. mathjs 내부 16진수 변환 에러
  if (lowerMessage.includes('does not equal') || lowerMessage.includes('hex')) {
    return {
      message: '계산 중 내부 오류가 발생했습니다',
      technical: errorMessage,
      suggestion: '수식을 단순화하거나 다른 형태로 입력해주세요'
    }
  }

  // 4. 변수 오류
  if (lowerMessage.includes('undefined variable') || lowerMessage.includes('unknown variable')) {
    const varMatch = errorMessage.match(/variable\s+['"]?(\w+)['"]?/i)
    const varName = varMatch ? varMatch[1] : '변수'

    return {
      message: `정의되지 않은 변수입니다: ${varName}`,
      technical: errorMessage,
      suggestion: '변수 이름을 확인하거나 값을 할당해주세요'
    }
  }

  // 5. 0으로 나누기
  if (lowerMessage.includes('division by zero') || lowerMessage.includes('divide by zero')) {
    return {
      message: '0으로 나눌 수 없습니다',
      technical: errorMessage,
      suggestion: '분모가 0이 되지 않도록 확인해주세요'
    }
  }

  // 6. 범위 초과
  if (lowerMessage.includes('out of range') || lowerMessage.includes('overflow')) {
    return {
      message: '계산 결과가 너무 큽니다',
      technical: errorMessage,
      suggestion: '더 작은 값으로 계산해주세요'
    }
  }

  // 7. 도메인 에러 (예: 음수의 제곱근)
  if (lowerMessage.includes('domain') || lowerMessage.includes('complex')) {
    return {
      message: '정의되지 않은 계산입니다',
      technical: errorMessage,
      suggestion: '실수 범위에서 계산할 수 없는 값입니다 (예: 음수의 제곱근)'
    }
  }

  // 8. 문법 오류
  if (lowerMessage.includes('syntax') || lowerMessage.includes('parse')) {
    return {
      message: '수식 문법이 올바르지 않습니다',
      technical: errorMessage,
      suggestion: '괄호와 연산자를 확인해주세요'
    }
  }

  // 9. 등호 관련 (이중 부정 에러 수정)
  if (lowerMessage.includes('등호') || lowerMessage.includes('equation')) {
    if (intent === 'equation') {
      return {
        message: '방정식을 풀 수 없습니다',
        technical: errorMessage,
        suggestion: '등호(=)를 포함한 방정식을 입력해주세요'
      }
    } else {
      return {
        message: '등호(=)는 방정식 모드에서만 사용할 수 있습니다',
        technical: errorMessage,
        suggestion: '방정식을 풀려면 "방정식 풀이" 모드로 전환해주세요'
      }
    }
  }

  // 10. 적분 구간 오류
  if (lowerMessage.includes('bound') || lowerMessage.includes('limit')) {
    return {
      message: '적분 구간이 올바르지 않습니다',
      technical: errorMessage,
      suggestion: '적분 상한과 하한을 확인해주세요'
    }
  }

  // 11. 기본 에러
  return {
    message: '계산할 수 없습니다',
    technical: errorMessage,
    suggestion: '입력을 확인하고 다시 시도해주세요'
  }
}

/**
 * 에러 메시지를 한 줄 텍스트로 포맷팅
 *
 * @param friendlyError - 친화적 에러 정보
 * @param includeDetails - 상세 정보 포함 여부
 * @returns 포맷된 에러 메시지
 */
export function formatErrorMessage(friendlyError: FriendlyError, includeDetails = false): string {
  let message = friendlyError.message

  if (friendlyError.suggestion) {
    message += `\n💡 ${friendlyError.suggestion}`
  }

  if (includeDetails && friendlyError.technical) {
    message += `\n\n[기술 정보] ${friendlyError.technical}`
  }

  return message
}

/**
 * 의도별 기본 에러 메시지 반환
 *
 * @param intent - 입력 의도
 * @returns 기본 에러 메시지
 */
export function getDefaultErrorForIntent(intent: ParsedInput['intent']): FriendlyError {
  switch (intent) {
    case 'equation':
      return {
        message: '방정식을 풀 수 없습니다',
        suggestion: '등호(=)를 포함한 방정식을 입력해주세요 (예: 2x + 4 = 10)'
      }

    case 'derivative':
      return {
        message: '미분을 계산할 수 없습니다',
        suggestion: '변수가 포함된 식을 입력해주세요 (예: x^2 + 3x)'
      }

    case 'integral':
      return {
        message: '적분을 계산할 수 없습니다',
        suggestion: '변수가 포함된 식을 입력해주세요 (예: 2x + 1)'
      }

    case 'limit':
      return {
        message: '극한을 계산할 수 없습니다',
        suggestion: '극한값과 방향을 확인해주세요'
      }

    case 'matrix':
      return {
        message: '행렬 연산을 수행할 수 없습니다',
        suggestion: '행렬 형식을 확인해주세요 [[1,2],[3,4]]'
      }

    case 'expression':
    default:
      return {
        message: '계산할 수 없습니다',
        suggestion: '입력 형식을 확인해주세요'
      }
  }
}
