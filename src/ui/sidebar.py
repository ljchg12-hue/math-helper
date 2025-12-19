"""
사이드바 UI 모듈
학습 메뉴 선택 및 앱 정보를 표시합니다.
"""
import streamlit as st
from typing import List
from ..utils.logger import get_logger

logger = get_logger()


class Sidebar:
    """사이드바 클래스"""

    def __init__(self, menu_items: List[str]):
        """
        초기화

        Args:
            menu_items: 메뉴 항목 리스트
        """
        self.menu_items = menu_items
        logger.debug(f"사이드바 초기화: {len(menu_items)}개 메뉴")

    def render(self) -> str:
        """
        사이드바 렌더링

        Returns:
            선택된 메뉴 항목
        """
        # 메뉴 선택 (구분선 제외)
        menu_without_separator = [item for item in self.menu_items if item != "---"]
        selected_menu = st.sidebar.selectbox(
            "학습 메뉴 선택",
            menu_without_separator
        )
        logger.debug(f"메뉴 선택: {selected_menu}")

        # 구분선
        st.sidebar.markdown("---")

        # 앱 정보
        self._render_info()

        # 도움말
        self._render_help()

        return selected_menu

    def _render_info(self):
        """앱 정보 렌더링"""
        st.sidebar.markdown("### ℹ️ 앱 정보")
        st.sidebar.markdown("""
        **중학교 1학년 수학 학습 도우미**

        - 📐 소인수분해 계산
        - 📝 일차방정식 풀이
        - 📊 함수 그래프 그리기

        학습에 도움이 되길 바랍니다! 😊
        """)

    def _render_help(self):
        """도움말 렌더링"""
        with st.sidebar.expander("💡 사용 팁"):
            st.markdown("""
            **소인수분해**
            - 2 이상의 자연수를 입력하세요
            - 100만 이하의 숫자를 권장합니다

            **일차방정식**
            - ax + b = c 형태입니다
            - 소수도 입력 가능합니다
            - 풀이 과정을 확인할 수 있습니다

            **함수 그래프**
            - 정비례: y = ax
            - 반비례: y = a/x
            - x축 범위를 조절할 수 있습니다
            """)
