"""
일차함수 그래프 모듈
y = ax + b 형태의 일차함수 그래프를 그립니다.
"""
import numpy as np
import matplotlib.pyplot as plt
from typing import Tuple, Optional
from matplotlib.figure import Figure
from ..utils.logger import get_logger

logger = get_logger()


class LinearFunctionDrawer:
    """일차함수 그래프 그리기 클래스"""

    def __init__(self, x_limit: int = 10, y_limit: int = 10):
        """
        초기화

        Args:
            x_limit: x축 제한 값
            y_limit: y축 제한 값
        """
        self.x_limit = x_limit
        self.y_limit = y_limit
        logger.info(f"일차함수 그래프 초기화 (x_limit: {x_limit}, y_limit: {y_limit})")

    def draw(
        self,
        a: float,
        b: float,
        x_range: Tuple[int, int],
        grid_alpha: float = 0.6
    ) -> Figure:
        """
        일차함수 그래프 그리기: y = ax + b

        Args:
            a: 기울기
            b: y절편
            x_range: x축 범위
            grid_alpha: 격자 투명도

        Returns:
            matplotlib Figure 객체
        """
        logger.debug(f"일차함수 그리기: y = {a}x + {b}, 범위: {x_range}")

        # 그래프 생성
        fig, ax = plt.subplots(figsize=(8, 6))

        # 축 설정
        ax.axhline(y=0, color='k', linewidth=1)
        ax.axvline(x=0, color='k', linewidth=1)
        ax.grid(True, linestyle='--', alpha=grid_alpha)

        # 함수 그래프
        start, end = x_range
        x = np.linspace(start, end, 100)
        y = a * x + b

        ax.plot(x, y, label=f'y = {a}x + {b}', color='blue', linewidth=2)

        # 기울기 표시 (삼각형)
        if a != 0:
            # 원점 근처에서 기울기 표시
            x0 = 0 if start <= 0 <= end else start
            y0 = a * x0 + b

            # 한 칸 이동
            x1 = x0 + 1
            y1 = a * x1 + b

            # 삼각형 그리기
            ax.plot([x0, x1], [y0, y0], 'r--', linewidth=1, alpha=0.7)
            ax.plot([x1, x1], [y0, y1], 'r--', linewidth=1, alpha=0.7)
            ax.plot([x0, x1], [y0, y1], 'r-', linewidth=1.5, alpha=0.7)

            # 주석
            mid_x = (x0 + x1) / 2
            ax.text(mid_x, y0 - 0.5, '1', ha='center', fontsize=9, color='red')
            ax.text(x1 + 0.3, (y0 + y1) / 2, f'{a}', ha='left', fontsize=9, color='red')

        # y절편 표시
        if start <= 0 <= end:
            ax.plot(0, b, 'ro', markersize=8)
            ax.text(0.3, b, f'({0}, {b})', fontsize=10)

        ax.set_xlabel('x', fontsize=12)
        ax.set_ylabel('y', fontsize=12)
        ax.set_title(f'일차함수: y = {a}x + {b}', fontsize=14)
        ax.legend(fontsize=10)

        logger.info("일차함수 그래프 생성 완료")
        return fig

    def find_x_intercept(self, a: float, b: float) -> Optional[float]:
        """
        x절편 구하기 (y = 0일 때 x값)

        Args:
            a: 기울기
            b: y절편

        Returns:
            x절편 (a가 0이면 None)
        """
        if a == 0:
            return None
        return -b / a

    def find_y_intercept(self, b: float) -> float:
        """
        y절편 구하기

        Args:
            b: y절편

        Returns:
            y절편
        """
        return b

    def parallel_line(
        self,
        a: float,
        point: Tuple[float, float]
    ) -> float:
        """
        주어진 점을 지나고 y = ax와 평행한 직선의 y절편 구하기

        Args:
            a: 기울기
            point: 지나는 점 (x, y)

        Returns:
            새로운 y절편
        """
        x, y = point
        # y = ax + b에서 b = y - ax
        b = y - a * x
        logger.debug(f"평행선: y = {a}x + {b}, 점 ({x}, {y})")
        return b

    def perpendicular_line(
        self,
        a: float,
        point: Tuple[float, float]
    ) -> Tuple[float, float]:
        """
        주어진 점을 지나고 y = ax + b와 수직인 직선 구하기

        Args:
            a: 원래 직선의 기울기
            point: 지나는 점

        Returns:
            (새로운 기울기, 새로운 y절편)

        Raises:
            ValueError: a가 0일 때
        """
        if a == 0:
            raise ValueError("수평선에 수직인 직선은 기울기가 무한대입니다.")

        new_a = -1 / a
        x, y = point
        new_b = y - new_a * x

        logger.debug(f"수직선: y = {new_a}x + {new_b}")
        return (new_a, new_b)
