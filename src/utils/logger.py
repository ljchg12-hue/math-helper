"""
로깅 시스템 모듈
파일 및 콘솔 로그를 관리합니다.
"""
import logging
import sys
import os
from pathlib import Path
from datetime import datetime
from typing import Optional


class MathHelperLogger:
    """Math Helper 애플리케이션 로거"""

    _instance: Optional['MathHelperLogger'] = None
    _logger: Optional[logging.Logger] = None

    def __new__(cls):
        """싱글톤 패턴 구현"""
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        """로거 초기화"""
        if self._logger is not None:
            return

        self._logger = logging.getLogger("MathHelper")

        # 보안 강화: 프로덕션에서는 INFO 레벨 (DEBUG 비활성화)
        # 개발 모드는 DEV_MODE 환경변수로 활성화
        if os.environ.get('DEV_MODE', '').lower() in ('1', 'true', 'yes'):
            self._logger.setLevel(logging.DEBUG)
        else:
            self._logger.setLevel(logging.INFO)

        # 로그 디렉토리 생성 (사용자 홈 디렉토리 기준)
        # Windows: %APPDATA%\MathHelper\logs
        # Linux/Mac: ~/.math_helper/logs
        if sys.platform == 'win32':
            log_dir = Path(os.environ.get('APPDATA', os.path.expanduser('~'))) / 'MathHelper' / 'logs'
        else:
            log_dir = Path.home() / '.math_helper' / 'logs'

        log_dir.mkdir(parents=True, exist_ok=True)

        # 파일 핸들러 (날짜별 로그 파일)
        today = datetime.now().strftime("%Y%m%d")
        log_file = log_dir / f"math_helper_{today}.log"

        file_handler = logging.FileHandler(log_file, encoding='utf-8')
        file_handler.setLevel(logging.DEBUG)
        file_formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(funcName)s:%(lineno)d - %(message)s'
        )
        file_handler.setFormatter(file_formatter)

        # 보안 강화: 로그 파일 권한 제한 (소유자만 읽기/쓰기)
        try:
            import stat
            log_file.chmod(stat.S_IRUSR | stat.S_IWUSR)  # 0o600
        except Exception:
            # Windows에서는 chmod가 제한적으로 작동하므로 무시
            pass

        # 콘솔 핸들러
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setLevel(logging.INFO)
        console_formatter = logging.Formatter(
            '%(levelname)s - %(message)s'
        )
        console_handler.setFormatter(console_formatter)

        # 핸들러 추가
        self._logger.addHandler(file_handler)
        self._logger.addHandler(console_handler)

    @property
    def logger(self) -> logging.Logger:
        """로거 인스턴스 반환"""
        return self._logger

    def debug(self, message: str) -> None:
        """디버그 로그"""
        self._logger.debug(message)

    def info(self, message: str) -> None:
        """정보 로그"""
        self._logger.info(message)

    def warning(self, message: str) -> None:
        """경고 로그"""
        self._logger.warning(message)

    def error(self, message: str, exc_info: bool = False) -> None:
        """에러 로그"""
        self._logger.error(message, exc_info=exc_info)

    def critical(self, message: str, exc_info: bool = False) -> None:
        """치명적 에러 로그"""
        self._logger.critical(message, exc_info=exc_info)


# 전역 로거 인스턴스
logger = MathHelperLogger()


def get_logger() -> MathHelperLogger:
    """로거 인스턴스 반환"""
    return logger
