import { useState } from 'react'
import { Calculator, BookOpen, FileText, Settings } from 'lucide-react'
import CategoryCalculator from './components/CategoryCalculator'
import ConceptGuide from './components/ConceptGuide'
import ProblemGenerator from './components/ProblemGenerator'
import SettingsPanel from './components/SettingsPanel'

type Tab = 'calculator' | 'concept' | 'problems' | 'settings'

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('calculator')

  const tabs = [
    { id: 'calculator' as Tab, label: '계산기', icon: Calculator },
    { id: 'concept' as Tab, label: '개념', icon: BookOpen },
    { id: 'problems' as Tab, label: '기출문제', icon: FileText },
    { id: 'settings' as Tab, label: '설정', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* 헤더 */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Calculator className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                수학 도우미
              </h1>
              <p className="text-xs text-gray-500">수식 파서 기반 범용 계산기</p>
            </div>
          </div>
        </div>
      </header>

      {/* 탭 네비게이션 */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-gray-200 sticky top-[73px] z-10">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex gap-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`
                  flex items-center gap-2 px-4 py-3 font-medium transition-all
                  ${activeTab === id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
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
        {activeTab === 'calculator' && <CategoryCalculator />}
        {activeTab === 'concept' && <ConceptGuide />}
        {activeTab === 'problems' && <ProblemGenerator />}
        {activeTab === 'settings' && <SettingsPanel />}
      </main>
    </div>
  )
}
