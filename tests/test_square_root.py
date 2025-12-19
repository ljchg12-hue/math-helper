"""
제곱근과 실수 계산 테스트
"""
import pytest
import math
from src.calculators.square_root import SquareRootCalculator


class TestSquareRootCalculator:
    """제곱근 계산기 테스트 클래스"""

    def setup_method(self):
        """각 테스트 전에 실행"""
        self.calculator = SquareRootCalculator()

    def test_sqrt_perfect_square(self):
        """완전제곱수 제곱근"""
        value, expr = self.calculator.sqrt(16)
        assert value == 4.0
        assert expr == "√16 = 4"

    def test_sqrt_non_perfect_square(self):
        """완전제곱수가 아닌 수"""
        value, expr = self.calculator.sqrt(18)
        assert abs(value - math.sqrt(18)) < 0.0001
        assert "3√2" in expr

    def test_sqrt_prime_number(self):
        """소수의 제곱근"""
        value, expr = self.calculator.sqrt(7)
        assert abs(value - math.sqrt(7)) < 0.0001
        assert expr == "√7"

    def test_sqrt_negative_raises_error(self):
        """음수 제곱근 오류"""
        with pytest.raises(ValueError):
            self.calculator.sqrt(-4)

    def test_simplify_sqrt_perfect_square(self):
        """완전제곱수 간단히 하기"""
        result = self.calculator.simplify_sqrt(25)
        assert result == "5"

    def test_simplify_sqrt_with_factor(self):
        """인수가 있는 제곱근"""
        # √12 = 2√3
        result = self.calculator.simplify_sqrt(12)
        assert result == "2√3"

    def test_simplify_sqrt_large_number(self):
        """큰 수의 제곱근"""
        # √72 = 6√2
        result = self.calculator.simplify_sqrt(72)
        assert result == "6√2"

    def test_simplify_sqrt_prime(self):
        """소수는 간단히 할 수 없음"""
        result = self.calculator.simplify_sqrt(13)
        assert result == "√13"

    def test_is_perfect_square_true(self):
        """완전제곱수 판별: 참"""
        assert self.calculator.is_perfect_square(16) is True
        assert self.calculator.is_perfect_square(25) is True
        assert self.calculator.is_perfect_square(100) is True

    def test_is_perfect_square_false(self):
        """완전제곱수 판별: 거짓"""
        assert self.calculator.is_perfect_square(15) is False
        assert self.calculator.is_perfect_square(7) is False
        assert self.calculator.is_perfect_square(50) is False

    def test_is_perfect_square_negative(self):
        """음수는 완전제곱수 아님"""
        assert self.calculator.is_perfect_square(-16) is False

    def test_is_rational_integer(self):
        """유리수 판별: 정수"""
        assert self.calculator.is_rational(5.0) is True
        assert self.calculator.is_rational(0.0) is True

    def test_is_rational_fraction(self):
        """유리수 판별: 분수"""
        assert self.calculator.is_rational(0.5) is True
        assert self.calculator.is_rational(0.25) is True

    def test_is_rational_irrational(self):
        """유리수 판별: 무리수"""
        assert self.calculator.is_rational(math.sqrt(2)) is False
        assert self.calculator.is_rational(math.pi) is False

    def test_sqrt_add_same_radical(self):
        """제곱근 덧셈: 같은 근호 안"""
        # 2√3 + 3√3 = 5√3
        value, expr = self.calculator.sqrt_add(2, 3, 3, 3)
        assert abs(value - 5 * math.sqrt(3)) < 0.0001
        assert expr == "5√3"

    def test_sqrt_add_different_radical(self):
        """제곱근 덧셈: 다른 근호 안"""
        # √2 + √3
        value, expr = self.calculator.sqrt_add(1, 2, 1, 3)
        expected_value = math.sqrt(2) + math.sqrt(3)
        assert abs(value - expected_value) < 0.0001

    def test_sqrt_add_zero_result(self):
        """제곱근 덧셈: 결과가 0"""
        # 2√5 + (-2√5) = 0
        value, expr = self.calculator.sqrt_add(2, 5, -2, 5)
        assert value == 0
        assert expr == "0"

    def test_sqrt_multiply_simple(self):
        """제곱근 곱셈: 간단한 경우"""
        # 2√3 × 3√3 = 18
        value, expr = self.calculator.sqrt_multiply(2, 3, 3, 3)
        assert value == 18.0
        assert expr == "18"

    def test_sqrt_multiply_different_radicals(self):
        """제곱근 곱셈: 다른 근호"""
        # √2 × √3 = √6
        value, expr = self.calculator.sqrt_multiply(1, 2, 1, 3)
        assert abs(value - math.sqrt(6)) < 0.0001
        assert "√6" in expr

    def test_sqrt_divide_simple(self):
        """제곱근 나눗셈"""
        # 6√8 ÷ 2√2 = 6
        value, expr = self.calculator.sqrt_divide(6, 8, 2, 2)
        assert abs(value - 6.0) < 0.0001

    def test_sqrt_divide_by_zero_raises_error(self):
        """0으로 나누기 오류"""
        with pytest.raises(ValueError):
            self.calculator.sqrt_divide(2, 3, 0, 5)

    def test_rationalize_denominator_simple(self):
        """분모의 유리화: 간단한 경우"""
        # 1/√2 = √2/2
        expr, value = self.calculator.rationalize_denominator(1, 2)
        assert abs(value - (math.sqrt(2) / 2)) < 0.0001
        assert "√2" in expr

    def test_rationalize_denominator_with_coefficient(self):
        """분모의 유리화: 계수 있음"""
        # 6/√3 = 2√3
        expr, value = self.calculator.rationalize_denominator(6, 3)
        assert abs(value - 2 * math.sqrt(3)) < 0.0001
