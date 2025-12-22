import { Star } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface FavoriteButtonProps {
  isFavorite: boolean
  onClick: () => void
  size?: 'sm' | 'md' | 'lg'
}

export default function FavoriteButton({ isFavorite, onClick, size = 'md' }: FavoriteButtonProps) {
  const { t } = useTranslation()

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className={`p-1 rounded transition-all hover:scale-110 ${
        isFavorite
          ? 'text-yellow-500 dark:text-yellow-400'
          : 'text-gray-400 dark:text-gray-500 hover:text-yellow-500 dark:hover:text-yellow-400'
      }`}
      title={isFavorite ? t('favorites.removeFavorite') : t('favorites.addFavorite')}
    >
      <Star
        className={sizeClasses[size]}
        fill={isFavorite ? 'currentColor' : 'none'}
      />
    </button>
  )
}
