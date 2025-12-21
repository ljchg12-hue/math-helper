# Contributing to Math Helper

**환영합니다!** Math Helper 프로젝트에 기여해주셔서 감사합니다.

## 📋 목차

- [개발 환경 설정](#개발-환경-설정)
- [코드 스타일](#코드-스타일)
- [커밋 컨벤션](#커밋-컨벤션)
- [Pull Request 프로세스](#pull-request-프로세스)
- [테스트](#테스트)
- [문서화](#문서화)

## 🚀 개발 환경 설정

### 필요 조건

- **Rust 1.70 이상**
- **Cargo** (Rust 패키지 관리자)
- **Git**

### 설치

```bash
# 저장소 포크 및 클론
git clone https://github.com/YOUR_USERNAME/math-helper.git
cd math-helper

# 의존성 설치 및 빌드
cargo build

# 테스트 실행
cargo test --workspace --all-features
```

## 🎨 코드 스타일

### 자동 포맷팅

```bash
# 코드 포맷팅 (모든 파일)
cargo fmt --all

# 포맷팅 확인 (CI에서 사용)
cargo fmt --all -- --check
```

### 린팅

```bash
# Clippy 실행
cargo clippy --all-targets --all-features -- -D warnings

# 모든 경고 수정
cargo clippy --fix
```

### 코드 스타일 가이드

- **함수명**: `snake_case`
- **구조체/열거형**: `PascalCase`
- **상수**: `SCREAMING_SNAKE_CASE`
- **최대 라인 길이**: 100자
- **주석**: 공개 API에는 반드시 문서 주석(`///`) 작성

## 📝 커밋 컨벤션

### 커밋 메시지 형식

```
<type>: <subject>

[optional body]

[optional footer]
```

### Type

- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 포맷팅 (기능 변경 없음)
- `refactor`: 리팩토링
- `test`: 테스트 추가/수정
- `perf`: 성능 개선
- `chore`: 빌드/설정 변경

### 예시

```bash
feat: 삼각함수 모듈 추가

- sin, cos, tan 함수 구현
- 도/라디안 변환 지원
- 15개 단위 테스트 추가

Closes #42
```

## 🔄 Pull Request 프로세스

### 1. Fork & Branch

```bash
# 원본 저장소를 upstream으로 추가
git remote add upstream https://github.com/ljchg12-hue/math-helper.git

# 최신 코드 동기화
git fetch upstream
git checkout master
git merge upstream/master

# 기능 브랜치 생성
git checkout -b feature/your-feature-name
```

### 2. 개발

- 코드 작성
- 테스트 추가
- 문서화 업데이트

### 3. 테스트

```bash
# 전체 테스트
cargo test --workspace --all-features

# 특정 모듈 테스트
cargo test --lib linear_equation

# 포맷팅 및 린팅
cargo fmt --all
cargo clippy --all-targets --all-features
```

### 4. 커밋

```bash
git add .
git commit -m "feat: your feature description"
```

### 5. Push

```bash
git push origin feature/your-feature-name
```

### 6. Pull Request 생성

- GitHub에서 Pull Request 생성
- 명확한 제목과 설명 작성
- 관련 이슈 번호 포함 (#42)

### PR 체크리스트

- [ ] 모든 테스트 통과 (`cargo test`)
- [ ] 린팅 통과 (`cargo clippy`)
- [ ] 포맷팅 적용 (`cargo fmt`)
- [ ] 새 기능에 대한 테스트 추가
- [ ] 문서 업데이트 (필요시)
- [ ] CHANGELOG.md 업데이트 (주요 변경사항)

## 🧪 테스트

### 단위 테스트

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_linear_equation() {
        let result = solve_linear_equation(2.0, 3.0, 7.0).unwrap();
        assert_eq!(result.solution_type, SolutionType::Unique(2.0));
    }
}
```

### 통합 테스트

```bash
# tests/ 디렉토리에 테스트 파일 추가
cargo test --test integration_tests
```

### 벤치마크

```bash
# 성능 벤치마크 실행
cargo bench

# 특정 벤치마크
cargo bench linear_equation
```

## 📚 문서화

### Rustdoc 주석

```rust
/// 일차방정식 ax + b = c를 풉니다.
///
/// # Arguments
///
/// * `a` - x의 계수
/// * `b` - 상수항 (좌변)
/// * `c` - 상수항 (우변)
///
/// # Returns
///
/// 방정식의 해를 포함하는 `LinearSolution` 구조체
///
/// # Examples
///
/// ```
/// use math_core::linear_equation::solve_linear_equation;
///
/// let solution = solve_linear_equation(2.0, 3.0, 7.0).unwrap();
/// assert_eq!(solution.solution_type, SolutionType::Unique(2.0));
/// ```
pub fn solve_linear_equation(a: f64, b: f64, c: f64) -> Result<LinearSolution> {
    // ...
}
```

### 문서 생성

```bash
# 문서 생성 및 브라우저에서 열기
cargo doc --workspace --all-features --no-deps --open
```

## 🐛 버그 리포트

### 버그 리포트 양식

```markdown
**버그 설명**
명확하고 간결한 버그 설명

**재현 방법**
1. '...'로 이동
2. '....' 클릭
3. '....' 까지 스크롤
4. 에러 확인

**예상 동작**
예상되는 동작 설명

**실제 동작**
실제 발생한 동작 설명

**환경**
- OS: [예: Ubuntu 22.04]
- Rust 버전: [예: 1.75.0]
- Math Helper 버전: [예: v0.4.0]

**추가 정보**
스크린샷, 로그 등
```

## ✨ 기능 제안

### 기능 제안 양식

```markdown
**기능 설명**
원하는 기능에 대한 명확한 설명

**동기**
이 기능이 필요한 이유

**대안**
고려한 다른 해결책

**추가 정보**
관련 자료, 참고 사항
```

## 📞 도움말

- **이슈**: [GitHub Issues](https://github.com/ljchg12-hue/math-helper/issues)
- **토론**: [GitHub Discussions](https://github.com/ljchg12-hue/math-helper/discussions)

## 🙏 감사합니다

Math Helper를 더 나은 프로젝트로 만들어주시는 모든 기여자분들께 감사드립니다!

---

**Made with 🦀 Rust & ❤️ for Education**
