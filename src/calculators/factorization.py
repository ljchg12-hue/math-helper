"""
인수분해 모듈
이차식, 삼차식의 인수분해를 수행합니다.
"""
import re
from typing import List, Tuple, Optional
from dataclasses import dataclass
from ..utils.logger import get_logger

logger = get_logger()


@dataclass
class FactorizationResult:
    """인수분해 결과 클래스"""
    original: str
    factored: str
    method: str  # 'common_factor', 'difference_of_squares', 'perfect_square', 'quadratic', 'sum_difference_of_cubes'
    steps: List[str]


class FactorizationCalculator:
    """인수분해 계산기 클래스"""

    def __init__(self):
        """초기화"""
        logger.info("인수분해 계산기 초기화")

    def factorize_quadratic(self, a: float, b: float, c: float) -> FactorizationResult:
        """
        이차식 인수분해: ax² + bx + c

        Args:
            a: x²의 계수
            b: x의 계수
            c: 상수항

        Returns:
            FactorizationResult 객체
        """
        logger.debug(f"이차식 인수분해: {a}x² + {b}x + {c}")

        steps = []
        original = self._format_quadratic(a, b, c)
        steps.append(f"주어진 식: {original}")

        # 1. 완전제곱식 판별
        if self._is_perfect_square(a, b, c):
            factored, method_steps = self._factorize_perfect_square(a, b, c)
            steps.extend(method_steps)
            return FactorizationResult(original, factored, 'perfect_square', steps)

        # 2. 제곱의 차 판별
        if b == 0 and c < 0:
            factored, method_steps = self._factorize_difference_of_squares(a, c)
            steps.extend(method_steps)
            return FactorizationResult(original, factored, 'difference_of_squares', steps)

        # 3. 일반 이차식 인수분해 (근의 공식 사용)
        factored, method_steps = self._factorize_general_quadratic(a, b, c)
        steps.extend(method_steps)
        return FactorizationResult(original, factored, 'quadratic', steps)

    def _is_perfect_square(self, a: float, b: float, c: float) -> bool:
        """완전제곱식 판별"""
        # (√a·x ± √c)² = ax² ± 2√(ac)x + c
        if a > 0 and c > 0:
            sqrt_a = a ** 0.5
            sqrt_c = c ** 0.5
            expected_b = 2 * sqrt_a * sqrt_c

            if sqrt_a == int(sqrt_a) and sqrt_c == int(sqrt_c):
                return abs(abs(b) - expected_b) < 0.0001

        return False

    def _factorize_perfect_square(self, a: float, b: float, c: float) -> Tuple[str, List[str]]:
        """완전제곱식 인수분해"""
        steps = []
        steps.append("완전제곱식입니다.")

        sqrt_a = int(a ** 0.5)
        sqrt_c = int(c ** 0.5)

        if b > 0:
            if sqrt_a == 1:
                factored = f"(x + {sqrt_c})²"
                steps.append(f"= (x + {sqrt_c})²")
            else:
                factored = f"({sqrt_a}x + {sqrt_c})²"
                steps.append(f"= ({sqrt_a}x + {sqrt_c})²")
        else:
            if sqrt_a == 1:
                factored = f"(x - {sqrt_c})²"
                steps.append(f"= (x - {sqrt_c})²")
            else:
                factored = f"({sqrt_a}x - {sqrt_c})²"
                steps.append(f"= ({sqrt_a}x - {sqrt_c})²")

        logger.info(f"완전제곱식 인수분해: {factored}")
        return factored, steps

    def _factorize_difference_of_squares(self, a: float, c: float) -> Tuple[str, List[str]]:
        """제곱의 차 인수분해: a²x² - c²"""
        steps = []
        steps.append("제곱의 차 공식을 사용합니다: a² - b² = (a+b)(a-b)")

        sqrt_a = a ** 0.5
        sqrt_c = abs(c) ** 0.5

        if sqrt_a == int(sqrt_a) and sqrt_c == int(sqrt_c):
            sqrt_a = int(sqrt_a)
            sqrt_c = int(sqrt_c)

            if sqrt_a == 1:
                factored = f"(x + {sqrt_c})(x - {sqrt_c})"
                steps.append(f"= (x + {sqrt_c})(x - {sqrt_c})")
            else:
                factored = f"({sqrt_a}x + {sqrt_c})({sqrt_a}x - {sqrt_c})"
                steps.append(f"= ({sqrt_a}x + {sqrt_c})({sqrt_a}x - {sqrt_c})")
        else:
            factored = f"(√{a}x + √{abs(c)})(√{a}x - √{abs(c)})"
            steps.append(f"= (√{a}x + √{abs(c)})(√{a}x - √{abs(c)})")

        logger.info(f"제곱의 차 인수분해: {factored}")
        return factored, steps

    def _factorize_general_quadratic(self, a: float, b: float, c: float) -> Tuple[str, List[str]]:
        """일반 이차식 인수분해"""
        steps = []

        # 판별식
        D = b * b - 4 * a * c

        steps.append(f"판별식: D = b² - 4ac = {b}² - 4×{a}×{c} = {D}")

        if D < 0:
            steps.append("D < 0이므로 실수 범위에서 인수분해되지 않습니다.")
            logger.info("인수분해 불가 (D < 0)")
            return "인수분해 불가", steps

        # 근의 공식
        sqrt_D = D ** 0.5
        x1 = (-b + sqrt_D) / (2 * a)
        x2 = (-b - sqrt_D) / (2 * a)

        steps.append(f"근의 공식으로 해를 구합니다:")
        steps.append(f"x = ({-b} ± √{D}) / (2×{a})")

        # 정수인지 확인
        if x1 == int(x1):
            x1 = int(x1)
        if x2 == int(x2):
            x2 = int(x2)

        steps.append(f"x₁ = {x1}, x₂ = {x2}")

        # 인수분해 표현
        if a == 1:
            if x1 > 0 and x2 > 0:
                factored = f"(x - {x1})(x - {x2})"
            elif x1 < 0 and x2 < 0:
                factored = f"(x + {abs(x1)})(x + {abs(x2)})"
            elif x1 > 0 > x2:
                factored = f"(x - {x1})(x + {abs(x2)})"
            else:
                factored = f"(x + {abs(x1)})(x - {x2})"
        else:
            factored = f"{a}(x - {x1})(x - {x2})"

        steps.append(f"인수분해 결과: {factored}")
        logger.info(f"일반 이차식 인수분해: {factored}")
        return factored, steps

    def factorize_common_factor(self, expr: str) -> FactorizationResult:
        """
        공통인수 묶어내기

        Args:
            expr: 다항식 문자열

        Returns:
            FactorizationResult 객체
        """
        logger.debug(f"공통인수 묶어내기: {expr}")

        steps = []
        steps.append(f"주어진 식: {expr}")

        # 간단한 파싱 (예: 6x² + 9x)
        # 실제로는 더 복잡한 파싱 필요
        match = re.match(r'([+-]?\d*)x\^2\s*([+-]\s*\d*)x', expr.replace(' ', ''))

        if match:
            coef1_str = match.group(1) if match.group(1) else '1'
            coef2_str = match.group(2).replace(' ', '') if match.group(2) else '0'

            coef1 = int(coef1_str) if coef1_str not in ['', '+'] else 1
            coef1 = -1 if coef1_str == '-' else coef1

            coef2 = int(coef2_str) if coef2_str not in ['', '+'] else 1
            coef2 = -1 if coef2_str == '-' else coef2

            # 최대공약수 구하기
            from math import gcd
            common = gcd(abs(coef1), abs(coef2))

            if common > 1:
                new_coef1 = coef1 // common
                new_coef2 = coef2 // common

                factored = f"{common}x({new_coef1}x + {new_coef2})" if new_coef2 >= 0 else f"{common}x({new_coef1}x - {abs(new_coef2)})"
                steps.append(f"공통인수 {common}x를 묶어냅니다.")
                steps.append(f"= {factored}")
            else:
                factored = f"x({coef1}x + {coef2})" if coef2 >= 0 else f"x({coef1}x - {abs(coef2)})"
                steps.append(f"공통인수 x를 묶어냅니다.")
                steps.append(f"= {factored}")

            logger.info(f"공통인수 인수분해: {factored}")
            return FactorizationResult(expr, factored, 'common_factor', steps)

        # 파싱 실패
        steps.append("공통인수를 찾을 수 없습니다.")
        return FactorizationResult(expr, expr, 'common_factor', steps)

    def _format_quadratic(self, a: float, b: float, c: float) -> str:
        """이차식을 문자열로 포맷팅"""
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

        return result.strip()

    def expand_factored_form(self, factored: str) -> str:
        """
        인수분해된 식을 전개

        Args:
            factored: 인수분해된 식 (예: "(x+2)(x+3)")

        Returns:
            전개된 식
        """
        logger.debug(f"전개: {factored}")

        # (x+a)(x+b) 형태 파싱
        pattern = r'\(x\s*([+-])\s*(\d+)\)\(x\s*([+-])\s*(\d+)\)'
        match = re.match(pattern, factored.replace(' ', ''))

        if match:
            sign1, a, sign2, b = match.groups()
            a = int(a) * (1 if sign1 == '+' else -1)
            b = int(b) * (1 if sign2 == '+' else -1)

            # (x+a)(x+b) = x² + (a+b)x + ab
            coef_x = a + b
            const = a * b

            result = f"x²"
            if coef_x > 0:
                result += f" + {coef_x}x"
            elif coef_x < 0:
                result += f" - {abs(coef_x)}x"

            if const > 0:
                result += f" + {const}"
            elif const < 0:
                result += f" - {abs(const)}"

            logger.info(f"전개 결과: {result}")
            return result

        return "전개할 수 없습니다"
