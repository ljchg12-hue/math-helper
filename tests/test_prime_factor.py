"""
소인수분해 계산기 테스트
"""
import pytest
from src.calculators.prime_factor import PrimeFactorCalculator


class TestPrimeFactorCalculator:
    """소인수분해 계산기 테스트 클래스"""

    def setup_method(self):
        """각 테스트 전에 실행"""
        self.calculator = PrimeFactorCalculator(min_value=2, max_value=1000000)

    def test_validate_input_valid(self):
        """유효한 입력 검증 테스트"""
        is_valid, msg = self.calculator.validate_input(12)
        assert is_valid is True
        assert msg == ""

    def test_validate_input_too_small(self):
        """입력값이 최소값보다 작은 경우"""
        is_valid, msg = self.calculator.validate_input(1)
        assert is_valid is False
        assert "2 이상" in msg

    def test_validate_input_too_large(self):
        """입력값이 최대값보다 큰 경우"""
        is_valid, msg = self.calculator.validate_input(2000000)
        assert is_valid is False
        assert "1000000 이하" in msg

    def test_validate_input_invalid_type(self):
        """입력값이 숫자가 아닌 경우"""
        is_valid, msg = self.calculator.validate_input("abc")
        assert is_valid is False
        assert "숫자" in msg

    def test_factorize_prime_number(self, sample_prime_numbers):
        """소수 분해 테스트"""
        for prime in sample_prime_numbers:
            factors = self.calculator.factorize(prime)
            assert factors == {prime: 1}

    def test_factorize_composite_numbers(self, sample_composite_numbers):
        """합성수 분해 테스트"""
        for number, expected in sample_composite_numbers.items():
            factors = self.calculator.factorize(number)
            assert factors == expected

    def test_factorize_perfect_square(self):
        """완전제곱수 분해 테스트"""
        factors = self.calculator.factorize(36)
        assert factors == {2: 2, 3: 2}  # 36 = 2^2 * 3^2

    def test_factorize_power_of_two(self):
        """2의 거듭제곱 분해 테스트"""
        factors = self.calculator.factorize(128)
        assert factors == {2: 7}  # 128 = 2^7

    def test_format_result_single_factor(self):
        """단일 소인수 포맷팅 테스트"""
        result = self.calculator.format_result(7, {7: 1})
        assert result == "7 = 7"

    def test_format_result_multiple_factors(self):
        """여러 소인수 포맷팅 테스트"""
        result = self.calculator.format_result(12, {2: 2, 3: 1})
        assert "12 = " in result
        assert "2^2" in result
        assert "3" in result
        assert "×" in result

    def test_calculate_integration(self):
        """calculate 메서드 통합 테스트"""
        factors, formatted = self.calculator.calculate(24)
        assert factors == {2: 3, 3: 1}
        assert "24 = " in formatted
        assert "2^3" in formatted

    def test_factorize_raises_on_invalid_input(self):
        """유효하지 않은 입력 시 예외 발생 테스트"""
        with pytest.raises(ValueError):
            self.calculator.factorize(1)

        with pytest.raises(ValueError):
            self.calculator.factorize(2000000)
