"""
이차함수 그래프 모듈
y = ax² + bx + c 형태의 이차함수 그래프를 그립니다.
"""
import numpy as np
import matplotlib.pyplot as plt
from typing import Tuple, Optional, List
from matplotlib.figure import Figure
from ..utils.logger import get_logger

logger = get_logger()


class QuadraticFunctionDrawer:
    """이차함수 그래프 그리기 클래스"""

    def __init__(self, x_limit: int = 10, y_limit: int = 10):
        """
        초기화

        Args:
            x_limit: x축 제한 값
            y_limit: y축 제한 값
        """
        self.x_limit = x_limit
        self.y_limit = y_limit
        logger.info(f"이차함수 그래프 초기화 (x_limit: {x_limit}, y_limit: {y_limit})")

    def draw(
        self,
        a: float,
        b: float,
        c: float,
        x_range: Tuple[int, int],
        grid_alpha: float = 0.6
    ) -> Figure:
        """
        이차함수 그래프 그리기: y = ax² + bx + c

        Args:
            a: x²의 계수
            b: x의 계수
            c: 상수항
            x_range: x축 범위
            grid_alpha: 격자 투명도

        Returns:
            matplotlib Figure 객체
        """
        logger.debug(f"이차함수 그리기: y = {a}x² + {b}x + {c}, 범위: {x_range}")

        # 그래프 생성
        fig, ax = plt.subplots(figsize=(10, 8))

        # 축 설정
        ax.axhline(y=0, color='k', linewidth=1)
        ax.axvline(x=0, color='k', linewidth=1)
        ax.grid(True, linestyle='--', alpha=grid_alpha)

        # 함수 그래프
        start, end = x_range
        x = np.linspace(start, end, 300)
        y = a * x**2 + b * x + c

        ax.plot(x, y, label=f'y = {a}x² + {b}x + {c}', color='blue', linewidth=2)

        # 꼭짓점 계산 및 표시
        vertex_x, vertex_y = self.get_vertex(a, b, c)

        if start <= vertex_x <= end:
            ax.plot(vertex_x, vertex_y, 'ro', markersize=10, label=f'꼭짓점 ({vertex_x:.2f}, {vertex_y:.2f})')
            ax.text(vertex_x + 0.5, vertex_y + 0.5, f'({vertex_x:.2f}, {vertex_y:.2f})',
                   fontsize=10, color='red')

            # 대칭축
            ax.axvline(x=vertex_x, color='red', linestyle='--', linewidth=1.5, alpha=0.5,
                      label=f'대칭축: x = {vertex_x:.2f}')

        # y절편
        if start <= 0 <= end:
            ax.plot(0, c, 'go', markersize=8, label=f'y절편: (0, {c})')

        # x절편 (근)
        x_intercepts = self.get_x_intercepts(a, b, c)
        if x_intercepts:
            for x_int in x_intercepts:
                if start <= x_int <= end:
                    ax.plot(x_int, 0, 'mo', markersize=8)
                    ax.text(x_int, -0.5, f'({x_int:.2f}, 0)', fontsize=9, ha='center')

        ax.set_xlabel('x', fontsize=12)
        ax.set_ylabel('y', fontsize=12)
        ax.set_title(f'이차함수: y = {a}x² + {b}x + {c}', fontsize=14, fontweight='bold')
        ax.legend(fontsize=10, loc='best')

        # 축 범위 자동 조정
        ax.set_xlim(start, end)

        # y 범위는 함수 값에 따라 조정
        y_min, y_max = np.min(y), np.max(y)
        margin = (y_max - y_min) * 0.1
        ax.set_ylim(y_min - margin, y_max + margin)

        logger.info("이차함수 그래프 생성 완료")
        return fig

    def get_vertex(self, a: float, b: float, c: float) -> Tuple[float, float]:
        """
        꼭짓점 좌표 계산

        Args:
            a, b, c: 함수 계수

        Returns:
            (x, y): 꼭짓점 좌표

        Raises:
            ValueError: a가 0일 때 (일차함수)
        """
        if abs(a) < 1e-10:
            raise ValueError("a가 0이면 이차함수가 아닙니다 (일차함수)")

        x = -b / (2 * a)
        y = a * x**2 + b * x + c

        logger.debug(f"꼭짓점: ({x}, {y})")
        return (x, y)

    def get_vertex_form(self, a: float, b: float, c: float) -> Tuple[float, float, float]:
        """
        표준형으로 변환: y = a(x - p)² + q

        Args:
            a, b, c: 일반형 계수

        Returns:
            (a, p, q): 표준형 계수

        Raises:
            ValueError: a가 0일 때 (일차함수)
        """
        if abs(a) < 1e-10:
            raise ValueError("a가 0이면 이차함수가 아닙니다 (일차함수)")

        p = -b / (2 * a)
        q = c - (b**2) / (4 * a)

        logger.debug(f"표준형: y = {a}(x - {p})² + {q}")
        return (a, p, q)

    def get_x_intercepts(self, a: float, b: float, c: float) -> Optional[List[float]]:
        """
        x절편 (근) 계산

        Args:
            a, b, c: 함수 계수

        Returns:
            x절편 리스트 (없으면 None)

        Raises:
            ValueError: a가 0일 때 (일차함수)
        """
        if abs(a) < 1e-10:
            raise ValueError("a가 0이면 이차함수가 아닙니다 (일차함수)")

        # 판별식
        D = b**2 - 4 * a * c

        if D < 0:
            return None
        elif abs(D) < 1e-10:  # 부동소수점 오차 처리
            x = -b / (2 * a)
            return [x]
        else:
            sqrt_D = D ** 0.5
            x1 = (-b + sqrt_D) / (2 * a)
            x2 = (-b - sqrt_D) / (2 * a)
            return [x1, x2]

    def get_y_intercept(self, c: float) -> float:
        """
        y절편 계산

        Args:
            c: 상수항

        Returns:
            y절편
        """
        return c

    def get_axis_of_symmetry(self, a: float, b: float) -> float:
        """
        대칭축 x 좌표

        Args:
            a, b: 계수

        Returns:
            대칭축 x = p

        Raises:
            ValueError: a가 0일 때 (일차함수)
        """
        if abs(a) < 1e-10:
            raise ValueError("a가 0이면 이차함수가 아닙니다 (일차함수)")

        return -b / (2 * a)

    def translate(
        self,
        a: float,
        b: float,
        c: float,
        h: float,
        k: float
    ) -> Tuple[float, float, float]:
        """
        그래프 평행이동

        Args:
            a, b, c: 원래 함수 계수
            h: x축 방향 이동 (양수: 오른쪽)
            k: y축 방향 이동 (양수: 위)

        Returns:
            (new_a, new_b, new_c): 이동 후 계수
        """
        # 원래 함수의 꼭짓점 구하기
        p, q = self.get_vertex(a, b, c)

        # 새 꼭짓점 = 원래 꼭짓점 + 이동량
        new_p = p + h
        new_q = q + k

        # 표준형 y = a(x - new_p)² + new_q를 일반형으로 전개
        # y = ax² - 2a·new_p·x + a·new_p² + new_q
        new_a = a
        new_b = -2 * a * new_p
        new_c = a * new_p**2 + new_q

        logger.debug(f"평행이동: ({h}, {k}) → y = {new_a}x² + {new_b}x + {new_c}")
        return (new_a, new_b, new_c)

    def find_max_or_min(self, a: float, b: float, c: float) -> Tuple[str, float, float]:
        """
        최댓값 또는 최솟값

        Args:
            a, b, c: 함수 계수

        Returns:
            ("최댓값" 또는 "최솟값", x 좌표, 값)
        """
        vertex_x, vertex_y = self.get_vertex(a, b, c)

        if a > 0:
            logger.debug(f"최솟값: x = {vertex_x}, y = {vertex_y}")
            return ("최솟값", vertex_x, vertex_y)
        else:
            logger.debug(f"최댓값: x = {vertex_x}, y = {vertex_y}")
            return ("최댓값", vertex_x, vertex_y)

    def compare_graphs(
        self,
        a1: float, b1: float, c1: float,
        a2: float, b2: float, c2: float,
        x_range: Tuple[int, int]
    ) -> Figure:
        """
        두 이차함수 그래프 비교

        Args:
            a1, b1, c1: 첫 번째 함수 계수
            a2, b2, c2: 두 번째 함수 계수
            x_range: x축 범위

        Returns:
            matplotlib Figure 객체
        """
        logger.debug("두 이차함수 비교")

        fig, ax = plt.subplots(figsize=(10, 8))

        # 축 설정
        ax.axhline(y=0, color='k', linewidth=1)
        ax.axvline(x=0, color='k', linewidth=1)
        ax.grid(True, linestyle='--', alpha=0.6)

        start, end = x_range
        x = np.linspace(start, end, 300)

        # 첫 번째 함수
        y1 = a1 * x**2 + b1 * x + c1
        ax.plot(x, y1, label=f'y₁ = {a1}x² + {b1}x + {c1}', color='blue', linewidth=2)

        # 두 번째 함수
        y2 = a2 * x**2 + b2 * x + c2
        ax.plot(x, y2, label=f'y₂ = {a2}x² + {b2}x + {c2}', color='red', linewidth=2)

        # 꼭짓점 표시
        v1_x, v1_y = self.get_vertex(a1, b1, c1)
        v2_x, v2_y = self.get_vertex(a2, b2, c2)

        if start <= v1_x <= end:
            ax.plot(v1_x, v1_y, 'bo', markersize=8)
        if start <= v2_x <= end:
            ax.plot(v2_x, v2_y, 'ro', markersize=8)

        ax.set_xlabel('x', fontsize=12)
        ax.set_ylabel('y', fontsize=12)
        ax.set_title('이차함수 비교', fontsize=14, fontweight='bold')
        ax.legend(fontsize=10)

        ax.set_xlim(start, end)

        logger.info("이차함수 비교 그래프 생성 완료")
        return fig

    def draw_parabola_from_vertex(
        self,
        a: float,
        p: float,
        q: float,
        x_range: Tuple[int, int]
    ) -> Figure:
        """
        표준형으로 그래프 그리기: y = a(x - p)² + q

        Args:
            a: 계수
            p: 꼭짓점 x 좌표
            q: 꼭짓점 y 좌표
            x_range: x축 범위

        Returns:
            matplotlib Figure 객체
        """
        logger.debug(f"표준형 그래프: y = {a}(x - {p})² + {q}")

        # 표준형을 일반형으로 변환
        b = -2 * a * p
        c = a * p**2 + q

        return self.draw(a, b, c, x_range)
