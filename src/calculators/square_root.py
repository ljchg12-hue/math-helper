"""
제곱근과 실수 계산 모듈
제곱근 계산, 무리수 판별, 실수 연산 등을 수행합니다.
"""
import math
from typing import Tuple, Optional
from fractions import Fraction
from ..utils.logger import get_logger

logger = get_logger()


class SquareRootCalculator:
    """제곱근과 실수 계산기 클래스"""

    def __init__(self):
        """초기화"""
        logger.info("제곱근 계산기 초기화")

    def sqrt(self, n: float) -> Tuple[float, str]:
        """
        제곱근 계산

        Args:
            n: 양수

        Returns:
            (제곱근 값, 표현 문자열)

        Raises:
            ValueError: n이 음수일 때
        """
        if n < 0:
            raise ValueError("음수의 제곱근은 실수 범위에서 정의되지 않습니다.")

        sqrt_n = math.sqrt(n)

        # 완전제곱수인지 확인
        if sqrt_n == int(sqrt_n):
            return (sqrt_n, f"√{n} = {int(sqrt_n)}")

        # 간단히 할 수 있는지 확인
        simplified = self.simplify_sqrt(n)

        logger.debug(f"제곱근 계산: √{n} = {sqrt_n}")
        return (sqrt_n, simplified)

    def simplify_sqrt(self, n: float) -> str:
        """
        제곱근 간단히 하기

        Args:
            n: 양수

        Returns:
            간단히 한 형태 (예: "2√3", "√5")
        """
        if n <= 0:
            raise ValueError("양수만 가능합니다.")

        # 정수가 아닌 경우 간단히 할 수 없음
        if n != int(n):
            return f"√{n}"

        n = int(n)

        # 완전제곱수인지 확인
        sqrt_n = math.sqrt(n)
        if sqrt_n == int(sqrt_n):
            return str(int(sqrt_n))

        # 간단히 하기: n = a² × b 형태로 분해
        outside = 1
        inside = n

        # 2부터 시작해서 제곱수 찾기
        i = 2
        while i * i <= inside:
            while inside % (i * i) == 0:
                outside *= i
                inside //= (i * i)
            i += 1

        if outside == 1:
            return f"√{inside}"
        elif inside == 1:
            return str(outside)
        else:
            return f"{outside}√{inside}"

    def is_perfect_square(self, n: float) -> bool:
        """
        완전제곱수 판별

        Args:
            n: 검사할 수

        Returns:
            완전제곱수 여부
        """
        if n < 0:
            return False

        sqrt_n = math.sqrt(n)
        return sqrt_n == int(sqrt_n)

    def is_rational(self, n: float, tolerance: float = 1e-10) -> bool:
        """
        유리수 판별

        Args:
            n: 검사할 수
            tolerance: 오차 허용 범위

        Returns:
            유리수 여부
        """
        try:
            frac = Fraction(n).limit_denominator(10000)
            return abs(n - float(frac)) < tolerance
        except:
            return False

    def sqrt_add(self, a1: float, b1: float, a2: float, b2: float) -> Tuple[float, str]:
        """
        √ 덧셈: a1√b1 + a2√b2

        Args:
            a1: 첫 번째 계수
            b1: 첫 번째 근호 안
            a2: 두 번째 계수
            b2: 두 번째 근호 안

        Returns:
            (수치값, 표현 문자열)
        """
        # 근호 안이 같으면 계수만 더함
        if b1 == b2:
            result_a = a1 + a2
            if result_a == int(result_a):
                result_a = int(result_a)

            if result_a == 0:
                return (0, "0")
            elif result_a == 1:
                return (math.sqrt(b1), f"√{int(b1)}")
            elif result_a == -1:
                return (-math.sqrt(b1), f"-√{int(b1)}")
            else:
                return (result_a * math.sqrt(b1), f"{result_a}√{int(b1)}")

        # 근호 안이 다르면 계산만
        value = a1 * math.sqrt(b1) + a2 * math.sqrt(b2)

        s1 = self.simplify_sqrt(b1)
        s2 = self.simplify_sqrt(b2)

        if a1 == 1:
            expr1 = s1
        elif a1 == -1:
            expr1 = f"-{s1}"
        else:
            expr1 = f"{a1}{s1}" if "√" in s1 else f"{a1}"

        if a2 == 1:
            expr2 = s2
        elif a2 == -1:
            expr2 = f"-{s2}"
        else:
            expr2 = f"{a2}{s2}" if "√" in s2 else f"{a2}"

        if a2 >= 0:
            expr = f"{expr1} + {expr2}"
        else:
            expr = f"{expr1} - {expr2[1:]}"  # 음수 부호 제거

        return (value, expr)

    def sqrt_multiply(self, a1: float, b1: float, a2: float, b2: float) -> Tuple[float, str]:
        """
        √ 곱셈: a1√b1 × a2√b2

        Args:
            a1: 첫 번째 계수
            b1: 첫 번째 근호 안
            a2: 두 번째 계수
            b2: 두 번째 근호 안

        Returns:
            (수치값, 표현 문자열)
        """
        new_a = a1 * a2
        new_b = b1 * b2

        # 간단히 하기
        value = new_a * math.sqrt(new_b)
        simplified = self.simplify_sqrt(new_b)

        if "√" not in simplified:
            # 완전제곱수
            result = new_a * float(simplified)
            return (result, str(int(result) if result == int(result) else result))

        if new_a == 1:
            expr = simplified
        elif new_a == -1:
            expr = f"-{simplified}"
        else:
            expr = f"{new_a}{simplified}"

        return (value, expr)

    def sqrt_divide(self, a1: float, b1: float, a2: float, b2: float) -> Tuple[float, str]:
        """
        √ 나눗셈: a1√b1 ÷ a2√b2

        Args:
            a1: 분자 계수
            b1: 분자 근호 안
            a2: 분모 계수
            b2: 분모 근호 안

        Returns:
            (수치값, 표현 문자열)

        Raises:
            ValueError: a2가 0일 때
        """
        if a2 == 0:
            raise ValueError("0으로 나눌 수 없습니다.")

        new_a = a1 / a2
        new_b = b1 / b2

        value = new_a * math.sqrt(new_b)

        # 분모의 유리화
        if new_b == int(new_b):
            simplified = self.simplify_sqrt(new_b)
            if "√" not in simplified:
                result = new_a * float(simplified)
                return (result, str(int(result) if result == int(result) else result))

            if new_a == 1:
                expr = simplified
            elif new_a == -1:
                expr = f"-{simplified}"
            else:
                expr = f"{new_a}{simplified}"
            return (value, expr)

        # b2가 완전제곱수가 아니면 분모 유리화 필요
        return (value, f"{new_a}√{new_b}")

    def rationalize_denominator(self, numerator: float, denominator_sqrt: float) -> Tuple[str, float]:
        """
        분모의 유리화: numerator / √denominator_sqrt

        Args:
            numerator: 분자
            denominator_sqrt: 분모의 근호 안

        Returns:
            (유리화된 표현, 수치값)
        """
        # numerator / √d = numerator × √d / d
        new_numerator_coef = numerator
        new_denominator = denominator_sqrt

        simplified_sqrt = self.simplify_sqrt(denominator_sqrt)

        if new_numerator_coef == new_denominator:
            return (simplified_sqrt, math.sqrt(denominator_sqrt))

        # 기약분수로
        from math import gcd
        g = gcd(int(abs(new_numerator_coef)), int(new_denominator))
        new_numerator_coef = int(new_numerator_coef / g)
        new_denominator = int(new_denominator / g)

        value = new_numerator_coef * math.sqrt(denominator_sqrt) / new_denominator

        if new_denominator == 1:
            expr = f"{new_numerator_coef}{simplified_sqrt}"
        else:
            expr = f"{new_numerator_coef}{simplified_sqrt}/{new_denominator}"

        return (expr, value)
