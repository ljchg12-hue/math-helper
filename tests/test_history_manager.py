"""
계산 히스토리 관리 테스트
"""
import pytest
import os
import tempfile
from src.features.history_manager import HistoryManager


class TestHistoryManager:
    """계산 히스토리 관리 테스트 클래스"""

    def setup_method(self):
        """각 테스트 전에 실행"""
        self.temp_file = tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.json')
        self.temp_file.close()
        self.manager = HistoryManager(storage_path=self.temp_file.name)

    def teardown_method(self):
        """각 테스트 후에 실행"""
        if os.path.exists(self.temp_file.name):
            os.unlink(self.temp_file.name)

    def test_initialization(self):
        """초기화 테스트"""
        assert self.manager is not None
        assert isinstance(self.manager.history, list)

    def test_add_calculation(self):
        """계산 기록 추가"""
        entry_id = self.manager.add_calculation(
            calculator_type="일차방정식",
            inputs={"a": 2, "b": 3, "c": -5},
            outputs={"x": 1.0},
            steps=["2x + 3 = 5", "2x = 2", "x = 1"]
        )
        assert entry_id is not None
        assert len(self.manager.history) == 1

    def test_get_recent_history(self):
        """최근 기록 조회"""
        self.manager.add_calculation("일차방정식", {"a": 1}, {"x": 1}, [])
        self.manager.add_calculation("이차방정식", {"a": 1}, {"x": 2}, [])
        self.manager.add_calculation("통계", {"data": [1, 2, 3]}, {"mean": 2}, [])

        recent = self.manager.get_recent_history(limit=2)
        assert len(recent) == 2
        # 최신 순서로 반환
        assert recent[0].calculator_type == "통계"

    def test_get_history_by_type(self):
        """계산기 종류별 조회"""
        self.manager.add_calculation("일차방정식", {"a": 1}, {"x": 1}, [])
        self.manager.add_calculation("이차방정식", {"a": 1}, {"x": 2}, [])
        self.manager.add_calculation("일차방정식", {"a": 2}, {"x": 3}, [])

        linear_history = self.manager.get_history_by_type("일차방정식")
        assert len(linear_history) == 2

    def test_toggle_favorite(self):
        """즐겨찾기 토글"""
        entry_id = self.manager.add_calculation("일차방정식", {}, {}, [])

        # 즐겨찾기 추가
        self.manager.toggle_favorite(entry_id)
        favorites = self.manager.get_favorites()
        assert len(favorites) == 1

        # 즐겨찾기 제거
        self.manager.toggle_favorite(entry_id)
        favorites = self.manager.get_favorites()
        assert len(favorites) == 0

    def test_delete_entry(self):
        """기록 삭제"""
        entry_id = self.manager.add_calculation("일차방정식", {}, {}, [])
        assert len(self.manager.history) == 1

        self.manager.delete_entry(entry_id)
        assert len(self.manager.history) == 0

    def test_search_history(self):
        """키워드 검색"""
        self.manager.add_calculation("일차방정식", {"a": 2, "b": 3}, {"x": 1}, ["2x + 3 = 5"])
        self.manager.add_calculation("이차방정식", {"a": 1}, {"x": 2}, ["x² = 4"])

        # 계산기 종류로 검색
        results = self.manager.search_history("일차")
        assert len(results) >= 1

        # 입력값으로 검색
        results = self.manager.search_history("x²")
        assert len(results) >= 1

    def test_get_statistics(self):
        """통계 조회"""
        id1 = self.manager.add_calculation("일차방정식", {}, {}, [])
        id2 = self.manager.add_calculation("일차방정식", {}, {}, [])
        id3 = self.manager.add_calculation("이차방정식", {}, {}, [])

        self.manager.toggle_favorite(id1)

        stats = self.manager.get_statistics()
        assert stats['total_calculations'] == 3
        assert stats['favorite_count'] == 1
        assert stats['most_used_calculator'] == "일차방정식"
        assert stats['most_used_count'] == 2

    def test_persistence(self):
        """저장 및 불러오기"""
        self.manager.add_calculation("일차방정식", {"a": 1}, {"x": 1}, [])

        # 새 인스턴스 생성
        manager2 = HistoryManager(storage_path=self.temp_file.name)
        assert len(manager2.history) == 1

    def test_clear_all(self):
        """전체 삭제"""
        self.manager.add_calculation("일차방정식", {}, {}, [])
        self.manager.add_calculation("이차방정식", {}, {}, [])

        self.manager.clear_all()
        assert len(self.manager.history) == 0

    def test_export_to_json(self):
        """JSON 내보내기"""
        self.manager.add_calculation("일차방정식", {"a": 1}, {"x": 1}, [])

        export_file = tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.json')
        export_file.close()

        try:
            self.manager.export_to_json(export_file.name)
            assert os.path.exists(export_file.name)
            assert os.path.getsize(export_file.name) > 0
        finally:
            if os.path.exists(export_file.name):
                os.unlink(export_file.name)
