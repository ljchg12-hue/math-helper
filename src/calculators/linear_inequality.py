"""
일차부등식 풀이 모듈
ax + b < c, ax + b > c, ax + b ≤ c, ax + b ≥ c 형태의 일차부등식을 풉니다.
"""
from typing import Tuple, List, Optional
from dataclasses import dataclass
from ..utils.logger import get_logger

logger = get_logger()


@dataclass
class InequalitySolution:
    """부등식 해 클래스"""
    solution_type: str  # 'range', 'all', 'none'
    inequality: str  # '<', '>', '≤', '≥'
    value: Optional[float] = None
    steps: List[str] = None

    def __post_init__(self):
        if self.steps is None:
            self.steps = []


class LinearInequalitySolver:
    """일차부등식 풀이 클래스"""

    def __init__(self):
        """초기화"""
        logger.info("일차부등식 풀이 초기화")

    def solve(
        self,
        a: float,
        b: float,
        c: float,
        inequality: str
    ) -> InequalitySolution:
        """
        일차부등식 풀이: ax + b [inequality] c

        Args:
            a: x의 계수
            b: 좌변 상수항
            c: 우변 상수항
            inequality: '<', '>', '≤', '≥'

        Returns:
            InequalitySolution 객체
        """
        a, b, c = float(a), float(b), float(c)
        logger.debug(f"일차부등식 풀이: {a}x + {b} {inequality} {c}")

        steps = []
        steps.append(f"주어진 부등식: {self._format_inequality(a, b, c, inequality)}")

        # 1단계: 이항
        rhs = c - b
        steps.append(f"1. 상수항 이항: {b}를 우변으로 옮깁니다.")
        steps.append(f"   {a}x {inequality} {c} - ({b})")
        steps.append(f"2. 우변 정리: {a}x {inequality} {rhs}")

        # 2단계: 양변을 a로 나누기
        if a == 0:
            if self._check_inequality(0, rhs, inequality):
                steps.append(f"3. 결과: 0 {inequality} {rhs} (참)")
                steps.append("   모든 x가 해입니다")
                return InequalitySolution('all', inequality, steps=steps)
            else:
                steps.append(f"3. 결과: 0 {inequality} {rhs} (거짓)")
                steps.append("   해가 없습니다")
                return InequalitySolution('none', inequality, steps=steps)

        # a가 음수면 부등호 방향 바뀜
        if a < 0:
            new_ineq = self._reverse_inequality(inequality)
            steps.append(f"3. 양변을 {a}로 나눕니다 (음수로 나누므로 부등호 방향이 바뀝니다)")
            x = rhs / a
        else:
            new_ineq = inequality
            steps.append(f"3. 양변을 {a}로 나눕니다")
            x = rhs / a

        if x == int(x):
            x = int(x)

        steps.append(f"   x {new_ineq} {x}")

        logger.info(f"일차부등식 해: x {new_ineq} {x}")
        return InequalitySolution('range', new_ineq, x, steps)

    def _format_inequality(self, a: float, b: float, c: float, ineq: str) -> str:
        """부등식을 문자열로 포맷팅"""
        if a == 1:
            left = "x"
        elif a == -1:
            left = "-x"
        else:
            left = f"{a}x"

        if b > 0:
            left += f" + {b}"
        elif b < 0:
            left += f" - {abs(b)}"

        return f"{left} {ineq} {c}"

    def _reverse_inequality(self, ineq: str) -> str:
        """부등호 방향 반전"""
        reverse_map = {
            '<': '>',
            '>': '<',
            '≤': '≥',
            '≥': '≤'
        }
        return reverse_map.get(ineq, ineq)

    def _check_inequality(self, left: float, right: float, ineq: str) -> bool:
        """부등식이 참인지 확인"""
        if ineq == '<':
            return left < right
        elif ineq == '>':
            return left > right
        elif ineq == '≤':
            return left <= right
        elif ineq == '≥':
            return left >= right
        return False
