"""
연립방정식 풀이 테스트
"""
import pytest
from src.calculators.simultaneous_equations import SimultaneousEquationsSolver


class TestSimultaneousEquationsSolver:
    """연립방정식 풀이 테스트 클래스"""

    def setup_method(self):
        """각 테스트 전에 실행"""
        self.solver = SimultaneousEquationsSolver()

    def test_solve_by_elimination_unique_solution(self):
        """가감법: 유일한 해"""
        # 2x + 3y = 8
        # x - y = 1
        solution = self.solver.solve_by_elimination(2, 3, 8, 1, -1, 1)
        assert solution.solution_type == 'unique'
        assert abs(solution.x - 2.2) < 0.0001
        assert abs(solution.y - 1.2) < 0.0001

    def test_solve_by_elimination_integer_coefficients(self):
        """가감법: 정수 계수"""
        # 3x + 2y = 12
        # x + y = 5
        solution = self.solver.solve_by_elimination(3, 2, 12, 1, 1, 5)
        assert solution.solution_type == 'unique'
        assert solution.x == 2.0
        assert solution.y == 3.0

    def test_solve_by_elimination_infinite_solutions(self):
        """가감법: 무수히 많은 해 (같은 직선)"""
        # 2x + 4y = 8
        # x + 2y = 4
        solution = self.solver.solve_by_elimination(2, 4, 8, 1, 2, 4)
        assert solution.solution_type == 'infinite'

    def test_solve_by_elimination_no_solution(self):
        """가감법: 해 없음 (평행선)"""
        # 2x + 3y = 5
        # 2x + 3y = 10
        solution = self.solver.solve_by_elimination(2, 3, 5, 2, 3, 10)
        assert solution.solution_type == 'none'

    def test_solve_by_substitution_unique_solution(self):
        """대입법: 유일한 해"""
        # x + y = 5
        # 2x - y = 1
        solution = self.solver.solve_by_substitution(1, 1, 5, 2, -1, 1)
        assert solution.solution_type == 'unique'
        assert solution.x == 2.0
        assert solution.y == 3.0

    def test_solve_by_substitution_negative_solution(self):
        """대입법: 음수 해"""
        # x - 2y = 4
        # 3x + y = 1
        solution = self.solver.solve_by_substitution(1, -2, 4, 3, 1, 1)
        assert solution.solution_type == 'unique'
        assert abs(solution.x - 0.857) < 0.01
        assert abs(solution.y - (-1.571)) < 0.01

    def test_solve_by_substitution_decimal_solution(self):
        """대입법: 소수 해"""
        # 2x + y = 5
        # x - y = 1
        solution = self.solver.solve_by_substitution(2, 1, 5, 1, -1, 1)
        assert solution.solution_type == 'unique'
        assert solution.x == 2.0
        assert solution.y == 1.0

    def test_solve_by_substitution_infinite_solutions(self):
        """대입법: 무수히 많은 해"""
        # 3x + 6y = 9
        # x + 2y = 3
        solution = self.solver.solve_by_substitution(3, 6, 9, 1, 2, 3)
        assert solution.solution_type == 'infinite'

    def test_solve_by_substitution_no_solution(self):
        """대입법: 해 없음"""
        # x + 2y = 3
        # x + 2y = 5
        solution = self.solver.solve_by_substitution(1, 2, 3, 1, 2, 5)
        assert solution.solution_type == 'none'

    def test_gcd_calculation(self):
        """최대공약수 계산 테스트"""
        assert self.solver._gcd(12, 8) == 4
        assert self.solver._gcd(15, 25) == 5
        assert self.solver._gcd(7, 13) == 1

    def test_solution_verification(self):
        """해 검증 테스트"""
        # 2x + 3y = 13
        # x + y = 5
        solution = self.solver.solve_by_elimination(2, 3, 13, 1, 1, 5)

        # 검산
        check1 = abs(2 * solution.x + 3 * solution.y - 13) < 0.0001
        check2 = abs(solution.x + solution.y - 5) < 0.0001

        assert check1 is True
        assert check2 is True

    def test_large_coefficients(self):
        """큰 계수 테스트"""
        # 10x + 20y = 100
        # 5x + 10y = 50
        solution = self.solver.solve_by_elimination(10, 20, 100, 5, 10, 50)
        assert solution.solution_type == 'infinite'
