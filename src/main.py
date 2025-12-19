"""
Math Helper 메인 애플리케이션
중학교 1학년 수학 학습 도우미 Streamlit 앱
"""
import streamlit as st
from utils.config import get_config
from utils.logger import get_logger
from ui.sidebar import Sidebar
from ui.pages import get_page
from ui.themes import ThemeManager

# 로거 및 설정 초기화
logger = get_logger()
config = get_config()


def main():
    """메인 함수"""
    try:
        # 페이지 설정
        app_config = config.app
        st.set_page_config(
            page_title=app_config.title,
            layout=app_config.layout,
            initial_sidebar_state=app_config.initial_sidebar_state
        )

        logger.info("앱 시작")

        # 테마 토글 버튼
        ThemeManager.get_theme_toggle()

        # 타이틀
        st.title(app_config.title)

        # 메뉴 항목
        menu_items = [
            "소인수분해",
            "정수와 유리수",
            "문자와 식",
            "일차방정식",
            "일차부등식",
            "연립방정식",
            "일차함수",
            "제곱근과 실수",
            "인수분해",
            "이차방정식",
            "이차함수",
            "함수와 그래프",
            "통계",
            "확률",
            "기하",
            "좌표평면",
            "---",  # 구분선
            "📚 연습 문제",
            "❌ 오답 노트",
            "📊 학습 진도",
            "📜 계산 히스토리"
        ]

        # 사이드바 렌더링
        sidebar = Sidebar(menu_items)
        selected_menu = sidebar.render()

        logger.debug(f"선택된 메뉴: {selected_menu}")

        # 선택된 페이지 렌더링
        page = get_page(selected_menu)
        page.render()

    except Exception as e:
        logger.error(f"앱 실행 중 오류 발생: {e}", exc_info=True)
        st.error(f"⚠️ 오류가 발생했습니다: {str(e)}")
        st.error("자세한 내용은 로그를 확인해주세요.")


if __name__ == "__main__":
    main()
