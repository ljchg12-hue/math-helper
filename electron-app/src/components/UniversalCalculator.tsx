import { useState, useRef, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Zap } from 'lucide-react'
import Card from './Card'
import MathKeyboard from './MathKeyboard'
import CalculationHistory from './CalculationHistory'
import FavoritesList from './FavoritesList'
import GraphView from './GraphView'
import SmartResultView from './SmartResultView'
import { HistoryItem } from '../types/history'
import { FavoriteItem } from '../types/favorites'
import { getItem, setItem, removeItem } from '../utils/safeStorage'
import { getAvailableModes, getCalculateAllModes } from '../types/categoryModeMapping'
import { parseInputIntent, shouldAutoSwitch, type ParsedInput } from '../utils/smartParser'
import { getUserFriendlyError, formatErrorMessage } from '../utils/errorMessages'
import { analyzeVariables, type VariableAnalysis } from '../utils/variableAnalyzer'

// ✅ CalculatorMode는 types.d.ts에서 global 정의됨

interface Mode {
  id: CalculatorMode
  label: string
  icon: string
  example: string
  description: string
}

interface CalcResult {
  success: boolean
  result?: string
  error?: string
  solutions?: string[]
  isIdentity?: boolean
  steps?: string[]
}

interface UniversalCalculatorProps {
  initialInput?: string
  onInputUsed?: () => void
  // ✅ Phase 2: EngineeringCalculator에서 강제 모드 설정 가능
  forceMode?: CalculatorMode
  // ✅ Phase 2: 카테고리별 스마트 필터링
  currentCategory?: string
}

export default function UniversalCalculator({ initialInput, onInputUsed, forceMode, currentCategory }: UniversalCalculatorProps = {}) {
  const { t } = useTranslation()
  const [mode, setMode] = useState<CalculatorMode>(forceMode || 'evaluate')
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
  // ✅ Phase 3: 그래프 표시 기능
  const [showGraph, setShowGraph] = useState(true)
  // ✅ 스마트 입력 파싱: 자동 모드 전환
  const [autoSwitched, setAutoSwitched] = useState(false)
  const [parsedIntent, setParsedIntent] = useState<ParsedInput | null>(null)
  // ✅ 토스트 알림 (자동 전환 피드백)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  // ✅ Phase 3: 다중 변수 지원
  const [parameterValues, setParameterValues] = useState<Record<string, string>>({})
  const [variableAnalysis, setVariableAnalysis] = useState<VariableAnalysis | null>(null)

  // ✅ 전체 모드 정의
  const allModes: Mode[] = [
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
    {
      id: 'calculateAll',
      label: t('modes.calculateAll'),
      icon: '⚡',
      example: '2x^2 + 3x - 5',
      description: t('modeDescriptions.calculateAll')
    },
  ]

  // ✅ 카테고리별 필터링 적용
  const availableModeIds = getAvailableModes(currentCategory)
  const modes = allModes.filter(m => availableModeIds.includes(m.id) || m.id === 'calculateAll')

  const currentMode = modes.find(m => m.id === mode) || modes[0]

  // ✅ 히스토리 로드 (초기화)
  useEffect(() => {
    const savedHistory = getItem<HistoryItem[]>('calculationHistory', { fallback: [] })
    setHistory(savedHistory)

    // ✅ 즐겨찾기 로드
    const savedFavorites = getItem<FavoriteItem[]>('calculationFavorites', { fallback: [] })
    setFavorites(savedFavorites)
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

  // ✅ Phase 3: 변수 분석 (다중 변수 감지)
  useEffect(() => {
    if (input.trim() && mode === 'solve') {
      const analysis = analyzeVariables(input, variable)
      setVariableAnalysis(analysis)

      // 다중 변수 감지 시 기존 파라미터 값 유지 또는 초기화
      if (analysis.hasMultipleVars) {
        // 새로운 파라미터가 추가되면 빈 값으로 초기화
        setParameterValues(prev => {
          const newParams: Record<string, string> = {}
          for (const param of analysis.parameters) {
            newParams[param] = prev[param] || '' // 기존 값 유지 또는 빈 문자열
          }
          return newParams
        })
      }
    } else {
      setVariableAnalysis(null)
      setParameterValues({})
    }
  }, [input, variable, mode])

  // ✅ 히스토리 저장
  const saveToHistory = useCallback((resultData: CalcResult) => {
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
      setItem('calculationHistory', newHistory)
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
      setItem('calculationHistory', newHistory)
      return newHistory
    })
  }, [])

  // ✅ 히스토리 전체 삭제
  const handleClearHistory = useCallback(() => {
    setHistory([])
    removeItem('calculationHistory')
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
      setItem('calculationFavorites', newFavorites)
      return newFavorites
    })
  }, [])

  // ✅ Phase 3: 즐겨찾기 제거
  const handleRemoveFromFavorites = useCallback((favoriteId: string) => {
    setFavorites(prev => {
      const newFavorites = prev.filter(item => item.favoriteId !== favoriteId)
      setItem('calculationFavorites', newFavorites)
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

  // ✅ 토스트 알림 표시
  const showToastNotification = useCallback((message: string) => {
    setToastMessage(message)
    setShowToast(true)
    // 3초 후 자동 숨김
    setTimeout(() => {
      setShowToast(false)
    }, 3000)
  }, [])

  // ✅ 스마트 입력 처리: 실시간 파싱 및 자동 모드 전환
  const handleInputChange = useCallback((newInput: string) => {
    setInput(newInput)
    setError('') // 입력 변경 시 에러 초기화

    // forceMode가 설정된 경우 자동 전환 비활성화
    if (forceMode) {
      setAutoSwitched(false)
      setParsedIntent(null)
      return
    }

    // 입력 의도 파싱
    const parsed = parseInputIntent(newInput)
    setParsedIntent(parsed)

    // 자동 전환 조건 확인
    if (shouldAutoSwitch(parsed, mode)) {
      const targetMode = allModes.find(m => m.id === parsed.suggestedMode)
      setMode(parsed.suggestedMode)
      setAutoSwitched(true)

      // 토스트 알림 표시
      if (targetMode) {
        showToastNotification(`${targetMode.icon} ${targetMode.label} 모드로 자동 전환됨`)
      }
    } else {
      setAutoSwitched(false)
    }
  }, [forceMode, mode, allModes, showToastNotification])

  const handleCalculate = async () => {
    // ✅ Phase 2: 중복 클릭 방지
    if (isCalculating) return

    setError('')
    setResult(null)
    setIsCalculating(true)

    // ✅ Phase 1: mathAPI 존재 확인
    if (!window.mathAPI) {
      setError(t('errors.systemError'))
      setIsCalculating(false)
      return
    }

    if (!input.trim()) {
      setError(t('errors.emptyInput'))
      setIsCalculating(false)
      return
    }

    // ✅ 계산 전 자동 모드 전환 (필요 시)
    const parsed = parsedIntent || parseInputIntent(input)
    if (!forceMode && shouldAutoSwitch(parsed, mode)) {
      setMode(parsed.suggestedMode)
      setAutoSwitched(true)
    }

    try {
      let res

      // ✅ Phase 2: 통합 계산 모드 (카테고리별 필터링 적용)
      if (mode === 'calculateAll') {
        const startTime = performance.now()
        const results: UnifiedCalcResult[] = []

        // ✅ 카테고리별로 실행할 모드만 선택
        const executeModesIds = getCalculateAllModes(currentCategory)

        const allExecutors = [
          { mode: 'evaluate' as CalculatorMode, executor: () => window.mathAPI.evaluate(input) },
          { mode: 'solve' as CalculatorMode, executor: () => window.mathAPI.solve(input, variable, parameterValues) },
          { mode: 'differentiate' as CalculatorMode, executor: () => window.mathAPI.differentiate(input, variable) },
          { mode: 'integrate' as CalculatorMode, executor: () => window.mathAPI.integrate(input, variable) },
          { mode: 'simplify' as CalculatorMode, executor: () => window.mathAPI.simplify(input) },
          { mode: 'factor' as CalculatorMode, executor: () => window.mathAPI.factor(input) },
          { mode: 'expand' as CalculatorMode, executor: () => window.mathAPI.expand(input) },
          { mode: 'limit' as CalculatorMode, executor: () => window.mathAPI.limit(input, variable, limitValue, limitDirection) },
        ]

        // ✅ 카테고리에 해당하는 모드만 실행
        const modeExecutors = allExecutors.filter(exec => executeModesIds.includes(exec.mode))

        for (const { mode: execMode, executor } of modeExecutors) {
          const modeInfo = modes.find(m => m.id === execMode)!
          const modeStartTime = performance.now()

          try {
            const result = executor()
            const executionTime = performance.now() - modeStartTime

            results.push({
              mode: execMode,
              modeLabel: modeInfo.label,
              icon: modeInfo.icon,
              success: result.success,
              result: result.success ? result : undefined,
              error: result.success ? undefined : result.error,
              executionTime
            })
          } catch (err) {
            const executionTime = performance.now() - modeStartTime
            results.push({
              mode: execMode,
              modeLabel: modeInfo.label,
              icon: modeInfo.icon,
              success: false,
              error: err instanceof Error ? err.message : t('errors.cannotCalculate'),
              executionTime
            })
          }
        }

        const totalTime = performance.now() - startTime
        const successCount = results.filter(r => r.success).length
        const failureCount = results.filter(r => !r.success).length

        const unifiedResult: UnifiedCalcResponse = {
          success: successCount > 0,
          input,
          variable,
          limitValue,
          limitDirection,
          results,
          totalTime,
          successCount,
          failureCount
        }

        setResult(unifiedResult)
        saveToHistory({
          success: true,
          result: `${successCount}/${results.length} ${t('ui.successCount')}`
        })
      } else {
        // 기존 단일 모드 계산
        switch (mode) {
          case 'evaluate':
            res = window.mathAPI.evaluate(input)
            break
          case 'solve':
            res = window.mathAPI.solve(input, variable, parameterValues)
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
            res = window.mathAPI.limit(input, variable, limitValue, limitDirection)
            break
        }

        if (!res.success) {
          setError(res.error || t('errors.cannotCalculate'))
        } else {
          setResult(res)
          saveToHistory(res)
        }
      }
    } catch (err: unknown) {
      // ✅ 사용자 친화적 에러 메시지
      const parsed = parsedIntent || parseInputIntent(input)
      const friendlyError = getUserFriendlyError(
        err instanceof Error ? err : new Error('오류가 발생했습니다'),
        parsed.intent
      )
      setError(formatErrorMessage(friendlyError, false))
    } finally {
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

        {/* 모드 선택 (forceMode가 없을 때만 표시) */}
        {!forceMode && (
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
        )}

        {/* 입력 영역 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {t('ui.inputExpression')}
            <span className="ml-2 text-xs font-bold text-blue-600">
              [{t('ui.currentMode')}: {currentMode.label}]
            </span>
            {autoSwitched && parsedIntent && (
              <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold text-green-700 bg-green-100 rounded-full animate-pulse">
                <Zap size={12} />
                {currentMode.icon} {currentMode.label} 자동 적용
              </span>
            )}
            <span className="ml-2 text-xs text-gray-500">
              {t('ui.example')}: {currentMode.example}
            </span>
          </label>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
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

          {/* ✅ Phase 3: 다중 변수 파라미터 입력 UI */}
          {mode === 'solve' && variableAnalysis && variableAnalysis.hasMultipleVars && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-4 rounded-lg border-2 border-amber-200 dark:border-amber-700">
              <h3 className="text-sm font-semibold mb-2 text-amber-900 dark:text-amber-100 flex items-center gap-2">
                <span>📐</span>
                <span>다중 변수 감지됨</span>
              </h3>

              {/* 주 변수 표시 */}
              <div className="mb-3 p-2 bg-white/50 dark:bg-gray-800/50 rounded border border-amber-300 dark:border-amber-600">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">해를 구할 변수:</span>{' '}
                  <span className="font-mono text-blue-600 dark:text-blue-400 text-lg">{variableAnalysis.primaryVariable}</span>
                </p>
              </div>

              {/* 파라미터 입력 필드들 */}
              <div className="space-y-2">
                <label className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  파라미터 값 (선택사항):
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {variableAnalysis.parameters.map(param => (
                    <div key={param} className="flex items-center gap-2">
                      <span className="w-10 text-right font-mono text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {param} =
                      </span>
                      <input
                        type="text"
                        placeholder="값 또는 수식"
                        value={parameterValues[param] || ''}
                        onChange={(e) => setParameterValues({
                          ...parameterValues,
                          [param]: e.target.value
                        })}
                        className="flex-1 px-3 py-2 border-2 border-amber-300 dark:border-amber-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-800"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* 설명 텍스트 */}
              <div className="mt-3 text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <p className="flex items-start gap-1">
                  <span>💡</span>
                  <span>파라미터 값을 입력하면 구체적인 해를 계산합니다.</span>
                </p>
                <p className="flex items-start gap-1">
                  <span>📝</span>
                  <span>비워두면 <strong>{variableAnalysis.primaryVariable}</strong>에 대한 일반 해를 표시합니다.</span>
                </p>
              </div>
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
          <>
            {/* ✅ Phase 2: 통합 계산 결과 UI - 스마트 결과 뷰 */}
            {mode === 'calculateAll' && 'results' in result ? (
              <SmartResultView
                results={result.results}
                input={input}
                onModeClick={(clickedMode) => {
                  // 클릭한 모드로 전환하고 해당 결과 표시
                  const modeResult = result.results.find(r => r.mode === clickedMode)
                  if (modeResult && modeResult.result) {
                    setMode(clickedMode)
                    setResult(modeResult.result)
                  }
                }}
              />
            ) : (
              /* 기존 단일 모드 결과 UI */
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
          </>
        )}

        {/* ✅ Phase 3: 그래프 표시 */}
        {result && !('results' in result) && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showGraph}
                  onChange={(e) => setShowGraph(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                그래프 표시
              </label>
            </div>

            <GraphView
              expression={input}
              mode={mode}
              variable={variable}
              result={result}
              show={showGraph}
            />
          </div>
        )}

        {/* ✅ 토스트 알림 (자동 전환 피드백) */}
        {showToast && (
          <div className="fixed bottom-4 right-4 z-50 animate-slideIn">
            <div className="flex items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg shadow-lg">
              <Zap size={18} className="animate-pulse" />
              <span className="font-medium">{toastMessage}</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
