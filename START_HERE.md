# 🚀 바로 시작하기

## 목표
**아들 PC에 Python 설치 없이, 그냥 더블클릭으로 실행!**

---

## 📋 준비 상황

✅ **모든 파일 준비 완료!**

```
math_helper/
├── create_portable.bat      ← 이것 실행!
├── create_portable.py        (자동 실행됨)
├── PORTABLE_GUIDE.md         (상세 가이드)
├── src/                      (앱 소스 코드)
├── config/                   (설정 파일)
└── requirements.txt          (패키지 목록)
```

---

## 🎯 단 3단계

### 1️⃣ 아버지 PC에서 (지금 이 PC)

```cmd
create_portable.bat
```

**자동으로 진행됨:**
- Python Embedded 다운로드 (30MB)
- pip 설치
- Streamlit, Plotly 등 패키지 설치
- 앱 파일 복사
- 실행 파일 생성

**소요시간:** 5-10분
**결과물:** `MathHelper_Portable` 폴더 (약 200MB)

### 2️⃣ 아들에게 전달

**방법 A: USB로**
- `MathHelper_Portable` 폴더를 USB에 복사
- 아들 PC로 가져가기

**방법 B: 압축 파일로**
- 스크립트 실행 시 "ZIP으로 압축할까요?" → `y` 입력
- `MathHelper_Portable.zip` 이메일/클라우드로 전달

### 3️⃣ 아들 PC에서

1. 폴더 또는 압축 해제
2. `실행.bat` 더블클릭
3. 브라우저 자동으로 열림
4. 끝! 🎉

---

## ✅ 장점

- ✅ **Python 설치 불필요**
- ✅ **관리자 권한 불필요**
- ✅ **인터넷 불필요** (완전 오프라인)
- ✅ **USB에서 바로 실행**
- ✅ **여러 PC에서 사용 가능**

---

## 📚 자세한 정보

- **상세 가이드**: `PORTABLE_GUIDE.md`
- **프로젝트 정보**: `README.md`
- **빠른 시작**: `QUICK_START.md`

---

## 🆘 문제 발생 시

### 한글 깨짐 / 인코딩 오류
✅ **해결됨!** 배치 파일이 업데이트되었습니다. 다시 실행하세요.

### Python을 찾을 수 없음
→ Python 3.8 이상 설치 필요 (https://www.python.org)
→ 설치 시 "Add Python to PATH" 체크!

### 백신 경고
→ "허용" 또는 "예외 추가"

### 브라우저 안 열림
→ 수동으로 열기: `http://localhost:8501`

### 더 많은 문제 해결
👉 **`TROUBLESHOOTING.md`** 참고 (모든 해결 방법 포함)

---

## 🎮 지금 바로 시작!

```cmd
create_portable.bat
```

**Happy Math Learning! 📚✨**
