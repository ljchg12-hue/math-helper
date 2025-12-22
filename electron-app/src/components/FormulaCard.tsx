import { Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { Formula } from '../data/formulas'

interface FormulaCardProps {
  formula: Formula
  onInsert: (formulaText: string) => void
}

export default function FormulaCard({ formula, onInsert }: FormulaCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(formula.formula)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleInsert = () => {
    onInsert(formula.formula)
  }

  return (
    <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-blue-400 dark:hover:border-blue-500 transition-all hover:shadow-md">
      {/* 제목 */}
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {formula.name}
      </h3>

      {/* 공식 */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 mb-2 font-mono text-sm text-blue-600 dark:text-blue-400 overflow-x-auto">
        {formula.formula}
      </div>

      {/* 설명 */}
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
        {formula.description}
      </p>

      {/* 변수 */}
      {formula.variables && (
        <p className="text-xs text-gray-500 dark:text-gray-500 mb-3">
          변수: {formula.variables}
        </p>
      )}

      {/* 액션 버튼 */}
      <div className="flex gap-2">
        <button
          onClick={handleInsert}
          className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
        >
          계산기에 입력
        </button>
        <button
          onClick={handleCopy}
          className="px-3 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
          title="복사"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    </div>
  )
}
