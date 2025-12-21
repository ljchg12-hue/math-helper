import { useState } from 'react'
import { matrixOperation } from '../lib/electron'
import type { MatrixResult } from '../types'
import Button from './Button'
import Card from './Card'

export default function MatrixCalculator() {
  const [matrix1, setMatrix1] = useState('1,2;3,4')
  const [matrix2, setMatrix2] = useState('5,6;7,8')
  const [operation, setOperation] = useState('add')
  const [result, setResult] = useState<MatrixResult | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const parseMatrix = (str: string): number[][] => {
    return str.split(';').map(row =>
      row.split(',').map(val => parseFloat(val.trim()))
    )
  }

  const handleCalculate = async () => {
    setError('')
    setResult(null)

    try {
      const m1 = parseMatrix(matrix1)
      const m2 = parseMatrix(matrix2)

      if (m1.some(row => row.some(val => isNaN(val))) ||
          m2.some(row => row.some(val => isNaN(val)))) {
        setError('올바른 숫자를 입력해주세요')
        return
      }

      if (operation !== 'multiply' && m1.length !== m2.length) {
        setError('덧셈/뺄셈은 같은 크기의 행렬이어야 합니다')
        return
      }

      if (operation === 'multiply' && m1[0].length !== m2.length) {
        setError('곱셈은 첫 번째 행렬의 열 수와 두 번째 행렬의 행 수가 같아야 합니다')
        return
      }

      setLoading(true)
      const res = await matrixOperation(m1, m2, operation)
      setResult(res)
    } catch (err) {
      setError(err as string)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card title="행렬 연산">
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
          행렬 입력 형식: 1,2;3,4 (쉼표로 열, 세미콜론으로 행 구분)
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            첫 번째 행렬
          </label>
          <input
            type="text"
            value={matrix1}
            onChange={(e) => setMatrix1(e.target.value)}
            placeholder="1,2;3,4"
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
            두 번째 행렬
          </label>
          <input
            type="text"
            value={matrix2}
            onChange={(e) => setMatrix2(e.target.value)}
            placeholder="5,6;7,8"
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
              <p className="text-lg font-semibold text-green-900 mb-2">결과:</p>
              <div className="font-mono text-sm">
                {result.result.map((row, i) => (
                  <div key={i}>[{row.map(val => val.toFixed(2)).join(', ')}]</div>
                ))}
              </div>
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
