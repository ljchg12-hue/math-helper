"""
일차부등식 풀이 테스트
"""
import pytest
from src.calculators.linear_inequality import LinearInequalitySolver


class TestLinearInequalitySolver:
    """일차부등식 풀이 테스트 클래스"""

    def setup_method(self):
        """각 테스트 전에 실행"""
        self.solver = LinearInequalitySolver()

    def test_solve_simple_inequality_less_than(self):
        """간단한 부등식 풀이 테스트: 2x + 3 < 7"""
        solution = self.solver.solve(2, 3, 7, '<')
        assert solution.solution_type == 'range'
        assert solution.inequality == '<'
        assert solution.value == 2.0

    def test_solve_simple_inequality_greater_than(self):
        """간단한 부등식 풀이 테스트: 3x - 5 > 10"""
        solution = self.solver.solve(3, -5, 10, '>')
        assert solution.solution_type == 'range'
        assert solution.inequality == '>'
        assert solution.value == 5.0

    def test_solve_inequality_with_negative_coefficient(self):
        """음수 계수 부등식: -2x + 4 < 8"""
        solution = self.solver.solve(-2, 4, 8, '<')
        assert solution.solution_type == 'range'
        # 음수로 나누면 부등호 방향 바뀜
        assert solution.inequality == '>'
        assert solution.value == -2.0

    def test_solve_inequality_less_than_or_equal(self):
        """이하 부등식: x + 1 ≤ 5"""
        solution = self.solver.solve(1, 1, 5, '≤')
        assert solution.solution_type == 'range'
        assert solution.inequality == '≤'
        assert solution.value == 4.0

    def test_solve_inequality_greater_than_or_equal(self):
        """이상 부등식: 2x - 3 ≥ 1"""
        solution = self.solver.solve(2, -3, 1, '≥')
        assert solution.solution_type == 'range'
        assert solution.inequality == '≥'
        assert solution.value == 2.0

    def test_solve_always_true_inequality(self):
        """항상 참인 부등식: 0x + 5 > 3"""
        solution = self.solver.solve(0, 5, 3, '>')
        assert solution.solution_type == 'all'

    def test_solve_always_false_inequality(self):
        """항상 거짓인 부등식: 0x + 2 > 5"""
        solution = self.solver.solve(0, 2, 5, '>')
        assert solution.solution_type == 'none'

    def test_solve_with_decimal_result(self):
        """소수 결과: 3x + 2 < 8"""
        solution = self.solver.solve(3, 2, 8, '<')
        assert solution.solution_type == 'range'
        assert solution.value == 2.0

    def test_solve_negative_result(self):
        """음수 결과: x + 5 < 2"""
        solution = self.solver.solve(1, 5, 2, '<')
        assert solution.solution_type == 'range'
        assert solution.value == -3.0

    def test_format_inequality(self):
        """부등식 포맷팅 테스트"""
        formatted = self.solver._format_inequality(2, 3, 7, '<')
        assert '2x' in formatted
        assert '3' in formatted
        assert '7' in formatted
        assert '<' in formatted

    def test_reverse_inequality(self):
        """부등호 방향 반전 테스트"""
        assert self.solver._reverse_inequality('<') == '>'
        assert self.solver._reverse_inequality('>') == '<'
        assert self.solver._reverse_inequality('≤') == '≥'
        assert self.solver._reverse_inequality('≥') == '≤'

    def test_check_inequality(self):
        """부등식 확인 테스트"""
        assert self.solver._check_inequality(3, 5, '<') is True
        assert self.solver._check_inequality(5, 3, '<') is False
        assert self.solver._check_inequality(5, 5, '≤') is True
        assert self.solver._check_inequality(6, 5, '>') is True
