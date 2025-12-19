"""
pytest 설정 및 공통 픽스처
"""
import sys
from pathlib import Path

# 프로젝트 루트를 Python 경로에 추가
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

import pytest


@pytest.fixture
def sample_prime_numbers():
    """소수 샘플 데이터"""
    return [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]


@pytest.fixture
def sample_composite_numbers():
    """합성수 샘플 데이터"""
    return {
        12: {2: 2, 3: 1},  # 12 = 2^2 * 3
        24: {2: 3, 3: 1},  # 24 = 2^3 * 3
        100: {2: 2, 5: 2}, # 100 = 2^2 * 5^2
        360: {2: 3, 3: 2, 5: 1}  # 360 = 2^3 * 3^2 * 5
    }
