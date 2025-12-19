"""
연립방정식 풀이 모듈
두 개의 일차방정식으로 이루어진 연립방정식을 풉니다.
"""
from typing import Tuple, Optional
from dataclasses import dataclass
from ..utils.logger import get_logger

logger = get_logger()


@dataclass
class SimultaneousSolution:
    """연립방정식 해 클래스"""
    solution_type: str  # 'unique', 'infinite', 'none'
    x: Optional[float] = None
    y: Optional[float] = None
    method: str = ""  # 'substitution', 'elimination', 'addition'
    steps: list = None

    def __post_init__(self):
        if self.steps is None:
            self.steps = []


class SimultaneousEquationsSolver:
    """연립방정식 풀이 클래스"""

    def __init__(self):
        """초기화"""
        logger.info("연립방정식 풀이 초기화")

    def solve_by_elimination(
        self,
        a1: float, b1: float, c1: float,
        a2: float, b2: float, c2: float
    ) -> SimultaneousSolution:
        """
        가감법으로 연립방정식 풀이
        a1*x + b1*y = c1
        a2*x + b2*y = c2

        Args:
            a1, b1, c1: 첫 번째 방정식의 계수
            a2, b2, c2: 두 번째 방정식의 계수

        Returns:
            SimultaneousSolution 객체
        """
        logger.debug(f"가감법: {a1}x + {b1}y = {c1}, {a2}x + {b2}y = {c2}")

        steps = []
        steps.append(f"주어진 연립방정식:")
        steps.append(f"  {a1}x + {b1}y = {c1}  ... ①")
        steps.append(f"  {a2}x + {b2}y = {c2}  ... ②")

        # 행렬식 계산 (Cramer's rule)
        det = a1 * b2 - a2 * b1

        if abs(det) < 1e-10:  # 부동소수점 오차 처리
            # 해가 무수히 많거나 없음 - 모든 계수 비율 확인
            # a1:a2 = b1:b2 = c1:c2이면 무수히 많은 해
            # a1:a2 = b1:b2 != c1:c2이면 해가 없음

            # 0이 아닌 계수로 비율 확인
            if abs(a1) > 1e-10 and abs(a2) > 1e-10:
                ratio_ab = abs(a1 / a2 - b1 / b2) < 1e-10 if abs(b2) > 1e-10 else abs(b1) < 1e-10
                ratio_ac = abs(a1 / a2 - c1 / c2) < 1e-10 if abs(c2) > 1e-10 else abs(c1) < 1e-10
            elif abs(b1) > 1e-10 and abs(b2) > 1e-10:
                ratio_ab = abs(a1) < 1e-10 and abs(a2) < 1e-10
                ratio_ac = abs(b1 / b2 - c1 / c2) < 1e-10 if abs(c2) > 1e-10 else abs(c1) < 1e-10
            else:
                ratio_ab = True
                ratio_ac = abs(c1 - c2) < 1e-10

            if ratio_ab and ratio_ac:
                steps.append("두 식이 같은 직선입니다 (해가 무수히 많음)")
                return SimultaneousSolution('infinite', method='elimination', steps=steps)
            else:
                steps.append("두 식이 평행합니다 (해가 없음)")
                return SimultaneousSolution('none', method='elimination', steps=steps)

        # y 소거 (b를 맞춤)
        if b1 != 0 and b2 != 0:
            steps.append(f"\n[y를 소거하는 방법]")
            lcm_b = abs(b1 * b2) // self._gcd(abs(int(b1)), abs(int(b2)))
            mult1 = lcm_b // abs(int(b1))
            mult2 = lcm_b // abs(int(b2))

            steps.append(f"① × {mult1}: {a1*mult1}x + {b1*mult1}y = {c1*mult1}")
            steps.append(f"② × {mult2}: {a2*mult2}x + {b2*mult2}y = {c2*mult2}")

            new_a1, new_c1 = a1 * mult1, c1 * mult1
            new_a2, new_c2 = a2 * mult2, c2 * mult2

            if (b1 > 0 and b2 > 0) or (b1 < 0 and b2 < 0):
                steps.append(f"두 식을 빼면: ({new_a1} - {new_a2})x = {new_c1} - {new_c2}")
                x = (new_c1 - new_c2) / (new_a1 - new_a2)
            else:
                steps.append(f"두 식을 더하면: ({new_a1} + {new_a2})x = {new_c1} + {new_c2}")
                x = (new_c1 + new_c2) / (new_a1 + new_a2)
        else:
            x = (c1 * b2 - c2 * b1) / det

        steps.append(f"x = {x}")

        # x를 첫 번째 식에 대입하여 y 구하기
        if b1 != 0:
            y = (c1 - a1 * x) / b1
            steps.append(f"\n①에 x = {x}을 대입:")
            steps.append(f"{a1}({x}) + {b1}y = {c1}")
            steps.append(f"y = {y}")
        else:
            y = (c2 - a2 * x) / b2
            steps.append(f"\n②에 x = {x}을 대입:")
            steps.append(f"y = {y}")

        # 정수로 변환
        if x == int(x):
            x = int(x)
        if y == int(y):
            y = int(y)

        logger.info(f"연립방정식 해: x = {x}, y = {y}")
        return SimultaneousSolution('unique', x, y, 'elimination', steps)

    def solve_by_substitution(
        self,
        a1: float, b1: float, c1: float,
        a2: float, b2: float, c2: float
    ) -> SimultaneousSolution:
        """
        대입법으로 연립방정식 풀이

        Returns:
            SimultaneousSolution 객체
        """
        logger.debug(f"대입법: {a1}x + {b1}y = {c1}, {a2}x + {b2}y = {c2}")

        steps = []
        steps.append(f"주어진 연립방정식:")
        steps.append(f"  {a1}x + {b1}y = {c1}  ... ①")
        steps.append(f"  {a2}x + {b2}y = {c2}  ... ②")

        # 첫 번째 식에서 x를 y로 표현
        if a1 != 0:
            steps.append(f"\n①에서 x를 y로 표현:")
            steps.append(f"{a1}x = {c1} - {b1}y")
            steps.append(f"x = ({c1} - {b1}y) / {a1}")

            # 두 번째 식에 대입
            steps.append(f"\n②에 대입:")
            # a2 * ((c1 - b1*y) / a1) + b2*y = c2
            # a2*c1/a1 - a2*b1*y/a1 + b2*y = c2
            # y * (b2 - a2*b1/a1) = c2 - a2*c1/a1

            coef_y = b2 - (a2 * b1 / a1)
            const = c2 - (a2 * c1 / a1)

            if coef_y == 0:
                if const == 0:
                    return SimultaneousSolution('infinite', method='substitution', steps=steps)
                else:
                    return SimultaneousSolution('none', method='substitution', steps=steps)

            y = const / coef_y
            x = (c1 - b1 * y) / a1

            steps.append(f"y = {y}")
            steps.append(f"x = {x}")

            if x == int(x):
                x = int(x)
            if y == int(y):
                y = int(y)

            return SimultaneousSolution('unique', x, y, 'substitution', steps)
        else:
            # b1 != 0인 경우
            y = c1 / b1
            x = (c2 - b2 * y) / a2

            if x == int(x):
                x = int(x)
            if y == int(y):
                y = int(y)

            return SimultaneousSolution('unique', x, y, 'substitution', steps)

    def _gcd(self, a: int, b: int) -> int:
        """최대공약수"""
        while b:
            a, b = b, a % b
        return a
