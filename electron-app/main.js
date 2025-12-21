const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: '수학 도우미',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,  // ✅ sandbox 비활성화
      enableRemoteModule: false,
      nodeIntegrationInWorker: false,
      nodeIntegrationInSubFrames: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173')
    win.webContents.openDevTools()
  } else {
    win.loadFile('dist/index.html')
    // 프로덕션에서도 개발자 도구 열기 (디버깅용)
    win.webContents.openDevTools()
  }
}

app.whenReady().then(createWindow)

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
