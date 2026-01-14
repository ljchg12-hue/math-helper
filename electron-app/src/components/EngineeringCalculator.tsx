import { useState } from 'react'
import Card from './Card'
import UniversalCalculator from './UniversalCalculator'

interface EngineeringCalculatorProps {
  initialInput?: string
  onInputUsed?: () => void
}

type CalculationMode = 'smart' | 'all' | 'single'

export default function EngineeringCalculator({ initialInput, onInputUsed }: EngineeringCalculatorProps = {}) {
  const [calculationMode, setCalculationMode] = useState<CalculationMode>('smart')
  const [selectedSingleMode, setSelectedSingleMode] = useState<string>('evaluate')

  // 모드에 따른 forceMode 결정
  const getForceMode = () => {
    if (calculationMode === 'all') return 'calculateAll' as const
    if (calculationMode === 'single') return selectedSingleMode as any
    return 'calculateAll' as const // smart 모드도 calculateAll 사용 (shouldRunMode가 필터링)
  }

  return (
    <div className="space-y-4">
      {/* 공학 계산기 설명 */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="text-4xl">🔬</div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">공학용 계산기</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                mathjs + nerdamer 기반 범용 수식 파서 - 스마트 연산 필터링 적용
              </p>
            </div>
          </div>

          {/* ✅ v1.0.29: 계산 모드 선택 UI */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">🎯 계산 모드 선택</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCalculationMode('smart')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  calculationMode === 'smart'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                🧠 스마트 (추천)
              </button>
              <button
                onClick={() => setCalculationMode('all')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  calculationMode === 'all'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                📊 전체 연산
              </button>
              <button
                onClick={() => setCalculationMode('single')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  calculationMode === 'single'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                🎯 단일 모드
              </button>
            </div>

            {/* 단일 모드 선택 시 세부 모드 선택 */}
            {calculationMode === 'single' && (
              <div className="mt-3 flex flex-wrap gap-1">
                {[
                  { id: 'evaluate', label: '🧮 계산', desc: '수식 평가' },
                  { id: 'solve', label: '📐 풀이', desc: '방정식 풀기' },
                  { id: 'differentiate', label: '∂ 미분', desc: '도함수' },
                  { id: 'integrate', label: '∫ 적분', desc: '부정적분' },
                  { id: 'simplify', label: '✨ 간단히', desc: '수식 간소화' },
                  { id: 'factor', label: '🔢 인수분해', desc: '다항식 분해' },
                  { id: 'expand', label: '📖 전개', desc: '수식 전개' },
                ].map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => setSelectedSingleMode(mode.id)}
                    className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                      selectedSingleMode === mode.id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500'
                    }`}
                    title={mode.desc}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            )}

            {/* 모드 설명 */}
            <p className="mt-2 text-xs text-blue-700 dark:text-blue-400">
              {calculationMode === 'smart' && '💡 입력 수식을 분석하여 적절한 연산만 자동 실행합니다.'}
              {calculationMode === 'all' && '⚠️ 모든 연산을 시도합니다 (일부 에러 발생 가능).'}
              {calculationMode === 'single' && `🎯 선택한 "${selectedSingleMode}" 연산만 실행합니다.`}
            </p>
          </div>

          {/* 지원 기능 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="px-3 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-xs">
              <div className="font-semibold text-blue-900 dark:text-blue-300">계산 모드</div>
              <div className="text-blue-700 dark:text-blue-400">평가, 방정식 풀이</div>
            </div>
            <div className="px-3 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-xs">
              <div className="font-semibold text-green-900 dark:text-green-300">대수</div>
              <div className="text-green-700 dark:text-green-400">인수분해, 전개, 간단히</div>
            </div>
            <div className="px-3 py-2 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg text-xs">
              <div className="font-semibold text-purple-900 dark:text-purple-300">미적분</div>
              <div className="text-purple-700 dark:text-purple-400">미분, 적분, 극한</div>
            </div>
            <div className="px-3 py-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg text-xs">
              <div className="font-semibold text-orange-900 dark:text-orange-300">고급</div>
              <div className="text-orange-700 dark:text-orange-400">행렬, 통계, 벡터</div>
            </div>
          </div>

          {/* 빠른 예제 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">💡 빠른 예제:</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <div className="px-2 py-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded font-mono text-xs text-gray-700 dark:text-gray-300">
                2x + 3 = 7
              </div>
              <div className="px-2 py-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded font-mono text-xs text-gray-700 dark:text-gray-300">
                x^2 - 5x + 6
              </div>
              <div className="px-2 py-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded font-mono text-xs text-gray-700 dark:text-gray-300">
                sin(pi/6)
              </div>
              <div className="px-2 py-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded font-mono text-xs text-gray-700 dark:text-gray-300">
                det([[1,2],[3,4]])
              </div>
              <div className="px-2 py-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded font-mono text-xs text-gray-700 dark:text-gray-300">
                mean([1,2,3,4,5])
              </div>
              <div className="px-2 py-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded font-mono text-xs text-gray-700 dark:text-gray-300">
                2^10
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 범용 계산기 - ✅ v1.0.29: 스마트 모드 필터링 적용 */}
      <UniversalCalculator
        initialInput={initialInput}
        onInputUsed={onInputUsed}
        forceMode={getForceMode()}
      />
    </div>
  )
}
