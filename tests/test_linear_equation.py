"""
일차방정식 풀이 테스트
"""
import pytest
from src.calculators.linear_equation import LinearEquationSolver, EquationSolution


class TestLinearEquationSolver:
    """일차방정식 풀이 테스트 클래스"""

    def setup_method(self):
        """각 테스트 전에 실행"""
        self.solver = LinearEquationSolver()

    def test_validate_coefficients_valid(self):
        """유효한 계수 검증 테스트"""
        is_valid, msg = self.solver.validate_coefficients(2, 3, 7)
        assert is_valid is True
        assert msg == ""

    def test_validate_coefficients_invalid_type(self):
        """유효하지 않은 타입 검증 테스트"""
        is_valid, msg = self.solver.validate_coefficients("a", 3, 7)
        assert is_valid is False
        assert "유효한 숫자" in msg

    def test_solve_unique_solution_integer(self):
        """정수 해 테스트: 2x + 3 = 7 → x = 2"""
        solution = self.solver.solve(2, 3, 7)
        assert solution.solution_type == 'unique'
        assert solution.value == 2
        assert len(solution.steps) > 0

    def test_solve_unique_solution_float(self):
        """실수 해 테스트: 3x + 2 = 5 → x = 1"""
        solution = self.solver.solve(3, 2, 5)
        assert solution.solution_type == 'unique'
        assert solution.value == 1

    def test_solve_unique_solution_negative(self):
        """음수 해 테스트: x + 5 = 2 → x = -3"""
        solution = self.solver.solve(1, 5, 2)
        assert solution.solution_type == 'unique'
        assert solution.value == -3

    def test_solve_infinite_solutions(self):
        """무한 해 테스트: 0x + 0 = 0 (항등식)"""
        solution = self.solver.solve(0, 0, 0)
        assert solution.solution_type == 'infinite'
        assert solution.value is None
        assert any("무수히" in step for step in solution.steps)

    def test_solve_no_solution(self):
        """해 없음 테스트: 0x + 5 = 3 (모순)"""
        solution = self.solver.solve(0, 5, 3)
        assert solution.solution_type == 'none'
        assert solution.value is None
        assert any("없습니다" in step for step in solution.steps)

    def test_solve_negative_coefficient(self):
        """음수 계수 테스트: -2x + 4 = 8 → x = -2"""
        solution = self.solver.solve(-2, 4, 8)
        assert solution.solution_type == 'unique'
        assert solution.value == -2

    def test_solve_decimal_result(self):
        """소수 결과 테스트: 3x + 1 = 4 → x = 1"""
        solution = self.solver.solve(3, 1, 4)
        assert solution.solution_type == 'unique'
        assert solution.value == 1

    def test_format_equation_positive_b(self):
        """양수 b 포맷팅 테스트"""
        eq = self.solver._format_equation(2, 3, 7)
        assert eq == "2x + 3 = 7"

    def test_format_equation_negative_b(self):
        """음수 b 포맷팅 테스트"""
        eq = self.solver._format_equation(2, -3, 7)
        assert eq == "2x - 3 = 7"

    def test_format_equation_coefficient_one(self):
        """계수 1인 경우 포맷팅 테스트"""
        eq = self.solver._format_equation(1, 0, 5)
        assert eq == "x = 5"

    def test_format_equation_coefficient_negative_one(self):
        """계수 -1인 경우 포맷팅 테스트"""
        eq = self.solver._format_equation(-1, 2, 5)
        assert eq == "-x + 2 = 5"

    def test_get_latex_equation(self):
        """LaTeX 방정식 포맷 테스트"""
        latex = self.solver.get_latex_equation(2, 3, 7)
        assert latex == "2x + 3 = 7"

    def test_solve_raises_on_invalid_input(self):
        """유효하지 않은 입력 시 예외 발생 테스트"""
        with pytest.raises(ValueError):
            self.solver.solve("invalid", 3, 7)

    def test_solution_steps_structure(self):
        """풀이 과정 구조 테스트"""
        solution = self.solver.solve(2, 3, 7)
        assert solution.steps[0].startswith("주어진 방정식:")
        assert any("1." in step for step in solution.steps)
        assert any("2." in step for step in solution.steps)
        assert any("3." in step for step in solution.steps)


class TestEquationSolution:
    """EquationSolution 데이터클래스 테스트"""

    def test_unique_solution_creation(self):
        """고유 해 생성 테스트"""
        solution = EquationSolution(
            solution_type='unique',
            value=5.0,
            steps=["step 1", "step 2"]
        )
        assert solution.solution_type == 'unique'
        assert solution.value == 5.0
        assert len(solution.steps) == 2

    def test_infinite_solution_creation(self):
        """무한 해 생성 테스트"""
        solution = EquationSolution(
            solution_type='infinite',
            steps=["step 1"]
        )
        assert solution.solution_type == 'infinite'
        assert solution.value is None

    def test_post_init_empty_steps(self):
        """steps 기본값 테스트"""
        solution = EquationSolution(solution_type='unique', value=1.0)
        assert solution.steps == []
