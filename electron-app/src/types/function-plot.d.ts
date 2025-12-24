// function-plot 라이브러리 타입 정의
declare module 'function-plot' {
  export interface FunctionPlotDatum {
    fn: string
    sampler?: 'interval' | 'builtIn'
    graphType?: 'polyline' | 'scatter' | 'interval'
    nSamples?: number
    color?: string
  }

  export interface FunctionPlotAnnotation {
    x?: number
    y?: number
    text: string
  }

  export interface FunctionPlotOptions {
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
    data?: FunctionPlotDatum[]
    annotations?: FunctionPlotAnnotation[]
  }

  export default function functionPlot(options: FunctionPlotOptions): any
}
