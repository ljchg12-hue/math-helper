import { HistoryItem } from '../types/history'

export function exportToJSON(history: HistoryItem[]): string {
  return JSON.stringify(history, null, 2)
}

export function exportToCSV(history: HistoryItem[]): string {
  if (history.length === 0) {
    return 'timestamp,mode,input,variable,result\n'
  }

  const headers = 'timestamp,mode,input,variable,limitValue,limitDirection,result'
  const rows = history.map(item => {
    const timestamp = new Date(item.timestamp).toISOString()
    const mode = item.mode
    const input = `"${item.input.replace(/"/g, '""')}"` // CSV escape
    const variable = item.variable || ''
    const limitValue = item.limitValue || ''
    const limitDirection = item.limitDirection || ''
    const result = `"${item.result.replace(/"/g, '""')}"`

    return `${timestamp},${mode},${input},${variable},${limitValue},${limitDirection},${result}`
  })

  return [headers, ...rows].join('\n')
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
