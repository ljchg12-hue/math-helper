import { useState } from 'react'
import Card from './Card'

interface Problem {
  question: string
  solution: string
  steps: string[]
  difficulty: 'easy' | 'medium' | 'hard'
}

type Category =
  | 'linear_equation'
  | 'quadratic_equation'
  | 'geometry'
  | 'statistics'
  | 'factorization'
  | 'prime'
  | 'simultaneous_equations'
  | 'polynomial'
  | 'inequality'
  | 'probability'
  | 'matrix'
  | 'exponent'
  | 'trigonometry'
  | 'sequence'
  | 'vector'
  | 'complex_number'
  | 'calculus'

type Difficulty = 'easy' | 'medium' | 'hard'

export default function ProblemGenerator() {
  const [category, setCategory] = useState<Category>('linear_equation')
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [problem, setProblem] = useState<Problem | null>(null)
  const [showSolution, setShowSolution] = useState(false)

  const categories = [
    { id: 'linear_equation' as Category, name: '일차방정식', icon: '📏' },
    { id: 'quadratic_equation' as Category, name: '이차방정식', icon: '📐' },
    { id: 'geometry' as Category, name: '기하학', icon: '📊' },
    { id: 'statistics' as Category, name: '통계', icon: '📈' },
    { id: 'factorization' as Category, name: '인수분해', icon: '🔨' },
    { id: 'prime' as Category, name: '소수', icon: '🔢' },
    { id: 'simultaneous_equations' as Category, name: '연립방정식', icon: '⚖️' },
    { id: 'polynomial' as Category, name: '다항식', icon: '📦' },
    { id: 'inequality' as Category, name: '부등식', icon: '⚡' },
    { id: 'probability' as Category, name: '확률', icon: '🎲' },
    { id: 'matrix' as Category, name: '행렬', icon: '🔷' },
    { id: 'exponent' as Category, name: '지수/로그', icon: '📉' },
    { id: 'trigonometry' as Category, name: '삼각함수', icon: '📐' },
    { id: 'sequence' as Category, name: '수열', icon: '🔗' },
    { id: 'vector' as Category, name: '벡터', icon: '➡️' },
    { id: 'complex_number' as Category, name: '복소수', icon: '🌀' },
    { id: 'calculus' as Category, name: '미분/적분', icon: '∫' },
  ]

  const difficulties = [
    { id: 'easy' as Difficulty, name: '쉬움', color: 'bg-green-500' },
    { id: 'medium' as Difficulty, name: '보통', color: 'bg-yellow-500' },
    { id: 'hard' as Difficulty, name: '어려움', color: 'bg-red-500' },
  ]

  const generateProblem = (): Problem => {
    const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

    if (category === 'linear_equation') {
      if (difficulty === 'easy') {
        const a = rand(2, 5)
        // ✅ FIX v1.0.31: 정수 해가 나오도록 x를 먼저 결정
        const x = rand(1, 10)
        const b = rand(1, 10)
        const c = a * x + b  // c = ax + b이므로 x = (c-b)/a는 항상 정수
        return {
          question: `${a}x + ${b} = ${c}`,
          solution: `x = ${x}`,
          steps: [
            `${a}x + ${b} = ${c}`,
            `${a}x = ${c - b}`,
            `x = ${x}`,
          ],
          difficulty: 'easy'
        }
      } else if (difficulty === 'medium') {
        const a = rand(2, 5)
        const b = rand(1, 10)
        // ✅ BUG FIX v1.0.31: a ≠ c 보장 (0으로 나눔 방지)
        let c = rand(2, 5)
        while (c === a) c = rand(2, 5)
        const d = rand(1, 10)
        const x = (d - b) / (a - c)
        return {
          question: `${a}x + ${b} = ${c}x + ${d}`,
          solution: `x = ${x.toFixed(2)}`,
          steps: [
            `${a}x + ${b} = ${c}x + ${d}`,
            `${a}x - ${c}x = ${d} - ${b}`,
            `${a - c}x = ${d - b}`,
            `x = ${x.toFixed(2)}`,
          ],
          difficulty: 'medium'
        }
      } else {
        // ✅ FIX v1.0.31: 정수 해가 나오도록 개선
        const a = rand(2, 5)
        const x = rand(-5, 10)  // 음수도 포함하여 난이도 up
        const b = rand(1, 10)
        const c = a * (x + b)  // c = a(x+b)이므로 x는 항상 정수
        return {
          question: `${a}(x + ${b}) = ${c}`,
          solution: `x = ${x}`,
          steps: [
            `${a}(x + ${b}) = ${c}`,
            `x + ${b} = ${c / a}`,
            `x = ${c / a} - ${b} = ${x}`,
          ],
          difficulty: 'hard'
        }
      }
    } else if (category === 'quadratic_equation') {
      if (difficulty === 'easy') {
        const r1 = rand(1, 5)
        // ✅ FIX v1.0.31: 중복근 방지 (r1 ≠ r2)
        let r2 = rand(1, 5)
        while (r2 === r1) r2 = rand(1, 5)
        const b = -(r1 + r2)
        const c = r1 * r2
        return {
          question: `x² ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c} = 0`,
          solution: `x = ${r1} 또는 x = ${r2}`,
          steps: [
            `x² ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c} = 0`,
            `(x - ${r1})(x - ${r2}) = 0`,
            `x = ${r1} 또는 x = ${r2}`,
          ],
          difficulty: 'easy'
        }
      } else {
        const a = 1
        const b = rand(-10, 10)
        const c = rand(-10, 10)
        const discriminant = b * b - 4 * a * c

        // ✅ BUG FIX: 허근 처리를 먼저 (NaN 방지)
        if (discriminant < 0) {
          const realPart = -b / (2 * a)
          const imagPart = Math.sqrt(-discriminant) / (2 * a)
          return {
            question: `x² ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c} = 0`,
            solution: '실근 없음 (허근)',
            steps: [
              `x² ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c} = 0`,
              `근의 공식: x = (-b ± √(b² - 4ac)) / 2a`,
              `판별식: D = ${b}² - 4(1)(${c}) = ${discriminant}`,
              'D < 0이므로 실근이 없습니다',
              `허근: x = ${realPart.toFixed(2)} ± ${imagPart.toFixed(2)}i`,
            ],
            difficulty: difficulty
          }
        }

        const x1 = (-b + Math.sqrt(discriminant)) / (2 * a)
        const x2 = (-b - Math.sqrt(discriminant)) / (2 * a)
        return {
          question: `x² ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c} = 0`,
          solution: `x = ${x1.toFixed(2)} 또는 x = ${x2.toFixed(2)}`,
          steps: [
            `x² ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c} = 0`,
            `근의 공식: x = (-b ± √(b² - 4ac)) / 2a`,
            `판별식: D = ${b}² - 4(1)(${c}) = ${discriminant}`,
            `x = (${-b} ± √${discriminant}) / 2`,
            `x = ${x1.toFixed(2)} 또는 x = ${x2.toFixed(2)}`,
          ],
          difficulty: difficulty
        }
      }
    } else if (category === 'geometry') {
      if (difficulty === 'hard') {
        // ✅ Phase 2: Hard - 부채꼴, 원기둥
        const type = rand(0, 1)
        if (type === 0) {
          // 부채꼴
          const r = rand(5, 10)
          const theta = rand(60, 120) // 각도
          const arcLength = (Math.PI * r * theta) / 180
          const area = (Math.PI * r * r * theta) / 360
          return {
            question: `반지름 ${r}cm, 중심각 ${theta}°인 부채꼴의 호의 길이와 넓이를 구하시오. (π = 3.14)`,
            solution: `호의 길이 = ${arcLength.toFixed(2)} cm, 넓이 = ${area.toFixed(2)} cm²`,
            steps: [
              `부채꼴 호의 길이: l = 2πr × (θ/360°)`,
              `l = 2 × 3.14 × ${r} × (${theta}/360) = ${arcLength.toFixed(2)} cm`,
              `부채꼴 넓이: A = πr² × (θ/360°)`,
              `A = 3.14 × ${r}² × (${theta}/360) = ${area.toFixed(2)} cm²`,
            ],
            difficulty: 'hard'
          }
        } else {
          // 원기둥 부피
          const r = rand(3, 8)
          const h = rand(5, 12)
          const volume = Math.PI * r * r * h
          return {
            question: `밑면의 반지름이 ${r}cm, 높이가 ${h}cm인 원기둥의 부피를 구하시오. (π = 3.14)`,
            solution: `${volume.toFixed(2)} cm³`,
            steps: [
              `원기둥 부피 공식: V = πr²h`,
              `V = 3.14 × ${r}² × ${h}`,
              `V = 3.14 × ${r * r} × ${h} = ${volume.toFixed(2)} cm³`,
            ],
            difficulty: 'hard'
          }
        }
      }
      const r = rand(3, 10)
      const area = Math.PI * r * r
      return {
        question: `반지름이 ${r}cm인 원의 넓이를 구하시오. (π = 3.14)`,
        solution: `${(area).toFixed(2)} cm²`,
        steps: [
          `원의 넓이 공식: A = πr²`,
          `A = π × ${r}² = π × ${r * r}`,
          `A = 3.14 × ${r * r} = ${(area).toFixed(2)} cm²`,
        ],
        difficulty
      }
    } else if (category === 'statistics') {
      const nums = Array.from({ length: 5 }, () => rand(1, 20))
      const mean = nums.reduce((a, b) => a + b, 0) / nums.length
      const sorted = [...nums].sort((a, b) => a - b)
      // ✅ BUG FIX: 짝수 개일 때 중앙값 올바르게 계산
      const median = sorted.length % 2 === 1
        ? sorted[Math.floor(sorted.length / 2)]
        : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2

      if (difficulty === 'hard') {
        // ✅ Phase 2: Hard - 표준편차, 분산
        const variance = nums.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / nums.length
        const stdDev = Math.sqrt(variance)
        return {
          question: `다음 자료의 평균, 분산, 표준편차를 구하시오: ${nums.join(', ')}`,
          solution: `평균 = ${mean.toFixed(2)}, 분산 = ${variance.toFixed(2)}, 표준편차 = ${stdDev.toFixed(2)}`,
          steps: [
            `자료: ${nums.join(', ')}`,
            `평균: μ = (${nums.join(' + ')}) / ${nums.length} = ${mean.toFixed(2)}`,
            `분산: σ² = Σ(x - μ)² / n`,
            `= [(${nums.map(x => `(${x}-${mean.toFixed(2)})²`).join(' + ')})] / ${nums.length}`,
            `= ${variance.toFixed(2)}`,
            `표준편차: σ = √(σ²) = √${variance.toFixed(2)} = ${stdDev.toFixed(2)}`,
          ],
          difficulty: 'hard'
        }
      }

      return {
        question: `다음 자료의 평균과 중앙값을 구하시오: ${nums.join(', ')}`,
        solution: `평균 = ${mean.toFixed(2)}, 중앙값 = ${median}`,
        steps: [
          `자료: ${nums.join(', ')}`,
          `평균 = (${nums.join(' + ')}) / ${nums.length} = ${mean.toFixed(2)}`,
          `정렬: ${sorted.join(', ')}`,
          sorted.length % 2 === 1
            ? `중앙값 = ${median} (가운데 값)`
            : `중앙값 = (${sorted[sorted.length / 2 - 1]} + ${sorted[sorted.length / 2]}) / 2 = ${median}`,
        ],
        difficulty
      }
    } else if (category === 'factorization') {
      if (difficulty === 'hard') {
        // ✅ Phase 2: Hard - 3차식 인수분해
        const r = rand(1, 3)
        const a = rand(1, 2)
        const b = 3 * a * r
        const c = 3 * a * r * r
        const d = a * r * r * r
        return {
          question: `${a}x³ + ${b}x² + ${c}x + ${d}를 인수분해하시오`,
          solution: `${a}(x + ${r})³`,
          steps: [
            `${a}x³ + ${b}x² + ${c}x + ${d}`,
            `= ${a}(x³ + ${b / a}x² + ${c / a}x + ${d / a})`,
            `= ${a}(x + ${r})³`,
            `확인: ${a}(x + ${r})³ = ${a}(x³ + ${3 * r}x² + ${3 * r * r}x + ${r * r * r})`,
          ],
          difficulty: 'hard'
        }
      }
      const r1 = rand(1, 5)
      const r2 = rand(1, 5)
      const b = r1 + r2
      const c = r1 * r2
      return {
        question: `x² + ${b}x + ${c}를 인수분해하시오`,
        solution: `(x + ${r1})(x + ${r2})`,
        steps: [
          `x² + ${b}x + ${c}`,
          `${r1} + ${r2} = ${b}, ${r1} × ${r2} = ${c}`,
          `(x + ${r1})(x + ${r2})`,
        ],
        difficulty
      }
    } else if (category === 'simultaneous_equations') {
      if (difficulty === 'hard') {
        // ✅ Phase 2: Hard - 3원 연립방정식
        // ✅ FIX v1.0.31: 행렬식 ≠ 0 보장 (유일해 존재)
        const x = rand(1, 3)
        const y = rand(1, 3)
        const z = rand(1, 3)

        // 행렬식이 0이 아닐 때까지 계수 생성
        let a1: number, b1: number, c1: number
        let a2: number, b2: number, c2: number
        let a3: number, b3: number, c3: number
        let det: number

        do {
          a1 = rand(1, 3); b1 = rand(1, 3); c1 = rand(1, 3)
          a2 = rand(1, 3); b2 = rand(1, 3); c2 = rand(1, 3)
          a3 = rand(1, 3); b3 = rand(1, 3); c3 = rand(1, 3)
          // 3x3 행렬식 계산
          det = a1 * (b2 * c3 - c2 * b3) - b1 * (a2 * c3 - c2 * a3) + c1 * (a2 * b3 - b2 * a3)
        } while (det === 0)

        const d1 = a1 * x + b1 * y + c1 * z
        const d2 = a2 * x + b2 * y + c2 * z
        const d3 = a3 * x + b3 * y + c3 * z
        return {
          question: `${a1}x + ${b1}y + ${c1}z = ${d1}\n${a2}x + ${b2}y + ${c2}z = ${d2}\n${a3}x + ${b3}y + ${c3}z = ${d3}`,
          solution: `x = ${x}, y = ${y}, z = ${z}`,
          steps: [
            `${a1}x + ${b1}y + ${c1}z = ${d1} ... ①`,
            `${a2}x + ${b2}y + ${c2}z = ${d2} ... ②`,
            `${a3}x + ${b3}y + ${c3}z = ${d3} ... ③`,
            '가감법을 이용하여 변수 하나씩 소거',
            `x = ${x}, y = ${y}, z = ${z}`,
          ],
          difficulty: 'hard'
        }
      }
      // ✅ FIX v1.0.31: 2원 연립방정식도 행렬식 ≠ 0 보장
      const x = rand(1, 5)
      const y = rand(1, 5)
      let a: number, b: number, d: number, e: number, det2x2: number

      do {
        a = rand(1, 3)
        b = rand(1, 3)
        d = rand(1, 3)
        e = rand(1, 3)
        det2x2 = a * e - b * d  // 2x2 행렬식
      } while (det2x2 === 0)

      const c = a * x + b * y
      const f = d * x + e * y
      return {
        question: `${a}x + ${b}y = ${c}\n${d}x + ${e}y = ${f}`,
        solution: `x = ${x}, y = ${y}`,
        steps: [
          `${a}x + ${b}y = ${c} ... ①`,
          `${d}x + ${e}y = ${f} ... ②`,
          '가감법 또는 대입법 사용',
          `x = ${x}, y = ${y}`,
        ],
        difficulty
      }
    } else if (category === 'prime') {
      // ✅ Phase 2: Hard - 큰 수 소인수분해 (100-500)
      const num = difficulty === 'easy' ? rand(10, 30) : difficulty === 'medium' ? rand(30, 100) : rand(100, 500)
      const isPrime = (n: number) => {
        if (n <= 1) return false
        if (n <= 3) return true
        if (n % 2 === 0 || n % 3 === 0) return false
        for (let i = 5; i * i <= n; i += 6) {
          if (n % i === 0 || n % (i + 2) === 0) return false
        }
        return true
      }
      const result = isPrime(num)
      const factors = []
      let temp = num
      for (let i = 2; i <= temp; i++) {
        while (temp % i === 0) {
          factors.push(i)
          temp = temp / i
        }
      }
      return {
        question: `${num}은(는) 소수인가요? 소수가 아니라면 소인수분해하세요.`,
        solution: result ? '소수입니다' : `${factors.join(' × ')}`,
        steps: result
          ? [`${num}을 2부터 √${num}까지의 수로 나누어 확인`, '나누어떨어지지 않음 → 소수']
          : [`소인수분해: ${num} = ${factors.join(' × ')}`],
        difficulty
      }
    } else if (category === 'polynomial') {
      if (difficulty === 'easy') {
        const a = rand(1, 5)
        const b = rand(1, 5)
        return {
          question: `(x + ${a})(x + ${b})를 전개하시오`,
          solution: `x² + ${a + b}x + ${a * b}`,
          steps: [
            `(x + ${a})(x + ${b})`,
            `= x² + ${b}x + ${a}x + ${a * b}`,
            `= x² + ${a + b}x + ${a * b}`,
          ],
          difficulty: 'easy'
        }
      } else {
        const a = rand(1, 3)
        const b = rand(1, 5)
        return {
          question: `(x + ${a})³을 전개하시오`,
          solution: `x³ + ${3 * a}x² + ${3 * a * a}x + ${a * a * a}`,
          steps: [
            `(x + ${a})³`,
            `= x³ + 3·${a}·x² + 3·${a}²·x + ${a}³`,
            `= x³ + ${3 * a}x² + ${3 * a * a}x + ${a * a * a}`,
          ],
          difficulty
        }
      }
    } else if (category === 'inequality') {
      // ✅ BUG FIX: a는 2부터 시작 (0 제외, division by zero 방지)
      const a = rand(2, 5)
      const b = rand(1, 10)
      const c = rand(10, 20)
      const x = (c - b) / a
      return {
        question: `${a}x + ${b} > ${c}를 풀이하시오`,
        solution: `x > ${x.toFixed(2)}`,
        steps: [
          `${a}x + ${b} > ${c}`,
          `${a}x > ${c - b}`,
          `x > ${x.toFixed(2)}`,
        ],
        difficulty
      }
    } else if (category === 'probability') {
      if (difficulty === 'easy') {
        const total = 6
        const favorable = rand(1, 3)
        return {
          question: `주사위를 던져서 ${favorable} 이하가 나올 확률은?`,
          solution: `${favorable}/${total} = ${(favorable / total).toFixed(2)}`,
          steps: [
            `전체 경우의 수: 6`,
            `유리한 경우의 수: ${favorable}`,
            `확률 = ${favorable}/6 = ${(favorable / total).toFixed(2)}`,
          ],
          difficulty: 'easy'
        }
      } else {
        const n = rand(5, 10)
        const r = rand(2, Math.min(4, n - 1))
        // ✅ BUG FIX: 재귀 → 반복문 (스택 오버플로우 방지)
        const factorial = (num: number): number => {
          if (num <= 1) return 1
          let result = 1
          for (let i = 2; i <= num; i++) {
            result *= i
          }
          return result
        }
        const comb = factorial(n) / (factorial(r) * factorial(n - r))
        return {
          question: `${n}개 중 ${r}개를 선택하는 조합의 수는?`,
          solution: `${comb}`,
          steps: [
            `조합 공식: nCr = n! / (r!(n-r)!)`,
            `${n}C${r} = ${n}! / (${r}!×${n - r}!)`,
            `= ${comb}`,
          ],
          difficulty
        }
      }
    } else if (category === 'matrix') {
      if (difficulty === 'hard') {
        // ✅ Phase 2: Hard - 3×3 행렬식
        const a = rand(1, 3), b = rand(1, 3), c = rand(1, 3)
        const d = rand(1, 3), e = rand(1, 3), f = rand(1, 3)
        const g = rand(1, 3), h = rand(1, 3), i = rand(1, 3)
        const det = a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g)
        return {
          question: `3×3 행렬의 행렬식을 구하시오:\n[[${a}, ${b}, ${c}],\n [${d}, ${e}, ${f}],\n [${g}, ${h}, ${i}]]`,
          solution: `${det}`,
          steps: [
            `det(A) = a(ei - fh) - b(di - fg) + c(dh - eg)`,
            `= ${a}(${e}·${i} - ${f}·${h}) - ${b}(${d}·${i} - ${f}·${g}) + ${c}(${d}·${h} - ${e}·${g})`,
            `= ${a}(${e * i - f * h}) - ${b}(${d * i - f * g}) + ${c}(${d * h - e * g})`,
            `= ${det}`,
          ],
          difficulty: 'hard'
        }
      }
      const a = rand(1, 5)
      const b = rand(1, 5)
      const c = rand(1, 5)
      const d = rand(1, 5)
      const det = a * d - b * c
      return {
        question: `행렬 [[${a}, ${b}], [${c}, ${d}]]의 행렬식을 구하시오`,
        solution: `${det}`,
        steps: [
          `det([[a, b], [c, d]]) = ad - bc`,
          `det([[${a}, ${b}], [${c}, ${d}]]) = ${a}×${d} - ${b}×${c}`,
          `= ${det}`,
        ],
        difficulty
      }
    } else if (category === 'exponent') {
      if (difficulty === 'easy') {
        const base = rand(2, 5)
        const exp = rand(2, 5)
        const result = Math.pow(base, exp)
        return {
          question: `${base}^${exp}을 계산하시오`,
          solution: `${result}`,
          steps: [
            `${base}^${exp} = ${base} × ${base} × ... (${exp}번)`,
            `= ${result}`,
          ],
          difficulty: 'easy'
        }
      } else {
        const value = Math.pow(10, rand(2, 4))
        const logValue = Math.log10(value)
        return {
          question: `log₁₀(${value})를 구하시오`,
          solution: `${logValue}`,
          steps: [
            `log₁₀(${value}) = x라 하면`,
            `10^x = ${value}`,
            `x = ${logValue}`,
          ],
          difficulty
        }
      }
    } else if (category === 'trigonometry') {
      if (difficulty === 'hard') {
        // ✅ Phase 2: Hard - 삼각함수 합성
        const a = rand(1, 3)
        const b = rand(1, 3)
        const R = Math.sqrt(a * a + b * b)
        const alpha = Math.atan2(b, a) * (180 / Math.PI)
        return {
          question: `${a}sin(x) + ${b}cos(x)를 R·sin(x + α) 형태로 합성하시오`,
          solution: `${R.toFixed(2)}·sin(x + ${alpha.toFixed(2)}°)`,
          steps: [
            `a·sin(x) + b·cos(x) = R·sin(x + α)`,
            `R = √(a² + b²) = √(${a}² + ${b}²) = √${a * a + b * b} = ${R.toFixed(2)}`,
            `tan(α) = b/a = ${b}/${a} = ${(b / a).toFixed(2)}`,
            `α = arctan(${(b / a).toFixed(2)}) ≈ ${alpha.toFixed(2)}°`,
            `답: ${R.toFixed(2)}·sin(x + ${alpha.toFixed(2)}°)`,
          ],
          difficulty: 'hard'
        }
      }
      const angles = [
        { deg: 0, sin: 0, cos: 1, name: '0°' },
        { deg: 30, sin: 0.5, cos: Math.sqrt(3) / 2, name: '30°' },
        { deg: 45, sin: Math.sqrt(2) / 2, cos: Math.sqrt(2) / 2, name: '45°' },
        { deg: 60, sin: Math.sqrt(3) / 2, cos: 0.5, name: '60°' },
        { deg: 90, sin: 1, cos: 0, name: '90°' },
      ]
      const angle = angles[rand(0, angles.length - 1)]
      const func = rand(0, 1) === 0 ? 'sin' : 'cos'
      const result = func === 'sin' ? angle.sin : angle.cos
      return {
        question: `${func}(${angle.name})의 값은?`,
        solution: `${result.toFixed(4)}`,
        steps: [
          `${func}(${angle.name}) = ${result.toFixed(4)}`,
          '단위원에서 좌표값으로 확인',
        ],
        difficulty
      }
    } else if (category === 'sequence') {
      if (difficulty === 'hard') {
        // ✅ Phase 2: Hard - 등비수열의 합
        const a1 = rand(1, 5)
        const r = rand(2, 3) // 공비
        const n = rand(4, 8)
        const an = a1 * Math.pow(r, n - 1)
        const sum = a1 * (Math.pow(r, n) - 1) / (r - 1)
        return {
          question: `첫째항이 ${a1}, 공비가 ${r}인 등비수열의 제${n}항과 첫 ${n}항까지의 합을 구하시오`,
          solution: `제${n}항 = ${an}, 합 = ${sum.toFixed(2)}`,
          steps: [
            `등비수열 일반항: aₙ = a₁ × r^(n-1)`,
            `a${n} = ${a1} × ${r}^${n - 1} = ${a1} × ${Math.pow(r, n - 1)} = ${an}`,
            `등비수열의 합: Sₙ = a₁(r^n - 1)/(r - 1)`,
            `S${n} = ${a1}(${r}^${n} - 1)/(${r} - 1) = ${a1}(${Math.pow(r, n)} - 1)/${r - 1} = ${sum.toFixed(2)}`,
          ],
          difficulty: 'hard'
        }
      }
      const a1 = rand(1, 5)
      const d = rand(2, 5)
      const n = rand(5, 10)
      const an = a1 + (n - 1) * d
      const sum = (n * (a1 + an)) / 2
      return {
        question: `첫째항이 ${a1}, 공차가 ${d}인 등차수열의 제${n}항과 합을 구하시오`,
        solution: `제${n}항 = ${an}, 합 = ${sum}`,
        steps: [
          `등차수열 일반항: aₙ = a₁ + (n-1)d`,
          `a${n} = ${a1} + (${n}-1)×${d} = ${an}`,
          `합: Sₙ = n(a₁ + aₙ)/2 = ${n}(${a1}+${an})/2 = ${sum}`,
        ],
        difficulty
      }
    } else if (category === 'vector') {
      if (difficulty === 'hard') {
        // ✅ Phase 2: Hard - 3차원 벡터 외적
        const v1 = [rand(1, 4), rand(1, 4), rand(1, 4)]
        const v2 = [rand(1, 4), rand(1, 4), rand(1, 4)]
        const cross = [
          v1[1] * v2[2] - v1[2] * v2[1],
          v1[2] * v2[0] - v1[0] * v2[2],
          v1[0] * v2[1] - v1[1] * v2[0]
        ]
        return {
          question: `벡터 a⃗ = [${v1[0]}, ${v1[1]}, ${v1[2]}]와 b⃗ = [${v2[0]}, ${v2[1]}, ${v2[2]}]의 외적 a⃗ × b⃗를 구하시오`,
          solution: `[${cross[0]}, ${cross[1]}, ${cross[2]}]`,
          steps: [
            `외적: a⃗ × b⃗ = |i  j  k|`,
            `           |${v1[0]}  ${v1[1]}  ${v1[2]}|`,
            `           |${v2[0]}  ${v2[1]}  ${v2[2]}|`,
            `= i(${v1[1]}·${v2[2]} - ${v1[2]}·${v2[1]}) - j(${v1[0]}·${v2[2]} - ${v1[2]}·${v2[0]}) + k(${v1[0]}·${v2[1]} - ${v1[1]}·${v2[0]})`,
            `= [${cross[0]}, ${cross[1]}, ${cross[2]}]`,
          ],
          difficulty: 'hard'
        }
      }
      const v1 = [rand(1, 5), rand(1, 5)]
      const v2 = [rand(1, 5), rand(1, 5)]
      const dot = v1[0] * v2[0] + v1[1] * v2[1]
      return {
        question: `벡터 [${v1[0]}, ${v1[1]}]과 [${v2[0]}, ${v2[1]}]의 내적을 구하시오`,
        solution: `${dot}`,
        steps: [
          `내적: a⃗·b⃗ = a₁b₁ + a₂b₂`,
          `[${v1[0]}, ${v1[1]}]·[${v2[0]}, ${v2[1]}] = ${v1[0]}×${v2[0]} + ${v1[1]}×${v2[1]}`,
          `= ${dot}`,
        ],
        difficulty
      }
    } else if (category === 'complex_number') {
      if (difficulty === 'hard') {
        // ✅ Phase 2: Hard - 복소수 나눗셈
        const a = rand(1, 5)
        const b = rand(1, 5)
        const c = rand(1, 5)
        const d = rand(1, 5)
        const denom = c * c + d * d
        const realPart = (a * c + b * d) / denom
        const imagPart = (b * c - a * d) / denom
        return {
          question: `(${a} + ${b}i) ÷ (${c} + ${d}i)를 계산하시오`,
          solution: `${realPart.toFixed(2)} + ${imagPart.toFixed(2)}i`,
          steps: [
            `(${a} + ${b}i) ÷ (${c} + ${d}i)`,
            `분모의 켤레복소수: (${c} - ${d}i)`,
            `= [(${a} + ${b}i)(${c} - ${d}i)] / [(${c} + ${d}i)(${c} - ${d}i)]`,
            `분자: (${a * c + b * d}) + (${b * c - a * d})i`,
            `분모: ${c}² + ${d}² = ${denom}`,
            `= ${realPart.toFixed(2)} + ${imagPart.toFixed(2)}i`,
          ],
          difficulty: 'hard'
        }
      }
      const a = rand(1, 5)
      const b = rand(1, 5)
      const c = rand(1, 5)
      const d = rand(1, 5)
      const realPart = a + c
      const imagPart = b + d
      return {
        question: `(${a} + ${b}i) + (${c} + ${d}i)를 계산하시오`,
        solution: `${realPart} + ${imagPart}i`,
        steps: [
          `(${a} + ${b}i) + (${c} + ${d}i)`,
          `= (${a} + ${c}) + (${b} + ${d})i`,
          `= ${realPart} + ${imagPart}i`,
        ],
        difficulty
      }
    } else if (category === 'calculus') {
      if (difficulty === 'easy' || difficulty === 'medium') {
        const n = rand(2, 5)
        const a = rand(1, 5)
        return {
          question: `f(x) = ${a}x^${n}을 미분하시오`,
          solution: `f'(x) = ${a * n}x^${n - 1}`,
          steps: [
            `미분 공식: d/dx(x^n) = nx^(n-1)`,
            `f'(x) = ${a}·${n}x^${n - 1}`,
            `= ${a * n}x^${n - 1}`,
          ],
          difficulty
        }
      } else {
        // ✅ Phase 2: Hard - 합성함수 미분 (Chain Rule)
        const a = rand(2, 5)
        const b = rand(1, 3)
        const n = rand(2, 4)
        // ✅ FIX v1.0.31: 올바른 계수 계산 (n * a)
        const coefficient = n * a  // f'(x) = n*a*(ax+b)^(n-1)
        return {
          question: `f(x) = (${a}x + ${b})^${n}을 미분하시오`,
          solution: `f'(x) = ${coefficient}(${a}x + ${b})^${n - 1}`,
          steps: [
            `합성함수 미분: d/dx[g(f(x))] = g'(f(x))·f'(x)`,
            `외부함수: u^${n}, 내부함수: ${a}x + ${b}`,
            `외부함수 미분: ${n}u^${n - 1}`,
            `내부함수 미분: ${a}`,
            `f'(x) = ${n}(${a}x + ${b})^${n - 1} × ${a}`,
            `= ${coefficient}(${a}x + ${b})^${n - 1}`,
          ],
          difficulty: 'hard'
        }
      }
    }

    return {
      question: '문제 생성 오류',
      solution: '',
      steps: [],
      difficulty: 'medium'
    }
  }

  const handleGenerate = () => {
    const newProblem = generateProblem()
    setProblem(newProblem)
    setShowSolution(false)
  }

  return (
    <Card>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">기출문제 생성기</h2>
          <p className="text-gray-600">유형과 난이도를 선택하고 문제를 생성하세요</p>
        </div>

        {/* 카테고리 선택 */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">📚 문제 유형</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  category === cat.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* 난이도 선택 */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">⭐ 난이도</h3>
          <div className="flex gap-2">
            {difficulties.map((diff) => (
              <button
                key={diff.id}
                onClick={() => setDifficulty(diff.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  difficulty === diff.id
                    ? `${diff.color} text-white shadow-md`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {diff.name}
              </button>
            ))}
          </div>
        </div>

        {/* 문제 생성 버튼 */}
        <button
          onClick={handleGenerate}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg shadow-md transition-all"
        >
          🎲 문제 생성하기
        </button>

        {/* 문제 표시 */}
        {problem && (
          <div className="space-y-4">
            <div className="p-6 bg-white border-2 border-purple-200 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-semibold text-purple-600">문제</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  problem.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                  problem.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {problem.difficulty === 'easy' ? '쉬움' :
                   problem.difficulty === 'medium' ? '보통' : '어려움'}
                </span>
              </div>
              <p className="text-xl font-mono whitespace-pre-wrap text-gray-900">
                {problem.question}
              </p>
            </div>

            {/* 풀이 보기 버튼 */}
            <button
              onClick={() => setShowSolution(!showSolution)}
              className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-all"
            >
              {showSolution ? '풀이 숨기기' : '풀이 보기'} 👁️
            </button>

            {/* 풀이 과정 */}
            {showSolution && (
              <div className="space-y-3">
                <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                  <p className="text-sm font-semibold text-green-700 mb-1">✅ 정답</p>
                  <p className="text-xl font-mono font-bold text-green-900">
                    {problem.solution}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 border-2 border-gray-200 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 mb-2">📝 풀이 과정</p>
                  <ol className="space-y-2">
                    {problem.steps.map((step, idx) => (
                      <li key={idx} className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold">
                          {idx + 1}
                        </span>
                        <span className="font-mono text-sm text-gray-700 flex-1">
                          {step}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
