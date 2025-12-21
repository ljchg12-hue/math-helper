// Math API 타입 정의

interface MathAPIResult {
  success: boolean
  result?: any
  solutions?: number[]
  variable?: string
  steps?: string[]
  error?: string
  original?: string
  order?: number
  definite?: boolean
  bounds?: [string, string]
  operation?: string
}

interface MathAPI {
  evaluate: (expr: string) => MathAPIResult
  solve: (equation: string, variable: string) => MathAPIResult
  differentiate: (expr: string, variable: string, order?: number) => MathAPIResult
  integrate: (expr: string, variable: string, definite?: boolean, lower?: string, upper?: string) => MathAPIResult
  simplify: (expr: string) => MathAPIResult
  factor: (expr: string) => MathAPIResult
  expand: (expr: string) => MathAPIResult
  limit: (expr: string, variable: string, approach: string, direction?: string) => MathAPIResult
  matrix: (operation: string, matrixA: number[][], matrixB?: number[][]) => MathAPIResult
  statistics: (data: number[]) => MathAPIResult
}

declare global {
  interface Window {
    mathAPI: MathAPI
  }
}

export {}
