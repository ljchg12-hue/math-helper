"""
학습 지원 기능 모듈
연습 문제 생성, 오답 노트, 학습 진도 추적, 계산 히스토리 등을 제공합니다.
"""
from .practice_generator import PracticeGenerator, Problem
from .mistake_notes import MistakeNotes, MistakeEntry
from .progress_tracker import ProgressTracker, TopicProgress, StudySession
from .history_manager import HistoryManager, CalculationEntry
from .visualizations import ProgressVisualizer
from .data_export import DataExporter, ProgressDataFormatter, MistakeDataFormatter

# Optional: Plotly 시각화 (plotly 설치 시에만 사용 가능)
try:
    from .visualizations_plotly import PlotlyVisualizer
    _PLOTLY_AVAILABLE = True
except ImportError:
    PlotlyVisualizer = None
    _PLOTLY_AVAILABLE = False

__all__ = [
    'PracticeGenerator',
    'Problem',
    'MistakeNotes',
    'MistakeEntry',
    'ProgressTracker',
    'TopicProgress',
    'StudySession',
    'HistoryManager',
    'CalculationEntry',
    'ProgressVisualizer',
    'PlotlyVisualizer',
    'DataExporter',
    'ProgressDataFormatter',
    'MistakeDataFormatter'
]
