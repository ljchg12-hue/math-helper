"""
함수 그래프 테스트
"""
import pytest
import numpy as np
from matplotlib.figure import Figure
from src.calculators.function_graph import FunctionGraphDrawer


class TestFunctionGraphDrawer:
    """함수 그래프 그리기 테스트 클래스"""

    def setup_method(self):
        """각 테스트 전에 실행"""
        self.drawer = FunctionGraphDrawer(y_limit=10)

    def test_validate_parameters_valid(self):
        """유효한 매개변수 검증 테스트"""
        is_valid, msg = self.drawer.validate_parameters(2, (-5, 5))
        assert is_valid is True
        assert msg == ""

    def test_validate_parameters_invalid_a_type(self):
        """a 값 타입 오류 테스트"""
        is_valid, msg = self.drawer.validate_parameters("invalid", (-5, 5))
        assert is_valid is False
        assert "숫자" in msg

    def test_validate_parameters_invalid_range_length(self):
        """x 범위 길이 오류 테스트"""
        is_valid, msg = self.drawer.validate_parameters(2, (-5,))
        assert is_valid is False
        assert "시작, 끝" in msg

    def test_validate_parameters_invalid_range_order(self):
        """x 범위 순서 오류 테스트"""
        is_valid, msg = self.drawer.validate_parameters(2, (5, -5))
        assert is_valid is False
        assert "작아야" in msg

    def test_draw_proportional_returns_figure(self):
        """정비례 함수 그래프 반환 타입 테스트"""
        fig = self.drawer.draw_proportional(2, (-5, 5))
        assert isinstance(fig, Figure)

    def test_draw_proportional_positive_slope(self):
        """양의 기울기 정비례 함수 테스트"""
        fig = self.drawer.draw_proportional(2, (-5, 5))
        assert fig is not None
        # Figure가 생성되었는지 확인
        assert len(fig.axes) > 0

    def test_draw_proportional_negative_slope(self):
        """음의 기울기 정비례 함수 테스트"""
        fig = self.drawer.draw_proportional(-2, (-5, 5))
        assert fig is not None
        assert len(fig.axes) > 0

    def test_draw_proportional_zero_slope(self):
        """기울기 0인 정비례 함수 테스트 (y = 0)"""
        fig = self.drawer.draw_proportional(0, (-5, 5))
        assert fig is not None
        assert len(fig.axes) > 0

    def test_draw_inverse_proportional_returns_figure(self):
        """반비례 함수 그래프 반환 타입 테스트"""
        fig = self.drawer.draw_inverse_proportional(2, (-5, 5))
        assert isinstance(fig, Figure)

    def test_draw_inverse_proportional_positive_a(self):
        """양수 a인 반비례 함수 테스트"""
        fig = self.drawer.draw_inverse_proportional(2, (-5, 5))
        assert fig is not None
        assert len(fig.axes) > 0

    def test_draw_inverse_proportional_negative_a(self):
        """음수 a인 반비례 함수 테스트"""
        fig = self.drawer.draw_inverse_proportional(-2, (-5, 5))
        assert fig is not None
        assert len(fig.axes) > 0

    def test_draw_inverse_proportional_zero_a_raises(self):
        """a=0인 반비례 함수 예외 테스트"""
        with pytest.raises(ValueError, match="0이면"):
            self.drawer.draw_inverse_proportional(0, (-5, 5))

    def test_draw_inverse_proportional_y_limit(self):
        """반비례 함수 y축 제한 테스트"""
        drawer = FunctionGraphDrawer(y_limit=20)
        fig = drawer.draw_inverse_proportional(2, (-5, 5))
        ax = fig.axes[0]
        ylim = ax.get_ylim()
        assert ylim[0] >= -20
        assert ylim[1] <= 20

    def test_draw_function_proportional(self):
        """draw_function 메서드 - 정비례 테스트"""
        fig = self.drawer.draw_function('proportional', 2, (-5, 5))
        assert isinstance(fig, Figure)

    def test_draw_function_inverse(self):
        """draw_function 메서드 - 반비례 테스트"""
        fig = self.drawer.draw_function('inverse', 2, (-5, 5))
        assert isinstance(fig, Figure)

    def test_draw_function_invalid_type_raises(self):
        """draw_function 메서드 - 유효하지 않은 함수 종류 테스트"""
        with pytest.raises(ValueError, match="지원하지 않는"):
            self.drawer.draw_function('invalid', 2, (-5, 5))

    def test_draw_proportional_with_custom_grid_alpha(self):
        """커스텀 격자 투명도 테스트"""
        fig = self.drawer.draw_proportional(2, (-5, 5), grid_alpha=0.3)
        assert fig is not None
        assert len(fig.axes) > 0

    def test_draw_proportional_raises_on_invalid_parameters(self):
        """유효하지 않은 매개변수로 정비례 함수 그리기 시 예외 발생"""
        with pytest.raises(ValueError):
            self.drawer.draw_proportional("invalid", (-5, 5))

        with pytest.raises(ValueError):
            self.drawer.draw_proportional(2, (5, -5))

    def test_draw_inverse_proportional_raises_on_invalid_parameters(self):
        """유효하지 않은 매개변수로 반비례 함수 그리기 시 예외 발생"""
        with pytest.raises(ValueError):
            self.drawer.draw_inverse_proportional("invalid", (-5, 5))

        with pytest.raises(ValueError):
            self.drawer.draw_inverse_proportional(2, (5, -5))

    def test_y_limit_initialization(self):
        """y_limit 초기화 테스트"""
        drawer = FunctionGraphDrawer(y_limit=15)
        assert drawer.y_limit == 15

    def test_default_y_limit(self):
        """기본 y_limit 테스트"""
        drawer = FunctionGraphDrawer()
        assert drawer.y_limit == 10
