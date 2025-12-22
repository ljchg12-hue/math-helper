import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Search } from 'lucide-react'
import { formulas, formulaCategories } from '../data/formulas'
import FormulaCard from './FormulaCard'

interface FormulaLibraryProps {
  onInsertFormula?: (formula: string) => void
}

export default function FormulaLibrary({ onInsertFormula }: FormulaLibraryProps) {
  const { t, i18n } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const filteredFormulas = useMemo(() => {
    return formulas.filter(formula => {
      // 카테고리 필터
      if (selectedCategory !== 'all' && formula.category !== selectedCategory) {
        return false
      }

      // 검색 필터
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          formula.name.toLowerCase().includes(query) ||
          formula.description.toLowerCase().includes(query) ||
          formula.formula.toLowerCase().includes(query)
        )
      }

      return true
    })
  }, [searchQuery, selectedCategory])

  const handleInsert = (formulaText: string) => {
    if (onInsertFormula) {
      onInsertFormula(formulaText)
    }
  }

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {t('formulas.title')}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {t('formulas.subtitle')}
        </p>

        {/* 검색 & 필터 */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* 검색 */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('formulas.searchPlaceholder')}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
            />
          </div>

          {/* 카테고리 필터 */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
          >
            <option value="all">{t('formulas.allCategories')}</option>
            {formulaCategories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {i18n.language === 'ko' ? cat.name : cat.nameEn}
              </option>
            ))}
          </select>
        </div>

        {/* 결과 카운트 */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
          {t('formulas.resultCount', { count: filteredFormulas.length })}
        </p>
      </div>

      {/* 공식 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFormulas.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">
              {t('formulas.noResults')}
            </p>
          </div>
        ) : (
          filteredFormulas.map(formula => (
            <FormulaCard
              key={formula.id}
              formula={formula}
              onInsert={handleInsert}
            />
          ))
        )}
      </div>
    </div>
  )
}
