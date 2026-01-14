import { ReactNode, useState } from 'react'

interface MathKeyboardProps {
  onInput: (value: string) => void
  onClear: () => void
  onBackspace: () => void
  angleUnit?: 'rad' | 'deg'
}

interface KeyButton {
  label: ReactNode
  value: string
  colspan?: number
  variant?: 'number' | 'operator' | 'function' | 'special' | 'inverse'
}

/**
 * ✅ v1.0.33: 과학계산기 키보드 개선
 * - 역삼각함수 (asin, acos, atan) 추가
 * - 쌍곡선함수 (sinh, cosh, tanh) 추가
 * - 2nd 모드로 확장 함수 접근
 * - 더 많은 수학 상수 및 연산자
 */
export default function MathKeyboard({ onInput, onClear, onBackspace, angleUnit = 'rad' }: MathKeyboardProps) {
  // ✅ 2nd 모드: 역함수/추가 기능 토글
  const [secondMode, setSecondMode] = useState(false)

  // 기본 함수 키
  const basicFunctionKeys: KeyButton[] = [
    { label: 'sin', value: 'sin(', variant: 'function' },
    { label: 'cos', value: 'cos(', variant: 'function' },
    { label: 'tan', value: 'tan(', variant: 'function' },
    { label: 'log', value: 'log(', variant: 'function' },
    { label: 'ln', value: 'ln(', variant: 'function' },
  ]

  // 2nd 모드 역함수 키
  const inverseFunctionKeys: KeyButton[] = [
    { label: 'asin', value: 'asin(', variant: 'inverse' },
    { label: 'acos', value: 'acos(', variant: 'inverse' },
    { label: 'atan', value: 'atan(', variant: 'inverse' },
    { label: '10ˣ', value: '10^', variant: 'inverse' },
    { label: 'eˣ', value: 'e^', variant: 'inverse' },
  ]

  // 기본 지수/루트 키
  const basicPowerKeys: KeyButton[] = [
    { label: 'x²', value: '^2', variant: 'operator' },
    { label: 'xⁿ', value: '^', variant: 'operator' },
    { label: '√', value: 'sqrt(', variant: 'operator' },
    { label: 'eˣ', value: 'exp(', variant: 'operator' },
    { label: '|x|', value: 'abs(', variant: 'function' },
  ]

  // 2nd 모드 쌍곡선함수 키
  const hyperbolicKeys: KeyButton[] = [
    { label: 'sinh', value: 'sinh(', variant: 'inverse' },
    { label: 'cosh', value: 'cosh(', variant: 'inverse' },
    { label: 'tanh', value: 'tanh(', variant: 'inverse' },
    { label: '∛', value: 'cbrt(', variant: 'inverse' },
    { label: 'ⁿ√', value: 'nthRoot(', variant: 'inverse' },
  ]

  const keys: KeyButton[][] = [
    // 1행: 함수 (2nd 모드에 따라 변경)
    secondMode ? inverseFunctionKeys : basicFunctionKeys,
    // 2행: 지수/루트 (2nd 모드에 따라 변경)
    secondMode ? hyperbolicKeys : basicPowerKeys,
    // 3행: 상수/변수/추가 연산자
    [
      { label: 'π', value: 'pi', variant: 'special' },
      { label: 'e', value: 'e', variant: 'special' },
      { label: 'x', value: 'x', variant: 'special' },
      { label: 'y', value: 'y', variant: 'special' },
      { label: secondMode ? '∞' : 'i', value: secondMode ? 'Infinity' : 'i', variant: 'special' },
    ],
    // 4행: 숫자 7-9, 연산자
    [
      { label: '7', value: '7', variant: 'number' },
      { label: '8', value: '8', variant: 'number' },
      { label: '9', value: '9', variant: 'number' },
      { label: '÷', value: '/', variant: 'operator' },
      { label: '(', value: '(', variant: 'operator' },
    ],
    // 5행: 숫자 4-6, 연산자
    [
      { label: '4', value: '4', variant: 'number' },
      { label: '5', value: '5', variant: 'number' },
      { label: '6', value: '6', variant: 'number' },
      { label: '×', value: '*', variant: 'operator' },
      { label: ')', value: ')', variant: 'operator' },
    ],
    // 6행: 숫자 1-3, 연산자
    [
      { label: '1', value: '1', variant: 'number' },
      { label: '2', value: '2', variant: 'number' },
      { label: '3', value: '3', variant: 'number' },
      { label: '−', value: '-', variant: 'operator' },
      { label: '=', value: '=', variant: 'operator' },
    ],
    // 7행: 0, 소수점, 연산자
    [
      { label: '0', value: '0', variant: 'number' },
      { label: '.', value: '.', variant: 'number' },
      { label: '+', value: '+', variant: 'operator' },
      { label: ',', value: ',', variant: 'operator' },
      { label: '%', value: '%', variant: 'operator' },
    ],
    // 8행: 제어 버튼
    [
      { label: '2nd', value: '2nd', variant: 'special' },
      { label: '←', value: 'backspace', variant: 'special' },
      { label: 'AC', value: 'clear', variant: 'special', colspan: 2 },
      { label: 'Ans', value: 'Ans', variant: 'special' },
    ],
  ]

  const handleKeyClick = (key: KeyButton) => {
    if (key.value === 'clear') {
      onClear()
    } else if (key.value === 'backspace') {
      onBackspace()
    } else if (key.value === '2nd') {
      setSecondMode(!secondMode)
    } else if (key.value === 'Ans') {
      // Ans는 마지막 결과 참조 (향후 구현)
      onInput('Ans')
    } else {
      onInput(key.value)
    }
  }

  const getButtonStyle = (variant?: string) => {
    const base = 'h-12 rounded-lg font-medium transition-all active:scale-95 text-sm'

    switch (variant) {
      case 'number':
        return `${base} bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100`
      case 'operator':
        return `${base} bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white`
      case 'function':
        return `${base} bg-purple-500 dark:bg-purple-600 hover:bg-purple-600 dark:hover:bg-purple-700 text-white`
      case 'inverse':
        return `${base} bg-orange-500 dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-700 text-white`
      case 'special':
        return `${base} bg-gray-600 dark:bg-gray-500 hover:bg-gray-700 dark:hover:bg-gray-400 text-white`
      default:
        return `${base} bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100`
    }
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 transition-colors">
      {/* ✅ v1.0.33: 2nd 모드 표시기 */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {secondMode && (
            <span className="px-2 py-0.5 text-xs font-bold bg-orange-500 text-white rounded animate-pulse">
              2nd ON
            </span>
          )}
          <span className={`px-2 py-0.5 text-xs font-bold rounded ${
            angleUnit === 'deg'
              ? 'bg-orange-500 text-white'
              : 'bg-blue-500 text-white'
          }`}>
            {angleUnit.toUpperCase()}
          </span>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {secondMode ? '역함수/쌍곡선' : '기본 함수'}
        </span>
      </div>

      <div className="space-y-2">
        {keys.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-5 gap-2">
            {row.map((key, keyIndex) => (
              <button
                key={keyIndex}
                onClick={() => handleKeyClick(key)}
                className={`${getButtonStyle(key.variant)} ${
                  key.colspan === 2 ? 'col-span-2' : ''
                } ${key.colspan === 3 ? 'col-span-3' : ''} ${
                  key.value === '2nd' && secondMode ? 'ring-2 ring-orange-400' : ''
                }`}
              >
                {key.label}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-3 text-xs text-gray-600 dark:text-gray-400 text-center space-y-1">
        <p>💡 팁: 직접 키보드로도 입력 가능</p>
        <p>🔄 2nd 버튼: 역삼각함수, 쌍곡선함수 사용</p>
      </div>
    </div>
  )
}
