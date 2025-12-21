import { useState, useRef } from 'react'
import Card from './Card'
import MathKeyboard from './MathKeyboard'

type CalculatorMode =
  | 'evaluate'    // 계산
  | 'solve'       // 방정식
  | 'differentiate' // 미분
  | 'integrate'   // 적분
  | 'simplify'    // 간단히
  | 'factor'      // 인수분해
  | 'expand'      // 전개
  | 'limit'       // 극한

interface Mode {
  id: CalculatorMode
  label: string
  icon: string
  example: string
  description: string
}

export default function UniversalCalculator() {
  const [mode, setMode] = useState<CalculatorMode>('evaluate')
  const [input, setInput] = useState('')
  const [variable, setVariable] = useState('x')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [showKeyboard, setShowKeyboard] = useState(true)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  // ✅ Phase 1+2: 극한 기능 완전 구현
  const [limitValue, setLimitValue] = useState('0')
  const [limitDirection, setLimitDirection] = useState<'left' | 'right' | 'both'>('both')
  // ✅ Phase 2: 로딩 상태 추가
  const [isCalculating, setIsCalculating] = useState(false)

  const modes: Mode[] = [
    {
      id: 'evaluate',
      label: '계산',
      icon: '🧮',
      example: '2 + 3 * sin(pi/2)',
      description: '수식 계산'
    },
    {
      id: 'solve',
      label: '방정식',
      icon: '📐',
      example: '2x + 3 = 7',
      description: '방정식 풀이'
    },
    {
      id: 'differentiate',
      label: '미분',
      icon: '∂',
      example: 'x^2 + 3x',
      description: '함수 미분'
    },
    {
      id: 'integrate',
      label: '적분',
      icon: '∫',
      example: '2x + 1',
      description: '함수 적분'
    },
    {
      id: 'simplify',
      label: '간단히',
      icon: '✨',
      example: '(x+1)^2 - x^2',
      description: '식 정리'
    },
    {
      id: 'factor',
      label: '인수분해',
      icon: '🔨',
      example: 'x^2 - 5x + 6',
      description: '인수분해'
    },
    {
      id: 'expand',
      label: '전개',
      icon: '📦',
      example: '(x+2)(x+3)',
      description: '식 전개'
    },
    {
      id: 'limit',
      label: '극한',
      icon: '∞',
      example: '(x^2-1)/(x-1)',
      description: '극한값 계산'
    },
  ]

  const currentMode = modes.find(m => m.id === mode)!

  const handleCalculate = async () => {
    // ✅ Phase 2: 중복 클릭 방지
    if (isCalculating) return

    setError('')
    setResult(null)
    setIsCalculating(true)

    // ✅ Phase 1: mathAPI 존재 확인
    if (!window.mathAPI) {
      setError('시스템 오류: 수학 엔진을 로드할 수 없습니다. 앱을 재시작해주세요.')
      setIsCalculating(false)
      return
    }

    if (!input.trim()) {
      setError('수식을 입력하세요')
      setIsCalculating(false)
      return
    }

    try {
      let res

      switch (mode) {
        case 'evaluate':
          res = window.mathAPI.evaluate(input)
          break
        case 'solve':
          res = window.mathAPI.solve(input, variable)
          break
        case 'differentiate':
          res = window.mathAPI.differentiate(input, variable)
          break
        case 'integrate':
          res = window.mathAPI.integrate(input, variable)
          break
        case 'simplify':
          res = window.mathAPI.simplify(input)
          break
        case 'factor':
          res = window.mathAPI.factor(input)
          break
        case 'expand':
          res = window.mathAPI.expand(input)
          break
        case 'limit':
          // ✅ Phase 1: 극한 기능 완전 구현 (하드코딩 제거)
          res = window.mathAPI.limit(input, variable, limitValue, limitDirection)
          break
      }

      if (!res.success) {
        setError(res.error || '계산할 수 없습니다')
      } else {
        setResult(res)
      }
    } catch (err: any) {
      setError(err.message || '오류가 발생했습니다')
    } finally {
      // ✅ Phase 2: 항상 로딩 상태 해제
      setIsCalculating(false)
    }
  }

  const handleKeyboardInput = (value: string) => {
    const textarea = inputRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const newValue = input.substring(0, start) + value + input.substring(end)

    setInput(newValue)

    // 커서 위치 조정
    setTimeout(() => {
      const newPos = start + value.length
      textarea.setSelectionRange(newPos, newPos)
      textarea.focus()
    }, 0)
  }

  const handleClear = () => {
    setInput('')
    setResult(null)
    setError('')
    inputRef.current?.focus()
  }

  const handleBackspace = () => {
    const textarea = inputRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd

    if (start === end && start > 0) {
      setInput(input.substring(0, start - 1) + input.substring(end))
      setTimeout(() => {
        textarea.setSelectionRange(start - 1, start - 1)
        textarea.focus()
      }, 0)
    } else if (start !== end) {
      setInput(input.substring(0, start) + input.substring(end))
      setTimeout(() => {
        textarea.setSelectionRange(start, start)
        textarea.focus()
      }, 0)
    }
  }

  return (
    <Card>
      <div className="space-y-4">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {currentMode.icon} {currentMode.label}
          </h2>
          <button
            onClick={() => setShowKeyboard(!showKeyboard)}
            className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg"
          >
            {showKeyboard ? '⌨️ 키보드 숨기기' : '⌨️ 키보드 표시'}
          </button>
        </div>

        {/* 모드 선택 */}
        <div className="flex flex-wrap gap-2">
          {modes.map(m => (
            <button
              key={m.id}
              onClick={() => {
                setMode(m.id)
                setInput('')
                setResult(null)
                setError('')
              }}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === m.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title={m.description}
            >
              {m.icon} {m.label}
            </button>
          ))}
        </div>

        {/* 입력 영역 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            수식 입력
            <span className="ml-2 text-xs text-gray-500">
              예: {currentMode.example}
            </span>
          </label>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleCalculate()
              }
            }}
            placeholder={currentMode.example}
            className="w-full px-4 py-3 text-lg font-mono border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={2}
          />

          {(mode === 'solve' || mode === 'differentiate' || mode === 'integrate' || mode === 'limit') && (
            <div className="space-y-2">
              {mode !== 'limit' ? (
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">변수:</label>
                  <input
                    type="text"
                    value={variable}
                    // ✅ Phase 2: 변수 입력 검증 (알파벳만)
                    onChange={(e) => setVariable(e.target.value.replace(/[^a-zA-Z]/g, ''))}
                    className="w-16 px-2 py-1 border-2 border-gray-300 rounded"
                    maxLength={1}
                    pattern="[a-zA-Z]"
                    placeholder="x"
                  />
                </div>
              ) : (
                // ✅ Phase 1: 극한 기능 완전 구현
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-xs text-gray-600">변수</label>
                    <input
                      type="text"
                      value={variable}
                      onChange={(e) => setVariable(e.target.value.replace(/[^a-zA-Z]/g, ''))}
                      placeholder="x"
                      maxLength={1}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-600">접근값</label>
                    <input
                      type="text"
                      value={limitValue}
                      onChange={(e) => setLimitValue(e.target.value)}
                      placeholder="0, inf"
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-600">방향</label>
                    <select
                      value={limitDirection}
                      onChange={(e) => setLimitDirection(e.target.value as 'left' | 'right' | 'both')}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="both">양방향</option>
                      <option value="left">좌극한</option>
                      <option value="right">우극한</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 가상 키보드 */}
        {showKeyboard && (
          <MathKeyboard
            onInput={handleKeyboardInput}
            onClear={handleClear}
            onBackspace={handleBackspace}
          />
        )}

        {/* 계산 버튼 */}
        <button
          onClick={handleCalculate}
          disabled={isCalculating}
          className={`w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-md transition-all ${
            isCalculating ? 'opacity-50 cursor-not-allowed' : 'active:scale-98'
          }`}
        >
          {/* ✅ Phase 2: 로딩 상태 표시 */}
          {isCalculating ? '⏳ 계산 중...' : `${currentMode.icon} ${currentMode.label}하기`}
        </button>

        {/* 에러 메시지 */}
        {error && (
          <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
            <p className="text-red-700 font-medium">❌ {error}</p>
          </div>
        )}

        {/* 결과 표시 */}
        {result && (
          <div className="space-y-3">
            <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
              <p className="text-sm text-green-700 font-medium mb-1">✅ 결과:</p>
              <p className="text-2xl font-mono font-bold text-green-900">
                {mode === 'solve' && result.solutions
                  ? result.solutions.length === 1
                    ? `${result.variable} = ${result.solutions[0]}`
                    : `${result.variable} = ${result.solutions.join(', ')}`
                  : result.result}
              </p>
            </div>

            {result.steps && result.steps.length > 0 && (
              <div className="p-4 bg-gray-50 border-2 border-gray-200 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">📝 풀이 과정:</p>
                <ol className="space-y-1 text-gray-600">
                  {result.steps.map((step: string, i: number) => (
                    <li key={i} className="font-mono text-sm">
                      {i + 1}. {step}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
