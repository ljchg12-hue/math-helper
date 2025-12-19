"""
연습 문제 생성기
각 수학 주제별로 자동으로 연습 문제를 생성합니다.
"""
import random
from typing import List, Dict, Any, Tuple
from dataclasses import dataclass
from ..utils.logger import get_logger

logger = get_logger()


@dataclass
class Problem:
    """문제 클래스"""
    topic: str
    difficulty: str  # 'easy', 'medium', 'hard'
    question: str
    answer: Any
    solution_steps: List[str]
    hints: List[str]


class PracticeGenerator:
    """연습 문제 생성기 클래스"""

    def __init__(self):
        """초기화"""
        logger.info("연습 문제 생성기 초기화")
        self.topics = [
            "소인수분해", "정수와 유리수", "문자와 식", "일차방정식",
            "일차부등식", "연립방정식", "일차함수", "제곱근과 실수",
            "인수분해", "이차방정식", "이차함수", "통계", "확률", "기하", "좌표평면"
        ]

    def generate_problems(
        self,
        topic: str,
        count: int = 5,
        difficulty: str = "medium"
    ) -> List[Problem]:
        """
        특정 주제의 연습 문제 생성

        Args:
            topic: 주제
            count: 생성할 문제 수
            difficulty: 난이도 ('easy', 'medium', 'hard')

        Returns:
            Problem 리스트
        """
        logger.debug(f"문제 생성: {topic}, {count}개, {difficulty}")

        if topic not in self.topics:
            raise ValueError(f"지원하지 않는 주제: {topic}")

        problems = []
        for _ in range(count):
            problem = self._generate_single_problem(topic, difficulty)
            problems.append(problem)

        logger.info(f"{topic} 문제 {count}개 생성 완료")
        return problems

    def _generate_single_problem(self, topic: str, difficulty: str) -> Problem:
        """단일 문제 생성"""
        # 주제별 문제 생성 메서드 호출
        generators = {
            "소인수분해": self._generate_prime_factor,
            "일차방정식": self._generate_linear_equation,
            "이차방정식": self._generate_quadratic_equation,
            "통계": self._generate_statistics,
            "확률": self._generate_probability,
            "기하": self._generate_geometry,
            "좌표평면": self._generate_coordinate,
        }

        generator = generators.get(topic, self._generate_default)
        return generator(difficulty)

    def _generate_prime_factor(self, difficulty: str) -> Problem:
        """소인수분해 문제 생성"""
        if difficulty == "easy":
            num = random.randint(12, 50)
        elif difficulty == "medium":
            num = random.randint(51, 200)
        else:  # hard
            num = random.randint(201, 500)

        question = f"{num}을(를) 소인수분해하세요."

        # 실제 소인수분해 계산
        factors = []
        temp = num
        for i in range(2, int(num**0.5) + 1):
            while temp % i == 0:
                factors.append(i)
                temp //= i
        if temp > 1:
            factors.append(temp)

        answer = factors
        solution_steps = [
            f"주어진 수: {num}",
            f"소인수분해: {' × '.join(map(str, factors))}"
        ]

        return Problem(
            topic="소인수분해",
            difficulty=difficulty,
            question=question,
            answer=answer,
            solution_steps=solution_steps,
            hints=["가장 작은 소수부터 나누어보세요.", "2, 3, 5, 7, 11, ..."]
        )

    def _generate_linear_equation(self, difficulty: str) -> Problem:
        """일차방정식 문제 생성"""
        if difficulty == "easy":
            a, b = random.randint(1, 5), random.randint(1, 10)
        elif difficulty == "medium":
            a, b = random.randint(2, 10), random.randint(5, 20)
        else:  # hard
            a, b = random.randint(5, 15), random.randint(10, 50)

        # ax + b = 0 형태
        question = f"{a}x + {b} = 0을(를) 풀이하세요."
        answer = -b / a

        solution_steps = [
            f"{a}x + {b} = 0",
            f"{a}x = -{b}",
            f"x = {-b}/{a}",
            f"x = {answer}"
        ]

        return Problem(
            topic="일차방정식",
            difficulty=difficulty,
            question=question,
            answer=answer,
            solution_steps=solution_steps,
            hints=["양변에서 상수항을 이항하세요.", "계수로 양변을 나누세요."]
        )

    def _generate_quadratic_equation(self, difficulty: str) -> Problem:
        """이차방정식 문제 생성"""
        if difficulty == "easy":
            # (x-p)(x-q) = 0 형태, p, q는 작은 정수
            p, q = random.randint(1, 5), random.randint(1, 5)
        elif difficulty == "medium":
            p, q = random.randint(-5, 5), random.randint(-5, 5)
        else:  # hard
            p, q = random.randint(-10, 10), random.randint(-10, 10)

        # 전개: x² - (p+q)x + pq = 0
        a = 1
        b = -(p + q)
        c = p * q

        if b >= 0:
            question = f"x² + {b}x + {c} = 0을(를) 풀이하세요."
        else:
            question = f"x² - {abs(b)}x + {c} = 0을(를) 풀이하세요."

        answer = sorted([p, q])
        solution_steps = [
            f"이차방정식: x² + {b}x + {c} = 0",
            f"인수분해: (x - {p})(x - {q}) = 0",
            f"해: x = {p} 또는 x = {q}"
        ]

        return Problem(
            topic="이차방정식",
            difficulty=difficulty,
            question=question,
            answer=answer,
            solution_steps=solution_steps,
            hints=["인수분해를 시도해보세요.", "근의 공식을 사용할 수도 있습니다."]
        )

    def _generate_statistics(self, difficulty: str) -> Problem:
        """통계 문제 생성"""
        if difficulty == "easy":
            data = [random.randint(1, 10) for _ in range(5)]
        elif difficulty == "medium":
            data = [random.randint(1, 20) for _ in range(7)]
        else:  # hard
            data = [random.randint(1, 50) for _ in range(10)]

        question = f"다음 데이터의 평균을 구하세요: {data}"
        answer = sum(data) / len(data)

        solution_steps = [
            f"데이터: {data}",
            f"합계: {sum(data)}",
            f"개수: {len(data)}",
            f"평균 = {sum(data)} / {len(data)} = {answer}"
        ]

        return Problem(
            topic="통계",
            difficulty=difficulty,
            question=question,
            answer=answer,
            solution_steps=solution_steps,
            hints=["평균 = (모든 값의 합) / (개수)", "먼저 합을 구하세요."]
        )

    def _generate_probability(self, difficulty: str) -> Problem:
        """확률 문제 생성"""
        if difficulty == "easy":
            total = 6  # 주사위
            favorable = random.randint(1, 3)
        elif difficulty == "medium":
            total = random.randint(10, 20)
            favorable = random.randint(1, total // 2)
        else:  # hard
            total = random.randint(20, 52)
            favorable = random.randint(1, total // 3)

        question = f"전체 {total}개 중에서 원하는 결과가 {favorable}개일 때 확률을 구하세요."
        answer = favorable / total

        from math import gcd
        g = gcd(favorable, total)
        simplified_num = favorable // g
        simplified_den = total // g

        solution_steps = [
            f"전체 경우의 수: {total}",
            f"원하는 경우의 수: {favorable}",
            f"확률 = {favorable}/{total}",
            f"기약분수: {simplified_num}/{simplified_den}",
            f"소수: {answer}"
        ]

        return Problem(
            topic="확률",
            difficulty=difficulty,
            question=question,
            answer=answer,
            solution_steps=solution_steps,
            hints=["확률 = (원하는 경우) / (전체 경우)", "기약분수로 나타내세요."]
        )

    def _generate_geometry(self, difficulty: str) -> Problem:
        """기하 문제 생성"""
        if difficulty == "easy":
            a, b = random.randint(3, 5), random.randint(4, 6)
        elif difficulty == "medium":
            a, b = random.randint(5, 10), random.randint(6, 12)
        else:  # hard
            a, b = random.randint(8, 15), random.randint(10, 20)

        question = f"빗변이 아닌 두 변의 길이가 {a}와 {b}인 직각삼각형의 빗변의 길이를 구하세요."
        answer = (a**2 + b**2) ** 0.5

        solution_steps = [
            f"피타고라스 정리: a² + b² = c²",
            f"{a}² + {b}² = c²",
            f"{a**2} + {b**2} = c²",
            f"c² = {a**2 + b**2}",
            f"c = √{a**2 + b**2} = {answer}"
        ]

        return Problem(
            topic="기하",
            difficulty=difficulty,
            question=question,
            answer=answer,
            solution_steps=solution_steps,
            hints=["피타고라스 정리를 사용하세요.", "a² + b² = c²"]
        )

    def _generate_coordinate(self, difficulty: str) -> Problem:
        """좌표평면 문제 생성"""
        if difficulty == "easy":
            x1, y1 = random.randint(0, 5), random.randint(0, 5)
            x2, y2 = random.randint(0, 5), random.randint(0, 5)
        elif difficulty == "medium":
            x1, y1 = random.randint(-5, 5), random.randint(-5, 5)
            x2, y2 = random.randint(-5, 5), random.randint(-5, 5)
        else:  # hard
            x1, y1 = random.randint(-10, 10), random.randint(-10, 10)
            x2, y2 = random.randint(-10, 10), random.randint(-10, 10)

        question = f"두 점 ({x1}, {y1})과 ({x2}, {y2}) 사이의 거리를 구하세요."
        answer = ((x2 - x1)**2 + (y2 - y1)**2) ** 0.5

        solution_steps = [
            f"거리 공식: d = √[(x₂-x₁)² + (y₂-y₁)²]",
            f"d = √[({x2}-{x1})² + ({y2}-{y1})²]",
            f"d = √[{(x2-x1)**2} + {(y2-y1)**2}]",
            f"d = √{(x2-x1)**2 + (y2-y1)**2}",
            f"d = {answer}"
        ]

        return Problem(
            topic="좌표평면",
            difficulty=difficulty,
            question=question,
            answer=answer,
            solution_steps=solution_steps,
            hints=["거리 공식을 사용하세요.", "두 점 사이의 거리 = √[(x₂-x₁)² + (y₂-y₁)²]"]
        )

    def _generate_default(self, difficulty: str) -> Problem:
        """기본 문제 (미구현 주제)"""
        return Problem(
            topic="기타",
            difficulty=difficulty,
            question="이 주제는 아직 문제 생성이 지원되지 않습니다.",
            answer=None,
            solution_steps=["준비 중입니다."],
            hints=[]
        )

    def get_available_topics(self) -> List[str]:
        """사용 가능한 주제 목록 반환"""
        return self.topics.copy()
