"""
일차함수 그래프 테스트
"""
import pytest
import matplotlib
matplotlib.use('Agg')  # GUI 없이 테스트
from src.calculators.linear_function import LinearFunctionDrawer


class TestLinearFunctionDrawer:
    """일차함수 그래프 테스트 클래스"""

    def setup_method(self):
        """각 테스트 전에 실행"""
        self.drawer = LinearFunctionDrawer()

    def test_initialization(self):
        """초기화 테스트"""
        assert self.drawer.x_limit == 10
        assert self.drawer.y_limit == 10

    def test_draw_simple_linear_function(self):
        """간단한 일차함수 그래프 테스트"""
        fig = self.drawer.draw(1, 0, (-5, 5))
        assert fig is not None

    def test_draw_with_slope_and_intercept(self):
        """기울기와 y절편이 있는 함수"""
        fig = self.drawer.draw(2, 3, (-10, 10))
        assert fig is not None

    def test_draw_negative_slope(self):
        """음의 기울기"""
        fig = self.drawer.draw(-1, 5, (-5, 5))
        assert fig is not None

    def test_draw_horizontal_line(self):
        """수평선 (기울기 0)"""
        fig = self.drawer.draw(0, 3, (-5, 5))
        assert fig is not None

    def test_find_x_intercept_positive_slope(self):
        """x절편 구하기: 양의 기울기"""
        # y = 2x - 4
        x_int = self.drawer.find_x_intercept(2, -4)
        assert x_int == 2.0

    def test_find_x_intercept_negative_slope(self):
        """x절편 구하기: 음의 기울기"""
        # y = -3x + 6
        x_int = self.drawer.find_x_intercept(-3, 6)
        assert x_int == 2.0

    def test_find_x_intercept_horizontal_line(self):
        """x절편 구하기: 수평선 (없음)"""
        # y = 5
        x_int = self.drawer.find_x_intercept(0, 5)
        assert x_int is None

    def test_find_y_intercept(self):
        """y절편 구하기"""
        assert self.drawer.find_y_intercept(3) == 3
        assert self.drawer.find_y_intercept(-2) == -2
        assert self.drawer.find_y_intercept(0) == 0

    def test_parallel_line_through_origin(self):
        """원점을 지나는 평행선"""
        # y = 2x와 평행하고 (0, 0)을 지나는 직선
        b = self.drawer.parallel_line(2, (0, 0))
        assert b == 0

    def test_parallel_line_through_point(self):
        """특정 점을 지나는 평행선"""
        # y = 3x와 평행하고 (1, 5)를 지나는 직선
        b = self.drawer.parallel_line(3, (1, 5))
        assert b == 2  # y = 3x + 2

    def test_parallel_line_negative_slope(self):
        """음의 기울기를 가진 평행선"""
        # y = -2x와 평행하고 (2, 1)을 지나는 직선
        b = self.drawer.parallel_line(-2, (2, 1))
        assert b == 5  # y = -2x + 5

    def test_perpendicular_line_positive_slope(self):
        """수직선: 양의 기울기"""
        # y = 2x에 수직이고 (0, 0)을 지나는 직선
        new_a, new_b = self.drawer.perpendicular_line(2, (0, 0))
        assert new_a == -0.5
        assert new_b == 0

    def test_perpendicular_line_negative_slope(self):
        """수직선: 음의 기울기"""
        # y = -3x에 수직이고 (0, 0)을 지나는 직선
        new_a, new_b = self.drawer.perpendicular_line(-3, (0, 0))
        assert abs(new_a - (1/3)) < 0.0001
        assert new_b == 0

    def test_perpendicular_line_through_point(self):
        """특정 점을 지나는 수직선"""
        # y = 4x에 수직이고 (2, 3)을 지나는 직선
        new_a, new_b = self.drawer.perpendicular_line(4, (2, 3))
        assert new_a == -0.25
        assert new_b == 3.5  # y = -0.25x + 3.5

    def test_perpendicular_line_to_horizontal_raises_error(self):
        """수평선에 수직인 직선 (오류 발생)"""
        with pytest.raises(ValueError):
            self.drawer.perpendicular_line(0, (1, 1))

    def test_slope_product_for_perpendicular_lines(self):
        """수직선의 기울기 곱 = -1"""
        original_slope = 2
        new_a, _ = self.drawer.perpendicular_line(original_slope, (0, 0))
        assert abs(original_slope * new_a - (-1)) < 0.0001
