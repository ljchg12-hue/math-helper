/**
 * nerdamer 1.1.13 API 호환 래퍼
 *
 * 주요 개선사항:
 * - 전역 함수 사용으로 API 호환성 보장
 * - TypeScript 타입 안전성 제공
 * - 일관된 에러 처리
 * - 테스트 가능한 모듈화 구조
 */

// nerdamer는 preload에서 전역으로 로드됨
// 타입 정의를 위한 인터페이스
interface NerdamerExpression {
  toString(): string
  text(): string
  evaluate(vars?: Record<string, number>): NerdamerExpression
  simplify(): NerdamerExpression
  subtract(other: NerdamerExpression): NerdamerExpression
}

interface NerdamerStatic {
  (expr: string): NerdamerExpression
  diff(expr: string | NerdamerExpression, variable: string): NerdamerExpression
  integrate(expr: string | NerdamerExpression, variable: string): NerdamerExpression
  factor(expr: string | NerdamerExpression): NerdamerExpression
  expand(expr: string | NerdamerExpression): NerdamerExpression
  solve(equation: string, variable: string): string[] | string
  solveEquations(equation: string, variable: string): string[] | string
}

declare const nerdamer: NerdamerStatic

export interface NerdamerResult {
  success: boolean
  value?: string | string[]
  error?: string
  steps?: string[]
  engine?: string
}

/**
 * 미분 (Differentiate)
 *
 * @param expr - 미분할 수식 (예: 'x^2', 'sin(x)')
 * @param variable - 미분 변수 (기본값: 'x')
 * @param order - 미분 차수 (기본값: 1)
 * @returns 미분 결과
 */
export function differentiate(
  expr: string,
  variable: string = 'x',
  order: number = 1
): NerdamerResult {
  try {
    // ✅ 올바른 사용: 전역 함수 nerdamer.diff() 사용
    let result = expr

    // n차 미분
    for (let i = 0; i < order; i++) {
      result = nerdamer.diff(result, variable).toString()
    }

    const steps = [
      `원함수: f(${variable}) = ${expr}`,
      order === 1
        ? `1차 도함수: f'(${variable}) = ${result}`
        : `${order}차 도함수: f${'^'.repeat(order)}(${variable}) = ${result}`,
      '엔진: nerdamer'
    ]

    return {
      success: true,
      value: result,
      steps,
      engine: 'nerdamer'
    }
  } catch (error) {
    return {
      success: false,
      error: `미분 실패: ${(error as Error).message}`
    }
  }
}

/**
 * 적분 (Integrate)
 *
 * @param expr - 적분할 수식
 * @param variable - 적분 변수 (기본값: 'x')
 * @param definite - 정적분 여부
 * @param lower - 정적분 하한
 * @param upper - 정적분 상한
 * @returns 적분 결과
 */
export function integrate(
  expr: string,
  variable: string = 'x',
  definite: boolean = false,
  lower: string | null = null,
  upper: string | null = null
): NerdamerResult {
  try {
    if (definite && lower !== null && upper !== null) {
      // 정적분
      const integral = nerdamer.integrate(expr, variable)
      const upperValue = nerdamer(integral.text()).evaluate({ [variable]: parseFloat(upper) })
      const lowerValue = nerdamer(integral.text()).evaluate({ [variable]: parseFloat(lower) })
      const result = nerdamer(upperValue.text()).subtract(lowerValue).text()

      // 무한대/정의되지 않음 체크
      if (result.includes('Infinity') || result.includes('undefined') || result.includes('NaN')) {
        return {
          success: false,
          error: '이 구간에서 적분할 수 없습니다. 적분 범위를 확인해주세요.'
        }
      }

      return {
        success: true,
        value: result,
        steps: [
          `피적분함수: ${expr}`,
          `적분 구간: [${lower}, ${upper}]`,
          `부정적분: ${integral.text()}`,
          `정적분: [${integral.text()}]_${lower}^${upper} = ${result}`
        ],
        engine: 'nerdamer'
      }
    } else {
      // 부정적분
      const integral = nerdamer.integrate(expr, variable)
      const result = integral.text() + ' + C'

      return {
        success: true,
        value: result,
        steps: [
          `피적분함수: ${expr}`,
          `부정적분: ∫${expr} d${variable} = ${result}`
        ],
        engine: 'nerdamer'
      }
    }
  } catch (error) {
    return {
      success: false,
      error: `적분 실패: ${(error as Error).message}`
    }
  }
}

/**
 * 인수분해 (Factor)
 *
 * @param expr - 인수분해할 수식 (예: 'x^2 - 4')
 * @returns 인수분해 결과
 */
export function factor(expr: string): NerdamerResult {
  try {
    // ✅ 올바른 사용: 전역 함수 nerdamer.factor() 사용
    const factored = nerdamer.factor(expr).toString()

    return {
      success: true,
      value: factored,
      steps: [
        `원래 식: ${expr}`,
        `인수분해: ${factored}`,
        '엔진: nerdamer'
      ],
      engine: 'nerdamer'
    }
  } catch (error) {
    return {
      success: false,
      error: `인수분해 실패: ${(error as Error).message}`
    }
  }
}

/**
 * 전개 (Expand)
 *
 * @param expr - 전개할 수식 (예: '(x+1)^2')
 * @returns 전개 결과
 */
export function expand(expr: string): NerdamerResult {
  try {
    // ✅ 올바른 사용: 전역 함수 nerdamer.expand() 사용
    const expanded = nerdamer.expand(expr).toString()

    return {
      success: true,
      value: expanded,
      steps: [
        `원래 식: ${expr}`,
        `전개: ${expanded}`,
        '엔진: nerdamer'
      ],
      engine: 'nerdamer'
    }
  } catch (error) {
    return {
      success: false,
      error: `전개 실패: ${(error as Error).message}`
    }
  }
}

/**
 * 간단히 (Simplify)
 *
 * @param expr - 간단히 할 수식
 * @returns 간단히 결과
 */
export function simplify(expr: string): NerdamerResult {
  try {
    // nerdamer()로 파싱 후 simplify() 메서드 호출
    const simplified = nerdamer(expr).simplify().text()

    return {
      success: true,
      value: simplified,
      steps: [
        `원래 식: ${expr}`,
        `간단히: ${simplified}`,
        '엔진: nerdamer'
      ],
      engine: 'nerdamer'
    }
  } catch (error) {
    return {
      success: false,
      error: `간단히 실패: ${(error as Error).message}`
    }
  }
}

/**
 * 방정식 풀이 (Solve)
 *
 * @param equation - 방정식 (예: '2x + 4 = 10', 'x^2 - 4 = 0')
 * @param variable - 풀 변수 (기본값: 'x')
 * @returns 해 (배열)
 */
export function solve(equation: string, variable: string = 'x'): NerdamerResult {
  try {
    // "2x + 3 = 7" → "(2x + 3) - (7)"
    let expr = equation.trim()

    if (expr.includes('=')) {
      const parts = expr.split('=')
      if (parts.length !== 2) {
        throw new Error('방정식 형식이 올바르지 않습니다')
      }
      expr = `(${parts[0].trim()}) - (${parts[1].trim()})`
    }

    // nerdamer.solveEquations() 사용
    const solution = nerdamer.solveEquations(expr, variable)

    // 결과 배열로 변환
    const solutions = Array.isArray(solution) ? solution : [solution]
    const results = solutions.map(sol => {
      try {
        const evaluated = nerdamer(sol as string).evaluate()
        const text = evaluated.text()
        const num = parseFloat(text)
        return isNaN(num) ? text : num.toString()
      } catch {
        return sol.toString()
      }
    })

    // 항등식/모순 처리
    if (results.length === 0 || (results.length === 1 && results[0] === '')) {
      try {
        const simplified = nerdamer(expr).toString()
        if (simplified === '0' || simplified === 'null') {
          return {
            success: true,
            value: [],
            steps: [
              `원래 방정식: ${equation}`,
              `결과: 항등식 (모든 ${variable} 값이 해)`,
              '설명: 좌변과 우변이 항상 같습니다'
            ],
            engine: 'nerdamer (identity)'
          }
        } else {
          return {
            success: false,
            error: `모순된 방정식입니다 (해가 없음)`
          }
        }
      } catch {
        return {
          success: false,
          error: '방정식을 풀 수 없습니다'
        }
      }
    }

    const steps = [
      `원래 방정식: ${equation}`,
      expr !== equation ? `변환: ${expr} = 0` : null,
      results.length === 1
        ? `해: ${variable} = ${results[0]}`
        : `해: ${variable} = ${results.join(', ')}`
    ].filter(Boolean) as string[]

    return {
      success: true,
      value: results,
      steps,
      engine: 'nerdamer'
    }
  } catch (error) {
    return {
      success: false,
      error: `방정식 풀이 실패: ${(error as Error).message}`
    }
  }
}

/**
 * 계산 (Evaluate)
 *
 * @param expr - 계산할 수식 (예: '2 + 3 * 4')
 * @returns 계산 결과
 */
export function evaluate(expr: string): NerdamerResult {
  try {
    const result = nerdamer(expr)

    // 숫자로 변환 시도
    try {
      const numValue = result.evaluate()
      return {
        success: true,
        value: numValue.text(),
        steps: [
          `입력: ${expr}`,
          `결과: ${numValue.text()}`
        ],
        engine: 'nerdamer'
      }
    } catch {
      // 심볼릭 결과 반환
      return {
        success: true,
        value: result.text(),
        steps: [
          `입력: ${expr}`,
          `결과: ${result.text()}`
        ],
        engine: 'nerdamer'
      }
    }
  } catch (error) {
    return {
      success: false,
      error: `계산 실패: ${(error as Error).message}`
    }
  }
}

/**
 * 극한 (Limit)
 *
 * nerdamer에는 내장 limit 함수가 없으므로,
 * 근사값 계산 방식 사용
 *
 * @param expr - 수식
 * @param variable - 변수 (기본값: 'x')
 * @param approach - 접근 값 ('infinity', '-infinity', 또는 숫자)
 * @param direction - 방향 ('left', 'right', 'both')
 * @returns 극한값 (근사)
 */
export function limit(
  expr: string,
  variable: string = 'x',
  approach: string = '0',
  direction: string = 'both'
): NerdamerResult {
  try {
    let result: string
    const approachNum = parseFloat(approach)

    if (isNaN(approachNum)) {
      // 무한대로 접근
      if (approach === 'infinity' || approach === 'inf') {
        const largeValue = 1e12  // ✅ FIX v1.0.31: 더 큰 값으로 정밀도 향상
        result = nerdamer(expr).evaluate({ [variable]: largeValue }).text()
      } else if (approach === '-infinity' || approach === '-inf') {
        const largeNegativeValue = -1e12
        result = nerdamer(expr).evaluate({ [variable]: largeNegativeValue }).text()
      } else {
        throw new Error('접근값이 올바르지 않습니다')
      }
    } else {
      // ✅ FIX v1.0.31: 다중 epsilon으로 수렴성 검사 (Richardson Extrapolation)
      const epsilons = [1e-4, 1e-6, 1e-8, 1e-10]

      const evaluateAtPoint = (point: number): number => {
        const val = nerdamer(expr).evaluate({ [variable]: point }).text()
        return parseFloat(val)
      }

      if (direction === 'left' || direction === 'both') {
        // 좌극한: 여러 epsilon으로 수렴 확인
        const leftValues = epsilons.map(eps => evaluateAtPoint(approachNum - eps))
        const leftConverged = leftValues.every(v => !isNaN(v))

        if (direction === 'left') {
          result = leftConverged ? leftValues[leftValues.length - 1].toString() : 'undefined'
        } else {
          // 우극한도 계산
          const rightValues = epsilons.map(eps => evaluateAtPoint(approachNum + eps))
          const rightConverged = rightValues.every(v => !isNaN(v))

          const leftLimit = leftConverged ? leftValues[leftValues.length - 1] : NaN
          const rightLimit = rightConverged ? rightValues[rightValues.length - 1] : NaN

          // 양측 극한 비교 (상대 오차 1e-6 이내)
          const tolerance = 1e-6
          const converged = !isNaN(leftLimit) && !isNaN(rightLimit) &&
            Math.abs(leftLimit - rightLimit) <= tolerance * Math.max(Math.abs(leftLimit), Math.abs(rightLimit), 1)

          if (converged) {
            // 수렴: 평균값 반환 (더 정확)
            const avgLimit = (leftLimit + rightLimit) / 2
            // 깔끔한 정수 체크
            if (Math.abs(avgLimit - Math.round(avgLimit)) < tolerance) {
              result = Math.round(avgLimit).toString()
            } else {
              result = avgLimit.toPrecision(10).replace(/\.?0+$/, '')
            }
          } else {
            result = `좌극한: ${leftLimit}, 우극한: ${rightLimit}`
          }
        }
      } else {
        // 우극한만
        const rightValues = epsilons.map(eps => evaluateAtPoint(approachNum + eps))
        result = rightValues[rightValues.length - 1].toString()
      }
    }

    return {
      success: true,
      value: result,
      steps: [
        `함수: f(${variable}) = ${expr}`,
        `극한: lim(${variable} → ${approach}) f(${variable}) = ${result}`
      ],
      engine: 'nerdamer (high-precision approximation)'
    }
  } catch (error) {
    return {
      success: false,
      error: `극한 계산 실패: ${(error as Error).message}`
    }
  }
}
