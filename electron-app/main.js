const { app, BrowserWindow } = require('electron')
const path = require('path')

/**
 * 메인 윈도우 생성
 * @returns {BrowserWindow}
 */
function createWindow() {
  const isDevelopment = process.env.NODE_ENV === 'development'

  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    title: '수학 도우미',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      // ✅ 프로덕션에서는 sandbox 활성화 (개발 시에도 true로 유지)
      sandbox: true,
      enableRemoteModule: false,
      nodeIntegrationInWorker: false,
      nodeIntegrationInSubFrames: false,
      preload: path.join(__dirname, 'dist/preload.js')
    }
  })

  if (isDevelopment) {
    // 개발 환경: 개발 서버 로드 + DevTools 열기
    win.loadURL('http://localhost:5173')
    win.webContents.openDevTools()
  } else {
    // 프로덕션 환경: 빌드된 파일 로드
    win.loadFile('dist/index.html')

    // ✅ 보안 강화: 프로덕션에서 DevTools 단축키 완전 차단
    win.webContents.on('before-input-event', (event, input) => {
      // F12 차단
      if (input.key === 'F12') {
        event.preventDefault()
        return
      }

      // Ctrl+Shift+I (Windows/Linux) 차단
      if (input.control && input.shift && input.key.toLowerCase() === 'i') {
        event.preventDefault()
        return
      }

      // Cmd+Option+I (macOS) 차단
      if (input.meta && input.alt && input.key.toLowerCase() === 'i') {
        event.preventDefault()
        return
      }

      // Ctrl+Shift+J (Console) 차단
      if (input.control && input.shift && input.key.toLowerCase() === 'j') {
        event.preventDefault()
        return
      }

      // Cmd+Option+J (macOS Console) 차단
      if (input.meta && input.alt && input.key.toLowerCase() === 'j') {
        event.preventDefault()
        return
      }
    })
  }

  return win
}

app.whenReady().then(() => {
  const win = createWindow()

  // ✅ 보안 강화: Content Security Policy (CSP) 헤더 추가
  // 프로덕션 환경에서만 적용 (개발 환경에서는 HMR 등이 동작해야 함)
  if (process.env.NODE_ENV !== 'development') {
    win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Content-Security-Policy': [
            // script-src: self + unsafe-inline (React inline scripts)
            // style-src: self + unsafe-inline (CSS-in-JS)
            // img-src: self + data: (base64 이미지)
            // connect-src: self (외부 API 호출 차단)
            "default-src 'self'; " +
            "script-src 'self' 'unsafe-inline'; " +
            "style-src 'self' 'unsafe-inline'; " +
            "img-src 'self' data:; " +
            "connect-src 'self'; " +
            "font-src 'self'; " +
            "object-src 'none'; " +
            "base-uri 'self'; " +
            "form-action 'self';"
          ],
          // ✅ 추가 보안 헤더
          'X-Content-Type-Options': ['nosniff'],
          'X-Frame-Options': ['DENY'],
          'X-XSS-Protection': ['1; mode=block'],
          'Referrer-Policy': ['no-referrer']
        }
      })
    })
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
