import { useState } from 'react'
import { solveQuadratic } from '../lib/electron'
import type { QuadraticResult } from '../types'
import { formatError } from '../utils/errorHandler'
import Input from './Input'
import Button from './Button'
import Card from './Card'

export default function QuadraticCalculator() {
  const [a, setA] = useState('')
  const [b, setB] = useState('')
  const [c, setC] = useState('')
  const [result, setResult] = useState<QuadraticResult | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSolve = async () => {
    setError('')
    setResult(null)

    const aNum = parseFloat(a)
    const bNum = parseFloat(b)
    const cNum = parseFloat(c)

    if (isNaN(aNum) || isNaN(bNum) || isNaN(cNum)) {
      setError('숫자를 입력해주세요')
      return
    }

    setLoading(true)
    try {
      const res = await solveQuadratic({ a: aNum, b: bNum, c: cNum })
      setResult(res)
    } catch (err) {
      setError(formatError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card title="이차방정식 (ax² + bx + c = 0)">
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <Input
            label="a"
            type="number"
            step="any"
            value={a}
            onChange={(e) => setA(e.target.value)}
            placeholder="1"
          />
          <Input
            label="b"
            type="number"
            step="any"
            value={b}
            onChange={(e) => setB(e.target.value)}
            placeholder="-5"
          />
          <Input
            label="c"
            type="number"
            step="any"
            value={c}
            onChange={(e) => setC(e.target.value)}
            placeholder="6"
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
            <div className={`p-4 rounded-lg border ${result.has_real_roots ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
              {result.has_real_roots ? (
                result.x1 === result.x2 ? (
                  <p className="text-lg font-semibold text-green-900">
                    중근: x = {result.x1?.toFixed(4)}
                  </p>
                ) : (
                  <div className="text-green-900">
                    <p className="text-lg font-semibold">두 개의 실근:</p>
                    <p>x₁ = {result.x1?.toFixed(4)}</p>
                    <p>x₂ = {result.x2?.toFixed(4)}</p>
                  </div>
                )
              ) : (
                <p className="text-lg font-semibold text-yellow-900">
                  실근이 없습니다 (판별식 D = {result.discriminant.toFixed(4)} &lt; 0)
                </p>
              )}
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
