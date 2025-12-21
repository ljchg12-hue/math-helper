import { useState } from 'react'
import { calculateExponent } from '../lib/electron'
import type { ExponentResult } from '../types'
import Input from './Input'
import Button from './Button'
import Card from './Card'

export default function ExponentCalculator() {
  const [base, setBase] = useState('')
  const [exponent, setExponent] = useState('')
  const [type, setType] = useState('power')
  const [result, setResult] = useState<ExponentResult | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCalculate = async () => {
    setError('')
    setResult(null)

    const b = parseFloat(base)
    const e = parseFloat(exponent)

    if (isNaN(b) || (type !== 'ln' && isNaN(e))) {
      setError('숫자를 입력해주세요')
      return
    }

    if (type === 'ln' && b <= 0) {
      setError('자연로그는 양수만 가능합니다')
      return
    }

    if (type === 'log' && (b <= 0 || b === 1 || e <= 0)) {
      setError('로그는 밑과 진수 모두 양수여야 하며, 밑은 1이 아니어야 합니다')
      return
    }

    setLoading(true)
    try {
      const res = await calculateExponent(b, e, type)
      setResult(res)
    } catch (err) {
      setError(err as string)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card title="지수 & 로그">
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => setType('power')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              type === 'power' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            거듭제곱
          </button>
          <button
            onClick={() => setType('log')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              type === 'log' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            로그
          </button>
          <button
            onClick={() => setType('ln')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              type === 'ln' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            자연로그
          </button>
        </div>

        {type === 'power' && (
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="밑 (base)"
              type="number"
              step="any"
              value={base}
              onChange={(e) => setBase(e.target.value)}
              placeholder="2"
            />
            <Input
              label="지수 (exponent)"
              type="number"
              step="any"
              value={exponent}
              onChange={(e) => setExponent(e.target.value)}
              placeholder="3"
            />
          </div>
        )}

        {type === 'log' && (
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="밑 (base)"
              type="number"
              step="any"
              value={base}
              onChange={(e) => setBase(e.target.value)}
              placeholder="2"
            />
            <Input
              label="진수 (argument)"
              type="number"
              step="any"
              value={exponent}
              onChange={(e) => setExponent(e.target.value)}
              placeholder="8"
            />
          </div>
        )}

        {type === 'ln' && (
          <Input
            label="진수 (argument)"
            type="number"
            step="any"
            value={base}
            onChange={(e) => setBase(e.target.value)}
            placeholder="2.718"
          />
        )}

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
                결과: {result.result.toFixed(4)}
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
