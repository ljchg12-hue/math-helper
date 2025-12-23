import { useState } from 'react'
import { analyzePrime } from '../lib/electron'
import type { PrimeResult } from '../types'
import { formatError } from '../utils/errorHandler'
import Input from './Input'
import Button from './Button'
import Card from './Card'

export default function PrimeCalculator() {
  const [n, setN] = useState('')
  const [result, setResult] = useState<PrimeResult | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAnalyze = async () => {
    setError('')
    setResult(null)

    const num = parseInt(n)

    if (isNaN(num) || num < 1) {
      setError('양의 정수를 입력해주세요')
      return
    }

    setLoading(true)
    try {
      const res = await analyzePrime(num)
      setResult(res)
    } catch (err) {
      setError(formatError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card title="소수 판정 & 소인수분해">
      <div className="space-y-4">
        <Input
          label="숫자 입력"
          type="number"
          step="1"
          value={n}
          onChange={(e) => setN(e.target.value)}
          placeholder="예: 24"
        />

        <Button onClick={handleAnalyze} disabled={loading} className="w-full">
          {loading ? '분석 중...' : '분석하기'}
        </Button>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-3">
            <div className={`p-4 rounded-lg border ${result.isPrime ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}`}>
              <p className={`text-lg font-semibold ${result.isPrime ? 'text-green-900' : 'text-blue-900'}`}>
                {result.isPrime ? '소수입니다' : '합성수입니다'}
              </p>
              {result.factors.length > 0 && (
                <p className="text-sm text-gray-700 mt-2">
                  소인수분해: {result.factors.join(' × ')}
                </p>
              )}
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-700 mb-2">분석 과정:</p>
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
