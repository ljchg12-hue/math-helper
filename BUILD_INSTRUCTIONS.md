# Math Helper - EXE 빌드 가이드

## 🎯 목표
Python 설치 없이 실행 가능한 standalone EXE 파일 생성

## 📋 준비사항

### Windows 환경
- Python 3.8 이상
- 인터넷 연결 (패키지 다운로드용)

## 🚀 빌드 방법

### 방법 1: 자동 빌드 (권장)

**1단계: 빌드 스크립트 실행**
```cmd
build_exe.bat
```

이 스크립트가 자동으로:
- ✅ 가상환경 생성
- ✅ 필요한 패키지 설치
- ✅ EXE 파일 빌드

**2단계: 완료!**
- `dist/MathHelper.exe` 파일이 생성됨
- 이 파일을 원하는 곳에 복사해서 사용

---

### 방법 2: 수동 빌드

**1단계: 가상환경 생성**
```cmd
python -m venv venv
venv\Scripts\activate
```

**2단계: 패키지 설치**
```cmd
pip install -r requirements.txt
pip install pyinstaller
```

**3단계: 빌드 실행**
```cmd
python build_exe.py
```

**4단계: 완료!**
- `dist/MathHelper.exe` 생성됨

---

## 📦 빌드 결과물

### 생성되는 파일
```
math_helper/
├── dist/
│   └── MathHelper.exe    ← 이 파일만 배포하면 됨!
├── build/                (빌드 임시 파일, 삭제 가능)
└── MathHelper.spec       (빌드 설정 파일, 삭제 가능)
```

### 파일 크기
- **예상 크기**: 100-200 MB
- Streamlit, Plotly, Matplotlib 등 모든 의존성 포함

---

## 🎮 실행 방법

### 사용자 입장 (Python 설치 불필요)

**1. EXE 파일 더블클릭**
```
MathHelper.exe
```

**2. 자동으로:**
- ✅ 웹 서버 시작
- ✅ 브라우저 열림
- ✅ 앱 실행

**3. 종료:**
- 검은 콘솔 창 닫기
- 또는 Ctrl+C

---

## ⚠️ 주의사항

### 1. 백신 프로그램 경고
- PyInstaller로 만든 EXE는 백신이 의심할 수 있음
- **해결**: "허용" 또는 "예외 추가"

### 2. 첫 실행 속도
- 첫 실행 시 압축 해제로 10-20초 소요
- 이후 실행은 빠름

### 3. 방화벽 허용
- 로컬 서버(localhost:8501) 사용
- 방화벽 허용 필요할 수 있음

### 4. 포트 충돌
- 8501 포트가 사용 중이면 실행 안 됨
- **해결**: 다른 프로그램 종료 후 재시도

---

## 🛠️ 문제 해결

### 빌드 실패
```cmd
# PyInstaller 재설치
pip uninstall pyinstaller
pip install pyinstaller
```

### EXE가 실행 안 됨
1. 백신 프로그램 확인
2. Windows Defender 예외 추가
3. 관리자 권한으로 실행

### 브라우저가 안 열림
- 수동으로 열기: `http://localhost:8501`

### "모듈을 찾을 수 없음" 오류
```cmd
# 빌드 전 패키지 확인
pip install -r requirements.txt
```

---

## 📊 빌드 옵션 수정

### build_exe.py 수정하여 커스터마이징 가능

**아이콘 변경:**
```python
'--icon=icon.ico',  # icon.ico 파일 필요
```

**콘솔 창 보이기 (디버깅용):**
```python
# '--noconsole' 라인 제거 또는 주석 처리
```

**파일 크기 줄이기:**
```python
'--exclude-module=matplotlib',  # Matplotlib 제외
'--exclude-module=plotly',      # Plotly 제외
```
(단, 차트 기능 사용 불가)

---

## 🎁 배포 방법

### 최종 사용자에게 전달

**옵션 1: EXE 파일만**
- `dist/MathHelper.exe` 파일 전달
- 더블클릭으로 실행

**옵션 2: ZIP 압축**
```cmd
# dist 폴더 압축
MathHelper.zip
└── MathHelper.exe
└── 사용설명서.txt
```

**사용설명서 예시:**
```
Math Helper 사용 방법

1. MathHelper.exe 더블클릭
2. 브라우저가 자동으로 열립니다
3. 앱 사용
4. 종료: 검은 창 닫기

문제 발생 시: http://localhost:8501 수동 접속
```

---

## 🔍 고급: Spec 파일 수정

자동 생성된 `MathHelper.spec` 파일을 수정하면:
- 더 세밀한 제어 가능
- 다음 빌드는 spec 파일 사용:

```cmd
pyinstaller MathHelper.spec
```

---

## 📞 지원

### 빌드 문제
1. `build/` 및 `dist/` 폴더 삭제 후 재시도
2. Python 재설치
3. 관리자 권한으로 CMD 실행

### 실행 문제
1. 백신/방화벽 확인
2. 포트 8501 사용 중인지 확인
3. `http://localhost:8501` 수동 접속

---

## ✅ 체크리스트

빌드 전:
- [ ] Python 3.8+ 설치됨
- [ ] 가상환경 준비됨
- [ ] requirements.txt 존재
- [ ] 인터넷 연결됨

빌드 후:
- [ ] `dist/MathHelper.exe` 존재
- [ ] 파일 크기 100MB 이상
- [ ] 더블클릭 테스트 완료
- [ ] 브라우저 자동 열림 확인

배포 전:
- [ ] 다른 PC에서 테스트
- [ ] 백신 오탐 확인
- [ ] 사용설명서 작성

---

**Happy Building! 🚀**
