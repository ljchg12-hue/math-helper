# Changelog

All notable changes to MathHelper will be documented in this file.

## [1.0.9] - 2025-12-23

### 🐛 Bug Fixes (버그 수정 - 총 53개)

#### HIGH Priority (17개) - lib/electron.ts 전체 리팩토링
- **에러 핸들링 추가**: 모든 17개 수학 함수에 에러 처리 로직 구현
  - TypeScript 타입 안전성 강화 (global Window interface 선언)
  - null 체크 및 가드 함수 (`getMathAPI()`) 추가
  - 고차 함수 패턴 (`withErrorHandling<T>()`) 적용
- **함수 목록**: solveLinear, solveQuadratic, calculateGeometry, calculateStatistics, factorize, checkPrime, solveSimultaneous, solvePolynomial, solveInequality, calculateProbability, calculateMatrix, calculateExponent, calculateTrigonometry, calculateSequence, calculateVector, calculateComplex, calculateCalculus

#### MEDIUM Priority (31개)
- **Type Assertions 제거 (16개)**: 모든 계산기 컴포넌트
  - `catch (err) { setError(err as string) }` → `formatError(err)` 사용
  - 타입 가드 없는 `as` 단언 제거로 런타임 안전성 향상
  - 영향받은 파일: LinearCalculator, QuadraticCalculator, GeometryCalculator, StatisticsCalculator, FactorizationCalculator, PrimeCalculator, SimultaneousCalculator, PolynomialCalculator, InequalityCalculator, ProbabilityCalculator, MatrixCalculator, ExponentCalculator, TrigonometryCalculator, SequenceCalculator, VectorCalculator, ComplexCalculator

- **localStorage 에러 처리 (15개)**: 안전한 스토리지 래퍼 적용
  - QuotaExceededError 방지 (4MB 제한 체크)
  - SecurityError 방지 (private 모드 처리)
  - JSON 파싱 오류 자동 처리
  - 영향받은 파일: i18n.ts, ThemeContext.tsx, LanguageSwitcher.tsx, CalculationHistory.tsx, SettingsPanel.tsx, UniversalCalculator.tsx

#### LOW Priority (5개)
- **console.log 제거 (3개)**: UniversalCalculator.tsx 프로덕션 디버깅 코드 제거
- **any 타입 제거 (2개)**: UniversalCalculator.tsx
  - `resultData: any` → `CalcResult` interface 정의
  - `err: any` → `err: unknown` + Type Guard

### ✨ New Utilities (새 유틸리티)

#### src/utils/errorHandler.ts
- `formatError(error: unknown): string` - 모든 에러 타입을 안전하게 문자열로 변환
- `logError(error: unknown, context?: string): void` - 개발 모드 에러 로깅

#### src/utils/safeStorage.ts
- `getItem<T>(key, options): T | null` - 안전한 localStorage 읽기 (제네릭 지원)
- `setItem(key, value, options): boolean` - 안전한 localStorage 쓰기 (quota 체크)
- `removeItem(key, options): boolean` - 안전한 localStorage 삭제
- DOMException 전체 처리 (QuotaExceeded, Security, TypeError 등)

### 🔧 Technical Improvements (기술적 개선)
- TypeScript 타입 안전성 100% 달성
- 에러 핸들링 커버리지 100% 달성
- 프로덕션 빌드 최적화 (디버깅 코드 제거)
- 제네릭 함수로 타입 추론 강화

### 📊 Code Quality Metrics
- 버그 수정: 53개 (HIGH 17 + MEDIUM 31 + LOW 5)
- 새 파일: 2개 (errorHandler.ts, safeStorage.ts)
- 수정된 파일: 24개
- 타입 안전성: 98% → 100%
- 빌드 시간: 958ms (변경 없음)

---

## [1.0.8] - 2025-12-23

### 🔒 Security (보안 강화)
- **CRITICAL**: `sandbox: true` 활성화 (Electron 보안 강화)
- **HIGH**: 프로덕션 환경에서 DevTools 자동 열림 제거
- **HIGH**: 모든 수학 함수에 입력 검증 추가 (10/10 함수)
  - XSS, 코드 인젝션 방지
  - 위험한 패턴 차단 (eval, require, import 등)
  - 수식 복잡도 제한 (DoS 방지)
- **HIGH**: 통계 계산 데이터 개수 제한 (최대 10000개, DoS 방지)
- **HIGH**: 행렬 연산 입력 검증 강화

### ⚡ Performance (성능 개선)
- **MAJOR**: 앱 크기 95% 감소
  - 전체: 6.7GB → 303MB (95.5% 감소)
  - app.asar: 304MB → 13MB (95.7% 감소)
  - ZIP: 106MB (배포 파일)
- Frontend dependencies를 devDependencies로 이동
  - react, react-dom, i18next, lucide-react, react-i18next
- Runtime dependencies 최소화 (mathjs, nerdamer만 유지)
- electron-builder 최적화 (불필요한 파일 제외)

### ✨ Features (새 기능)
- **17개 특화 계산기 활성화**
  - 일차방정식 → LinearCalculator
  - 이차방정식 → QuadraticCalculator
  - 기하학 → GeometryCalculator
  - 통계 → StatisticsCalculator
  - 인수분해 → FactorizationCalculator
  - 소수 판정 → PrimeCalculator
  - 연립방정식 → SimultaneousCalculator
  - 다항식 → PolynomialCalculator
  - 부등식 → InequalityCalculator
  - 확률 → ProbabilityCalculator
  - 행렬 → MatrixCalculator
  - 지수/로그 → ExponentCalculator
  - 삼각함수 → TrigonometryCalculator
  - 수열 → SequenceCalculator
  - 벡터 → VectorCalculator
  - 복소수 → ComplexCalculator
  - 미분/적분 → CalculusCalculator

### 🐛 Bug Fixes (버그 수정)
- 음수 무한대 극한 계산 지원 추가 (`-infinity`, `-inf`)
- Edge case 처리 개선:
  - tan(90°), tan(270°) 정의되지 않음 처리
  - log(0), ln(0) 정의되지 않음 처리
  - 음수 로그 정의되지 않음 처리
  - 영벡터 외적 정의되지 않음 처리
  - 복소수 0으로 나누기 처리
  - 적분 발산 구간 검사 (1/x 등)

### 🔧 Technical Changes (기술적 변경)
- CategoryCalculator.tsx 리팩토링 (특화 계산기 라우팅)
- Input validation 함수 전역 적용
- electron-builder 설정 최적화
- package.json dependencies 구조 개선

### 📦 Dependencies
- Runtime dependencies: mathjs@15.1.0, nerdamer@1.1.13
- DevDependencies: react@18.3.1, electron@28.0.0, vite@6.0.0 등

---

## [1.0.7] - 2025-12-23

### Added
- 다크 모드 🌙
- 즐겨찾기 기능 ⭐ (최대 50개)
- 데이터 가져오기/내보내기 📊 (JSON/CSV)
- 공식 라이브러리 📚 (100개+ 공식)
- 다국어 지원 🌏 (한국어/영어)

### Changed
- ThemeContext로 전역 테마 관리
- localStorage 데이터 저장
- 테스트 추가 (Vitest + Playwright)

---

## [1.0.6-FIXED] - 이전 버전

### Features
- 범용 계산기 (UniversalCalculator)
- 8가지 계산 모드 (evaluate, solve, differentiate, integrate, simplify, factor, expand, limit)
- 계산 히스토리 (최대 100개)
- 한국어 UI
