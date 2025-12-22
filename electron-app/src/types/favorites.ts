import { HistoryItem } from './history'

export interface FavoriteItem extends HistoryItem {
  favoriteId: string
  addedAt: number
  note?: string
}

export interface FavoritesStorage {
  items: FavoriteItem[]
  maxItems: number
}
