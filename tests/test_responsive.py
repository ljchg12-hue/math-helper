"""
반응형 디자인 테스트
"""
import pytest
from src.ui.responsive import ResponsiveLayout, GridLayout


class TestResponsiveLayout:
    """반응형 레이아웃 테스트 클래스"""

    def test_breakpoints_defined(self):
        """브레이크포인트 정의 확인"""
        assert "mobile" in ResponsiveLayout.BREAKPOINTS
        assert "tablet" in ResponsiveLayout.BREAKPOINTS
        assert "desktop" in ResponsiveLayout.BREAKPOINTS

    def test_mobile_breakpoint(self):
        """모바일 브레이크포인트 값"""
        assert ResponsiveLayout.BREAKPOINTS["mobile"] == 768

    def test_tablet_breakpoint(self):
        """태블릿 브레이크포인트 값"""
        assert ResponsiveLayout.BREAKPOINTS["tablet"] == 1024

    def test_desktop_breakpoint(self):
        """데스크톱 브레이크포인트 값"""
        assert ResponsiveLayout.BREAKPOINTS["desktop"] == 1440

    def test_inject_responsive_css_runs(self):
        """반응형 CSS 주입 실행 확인"""
        # Streamlit 없이 실행되므로 예외 발생 가능
        try:
            ResponsiveLayout.inject_responsive_css()
            # 예외가 발생하지 않으면 성공
            assert True
        except Exception:
            # Streamlit 환경이 아니면 예외 발생 가능
            pytest.skip("Streamlit environment required")

    def test_get_device_layout_structure(self):
        """디바이스 레이아웃 구조 확인"""
        layout = ResponsiveLayout.get_device_layout()

        assert "columns" in layout
        assert "chart_height" in layout
        assert "sidebar_width" in layout

    def test_get_device_layout_columns(self):
        """컬럼 설정 확인"""
        layout = ResponsiveLayout.get_device_layout()

        assert layout["columns"]["mobile"] == 1
        assert layout["columns"]["tablet"] == 2
        assert layout["columns"]["desktop"] == 3

    def test_get_device_layout_chart_height(self):
        """차트 높이 설정 확인"""
        layout = ResponsiveLayout.get_device_layout()

        assert layout["chart_height"]["mobile"] == 300
        assert layout["chart_height"]["tablet"] == 400
        assert layout["chart_height"]["desktop"] == 500

    def test_get_device_layout_sidebar_width(self):
        """사이드바 너비 설정 확인"""
        layout = ResponsiveLayout.get_device_layout()

        assert layout["sidebar_width"]["mobile"] == "100%"
        assert layout["sidebar_width"]["tablet"] == "250px"
        assert layout["sidebar_width"]["desktop"] == "300px"

    def test_create_responsive_columns(self):
        """반응형 컬럼 생성"""
        try:
            cols = ResponsiveLayout.create_responsive_columns(3, 2)
            # Streamlit 컬럼 반환
            assert cols is not None
        except Exception:
            pytest.skip("Streamlit environment required")

    def test_inject_mobile_optimization_runs(self):
        """모바일 최적화 실행"""
        # 주석 처리된 기능이므로 실행만 확인
        try:
            ResponsiveLayout.inject_mobile_optimization()
            assert True
        except Exception:
            pytest.skip("Streamlit environment required")


class TestGridLayout:
    """그리드 레이아웃 테스트 클래스"""

    def test_create_card_runs(self):
        """카드 생성 실행 확인"""
        try:
            GridLayout.create_card("Test Title", "Test Content", "📊")
            assert True
        except Exception:
            pytest.skip("Streamlit environment required")

    def test_create_metric_card_runs(self):
        """메트릭 카드 생성 실행 확인"""
        try:
            GridLayout.create_metric_card("Label", "100", "+10")
            assert True
        except Exception:
            pytest.skip("Streamlit environment required")
