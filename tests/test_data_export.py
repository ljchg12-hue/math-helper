"""
데이터 내보내기 기능 테스트
"""
import pytest
import os
import tempfile
import json
from src.features.data_export import (
    DataExporter,
    ProgressDataFormatter,
    MistakeDataFormatter
)
from src.features.progress_tracker import TopicProgress
from src.features.mistake_notes import MistakeEntry


class TestDataExporter:
    """데이터 내보내기 테스트 클래스"""

    def setup_method(self):
        """각 테스트 전에 실행"""
        self.temp_dir = tempfile.mkdtemp()

    def teardown_method(self):
        """각 테스트 후에 실행"""
        import shutil
        if os.path.exists(self.temp_dir):
            shutil.rmtree(self.temp_dir)

    def test_export_import_json(self):
        """JSON 내보내기/가져오기"""
        data = {"test": "value", "number": 123}
        filepath = os.path.join(self.temp_dir, "test.json")

        # 내보내기
        result = DataExporter.export_to_json(data, filepath)
        assert result is True
        assert os.path.exists(filepath)

        # 가져오기
        loaded_data = DataExporter.import_from_json(filepath)
        assert loaded_data == data

    def test_export_import_csv(self):
        """CSV 내보내기/가져오기"""
        data = [
            {"name": "Alice", "score": 90},
            {"name": "Bob", "score": 85}
        ]
        filepath = os.path.join(self.temp_dir, "test.csv")

        # 내보내기
        result = DataExporter.export_to_csv(data, filepath)
        assert result is True
        assert os.path.exists(filepath)

        # 가져오기
        loaded_data = DataExporter.import_from_csv(filepath)
        assert len(loaded_data) == 2
        assert loaded_data[0]["name"] == "Alice"

    def test_create_backup(self):
        """통합 백업 생성"""
        history_data = [{"id": "1", "type": "test"}]
        progress_data = {"topic1": {"score": 90}}
        mistakes_data = [{"id": "m1", "question": "test"}]

        backup_file = DataExporter.create_backup(
            history_data,
            progress_data,
            mistakes_data,
            backup_dir=self.temp_dir
        )

        assert backup_file != ""
        assert os.path.exists(backup_file)
        assert "math_helper_backup_" in backup_file

    def test_restore_backup(self):
        """백업 복원"""
        # 백업 생성
        history_data = [{"id": "1"}]
        progress_data = {"topic": {}}
        mistakes_data = [{"id": "m1"}]

        backup_file = DataExporter.create_backup(
            history_data,
            progress_data,
            mistakes_data,
            backup_dir=self.temp_dir
        )

        # 복원
        restored = DataExporter.restore_backup(backup_file)

        assert restored['history'] == history_data
        assert restored['progress'] == progress_data
        assert restored['mistakes'] == mistakes_data
        assert 'backup_info' in restored

    def test_export_empty_csv(self):
        """빈 데이터 CSV 내보내기"""
        filepath = os.path.join(self.temp_dir, "empty.csv")
        result = DataExporter.export_to_csv([], filepath)
        assert result is False

    def test_import_nonexistent_file(self):
        """존재하지 않는 파일 가져오기"""
        result = DataExporter.import_from_json("nonexistent.json")
        assert result is None

        result = DataExporter.import_from_csv("nonexistent.csv")
        assert result == []


class TestProgressDataFormatter:
    """진도 데이터 포맷터 테스트"""

    def test_to_csv_format(self):
        """CSV 형식 변환"""
        topic_progress = {
            "일차방정식": TopicProgress(
                topic="일차방정식",
                problems_attempted=10,
                problems_correct=8,
                mastery_level=0.8,
                study_time_minutes=30,
                last_studied="2024-01-01"
            )
        }

        csv_data = ProgressDataFormatter.to_csv_format(topic_progress)

        assert len(csv_data) == 1
        assert csv_data[0]['주제'] == "일차방정식"
        assert csv_data[0]['시도한_문제'] == 10
        assert csv_data[0]['정답_수'] == 8

    def test_to_summary_report(self):
        """요약 리포트 생성"""
        topic_progress = {
            "일차방정식": TopicProgress(
                topic="일차방정식",
                problems_attempted=10,
                problems_correct=8,
                mastery_level=0.8,
                study_time_minutes=30,
                last_studied="2024-01-01"
            )
        }
        overall_stats = {
            'total_topics': 1,
            'total_problems_attempted': 10,
            'total_problems_correct': 8,
            'overall_accuracy': 80.0,
            'total_study_time_minutes': 30
        }

        report = ProgressDataFormatter.to_summary_report(
            topic_progress,
            overall_stats
        )

        assert isinstance(report, str)
        assert "학습 진도 리포트" in report
        assert "일차방정식" in report
        assert "80.0%" in report


class TestMistakeDataFormatter:
    """오답 데이터 포맷터 테스트"""

    def test_to_csv_format(self):
        """CSV 형식 변환"""
        mistakes = [
            MistakeEntry(
                id="test123",
                topic="일차방정식",
                question="x + 2 = 5",
                user_answer=2,
                correct_answer=3,
                timestamp="2024-01-01",
                attempts=1,
                mastered=False,
                notes="계산 실수"
            )
        ]

        csv_data = MistakeDataFormatter.to_csv_format(mistakes)

        assert len(csv_data) == 1
        assert csv_data[0]['주제'] == "일차방정식"
        assert csv_data[0]['문제'] == "x + 2 = 5"
        assert csv_data[0]['마스터_여부'] == '복습필요'

    def test_to_review_sheet(self):
        """복습 시트 생성"""
        mistakes = [
            MistakeEntry(
                id="test123",
                topic="일차방정식",
                question="x + 2 = 5",
                user_answer=2,
                correct_answer=3,
                timestamp="2024-01-01",
                attempts=1,
                mastered=False,
                notes="계산 실수"
            )
        ]

        sheet = MistakeDataFormatter.to_review_sheet(mistakes)

        assert isinstance(sheet, str)
        assert "오답 복습 시트" in sheet
        assert "일차방정식" in sheet
        assert "x + 2 = 5" in sheet

    def test_review_sheet_unmastered_only(self):
        """미완료 오답만 포함"""
        mistakes = [
            MistakeEntry(
                id="test1",
                topic="일차방정식",
                question="Q1",
                user_answer=1,
                correct_answer=2,
                timestamp="2024-01-01",
                attempts=1,
                mastered=False,
                notes=""
            ),
            MistakeEntry(
                id="test2",
                topic="이차방정식",
                question="Q2",
                user_answer=1,
                correct_answer=2,
                timestamp="2024-01-02",
                attempts=2,
                mastered=True,
                notes=""
            )
        ]

        sheet = MistakeDataFormatter.to_review_sheet(mistakes, unmastered_only=True)

        assert "Q1" in sheet
        assert "Q2" not in sheet
