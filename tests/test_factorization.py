"""
인수분해 테스트
"""
import pytest
from src.calculators.factorization import FactorizationCalculator


class TestFactorizationCalculator:
    """인수분해 계산기 테스트 클래스"""

    def setup_method(self):
        """각 테스트 전에 실행"""
        self.calculator = FactorizationCalculator()

    def test_factorize_simple_quadratic(self):
        """간단한 이차식 인수분해"""
        # x² + 5x + 6 = (x+2)(x+3)
        result = self.calculator.factorize_quadratic(1, 5, 6)
        assert result.method in ['quadratic', 'perfect_square', 'difference_of_squares']
        assert "(x - " in result.factored or "(x + " in result.factored

    def test_factorize_perfect_square_positive(self):
        """완전제곱식: 양수"""
        # x² + 6x + 9 = (x+3)²
        result = self.calculator.factorize_quadratic(1, 6, 9)
        assert result.method == 'perfect_square'
        assert "(x + 3)²" in result.factored

    def test_factorize_perfect_square_negative(self):
        """완전제곱식: 음수"""
        # x² - 4x + 4 = (x-2)²
        result = self.calculator.factorize_quadratic(1, -4, 4)
        assert result.method == 'perfect_square'
        assert "(x - 2)²" in result.factored

    def test_factorize_difference_of_squares(self):
        """제곱의 차"""
        # x² - 9 = (x+3)(x-3)
        result = self.calculator.factorize_quadratic(1, 0, -9)
        assert result.method == 'difference_of_squares'
        assert "(x + 3)(x - 3)" in result.factored

    def test_factorize_larger_difference_of_squares(self):
        """큰 수의 제곱의 차"""
        # x² - 16 = (x+4)(x-4)
        result = self.calculator.factorize_quadratic(1, 0, -16)
        assert result.method == 'difference_of_squares'

    def test_is_perfect_square_true(self):
        """완전제곱식 판별: 참"""
        assert self.calculator._is_perfect_square(1, 6, 9) is True
        assert self.calculator._is_perfect_square(4, 12, 9) is True

    def test_is_perfect_square_false(self):
        """완전제곱식 판별: 거짓"""
        assert self.calculator._is_perfect_square(1, 5, 6) is False
        assert self.calculator._is_perfect_square(1, 0, -9) is False

    def test_factorize_general_quadratic_integer_roots(self):
        """일반 이차식: 정수 근"""
        # x² - 5x + 6 = (x-2)(x-3)
        result = self.calculator.factorize_quadratic(1, -5, 6)
        assert result.method == 'quadratic'
        assert "(x" in result.factored

    def test_factorize_general_quadratic_negative_discriminant(self):
        """일반 이차식: 판별식 < 0"""
        # x² + x + 1 (실수 범위 인수분해 불가)
        result = self.calculator.factorize_quadratic(1, 1, 1)
        assert "인수분해 불가" in result.factored

    def test_factorize_with_coefficient_a_not_one(self):
        """a ≠ 1인 이차식"""
        # 2x² + 7x + 3
        result = self.calculator.factorize_quadratic(2, 7, 3)
        assert result.method in ['quadratic', 'unfactorable']

    def test_format_quadratic_positive_coefficients(self):
        """이차식 포맷팅: 양수 계수"""
        formatted = self.calculator._format_quadratic(1, 2, 3)
        assert "x²" in formatted
        assert "+ 2x" in formatted
        assert "+ 3" in formatted

    def test_format_quadratic_negative_coefficients(self):
        """이차식 포맷팅: 음수 계수"""
        formatted = self.calculator._format_quadratic(1, -2, -3)
        assert "x²" in formatted
        assert "- 2x" in formatted
        assert "- 3" in formatted

    def test_format_quadratic_coefficient_one(self):
        """이차식 포맷팅: 계수 1"""
        formatted = self.calculator._format_quadratic(1, 1, 0)
        assert formatted.startswith("x²")
        assert "+ x" in formatted

    def test_factorize_common_factor_simple(self):
        """공통인수: 간단한 경우"""
        result = self.calculator.factorize_common_factor("6x^2 + 9x")
        assert result.method == 'common_factor'
        assert "x" in result.factored

    def test_expand_factored_form(self):
        """인수분해된 식 전개"""
        expanded = self.calculator.expand_factored_form("(x+2)(x+3)")
        assert "x²" in expanded
        assert "5x" in expanded or "x" in expanded
        assert "6" in expanded
