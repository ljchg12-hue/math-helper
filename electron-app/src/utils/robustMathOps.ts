/**
 * nerdamer 실패 시 mathjs로 폴백하는 안전한 연산
 *
 * 이 모듈은 두 가지 수학 엔진을 조합하여 최대한의 호환성을 제공합니다:
 * 1. nerdamer - 심볼릭 연산에 강력 (미분, 적분, 인수분해 등)
 * 2. mathjs - 수치 연산에 강력 (계산, 간단히 등)
 *
 * 폴백 전략:
 * - 1차 시도: nerdamer (더 강력한 심볼릭 연산)
 * - 2차 시도: mathjs (수치 연산 및 간단히)
 */

import * as nerdamerOps from './nerdamerOps'
import * as math from 'mathjs'
import { analyzeVariables, VariableAnalysis } from './variableAnalyzer'
import { solveParametric, ParametricSolution } from './parametricSolver'

export interface RobustResult {
  success: boolean
  value: string | string[]
  steps?: string[]
  engine: 'nerdamer' | 'mathjs' | 'both'
  warnings?: string[]
  metadata?: {
    isParametric?: boolean
    generalSolution?: string
    specificSolution?: string
    parameters?: string[]
    variableAnalysis?: VariableAnalysis
    parametricResult?: ParametricSolution
  }
}

/**
 * 안전한 미분 (nerdamer → mathjs 폴백)
 */
export function safeDifferentiate(
  expr: string,
  variable: string = 'x',
  order: number = 1
): RobustResult {
  // 1차 시도: nerdamer
  const nerdamerResult = nerdamerOps.differentiate(expr, variable, order)
  if (nerdamerResult.success && nerdamerResult.value) {
    return {
      success: true,
      value: nerdamerResult.value as string,
      steps: nerdamerResult.steps,
      engine: 'nerdamer'
    }
  }

  console.warn('nerdamer 미분 실패, mathjs로 폴백:', nerdamerResult.error)

  // 2차 시도: mathjs
  try {
    let parsed = math.parse(expr)

    for (let i = 0; i < order; i++) {
      parsed = math.derivative(parsed, variable)
    }

    const result = parsed.toString()

    return {
      success: true,
      value: result,
      steps: [
        `원함수: f(${variable}) = ${expr}`,
        order === 1
          ? `1차 도함수: f'(${variable}) = ${result}`
          : `${order}차 도함수: f${'^'.repeat(order)}(${variable}) = ${result}`,
        '엔진: mathjs (폴백)'
      ],
      engine: 'mathjs',
      warnings: [`nerdamer 실패: ${nerdamerResult.error}`]
    }
  } catch (mathjsError) {
    throw new Error(
      `미분 계산 실패.\n` +
      `nerdamer: ${nerdamerResult.error}\n` +
      `mathjs: ${(mathjsError as Error).message}`
    )
  }
}

/**
 * 안전한 적분 (nerdamer만 지원, mathjs는 미지원)
 */
export function safeIntegrate(
  expr: string,
  variable: string = 'x',
  definite: boolean = false,
  lower: string | null = null,
  upper: string | null = null
): RobustResult {
  const nerdamerResult = nerdamerOps.integrate(expr, variable, definite, lower, upper)
  if (nerdamerResult.success && nerdamerResult.value) {
    return {
      success: true,
      value: nerdamerResult.value as string,
      steps: nerdamerResult.steps,
      engine: 'nerdamer'
    }
  }

  // mathjs는 적분을 지원하지 않음
  throw new Error(`적분 계산 실패: ${nerdamerResult.error}`)
}

/**
 * 안전한 인수분해 (nerdamer → mathjs simplify 폴백)
 */
export function safeFactor(expr: string): RobustResult {
  const nerdamerResult = nerdamerOps.factor(expr)
  if (nerdamerResult.success && nerdamerResult.value) {
    return {
      success: true,
      value: nerdamerResult.value as string,
      steps: nerdamerResult.steps,
      engine: 'nerdamer'
    }
  }

  console.warn('nerdamer 인수분해 실패, mathjs simplify로 폴백:', nerdamerResult.error)

  // mathjs는 factor 함수를 제공하지 않으므로 simplify 사용
  try {
    const parsed = math.parse(expr)
    const simplified = math.simplify(parsed).toString()

    return {
      success: true,
      value: simplified,
      steps: [
        `원래 식: ${expr}`,
        `간단히 (인수분해 대체): ${simplified}`,
        '엔진: mathjs (폴백 - simplify 사용)'
      ],
      engine: 'mathjs',
      warnings: [
        `nerdamer 실패: ${nerdamerResult.error}`,
        'mathjs는 인수분해를 지원하지 않아 simplify로 대체했습니다'
      ]
    }
  } catch (mathjsError) {
    throw new Error(
      `인수분해 실패.\n` +
      `nerdamer: ${nerdamerResult.error}\n` +
      `mathjs: ${(mathjsError as Error).message}`
    )
  }
}

/**
 * 안전한 전개 (nerdamer → mathjs simplify 폴백)
 */
export function safeExpand(expr: string): RobustResult {
  const nerdamerResult = nerdamerOps.expand(expr)
  if (nerdamerResult.success && nerdamerResult.value) {
    return {
      success: true,
      value: nerdamerResult.value as string,
      steps: nerdamerResult.steps,
      engine: 'nerdamer'
    }
  }

  console.warn('nerdamer 전개 실패, mathjs simplify로 폴백:', nerdamerResult.error)

  try {
    const parsed = math.parse(expr)
    const expanded = math.simplify(parsed, {}, { exactFractions: false }).toString()

    return {
      success: true,
      value: expanded,
      steps: [
        `원래 식: ${expr}`,
        `전개 (simplify 사용): ${expanded}`,
        '엔진: mathjs (폴백)'
      ],
      engine: 'mathjs',
      warnings: [`nerdamer 실패: ${nerdamerResult.error}`]
    }
  } catch (mathjsError) {
    throw new Error(
      `전개 실패.\n` +
      `nerdamer: ${nerdamerResult.error}\n` +
      `mathjs: ${(mathjsError as Error).message}`
    )
  }
}

/**
 * 안전한 간단히 (nerdamer → mathjs 폴백)
 */
export function safeSimplify(expr: string): RobustResult {
  const nerdamerResult = nerdamerOps.simplify(expr)
  if (nerdamerResult.success && nerdamerResult.value) {
    return {
      success: true,
      value: nerdamerResult.value as string,
      steps: nerdamerResult.steps,
      engine: 'nerdamer'
    }
  }

  console.warn('nerdamer 간단히 실패, mathjs로 폴백:', nerdamerResult.error)

  try {
    const parsed = math.parse(expr)
    const simplified = math.simplify(parsed).toString()

    return {
      success: true,
      value: simplified,
      steps: [
        `원래 식: ${expr}`,
        `간단히: ${simplified}`,
        '엔진: mathjs (폴백)'
      ],
      engine: 'mathjs',
      warnings: [`nerdamer 실패: ${nerdamerResult.error}`]
    }
  } catch (mathjsError) {
    throw new Error(
      `간단히 실패.\n` +
      `nerdamer: ${nerdamerResult.error}\n` +
      `mathjs: ${(mathjsError as Error).message}`
    )
  }
}

/**
 * 안전한 방정식 풀이 (단일 변수 + 다중 변수 지원)
 *
 * @param equation - 풀이할 방정식
 * @param options - 옵션
 * @param options.targetVariable - 풀이 대상 변수 (옵션, 자동 감지)
 * @param options.parameterValues - 파라미터 값 (옵션)
 * @returns 풀이 결과
 *
 * @example
 * // 단일 변수 (기존 방식 호환)
 * safeSolve("2*x + 5 = 10")
 * // → { value: ["2.5"], ... }
 *
 * @example
 * // 다중 변수 일반 해
 * safeSolve("x = (-b + sqrt(b^2 - 4*a*c)) / (2*a)")
 * // → { value: ["(-b + sqrt(b^2 - 4*a*c)) / (2*a)"], metadata: { isParametric: true, ... } }
 *
 * @example
 * // 다중 변수 구체적 해
 * safeSolve("x = (-b + sqrt(b^2 - 4*a*c)) / (2*a)", {
 *   targetVariable: "x",
 *   parameterValues: { a: "1", b: "-5", c: "6" }
 * })
 * // → { value: ["3"], metadata: { isParametric: true, specificSolution: "3", ... } }
 */
export function safeSolve(
  equation: string,
  options: {
    targetVariable?: string
    parameterValues?: Record<string, string>
  } | string = {}
): RobustResult {
  // 하위 호환성: 기존 API (equation, variable) 지원
  let targetVariable: string | undefined
  let parameterValues: Record<string, string> = {}

  if (typeof options === 'string') {
    // 기존 방식: safeSolve(equation, variable)
    targetVariable = options
  } else {
    // 신규 방식: safeSolve(equation, { targetVariable, parameterValues })
    targetVariable = options.targetVariable
    parameterValues = options.parameterValues || {}
  }

  // 변수 분석
  const variableAnalysis = analyzeVariables(equation, targetVariable)

  // 상수 방정식 (변수 없음)
  if (variableAnalysis.isConstant) {
    throw new Error('등호가 없어 방정식을 풀 수 없습니다. 방정식 풀이 모드에서는 등호(=)가 필요합니다.')
  }

  // 다중 변수 방정식 감지
  if (variableAnalysis.hasMultipleVars) {
    console.log('다중 변수 방정식 감지:', variableAnalysis)

    // parametricSolver 사용
    const parametricResult = solveParametric(
      equation,
      targetVariable || variableAnalysis.primaryVariable,
      parameterValues
    )

    if (!parametricResult.success) {
      throw new Error(parametricResult.error || '파라미터 방정식 풀이 실패')
    }

    // 결과 값 결정: 구체적 해 우선, 없으면 일반 해
    const resultValue = parametricResult.specificSolution || parametricResult.generalSolution

    // Steps 생성
    const steps: string[] = []

    if (parametricResult.specificSolution) {
      // 구체적 해가 있는 경우
      steps.push(`원방정식: ${equation}`)
      steps.push(`변수: ${parametricResult.variable}`)
      steps.push(`일반 해: ${parametricResult.variable} = ${parametricResult.generalSolution}`)

      if (parametricResult.substitutions) {
        const subStr = Object.entries(parametricResult.substitutions)
          .map(([k, v]) => `${k} = ${v}`)
          .join(', ')
        steps.push(`파라미터 대입: ${subStr}`)
      }

      steps.push(`구체적 해: ${parametricResult.variable} = ${parametricResult.specificSolution}`)
    } else {
      // 일반 해만 있는 경우
      steps.push(`원방정식: ${equation}`)
      steps.push(`변수: ${parametricResult.variable}`)
      steps.push(`파라미터: ${variableAnalysis.parameters.join(', ')}`)
      steps.push(`일반 해: ${parametricResult.variable} = ${parametricResult.generalSolution}`)
      steps.push('💡 파라미터 값을 입력하면 구체적인 해를 계산할 수 있습니다.')
    }

    return {
      success: true,
      value: [resultValue],
      steps,
      engine: 'nerdamer',
      metadata: {
        isParametric: true,
        generalSolution: parametricResult.generalSolution,
        specificSolution: parametricResult.specificSolution,
        parameters: variableAnalysis.parameters,
        variableAnalysis,
        parametricResult
      }
    }
  }

  // 단일 변수 방정식 (기존 로직)
  const nerdamerResult = nerdamerOps.solve(
    equation,
    targetVariable || variableAnalysis.primaryVariable
  )

  if (nerdamerResult.success && nerdamerResult.value) {
    const value = Array.isArray(nerdamerResult.value)
      ? nerdamerResult.value
      : [nerdamerResult.value]

    return {
      success: true,
      value,
      steps: nerdamerResult.steps,
      engine: 'nerdamer',
      metadata: {
        isParametric: false,
        variableAnalysis
      }
    }
  }

  // mathjs의 solve는 제한적이므로 nerdamer 에러만 전달
  throw new Error(`방정식 풀이 실패: ${nerdamerResult.error}`)
}

/**
 * 안전한 계산 (nerdamer → mathjs 폴백)
 */
export function safeEvaluate(expr: string): RobustResult {
  // nerdamer는 심볼릭 연산에 특화되어 있고,
  // mathjs는 수치 계산에 특화되어 있으므로
  // 여기서는 mathjs를 우선 사용하는 것이 더 적절함

  try {
    const result = math.evaluate(expr)
    const resultStr = typeof result === 'number'
      ? result.toFixed(6).replace(/\.?0+$/, '')
      : result.toString()

    return {
      success: true,
      value: resultStr,
      steps: [
        `입력: ${expr}`,
        `결과: ${resultStr}`
      ],
      engine: 'mathjs'
    }
  } catch (mathjsError) {
    console.warn('mathjs 계산 실패, nerdamer로 폴백:', (mathjsError as Error).message)

    // 폴백: nerdamer
    const nerdamerResult = nerdamerOps.evaluate(expr)
    if (nerdamerResult.success && nerdamerResult.value) {
      return {
        success: true,
        value: nerdamerResult.value as string,
        steps: nerdamerResult.steps,
        engine: 'nerdamer',
        warnings: [`mathjs 실패: ${(mathjsError as Error).message}`]
      }
    }

    throw new Error(
      `계산 실패.\n` +
      `mathjs: ${(mathjsError as Error).message}\n` +
      `nerdamer: ${nerdamerResult.error}`
    )
  }
}

/**
 * 안전한 극한 (nerdamer만 지원)
 */
export function safeLimit(
  expr: string,
  variable: string = 'x',
  approach: string = '0',
  direction: string = 'both'
): RobustResult {
  const nerdamerResult = nerdamerOps.limit(expr, variable, approach, direction)
  if (nerdamerResult.success && nerdamerResult.value) {
    return {
      success: true,
      value: nerdamerResult.value as string,
      steps: nerdamerResult.steps,
      engine: 'nerdamer'
    }
  }

  // mathjs는 극한 계산을 직접 지원하지 않음
  throw new Error(`극한 계산 실패: ${nerdamerResult.error}`)
}

/**
 * 성능 통계 (옵션)
 *
 * 각 엔진의 성공률을 추적하여 최적화에 활용
 */
export class PerformanceStats {
  private nerdamerSuccess: number = 0
  private nerdamerFail: number = 0
  private mathjsSuccess: number = 0
  private mathjsFail: number = 0

  recordNerdamer(success: boolean) {
    if (success) {
      this.nerdamerSuccess++
    } else {
      this.nerdamerFail++
    }
  }

  recordMathjs(success: boolean) {
    if (success) {
      this.mathjsSuccess++
    } else {
      this.mathjsFail++
    }
  }

  getStats() {
    const nerdamerTotal = this.nerdamerSuccess + this.nerdamerFail
    const mathjsTotal = this.mathjsSuccess + this.mathjsFail

    return {
      nerdamer: {
        total: nerdamerTotal,
        success: this.nerdamerSuccess,
        fail: this.nerdamerFail,
        successRate: nerdamerTotal > 0 ? (this.nerdamerSuccess / nerdamerTotal * 100).toFixed(1) : '0.0'
      },
      mathjs: {
        total: mathjsTotal,
        success: this.mathjsSuccess,
        fail: this.mathjsFail,
        successRate: mathjsTotal > 0 ? (this.mathjsSuccess / mathjsTotal * 100).toFixed(1) : '0.0'
      }
    }
  }

  reset() {
    this.nerdamerSuccess = 0
    this.nerdamerFail = 0
    this.mathjsSuccess = 0
    this.mathjsFail = 0
  }
}

// 전역 통계 인스턴스 (옵션)
export const globalStats = new PerformanceStats()
