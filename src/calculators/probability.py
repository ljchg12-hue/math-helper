"""
확률 계산 모듈
순열, 조합, 확률 등을 계산합니다.
"""
import math
from typing import List, Tuple
from dataclasses import dataclass
from ..utils.logger import get_logger

logger = get_logger()


@dataclass
class ProbabilityResult:
    """확률 계산 결과 클래스"""
    probability: float
    description: str
    steps: List[str]


class ProbabilityCalculator:
    """확률 계산기 클래스"""

    def __init__(self):
        """초기화"""
        logger.info("확률 계산기 초기화")

    def factorial(self, n: int) -> int:
        """
        팩토리얼 계산: n!

        Args:
            n: 양의 정수

        Returns:
            n!
        """
        if n < 0:
            raise ValueError("음수는 팩토리얼을 계산할 수 없습니다.")

        if n == 0 or n == 1:
            return 1

        return math.factorial(n)

    def permutation(self, n: int, r: int) -> int:
        """
        순열 계산: nPr = n! / (n-r)!

        Args:
            n: 전체 개수
            r: 선택 개수

        Returns:
            순열의 수
        """
        logger.debug(f"순열 계산: {n}P{r}")

        if r > n:
            raise ValueError("r은 n보다 클 수 없습니다.")
        if r < 0 or n < 0:
            raise ValueError("n과 r은 0 이상이어야 합니다.")

        # nPr = n! / (n-r)!
        result = self.factorial(n) // self.factorial(n - r)
        logger.info(f"순열 {n}P{r} = {result}")
        return result

    def combination(self, n: int, r: int) -> int:
        """
        조합 계산: nCr = n! / (r! × (n-r)!)

        Args:
            n: 전체 개수
            r: 선택 개수

        Returns:
            조합의 수
        """
        logger.debug(f"조합 계산: {n}C{r}")

        if r > n:
            raise ValueError("r은 n보다 클 수 없습니다.")
        if r < 0 or n < 0:
            raise ValueError("n과 r은 0 이상이어야 합니다.")

        # nCr = n! / (r! × (n-r)!)
        result = self.factorial(n) // (self.factorial(r) * self.factorial(n - r))
        logger.info(f"조합 {n}C{r} = {result}")
        return result

    def calculate_probability(
        self,
        favorable_outcomes: int,
        total_outcomes: int
    ) -> ProbabilityResult:
        """
        기본 확률 계산: P(A) = 경우의 수 / 전체 경우의 수

        Args:
            favorable_outcomes: 원하는 결과의 경우의 수
            total_outcomes: 전체 경우의 수

        Returns:
            ProbabilityResult 객체
        """
        logger.debug(f"확률 계산: {favorable_outcomes}/{total_outcomes}")

        if total_outcomes <= 0:
            raise ValueError("전체 경우의 수는 양수여야 합니다.")
        if favorable_outcomes < 0:
            raise ValueError("경우의 수는 0 이상이어야 합니다.")
        if favorable_outcomes > total_outcomes:
            raise ValueError("경우의 수는 전체 경우의 수보다 클 수 없습니다.")

        steps = []
        probability = favorable_outcomes / total_outcomes

        steps.append("확률 = 경우의 수 / 전체 경우의 수")
        steps.append(f"확률 = {favorable_outcomes} / {total_outcomes}")
        steps.append(f"확률 = {probability}")

        # 기약분수로 표현
        from math import gcd
        g = gcd(favorable_outcomes, total_outcomes)
        simplified_num = favorable_outcomes // g
        simplified_den = total_outcomes // g

        if simplified_den != 1:
            steps.append(f"기약분수: {simplified_num}/{simplified_den}")

        logger.info(f"확률 = {probability}")

        return ProbabilityResult(
            probability=probability,
            description=f"{simplified_num}/{simplified_den}" if simplified_den != 1 else str(simplified_num),
            steps=steps
        )

    def calculate_union_probability(
        self,
        p_a: float,
        p_b: float,
        p_ab: float = 0.0
    ) -> ProbabilityResult:
        """
        합사건 확률: P(A ∪ B) = P(A) + P(B) - P(A ∩ B)

        Args:
            p_a: P(A)
            p_b: P(B)
            p_ab: P(A ∩ B), 기본값 0 (배반사건)

        Returns:
            ProbabilityResult 객체
        """
        logger.debug(f"합사건 확률: P(A∪B)")

        steps = []
        steps.append("합사건 확률: P(A ∪ B) = P(A) + P(B) - P(A ∩ B)")
        steps.append(f"P(A) = {p_a}")
        steps.append(f"P(B) = {p_b}")
        steps.append(f"P(A ∩ B) = {p_ab}")

        probability = p_a + p_b - p_ab
        steps.append(f"P(A ∪ B) = {p_a} + {p_b} - {p_ab} = {probability}")

        logger.info(f"합사건 확률 = {probability}")

        return ProbabilityResult(
            probability=probability,
            description=f"{probability}",
            steps=steps
        )

    def calculate_conditional_probability(
        self,
        p_ab: float,
        p_b: float
    ) -> ProbabilityResult:
        """
        조건부 확률: P(A|B) = P(A ∩ B) / P(B)

        Args:
            p_ab: P(A ∩ B)
            p_b: P(B)

        Returns:
            ProbabilityResult 객체
        """
        logger.debug(f"조건부 확률: P(A|B)")

        if p_b == 0:
            raise ValueError("P(B)는 0이 될 수 없습니다.")

        steps = []
        steps.append("조건부 확률: P(A|B) = P(A ∩ B) / P(B)")
        steps.append(f"P(A ∩ B) = {p_ab}")
        steps.append(f"P(B) = {p_b}")

        probability = p_ab / p_b
        steps.append(f"P(A|B) = {p_ab} / {p_b} = {probability}")

        logger.info(f"조건부 확률 = {probability}")

        return ProbabilityResult(
            probability=probability,
            description=f"{probability}",
            steps=steps
        )

    def calculate_independent_probability(
        self,
        p_a: float,
        p_b: float
    ) -> ProbabilityResult:
        """
        독립사건 확률: P(A ∩ B) = P(A) × P(B)

        Args:
            p_a: P(A)
            p_b: P(B)

        Returns:
            ProbabilityResult 객체
        """
        logger.debug(f"독립사건 확률: P(A∩B)")

        steps = []
        steps.append("독립사건 확률: P(A ∩ B) = P(A) × P(B)")
        steps.append(f"P(A) = {p_a}")
        steps.append(f"P(B) = {p_b}")

        probability = p_a * p_b
        steps.append(f"P(A ∩ B) = {p_a} × {p_b} = {probability}")

        logger.info(f"독립사건 확률 = {probability}")

        return ProbabilityResult(
            probability=probability,
            description=f"{probability}",
            steps=steps
        )

    def calculate_complement_probability(self, p: float) -> ProbabilityResult:
        """
        여사건 확률: P(A') = 1 - P(A)

        Args:
            p: P(A)

        Returns:
            ProbabilityResult 객체
        """
        logger.debug(f"여사건 확률")

        steps = []
        steps.append("여사건 확률: P(A') = 1 - P(A)")
        steps.append(f"P(A) = {p}")

        probability = 1 - p
        steps.append(f"P(A') = 1 - {p} = {probability}")

        logger.info(f"여사건 확률 = {probability}")

        return ProbabilityResult(
            probability=probability,
            description=f"{probability}",
            steps=steps
        )
