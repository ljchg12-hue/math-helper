import { useState } from 'react'
import { solveInequality } from '../lib/electron'
import type { InequalityResult } from '../types'
import { formatError } from '../utils/errorHandler'
import Input from './Input'
import Button from './Button'
import Card from './Card'

export default function InequalityCalculator() {
  const [a, setA] = useState('')
  const [b, setB] = useState('')
  const [operator, setOperator] = useState('>')
  const [result, setResult] = useState<InequalityResult | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSolve = async () => {
    setError('')
    setResult(null)

    const aNum = parseFloat(a)
    const bNum = parseFloat(b)

    if (isNaN(aNum) || isNaN(bNum)) {
      setError('계수를 입력해주세요')
      return
    }

    setLoading(true)
    try {
      const res = await solveInequality(aNum, bNum, operator)
      setResult(res)
    } catch (err) {
      setError(formatError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card title="일차부등식">
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
          ax + b {operator} 0 형태의 부등식을 풉니다
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="a (계수)"
            type="number"
            step="any"
            value={a}
            onChange={(e) => setA(e.target.value)}
            placeholder="2"
          />
          <Input
            label="b (상수)"
            type="number"
            step="any"
            value={b}
            onChange={(e) => setB(e.target.value)}
            placeholder="-4"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            부등호 선택
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setOperator('>')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                operator === '>' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              &gt; (크다)
            </button>
            <button
              onClick={() => setOperator('<')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                operator === '<' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              &lt; (작다)
            </button>
          </div>
        </div>

        <Button onClick={handleSolve} disabled={loading} className="w-full">
          {loading ? '풀이 중...' : '풀이하기'}
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
                해: {result.solution}
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
