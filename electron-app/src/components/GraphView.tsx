import { useEffect, useRef, useState, useCallback } from 'react'
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
  const [isRendered, setIsRendered] = useState(false)

  // ✅ FIX: 그래프 렌더링 함수 분리
  const renderGraph = useCallback(() => {
    if (!graphRef.current) return

    // ✅ FIX: 이전 그래프 정리 (SVG 누적 방지)
    graphRef.current.innerHTML = ''

    // 변수 개수 확인
    const variables = extractVariables(expression)

    // 변수가 없는 경우: 조용히 숨김 (상수는 그래프 불필요)
    if (variables.length === 0) {
      setError(null)
      setIsRendered(false)
      return
    }

    // 그래프 가능 여부 확인 (1~2개 변수만)
    if (!isGraphable(expression, mode)) {
      setError('이 수식은 그래프로 표현할 수 없습니다')
      setIsRendered(false)
      return
    }

    try {
      setError(null)

      // function-plot 형식으로 변환
      const plotExpr = convertToPlotFormat(expression, variable)
      const domain = calculateDomain(expression)
      const range = calculateRange(expression)

      // ✅ FIX: 컨테이너 너비 계산 (최소 300px 보장)
      const containerWidth = Math.max(graphRef.current.clientWidth || 300, 300)

      // 그래프 옵션 설정
      const options: FunctionPlotOptions = {
        target: graphRef.current,
        width: containerWidth,
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
            nSamples: 1000
          }
        ],
        disableZoom: false
      }

      // solve 모드인 경우 해를 점으로 표시
      if (mode === 'solve' && result?.solutions && result.solutions.length > 0) {
        options.annotations = result.solutions.map((sol: number) => ({
          x: sol,
          y: 0,
          text: `x = ${sol}`
        }))
      }

      // ✅ FIX: 그래프 그리기
      functionPlot(options)
      setIsRendered(true)
    } catch (err) {
      console.error('그래프 생성 오류:', err)
      setError(`그래프를 생성할 수 없습니다: ${(err as Error).message}`)
      setIsRendered(false)
    }
  }, [expression, mode, variable, result])

  // ✅ FIX: show 변경 및 expression 변경 시 렌더링
  useEffect(() => {
    if (!show) {
      setIsRendered(false)
      return
    }

    // ✅ FIX: 약간의 지연 후 렌더링 (DOM 마운트 보장)
    const timer = setTimeout(() => {
      renderGraph()
    }, 100)

    return () => clearTimeout(timer)
  }, [show, renderGraph])

  // ✅ FIX: 윈도우 리사이즈 시 다시 그리기
  useEffect(() => {
    if (!show) return

    const handleResize = () => {
      renderGraph()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [show, renderGraph])

  if (!show) return null

  // 변수가 없으면 그래프 컴포넌트 자체를 숨김
  const variables = extractVariables(expression)
  if (variables.length === 0) return null

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

        {/* ✅ FIX: 에러가 있어도 컨테이너는 항상 렌더링 */}
        <div
          ref={graphRef}
          className="w-full bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden"
          style={{ minHeight: '400px', minWidth: '300px' }}
        />

        {/* 에러 메시지 오버레이 */}
        {error && (
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <p className="text-sm text-orange-700 dark:text-orange-400">
              ⚠️ {error}
            </p>
          </div>
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
