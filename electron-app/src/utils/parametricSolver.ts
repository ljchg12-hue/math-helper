// 파라미터 방정식 풀이 유틸리티
// nerdamer를 사용하여 다중 변수 방정식을 풀이합니다

import { analyzeVariables } from './variableAnalyzer'

// ✅ FIX: 전역 nerdamer 사용 (preload.js에서 로드됨)
interface NerdamerExpression {
  toString(): string
  text(): string
  evaluate(vars?: Record<string, any>): NerdamerExpression
  simplify(): NerdamerExpression
}

interface NerdamerStatic {
  (expr: string): NerdamerExpression
  solveEquations(equation: string, variable: string): string[] | string
}

declare const nerdamer: NerdamerStatic

/**
 * 파라미터 방정식 풀이 결과
 */
export interface ParametricSolution {
  /** 풀이 대상 변수 */
  variable: string
  /** 일반 해 (파라미터 포함) */
  generalSolution: string
  /** 구체적인 해 (파라미터 값 대입 후) */
  specificSolution?: string
  /** 대입한 파라미터 값들 */
  substitutions?: Record<string, string>
  /** 에러 메시지 */
  error?: string
  /** 성공 여부 */
  success: boolean
}

/**
 * 파라미터를 포함한 방정식을 풉니다
 *
 * @param equation - 풀이할 방정식
 * @param targetVariable - 풀이 대상 변수 (옵션, 자동 감지)
 * @param parameterValues - 파라미터 값 (옵션)
 * @returns 풀이 결과
 *
 * @example
 * // 일반 해만 구하기
 * solveParametric("x = (-b + sqrt(b^2 - 4*a*c)) / (2*a)")
 * // → { generalSolution: "(-b + sqrt(b^2 - 4*a*c)) / (2*a)", ... }
 *
 * @example
 * // 파라미터 값 대입
 * solveParametric(
 *   "x = (-b + sqrt(b^2 - 4*a*c)) / (2*a)",
 *   "x",
 *   { a: "1", b: "-5", c: "6" }
 * )
 * // → { generalSolution: "...", specificSolution: "3", ... }
 *
 * @example
 * // 등비수열 합 공식
 * solveParametric(
 *   "S_n = a * (1 - r^n) / (1 - r)",
 *   "S_n",
 *   { a: "2", r: "3", n: "5" }
 * )
 * // → { specificSolution: "484", ... }
 */
export function solveParametric(
  equation: string,
  targetVariable?: string,
  parameterValues: Record<string, string> = {}
): ParametricSolution {
  try {
    // 변수 분석
    const analysis = analyzeVariables(equation, targetVariable)

    // 상수 수식인 경우
    if (analysis.isConstant) {
      return {
        variable: '',
        generalSolution: '',
        error: '변수가 없어 방정식을 풀 수 없습니다',
        success: false
      }
    }

    const targetVar = analysis.primaryVariable

    // 방정식 전처리
    let expr = preprocessEquation(equation)

    // 1. 일반 해 구하기
    let generalSolution: string

    try {
      // 등호로 분리
      if (expr.includes('=')) {
        const parts = expr.split('=')
        if (parts.length !== 2) {
          throw new Error('잘못된 방정식 형식')
        }

        const left = parts[0].trim()
        const right = parts[1].trim()

        // 좌변이 단순히 변수만 있는 경우 (예: x = ...)
        if (left === targetVar) {
          generalSolution = right
        } else {
          // 일반 방정식 (예: 2*x + 3 = 10)
          expr = `(${left}) - (${right})`
          const solution = nerdamer.solveEquations(expr, targetVar)
          generalSolution = solution.toString()
        }
      } else {
        // 등호가 없으면 = 0으로 간주
        const solution = nerdamer.solveEquations(expr, targetVar)
        generalSolution = solution.toString()
      }

      // 배열 형태면 첫 번째 해 추출
      generalSolution = extractFirstSolution(generalSolution)

    } catch (err) {
      return {
        variable: targetVar,
        generalSolution: '',
        error: `일반 해를 구할 수 없습니다: ${err instanceof Error ? err.message : String(err)}`,
        success: false
      }
    }

    // 2. 파라미터 값이 주어진 경우 대입
    let specificSolution: string | undefined
    let substitutions: Record<string, string> | undefined

    if (Object.keys(parameterValues).length > 0) {
      try {
        // nerdamer evaluate 사용
        let evalExpr = nerdamer(generalSolution)

        // 각 파라미터 대입
        const actualSubstitutions: Record<string, string> = {}
        for (const [param, value] of Object.entries(parameterValues)) {
          if (value.trim()) {
            evalExpr = evalExpr.evaluate({ [param]: value })
            actualSubstitutions[param] = value
          }
        }

        specificSolution = evalExpr.toString()
        substitutions = actualSubstitutions

        // 숫자로 변환 가능하면 깔끔하게 표시
        const numValue = parseFloat(specificSolution)
        if (!isNaN(numValue) && isFinite(numValue)) {
          // 소수점 10자리까지만 표시
          specificSolution = numValue.toFixed(10).replace(/\.?0+$/, '')
        }

      } catch (err) {
        // 대입 실패해도 일반 해는 반환
        console.warn('Parameter substitution failed:', err)
      }
    }

    return {
      variable: targetVar,
      generalSolution: cleanSolution(generalSolution),
      specificSolution: specificSolution ? cleanSolution(specificSolution) : undefined,
      substitutions,
      success: true
    }

  } catch (err) {
    return {
      variable: targetVariable || '',
      generalSolution: '',
      error: `풀이 중 오류 발생: ${err instanceof Error ? err.message : String(err)}`,
      success: false
    }
  }
}

/**
 * 방정식 전처리
 * 언더스코어를 일반 변수로 변환 (예: S_n → Sn)
 */
function preprocessEquation(equation: string): string {
  // S_n → Sn (nerdamer는 언더스코어를 지원하지 않음)
  let processed = equation.replace(/([a-zA-Z]+)_([a-zA-Z0-9]+)/g, '$1$2')

  // 공백 제거
  processed = processed.replace(/\s+/g, '')

  return processed
}

/**
 * nerdamer 결과에서 첫 번째 해를 추출합니다
 *
 * @param solution - nerdamer 결과 문자열
 * @returns 첫 번째 해
 *
 * @example
 * extractFirstSolution("[2,3]") // → "2"
 * extractFirstSolution("5") // → "5"
 */
function extractFirstSolution(solution: string): string {
  // 배열 형태: [2, 3] → 2
  if (solution.startsWith('[') && solution.endsWith(']')) {
    const inner = solution.slice(1, -1)
    const parts = splitByComma(inner)
    return parts[0]?.trim() || solution
  }

  return solution
}

/**
 * 쉼표로 분리하되, 괄호 안의 쉼표는 무시합니다
 *
 * @param str - 분리할 문자열
 * @returns 분리된 배열
 *
 * @example
 * splitByComma("2, (3,4), 5") // → ["2", "(3,4)", "5"]
 */
function splitByComma(str: string): string[] {
  const results: string[] = []
  let current = ''
  let depth = 0

  for (const char of str) {
    if (char === '(' || char === '[') {
      depth++
      current += char
    } else if (char === ')' || char === ']') {
      depth--
      current += char
    } else if (char === ',' && depth === 0) {
      results.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }

  if (current.trim()) {
    results.push(current.trim())
  }

  return results
}

/**
 * 솔루션을 깔끔하게 정리합니다
 *
 * @param solution - 정리할 솔루션
 * @returns 정리된 솔루션
 *
 * @example
 * cleanSolution("  (  2  )  ") // → "(2)"
 * cleanSolution("3.0000000000") // → "3"
 */
function cleanSolution(solution: string): string {
  // 공백 제거
  let cleaned = solution.replace(/\s+/g, '')

  // 불필요한 괄호 제거 (단순 숫자의 경우)
  if (/^\(-?\d+\.?\d*\)$/.test(cleaned)) {
    cleaned = cleaned.slice(1, -1)
  }

  return cleaned
}

/**
 * 다중 해를 모두 구합니다 (배열로 반환)
 *
 * @param equation - 풀이할 방정식
 * @param targetVariable - 풀이 대상 변수
 * @param parameterValues - 파라미터 값
 * @returns 모든 해의 배열
 *
 * @example
 * solveParametricAll("x^2 - 5*x + 6 = 0", "x")
 * // → ["2", "3"]
 */
export function solveParametricAll(
  equation: string,
  targetVariable?: string,
  parameterValues: Record<string, string> = {}
): string[] {
  const result = solveParametric(equation, targetVariable, parameterValues)

  if (!result.success) {
    return []
  }

  const solution = result.specificSolution || result.generalSolution

  // 배열 형태면 분리
  if (solution.startsWith('[') && solution.endsWith(']')) {
    const inner = solution.slice(1, -1)
    return splitByComma(inner).map(s => cleanSolution(s))
  }

  return [solution]
}
