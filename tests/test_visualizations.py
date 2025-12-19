"""
시각화 기능 테스트
"""
import pytest
import matplotlib.pyplot as plt
from src.features.visualizations import ProgressVisualizer


class TestProgressVisualizer:
    """시각화 테스트 클래스"""

    def setup_method(self):
        """각 테스트 전에 실행"""
        self.visualizer = ProgressVisualizer(use_korean_font=False)

    def test_initialization(self):
        """초기화 테스트"""
        assert self.visualizer is not None
        assert isinstance(self.visualizer, ProgressVisualizer)

    def test_create_mastery_bar_chart(self):
        """숙달도 막대 그래프 생성"""
        topics = ["일차방정식", "이차방정식", "통계"]
        mastery_levels = [0.85, 0.65, 0.45]

        fig = self.visualizer.create_mastery_bar_chart(topics, mastery_levels)

        assert isinstance(fig, plt.Figure)
        plt.close(fig)

    def test_create_progress_line_chart(self):
        """진행 추이 선 그래프 생성"""
        dates = ["2024-01-01", "2024-01-02", "2024-01-03"]
        problems_solved = [5, 8, 6]
        problems_correct = [4, 6, 5]

        fig = self.visualizer.create_progress_line_chart(
            dates, problems_solved, problems_correct
        )

        assert isinstance(fig, plt.Figure)
        plt.close(fig)

    def test_create_topic_comparison_chart(self):
        """주제별 비교 차트 생성"""
        topics = ["일차방정식", "이차방정식"]
        attempted = [10, 8]
        correct = [8, 6]

        fig = self.visualizer.create_topic_comparison_chart(
            topics, attempted, correct
        )

        assert isinstance(fig, plt.Figure)
        plt.close(fig)

    def test_create_study_time_pie_chart(self):
        """학습 시간 파이 차트 생성"""
        topics = ["일차방정식", "이차방정식", "통계"]
        study_times = [30, 45, 25]

        fig = self.visualizer.create_study_time_pie_chart(topics, study_times)

        assert isinstance(fig, plt.Figure)
        plt.close(fig)

    def test_create_weekly_heatmap(self):
        """주간 히트맵 생성"""
        daily_data = {
            "2024-01-01": 5,
            "2024-01-02": 3,
            "2024-01-03": 7
        }

        fig = self.visualizer.create_weekly_heatmap(daily_data, weeks=2)

        assert isinstance(fig, plt.Figure)
        plt.close(fig)

    def test_fig_to_base64(self):
        """Figure를 base64로 변환"""
        topics = ["Test"]
        mastery_levels = [0.8]

        fig = self.visualizer.create_mastery_bar_chart(topics, mastery_levels)
        base64_str = ProgressVisualizer.fig_to_base64(fig)

        assert isinstance(base64_str, str)
        assert len(base64_str) > 0

    def test_fig_to_html_img(self):
        """Figure를 HTML img 태그로 변환"""
        topics = ["Test"]
        mastery_levels = [0.8]

        fig = self.visualizer.create_mastery_bar_chart(topics, mastery_levels)
        html = ProgressVisualizer.fig_to_html_img(fig)

        assert isinstance(html, str)
        assert html.startswith('<img src="data:image/png;base64,')
        assert html.endswith('" />')

    def test_empty_data_handling(self):
        """빈 데이터 처리"""
        fig = self.visualizer.create_mastery_bar_chart([], [])
        assert isinstance(fig, plt.Figure)
        plt.close(fig)

    def test_single_data_point(self):
        """단일 데이터 포인트"""
        topics = ["일차방정식"]
        mastery_levels = [0.75]

        fig = self.visualizer.create_mastery_bar_chart(topics, mastery_levels)
        assert isinstance(fig, plt.Figure)
        plt.close(fig)
