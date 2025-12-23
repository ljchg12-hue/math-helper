/**
 * 에러 처리 유틸리티
 *
 * 다양한 타입의 에러를 안전하게 문자열로 변환합니다.
 * catch 블록에서 'err as string' 대신 사용하여 타입 안전성을 보장합니다.
 */

/**
 * 에러를 사용자 친화적인 문자열로 변환
 *
 * @param error - 변환할 에러 (unknown 타입)
 * @returns 에러 메시지 문자열
 *
 * @example
 * try {
 *   await someOperation()
 * } catch (err) {
 *   setError(formatError(err))  // ✅ 타입 안전
 * }
 */
export function formatError(error: unknown): string {
  // Case 1: Error 객체
  if (error instanceof Error) {
    return error.message
  }

  // Case 2: 문자열
  if (typeof error === 'string') {
    return error
  }

  // Case 3: 커스텀 에러 객체 { message: string }
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message: unknown }).message
    if (typeof message === 'string') {
      return message
    }
  }

  // Case 4: 기타 (null, undefined, number 등)
  if (error === null || error === undefined) {
    return '알 수 없는 오류가 발생했습니다'
  }

  // Case 5: toString() 시도
  try {
    return String(error)
  } catch {
    return '알 수 없는 오류가 발생했습니다'
  }
}

/**
 * 에러를 콘솔에 로깅 (개발 환경에서만)
 *
 * @param error - 로깅할 에러
 * @param context - 에러 발생 컨텍스트
 */
export function logError(error: unknown, context?: string): void {
  if (process.env.NODE_ENV === 'development') {
    const prefix = context ? `[${context}]` : '[Error]'
    console.error(prefix, error)
  }
}
