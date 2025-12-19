"""
이차함수 그래프 테스트
"""
import pytest
import matplotlib
matplotlib.use('Agg')  # GUI 없이 테스트
import math
from src.calculators.quadratic_function import QuadraticFunctionDrawer


class TestQuadraticFunctionDrawer:
    """이차함수 그래프 테스트 클래스"""

    def setup_method(self):
        """각 테스트 전에 실행"""
        self.drawer = QuadraticFunctionDrawer()

    def test_initialization(self):
        """초기화 테스트"""
        assert self.drawer.x_limit == 10
        assert self.drawer.y_limit == 10

    def test_draw_simple_parabola(self):
        """간단한 포물선 그리기"""
        fig = self.drawer.draw(1, 0, 0, (-5, 5))
        assert fig is not None

    def test_draw_downward_parabola(self):
        """아래로 볼록한 포물선"""
        fig = self.drawer.draw(-1, 0, 0, (-5, 5))
        assert fig is not None

    def test_draw_shifted_parabola(self):
        """평행이동된 포물선"""
        fig = self.drawer.draw(1, -4, 3, (-5, 5))
        assert fig is not None

    def test_get_vertex_standard_parabola(self):
        """꼭짓점: 표준 포물선"""
        # y = x²
        vertex_x, vertex_y = self.drawer.get_vertex(1, 0, 0)
        assert vertex_x == 0
        assert vertex_y == 0

    def test_get_vertex_shifted_parabola(self):
        """꼭짓점: 평행이동"""
        # y = (x-2)² + 3 = x² - 4x + 7
        vertex_x, vertex_y = self.drawer.get_vertex(1, -4, 7)
        assert vertex_x == 2
        assert vertex_y == 3

    def test_get_vertex_negative_coefficient(self):
        """꼭짓점: 음수 계수"""
        # y = -(x-1)² + 4 = -x² + 2x + 3
        vertex_x, vertex_y = self.drawer.get_vertex(-1, 2, 3)
        assert vertex_x == 1
        assert vertex_y == 4

    def test_get_vertex_form_simple(self):
        """표준형 변환: 간단한 경우"""
        # y = x² - 4x + 3 → y = (x-2)² - 1
        a, p, q = self.drawer.get_vertex_form(1, -4, 3)
        assert a == 1
        assert p == 2
        assert q == -1

    def test_get_vertex_form_negative_a(self):
        """표준형 변환: 음수 a"""
        # y = -x² + 6x - 5 → y = -(x-3)² + 4
        a, p, q = self.drawer.get_vertex_form(-1, 6, -5)
        assert a == -1
        assert p == 3
        assert q == 4

    def test_get_x_intercepts_two_roots(self):
        """x절편: 두 개"""
        # y = x² - 5x + 6 → x = 2, 3
        x_ints = self.drawer.get_x_intercepts(1, -5, 6)
        assert x_ints is not None
        assert len(x_ints) == 2
        assert 2 in x_ints
        assert 3 in x_ints

    def test_get_x_intercepts_one_root(self):
        """x절편: 한 개 (중근)"""
        # y = x² - 4x + 4 → x = 2
        x_ints = self.drawer.get_x_intercepts(1, -4, 4)
        assert x_ints is not None
        assert len(x_ints) == 1
        assert x_ints[0] == 2

    def test_get_x_intercepts_no_roots(self):
        """x절편: 없음 (D < 0)"""
        # y = x² + 1
        x_ints = self.drawer.get_x_intercepts(1, 0, 1)
        assert x_ints is None

    def test_get_y_intercept(self):
        """y절편 테스트"""
        assert self.drawer.get_y_intercept(5) == 5
        assert self.drawer.get_y_intercept(-3) == -3
        assert self.drawer.get_y_intercept(0) == 0

    def test_get_axis_of_symmetry(self):
        """대칭축 테스트"""
        # y = x² - 6x + 8 → 대칭축 x = 3
        axis = self.drawer.get_axis_of_symmetry(1, -6)
        assert axis == 3

    def test_get_axis_of_symmetry_negative_a(self):
        """대칭축: 음수 a"""
        # y = -2x² + 8x → 대칭축 x = 2
        axis = self.drawer.get_axis_of_symmetry(-2, 8)
        assert axis == 2

    def test_translate_horizontal(self):
        """평행이동: 수평"""
        # y = x²를 오른쪽으로 3만큼
        new_a, new_b, new_c = self.drawer.translate(1, 0, 0, 3, 0)
        assert new_a == 1
        assert new_b == -6  # -2ah
        assert new_c == 9   # ah²

    def test_translate_vertical(self):
        """평행이동: 수직"""
        # y = x²를 위로 5만큼
        new_a, new_b, new_c = self.drawer.translate(1, 0, 0, 0, 5)
        assert new_a == 1
        assert new_b == 0
        assert new_c == 5

    def test_translate_both_directions(self):
        """평행이동: 수평 + 수직"""
        # y = x²를 (2, 3)만큼 이동
        new_a, new_b, new_c = self.drawer.translate(1, 0, 0, 2, 3)
        assert new_a == 1
        # y = (x-2)² + 3 = x² - 4x + 7
        assert new_b == -4
        assert new_c == 7

    def test_find_max_or_min_minimum(self):
        """최솟값 (a > 0)"""
        # y = x² - 4x + 5 → 최솟값 (2, 1)
        type_str, x, y = self.drawer.find_max_or_min(1, -4, 5)
        assert type_str == "최솟값"
        assert x == 2
        assert y == 1

    def test_find_max_or_min_maximum(self):
        """최댓값 (a < 0)"""
        # y = -x² + 4x - 3 → 최댓값 (2, 1)
        type_str, x, y = self.drawer.find_max_or_min(-1, 4, -3)
        assert type_str == "최댓값"
        assert x == 2
        assert y == 1

    def test_compare_graphs(self):
        """두 함수 비교 그래프"""
        fig = self.drawer.compare_graphs(1, 0, 0, -1, 0, 4, (-5, 5))
        assert fig is not None

    def test_draw_parabola_from_vertex(self):
        """표준형으로 그래프 그리기"""
        # y = 2(x-1)² + 3
        fig = self.drawer.draw_parabola_from_vertex(2, 1, 3, (-5, 5))
        assert fig is not None

    def test_parabola_opens_upward(self):
        """포물선 방향: 위로 볼록"""
        type_str, _, _ = self.drawer.find_max_or_min(2, 0, 0)
        assert type_str == "최솟값"

    def test_parabola_opens_downward(self):
        """포물선 방향: 아래로 볼록"""
        type_str, _, _ = self.drawer.find_max_or_min(-3, 0, 0)
        assert type_str == "최댓값"
