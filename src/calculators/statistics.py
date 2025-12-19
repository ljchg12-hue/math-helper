"""
통계 계산 모듈
평균, 중앙값, 최빈값, 분산, 표준편차 등을 계산합니다.
"""
import math
from typing import List, Dict, Tuple, Optional
from dataclasses import dataclass
from collections import Counter
from ..utils.logger import get_logger

logger = get_logger()


@dataclass
class StatisticsResult:
    """통계 결과 클래스"""
    data: List[float]
    mean: float  # 평균
    median: float  # 중앙값
    mode: Optional[List[float]]  # 최빈값 (여러 개 가능)
    variance: float  # 분산
    std_dev: float  # 표준편차
    range_value: float  # 범위
    quartiles: Tuple[float, float, float]  # Q1, Q2(median), Q3
    steps: List[str]


class StatisticsCalculator:
    """통계 계산기 클래스"""

    def __init__(self):
        """초기화"""
        logger.info("통계 계산기 초기화")

    def calculate_all(self, data: List[float]) -> StatisticsResult:
        """
        모든 통계량 계산

        Args:
            data: 데이터 리스트

        Returns:
            StatisticsResult 객체
        """
        logger.debug(f"통계 계산: {len(data)}개 데이터")

        if not data:
            raise ValueError("데이터가 비어있습니다.")

        steps = []
        steps.append(f"주어진 데이터: {data}")
        steps.append(f"데이터 개수: {len(data)}")

        # 평균
        mean = self.calculate_mean(data)
        steps.append(f"\n평균 = {sum(data)} / {len(data)} = {mean}")

        # 중앙값
        median = self.calculate_median(data)
        sorted_data = sorted(data)
        steps.append(f"\n정렬된 데이터: {sorted_data}")
        steps.append(f"중앙값 = {median}")

        # 최빈값
        mode = self.calculate_mode(data)
        if mode:
            steps.append(f"\n최빈값: {mode}")
        else:
            steps.append("\n최빈값: 없음 (모든 값의 빈도가 같음)")

        # 분산
        variance = self.calculate_variance(data, mean)
        steps.append(f"\n분산 = {variance}")

        # 표준편차
        std_dev = self.calculate_std_dev(variance)
        steps.append(f"표준편차 = √{variance} = {std_dev}")

        # 범위
        range_value = max(data) - min(data)
        steps.append(f"\n범위 = {max(data)} - {min(data)} = {range_value}")

        # 사분위수
        q1, q2, q3 = self.calculate_quartiles(data)
        steps.append(f"\n사분위수:")
        steps.append(f"  Q1 (제1사분위수) = {q1}")
        steps.append(f"  Q2 (제2사분위수, 중앙값) = {q2}")
        steps.append(f"  Q3 (제3사분위수) = {q3}")
        steps.append(f"  IQR (사분위수 범위) = {q3 - q1}")

        logger.info(f"통계 계산 완료: 평균={mean}, 중앙값={median}")

        return StatisticsResult(
            data=data,
            mean=mean,
            median=median,
            mode=mode,
            variance=variance,
            std_dev=std_dev,
            range_value=range_value,
            quartiles=(q1, q2, q3),
            steps=steps
        )

    def calculate_mean(self, data: List[float]) -> float:
        """평균 계산"""
        if not data:
            raise ValueError("데이터가 비어있습니다.")
        return sum(data) / len(data)

    def calculate_median(self, data: List[float]) -> float:
        """중앙값 계산"""
        if not data:
            raise ValueError("데이터가 비어있습니다.")

        sorted_data = sorted(data)
        n = len(sorted_data)

        if n % 2 == 0:
            # 짝수 개: 중간 두 값의 평균
            return (sorted_data[n // 2 - 1] + sorted_data[n // 2]) / 2
        else:
            # 홀수 개: 중간 값
            return sorted_data[n // 2]

    def calculate_mode(self, data: List[float]) -> Optional[List[float]]:
        """
        최빈값 계산

        Returns:
            최빈값 리스트 (여러 개일 수 있음) 또는 None
        """
        if not data:
            raise ValueError("데이터가 비어있습니다.")

        counter = Counter(data)
        max_count = max(counter.values())

        # 모든 값의 빈도가 같으면 최빈값 없음
        if max_count == 1:
            return None

        # 최대 빈도를 가진 값들
        modes = [value for value, count in counter.items() if count == max_count]
        return sorted(modes)

    def calculate_variance(self, data: List[float], mean: Optional[float] = None) -> float:
        """
        분산 계산

        Args:
            data: 데이터 리스트
            mean: 평균 (미리 계산된 경우)

        Returns:
            분산
        """
        if not data:
            raise ValueError("데이터가 비어있습니다.")

        if mean is None:
            mean = self.calculate_mean(data)

        # 분산 = Σ(x - mean)² / n
        squared_diffs = [(x - mean) ** 2 for x in data]
        variance = sum(squared_diffs) / len(data)

        return variance

    def calculate_std_dev(self, variance: float) -> float:
        """표준편차 계산"""
        return math.sqrt(variance)

    def calculate_quartiles(self, data: List[float]) -> Tuple[float, float, float]:
        """
        사분위수 계산

        Returns:
            (Q1, Q2, Q3)
        """
        if not data:
            raise ValueError("데이터가 비어있습니다.")

        sorted_data = sorted(data)
        n = len(sorted_data)

        # Q2 (중앙값)
        q2 = self.calculate_median(sorted_data)

        # Q1 (하위 50%의 중앙값)
        if n % 2 == 0:
            lower_half = sorted_data[:n // 2]
        else:
            lower_half = sorted_data[:n // 2]
        q1 = self.calculate_median(lower_half) if lower_half else sorted_data[0]

        # Q3 (상위 50%의 중앙값)
        if n % 2 == 0:
            upper_half = sorted_data[n // 2:]
        else:
            upper_half = sorted_data[n // 2 + 1:]
        q3 = self.calculate_median(upper_half) if upper_half else sorted_data[-1]

        return (q1, q2, q3)

    def calculate_frequency_table(self, data: List[float]) -> Dict[float, int]:
        """도수분포표 생성"""
        if not data:
            raise ValueError("데이터가 비어있습니다.")

        return dict(Counter(data))

    def calculate_z_score(self, value: float, mean: float, std_dev: float) -> float:
        """
        z-점수 (표준점수) 계산

        Args:
            value: 데이터 값
            mean: 평균
            std_dev: 표준편차

        Returns:
            z-점수
        """
        if std_dev == 0:
            raise ValueError("표준편차가 0입니다.")

        return (value - mean) / std_dev
