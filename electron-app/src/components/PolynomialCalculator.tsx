import { useState } from 'react'
import { polynomialOperation } from '../lib/electron'
import type { PolynomialResult } from '../types'
import { formatError } from '../utils/errorHandler'
import Button from './Button'
import Card from './Card'

export default function PolynomialCalculator() {
  const [poly1, setPoly1] = useState('')
  const [poly2, setPoly2] = useState('')
  const [operation, setOperation] = useState('add')
  const [result, setResult] = useState<PolynomialResult | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCalculate = async () => {
    setError('')
    setResult(null)

    const coeffs1 = poly1.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n))
    const coeffs2 = poly2.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n))

    if (coeffs1.length === 0 || coeffs2.length === 0) {
      setError('두 다항식의 계수를 모두 입력해주세요')
      return
    }

    setLoading(true)
    try {
      const res = await polynomialOperation(coeffs1, coeffs2, operation)
      setResult(res)
    } catch (err) {
      setError(formatError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card title="다항식 연산">
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
          계수를 낮은 차수부터 쉼표로 구분해서 입력<br/>
          예: 3x² + 2x + 1 → 1, 2, 3
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            첫 번째 다항식
          </label>
          <input
            type="text"
            value={poly1}
            onChange={(e) => setPoly1(e.target.value)}
            placeholder="예: 1, 2, 3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setOperation('add')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              operation === 'add' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            덧셈 (+)
          </button>
          <button
            onClick={() => setOperation('subtract')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              operation === 'subtract' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            뺄셈 (-)
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            두 번째 다항식
          </label>
          <input
            type="text"
            value={poly2}
            onChange={(e) => setPoly2(e.target.value)}
            placeholder="예: 2, 1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                결과: {result.result}
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
