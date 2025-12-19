"""
설정 관리 모듈
YAML 설정 파일을 로드하고 관리합니다.
"""
import yaml
from pathlib import Path
from typing import Any, Dict, Optional
from dataclasses import dataclass


@dataclass
class AppConfig:
    """앱 설정"""
    title: str
    layout: str
    initial_sidebar_state: str


@dataclass
class CalculatorConfig:
    """계산기 설정"""
    prime_factor: Dict[str, Any]
    linear_equation: Dict[str, Any]
    function_graph: Dict[str, Any]


class Config:
    """설정 관리 클래스"""

    _instance: Optional['Config'] = None
    _config: Optional[Dict[str, Any]] = None

    def __new__(cls):
        """싱글톤 패턴 구현"""
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        """설정 초기화"""
        if self._config is not None:
            return

        config_file = Path(__file__).parent.parent.parent / "config" / "settings.yaml"

        try:
            with open(config_file, 'r', encoding='utf-8') as f:
                self._config = yaml.safe_load(f)
        except FileNotFoundError:
            # 기본 설정 사용
            self._config = self._get_default_config()
        except yaml.YAMLError as e:
            raise ValueError(f"설정 파일 파싱 오류: {e}")

    @staticmethod
    def _get_default_config() -> Dict[str, Any]:
        """기본 설정 반환"""
        return {
            "app": {
                "title": "중학교 1학년 수학 학습 도우미",
                "layout": "wide",
                "initial_sidebar_state": "expanded"
            },
            "calculators": {
                "prime_factor": {
                    "min_value": 2,
                    "max_value": 1000000,
                    "default_value": 12
                },
                "linear_equation": {
                    "default_a": 2.0,
                    "default_b": 3.0,
                    "default_c": 7.0
                },
                "function_graph": {
                    "default_a": 1.0,
                    "x_range_min": -10,
                    "x_range_max": 10,
                    "x_range_default": [-5, 5],
                    "y_limit": 10
                }
            }
        }

    def get(self, key: str, default: Any = None) -> Any:
        """설정 값 가져오기 (점 표기법 지원)"""
        keys = key.split('.')
        value = self._config

        for k in keys:
            if isinstance(value, dict):
                value = value.get(k)
                if value is None:
                    return default
            else:
                return default

        return value

    @property
    def app(self) -> AppConfig:
        """앱 설정 반환"""
        app_config = self._config.get("app", {})
        return AppConfig(
            title=app_config.get("title", "수학 도우미"),
            layout=app_config.get("layout", "wide"),
            initial_sidebar_state=app_config.get("initial_sidebar_state", "expanded")
        )

    @property
    def calculators(self) -> CalculatorConfig:
        """계산기 설정 반환"""
        calc_config = self._config.get("calculators", {})
        return CalculatorConfig(
            prime_factor=calc_config.get("prime_factor", {}),
            linear_equation=calc_config.get("linear_equation", {}),
            function_graph=calc_config.get("function_graph", {})
        )


# 전역 설정 인스턴스
config = Config()


def get_config() -> Config:
    """설정 인스턴스 반환"""
    return config
