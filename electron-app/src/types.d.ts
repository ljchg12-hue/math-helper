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

// ✅ v1.0.33: 각도 단위 타입
type AngleUnit = 'rad' | 'deg'

interface MathAPI {
  // ✅ v1.0.33: angleUnit 파라미터 추가
  evaluate: (expr: string, angleUnit?: AngleUnit) => MathAPIResult
  // ✅ Phase 3: parameterValues 파라미터 추가
  solve: (equation: string, variable: string, parameterValues?: Record<string, string>) => MathAPIResult
  differentiate: (expr: string, variable: string, order?: number) => MathAPIResult
  integrate: (expr: string, variable: string, definite?: boolean, lower?: string, upper?: string) => MathAPIResult
  simplify: (expr: string) => MathAPIResult
  factor: (expr: string) => MathAPIResult
  expand: (expr: string) => MathAPIResult
  limit: (expr: string, variable: string, approach: string, direction?: string) => MathAPIResult
  matrix: (operation: string, matrixA: number[][], matrixB?: number[][]) => MathAPIResult
  statistics: (data: number[]) => MathAPIResult
}

// ✅ Phase 2: 통합 계산 엔진 타입 정의
type CalculatorMode =
  | 'evaluate'
  | 'solve'
  | 'differentiate'
  | 'integrate'
  | 'simplify'
  | 'factor'
  | 'expand'
  | 'limit'
  | 'calculateAll'

interface UnifiedCalcResult {
  mode: CalculatorMode
  modeLabel: string
  icon: string
  success: boolean
  result?: MathAPIResult
  error?: string
  executionTime: number
}

interface UnifiedCalcResponse {
  success: boolean
  input: string
  variable?: string
  limitValue?: string
  limitDirection?: 'left' | 'right' | 'both'
  results: UnifiedCalcResult[]
  totalTime: number
  successCount: number
  failureCount: number
}

declare global {
  interface Window {
    mathAPI: MathAPI
  }
}

export {}
