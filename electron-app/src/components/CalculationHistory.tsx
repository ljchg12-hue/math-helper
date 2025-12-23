import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { History, X, Trash2, ChevronDown, ChevronUp, Download, Upload } from 'lucide-react'
import { HistoryItem } from '../types/history'
import FavoriteButton from './FavoriteButton'
import { exportToJSON, exportToCSV, downloadFile } from '../utils/exportHistory'
import { importFromJSON, readFileAsText } from '../utils/importHistory'
import { setItem } from '../utils/safeStorage'

interface CalculationHistoryProps {
  history: HistoryItem[]
  onRestore: (item: HistoryItem) => void
  onDelete: (id: string) => void
  onClearAll: () => void
  onAddToFavorites: (item: HistoryItem) => void
  isFavorite: (id: string) => boolean
}

export default function CalculationHistory({
  history,
  onRestore,
  onDelete,
  onClearAll,
  onAddToFavorites,
  isFavorite,
}: CalculationHistoryProps) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [filter, setFilter] = useState<string>('all')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredHistory = filter === 'all'
    ? history
    : history.filter(item => item.mode === filter)

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return t('history.justNow')
    if (minutes < 60) return t('history.minutesAgo', { count: minutes })
    if (hours < 24) return t('history.hoursAgo', { count: hours })
    if (days < 7) return t('history.daysAgo', { count: days })

    return date.toLocaleDateString()
  }

  const handleExportJSON = () => {
    const json = exportToJSON(filteredHistory)
    const timestamp = new Date().toISOString().split('T')[0]
    downloadFile(json, `math-history-${timestamp}.json`, 'application/json')
  }

  const handleExportCSV = () => {
    const csv = exportToCSV(filteredHistory)
    const timestamp = new Date().toISOString().split('T')[0]
    downloadFile(csv, `math-history-${timestamp}.csv`, 'text/csv')
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const text = await readFileAsText(file)
      const importedItems = importFromJSON(text)

      // 기존 히스토리와 병합 (중복 제거)
      const existingIds = new Set(history.map(item => item.id))
      const newItems = importedItems.filter(item => !existingIds.has(item.id))

      if (newItems.length > 0) {
        const merged = [...newItems, ...history].slice(0, 100)
        setItem('calculationHistory', merged)
        window.location.reload() // 간단한 리로드로 상태 업데이트
      }

      alert(t('importExport.importSuccess', { count: newItems.length }))
    } catch (error) {
      alert(t('importExport.importError', { error: (error as Error).message }))
    }

    // 파일 입력 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  if (history.length === 0) {
    return null
  }

  return (
    <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-colors">
      {/* 헤더 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
      >
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            {t('history.title')} ({history.length})
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        )}
      </button>

      {/* 히스토리 목록 */}
      {isOpen && (
        <div className="p-4 space-y-3">
          {/* 필터, Import/Export, 삭제 버튼 */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-1 text-sm border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
            >
              <option value="all">{t('history.all')}</option>
              <option value="evaluate">{t('modes.evaluate')}</option>
              <option value="solve">{t('modes.solve')}</option>
              <option value="differentiate">{t('modes.differentiate')}</option>
              <option value="integrate">{t('modes.integrate')}</option>
              <option value="simplify">{t('modes.simplify')}</option>
              <option value="factor">{t('modes.factor')}</option>
              <option value="expand">{t('modes.expand')}</option>
              <option value="limit">{t('modes.limit')}</option>
            </select>

            <div className="flex items-center gap-2">
              {/* Import */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 px-3 py-1 text-sm text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                title={t('importExport.import')}
              >
                <Upload className="w-4 h-4" />
                {t('importExport.import')}
              </button>

              {/* Export JSON */}
              <button
                onClick={handleExportJSON}
                className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                title={t('importExport.exportJSON')}
              >
                <Download className="w-4 h-4" />
                JSON
              </button>

              {/* Export CSV */}
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                title={t('importExport.exportCSV')}
              >
                <Download className="w-4 h-4" />
                CSV
              </button>

              {/* Clear All */}
              <button
                onClick={onClearAll}
                className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                title={t('history.clearAll')}
              >
                <Trash2 className="w-4 h-4" />
                {t('history.clearAll')}
              </button>
            </div>
          </div>

          {/* 히스토리 아이템 */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredHistory.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                {t('history.noItems')}
              </p>
            ) : (
              filteredHistory.slice(0, 20).map((item) => (
                <div
                  key={item.id}
                  className="group relative p-3 bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 rounded-lg cursor-pointer transition-all"
                  onClick={() => onRestore(item)}
                >
                  {/* 즐겨찾기 & 삭제 버튼 */}
                  <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <FavoriteButton
                      isFavorite={isFavorite(item.id)}
                      onClick={() => onAddToFavorites(item)}
                      size="sm"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete(item.id)
                      }}
                      className="p-1 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400"
                      title={t('history.delete')}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* 모드 */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                      {item.modeLabel}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTimestamp(item.timestamp)}
                    </span>
                  </div>

                  {/* 수식 */}
                  <div className="font-mono text-sm text-gray-900 dark:text-gray-100 mb-1 truncate">
                    {item.input}
                  </div>

                  {/* 결과 */}
                  <div className="font-mono text-xs text-gray-600 dark:text-gray-400 truncate">
                    = {item.result}
                  </div>
                </div>
              ))
            )}
          </div>

          {filteredHistory.length > 20 && (
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              {t('history.showingRecent', { count: 20 })}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
