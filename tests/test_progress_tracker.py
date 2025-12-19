"""
학습 진도 추적 테스트
"""
import pytest
import os
import tempfile
from src.features.progress_tracker import ProgressTracker


class TestProgressTracker:
    """학습 진도 추적 테스트 클래스"""

    def setup_method(self):
        """각 테스트 전에 실행"""
        self.temp_file = tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.json')
        self.temp_file.close()
        self.tracker = ProgressTracker(storage_path=self.temp_file.name)

    def teardown_method(self):
        """각 테스트 후에 실행"""
        if os.path.exists(self.temp_file.name):
            os.unlink(self.temp_file.name)

    def test_initialization(self):
        """초기화 테스트"""
        assert self.tracker is not None
        assert isinstance(self.tracker.topic_progress, dict)

    def test_record_attempt(self):
        """문제 풀이 기록"""
        self.tracker.record_attempt("일차방정식", is_correct=True)
        progress = self.tracker.get_topic_progress("일차방정식")

        assert progress is not None
        assert progress.problems_attempted == 1
        assert progress.problems_correct == 1

    def test_mastery_level_calculation(self):
        """숙달도 계산"""
        self.tracker.record_attempt("일차방정식", is_correct=True)
        self.tracker.record_attempt("일차방정식", is_correct=True)
        self.tracker.record_attempt("일차방정식", is_correct=False)
        self.tracker.record_attempt("일차방정식", is_correct=True)

        progress = self.tracker.get_topic_progress("일차방정식")
        assert progress.mastery_level == 0.75  # 3/4

    def test_start_and_end_session(self):
        """세션 시작 및 종료"""
        session_id = self.tracker.start_session("이차방정식")
        assert session_id is not None

        self.tracker.end_session(session_id, problems_solved=5, problems_correct=4)

        sessions = self.tracker.get_recent_sessions(limit=1)
        assert len(sessions) == 1
        assert sessions[0].problems_solved == 5
        assert sessions[0].problems_correct == 4

    def test_get_overall_statistics(self):
        """전체 통계"""
        self.tracker.record_attempt("일차방정식", is_correct=True, study_time_minutes=10)
        self.tracker.record_attempt("이차방정식", is_correct=False, study_time_minutes=15)

        stats = self.tracker.get_overall_statistics()
        assert stats['total_topics'] == 2
        assert stats['total_problems_attempted'] == 2
        assert stats['total_problems_correct'] == 1
        assert stats['overall_accuracy'] == 50.0
        assert stats['total_study_time_minutes'] == 25

    def test_get_weak_topics(self):
        """약한 주제 찾기"""
        self.tracker.record_attempt("일차방정식", is_correct=True)
        self.tracker.record_attempt("일차방정식", is_correct=True)

        self.tracker.record_attempt("이차방정식", is_correct=False)
        self.tracker.record_attempt("이차방정식", is_correct=False)

        weak_topics = self.tracker.get_weak_topics(threshold=0.6)
        assert "이차방정식" in weak_topics
        assert "일차방정식" not in weak_topics

    def test_reset_topic_progress(self):
        """주제 진도 초기화"""
        self.tracker.record_attempt("일차방정식", is_correct=True)
        self.tracker.reset_topic_progress("일차방정식")

        progress = self.tracker.get_topic_progress("일차방정식")
        assert progress is None

    def test_persistence(self):
        """저장 및 불러오기"""
        self.tracker.record_attempt("일차방정식", is_correct=True)

        # 새 인스턴스 생성
        tracker2 = ProgressTracker(storage_path=self.temp_file.name)
        progress = tracker2.get_topic_progress("일차방정식")
        assert progress is not None
        assert progress.problems_attempted == 1

    def test_study_time_tracking(self):
        """학습 시간 추적"""
        self.tracker.record_attempt("일차방정식", is_correct=True, study_time_minutes=30)
        self.tracker.record_attempt("일차방정식", is_correct=True, study_time_minutes=20)

        progress = self.tracker.get_topic_progress("일차방정식")
        assert progress.study_time_minutes == 50

    def test_reset_all_progress(self):
        """전체 진도 초기화"""
        self.tracker.record_attempt("일차방정식", is_correct=True)
        self.tracker.record_attempt("이차방정식", is_correct=True)

        self.tracker.reset_all_progress()
        assert len(self.tracker.topic_progress) == 0
