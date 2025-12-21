import { useState } from 'react'
import { Calculator } from 'lucide-react'
import LinearCalculator from './components/LinearCalculator'
import QuadraticCalculator from './components/QuadraticCalculator'
import GeometryCalculator from './components/GeometryCalculator'
import SimultaneousCalculator from './components/SimultaneousCalculator'
import StatisticsCalculator from './components/StatisticsCalculator'
import PrimeCalculator from './components/PrimeCalculator'
import FactorizationCalculator from './components/FactorizationCalculator'
import PolynomialCalculator from './components/PolynomialCalculator'
import InequalityCalculator from './components/InequalityCalculator'
import ProbabilityCalculator from './components/ProbabilityCalculator'
import ExponentCalculator from './components/ExponentCalculator'
import SequenceCalculator from './components/SequenceCalculator'
import MatrixCalculator from './components/MatrixCalculator'
import TrigonometryCalculator from './components/TrigonometryCalculator'
import VectorCalculator from './components/VectorCalculator'
import ComplexCalculator from './components/ComplexCalculator'
import CalculusCalculator from './components/CalculusCalculator'

type Category = 'basic' | 'algebra' | 'stats' | 'geometry' | 'functions'

export default function App() {
  const [activeTab, setActiveTab] = useState<Category>('basic')

  const categories = [
    { id: 'basic' as Category, name: '기초 수학', count: 5 },
    { id: 'algebra' as Category, name: '대수', count: 4 },
    { id: 'stats' as Category, name: '통계 & 확률', count: 2 },
    { id: 'geometry' as Category, name: '기하 & 벡터', count: 3 },
    { id: 'functions' as Category, name: '함수', count: 3 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* 헤더 */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Calculator className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                수학 도우미
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">종합 수학 계산기 - 총 17개</p>
            </div>
          </div>
        </div>
      </header>

      {/* 카테고리 탭 */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-gray-200 sticky top-[100px] z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-2 overflow-x-auto py-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveTab(category.id)}
                className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all ${
                  activeTab === category.id
                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
                }`}
              >
                {category.name}
                <span className="ml-2 text-xs opacity-75">({category.count})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 기초 수학 */}
          {activeTab === 'basic' && (
            <>
              <LinearCalculator />
              <QuadraticCalculator />
              <SimultaneousCalculator />
              <InequalityCalculator />
              <FactorizationCalculator />
            </>
          )}

          {/* 대수 */}
          {activeTab === 'algebra' && (
            <>
              <PolynomialCalculator />
              <SequenceCalculator />
              <ExponentCalculator />
              <ComplexCalculator />
            </>
          )}

          {/* 통계 & 확률 */}
          {activeTab === 'stats' && (
            <>
              <StatisticsCalculator />
              <ProbabilityCalculator />
            </>
          )}

          {/* 기하 & 벡터 */}
          {activeTab === 'geometry' && (
            <>
              <GeometryCalculator />
              <VectorCalculator />
              <MatrixCalculator />
            </>
          )}

          {/* 함수 */}
          {activeTab === 'functions' && (
            <>
              <TrigonometryCalculator />
              <CalculusCalculator />
              <PrimeCalculator />
            </>
          )}
        </div>
      </main>

      {/* 푸터 */}
      <footer className="mt-16 pb-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-gray-500">
          <p className="font-medium mb-2">수학 도우미 v1.0</p>
          <p>
            기초수학(5) | 대수(4) | 통계&확률(2) | 기하&벡터(3) | 함수(3)
          </p>
        </div>
      </footer>
    </div>
  )
}
