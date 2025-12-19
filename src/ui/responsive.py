"""
반응형 디자인 CSS 모듈
모바일, 태블릿, 데스크톱 레이아웃 지원
"""
import streamlit as st
from typing import Dict


class ResponsiveLayout:
    """반응형 레이아웃 관리 클래스"""

    # 브레이크포인트 정의
    BREAKPOINTS = {
        "mobile": 768,
        "tablet": 1024,
        "desktop": 1440
    }

    @staticmethod
    def inject_responsive_css():
        """반응형 CSS 주입"""
        responsive_css = """
        <style>
        /* 기본 컨테이너 스타일 */
        .main .block-container {
            padding-top: 2rem;
            padding-bottom: 2rem;
            max-width: 100%;
        }

        /* 모바일 (<768px) */
        @media (max-width: 768px) {
            .main .block-container {
                padding-left: 1rem;
                padding-right: 1rem;
                padding-top: 1rem;
            }

            /* 사이드바 숨김 (햄버거 메뉴로 토글) */
            section[data-testid="stSidebar"] {
                width: 100%;
            }

            /* 입력 필드 전체 너비 */
            .stNumberInput,
            .stTextInput,
            .stSelectbox {
                width: 100% !important;
            }

            /* 버튼 전체 너비 */
            .stButton > button {
                width: 100% !important;
                margin-bottom: 0.5rem;
            }

            /* 컬럼 레이아웃 세로 정렬 */
            .row-widget.stHorizontal {
                flex-direction: column !important;
            }

            .row-widget.stHorizontal > div {
                width: 100% !important;
            }

            /* 차트 크기 조정 */
            .stPlotlyChart {
                width: 100% !important;
                height: 300px !important;
            }

            /* 폰트 크기 조정 */
            h1 { font-size: 1.5rem !important; }
            h2 { font-size: 1.3rem !important; }
            h3 { font-size: 1.1rem !important; }
            p, div { font-size: 0.9rem !important; }
        }

        /* 태블릿 (768px ~ 1024px) */
        @media (min-width: 768px) and (max-width: 1024px) {
            .main .block-container {
                padding-left: 2rem;
                padding-right: 2rem;
                max-width: 95%;
            }

            /* 사이드바 너비 조정 */
            section[data-testid="stSidebar"] {
                width: 250px;
            }

            /* 차트 크기 */
            .stPlotlyChart {
                height: 400px !important;
            }

            /* 2컬럼 레이아웃 */
            .row-widget.stHorizontal > div {
                width: 48% !important;
            }

            /* 폰트 크기 */
            h1 { font-size: 1.8rem !important; }
            h2 { font-size: 1.5rem !important; }
            h3 { font-size: 1.2rem !important; }
        }

        /* 데스크톱 (>1024px) */
        @media (min-width: 1024px) {
            .main .block-container {
                padding-left: 3rem;
                padding-right: 3rem;
                max-width: 1200px;
                margin: 0 auto;
            }

            /* 사이드바 고정 너비 */
            section[data-testid="stSidebar"] {
                width: 300px;
            }

            /* 차트 크기 */
            .stPlotlyChart {
                height: 500px !important;
            }

            /* 3컬럼 레이아웃 지원 */
            .desktop-3col {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 1rem;
            }
        }

        /* 공통 스타일 개선 */

        /* 카드 스타일 */
        .info-card {
            background-color: var(--background-color);
            border: 1px solid var(--secondary-background-color);
            border-radius: 8px;
            padding: 1.5rem;
            margin: 1rem 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        /* 메트릭 카드 */
        .css-1xarl3l {
            background-color: var(--background-color);
            border: 1px solid var(--secondary-background-color);
            border-radius: 8px;
            padding: 1rem;
        }

        /* 데이터프레임 반응형 */
        .dataframe {
            width: 100% !important;
            overflow-x: auto;
        }

        /* 탭 스타일 개선 */
        .stTabs [data-baseweb="tab-list"] {
            gap: 0.5rem;
            overflow-x: auto;
            flex-wrap: nowrap;
        }

        .stTabs [data-baseweb="tab"] {
            white-space: nowrap;
            padding: 0.5rem 1rem;
        }

        /* 터치 친화적 버튼 크기 */
        @media (hover: none) and (pointer: coarse) {
            .stButton > button {
                min-height: 44px !important;
                font-size: 1rem !important;
            }

            .stSelectbox, .stNumberInput {
                min-height: 44px !important;
            }
        }

        /* 인쇄 최적화 */
        @media print {
            section[data-testid="stSidebar"] {
                display: none !important;
            }

            .main .block-container {
                max-width: 100% !important;
                padding: 0 !important;
            }

            .stButton {
                display: none !important;
            }
        }

        /* 다크모드 개선 */
        @media (prefers-color-scheme: dark) {
            .info-card {
                background-color: #2d2d2d;
                border-color: #404040;
            }
        }

        /* 접근성 개선 - 포커스 표시 */
        button:focus,
        input:focus,
        select:focus {
            outline: 2px solid #3a9ad9 !important;
            outline-offset: 2px;
        }

        /* 스크롤바 스타일 */
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }

        ::-webkit-scrollbar-track {
            background: var(--background-color);
        }

        ::-webkit-scrollbar-thumb {
            background: var(--secondary-background-color);
            border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: var(--text-color);
        }
        </style>
        """
        st.markdown(responsive_css, unsafe_allow_html=True)

    @staticmethod
    def get_device_layout() -> Dict[str, any]:
        """
        현재 디바이스 타입 감지 및 레이아웃 설정 반환
        (실제 감지는 JavaScript 필요, 여기서는 기본값 제공)

        Returns:
            레이아웃 설정 딕셔너리
        """
        return {
            "columns": {
                "mobile": 1,
                "tablet": 2,
                "desktop": 3
            },
            "chart_height": {
                "mobile": 300,
                "tablet": 400,
                "desktop": 500
            },
            "sidebar_width": {
                "mobile": "100%",
                "tablet": "250px",
                "desktop": "300px"
            }
        }

    @staticmethod
    def create_responsive_columns(num_desktop: int = 3, num_tablet: int = 2):
        """
        반응형 컬럼 생성 헬퍼

        Args:
            num_desktop: 데스크톱 컬럼 수
            num_tablet: 태블릿 컬럼 수 (모바일은 1)

        Returns:
            Streamlit columns
        """
        # Streamlit의 기본 컬럼 사용 (CSS가 자동 조정)
        return st.columns(num_desktop)

    @staticmethod
    def inject_mobile_optimization():
        """모바일 최적화 메타 태그 및 설정"""
        mobile_meta = """
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
        <meta name="mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="default">
        """
        # Streamlit에서는 직접 head 태그 수정 불가능하므로 주석으로 남김
        # 실제 배포 시 config.toml에서 설정 필요


class GridLayout:
    """그리드 레이아웃 헬퍼 클래스"""

    @staticmethod
    def create_card(title: str, content: str, icon: str = "📊"):
        """
        정보 카드 생성

        Args:
            title: 카드 제목
            content: 카드 내용
            icon: 아이콘
        """
        card_html = f"""
        <div class="info-card">
            <h3>{icon} {title}</h3>
            <div>{content}</div>
        </div>
        """
        st.markdown(card_html, unsafe_allow_html=True)

    @staticmethod
    def create_metric_card(label: str, value: str, delta: str = None):
        """
        메트릭 카드 생성 (st.metric의 반응형 래퍼)

        Args:
            label: 라벨
            value: 값
            delta: 변화량
        """
        st.metric(label=label, value=value, delta=delta)
