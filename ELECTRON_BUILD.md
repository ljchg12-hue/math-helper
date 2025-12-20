# Math Helper - Electron 빌드 가이드

## 📦 프로젝트 구조

```
math_helper/
├── electron-app/           # Electron 앱
│   ├── main.js            # 메인 프로세스
│   ├── preload.js         # 보안 브리지
│   ├── package.json       # 의존성 설정
│   ├── renderer/          # UI
│   │   └── index.html     # 로딩 화면 & iframe
│   ├── python-server/     # Streamlit 서버
│   │   └── start_server.py
│   └── build/             # 빌드 설정
│       └── electron-builder.json
├── src/                   # Python 소스 코드
├── config/                # 설정 파일
└── requirements.txt       # Python 의존성
```

---

## 🚀 빠른 시작

### 1단계: 의존성 설치

#### Python 의존성
```bash
cd /mnt/4tb/1.work/math_helper
pip install -r requirements.txt
```

#### Node.js 의존성
```bash
cd electron-app
npm install
```

---

### 2단계: 개발 모드 실행

```bash
cd electron-app
npm start
```

**작동 방식:**
1. Electron 앱 시작
2. Python Streamlit 서버 자동 실행 (포트 8501)
3. 로딩 화면 표시
4. Streamlit 준비되면 iframe으로 로드

---

### 3단계: 프로덕션 빌드

#### Windows EXE 빌드
```bash
cd electron-app
npm run build:win
```

**결과물:** `electron-app/dist/Math Helper-1.0.0-win-x64.exe`

#### macOS DMG 빌드
```bash
npm run build:mac
```

**결과물:** `electron-app/dist/Math Helper-1.0.0-mac-x64.dmg`

#### Linux AppImage 빌드
```bash
npm run build:linux
```

**결과물:** `electron-app/dist/Math Helper-1.0.0-linux-x64.AppImage`

---

## 📊 예상 결과물 크기

| 플랫폼 | 크기 | 포함 내용 |
|--------|------|-----------|
| **Windows** | 150-300MB | Electron + Chromium + Python + 앱 코드 |
| **macOS** | 150-300MB | 동일 |
| **Linux** | 150-300MB | 동일 |

---

## 🔧 주요 특징

### ✅ 장점
- **네이티브 앱 느낌** - 브라우저 느낌 없음
- **빠른 시작** - 2-3초 내 실행
- **크로스 플랫폼** - Windows, macOS, Linux 지원
- **자동 업데이트** - electron-updater로 추가 가능
- **안정적** - Discord, VSCode와 동일한 기술

### ⚙️ 기술 스택
- **Electron** 28.0 - 데스크톱 앱 프레임워크
- **Chromium** - 웹 렌더링 엔진
- **Node.js** - JavaScript 런타임
- **Streamlit** - Python 웹 앱 프레임워크

---

## 🐛 트러블슈팅

### 문제: Streamlit 서버가 시작되지 않음
**해결:**
```bash
# Python 경로 확인
which python
python --version

# Streamlit 설치 확인
pip list | grep streamlit
```

### 문제: 빌드 실패 (Windows)
**해결:**
```bash
# Node.js 재설치
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### 문제: 앱이 로딩 화면에서 멈춤
**해결:**
1. 개발자 도구 열기 (F12)
2. Console 탭에서 에러 확인
3. `http://localhost:8501` 직접 접속 테스트

---

## 📝 다음 단계

### 아이콘 추가
```bash
# build/ 폴더에 아이콘 추가
electron-app/build/
├── icon.ico   # Windows (256x256)
├── icon.icns  # macOS
└── icon.png   # Linux (512x512)
```

### 자동 업데이트 설정
```bash
npm install electron-updater
```

`main.js`에 추가:
```javascript
const { autoUpdater } = require('electron-updater');
autoUpdater.checkForUpdatesAndNotify();
```

---

## 💡 개발 팁

### 로그 확인
```bash
# Python 서버 로그
tail -f electron-app/python-server.log

# Electron 로그
npm start  # 콘솔에 출력됨
```

### 디버깅
```javascript
// main.js에서 개발자 도구 활성화
mainWindow.webContents.openDevTools();
```

---

## 📚 참고 자료

- [Electron 공식 문서](https://www.electronjs.org/docs)
- [Electron Builder 가이드](https://www.electron.build/)
- [Streamlit 문서](https://docs.streamlit.io/)

---

**버전:** 1.0.0
**마지막 업데이트:** 2025-12-20
**작성자:** Math Helper Team
