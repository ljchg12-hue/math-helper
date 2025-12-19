"""
로깅 시스템 모듈
파일 및 콘솔 로그를 관리합니다.
"""
import logging
import sys
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
        self._logger.setLevel(logging.DEBUG)

        # 로그 디렉토리 생성
        log_dir = Path(__file__).parent.parent.parent / "logs"
        log_dir.mkdir(exist_ok=True)

        # 파일 핸들러 (날짜별 로그 파일)
        today = datetime.now().strftime("%Y%m%d")
        log_file = log_dir / f"math_helper_{today}.log"

        file_handler = logging.FileHandler(log_file, encoding='utf-8')
        file_handler.setLevel(logging.DEBUG)
        file_formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(funcName)s:%(lineno)d - %(message)s'
        )
        file_handler.setFormatter(file_formatter)

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
