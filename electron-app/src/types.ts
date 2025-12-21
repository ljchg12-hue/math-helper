// 일차방정식
export interface LinearInput {
  a: number
  b: number
}

export interface LinearResult {
  x: number
  steps: string[]
}

// 이차방정식
export interface QuadraticInput {
  a: number
  b: number
  c: number
}

export interface QuadraticResult {
  has_real_roots: boolean
  x1: number | null
  x2: number | null
  discriminant: number
  steps: string[]
}

// 기하 계산
export interface GeometryResult {
  result: number
  formula: string
  steps: string[]
}

// 연립방정식
export interface SimultaneousInput {
  a1: number
  b1: number
  c1: number
  a2: number
  b2: number
  c2: number
}

export interface SimultaneousResult {
  solution_type: 'unique' | 'infinite' | 'none'
  x: number | null
  y: number | null
  method: string
  steps: string[]
}

// 통계
export interface StatisticsResult {
  mean: number
  median: number
  mode: number[]
  variance: number
  stdDev: number
  range: number
  min: number
  max: number
  count: number
}

// 소수
export interface PrimeResult {
  isPrime: boolean
  factors: number[]
  steps: string[]
}

// 인수분해
export interface FactorizationResult {
  factored: string
  steps: string[]
}

// 다항식
export interface PolynomialResult {
  result: string
  steps: string[]
}

// 부등식
export interface InequalityResult {
  solution: string
  steps: string[]
}

// 확률
export interface ProbabilityResult {
  probability: number
  favorable: number
  total: number
  steps: string[]
}

// 지수/로그
export interface ExponentResult {
  result: number
  steps: string[]
}

// 수열
export interface SequenceResult {
  term: number
  sum: number
  steps: string[]
}

// 행렬
export interface MatrixResult {
  result: number[][]
  steps: string[]
}

// 삼각함수
export interface TrigResult {
  result: number
  steps: string[]
}

// 벡터
export interface VectorResult {
  result: number[]
  magnitude?: number
  steps: string[]
}

// 복소수
export interface ComplexResult {
  real: number
  imaginary: number
  magnitude: number
  angle: number
  steps: string[]
}

// 미적분
export interface CalculusResult {
  result: string
  steps: string[]
}
