import { HistoryItem } from '../types/history'

export function validateHistoryItem(item: any): item is HistoryItem {
  return (
    typeof item === 'object' &&
    item !== null &&
    typeof item.id === 'string' &&
    typeof item.timestamp === 'number' &&
    typeof item.mode === 'string' &&
    typeof item.modeLabel === 'string' &&
    typeof item.input === 'string' &&
    typeof item.result === 'string'
  )
}

export function importFromJSON(jsonString: string): HistoryItem[] {
  try {
    const data = JSON.parse(jsonString)

    if (!Array.isArray(data)) {
      throw new Error('Invalid format: Expected an array')
    }

    const validItems = data.filter(validateHistoryItem)

    if (validItems.length === 0) {
      throw new Error('No valid history items found')
    }

    return validItems
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Invalid JSON format')
    }
    throw error
  }
}

export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const text = e.target?.result as string
      resolve(text)
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsText(file)
  })
}
