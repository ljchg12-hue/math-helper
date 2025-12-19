"""
Math Helper 애플리케이션 진입점
Streamlit 앱 실행: streamlit run app.py
"""
import sys
from pathlib import Path

# 프로젝트 루트를 Python 경로에 추가
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))
# src 디렉토리도 추가하여 utils, ui 등의 모듈 임포트 가능하게 함
sys.path.insert(0, str(project_root / "src"))

# 메인 앱 실행
from src.main import main

if __name__ == "__main__":
    main()
