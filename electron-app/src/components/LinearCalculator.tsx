import { useState } from 'react'
import { solveLinear } from '../lib/electron'
import type { LinearResult } from '../types'
import Input from './Input'
import Button from './Button'
import Card from './Card'

export default function LinearCalculator() {
  const [a, setA] = useState('')
  const [b, setB] = useState('')
  const [result, setResult] = useState<LinearResult | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSolve = async () => {
    setError('')
    setResult(null)

    const aNum = parseFloat(a)
    const bNum = parseFloat(b)

    if (isNaN(aNum) || isNaN(bNum)) {
      setError('숫자를 입력해주세요')
      return
    }

    setLoading(true)
    try {
      const res = await solveLinear({ a: aNum, b: bNum })
      setResult(res)
    } catch (err) {
      setError(err as string)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card title="일차방정식 (ax + b = 0)">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="a (계수)"
            type="number"
            step="any"
            value={a}
            onChange={(e) => setA(e.target.value)}
            placeholder="예: 2"
          />
          <Input
            label="b (상수)"
            type="number"
            step="any"
            value={b}
            onChange={(e) => setB(e.target.value)}
            placeholder="예: -4"
          />
        </div>

        <Button onClick={handleSolve} disabled={loading} className="w-full">
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
                답: x = {result.x.toFixed(4)}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-700 mb-2">풀이 과정:</p>
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
