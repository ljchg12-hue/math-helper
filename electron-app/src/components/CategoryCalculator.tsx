import { useState } from 'react'
import Card from './Card'
import UniversalCalculator from './UniversalCalculator'
import LinearCalculator from './LinearCalculator'
import QuadraticCalculator from './QuadraticCalculator'
import GeometryCalculator from './GeometryCalculator'
import StatisticsCalculator from './StatisticsCalculator'
import FactorizationCalculator from './FactorizationCalculator'
import PrimeCalculator from './PrimeCalculator'
import SimultaneousCalculator from './SimultaneousCalculator'
import PolynomialCalculator from './PolynomialCalculator'
import InequalityCalculator from './InequalityCalculator'
import ProbabilityCalculator from './ProbabilityCalculator'
import MatrixCalculator from './MatrixCalculator'
import ExponentCalculator from './ExponentCalculator'
import TrigonometryCalculator from './TrigonometryCalculator'
import SequenceCalculator from './SequenceCalculator'
import VectorCalculator from './VectorCalculator'
import ComplexCalculator from './ComplexCalculator'
import CalculusCalculator from './CalculusCalculator'

interface Category {
  id: string
  name: string
  icon: string
  samples: string[]
  description: string
}

interface CategoryCalculatorProps {
  initialInput?: string
  onInputUsed?: () => void
}

export default function CategoryCalculator({ initialInput, onInputUsed }: CategoryCalculatorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories: Category[] = [
    {
      id: 'linear_equation',
      name: '일차방정식',
      icon: '📏',
      samples: ['2x + 3 = 7', '5x - 2 = 3x + 4', '3(x + 2) = 15'],
      description: 'ax + b = 0 형태의 방정식'
    },
    {
      id: 'quadratic_equation',
      name: '이차방정식',
      icon: '📐',
      samples: ['x^2 - 5x + 6 = 0', '2x^2 + 3x - 2 = 0', 'x^2 - 4 = 0'],
      description: 'ax² + bx + c = 0 형태의 방정식'
    },
    {
      id: 'geometry',
      name: '기하학',
      icon: '📊',
      samples: ['pi * 5^2', '2 * pi * 3', '4/3 * pi * 2^3'],
      description: '원, 구, 삼각형 등의 넓이/부피 계산'
    },
    {
      id: 'statistics',
      name: '통계',
      icon: '📈',
      samples: ['mean([1, 2, 3, 4, 5])', 'median([10, 20, 30, 40])', 'std([5, 10, 15, 20])'],
      description: '평균, 중앙값, 표준편차 계산'
    },
    {
      id: 'factorization',
      name: '인수분해',
      icon: '🔨',
      samples: ['x^2 - 5x + 6', 'x^2 - 9', 'x^2 + 4x + 4'],
      description: '다항식을 인수의 곱으로 표현'
    },
    {
      id: 'prime',
      name: '소수 판정',
      icon: '🔢',
      samples: ['isPrime(17)', 'isPrime(24)', 'primeFactors(36)'],
      description: '소수 판정 및 소인수분해'
    },
    {
      id: 'simultaneous_equations',
      name: '연립방정식',
      icon: '⚖️',
      samples: ['2x + y = 5, x - y = 1', '3x + 2y = 12, x + y = 5'],
      description: '두 개 이상의 방정식을 동시에 만족하는 해'
    },
    {
      id: 'polynomial',
      name: '다항식',
      icon: '📦',
      samples: ['(x+2)(x+3)', '(x-1)^3', 'x^3 + 3x^2 + 3x + 1'],
      description: '다항식 전개 및 정리'
    },
    {
      id: 'inequality',
      name: '부등식',
      icon: '⚡',
      samples: ['2x + 3 > 7', 'x^2 - 4 < 0', '3x - 1 >= 5'],
      description: '부등호를 포함한 식'
    },
    {
      id: 'probability',
      name: '확률',
      icon: '🎲',
      samples: ['combinations(5, 2)', 'permutations(4, 2)', 'factorial(5)'],
      description: '조합, 순열, 팩토리얼'
    },
    {
      id: 'matrix',
      name: '행렬',
      icon: '🔷',
      samples: ['[[1,2],[3,4]] * [[5,6],[7,8]]', 'det([[1,2],[3,4]])', 'inv([[1,2],[3,4]])'],
      description: '행렬 연산 (곱셈, 역행렬, 행렬식)'
    },
    {
      id: 'exponent',
      name: '지수/로그',
      icon: '📉',
      samples: ['2^10', 'log(100, 10)', 'log(e^3)'],
      description: '지수 계산 및 로그 계산'
    },
    {
      id: 'trigonometry',
      name: '삼각함수',
      icon: '📐',
      samples: ['sin(pi/6)', 'cos(pi/4)', 'tan(pi/3)'],
      description: '사인, 코사인, 탄젠트 계산'
    },
    {
      id: 'sequence',
      name: '수열',
      icon: '🔗',
      samples: ['2n + 1 (n=1~10)', 'n^2 (n=1~5)', 'sum(1~100)'],
      description: '등차수열, 등비수열, 수열의 합'
    },
    {
      id: 'vector',
      name: '벡터',
      icon: '➡️',
      samples: ['[1,2,3] + [4,5,6]', 'dot([1,2], [3,4])', 'cross([1,0,0], [0,1,0])'],
      description: '벡터 덧셈, 내적, 외적'
    },
    {
      id: 'complex_number',
      name: '복소수',
      icon: '🌀',
      samples: ['(2 + 3i) + (1 - 2i)', '(1 + i) * (1 - i)', 'abs(3 + 4i)'],
      description: '복소수 연산 및 절댓값'
    },
    {
      id: 'calculus',
      name: '미분/적분',
      icon: '∫',
      samples: ['differentiate: x^3 + 2x^2', 'integrate: 2x + 1', 'limit: (x^2-1)/(x-1)'],
      description: '함수의 미분, 적분, 극한'
    },
  ]

  if (selectedCategory === null) {
    return (
      <Card>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">계산기 카테고리</h2>
            <p className="text-gray-600">원하는 계산 유형을 선택하세요</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className="p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
              >
                <div className="text-3xl mb-2">{category.icon}</div>
                <div className="text-sm font-semibold text-gray-900 mb-1">
                  {category.name}
                </div>
                <div className="text-xs text-gray-500 line-clamp-2">
                  {category.description}
                </div>
              </button>
            ))}
          </div>
        </div>
      </Card>
    )
  }

  const category = categories.find(c => c.id === selectedCategory)
  if (!category) return null

  // ✅ Phase 3: 카테고리별 특화 계산기 매핑
  const renderCalculator = () => {
    switch (selectedCategory) {
      case 'linear_equation':
        return <LinearCalculator />
      case 'quadratic_equation':
        return <QuadraticCalculator />
      case 'geometry':
        return <GeometryCalculator />
      case 'statistics':
        return <StatisticsCalculator />
      case 'factorization':
        return <FactorizationCalculator />
      case 'prime':
        return <PrimeCalculator />
      case 'simultaneous_equations':
        return <SimultaneousCalculator />
      case 'polynomial':
        return <PolynomialCalculator />
      case 'inequality':
        return <InequalityCalculator />
      case 'probability':
        return <ProbabilityCalculator />
      case 'matrix':
        return <MatrixCalculator />
      case 'exponent':
        return <ExponentCalculator />
      case 'trigonometry':
        return <TrigonometryCalculator />
      case 'sequence':
        return <SequenceCalculator />
      case 'vector':
        return <VectorCalculator />
      case 'complex_number':
        return <ComplexCalculator />
      case 'calculus':
        return <CalculusCalculator />
      default:
        // 기본값: UniversalCalculator (공식 자동 입력 지원)
        return (
          <UniversalCalculator
            key={selectedCategory}
            initialInput={initialInput}
            onInputUsed={onInputUsed}
          />
        )
    }
  }

  return (
    <div className="space-y-4">
      {/* 뒤로가기 버튼 */}
      <button
        onClick={() => setSelectedCategory(null)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
      >
        ← 카테고리 목록으로
      </button>

      {/* 선택된 카테고리 정보 */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{category.icon}</div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
              <p className="text-sm text-gray-600">{category.description}</p>
            </div>
          </div>

          {/* 샘플 예제 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">📝 예제:</h3>
            <div className="grid gap-2">
              {category.samples.map((sample, idx) => (
                <div
                  key={idx}
                  className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg font-mono text-sm text-blue-900"
                >
                  {sample}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* ✅ 카테고리별 특화 계산기 렌더링 */}
      {renderCalculator()}
    </div>
  )
}
