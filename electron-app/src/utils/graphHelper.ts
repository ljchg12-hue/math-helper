// 그래프 생성을 위한 유틸리티 함수들

/**
 * 수식에서 변수를 추출합니다
 */
export function extractVariables(expression: string): string[] {
  const matches = expression.match(/[a-zA-Z]+/g) || []
  // 수학 함수 및 상수 제외
  const mathFunctions = [
    'sin', 'cos', 'tan', 'cot', 'sec', 'csc',
    'asin', 'acos', 'atan', 'atan2',
    'sinh', 'cosh', 'tanh',
    'log', 'ln', 'log10', 'log2',
    'exp', 'sqrt', 'cbrt',
    'abs', 'floor', 'ceil', 'round',
    'min', 'max', 'pow',
    'pi', 'PI', 'e', 'E',  // 상수
    'NaN', 'Infinity'
  ]
  return [...new Set(matches.filter(v => !mathFunctions.includes(v) && !mathFunctions.includes(v.toLowerCase())))]
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
 *
 * function-plot은 math.js의 표현식 파서를 사용하므로:
 * - ^ 연산자 지원 (거듭제곱)
 * - sin, cos, tan, log, sqrt, abs, exp 등 지원
 * - 암묵적 곱셈 (2x) 지원 안 함 → 2*x로 변환 필요
 */
export function convertToPlotFormat(expression: string, variable: string = 'x'): string {
  let plotExpr = expression.trim()

  // 빈 문자열 체크
  if (!plotExpr) return variable

  // ✅ v1.0.30: 함수 정의 형식 처리 (y=sin(x) → sin(x))
  // y=, f(x)=, g(x)= 등의 좌변 제거
  if (/^[a-zA-Z](\([a-zA-Z]\))?\s*=/.test(plotExpr)) {
    plotExpr = plotExpr.replace(/^[a-zA-Z](\([a-zA-Z]\))?\s*=\s*/, '')
  }

  // ✅ FIX: 방정식 형식 처리 (x^2 - 4 = 0 → x^2 - 4)
  if (plotExpr.includes('=')) {
    const parts = plotExpr.split('=')
    if (parts.length === 2) {
      const left = parts[0].trim()
      const right = parts[1].trim()
      // 우변이 0이면 좌변만 사용
      if (right === '0' || right === '') {
        plotExpr = left
      } else {
        // 우변이 0이 아니면 좌변 - 우변
        plotExpr = `(${left}) - (${right})`
      }
    }
  }

  // ✅ FIX: 암묵적 곱셈 변환 (2x → 2*x, 3sin(x) → 3*sin(x))
  // 숫자 + 변수
  plotExpr = plotExpr.replace(/(\d)([a-zA-Z])/g, '$1*$2')
  // 닫는 괄호 + 변수/숫자/여는 괄호
  plotExpr = plotExpr.replace(/\)([a-zA-Z0-9(])/g, ')*$1')
  // 변수 + 여는 괄호 (함수 호출 제외)
  plotExpr = plotExpr.replace(/([a-zA-Z])(\()(?!sin|cos|tan|log|ln|exp|sqrt|abs)/gi, '$1*$2')

  // ln → log로 변환 (function-plot은 ln 미지원)
  plotExpr = plotExpr.replace(/\bln\b/gi, 'log')

  // ✅ FIX: π → pi 변환 (function-plot 호환)
  plotExpr = plotExpr.replace(/π/g, 'pi')
  plotExpr = plotExpr.replace(/PI/g, 'pi')

  // ✅ FIX: e 상수 처리 (단독 e는 E로, 변수 e와 구분)
  // 단, exp 함수와 혼동 방지
  plotExpr = plotExpr.replace(/\be\b(?!xp)/gi, 'E')

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
