const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let pythonProcess;

// Streamlit 서버 시작
function startPythonServer() {
  const isDev = !app.isPackaged;
  const pythonScript = isDev
    ? path.join(__dirname, 'python-server', 'start_server.py')
    : path.join(process.resourcesPath, 'app', 'python-server', 'start_server.py');

  console.log('Starting Python server from:', pythonScript);

  pythonProcess = spawn('python', [pythonScript], {
    cwd: isDev ? path.join(__dirname, '..') : path.join(process.resourcesPath, 'app'),
    env: { ...process.env, PYTHONUNBUFFERED: '1' }
  });

  pythonProcess.stdout.on('data', (data) => {
    console.log(`Python: ${data}`);
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`Python Error: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    console.log(`Python process exited with code ${code}`);
  });
}

// 메인 윈도우 생성
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    },
    icon: path.join(__dirname, 'build', 'icon.png')
  });

  // 개발 모드
  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }

  // Streamlit 서버 시작 후 로드
  startPythonServer();

  // Streamlit 서버가 시작될 때까지 대기 (3초)
  setTimeout(() => {
    mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));
  }, 3000);

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

// 앱 준비 완료
app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 모든 윈도우 닫힘
app.on('window-all-closed', function () {
  // Python 프로세스 종료
  if (pythonProcess) {
    pythonProcess.kill();
  }

  if (process.platform !== 'darwin') app.quit();
});

// 앱 종료 시 Python 프로세스 정리
app.on('before-quit', () => {
  if (pythonProcess) {
    pythonProcess.kill();
  }
});
