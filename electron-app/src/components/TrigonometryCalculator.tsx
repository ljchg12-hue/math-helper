import { useState } from 'react'
import { calculateTrig } from '../lib/electron'
import type { TrigResult } from '../types'
import Input from './Input'
import Button from './Button'
import Card from './Card'

export default function TrigonometryCalculator() {
  const [angle, setAngle] = useState('')
  const [unit, setUnit] = useState('deg')
  const [func, setFunc] = useState('sin')
  const [result, setResult] = useState<TrigResult | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCalculate = async () => {
    setError('')
    setResult(null)

    const angleNum = parseFloat(angle)

    if (isNaN(angleNum)) {
      setError('각도를 입력해주세요')
      return
    }

    setLoading(true)
    try {
      const res = await calculateTrig(angleNum, unit, func)
      setResult(res)
    } catch (err) {
      setError(err as string)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card title="삼각함수">
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => setUnit('deg')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              unit === 'deg' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            도 (°)
          </button>
          <button
            onClick={() => setUnit('rad')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              unit === 'rad' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            라디안 (rad)
          </button>
        </div>

        <Input
          label={`각도 ${unit === 'deg' ? '(°)' : '(rad)'}`}
          type="number"
          step="any"
          value={angle}
          onChange={(e) => setAngle(e.target.value)}
          placeholder={unit === 'deg' ? '45' : '0.785'}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            삼각함수 선택
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setFunc('sin')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                func === 'sin' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              sin
            </button>
            <button
              onClick={() => setFunc('cos')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                func === 'cos' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              cos
            </button>
            <button
              onClick={() => setFunc('tan')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                func === 'tan' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              tan
            </button>
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
                결과: {result.result.toFixed(6)}
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
