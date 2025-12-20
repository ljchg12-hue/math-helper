#!/usr/bin/env python3
"""
Streamlit 서버 실행 스크립트
Electron 앱에서 내장 Python 서버로 실행
"""
import os
import sys
import subprocess
from pathlib import Path

def main():
    # 실행 경로 설정
    if getattr(sys, 'frozen', False):
        # 패키징된 앱
        app_path = Path(sys._MEIPASS)
    else:
        # 개발 모드
        app_path = Path(__file__).parent.parent.parent

    # src 디렉토리 경로
    src_path = app_path / 'src'

    # PYTHONPATH에 src 추가
    sys.path.insert(0, str(src_path))

    # 작업 디렉토리 변경
    os.chdir(app_path)

    print(f"App path: {app_path}")
    print(f"Src path: {src_path}")
    print(f"Current directory: {os.getcwd()}")

    # Streamlit 서버 실행
    streamlit_cmd = [
        sys.executable,
        "-m", "streamlit",
        "run",
        str(src_path / "main.py"),
        "--server.port=8501",
        "--server.address=localhost",
        "--server.headless=true",
        "--browser.gatherUsageStats=false"
    ]

    print(f"Starting Streamlit: {' '.join(streamlit_cmd)}")

    try:
        subprocess.run(streamlit_cmd, check=True)
    except KeyboardInterrupt:
        print("\nStreamlit server stopped")
    except Exception as e:
        print(f"Error starting Streamlit: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
