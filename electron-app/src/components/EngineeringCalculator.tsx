import Card from './Card'
import UniversalCalculator from './UniversalCalculator'

interface EngineeringCalculatorProps {
  initialInput?: string
  onInputUsed?: () => void
}

export default function EngineeringCalculator({ initialInput, onInputUsed }: EngineeringCalculatorProps = {}) {
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
                mathjs + nerdamer 기반 범용 수식 파서 - 모든 수학 연산 지원
              </p>
            </div>
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

      {/* 범용 계산기 */}
      <UniversalCalculator
        initialInput={initialInput}
        onInputUsed={onInputUsed}
      />
    </div>
  )
}
