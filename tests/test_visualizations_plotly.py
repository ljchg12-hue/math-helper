"""
Plotly 시각화 기능 테스트
"""
import pytest
import plotly.graph_objects as go
from src.features.visualizations_plotly import PlotlyVisualizer


class TestPlotlyVisualizer:
    """Plotly 시각화 테스트 클래스"""

    def setup_method(self):
        """각 테스트 전에 실행"""
        self.visualizer = PlotlyVisualizer(theme="light")
        self.dark_visualizer = PlotlyVisualizer(theme="dark")

    def test_initialization_light_theme(self):
        """라이트 테마 초기화"""
        assert self.visualizer is not None
        assert self.visualizer.theme == "light"
        assert self.visualizer.color_scheme["background"] == "#ffffff"

    def test_initialization_dark_theme(self):
        """다크 테마 초기화"""
        assert self.dark_visualizer.theme == "dark"
        assert self.dark_visualizer.color_scheme["background"] == "#1e1e1e"

    def test_create_mastery_bar_chart(self):
        """숙달도 막대 그래프 생성"""
        topics = ["일차방정식", "이차방정식", "통계"]
        mastery_levels = [0.85, 0.65, 0.45]

        fig = self.visualizer.create_mastery_bar_chart(topics, mastery_levels)

        assert isinstance(fig, go.Figure)
        assert len(fig.data) == 1
        assert fig.data[0].type == "bar"
        assert fig.data[0].orientation == "h"

    def test_create_mastery_bar_chart_empty(self):
        """빈 데이터로 숙달도 차트 생성"""
        fig = self.visualizer.create_mastery_bar_chart([], [])

        assert isinstance(fig, go.Figure)
        assert len(fig.data) == 1

    def test_create_progress_line_chart(self):
        """진행 추이 선 그래프 생성"""
        dates = ["2024-01-01", "2024-01-02", "2024-01-03"]
        problems_solved = [5, 8, 6]
        problems_correct = [4, 6, 5]

        fig = self.visualizer.create_progress_line_chart(
            dates, problems_solved, problems_correct
        )

        assert isinstance(fig, go.Figure)
        assert len(fig.data) == 2  # 두 개의 라인
        assert fig.data[0].mode == "lines+markers"
        assert fig.data[1].mode == "lines+markers"

    def test_create_progress_line_chart_empty(self):
        """빈 데이터로 진행 추이 차트 생성"""
        fig = self.visualizer.create_progress_line_chart([], [], [])

        assert isinstance(fig, go.Figure)

    def test_create_topic_comparison_chart(self):
        """주제별 비교 차트 생성"""
        topics = ["일차방정식", "이차방정식"]
        attempted = [10, 8]
        correct = [8, 6]

        fig = self.visualizer.create_topic_comparison_chart(
            topics, attempted, correct
        )

        assert isinstance(fig, go.Figure)
        assert len(fig.data) == 2  # 시도/정답 두 개의 바
        assert fig.data[0].type == "bar"
        assert fig.layout.barmode == "group"

    def test_create_topic_comparison_chart_empty(self):
        """빈 데이터로 비교 차트 생성"""
        fig = self.visualizer.create_topic_comparison_chart([], [], [])

        assert isinstance(fig, go.Figure)

    def test_create_study_time_pie_chart(self):
        """학습 시간 파이 차트 생성"""
        topics = ["일차방정식", "이차방정식", "통계"]
        study_times = [30, 45, 25]

        fig = self.visualizer.create_study_time_pie_chart(topics, study_times)

        assert isinstance(fig, go.Figure)
        assert len(fig.data) == 1
        assert fig.data[0].type == "pie"
        assert fig.data[0].hole == 0.3  # 도넛 차트

    def test_create_study_time_pie_chart_empty(self):
        """빈 데이터로 파이 차트 생성"""
        fig = self.visualizer.create_study_time_pie_chart([], [])

        assert isinstance(fig, go.Figure)

    def test_create_weekly_heatmap(self):
        """주간 히트맵 생성"""
        daily_data = {
            "2024-01-01": 5,
            "2024-01-02": 3,
            "2024-01-03": 7
        }

        fig = self.visualizer.create_weekly_heatmap(daily_data, weeks=2)

        assert isinstance(fig, go.Figure)
        assert len(fig.data) == 1
        assert fig.data[0].type == "heatmap"

    def test_create_weekly_heatmap_empty(self):
        """빈 데이터로 히트맵 생성"""
        fig = self.visualizer.create_weekly_heatmap({}, weeks=2)

        assert isinstance(fig, go.Figure)

    def test_fig_to_html(self):
        """Figure를 HTML로 변환"""
        topics = ["Test"]
        mastery_levels = [0.8]

        fig = self.visualizer.create_mastery_bar_chart(topics, mastery_levels)
        html = PlotlyVisualizer.fig_to_html(fig)

        assert isinstance(html, str)
        assert len(html) > 0
        assert "plotly" in html.lower()

    def test_color_scheme_light(self):
        """라이트 테마 색상 스킴"""
        colors = self.visualizer.color_scheme

        assert colors["background"] == "#ffffff"
        assert colors["text"] == "#333333"
        assert "high" in colors
        assert "medium" in colors
        assert "low" in colors

    def test_color_scheme_dark(self):
        """다크 테마 색상 스킴"""
        colors = self.dark_visualizer.color_scheme

        assert colors["background"] == "#1e1e1e"
        assert colors["text"] == "#e0e0e0"

    def test_chart_height_custom(self):
        """커스텀 차트 높이"""
        topics = ["Test"]
        mastery_levels = [0.8]

        fig = self.visualizer.create_mastery_bar_chart(
            topics, mastery_levels, height=600
        )

        assert fig.layout.height == 600

    def test_hovertemplate_present(self):
        """호버 템플릿 존재 확인"""
        topics = ["Test"]
        mastery_levels = [0.8]

        fig = self.visualizer.create_mastery_bar_chart(topics, mastery_levels)

        assert fig.data[0].hovertemplate is not None
        assert len(fig.data[0].hovertemplate) > 0
