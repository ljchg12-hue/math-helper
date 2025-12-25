/**
 * 카테고리별 계산 모드 매핑
 *
 * 각 카테고리에 적합한 계산 모드만 표시하여 사용자 혼란 방지
 */

// ✅ CalculatorMode는 types.d.ts에서 global 정의됨

export const CATEGORY_MODE_MAP: Record<string, CalculatorMode[]> = {
  // 방정식 관련
  'linear_equation': ['solve', 'evaluate', 'simplify'],
  'quadratic_equation': ['solve', 'evaluate', 'factor', 'simplify'],
  'simultaneous_equations': ['solve', 'evaluate'],

  // 미적분
  'calculus': ['differentiate', 'integrate', 'limit', 'simplify', 'evaluate'],

  // 대수
  'polynomial': ['expand', 'simplify', 'factor', 'evaluate'],
  'factorization': ['factor', 'simplify', 'evaluate'],
  'inequality': ['solve', 'simplify', 'evaluate'],

  // 기하
  'geometry': ['evaluate'],

  // 통계 및 확률
  'statistics': ['evaluate'],
  'probability': ['evaluate'],

  // 수론 및 기타
  'prime': ['evaluate'],
  'matrix': ['evaluate'],
  'exponent': ['evaluate', 'simplify'],
  'trigonometry': ['evaluate', 'simplify'],
  'sequence': ['evaluate'],
  'vector': ['evaluate'],
  'complex_number': ['evaluate', 'simplify'],
} as const

/**
 * 카테고리에 따른 사용 가능한 모드 목록 반환
 *
 * @param category - 카테고리 ID (예: 'linear_equation', 'geometry')
 * @returns 해당 카테고리에서 사용 가능한 CalculatorMode 배열
 */
export function getAvailableModes(category?: string): CalculatorMode[] {
  // 카테고리가 없거나 'all'인 경우: 전체 모드 표시 (calculateAll 제외)
  if (!category || category === 'all') {
    return ['evaluate', 'solve', 'differentiate', 'integrate', 'simplify', 'factor', 'expand', 'limit']
  }

  // 매핑에 정의된 카테고리: 해당 모드만 반환
  const modes = CATEGORY_MODE_MAP[category]
  if (modes) {
    return [...modes] // 복사본 반환 (불변성)
  }

  // 매핑에 없는 카테고리: 기본 모드 (evaluate, simplify)
  return ['evaluate', 'simplify']
}

/**
 * 특정 모드가 카테고리에서 사용 가능한지 확인
 *
 * @param category - 카테고리 ID
 * @param mode - 확인할 CalculatorMode
 * @returns 사용 가능 여부
 */
export function isModeAvailable(category: string | undefined, mode: CalculatorMode): boolean {
  const availableModes = getAvailableModes(category)
  return availableModes.includes(mode)
}

/**
 * 통합 계산 모드(calculateAll)에서 실행할 모드 목록 반환
 *
 * @param category - 카테고리 ID
 * @param input - 입력 수식 (선택적 최적화)
 * @returns 실행할 모드 배열
 */
export function getCalculateAllModes(category?: string, input?: string): CalculatorMode[] {
  const baseModes = getAvailableModes(category)

  // calculateAll 자체는 제외
  return baseModes.filter(mode => mode !== 'calculateAll')
}
