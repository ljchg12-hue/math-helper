import { useState } from 'react'
import { solveSimultaneous } from '../lib/electron'
import type { SimultaneousResult } from '../types'
import Input from './Input'
import Button from './Button'
import Card from './Card'

export default function SimultaneousCalculator() {
  const [a1, setA1] = useState('')
  const [b1, setB1] = useState('')
  const [c1, setC1] = useState('')
  const [a2, setA2] = useState('')
  const [b2, setB2] = useState('')
  const [c2, setC2] = useState('')

  const [result, setResult] = useState<SimultaneousResult | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSolve = async () => {
    setError('')
    setResult(null)

    const a1Num = parseFloat(a1)
    const b1Num = parseFloat(b1)
    const c1Num = parseFloat(c1)
    const a2Num = parseFloat(a2)
    const b2Num = parseFloat(b2)
    const c2Num = parseFloat(c2)

    if (
      isNaN(a1Num) || isNaN(b1Num) || isNaN(c1Num) ||
      isNaN(a2Num) || isNaN(b2Num) || isNaN(c2Num)
    ) {
      setError('모든 계수를 입력해주세요')
      return
    }

    setLoading(true)
    try {
      const res = await solveSimultaneous({
        a1: a1Num,
        b1: b1Num,
        c1: c1Num,
        a2: a2Num,
        b2: b2Num,
        c2: c2Num
      })
      setResult(res)
    } catch (err) {
      setError(err as string)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card title="연립방정식 풀이">
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            두 개의 일차방정식을 풀어드립니다
          </p>
          <div className="mt-2 font-mono text-sm text-blue-900">
            <div>a₁x + b₁y = c₁</div>
            <div>a₂x + b₂y = c₂</div>
          </div>
        </div>

        {/* 첫 번째 방정식 */}
        <div className="space-y-2">
          <p className="font-medium text-gray-700">첫 번째 방정식 (①)</p>
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="a₁"
              type="number"
              step="any"
              value={a1}
              onChange={(e) => setA1(e.target.value)}
              placeholder="예: 2"
            />
            <Input
              label="b₁"
              type="number"
              step="any"
              value={b1}
              onChange={(e) => setB1(e.target.value)}
              placeholder="예: 3"
            />
            <Input
              label="c₁"
              type="number"
              step="any"
              value={c1}
              onChange={(e) => setC1(e.target.value)}
              placeholder="예: 13"
            />
          </div>
        </div>

        {/* 두 번째 방정식 */}
        <div className="space-y-2">
          <p className="font-medium text-gray-700">두 번째 방정식 (②)</p>
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="a₂"
              type="number"
              step="any"
              value={a2}
              onChange={(e) => setA2(e.target.value)}
              placeholder="예: 4"
            />
            <Input
              label="b₂"
              type="number"
              step="any"
              value={b2}
              onChange={(e) => setB2(e.target.value)}
              placeholder="예: -1"
            />
            <Input
              label="c₂"
              type="number"
              step="any"
              value={c2}
              onChange={(e) => setC2(e.target.value)}
              placeholder="예: 5"
            />
          </div>
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
            {result.solution_type === 'unique' && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-lg font-semibold text-green-900 mb-2">
                  유일한 해
                </p>
                <div className="text-green-800">
                  <p>x = {result.x}</p>
                  <p>y = {result.y}</p>
                </div>
              </div>
            )}

            {result.solution_type === 'infinite' && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-lg font-semibold text-yellow-900">
                  해가 무수히 많습니다
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  두 식이 같은 직선을 나타냅니다
                </p>
              </div>
            )}

            {result.solution_type === 'none' && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-lg font-semibold text-red-900">
                  해가 없습니다
                </p>
                <p className="text-sm text-red-700 mt-1">
                  두 식이 평행한 직선입니다
                </p>
              </div>
            )}

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-700 mb-2">풀이 과정:</p>
              <ol className="space-y-1 list-decimal list-inside text-gray-600">
                {result.steps.map((step, i) => (
                  <li key={i} className="whitespace-pre-wrap">{step}</li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
