import { ReactNode } from 'react'

interface MathKeyboardProps {
  onInput: (value: string) => void
  onClear: () => void
  onBackspace: () => void
}

interface KeyButton {
  label: ReactNode
  value: string
  colspan?: number
  variant?: 'number' | 'operator' | 'function' | 'special'
}

export default function MathKeyboard({ onInput, onClear, onBackspace }: MathKeyboardProps) {
  const keys: KeyButton[][] = [
    // 1행: 함수
    [
      { label: 'sin', value: 'sin(', variant: 'function' },
      { label: 'cos', value: 'cos(', variant: 'function' },
      { label: 'tan', value: 'tan(', variant: 'function' },
      { label: 'log', value: 'log(', variant: 'function' },
      { label: 'ln', value: 'ln(', variant: 'function' },
    ],
    // 2행: 지수/루트
    [
      { label: 'x²', value: '^2', variant: 'operator' },
      { label: 'xⁿ', value: '^', variant: 'operator' },
      { label: '√', value: 'sqrt(', variant: 'operator' },
      { label: 'eˣ', value: 'e^', variant: 'operator' },
      { label: '|x|', value: 'abs(', variant: 'function' },
    ],
    // 3행: 상수/변수
    [
      { label: 'π', value: 'pi', variant: 'special' },
      { label: 'e', value: 'e', variant: 'special' },
      { label: 'x', value: 'x', variant: 'special' },
      { label: 'y', value: 'y', variant: 'special' },
      { label: 'i', value: 'i', variant: 'special' },
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
      { label: '0', value: '0', variant: 'number', colspan: 2 },
      { label: '.', value: '.', variant: 'number' },
      { label: '+', value: '+', variant: 'operator' },
      { label: ',', value: ',', variant: 'operator' },
    ],
    // 8행: 제어 버튼
    [
      { label: '←', value: 'backspace', variant: 'special', colspan: 2 },
      { label: 'AC', value: 'clear', variant: 'special', colspan: 3 },
    ],
  ]

  const handleKeyClick = (key: KeyButton) => {
    if (key.value === 'clear') {
      onClear()
    } else if (key.value === 'backspace') {
      onBackspace()
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
      case 'special':
        return `${base} bg-gray-600 dark:bg-gray-500 hover:bg-gray-700 dark:hover:bg-gray-400 text-white`
      default:
        return `${base} bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100`
    }
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 transition-colors">
      <div className="space-y-2">
        {keys.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-5 gap-2">
            {row.map((key, keyIndex) => (
              <button
                key={keyIndex}
                onClick={() => handleKeyClick(key)}
                className={`${getButtonStyle(key.variant)} ${
                  key.colspan === 2 ? 'col-span-2' : ''
                } ${key.colspan === 3 ? 'col-span-3' : ''}`}
              >
                {key.label}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-3 text-xs text-gray-600 dark:text-gray-400 text-center">
        <p>💡 팁: 직접 키보드로도 입력 가능</p>
      </div>
    </div>
  )
}
