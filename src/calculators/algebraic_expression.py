"""
문자와 식 계산 모듈
단항식, 다항식의 연산, 동류항 정리, 값 대입 등을 수행합니다.
"""
from typing import Dict, List, Tuple, Optional, Union
from dataclasses import dataclass
import re
from ..utils.logger import get_logger

logger = get_logger()


@dataclass
class Term:
    """항(term) 클래스"""
    coefficient: float  # 계수
    variables: Dict[str, int]  # 문자와 차수 {'x': 2, 'y': 1} = x²y

    def __str__(self) -> str:
        """문자열 표현"""
        if not self.variables:
            return str(self.coefficient)

        # 계수 부분
        if self.coefficient == 1 and self.variables:
            coef_str = ""
        elif self.coefficient == -1 and self.variables:
            coef_str = "-"
        else:
            coef_str = str(self.coefficient) if self.coefficient != int(self.coefficient) else str(int(self.coefficient))

        # 변수 부분
        var_parts = []
        for var, power in sorted(self.variables.items()):
            if power == 1:
                var_parts.append(var)
            else:
                var_parts.append(f"{var}^{power}")

        var_str = "".join(var_parts)
        return f"{coef_str}{var_str}" if coef_str else var_str

    def __eq__(self, other) -> bool:
        """동류항 판별"""
        if not isinstance(other, Term):
            return False
        return self.variables == other.variables

    def __hash__(self):
        """해시 (딕셔너리 키로 사용하기 위함)"""
        return hash(frozenset(self.variables.items()))


class AlgebraicCalculator:
    """문자와 식 계산기 클래스"""

    def __init__(self):
        """초기화"""
        logger.info("문자와 식 계산기 초기화")

    def parse_term(self, term_str: str) -> Term:
        """
        항 문자열을 Term 객체로 파싱

        Args:
            term_str: 항 문자열 (예: "3x^2", "-2xy", "5")

        Returns:
            Term 객체

        Raises:
            ValueError: 파싱 실패 시
        """
        term_str = term_str.strip().replace(" ", "")

        # 계수 추출
        coef_match = re.match(r'^([+-]?\d*\.?\d*)', term_str)
        if coef_match:
            coef_str = coef_match.group(1)
            if coef_str in ['', '+']:
                coefficient = 1.0
            elif coef_str == '-':
                coefficient = -1.0
            else:
                coefficient = float(coef_str)
        else:
            coefficient = 1.0

        # 변수 부분 추출
        var_part = term_str[len(coef_match.group(1)):] if coef_match else term_str

        # 변수와 차수 파싱
        variables = {}
        if var_part:
            # x^2y^3 형태 또는 xy 형태
            var_matches = re.findall(r'([a-zA-Z])(?:\^(\d+))?', var_part)
            for var, power in var_matches:
                power = int(power) if power else 1
                variables[var] = variables.get(var, 0) + power

        return Term(coefficient, variables)

    def parse_expression(self, expr_str: str) -> List[Term]:
        """
        식을 항들의 리스트로 파싱

        Args:
            expr_str: 식 문자열 (예: "3x^2 + 2x - 5")

        Returns:
            Term 객체 리스트
        """
        # 공백 제거 및 정규화
        expr_str = expr_str.replace(" ", "")

        # 항으로 분리 (+ 또는 - 기준)
        terms = []
        current_term = ""

        for i, char in enumerate(expr_str):
            if char in ['+', '-'] and i > 0:
                if current_term:
                    terms.append(self.parse_term(current_term))
                current_term = char if char == '-' else ""
            else:
                current_term += char

        if current_term:
            terms.append(self.parse_term(current_term))

        logger.debug(f"파싱 결과: {expr_str} → {len(terms)}개 항")
        return terms

    def simplify(self, terms: List[Term]) -> List[Term]:
        """
        동류항 정리

        Args:
            terms: 항 리스트

        Returns:
            정리된 항 리스트
        """
        # 동류항끼리 그룹화
        term_groups: Dict[frozenset, float] = {}

        for term in terms:
            key = frozenset(term.variables.items())
            term_groups[key] = term_groups.get(key, 0) + term.coefficient

        # 결과 생성
        result = []
        for var_set, coef in term_groups.items():
            if coef != 0:  # 계수가 0이 아닌 것만
                variables = dict(var_set)
                result.append(Term(coef, variables))

        # 차수 순으로 정렬 (높은 차수부터)
        result.sort(key=lambda t: (sum(t.variables.values()), str(t.variables)), reverse=True)

        logger.debug(f"동류항 정리: {len(terms)}개 → {len(result)}개")
        return result

    def add(self, expr1: str, expr2: str) -> str:
        """
        다항식 덧셈

        Args:
            expr1: 첫 번째 식
            expr2: 두 번째 식

        Returns:
            덧셈 결과
        """
        terms1 = self.parse_expression(expr1)
        terms2 = self.parse_expression(expr2)

        all_terms = terms1 + terms2
        result_terms = self.simplify(all_terms)

        return self._format_expression(result_terms)

    def subtract(self, expr1: str, expr2: str) -> str:
        """
        다항식 뺄셈

        Args:
            expr1: 첫 번째 식
            expr2: 두 번째 식

        Returns:
            뺄셈 결과
        """
        terms1 = self.parse_expression(expr1)
        terms2 = self.parse_expression(expr2)

        # 두 번째 식의 부호 반전
        for term in terms2:
            term.coefficient *= -1

        all_terms = terms1 + terms2
        result_terms = self.simplify(all_terms)

        return self._format_expression(result_terms)

    def multiply_monomials(self, mono1: str, mono2: str) -> str:
        """
        단항식 곱셈

        Args:
            mono1: 첫 번째 단항식
            mono2: 두 번째 단항식

        Returns:
            곱셈 결과
        """
        term1 = self.parse_term(mono1)
        term2 = self.parse_term(mono2)

        # 계수 곱하기
        new_coef = term1.coefficient * term2.coefficient

        # 변수 합치기 (차수 더하기)
        new_vars = term1.variables.copy()
        for var, power in term2.variables.items():
            new_vars[var] = new_vars.get(var, 0) + power

        result = Term(new_coef, new_vars)
        return str(result)

    def divide_monomials(self, mono1: str, mono2: str) -> str:
        """
        단항식 나눗셈

        Args:
            mono1: 분자 (나뉘는 식)
            mono2: 분모 (나누는 식)

        Returns:
            나눗셈 결과

        Raises:
            ValueError: 나눗셈이 불가능한 경우
        """
        term1 = self.parse_term(mono1)
        term2 = self.parse_term(mono2)

        if term2.coefficient == 0:
            raise ValueError("0으로 나눌 수 없습니다.")

        # 계수 나누기
        new_coef = term1.coefficient / term2.coefficient

        # 변수 나누기 (차수 빼기)
        new_vars = term1.variables.copy()
        for var, power in term2.variables.items():
            if var not in new_vars or new_vars[var] < power:
                raise ValueError(f"나눗셈 불가: {mono1} ÷ {mono2}")
            new_vars[var] -= power
            if new_vars[var] == 0:
                del new_vars[var]

        result = Term(new_coef, new_vars)
        return str(result)

    def substitute(self, expr: str, values: Dict[str, float]) -> float:
        """
        문자에 값 대입

        Args:
            expr: 식
            values: 변수와 값의 딕셔너리 {'x': 2, 'y': 3}

        Returns:
            계산 결과
        """
        terms = self.parse_expression(expr)
        result = 0.0

        for term in terms:
            # 각 항의 값 계산
            term_value = term.coefficient

            for var, power in term.variables.items():
                if var not in values:
                    raise ValueError(f"변수 '{var}'의 값이 제공되지 않았습니다.")
                term_value *= (values[var] ** power)

            result += term_value

        logger.debug(f"대입 계산: {expr}, {values} → {result}")
        return result

    def expand(self, expr: str) -> str:
        """
        식 전개 (간단한 경우만: (a+b)(c+d) 형태)

        Args:
            expr: 전개할 식

        Returns:
            전개된 식
        """
        # 간단한 (a+b)(c+d) 형태 처리
        pattern = r'\(([^)]+)\)\(([^)]+)\)'
        match = re.search(pattern, expr)

        if not match:
            return expr

        poly1, poly2 = match.groups()
        terms1 = self.parse_expression(poly1)
        terms2 = self.parse_expression(poly2)

        # 분배법칙 적용
        result_terms = []
        for t1 in terms1:
            for t2 in terms2:
                new_coef = t1.coefficient * t2.coefficient
                new_vars = t1.variables.copy()
                for var, power in t2.variables.items():
                    new_vars[var] = new_vars.get(var, 0) + power
                result_terms.append(Term(new_coef, new_vars))

        simplified = self.simplify(result_terms)
        return self._format_expression(simplified)

    def _format_expression(self, terms: List[Term]) -> str:
        """
        항 리스트를 문자열로 포맷팅

        Args:
            terms: 항 리스트

        Returns:
            포맷팅된 식
        """
        if not terms:
            return "0"

        parts = []
        for i, term in enumerate(terms):
            term_str = str(term)

            if i == 0:
                parts.append(term_str)
            else:
                if term.coefficient >= 0:
                    parts.append(f" + {term_str}")
                else:
                    # 음수인 경우 - 부호만 표시
                    parts.append(f" - {term_str[1:]}")  # 앞의 - 제거

        return "".join(parts)

    def get_degree(self, expr: str) -> int:
        """
        다항식의 차수 구하기

        Args:
            expr: 식

        Returns:
            차수
        """
        terms = self.parse_expression(expr)
        max_degree = 0

        for term in terms:
            degree = sum(term.variables.values())
            max_degree = max(max_degree, degree)

        return max_degree

    def get_coefficient(self, expr: str, var: str, power: int) -> float:
        """
        특정 항의 계수 구하기

        Args:
            expr: 식
            var: 변수
            power: 차수

        Returns:
            계수
        """
        terms = self.parse_expression(expr)

        for term in terms:
            if term.variables.get(var, 0) == power:
                # 다른 변수가 없는지 확인
                if len(term.variables) == 1 or (len(term.variables) == 0 and power == 0):
                    return term.coefficient

        return 0.0
