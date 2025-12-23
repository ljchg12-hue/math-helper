import { useState } from 'react'
import { calculateProbability } from '../lib/electron'
import type { ProbabilityResult } from '../types'
import { formatError } from '../utils/errorHandler'
import Input from './Input'
import Button from './Button'
import Card from './Card'

export default function ProbabilityCalculator() {
  const [favorable, setFavorable] = useState('')
  const [total, setTotal] = useState('')
  const [result, setResult] = useState<ProbabilityResult | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCalculate = async () => {
    setError('')
    setResult(null)

    const fav = parseFloat(favorable)
    const tot = parseFloat(total)

    if (isNaN(fav) || isNaN(tot)) {
      setError('숫자를 입력해주세요')
      return
    }

    if (tot <= 0) {
      setError('전체 경우의 수는 0보다 커야 합니다')
      return
    }

    if (fav < 0 || fav > tot) {
      setError('유리한 경우의 수는 0 이상 전체 이하여야 합니다')
      return
    }

    setLoading(true)
    try {
      const res = await calculateProbability(fav, tot)
      setResult(res)
    } catch (err) {
      setError(formatError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card title="확률 계산기">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="유리한 경우의 수"
            type="number"
            step="1"
            value={favorable}
            onChange={(e) => setFavorable(e.target.value)}
            placeholder="예: 3"
          />
          <Input
            label="전체 경우의 수"
            type="number"
            step="1"
            value={total}
            onChange={(e) => setTotal(e.target.value)}
            placeholder="예: 6"
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
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-lg font-semibold text-green-900">
                확률: {result.probability.toFixed(4)}
              </p>
              <p className="text-sm text-green-700 mt-1">
                = {result.favorable}/{result.total}
                {result.probability <= 1 && ` ≈ ${(result.probability * 100).toFixed(2)}%`}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-700 mb-2">계산 과정:</p>
              <ol className="space-y-1 list-decimal list-inside text-gray-600">
                {result.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
