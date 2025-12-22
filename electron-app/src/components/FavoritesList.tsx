import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Star, X, ChevronDown, ChevronUp } from 'lucide-react'
import { FavoriteItem } from '../types/favorites'
import FavoriteButton from './FavoriteButton'

interface FavoritesListProps {
  favorites: FavoriteItem[]
  onRestore: (item: FavoriteItem) => void
  onRemove: (favoriteId: string) => void
}

export default function FavoritesList({ favorites, onRestore, onRemove }: FavoritesListProps) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  if (favorites.length === 0) {
    return null
  }

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString()
  }

  return (
    <div className="bg-white dark:bg-gray-800 border-2 border-yellow-200 dark:border-yellow-700 rounded-lg overflow-hidden transition-colors">
      {/* 헤더 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between bg-yellow-50 dark:bg-yellow-900/30 hover:bg-yellow-100 dark:hover:bg-yellow-900/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="currentColor" />
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            {t('favorites.title')} ({favorites.length})
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        )}
      </button>

      {/* 즐겨찾기 목록 */}
      {isOpen && (
        <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
          {favorites.map((item) => (
            <div
              key={item.favoriteId}
              className="group relative p-3 bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/40 border border-yellow-200 dark:border-yellow-700 hover:border-yellow-300 dark:hover:border-yellow-600 rounded-lg cursor-pointer transition-all"
              onClick={() => onRestore(item)}
            >
              {/* 즐겨찾기 제거 버튼 */}
              <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <FavoriteButton
                  isFavorite={true}
                  onClick={() => onRemove(item.favoriteId)}
                  size="sm"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemove(item.favoriteId)
                  }}
                  className="p-1 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400"
                  title={t('favorites.remove')}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 모드 */}
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-400">
                  {item.modeLabel}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatTimestamp(item.addedAt)}
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

              {/* 메모 */}
              {item.note && (
                <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 italic">
                  {item.note}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
