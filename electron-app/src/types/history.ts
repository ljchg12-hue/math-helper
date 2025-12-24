// ✅ 계산 히스토리 타입 정의
export interface HistoryItem {
  id: string
  timestamp: number
  mode: string
  modeLabel: string
  input: string
  variable?: string
  limitValue?: string
  limitDirection?: 'left' | 'right' | 'both'
  result: string
  isIdentity?: boolean
  solutions?: any[]
  // ✅ Phase 2: 통합 계산 결과 저장
  unifiedResults?: any[]
}

export interface HistoryStorage {
  items: HistoryItem[]
  maxItems: number
}
