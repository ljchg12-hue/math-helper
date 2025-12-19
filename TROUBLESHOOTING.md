# 🔧 문제 해결 가이드

## 인코딩 문제 (한글 깨짐)

### 증상
```
'궎吏'은(는) 내부 또는 외부 명령, 실행할 수 있는 프로그램, 또는
배치 파일이 아닙니다.
```

### 해결 방법 ✅
**이미 수정되었습니다!** 배치 파일이 업데이트되었습니다.

다시 실행:
```cmd
create_portable.bat
```

---

## Python을 찾을 수 없음

### 증상
```
'python'은(는) 내부 또는 외부 명령, 실행할 수 있는 프로그램, 또는
배치 파일이 아닙니다.
```

### 해결 방법

#### 방법 1: Python 경로 확인
```cmd
python --version
```

출력되지 않으면:

#### 방법 2: Python 설치 확인
1. https://www.python.org 에서 Python 3.8 이상 다운로드
2. 설치 시 **"Add Python to PATH"** 체크 필수!
3. 설치 후 CMD 재시작

#### 방법 3: 전체 경로로 실행
```cmd
C:\Python311\python.exe create_portable.py
```
(실제 Python 설치 경로로 변경)

---

## 다운로드 실패

### 증상
```
❌ 다운로드 실패: [SSL] / [Network] / [Timeout]
```

### 해결 방법

#### 인터넷 연결 확인
```cmd
ping www.python.org
```

#### 방화벽/백신 확인
- 백신 프로그램에서 Python 허용
- 방화벽에서 포트 443 (HTTPS) 허용

#### 수동 다운로드
1. 브라우저로 직접 다운로드:
   ```
   https://www.python.org/ftp/python/3.11.8/python-3.11.8-embed-amd64.zip
   ```
2. 파일을 `math_helper` 폴더에 저장
3. 다시 실행: `create_portable.bat`
   (이미 다운로드된 파일 재사용됨)

---

## 패키지 설치 실패

### 증상
```
❌ streamlit 실패
오류: ...
```

### 해결 방법

#### pip 업그레이드
```cmd
python -m pip install --upgrade pip
```

#### 재시도
```cmd
create_portable.bat
```

#### 수동 설치 (최후 수단)
```cmd
cd MathHelper_Portable\python
python.exe -m pip install streamlit plotly matplotlib numpy pandas pyyaml
```

---

## 권한 문제

### 증상
```
PermissionError: [WinError 5] 액세스가 거부되었습니다
```

### 해결 방법

#### 관리자 권한으로 실행
1. `create_portable.bat` 우클릭
2. **"관리자 권한으로 실행"** 선택

#### 다른 위치에서 실행
```cmd
cd C:\Temp
copy /path/to/math_helper .
create_portable.bat
```

---

## 디스크 공간 부족

### 증상
```
OSError: [Errno 28] No space left on device
```

### 최소 요구사항
- **다운로드**: 30MB (Python Embedded)
- **설치**: 150MB (모든 패키지 포함)
- **ZIP**: 200MB (압축 파일)
- **여유 공간**: 최소 500MB 권장

### 해결 방법
1. 디스크 정리
2. 다른 드라이브 사용
3. 임시 폴더 정리

---

## 아들 PC에서 실행 안 됨

### 증상 1: 백신 경고
```
Windows Defender / 백신 프로그램 경고
```

**해결**:
- "허용" 또는 "예외 추가"
- `MathHelper_Portable` 폴더 전체를 예외로 추가

### 증상 2: 브라우저 안 열림
```
실행.bat 실행했지만 브라우저 안 열림
```

**해결**:
- 수동으로 브라우저 열기: `http://localhost:8501`
- 또는 콘솔에 표시된 URL 클릭

### 증상 3: 포트 사용 중
```
Address already in use: Port 8501
```

**해결**:
- 다른 프로그램 종료 (8501 포트 사용 중)
- 또는 `실행.bat` 수정해서 다른 포트 사용

### 증상 4: DLL 오류
```
python311.dll을 찾을 수 없습니다
```

**해결**:
- `MathHelper_Portable` 폴더 전체가 복사되었는지 확인
- `python/` 폴더 안에 `python311.dll` 있는지 확인
- 없으면 다시 생성: `create_portable.bat`

---

## 완전 초기화

모든 방법이 실패하면:

```cmd
REM 1. 기존 폴더 삭제
rmdir /s /q MathHelper_Portable
del python-3.11.8-embed-amd64.zip

REM 2. 다시 생성
create_portable.bat
```

---

## 연락처

위 방법으로 해결되지 않으면:
1. 오류 메시지 전체를 복사
2. 스크린샷 캡처
3. 이슈로 제보

---

## 체크리스트

실행 전 확인:
- [ ] Python 3.8 이상 설치됨
- [ ] Python이 PATH에 있음 (`python --version` 확인)
- [ ] 인터넷 연결됨
- [ ] 디스크 여유 공간 500MB 이상
- [ ] 백신/방화벽 허용됨

실행 후 확인:
- [ ] `MathHelper_Portable` 폴더 생성됨
- [ ] `python/` 폴더에 `python.exe` 있음
- [ ] `src/` 폴더에 `main.py` 있음
- [ ] `실행.bat` 파일 있음

아들 PC 전달 전 확인:
- [ ] 폴더 전체 복사됨 (또는 ZIP 압축됨)
- [ ] 아들 PC에 압축 해제됨
- [ ] `실행.bat` 더블클릭 테스트 성공

---

**문제 해결이 안 되시나요? 오류 메시지를 보내주세요!**
