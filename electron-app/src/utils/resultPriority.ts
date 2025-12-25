/**
 * 통합 계산 결과 우선순위 시스템
 *
 * 입력 수식 분석을 통해 주 결과(primary)와 부가 정보(secondary)를 구분
 */

export interface PrioritizedResults {
  primary: { mode: CalculatorMode; result: UnifiedCalcResult }
  secondary: Array<{ mode: CalculatorMode; result: UnifiedCalcResult }>
  notApplicable: Array<{ mode: CalculatorMode; reason: string }>
  stats: {
    total: number
    success: number
    failure: number
    totalTime: number
  }
}

/**
 * 통합 계산 결과를 우선순위에 따라 분류
 *
 * @param results - 통합 계산 결과 배열
 * @param input - 입력 수식
 * @returns 우선순위별로 분류된 결과
 */
export function prioritizeResults(
  results: UnifiedCalcResult[],
  input: string
): PrioritizedResults {
  const hasEquals = input.includes('=')
  const hasVariable = /[a-z]/i.test(input)
  const hasDerivativeSymbol = input.includes("'") || input.includes('d/dx')
  const hasIntegralSymbol = input.includes('∫') || input.toLowerCase().includes('integral')

  // 우선순위 규칙 결정
  let primaryMode: CalculatorMode
  if (hasDerivativeSymbol) {
    primaryMode = 'differentiate' // 미분 기호 → 미분이 주 결과
  } else if (hasIntegralSymbol) {
    primaryMode = 'integrate' // 적분 기호 → 적분이 주 결과
  } else if (hasEquals) {
    primaryMode = 'solve' // 방정식 → 해 풀이가 주 결과
  } else if (hasVariable) {
    primaryMode = 'simplify' // 변수 포함 → 간단히가 주 결과
  } else {
    primaryMode = 'evaluate' // 상수 → 계산이 주 결과
  }

  // 주 결과 찾기 (성공한 것 우선, 없으면 실패한 것이라도)
  let primary = results.find(r => r.mode === primaryMode && r.success)
  if (!primary) {
    primary = results.find(r => r.mode === primaryMode)
  }

  // 주 결과가 없으면 첫 번째 성공한 결과를 주 결과로
  if (!primary) {
    primary = results.find(r => r.success) || results[0]
  }

  // 부가 정보: 주 결과가 아니면서 성공한 결과들
  const secondary = results
    .filter(r => r.mode !== primary!.mode && r.success)
    .sort((a, b) => {
      // 실행 시간 순으로 정렬
      return a.executionTime - b.executionTime
    })

  // 적용 불가: 실패한 결과들
  const notApplicable = results
    .filter(r => r.mode !== primary!.mode && !r.success)
    .map(r => ({
      mode: r.mode,
      reason: getNotApplicableReason(r.mode, input, r.error)
    }))

  // 통계 계산
  const stats = {
    total: results.length,
    success: results.filter(r => r.success).length,
    failure: results.filter(r => !r.success).length,
    totalTime: results.reduce((sum, r) => sum + r.executionTime, 0)
  }

  return {
    primary: { mode: primary.mode, result: primary },
    secondary: secondary.map(r => ({ mode: r.mode, result: r })),
    notApplicable,
    stats
  }
}

/**
 * 모드가 적용 불가능한 이유를 반환
 *
 * @param mode - 계산 모드
 * @param input - 입력 수식
 * @param error - 에러 메시지 (선택)
 * @returns 적용 불가 이유
 */
function getNotApplicableReason(
  mode: CalculatorMode,
  input: string,
  error?: string
): string {
  const hasVariable = /[a-z]/i.test(input)
  const hasEquals = input.includes('=')

  // 모드별 적용 불가 이유
  switch (mode) {
    case 'differentiate':
      if (!hasVariable) {
        return '변수가 없어 미분할 수 없습니다'
      }
      return error || '미분을 적용할 수 없습니다'

    case 'integrate':
      if (!hasVariable) {
        return '변수가 없어 적분할 수 없습니다'
      }
      return error || '적분을 적용할 수 없습니다'

    case 'solve':
      if (!hasEquals) {
        return '등호가 없어 방정식을 풀 수 없습니다'
      }
      return error || '방정식을 풀 수 없습니다'

    case 'factor':
      if (!hasVariable) {
        return '변수가 없어 인수분해할 수 없습니다'
      }
      return error || '인수분해를 적용할 수 없습니다'

    case 'expand':
      return error || '전개를 적용할 수 없습니다'

    case 'limit':
      if (!hasVariable) {
        return '변수가 없어 극한을 구할 수 없습니다'
      }
      return error || '극한을 적용할 수 없습니다'

    case 'simplify':
      return error || '간단히를 적용할 수 없습니다'

    case 'evaluate':
      return error || '계산할 수 없습니다'

    default:
      return error || '적용할 수 없습니다'
  }
}
