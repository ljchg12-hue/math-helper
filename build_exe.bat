@echo off
chcp 65001 >nul
echo ========================================
echo Math Helper EXE 빌드 스크립트
echo ========================================
echo.

REM 가상환경 확인
if not exist "venv\Scripts\activate.bat" (
    echo ❌ 가상환경이 없습니다. 생성 중...
    python -m venv venv
    echo ✅ 가상환경 생성 완료
    echo.
)

REM 가상환경 활성화
echo 🔄 가상환경 활성화 중...
call venv\Scripts\activate.bat
echo.

REM 필요한 패키지 설치
echo 📦 필요한 패키지 설치 중...
pip install --upgrade pip
pip install -r requirements.txt
pip install pyinstaller
echo ✅ 패키지 설치 완료
echo.

REM 빌드 실행
echo 🔨 EXE 빌드 시작...
python build_exe.py

echo.
echo ========================================
echo 빌드 완료!
echo ========================================
echo.
echo 실행 파일: dist\MathHelper.exe
echo.

pause
