import { useState } from 'react'
import Card from './Card'

interface Concept {
  id: string
  title: string
  icon: string
  definition: string
  formula?: string
  examples: string[]
  tips: string[]
}

export default function ConceptGuide() {
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null)

  const concepts: Concept[] = [
    {
      id: 'linear_equation',
      title: '일차방정식',
      icon: '📏',
      definition: '미지수의 차수가 1인 방정식으로, ax + b = 0 형태입니다.',
      formula: 'ax + b = 0 → x = -b/a',
      examples: [
        '2x + 3 = 7 → 2x = 4 → x = 2',
        '5x - 2 = 3x + 4 → 2x = 6 → x = 3',
      ],
      tips: [
        '등호 양쪽에 같은 수를 더하거나 빼도 됩니다',
        '등호 양쪽에 같은 수를 곱하거나 나눠도 됩니다 (0 제외)',
        '미지수를 한쪽으로 모으고, 상수를 다른쪽으로 모으세요',
      ]
    },
    {
      id: 'quadratic_equation',
      title: '이차방정식',
      icon: '📐',
      definition: '미지수의 최고차수가 2인 방정식으로, ax² + bx + c = 0 형태입니다.',
      formula: 'x = (-b ± √(b² - 4ac)) / 2a',
      examples: [
        'x² - 5x + 6 = 0 → (x-2)(x-3) = 0 → x = 2 또는 x = 3',
        'x² - 4 = 0 → x = ±2',
      ],
      tips: [
        '인수분해가 가능하면 인수분해로 푸는 것이 빠릅니다',
        '근의 공식을 사용하면 모든 이차방정식을 풀 수 있습니다',
        '판별식 D = b² - 4ac로 실근의 개수를 판단할 수 있습니다',
      ]
    },
    {
      id: 'geometry',
      title: '기하학',
      icon: '📊',
      definition: '도형의 넓이, 부피, 둘레 등을 계산하는 수학 분야입니다.',
      formula: '원의 넓이 = πr², 구의 부피 = 4/3πr³',
      examples: [
        '반지름 5인 원의 넓이 = π × 5² = 25π ≈ 78.54',
        '반지름 3인 구의 부피 = 4/3 × π × 3³ = 36π ≈ 113.10',
      ],
      tips: [
        'π ≈ 3.14159... (원주율)',
        '원의 둘레 = 2πr, 구의 겉넓이 = 4πr²',
        '삼각형 넓이 = 1/2 × 밑변 × 높이',
      ]
    },
    {
      id: 'statistics',
      title: '통계',
      icon: '📈',
      definition: '데이터를 수집, 분석, 해석하는 수학 분야입니다.',
      formula: '평균 = 합계/개수, 분산 = Σ(x - 평균)²/n',
      examples: [
        '[1, 2, 3, 4, 5]의 평균 = 15/5 = 3',
        '[10, 20, 30]의 중앙값 = 20',
      ],
      tips: [
        '평균: 모든 값의 합을 개수로 나눈 값',
        '중앙값: 크기순으로 정렬했을 때 가운데 값',
        '표준편차: 데이터가 평균에서 얼마나 퍼져있는지 나타냄',
      ]
    },
    {
      id: 'factorization',
      title: '인수분해',
      icon: '🔨',
      definition: '다항식을 여러 인수의 곱으로 나타내는 것입니다.',
      formula: 'a² - b² = (a+b)(a-b), x² + (a+b)x + ab = (x+a)(x+b)',
      examples: [
        'x² - 9 = (x+3)(x-3)',
        'x² - 5x + 6 = (x-2)(x-3)',
      ],
      tips: [
        '공통인수를 먼저 찾으세요',
        '완전제곱식 a² ± 2ab + b² = (a±b)²',
        '인수분해는 전개의 역과정입니다',
      ]
    },
    {
      id: 'prime',
      title: '소수',
      icon: '🔢',
      definition: '1과 자기 자신만을 약수로 가지는 1보다 큰 자연수입니다.',
      examples: [
        '2, 3, 5, 7, 11, 13, 17, 19, 23, 29...',
        '36 = 2² × 3² (소인수분해)',
      ],
      tips: [
        '2는 유일한 짝수 소수입니다',
        '소인수분해: 자연수를 소수의 곱으로 나타내기',
        '에라토스테네스의 체로 소수를 찾을 수 있습니다',
      ]
    },
    {
      id: 'simultaneous_equations',
      title: '연립방정식',
      icon: '⚖️',
      definition: '두 개 이상의 방정식을 동시에 만족하는 해를 구하는 것입니다.',
      formula: 'ax + by = c, dx + ey = f',
      examples: [
        '2x + y = 5, x - y = 1 → x = 2, y = 1',
        '가감법, 대입법으로 풀 수 있습니다',
      ],
      tips: [
        '가감법: 한 미지수를 소거하여 나머지를 구함',
        '대입법: 한 식을 다른 식에 대입하여 풀이',
        '두 식의 해가 교점의 좌표입니다',
      ]
    },
    {
      id: 'polynomial',
      title: '다항식',
      icon: '📦',
      definition: '하나 이상의 항으로 이루어진 식으로, 덧셈과 곱셈으로 연결됩니다.',
      formula: 'an·x^n + an-1·x^(n-1) + ... + a1·x + a0',
      examples: [
        '(x+2)(x+3) = x² + 5x + 6 (전개)',
        'x³ + 2x² - x + 5 (3차 다항식)',
      ],
      tips: [
        '항의 개수에 따라 단항식, 이항식, 삼항식 등으로 구분',
        '최고차항의 차수가 다항식의 차수입니다',
        '동류항끼리 모으면 식이 간단해집니다',
      ]
    },
    {
      id: 'inequality',
      title: '부등식',
      icon: '⚡',
      definition: '두 수나 식의 대소관계를 나타내는 식입니다.',
      formula: 'a > b, a < b, a ≥ b, a ≤ b',
      examples: [
        '2x + 3 > 7 → 2x > 4 → x > 2',
        'x² - 4 < 0 → -2 < x < 2',
      ],
      tips: [
        '등호 양쪽에 같은 수를 더하거나 빼도 부등호 유지',
        '양수를 곱하면 부등호 유지, 음수를 곱하면 부등호 반대',
        '절댓값 부등식: |x| < a → -a < x < a',
      ]
    },
    {
      id: 'probability',
      title: '확률',
      icon: '🎲',
      definition: '어떤 사건이 일어날 가능성을 수치로 나타낸 것입니다.',
      formula: 'P(A) = 사건 A가 일어나는 경우의 수 / 전체 경우의 수',
      examples: [
        '주사위 1개: 짝수 나올 확률 = 3/6 = 1/2',
        '동전 2개: 모두 앞면 = 1/4',
      ],
      tips: [
        '확률의 범위: 0 ≤ P(A) ≤ 1',
        '조합 nCr = n! / (r!(n-r)!)',
        '순열 nPr = n! / (n-r)!',
      ]
    },
    {
      id: 'matrix',
      title: '행렬',
      icon: '🔷',
      definition: '수나 식을 직사각형 모양으로 배열한 것입니다.',
      formula: 'A × B (행렬의 곱셈), det(A) (행렬식), A⁻¹ (역행렬)',
      examples: [
        '[[1,2],[3,4]] × [[5,6],[7,8]] = [[19,22],[43,50]]',
        'det([[1,2],[3,4]]) = -2',
      ],
      tips: [
        '행렬 곱셈: (m×n) × (n×p) = (m×p)',
        '단위행렬 I: A × I = I × A = A',
        '역행렬 A⁻¹: A × A⁻¹ = I',
      ]
    },
    {
      id: 'exponent',
      title: '지수와 로그',
      icon: '📉',
      definition: '지수는 거듭제곱을, 로그는 지수의 역연산을 나타냅니다.',
      formula: 'aⁿ, log_a(b) = c ↔ a^c = b',
      examples: [
        '2¹⁰ = 1024',
        'log₁₀(100) = 2 (10² = 100)',
      ],
      tips: [
        'aⁿ × aᵐ = aⁿ⁺ᵐ',
        'log(ab) = log(a) + log(b)',
        '자연로그 ln(x) = log_e(x)',
      ]
    },
    {
      id: 'trigonometry',
      title: '삼각함수',
      icon: '📐',
      definition: '직각삼각형의 변의 비율을 이용한 함수입니다.',
      formula: 'sin, cos, tan',
      examples: [
        'sin(30°) = 1/2',
        'cos(60°) = 1/2',
        'tan(45°) = 1',
      ],
      tips: [
        'sin² + cos² = 1 (피타고라스 정리)',
        'tan = sin/cos',
        '라디안: 180° = π rad',
      ]
    },
    {
      id: 'sequence',
      title: '수열',
      icon: '🔗',
      definition: '일정한 규칙에 따라 나열된 수의 순서입니다.',
      formula: '등차수열: aₙ = a₁ + (n-1)d, 등비수열: aₙ = a₁ × r^(n-1)',
      examples: [
        '등차수열: 2, 4, 6, 8, 10... (d=2)',
        '등비수열: 2, 4, 8, 16, 32... (r=2)',
      ],
      tips: [
        '등차수열의 합: Sₙ = n(a₁ + aₙ)/2',
        '등비수열의 합: Sₙ = a₁(1-rⁿ)/(1-r)',
        '일반항을 먼저 구하세요',
      ]
    },
    {
      id: 'vector',
      title: '벡터',
      icon: '➡️',
      definition: '크기와 방향을 가진 양으로, 화살표로 표현합니다.',
      formula: 'a⃗ = (x, y, z)',
      examples: [
        '[1,2] + [3,4] = [4,6]',
        '[1,2]·[3,4] = 1×3 + 2×4 = 11 (내적)',
      ],
      tips: [
        '벡터의 크기: |a⃗| = √(x² + y² + z²)',
        '내적: a⃗·b⃗ = |a⃗||b⃗|cosθ',
        '외적: 두 벡터에 수직인 벡터',
      ]
    },
    {
      id: 'complex_number',
      title: '복소수',
      icon: '🌀',
      definition: '실수와 허수의 합으로 표현되는 수입니다.',
      formula: 'z = a + bi (i² = -1)',
      examples: [
        '(2+3i) + (1-2i) = 3+i',
        '|3+4i| = √(3²+4²) = 5',
      ],
      tips: [
        'i = √(-1), i² = -1',
        '켤레복소수: a+bi의 켤레 = a-bi',
        '복소수 평면: x축=실수, y축=허수',
      ]
    },
    {
      id: 'calculus',
      title: '미분과 적분',
      icon: '∫',
      definition: '함수의 변화율(미분)과 넓이/부피(적분)를 다룹니다.',
      formula: 'd/dx(xⁿ) = nxⁿ⁻¹, ∫xⁿdx = x^(n+1)/(n+1) + C',
      examples: [
        'd/dx(x³) = 3x²',
        '∫2x dx = x² + C',
      ],
      tips: [
        '미분: 순간 변화율, 접선의 기울기',
        '적분: 넓이, 부피, 미분의 역연산',
        '극한: lim(x→a) f(x)',
      ]
    },
  ]

  if (selectedConcept === null) {
    return (
      <Card>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">수학 개념</h2>
            <p className="text-gray-600">학습하고 싶은 개념을 선택하세요</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {concepts.map((concept) => (
              <button
                key={concept.id}
                onClick={() => setSelectedConcept(concept.id)}
                className="p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all"
              >
                <div className="text-3xl mb-2">{concept.icon}</div>
                <div className="text-sm font-semibold text-gray-900">
                  {concept.title}
                </div>
              </button>
            ))}
          </div>
        </div>
      </Card>
    )
  }

  const concept = concepts.find(c => c.id === selectedConcept)
  if (!concept) return null

  return (
    <div className="space-y-4">
      <button
        onClick={() => setSelectedConcept(null)}
        className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
      >
        ← 개념 목록으로
      </button>

      <Card>
        <div className="space-y-6">
          {/* 제목 */}
          <div className="flex items-center gap-3 pb-4 border-b">
            <div className="text-5xl">{concept.icon}</div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{concept.title}</h2>
            </div>
          </div>

          {/* 정의 */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <h3 className="text-sm font-semibold text-blue-900 mb-1">📘 정의</h3>
            <p className="text-blue-800">{concept.definition}</p>
          </div>

          {/* 공식 */}
          {concept.formula && (
            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
              <h3 className="text-sm font-semibold text-purple-900 mb-1">🔢 공식</h3>
              <p className="text-purple-800 font-mono text-lg">{concept.formula}</p>
            </div>
          )}

          {/* 예제 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">📝 예제</h3>
            <div className="space-y-2">
              {concept.examples.map((example, idx) => (
                <div
                  key={idx}
                  className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm"
                >
                  {example}
                </div>
              ))}
            </div>
          </div>

          {/* 팁 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">💡 학습 팁</h3>
            <ul className="space-y-2">
              {concept.tips.map((tip, idx) => (
                <li
                  key={idx}
                  className="flex gap-2 text-sm text-gray-700"
                >
                  <span className="text-yellow-500 flex-shrink-0">✓</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
