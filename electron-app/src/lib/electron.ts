// ✅ 범용 계산기 타입 정의 (preload.js와 일치)
declare global {
  interface Window {
    mathAPI?: {
      // 기본 계산
      evaluate: (expr: string) => any

      // 방정식/식 조작
      solve: (equation: string, variable?: string) => any
      simplify: (expr: string) => any
      factor: (expr: string) => any
      expand: (expr: string) => any

      // 미적분
      differentiate: (expr: string, variable?: string, order?: number) => any
      integrate: (expr: string, variable?: string, definite?: boolean, lower?: number | null, upper?: number | null) => any
      limit: (expr: string, variable: string, approach: string, direction?: string) => any

      // 행렬
      matrix: (operation: string, matrixA: number[][], matrixB?: number[][] | null) => any

      // 통계
      statistics: (data: number[]) => any
    }
  }
}

// ✅ 범용 계산기 함수는 더 이상 필요 없음
// UniversalCalculator.tsx에서 window.mathAPI를 직접 사용
