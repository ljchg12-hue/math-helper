"""
함수 그래프 모듈
정비례, 반비례 함수의 그래프를 그립니다.
"""
import numpy as np
import matplotlib.pyplot as plt
from typing import Tuple, Union
from matplotlib.figure import Figure
from ..utils.logger import get_logger

logger = get_logger()


class FunctionGraphDrawer:
    """함수 그래프 그리기 클래스"""

    def __init__(self, y_limit: int = 10):
        """
        초기화

        Args:
            y_limit: y축 제한 값
        """
        self.y_limit = y_limit
        logger.info(f"함수 그래프 그리기 초기화 (y_limit: {y_limit})")

    def validate_parameters(
        self,
        a: Union[int, float],
        x_range: Tuple[int, int]
    ) -> Tuple[bool, str]:
        """
        매개변수 검증

        Args:
            a: 함수의 상수 a
            x_range: x축 범위 (시작, 끝)

        Returns:
            (검증 성공 여부, 에러 메시지)
        """
        try:
            float(a)
        except (ValueError, TypeError):
            return False, "a 값은 숫자여야 합니다."

        if len(x_range) != 2:
            return False, "x 범위는 (시작, 끝) 형태여야 합니다."

        start, end = x_range
        if start >= end:
            return False, "x 범위의 시작 값이 끝 값보다 작아야 합니다."

        return True, ""

    def draw_proportional(
        self,
        a: Union[int, float],
        x_range: Tuple[int, int],
        grid_alpha: float = 0.6
    ) -> Figure:
        """
        정비례 함수 그래프 그리기 (y = ax)

        Args:
            a: 비례 상수
            x_range: x축 범위
            grid_alpha: 격자 투명도

        Returns:
            matplotlib Figure 객체

        Raises:
            ValueError: 매개변수가 유효하지 않을 때
        """
        # 입력 검증
        is_valid, error_msg = self.validate_parameters(a, x_range)
        if not is_valid:
            logger.error(f"정비례 함수 매개변수 검증 실패: {error_msg}")
            raise ValueError(error_msg)

        a = float(a)
        start, end = x_range
        logger.debug(f"정비례 함수 그리기: y = {a}x, 범위: [{start}, {end}]")

        # 그래프 생성
        fig, ax = plt.subplots(figsize=(8, 6))

        # x축, y축 중심선
        ax.axhline(y=0, color='k', linewidth=1)
        ax.axvline(x=0, color='k', linewidth=1)
        ax.grid(True, linestyle='--', alpha=grid_alpha)

        # 함수 그래프
        x = np.linspace(start, end, 100)
        y = a * x
        ax.plot(x, y, label=f'y = {a}x', color='blue', linewidth=2)

        ax.set_xlabel('x', fontsize=12)
        ax.set_ylabel('y', fontsize=12)
        ax.set_title(f'정비례 함수: y = {a}x', fontsize=14)
        ax.legend(fontsize=10)

        logger.info("정비례 함수 그래프 생성 완료")
        return fig

    def draw_inverse_proportional(
        self,
        a: Union[int, float],
        x_range: Tuple[int, int],
        grid_alpha: float = 0.6
    ) -> Figure:
        """
        반비례 함수 그래프 그리기 (y = a/x)

        Args:
            a: 비례 상수
            x_range: x축 범위
            grid_alpha: 격자 투명도

        Returns:
            matplotlib Figure 객체

        Raises:
            ValueError: 매개변수가 유효하지 않을 때
        """
        # 입력 검증
        is_valid, error_msg = self.validate_parameters(a, x_range)
        if not is_valid:
            logger.error(f"반비례 함수 매개변수 검증 실패: {error_msg}")
            raise ValueError(error_msg)

        a = float(a)

        if a == 0:
            logger.error("반비례 함수: a가 0일 수 없습니다.")
            raise ValueError("a가 0이면 반비례 그래프를 그릴 수 없습니다.")

        start, end = x_range
        logger.debug(f"반비례 함수 그리기: y = {a}/x, 범위: [{start}, {end}]")

        # 그래프 생성
        fig, ax = plt.subplots(figsize=(8, 6))

        # x축, y축 중심선
        ax.axhline(y=0, color='k', linewidth=1)
        ax.axvline(x=0, color='k', linewidth=1)
        ax.grid(True, linestyle='--', alpha=grid_alpha)

        # 0을 포함하지 않도록 구간 분리
        if start < 0:
            x_neg = np.linspace(start, -0.01, 100)
            y_neg = a / x_neg
            ax.plot(x_neg, y_neg, color='red', linewidth=2)

        if end > 0:
            x_pos = np.linspace(0.01, end, 100)
            y_pos = a / x_pos
            ax.plot(x_pos, y_pos, color='red', linewidth=2, label=f'y = {a}/x')

        # y축 범위 제한 (무한대 발산 방지)
        ax.set_ylim(-self.y_limit, self.y_limit)

        ax.set_xlabel('x', fontsize=12)
        ax.set_ylabel('y', fontsize=12)
        ax.set_title(f'반비례 함수: y = {a}/x', fontsize=14)
        ax.legend(fontsize=10)

        logger.info("반비례 함수 그래프 생성 완료")
        return fig

    def draw_function(
        self,
        func_type: str,
        a: Union[int, float],
        x_range: Tuple[int, int]
    ) -> Figure:
        """
        함수 그래프 그리기 (통합 메서드)

        Args:
            func_type: 함수 종류 ('proportional' or 'inverse')
            a: 비례 상수
            x_range: x축 범위

        Returns:
            matplotlib Figure 객체

        Raises:
            ValueError: 함수 종류가 유효하지 않을 때
        """
        if func_type == 'proportional':
            return self.draw_proportional(a, x_range)
        elif func_type == 'inverse':
            return self.draw_inverse_proportional(a, x_range)
        else:
            logger.error(f"지원하지 않는 함수 종류: {func_type}")
            raise ValueError(f"지원하지 않는 함수 종류: {func_type}")
