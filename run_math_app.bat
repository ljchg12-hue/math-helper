@echo off
chcp 65001
echo ==============================================
echo 중1 수학 도우미 설치 및 실행 중...
echo ==============================================

:: 가상환경 폴더가 없으면 생성
if not exist "venv" (
    echo [1/3] 가상환경(venv)을 생성합니다...
    python -m venv venv
)

:: 가상환경 활성화 및 라이브러리 설치
echo [2/3] 필요한 라이브러리를 확인하고 설치합니다...
call venv\Scripts\activate.bat
pip install -r requirements.txt

:: 앱 실행
echo [3/3] 프로그램을 실행합니다! (브라우저가 열립니다)
streamlit run math_app.py

pause