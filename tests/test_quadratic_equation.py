"""
이차방정식 풀이 테스트
"""
import pytest
import math
from src.calculators.quadratic_equation import QuadraticEquationSolver


class TestQuadraticEquationSolver:
    """이차방정식 풀이 테스트 클래스"""

    def setup_method(self):
        """각 테스트 전에 실행"""
        self.solver = QuadraticEquationSolver()

    def test_solve_two_real_roots(self):
        """서로 다른 두 실근"""
        # x² - 5x + 6 = 0 → x = 2, 3
        solution = self.solver.solve(1, -5, 6)
        assert solution.solution_type == 'two_real'
        assert solution.discriminant == 1
        assert 2 in [solution.x1, solution.x2]
        assert 3 in [solution.x1, solution.x2]

    def test_solve_one_real_root(self):
        """중근 (하나의 실근)"""
        # x² - 4x + 4 = 0 → x = 2 (중근)
        solution = self.solver.solve(1, -4, 4)
        assert solution.solution_type == 'one_real'
        assert solution.discriminant == 0
        assert solution.x1 == 2
        assert solution.x2 == 2

    def test_solve_complex_roots(self):
        """허근 (복소수 해)"""
        # x² + x + 1 = 0
        solution = self.solver.solve(1, 1, 1)
        assert solution.solution_type == 'two_complex'
        assert solution.discriminant < 0
        assert isinstance(solution.x1, complex)
        assert isinstance(solution.x2, complex)

    def test_solve_identity(self):
        """항등식 (0x² + 0x + 0 = 0)"""
        solution = self.solver.solve(0, 0, 0)
        assert solution.solution_type == 'identity'

    def test_solve_no_solution(self):
        """해 없음 (0x² + 0x + 5 = 0)"""
        solution = self.solver.solve(0, 0, 5)
        assert solution.solution_type == 'no_solution'

    def test_solve_linear_equation(self):
        """일차방정식 (a=0)"""
        # 2x + 4 = 0 → x = -2
        solution = self.solver.solve(0, 2, 4)
        assert solution.solution_type == 'one_real'
        assert solution.x1 == -2

    def test_solve_negative_coefficient_a(self):
        """음수 계수 a"""
        # -x² + 4 = 0 → x = ±2
        solution = self.solver.solve(-1, 0, 4)
        assert solution.solution_type == 'two_real'
        assert 2 in [solution.x1, solution.x2]
        assert -2 in [solution.x1, solution.x2]

    def test_solve_large_discriminant(self):
        """큰 판별식"""
        # x² - 10x + 16 = 0 → x = 2, 8
        solution = self.solver.solve(1, -10, 16)
        assert solution.solution_type == 'two_real'
        assert solution.discriminant == 36

    def test_solve_by_factoring_simple(self):
        """인수분해법: 간단한 경우"""
        # x² - 5x + 6 = 0 → (x-2)(x-3) = 0
        solution = self.solver.solve_by_factoring(1, -5, 6)
        assert solution.solution_type == 'two_real'
        assert 2 in [solution.x1, solution.x2]
        assert 3 in [solution.x1, solution.x2]

    def test_solve_by_factoring_negative_roots(self):
        """인수분해법: 음수 근"""
        # x² + 5x + 6 = 0 → (x+2)(x+3) = 0
        solution = self.solver.solve_by_factoring(1, 5, 6)
        assert solution.solution_type == 'two_real'
        assert -2 in [solution.x1, solution.x2]
        assert -3 in [solution.x1, solution.x2]

    def test_solve_by_completing_square_perfect_square(self):
        """완전제곱식법: 완전제곱수"""
        # x² - 4x + 4 = 0 → (x-2)² = 0
        solution = self.solver.solve_by_completing_square(1, -4, 4)
        assert solution.solution_type == 'one_real'
        assert solution.x1 == 2

    def test_solve_by_completing_square_two_roots(self):
        """완전제곱식법: 두 실근"""
        # x² - 6x + 5 = 0
        solution = self.solver.solve_by_completing_square(1, -6, 5)
        assert solution.solution_type == 'two_real'
        assert 1 in [solution.x1, solution.x2]
        assert 5 in [solution.x1, solution.x2]

    def test_get_vertex_form(self):
        """표준형 변환 테스트"""
        # x² + 4x + 3 → (x + 2)² - 1
        a, p, q = self.solver.get_vertex_form(1, 4, 3)
        assert a == 1
        assert p == -2
        assert q == -1

    def test_format_equation_positive_coefficients(self):
        """방정식 포맷팅: 양수 계수"""
        formatted = self.solver._format_equation(1, 2, 3)
        assert "x²" in formatted
        assert "+ 2x" in formatted
        assert "+ 3" in formatted
        assert "= 0" in formatted

    def test_format_equation_negative_coefficients(self):
        """방정식 포맷팅: 음수 계수"""
        formatted = self.solver._format_equation(1, -2, -3)
        assert "x²" in formatted
        assert "- 2x" in formatted
        assert "- 3" in formatted

    def test_sum_and_product_of_roots(self):
        """근과 계수의 관계"""
        # x² - 7x + 12 = 0 → x = 3, 4
        solution = self.solver.solve(1, -7, 12)
        sum_roots = solution.x1 + solution.x2
        product_roots = solution.x1 * solution.x2

        # 근의 합: -b/a = 7
        assert abs(sum_roots - 7) < 0.0001
        # 근의 곱: c/a = 12
        assert abs(product_roots - 12) < 0.0001

    def test_conjugate_complex_roots(self):
        """켤레 복소수 근"""
        # x² + 2x + 5 = 0
        solution = self.solver.solve(1, 2, 5)
        assert solution.solution_type == 'two_complex'
        # 실부가 같고 허부의 부호가 반대
        assert solution.x1.real == solution.x2.real
        assert solution.x1.imag == -solution.x2.imag
