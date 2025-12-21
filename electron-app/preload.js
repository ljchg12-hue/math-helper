const { contextBridge } = require('electron')
const { create, all } = require('mathjs')
const nerdamer = require('nerdamer')
require('nerdamer/Solve')
require('nerdamer/Algebra')
require('nerdamer/Calculus')

const math = create(all)

// ============================================
// 1. 범용 계산 (MathJS)
// ============================================
function evaluateExpression(expr) {
  try {
    // ✅ Phase 2 Items 13-14: Edge case validation
    const exprLower = expr.toLowerCase()

    // Trigonometry edge cases
    if (exprLower.match(/tan\s*\(\s*90\s*\)/) || exprLower.match(/tan\s*\(\s*pi\s*\/\s*2\s*\)/)) {
      return {
        success: false,
        error: 'tan(90°) 또는 tan(π/2)는 정의되지 않습니다'
      }
    }
    if (exprLower.match(/tan\s*\(\s*270\s*\)/) || exprLower.match(/tan\s*\(\s*3\s*\*\s*pi\s*\/\s*2\s*\)/)) {
      return {
        success: false,
        error: 'tan(270°) 또는 tan(3π/2)는 정의되지 않습니다'
      }
    }

    // Logarithm edge cases
    if (exprLower.match(/log\s*\(\s*0\s*\)/) || exprLower.match(/ln\s*\(\s*0\s*\)/)) {
      return {
        success: false,
        error: 'log(0) 또는 ln(0)은 정의되지 않습니다'
      }
    }
    if (exprLower.match(/log\s*\(\s*-/) || exprLower.match(/ln\s*\(\s*-/)) {
      return {
        success: false,
        error: '음수의 로그는 정의되지 않습니다'
      }
    }

    const result = math.evaluate(expr)

    // Check for NaN or Infinity
    if (typeof result === 'number' && (!isFinite(result) || isNaN(result))) {
      return {
        success: false,
        error: '계산 결과가 유효하지 않습니다 (무한대 또는 NaN)'
      }
    }

    // ✅ Phase 2 Item 15: Zero vector handling
    if (result && typeof result === 'object' && Array.isArray(result)) {
      const isZeroVector = result.every(x => x === 0)
      if (isZeroVector && (exprLower.includes('cross') || exprLower.includes('외적'))) {
        return {
          success: false,
          error: '영벡터는 외적을 정의할 수 없습니다'
        }
      }
    }

    // ✅ Phase 2 Item 16: Complex number division by zero
    if (result && typeof result === 'object' && result.re !== undefined && result.im !== undefined) {
      if (!isFinite(result.re) || !isFinite(result.im)) {
        return {
          success: false,
          error: '복소수 계산에서 0으로 나눌 수 없습니다'
        }
      }
    }

    const resultStr = typeof result === 'number'
      ? result.toFixed(6).replace(/\.?0+$/, '')
      : result.toString()

    return {
      success: true,
      result: resultStr,
      original: expr,
      steps: [
        `입력: ${expr}`,
        `결과: ${resultStr}`
      ]
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

// ============================================
// 2. 방정식 풀이 (Nerdamer)
// ============================================
function solveEquation(equation, variable = 'x') {
  try {
    // "2x + 3 = 7" → "2x + 3 - (7)"
    let expr = equation.trim()

    if (expr.includes('=')) {
      const parts = expr.split('=')
      if (parts.length !== 2) {
        throw new Error('방정식 형식이 올바르지 않습니다')
      }
      expr = `(${parts[0].trim()}) - (${parts[1].trim()})`
    }

    // Nerdamer로 풀이
    const solution = nerdamer.solveEquations(expr, variable)

    // 결과 배열로 변환
    const solutions = Array.isArray(solution) ? solution : [solution]
    const results = solutions.map(sol => {
      try {
        const evaluated = nerdamer(sol).evaluate()
        const text = evaluated.text()
        const num = parseFloat(text)
        return isNaN(num) ? text : num
      } catch {
        return sol.toString()
      }
    })

    // 풀이 과정 생성
    const steps = [
      `원래 방정식: ${equation}`,
      expr !== equation ? `변환: ${expr} = 0` : null,
      results.length === 1
        ? `해: ${variable} = ${results[0]}`
        : `해: ${variable} = ${results.join(', ')}`
    ].filter(Boolean)

    return {
      success: true,
      solutions: results,
      variable,
      original: equation,
      steps
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || '방정식을 풀 수 없습니다'
    }
  }
}

// ============================================
// 3. 미분 (Nerdamer)
// ============================================
function differentiate(expr, variable = 'x', order = 1) {
  try {
    let result = nerdamer(expr)

    // n차 미분
    for (let i = 0; i < order; i++) {
      result = result.differentiate(variable)
    }

    const simplified = result.text()

    const steps = [
      `원함수: f(${variable}) = ${expr}`,
      order === 1
        ? `1차 도함수: f'(${variable}) = ${simplified}`
        : `${order}차 도함수: f${'^'.repeat(order)}(${variable}) = ${simplified}`
    ]

    return {
      success: true,
      result: simplified,
      original: expr,
      variable,
      order,
      steps
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || '미분할 수 없습니다'
    }
  }
}

// ============================================
// 4. 적분 (Nerdamer)
// ============================================
function integrate(expr, variable = 'x', definite = false, lower = null, upper = null) {
  try {
    // ✅ Phase 2 Item 17: Check for common divergent integrals
    const exprLower = expr.toLowerCase()
    if (exprLower.includes('1/x') && definite && lower !== null && upper !== null) {
      const lowerNum = parseFloat(lower)
      const upperNum = parseFloat(upper)
      if ((lowerNum <= 0 && upperNum >= 0) || lowerNum === 0 || upperNum === 0) {
        return {
          success: false,
          error: '∫1/x는 0을 포함하는 구간에서 발산합니다'
        }
      }
    }

    if (definite && lower !== null && upper !== null) {
      // 정적분
      const integral = nerdamer.integrate(expr, variable)
      const upperValue = nerdamer(integral.text()).evaluate({[variable]: upper})
      const lowerValue = nerdamer(integral.text()).evaluate({[variable]: lower})
      const result = nerdamer(upperValue).subtract(lowerValue).text()

      // ✅ Phase 2 Item 17: Check for infinite or undefined results
      if (result.includes('Infinity') || result.includes('undefined') || result.includes('NaN')) {
        return {
          success: false,
          error: '적분이 발산하거나 정의되지 않습니다'
        }
      }

      return {
        success: true,
        result,
        definite: true,
        bounds: [lower, upper],
        steps: [
          `피적분함수: ${expr}`,
          `적분 구간: [${lower}, ${upper}]`,
          `부정적분: ${integral.text()}`,
          `정적분: [${integral.text()}]_${lower}^${upper} = ${result}`
        ]
      }
    } else {
      // 부정적분
      const integral = nerdamer.integrate(expr, variable)
      const result = integral.text() + ' + C'

      return {
        success: true,
        result,
        definite: false,
        steps: [
          `피적분함수: ${expr}`,
          `부정적분: ∫${expr} d${variable} = ${result}`
        ]
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || '적분할 수 없습니다'
    }
  }
}

// ============================================
// 5. 식 간단히
// ============================================
function simplifyExpression(expr) {
  try {
    const simplified = nerdamer(expr).simplify().text()

    return {
      success: true,
      result: simplified,
      original: expr,
      steps: [
        `원래 식: ${expr}`,
        `간단히: ${simplified}`
      ]
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

// ============================================
// 6. 인수분해
// ============================================
function factorExpression(expr) {
  try {
    const factored = nerdamer(expr).factor().text()

    return {
      success: true,
      result: factored,
      original: expr,
      steps: [
        `원래 식: ${expr}`,
        `인수분해: ${factored}`
      ]
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

// ============================================
// 7. 전개
// ============================================
function expandExpression(expr) {
  try {
    const expanded = nerdamer(expr).expand().text()

    return {
      success: true,
      result: expanded,
      original: expr,
      steps: [
        `원래 식: ${expr}`,
        `전개: ${expanded}`
      ]
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

// ============================================
// 8. 행렬 연산
// ============================================
function matrixCalculate(operation, matrixA, matrixB = null) {
  try {
    const A = math.matrix(matrixA)
    let result
    let steps = []

    switch (operation) {
      case 'det':
        result = math.det(A)
        steps = [
          '행렬식 계산',
          `det(A) = ${result}`
        ]
        break

      case 'inv':
        result = math.inv(A).toArray()
        steps = ['역행렬 계산 완료']
        break

      case 'transpose':
        result = math.transpose(A).toArray()
        steps = ['전치행렬 계산 완료']
        break

      case 'add':
        if (!matrixB) throw new Error('두 번째 행렬이 필요합니다')
        result = math.add(A, math.matrix(matrixB)).toArray()
        steps = ['행렬 덧셈 완료']
        break

      case 'subtract':
        if (!matrixB) throw new Error('두 번째 행렬이 필요합니다')
        result = math.subtract(A, math.matrix(matrixB)).toArray()
        steps = ['행렬 뺄셈 완료']
        break

      case 'multiply':
        if (!matrixB) throw new Error('두 번째 행렬이 필요합니다')
        result = math.multiply(A, math.matrix(matrixB)).toArray()
        steps = ['행렬 곱셈 완료']
        break

      case 'eigenvalues':
        const eigs = math.eigs(A)
        result = eigs.values.toArray()
        steps = ['고유값 계산 완료']
        break

      default:
        throw new Error('지원하지 않는 연산입니다')
    }

    return {
      success: true,
      result,
      operation,
      steps
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

// ============================================
// 9. 통계 계산
// ============================================
function calculateStatistics(data) {
  try {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('데이터를 입력하세요')
    }

    const numbers = data.map(x => parseFloat(x)).filter(x => !isNaN(x))
    if (numbers.length === 0) {
      throw new Error('유효한 숫자가 없습니다')
    }

    const mean = math.mean(numbers)
    const median = math.median(numbers)
    const std = math.std(numbers)
    const variance = math.variance(numbers)
    const min = math.min(numbers)
    const max = math.max(numbers)

    return {
      success: true,
      result: {
        mean: mean.toFixed(4),
        median: median.toFixed(4),
        std: std.toFixed(4),
        variance: variance.toFixed(4),
        min,
        max,
        count: numbers.length
      },
      steps: [
        `데이터 개수: ${numbers.length}`,
        `평균: ${mean.toFixed(4)}`,
        `중앙값: ${median.toFixed(4)}`,
        `표준편차: ${std.toFixed(4)}`,
        `분산: ${variance.toFixed(4)}`,
        `최솟값: ${min}, 최댓값: ${max}`
      ]
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

// ============================================
// 10. 극한
// ============================================
function calculateLimit(expr, variable, approach, direction = 'both') {
  try {
    // Nerdamer는 극한을 직접 지원하지 않으므로 근사값 계산
    let result
    const approachNum = parseFloat(approach)

    if (isNaN(approachNum)) {
      // 무한대로 접근
      if (approach === 'infinity' || approach === 'inf') {
        // x → ∞일 때 근사
        const largeValue = 1000000
        result = nerdamer(expr).evaluate({[variable]: largeValue}).text()
      } else {
        throw new Error('접근값이 올바르지 않습니다')
      }
    } else {
      // 특정 값으로 접근
      const epsilon = 0.0001

      if (direction === 'left' || direction === 'both') {
        const leftVal = nerdamer(expr).evaluate({[variable]: approachNum - epsilon}).text()
        if (direction === 'left') {
          result = leftVal
        } else {
          const rightVal = nerdamer(expr).evaluate({[variable]: approachNum + epsilon}).text()
          result = leftVal === rightVal ? leftVal : `좌극한: ${leftVal}, 우극한: ${rightVal}`
        }
      } else {
        result = nerdamer(expr).evaluate({[variable]: approachNum + epsilon}).text()
      }
    }

    return {
      success: true,
      result,
      steps: [
        `함수: f(${variable}) = ${expr}`,
        `극한: lim(${variable} → ${approach}) f(${variable}) = ${result}`
      ]
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

// ============================================
// contextBridge로 노출
// ============================================
contextBridge.exposeInMainWorld('mathAPI', {
  // 기본 계산
  evaluate: evaluateExpression,

  // 방정식/식 조작
  solve: solveEquation,
  simplify: simplifyExpression,
  factor: factorExpression,
  expand: expandExpression,

  // 미적분
  differentiate,
  integrate,
  limit: calculateLimit,

  // 행렬
  matrix: matrixCalculate,

  // 통계
  statistics: calculateStatistics
})
