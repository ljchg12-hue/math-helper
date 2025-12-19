"""
학습 지원 기능 페이지 모듈
연습 문제, 오답 노트, 학습 진도, 계산 히스토리 페이지
"""
import streamlit as st
from datetime import datetime
from ..features import (
    PracticeGenerator,
    MistakeNotes,
    ProgressTracker,
    HistoryManager
)
from ..utils.logger import get_logger
from .themes import ThemeManager

logger = get_logger()


class PracticePage:
    """연습 문제 생성기 페이지"""

    def __init__(self):
        """초기화"""
        self.generator = PracticeGenerator()
        logger.info("연습 문제 페이지 초기화")

    def render(self):
        """페이지 렌더링"""
        st.header("📚 연습 문제 생성기")
        st.write("주제와 난이도를 선택하여 연습 문제를 생성하세요.")

        # 주제 선택
        col1, col2, col3 = st.columns(3)

        with col1:
            topic = st.selectbox(
                "주제 선택",
                self.generator.get_available_topics()
            )

        with col2:
            difficulty = st.selectbox(
                "난이도",
                ["easy", "medium", "hard"],
                index=1
            )

        with col3:
            count = st.slider("문제 개수", 1, 10, 5)

        # 문제 생성 버튼
        if st.button("📝 문제 생성하기", type="primary"):
            try:
                problems = self.generator.generate_problems(topic, count, difficulty)

                st.success(f"{len(problems)}개의 문제를 생성했습니다!")

                # 세션 상태에 저장
                st.session_state['current_problems'] = problems
                st.session_state['current_answers'] = [None] * len(problems)
                st.session_state['show_answers'] = [False] * len(problems)

            except Exception as e:
                st.error(f"⚠️ 오류: {str(e)}")
                logger.error(f"문제 생성 실패: {e}")

        # 생성된 문제 표시
        if 'current_problems' in st.session_state:
            problems = st.session_state['current_problems']

            st.markdown("---")
            st.subheader("생성된 문제")

            for idx, problem in enumerate(problems, 1):
                with st.container():
                    # 문제 카드
                    badge_color = {
                        "easy": "success",
                        "medium": "warning",
                        "hard": "error"
                    }.get(problem.difficulty, "primary")

                    st.markdown(
                        ThemeManager.create_badge(f"문제 {idx}", "primary") +
                        ThemeManager.create_badge(problem.difficulty.upper(), badge_color),
                        unsafe_allow_html=True
                    )

                    st.markdown(f"**{problem.question}**")

                    # 힌트 표시
                    if problem.hints:
                        with st.expander("💡 힌트 보기"):
                            for hint_idx, hint in enumerate(problem.hints, 1):
                                st.write(f"{hint_idx}. {hint}")

                    # 정답 토글
                    col1, col2 = st.columns([1, 4])
                    with col1:
                        if st.button(
                            "정답 보기" if not st.session_state['show_answers'][idx-1] else "정답 숨기기",
                            key=f"toggle_{idx}"
                        ):
                            st.session_state['show_answers'][idx-1] = not st.session_state['show_answers'][idx-1]
                            st.rerun()

                    # 정답 및 풀이
                    if st.session_state['show_answers'][idx-1]:
                        st.success(f"**정답:** {problem.answer}")

                        if problem.solution_steps:
                            with st.expander("📝 풀이 과정"):
                                for step_idx, step in enumerate(problem.solution_steps, 1):
                                    st.write(f"{step_idx}. {step}")

                    st.markdown("---")


class MistakeNotesPage:
    """오답 노트 페이지"""

    def __init__(self):
        """초기화"""
        self.notes = MistakeNotes()
        logger.info("오답 노트 페이지 초기화")

    def render(self):
        """페이지 렌더링"""
        st.header("❌ 오답 노트")
        st.write("틀린 문제를 기록하고 복습하세요.")

        # 탭 생성
        tab1, tab2, tab3 = st.tabs(["📝 새 오답 추가", "📖 오답 목록", "📊 통계"])

        with tab1:
            self._render_add_mistake()

        with tab2:
            self._render_mistake_list()

        with tab3:
            self._render_statistics()

    def _render_add_mistake(self):
        """오답 추가 탭"""
        st.subheader("새 오답 기록")

        topic = st.selectbox(
            "주제",
            ["일차방정식", "이차방정식", "통계", "확률", "기하", "좌표평면", "기타"]
        )

        question = st.text_area("문제", placeholder="문제를 입력하세요...")

        col1, col2 = st.columns(2)
        with col1:
            user_answer = st.text_input("내가 작성한 답", placeholder="예: x = 2")
        with col2:
            correct_answer = st.text_input("정답", placeholder="예: x = 3")

        notes_text = st.text_area("메모 (선택)", placeholder="왜 틀렸는지, 주의할 점 등...")

        if st.button("💾 오답 저장", type="primary"):
            if question and user_answer and correct_answer:
                mistake_id = self.notes.add_mistake(
                    topic=topic,
                    question=question,
                    user_answer=user_answer,
                    correct_answer=correct_answer,
                    notes=notes_text
                )
                st.success(f"✅ 오답이 저장되었습니다! (ID: {mistake_id[:8]})")
                logger.info(f"오답 추가: {mistake_id}")
            else:
                st.warning("⚠️ 필수 항목을 모두 입력해주세요.")

    def _render_mistake_list(self):
        """오답 목록 탭"""
        st.subheader("오답 목록")

        # 필터
        col1, col2 = st.columns(2)
        with col1:
            filter_topic = st.selectbox(
                "주제 필터",
                ["전체"] + ["일차방정식", "이차방정식", "통계", "확률", "기하", "좌표평면", "기타"]
            )
        with col2:
            show_mastered = st.checkbox("마스터한 문제도 표시", value=False)

        # 목록 가져오기
        if filter_topic == "전체":
            mistakes = self.notes.get_unmastered_mistakes() if not show_mastered else self.notes.mistakes
        else:
            mistakes = self.notes.get_mistakes_by_topic(filter_topic)
            if not show_mastered:
                mistakes = [m for m in mistakes if not m.mastered]

        if not mistakes:
            st.info("📭 오답이 없습니다.")
            return

        # 목록 표시
        for mistake in mistakes:
            with st.container():
                # 헤더
                col1, col2, col3 = st.columns([3, 1, 1])
                with col1:
                    status_badge = ThemeManager.create_badge("✓ 마스터", "success") if mistake.mastered else ThemeManager.create_badge("복습 필요", "warning")
                    st.markdown(
                        ThemeManager.create_badge(mistake.topic, "primary") + status_badge,
                        unsafe_allow_html=True
                    )
                with col2:
                    st.caption(f"시도: {mistake.attempts}회")
                with col3:
                    st.caption(mistake.timestamp[:10])

                # 문제 및 답변
                st.markdown(f"**문제:** {mistake.question}")

                col1, col2 = st.columns(2)
                with col1:
                    st.markdown(f"❌ **내 답:** {mistake.user_answer}")
                with col2:
                    st.markdown(f"✅ **정답:** {mistake.correct_answer}")

                if mistake.notes:
                    with st.expander("📝 메모"):
                        st.write(mistake.notes)

                # 액션 버튼
                col1, col2, col3 = st.columns(3)
                with col1:
                    if st.button("✅ 마스터 표시" if not mistake.mastered else "↩️ 마스터 취소", key=f"master_{mistake.id}"):
                        self.notes.mark_as_mastered(mistake.id)
                        st.rerun()
                with col2:
                    if st.button("🔄 재시도 +1", key=f"retry_{mistake.id}"):
                        self.notes.increment_attempts(mistake.id)
                        st.rerun()
                with col3:
                    if st.button("🗑️ 삭제", key=f"delete_{mistake.id}"):
                        self.notes.delete_mistake(mistake.id)
                        st.rerun()

                st.markdown("---")

    def _render_statistics(self):
        """통계 탭"""
        st.subheader("오답 노트 통계")

        stats = self.notes.get_statistics()

        # 메트릭 표시
        col1, col2, col3, col4 = st.columns(4)
        with col1:
            st.metric("전체 오답", stats['total_mistakes'])
        with col2:
            st.metric("마스터 완료", stats['mastered_count'])
        with col3:
            st.metric("복습 필요", stats['unmastered_count'])
        with col4:
            st.metric("마스터율", f"{stats['mastery_rate']:.1f}%")

        # 주제별 통계
        if stats['total_mistakes'] > 0:
            st.markdown("---")
            st.subheader("주제별 오답 수")

            for topic, count in stats['mistakes_by_topic'].items():
                progress = ThemeManager.create_progress_bar(count, stats['total_mistakes'], "error")
                st.markdown(f"**{topic}**: {count}개", unsafe_allow_html=False)
                st.markdown(progress, unsafe_allow_html=True)


class ProgressPage:
    """학습 진도 페이지"""

    def __init__(self):
        """초기화"""
        self.tracker = ProgressTracker()
        logger.info("학습 진도 페이지 초기화")

    def render(self):
        """페이지 렌더링"""
        st.header("📊 학습 진도 대시보드")
        st.write("주제별 학습 진행 상황과 숙달도를 확인하세요.")

        # 탭
        tab1, tab2, tab3 = st.tabs(["📈 전체 통계", "📚 주제별 진도", "⏱️ 학습 세션"])

        with tab1:
            self._render_overall_stats()

        with tab2:
            self._render_topic_progress()

        with tab3:
            self._render_sessions()

    def _render_overall_stats(self):
        """전체 통계 탭"""
        st.subheader("전체 학습 통계")

        stats = self.tracker.get_overall_statistics()

        # 메트릭
        col1, col2, col3, col4 = st.columns(4)
        with col1:
            st.metric("학습한 주제", stats['total_topics'])
        with col2:
            st.metric("풀이한 문제", stats['total_problems_attempted'])
        with col3:
            st.metric("정답률", f"{stats['overall_accuracy']:.1f}%")
        with col4:
            st.metric("총 학습 시간", f"{stats['total_study_time_minutes']}분")

        # 약한 주제
        st.markdown("---")
        st.subheader("📌 복습이 필요한 주제")

        weak_topics = self.tracker.get_weak_topics(threshold=0.6)
        if weak_topics:
            for topic in weak_topics:
                progress = self.tracker.get_topic_progress(topic)
                if progress:
                    st.warning(f"**{topic}** - 정답률: {progress.mastery_level*100:.1f}%")
        else:
            st.success("모든 주제를 잘 이해하고 있습니다! 👍")

    def _render_topic_progress(self):
        """주제별 진도 탭"""
        st.subheader("주제별 학습 진도")

        if not self.tracker.topic_progress:
            st.info("아직 학습 기록이 없습니다. 문제를 풀어보세요!")
            return

        # 주제 목록
        for topic, progress in self.tracker.topic_progress.items():
            with st.container():
                # 헤더
                col1, col2 = st.columns([3, 1])
                with col1:
                    st.markdown(f"### {topic}")
                with col2:
                    mastery_color = "success" if progress.mastery_level >= 0.8 else "warning" if progress.mastery_level >= 0.6 else "error"
                    st.markdown(
                        ThemeManager.create_badge(f"{progress.mastery_level*100:.0f}% 숙달", mastery_color),
                        unsafe_allow_html=True
                    )

                # 프로그레스 바
                progress_bar = ThemeManager.create_progress_bar(progress.mastery_level * 100, 100, mastery_color)
                st.markdown(progress_bar, unsafe_allow_html=True)

                # 상세 정보
                col1, col2, col3 = st.columns(3)
                with col1:
                    st.metric("풀이 수", progress.problems_attempted)
                with col2:
                    st.metric("정답 수", progress.problems_correct)
                with col3:
                    st.metric("학습 시간", f"{progress.study_time_minutes}분")

                st.markdown("---")

    def _render_sessions(self):
        """학습 세션 탭"""
        st.subheader("최근 학습 세션")

        sessions = self.tracker.get_recent_sessions(limit=10)

        if not sessions:
            st.info("기록된 세션이 없습니다.")
            return

        for session in sessions:
            with st.container():
                col1, col2, col3, col4 = st.columns([2, 1, 1, 1])

                with col1:
                    st.markdown(f"**{session.topic}**")
                with col2:
                    st.caption(f"문제: {session.problems_solved}개")
                with col3:
                    accuracy = (session.problems_correct / session.problems_solved * 100) if session.problems_solved > 0 else 0
                    st.caption(f"정답률: {accuracy:.0f}%")
                with col4:
                    st.caption(session.start_time[:10])

                st.markdown("---")


class HistoryPage:
    """계산 히스토리 페이지"""

    def __init__(self):
        """초기화"""
        self.manager = HistoryManager()
        logger.info("계산 히스토리 페이지 초기화")

    def render(self):
        """페이지 렌더링"""
        st.header("📜 계산 히스토리")
        st.write("이전 계산 기록을 확인하고 관리하세요.")

        # 탭
        tab1, tab2, tab3 = st.tabs(["📋 전체 기록", "⭐ 즐겨찾기", "📊 통계"])

        with tab1:
            self._render_history_list()

        with tab2:
            self._render_favorites()

        with tab3:
            self._render_history_stats()

    def _render_history_list(self):
        """히스토리 목록 탭"""
        st.subheader("계산 기록")

        # 필터 및 검색
        col1, col2, col3 = st.columns(3)
        with col1:
            filter_type = st.selectbox(
                "계산기 종류",
                ["전체"] + ["일차방정식", "이차방정식", "통계", "확률", "기하", "좌표평면"]
            )
        with col2:
            limit = st.slider("표시 개수", 5, 50, 20)
        with col3:
            search_query = st.text_input("🔍 검색", placeholder="키워드...")

        # 기록 가져오기
        if search_query:
            history = self.manager.search_history(search_query)
        elif filter_type != "전체":
            history = self.manager.get_history_by_type(filter_type)
        else:
            history = self.manager.get_recent_history(limit=limit)

        if not history:
            st.info("📭 계산 기록이 없습니다.")
            return

        # 기록 표시
        for entry in history:
            with st.container():
                # 헤더
                col1, col2, col3 = st.columns([2, 1, 1])
                with col1:
                    fav_icon = "⭐" if entry.is_favorite else "☆"
                    st.markdown(
                        f"{fav_icon} " + ThemeManager.create_badge(entry.calculator_type, "primary"),
                        unsafe_allow_html=True
                    )
                with col2:
                    st.caption(entry.timestamp[:16])
                with col3:
                    if st.button("⭐" if not entry.is_favorite else "☆", key=f"fav_{entry.id}"):
                        self.manager.toggle_favorite(entry.id)
                        st.rerun()

                # 입력 및 출력
                col1, col2 = st.columns(2)
                with col1:
                    st.markdown("**입력:**")
                    st.json(entry.inputs, expanded=False)
                with col2:
                    st.markdown("**결과:**")
                    st.json(entry.outputs, expanded=False)

                # 풀이 과정
                if entry.steps:
                    with st.expander("📝 풀이 과정"):
                        for step in entry.steps:
                            st.write(f"• {step}")

                # 삭제 버튼
                if st.button("🗑️ 삭제", key=f"del_{entry.id}"):
                    self.manager.delete_entry(entry.id)
                    st.rerun()

                st.markdown("---")

    def _render_favorites(self):
        """즐겨찾기 탭"""
        st.subheader("⭐ 즐겨찾기")

        favorites = self.manager.get_favorites()

        if not favorites:
            st.info("즐겨찾기한 계산이 없습니다.")
            return

        for entry in favorites:
            with st.container():
                st.markdown(
                    ThemeManager.create_badge(entry.calculator_type, "primary") +
                    ThemeManager.create_badge(entry.timestamp[:10], "secondary"),
                    unsafe_allow_html=True
                )

                col1, col2 = st.columns(2)
                with col1:
                    st.json(entry.inputs, expanded=False)
                with col2:
                    st.json(entry.outputs, expanded=False)

                st.markdown("---")

    def _render_history_stats(self):
        """통계 탭"""
        st.subheader("히스토리 통계")

        stats = self.manager.get_statistics()

        # 메트릭
        col1, col2, col3 = st.columns(3)
        with col1:
            st.metric("총 계산 수", stats['total_calculations'])
        with col2:
            st.metric("즐겨찾기", stats['favorite_count'])
        with col3:
            st.metric("최다 사용", stats['most_used_calculator'])

        # 계산기별 사용 횟수
        if stats['total_calculations'] > 0:
            st.markdown("---")
            st.subheader("계산기별 사용 횟수")

            for calc_type, count in stats['calculations_by_type'].items():
                progress = ThemeManager.create_progress_bar(count, stats['total_calculations'], "primary")
                st.markdown(f"**{calc_type}**: {count}회", unsafe_allow_html=False)
                st.markdown(progress, unsafe_allow_html=True)
