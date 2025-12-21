import { useState } from 'react'
import { numericalDerivative } from '../lib/electron'
import type { CalculusResult } from '../types'
import Input from './Input'
import Button from './Button'
import Card from './Card'

export default function CalculusCalculator() {
  const [func, setFunc] = useState('')
  const [x, setX] = useState('')
  const [result, setResult] = useState<CalculusResult | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCalculate = async () => {
    setError('')
    setResult(null)

    if (!func.trim()) {
      setError('함수를 입력해주세요')
      return
    }

    const xNum = parseFloat(x)

    if (isNaN(xNum)) {
      setError('x 값을 입력해주세요')
      return
    }

    setLoading(true)
    try {
      const res = await numericalDerivative(func, xNum)
      setResult(res)
    } catch (err) {
      setError('함수 형식이 올바르지 않습니다')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card title="미분 계산기">
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
          함수 입력 예시: x*x + 2*x + 1, Math.sin(x), Math.exp(x)
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            함수 f(x)
          </label>
          <input
            type="text"
            value={func}
            onChange={(e) => setFunc(e.target.value)}
            placeholder="x*x + 2*x + 1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
          />
        </div>

        <Input
          label="x 값"
          type="number"
          step="any"
          value={x}
          onChange={(e) => setX(e.target.value)}
          placeholder="2"
        />

        <Button onClick={handleCalculate} disabled={loading} className="w-full">
          {loading ? '계산 중...' : '미분하기'}
        </Button>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-3">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-lg font-semibold text-green-900 font-mono">
                {result.result}
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

            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
              ⚠️ 수치 미분은 근사값입니다 (h=0.0001 사용)
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
