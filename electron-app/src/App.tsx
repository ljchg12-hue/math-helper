import { useState } from 'react'
import { Calculator, BookOpen, FileText, Settings, BookMarked } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import CategoryCalculator from './components/CategoryCalculator'
import EngineeringCalculator from './components/EngineeringCalculator'
import ConceptGuide from './components/ConceptGuide'
import ProblemGenerator from './components/ProblemGenerator'
import SettingsPanel from './components/SettingsPanel'
import FormulaLibrary from './components/FormulaLibrary'
import LanguageSwitcher from './components/LanguageSwitcher'
import ThemeToggle from './components/ThemeToggle'
import { ThemeProvider } from './contexts/ThemeContext'

type Tab = 'calculator' | 'concept' | 'problems' | 'formulas' | 'settings'
type CalculatorMode = 'category' | 'engineering'

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('calculator')
  const [calculatorMode, setCalculatorMode] = useState<CalculatorMode>('category')
  const [pendingFormulaInput, setPendingFormulaInput] = useState<string>('')
  const { t } = useTranslation()

  const handleFormulaInsert = (formula: string) => {
    setPendingFormulaInput(formula)
    setActiveTab('calculator')
  }

  const tabs = [
    { id: 'calculator' as Tab, label: t('tabs.calculator'), icon: Calculator },
    { id: 'formulas' as Tab, label: t('tabs.formulas'), icon: BookMarked },
    { id: 'concept' as Tab, label: t('tabs.concept'), icon: BookOpen },
    { id: 'problems' as Tab, label: t('tabs.problems'), icon: FileText },
    { id: 'settings' as Tab, label: t('tabs.settings'), icon: Settings },
  ]

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
        {/* 헤더 */}
        <header className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                <Calculator className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  {t('app.title')}
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t('app.subtitle')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </header>

        {/* 탭 네비게이션 */}
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-[73px] z-10">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex gap-1 overflow-x-auto">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`
                  flex items-center gap-2 px-4 py-3 font-medium transition-all whitespace-nowrap
                  ${activeTab === id
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-900/30'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

        {/* 메인 콘텐츠 */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          {activeTab === 'calculator' && (
            <div className="space-y-4">
              {/* 계산기 모드 선택 */}
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => setCalculatorMode('category')}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    calculatorMode === 'category'
                      ? 'bg-blue-600 text-white shadow-lg scale-105'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  📚 카테고리별 계산기
                </button>
                <button
                  onClick={() => setCalculatorMode('engineering')}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    calculatorMode === 'engineering'
                      ? 'bg-blue-600 text-white shadow-lg scale-105'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  🔬 공학용 계산기
                </button>
              </div>

              {/* 선택된 모드 표시 */}
              {calculatorMode === 'category' ? (
                <CategoryCalculator
                  initialInput={pendingFormulaInput}
                  onInputUsed={() => setPendingFormulaInput('')}
                />
              ) : (
                <EngineeringCalculator
                  initialInput={pendingFormulaInput}
                  onInputUsed={() => setPendingFormulaInput('')}
                />
              )}
            </div>
          )}
          {activeTab === 'formulas' && <FormulaLibrary onInsertFormula={handleFormulaInsert} />}
          {activeTab === 'concept' && <ConceptGuide />}
          {activeTab === 'problems' && <ProblemGenerator />}
          {activeTab === 'settings' && <SettingsPanel />}
        </main>
      </div>
    </ThemeProvider>
  )
}
