"""
오답 노트 테스트
"""
import pytest
import os
import tempfile
from src.features.mistake_notes import MistakeNotes


class TestMistakeNotes:
    """오답 노트 테스트 클래스"""

    def setup_method(self):
        """각 테스트 전에 실행"""
        # 임시 파일 사용
        self.temp_file = tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.json')
        self.temp_file.close()
        self.notes = MistakeNotes(storage_path=self.temp_file.name)

    def teardown_method(self):
        """각 테스트 후에 실행"""
        # 임시 파일 삭제
        if os.path.exists(self.temp_file.name):
            os.unlink(self.temp_file.name)

    def test_initialization(self):
        """초기화 테스트"""
        assert self.notes is not None
        assert isinstance(self.notes.mistakes, list)

    def test_add_mistake(self):
        """오답 추가"""
        mistake_id = self.notes.add_mistake(
            topic="일차방정식",
            question="2x + 3 = 7을 풀이하세요.",
            user_answer=1,
            correct_answer=2,
            notes="부호 실수"
        )
        assert mistake_id is not None
        assert len(self.notes.mistakes) == 1

    def test_get_mistakes_by_topic(self):
        """주제별 오답 조회"""
        self.notes.add_mistake("일차방정식", "문제1", 1, 2)
        self.notes.add_mistake("이차방정식", "문제2", 3, 4)
        self.notes.add_mistake("일차방정식", "문제3", 5, 6)

        linear_mistakes = self.notes.get_mistakes_by_topic("일차방정식")
        assert len(linear_mistakes) == 2

    def test_get_unmastered_mistakes(self):
        """미학습 오답 조회"""
        id1 = self.notes.add_mistake("일차방정식", "문제1", 1, 2)
        id2 = self.notes.add_mistake("이차방정식", "문제2", 3, 4)

        self.notes.mark_as_mastered(id1)

        unmastered = self.notes.get_unmastered_mistakes()
        assert len(unmastered) == 1
        assert unmastered[0].id == id2

    def test_mark_as_mastered(self):
        """마스터 표시"""
        mistake_id = self.notes.add_mistake("일차방정식", "문제1", 1, 2)
        self.notes.mark_as_mastered(mistake_id)

        for mistake in self.notes.mistakes:
            if mistake.id == mistake_id:
                assert mistake.mastered is True

    def test_increment_attempts(self):
        """재시도 횟수 증가"""
        mistake_id = self.notes.add_mistake("일차방정식", "문제1", 1, 2)

        self.notes.increment_attempts(mistake_id)
        self.notes.increment_attempts(mistake_id)

        for mistake in self.notes.mistakes:
            if mistake.id == mistake_id:
                assert mistake.attempts == 2

    def test_update_notes(self):
        """메모 업데이트"""
        mistake_id = self.notes.add_mistake("일차방정식", "문제1", 1, 2, notes="초기 메모")
        self.notes.update_notes(mistake_id, "수정된 메모")

        for mistake in self.notes.mistakes:
            if mistake.id == mistake_id:
                assert mistake.notes == "수정된 메모"

    def test_delete_mistake(self):
        """오답 삭제"""
        mistake_id = self.notes.add_mistake("일차방정식", "문제1", 1, 2)
        assert len(self.notes.mistakes) == 1

        self.notes.delete_mistake(mistake_id)
        assert len(self.notes.mistakes) == 0

    def test_get_statistics(self):
        """통계 조회"""
        id1 = self.notes.add_mistake("일차방정식", "문제1", 1, 2)
        id2 = self.notes.add_mistake("이차방정식", "문제2", 3, 4)
        self.notes.mark_as_mastered(id1)

        stats = self.notes.get_statistics()
        assert stats['total_mistakes'] == 2
        assert stats['mastered_count'] == 1
        assert stats['unmastered_count'] == 1
        assert stats['mastery_rate'] == 50.0

    def test_persistence(self):
        """저장 및 불러오기"""
        self.notes.add_mistake("일차방정식", "문제1", 1, 2)

        # 새 인스턴스 생성
        notes2 = MistakeNotes(storage_path=self.temp_file.name)
        assert len(notes2.mistakes) == 1

    def test_clear_all(self):
        """전체 삭제"""
        self.notes.add_mistake("일차방정식", "문제1", 1, 2)
        self.notes.add_mistake("이차방정식", "문제2", 3, 4)

        self.notes.clear_all()
        assert len(self.notes.mistakes) == 0
