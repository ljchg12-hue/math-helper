@echo off
chcp 65001 >nul
echo ========================================
echo Math Helper - Windows EXE 빌드
echo ========================================
echo.

REM Python 설치 확인
python --version >nul 2>&1
if errorlevel 1 (
    echo [오류] Python이 설치되지 않았습니다.
    echo Python 3.8 이상을 설치하세요: https://python.org
    pause
    exit /b 1
)

echo [1/3] PyInstaller 설치 중...
pip install pyinstaller streamlit plotly matplotlib numpy pandas pyyaml

echo.
echo [2/3] EXE 파일 생성 중...
pyinstaller --onefile --windowed --name="MathHelper" --icon=NONE ^
    --add-data="config;config" ^
    --hidden-import=streamlit ^
    --hidden-import=plotly ^
    src\main.py

echo.
echo [3/3] 완료!
echo.
echo ========================================
echo ✅ 빌드 완료!
echo ========================================
echo.
echo 📁 위치: dist\MathHelper.exe
echo 📊 크기: 
dir dist\MathHelper.exe | find "MathHelper.exe"
echo.
echo 이 파일을 아들에게 전달하세요!
echo.
pause
