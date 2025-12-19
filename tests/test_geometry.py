"""
기하 계산 테스트
"""
import pytest
import math
from src.calculators.geometry import GeometryCalculator


class TestGeometryCalculator:
    """기하 계산기 테스트 클래스"""

    def setup_method(self):
        """각 테스트 전에 실행"""
        self.calculator = GeometryCalculator()

    def test_pythagorean_theorem_find_c(self):
        """피타고라스 정리: c 구하기"""
        # 3² + 4² = 5²
        result = self.calculator.pythagorean_theorem(a=3, b=4)
        assert result.result == 5.0

    def test_pythagorean_theorem_find_a(self):
        """피타고라스 정리: a 구하기"""
        # a² + 4² = 5²  →  a = 3
        result = self.calculator.pythagorean_theorem(b=4, c=5)
        assert result.result == 3.0

    def test_pythagorean_theorem_find_b(self):
        """피타고라스 정리: b 구하기"""
        # 3² + b² = 5²  →  b = 4
        result = self.calculator.pythagorean_theorem(a=3, c=5)
        assert result.result == 4.0

    def test_pythagorean_theorem_invalid_raises_error(self):
        """피타고라스 정리: 빗변이 더 작은 경우 에러"""
        with pytest.raises(ValueError):
            self.calculator.pythagorean_theorem(a=5, c=3)

    def test_pythagorean_theorem_missing_values_raises_error(self):
        """피타고라스 정리: 값이 부족한 경우 에러"""
        with pytest.raises(ValueError):
            self.calculator.pythagorean_theorem(a=3)

    def test_triangle_area(self):
        """삼각형 넓이"""
        # 밑변 6, 높이 4  →  넓이 12
        result = self.calculator.triangle_area(6, 4)
        assert result.result == 12.0

    def test_triangle_perimeter(self):
        """삼각형 둘레"""
        result = self.calculator.triangle_perimeter(3, 4, 5)
        assert result.result == 12.0

    def test_rectangle_area(self):
        """직사각형 넓이"""
        result = self.calculator.rectangle_area(5, 4)
        assert result.result == 20.0

    def test_rectangle_perimeter(self):
        """직사각형 둘레"""
        result = self.calculator.rectangle_perimeter(5, 4)
        assert result.result == 18.0

    def test_circle_area(self):
        """원의 넓이"""
        result = self.calculator.circle_area(3)
        expected = math.pi * 9
        assert abs(result.result - expected) < 0.01

    def test_circle_circumference(self):
        """원의 둘레"""
        result = self.calculator.circle_circumference(5)
        expected = 2 * math.pi * 5
        assert abs(result.result - expected) < 0.01

    def test_trapezoid_area(self):
        """사다리꼴 넓이"""
        # (윗변 3 + 아랫변 7) × 높이 4 / 2 = 20
        result = self.calculator.trapezoid_area(3, 7, 4)
        assert result.result == 20.0

    def test_parallelogram_area(self):
        """평행사변형 넓이"""
        result = self.calculator.parallelogram_area(6, 4)
        assert result.result == 24.0

    def test_isosceles_right_triangle(self):
        """직각이등변삼각형"""
        # a = b  →  c = a√2
        result = self.calculator.pythagorean_theorem(a=5, b=5)
        expected = 5 * math.sqrt(2)
        assert abs(result.result - expected) < 0.01

    def test_unit_circle(self):
        """단위원"""
        result = self.calculator.circle_area(1)
        assert abs(result.result - math.pi) < 0.01

    def test_square_area_via_rectangle(self):
        """정사각형 넓이 (직사각형으로)"""
        result = self.calculator.rectangle_area(5, 5)
        assert result.result == 25.0

    def test_equilateral_triangle_perimeter(self):
        """정삼각형 둘레"""
        result = self.calculator.triangle_perimeter(5, 5, 5)
        assert result.result == 15.0

    def test_zero_dimensions_give_zero_area(self):
        """0 차원은 0 넓이"""
        result = self.calculator.rectangle_area(0, 5)
        assert result.result == 0.0

    def test_large_circle(self):
        """큰 원"""
        result = self.calculator.circle_area(100)
        expected = math.pi * 10000
        assert abs(result.result - expected) < 1.0

    def test_pythagorean_with_decimals(self):
        """피타고라스: 소수점"""
        result = self.calculator.pythagorean_theorem(a=1.5, b=2.0)
        expected = math.sqrt(1.5**2 + 2.0**2)
        assert abs(result.result - expected) < 0.01

    def test_trapezoid_same_bases_is_rectangle(self):
        """사다리꼴 (윗변 = 아랫변) = 직사각형"""
        trap_result = self.calculator.trapezoid_area(5, 5, 4)
        rect_result = self.calculator.rectangle_area(5, 4)
        assert trap_result.result == rect_result.result
