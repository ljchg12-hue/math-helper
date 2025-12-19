"""
통계 계산 테스트
"""
import pytest
from src.calculators.statistics import StatisticsCalculator


class TestStatisticsCalculator:
    """통계 계산기 테스트 클래스"""

    def setup_method(self):
        """각 테스트 전에 실행"""
        self.calculator = StatisticsCalculator()

    def test_calculate_mean_simple(self):
        """평균 계산: 간단한 경우"""
        data = [1, 2, 3, 4, 5]
        mean = self.calculator.calculate_mean(data)
        assert mean == 3.0

    def test_calculate_mean_decimals(self):
        """평균 계산: 소수점"""
        data = [1.5, 2.5, 3.5]
        mean = self.calculator.calculate_mean(data)
        assert mean == 2.5

    def test_calculate_mean_negative(self):
        """평균 계산: 음수 포함"""
        data = [-5, 0, 5]
        mean = self.calculator.calculate_mean(data)
        assert mean == 0.0

    def test_calculate_median_odd(self):
        """중앙값 계산: 홀수 개"""
        data = [1, 3, 5, 7, 9]
        median = self.calculator.calculate_median(data)
        assert median == 5

    def test_calculate_median_even(self):
        """중앙값 계산: 짝수 개"""
        data = [1, 2, 3, 4]
        median = self.calculator.calculate_median(data)
        assert median == 2.5

    def test_calculate_median_unsorted(self):
        """중앙값 계산: 정렬되지 않은 데이터"""
        data = [5, 1, 9, 3, 7]
        median = self.calculator.calculate_median(data)
        assert median == 5

    def test_calculate_mode_single(self):
        """최빈값 계산: 단일 최빈값"""
        data = [1, 2, 2, 3, 4]
        mode = self.calculator.calculate_mode(data)
        assert mode == [2]

    def test_calculate_mode_multiple(self):
        """최빈값 계산: 여러 최빈값"""
        data = [1, 1, 2, 2, 3]
        mode = self.calculator.calculate_mode(data)
        assert set(mode) == {1, 2}

    def test_calculate_mode_none(self):
        """최빈값 계산: 최빈값 없음 (모두 같은 빈도)"""
        data = [1, 2, 3, 4]
        mode = self.calculator.calculate_mode(data)
        assert mode is None

    def test_calculate_variance_simple(self):
        """분산 계산: 간단한 경우"""
        data = [1, 2, 3, 4, 5]
        variance = self.calculator.calculate_variance(data)
        assert abs(variance - 2.0) < 0.01

    def test_calculate_variance_identical(self):
        """분산 계산: 모두 같은 값"""
        data = [5, 5, 5, 5]
        variance = self.calculator.calculate_variance(data)
        assert variance == 0.0

    def test_calculate_std_dev(self):
        """표준편차 계산"""
        data = [2, 4, 4, 4, 5, 5, 7, 9]
        variance = self.calculator.calculate_variance(data)
        std_dev = self.calculator.calculate_std_dev(variance)
        assert std_dev > 0

    def test_calculate_range(self):
        """범위 계산"""
        data = [1, 5, 3, 9, 2]
        # calculate_all을 통해 range_value를 얻음
        result = self.calculator.calculate_all(data)
        assert result.range_value == 8  # 9 - 1

    def test_calculate_quartiles(self):
        """사분위수 계산"""
        data = [1, 2, 3, 4, 5, 6, 7, 8, 9]
        q1, q2, q3 = self.calculator.calculate_quartiles(data)
        assert q2 == 5  # 중앙값
        assert q1 < q2 < q3

    def test_calculate_all(self):
        """전체 통계 계산"""
        data = [2, 4, 4, 4, 5, 5, 7, 9]
        result = self.calculator.calculate_all(data)

        assert result.mean == 5.0
        assert result.median == 4.5
        assert result.mode == [4]
        assert result.range_value == 7
        assert result.variance > 0
        assert result.std_dev > 0
        assert len(result.quartiles) == 3

    def test_empty_data_raises_error(self):
        """빈 데이터 에러 처리"""
        with pytest.raises(ValueError):
            self.calculator.calculate_mean([])

    def test_single_value(self):
        """단일 값"""
        data = [42]
        result = self.calculator.calculate_all(data)
        assert result.mean == 42
        assert result.median == 42
        assert result.variance == 0
        assert result.range_value == 0

    def test_z_score_calculation(self):
        """Z-점수 계산"""
        data = [1, 2, 3, 4, 5]
        mean = self.calculator.calculate_mean(data)
        variance = self.calculator.calculate_variance(data)
        std_dev = self.calculator.calculate_std_dev(variance)

        # 평균 값의 Z-점수는 0이어야 함
        z_score = (mean - mean) / std_dev
        assert abs(z_score) < 0.01

    def test_large_dataset(self):
        """큰 데이터셋"""
        data = list(range(1, 101))  # 1부터 100까지
        result = self.calculator.calculate_all(data)
        assert result.mean == 50.5
        assert result.median == 50.5
