import { useEffect, useRef, useState, useCallback, useId } from 'react'
import functionPlot from 'function-plot'
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

// ✅ v1.0.32: function-plot 옵션 타입 (공식 문서 기반)
interface FunctionPlotOptions {
  target: string | HTMLElement
  title?: string
  width?: number
  height?: number
  xAxis?: {
    label?: string
    domain?: [number, number]
  }
  yAxis?: {
    label?: string
    domain?: [number, number]
  }
  grid?: boolean
  disableZoom?: boolean
  data: Array<{
    fn: string
    sampler?: 'interval' | 'builtIn'
    graphType?: 'polyline' | 'scatter' | 'interval'
    nSamples?: number
    color?: string
    range?: [number, number]
  }>
  annotations?: Array<{
    x?: number
    y?: number
    text: string
  }>
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
  const [debugInfo, setDebugInfo] = useState<string>('')

  // ✅ 고유 ID 생성 (React 18+)
  const uniqueId = useId()
  const containerId = `graph-container-${uniqueId.replace(/:/g, '')}`

  // ✅ v1.0.32: 그래프 렌더링 함수 (참조 자료 기반 재작성)
  const renderGraph = useCallback(() => {
    const container = graphRef.current
    if (!container) {
      console.warn('[GraphView] Container ref is null')
      return
    }

    // 이전 그래프 제거
    container.innerHTML = ''

    // 변수 추출
    const variables = extractVariables(expression)
    if (variables.length === 0) {
      setError(null)
      setDebugInfo('변수가 없는 상수 수식')
      return
    }

    // 그래프 가능 여부 확인
    if (!isGraphable(expression, mode)) {
      setError('이 수식은 그래프로 표현할 수 없습니다')
      return
    }

    try {
      setError(null)

      // ✅ 수식 변환 (function-plot 형식)
      const plotExpr = convertToPlotFormat(expression, variable)
      console.log('[GraphView] Original:', expression)
      console.log('[GraphView] Converted:', plotExpr)
      setDebugInfo(`수식: ${plotExpr}`)

      // ✅ 범위 계산
      const domain = calculateDomain(expression)
      const range = calculateRange(expression)

      // ✅ 컨테이너 크기 (최소값 보장)
      const width = Math.max(container.clientWidth || 400, 300)
      const height = 400

      // ✅ function-plot 옵션 (공식 문서 기반)
      const options: FunctionPlotOptions = {
        target: container,  // HTMLElement 직접 전달
        width,
        height,
        grid: true,
        disableZoom: false,
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
            sampler: 'builtIn',  // ✅ 기본 샘플러 사용 (더 안정적)
            graphType: 'polyline',
            nSamples: 500,
            color: '#2563eb'
          }
        ]
      }

      // ✅ solve 모드: 해를 점으로 표시
      if (mode === 'solve' && result?.solutions && result.solutions.length > 0) {
        options.annotations = result.solutions
          .filter((sol: any) => !isNaN(Number(sol)))
          .map((sol: any) => ({
            x: Number(sol),
            y: 0,
            text: `x=${Number(sol).toFixed(2)}`
          }))
      }

      // ✅ 그래프 렌더링
      console.log('[GraphView] Rendering with options:', options)
      functionPlot(options)
      console.log('[GraphView] Render success')

    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      console.error('[GraphView] Render error:', errorMsg)
      setError(`그래프 오류: ${errorMsg}`)
      setDebugInfo(`에러: ${errorMsg}`)
    }
  }, [expression, mode, variable, result])

  // ✅ 표시 상태 및 수식 변경 시 렌더링
  useEffect(() => {
    if (!show || !expression.trim()) return

    // DOM이 준비될 때까지 대기
    const timer = setTimeout(() => {
      renderGraph()
    }, 150)

    return () => clearTimeout(timer)
  }, [show, expression, mode, variable, result, renderGraph])

  // ✅ 윈도우 리사이즈 대응
  useEffect(() => {
    if (!show) return

    let resizeTimer: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        renderGraph()
      }, 250)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(resizeTimer)
    }
  }, [show, renderGraph])

  // ✅ 표시 조건
  if (!show) return null

  const variables = extractVariables(expression)
  if (variables.length === 0) return null

  return (
    <Card>
      <div className="space-y-3">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            📊 그래프
          </h3>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {generateGraphTitle(expression, mode, variable)}
          </span>
        </div>

        {/* ✅ 그래프 컨테이너 (항상 렌더링) */}
        <div
          id={containerId}
          ref={graphRef}
          className="w-full bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden"
          style={{
            minHeight: '400px',
            minWidth: '300px',
            position: 'relative'
          }}
        />

        {/* 에러 메시지 */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-700 dark:text-red-400">
              ⚠️ {error}
            </p>
          </div>
        )}

        {/* 디버그 정보 (개발 모드) */}
        {process.env.NODE_ENV === 'development' && debugInfo && (
          <div className="text-xs text-gray-400 font-mono">
            {debugInfo}
          </div>
        )}

        {/* 안내 */}
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <p>💡 마우스 드래그: 이동 / 스크롤: 확대·축소</p>
          <p>📌 파란선: f({variable}) 그래프</p>
          {mode === 'solve' && result?.solutions?.length > 0 && (
            <p>🎯 점: 방정식의 해</p>
          )}
        </div>
      </div>
    </Card>
  )
}
