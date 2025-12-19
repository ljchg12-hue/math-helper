"""
EXE 빌드 스크립트
PyInstaller를 사용하여 standalone 실행 파일 생성
"""
import PyInstaller.__main__
import shutil
import os
from pathlib import Path


def clean_build_dirs():
    """이전 빌드 디렉토리 정리"""
    dirs_to_clean = ['build', 'dist', '__pycache__']
    for dir_name in dirs_to_clean:
        if os.path.exists(dir_name):
            print(f"🗑️  {dir_name} 디렉토리 정리 중...")
            shutil.rmtree(dir_name, ignore_errors=True)

    # .spec 파일 정리
    spec_files = list(Path('.').glob('*.spec'))
    for spec_file in spec_files:
        print(f"🗑️  {spec_file} 파일 삭제 중...")
        spec_file.unlink()


def build_exe():
    """PyInstaller로 EXE 빌드"""
    print("=" * 60)
    print("🔨 Math Helper EXE 빌드 시작")
    print("=" * 60)
    print()

    # 빌드 전 정리
    clean_build_dirs()

    print("📦 PyInstaller 실행 중...")
    print()

    # PyInstaller 옵션
    PyInstaller.__main__.run([
        'launcher.py',
        '--name=MathHelper',
        '--onefile',
        '--windowed',
        '--icon=NONE',

        # 데이터 파일 포함
        '--add-data=src;src',
        '--add-data=config;config',

        # Hidden imports (Streamlit 관련)
        '--hidden-import=streamlit',
        '--hidden-import=plotly',
        '--hidden-import=matplotlib',
        '--hidden-import=numpy',
        '--hidden-import=pandas',
        '--hidden-import=yaml',

        # Streamlit 모듈들
        '--hidden-import=streamlit.runtime',
        '--hidden-import=streamlit.runtime.scriptrunner',
        '--hidden-import=streamlit.web',
        '--hidden-import=streamlit.web.cli',

        # 계산기 모듈들
        '--hidden-import=src.calculators',
        '--hidden-import=src.features',
        '--hidden-import=src.ui',
        '--hidden-import=src.utils',

        # 콘솔 창 숨기기 (Windows)
        '--noconsole',

        # 최적화
        '--optimize=2',
    ])

    print()
    print("=" * 60)
    print("✅ 빌드 완료!")
    print("=" * 60)
    print()
    print("📁 실행 파일 위치: dist/MathHelper.exe")
    print()
    print("📝 사용 방법:")
    print("  1. dist/MathHelper.exe 파일을 원하는 위치로 복사")
    print("  2. 더블클릭으로 실행")
    print("  3. 브라우저가 자동으로 열립니다")
    print()
    print("⚠️  주의사항:")
    print("  - 첫 실행 시 시간이 걸릴 수 있습니다")
    print("  - 백신 프로그램에서 차단될 수 있습니다 (허용 필요)")
    print("  - 파일 크기: 약 100-200MB")
    print()


if __name__ == "__main__":
    try:
        build_exe()
    except Exception as e:
        print()
        print(f"❌ 빌드 실패: {e}")
        print()
        print("문제 해결:")
        print("1. PyInstaller 설치 확인: pip install pyinstaller")
        print("2. 필요한 패키지 설치: pip install -r requirements.txt")
        print()
        input("Enter 키를 눌러 종료...")
