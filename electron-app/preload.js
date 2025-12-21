const { contextBridge } = require('electron')

// 일차방정식
function solveLinear(a, b) {
  if (a === 0) {
    throw new Error('a는 0이 될 수 없습니다')
  }

  const x = -b / a
  const steps = [
    `주어진 방정식: ${a}x + ${b} = 0`,
    `${a}x = ${-b}`,
    `x = ${-b} ÷ ${a}`,
    `∴ x = ${x.toFixed(4)}`
  ]

  return { x, steps }
}

// 이차방정식
function solveQuadratic(a, b, c) {
  if (a === 0) {
    throw new Error('a는 0이 될 수 없습니다')
  }

  const d = b * b - 4 * a * c

  let steps = [
    `주어진 방정식: ${a}x² + ${b}x + ${c} = 0`,
    `판별식 D = b² - 4ac = ${d.toFixed(4)}`
  ]

  if (d < 0) {
    steps.push('D < 0이므로 실근이 없습니다')
    return {
      has_real_roots: false,
      x1: null,
      x2: null,
      discriminant: d,
      steps
    }
  } else if (d === 0) {
    const x = -b / (2 * a)
    steps.push('D = 0이므로 중근입니다')
    steps.push(`x = -b / 2a = ${x.toFixed(4)}`)
    return {
      has_real_roots: true,
      x1: x,
      x2: x,
      discriminant: d,
      steps
    }
  } else {
    const sqrt_d = Math.sqrt(d)
    const x1 = (-b + sqrt_d) / (2 * a)
    const x2 = (-b - sqrt_d) / (2 * a)
    steps.push('D > 0이므로 서로 다른 두 실근이 존재합니다')
    steps.push('x = (-b ± √D) / 2a')
    steps.push(`∴ x₁ = ${x1.toFixed(4)}, x₂ = ${x2.toFixed(4)}`)
    return {
      has_real_roots: true,
      x1,
      x2,
      discriminant: d,
      steps
    }
  }
}

// 기하 계산 - 피타고라스 정리
function pythagorean(a, b, c) {
  const steps = ['피타고라스 정리: a² + b² = c²']

  // c를 구하는 경우
  if (a !== null && b !== null && c === null) {
    steps.push(`주어진 값: a = ${a}, b = ${b}`)
    steps.push(`c² = a² + b² = ${a}² + ${b}²`)
    steps.push(`c² = ${a**2} + ${b**2} = ${a**2 + b**2}`)

    c = Math.sqrt(a**2 + b**2)
    steps.push(`c = √${a**2 + b**2} = ${c.toFixed(4)}`)

    return { result: c, formula: 'c = √(a² + b²)', steps }
  }

  // a를 구하는 경우
  if (b !== null && c !== null && a === null) {
    if (c <= b) throw new Error('빗변은 다른 변보다 커야 합니다')

    steps.push(`주어진 값: b = ${b}, c = ${c}`)
    steps.push(`a² = c² - b² = ${c}² - ${b}²`)
    steps.push(`a² = ${c**2} - ${b**2} = ${c**2 - b**2}`)

    a = Math.sqrt(c**2 - b**2)
    steps.push(`a = √${c**2 - b**2} = ${a.toFixed(4)}`)

    return { result: a, formula: 'a = √(c² - b²)', steps }
  }

  // b를 구하는 경우
  if (a !== null && c !== null && b === null) {
    if (c <= a) throw new Error('빗변은 다른 변보다 커야 합니다')

    steps.push(`주어진 값: a = ${a}, c = ${c}`)
    steps.push(`b² = c² - a² = ${c}² - ${a}²`)
    steps.push(`b² = ${c**2} - ${a**2} = ${c**2 - a**2}`)

    b = Math.sqrt(c**2 - a**2)
    steps.push(`b = √${c**2 - a**2} = ${b.toFixed(4)}`)

    return { result: b, formula: 'b = √(c² - a²)', steps }
  }

  throw new Error('정확히 두 개의 변 길이를 입력해야 합니다')
}

// 기하 계산 - 도형 넓이/둘레
function calculateGeometry(type, ...params) {
  const steps = []
  let result, formula

  switch(type) {
    case 'triangle_area': {
      const [base, height] = params
      steps.push('삼각형 넓이 = (밑변 × 높이) / 2')
      steps.push(`밑변 = ${base}, 높이 = ${height}`)
      result = (base * height) / 2
      steps.push(`넓이 = (${base} × ${height}) / 2 = ${result.toFixed(4)}`)
      formula = '(밑변 × 높이) / 2'
      break
    }

    case 'circle_area': {
      const [radius] = params
      steps.push('원의 넓이 = π × r²')
      steps.push(`반지름 r = ${radius}`)
      result = Math.PI * radius ** 2
      steps.push(`넓이 = π × ${radius}² = ${result.toFixed(4)}`)
      formula = 'π × r²'
      break
    }

    case 'circle_circumference': {
      const [radius] = params
      steps.push('원의 둘레 = 2 × π × r')
      steps.push(`반지름 r = ${radius}`)
      result = 2 * Math.PI * radius
      steps.push(`둘레 = 2 × π × ${radius} = ${result.toFixed(4)}`)
      formula = '2 × π × r'
      break
    }

    case 'rectangle_area': {
      const [width, height] = params
      steps.push('직사각형 넓이 = 가로 × 세로')
      steps.push(`가로 = ${width}, 세로 = ${height}`)
      result = width * height
      steps.push(`넓이 = ${width} × ${height} = ${result.toFixed(4)}`)
      formula = '가로 × 세로'
      break
    }

    default:
      throw new Error('지원하지 않는 계산 유형입니다')
  }

  return { result, formula, steps }
}

// 연립방정식 풀이 (가감법)
function solveSimultaneous(a1, b1, c1, a2, b2, c2) {
  const steps = []
  steps.push('주어진 연립방정식:')
  steps.push(`  ${a1}x + ${b1}y = ${c1}  ... ①`)
  steps.push(`  ${a2}x + ${b2}y = ${c2}  ... ②`)

  // 행렬식 계산
  const det = a1 * b2 - a2 * b1

  if (Math.abs(det) < 1e-10) {
    // 해가 무수히 많거나 없음
    const ratio_check = Math.abs(a1 * c2 - a2 * c1) < 1e-10
    if (ratio_check) {
      steps.push('두 식이 같은 직선입니다 (해가 무수히 많음)')
      return { solution_type: 'infinite', x: null, y: null, method: 'elimination', steps }
    } else {
      steps.push('두 식이 평행합니다 (해가 없음)')
      return { solution_type: 'none', x: null, y: null, method: 'elimination', steps }
    }
  }

  // Cramer's rule로 해 구하기
  let x = (c1 * b2 - c2 * b1) / det
  let y = (a1 * c2 - a2 * c1) / det

  steps.push('\n[가감법으로 풀이]')
  steps.push(`행렬식 D = ${det.toFixed(4)}`)
  steps.push(`x = ${x.toFixed(4)}`)
  steps.push(`y = ${y.toFixed(4)}`)

  // 정수로 변환
  if (x === Math.floor(x)) x = Math.floor(x)
  if (y === Math.floor(y)) y = Math.floor(y)

  return { solution_type: 'unique', x, y, method: 'elimination', steps }
}

// 통계
function calculateStatistics(numbers) {
  const sorted = [...numbers].sort((a, b) => a - b)
  const n = numbers.length
  const mean = numbers.reduce((a, b) => a + b, 0) / n

  const median = n % 2 === 0
    ? (sorted[n/2 - 1] + sorted[n/2]) / 2
    : sorted[Math.floor(n/2)]

  const freqMap = {}
  numbers.forEach(num => freqMap[num] = (freqMap[num] || 0) + 1)
  const maxFreq = Math.max(...Object.values(freqMap))
  const mode = Object.keys(freqMap).filter(k => freqMap[k] === maxFreq).map(Number)

  const variance = numbers.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / n
  const stdDev = Math.sqrt(variance)

  return {
    mean, median, mode, variance, stdDev,
    range: sorted[n-1] - sorted[0],
    min: sorted[0],
    max: sorted[n-1],
    count: n
  }
}

// 소수 판정 및 소인수분해
function analyzePrime(n) {
  const steps = []
  if (n < 2) {
    return { isPrime: false, factors: [], steps: ['2보다 작은 수는 소수가 아닙니다'] }
  }

  // 소수 판정
  let isPrime = true
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) {
      isPrime = false
      break
    }
  }

  steps.push(`${n}의 소수 판정: ${isPrime ? '소수입니다' : '합성수입니다'}`)

  // 소인수분해
  const factors = []
  let temp = n
  for (let i = 2; i <= temp; i++) {
    while (temp % i === 0) {
      factors.push(i)
      temp /= i
    }
  }

  if (factors.length > 0) {
    steps.push(`소인수분해: ${n} = ${factors.join(' × ')}`)
  }

  return { isPrime, factors, steps }
}

// 이차식 인수분해 (ax² + bx + c)
function factorizeQuadratic(a, b, c) {
  const steps = [`주어진 식: ${a}x² + ${b}x + ${c}`]

  // 판별식
  const d = b * b - 4 * a * c

  if (d < 0) {
    steps.push('실수 범위에서 인수분해 불가능')
    return { factored: `${a}x² + ${b}x + ${c}`, steps }
  }

  const x1 = (-b + Math.sqrt(d)) / (2 * a)
  const x2 = (-b - Math.sqrt(d)) / (2 * a)

  if (Number.isInteger(x1) && Number.isInteger(x2)) {
    const factored = `${a}(x - ${x1})(x - ${x2})`
    steps.push(`인수분해: ${factored}`)
    return { factored, steps }
  } else {
    steps.push('정수 계수로 인수분해 불가능')
    return { factored: `${a}x² + ${b}x + ${c}`, steps }
  }
}

// 다항식 덧셈/뺄셈 (계수 배열로 입력)
function polynomialOperation(poly1, poly2, operation) {
  const steps = []
  const maxLen = Math.max(poly1.length, poly2.length)
  const p1 = [...poly1].reverse()
  const p2 = [...poly2].reverse()

  const result = []
  for (let i = 0; i < maxLen; i++) {
    const a = p1[i] || 0
    const b = p2[i] || 0
    result.push(operation === 'add' ? a + b : a - b)
  }

  const formatPoly = (coeffs) => {
    return coeffs.map((c, i) => {
      if (c === 0) return ''
      const exp = i === 0 ? '' : i === 1 ? 'x' : `x^${i}`
      const sign = c > 0 && i > 0 ? '+' : ''
      return `${sign}${c}${exp}`
    }).filter(s => s).join('') || '0'
  }

  steps.push(`${formatPoly(p1)} ${operation === 'add' ? '+' : '-'} ${formatPoly(p2)}`)
  steps.push(`= ${formatPoly(result)}`)

  return { result: formatPoly(result), steps }
}

// 일차부등식 (ax + b > 0 형태)
function solveInequality(a, b, operator) {
  const steps = [`${a}x ${operator} ${-b}`]

  if (a === 0) {
    if (b > 0) {
      return { solution: '모든 실수', steps }
    } else {
      return { solution: '해 없음', steps }
    }
  }

  const x = -b / a
  let solution = ''

  if (a > 0) {
    solution = operator === '>' ? `x > ${x.toFixed(4)}` : `x < ${x.toFixed(4)}`
  } else {
    solution = operator === '>' ? `x < ${x.toFixed(4)}` : `x > ${x.toFixed(4)}`
  }

  steps.push(solution)
  return { solution, steps }
}

// 확률 계산
function calculateProbability(favorable, total) {
  const probability = favorable / total
  const steps = [
    `전체 경우의 수: ${total}`,
    `유리한 경우의 수: ${favorable}`,
    `확률 = ${favorable}/${total} = ${probability.toFixed(4)}`
  ]
  return { probability, favorable, total, steps }
}

// 지수/로그
function calculateExponent(base, exponent, type) {
  const steps = []
  let result

  if (type === 'power') {
    result = Math.pow(base, exponent)
    steps.push(`${base}^${exponent} = ${result}`)
  } else if (type === 'log') {
    result = Math.log(exponent) / Math.log(base)
    steps.push(`log_${base}(${exponent}) = ${result.toFixed(4)}`)
  } else if (type === 'ln') {
    result = Math.log(base)
    steps.push(`ln(${base}) = ${result.toFixed(4)}`)
  }

  return { result, steps }
}

// 수열 (등차/등비)
function calculateSequence(type, a1, diff, n) {
  const steps = []
  let term, sum

  if (type === 'arithmetic') {
    term = a1 + (n - 1) * diff
    sum = (n * (a1 + term)) / 2
    steps.push(`등차수열: a_n = a_1 + (n-1)d`)
    steps.push(`a_${n} = ${a1} + ${n-1} × ${diff} = ${term}`)
    steps.push(`S_${n} = ${sum}`)
  } else {
    term = a1 * Math.pow(diff, n - 1)
    sum = diff === 1 ? a1 * n : a1 * (1 - Math.pow(diff, n)) / (1 - diff)
    steps.push(`등비수열: a_n = a_1 × r^(n-1)`)
    steps.push(`a_${n} = ${a1} × ${diff}^${n-1} = ${term}`)
    steps.push(`S_${n} = ${sum}`)
  }

  return { term, sum, steps }
}

// 행렬 연산
function matrixOperation(m1, m2, operation) {
  const steps = []

  if (operation === 'add' || operation === 'subtract') {
    const result = m1.map((row, i) =>
      row.map((val, j) => operation === 'add' ? val + m2[i][j] : val - m2[i][j])
    )
    steps.push(`행렬 ${operation === 'add' ? '덧셈' : '뺄셈'} 완료`)
    return { result, steps }
  } else if (operation === 'multiply') {
    const result = m1.map((row, i) =>
      m2[0].map((_, j) =>
        row.reduce((sum, val, k) => sum + val * m2[k][j], 0)
      )
    )
    steps.push('행렬 곱셈 완료')
    return { result, steps }
  }
}

// 삼각함수
function calculateTrig(angle, unit, func) {
  const rad = unit === 'deg' ? angle * Math.PI / 180 : angle
  const steps = []
  let result

  if (unit === 'deg') {
    steps.push(`${angle}° = ${rad.toFixed(4)} rad`)
  }

  switch(func) {
    case 'sin': result = Math.sin(rad); break
    case 'cos': result = Math.cos(rad); break
    case 'tan': result = Math.tan(rad); break
  }

  steps.push(`${func}(${angle}${unit === 'deg' ? '°' : ''}) = ${result.toFixed(4)}`)
  return { result, steps }
}

// 벡터 연산
function vectorOperation(v1, v2, operation) {
  const steps = []
  let result

  if (operation === 'add') {
    result = v1.map((val, i) => val + v2[i])
    steps.push(`벡터 덧셈: [${result.join(', ')}]`)
  } else if (operation === 'subtract') {
    result = v1.map((val, i) => val - v2[i])
    steps.push(`벡터 뺄셈: [${result.join(', ')}]`)
  } else if (operation === 'dot') {
    const dot = v1.reduce((sum, val, i) => sum + val * v2[i], 0)
    steps.push(`내적: ${dot}`)
    return { result: [dot], steps }
  } else if (operation === 'magnitude') {
    const mag = Math.sqrt(v1.reduce((sum, val) => sum + val * val, 0))
    steps.push(`크기: ${mag.toFixed(4)}`)
    return { result: v1, magnitude: mag, steps }
  }

  return { result, steps }
}

// 복소수 연산
function complexOperation(r1, i1, r2, i2, operation) {
  const steps = []
  let real, imaginary

  if (operation === 'add') {
    real = r1 + r2
    imaginary = i1 + i2
    steps.push(`(${r1} + ${i1}i) + (${r2} + ${i2}i) = ${real} + ${imaginary}i`)
  } else if (operation === 'multiply') {
    real = r1 * r2 - i1 * i2
    imaginary = r1 * i2 + i1 * r2
    steps.push(`곱셈 결과: ${real} + ${imaginary}i`)
  }

  const magnitude = Math.sqrt(real * real + imaginary * imaginary)
  const angle = Math.atan2(imaginary, real)

  return { real, imaginary, magnitude, angle, steps }
}

// 미분 (수치 미분)
function numericalDerivative(func, x, h = 0.0001) {
  const f = new Function('x', `return ${func}`)
  const derivative = (f(x + h) - f(x - h)) / (2 * h)

  const steps = [
    `함수: f(x) = ${func}`,
    `x = ${x}에서의 미분`,
    `f'(${x}) ≈ ${derivative.toFixed(4)}`
  ]

  return { result: `f'(x) ≈ ${derivative.toFixed(4)}`, steps }
}

contextBridge.exposeInMainWorld('mathAPI', {
  solveLinear,
  solveQuadratic,
  pythagorean,
  calculateGeometry,
  solveSimultaneous,
  calculateStatistics,
  analyzePrime,
  factorizeQuadratic,
  polynomialOperation,
  solveInequality,
  calculateProbability,
  calculateExponent,
  calculateSequence,
  matrixOperation,
  calculateTrig,
  vectorOperation,
  complexOperation,
  numericalDerivative
})
