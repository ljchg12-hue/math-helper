# 🧮 Math Helper - 중학교 1학년 수학 학습 도우미

중학교 1학년 수학 개념을 이해하고 연습할 수 있는 인터랙티브 웹 애플리케이션입니다.

## 🎁 **NEW! Python 설치 없이 바로 실행 (Portable 패키지)**

**아들 PC에 Python 없어도 OK!** 그냥 실행만 하면 됩니다!

### 아버지 PC에서 (Python 있는 곳):
```cmd
create_portable.bat
```
→ 5-10분 대기 → `MathHelper_Portable` 폴더 생성됨

### 아들 PC에서 (Python 없는 곳):
1. `MathHelper_Portable` 폴더 복사 (USB 또는 압축 파일)
2. `실행.bat` 더블클릭
3. 끝! 🚀

**자세한 가이드**: `PORTABLE_GUIDE.md` 참고

---

## ✨ 주요 기능

### 📐 소인수분해 계산기
- 2 이상의 자연수를 소인수의 곱으로 분해
- 최대 1,000,000까지 지원
- 결과를 수식 형태로 표시 (예: 12 = 2² × 3)
- 소인수별 지수 상세 정보 제공

### 📝 일차방정식 풀이
- ax + b = c 형태의 일차방정식 해결
- 단계별 풀이 과정 제공
- 특수 경우 처리:
  - 해가 무수히 많은 경우 (항등식)
  - 해가 없는 경우 (모순)
- LaTeX 형식으로 방정식 표시

### 📊 함수 그래프
- 정비례 함수 (y = ax) 그래프
- 반비례 함수 (y = a/x) 그래프
- 사용자 정의 x축 범위
- 대화형 그래프 표시
- 함수 특성 설명 제공

## 🚀 시작하기

### 필요 조건
- Python 3.8 이상
- pip (Python 패키지 관리자)

### 설치

1. **저장소 클론**
```bash
git clone <repository-url>
cd math_helper
```

2. **가상환경 생성 (권장)**
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# 또는
venv\Scripts\activate  # Windows
```

3. **의존성 설치**
```bash
pip install -r requirements.txt
```

### 실행

**방법 A: Python으로 실행**
```bash
streamlit run src/main.py
```
브라우저에서 자동으로 열리며, 수동으로는 http://localhost:8501 에서 접속 가능합니다.

**방법 B: EXE 파일로 실행 (Windows)**
```cmd
build_exe.bat
```
- Python 설치 없이 실행 가능한 standalone EXE 생성
- 자세한 내용: `QUICK_START.md` 또는 `BUILD_INSTRUCTIONS.md` 참고

## 📁 프로젝트 구조

```
math_helper/
├── app.py                      # 애플리케이션 진입점
├── src/                        # 소스 코드
│   ├── main.py                # 메인 애플리케이션
│   ├── calculators/           # 계산기 모듈
│   │   ├── prime_factor.py   # 소인수분해
│   │   ├── linear_equation.py # 일차방정식
│   │   └── function_graph.py # 함수 그래프
│   ├── ui/                    # UI 컴포넌트
│   │   ├── sidebar.py        # 사이드바
│   │   └── pages.py          # 페이지 컴포넌트
│   └── utils/                # 유틸리티
│       ├── logger.py         # 로깅
│       └── config.py         # 설정 관리
├── tests/                     # 테스트 코드
│   ├── conftest.py
│   ├── test_prime_factor.py
│   ├── test_linear_equation.py
│   └── test_function_graph.py
├── config/                    # 설정 파일
│   └── settings.yaml
├── logs/                      # 로그 파일 (자동 생성)
└── docs/                      # 문서

```

## 🔧 개발

### 개발 환경 설정

```bash
# 개발 의존성 설치
pip install -r requirements-dev.txt
```

### 테스트 실행

```bash
# 전체 테스트
./run_tests.sh

# 또는 pytest 직접 실행
pytest

# 커버리지와 함께
pytest --cov=src --cov-report=html
```

### 코드 품질

```bash
# 코드 포맷팅
black src/ tests/

# 린팅
flake8 src/ tests/

# 타입 체크
mypy src/
```

## ⚙️ 설정

`config/settings.yaml` 파일에서 다음 설정을 변경할 수 있습니다:

```yaml
app:
  title: "중학교 1학년 수학 학습 도우미"
  layout: "wide"

calculators:
  prime_factor:
    min_value: 2
    max_value: 1000000
    default_value: 12
  
  linear_equation:
    default_a: 2.0
    default_b: 3.0
    default_c: 7.0
  
  function_graph:
    default_a: 1.0
    x_range_min: -10
    x_range_max: 10
    y_limit: 10
```

## 🎨 Phase 4: UI/UX 기능

### Plotly 인터랙티브 차트
- **5가지 차트 타입**:
  - 숙달도 막대 그래프 (가로)
  - 학습 진행 추이 선 그래프
  - 주제별 비교 그룹 막대 차트
  - 학습 시간 분포 도넛 파이 차트
  - 주간 학습 활동 히트맵
- **인터랙티브 기능**: 줌, 팬, 호버 정보, 범례 토글
- **테마 지원**: 라이트/다크 모드에 따른 색상 자동 조정

### 반응형 디자인
- **3가지 브레이크포인트**: 모바일(<768px), 태블릿(768-1024px), 데스크톱(>1024px)
- **적응형 레이아웃**: 화면 크기에 따라 자동 조정되는 컬럼 및 차트 크기
- **모바일 최적화**: 터치 친화적 버튼 크기, 세로 스크롤 최적화
- **인쇄 지원**: 인쇄 시 불필요한 요소 자동 숨김

### 접근성 개선
- **ARIA 지원**: 스크린 리더를 위한 의미론적 마크업
- **키보드 네비게이션**: Tab, Enter, Esc 키로 완전한 조작 가능
- **포커스 관리**: 키보드 포커스 시각적 표시 강화
- **Skip Links**: 메인 콘텐츠로 바로 이동
- **고대비 모드**: prefers-contrast 미디어 쿼리 지원
- **애니메이션 감소**: prefers-reduced-motion 지원

### 다국어 지원 (i18n)
- **3개 언어**: 한국어, English, 日本語
- **동적 번역**: 언어 변경 시 즉시 적용
- **확장 가능**: JSON 기반 번역 파일로 쉬운 언어 추가
- **커스텀 번역**: 사용자 정의 번역 로드 지원
- **내보내기**: 번역 데이터 JSON 내보내기 가능

## 📚 사용 예시

### 소인수분해
1. 사이드바에서 "소인수분해" 선택
2. 숫자 입력 (예: 360)
3. "소인수분해 하기" 버튼 클릭
4. 결과 확인: 360 = 2³ × 3² × 5

### 일차방정식
1. 사이드바에서 "일차방정식" 선택
2. 계수 입력 (a=2, b=3, c=7)
3. "방정식 풀기" 버튼 클릭
4. 단계별 풀이 과정 및 답 확인

### 함수 그래프
1. 사이드바에서 "함수와 그래프" 선택
2. 함수 종류 선택 (정비례/반비례)
3. a 값과 x축 범위 설정
4. "그래프 그리기" 버튼 클릭
5. 그래프 및 함수 설명 확인

## 🛠️ 기술 스택

- **Frontend**: Streamlit
- **Visualization**: Matplotlib, Plotly
- **Numerical Computing**: NumPy
- **Configuration**: PyYAML
- **Testing**: pytest (351 tests)
- **Code Quality**: Black, Flake8, mypy
- **i18n**: Custom translation system
- **Accessibility**: ARIA labels, keyboard navigation

## 📊 테스트 커버리지

현재 프로젝트는 핵심 계산기 모듈에 대해 포괄적인 테스트를 포함하고 있습니다:

- `PrimeFactorCalculator`: 소인수분해 로직 검증
- `LinearEquationSolver`: 방정식 풀이 검증
- `FunctionGraphDrawer`: 그래프 생성 검증

## 🗺️ 로드맵

### Phase 1: 코드 품질 ✅
- [x] 프로젝트 구조 개선
- [x] 모듈화 및 관심사 분리
- [x] 로깅 시스템
- [x] 설정 관리
- [x] 포괄적인 테스트 (327개)

### Phase 2: 기능 확장 ✅
- [x] 중1 전체 내용 (16개 계산기)
  - [x] 정수와 유리수, 문자와 식
  - [x] 연립방정식, 일차함수
  - [x] 제곱근과 실수, 인수분해
  - [x] 이차방정식, 이차함수
  - [x] 통계, 확률, 기하, 좌표평면
- [x] 학습 지원 기능
  - [x] 연습 문제 생성기 (7개 주제)
  - [x] 오답 노트
  - [x] 학습 진도 추적
  - [x] 계산 히스토리 관리

### Phase 3: 고급 기능 ✅
- [x] 다크/라이트 모드
- [x] 데이터 시각화 (Matplotlib 차트)
- [x] 데이터 백업/내보내기 (JSON, CSV)
- [x] 학습 진도 분석 그래프

### Phase 4: UI/UX 개선 ✅
- [x] 테마 시스템 (다크/라이트 모드)
- [x] Plotly 인터랙티브 차트 (5개 차트 타입)
- [x] 반응형 디자인 (모바일/태블릿/데스크톱)
- [x] 접근성 개선 (ARIA, 키보드 네비게이션, 스크린 리더 지원)
- [x] 다국어 지원 (한국어/English/日本語)

## 📊 통계

- **총 계산기**: 16개
- **학습 기능**: 4개
- **테스트 수**: 351개 (100% 통과)
- **평균 커버리지**: 48% (계산기 85%+, UI 0%)
- **코드 라인**: ~5,500줄
- **지원 언어**: 3개 (한국어, English, 日本語)
- **시각화**: Matplotlib + Plotly (10개 차트 타입)

## 🤝 기여하기

기여는 언제나 환영합니다! 다음 절차를 따라주세요:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스

This project is licensed under the MIT License.

## 👥 Authors

- 초기 개발 및 유지보수

## 🙏 감사의 글

- Streamlit 커뮤니티
- 중학교 수학 교육과정 참고 자료

## 📧 문의

프로젝트에 대한 질문이나 제안사항이 있으시면 이슈를 생성해주세요.

---

**Happy Learning! 📚✨**
