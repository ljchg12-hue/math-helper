// 그래프 생성을 위한 유틸리티 함수들

/**
 * 수식에서 변수를 추출합니다
 */
export function extractVariables(expression: string): string[] {
  const matches = expression.match(/[a-zA-Z]+/g) || []
  // 수학 함수 제외
  const mathFunctions = ['sin', 'cos', 'tan', 'log', 'ln', 'exp', 'sqrt', 'abs', 'floor', 'ceil']
  return [...new Set(matches.filter(v => !mathFunctions.includes(v)))]
}

/**
 * 수식이 그래프로 표현 가능한지 확인합니다
 *
 * @param expression - 확인할 수식
 * @param mode - 계산 모드
 * @returns 그래프 가능 여부
 *
 * @example
 * isGraphable("sin(x)", "evaluate") // → true (1변수)
 * isGraphable("x*y", "evaluate") // → true (2변수, 추후 3D 지원)
 * isGraphable("sin(3)", "evaluate") // → false (변수 없음)
 * isGraphable("x*y*z", "evaluate") // → false (3변수는 미지원)
 */
export function isGraphable(expression: string, mode: string): boolean {
  // 방정식은 solve 모드에서만
  if (expression.includes('=') && mode !== 'solve') return false

  const variables = extractVariables(expression)

  // ✅ 수정: 1~2개 변수만 그래프 가능
  // - 0개: 상수는 그래프 불가 (점 하나만 있음)
  // - 1개: y = f(x) 2D 그래프 ✅
  // - 2개: z = f(x,y) 3D 그래프 또는 등고선 (추후 구현) ✅
  // - 3개+: 미지원 ❌
  if (variables.length < 1 || variables.length > 2) {
    return false
  }

  return true
}

/**
 * mathjs/nerdamer 표현식을 function-plot 형식으로 변환합니다
 */
export function convertToPlotFormat(expression: string, variable: string = 'x'): string {
  let plotExpr = expression

  // 거듭제곱 변환: x^2 → x^2 (function-plot은 ^ 지원)
  // 곱셈 기호 추가: 2x → 2*x
  plotExpr = plotExpr.replace(/(\d)([a-zA-Z])/g, '$1*$2')

  // sin, cos 등은 그대로 사용
  // ln → log로 변환
  plotExpr = plotExpr.replace(/\bln\b/g, 'log')

  return plotExpr
}

/**
 * 그래프의 적절한 범위를 자동으로 계산합니다
 */
export function calculateDomain(expression: string): [number, number] {
  // 삼각함수가 있으면 [-2π, 2π]
  if (/sin|cos|tan/.test(expression)) {
    return [-2 * Math.PI, 2 * Math.PI]
  }

  // 지수/로그 함수가 있으면 [-5, 5]
  if (/exp|log|ln/.test(expression)) {
    return [-5, 5]
  }

  // 기본값
  return [-10, 10]
}

/**
 * 그래프의 y 범위를 자동으로 계산합니다
 */
export function calculateRange(expression: string): [number, number] {
  // 지수 함수가 있으면 더 큰 범위
  if (/exp/.test(expression)) {
    return [-10, 50]
  }

  // 로그 함수가 있으면 음수 포함
  if (/log|ln/.test(expression)) {
    return [-5, 5]
  }

  // 기본값
  return [-10, 10]
}

/**
 * 수식에서 그래프 제목을 생성합니다
 */
export function generateGraphTitle(expression: string, mode: string, variable: string = 'x'): string {
  switch (mode) {
    case 'differentiate':
      return `f'(${variable}) = ${expression}`
    case 'integrate':
      return `∫ f(${variable}) d${variable}`
    case 'solve':
      return `y = ${expression.replace('=', '- (')}) (근 찾기)`
    default:
      return `f(${variable}) = ${expression}`
  }
}
