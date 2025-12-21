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
      nodeIntegration: false,       // ✅ 보안: Node.js 통합 비활성화
      contextIsolation: true,        // ✅ 보안: 컨텍스트 격리
      webSecurity: true,             // ✅ 보안: 웹 보안 활성화
      allowRunningInsecureContent: false,  // ✅ 보안: 비보안 컨텐츠 차단
      sandbox: true                  // ✅ 보안: 샌드박스 활성화
    },
    icon: path.join(__dirname, 'build', 'icon.png')
  });

  // 개발 모드
  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }

  // Streamlit 서버 시작 후 로드
  startPythonServer();

  // Streamlit 서버 준비 확인 (폴링 방식)
  const checkServerReady = async () => {
    const http = require('http');
    const maxRetries = 30; // 최대 30초 대기
    let retries = 0;

    const checkConnection = () => {
      return new Promise((resolve) => {
        const req = http.get('http://localhost:8501', (res) => {
          resolve(true);
        });
        req.on('error', () => {
          resolve(false);
        });
        req.setTimeout(1000);
      });
    };

    while (retries < maxRetries) {
      const isReady = await checkConnection();
      if (isReady) {
        console.log(`Server ready after ${retries} seconds`);
        mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));
        return;
      }
      retries++;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.error('Server failed to start after 30 seconds');
    // 에러 다이얼로그 표시
    const { dialog } = require('electron');
    dialog.showErrorBox(
      'Server Start Failed',
      'Python server failed to start. Please check if Python and required packages are installed.'
    );
  };

  checkServerReady();

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
