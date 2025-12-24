// ============================================
// 수학 엔진 로딩 및 에러 핸들링
// ============================================
console.log('[Preload] Starting math engine initialization...')

let math, nerdamer
let initError = null

try {
  const { contextBridge } = require('electron')
  const path = require('path')
  console.log('[Preload] Electron contextBridge loaded')

  // ✅ FIX: process.resourcesPath 사용으로 정확한 경로 참조
  // __dirname은 app.asar 내부를 가리키므로 process.resourcesPath 사용
  const resourcesPath = process.resourcesPath || path.join(__dirname, '..')
  const mathjsPath = path.join(resourcesPath, 'app.asar.unpacked/node_modules/mathjs')
  const nerdamerPath = path.join(resourcesPath, 'app.asar.unpacked/node_modules/nerdamer')

  console.log('[Preload] Resources path:', resourcesPath)
  console.log('[Preload] __dirname:', __dirname)

  console.log('[Preload] Loading mathjs from:', mathjsPath)
  const mathjs = require(mathjsPath)
  console.log('[Preload] mathjs loaded')

  console.log('[Preload] Loading nerdamer from:', nerdamerPath)
  nerdamer = require(nerdamerPath)
  console.log('[Preload] nerdamer loaded')

  require(path.join(nerdamerPath, 'Solve'))
  require(path.join(nerdamerPath, 'Algebra'))
  require(path.join(nerdamerPath, 'Calculus'))
  console.log('[Preload] nerdamer plugins loaded')

  const { create, all } = mathjs
  math = create(all)
  console.log('[Preload] Math engine initialized successfully')
} catch (error) {
  initError = error
  console.error('[Preload] Math engine initialization FAILED:', error)
  console.error('[Preload] Error stack:', error.stack)
}

// ============================================
// 0. 입력 검증 헬퍼 (보안 + 성능)
// ============================================
function validateInput(expr, maxLength = 1000) {
  // ✅ HIGH #3: 입력 길이 제한 (DoS 방지)
  if (!expr || typeof expr !== 'string') {
    throw new Error('입력이 유효하지 않습니다')
  }
  if (expr.length > maxLength) {
    throw new Error(`입력이 너무 깁니다 (최대 ${maxLength}자)`)
  }

  // ✅ HIGH #3: 위험한 문자 차단 (XSS, 코드 인젝션 방지)
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // onclick=, onerror= 등
    /eval\s*\(/i,
    /Function\s*\(/i,
    /require\s*\(/i,
    /import\s+/i,
    /export\s+/i
  ]

  for (const pattern of dangerousPatterns) {
    if (pattern.test(expr)) {
      throw new Error('허용되지 않는 문자가 포함되어 있습니다')
    }
  }

  // ✅ MEDIUM #7: 복잡도 제한 (성능 최적화)
  const trimmed = expr.trim()
  const complexity = (trimmed.match(/[\+\-\*\/\^\(\)]/g) || []).length
  if (complexity > 200) {
    throw new Error('수식이 너무 복잡합니다. 더 간단한 수식으로 나누어 계산해주세요.')
  }

  return trimmed
}

// ============================================
// 1. 범용 계산 (MathJS)
// ============================================
function evaluateExpression(expr) {
  try {
    // ✅ HIGH #3: 입력 검증
    expr = validateInput(expr)

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
        error: '계산 결과가 너무 크거나 정의되지 않습니다. 수식을 확인해주세요.'
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
    // ✅ MEDIUM #6: 사용자 친화적 에러 메시지
    const userMessage = error.message
      .replace(/Invalid left hand side of assignment operator/i, '등호(=)는 방정식 모드에서만 사용할 수 있습니다')
      .replace(/Unexpected token/i, '수식 형식이 올바르지 않습니다')
      .replace(/Undefined symbol/i, '알 수 없는 기호가 포함되어 있습니다')
      .replace(/Dimension mismatch/i, '행렬 크기가 맞지 않습니다')

    return {
      success: false,
      error: userMessage.length > 100 ? '계산할 수 없습니다. 수식을 확인해주세요.' : userMessage
    }
  }
}

// ============================================
// 2. 방정식 풀이 (Nerdamer)
// ============================================
function solveEquation(equation, variable = 'x') {
  try {
    // ✅ HIGH #3: 입력 검증
    equation = validateInput(equation)
    variable = validateInput(variable, 1) // 변수명은 1글자만

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

    // ✅ HIGH #1: 항등식/모순 처리
    if (results.length === 0 || (results.length === 1 && results[0] === '')) {
      // 빈 해 → 항등식 또는 모순 판단
      try {
        // 좌변 = 우변인지 확인 (항등식)
        const simplified = nerdamer(expr).toString()
        if (simplified === '0' || simplified === 'null') {
          return {
            success: true,
            solutions: [],
            variable,
            original: equation,
            steps: [
              `원래 방정식: ${equation}`,
              `결과: 항등식 (모든 ${variable} 값이 해)`,
              '설명: 좌변과 우변이 항상 같습니다'
            ],
            isIdentity: true
          }
        } else {
          return {
            success: false,
            error: `모순된 방정식입니다 (해가 없음)`,
            isContradiction: true
          }
        }
      } catch {
        return {
          success: false,
          error: '방정식을 풀 수 없습니다'
        }
      }
    }

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
    // ✅ HIGH #3: 입력 검증 추가
    expr = validateInput(expr)
    variable = validateInput(variable, 10)

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
    // ✅ HIGH #3: 입력 검증 추가
    expr = validateInput(expr)
    variable = validateInput(variable, 10)

    // ✅ Phase 2 Item 17: Check for common divergent integrals
    const exprLower = expr.toLowerCase()
    if (exprLower.includes('1/x') && definite && lower !== null && upper !== null) {
      const lowerNum = parseFloat(lower)
      const upperNum = parseFloat(upper)
      if ((lowerNum <= 0 && upperNum >= 0) || lowerNum === 0 || upperNum === 0) {
        return {
          success: false,
          error: '0을 포함하는 구간에서는 1/x를 적분할 수 없습니다.'
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
          error: '이 구간에서 적분할 수 없습니다. 적분 범위를 확인해주세요.'
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
    // ✅ HIGH #3: 입력 검증 추가
    expr = validateInput(expr)

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
    // ✅ HIGH #3: 입력 검증 추가
    expr = validateInput(expr)

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
    // ✅ HIGH #3: 입력 검증 추가
    expr = validateInput(expr)

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
    // ✅ HIGH #3: operation 파라미터 검증 추가
    if (typeof operation !== 'string' || operation.length > 50) {
      throw new Error('잘못된 연산 유형입니다')
    }

    // ✅ 배열 검증 추가
    if (!Array.isArray(matrixA) || matrixA.length === 0) {
      throw new Error('행렬 A가 유효하지 않습니다')
    }

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
    // ✅ HIGH #3: 배열 검증 강화
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('데이터를 입력하세요')
    }

    // ✅ DoS 방지: 최대 데이터 개수 제한
    if (data.length > 10000) {
      throw new Error('데이터가 너무 많습니다 (최대 10000개)')
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
    // ✅ HIGH #3: 입력 검증 추가
    expr = validateInput(expr)
    variable = validateInput(variable, 10)

    // Nerdamer는 극한을 직접 지원하지 않으므로 근사값 계산
    let result
    const approachNum = parseFloat(approach)

    if (isNaN(approachNum)) {
      // 무한대로 접근
      if (approach === 'infinity' || approach === 'inf') {
        // ✅ HIGH #2: 무한대 근사값 정확도 개선 (1000000 → 1e9)
        const largeValue = 1e9
        result = nerdamer(expr).evaluate({[variable]: largeValue}).text()
      } else if (approach === '-infinity' || approach === '-inf') {
        // ✅ MEDIUM #5: 음수 무한대 지원 추가
        const largeNegativeValue = -1e9
        result = nerdamer(expr).evaluate({[variable]: largeNegativeValue}).text()
      } else {
        throw new Error('접근값이 올바르지 않습니다')
      }
    } else {
      // ✅ HIGH #2: epsilon 정확도 개선 (0.0001 → 1e-6)
      const epsilon = 1e-6

      if (direction === 'left' || direction === 'both') {
        const leftVal = nerdamer(expr).evaluate({[variable]: approachNum - epsilon}).text()
        if (direction === 'left') {
          result = leftVal
        } else {
          const rightVal = nerdamer(expr).evaluate({[variable]: approachNum + epsilon}).text()
          // ✅ HIGH #2: 좌우극한 비교 시 부동소수점 오차 고려
          const leftNum = parseFloat(leftVal)
          const rightNum = parseFloat(rightVal)
          const converged = !isNaN(leftNum) && !isNaN(rightNum) && Math.abs(leftNum - rightNum) < epsilon * 10
          result = converged ? leftVal : `좌극한: ${leftVal}, 우극한: ${rightVal}`
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
try {
  const { contextBridge } = require('electron')

  if (initError) {
    // 초기화 실패 시 에러 함수 제공
    console.error('[Preload] Exposing error handlers due to init failure')
    contextBridge.exposeInMainWorld('mathAPI', {
      evaluate: () => ({ success: false, error: `수학 엔진 로드 실패: ${initError.message}` }),
      solve: () => ({ success: false, error: `수학 엔진 로드 실패: ${initError.message}` }),
      simplify: () => ({ success: false, error: `수학 엔진 로드 실패: ${initError.message}` }),
      factor: () => ({ success: false, error: `수학 엔진 로드 실패: ${initError.message}` }),
      expand: () => ({ success: false, error: `수학 엔진 로드 실패: ${initError.message}` }),
      differentiate: () => ({ success: false, error: `수학 엔진 로드 실패: ${initError.message}` }),
      integrate: () => ({ success: false, error: `수학 엔진 로드 실패: ${initError.message}` }),
      limit: () => ({ success: false, error: `수학 엔진 로드 실패: ${initError.message}` }),
      matrix: () => ({ success: false, error: `수학 엔진 로드 실패: ${initError.message}` }),
      statistics: () => ({ success: false, error: `수학 엔진 로드 실패: ${initError.message}` })
    })
  } else {
    // 정상 초기화 시 실제 함수 제공
    console.log('[Preload] Exposing mathAPI to main world')
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
    console.log('[Preload] mathAPI exposed successfully')
  }
} catch (error) {
  console.error('[Preload] Failed to expose mathAPI:', error)
}
