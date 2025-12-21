# Changelog

All notable changes to this project will be documented in this file.

## [0.3.0] - 2025-12-21

### ✨ Added - Phase 3 (6개 심화 수학 모듈)

#### 새로운 계산기 모듈
- **exponent.rs**: 지수 및 로그 연산
  - `power(base, exponent)`: 거듭제곱 계산
  - `logarithm(value, base)`: 로그 계산
  - `natural_log(value)`: 자연로그
  - `log10(value)`: 상용로그
  - `sqrt(value)`: 제곱근

- **trigonometry.rs**: 삼각함수
  - `sin_deg`, `cos_deg`, `tan_deg`: 기본 삼각함수 (도 단위)
  - `asin_deg`, `acos_deg`, `atan_deg`: 역삼각함수
  - `deg_to_rad`, `rad_to_deg`: 단위 변환

- **sequence.rs**: 수열
  - `arithmetic_sequence`: 등차수열 생성
  - `geometric_sequence`: 등비수열 생성
  - `fibonacci_sequence`: 피보나치 수열
  - `arithmetic_nth_term`: n번째 항 계산
  - `geometric_nth_term`: n번째 항 계산

- **vector.rs**: 3D 벡터 연산
  - `Vector3D::new`: 벡터 생성
  - `magnitude`: 크기 계산
  - `dot`: 내적
  - `cross`: 외적
  - `normalize`: 단위벡터
  - `angle_between`: 각도 계산
  - `is_perpendicular`, `is_parallel`: 관계 판정
  - 연산자 오버로딩: `+`, `-`, `*`, `-` (unary)

- **complex_number.rs**: 복소수 연산
  - `complex_add`, `complex_subtract`: 사칙연산
  - `complex_multiply`, `complex_divide`: 곱셈/나눗셈
  - `complex_conjugate`: 켤레복소수
  - `complex_magnitude`: 크기
  - `from_polar`: 극형식 변환
  - `complex_power`: 거듭제곱
  - `complex_exp`, `complex_ln`: 지수/로그

- **calculus.rs**: 미적분 (수치 해법)
  - `numerical_derivative`: 수치 미분 (중앙차분법)
  - `numerical_integral`: 수치 적분 (Simpson's rule)
  - `second_derivative`: 2차 미분
  - `find_critical_points`: 임계점 찾기
  - `classify_critical_point`: 극값 분류
  - `trapezoidal_integral`: 사다리꼴 적분

#### CLI 명령어 10개 추가
- `power <base> <exponent>`: 거듭제곱
- `log <value> <base>`: 로그
- `sin <angle>`: 사인
- `cos <angle>`: 코사인
- `tan <angle>`: 탄젠트
- `arith-seq <first> <diff> <n>`: 등차수열
- `fibonacci <n>`: 피보나치
- `vector-dot <x1> <y1> <z1> <x2> <y2> <z2>`: 벡터 내적
- `complex-add <re1> <im1> <re2> <im2>`: 복소수 덧셈
- `derivative <coeffs> <x>`: 수치 미분

#### 벤치마크 7개 추가
- `bench_power`: 거듭제곱 성능
- `bench_logarithm`: 로그 성능
- `bench_trigonometry`: 삼각함수 성능
- `bench_sequence`: 수열 생성 성능
- `bench_vector_operations`: 벡터 연산 성능
- `bench_complex_multiply`: 복소수 곱셈 성능
- `bench_derivative`: 수치 미분 성능

### 📊 테스트
- 단위 테스트 44개 추가 (총 99개)
- Doctest 18개 추가 (총 26개)
- 전체 125개 테스트 통과

### 📚 문서화
- README.md 대폭 업데이트
- 모든 모듈에 상세 docstring 추가
- 사용 예제 추가

### 🔧 의존성
- `num-complex` 의존성을 math-cli에 추가

---

## [0.2.0] - 2025-12-21

### ✨ Added - Phase 2 (5개 고급 모듈)

#### 새로운 계산기 모듈
- **simultaneous_equations.rs**: 연립방정식 솔버 (Cramer's rule)
- **polynomial.rs**: 다항식 연산 (Rational64)
- **inequality.rs**: 부등식 솔버
- **probability.rs**: 조합/순열/확률
- **matrix.rs**: 행렬 연산 (ndarray)

### 🐛 Bug Fixes
- Serde 직렬화 이슈 수정 (Complex64, Rational64)
- 단위 테스트 오류 수정 (linear_equation)
- Doctest 컴파일 오류 수정

### 📊 테스트
- 단위 테스트 55개 통과
- Doctest 8개 통과

---

## [0.1.0] - 2025-12-21

### ✨ Added - Phase 1 (초기 릴리스)

#### 프로젝트 구조
- Rust 워크스페이스 초기화
- math-core 라이브러리 크레이트
- math-cli 바이너리 크레이트

#### 계산기 모듈 6개
- **linear_equation.rs**: 일차방정식 솔버
- **quadratic_equation.rs**: 이차방정식 솔버
- **geometry.rs**: 기하학 계산
- **statistics.rs**: 통계 분석
- **factorization.rs**: 인수분해
- **prime.rs**: 소수 연산

#### CLI 도구
- 9개 기본 명령어 구현

#### 벤치마크
- Criterion 기반 성능 측정
- 8개 함수 벤치마크

### 🔧 기술 스택
- num, num-rational, num-complex
- ndarray, statrs
- clap, criterion
- thiserror, anyhow

---

**형식**: [버전] - 날짜

**변경 타입**:
- ✨ Added: 새 기능
- 🐛 Bug Fixes: 버그 수정
- 📊 Tests: 테스트 관련
- 📚 Documentation: 문서
- 🔧 Dependencies: 의존성
- ⚡ Performance: 성능 개선
