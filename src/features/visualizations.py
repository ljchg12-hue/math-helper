"""
학습 진도 시각화 모듈
Matplotlib 기반 차트 생성
"""
import matplotlib.pyplot as plt
import matplotlib.font_manager as fm
from typing import Dict, List, Tuple, Optional
from datetime import datetime, timedelta
import io
import base64


class ProgressVisualizer:
    """학습 진도 시각화 클래스"""

    def __init__(self, use_korean_font: bool = True):
        """
        초기화

        Args:
            use_korean_font: 한글 폰트 사용 여부
        """
        self.use_korean_font = use_korean_font
        if use_korean_font:
            self._setup_korean_font()

    def _setup_korean_font(self):
        """한글 폰트 설정"""
        try:
            # 시스템에 설치된 한글 폰트 찾기
            korean_fonts = [
                'NanumGothic',
                'NanumBarunGothic',
                'Malgun Gothic',
                'AppleGothic',
                'DejaVu Sans'
            ]

            for font_name in korean_fonts:
                try:
                    plt.rcParams['font.family'] = font_name
                    break
                except:
                    continue

            # 마이너스 기호 깨짐 방지
            plt.rcParams['axes.unicode_minus'] = False
        except Exception as e:
            print(f"한글 폰트 설정 실패: {e}")

    def create_mastery_bar_chart(
        self,
        topics: List[str],
        mastery_levels: List[float],
        figsize: Tuple[int, int] = (10, 6)
    ) -> plt.Figure:
        """
        주제별 숙달도 막대 그래프

        Args:
            topics: 주제 목록
            mastery_levels: 숙달도 목록 (0-1)
            figsize: 그래프 크기

        Returns:
            matplotlib Figure 객체
        """
        fig, ax = plt.subplots(figsize=figsize)

        # 색상 설정 (숙달도에 따라)
        colors = []
        for level in mastery_levels:
            if level >= 0.8:
                colors.append('#66bb6a')  # 초록 (높음)
            elif level >= 0.6:
                colors.append('#ffa726')  # 주황 (중간)
            else:
                colors.append('#ef5350')  # 빨강 (낮음)

        # 막대 그래프
        bars = ax.barh(topics, [m * 100 for m in mastery_levels], color=colors)

        # 값 표시
        for i, (bar, level) in enumerate(zip(bars, mastery_levels)):
            width = bar.get_width()
            ax.text(
                width + 2,
                bar.get_y() + bar.get_height() / 2,
                f'{level * 100:.1f}%',
                ha='left',
                va='center',
                fontsize=10
            )

        ax.set_xlabel('숙달도 (%)', fontsize=12)
        ax.set_title('주제별 숙달도', fontsize=14, fontweight='bold')
        ax.set_xlim(0, 110)
        ax.grid(axis='x', alpha=0.3)

        plt.tight_layout()
        return fig

    def create_progress_line_chart(
        self,
        dates: List[str],
        problems_solved: List[int],
        problems_correct: List[int],
        figsize: Tuple[int, int] = (12, 6)
    ) -> plt.Figure:
        """
        학습 진행 추이 선 그래프

        Args:
            dates: 날짜 목록
            problems_solved: 풀이한 문제 수
            problems_correct: 정답 수
            figsize: 그래프 크기

        Returns:
            matplotlib Figure 객체
        """
        fig, (ax1, ax2) = plt.subplots(2, 1, figsize=figsize)

        # 문제 수 추이
        ax1.plot(dates, problems_solved, marker='o', linewidth=2,
                 color='#3a9ad9', label='풀이 수')
        ax1.plot(dates, problems_correct, marker='s', linewidth=2,
                 color='#66bb6a', label='정답 수')
        ax1.set_ylabel('문제 수', fontsize=11)
        ax1.set_title('일별 학습 문제 수', fontsize=13, fontweight='bold')
        ax1.legend(loc='upper left')
        ax1.grid(alpha=0.3)

        # 정답률 추이
        accuracy = [(c / s * 100) if s > 0 else 0
                    for c, s in zip(problems_correct, problems_solved)]
        ax2.plot(dates, accuracy, marker='D', linewidth=2,
                 color='#ffa726', label='정답률')
        ax2.axhline(y=80, color='#66bb6a', linestyle='--', alpha=0.5, label='목표 (80%)')
        ax2.set_xlabel('날짜', fontsize=11)
        ax2.set_ylabel('정답률 (%)', fontsize=11)
        ax2.set_title('일별 정답률 추이', fontsize=13, fontweight='bold')
        ax2.set_ylim(0, 105)
        ax2.legend(loc='upper left')
        ax2.grid(alpha=0.3)

        plt.xticks(rotation=45)
        plt.tight_layout()
        return fig

    def create_topic_comparison_chart(
        self,
        topics: List[str],
        attempted: List[int],
        correct: List[int],
        figsize: Tuple[int, int] = (10, 6)
    ) -> plt.Figure:
        """
        주제별 풀이/정답 비교 차트

        Args:
            topics: 주제 목록
            attempted: 시도한 문제 수
            correct: 정답 수
            figsize: 그래프 크기

        Returns:
            matplotlib Figure 객체
        """
        fig, ax = plt.subplots(figsize=figsize)

        x = range(len(topics))
        width = 0.35

        bars1 = ax.bar([i - width/2 for i in x], attempted, width,
                       label='시도', color='#3a9ad9', alpha=0.8)
        bars2 = ax.bar([i + width/2 for i in x], correct, width,
                       label='정답', color='#66bb6a', alpha=0.8)

        # 값 표시
        for bars in [bars1, bars2]:
            for bar in bars:
                height = bar.get_height()
                ax.text(
                    bar.get_x() + bar.get_width() / 2,
                    height + 0.5,
                    f'{int(height)}',
                    ha='center',
                    va='bottom',
                    fontsize=9
                )

        ax.set_ylabel('문제 수', fontsize=12)
        ax.set_title('주제별 문제 풀이 현황', fontsize=14, fontweight='bold')
        ax.set_xticks(x)
        ax.set_xticklabels(topics, rotation=45, ha='right')
        ax.legend()
        ax.grid(axis='y', alpha=0.3)

        plt.tight_layout()
        return fig

    def create_study_time_pie_chart(
        self,
        topics: List[str],
        study_times: List[int],
        figsize: Tuple[int, int] = (8, 8)
    ) -> plt.Figure:
        """
        주제별 학습 시간 파이 차트

        Args:
            topics: 주제 목록
            study_times: 학습 시간 (분)
            figsize: 그래프 크기

        Returns:
            matplotlib Figure 객체
        """
        fig, ax = plt.subplots(figsize=figsize)

        # 색상 팔레트
        colors = ['#3a9ad9', '#66bb6a', '#ffa726', '#ef5350',
                  '#29b6f6', '#ffb74d', '#ab47bc', '#5c6bc0']

        # 파이 차트
        wedges, texts, autotexts = ax.pie(
            study_times,
            labels=topics,
            autopct='%1.1f%%',
            startangle=90,
            colors=colors[:len(topics)],
            textprops={'fontsize': 10}
        )

        # 퍼센트 텍스트 스타일
        for autotext in autotexts:
            autotext.set_color('white')
            autotext.set_fontweight('bold')

        ax.set_title('주제별 학습 시간 분포', fontsize=14, fontweight='bold', pad=20)

        # 범례에 시간 표시
        legend_labels = [f'{topic}: {time}분'
                        for topic, time in zip(topics, study_times)]
        ax.legend(legend_labels, loc='upper left', bbox_to_anchor=(1, 1))

        plt.tight_layout()
        return fig

    def create_weekly_heatmap(
        self,
        daily_data: Dict[str, int],
        weeks: int = 4,
        figsize: Tuple[int, int] = (12, 4)
    ) -> plt.Figure:
        """
        주간 학습 히트맵

        Args:
            daily_data: {날짜: 문제수} 딕셔너리
            weeks: 표시할 주 수
            figsize: 그래프 크기

        Returns:
            matplotlib Figure 객체
        """
        import numpy as np

        fig, ax = plt.subplots(figsize=figsize)

        # 날짜 범위 계산
        end_date = datetime.now()
        start_date = end_date - timedelta(days=weeks * 7)

        # 데이터 매트릭스 생성 (7일 x weeks주)
        data_matrix = np.zeros((7, weeks))
        day_names = ['월', '화', '수', '목', '금', '토', '일']

        for day_offset in range(weeks * 7):
            date = start_date + timedelta(days=day_offset)
            date_str = date.strftime('%Y-%m-%d')
            count = daily_data.get(date_str, 0)

            week_idx = day_offset // 7
            day_idx = date.weekday()
            data_matrix[day_idx, week_idx] = count

        # 히트맵
        im = ax.imshow(data_matrix, cmap='YlGnBu', aspect='auto')

        # 축 설정
        ax.set_xticks(range(weeks))
        ax.set_xticklabels([f'{i+1}주' for i in range(weeks)])
        ax.set_yticks(range(7))
        ax.set_yticklabels(day_names)

        # 값 표시
        for i in range(7):
            for j in range(weeks):
                value = int(data_matrix[i, j])
                if value > 0:
                    text = ax.text(j, i, value, ha='center', va='center',
                                 color='white' if value > data_matrix.max() / 2 else 'black',
                                 fontweight='bold')

        # 컬러바
        cbar = plt.colorbar(im, ax=ax)
        cbar.set_label('문제 수', rotation=270, labelpad=20)

        ax.set_title('주간 학습 활동 히트맵', fontsize=14, fontweight='bold')
        plt.tight_layout()
        return fig

    @staticmethod
    def fig_to_base64(fig: plt.Figure) -> str:
        """
        Figure를 base64 인코딩된 이미지로 변환

        Args:
            fig: matplotlib Figure

        Returns:
            base64 인코딩된 이미지 문자열
        """
        buf = io.BytesIO()
        fig.savefig(buf, format='png', dpi=100, bbox_inches='tight')
        buf.seek(0)
        img_base64 = base64.b64encode(buf.read()).decode()
        plt.close(fig)
        return img_base64

    @staticmethod
    def fig_to_html_img(fig: plt.Figure) -> str:
        """
        Figure를 HTML img 태그로 변환

        Args:
            fig: matplotlib Figure

        Returns:
            HTML img 태그
        """
        img_base64 = ProgressVisualizer.fig_to_base64(fig)
        return f'<img src="data:image/png;base64,{img_base64}" />'
