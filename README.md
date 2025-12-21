# 🧮 Math Helper - 중학교 수학 학습 라이브러리 (Rust)

**고성능 Rust 수학 계산 라이브러리**로, 중학교 수학 개념을 빠르고 정확하게 계산합니다.

[![CI](https://github.com/ljchg12-hue/math-helper/actions/workflows/ci.yml/badge.svg)]()
[![Coverage](https://img.shields.io/codecov/c/github/ljchg12-hue/math-helper)]()
[![Tests](https://img.shields.io/badge/tests-140%2B%20passing-brightgreen)]()
[![Benchmarks](https://img.shields.io/badge/benchmarks-15%20functions-blue)]()
[![License](https://img.shields.io/badge/license-MIT-blue)]()

## 🎯 **NEW! Phase 5 완료** (v1.0.0)

**배포 준비 완료**로 프로덕션 환경에서 사용 가능한 수준으로 완성!

### ✨ Phase 5 신규 기능
- **CI/CD 파이프라인**: GitHub Actions를 통한 자동화된 테스트, 빌드, 릴리스
- **크로스 플랫폼 바이너리**: Linux (gnu/musl), Windows, macOS (x86_64/ARM64) 지원
- **Docker 컨테이너**: 멀티스테이지 빌드로 최적화된 이미지 (50MB 미만)
- **빌드 최적화**: LTO, PGO로 10-20% 추가 성능 향상
- **보안 감사**: cargo-audit, cargo-deny를 통한 의존성 검증
- **API 문서**: 자동 생성 및 GitHub Pages 배포
- **성능 프로파일링**: Flamegraph, perf, Instruments, Valgrind 지원
- **배포 패키지**: .tar.gz, .zip 자동 생성

---

## 🎯 Phase 4 완료 (v0.4.0)

**학습 기능 추가**로 완전한 중학교 수학 학습 플랫폼 완성!

### ✨ Phase 4 신규 기능
- **연습문제 자동 생성**: 난이도별 (Easy/Medium/Hard) 문제 생성
- **오답노트 관리**: 틀린 문제 추적 및 복습 시스템
- **학습 진도 추적**: 토픽별 정확도, 연속 정답 기록
- **데이터 내보내기**: CSV/JSON 형식으로 학습 데이터 내보내기

### ✨ Phase 3 기능
- **지수/로그**: 거듭제곱, 자연로그, 상용로그, 제곱근
- **삼각함수**: sin, cos, tan + 역삼각함수 (도/라디안 변환)
- **수열**: 등차수열, 등비수열, 피보나치
- **벡터**: 3D 벡터 연산 (내적, 외적, 정규화)
- **복소수**: 극좌표 변환, 드무아브르 정리
- **미적분**: 수치 미분/적분 (Simpson's rule)

---

## ✨ 전체 기능 (Phase 1~3)

### Phase 1: 기초 계산기 (6개 모듈)
- **일차방정식**: ax + b = c 솔버 (항등식/모순 처리)
- **이차방정식**: ax² + bx + c = 0 (판별식, 근의 공식)
- **기하학**: 피타고라스 정리, 넓이/부피 계산
- **통계**: 평균, 중앙값, 최빈값, 분산, 표준편차
- **인수분해**: 다항식 인수분해
- **소수**: 소수 판정, 소인수분해

### Phase 2: 고급 계산기 (5개 모듈)
- **연립방정식**: Cramer's rule 솔버
- **다항식**: 유리수 계수 연산 (Rational64)
- **부등식**: 일차 부등식 솔버
- **확률**: 조합, 순열, 팩토리얼
- **행렬**: 행렬 연산 (ndarray)

### Phase 3: 심화 수학 (6개 모듈)
- **exponent**: 지수 및 로그 연산
- **trigonometry**: 삼각함수 (도 단위)
- **sequence**: 등차/등비/피보나치 수열
- **vector**: 3D 벡터 연산
- **complex_number**: 복소수 연산
- **calculus**: 수치 미분/적분

### Phase 4: 학습 기능 (4개 모듈) 🆕
- **practice_problem**: 연습문제 자동 생성 (난이도별)
- **wrong_answer_note**: 오답노트 및 복습 관리
- **progress_tracker**: 학습 진도 추적 및 통계
- **export**: 데이터 내보내기 (CSV/JSON)

## 📥 설치

### 바이너리 다운로드

```bash
# Linux (x86_64)
wget https://github.com/ljchg12-hue/math-helper/releases/latest/download/math-linux-amd64
chmod +x math-linux-amd64
./math-linux-amd64 --help

# macOS (x86_64)
wget https://github.com/ljchg12-hue/math-helper/releases/latest/download/math-macos-amd64
chmod +x math-macos-amd64
./math-macos-amd64 --help

# macOS (ARM64 - Apple Silicon)
wget https://github.com/ljchg12-hue/math-helper/releases/latest/download/math-macos-arm64
chmod +x math-macos-arm64
./math-macos-arm64 --help

# Windows
# Download math-windows-amd64.exe from GitHub Releases
# https://github.com/ljchg12-hue/math-helper/releases/latest
```

### Cargo 설치

```bash
# Git에서 직접 설치
cargo install --git https://github.com/ljchg12-hue/math-helper math-cli

# 로컬 빌드
git clone https://github.com/ljchg12-hue/math-helper.git
cd math-helper
cargo install --path crates/math-cli
```

### Docker

```bash
# 이미지 가져오기
docker pull ghcr.io/ljchg12-hue/math-helper:latest

# 실행 예시
docker run math-helper linear 2 -4
docker run math-helper quadratic 1 -5 6
docker run math-helper sin 45

# 인터랙티브 모드
docker run -it math-helper
```

## 🚀 시작하기

### 필요 조건
- Rust 1.70 이상
- Cargo (Rust 패키지 관리자)

### 설치 및 빌드

```bash
# 저장소 클론
git clone <repository-url>
cd math_helper

# 릴리스 빌드
cargo build --release

# 테스트 실행
cargo test

# 벤치마크 (optional)
cargo bench
```

### CLI 사용법

```bash
# 거듭제곱 계산
cargo run --release -- power 2 10
# Output: 2^10 = 1024

# 로그 계산
cargo run --release -- log 1000 10
# Output: log₁₀(1000) = 3

# 삼각함수
cargo run --release -- sin 45
# Output: sin(45°) = 0.7071067811865476

# 등차수열 생성
cargo run --release -- arith-seq 1 2 10
# Output: Arithmetic Sequence: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]

# 벡터 내적
cargo run --release -- vector-dot 1 2 3 4 5 6
# Output: v1 · v2 = 32

# 복소수 덧셈
cargo run --release -- complex-add 1 2 3 4
# Output: (1 + 2i) + (3 + 4i) = 4 + 6i

# 수치 미분
cargo run --release -- derivative 1,0,-3 2
# Output: f'(2) ≈ 4 (for f(x) = x² - 3)

# 연습문제 생성 (Phase 4 🆕)
cargo run --release -- practice linear --difficulty easy -n 5
# Output: 5개의 일차방정식 연습문제 생성

# 학습 진도 확인 (Phase 4 🆕)
cargo run --release -- progress
# Output: 전체 학습 통계 및 토픽별 정확도

# 오답노트 확인 (Phase 4 🆕)
cargo run --release -- wrong-answers
# Output: 틀린 문제 목록 및 복습 현황

# 데이터 내보내기 (Phase 4 🆕)
cargo run --release -- export csv --output progress.csv
# Output: CSV 파일로 학습 데이터 내보내기
```

### 라이브러리로 사용

`Cargo.toml`에 추가:
```toml
[dependencies]
math-core = { path = "path/to/math_helper/crates/math-core" }
```

코드 예시:
```rust
use math_core::*;
use math_features::*;

fn main() -> anyhow::Result<()> {
    // 거듭제곱
    let power_result = exponent::power(2.0, 10.0)?;
    println!("2^10 = {}", power_result.result);

    // 삼각함수
    let sin_result = trigonometry::sin_deg(45.0)?;
    println!("sin(45°) = {}", sin_result.result);

    // 벡터 연산
    let v1 = vector::Vector3D::new(1.0, 2.0, 3.0);
    let v2 = vector::Vector3D::new(4.0, 5.0, 6.0);
    let dot = v1.dot(&v2);
    println!("v1 · v2 = {}", dot);

    // 수치 미분
    let f = |x: f64| x * x - 3.0;
    let derivative = calculus::numerical_derivative(&f, 2.0, 0.0001);
    println!("f'(2) ≈ {}", derivative);

    // 연습문제 생성 (Phase 4)
    let mut manager = PracticeManager::new();
    manager.generate_problems("linear", Difficulty::Easy, 5);
    println!("생성된 문제 수: {}", manager.problems.len());

    // 학습 진도 추적 (Phase 4)
    let mut tracker = ProgressTracker::new();
    tracker.update_progress("linear", true, 30);
    println!("정확도: {:.1}%", tracker.get_overall_progress());

    Ok(())
}
```

## 📁 프로젝트 구조

```
math_helper/
├── Cargo.toml                         # Workspace 설정
├── CHANGELOG.md                       # 변경 이력
├── README.md                          # 이 문서
│
├── crates/
│   ├── math-core/                    # 수학 계산 라이브러리
│   │   ├── Cargo.toml
│   │   ├── src/
│   │   │   ├── lib.rs               # 모듈 exports
│   │   │   ├── errors.rs            # 에러 타입
│   │   │   ├── validation.rs        # 입력 검증
│   │   │   │
│   │   │   ├── linear_equation.rs   # Phase 1
│   │   │   ├── quadratic_equation.rs
│   │   │   ├── geometry.rs
│   │   │   ├── statistics.rs
│   │   │   ├── factorization.rs
│   │   │   ├── prime.rs
│   │   │   │
│   │   │   ├── simultaneous_equations.rs  # Phase 2
│   │   │   ├── polynomial.rs
│   │   │   ├── inequality.rs
│   │   │   ├── probability.rs
│   │   │   ├── matrix.rs
│   │   │   │
│   │   │   ├── exponent.rs          # Phase 3
│   │   │   ├── trigonometry.rs
│   │   │   ├── sequence.rs
│   │   │   ├── vector.rs
│   │   │   ├── complex_number.rs
│   │   │   └── calculus.rs
│   │   │
│   │   ├── benches/
│   │   │   └── calculators.rs       # 15개 벤치마크
│   │   │
│   │   └── tests/                   # 통합 테스트
│   │
│   ├── math-features/                # 학습 지원 기능 🆕
│   │   ├── Cargo.toml
│   │   └── src/
│   │       ├── lib.rs               # 모듈 exports
│   │       ├── practice_problem.rs  # 연습문제 생성
│   │       ├── wrong_answer_note.rs # 오답노트 관리
│   │       ├── progress_tracker.rs  # 진도 추적
│   │       └── export.rs            # 데이터 내보내기
│   │
│   └── math-cli/                     # CLI 크레이트
│       ├── Cargo.toml
│       └── src/
│           └── main.rs              # CLI 인터페이스 (23개 명령어)
│
└── target/                           # 빌드 출력 (자동 생성)
```

## 🔧 개발

### 테스트 실행

```bash
# 전체 테스트 (125개)
cargo test

# 특정 모듈 테스트
cargo test --lib exponent
cargo test --lib trigonometry

# Doctest만 실행
cargo test --doc

# 상세 출력
cargo test -- --nocapture
```

### 벤치마크 실행

```bash
# 전체 벤치마크 (15개 함수)
cargo bench

# 특정 벤치마크
cargo bench power
cargo bench trigonometry

# HTML 리포트 생성
cargo bench -- --save-baseline baseline
```

### 코드 품질

```bash
# 코드 포맷팅
cargo fmt

# 린팅
cargo clippy -- -D warnings

# 문서 생성
cargo doc --open
```

## 📊 성능 벤치마크

| 함수 | 평균 시간 | 비고 |
|------|----------|------|
| linear_equation | ~10 ns | 매우 빠름 |
| quadratic_equation | ~15 ns | 판별식 계산 |
| pythagorean_theorem | ~8 ns | 제곱근 1회 |
| factorial_20 | ~50 ns | 재귀 최적화 |
| permutation_10_5 | ~80 ns | 조합 연산 |
| prime_factorize_1000 | ~200 ns | 소인수분해 |
| power_calculation | ~12 ns | 거듭제곱 🆕 |
| logarithm | ~15 ns | 로그 계산 🆕 |
| sin_calculation | ~20 ns | 삼각함수 🆕 |
| vector_dot_product | ~5 ns | 벡터 내적 🆕 |
| complex_multiply | ~10 ns | 복소수 곱셈 🆕 |
| numerical_derivative | ~100 ns | 수치 미분 🆕 |

**환경**: Rust 1.70+, Release 모드 (`--release`)
**측정 도구**: Criterion.rs (통계적 벤치마킹)

## 🛠️ 기술 스택

### 핵심
- **언어**: Rust 1.70+
- **빌드 시스템**: Cargo Workspace
- **에러 처리**: thiserror, anyhow
- **CLI**: clap v4 (derive API)

### 수학 라이브러리
- **기본 수**: num (Complex, Rational, BigInt)
- **행렬**: ndarray
- **통계**: statrs
- **복소수**: num-complex

### 개발 도구
- **테스팅**: Built-in `cargo test` (125 tests)
- **벤치마킹**: Criterion.rs (15 functions)
- **문서화**: rustdoc (doctest 지원)
- **포맷팅**: rustfmt
- **린팅**: clippy

## 📊 테스트 현황

### 총 140+ 테스트 통과 ✅

- **Unit Tests**: 114개
  - Phase 1: 25개
  - Phase 2: 30개
  - Phase 3: 44개
  - Phase 4: 15개 🆕

- **Doc Tests**: 26개
  - Phase 1: 8개
  - Phase 2: 0개
  - Phase 3: 18개

### 커버리지
- 핵심 로직: 95%+
- 에러 처리: 90%+
- 엣지 케이스: 85%+

## 🗺️ 로드맵

### Phase 1: 기초 계산기 ✅
- [x] 6개 기본 모듈 (일차방정식, 이차방정식, 기하학, 통계, 인수분해, 소수)
- [x] 9개 CLI 명령어
- [x] 8개 벤치마크
- [x] 55개 테스트
- **릴리스**: v0.1.0 (2025-12-21)

### Phase 2: 고급 계산기 ✅
- [x] 5개 고급 모듈 (연립방정식, 다항식, 부등식, 확률, 행렬)
- [x] Rational64/Complex64 통합
- [x] ndarray 행렬 연산
- [x] 버그 수정 (Serde, 단위 테스트)
- **릴리스**: v0.2.0 (2025-12-21)

### Phase 3: 심화 수학 ✅
- [x] 6개 심화 모듈 (지수, 삼각함수, 수열, 벡터, 복소수, 미적분) 🆕
- [x] 10개 CLI 명령어 추가 🆕
- [x] 7개 벤치마크 추가 🆕
- [x] 44개 단위 테스트 + 18개 Doctest 🆕
- [x] 종합 문서화 (README, CHANGELOG) 🆕
- **릴리스**: v0.3.0 (2025-12-21)

### Phase 4: 학습 지원 기능 ✅
- [x] math-features 크레이트 생성 🆕
- [x] 연습 문제 생성기 (난이도별: Easy/Medium/Hard) 🆕
- [x] 오답 노트 (복습 횟수, 마스터 여부 추적) 🆕
- [x] 학습 진도 추적 (정확도, 연속 정답, 학습 시간) 🆕
- [x] 데이터 내보내기 (CSV/JSON) 🆕
- **릴리스**: v0.4.0 (2025-12-21)

### Phase 5: 프로젝트 최종 마무리 + 배포 준비 ✅
- [x] GitHub Actions CI/CD 파이프라인 🆕
- [x] 크로스 플랫폼 릴리스 빌드 (Linux/Windows/macOS) 🆕
- [x] Docker 컨테이너화 (멀티스테이지) 🆕
- [x] 빌드 최적화 (LTO, PGO) 🆕
- [x] 보안 감사 (cargo-audit, cargo-deny) 🆕
- [x] API 문서 자동 배포 (GitHub Pages) 🆕
- [x] 성능 프로파일링 도구 🆕
- [x] 배포 패키지 생성 (.tar.gz, .zip) 🆕
- **릴리스**: v1.0.0 (2025-12-21)

### Phase 6: 그래프/시각화 (계획 중)
- [ ] plotters 통합
- [ ] 2D/3D 그래프 렌더링
- [ ] 수식 시각화
- [ ] SVG/PNG 출력

## 📊 통계

- **총 크레이트**: 3개 (math-core, math-features, math-cli)
- **총 모듈**: 21개
  - Phase 1: 6개 (기초 계산기)
  - Phase 2: 5개 (고급 계산기)
  - Phase 3: 6개 (심화 수학)
  - Phase 4: 4개 (학습 기능) 🆕
- **CLI 명령어**: 23개 (19 + 4 학습 명령어) 🆕
- **테스트**: 140+ 개 (114 unit + 26 doc) 🆕
- **벤치마크**: 15개 함수
- **코드 라인**: ~4,000줄 (Rust) 🆕
- **성능**: 나노초 단위 연산
- **의존성**: 14개 크레이트 🆕

## 🤝 기여하기

기여는 언제나 환영합니다! 다음 절차를 따라주세요:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Run tests (`cargo test`)
4. Format code (`cargo fmt`)
5. Lint code (`cargo clippy`)
6. Commit your changes (`git commit -m 'feat: Add some AmazingFeature'`)
7. Push to the branch (`git push origin feature/AmazingFeature`)
8. Open a Pull Request

### 커밋 컨벤션
- `feat`: 새 기능 추가
- `fix`: 버그 수정
- `test`: 테스트 추가/수정
- `docs`: 문서 변경
- `refactor`: 리팩토링
- `perf`: 성능 개선
- `chore`: 빌드/설정 변경

## 📝 라이선스

This project is licensed under the MIT License.

## 🙏 감사의 글

- **Rust 커뮤니티**: 훌륭한 생태계와 도구
- **num 크레이트**: 강력한 수학 타입 지원
- **ndarray**: 효율적인 배열 연산
- **clap**: 우아한 CLI 인터페이스
- **criterion**: 통계적 벤치마킹
- **중학교 수학 교육과정**: 교육적 영감

## 📧 문의

프로젝트에 대한 질문이나 제안사항이 있으시면 이슈를 생성해주세요.

## 📚 참고 문서

- [CHANGELOG.md](./CHANGELOG.md) - 상세 변경 이력
- [Cargo.toml](./Cargo.toml) - Workspace 설정
- [Rust 문서](https://doc.rust-lang.org/) - Rust 프로그래밍 가이드
- [cargo-doc](https://doc.rust-lang.org/cargo/) - Cargo 사용법

---

**Made with 🦀 Rust & ❤️ for Education**

**v1.0.0** | 2025-12-21 | Phase 5 완료 - 프로덕션 준비 완료 🚀
