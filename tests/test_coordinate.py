"""
좌표평면 계산 테스트
"""
import pytest
import math
from src.calculators.coordinate import CoordinateCalculator


class TestCoordinateCalculator:
    """좌표평면 계산기 테스트 클래스"""

    def setup_method(self):
        """각 테스트 전에 실행"""
        self.calculator = CoordinateCalculator()

    def test_distance_simple(self):
        """거리 계산: 간단한 경우"""
        # (0,0)과 (3,4) 사이 거리 = 5
        result = self.calculator.distance(0, 0, 3, 4)
        assert result.result == 5.0

    def test_distance_same_point(self):
        """거리 계산: 같은 점"""
        result = self.calculator.distance(2, 3, 2, 3)
        assert result.result == 0.0

    def test_distance_horizontal(self):
        """거리 계산: 수평선"""
        result = self.calculator.distance(1, 2, 5, 2)
        assert result.result == 4.0

    def test_distance_vertical(self):
        """거리 계산: 수직선"""
        result = self.calculator.distance(3, 1, 3, 7)
        assert result.result == 6.0

    def test_distance_negative_coordinates(self):
        """거리 계산: 음수 좌표"""
        result = self.calculator.distance(-1, -1, 2, 3)
        expected = math.sqrt(9 + 16)
        assert result.result == expected

    def test_midpoint_simple(self):
        """중점 계산: 간단한 경우"""
        result = self.calculator.midpoint(0, 0, 4, 6)
        assert result.result == (2.0, 3.0)

    def test_midpoint_same_point(self):
        """중점 계산: 같은 점"""
        result = self.calculator.midpoint(5, 7, 5, 7)
        assert result.result == (5.0, 7.0)

    def test_midpoint_negative(self):
        """중점 계산: 음수 포함"""
        result = self.calculator.midpoint(-2, -4, 2, 4)
        assert result.result == (0.0, 0.0)

    def test_midpoint_decimals(self):
        """중점 계산: 소수점"""
        result = self.calculator.midpoint(1, 2, 4, 5)
        assert result.result == (2.5, 3.5)

    def test_slope_positive(self):
        """기울기 계산: 양수"""
        # (0,0)과 (2,4) → 기울기 2
        result = self.calculator.slope(0, 0, 2, 4)
        assert result.result == 2.0

    def test_slope_negative(self):
        """기울기 계산: 음수"""
        # (0,0)과 (2,-4) → 기울기 -2
        result = self.calculator.slope(0, 0, 2, -4)
        assert result.result == -2.0

    def test_slope_zero(self):
        """기울기 계산: 0 (수평선)"""
        result = self.calculator.slope(1, 3, 5, 3)
        assert result.result == 0.0

    def test_slope_vertical_raises_error(self):
        """기울기 계산: 수직선 (정의 안됨)"""
        with pytest.raises(ValueError):
            self.calculator.slope(3, 1, 3, 5)

    def test_slope_fraction(self):
        """기울기 계산: 분수"""
        # (1,1)과 (3,2) → 기울기 1/2
        result = self.calculator.slope(1, 1, 3, 2)
        assert result.result == 0.5

    def test_line_equation_from_two_points_simple(self):
        """직선 방정식: 간단한 경우"""
        # (0,0)과 (1,2) → y = 2x
        m, b, equation = self.calculator.line_equation_from_two_points(0, 0, 1, 2)
        assert m == 2.0
        assert b == 0.0

    def test_line_equation_from_two_points_with_intercept(self):
        """직선 방정식: y절편 있음"""
        # (0,3)과 (1,5) → y = 2x + 3
        m, b, equation = self.calculator.line_equation_from_two_points(0, 3, 1, 5)
        assert m == 2.0
        assert b == 3.0

    def test_line_equation_from_two_points_vertical(self):
        """직선 방정식: 수직선"""
        # (2,0)과 (2,5) → x = 2
        m, b, equation = self.calculator.line_equation_from_two_points(2, 0, 2, 5)
        assert m is None
        assert b is None
        assert "x = 2" in equation

    def test_point_line_distance_simple(self):
        """점과 직선 거리: 간단한 경우"""
        # 점 (0,0)과 직선 x - y = 0 사이 거리 = 0
        result = self.calculator.point_line_distance(0, 0, 1, -1, 0)
        assert result.result == 0.0

    def test_point_line_distance_non_zero(self):
        """점과 직선 거리: 0이 아닌 경우"""
        # 점 (3,4)와 직선 3x + 4y - 25 = 0 사이 거리
        result = self.calculator.point_line_distance(3, 4, 3, 4, -25)
        expected = abs(9 + 16 - 25) / math.sqrt(9 + 16)
        assert abs(result.result - expected) < 0.01

    def test_point_line_distance_horizontal_line(self):
        """점과 직선 거리: 수평선"""
        # 점 (2,5)와 직선 y = 3 (0x + 1y - 3 = 0)
        result = self.calculator.point_line_distance(2, 5, 0, 1, -3)
        assert result.result == 2.0

    def test_point_line_distance_vertical_line(self):
        """점과 직선 거리: 수직선"""
        # 점 (5,3)과 직선 x = 2 (1x + 0y - 2 = 0)
        result = self.calculator.point_line_distance(5, 3, 1, 0, -2)
        assert result.result == 3.0

    def test_is_collinear_true(self):
        """세 점이 한 직선 위에 있는지: 참"""
        # (0,0), (1,1), (2,2)는 일직선
        result = self.calculator.is_collinear(0, 0, 1, 1, 2, 2)
        assert result is True

    def test_is_collinear_false(self):
        """세 점이 한 직선 위에 있는지: 거짓"""
        # (0,0), (1,1), (2,3)는 일직선 아님
        result = self.calculator.is_collinear(0, 0, 1, 1, 2, 3)
        assert result is False

    def test_is_collinear_triangle(self):
        """세 점이 한 직선 위에 있는지: 삼각형"""
        # 삼각형 꼭짓점은 일직선 아님
        result = self.calculator.is_collinear(0, 0, 3, 0, 0, 4)
        assert result is False

    def test_distance_pythagorean_triple(self):
        """거리 계산: 피타고라스 삼조"""
        # (0,0)과 (5,12) → 거리 13
        result = self.calculator.distance(0, 0, 5, 12)
        assert result.result == 13.0
