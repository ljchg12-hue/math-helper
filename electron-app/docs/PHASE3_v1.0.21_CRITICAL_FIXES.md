# v1.0.21 Critical Fixes

**날짜**: 2025-12-25
**버전**: v1.0.21
**빌드 로그**: /tmp/build-v1.0.21.log

---

## 🚨 긴급 수정 사항 (v1.0.20 → v1.0.21)

### 1. ✅ "mordamer is not defined" 에러 수정

**문제**: v1.0.20에서 방정식 풀이 실패 (사용자 보고)
- 이전에 잘 되던 방정식도 "mordamer is not defined" 에러 발생
- 체크는 정상인데 풀이 못함

**원인**: `parametricSolver.ts`에서 nerdamer를 직접 import
```typescript
// ❌ BROKEN (v1.0.20):
import nerdamer from 'nerdamer'
import 'nerdamer/Solve'
import 'nerdamer/Algebra'
```
- Bundled 환경(preload.js)에서는 전역 nerdamer 사용 필요
- Import 방식은 브라우저 환경에서만 동작

**해결책**: 전역 nerdamer 선언 사용
```typescript
// ✅ FIXED (v1.0.21):
interface NerdamerExpression {
  toString(): string
  text(): string
  evaluate(vars?: Record<string, any>): NerdamerExpression
  simplify(): NerdamerExpression
}

interface NerdamerStatic {
  (expr: string): NerdamerExpression
  solveEquations(equation: string, variable: string): string[] | string
}

declare const nerdamer: NerdamerStatic
```

**수정 파일**: `src/utils/parametricSolver.ts` (7-19줄)

---

### 2. ✅ 파라미터 UI 수정 (고정 리스트 표시)

**문제**: v1.0.20에서 파라미터 입력 필드가 동적 생성
- 감지된 변수만 표시
- 사용자 요구사항: 고정된 a, b, c, d, e, f 표시 (어떤 변수가 올지 모르므로)

**원인**: 잘못된 요구사항 해석
```typescript
// ❌ WRONG (v1.0.20):
{variableAnalysis && variableAnalysis.hasMultipleVars && (
  <div className="grid grid-cols-2 gap-2">
    {variableAnalysis.parameters.map(param => (
      // 동적 생성 (감지된 변수만)
    ))}
  </div>
)}
```

**해결책**: 고정 파라미터 리스트 (a~f) 항상 표시
```typescript
// ✅ CORRECT (v1.0.21):
{mode === 'solve' && (
  <div className="bg-gradient-to-r from-amber-50 to-orange-50 ...">
    <h3 className="text-sm font-semibold mb-2 text-amber-800">
      📐 파라미터 입력
    </h3>
    <label className="block text-xs text-amber-700 mb-2">
      파라미터 값 (필요한 것만 입력):
    </label>
    <div className="grid grid-cols-3 gap-2">
      {['a', 'b', 'c', 'd', 'e', 'f'].map(param => (
        <div key={param} className="flex items-center gap-2">
          <span className="w-8 text-right font-mono text-sm font-semibold text-amber-800">
            {param} =
          </span>
          <input
            type="text"
            placeholder="값"
            value={parameterValues[param] || ''}
            onChange={(e) => setParameterValues({
              ...parameterValues,
              [param]: e.target.value
            })}
            className="flex-1 px-2 py-1.5 text-sm border-2 border-amber-300 rounded-lg ..."
          />
        </div>
      ))}
    </div>
  </div>
)}
```

**수정 파일**: `src/components/UniversalCalculator.tsx`

**UI 개선**:
- 3열 그리드 레이아웃 (2열 → 3열)
- Amber/Orange 그라데이션 배경
- 각 파라미터: `a =`, `b =`, ... `f =` 레이블
- 플레이스홀더: "값"
- Solve 모드에서 항상 표시

---

## 📊 빌드 정보

```bash
✓ vite build: 성공 (1.35s)
✓ preload.js 번들: 성공 (TypeScript 지원)
✓ ZIP 생성: MathHelper-v1.0.21-Windows-Portable.zip (107MB)
✓ 릴리스 복사: /mnt/4tb/1.work/release/
```

---

## 🔧 수정된 파일 (v1.0.20 → v1.0.21)

1. **`package.json`** - 버전: 1.0.20 → 1.0.21
2. **`src/utils/parametricSolver.ts`** - 전역 nerdamer 선언 사용
3. **`src/components/UniversalCalculator.tsx`** - 고정 a-f 파라미터 리스트

---

## ✅ 검증 완료

- [x] "mordamer is not defined" 에러 수정
- [x] 파라미터 UI 고정 리스트 (a~f) 표시
- [x] 빌드 성공
- [x] ZIP 생성
- [x] 릴리스 디렉토리 복사

---

**생성 일시**: 2025-12-25 22:46
**작성자**: Claude Code
**빌드 로그**: /tmp/build-v1.0.21.log
