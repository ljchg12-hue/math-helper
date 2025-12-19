"""
기하 계산 모듈
피타고라스 정리, 도형의 넓이와 둘레 등을 계산합니다.
"""
import math
from typing import Tuple, List
from dataclasses import dataclass
from ..utils.logger import get_logger

logger = get_logger()


@dataclass
class GeometryResult:
    """기하 계산 결과 클래스"""
    result: float
    formula: str
    steps: List[str]


class GeometryCalculator:
    """기하 계산기 클래스"""

    def __init__(self):
        """초기화"""
        logger.info("기하 계산기 초기화")

    def pythagorean_theorem(
        self,
        a: float = None,
        b: float = None,
        c: float = None
    ) -> GeometryResult:
        """
        피타고라스 정리: a² + b² = c²

        Args:
            a: 밑변 (None이면 계산)
            b: 높이 (None이면 계산)
            c: 빗변 (None이면 계산)

        Returns:
            GeometryResult 객체
        """
        logger.debug(f"피타고라스 정리: a={a}, b={b}, c={c}")

        steps = []
        steps.append("피타고라스 정리: a² + b² = c²")

        # c를 구하는 경우
        if a is not None and b is not None and c is None:
            steps.append(f"주어진 값: a = {a}, b = {b}")
            steps.append(f"c² = a² + b² = {a}² + {b}²")
            steps.append(f"c² = {a**2} + {b**2} = {a**2 + b**2}")

            c = math.sqrt(a**2 + b**2)
            steps.append(f"c = √{a**2 + b**2} = {c}")

            logger.info(f"빗변 c = {c}")
            return GeometryResult(
                result=c,
                formula="c = √(a² + b²)",
                steps=steps
            )

        # a를 구하는 경우
        elif b is not None and c is not None and a is None:
            if c <= b:
                raise ValueError("빗변은 다른 변보다 커야 합니다.")

            steps.append(f"주어진 값: b = {b}, c = {c}")
            steps.append(f"a² = c² - b² = {c}² - {b}²")
            steps.append(f"a² = {c**2} - {b**2} = {c**2 - b**2}")

            a = math.sqrt(c**2 - b**2)
            steps.append(f"a = √{c**2 - b**2} = {a}")

            logger.info(f"밑변 a = {a}")
            return GeometryResult(
                result=a,
                formula="a = √(c² - b²)",
                steps=steps
            )

        # b를 구하는 경우
        elif a is not None and c is not None and b is None:
            if c <= a:
                raise ValueError("빗변은 다른 변보다 커야 합니다.")

            steps.append(f"주어진 값: a = {a}, c = {c}")
            steps.append(f"b² = c² - a² = {c}² - {a}²")
            steps.append(f"b² = {c**2} - {a**2} = {c**2 - a**2}")

            b = math.sqrt(c**2 - a**2)
            steps.append(f"b = √{c**2 - a**2} = {b}")

            logger.info(f"높이 b = {b}")
            return GeometryResult(
                result=b,
                formula="b = √(c² - a²)",
                steps=steps
            )

        else:
            raise ValueError("정확히 두 개의 변 길이를 입력해야 합니다.")

    def triangle_area(self, base: float, height: float) -> GeometryResult:
        """삼각형 넓이: (밑변 × 높이) / 2"""
        logger.debug(f"삼각형 넓이: 밑변={base}, 높이={height}")

        steps = []
        steps.append("삼각형 넓이 = (밑변 × 높이) / 2")
        steps.append(f"밑변 = {base}, 높이 = {height}")

        area = (base * height) / 2
        steps.append(f"넓이 = ({base} × {height}) / 2 = {area}")

        logger.info(f"삼각형 넓이 = {area}")
        return GeometryResult(
            result=area,
            formula="(밑변 × 높이) / 2",
            steps=steps
        )

    def triangle_perimeter(self, a: float, b: float, c: float) -> GeometryResult:
        """삼각형 둘레: a + b + c"""
        logger.debug(f"삼각형 둘레: a={a}, b={b}, c={c}")

        steps = []
        steps.append("삼각형 둘레 = a + b + c")
        steps.append(f"a = {a}, b = {b}, c = {c}")

        perimeter = a + b + c
        steps.append(f"둘레 = {a} + {b} + {c} = {perimeter}")

        logger.info(f"삼각형 둘레 = {perimeter}")
        return GeometryResult(
            result=perimeter,
            formula="a + b + c",
            steps=steps
        )

    def rectangle_area(self, width: float, height: float) -> GeometryResult:
        """직사각형 넓이: 가로 × 세로"""
        logger.debug(f"직사각형 넓이: 가로={width}, 세로={height}")

        steps = []
        steps.append("직사각형 넓이 = 가로 × 세로")
        steps.append(f"가로 = {width}, 세로 = {height}")

        area = width * height
        steps.append(f"넓이 = {width} × {height} = {area}")

        logger.info(f"직사각형 넓이 = {area}")
        return GeometryResult(
            result=area,
            formula="가로 × 세로",
            steps=steps
        )

    def rectangle_perimeter(self, width: float, height: float) -> GeometryResult:
        """직사각형 둘레: 2 × (가로 + 세로)"""
        logger.debug(f"직사각형 둘레: 가로={width}, 세로={height}")

        steps = []
        steps.append("직사각형 둘레 = 2 × (가로 + 세로)")
        steps.append(f"가로 = {width}, 세로 = {height}")

        perimeter = 2 * (width + height)
        steps.append(f"둘레 = 2 × ({width} + {height}) = {perimeter}")

        logger.info(f"직사각형 둘레 = {perimeter}")
        return GeometryResult(
            result=perimeter,
            formula="2 × (가로 + 세로)",
            steps=steps
        )

    def circle_area(self, radius: float) -> GeometryResult:
        """원의 넓이: π × r²"""
        logger.debug(f"원의 넓이: 반지름={radius}")

        steps = []
        steps.append("원의 넓이 = π × r²")
        steps.append(f"반지름 r = {radius}")

        area = math.pi * radius ** 2
        steps.append(f"넓이 = π × {radius}² = {area}")

        logger.info(f"원의 넓이 = {area}")
        return GeometryResult(
            result=area,
            formula="π × r²",
            steps=steps
        )

    def circle_circumference(self, radius: float) -> GeometryResult:
        """원의 둘레: 2 × π × r"""
        logger.debug(f"원의 둘레: 반지름={radius}")

        steps = []
        steps.append("원의 둘레 = 2 × π × r")
        steps.append(f"반지름 r = {radius}")

        circumference = 2 * math.pi * radius
        steps.append(f"둘레 = 2 × π × {radius} = {circumference}")

        logger.info(f"원의 둘레 = {circumference}")
        return GeometryResult(
            result=circumference,
            formula="2 × π × r",
            steps=steps
        )

    def trapezoid_area(
        self,
        upper_base: float,
        lower_base: float,
        height: float
    ) -> GeometryResult:
        """사다리꼴 넓이: (윗변 + 아랫변) × 높이 / 2"""
        logger.debug(f"사다리꼴 넓이: 윗변={upper_base}, 아랫변={lower_base}, 높이={height}")

        steps = []
        steps.append("사다리꼴 넓이 = (윗변 + 아랫변) × 높이 / 2")
        steps.append(f"윗변 = {upper_base}, 아랫변 = {lower_base}, 높이 = {height}")

        area = (upper_base + lower_base) * height / 2
        steps.append(f"넓이 = ({upper_base} + {lower_base}) × {height} / 2 = {area}")

        logger.info(f"사다리꼴 넓이 = {area}")
        return GeometryResult(
            result=area,
            formula="(윗변 + 아랫변) × 높이 / 2",
            steps=steps
        )

    def parallelogram_area(self, base: float, height: float) -> GeometryResult:
        """평행사변형 넓이: 밑변 × 높이"""
        logger.debug(f"평행사변형 넓이: 밑변={base}, 높이={height}")

        steps = []
        steps.append("평행사변형 넓이 = 밑변 × 높이")
        steps.append(f"밑변 = {base}, 높이 = {height}")

        area = base * height
        steps.append(f"넓이 = {base} × {height} = {area}")

        logger.info(f"평행사변형 넓이 = {area}")
        return GeometryResult(
            result=area,
            formula="밑변 × 높이",
            steps=steps
        )
