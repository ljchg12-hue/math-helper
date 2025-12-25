import { useState } from 'react'
import { Calculator, BookOpen, TrendingUp, Settings } from 'lucide-react'
import LinearCalculator from './components/LinearCalculator'
import QuadraticCalculator from './components/QuadraticCalculator'

type Tab = 'calculator' | 'practice' | 'progress' | 'settings'

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('calculator')

  const tabs = [
    { id: 'calculator' as Tab, label: '계산기', icon: Calculator },
    { id: 'practice' as Tab, label: '연습', icon: BookOpen },
    { id: 'progress' as Tab, label: '진도', icon: TrendingUp },
    { id: 'settings' as Tab, label: '설정', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              수학 도우미
            </h1>
          </div>
        </div>
      </header>

      {/* 탭 네비게이션 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex gap-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`
                  flex items-center gap-2 px-4 py-3 font-medium transition-colors
                  ${activeTab === id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
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
          <div className="space-y-6">
            <LinearCalculator />
            <QuadraticCalculator />
          </div>
        )}

        {activeTab === 'practice' && (
          <div className="text-center py-20 text-gray-500">
            연습문제 기능은 곧 추가됩니다
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="text-center py-20 text-gray-500">
            진도 추적 기능은 곧 추가됩니다
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="text-center py-20 text-gray-500">
            설정 기능은 곧 추가됩니다
          </div>
        )}
      </main>
    </div>
  )
}
