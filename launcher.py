"""
Math Helper Launcher
Streamlit 앱을 standalone 실행 파일로 실행하기 위한 런처
"""
import sys
import os
import subprocess
import webbrowser
import time
from pathlib import Path


def get_resource_path(relative_path):
    """PyInstaller로 패키징된 경우 리소스 경로 반환"""
    try:
        # PyInstaller가 생성한 임시 폴더
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(".")

    return os.path.join(base_path, relative_path)


def main():
    """메인 실행 함수"""
    print("=" * 60)
    print("🧮 Math Helper - 중학교 1학년 수학 학습 도우미")
    print("=" * 60)
    print()
    print("앱을 시작하는 중...")
    print()

    # Streamlit 앱 경로
    app_path = get_resource_path("src/main.py")

    if not os.path.exists(app_path):
        print(f"❌ 오류: 앱 파일을 찾을 수 없습니다: {app_path}")
        input("Enter 키를 눌러 종료...")
        sys.exit(1)

    # 포트 설정
    port = 8501

    print(f"✅ 웹 서버 시작 중 (포트: {port})...")

    try:
        # Streamlit 실행
        process = subprocess.Popen(
            [
                sys.executable,
                "-m", "streamlit",
                "run",
                app_path,
                "--server.port", str(port),
                "--server.headless", "true",
                "--browser.gatherUsageStats", "false",
                "--server.fileWatcherType", "none"
            ],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            creationflags=subprocess.CREATE_NO_WINDOW if sys.platform == 'win32' else 0
        )

        # 서버 시작 대기
        time.sleep(3)

        # 브라우저 열기
        url = f"http://localhost:{port}"
        print(f"✅ 브라우저 열기: {url}")
        webbrowser.open(url)

        print()
        print("=" * 60)
        print("✨ Math Helper가 실행 중입니다!")
        print("=" * 60)
        print()
        print("📌 사용 방법:")
        print("  - 브라우저에서 앱을 사용하세요")
        print("  - 이 창을 닫으면 앱이 종료됩니다")
        print()
        print("💡 팁:")
        print(f"  - 브라우저 주소: {url}")
        print("  - 브라우저를 닫아도 이 창이 있으면 계속 실행됩니다")
        print()
        print("종료하려면 이 창을 닫거나 Ctrl+C를 누르세요.")
        print()

        # 프로세스 대기
        process.wait()

    except KeyboardInterrupt:
        print("\n\n앱을 종료하는 중...")
        process.terminate()
        time.sleep(1)
        print("✅ 정상 종료되었습니다.")

    except Exception as e:
        print(f"\n❌ 오류 발생: {e}")
        print()
        print("문제 해결 방법:")
        print("1. Python이 설치되어 있는지 확인하세요")
        print("2. 필요한 패키지가 설치되어 있는지 확인하세요")
        print("   pip install streamlit plotly matplotlib numpy pandas pyyaml")
        print()
        input("Enter 키를 눌러 종료...")
        sys.exit(1)


if __name__ == "__main__":
    main()
