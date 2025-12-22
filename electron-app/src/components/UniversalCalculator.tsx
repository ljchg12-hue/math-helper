import { useState, useRef, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Card from './Card'
import MathKeyboard from './MathKeyboard'
import CalculationHistory from './CalculationHistory'
import FavoritesList from './FavoritesList'
import { HistoryItem } from '../types/history'
import { FavoriteItem } from '../types/favorites'

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

interface UniversalCalculatorProps {
  initialInput?: string
  onInputUsed?: () => void
}

export default function UniversalCalculator({ initialInput, onInputUsed }: UniversalCalculatorProps = {}) {
  const { t } = useTranslation()
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
  // ✅ 계산 히스토리 기능
  const [history, setHistory] = useState<HistoryItem[]>([])
  // ✅ Phase 3: 즐겨찾기 기능
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])

  const modes: Mode[] = [
    {
      id: 'evaluate',
      label: t('modes.evaluate'),
      icon: '🧮',
      example: '2 + 3 * sin(pi/2)',
      description: t('modeDescriptions.evaluate')
    },
    {
      id: 'solve',
      label: t('modes.solve'),
      icon: '📐',
      example: '2x + 3 = 7',
      description: t('modeDescriptions.solve')
    },
    {
      id: 'differentiate',
      label: t('modes.differentiate'),
      icon: '∂',
      example: 'x^2 + 3x',
      description: t('modeDescriptions.differentiate')
    },
    {
      id: 'integrate',
      label: t('modes.integrate'),
      icon: '∫',
      example: '2x + 1',
      description: t('modeDescriptions.integrate')
    },
    {
      id: 'simplify',
      label: t('modes.simplify'),
      icon: '✨',
      example: '(x+1)^2 - x^2',
      description: t('modeDescriptions.simplify')
    },
    {
      id: 'factor',
      label: t('modes.factor'),
      icon: '🔨',
      example: 'x^2 - 5x + 6',
      description: t('modeDescriptions.factor')
    },
    {
      id: 'expand',
      label: t('modes.expand'),
      icon: '📦',
      example: '(x+2)(x+3)',
      description: t('modeDescriptions.expand')
    },
    {
      id: 'limit',
      label: t('modes.limit'),
      icon: '∞',
      example: '(x^2-1)/(x-1)',
      description: t('modeDescriptions.limit')
    },
  ]

  const currentMode = modes.find(m => m.id === mode) || modes[0]

  // ✅ 히스토리 로드 (초기화)
  useEffect(() => {
    const savedHistory = localStorage.getItem('calculationHistory')
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory))
      } catch (err) {
        console.error('Failed to load history:', err)
      }
    }

    // ✅ 즐겨찾기 로드
    const savedFavorites = localStorage.getItem('calculationFavorites')
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites))
      } catch (err) {
        console.error('Failed to load favorites:', err)
      }
    }
  }, [])

  // ✅ 공식 라이브러리에서 공식 입력 받기
  useEffect(() => {
    if (initialInput) {
      setInput(initialInput)
      // 입력 필드로 포커스
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
      // 사용 완료 알림
      if (onInputUsed) {
        onInputUsed()
      }
    }
  }, [initialInput, onInputUsed])

  // ✅ 히스토리 저장
  const saveToHistory = useCallback((resultData: any) => {
    const historyItem: HistoryItem = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      mode,
      modeLabel: currentMode.label,
      input,
      variable: mode === 'solve' || mode === 'differentiate' || mode === 'integrate' || mode === 'limit' ? variable : undefined,
      limitValue: mode === 'limit' ? limitValue : undefined,
      limitDirection: mode === 'limit' ? limitDirection : undefined,
      result: mode === 'solve' && resultData.solutions !== undefined
        ? resultData.solutions.length === 0
          ? t('ui.noSolution')
          : resultData.solutions.join(', ')
        : resultData.result,
      isIdentity: resultData.isIdentity,
      solutions: resultData.solutions,
    }

    setHistory(prev => {
      const newHistory = [historyItem, ...prev].slice(0, 100) // 최대 100개
      localStorage.setItem('calculationHistory', JSON.stringify(newHistory))
      return newHistory
    })
  }, [mode, currentMode.label, input, variable, limitValue, limitDirection, t])

  // ✅ 히스토리 복원
  const handleRestoreHistory = useCallback((item: HistoryItem) => {
    setMode(item.mode as CalculatorMode)
    setInput(item.input)
    if (item.variable) setVariable(item.variable)
    if (item.limitValue) setLimitValue(item.limitValue)
    if (item.limitDirection) setLimitDirection(item.limitDirection)
    setResult(null)
    setError('')
    inputRef.current?.focus()
  }, [])

  // ✅ 히스토리 삭제
  const handleDeleteHistory = useCallback((id: string) => {
    setHistory(prev => {
      const newHistory = prev.filter(item => item.id !== id)
      localStorage.setItem('calculationHistory', JSON.stringify(newHistory))
      return newHistory
    })
  }, [])

  // ✅ 히스토리 전체 삭제
  const handleClearHistory = useCallback(() => {
    setHistory([])
    localStorage.removeItem('calculationHistory')
  }, [])

  // ✅ Phase 3: 즐겨찾기 추가
  const handleAddToFavorites = useCallback((item: HistoryItem) => {
    const favoriteItem: FavoriteItem = {
      ...item,
      favoriteId: `fav-${Date.now()}-${Math.random()}`,
      addedAt: Date.now(),
    }

    setFavorites(prev => {
      const newFavorites = [favoriteItem, ...prev].slice(0, 50)
      localStorage.setItem('calculationFavorites', JSON.stringify(newFavorites))
      return newFavorites
    })
  }, [])

  // ✅ Phase 3: 즐겨찾기 제거
  const handleRemoveFromFavorites = useCallback((favoriteId: string) => {
    setFavorites(prev => {
      const newFavorites = prev.filter(item => item.favoriteId !== favoriteId)
      localStorage.setItem('calculationFavorites', JSON.stringify(newFavorites))
      return newFavorites
    })
  }, [])

  // ✅ Phase 3: 즐겨찾기 복원
  const handleRestoreFavorite = useCallback((item: FavoriteItem) => {
    handleRestoreHistory(item)
  }, [handleRestoreHistory])

  // ✅ Phase 3: 즐겨찾기 여부 확인
  const isFavorite = useCallback((historyId: string) => {
    return favorites.some(fav => fav.id === historyId)
  }, [favorites])

  const handleCalculate = async () => {
    // ✅ Phase 2: 중복 클릭 방지
    if (isCalculating) return

    setError('')
    setResult(null)
    setIsCalculating(true)

    // ✅ Phase 1: mathAPI 존재 확인
    if (!window.mathAPI) {
      console.error('[Calculator] window.mathAPI is undefined!')
      console.error('[Calculator] window keys:', Object.keys(window))
      setError(t('errors.systemError'))
      setIsCalculating(false)
      return
    }
    console.log('[Calculator] mathAPI found:', typeof window.mathAPI)

    if (!input.trim()) {
      setError(t('errors.emptyInput'))
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
        setError(res.error || t('errors.cannotCalculate'))
      } else {
        setResult(res)
        // ✅ 계산 성공 시 히스토리 저장
        saveToHistory(res)
      }
    } catch (err: any) {
      setError(err.message || '오류가 발생했습니다')
    } finally {
      // ✅ Phase 2: 항상 로딩 상태 해제
      setIsCalculating(false)
    }
  }

  const handleKeyboardInput = useCallback((value: string) => {
    const textarea = inputRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const newValue = input.substring(0, start) + value + input.substring(end)

    setInput(newValue)

    // ✅ MEDIUM #5: 메모리 누수 방지 - requestAnimationFrame 사용
    requestAnimationFrame(() => {
      if (inputRef.current) {
        const newPos = start + value.length
        inputRef.current.setSelectionRange(newPos, newPos)
        inputRef.current.focus()
      }
    })
  }, [input])

  const handleClear = useCallback(() => {
    setInput('')
    setResult(null)
    setError('')
    inputRef.current?.focus()
  }, [])

  const handleBackspace = useCallback(() => {
    const textarea = inputRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd

    if (start === end && start > 0) {
      setInput(input.substring(0, start - 1) + input.substring(end))
      requestAnimationFrame(() => {
        if (inputRef.current) {
          inputRef.current.setSelectionRange(start - 1, start - 1)
          inputRef.current.focus()
        }
      })
    } else if (start !== end) {
      setInput(input.substring(0, start) + input.substring(end))
      requestAnimationFrame(() => {
        if (inputRef.current) {
          inputRef.current.setSelectionRange(start, start)
          inputRef.current.focus()
        }
      })
    }
  }, [input])

  // ✅ LOW #8: 키보드 단축키
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + 숫자: 모드 전환
      if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '8') {
        e.preventDefault()
        const modeIndex = parseInt(e.key) - 1
        if (modeIndex < modes.length) {
          setMode(modes[modeIndex].id)
          setInput('')
          setResult(null)
          setError('')
          inputRef.current?.focus()
        }
      }

      // Ctrl/Cmd + Enter: 계산 실행
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        handleCalculate()
      }

      // Ctrl/Cmd + K: 키보드 토글
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setShowKeyboard(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mode, modes, handleCalculate])

  return (
    <Card>
      <div className="space-y-4">
        {/* 즐겨찾기 */}
        <FavoritesList
          favorites={favorites}
          onRestore={handleRestoreFavorite}
          onRemove={handleRemoveFromFavorites}
        />

        {/* 히스토리 */}
        <CalculationHistory
          history={history}
          onRestore={handleRestoreHistory}
          onDelete={handleDeleteHistory}
          onClearAll={handleClearHistory}
          onAddToFavorites={handleAddToFavorites}
          isFavorite={isFavorite}
        />

        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {currentMode.icon} {currentMode.label}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              💡 {t('ui.shortcuts')}
            </p>
          </div>
          <button
            onClick={() => setShowKeyboard(!showKeyboard)}
            className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg"
            title={t('ui.shortcutHint')}
          >
            {showKeyboard ? `⌨️ ${t('ui.hideKeyboard')}` : `⌨️ ${t('ui.showKeyboard')}`}
          </button>
        </div>

        {/* 모드 선택 */}
        <div className="flex flex-wrap gap-2">
          {modes.map((m, index) => (
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
              title={`${m.description} (Ctrl+${index + 1})`}
            >
              {m.icon} {m.label}
            </button>
          ))}
        </div>

        {/* 입력 영역 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {t('ui.inputExpression')}
            <span className="ml-2 text-xs font-bold text-blue-600">
              [{t('ui.currentMode')}: {currentMode.label}]
            </span>
            <span className="ml-2 text-xs text-gray-500">
              {t('ui.example')}: {currentMode.example}
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
                  <label className="text-sm text-gray-600">{t('ui.variable')}:</label>
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
                    <label className="text-xs text-gray-600">{t('ui.variable')}</label>
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
                    <label className="text-xs text-gray-600">{t('ui.limitValue')}</label>
                    <input
                      type="text"
                      value={limitValue}
                      onChange={(e) => {
                        const value = e.target.value
                        // 숫자, 소수점, 음수, inf, infinity만 허용
                        if (/^-?\d*\.?\d*$|^inf(inity)?$/i.test(value) || value === '') {
                          setLimitValue(value)
                        }
                      }}
                      placeholder="0, inf"
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-600">{t('ui.limitDirection')}</label>
                    <select
                      value={limitDirection}
                      onChange={(e) => setLimitDirection(e.target.value as 'left' | 'right' | 'both')}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="both">{t('ui.both')}</option>
                      <option value="left">{t('ui.left')}</option>
                      <option value="right">{t('ui.right')}</option>
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
          {isCalculating ? `⏳ ${t('ui.calculating')}` : `${currentMode.icon} ${currentMode.label}${t('ui.calculate')}`}
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
            <div className={`p-4 border-2 rounded-lg ${
              result.isIdentity
                ? 'bg-blue-50 border-blue-200'
                : 'bg-green-50 border-green-200'
            }`}>
              <p className={`text-sm font-medium mb-1 ${
                result.isIdentity ? 'text-blue-700' : 'text-green-700'
              }`}>
                {result.isIdentity ? `✨ ${t('ui.identity')}:` : `✅ ${t('ui.result')}:`}
              </p>
              <p className={`text-2xl font-mono font-bold ${
                result.isIdentity ? 'text-blue-900' : 'text-green-900'
              }`}>
                {mode === 'solve' && result.solutions !== undefined
                  ? result.isIdentity
                    ? t('ui.allSolutions', { variable: result.variable })
                    : result.solutions.length === 0
                      ? t('ui.noSolution')
                      : result.solutions.length === 1
                        ? `${result.variable} = ${result.solutions[0]}`
                        : `${result.variable} = ${result.solutions.join(', ')}`
                  : result.result}
              </p>
            </div>

            {result.steps && result.steps.length > 0 && (
              <div className="p-4 bg-gray-50 border-2 border-gray-200 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">📝 {t('ui.steps')}:</p>
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
