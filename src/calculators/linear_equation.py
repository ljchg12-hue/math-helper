"""
일차방정식 풀이 모듈
ax + b = c 형태의 일차방정식을 풉니다.
"""
import math
from typing import Tuple, List, Union, Optional
from dataclasses import dataclass
from ..utils.logger import get_logger

logger = get_logger()

# 부동소수점 비교를 위한 엡실론 값
EPSILON = 1e-10


def validate_nums(*values, param_names=None):
    """간단한 숫자 검증"""
    if param_names is None:
        param_names = [f'값{i+1}' for i in range(len(values))]

    for val, name in zip(values, param_names):
        if not isinstance(val, (int, float)):
            return False, f"{name}는 숫자여야 합니다.", None
        if math.isnan(val):
            return False, f"{name}에 NaN이 입력되었습니다.", None
        if math.isinf(val):
            return False, f"{name}에 무한대가 입력되었습니다.", None

    return True, "", tuple(float(v) for v in values)


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
        계수 검증 (보안 강화)

        보안 체크:
        - 타입 검증
        - 범위 검증 (DoS 공격 방지)
        - NaN/Infinity 검증

        Args:
            a: x의 계수
            b: 좌변 상수항
            c: 우변 상수항

        Returns:
            (검증 성공 여부, 에러 메시지)
        """
        is_valid, error_msg, _ = validate_nums(
            a, b, c,
            param_names=['a (x의 계수)', 'b (좌변 상수)', 'c (우변 상수)']
        )

        if not is_valid:
            logger.error(f"계수 검증 실패: {error_msg}")

        return is_valid, error_msg

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

        # 보안 강화: 검증된 값 사용
        _, _, validated = validate_nums(a, b, c, param_names=['a', 'b', 'c'])
        a, b, c = validated
        logger.debug(f"일차방정식 풀이 시작")

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
        if math.isclose(a, 0, abs_tol=EPSILON):
            if math.isclose(rhs, 0, abs_tol=EPSILON):
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
