"""
Plotly 기반 인터랙티브 시각화 모듈
Matplotlib 차트를 Plotly로 대체하여 더 나은 상호작용성 제공
"""
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
from typing import List, Dict, Tuple
from datetime import datetime, timedelta
import pandas as pd
from ..utils.logger import get_logger

logger = get_logger()


class PlotlyVisualizer:
    """Plotly 기반 시각화 클래스"""

    def __init__(self, theme: str = "light"):
        """
        초기화

        Args:
            theme: 테마 (light/dark)
        """
        self.theme = theme
        self.color_scheme = self._get_color_scheme()
        logger.info(f"PlotlyVisualizer 초기화 (테마: {theme})")

    def _get_color_scheme(self) -> Dict[str, str]:
        """테마에 따른 색상 스킴 반환"""
        if self.theme == "dark":
            return {
                "background": "#1e1e1e",
                "paper": "#2d2d2d",
                "text": "#e0e0e0",
                "grid": "#404040",
                "high": "#66bb6a",
                "medium": "#ffa726",
                "low": "#ef5350",
                "primary": "#3a9ad9"
            }
        else:
            return {
                "background": "#ffffff",
                "paper": "#f5f5f5",
                "text": "#333333",
                "grid": "#e0e0e0",
                "high": "#4caf50",
                "medium": "#ff9800",
                "low": "#f44336",
                "primary": "#2196f3"
            }

    def create_mastery_bar_chart(
        self,
        topics: List[str],
        mastery_levels: List[float],
        height: int = 500
    ) -> go.Figure:
        """
        주제별 숙달도 가로 막대 그래프 (인터랙티브)

        Args:
            topics: 주제 목록
            mastery_levels: 숙달도 (0.0-1.0)
            height: 차트 높이

        Returns:
            Plotly Figure 객체
        """
        if not topics:
            logger.warning("빈 데이터로 차트 생성 시도")
            topics = ["데이터 없음"]
            mastery_levels = [0]

        # 색상 결정 (숙달도에 따라)
        colors = []
        for level in mastery_levels:
            if level >= 0.8:
                colors.append(self.color_scheme["high"])
            elif level >= 0.6:
                colors.append(self.color_scheme["medium"])
            else:
                colors.append(self.color_scheme["low"])

        # 퍼센트 변환
        percentages = [level * 100 for level in mastery_levels]

        fig = go.Figure(data=[
            go.Bar(
                y=topics,
                x=percentages,
                orientation='h',
                marker=dict(
                    color=colors,
                    line=dict(color=self.color_scheme["text"], width=1)
                ),
                text=[f"{p:.1f}%" for p in percentages],
                textposition='auto',
                hovertemplate='<b>%{y}</b><br>숙달도: %{x:.1f}%<extra></extra>'
            )
        ])

        fig.update_layout(
            title="주제별 숙달도",
            xaxis_title="숙달도 (%)",
            yaxis_title="주제",
            plot_bgcolor=self.color_scheme["background"],
            paper_bgcolor=self.color_scheme["paper"],
            font=dict(color=self.color_scheme["text"], size=12),
            height=height,
            xaxis=dict(
                range=[0, 100],
                gridcolor=self.color_scheme["grid"],
                showgrid=True
            ),
            yaxis=dict(gridcolor=self.color_scheme["grid"]),
            hovermode='closest'
        )

        return fig

    def create_progress_line_chart(
        self,
        dates: List[str],
        problems_solved: List[int],
        problems_correct: List[int],
        height: int = 400
    ) -> go.Figure:
        """
        학습 진행 추이 선 그래프 (인터랙티브)

        Args:
            dates: 날짜 목록
            problems_solved: 풀이한 문제 수
            problems_correct: 정답 수
            height: 차트 높이

        Returns:
            Plotly Figure 객체
        """
        if not dates:
            logger.warning("빈 데이터로 차트 생성 시도")
            dates = ["날짜 없음"]
            problems_solved = [0]
            problems_correct = [0]

        fig = go.Figure()

        # 풀이한 문제 라인
        fig.add_trace(go.Scatter(
            x=dates,
            y=problems_solved,
            mode='lines+markers',
            name='풀이한 문제',
            line=dict(color=self.color_scheme["primary"], width=2),
            marker=dict(size=8),
            hovertemplate='<b>%{x}</b><br>풀이: %{y}개<extra></extra>'
        ))

        # 정답 라인
        fig.add_trace(go.Scatter(
            x=dates,
            y=problems_correct,
            mode='lines+markers',
            name='정답',
            line=dict(color=self.color_scheme["high"], width=2),
            marker=dict(size=8),
            hovertemplate='<b>%{x}</b><br>정답: %{y}개<extra></extra>'
        ))

        fig.update_layout(
            title="학습 진행 추이",
            xaxis_title="날짜",
            yaxis_title="문제 수",
            plot_bgcolor=self.color_scheme["background"],
            paper_bgcolor=self.color_scheme["paper"],
            font=dict(color=self.color_scheme["text"], size=12),
            height=height,
            xaxis=dict(gridcolor=self.color_scheme["grid"]),
            yaxis=dict(gridcolor=self.color_scheme["grid"]),
            hovermode='x unified',
            legend=dict(
                orientation="h",
                yanchor="bottom",
                y=1.02,
                xanchor="right",
                x=1
            )
        )

        return fig

    def create_topic_comparison_chart(
        self,
        topics: List[str],
        attempted: List[int],
        correct: List[int],
        height: int = 500
    ) -> go.Figure:
        """
        주제별 비교 그룹 막대 차트 (인터랙티브)

        Args:
            topics: 주제 목록
            attempted: 시도한 문제 수
            correct: 정답 수
            height: 차트 높이

        Returns:
            Plotly Figure 객체
        """
        if not topics:
            logger.warning("빈 데이터로 차트 생성 시도")
            topics = ["데이터 없음"]
            attempted = [0]
            correct = [0]

        fig = go.Figure()

        fig.add_trace(go.Bar(
            name='시도한 문제',
            x=topics,
            y=attempted,
            marker_color=self.color_scheme["primary"],
            text=attempted,
            textposition='auto',
            hovertemplate='<b>%{x}</b><br>시도: %{y}개<extra></extra>'
        ))

        fig.add_trace(go.Bar(
            name='정답',
            x=topics,
            y=correct,
            marker_color=self.color_scheme["high"],
            text=correct,
            textposition='auto',
            hovertemplate='<b>%{x}</b><br>정답: %{y}개<extra></extra>'
        ))

        fig.update_layout(
            title="주제별 문제 풀이 비교",
            xaxis_title="주제",
            yaxis_title="문제 수",
            plot_bgcolor=self.color_scheme["background"],
            paper_bgcolor=self.color_scheme["paper"],
            font=dict(color=self.color_scheme["text"], size=12),
            height=height,
            barmode='group',
            xaxis=dict(gridcolor=self.color_scheme["grid"]),
            yaxis=dict(gridcolor=self.color_scheme["grid"]),
            legend=dict(
                orientation="h",
                yanchor="bottom",
                y=1.02,
                xanchor="right",
                x=1
            )
        )

        return fig

    def create_study_time_pie_chart(
        self,
        topics: List[str],
        study_times: List[int],
        height: int = 500
    ) -> go.Figure:
        """
        학습 시간 분포 파이 차트 (인터랙티브)

        Args:
            topics: 주제 목록
            study_times: 학습 시간 (분)
            height: 차트 높이

        Returns:
            Plotly Figure 객체
        """
        if not topics:
            logger.warning("빈 데이터로 차트 생성 시도")
            topics = ["데이터 없음"]
            study_times = [0]

        fig = go.Figure(data=[go.Pie(
            labels=topics,
            values=study_times,
            hole=0.3,  # 도넛 차트
            textinfo='label+percent',
            textposition='auto',
            hovertemplate='<b>%{label}</b><br>학습 시간: %{value}분<br>비율: %{percent}<extra></extra>',
            marker=dict(
                line=dict(color=self.color_scheme["text"], width=1)
            )
        )])

        fig.update_layout(
            title="주제별 학습 시간 분포",
            plot_bgcolor=self.color_scheme["background"],
            paper_bgcolor=self.color_scheme["paper"],
            font=dict(color=self.color_scheme["text"], size=12),
            height=height,
            showlegend=True,
            legend=dict(
                orientation="v",
                yanchor="middle",
                y=0.5,
                xanchor="left",
                x=1.05
            )
        )

        return fig

    def create_weekly_heatmap(
        self,
        daily_data: Dict[str, int],
        weeks: int = 4,
        height: int = 300
    ) -> go.Figure:
        """
        주간 학습 활동 히트맵 (인터랙티브)

        Args:
            daily_data: {날짜: 문제수} 딕셔너리
            weeks: 표시할 주 수
            height: 차트 높이

        Returns:
            Plotly Figure 객체
        """
        if not daily_data:
            logger.warning("빈 데이터로 차트 생성 시도")
            # 빈 히트맵 생성
            fig = go.Figure(data=go.Heatmap(
                z=[[0]],
                x=['월'],
                y=['Week 1'],
                colorscale='Greens',
                showscale=True
            ))
            fig.update_layout(
                title="주간 학습 활동 (데이터 없음)",
                height=height
            )
            return fig

        # 날짜 범위 생성
        dates = sorted(daily_data.keys())
        if dates:
            end_date = datetime.fromisoformat(dates[-1])
        else:
            end_date = datetime.now()

        start_date = end_date - timedelta(weeks=weeks)

        # 주별 데이터 구성
        weekdays = ['월', '화', '수', '목', '금', '토', '일']
        week_labels = [f'Week {i+1}' for i in range(weeks)]

        # 데이터 매트릭스 초기화
        heatmap_data = [[0 for _ in range(7)] for _ in range(weeks)]

        # 데이터 채우기
        current_date = start_date
        while current_date <= end_date:
            date_str = current_date.strftime('%Y-%m-%d')
            if date_str in daily_data:
                days_diff = (current_date - start_date).days
                week_idx = days_diff // 7
                day_idx = current_date.weekday()
                if week_idx < weeks:
                    heatmap_data[week_idx][day_idx] = daily_data[date_str]
            current_date += timedelta(days=1)

        fig = go.Figure(data=go.Heatmap(
            z=heatmap_data,
            x=weekdays,
            y=week_labels,
            colorscale='Greens',
            showscale=True,
            hovertemplate='<b>%{y} - %{x}</b><br>문제 수: %{z}개<extra></extra>',
            colorbar=dict(title="문제 수")
        ))

        fig.update_layout(
            title=f"최근 {weeks}주 학습 활동",
            plot_bgcolor=self.color_scheme["background"],
            paper_bgcolor=self.color_scheme["paper"],
            font=dict(color=self.color_scheme["text"], size=12),
            height=height,
            xaxis=dict(side='top'),
            yaxis=dict(autorange='reversed')
        )

        return fig

    @staticmethod
    def fig_to_html(fig: go.Figure, include_plotlyjs: str = 'cdn') -> str:
        """
        Plotly Figure를 HTML로 변환

        Args:
            fig: Plotly Figure 객체
            include_plotlyjs: plotly.js 포함 방식 ('cdn', 'inline', False)

        Returns:
            HTML 문자열
        """
        try:
            html = fig.to_html(
                include_plotlyjs=include_plotlyjs,
                config={
                    'displayModeBar': True,
                    'displaylogo': False,
                    'modeBarButtonsToRemove': ['pan2d', 'lasso2d']
                }
            )
            logger.debug("Figure를 HTML로 변환 성공")
            return html
        except Exception as e:
            logger.error(f"Figure HTML 변환 실패: {e}")
            return "<div>차트 표시 오류</div>"
