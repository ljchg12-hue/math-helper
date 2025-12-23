import { useState } from 'react'
import { vectorOperation } from '../lib/electron'
import type { VectorResult } from '../types'
import { formatError } from '../utils/errorHandler'
import Button from './Button'
import Card from './Card'

export default function VectorCalculator() {
  const [vector1, setVector1] = useState('1,2,3')
  const [vector2, setVector2] = useState('4,5,6')
  const [operation, setOperation] = useState('add')
  const [result, setResult] = useState<VectorResult | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const parseVector = (str: string): number[] => {
    return str.split(',').map(val => parseFloat(val.trim()))
  }

  const handleCalculate = async () => {
    setError('')
    setResult(null)

    try {
      const v1 = parseVector(vector1)
      const v2 = parseVector(vector2)

      if (v1.some(val => isNaN(val)) || v2.some(val => isNaN(val))) {
        setError('올바른 숫자를 입력해주세요')
        return
      }

      if (operation !== 'magnitude' && v1.length !== v2.length) {
        setError('두 벡터의 차원이 같아야 합니다')
        return
      }

      setLoading(true)
      const res = await vectorOperation(v1, v2, operation)
      setResult(res)
    } catch (err) {
      setError(formatError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card title="벡터 연산">
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
          벡터 입력 형식: 1,2,3 (쉼표로 성분 구분)
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            첫 번째 벡터
          </label>
          <input
            type="text"
            value={vector1}
            onChange={(e) => setVector1(e.target.value)}
            placeholder="1,2,3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setOperation('add')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              operation === 'add' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            덧셈 (+)
          </button>
          <button
            onClick={() => setOperation('subtract')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              operation === 'subtract' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            뺄셈 (-)
          </button>
          <button
            onClick={() => setOperation('dot')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              operation === 'dot' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            내적 (·)
          </button>
          <button
            onClick={() => setOperation('magnitude')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              operation === 'magnitude' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            크기 (|v|)
          </button>
        </div>

        {operation !== 'magnitude' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              두 번째 벡터
            </label>
            <input
              type="text"
              value={vector2}
              onChange={(e) => setVector2(e.target.value)}
              placeholder="4,5,6"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
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
                {operation === 'magnitude'
                  ? `크기: ${result.magnitude?.toFixed(4)}`
                  : operation === 'dot'
                  ? `내적: ${result.result[0].toFixed(4)}`
                  : `결과: [${result.result.map(v => v.toFixed(2)).join(', ')}]`
                }
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
