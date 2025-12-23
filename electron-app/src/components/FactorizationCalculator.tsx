import { useState } from 'react'
import { factorizeQuadratic } from '../lib/electron'
import type { FactorizationResult } from '../types'
import { formatError } from '../utils/errorHandler'
import Input from './Input'
import Button from './Button'
import Card from './Card'

export default function FactorizationCalculator() {
  const [a, setA] = useState('')
  const [b, setB] = useState('')
  const [c, setC] = useState('')
  const [result, setResult] = useState<FactorizationResult | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleFactorize = async () => {
    setError('')
    setResult(null)

    const aNum = parseFloat(a)
    const bNum = parseFloat(b)
    const cNum = parseFloat(c)

    if (isNaN(aNum) || isNaN(bNum) || isNaN(cNum)) {
      setError('모든 계수를 입력해주세요')
      return
    }

    setLoading(true)
    try {
      const res = await factorizeQuadratic(aNum, bNum, cNum)
      setResult(res)
    } catch (err) {
      setError(formatError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card title="이차식 인수분해">
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
          ax² + bx + c 형태의 이차식을 인수분해합니다
        </div>

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

        <Button onClick={handleFactorize} disabled={loading} className="w-full">
          {loading ? '계산 중...' : '인수분해'}
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
                {result.factored}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-700 mb-2">과정:</p>
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
