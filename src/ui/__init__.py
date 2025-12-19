"""
UI 모듈
사이드바 및 페이지 컴포넌트를 제공합니다.
"""
# Optional: Streamlit 의존 모듈 (설치 시에만 사용 가능)
try:
    from .sidebar import Sidebar
    from .pages import (
        PrimeFactorPage,
        LinearEquationPage,
        FunctionGraphPage,
        get_page
    )
    _STREAMLIT_AVAILABLE = True
except ImportError:
    Sidebar = None
    PrimeFactorPage = None
    LinearEquationPage = None
    FunctionGraphPage = None
    get_page = None
    _STREAMLIT_AVAILABLE = False

# 반응형 및 접근성 모듈도 Streamlit 의존적이므로 optional
try:
    from .responsive import ResponsiveLayout, GridLayout
    from .accessibility import AccessibilityHelper
except ImportError:
    ResponsiveLayout = None
    GridLayout = None
    AccessibilityHelper = None

__all__ = [
    'Sidebar',
    'PrimeFactorPage',
    'LinearEquationPage',
    'FunctionGraphPage',
    'get_page',
    'ResponsiveLayout',
    'GridLayout',
    'AccessibilityHelper'
]
