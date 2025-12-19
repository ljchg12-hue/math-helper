# Windows에서 EXE 파일 만들기

## 방법 1: 자동 빌드 (추천)

1. **build_windows_exe.bat** 더블클릭
2. 자동으로 PyInstaller 설치 및 EXE 생성
3. `dist/MathHelper.exe` 생성 (약 150-250MB)

## 방법 2: 수동 빌드

```cmd
pip install pyinstaller streamlit plotly matplotlib numpy pandas pyyaml

pyinstaller --onefile --windowed --name="MathHelper" src\main.py
```

## 결과물

- **파일**: `dist/MathHelper.exe`
- **크기**: 150-250MB (8GB → 약 30-50배 감소)
- **실행**: 더블클릭으로 즉시 실행
- **의존성**: 없음 (Python 설치 불필요)

## 문제 해결

### Python이 없다고 나올 때
- Python 3.8 이상 설치: https://python.org
- 설치 시 "Add Python to PATH" 체크!

### "streamlit not found" 오류
```cmd
pip install streamlit plotly matplotlib numpy pandas pyyaml
```

### 백신 경고
- 허용 또는 예외 추가
- PyInstaller로 만든 EXE는 종종 오탐지됨

---

**참고**: Linux에서는 Windows EXE를 만들 수 없습니다.  
Windows PC에서 위 방법으로 빌드하세요.
