import { useState } from 'react'
import { calculatePythagorean, calculateGeometry } from '../lib/electron'
import type { GeometryResult } from '../types'
import Input from './Input'
import Button from './Button'
import Card from './Card'

type GeometryType = 'pythagorean' | 'triangle' | 'circle' | 'rectangle'

export default function GeometryCalculator() {
  const [type, setType] = useState<GeometryType>('pythagorean')
  const [result, setResult] = useState<GeometryResult | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // 피타고라스
  const [a, setA] = useState('')
  const [b, setB] = useState('')
  const [c, setC] = useState('')

  // 도형
  const [param1, setParam1] = useState('')
  const [param2, setParam2] = useState('')

  const handleCalculate = async () => {
    setError('')
    setResult(null)
    setLoading(true)

    try {
      let res: GeometryResult

      if (type === 'pythagorean') {
        const aVal = a === '' ? null : parseFloat(a)
        const bVal = b === '' ? null : parseFloat(b)
        const cVal = c === '' ? null : parseFloat(c)

        const nonNullCount = [aVal, bVal, cVal].filter(v => v !== null).length
        if (nonNullCount !== 2) {
          setError('정확히 두 개의 변 길이를 입력해주세요')
          return
        }

        res = await calculatePythagorean(aVal, bVal, cVal)
      } else if (type === 'triangle') {
        const base = parseFloat(param1)
        const height = parseFloat(param2)

        if (isNaN(base) || isNaN(height)) {
          setError('밑변과 높이를 입력해주세요')
          return
        }

        res = await calculateGeometry('triangle_area', base, height)
      } else if (type === 'circle') {
        const radius = parseFloat(param1)

        if (isNaN(radius)) {
          setError('반지름을 입력해주세요')
          return
        }

        res = await calculateGeometry('circle_area', radius)
      } else {
        // rectangle
        const width = parseFloat(param1)
        const height = parseFloat(param2)

        if (isNaN(width) || isNaN(height)) {
          setError('가로와 세로를 입력해주세요')
          return
        }

        res = await calculateGeometry('rectangle_area', width, height)
      }

      setResult(res)
    } catch (err) {
      setError(err as string)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card title="기하 계산기">
      <div className="space-y-4">
        {/* 계산 유형 선택 */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setType('pythagorean')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              type === 'pythagorean'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            피타고라스
          </button>
          <button
            onClick={() => setType('triangle')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              type === 'triangle'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            삼각형
          </button>
          <button
            onClick={() => setType('circle')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              type === 'circle'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            원
          </button>
          <button
            onClick={() => setType('rectangle')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              type === 'rectangle'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            직사각형
          </button>
        </div>

        {/* 입력 필드 */}
        {type === 'pythagorean' && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              세 변 a, b, c 중 정확히 두 개를 입력하세요 (나머지는 비워두세요)
            </p>
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="a (밑변)"
                type="number"
                step="any"
                value={a}
                onChange={(e) => setA(e.target.value)}
                placeholder="예: 3"
              />
              <Input
                label="b (높이)"
                type="number"
                step="any"
                value={b}
                onChange={(e) => setB(e.target.value)}
                placeholder="예: 4"
              />
              <Input
                label="c (빗변)"
                type="number"
                step="any"
                value={c}
                onChange={(e) => setC(e.target.value)}
                placeholder="예: 5"
              />
            </div>
          </div>
        )}

        {type === 'triangle' && (
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="밑변"
              type="number"
              step="any"
              value={param1}
              onChange={(e) => setParam1(e.target.value)}
              placeholder="예: 10"
            />
            <Input
              label="높이"
              type="number"
              step="any"
              value={param2}
              onChange={(e) => setParam2(e.target.value)}
              placeholder="예: 8"
            />
          </div>
        )}

        {type === 'circle' && (
          <Input
            label="반지름"
            type="number"
            step="any"
            value={param1}
            onChange={(e) => setParam1(e.target.value)}
            placeholder="예: 5"
          />
        )}

        {type === 'rectangle' && (
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="가로"
              type="number"
              step="any"
              value={param1}
              onChange={(e) => setParam1(e.target.value)}
              placeholder="예: 12"
            />
            <Input
              label="세로"
              type="number"
              step="any"
              value={param2}
              onChange={(e) => setParam2(e.target.value)}
              placeholder="예: 9"
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
                답: {result.result.toFixed(4)}
              </p>
              <p className="text-sm text-green-700 mt-1">
                공식: {result.formula}
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
