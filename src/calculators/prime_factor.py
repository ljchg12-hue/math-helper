"""
소인수분해 계산기 모듈
자연수를 소인수의 곱으로 분해합니다.
"""
from typing import Dict, Tuple
from ..utils.logger import get_logger

logger = get_logger()


class PrimeFactorCalculator:
    """소인수분해 계산기 클래스"""

    def __init__(self, min_value: int = 2, max_value: int = 1000000):
        """
        초기화

        Args:
            min_value: 최소 입력값
            max_value: 최대 입력값
        """
        self.min_value = min_value
        self.max_value = max_value
        logger.info(f"소인수분해 계산기 초기화 (범위: {min_value} ~ {max_value})")

    def validate_input(self, number: int) -> Tuple[bool, str]:
        """
        입력 값 검증

        Args:
            number: 검증할 숫자

        Returns:
            (검증 성공 여부, 에러 메시지)
        """
        if not isinstance(number, (int, float)):
            return False, "숫자를 입력해주세요."

        number = int(number)

        if number < self.min_value:
            return False, f"{self.min_value} 이상의 숫자를 입력해주세요."

        if number > self.max_value:
            return False, f"{self.max_value} 이하의 숫자를 입력해주세요."

        return True, ""

    def factorize(self, number: int) -> Dict[int, int]:
        """
        소인수분해 수행

        Args:
            number: 분해할 숫자

        Returns:
            {소인수: 지수} 형태의 딕셔너리

        Raises:
            ValueError: 입력 값이 유효하지 않을 때
        """
        # 입력 검증
        is_valid, error_msg = self.validate_input(number)
        if not is_valid:
            logger.error(f"소인수분해 입력 검증 실패: {error_msg}")
            raise ValueError(error_msg)

        n = int(number)
        logger.debug(f"소인수분해 시작: {n}")

        factors = {}
        d = 2

        # 소인수 구하기
        while d * d <= n:
            while n % d == 0:
                factors[d] = factors.get(d, 0) + 1
                n //= d
            d += 1

        if n > 1:
            factors[n] = factors.get(n, 0) + 1

        logger.debug(f"소인수분해 결과: {factors}")
        return factors

    def format_result(self, number: int, factors: Dict[int, int]) -> str:
        """
        결과를 문자열로 포맷팅

        Args:
            number: 원본 숫자
            factors: 소인수 딕셔너리

        Returns:
            포맷팅된 결과 문자열 (예: "12 = 2^2 × 3")
        """
        if not factors:
            return f"{number} = 1"

        result_parts = []
        for factor in sorted(factors.keys()):
            count = factors[factor]
            if count == 1:
                result_parts.append(f"{factor}")
            else:
                result_parts.append(f"{factor}^{count}")

        result_str = " × ".join(result_parts)
        return f"{number} = {result_str}"

    def calculate(self, number: int) -> Tuple[Dict[int, int], str]:
        """
        소인수분해 계산 및 결과 반환

        Args:
            number: 분해할 숫자

        Returns:
            (소인수 딕셔너리, 포맷팅된 결과 문자열)

        Raises:
            ValueError: 입력 값이 유효하지 않을 때
        """
        factors = self.factorize(number)
        formatted = self.format_result(number, factors)
        return factors, formatted
