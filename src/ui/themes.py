"""
UI 테마 관리
다크모드 및 커스텀 스타일을 제공합니다.
"""
import streamlit as st
from typing import Dict, Any


class ThemeManager:
    """테마 관리 클래스"""

    # 라이트 모드 색상
    LIGHT_THEME = {
        "primary": "#1f77b4",
        "secondary": "#ff7f0e",
        "success": "#2ca02c",
        "warning": "#ff9800",
        "error": "#d62728",
        "info": "#17a2b8",
        "background": "#ffffff",
        "surface": "#f8f9fa",
        "text_primary": "#212529",
        "text_secondary": "#6c757d",
        "border": "#dee2e6"
    }

    # 다크 모드 색상
    DARK_THEME = {
        "primary": "#3a9ad9",
        "secondary": "#ffb74d",
        "success": "#66bb6a",
        "warning": "#ffa726",
        "error": "#ef5350",
        "info": "#29b6f6",
        "background": "#1e1e1e",
        "surface": "#2d2d2d",
        "text_primary": "#e0e0e0",
        "text_secondary": "#b0b0b0",
        "border": "#404040"
    }

    @staticmethod
    def apply_theme(theme: str = "light"):
        """
        테마 적용

        Args:
            theme: 'light' 또는 'dark'
        """
        if theme == "dark":
            colors = ThemeManager.DARK_THEME
        else:
            colors = ThemeManager.LIGHT_THEME

        # Custom CSS
        custom_css = f"""
        <style>
            /* 전체 배경 */
            .stApp {{
                background-color: {colors['background']};
                color: {colors['text_primary']};
            }}

            /* 사이드바 */
            .css-1d391kg {{
                background-color: {colors['surface']};
            }}

            /* 카드 스타일 */
            .css-1kyxreq {{
                background-color: {colors['surface']};
                border: 1px solid {colors['border']};
                border-radius: 8px;
                padding: 1rem;
                margin-bottom: 1rem;
            }}

            /* 버튼 스타일 */
            .stButton > button {{
                background-color: {colors['primary']};
                color: white;
                border: none;
                border-radius: 4px;
                padding: 0.5rem 1rem;
                font-weight: 500;
                transition: all 0.3s ease;
            }}

            .stButton > button:hover {{
                opacity: 0.9;
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            }}

            /* 입력 필드 */
            .stTextInput > div > div > input,
            .stNumberInput > div > div > input,
            .stTextArea > div > div > textarea {{
                background-color: {colors['surface']};
                color: {colors['text_primary']};
                border: 1px solid {colors['border']};
                border-radius: 4px;
            }}

            /* 탭 스타일 */
            .stTabs [data-baseweb="tab-list"] {{
                gap: 8px;
            }}

            .stTabs [data-baseweb="tab"] {{
                background-color: {colors['surface']};
                border-radius: 4px;
                padding: 0.5rem 1rem;
                color: {colors['text_primary']};
            }}

            .stTabs [aria-selected="true"] {{
                background-color: {colors['primary']};
                color: white;
            }}

            /* Expander */
            .streamlit-expanderHeader {{
                background-color: {colors['surface']};
                border: 1px solid {colors['border']};
                border-radius: 4px;
                color: {colors['text_primary']};
            }}

            /* 메트릭 카드 */
            .stMetric {{
                background-color: {colors['surface']};
                padding: 1rem;
                border-radius: 8px;
                border: 1px solid {colors['border']};
            }}

            /* 성공 메시지 */
            .stSuccess {{
                background-color: {colors['success']}22;
                border-left: 4px solid {colors['success']};
                padding: 1rem;
                border-radius: 4px;
            }}

            /* 경고 메시지 */
            .stWarning {{
                background-color: {colors['warning']}22;
                border-left: 4px solid {colors['warning']};
                padding: 1rem;
                border-radius: 4px;
            }}

            /* 에러 메시지 */
            .stError {{
                background-color: {colors['error']}22;
                border-left: 4px solid {colors['error']};
                padding: 1rem;
                border-radius: 4px;
            }}

            /* 정보 메시지 */
            .stInfo {{
                background-color: {colors['info']}22;
                border-left: 4px solid {colors['info']};
                padding: 1rem;
                border-radius: 4px;
            }}

            /* 테이블 스타일 */
            .dataframe {{
                background-color: {colors['surface']};
                color: {colors['text_primary']};
            }}

            /* 헤더 스타일 */
            h1, h2, h3, h4, h5, h6 {{
                color: {colors['text_primary']};
            }}

            /* 코드 블록 */
            code {{
                background-color: {colors['surface']};
                color: {colors['text_primary']};
                padding: 2px 6px;
                border-radius: 3px;
            }}

            /* Spinner */
            .stSpinner > div {{
                border-top-color: {colors['primary']};
            }}

            /* Progress bar */
            .stProgress > div > div > div {{
                background-color: {colors['primary']};
            }}
        </style>
        """

        st.markdown(custom_css, unsafe_allow_html=True)

    @staticmethod
    def get_theme_toggle():
        """테마 토글 위젯"""
        if 'theme' not in st.session_state:
            st.session_state.theme = 'light'

        col1, col2, col3 = st.columns([6, 1, 1])

        with col2:
            if st.button("☀️" if st.session_state.theme == "dark" else "🌙"):
                st.session_state.theme = 'light' if st.session_state.theme == 'dark' else 'dark'
                st.rerun()

        ThemeManager.apply_theme(st.session_state.theme)

    @staticmethod
    def create_card(content: str, color: str = "surface"):
        """
        카드 형태의 컨테이너 생성

        Args:
            content: 내용
            color: 배경색 키
        """
        theme = ThemeManager.DARK_THEME if st.session_state.get('theme', 'light') == 'dark' else ThemeManager.LIGHT_THEME
        bg_color = theme.get(color, theme['surface'])

        st.markdown(
            f"""
            <div style="
                background-color: {bg_color};
                padding: 1rem;
                border-radius: 8px;
                border: 1px solid {theme['border']};
                margin-bottom: 1rem;
            ">
                {content}
            </div>
            """,
            unsafe_allow_html=True
        )

    @staticmethod
    def create_badge(text: str, color: str = "primary"):
        """
        배지 생성

        Args:
            text: 배지 텍스트
            color: 배지 색상 키
        """
        theme = ThemeManager.DARK_THEME if st.session_state.get('theme', 'light') == 'dark' else ThemeManager.LIGHT_THEME
        badge_color = theme.get(color, theme['primary'])

        return f"""
        <span style="
            background-color: {badge_color};
            color: white;
            padding: 0.25rem 0.75rem;
            border-radius: 12px;
            font-size: 0.875rem;
            font-weight: 500;
            display: inline-block;
            margin: 0.25rem;
        ">
            {text}
        </span>
        """

    @staticmethod
    def create_progress_bar(value: float, max_value: float = 100, color: str = "primary"):
        """
        프로그레스 바 생성

        Args:
            value: 현재 값
            max_value: 최대 값
            color: 바 색상 키
        """
        theme = ThemeManager.DARK_THEME if st.session_state.get('theme', 'light') == 'dark' else ThemeManager.LIGHT_THEME
        bar_color = theme.get(color, theme['primary'])
        percentage = (value / max_value) * 100 if max_value > 0 else 0

        return f"""
        <div style="
            width: 100%;
            background-color: {theme['surface']};
            border-radius: 8px;
            overflow: hidden;
            height: 24px;
            border: 1px solid {theme['border']};
        ">
            <div style="
                width: {percentage}%;
                background-color: {bar_color};
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: 500;
                font-size: 0.875rem;
                transition: width 0.3s ease;
            ">
                {percentage:.1f}%
            </div>
        </div>
        """
