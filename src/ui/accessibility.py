"""
접근성 개선 모듈
ARIA 라벨, 키보드 네비게이션, 스크린 리더 지원
"""
import streamlit as st
from typing import Optional


class AccessibilityHelper:
    """접근성 기능 헬퍼 클래스"""

    @staticmethod
    def inject_aria_support():
        """ARIA 지원 스크립트 및 스타일 주입"""
        aria_script = """
        <script>
        // 키보드 네비게이션 개선
        document.addEventListener('DOMContentLoaded', function() {
            // Skip to main content 링크
            const skipLink = document.createElement('a');
            skipLink.href = '#main-content';
            skipLink.className = 'skip-link';
            skipLink.textContent = '메인 콘텐츠로 건너뛰기';
            skipLink.setAttribute('aria-label', '메인 콘텐츠로 건너뛰기');
            document.body.insertBefore(skipLink, document.body.firstChild);

            // 메인 컨텐츠에 ID 추가
            const mainContent = document.querySelector('.main');
            if (mainContent) {
                mainContent.id = 'main-content';
                mainContent.setAttribute('role', 'main');
                mainContent.setAttribute('aria-label', '메인 콘텐츠 영역');
            }

            // 사이드바 ARIA 추가
            const sidebar = document.querySelector('[data-testid="stSidebar"]');
            if (sidebar) {
                sidebar.setAttribute('role', 'navigation');
                sidebar.setAttribute('aria-label', '메뉴 네비게이션');
            }

            // 버튼에 적절한 ARIA 라벨 추가
            document.querySelectorAll('button').forEach(button => {
                if (!button.getAttribute('aria-label')) {
                    button.setAttribute('aria-label', button.textContent || '버튼');
                }
            });

            // 키보드 포커스 표시 강화
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Tab') {
                    document.body.classList.add('keyboard-navigation');
                }
            });

            document.addEventListener('mousedown', function() {
                document.body.classList.remove('keyboard-navigation');
            });

            // 에러 메시지 aria-live 추가
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1 && node.classList) {
                            if (node.classList.contains('stAlert')) {
                                node.setAttribute('role', 'alert');
                                node.setAttribute('aria-live', 'assertive');
                            }
                        }
                    });
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
        </script>

        <style>
        /* Skip link 스타일 */
        .skip-link {
            position: absolute;
            top: -40px;
            left: 0;
            background: #3a9ad9;
            color: white;
            padding: 8px 16px;
            text-decoration: none;
            z-index: 9999;
            border-radius: 0 0 4px 0;
        }

        .skip-link:focus {
            top: 0;
            outline: 2px solid #fff;
            outline-offset: 2px;
        }

        /* 키보드 네비게이션 포커스 강화 */
        .keyboard-navigation *:focus {
            outline: 3px solid #3a9ad9 !important;
            outline-offset: 3px !important;
            box-shadow: 0 0 0 4px rgba(58, 154, 217, 0.2) !important;
        }

        /* 버튼 포커스 스타일 */
        button:focus-visible {
            outline: 3px solid #3a9ad9 !important;
            outline-offset: 2px !important;
        }

        /* 입력 필드 포커스 */
        input:focus,
        select:focus,
        textarea:focus {
            border-color: #3a9ad9 !important;
            box-shadow: 0 0 0 2px rgba(58, 154, 217, 0.3) !important;
        }

        /* 고대비 모드 지원 */
        @media (prefers-contrast: high) {
            * {
                border-width: 2px !important;
            }

            button {
                border: 2px solid currentColor !important;
            }
        }

        /* 애니메이션 감소 모드 */
        @media (prefers-reduced-motion: reduce) {
            *,
            *::before,
            *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }

        /* 스크린 리더 전용 텍스트 */
        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border-width: 0;
        }

        /* 포커스 가능한 요소 강조 */
        [tabindex]:focus {
            outline: 2px solid #3a9ad9;
            outline-offset: 2px;
        }
        </style>
        """
        st.markdown(aria_script, unsafe_allow_html=True)

    @staticmethod
    def create_accessible_button(
        label: str,
        key: Optional[str] = None,
        aria_label: Optional[str] = None,
        disabled: bool = False
    ):
        """
        접근성이 향상된 버튼 생성

        Args:
            label: 버튼 라벨
            key: Streamlit 키
            aria_label: ARIA 라벨 (지정하지 않으면 label 사용)
            disabled: 비활성화 여부

        Returns:
            버튼 클릭 여부
        """
        aria_text = aria_label or label

        # Streamlit 버튼에 커스텀 스타일 적용
        button_html = f"""
        <div role="button"
             aria-label="{aria_text}"
             tabindex="0"
             class="accessible-button">
            {label}
        </div>
        """

        # 기본 Streamlit 버튼 사용 (ARIA는 스크립트로 추가)
        return st.button(label, key=key, disabled=disabled)

    @staticmethod
    def create_accessible_heading(text: str, level: int = 1, sr_text: Optional[str] = None):
        """
        접근성이 향상된 제목 생성

        Args:
            text: 제목 텍스트
            level: 제목 레벨 (1-6)
            sr_text: 스크린 리더 전용 추가 텍스트
        """
        level = max(1, min(6, level))  # 1-6 범위로 제한

        sr_html = f'<span class="sr-only">{sr_text}</span>' if sr_text else ''
        heading_html = f"<h{level} role='heading' aria-level='{level}'>{text}{sr_html}</h{level}>"

        st.markdown(heading_html, unsafe_allow_html=True)

    @staticmethod
    def announce_to_screen_reader(message: str, priority: str = "polite"):
        """
        스크린 리더에 메시지 알림

        Args:
            message: 알림 메시지
            priority: 우선순위 ('polite' 또는 'assertive')
        """
        aria_live = "assertive" if priority == "assertive" else "polite"

        announce_html = f"""
        <div aria-live="{aria_live}"
             aria-atomic="true"
             class="sr-only">
            {message}
        </div>
        """
        st.markdown(announce_html, unsafe_allow_html=True)

    @staticmethod
    def create_landmark_region(content_func, region_type: str = "region", label: Optional[str] = None):
        """
        ARIA 랜드마크 영역 생성

        Args:
            content_func: 콘텐츠를 생성하는 함수
            region_type: 영역 타입 (main, navigation, complementary, region 등)
            label: 영역 라벨
        """
        aria_label = f'aria-label="{label}"' if label else ''

        st.markdown(f'<div role="{region_type}" {aria_label}>', unsafe_allow_html=True)
        content_func()
        st.markdown('</div>', unsafe_allow_html=True)

    @staticmethod
    def create_accessible_link(url: str, text: str, new_tab: bool = False):
        """
        접근성이 향상된 링크 생성

        Args:
            url: 링크 URL
            text: 링크 텍스트
            new_tab: 새 탭에서 열기
        """
        target = 'target="_blank" rel="noopener noreferrer"' if new_tab else ''
        sr_text = ' (새 탭에서 열림)' if new_tab else ''

        link_html = f"""
        <a href="{url}"
           {target}
           aria-label="{text}{sr_text}">
            {text}
        </a>
        """
        st.markdown(link_html, unsafe_allow_html=True)

    @staticmethod
    def create_form_with_labels(form_key: str):
        """
        접근성이 향상된 폼 컨텍스트

        Args:
            form_key: 폼 키

        Returns:
            Streamlit form 객체
        """
        form = st.form(key=form_key)

        # 폼에 ARIA 속성 추가 스크립트
        form_script = f"""
        <script>
        setTimeout(function() {{
            const form = document.querySelector('[data-testid="stForm"]');
            if (form) {{
                form.setAttribute('role', 'form');
                form.setAttribute('aria-label', '{form_key} 폼');

                // 모든 입력 필드에 라벨 연결
                form.querySelectorAll('input, select, textarea').forEach(function(input) {{
                    const label = input.previousElementSibling;
                    if (label && label.tagName === 'LABEL') {{
                        const id = 'input-' + Math.random().toString(36).substr(2, 9);
                        input.id = id;
                        label.setAttribute('for', id);
                    }}
                }});
            }}
        }}, 100);
        </script>
        """
        st.markdown(form_script, unsafe_allow_html=True)

        return form

    @staticmethod
    def inject_keyboard_shortcuts_help():
        """키보드 단축키 도움말 표시"""
        shortcuts_html = """
        <div role="complementary" aria-label="키보드 단축키" class="keyboard-shortcuts-help">
            <details>
                <summary>⌨️ 키보드 단축키</summary>
                <ul>
                    <li><kbd>Tab</kbd> - 다음 요소로 이동</li>
                    <li><kbd>Shift</kbd> + <kbd>Tab</kbd> - 이전 요소로 이동</li>
                    <li><kbd>Enter</kbd> - 버튼/링크 활성화</li>
                    <li><kbd>Space</kbd> - 체크박스 토글</li>
                    <li><kbd>Esc</kbd> - 다이얼로그 닫기</li>
                    <li><kbd>?</kbd> - 이 도움말 표시</li>
                </ul>
            </details>
        </div>
        <style>
        .keyboard-shortcuts-help {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--background-color);
            border: 1px solid var(--secondary-background-color);
            border-radius: 8px;
            padding: 10px;
            max-width: 300px;
            z-index: 1000;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .keyboard-shortcuts-help summary {
            cursor: pointer;
            font-weight: bold;
            user-select: none;
        }
        .keyboard-shortcuts-help ul {
            margin: 10px 0 0 0;
            padding-left: 20px;
        }
        .keyboard-shortcuts-help kbd {
            background: var(--secondary-background-color);
            border: 1px solid var(--text-color);
            border-radius: 3px;
            padding: 2px 6px;
            font-family: monospace;
            font-size: 0.9em;
        }
        @media (max-width: 768px) {
            .keyboard-shortcuts-help {
                bottom: 10px;
                right: 10px;
                max-width: 250px;
                font-size: 0.9em;
            }
        }
        </style>
        """
        st.markdown(shortcuts_html, unsafe_allow_html=True)
