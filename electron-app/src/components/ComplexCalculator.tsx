import { useState } from 'react'
import { complexOperation } from '../lib/electron'
import type { ComplexResult } from '../types'
import Input from './Input'
import Button from './Button'
import Card from './Card'

export default function ComplexCalculator() {
  const [r1, setR1] = useState('')
  const [i1, setI1] = useState('')
  const [r2, setR2] = useState('')
  const [i2, setI2] = useState('')
  const [operation, setOperation] = useState('add')
  const [result, setResult] = useState<ComplexResult | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCalculate = async () => {
    setError('')
    setResult(null)

    const real1 = parseFloat(r1)
    const imag1 = parseFloat(i1)
    const real2 = parseFloat(r2)
    const imag2 = parseFloat(i2)

    if (isNaN(real1) || isNaN(imag1) || isNaN(real2) || isNaN(imag2)) {
      setError('모든 값을 입력해주세요')
      return
    }

    setLoading(true)
    try {
      const res = await complexOperation(real1, imag1, real2, imag2, operation)
      setResult(res)
    } catch (err) {
      setError(err as string)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card title="복소수 연산">
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
          복소수 형태: a + bi (실부 a, 허부 b)
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            첫 번째 복소수
          </label>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="실부 (a)"
              type="number"
              step="any"
              value={r1}
              onChange={(e) => setR1(e.target.value)}
              placeholder="3"
            />
            <Input
              label="허부 (b)"
              type="number"
              step="any"
              value={i1}
              onChange={(e) => setI1(e.target.value)}
              placeholder="4"
            />
          </div>
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
            onClick={() => setOperation('multiply')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              operation === 'multiply' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            곱셈 (×)
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            두 번째 복소수
          </label>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="실부 (a)"
              type="number"
              step="any"
              value={r2}
              onChange={(e) => setR2(e.target.value)}
              placeholder="1"
            />
            <Input
              label="허부 (b)"
              type="number"
              step="any"
              value={i2}
              onChange={(e) => setI2(e.target.value)}
              placeholder="2"
            />
          </div>
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
                결과: {result.real.toFixed(4)} + {result.imaginary.toFixed(4)}i
              </p>
              <p className="text-sm text-green-700 mt-1">
                크기: {result.magnitude.toFixed(4)} | 각도: {(result.angle * 180 / Math.PI).toFixed(2)}°
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
