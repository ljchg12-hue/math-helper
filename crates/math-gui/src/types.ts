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

// 연습문제
export interface PracticeRequest {
  topic: string
  difficulty: string
  count: number
}

export interface Problem {
  id: string
  question: string
  answer: string
  hints: string[]
}
