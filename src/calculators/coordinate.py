"""
좌표평면 계산 모듈
두 점 사이의 거리, 중점, 기울기 등을 계산합니다.
"""
import math
from typing import Tuple
from dataclasses import dataclass
from ..utils.logger import get_logger

logger = get_logger()


@dataclass
class CoordinateResult:
    """좌표 계산 결과 클래스"""
    result: Tuple[float, float] | float
    formula: str
    steps: list[str]


class CoordinateCalculator:
    """좌표평면 계산기 클래스"""

    def __init__(self):
        """초기화"""
        logger.info("좌표평면 계산기 초기화")

    def distance(
        self,
        x1: float,
        y1: float,
        x2: float,
        y2: float
    ) -> CoordinateResult:
        """
        두 점 사이의 거리: √[(x2-x1)² + (y2-y1)²]

        Args:
            x1, y1: 첫 번째 점의 좌표
            x2, y2: 두 번째 점의 좌표

        Returns:
            CoordinateResult 객체
        """
        logger.debug(f"거리 계산: ({x1}, {y1})와 ({x2}, {y2})")

        steps = []
        steps.append(f"두 점: A({x1}, {y1}), B({x2}, {y2})")
        steps.append("거리 공식: d = √[(x₂-x₁)² + (y₂-y₁)²]")

        dx = x2 - x1
        dy = y2 - y1

        steps.append(f"x₂ - x₁ = {x2} - {x1} = {dx}")
        steps.append(f"y₂ - y₁ = {y2} - {y1} = {dy}")

        distance = math.sqrt(dx**2 + dy**2)
        steps.append(f"d = √[({dx})² + ({dy})²]")
        steps.append(f"d = √[{dx**2} + {dy**2}]")
        steps.append(f"d = √{dx**2 + dy**2}")
        steps.append(f"d = {distance}")

        logger.info(f"거리 = {distance}")

        return CoordinateResult(
            result=distance,
            formula="√[(x₂-x₁)² + (y₂-y₁)²]",
            steps=steps
        )

    def midpoint(
        self,
        x1: float,
        y1: float,
        x2: float,
        y2: float
    ) -> CoordinateResult:
        """
        중점 좌표: ((x1+x2)/2, (y1+y2)/2)

        Args:
            x1, y1: 첫 번째 점의 좌표
            x2, y2: 두 번째 점의 좌표

        Returns:
            CoordinateResult 객체
        """
        logger.debug(f"중점 계산: ({x1}, {y1})와 ({x2}, {y2})")

        steps = []
        steps.append(f"두 점: A({x1}, {y1}), B({x2}, {y2})")
        steps.append("중점 공식: M = ((x₁+x₂)/2, (y₁+y₂)/2)")

        mx = (x1 + x2) / 2
        my = (y1 + y2) / 2

        steps.append(f"x좌표: ({x1} + {x2}) / 2 = {mx}")
        steps.append(f"y좌표: ({y1} + {y2}) / 2 = {my}")
        steps.append(f"중점 M = ({mx}, {my})")

        logger.info(f"중점 = ({mx}, {my})")

        return CoordinateResult(
            result=(mx, my),
            formula="((x₁+x₂)/2, (y₁+y₂)/2)",
            steps=steps
        )

    def slope(
        self,
        x1: float,
        y1: float,
        x2: float,
        y2: float
    ) -> CoordinateResult:
        """
        기울기: (y2-y1)/(x2-x1)

        Args:
            x1, y1: 첫 번째 점의 좌표
            x2, y2: 두 번째 점의 좌표

        Returns:
            CoordinateResult 객체
        """
        logger.debug(f"기울기 계산: ({x1}, {y1})와 ({x2}, {y2})")

        steps = []
        steps.append(f"두 점: A({x1}, {y1}), B({x2}, {y2})")
        steps.append("기울기 공식: m = (y₂-y₁) / (x₂-x₁)")

        if x2 == x1:
            steps.append(f"x₂ - x₁ = {x2} - {x1} = 0")
            steps.append("기울기가 정의되지 않습니다 (수직선)")
            logger.info("수직선 (기울기 정의 안됨)")
            raise ValueError("수직선의 기울기는 정의되지 않습니다.")

        dx = x2 - x1
        dy = y2 - y1

        steps.append(f"y₂ - y₁ = {y2} - {y1} = {dy}")
        steps.append(f"x₂ - x₁ = {x2} - {x1} = {dx}")

        m = dy / dx
        steps.append(f"m = {dy} / {dx} = {m}")

        logger.info(f"기울기 = {m}")

        return CoordinateResult(
            result=m,
            formula="(y₂-y₁) / (x₂-x₁)",
            steps=steps
        )

    def line_equation_from_two_points(
        self,
        x1: float,
        y1: float,
        x2: float,
        y2: float
    ) -> Tuple[float, float, str]:
        """
        두 점을 지나는 직선의 방정식: y = mx + b

        Args:
            x1, y1: 첫 번째 점
            x2, y2: 두 번째 점

        Returns:
            (기울기, y절편, 방정식)
        """
        logger.debug(f"직선 방정식: ({x1}, {y1})와 ({x2}, {y2})")

        if x2 == x1:
            # 수직선: x = x1
            equation = f"x = {x1}"
            logger.info(f"직선 방정식: {equation}")
            return (None, None, equation)

        # 기울기
        m = (y2 - y1) / (x2 - x1)

        # y절편: b = y1 - m × x1
        b = y1 - m * x1

        # 방정식 생성
        if b >= 0:
            equation = f"y = {m}x + {b}"
        else:
            equation = f"y = {m}x - {abs(b)}"

        logger.info(f"직선 방정식: {equation}")
        return (m, b, equation)

    def point_line_distance(
        self,
        px: float,
        py: float,
        a: float,
        b: float,
        c: float
    ) -> CoordinateResult:
        """
        점과 직선 사이의 거리
        직선: ax + by + c = 0
        거리: |ax₀ + by₀ + c| / √(a² + b²)

        Args:
            px, py: 점의 좌표
            a, b, c: 직선 방정식의 계수

        Returns:
            CoordinateResult 객체
        """
        logger.debug(f"점과 직선 거리: ({px}, {py})와 {a}x + {b}y + {c} = 0")

        steps = []
        steps.append(f"점: P({px}, {py})")
        steps.append(f"직선: {a}x + {b}y + {c} = 0")
        steps.append("거리 공식: d = |ax₀ + by₀ + c| / √(a² + b²)")

        numerator = abs(a * px + b * py + c)
        denominator = math.sqrt(a**2 + b**2)

        steps.append(f"분자: |{a}×{px} + {b}×{py} + {c}|")
        steps.append(f"     = |{a*px} + {b*py} + {c}|")
        steps.append(f"     = |{a*px + b*py + c}|")
        steps.append(f"     = {numerator}")

        steps.append(f"분모: √({a}² + {b}²)")
        steps.append(f"     = √({a**2} + {b**2})")
        steps.append(f"     = √{a**2 + b**2}")
        steps.append(f"     = {denominator}")

        distance = numerator / denominator
        steps.append(f"d = {numerator} / {denominator} = {distance}")

        logger.info(f"점과 직선 거리 = {distance}")

        return CoordinateResult(
            result=distance,
            formula="|ax₀ + by₀ + c| / √(a² + b²)",
            steps=steps
        )

    def is_collinear(
        self,
        x1: float,
        y1: float,
        x2: float,
        y2: float,
        x3: float,
        y3: float
    ) -> bool:
        """
        세 점이 한 직선 위에 있는지 확인

        Args:
            x1, y1: 첫 번째 점
            x2, y2: 두 번째 점
            x3, y3: 세 번째 점

        Returns:
            True if collinear, False otherwise
        """
        # 삼각형 넓이 공식 사용: 0이면 일직선
        area = abs((x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1))
        return area < 1e-10  # 부동소수점 오차 고려
