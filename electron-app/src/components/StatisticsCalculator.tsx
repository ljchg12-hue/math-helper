import { useState } from 'react'
import { calculateStatistics } from '../lib/electron'
import type { StatisticsResult } from '../types'
import { formatError } from '../utils/errorHandler'
import Button from './Button'
import Card from './Card'

export default function StatisticsCalculator() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<StatisticsResult | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCalculate = async () => {
    setError('')
    setResult(null)

    const numbers = input.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n))

    if (numbers.length < 2) {
      setError('최소 2개 이상의 숫자를 입력해주세요')
      return
    }

    setLoading(true)
    try {
      const res = await calculateStatistics(numbers)
      setResult(res)
    } catch (err) {
      setError(formatError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card title="통계 계산기">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            데이터 입력 (쉼표로 구분)
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="예: 10, 20, 30, 40, 50"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <Button onClick={handleCalculate} disabled={loading} className="w-full">
          {loading ? '계산 중...' : '계산하기'}
        </Button>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-gray-600">평균</p>
                <p className="text-lg font-semibold text-blue-900">{result.mean.toFixed(4)}</p>
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-gray-600">중앙값</p>
                <p className="text-lg font-semibold text-green-900">{result.median.toFixed(4)}</p>
              </div>
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-sm text-gray-600">분산</p>
                <p className="text-lg font-semibold text-purple-900">{result.variance.toFixed(4)}</p>
              </div>
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                <p className="text-sm text-gray-600">표준편차</p>
                <p className="text-lg font-semibold text-indigo-900">{result.stdDev.toFixed(4)}</p>
              </div>
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-gray-600">범위</p>
                <p className="text-lg font-semibold text-yellow-900">{result.range.toFixed(4)}</p>
              </div>
              <div className="p-3 bg-pink-50 border border-pink-200 rounded-lg">
                <p className="text-sm text-gray-600">최빈값</p>
                <p className="text-lg font-semibold text-pink-900">{result.mode.join(', ')}</p>
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
              <p>최소값: {result.min} | 최대값: {result.max} | 개수: {result.count}</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
