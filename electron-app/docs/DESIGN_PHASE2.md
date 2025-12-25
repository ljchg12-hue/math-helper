# Phase 2: 다중 변수 및 그래프 시스템 설계

**작성일**: 2025-12-25
**버전**: v1.0.20 준비
**목표**: 3가지 핵심 문제 해결

---

## 🎯 문제 정의

### 문제 1: 다중 변수 처리 불가
**현상**:
- `x = (-b ± sqrt(b^2 - 4*a*c)) / (2*a)` 입력 시 에러
- `S_n = a * (1 - r^n) / (1 - r)` 입력 시 "수 또는 기호가 필요" 에러

**원인**:
```typescript
// robustMathOps.ts:376 - 단일 변수만 지원
export function safeSolve(equation: string, variable: string = 'x'): RobustResult

// UniversalCalculator.tsx:695 - 1글자만 입력 가능
<input maxLength={1} />
```

**영향**: 공학 계산 불가, 파라미터 방정식 불가

---

### 문제 2: 그래프 생성 실패
**현상**:
- `y=sin(x)` 입력해도 그래프 안 나타남
- 불필요한 "그래프로 표현할 수 없습니다" 메시지

**원인**:
```typescript
// graphHelper.ts:23 - 너무 엄격한 조건
if (variables.length === 0 || variables.length > 2) return false
// ❌ sin(3) → 변수 0개 → 차단
// ❌ x*y*z → 변수 3개 → 차단
```

**영향**: 그래프 기능 거의 작동 안 함

---

### 문제 3: 공학용 계산기 미완성
**현상**: 복잡한 공식 계산 실패

**원인**: 문제 1, 2의 복합

---

## 🏗️ 설계 솔루션

### Solution 1: 다중 변수 시스템

#### 1.1 변수 자동 감지 및 분류
```typescript
// NEW: src/utils/variableAnalyzer.ts

interface VariableAnalysis {
  allVariables: string[]      // ['x', 'a', 'b', 'c']
  primaryVariable: string      // 'x' (기본 solve 대상)
  parameters: string[]         // ['a', 'b', 'c']
  hasMultipleVars: boolean     // true
}

export function analyzeVariables(expression: string): VariableAnalysis {
  const vars = extractVariables(expression)

  // 우선순위: x > y > z > t > 나머지 알파벳순
  const primaryVar = vars.includes('x') ? 'x' :
                     vars.includes('y') ? 'y' :
                     vars.includes('z') ? 'z' :
                     vars.includes('t') ? 't' :
                     vars.sort()[0]

  const parameters = vars.filter(v => v !== primaryVar)

  return {
    allVariables: vars,
    primaryVariable: primaryVar,
    parameters,
    hasMultipleVars: vars.length > 1
  }
}
```

#### 1.2 파라미터 값 입력 UI
```typescript
// UPDATE: src/components/UniversalCalculator.tsx

const [parameterValues, setParameterValues] = useState<Record<string, string>>({})
const variableAnalysis = analyzeVariables(expression)

// UI 렌더링
{variableAnalysis.hasMultipleVars && (
  <div className="bg-amber-50 p-4 rounded-lg">
    <h3 className="text-sm font-semibold mb-2">
      📐 다중 변수 감지됨
    </h3>

    {/* 주 변수 표시 */}
    <div className="mb-3">
      <span className="text-sm text-gray-600">
        해를 구할 변수: <strong>{variableAnalysis.primaryVariable}</strong>
      </span>
    </div>

    {/* 파라미터 입력 */}
    <div className="space-y-2">
      <label className="text-sm text-gray-600">파라미터 값 (선택사항):</label>
      {variableAnalysis.parameters.map(param => (
        <div key={param} className="flex items-center gap-2">
          <span className="w-8 text-right font-mono">{param} =</span>
          <input
            type="text"
            placeholder="값 또는 수식"
            value={parameterValues[param] || ''}
            onChange={(e) => setParameterValues({
              ...parameterValues,
              [param]: e.target.value
            })}
            className="flex-1 px-2 py-1 border rounded"
          />
        </div>
      ))}
    </div>

    {/* 설명 */}
    <p className="text-xs text-gray-500 mt-2">
      💡 파라미터 값을 입력하면 구체적인 해를 계산합니다.
      비워두면 {variableAnalysis.primaryVariable}에 대한 일반 해를 표시합니다.
    </p>
  </div>
)}
```

#### 1.3 파라미터 방정식 풀이 (Nerdamer 활용)
```typescript
// NEW: src/utils/parametricSolver.ts

interface ParametricSolution {
  variable: string
  generalSolution: string        // "(-b ± sqrt(b^2-4*a*c))/(2*a)"
  specificSolution?: string       // "3" (파라미터 값 입력 시)
  substitutions?: Record<string, string>  // {a: "1", b: "-5", c: "6"}
}

export function solveParametric(
  equation: string,
  targetVariable: string,
  parameterValues: Record<string, string> = {}
): ParametricSolution {
  // 1. 일반 해 구하기 (파라미터를 그대로 둔 채)
  const nerdamerExpr = nerdamer(equation)
  const generalSolution = nerdamerExpr.solveFor(targetVariable)

  // 2. 파라미터 값이 주어진 경우 대입
  let specificSolution: string | undefined
  if (Object.keys(parameterValues).length > 0) {
    const evaluated = generalSolution.evaluate(parameterValues)
    specificSolution = evaluated.toString()
  }

  return {
    variable: targetVariable,
    generalSolution: generalSolution.toString(),
    specificSolution,
    substitutions: Object.keys(parameterValues).length > 0 ? parameterValues : undefined
  }
}
```

**예시 동작**:
```typescript
// 입력: "2*x - b*y = 1", x 풀이, b = 3, y = 2
solveParametric("2*x - b*y = 1", "x", {b: "3", y: "2"})
→ {
  variable: "x",
  generalSolution: "(1 + b*y) / 2",      // 일반 해
  specificSolution: "3.5",                 // b=3, y=2 대입 결과
  substitutions: {b: "3", y: "2"}
}

// 입력: "x = (-b + sqrt(b^2 - 4*a*c)) / (2*a)", 파라미터 없음
solveParametric("x = (-b + sqrt(b^2 - 4*a*c)) / (2*a)", "x")
→ {
  variable: "x",
  generalSolution: "(-b + sqrt(b^2 - 4*a*c)) / (2*a)",  // 그대로
  specificSolution: undefined
}
```

#### 1.4 robustMathOps 업데이트
```typescript
// UPDATE: src/utils/robustMathOps.ts

export function safeSolve(
  equation: string,
  options: {
    targetVariable?: string
    parameterValues?: Record<string, string>
  } = {}
): RobustResult {
  // 변수 분석
  const analysis = analyzeVariables(equation)
  const targetVar = options.targetVariable || analysis.primaryVariable

  // 다중 변수 감지
  if (analysis.hasMultipleVars) {
    // parametricSolver 사용
    const solution = solveParametric(equation, targetVar, options.parameterValues)

    return {
      success: true,
      result: solution.specificSolution || solution.generalSolution,
      engine: 'nerdamer',
      metadata: {
        isParametric: true,
        generalSolution: solution.generalSolution,
        specificSolution: solution.specificSolution,
        parameters: analysis.parameters
      }
    }
  }

  // 단일 변수: 기존 로직 유지
  const nerdamerResult = nerdamerOps.solve(equation, targetVar)
  // ...
}
```

---

### Solution 2: 그래프 시스템 개선

#### 2.1 isGraphable 로직 수정
```typescript
// UPDATE: src/utils/graphHelper.ts

export function isGraphable(expression: string, mode: string): boolean {
  // 방정식은 solve 모드에서만
  if (expression.includes('=') && mode !== 'solve') return false

  const variables = extractVariables(expression)

  // ❌ 기존: 0개 또는 2개 초과 → 불가
  // ✅ 신규: 1~2개만 가능
  if (variables.length < 1 || variables.length > 2) {
    return false
  }

  // 1변수: y = f(x) 형태로 그래프 가능
  // 2변수: z = f(x,y) 3D 그래프 또는 등고선 (추후 구현)
  return true
}
```

**변경 효과**:
- **Before**: `sin(3)` → 변수 0개 → ❌ 차단
- **After**: `sin(3)` → 변수 0개 → ❌ 차단 (맞음, 상수는 그래프 불가)
- **Before**: `sin(x)` → 변수 1개 → ✅ 허용
- **After**: `sin(x)` → 변수 1개 → ✅ 허용 (동일)

#### 2.2 GraphView 에러 처리 개선
```typescript
// UPDATE: src/components/GraphView.tsx

useEffect(() => {
  if (!show || !graphRef.current) return

  const variables = extractVariables(expression)

  // 그래프 불가능한 경우: 조용히 숨김 (에러 메시지 없음)
  if (variables.length === 0) {
    setError(null)  // ✅ 에러 메시지 안 보여줌
    return
  }

  if (!isGraphable(expression, mode)) {
    setError('이 수식은 그래프로 표현할 수 없습니다')
    return
  }

  try {
    const plotExpr = convertToPlotFormat(expression, variable)
    const options: FunctionPlotOptions = {
      target: graphRef.current,
      width: graphRef.current.clientWidth,
      height: 300,
      xAxis: { domain: calculateDomain(expression) },
      yAxis: { domain: calculateRange(expression) },
      data: [{
        fn: plotExpr,
        color: '#2563eb',
        graphType: 'polyline',
        nSamples: 1000  // 더 부드러운 곡선
      }],
      grid: true
    }
    functionPlot(options)
    setError(null)
  } catch (err) {
    console.warn('Graph generation failed:', err)
    setError('그래프를 생성할 수 없습니다')
  }
}, [expression, mode, variable, result, show])
```

#### 2.3 도형 렌더링 (기하학 모드 추가)
```typescript
// NEW: src/components/GeometryView.tsx

interface GeometryViewProps {
  shape: 'circle' | 'rectangle' | 'triangle' | 'line'
  parameters: Record<string, number>
  show: boolean
}

export function GeometryView({ shape, parameters, show }: GeometryViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!show || !canvasRef.current) return

    const ctx = canvasRef.current.getContext('2d')!
    ctx.clearRect(0, 0, 400, 400)

    // 좌표계 설정
    ctx.translate(200, 200)  // 중심으로 이동
    ctx.scale(1, -1)         // Y축 반전 (수학 좌표계)

    switch (shape) {
      case 'circle':
        // x^2 + y^2 = r^2
        const r = parameters.r || 50
        ctx.beginPath()
        ctx.arc(0, 0, r, 0, Math.PI * 2)
        ctx.strokeStyle = '#2563eb'
        ctx.lineWidth = 2
        ctx.stroke()
        break

      case 'line':
        // y = mx + b
        const m = parameters.m || 1
        const b = parameters.b || 0
        ctx.beginPath()
        ctx.moveTo(-200, m * (-200) + b)
        ctx.lineTo(200, m * 200 + b)
        ctx.strokeStyle = '#2563eb'
        ctx.lineWidth = 2
        ctx.stroke()
        break

      // ... 다른 도형들
    }
  }, [shape, parameters, show])

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={400}
      className="border rounded"
    />
  )
}
```

#### 2.4 도형 감지 로직
```typescript
// NEW: src/utils/geometryDetector.ts

interface GeometryShape {
  type: 'circle' | 'line' | 'parabola' | 'ellipse' | 'hyperbola'
  equation: string
  parameters: Record<string, number>
}

export function detectGeometry(expression: string): GeometryShape | null {
  const normalized = expression.replace(/\s/g, '').toLowerCase()

  // 원: x^2 + y^2 = r^2
  if (/x\^2\+y\^2=/.test(normalized)) {
    const match = normalized.match(/x\^2\+y\^2=(\d+)/)
    const rSquared = match ? parseInt(match[1]) : 25
    return {
      type: 'circle',
      equation: expression,
      parameters: { r: Math.sqrt(rSquared) }
    }
  }

  // 직선: y = mx + b 또는 ax + by = c
  if (/y=.*x/.test(normalized) || /\dx\+\dy=/.test(normalized)) {
    // 파라미터 추출 로직
    return { type: 'line', equation: expression, parameters: {} }
  }

  // 포물선: y = ax^2 + bx + c
  if (/y=.*x\^2/.test(normalized)) {
    return { type: 'parabola', equation: expression, parameters: {} }
  }

  return null
}
```

---

## 📂 파일 구조 변경

### 신규 파일 (5개)
```
src/
├── utils/
│   ├── variableAnalyzer.ts      (130줄) - 변수 분석
│   ├── parametricSolver.ts      (180줄) - 파라미터 방정식 풀이
│   └── geometryDetector.ts      (150줄) - 도형 감지
└── components/
    └── GeometryView.tsx          (200줄) - 도형 렌더링
```

### 수정 파일 (4개)
```
src/
├── utils/
│   ├── graphHelper.ts            (수정: isGraphable 로직)
│   └── robustMathOps.ts          (수정: safeSolve 다중 변수 지원)
└── components/
    ├── UniversalCalculator.tsx   (수정: 파라미터 입력 UI)
    └── GraphView.tsx             (수정: 에러 처리)
```

---

## 🧪 테스트 시나리오

### TC1: 이차방정식 일반 해
```
입력: "x = (-b + sqrt(b^2 - 4*a*c)) / (2*a)"
모드: 방정식 풀이

예상 동작:
1. 변수 감지: x (주), a, b, c (파라미터)
2. UI: 파라미터 입력 필드 3개 표시
3. 파라미터 비워둠 → 일반 해 그대로 표시
4. 파라미터 입력 (a=1, b=-5, c=6) → x = 2 또는 x = 3
```

### TC2: 등비수열 합 공식
```
입력: "S_n = a * (1 - r^n) / (1 - r)"
모드: 계산

예상 동작:
1. 변수 감지: S_n, a, r, n (모두 파라미터)
2. UI: 파라미터 입력 필드 표시
3. 입력 (a=2, r=3, n=5) → S_n = 484
```

### TC3: sin(x) 그래프
```
입력: "sin(x)"
모드: 계산

예상 동작:
1. 변수 1개 → 그래프 가능
2. GraphView 자동 표시
3. -2π ~ 2π 범위의 사인 곡선 렌더링
```

### TC4: 원 방정식
```
입력: "x^2 + y^2 = 25"
모드: 방정식 풀이

예상 동작:
1. 도형 감지: circle (r=5)
2. GeometryView 표시
3. 반지름 5인 원 그리기
```

### TC5: 상수 계산
```
입력: "sin(3)"
모드: 계산

예상 동작:
1. 변수 0개 → 그래프 불가
2. GraphView 숨김 (에러 메시지 없음)
3. 결과만 표시: "0.14112"
```

---

## 📊 성능 목표

| 지표 | 현재 (v1.0.19) | 목표 (v1.0.20) |
|------|---------------|---------------|
| 다중 변수 방정식 성공률 | 0% | 95%+ |
| 그래프 표시 성공률 | <30% | 90%+ |
| 불필요한 에러 메시지 | 많음 | 거의 없음 |
| 파라미터 방정식 지원 | 없음 | 완전 지원 |
| 도형 렌더링 | 없음 | 5가지 기본 도형 |

---

## 🚀 구현 순서 (Phase 3)

1. **variableAnalyzer.ts** 작성
2. **parametricSolver.ts** 작성
3. **robustMathOps.ts** 업데이트
4. **UniversalCalculator.tsx** UI 추가
5. **graphHelper.ts** 로직 수정
6. **GraphView.tsx** 에러 처리 개선
7. **geometryDetector.ts** 작성 (선택)
8. **GeometryView.tsx** 작성 (선택)

---

**작성자**: Claude Code
**다음 단계**: Phase 3 구현 시작
