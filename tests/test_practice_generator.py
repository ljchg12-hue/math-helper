"""
연습 문제 생성기 테스트
"""
import pytest
from src.features.practice_generator import PracticeGenerator


class TestPracticeGenerator:
    """연습 문제 생성기 테스트 클래스"""

    def setup_method(self):
        """각 테스트 전에 실행"""
        self.generator = PracticeGenerator()

    def test_initialization(self):
        """초기화 테스트"""
        assert self.generator is not None
        assert len(self.generator.topics) > 0

    def test_get_available_topics(self):
        """사용 가능한 주제 조회"""
        topics = self.generator.get_available_topics()
        assert isinstance(topics, list)
        assert "일차방정식" in topics
        assert "이차방정식" in topics

    def test_generate_problems_linear_equation(self):
        """일차방정식 문제 생성"""
        problems = self.generator.generate_problems("일차방정식", count=3, difficulty="easy")
        assert len(problems) == 3
        for problem in problems:
            assert problem.topic == "일차방정식"
            assert problem.difficulty == "easy"
            assert problem.question != ""
            assert problem.answer is not None

    def test_generate_problems_quadratic_equation(self):
        """이차방정식 문제 생성"""
        problems = self.generator.generate_problems("이차방정식", count=5, difficulty="medium")
        assert len(problems) == 5
        for problem in problems:
            assert problem.topic == "이차방정식"
            assert isinstance(problem.answer, list)  # 두 개의 해

    def test_generate_problems_statistics(self):
        """통계 문제 생성"""
        problems = self.generator.generate_problems("통계", count=2, difficulty="hard")
        assert len(problems) == 2
        for problem in problems:
            assert problem.topic == "통계"
            assert len(problem.solution_steps) > 0

    def test_generate_problems_probability(self):
        """확률 문제 생성"""
        problems = self.generator.generate_problems("확률", count=4)
        assert len(problems) == 4
        for problem in problems:
            assert 0 <= problem.answer <= 1  # 확률은 0과 1 사이

    def test_generate_problems_geometry(self):
        """기하 문제 생성"""
        problems = self.generator.generate_problems("기하", count=3)
        assert len(problems) == 3
        for problem in problems:
            assert problem.answer > 0  # 길이는 양수

    def test_generate_problems_coordinate(self):
        """좌표평면 문제 생성"""
        problems = self.generator.generate_problems("좌표평면", count=2)
        assert len(problems) == 2
        for problem in problems:
            assert problem.answer >= 0  # 거리는 0 이상

    def test_generate_problems_invalid_topic(self):
        """잘못된 주제 에러"""
        with pytest.raises(ValueError):
            self.generator.generate_problems("존재하지않는주제", count=1)

    def test_problem_has_hints(self):
        """힌트 포함 여부"""
        problems = self.generator.generate_problems("일차방정식", count=1)
        assert len(problems[0].hints) > 0

    def test_problem_has_steps(self):
        """풀이 과정 포함 여부"""
        problems = self.generator.generate_problems("통계", count=1)
        assert len(problems[0].solution_steps) > 0

    def test_difficulty_levels(self):
        """난이도 레벨 테스트"""
        easy = self.generator.generate_problems("일차방정식", count=1, difficulty="easy")
        medium = self.generator.generate_problems("일차방정식", count=1, difficulty="medium")
        hard = self.generator.generate_problems("일차방정식", count=1, difficulty="hard")

        assert easy[0].difficulty == "easy"
        assert medium[0].difficulty == "medium"
        assert hard[0].difficulty == "hard"
