"""
Portable Python 패키지 생성 스크립트
Python 설치 없이 실행 가능한 완전한 portable 패키지 생성
"""
import os
import sys
import shutil
import urllib.request
import zipfile
import subprocess
from pathlib import Path

# Windows 콘솔 UTF-8 인코딩 설정
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except AttributeError:
        # Python 3.6 이하
        import codecs
        sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
        sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')


# Python Embedded 버전 URL (Windows x64, Python 3.11)
PYTHON_EMBEDDED_URL = "https://www.python.org/ftp/python/3.11.8/python-3.11.8-embed-amd64.zip"
PYTHON_VERSION = "3.11.8"


def download_file(url, filename):
    """파일 다운로드"""
    print(f"📥 다운로드 중: {filename}")
    print(f"   URL: {url}")

    try:
        with urllib.request.urlopen(url) as response:
            total_size = int(response.headers.get('content-length', 0))
            block_size = 8192
            downloaded = 0

            with open(filename, 'wb') as f:
                while True:
                    chunk = response.read(block_size)
                    if not chunk:
                        break
                    f.write(chunk)
                    downloaded += len(chunk)

                    if total_size:
                        percent = (downloaded / total_size) * 100
                        print(f"\r   진행: {percent:.1f}% ({downloaded}/{total_size} bytes)", end='')

        print(f"\n✅ 다운로드 완료: {filename}")
        return True

    except Exception as e:
        print(f"\n❌ 다운로드 실패: {e}")
        return False


def extract_zip(zip_file, extract_to):
    """ZIP 압축 해제"""
    print(f"📦 압축 해제 중: {zip_file}")

    try:
        with zipfile.ZipFile(zip_file, 'r') as zip_ref:
            zip_ref.extractall(extract_to)
        print(f"✅ 압축 해제 완료: {extract_to}")
        return True
    except Exception as e:
        print(f"❌ 압축 해제 실패: {e}")
        return False


def setup_pip(python_dir):
    """pip 설치"""
    print("📦 pip 설치 중...")

    # get-pip.py 다운로드
    get_pip_url = "https://bootstrap.pypa.io/get-pip.py"
    get_pip_file = python_dir / "get-pip.py"

    if not download_file(get_pip_url, str(get_pip_file)):
        return False

    # python._pth 파일 수정 (import site 활성화)
    pth_files = list(python_dir.glob("python*._pth"))
    if pth_files:
        pth_file = pth_files[0]
        print(f"🔧 {pth_file.name} 수정 중...")

        with open(pth_file, 'r') as f:
            lines = f.readlines()

        with open(pth_file, 'w') as f:
            for line in lines:
                if line.strip().startswith('#import site'):
                    f.write('import site\n')
                else:
                    f.write(line)

    # pip 설치 실행
    python_exe = python_dir / "python.exe"

    # Linux에서는 Wine 사용
    cmd = [str(python_exe), str(get_pip_file)]
    if sys.platform != 'win32':
        cmd = ["wine"] + cmd
        print("🍷 Wine으로 실행 중...")

    result = subprocess.run(
        cmd,
        cwd=str(python_dir),
        capture_output=True,
        text=True
    )

    if result.returncode == 0:
        print("✅ pip 설치 완료")
        get_pip_file.unlink()  # get-pip.py 삭제
        return True
    else:
        print(f"❌ pip 설치 실패:\n{result.stderr}")
        return False


def install_packages(python_dir, packages):
    """패키지 설치"""
    print(f"📦 패키지 설치 중: {', '.join(packages)}")

    python_exe = python_dir / "python.exe"

    for package in packages:
        print(f"   설치 중: {package}")

        # Linux에서는 Wine 사용
        cmd = [str(python_exe), "-m", "pip", "install", package]
        if sys.platform != 'win32':
            cmd = ["wine"] + cmd

        result = subprocess.run(
            cmd,
            cwd=str(python_dir),
            capture_output=True,
            text=True
        )

        if result.returncode == 0:
            print(f"   ✅ {package}")
        else:
            print(f"   ❌ {package} 실패")
            print(f"   오류: {result.stderr[:200]}")

    print("✅ 패키지 설치 완료")


def create_launcher_bat(portable_dir):
    """실행 배치 파일 생성"""
    launcher_content = """@echo off
chcp 65001 >nul
title Math Helper - 중학교 수학 학습 도우미

echo ========================================
echo Math Helper 시작 중...
echo ========================================
echo.

cd /d "%~dp0"

REM 브라우저 자동 열기
start http://localhost:8501

REM Streamlit 실행
python\\python.exe -m streamlit run src\\main.py --server.port 8501 --server.headless true --browser.gatherUsageStats false

pause
"""

    launcher_file = portable_dir / "실행.bat"
    with open(launcher_file, 'w', encoding='utf-8') as f:
        f.write(launcher_content)

    print(f"✅ 실행 파일 생성: {launcher_file.name}")


def create_readme(portable_dir):
    """사용 설명서 생성"""
    readme_content = """# Math Helper - 사용 설명서

## 실행 방법

1. 이 폴더를 원하는 위치에 복사
2. "실행.bat" 파일 더블클릭
3. 브라우저가 자동으로 열립니다
4. 사용!

## 종료 방법

- 검은 콘솔 창 닫기

## 주의사항

- 인터넷 연결 불필요 (완전히 오프라인 실행 가능)
- Python 설치 불필요
- 관리자 권한 불필요
- USB에 넣어서 사용 가능

## 문제 해결

### 브라우저가 안 열리는 경우
- 수동으로 열기: http://localhost:8501

### "포트가 사용 중" 오류
- 다른 프로그램이 8501 포트 사용 중
- 다른 프로그램 종료 후 재시도

### 백신 경고
- 허용 또는 예외 추가

## 폴더 구조

MathHelper_Portable/
├── 실행.bat          ← 이 파일 실행!
├── 사용설명서.txt
├── python/           (Python Embedded)
├── src/             (앱 소스 코드)
└── config/          (설정 파일)

---

즐거운 수학 학습 되세요! 📚✨
"""

    readme_file = portable_dir / "사용설명서.txt"
    with open(readme_file, 'w', encoding='utf-8') as f:
        f.write(readme_content)

    print(f"✅ 사용 설명서 생성: {readme_file.name}")


def main():
    """메인 함수"""
    print("=" * 60)
    print("Math Helper Portable 패키지 생성")
    print("=" * 60)
    print()

    # 작업 디렉토리
    base_dir = Path(__file__).parent
    portable_dir = base_dir / "MathHelper_Portable"
    python_dir = portable_dir / "python"

    # 기존 디렉토리 삭제
    if portable_dir.exists():
        print(f"🗑️  기존 디렉토리 삭제: {portable_dir}")
        shutil.rmtree(portable_dir)

    # 디렉토리 생성
    portable_dir.mkdir(exist_ok=True)
    python_dir.mkdir(exist_ok=True)

    print(f"📁 작업 디렉토리: {portable_dir}")
    print()

    # 1. Python Embedded 다운로드
    python_zip = base_dir / f"python-{PYTHON_VERSION}-embed-amd64.zip"

    if not python_zip.exists():
        print("1️⃣ Python Embedded 다운로드")
        if not download_file(PYTHON_EMBEDDED_URL, str(python_zip)):
            print("❌ Python 다운로드 실패")
            return
        print()
    else:
        print(f"✅ Python Embedded 이미 존재: {python_zip}")
        print()

    # 2. Python 압축 해제
    print("2️⃣ Python 압축 해제")
    if not extract_zip(str(python_zip), str(python_dir)):
        print("❌ Python 압축 해제 실패")
        return
    print()

    # 3. pip 설치
    print("3️⃣ pip 설치")
    if not setup_pip(python_dir):
        print("❌ pip 설치 실패")
        return
    print()

    # 4. 필요한 패키지 설치
    print("4️⃣ 패키지 설치")
    packages = [
        "streamlit",
        "plotly",
        "matplotlib",
        "numpy",
        "pandas",
        "pyyaml"
    ]
    install_packages(python_dir, packages)
    print()

    # 5. 앱 파일 복사
    print("5️⃣ 앱 파일 복사")

    # src 폴더 복사
    src_dest = portable_dir / "src"
    if (base_dir / "src").exists():
        shutil.copytree(base_dir / "src", src_dest)
        print(f"   ✅ src/ → {src_dest}")

    # config 폴더 복사
    config_dest = portable_dir / "config"
    if (base_dir / "config").exists():
        shutil.copytree(base_dir / "config", config_dest)
        print(f"   ✅ config/ → {config_dest}")

    print()

    # 6. 실행 파일 생성
    print("6️⃣ 실행 파일 생성")
    create_launcher_bat(portable_dir)
    create_readme(portable_dir)
    print()

    # 7. 완료
    print("=" * 60)
    print("✅ Portable 패키지 생성 완료!")
    print("=" * 60)
    print()
    print(f"📁 위치: {portable_dir}")
    print()
    print("📝 다음 단계:")
    print(f"   1. {portable_dir} 폴더를 USB나 다른 PC로 복사")
    print("   2. '실행.bat' 더블클릭")
    print("   3. 끝!")
    print()
    print("💡 Python 설치 전혀 불필요!")
    print("💡 USB에 넣어서 어디서든 실행 가능!")
    print()

    # ZIP으로 압축 (선택사항)
    print("📦 ZIP으로 압축할까요? (y/n): ", end='')
    choice = input().lower()

    if choice == 'y':
        print()
        print("📦 ZIP 압축 중...")
        zip_name = base_dir / "MathHelper_Portable.zip"

        shutil.make_archive(
            str(zip_name.with_suffix('')),
            'zip',
            str(portable_dir.parent),
            str(portable_dir.name)
        )

        print(f"✅ ZIP 생성 완료: {zip_name}")
        print(f"   크기: {zip_name.stat().st_size / 1024 / 1024:.1f} MB")
        print()
        print("이 ZIP 파일을 아들에게 보내세요!")
        print("압축 풀고 '실행.bat'만 더블클릭하면 됩니다!")


if __name__ == "__main__":
    try:
        main()
        sys.exit(0)
    except KeyboardInterrupt:
        print("\n\n중단됨")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ 오류 발생: {e}")
        import traceback
        traceback.print_exc()
        input("\nEnter 키를 눌러 종료...")
        sys.exit(1)
