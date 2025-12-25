// 변수 분석 유틸리티
// 수식에서 변수를 자동 감지하고 주 변수와 파라미터를 구분합니다

import { extractVariables } from './graphHelper'

/**
 * 변수 분석 결과
 */
export interface VariableAnalysis {
  /** 모든 변수 목록 */
  allVariables: string[]
  /** 주 변수 (solve 대상) */
  primaryVariable: string
  /** 파라미터 변수들 */
  parameters: string[]
  /** 다중 변수 여부 */
  hasMultipleVars: boolean
  /** 변수가 없는 경우 (상수 수식) */
  isConstant: boolean
}

/**
 * 변수 우선순위 정의
 * 일반적으로 x, y, z, t 순서로 주 변수를 선택
 */
const VARIABLE_PRIORITY = ['x', 'y', 'z', 't', 'u', 'v', 'w']

/**
 * 수식에서 변수를 분석하여 주 변수와 파라미터를 구분합니다
 *
 * @param expression - 분석할 수식
 * @param preferredVariable - 선호하는 주 변수 (옵션)
 * @returns 변수 분석 결과
 *
 * @example
 * // 이차방정식 일반 해
 * analyzeVariables("x = (-b + sqrt(b^2 - 4*a*c)) / (2*a)")
 * // → { primaryVariable: 'x', parameters: ['a', 'b', 'c'], hasMultipleVars: true }
 *
 * @example
 * // 단일 변수
 * analyzeVariables("2*x + 5")
 * // → { primaryVariable: 'x', parameters: [], hasMultipleVars: false }
 *
 * @example
 * // 상수
 * analyzeVariables("sin(3)")
 * // → { primaryVariable: '', parameters: [], hasMultipleVars: false, isConstant: true }
 */
export function analyzeVariables(
  expression: string,
  preferredVariable?: string
): VariableAnalysis {
  // 수식에서 모든 변수 추출
  const allVariables = extractVariables(expression)

  // 변수가 없는 경우 (상수 수식)
  if (allVariables.length === 0) {
    return {
      allVariables: [],
      primaryVariable: '',
      parameters: [],
      hasMultipleVars: false,
      isConstant: true
    }
  }

  // 주 변수 결정
  let primaryVariable: string

  if (preferredVariable && allVariables.includes(preferredVariable)) {
    // 사용자가 지정한 변수 우선
    primaryVariable = preferredVariable
  } else {
    // 우선순위에 따라 자동 선택
    primaryVariable = selectPrimaryVariable(allVariables)
  }

  // 나머지는 파라미터
  const parameters = allVariables.filter(v => v !== primaryVariable)

  return {
    allVariables,
    primaryVariable,
    parameters,
    hasMultipleVars: allVariables.length > 1,
    isConstant: false
  }
}

/**
 * 우선순위에 따라 주 변수를 선택합니다
 *
 * @param variables - 변수 목록
 * @returns 선택된 주 변수
 *
 * @example
 * selectPrimaryVariable(['a', 'b', 'x']) // → 'x' (우선순위 높음)
 * selectPrimaryVariable(['a', 'b', 'c']) // → 'a' (알파벳순)
 */
function selectPrimaryVariable(variables: string[]): string {
  // 우선순위 목록에서 찾기
  for (const priorityVar of VARIABLE_PRIORITY) {
    if (variables.includes(priorityVar)) {
      return priorityVar
    }
  }

  // 우선순위에 없으면 알파벳순으로 첫 번째
  return variables.sort()[0]
}

/**
 * 수식에 특정 변수가 포함되어 있는지 확인합니다
 *
 * @param expression - 확인할 수식
 * @param variable - 찾을 변수
 * @returns 포함 여부
 *
 * @example
 * hasVariable("2*x + 3*y", "x") // → true
 * hasVariable("2*x + 3*y", "z") // → false
 */
export function hasVariable(expression: string, variable: string): boolean {
  const vars = extractVariables(expression)
  return vars.includes(variable)
}

/**
 * 여러 수식에서 공통 변수를 찾습니다
 *
 * @param expressions - 수식 배열
 * @returns 공통 변수 목록
 *
 * @example
 * findCommonVariables(["2*x + y", "x - 3*y", "x*z"])
 * // → ['x'] (모든 수식에 x가 공통)
 */
export function findCommonVariables(expressions: string[]): string[] {
  if (expressions.length === 0) return []

  // 첫 번째 수식의 변수로 시작
  const firstVars = new Set(extractVariables(expressions[0]))

  // 나머지 수식과 교집합
  for (let i = 1; i < expressions.length; i++) {
    const currentVars = new Set(extractVariables(expressions[i]))
    // 교집합만 남기기
    for (const v of firstVars) {
      if (!currentVars.has(v)) {
        firstVars.delete(v)
      }
    }
  }

  return Array.from(firstVars).sort()
}

/**
 * 변수 개수에 따른 방정식 유형을 판단합니다
 *
 * @param expression - 분석할 수식
 * @returns 방정식 유형
 *
 * @example
 * getEquationType("2*x + 5 = 0") // → "single-variable"
 * getEquationType("x + y = 10") // → "multi-variable"
 * getEquationType("5 = 5") // → "constant"
 */
export function getEquationType(
  expression: string
): 'constant' | 'single-variable' | 'multi-variable' {
  const analysis = analyzeVariables(expression)

  if (analysis.isConstant) return 'constant'
  if (analysis.hasMultipleVars) return 'multi-variable'
  return 'single-variable'
}

/**
 * 변수 분석 결과를 사람이 읽기 쉬운 형태로 포맷합니다
 *
 * @param analysis - 변수 분석 결과
 * @returns 포맷된 문자열
 *
 * @example
 * const analysis = analyzeVariables("x = (-b + sqrt(b^2 - 4*a*c)) / (2*a)")
 * formatAnalysis(analysis)
 * // → "주 변수: x, 파라미터: a, b, c (총 4개 변수)"
 */
export function formatAnalysis(analysis: VariableAnalysis): string {
  if (analysis.isConstant) {
    return '상수 수식 (변수 없음)'
  }

  if (!analysis.hasMultipleVars) {
    return `단일 변수: ${analysis.primaryVariable}`
  }

  const paramStr = analysis.parameters.join(', ')
  const totalCount = analysis.allVariables.length

  return `주 변수: ${analysis.primaryVariable}, 파라미터: ${paramStr} (총 ${totalCount}개 변수)`
}
