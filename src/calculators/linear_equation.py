"""
일차방정식 풀이 모듈
ax + b = c 형태의 일차방정식을 풉니다.
"""
from typing import Tuple, List, Union, Optional
from dataclasses import dataclass
from ..utils.logger import get_logger

logger = get_logger()


@dataclass
class EquationSolution:
    """방정식 해 클래스"""
    solution_type: str  # 'unique', 'infinite', 'none'
    value: Optional[float] = None
    steps: List[str] = None

    def __post_init__(self):
        if self.steps is None:
            self.steps = []


class LinearEquationSolver:
    """일차방정식 풀이 클래스"""

    def __init__(self):
        """초기화"""
        logger.info("일차방정식 풀이 초기화")

    def validate_coefficients(
        self,
        a: Union[int, float],
        b: Union[int, float],
        c: Union[int, float]
    ) -> Tuple[bool, str]:
        """
        계수 검증

        Args:
            a: x의 계수
            b: 좌변 상수항
            c: 우변 상수항

        Returns:
            (검증 성공 여부, 에러 메시지)
        """
        try:
            float(a)
            float(b)
            float(c)
            return True, ""
        except (ValueError, TypeError) as e:
            logger.error(f"계수 검증 실패: {e}")
            return False, "유효한 숫자를 입력해주세요."

    def solve(
        self,
        a: Union[int, float],
        b: Union[int, float],
        c: Union[int, float]
    ) -> EquationSolution:
        """
        일차방정식 풀이

        Args:
            a: x의 계수
            b: 좌변 상수항
            c: 우변 상수항

        Returns:
            EquationSolution 객체

        Raises:
            ValueError: 계수가 유효하지 않을 때
        """
        # 입력 검증
        is_valid, error_msg = self.validate_coefficients(a, b, c)
        if not is_valid:
            raise ValueError(error_msg)

        a, b, c = float(a), float(b), float(c)
        logger.debug(f"일차방정식 풀이 시작: {a}x + {b} = {c}")

        steps = []
        steps.append(f"주어진 방정식: {self._format_equation(a, b, c)}")

        # 1단계: 이항
        rhs = c - b
        steps.append(f"1. 상수항 이항: {b}를 우변으로 옮깁니다.")
        steps.append(f"   {a}x = {c} - ({b})")

        # 2단계: 정리
        steps.append(f"2. 우변 정리:")
        steps.append(f"   {a}x = {rhs}")

        # 3단계: 해 구하기
        if a == 0:
            if rhs == 0:
                steps.append("3. 결과: 0 = 0 (항등식)")
                steps.append("   해가 무수히 많습니다 (부정)")
                logger.info("해가 무수히 많음 (부정)")
                return EquationSolution(
                    solution_type='infinite',
                    steps=steps
                )
            else:
                steps.append(f"3. 결과: 0 = {rhs} (모순)")
                steps.append("   해가 없습니다 (불능)")
                logger.info("해가 없음 (불능)")
                return EquationSolution(
                    solution_type='none',
                    steps=steps
                )

        # 정상적인 해
        x = rhs / a

        # 정수로 떨어지면 정수로 표현
        if x.is_integer():
            x = int(x)

        steps.append(f"3. 양변을 x의 계수({a})로 나눕니다.")
        steps.append(f"   x = {rhs} / {a}")
        steps.append(f"   x = {x}")

        logger.info(f"일차방정식 해: x = {x}")
        return EquationSolution(
            solution_type='unique',
            value=x,
            steps=steps
        )

    def _format_equation(
        self,
        a: float,
        b: float,
        c: float
    ) -> str:
        """
        방정식을 문자열로 포맷팅

        Args:
            a: x의 계수
            b: 좌변 상수항
            c: 우변 상수항

        Returns:
            포맷팅된 방정식 문자열
        """
        # a 부분
        if a == 1:
            left = "x"
        elif a == -1:
            left = "-x"
        else:
            left = f"{a}x"

        # b 부분
        if b > 0:
            left += f" + {b}"
        elif b < 0:
            left += f" - {abs(b)}"

        return f"{left} = {c}"

    def get_latex_equation(
        self,
        a: float,
        b: float,
        c: float
    ) -> str:
        """
        LaTeX 형식의 방정식 반환

        Args:
            a: x의 계수
            b: 좌변 상수항
            c: 우변 상수항

        Returns:
            LaTeX 형식 문자열
        """
        return f"{a}x + {b} = {c}"
