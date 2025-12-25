/**
 * 스마트 입력 파서
 *
 * 사용자 입력을 분석하여 의도를 파악하고 적절한 계산 모드를 제안
 */

export interface ParsedInput {
  intent: 'equation' | 'expression' | 'derivative' | 'integral' | 'limit' | 'matrix'
  confidence: number // 0-1 (확신도)
  suggestedMode: CalculatorMode
  autoSwitch: boolean // 자동 전환 여부
  reason?: string // 판단 근거 (디버깅용)
}

/**
 * 입력 내용을 분석하여 의도 파악
 *
 * @param input - 사용자 입력 수식
 * @returns 파싱된 입력 정보
 *
 * @example
 * parseInputIntent('2x + 4 = 10')
 * // => { intent: 'equation', suggestedMode: 'solve', autoSwitch: true }
 *
 * @example
 * parseInputIntent('x^2 + 3x')
 * // => { intent: 'expression', suggestedMode: 'simplify', autoSwitch: false }
 */
export function parseInputIntent(input: string): ParsedInput {
  const cleaned = input.trim()

  // 빈 입력
  if (!cleaned) {
    return {
      intent: 'expression',
      confidence: 0,
      suggestedMode: 'evaluate',
      autoSwitch: false,
      reason: '빈 입력'
    }
  }

  // 1. 방정식 감지 (등호 포함, 단 할당문 제외)
  if (cleaned.includes('=') && !cleaned.startsWith('let ') && !cleaned.startsWith('const ')) {
    return {
      intent: 'equation',
      confidence: 0.95,
      suggestedMode: 'solve',
      autoSwitch: true,
      reason: '등호(=) 발견 → 방정식'
    }
  }

  // 2. 미분 감지
  // - d/dx, diff, derivative 키워드
  // - 작은따옴표 표기법 (f'(x))
  // - ∂ 기호
  if (/^(d\/dx|diff|derivative)\s*\(/i.test(cleaned) || cleaned.includes('∂')) {
    return {
      intent: 'derivative',
      confidence: 0.9,
      suggestedMode: 'differentiate',
      autoSwitch: true,
      reason: '미분 키워드/기호 발견'
    }
  }

  // 작은따옴표 표기법 (단, 문자열 내부는 제외)
  if (/[a-z]'\s*\(/i.test(cleaned)) {
    return {
      intent: 'derivative',
      confidence: 0.85,
      suggestedMode: 'differentiate',
      autoSwitch: true,
      reason: "작은따옴표 표기법 (f'(x))"
    }
  }

  // 3. 적분 감지
  // - int, integrate, integral 키워드
  // - ∫ 기호
  if (/^(int|integrate|integral)\s*\(/i.test(cleaned) || cleaned.includes('∫')) {
    return {
      intent: 'integral',
      confidence: 0.9,
      suggestedMode: 'integrate',
      autoSwitch: true,
      reason: '적분 키워드/기호 발견'
    }
  }

  // 4. 극한 감지
  // - lim, limit 키워드
  // - x->a 표기법
  if (/^(lim|limit)\s*\(/i.test(cleaned) || /->/.test(cleaned)) {
    return {
      intent: 'limit',
      confidence: 0.85,
      suggestedMode: 'limit',
      autoSwitch: true,
      reason: '극한 키워드/표기법 발견'
    }
  }

  // 5. 행렬 감지
  // - [[...]] 형태
  if (/^\[\[.*\]\]/.test(cleaned)) {
    return {
      intent: 'matrix',
      confidence: 0.85,
      suggestedMode: 'evaluate',
      autoSwitch: false, // 행렬은 evaluate로 처리
      reason: '행렬 표기법 [[...]]'
    }
  }

  // 6. 기본 표현식
  const hasVariable = /[a-z]/i.test(cleaned)
  const hasOnlyNumbers = /^[\d\s+\-*/().,^]+$/.test(cleaned)

  if (hasOnlyNumbers) {
    return {
      intent: 'expression',
      confidence: 0.9,
      suggestedMode: 'evaluate',
      autoSwitch: false,
      reason: '숫자만 포함 → 계산'
    }
  }

  if (hasVariable) {
    return {
      intent: 'expression',
      confidence: 0.8,
      suggestedMode: 'simplify',
      autoSwitch: false,
      reason: '변수 포함 → 간단히'
    }
  }

  // 7. 기타
  return {
    intent: 'expression',
    confidence: 0.7,
    suggestedMode: 'evaluate',
    autoSwitch: false,
    reason: '기본 표현식'
  }
}

/**
 * 현재 모드와 제안 모드가 호환되는지 확인
 *
 * @param currentMode - 현재 계산 모드
 * @param suggestedMode - 제안된 계산 모드
 * @returns 호환 여부
 */
export function isCompatibleMode(
  currentMode: CalculatorMode,
  suggestedMode: CalculatorMode
): boolean {
  // calculateAll 모드는 모든 입력과 호환
  if (currentMode === 'calculateAll') {
    return true
  }

  // 같은 모드면 호환
  if (currentMode === suggestedMode) {
    return true
  }

  // evaluate와 simplify는 서로 호환
  if (
    (currentMode === 'evaluate' && suggestedMode === 'simplify') ||
    (currentMode === 'simplify' && suggestedMode === 'evaluate')
  ) {
    return true
  }

  // 그 외는 비호환
  return false
}

/**
 * 자동 전환 여부 판단
 *
 * @param parsed - 파싱된 입력 정보
 * @param currentMode - 현재 모드
 * @returns 자동 전환 필요 여부
 */
export function shouldAutoSwitch(parsed: ParsedInput, currentMode: CalculatorMode): boolean {
  // 자동 전환 비활성화된 경우
  if (!parsed.autoSwitch) {
    return false
  }

  // 이미 호환되는 모드인 경우
  if (isCompatibleMode(currentMode, parsed.suggestedMode)) {
    return false
  }

  // 확신도가 충분히 높은 경우만 자동 전환
  if (parsed.confidence >= 0.85) {
    return true
  }

  return false
}
