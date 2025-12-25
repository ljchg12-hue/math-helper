import { useEffect, useRef, useState } from 'react'
import functionPlot from 'function-plot'
import type { FunctionPlotOptions } from '../types/function-plot'
import Card from './Card'
import {
  convertToPlotFormat,
  calculateDomain,
  calculateRange,
  generateGraphTitle,
  isGraphable,
  extractVariables
} from '../utils/graphHelper'

interface GraphViewProps {
  expression: string
  mode: string
  variable?: string
  result?: any
  show?: boolean
}

export default function GraphView({
  expression,
  mode,
  variable = 'x',
  result,
  show = true
}: GraphViewProps) {
  const graphRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!show || !graphRef.current) return

    // 변수 개수 확인
    const variables = extractVariables(expression)

    // ✅ 변수가 없는 경우: 조용히 숨김 (상수는 그래프 불필요)
    if (variables.length === 0) {
      setError(null)  // 에러 메시지 표시 안 함
      return
    }

    // 그래프 가능 여부 확인 (1~2개 변수만)
    if (!isGraphable(expression, mode)) {
      setError('이 수식은 그래프로 표현할 수 없습니다')
      return
    }

    try {
      setError(null)

      // function-plot 형식으로 변환
      const plotExpr = convertToPlotFormat(expression, variable)
      const domain = calculateDomain(expression)
      const range = calculateRange(expression)

      // 그래프 옵션 설정
      const options: FunctionPlotOptions = {
        target: graphRef.current,
        width: graphRef.current.clientWidth,
        height: 400,
        grid: true,
        xAxis: {
          label: variable,
          domain: domain
        },
        yAxis: {
          label: `f(${variable})`,
          domain: range
        },
        data: [
          {
            fn: plotExpr,
            color: '#2563eb',
            graphType: 'polyline',
            nSamples: 1000  // ✅ 더 부드러운 곡선 (기본 200 → 1000)
          }
        ],
        disableZoom: false  // ✅ 확대/축소 활성화
      }

      // solve 모드인 경우 해를 점으로 표시
      if (mode === 'solve' && result?.solutions && result.solutions.length > 0) {
        options.annotations = result.solutions.map((sol: number) => ({
          x: sol,
          y: 0,
          text: `x = ${sol}`
        }))
      }

      // 그래프 그리기
      functionPlot(options)
    } catch (err) {
      console.warn('그래프 생성 오류:', err)
      setError('그래프를 생성할 수 없습니다')
    }
  }, [expression, mode, variable, result, show])

  if (!show) return null

  return (
    <Card>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            📊 그래프
          </h3>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {generateGraphTitle(expression, mode, variable)}
          </span>
        </div>

        {error ? (
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <p className="text-sm text-orange-700 dark:text-orange-400">
              ⚠️ {error}
            </p>
          </div>
        ) : (
          <div
            ref={graphRef}
            className="w-full bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 p-4"
          />
        )}

        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <p>💡 그래프를 드래그하여 이동하거나 스크롤하여 확대/축소할 수 있습니다</p>
          <p>📌 파란색 선: 함수 그래프</p>
          {mode === 'solve' && result?.solutions && result.solutions.length > 0 && (
            <p>🎯 빨간색 점: 방정식의 해</p>
          )}
        </div>
      </div>
    </Card>
  )
}
