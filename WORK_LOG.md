# Math Helper 작업 로그 (2025-12-19)

## 📋 오늘 완료한 작업

### 1. 버그 수정 (5개)

#### 치명적 버그
1. **app.py 임포트 실패**
   - 문제: `from utils.config import get_config` 실패
   - 해결: `sys.path.insert(0, str(project_root / "src"))` 추가
   - 파일: `app.py:12`

2. **제곱근 비정수 입력**
   - 문제: `simplify_sqrt(3.5)` → `int(3.5)` = 3으로 잘못 계산
   - 해결: 정수가 아니면 `return f"√{n}"` 반환
   - 파일: `src/calculators/square_root.py:61-65`

3. **연립방정식 해 판정 오류**
   - 문제: `if a1 * c2 == a2 * c1` (b 무시)
   - 해결: a1:a2 = b1:b2 = c1:c2 모든 계수 비율 확인
   - 파일: `src/calculators/simultaneous_equations.py:60-81`

#### 중요 버그
4. **이차함수 a=0 시 0 나누기**
   - 문제: `x = -b / (2 * a)` → a=0이면 crash
   - 해결: 모든 함수에 `if abs(a) < 1e-10: raise ValueError` 추가
   - 파일: `src/calculators/quadratic_function.py` (4개 함수)

5. **이차함수 평행이동 로직**
   - 문제: 원래 함수 무시하고 y=ax²만 이동
   - 해결: 원래 꼭짓점 구하고 이동 후 일반형 변환
   - 파일: `src/calculators/quadratic_function.py:230-244`

### 2. 시도한 방법들

| 방법 | 크기 | Python | 결과 |
|------|------|--------|------|
| Python Portable | 8GB | Embedded | ✅ 작동 (너무 큼) |
| PyInstaller | 150-250MB | 내장(숨김) | ⚠️ Windows 필요 |
| Rust + egui | 10-20MB | 없음 | ❌ fontconfig 실패 |
| Tauri | 10-20MB | 없음 | ❌ WebKit 실패 |

### 3. 최종 선택: PyInstaller

**이유:**
- ✅ 버그 수정된 코드 재사용
- ✅ 150-250MB (8GB → 30-50배 감소)
- ✅ 의존성 없음 (Python 내장)
- ⚠️ Windows PC에서 빌드 필요

**준비된 파일:**
- `build_windows_exe.bat` - 자동 빌드 스크립트
- `WINDOWS_BUILD_GUIDE.md` - 상세 가이드
- `INSTALL_PYTHON.txt` - Python 설치 방법
- `MathHelper_Source.zip` (296KB) - 배포 패키지

## 🔴 해결 안 된 문제

1. **Linux에서 Windows EXE 직접 빌드 실패**
   - MinGW dlltool 없음
   - Wine Python에 pip 없음
   - 시스템 권한 문제

2. **Rust/Tauri 시스템 의존성**
   - fontconfig, cairo, WebKit 필요
   - sudo 권한 필요
   - 크로스 컴파일 복잡

## 📝 다음 단계 (내일)

### 방법 A: Windows PC에서 빌드
```
1. MathHelper_Source.zip → Windows PC 복사
2. 압축 해제
3. build_windows_exe.bat 더블클릭
4. dist/MathHelper.exe 완성!
```

### 방법 B: Docker 사용 (여기서 완성)
```
1. Docker 컨테이너로 Windows 빌드 환경 구축
2. PyInstaller 또는 다른 방법 시도
3. 여기서 완성 후 바로 전달
```

### 방법 C: 완전히 다른 접근
- Web 기반 (Electron/Tauri 재시도)
- C++ 네이티브 (시간 많이 걸림)
- 포터블 패키지 최적화 (8GB → 줄이기)

## 🎯 목표

**최종 결과물:**
- MathHelper.exe (150-250MB 이하)
- Python 보이지 않음 (또는 완전히 없음)
- 더블클릭으로 즉시 실행
- 의존성 없음

**요구사항:**
- ❌ Python 없이 (또는 숨김)
- ✅ 작은 크기
- ✅ 여기서 완성해서 전달

## 💾 백업 위치

- 소스: `/mnt/4tb/1.work/math_helper/`
- 패키지: `MathHelper_Source.zip` (296KB)
- Git: 로컬 저장소 초기화 완료

---

**작성일:** 2025-12-19  
**작업 시간:** 약 2-3시간  
**상태:** 진행 중 (Windows 빌드 대기)
