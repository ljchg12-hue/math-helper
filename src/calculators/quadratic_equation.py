"""
이차방정식 풀이 모듈
ax² + bx + c = 0 형태의 이차방정식을 풉니다.
"""
import math
from typing import Tuple, List, Optional, Union
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
class QuadraticSolution:
    """이차방정식 해 클래스"""
    solution_type: str  # 'two_real', 'one_real', 'two_complex', 'identity', 'no_solution'
    x1: Optional[Union[float, complex]] = None
    x2: Optional[Union[float, complex]] = None
    discriminant: float = 0.0
    steps: List[str] = None

    def __post_init__(self):
        if self.steps is None:
            self.steps = []


class QuadraticEquationSolver:
    """이차방정식 풀이 클래스"""

    def __init__(self):
        """초기화"""
        logger.info("이차방정식 풀이 초기화")

    def solve(self, a: float, b: float, c: float) -> QuadraticSolution:
        """
        이차방정식 풀이: ax² + bx + c = 0

        Args:
            a: x²의 계수
            b: x의 계수
            c: 상수항

        Returns:
            QuadraticSolution 객체
        """
        # 보안 강화: 입력 검증
        is_valid, error_msg, validated = validate_nums(
            a, b, c,
            param_names=['a (x²의 계수)', 'b (x의 계수)', 'c (상수항)']
        )
        if not is_valid:
            logger.error(f"계수 검증 실패: {error_msg}")
            raise ValueError(error_msg)

        a, b, c = validated
        logger.debug(f"이차방정식 풀이 시작")

        steps = []
        steps.append(f"주어진 방정식: {self._format_equation(a, b, c)}")

        # a가 0이면 일차방정식
        if math.isclose(a, 0, abs_tol=EPSILON):
            if math.isclose(b, 0, abs_tol=EPSILON):
                if math.isclose(c, 0, abs_tol=EPSILON):
                    steps.append("0 = 0 (항등식)")
                    return QuadraticSolution('identity', steps=steps)
                else:
                    steps.append(f"{c} = 0 (거짓)")
                    return QuadraticSolution('no_solution', steps=steps)
            else:
                # 일차방정식: bx + c = 0
                x = -c / b
                steps.append(f"일차방정식입니다: {b}x + {c} = 0")
                steps.append(f"x = {-c}/{b} = {x}")
                return QuadraticSolution('one_real', x1=x, x2=x, steps=steps)

        # 판별식 계산
        D = b * b - 4 * a * c
        steps.append(f"\n판별식 D = b² - 4ac")
        steps.append(f"D = ({b})² - 4×{a}×{c}")
        steps.append(f"D = {D}")

        # 판별식에 따른 해의 개수
        if D > EPSILON:
            steps.append("\nD > 0이므로 서로 다른 두 실근을 가집니다.")
            return self._solve_two_real_roots(a, b, c, D, steps)
        elif math.isclose(D, 0, abs_tol=EPSILON):
            steps.append("\nD = 0이므로 중근을 가집니다.")
            return self._solve_one_real_root(a, b, steps)
        else:
            steps.append("\nD < 0이므로 두 허근(복소수 해)을 가집니다.")
            return self._solve_complex_roots(a, b, c, D, steps)

    def _solve_two_real_roots(
        self,
        a: float,
        b: float,
        c: float,
        D: float,
        steps: List[str]
    ) -> QuadraticSolution:
        """서로 다른 두 실근"""
        sqrt_D = math.sqrt(D)

        steps.append(f"\n근의 공식:")
        steps.append(f"x = (-b ± √D) / (2a)")
        steps.append(f"x = ({-b} ± √{D}) / (2×{a})")
        steps.append(f"x = ({-b} ± {sqrt_D}) / {2*a}")

        x1 = (-b + sqrt_D) / (2 * a)
        x2 = (-b - sqrt_D) / (2 * a)

        # 정수로 변환 가능하면 변환
        if x1 == int(x1):
            x1 = int(x1)
        if x2 == int(x2):
            x2 = int(x2)

        steps.append(f"\nx₁ = ({-b} + {sqrt_D}) / {2*a} = {x1}")
        steps.append(f"x₂ = ({-b} - {sqrt_D}) / {2*a} = {x2}")

        logger.info(f"이차방정식 해: x₁ = {x1}, x₂ = {x2}")
        return QuadraticSolution('two_real', x1, x2, D, steps)

    def _solve_one_real_root(self, a: float, b: float, steps: List[str]) -> QuadraticSolution:
        """중근"""
        x = -b / (2 * a)

        steps.append(f"\n중근의 공식:")
        steps.append(f"x = -b / (2a)")
        steps.append(f"x = {-b} / {2*a}")

        if x == int(x):
            x = int(x)

        steps.append(f"x = {x} (중근)")

        logger.info(f"이차방정식 중근: x = {x}")
        return QuadraticSolution('one_real', x, x, 0.0, steps)

    def _solve_complex_roots(
        self,
        a: float,
        b: float,
        c: float,
        D: float,
        steps: List[str]
    ) -> QuadraticSolution:
        """허근 (복소수 해)"""
        real_part = -b / (2 * a)
        imag_part = math.sqrt(abs(D)) / (2 * a)

        steps.append(f"\n복소수 근의 공식:")
        steps.append(f"x = (-b ± √D·i) / (2a)")
        steps.append(f"x = ({-b} ± √{abs(D)}·i) / {2*a}")

        # 복소수 객체 생성
        x1 = complex(real_part, imag_part)
        x2 = complex(real_part, -imag_part)

        steps.append(f"\nx₁ = {real_part} + {imag_part}i")
        steps.append(f"x₂ = {real_part} - {imag_part}i")

        logger.info(f"이차방정식 허근: x₁ = {x1}, x₂ = {x2}")
        return QuadraticSolution('two_complex', x1, x2, D, steps)

    def solve_by_factoring(self, a: float, b: float, c: float) -> QuadraticSolution:
        """
        인수분해를 이용한 풀이

        Args:
            a, b, c: 방정식 계수

        Returns:
            QuadraticSolution 객체
        """
        logger.debug(f"인수분해법: {a}x² + {b}x + {c} = 0")

        steps = []
        steps.append(f"주어진 방정식: {self._format_equation(a, b, c)}")
        steps.append("\n인수분해를 시도합니다.")

        # 간단한 경우만 처리 (a=1인 경우)
        if a == 1:
            # x² + bx + c = 0에서 두 수 p, q를 찾아야 함
            # p + q = b, p × q = c

            # 정수 해를 찾는 시도
            found = False
            for p in range(-100, 101):
                if c % p == 0 if p != 0 else False:
                    q = c // p
                    if p + q == b:
                        steps.append(f"두 수 {p}와 {q}를 찾았습니다:")
                        steps.append(f"  {p} + {q} = {b}")
                        steps.append(f"  {p} × {q} = {c}")

                        if p > 0 and q > 0:
                            steps.append(f"\n(x - {p})(x - {q}) = 0")
                        elif p < 0 and q < 0:
                            steps.append(f"\n(x + {abs(p)})(x + {abs(q)}) = 0")
                        else:
                            if p < 0:
                                steps.append(f"\n(x + {abs(p)})(x - {q}) = 0")
                            else:
                                steps.append(f"\n(x - {p})(x + {abs(q)}) = 0")

                        steps.append(f"\nx = {-p} 또는 x = {-q}")

                        found = True
                        logger.info(f"인수분해법 해: x = {-p}, {-q}")
                        return QuadraticSolution('two_real', -p, -q, (b*b - 4*a*c), steps)

            if not found:
                steps.append("정수 범위에서 인수분해가 어렵습니다.")
                steps.append("근의 공식을 사용하세요.")
                return self.solve(a, b, c)

        # a != 1인 경우
        steps.append("a ≠ 1인 경우 인수분해가 복잡합니다.")
        steps.append("근의 공식을 사용하세요.")
        return self.solve(a, b, c)

    def solve_by_completing_square(self, a: float, b: float, c: float) -> QuadraticSolution:
        """
        완전제곱식을 이용한 풀이

        Args:
            a, b, c: 방정식 계수

        Returns:
            QuadraticSolution 객체
        """
        logger.debug(f"완전제곱식법: {a}x² + {b}x + {c} = 0")

        steps = []
        steps.append(f"주어진 방정식: {self._format_equation(a, b, c)}")

        # 양변을 a로 나누기 (a ≠ 0)
        if a != 1:
            steps.append(f"\n양변을 {a}로 나눕니다:")
            b_over_a = b / a
            c_over_a = c / a
            steps.append(f"x² + {b_over_a}x + {c_over_a} = 0")
        else:
            b_over_a = b
            c_over_a = c

        # 상수항을 우변으로 이항
        steps.append(f"\n상수항을 우변으로 이항:")
        steps.append(f"x² + {b_over_a}x = {-c_over_a}")

        # 좌변을 완전제곱식으로
        half_b = b_over_a / 2
        half_b_squared = half_b ** 2

        steps.append(f"\n양변에 (b/2)² = ({b_over_a}/2)² = {half_b_squared}를 더합니다:")
        steps.append(f"x² + {b_over_a}x + {half_b_squared} = {-c_over_a} + {half_b_squared}")

        rhs = -c_over_a + half_b_squared
        steps.append(f"(x + {half_b})² = {rhs}")

        if rhs < 0:
            steps.append(f"\n우변이 음수이므로 실근이 없습니다.")
            return self.solve(a, b, c)
        elif rhs == 0:
            x = -half_b
            steps.append(f"\nx + {half_b} = 0")
            steps.append(f"x = {x}")
            return QuadraticSolution('one_real', x, x, 0.0, steps)
        else:
            sqrt_rhs = math.sqrt(rhs)
            steps.append(f"\nx + {half_b} = ±√{rhs}")
            steps.append(f"x + {half_b} = ±{sqrt_rhs}")

            x1 = -half_b + sqrt_rhs
            x2 = -half_b - sqrt_rhs

            if x1 == int(x1):
                x1 = int(x1)
            if x2 == int(x2):
                x2 = int(x2)

            steps.append(f"\nx₁ = {-half_b} + {sqrt_rhs} = {x1}")
            steps.append(f"x₂ = {-half_b} - {sqrt_rhs} = {x2}")

            logger.info(f"완전제곱식법 해: x₁ = {x1}, x₂ = {x2}")
            return QuadraticSolution('two_real', x1, x2, (b*b - 4*a*c), steps)

    def _format_equation(self, a: float, b: float, c: float) -> str:
        """방정식을 문자열로 포맷팅"""
        result = ""

        # x² 항
        if a == 1:
            result = "x²"
        elif a == -1:
            result = "-x²"
        elif a != 0:
            result = f"{a}x²"

        # x 항
        if b > 0:
            if b == 1:
                result += " + x"
            else:
                result += f" + {b}x"
        elif b < 0:
            if b == -1:
                result += " - x"
            else:
                result += f" - {abs(b)}x"

        # 상수항
        if c > 0:
            result += f" + {c}"
        elif c < 0:
            result += f" - {abs(c)}"

        return result + " = 0"

    def get_vertex_form(self, a: float, b: float, c: float) -> Tuple[float, float, float]:
        """
        표준형으로 변환: a(x - p)² + q

        Args:
            a, b, c: 방정식 계수

        Returns:
            (a, p, q): 표준형 계수
        """
        p = -b / (2 * a)
        q = c - (b * b) / (4 * a)

        logger.debug(f"표준형: {a}(x - {p})² + {q}")
        return (a, p, q)
