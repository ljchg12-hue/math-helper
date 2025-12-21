import { useState } from 'react'
import { calculateSequence } from '../lib/electron'
import type { SequenceResult } from '../types'
import Input from './Input'
import Button from './Button'
import Card from './Card'

export default function SequenceCalculator() {
  const [type, setType] = useState('arithmetic')
  const [a1, setA1] = useState('')
  const [diff, setDiff] = useState('')
  const [n, setN] = useState('')
  const [result, setResult] = useState<SequenceResult | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCalculate = async () => {
    setError('')
    setResult(null)

    const firstTerm = parseFloat(a1)
    const difference = parseFloat(diff)
    const termNum = parseInt(n)

    if (isNaN(firstTerm) || isNaN(difference) || isNaN(termNum)) {
      setError('모든 값을 입력해주세요')
      return
    }

    if (termNum < 1) {
      setError('항 번호는 1 이상이어야 합니다')
      return
    }

    setLoading(true)
    try {
      const res = await calculateSequence(type, firstTerm, difference, termNum)
      setResult(res)
    } catch (err) {
      setError(err as string)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card title="수열">
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => setType('arithmetic')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              type === 'arithmetic' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            등차수열
          </button>
          <button
            onClick={() => setType('geometric')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              type === 'geometric' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            등비수열
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Input
            label="첫째항 (a₁)"
            type="number"
            step="any"
            value={a1}
            onChange={(e) => setA1(e.target.value)}
            placeholder="2"
          />
          <Input
            label={type === 'arithmetic' ? '공차 (d)' : '공비 (r)'}
            type="number"
            step="any"
            value={diff}
            onChange={(e) => setDiff(e.target.value)}
            placeholder={type === 'arithmetic' ? '3' : '2'}
          />
          <Input
            label="항 번호 (n)"
            type="number"
            step="1"
            value={n}
            onChange={(e) => setN(e.target.value)}
            placeholder="5"
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
                제{n}항: {result.term.toFixed(4)}
              </p>
              <p className="text-sm text-green-700 mt-1">
                합계 (S₍ₙ₎): {result.sum.toFixed(4)}
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
