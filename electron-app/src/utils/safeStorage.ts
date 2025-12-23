/**
 * Safe localStorage Wrapper
 *
 * localStorage 접근 시 발생할 수 있는 에러를 안전하게 처리합니다:
 * - QuotaExceededError: 저장 공간 초과
 * - SecurityError: Private 모드 등 접근 불가
 * - TypeError: localStorage 미지원 환경
 */

export interface StorageOptions {
  /** 에러 발생 시 반환할 기본값 */
  fallback?: any
  /** 저장 가능한 최대 크기 (bytes, default: 4MB) */
  maxSize?: number
  /** 에러 발생 시 콘솔에 로깅할지 여부 */
  silent?: boolean
}

/**
 * 안전한 localStorage.getItem
 *
 * @param key - 저장소 키
 * @param options - 옵션 (fallback, silent)
 * @returns 파싱된 데이터 또는 fallback 값
 */
export function getItem<T = any>(key: string, options: StorageOptions = {}): T | null {
  const { fallback = null, silent = false } = options

  try {
    const item = localStorage.getItem(key)
    if (item === null) {
      return fallback
    }
    return JSON.parse(item) as T
  } catch (error) {
    if (!silent && process.env.NODE_ENV === 'development') {
      console.warn(`[safeStorage] Failed to get item "${key}":`, error)
    }
    return fallback
  }
}

/**
 * 안전한 localStorage.setItem
 *
 * @param key - 저장소 키
 * @param value - 저장할 값 (자동 JSON.stringify)
 * @param options - 옵션 (maxSize, silent)
 * @returns 성공 여부
 */
export function setItem(key: string, value: any, options: StorageOptions = {}): boolean {
  const { maxSize = 4 * 1024 * 1024, silent = false } = options

  try {
    const serialized = JSON.stringify(value)

    // 크기 체크
    if (serialized.length > maxSize) {
      if (!silent) {
        console.error(`[safeStorage] Data size (${serialized.length} bytes) exceeds limit (${maxSize} bytes)`)
      }
      // 자동 정리 시도
      cleanupOldData(key)
      return false
    }

    localStorage.setItem(key, serialized)
    return true
  } catch (error) {
    if (!silent) {
      handleStorageError(error, 'setItem', key)
    }
    return false
  }
}

/**
 * 안전한 localStorage.removeItem
 *
 * @param key - 삭제할 키
 * @returns 성공 여부
 */
export function removeItem(key: string): boolean {
  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[safeStorage] Failed to remove item "${key}":`, error)
    }
    return false
  }
}

/**
 * 저장소 에러 핸들링
 */
function handleStorageError(error: unknown, operation: string, key: string): void {
  if (error instanceof DOMException) {
    switch (error.name) {
      case 'QuotaExceededError':
        console.error(`[safeStorage] Storage quota exceeded for "${key}". Attempting cleanup...`)
        cleanupOldData(key)
        break
      case 'SecurityError':
        console.error(`[safeStorage] Storage access denied (private mode?) for "${key}"`)
        break
      default:
        console.error(`[safeStorage] ${operation} failed for "${key}":`, error.message)
    }
  } else {
    console.error(`[safeStorage] ${operation} failed for "${key}":`, error)
  }
}

/**
 * 오래된 데이터 정리 (quota 초과 시)
 *
 * 현재는 간단히 해당 키만 삭제하지만,
 * 추후 timestamp 기반 정리 로직으로 확장 가능
 */
function cleanupOldData(key: string): void {
  try {
    // 기본 전략: 해당 키의 데이터 삭제
    localStorage.removeItem(key)
    console.log(`[safeStorage] Cleaned up data for "${key}"`)

    // TODO: 추가 정리 전략
    // - 오래된 히스토리 항목 삭제
    // - 캐시 데이터 삭제
    // - 임시 데이터 삭제
  } catch (error) {
    console.error('[safeStorage] Cleanup failed:', error)
  }
}

/**
 * localStorage 사용 가능 여부 확인
 *
 * @returns localStorage 사용 가능 여부
 */
export function isStorageAvailable(): boolean {
  try {
    const testKey = '__storage_test__'
    localStorage.setItem(testKey, 'test')
    localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

/**
 * 현재 저장소 사용량 확인 (추정)
 *
 * @returns 저장소 사용량 (bytes)
 */
export function getStorageSize(): number {
  try {
    let total = 0
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        const value = localStorage.getItem(key)
        if (value) {
          total += key.length + value.length
        }
      }
    }
    return total
  } catch {
    return 0
  }
}

// Default export
export default {
  getItem,
  setItem,
  removeItem,
  isStorageAvailable,
  getStorageSize
}
