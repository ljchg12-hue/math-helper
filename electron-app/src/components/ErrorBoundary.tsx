import { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
  showDetails: boolean
}

/**
 * React Error Boundary Component
 * - React 컴포넌트 트리에서 발생하는 JavaScript 에러를 캐치
 * - 에러 발생 시 전체 앱 크래시 대신 친절한 에러 UI 표시
 * - "다시 시도" 버튼으로 앱 복구 가능
 *
 * @version 1.0.25
 * @see https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
 */
export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      showDetails: false
    }
  }

  /**
   * 에러 발생 시 상태 업데이트
   * - 렌더링 중 에러 발생 시 호출됨
   */
  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    }
  }

  /**
   * 에러 정보 로깅
   * - 에러 스택 트레이스 및 컴포넌트 스택 기록
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error)
    console.error('[ErrorBoundary] Component stack:', errorInfo.componentStack)

    this.setState({ errorInfo })

    // 에러 리포팅 서비스로 전송 (향후 구현)
    // reportErrorToService(error, errorInfo)
  }

  /**
   * 에러 상태 초기화 및 앱 복구
   */
  handleReset = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      showDetails: false
    })
  }

  /**
   * 에러 상세 정보 토글
   */
  toggleDetails = () => {
    this.setState(prev => ({ showDetails: !prev.showDetails }))
  }

  /**
   * 사용자 친화적 에러 메시지 생성
   */
  getUserFriendlyMessage(error?: Error): string {
    if (!error) return '알 수 없는 오류가 발생했습니다.'

    const message = error.message.toLowerCase()

    // 일반적인 에러 패턴 매칭 (구체적인 패턴을 먼저 체크)
    if (message.includes('cannot read prop') || message.includes('undefined')) {
      return '데이터 처리 중 오류가 발생했습니다. 입력값을 확인해 주세요.'
    }

    if (message.includes('network') || message.includes('fetch')) {
      return '네트워크 연결에 문제가 있습니다. 인터넷 연결을 확인해 주세요.'
    }

    // assignment 체크를 invalid 체크보다 먼저 (더 구체적인 패턴 우선)
    if (message.includes('assignment') || message.includes('left hand side')) {
      return '등호(=)는 방정식 모드(Solve)에서만 사용할 수 있습니다.'
    }

    if (message.includes('invalid') || message.includes('syntax')) {
      return '잘못된 입력입니다. 수식을 다시 확인해 주세요.'
    }

    return error.message || '예기치 않은 오류가 발생했습니다.'
  }

  render() {
    const { hasError, error, errorInfo, showDetails } = this.state
    const { children, fallback } = this.props

    if (hasError) {
      // 커스텀 fallback이 제공된 경우
      if (fallback) {
        return fallback
      }

      // 기본 에러 UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
          <div className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
            {/* 헤더 */}
            <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    오류가 발생했습니다
                  </h1>
                  <p className="text-red-100 text-sm mt-1">
                    걱정하지 마세요. 복구할 수 있습니다.
                  </p>
                </div>
              </div>
            </div>

            {/* 내용 */}
            <div className="p-6 space-y-4">
              {/* 사용자 친화적 메시지 */}
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-4">
                <p className="text-amber-800 dark:text-amber-200">
                  {this.getUserFriendlyMessage(error)}
                </p>
              </div>

              {/* 복구 안내 */}
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">
                  다음을 시도해 보세요:
                </h3>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xs text-blue-600 dark:text-blue-400">1</span>
                    아래 "다시 시도" 버튼을 클릭하세요
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xs text-blue-600 dark:text-blue-400">2</span>
                    입력한 수식을 다시 확인해 보세요
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xs text-blue-600 dark:text-blue-400">3</span>
                    문제가 계속되면 앱을 재시작하세요
                  </li>
                </ul>
              </div>

              {/* 에러 상세 정보 (토글) */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <button
                  onClick={this.toggleDetails}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
                >
                  <span>개발자용 상세 정보</span>
                  {showDetails ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {showDetails && (
                  <div className="p-4 bg-gray-900 text-gray-100">
                    <div className="space-y-3">
                      {/* 에러 메시지 */}
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Error Message:</p>
                        <pre className="text-xs text-red-400 font-mono whitespace-pre-wrap break-all">
                          {error?.toString() || 'Unknown error'}
                        </pre>
                      </div>

                      {/* 에러 스택 */}
                      {error?.stack && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Stack Trace:</p>
                          <pre className="text-xs text-gray-400 font-mono whitespace-pre-wrap break-all max-h-32 overflow-auto">
                            {error.stack}
                          </pre>
                        </div>
                      )}

                      {/* 컴포넌트 스택 */}
                      {errorInfo?.componentStack && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Component Stack:</p>
                          <pre className="text-xs text-gray-400 font-mono whitespace-pre-wrap break-all max-h-32 overflow-auto">
                            {errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* 복구 버튼 */}
              <button
                onClick={this.handleReset}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                다시 시도
              </button>

              {/* 버전 정보 */}
              <p className="text-center text-xs text-gray-400">
                MathHelper v1.0.25 | Error Boundary Active
              </p>
            </div>
          </div>
        </div>
      )
    }

    return children
  }
}
