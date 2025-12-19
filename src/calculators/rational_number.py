"""
정수와 유리수 계산 모듈
정수의 사칙연산, 유리수(분수) 계산, 약분, 통분 등을 수행합니다.
"""
from typing import Tuple, Optional
from dataclasses import dataclass
from fractions import Fraction
from decimal import Decimal, InvalidOperation
import math
from ..utils.logger import get_logger

logger = get_logger()


@dataclass
class RationalNumber:
    """유리수 클래스 (분수 형태)"""
    numerator: int  # 분자
    denominator: int  # 분모

    def __post_init__(self):
        """초기화 후 자동 약분"""
        if self.denominator == 0:
            raise ValueError("분모는 0이 될 수 없습니다.")

        # 분모가 음수면 부호를 분자로 이동
        if self.denominator < 0:
            self.numerator = -self.numerator
            self.denominator = -self.denominator

        # 약분
        gcd = math.gcd(abs(self.numerator), abs(self.denominator))
        self.numerator //= gcd
        self.denominator //= gcd

    def __str__(self) -> str:
        """문자열 표현"""
        if self.denominator == 1:
            return str(self.numerator)
        return f"{self.numerator}/{self.denominator}"

    def to_decimal(self) -> float:
        """소수로 변환"""
        return self.numerator / self.denominator

    def to_mixed_number(self) -> Tuple[int, int, int]:
        """대분수로 변환 (정수부, 분자, 분모)"""
        integer_part = self.numerator // self.denominator
        remainder = abs(self.numerator % self.denominator)
        return (integer_part, remainder, self.denominator)


class RationalCalculator:
    """정수와 유리수 계산기 클래스"""

    def __init__(self):
        """초기화"""
        logger.info("정수와 유리수 계산기 초기화")

    def add(self, a: RationalNumber, b: RationalNumber) -> RationalNumber:
        """
        유리수 덧셈: a + b

        Args:
            a: 첫 번째 유리수
            b: 두 번째 유리수

        Returns:
            덧셈 결과
        """
        # a/b + c/d = (ad + bc) / bd
        numerator = a.numerator * b.denominator + b.numerator * a.denominator
        denominator = a.denominator * b.denominator

        logger.debug(f"덧셈: {a} + {b}")
        return RationalNumber(numerator, denominator)

    def subtract(self, a: RationalNumber, b: RationalNumber) -> RationalNumber:
        """
        유리수 뺄셈: a - b

        Args:
            a: 첫 번째 유리수
            b: 두 번째 유리수

        Returns:
            뺄셈 결과
        """
        # a/b - c/d = (ad - bc) / bd
        numerator = a.numerator * b.denominator - b.numerator * a.denominator
        denominator = a.denominator * b.denominator

        logger.debug(f"뺄셈: {a} - {b}")
        return RationalNumber(numerator, denominator)

    def multiply(self, a: RationalNumber, b: RationalNumber) -> RationalNumber:
        """
        유리수 곱셈: a × b

        Args:
            a: 첫 번째 유리수
            b: 두 번째 유리수

        Returns:
            곱셈 결과
        """
        # a/b × c/d = ac / bd
        numerator = a.numerator * b.numerator
        denominator = a.denominator * b.denominator

        logger.debug(f"곱셈: {a} × {b}")
        return RationalNumber(numerator, denominator)

    def divide(self, a: RationalNumber, b: RationalNumber) -> RationalNumber:
        """
        유리수 나눗셈: a ÷ b

        Args:
            a: 첫 번째 유리수
            b: 두 번째 유리수

        Returns:
            나눗셈 결과

        Raises:
            ValueError: b가 0일 때
        """
        if b.numerator == 0:
            raise ValueError("0으로 나눌 수 없습니다.")

        # a/b ÷ c/d = a/b × d/c = ad / bc
        numerator = a.numerator * b.denominator
        denominator = a.denominator * b.numerator

        logger.debug(f"나눗셈: {a} ÷ {b}")
        return RationalNumber(numerator, denominator)

    def decimal_to_rational(
        self,
        decimal_str: str,
        max_denominator: int = 10000
    ) -> RationalNumber:
        """
        소수를 유리수로 변환

        Args:
            decimal_str: 소수 문자열 (예: "0.5", "1.25")
            max_denominator: 최대 분모 크기

        Returns:
            유리수 변환 결과

        Raises:
            ValueError: 유효하지 않은 소수 형식
        """
        try:
            frac = Fraction(decimal_str).limit_denominator(max_denominator)
            logger.debug(f"소수→분수 변환: {decimal_str} → {frac}")
            return RationalNumber(frac.numerator, frac.denominator)
        except (ValueError, ZeroDivisionError) as e:
            logger.error(f"소수 변환 실패: {e}")
            raise ValueError(f"유효하지 않은 소수 형식: {decimal_str}")

    def gcd(self, a: int, b: int) -> int:
        """
        최대공약수 계산 (유클리드 호제법)

        Args:
            a: 첫 번째 정수
            b: 두 번째 정수

        Returns:
            최대공약수
        """
        return math.gcd(abs(a), abs(b))

    def lcm(self, a: int, b: int) -> int:
        """
        최소공배수 계산

        Args:
            a: 첫 번째 정수
            b: 두 번째 정수

        Returns:
            최소공배수
        """
        if a == 0 or b == 0:
            return 0
        return abs(a * b) // self.gcd(a, b)

    def simplify(self, numerator: int, denominator: int) -> RationalNumber:
        """
        분수 약분

        Args:
            numerator: 분자
            denominator: 분모

        Returns:
            약분된 유리수
        """
        return RationalNumber(numerator, denominator)

    def compare(self, a: RationalNumber, b: RationalNumber) -> int:
        """
        유리수 크기 비교

        Args:
            a: 첫 번째 유리수
            b: 두 번째 유리수

        Returns:
            a > b이면 1, a == b이면 0, a < b이면 -1
        """
        # a/b와 c/d 비교: ad와 bc 비교
        left = a.numerator * b.denominator
        right = b.numerator * a.denominator

        if left > right:
            return 1
        elif left < right:
            return -1
        else:
            return 0

    def absolute_value(self, num: RationalNumber) -> RationalNumber:
        """
        절댓값 계산

        Args:
            num: 유리수

        Returns:
            절댓값
        """
        return RationalNumber(abs(num.numerator), num.denominator)

    def reciprocal(self, num: RationalNumber) -> RationalNumber:
        """
        역수 계산

        Args:
            num: 유리수

        Returns:
            역수

        Raises:
            ValueError: num이 0일 때
        """
        if num.numerator == 0:
            raise ValueError("0의 역수는 정의되지 않습니다.")

        return RationalNumber(num.denominator, num.numerator)

    def power(self, num: RationalNumber, exponent: int) -> RationalNumber:
        """
        거듭제곱 계산

        Args:
            num: 유리수
            exponent: 지수 (정수)

        Returns:
            거듭제곱 결과
        """
        if exponent == 0:
            return RationalNumber(1, 1)
        elif exponent > 0:
            numerator = num.numerator ** exponent
            denominator = num.denominator ** exponent
        else:  # exponent < 0
            if num.numerator == 0:
                raise ValueError("0의 음수 제곱은 정의되지 않습니다.")
            numerator = num.denominator ** abs(exponent)
            denominator = num.numerator ** abs(exponent)

        return RationalNumber(numerator, denominator)
