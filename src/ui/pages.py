"""
페이지 UI 모듈
각 기능별 페이지 컴포넌트를 정의합니다.
"""
import streamlit as st
from typing import Tuple
from ..calculators.prime_factor import PrimeFactorCalculator
from ..calculators.linear_equation import LinearEquationSolver
from ..calculators.function_graph import FunctionGraphDrawer
from ..calculators.rational_number import RationalCalculator, RationalNumber
from ..calculators.algebraic_expression import AlgebraicCalculator
from ..calculators.linear_inequality import LinearInequalitySolver
from ..calculators.simultaneous_equations import SimultaneousEquationsSolver
from ..calculators.linear_function import LinearFunctionDrawer
from ..calculators.square_root import SquareRootCalculator
from ..calculators.factorization import FactorizationCalculator
from ..calculators.quadratic_equation import QuadraticEquationSolver
from ..calculators.quadratic_function import QuadraticFunctionDrawer
from ..calculators.statistics import StatisticsCalculator
from ..calculators.probability import ProbabilityCalculator
from ..calculators.geometry import GeometryCalculator
from ..calculators.coordinate import CoordinateCalculator
from .feature_pages import PracticePage, MistakeNotesPage, ProgressPage, HistoryPage
from ..utils.logger import get_logger
from ..utils.config import get_config

logger = get_logger()
config = get_config()


class PrimeFactorPage:
    """소인수분해 페이지"""

    def __init__(self):
        """초기화"""
        calc_config = config.calculators.prime_factor
        self.calculator = PrimeFactorCalculator(
            min_value=calc_config.get('min_value', 2),
            max_value=calc_config.get('max_value', 1000000)
        )
        self.default_value = calc_config.get('default_value', 12)
        logger.info("소인수분해 페이지 초기화")

    def render(self):
        """페이지 렌더링"""
        st.header("📐 소인수분해 계산기")
        st.write("자연수를 입력하면 소인수의 곱으로 나타냅니다.")

        # 입력
        number = st.number_input(
            f"{self.calculator.min_value} 이상 {self.calculator.max_value} 이하의 자연수를 입력하세요",
            min_value=self.calculator.min_value,
            max_value=self.calculator.max_value,
            step=1,
            value=self.default_value
        )

        # 실행 버튼
        if st.button("🔍 소인수분해 하기", type="primary"):
            try:
                factors, formatted = self.calculator.calculate(int(number))

                # 결과 표시
                st.success(f"**결과:** {formatted}")

                # 상세 정보 (Expander)
                with st.expander("📋 상세 정보 보기"):
                    st.write("**소인수별 지수:**")

                    # 표로 표시
                    if factors:
                        col1, col2 = st.columns(2)
                        with col1:
                            st.write("소인수")
                            for factor in sorted(factors.keys()):
                                st.write(f"**{factor}**")
                        with col2:
                            st.write("지수")
                            for factor in sorted(factors.keys()):
                                st.write(factors[factor])
                    else:
                        st.write("1 (소인수 없음)")

            except ValueError as e:
                st.error(f"⚠️ 오류: {str(e)}")
                logger.error(f"소인수분해 실패: {e}")


class LinearEquationPage:
    """일차방정식 페이지"""

    def __init__(self):
        """초기화"""
        calc_config = config.calculators.linear_equation
        self.solver = LinearEquationSolver()
        self.default_a = calc_config.get('default_a', 2.0)
        self.default_b = calc_config.get('default_b', 3.0)
        self.default_c = calc_config.get('default_c', 7.0)
        logger.info("일차방정식 페이지 초기화")

    def render(self):
        """페이지 렌더링"""
        st.header("📝 일차방정식 풀이")
        st.write("**ax + b = c** 형태의 일차방정식을 풉니다.")

        # 입력
        col1, col2, col3 = st.columns(3)
        with col1:
            a = st.number_input(
                "a 값 (x의 계수)",
                value=self.default_a,
                format="%.2f"
            )
        with col2:
            b = st.number_input(
                "b 값 (좌변 상수항)",
                value=self.default_b,
                format="%.2f"
            )
        with col3:
            c = st.number_input(
                "c 값 (우변 상수항)",
                value=self.default_c,
                format="%.2f"
            )

        # 방정식 표시
        st.markdown("### 입력한 방정식:")
        equation_latex = self.solver.get_latex_equation(a, b, c)
        st.latex(equation_latex)

        # 실행 버튼
        if st.button("✏️ 방정식 풀기", type="primary"):
            try:
                solution = self.solver.solve(a, b, c)

                # 풀이 과정 표시
                st.subheader("📖 풀이 과정")

                for step in solution.steps:
                    if step.startswith("주어진 방정식:"):
                        st.markdown(f"**{step}**")
                    elif any(step.startswith(f"{i}.") for i in range(1, 10)):
                        st.write(step)
                    elif step.startswith("   "):
                        # 들여쓰기된 수식
                        st.code(step.strip())
                    else:
                        st.write(step)

                # 결과 표시
                st.markdown("---")
                if solution.solution_type == 'unique':
                    st.success(f"### ✅ 정답: x = {solution.value}")
                elif solution.solution_type == 'infinite':
                    st.warning("### ⚠️ 해가 무수히 많습니다 (항등식)")
                else:  # none
                    st.error("### ❌ 해가 없습니다 (모순)")

            except ValueError as e:
                st.error(f"⚠️ 오류: {str(e)}")
                logger.error(f"일차방정식 풀이 실패: {e}")


class FunctionGraphPage:
    """함수 그래프 페이지"""

    def __init__(self):
        """초기화"""
        calc_config = config.calculators.function_graph
        self.drawer = FunctionGraphDrawer(
            y_limit=calc_config.get('y_limit', 10)
        )
        self.default_a = calc_config.get('default_a', 1.0)
        self.x_range_min = calc_config.get('x_range_min', -10)
        self.x_range_max = calc_config.get('x_range_max', 10)
        self.x_range_default = tuple(calc_config.get('x_range_default', [-5, 5]))
        logger.info("함수 그래프 페이지 초기화")

    def render(self):
        """페이지 렌더링"""
        st.header("📊 함수 그래프 그리기")
        st.write("정비례와 반비례 함수의 그래프를 그립니다.")

        # 함수 종류 선택
        func_type = st.radio(
            "함수 종류 선택",
            ["정비례 (y = ax)", "반비례 (y = a/x)"],
            horizontal=True
        )

        # 입력
        col1, col2 = st.columns(2)
        with col1:
            a_val = st.number_input(
                "a 값 (비례 상수)",
                value=self.default_a,
                format="%.2f"
            )
        with col2:
            x_range = st.slider(
                "x축 범위 설정",
                self.x_range_min,
                self.x_range_max,
                self.x_range_default
            )

        # 함수식 표시
        if "정비례" in func_type:
            st.latex(f"y = {a_val}x")
        else:
            st.latex(f"y = \\frac{{{a_val}}}{{x}}")

        # 실행 버튼
        if st.button("📈 그래프 그리기", type="primary"):
            try:
                # 함수 종류에 따라 그래프 그리기
                if "정비례" in func_type:
                    fig = self.drawer.draw_proportional(a_val, x_range)
                else:
                    fig = self.drawer.draw_inverse_proportional(a_val, x_range)

                # 그래프 표시
                st.pyplot(fig)

                # 함수 설명
                with st.expander("📚 함수 설명 보기"):
                    if "정비례" in func_type:
                        st.markdown(f"""
                        **정비례 함수: y = {a_val}x**

                        - x가 증가하면 y도 일정한 비율로 증가합니다
                        - 그래프는 원점(0, 0)을 지나는 직선입니다
                        - 기울기(a)가 {'양수' if a_val > 0 else '음수'}이므로
                          그래프는 {'오른쪽 위' if a_val > 0 else '오른쪽 아래'}로 향합니다
                        """)
                    else:
                        st.markdown(f"""
                        **반비례 함수: y = {a_val}/x**

                        - x가 증가하면 y는 감소합니다 (반대로 변합니다)
                        - 그래프는 x축, y축과 만나지 않습니다 (점근선)
                        - x = 0일 때 정의되지 않습니다
                        - 두 개의 곡선으로 이루어져 있습니다
                        """)

            except ValueError as e:
                st.error(f"⚠️ 오류: {str(e)}")
                logger.error(f"함수 그래프 그리기 실패: {e}")


class RationalNumberPage:
    """정수와 유리수 페이지"""

    def __init__(self):
        """초기화"""
        self.calculator = RationalCalculator()
        logger.info("정수와 유리수 페이지 초기화")

    def render(self):
        """페이지 렌더링"""
        st.header("🔢 정수와 유리수 계산기")
        st.write("정수와 유리수(분수)의 사칙연산, 약분, 통분 등을 수행합니다.")

        # 탭 생성
        tab1, tab2, tab3, tab4 = st.tabs([
            "📊 사칙연산",
            "🔄 소수↔분수 변환",
            "📏 최대공약수/최소공배수",
            "💡 기타 연산"
        ])

        with tab1:
            self._render_arithmetic()

        with tab2:
            self._render_conversion()

        with tab3:
            self._render_gcd_lcm()

        with tab4:
            self._render_other_operations()

    def _render_arithmetic(self):
        """사칙연산 탭 렌더링"""
        st.subheader("분수의 사칙연산")

        col1, col2 = st.columns(2)

        with col1:
            st.markdown("**첫 번째 분수**")
            num1 = st.number_input("분자", value=1, step=1, key="num1")
            den1 = st.number_input("분모", value=2, min_value=1, step=1, key="den1")

        with col2:
            st.markdown("**두 번째 분수**")
            num2 = st.number_input("분자", value=1, step=1, key="num2")
            den2 = st.number_input("분모", value=3, min_value=1, step=1, key="den2")

        # 연산 선택
        operation = st.radio(
            "연산 선택",
            ["➕ 덧셈", "➖ 뺄셈", "✖️ 곱셈", "➗ 나눗셈"],
            horizontal=True
        )

        if st.button("계산하기", type="primary", key="calc_arithmetic"):
            try:
                a = RationalNumber(int(num1), int(den1))
                b = RationalNumber(int(num2), int(den2))

                st.markdown(f"**입력:** {a} 과 {b}")

                if "덧셈" in operation:
                    result = self.calculator.add(a, b)
                    symbol = "+"
                elif "뺄셈" in operation:
                    result = self.calculator.subtract(a, b)
                    symbol = "-"
                elif "곱셈" in operation:
                    result = self.calculator.multiply(a, b)
                    symbol = "×"
                else:  # 나눗셈
                    result = self.calculator.divide(a, b)
                    symbol = "÷"

                st.success(f"### 결과: {a} {symbol} {b} = **{result}**")

                # 소수 표현
                if result.denominator != 1:
                    st.info(f"소수로 표현: **{result.to_decimal():.6f}**")

                # 대분수 표현 (가분수인 경우)
                if abs(result.numerator) > result.denominator:
                    whole, num, den = result.to_mixed_number()
                    if num != 0:
                        st.info(f"대분수로 표현: **{whole} {num}/{den}**")

            except ValueError as e:
                st.error(f"⚠️ 오류: {str(e)}")

    def _render_conversion(self):
        """소수↔분수 변환 탭 렌더링"""
        st.subheader("소수와 분수 변환")

        conversion_type = st.radio(
            "변환 방향",
            ["소수 → 분수", "분수 → 소수"],
            horizontal=True
        )

        if conversion_type == "소수 → 분수":
            decimal_input = st.text_input(
                "소수 입력",
                value="0.75",
                help="예: 0.5, 1.25, 2.333 등"
            )

            if st.button("변환하기", type="primary", key="dec_to_frac"):
                try:
                    result = self.calculator.decimal_to_rational(decimal_input)
                    st.success(f"### 결과: {decimal_input} = **{result}**")

                    # 대분수 표현
                    if abs(result.numerator) > result.denominator:
                        whole, num, den = result.to_mixed_number()
                        if num != 0:
                            st.info(f"대분수로 표현: **{whole} {num}/{den}**")

                except ValueError as e:
                    st.error(f"⚠️ 오류: {str(e)}")

        else:  # 분수 → 소수
            col1, col2 = st.columns(2)
            with col1:
                frac_num = st.number_input("분자", value=3, step=1, key="frac_num")
            with col2:
                frac_den = st.number_input("분모", value=4, min_value=1, step=1, key="frac_den")

            if st.button("변환하기", type="primary", key="frac_to_dec"):
                try:
                    frac = RationalNumber(int(frac_num), int(frac_den))
                    decimal_result = frac.to_decimal()

                    st.success(f"### 결과: {frac} = **{decimal_result}**")

                    # 순환소수 판별 (간단한 방법)
                    if len(str(decimal_result)) > 10:
                        st.info("💡 이 분수는 순환소수로 변환됩니다.")

                except ValueError as e:
                    st.error(f"⚠️ 오류: {str(e)}")

    def _render_gcd_lcm(self):
        """최대공약수/최소공배수 탭 렌더링"""
        st.subheader("최대공약수(GCD)와 최소공배수(LCM)")

        col1, col2 = st.columns(2)

        with col1:
            gcd_a = st.number_input("첫 번째 정수", value=12, step=1, key="gcd_a")
        with col2:
            gcd_b = st.number_input("두 번째 정수", value=18, step=1, key="gcd_b")

        if st.button("계산하기", type="primary", key="calc_gcd_lcm"):
            gcd_result = self.calculator.gcd(int(gcd_a), int(gcd_b))
            lcm_result = self.calculator.lcm(int(gcd_a), int(gcd_b))

            col_r1, col_r2 = st.columns(2)

            with col_r1:
                st.metric("최대공약수 (GCD)", gcd_result)

            with col_r2:
                st.metric("최소공배수 (LCM)", lcm_result)

            with st.expander("📚 설명 보기"):
                st.markdown(f"""
                **최대공약수 (GCD)**
                - {gcd_a}와 {gcd_b}의 최대공약수는 **{gcd_result}**입니다.
                - 두 수를 동시에 나눌 수 있는 가장 큰 수입니다.

                **최소공배수 (LCM)**
                - {gcd_a}와 {gcd_b}의 최소공배수는 **{lcm_result}**입니다.
                - 두 수의 공통 배수 중 가장 작은 수입니다.
                """)

    def _render_other_operations(self):
        """기타 연산 탭 렌더링"""
        st.subheader("절댓값, 역수, 거듭제곱")

        operation_type = st.selectbox(
            "연산 선택",
            ["절댓값", "역수", "거듭제곱", "크기 비교"]
        )

        if operation_type == "절댓값":
            num = st.number_input("분자", value=-3, step=1, key="abs_num")
            den = st.number_input("분모", value=4, min_value=1, step=1, key="abs_den")

            if st.button("계산하기", type="primary", key="calc_abs"):
                try:
                    frac = RationalNumber(int(num), int(den))
                    result = self.calculator.absolute_value(frac)
                    st.success(f"### |{frac}| = **{result}**")
                except ValueError as e:
                    st.error(f"⚠️ 오류: {str(e)}")

        elif operation_type == "역수":
            num = st.number_input("분자", value=3, step=1, key="rec_num")
            den = st.number_input("분모", value=4, min_value=1, step=1, key="rec_den")

            if st.button("계산하기", type="primary", key="calc_rec"):
                try:
                    frac = RationalNumber(int(num), int(den))
                    result = self.calculator.reciprocal(frac)
                    st.success(f"### {frac}의 역수 = **{result}**")
                except ValueError as e:
                    st.error(f"⚠️ 오류: {str(e)}")

        elif operation_type == "거듭제곱":
            num = st.number_input("분자", value=2, step=1, key="pow_num")
            den = st.number_input("분모", value=3, min_value=1, step=1, key="pow_den")
            exp = st.number_input("지수", value=2, step=1, key="pow_exp")

            if st.button("계산하기", type="primary", key="calc_pow"):
                try:
                    frac = RationalNumber(int(num), int(den))
                    result = self.calculator.power(frac, int(exp))
                    st.success(f"### ({frac})^{exp} = **{result}**")
                    if result.denominator != 1:
                        st.info(f"소수로 표현: **{result.to_decimal()}**")
                except ValueError as e:
                    st.error(f"⚠️ 오류: {str(e)}")

        else:  # 크기 비교
            col1, col2 = st.columns(2)

            with col1:
                st.markdown("**첫 번째 분수**")
                num1 = st.number_input("분자", value=1, step=1, key="cmp_num1")
                den1 = st.number_input("분모", value=2, min_value=1, step=1, key="cmp_den1")

            with col2:
                st.markdown("**두 번째 분수**")
                num2 = st.number_input("분자", value=2, step=1, key="cmp_num2")
                den2 = st.number_input("분모", value=3, min_value=1, step=1, key="cmp_den2")

            if st.button("비교하기", type="primary", key="calc_cmp"):
                try:
                    a = RationalNumber(int(num1), int(den1))
                    b = RationalNumber(int(num2), int(den2))

                    cmp_result = self.calculator.compare(a, b)

                    if cmp_result > 0:
                        st.success(f"### {a} > {b}")
                    elif cmp_result < 0:
                        st.success(f"### {a} < {b}")
                    else:
                        st.success(f"### {a} = {b}")

                    st.info(f"{a} ≈ {a.to_decimal():.6f}")
                    st.info(f"{b} ≈ {b.to_decimal():.6f}")

                except ValueError as e:
                    st.error(f"⚠️ 오류: {str(e)}")


class AlgebraicExpressionPage:
    """문자와 식 페이지"""

    def __init__(self):
        """초기화"""
        self.calculator = AlgebraicCalculator()
        logger.info("문자와 식 페이지 초기화")

    def render(self):
        """페이지 렌더링"""
        st.header("📝 문자와 식 계산기")
        st.write("단항식과 다항식의 연산, 동류항 정리, 값 대입 등을 수행합니다.")

        # 탭 생성
        tab1, tab2, tab3, tab4 = st.tabs([
            "➕ 다항식 덧셈/뺄셈",
            "✖️ 단항식 곱셈/나눗셈",
            "🔢 값 대입",
            "📐 기타 기능"
        ])

        with tab1:
            self._render_polynomial_operations()

        with tab2:
            self._render_monomial_operations()

        with tab3:
            self._render_substitution()

        with tab4:
            self._render_other_features()

    def _render_polynomial_operations(self):
        """다항식 연산 탭 렌더링"""
        st.subheader("다항식의 덧셈과 뺄셈")

        col1, col2 = st.columns(2)

        with col1:
            expr1 = st.text_input(
                "첫 번째 식",
                value="3x^2 + 2x - 5",
                help="예: 3x^2 + 2x - 5, 2xy + 3y"
            )

        with col2:
            expr2 = st.text_input(
                "두 번째 식",
                value="x^2 - 4x + 3",
                help="예: x^2 - 4x + 3"
            )

        operation = st.radio(
            "연산 선택",
            ["덧셈 (+)", "뺄셈 (-)"],
            horizontal=True
        )

        if st.button("계산하기", type="primary", key="poly_calc"):
            try:
                if "덧셈" in operation:
                    result = self.calculator.add(expr1, expr2)
                    st.success(f"### ({expr1}) + ({expr2})")
                    st.success(f"### = **{result}**")
                else:
                    result = self.calculator.subtract(expr1, expr2)
                    st.success(f"### ({expr1}) - ({expr2})")
                    st.success(f"### = **{result}**")

                with st.expander("📚 풀이 과정"):
                    st.markdown("""
                    **다항식의 덧셈/뺄셈**
                    1. 괄호를 풀어줍니다
                    2. 동류항끼리 모읍니다
                    3. 동류항의 계수를 더하거나 뺍니다
                    """)

            except Exception as e:
                st.error(f"⚠️ 오류: {str(e)}")

    def _render_monomial_operations(self):
        """단항식 연산 탭 렌더링"""
        st.subheader("단항식의 곱셈과 나눗셈")

        operation_type = st.radio(
            "연산 선택",
            ["곱셈 (×)", "나눗셈 (÷)"],
            horizontal=True,
            key="mono_op"
        )

        col1, col2 = st.columns(2)

        with col1:
            mono1 = st.text_input(
                "첫 번째 단항식",
                value="3x^2y",
                help="예: 3x^2y, -2ab, 5x",
                key="mono1"
            )

        with col2:
            mono2 = st.text_input(
                "두 번째 단항식",
                value="2xy^2",
                help="예: 2xy^2, 3a, -4x",
                key="mono2"
            )

        if st.button("계산하기", type="primary", key="mono_calc"):
            try:
                if "곱셈" in operation_type:
                    result = self.calculator.multiply_monomials(mono1, mono2)
                    st.success(f"### ({mono1}) × ({mono2}) = **{result}**")

                    with st.expander("📚 풀이 과정"):
                        st.markdown("""
                        **단항식의 곱셈**
                        1. 계수끼리 곱합니다
                        2. 같은 문자끼리 곱합니다 (지수를 더함)
                        3. 결과를 정리합니다
                        """)
                else:
                    result = self.calculator.divide_monomials(mono1, mono2)
                    st.success(f"### ({mono1}) ÷ ({mono2}) = **{result}**")

                    with st.expander("📚 풀이 과정"):
                        st.markdown("""
                        **단항식의 나눗셈**
                        1. 계수끼리 나눕니다
                        2. 같은 문자끼리 나눕니다 (지수를 뺌)
                        3. 결과를 정리합니다
                        """)

            except Exception as e:
                st.error(f"⚠️ 오류: {str(e)}")

    def _render_substitution(self):
        """값 대입 탭 렌더링"""
        st.subheader("문자에 값 대입하기")

        expr = st.text_input(
            "식 입력",
            value="2x^2 + 3x - 1",
            help="예: 2x^2 + 3x - 1, xy + 2y"
        )

        st.markdown("**변수의 값 입력**")

        # 식에서 사용된 변수 추출
        try:
            terms = self.calculator.parse_expression(expr)
            variables = set()
            for term in terms:
                variables.update(term.variables.keys())

            if not variables:
                st.info("식에 변수가 없습니다.")
                return

            # 변수별 입력 필드 생성
            values = {}
            cols = st.columns(min(len(variables), 4))

            for i, var in enumerate(sorted(variables)):
                with cols[i % len(cols)]:
                    values[var] = st.number_input(
                        f"{var} =",
                        value=1.0,
                        step=0.1,
                        key=f"var_{var}"
                    )

            if st.button("계산하기", type="primary", key="sub_calc"):
                try:
                    result = self.calculator.substitute(expr, values)

                    st.success(f"### {expr}")

                    # 대입한 값 표시
                    subs_str = ", ".join([f"{k}={v}" for k, v in values.items()])
                    st.info(f"**대입:** {subs_str}")

                    st.success(f"### = **{result}**")

                except Exception as e:
                    st.error(f"⚠️ 오류: {str(e)}")

        except Exception as e:
            st.warning(f"식을 파싱할 수 없습니다: {str(e)}")

    def _render_other_features(self):
        """기타 기능 탭 렌더링"""
        st.subheader("기타 기능")

        feature = st.selectbox(
            "기능 선택",
            ["동류항 정리", "식 전개", "차수 구하기", "특정 항의 계수"]
        )

        if feature == "동류항 정리":
            expr = st.text_input(
                "식 입력",
                value="3x^2 + 2x - 5 + 4x^2 - x + 2",
                help="정리할 식을 입력하세요"
            )

            if st.button("정리하기", type="primary", key="simplify"):
                try:
                    terms = self.calculator.parse_expression(expr)
                    simplified = self.calculator.simplify(terms)
                    result = self.calculator._format_expression(simplified)

                    st.success(f"### 원래 식: {expr}")
                    st.success(f"### 정리 결과: **{result}**")

                except Exception as e:
                    st.error(f"⚠️ 오류: {str(e)}")

        elif feature == "식 전개":
            expr = st.text_input(
                "식 입력",
                value="(x + 2)(x + 3)",
                help="(a+b)(c+d) 형태의 식을 입력하세요"
            )

            if st.button("전개하기", type="primary", key="expand"):
                try:
                    result = self.calculator.expand(expr)
                    st.success(f"### {expr}")
                    st.success(f"### = **{result}**")

                    with st.expander("📚 분배법칙"):
                        st.markdown("""
                        **(a + b)(c + d) = ac + ad + bc + bd**

                        1. 첫 번째 괄호의 각 항을
                        2. 두 번째 괄호의 각 항과 곱합니다
                        3. 동류항을 정리합니다
                        """)

                except Exception as e:
                    st.error(f"⚠️ 오류: {str(e)}")

        elif feature == "차수 구하기":
            expr = st.text_input(
                "다항식 입력",
                value="3x^3 + 2x^2 - 5x + 1",
                help="차수를 구할 다항식을 입력하세요"
            )

            if st.button("차수 구하기", type="primary", key="degree"):
                try:
                    degree = self.calculator.get_degree(expr)
                    st.metric("다항식의 차수", f"{degree}차")

                    with st.expander("💡 차수란?"):
                        st.markdown("""
                        **다항식의 차수**
                        - 각 항의 차수 중 가장 큰 것
                        - 항의 차수 = 문자의 지수의 합
                        - 예: 3x²y의 차수 = 2 + 1 = 3
                        """)

                except Exception as e:
                    st.error(f"⚠️ 오류: {str(e)}")

        else:  # 특정 항의 계수
            expr = st.text_input(
                "다항식 입력",
                value="3x^2 + 5x - 2",
                help="예: 3x^2 + 5x - 2"
            )

            col1, col2 = st.columns(2)
            with col1:
                var = st.text_input("변수", value="x", max_chars=1)
            with col2:
                power = st.number_input("차수", value=2, min_value=0, step=1)

            if st.button("계수 구하기", type="primary", key="coef"):
                try:
                    coef = self.calculator.get_coefficient(expr, var, int(power))

                    if power == 0:
                        st.success(f"### 상수항: **{coef}**")
                    elif power == 1:
                        st.success(f"### {var}의 계수: **{coef}**")
                    else:
                        st.success(f"### {var}^{power}의 계수: **{coef}**")

                except Exception as e:
                    st.error(f"⚠️ 오류: {str(e)}")


class LinearInequalityPage:
    """일차부등식 페이지"""

    def __init__(self):
        """초기화"""
        self.solver = LinearInequalitySolver()
        logger.info("일차부등식 페이지 초기화")

    def render(self):
        """페이지 렌더링"""
        st.header("📊 일차부등식 풀이")
        st.write("**ax + b < c, >, ≤, ≥** 형태의 일차부등식을 풉니다.")

        # 입력
        col1, col2, col3 = st.columns(3)
        with col1:
            a = st.number_input("a 값 (x의 계수)", value=2.0, format="%.2f")
        with col2:
            b = st.number_input("b 값 (좌변 상수항)", value=3.0, format="%.2f")
        with col3:
            c = st.number_input("c 값 (우변 상수항)", value=7.0, format="%.2f")

        # 부등호 선택
        inequality = st.selectbox(
            "부등호 선택",
            ["<", ">", "≤", "≥"],
            index=0
        )

        # 부등식 표시
        st.markdown("### 입력한 부등식:")
        if a == 1:
            left = "x"
        elif a == -1:
            left = "-x"
        else:
            left = f"{a}x"

        if b > 0:
            left += f" + {b}"
        elif b < 0:
            left += f" - {abs(b)}"

        st.latex(f"{left} {inequality} {c}")

        # 실행 버튼
        if st.button("✏️ 부등식 풀기", type="primary"):
            try:
                solution = self.solver.solve(a, b, c, inequality)

                # 풀이 과정 표시
                st.subheader("📖 풀이 과정")
                for step in solution.steps:
                    if step.startswith("주어진"):
                        st.markdown(f"**{step}**")
                    elif any(step.startswith(f"{i}.") for i in range(1, 10)):
                        st.write(step)
                    elif step.startswith("   "):
                        st.code(step.strip())
                    else:
                        st.write(step)

                # 결과 표시
                st.markdown("---")
                if solution.solution_type == 'range':
                    st.success(f"### ✅ 정답: x {solution.inequality} {solution.value}")
                elif solution.solution_type == 'all':
                    st.warning("### ⚠️ 모든 실수가 해입니다")
                else:  # none
                    st.error("### ❌ 해가 없습니다")

            except ValueError as e:
                st.error(f"⚠️ 오류: {str(e)}")


class SimultaneousEquationsPage:
    """연립방정식 페이지"""

    def __init__(self):
        """초기화"""
        self.solver = SimultaneousEquationsSolver()
        logger.info("연립방정식 페이지 초기화")

    def render(self):
        """페이지 렌더링"""
        st.header("🔢 연립방정식 풀이")
        st.write("두 개의 일차방정식으로 이루어진 연립방정식을 풉니다.")

        # 방법 선택
        method = st.radio(
            "풀이 방법 선택",
            ["가감법 (Elimination)", "대입법 (Substitution)"],
            horizontal=True
        )

        st.markdown("### 방정식 입력")

        # 첫 번째 방정식
        st.markdown("**첫 번째 방정식: a₁x + b₁y = c₁**")
        col1, col2, col3 = st.columns(3)
        with col1:
            a1 = st.number_input("a₁", value=2.0, format="%.2f", key="a1")
        with col2:
            b1 = st.number_input("b₁", value=3.0, format="%.2f", key="b1")
        with col3:
            c1 = st.number_input("c₁", value=8.0, format="%.2f", key="c1")

        # 두 번째 방정식
        st.markdown("**두 번째 방정식: a₂x + b₂y = c₂**")
        col4, col5, col6 = st.columns(3)
        with col4:
            a2 = st.number_input("a₂", value=1.0, format="%.2f", key="a2")
        with col5:
            b2 = st.number_input("b₂", value=-1.0, format="%.2f", key="b2")
        with col6:
            c2 = st.number_input("c₂", value=1.0, format="%.2f", key="c2")

        # 방정식 표시
        st.markdown("### 입력한 연립방정식:")
        st.latex(f"{a1}x + {b1}y = {c1}")
        st.latex(f"{a2}x + {b2}y = {c2}")

        # 실행 버튼
        if st.button("✏️ 연립방정식 풀기", type="primary"):
            try:
                if "가감법" in method:
                    solution = self.solver.solve_by_elimination(a1, b1, c1, a2, b2, c2)
                else:
                    solution = self.solver.solve_by_substitution(a1, b1, c1, a2, b2, c2)

                # 풀이 과정 표시
                st.subheader("📖 풀이 과정")
                for step in solution.steps:
                    if step.startswith("주어진"):
                        st.markdown(f"**{step}**")
                    elif step.startswith("["):
                        st.markdown(f"**{step}**")
                    elif any(step.startswith(f"{i}.") for i in range(1, 10)) or step.startswith("①") or step.startswith("②"):
                        st.write(step)
                    elif step.startswith("   ") or step.startswith("  "):
                        st.code(step.strip())
                    else:
                        st.write(step)

                # 결과 표시
                st.markdown("---")
                if solution.solution_type == 'unique':
                    st.success(f"### ✅ 정답: x = {solution.x}, y = {solution.y}")

                    # 검산
                    check1 = abs(a1 * solution.x + b1 * solution.y - c1) < 0.0001
                    check2 = abs(a2 * solution.x + b2 * solution.y - c2) < 0.0001

                    if check1 and check2:
                        st.info("✓ 검산 완료: 답이 맞습니다!")

                elif solution.solution_type == 'infinite':
                    st.warning("### ⚠️ 해가 무수히 많습니다 (두 직선이 일치)")
                else:  # none
                    st.error("### ❌ 해가 없습니다 (두 직선이 평행)")

            except ValueError as e:
                st.error(f"⚠️ 오류: {str(e)}")


class LinearFunctionPage:
    """일차함수 페이지"""

    def __init__(self):
        """초기화"""
        self.drawer = LinearFunctionDrawer()
        logger.info("일차함수 페이지 초기화")

    def render(self):
        """페이지 렌더링"""
        st.header("📈 일차함수 그래프")
        st.write("**y = ax + b** 형태의 일차함수 그래프를 그립니다.")

        # 탭 생성
        tab1, tab2, tab3 = st.tabs([
            "📊 그래프 그리기",
            "🔍 평행선/수직선",
            "📏 절편 구하기"
        ])

        with tab1:
            self._render_graph()

        with tab2:
            self._render_parallel_perpendicular()

        with tab3:
            self._render_intercepts()

    def _render_graph(self):
        """그래프 그리기 탭"""
        st.subheader("일차함수 그래프 그리기")

        col1, col2 = st.columns(2)
        with col1:
            a = st.number_input("기울기 (a)", value=1.0, format="%.2f", key="graph_a")
        with col2:
            b = st.number_input("y절편 (b)", value=0.0, format="%.2f", key="graph_b")

        x_range = st.slider(
            "x축 범위",
            -10, 10, (-5, 5),
            key="graph_range"
        )

        # 함수식 표시
        st.latex(f"y = {a}x + {b}")

        if st.button("📈 그래프 그리기", type="primary", key="draw_graph"):
            try:
                fig = self.drawer.draw(a, b, x_range)
                st.pyplot(fig)

                # 함수 설명
                with st.expander("📚 일차함수 설명"):
                    st.markdown(f"""
                    **일차함수: y = {a}x + {b}**

                    - **기울기 (a)**: {a} {'(양수 - 오른쪽 위로)' if a > 0 else '(음수 - 오른쪽 아래로)' if a < 0 else '(0 - 수평선)'}
                    - **y절편 (b)**: {b} (y축과 만나는 점)
                    - **x절편**: {self.drawer.find_x_intercept(a, b) if a != 0 else '없음 (수평선)'}
                    """)

            except Exception as e:
                st.error(f"⚠️ 오류: {str(e)}")

    def _render_parallel_perpendicular(self):
        """평행선/수직선 탭"""
        st.subheader("평행선과 수직선 구하기")

        line_type = st.radio(
            "선택",
            ["평행선", "수직선"],
            horizontal=True,
            key="line_type"
        )

        a = st.number_input("원래 직선의 기울기 (a)", value=2.0, format="%.2f", key="para_a")

        st.markdown("**지나는 점**")
        col1, col2 = st.columns(2)
        with col1:
            px = st.number_input("x 좌표", value=1.0, format="%.2f", key="px")
        with col2:
            py = st.number_input("y 좌표", value=3.0, format="%.2f", key="py")

        if st.button("계산하기", type="primary", key="calc_line"):
            try:
                if line_type == "평행선":
                    new_b = self.drawer.parallel_line(a, (px, py))
                    st.success(f"### 평행선: y = {a}x + {new_b}")
                    st.info(f"원래 직선과 기울기가 같고 ({px}, {py})를 지납니다.")
                else:
                    if a == 0:
                        st.error("수평선에 수직인 직선은 기울기가 무한대입니다 (수직선 x = 상수)")
                    else:
                        new_a, new_b = self.drawer.perpendicular_line(a, (px, py))
                        st.success(f"### 수직선: y = {new_a}x + {new_b}")
                        st.info(f"기울기의 곱이 -1이고 ({px}, {py})를 지납니다: {a} × {new_a} = {a * new_a}")

            except ValueError as e:
                st.error(f"⚠️ 오류: {str(e)}")

    def _render_intercepts(self):
        """절편 구하기 탭"""
        st.subheader("x절편과 y절편 구하기")

        col1, col2 = st.columns(2)
        with col1:
            a = st.number_input("기울기 (a)", value=2.0, format="%.2f", key="int_a")
        with col2:
            b = st.number_input("y절편 (b)", value=-4.0, format="%.2f", key="int_b")

        st.latex(f"y = {a}x + {b}")

        if st.button("절편 구하기", type="primary", key="calc_intercept"):
            y_int = self.drawer.find_y_intercept(b)
            x_int = self.drawer.find_x_intercept(a, b)

            col_r1, col_r2 = st.columns(2)

            with col_r1:
                st.metric("y절편", f"({0}, {y_int})")
                st.caption("y축과 만나는 점 (x=0일 때)")

            with col_r2:
                if x_int is not None:
                    st.metric("x절편", f"({x_int}, {0})")
                    st.caption("x축과 만나는 점 (y=0일 때)")
                else:
                    st.metric("x절편", "없음")
                    st.caption("수평선 (기울기가 0)")


class SquareRootPage:
    """제곱근과 실수 페이지"""

    def __init__(self):
        """초기화"""
        self.calculator = SquareRootCalculator()
        logger.info("제곱근과 실수 페이지 초기화")

    def render(self):
        """페이지 렌더링"""
        st.header("√ 제곱근과 실수 계산기")
        st.write("제곱근 계산, 간단히 하기, 사칙연산, 분모의 유리화를 수행합니다.")

        # 탭 생성
        tab1, tab2, tab3, tab4 = st.tabs([
            "📐 제곱근 계산",
            "➕ 제곱근 사칙연산",
            "🔄 분모의 유리화",
            "💡 판별"
        ])

        with tab1:
            self._render_sqrt_calculation()

        with tab2:
            self._render_sqrt_operations()

        with tab3:
            self._render_rationalization()

        with tab4:
            self._render_classification()

    def _render_sqrt_calculation(self):
        """제곱근 계산 탭"""
        st.subheader("제곱근 계산 및 간단히 하기")

        n = st.number_input(
            "양수 입력",
            min_value=0.0,
            value=18.0,
            step=1.0,
            format="%.2f"
        )

        if st.button("계산하기", type="primary", key="calc_sqrt"):
            try:
                value, expr = self.calculator.sqrt(n)

                st.success(f"### √{n} = **{expr}**")
                st.info(f"소수로 표현: **{value:.6f}**")

                # 완전제곱수 판별
                if self.calculator.is_perfect_square(n):
                    st.success("✓ 완전제곱수입니다!")
                else:
                    st.info("완전제곱수가 아닙니다 (무리수)")

                # 간단히 하기 과정
                with st.expander("📚 간단히 하기 과정"):
                    st.markdown(f"""
                    **제곱근 간단히 하기**

                    1. {n}을 소인수분해합니다
                    2. 제곱수 인수를 찾습니다
                    3. 제곱수는 근호 밖으로 빼냅니다

                    결과: **{expr}**
                    """)

            except ValueError as e:
                st.error(f"⚠️ 오류: {str(e)}")

    def _render_sqrt_operations(self):
        """제곱근 사칙연산 탭"""
        st.subheader("제곱근의 사칙연산")

        operation = st.selectbox(
            "연산 선택",
            ["덧셈 (a₁√b₁ + a₂√b₂)", "곱셈 (a₁√b₁ × a₂√b₂)", "나눗셈 (a₁√b₁ ÷ a₂√b₂)"]
        )

        col1, col2 = st.columns(2)

        with col1:
            st.markdown("**첫 번째 항: a₁√b₁**")
            a1 = st.number_input("계수 a₁", value=2.0, format="%.2f", key="sqrt_a1")
            b1 = st.number_input("근호 안 b₁", min_value=0.0, value=3.0, format="%.2f", key="sqrt_b1")

        with col2:
            st.markdown("**두 번째 항: a₂√b₂**")
            a2 = st.number_input("계수 a₂", value=3.0, format="%.2f", key="sqrt_a2")
            b2 = st.number_input("근호 안 b₂", min_value=0.0, value=3.0, format="%.2f", key="sqrt_b2")

        if st.button("계산하기", type="primary", key="sqrt_op"):
            try:
                if "덧셈" in operation:
                    value, expr = self.calculator.sqrt_add(a1, b1, a2, b2)
                    st.success(f"### {a1}√{b1} + {a2}√{b2} = **{expr}**")
                elif "곱셈" in operation:
                    value, expr = self.calculator.sqrt_multiply(a1, b1, a2, b2)
                    st.success(f"### {a1}√{b1} × {a2}√{b2} = **{expr}**")
                else:  # 나눗셈
                    value, expr = self.calculator.sqrt_divide(a1, b1, a2, b2)
                    st.success(f"### {a1}√{b1} ÷ {a2}√{b2} = **{expr}**")

                st.info(f"소수로 표현: **{value:.6f}**")

            except ValueError as e:
                st.error(f"⚠️ 오류: {str(e)}")

    def _render_rationalization(self):
        """분모의 유리화 탭"""
        st.subheader("분모의 유리화")

        col1, col2 = st.columns(2)
        with col1:
            numerator = st.number_input("분자", value=1.0, format="%.2f", key="rat_num")
        with col2:
            denominator = st.number_input(
                "분모의 근호 안",
                min_value=0.1,
                value=2.0,
                format="%.2f",
                key="rat_den"
            )

        st.latex(f"\\frac{{{numerator}}}{{\\sqrt{{{denominator}}}}}")

        if st.button("유리화하기", type="primary", key="rationalize"):
            try:
                expr, value = self.calculator.rationalize_denominator(numerator, denominator)

                st.success(f"### 유리화 결과: **{expr}**")
                st.info(f"소수로 표현: **{value:.6f}**")

                with st.expander("📚 분모의 유리화"):
                    st.markdown(f"""
                    **분모의 유리화 과정**

                    1. 분자와 분모에 √{denominator}을 곱합니다
                    2. 분모: √{denominator} × √{denominator} = {denominator}
                    3. 분자: {numerator} × √{denominator}
                    4. 약분합니다

                    결과: **{expr}**
                    """)

            except ValueError as e:
                st.error(f"⚠️ 오류: {str(e)}")

    def _render_classification(self):
        """판별 탭"""
        st.subheader("수의 분류")

        n = st.number_input(
            "수 입력",
            value=16.0,
            step=0.1,
            format="%.10f",
            key="class_n"
        )

        if st.button("판별하기", type="primary", key="classify"):
            is_perfect = self.calculator.is_perfect_square(n)
            is_rational = self.calculator.is_rational(n)

            st.markdown("### 판별 결과")

            col1, col2 = st.columns(2)

            with col1:
                if is_perfect:
                    st.success("✓ 완전제곱수")
                    st.caption(f"√{n} = {int(n**0.5)}")
                else:
                    st.info("✗ 완전제곱수 아님")

            with col2:
                if is_rational:
                    st.success("✓ 유리수")
                    st.caption("정수 또는 분수로 표현 가능")
                else:
                    st.info("✗ 무리수")
                    st.caption("순환하지 않는 무한소수")

            # 수 체계 설명
            with st.expander("📚 수의 분류"):
                st.markdown("""
                **실수의 분류**

                - **유리수**: 정수 또는 분수로 표현 가능
                  - 정수: ..., -2, -1, 0, 1, 2, ...
                  - 분수: 1/2, 3/4, -2/3, ...
                  - 유한소수: 0.5, 1.25, ...
                  - 순환소수: 0.333..., 1.666..., ...

                - **무리수**: 분수로 표현 불가능
                  - 순환하지 않는 무한소수
                  - √2, √3, π, e 등
                """)


class FactorizationPage:
    """인수분해 페이지"""

    def __init__(self):
        """초기화"""
        self.calculator = FactorizationCalculator()
        logger.info("인수분해 페이지 초기화")

    def render(self):
        """페이지 렌더링"""
        st.header("🔨 인수분해 계산기")
        st.write("이차식, 공통인수 등 다양한 인수분해를 수행합니다.")

        # 탭 생성
        tab1, tab2 = st.tabs([
            "📐 이차식 인수분해",
            "🔍 공통인수 묶어내기"
        ])

        with tab1:
            self._render_quadratic_factorization()

        with tab2:
            self._render_common_factor()

    def _render_quadratic_factorization(self):
        """이차식 인수분해 탭"""
        st.subheader("이차식 인수분해: ax² + bx + c")

        col1, col2, col3 = st.columns(3)
        with col1:
            a = st.number_input("a (x²의 계수)", value=1.0, format="%.2f", key="fact_a")
        with col2:
            b = st.number_input("b (x의 계수)", value=5.0, format="%.2f", key="fact_b")
        with col3:
            c = st.number_input("c (상수항)", value=6.0, format="%.2f", key="fact_c")

        # 식 표시
        st.markdown("### 입력한 식:")
        if a == 1:
            expr = "x²"
        elif a == -1:
            expr = "-x²"
        else:
            expr = f"{a}x²"

        if b > 0:
            expr += f" + {b}x" if b != 1 else " + x"
        elif b < 0:
            expr += f" - {abs(b)}x" if b != -1 else " - x"

        if c > 0:
            expr += f" + {c}"
        elif c < 0:
            expr += f" - {abs(c)}"

        st.latex(expr)

        if st.button("인수분해하기", type="primary", key="factorize"):
            try:
                result = self.calculator.factorize_quadratic(a, b, c)

                # 풀이 과정 표시
                st.subheader("📖 풀이 과정")
                for step in result.steps:
                    if step.startswith("주어진"):
                        st.markdown(f"**{step}**")
                    else:
                        st.write(step)

                # 결과 표시
                st.markdown("---")
                st.success(f"### 인수분해 결과: **{result.factored}**")

                # 방법 표시
                method_names = {
                    'perfect_square': '완전제곱식',
                    'difference_of_squares': '제곱의 차',
                    'quadratic': '근의 공식',
                    'common_factor': '공통인수'
                }
                st.info(f"사용한 방법: {method_names.get(result.method, result.method)}")

                # 전개 확인
                with st.expander("✓ 전개하여 확인"):
                    expanded = self.calculator.expand_factored_form(result.factored)
                    st.write(f"전개 결과: {expanded}")
                    st.write(f"원래 식: {result.original}")

            except Exception as e:
                st.error(f"⚠️ 오류: {str(e)}")

    def _render_common_factor(self):
        """공통인수 묶어내기 탭"""
        st.subheader("공통인수 묶어내기")

        expr = st.text_input(
            "다항식 입력",
            value="6x^2 + 9x",
            help="예: 6x^2 + 9x, 12x^2 - 8x"
        )

        if st.button("공통인수 묶어내기", type="primary", key="common_fact"):
            try:
                result = self.calculator.factorize_common_factor(expr)

                # 풀이 과정
                st.subheader("📖 풀이 과정")
                for step in result.steps:
                    if step.startswith("주어진"):
                        st.markdown(f"**{step}**")
                    else:
                        st.write(step)

                # 결과
                st.markdown("---")
                st.success(f"### 결과: **{result.factored}**")

            except Exception as e:
                st.error(f"⚠️ 오류: {str(e)}")


class QuadraticEquationPage:
    """이차방정식 페이지"""

    def __init__(self):
        """초기화"""
        self.solver = QuadraticEquationSolver()
        logger.info("이차방정식 페이지 초기화")

    def render(self):
        """페이지 렌더링"""
        st.header("🎯 이차방정식 풀이")
        st.write("**ax² + bx + c = 0** 형태의 이차방정식을 다양한 방법으로 풉니다.")

        # 탭 생성
        tab1, tab2, tab3 = st.tabs([
            "📐 근의 공식",
            "🔨 인수분해법",
            "📊 완전제곱식"
        ])

        with tab1:
            self._render_quadratic_formula()

        with tab2:
            self._render_factoring_method()

        with tab3:
            self._render_completing_square()

    def _render_quadratic_formula(self):
        """근의 공식 탭"""
        st.subheader("근의 공식을 이용한 풀이")

        col1, col2, col3 = st.columns(3)
        with col1:
            a = st.number_input("a (x²의 계수)", value=1.0, format="%.2f", key="quad_a")
        with col2:
            b = st.number_input("b (x의 계수)", value=-5.0, format="%.2f", key="quad_b")
        with col3:
            c = st.number_input("c (상수항)", value=6.0, format="%.2f", key="quad_c")

        # 방정식 표시
        st.markdown("### 입력한 방정식:")
        if a == 1:
            expr = "x²"
        elif a == -1:
            expr = "-x²"
        else:
            expr = f"{a}x²"

        if b > 0:
            expr += f" + {b}x" if b != 1 else " + x"
        elif b < 0:
            expr += f" - {abs(b)}x" if b != -1 else " - x"

        if c > 0:
            expr += f" + {c}"
        elif c < 0:
            expr += f" - {abs(c)}"

        st.latex(f"{expr} = 0")

        if st.button("방정식 풀기", type="primary", key="solve_quad"):
            try:
                solution = self.solver.solve(a, b, c)

                # 풀이 과정 표시
                st.subheader("📖 풀이 과정")
                for step in solution.steps:
                    if step.startswith("주어진") or step.startswith("\n"):
                        st.markdown(f"**{step.strip()}**")
                    else:
                        st.write(step)

                # 결과 표시
                st.markdown("---")
                if solution.solution_type == 'two_real':
                    st.success(f"### ✅ 두 실근: x₁ = {solution.x1}, x₂ = {solution.x2}")

                    # 근과 계수의 관계
                    with st.expander("💡 근과 계수의 관계"):
                        sum_roots = solution.x1 + solution.x2
                        product_roots = solution.x1 * solution.x2
                        st.markdown(f"""
                        **근과 계수의 관계**
                        - 두 근의 합: x₁ + x₂ = -b/a = {-b/a}
                        - 두 근의 곱: x₁ × x₂ = c/a = {c/a}

                        **검산:**
                        - x₁ + x₂ = {sum_roots}
                        - x₁ × x₂ = {product_roots}
                        """)

                elif solution.solution_type == 'one_real':
                    st.success(f"### ✅ 중근: x = {solution.x1}")

                elif solution.solution_type == 'two_complex':
                    st.info(f"### 💠 두 허근 (복소수 해)")
                    st.info(f"x₁ = {solution.x1}")
                    st.info(f"x₂ = {solution.x2}")

                elif solution.solution_type == 'identity':
                    st.warning("### ⚠️ 항등식 (모든 x가 해)")

                else:  # no_solution
                    st.error("### ❌ 해가 없습니다")

            except Exception as e:
                st.error(f"⚠️ 오류: {str(e)}")

    def _render_factoring_method(self):
        """인수분해법 탭"""
        st.subheader("인수분해를 이용한 풀이")

        col1, col2, col3 = st.columns(3)
        with col1:
            a = st.number_input("a (x²의 계수)", value=1.0, format="%.2f", key="fact_a2")
        with col2:
            b = st.number_input("b (x의 계수)", value=-5.0, format="%.2f", key="fact_b2")
        with col3:
            c = st.number_input("c (상수항)", value=6.0, format="%.2f", key="fact_c2")

        if st.button("인수분해법으로 풀기", type="primary", key="solve_fact"):
            try:
                solution = self.solver.solve_by_factoring(a, b, c)

                # 풀이 과정
                st.subheader("📖 풀이 과정")
                for step in solution.steps:
                    if step.startswith("주어진") or step.startswith("\n"):
                        st.markdown(f"**{step.strip()}**")
                    else:
                        st.write(step)

                # 결과
                st.markdown("---")
                if solution.solution_type == 'two_real':
                    st.success(f"### ✅ 해: x = {solution.x1} 또는 x = {solution.x2}")

            except Exception as e:
                st.error(f"⚠️ 오류: {str(e)}")

    def _render_completing_square(self):
        """완전제곱식 탭"""
        st.subheader("완전제곱식을 이용한 풀이")

        col1, col2, col3 = st.columns(3)
        with col1:
            a = st.number_input("a (x²의 계수)", value=1.0, format="%.2f", key="comp_a")
        with col2:
            b = st.number_input("b (x의 계수)", value=-4.0, format="%.2f", key="comp_b")
        with col3:
            c = st.number_input("c (상수항)", value=3.0, format="%.2f", key="comp_c")

        if st.button("완전제곱식으로 풀기", type="primary", key="solve_comp"):
            try:
                solution = self.solver.solve_by_completing_square(a, b, c)

                # 풀이 과정
                st.subheader("📖 풀이 과정")
                for step in solution.steps:
                    if step.startswith("주어진") or step.startswith("\n"):
                        st.markdown(f"**{step.strip()}**")
                    else:
                        st.write(step)

                # 결과
                st.markdown("---")
                if solution.solution_type == 'two_real':
                    st.success(f"### ✅ 해: x₁ = {solution.x1}, x₂ = {solution.x2}")
                elif solution.solution_type == 'one_real':
                    st.success(f"### ✅ 중근: x = {solution.x1}")

            except Exception as e:
                st.error(f"⚠️ 오류: {str(e)}")


class QuadraticFunctionPage:
    """이차함수 페이지"""

    def __init__(self):
        """초기화"""
        self.drawer = QuadraticFunctionDrawer()
        logger.info("이차함수 페이지 초기화")

    def render(self):
        """페이지 렌더링"""
        st.header("📈 이차함수 그래프")
        st.write("**y = ax² + bx + c** 형태의 이차함수 그래프를 그립니다.")

        # 탭 생성
        tab1, tab2, tab3 = st.tabs([
            "📊 그래프 그리기",
            "🎯 꼭짓점과 절편",
            "⚖️ 함수 비교"
        ])

        with tab1:
            self._render_graph()

        with tab2:
            self._render_vertex_intercepts()

        with tab3:
            self._render_comparison()

    def _render_graph(self):
        """그래프 그리기 탭"""
        st.subheader("이차함수 그래프 그리기")

        col1, col2, col3 = st.columns(3)
        with col1:
            a = st.number_input("a (x²의 계수)", value=1.0, format="%.2f", key="qf_a")
        with col2:
            b = st.number_input("b (x의 계수)", value=0.0, format="%.2f", key="qf_b")
        with col3:
            c = st.number_input("c (상수항)", value=0.0, format="%.2f", key="qf_c")

        x_range = st.slider(
            "x축 범위",
            -10, 10, (-5, 5),
            key="qf_range"
        )

        # 함수식 표시
        if a == 1:
            expr = "y = x²"
        elif a == -1:
            expr = "y = -x²"
        else:
            expr = f"y = {a}x²"

        if b > 0:
            expr += f" + {b}x" if b != 1 else " + x"
        elif b < 0:
            expr += f" - {abs(b)}x" if b != -1 else " - x"

        if c > 0:
            expr += f" + {c}"
        elif c < 0:
            expr += f" - {abs(c)}"

        st.latex(expr)

        if st.button("📈 그래프 그리기", type="primary", key="draw_qf"):
            try:
                fig = self.drawer.draw(a, b, c, x_range)
                st.pyplot(fig)

                # 함수 설명
                with st.expander("📚 이차함수 설명"):
                    vertex_x, vertex_y = self.drawer.get_vertex(a, b, c)
                    max_or_min, _, value = self.drawer.find_max_or_min(a, b, c)

                    st.markdown(f"""
                    **이차함수: {expr}**

                    - **그래프 모양**: {'아래로 볼록 (∪)' if a > 0 else '위로 볼록 (∩)'}
                    - **꼭짓점**: ({vertex_x:.2f}, {vertex_y:.2f})
                    - **대칭축**: x = {vertex_x:.2f}
                    - **{max_or_min}**: {value:.2f}
                    - **y절편**: {c}
                    """)

            except Exception as e:
                st.error(f"⚠️ 오류: {str(e)}")

    def _render_vertex_intercepts(self):
        """꼭짓점과 절편 탭"""
        st.subheader("꼭짓점, x절편, y절편 구하기")

        col1, col2, col3 = st.columns(3)
        with col1:
            a = st.number_input("a (x²의 계수)", value=1.0, format="%.2f", key="vi_a")
        with col2:
            b = st.number_input("b (x의 계수)", value=-2.0, format="%.2f", key="vi_b")
        with col3:
            c = st.number_input("c (상수항)", value=-3.0, format="%.2f", key="vi_c")

        if st.button("계산하기", type="primary", key="calc_vi"):
            # 꼭짓점
            vertex_x, vertex_y = self.drawer.get_vertex(a, b, c)

            col_r1, col_r2, col_r3 = st.columns(3)

            with col_r1:
                st.metric("꼭짓점", f"({vertex_x:.2f}, {vertex_y:.2f})")
                st.caption("y = a(x - p)² + q에서 (p, q)")

            # y절편
            with col_r2:
                y_int = self.drawer.get_y_intercept(c)
                st.metric("y절편", f"(0, {y_int})")
                st.caption("x = 0일 때 y값")

            # x절편
            with col_r3:
                x_ints = self.drawer.get_x_intercepts(a, b, c)
                if x_ints is None:
                    st.metric("x절편", "없음")
                    st.caption("실근 없음 (D < 0)")
                elif len(x_ints) == 1:
                    st.metric("x절편 (중근)", f"({x_ints[0]:.2f}, 0)")
                    st.caption("y = 0일 때 x값")
                else:
                    st.metric("x절편", f"2개")
                    st.caption(f"({x_ints[0]:.2f}, 0)")
                    st.caption(f"({x_ints[1]:.2f}, 0)")

            # 표준형 변환
            with st.expander("📐 표준형으로 변환"):
                std_a, p, q = self.drawer.get_vertex_form(a, b, c)
                st.markdown(f"""
                **표준형: y = a(x - p)² + q**

                - a = {std_a}
                - p = {p:.2f}
                - q = {q:.2f}

                **결과:** y = {std_a}(x - {p:.2f})² + {q:.2f}
                """)

    def _render_comparison(self):
        """함수 비교 탭"""
        st.subheader("두 이차함수 비교")

        col1, col2 = st.columns(2)

        with col1:
            st.markdown("**첫 번째 함수**")
            a1 = st.number_input("a₁", value=1.0, format="%.2f", key="cmp_a1")
            b1 = st.number_input("b₁", value=0.0, format="%.2f", key="cmp_b1")
            c1 = st.number_input("c₁", value=0.0, format="%.2f", key="cmp_c1")

        with col2:
            st.markdown("**두 번째 함수**")
            a2 = st.number_input("a₂", value=-1.0, format="%.2f", key="cmp_a2")
            b2 = st.number_input("b₂", value=0.0, format="%.2f", key="cmp_b2")
            c2 = st.number_input("c₂", value=4.0, format="%.2f", key="cmp_c2")

        x_range = st.slider(
            "x축 범위",
            -10, 10, (-5, 5),
            key="cmp_range"
        )

        if st.button("비교 그래프 그리기", type="primary", key="draw_cmp"):
            try:
                fig = self.drawer.compare_graphs(a1, b1, c1, a2, b2, c2, x_range)
                st.pyplot(fig)

                # 비교표
                with st.expander("📊 특징 비교"):
                    v1_x, v1_y = self.drawer.get_vertex(a1, b1, c1)
                    v2_x, v2_y = self.drawer.get_vertex(a2, b2, c2)

                    comparison_data = {
                        "특징": ["그래프 모양", "꼭짓점 x", "꼭짓점 y", "y절편"],
                        "함수 1": [
                            "아래로 볼록" if a1 > 0 else "위로 볼록",
                            f"{v1_x:.2f}",
                            f"{v1_y:.2f}",
                            f"{c1}"
                        ],
                        "함수 2": [
                            "아래로 볼록" if a2 > 0 else "위로 볼록",
                            f"{v2_x:.2f}",
                            f"{v2_y:.2f}",
                            f"{c2}"
                        ]
                    }

                    st.table(comparison_data)

            except Exception as e:
                st.error(f"⚠️ 오류: {str(e)}")


class StatisticsPage:
    """통계 페이지"""

    def __init__(self):
        """초기화"""
        self.calculator = StatisticsCalculator()
        logger.info("통계 페이지 초기화")

    def render(self):
        """페이지 렌더링"""
        st.header("📊 통계 계산기")
        st.write("데이터의 평균, 중앙값, 최빈값, 분산, 표준편차 등을 계산합니다.")

        # 데이터 입력
        st.subheader("📝 데이터 입력")
        data_input = st.text_area(
            "데이터를 쉼표로 구분하여 입력하세요",
            value="10, 20, 30, 40, 50",
            help="예: 10, 20, 30, 40, 50"
        )

        if st.button("계산하기", type="primary"):
            try:
                # 데이터 파싱
                data = [float(x.strip()) for x in data_input.split(',')]

                if not data:
                    st.warning("데이터를 입력해주세요.")
                    return

                # 통계 계산
                result = self.calculator.calculate_all(data)

                # 결과 표시
                col1, col2, col3 = st.columns(3)

                with col1:
                    st.metric("평균", f"{result.mean:.2f}")
                    st.metric("중앙값", f"{result.median:.2f}")

                with col2:
                    st.metric("분산", f"{result.variance:.2f}")
                    st.metric("표준편차", f"{result.std_dev:.2f}")

                with col3:
                    st.metric("범위", f"{result.range_value:.2f}")
                    if result.mode:
                        st.metric("최빈값", ", ".join(map(str, result.mode)))
                    else:
                        st.metric("최빈값", "없음")

                # 사분위수
                with st.expander("📈 사분위수"):
                    q1, q2, q3 = result.quartiles
                    st.write(f"Q1 (제1사분위수): {q1:.2f}")
                    st.write(f"Q2 (제2사분위수): {q2:.2f}")
                    st.write(f"Q3 (제3사분위수): {q3:.2f}")
                    st.write(f"IQR (사분위수 범위): {q3 - q1:.2f}")

                # 계산 과정
                with st.expander("📝 계산 과정"):
                    for step in result.steps:
                        st.write(step)

            except ValueError as e:
                st.error(f"⚠️ 입력 오류: {str(e)}")
            except Exception as e:
                st.error(f"⚠️ 오류: {str(e)}")


class ProbabilityPage:
    """확률 페이지"""

    def __init__(self):
        """초기화"""
        self.calculator = ProbabilityCalculator()
        logger.info("확률 페이지 초기화")

    def render(self):
        """페이지 렌더링"""
        st.header("🎲 확률 계산기")
        st.write("순열, 조합, 확률 등을 계산합니다.")

        tab1, tab2, tab3, tab4 = st.tabs(["순열과 조합", "기본 확률", "합사건", "조건부 확률"])

        with tab1:
            self._render_permutation_combination()

        with tab2:
            self._render_basic_probability()

        with tab3:
            self._render_union_probability()

        with tab4:
            self._render_conditional_probability()

    def _render_permutation_combination(self):
        """순열과 조합 탭"""
        st.subheader("순열과 조합")

        col1, col2 = st.columns(2)

        with col1:
            n = st.number_input("n (전체 개수)", min_value=0, value=5, step=1)
            r = st.number_input("r (선택 개수)", min_value=0, value=3, step=1)

        with col2:
            if st.button("순열 계산 (nPr)", key="perm"):
                try:
                    result = self.calculator.permutation(n, r)
                    st.success(f"**{n}P{r} = {result}**")
                    st.write(f"공식: {n}! / ({n}-{r})! = {result}")
                except Exception as e:
                    st.error(f"⚠️ 오류: {str(e)}")

            if st.button("조합 계산 (nCr)", key="comb"):
                try:
                    result = self.calculator.combination(n, r)
                    st.success(f"**{n}C{r} = {result}**")
                    st.write(f"공식: {n}! / ({r}! × ({n}-{r})!) = {result}")
                except Exception as e:
                    st.error(f"⚠️ 오류: {str(e)}")

    def _render_basic_probability(self):
        """기본 확률 탭"""
        st.subheader("기본 확률")
        st.write("확률 = 경우의 수 / 전체 경우의 수")

        favorable = st.number_input("경우의 수", min_value=0, value=2, step=1)
        total = st.number_input("전체 경우의 수", min_value=1, value=6, step=1)

        if st.button("확률 계산", type="primary"):
            try:
                result = self.calculator.calculate_probability(favorable, total)
                st.success(f"**확률 = {result.description} = {result.probability:.4f}**")

                with st.expander("📝 계산 과정"):
                    for step in result.steps:
                        st.write(step)

            except Exception as e:
                st.error(f"⚠️ 오류: {str(e)}")

    def _render_union_probability(self):
        """합사건 탭"""
        st.subheader("합사건 확률")
        st.write("P(A ∪ B) = P(A) + P(B) - P(A ∩ B)")

        p_a = st.number_input("P(A)", min_value=0.0, max_value=1.0, value=0.3, format="%.4f")
        p_b = st.number_input("P(B)", min_value=0.0, max_value=1.0, value=0.4, format="%.4f")
        p_ab = st.number_input("P(A ∩ B)", min_value=0.0, max_value=1.0, value=0.1, format="%.4f")

        if st.button("합사건 확률 계산", type="primary"):
            try:
                result = self.calculator.calculate_union_probability(p_a, p_b, p_ab)
                st.success(f"**P(A ∪ B) = {result.probability:.4f}**")

                with st.expander("📝 계산 과정"):
                    for step in result.steps:
                        st.write(step)

            except Exception as e:
                st.error(f"⚠️ 오류: {str(e)}")

    def _render_conditional_probability(self):
        """조건부 확률 탭"""
        st.subheader("조건부 확률")
        st.write("P(A|B) = P(A ∩ B) / P(B)")

        p_ab = st.number_input("P(A ∩ B)", min_value=0.0, max_value=1.0, value=0.2, format="%.4f", key="cond_ab")
        p_b = st.number_input("P(B)", min_value=0.0, max_value=1.0, value=0.5, format="%.4f", key="cond_b")

        if st.button("조건부 확률 계산", type="primary"):
            try:
                result = self.calculator.calculate_conditional_probability(p_ab, p_b)
                st.success(f"**P(A|B) = {result.probability:.4f}**")

                with st.expander("📝 계산 과정"):
                    for step in result.steps:
                        st.write(step)

            except Exception as e:
                st.error(f"⚠️ 오류: {str(e)}")


class GeometryPage:
    """기하 페이지"""

    def __init__(self):
        """초기화"""
        self.calculator = GeometryCalculator()
        logger.info("기하 페이지 초기화")

    def render(self):
        """페이지 렌더링"""
        st.header("📐 기하 계산기")
        st.write("도형의 넓이, 둘레, 피타고라스 정리 등을 계산합니다.")

        tab1, tab2, tab3 = st.tabs(["피타고라스 정리", "평면도형 넓이", "평면도형 둘레"])

        with tab1:
            self._render_pythagorean()

        with tab2:
            self._render_areas()

        with tab3:
            self._render_perimeters()

    def _render_pythagorean(self):
        """피타고라스 정리 탭"""
        st.subheader("피타고라스 정리")
        st.write("a² + b² = c²")

        calculation_type = st.radio(
            "계산할 변 선택",
            ["빗변 c 구하기", "밑변 a 구하기", "높이 b 구하기"]
        )

        if calculation_type == "빗변 c 구하기":
            a = st.number_input("밑변 a", min_value=0.1, value=3.0, format="%.2f")
            b = st.number_input("높이 b", min_value=0.1, value=4.0, format="%.2f")

            if st.button("빗변 c 계산", type="primary"):
                result = self.calculator.pythagorean_theorem(a=a, b=b)
                st.success(f"**빗변 c = {result.result:.2f}**")

                with st.expander("📝 계산 과정"):
                    for step in result.steps:
                        st.write(step)

        elif calculation_type == "밑변 a 구하기":
            b = st.number_input("높이 b", min_value=0.1, value=4.0, format="%.2f", key="pyth_b_for_a")
            c = st.number_input("빗변 c", min_value=0.1, value=5.0, format="%.2f")

            if st.button("밑변 a 계산", type="primary"):
                try:
                    result = self.calculator.pythagorean_theorem(b=b, c=c)
                    st.success(f"**밑변 a = {result.result:.2f}**")

                    with st.expander("📝 계산 과정"):
                        for step in result.steps:
                            st.write(step)
                except Exception as e:
                    st.error(f"⚠️ 오류: {str(e)}")

        else:  # 높이 b 구하기
            a = st.number_input("밑변 a", min_value=0.1, value=3.0, format="%.2f", key="pyth_a_for_b")
            c = st.number_input("빗변 c", min_value=0.1, value=5.0, format="%.2f", key="pyth_c_for_b")

            if st.button("높이 b 계산", type="primary"):
                try:
                    result = self.calculator.pythagorean_theorem(a=a, c=c)
                    st.success(f"**높이 b = {result.result:.2f}**")

                    with st.expander("📝 계산 과정"):
                        for step in result.steps:
                            st.write(step)
                except Exception as e:
                    st.error(f"⚠️ 오류: {str(e)}")

    def _render_areas(self):
        """넓이 계산 탭"""
        st.subheader("평면도형 넓이")

        shape = st.selectbox(
            "도형 선택",
            ["삼각형", "직사각형", "원", "사다리꼴", "평행사변형"]
        )

        if shape == "삼각형":
            base = st.number_input("밑변", min_value=0.1, value=5.0, format="%.2f")
            height = st.number_input("높이", min_value=0.1, value=4.0, format="%.2f")

            if st.button("넓이 계산", type="primary"):
                result = self.calculator.triangle_area(base, height)
                st.success(f"**넓이 = {result.result:.2f}**")

                with st.expander("📝 계산 과정"):
                    for step in result.steps:
                        st.write(step)

        elif shape == "직사각형":
            width = st.number_input("가로", min_value=0.1, value=5.0, format="%.2f")
            height = st.number_input("세로", min_value=0.1, value=3.0, format="%.2f")

            if st.button("넓이 계산", type="primary"):
                result = self.calculator.rectangle_area(width, height)
                st.success(f"**넓이 = {result.result:.2f}**")

                with st.expander("📝 계산 과정"):
                    for step in result.steps:
                        st.write(step)

        elif shape == "원":
            radius = st.number_input("반지름", min_value=0.1, value=3.0, format="%.2f")

            if st.button("넓이 계산", type="primary"):
                result = self.calculator.circle_area(radius)
                st.success(f"**넓이 = {result.result:.2f}**")

                with st.expander("📝 계산 과정"):
                    for step in result.steps:
                        st.write(step)

        elif shape == "사다리꼴":
            upper = st.number_input("윗변", min_value=0.1, value=3.0, format="%.2f")
            lower = st.number_input("아랫변", min_value=0.1, value=7.0, format="%.2f")
            height = st.number_input("높이", min_value=0.1, value=4.0, format="%.2f", key="trap_h")

            if st.button("넓이 계산", type="primary"):
                result = self.calculator.trapezoid_area(upper, lower, height)
                st.success(f"**넓이 = {result.result:.2f}**")

                with st.expander("📝 계산 과정"):
                    for step in result.steps:
                        st.write(step)

        else:  # 평행사변형
            base = st.number_input("밑변", min_value=0.1, value=6.0, format="%.2f", key="para_b")
            height = st.number_input("높이", min_value=0.1, value=4.0, format="%.2f", key="para_h")

            if st.button("넓이 계산", type="primary"):
                result = self.calculator.parallelogram_area(base, height)
                st.success(f"**넓이 = {result.result:.2f}**")

                with st.expander("📝 계산 과정"):
                    for step in result.steps:
                        st.write(step)

    def _render_perimeters(self):
        """둘레 계산 탭"""
        st.subheader("평면도형 둘레")

        shape = st.selectbox(
            "도형 선택",
            ["삼각형", "직사각형", "원"],
            key="perim_shape"
        )

        if shape == "삼각형":
            a = st.number_input("변 a", min_value=0.1, value=3.0, format="%.2f", key="tri_a")
            b = st.number_input("변 b", min_value=0.1, value=4.0, format="%.2f", key="tri_b")
            c = st.number_input("변 c", min_value=0.1, value=5.0, format="%.2f", key="tri_c")

            if st.button("둘레 계산", type="primary", key="tri_perim"):
                result = self.calculator.triangle_perimeter(a, b, c)
                st.success(f"**둘레 = {result.result:.2f}**")

                with st.expander("📝 계산 과정"):
                    for step in result.steps:
                        st.write(step)

        elif shape == "직사각형":
            width = st.number_input("가로", min_value=0.1, value=5.0, format="%.2f", key="rect_w")
            height = st.number_input("세로", min_value=0.1, value=3.0, format="%.2f", key="rect_h")

            if st.button("둘레 계산", type="primary", key="rect_perim"):
                result = self.calculator.rectangle_perimeter(width, height)
                st.success(f"**둘레 = {result.result:.2f}**")

                with st.expander("📝 계산 과정"):
                    for step in result.steps:
                        st.write(step)

        else:  # 원
            radius = st.number_input("반지름", min_value=0.1, value=3.0, format="%.2f", key="circle_r")

            if st.button("둘레 계산", type="primary", key="circle_perim"):
                result = self.calculator.circle_circumference(radius)
                st.success(f"**둘레 = {result.result:.2f}**")

                with st.expander("📝 계산 과정"):
                    for step in result.steps:
                        st.write(step)


class CoordinatePage:
    """좌표평면 페이지"""

    def __init__(self):
        """초기화"""
        self.calculator = CoordinateCalculator()
        logger.info("좌표평면 페이지 초기화")

    def render(self):
        """페이지 렌더링"""
        st.header("📍 좌표평면 계산기")
        st.write("두 점 사이의 거리, 중점, 기울기 등을 계산합니다.")

        tab1, tab2, tab3, tab4 = st.tabs(["거리", "중점", "기울기", "점과 직선"])

        with tab1:
            self._render_distance()

        with tab2:
            self._render_midpoint()

        with tab3:
            self._render_slope()

        with tab4:
            self._render_point_line_distance()

    def _render_distance(self):
        """거리 계산 탭"""
        st.subheader("두 점 사이의 거리")
        st.write("d = √[(x₂-x₁)² + (y₂-y₁)²]")

        col1, col2 = st.columns(2)

        with col1:
            st.markdown("**첫 번째 점 A**")
            x1 = st.number_input("x₁", value=0.0, format="%.2f")
            y1 = st.number_input("y₁", value=0.0, format="%.2f")

        with col2:
            st.markdown("**두 번째 점 B**")
            x2 = st.number_input("x₂", value=3.0, format="%.2f")
            y2 = st.number_input("y₂", value=4.0, format="%.2f")

        if st.button("거리 계산", type="primary"):
            result = self.calculator.distance(x1, y1, x2, y2)
            st.success(f"**거리 = {result.result:.2f}**")

            with st.expander("📝 계산 과정"):
                for step in result.steps:
                    st.write(step)

    def _render_midpoint(self):
        """중점 계산 탭"""
        st.subheader("중점 좌표")
        st.write("M = ((x₁+x₂)/2, (y₁+y₂)/2)")

        col1, col2 = st.columns(2)

        with col1:
            st.markdown("**첫 번째 점 A**")
            x1 = st.number_input("x₁", value=0.0, format="%.2f", key="mid_x1")
            y1 = st.number_input("y₁", value=0.0, format="%.2f", key="mid_y1")

        with col2:
            st.markdown("**두 번째 점 B**")
            x2 = st.number_input("x₂", value=4.0, format="%.2f", key="mid_x2")
            y2 = st.number_input("y₂", value=6.0, format="%.2f", key="mid_y2")

        if st.button("중점 계산", type="primary"):
            result = self.calculator.midpoint(x1, y1, x2, y2)
            mx, my = result.result
            st.success(f"**중점 M = ({mx:.2f}, {my:.2f})**")

            with st.expander("📝 계산 과정"):
                for step in result.steps:
                    st.write(step)

    def _render_slope(self):
        """기울기 계산 탭"""
        st.subheader("기울기")
        st.write("m = (y₂-y₁) / (x₂-x₁)")

        col1, col2 = st.columns(2)

        with col1:
            st.markdown("**첫 번째 점 A**")
            x1 = st.number_input("x₁", value=0.0, format="%.2f", key="slope_x1")
            y1 = st.number_input("y₁", value=0.0, format="%.2f", key="slope_y1")

        with col2:
            st.markdown("**두 번째 점 B**")
            x2 = st.number_input("x₂", value=2.0, format="%.2f", key="slope_x2")
            y2 = st.number_input("y₂", value=4.0, format="%.2f", key="slope_y2")

        if st.button("기울기 계산", type="primary"):
            try:
                result = self.calculator.slope(x1, y1, x2, y2)
                st.success(f"**기울기 m = {result.result:.2f}**")

                with st.expander("📝 계산 과정"):
                    for step in result.steps:
                        st.write(step)

            except ValueError as e:
                st.error(f"⚠️ {str(e)}")

    def _render_point_line_distance(self):
        """점과 직선 거리 탭"""
        st.subheader("점과 직선 사이의 거리")
        st.write("직선: ax + by + c = 0")
        st.write("거리: |ax₀ + by₀ + c| / √(a² + b²)")

        st.markdown("**점 P**")
        px = st.number_input("x₀", value=2.0, format="%.2f")
        py = st.number_input("y₀", value=3.0, format="%.2f")

        st.markdown("**직선 방정식: ax + by + c = 0**")
        a = st.number_input("a", value=1.0, format="%.2f")
        b = st.number_input("b", value=-1.0, format="%.2f")
        c = st.number_input("c", value=0.0, format="%.2f")

        if st.button("거리 계산", type="primary", key="ptline_dist"):
            result = self.calculator.point_line_distance(px, py, a, b, c)
            st.success(f"**거리 = {result.result:.2f}**")

            with st.expander("📝 계산 과정"):
                for step in result.steps:
                    st.write(step)


# 페이지 팩토리 함수
def get_page(page_name: str):
    """
    페이지 이름에 따라 페이지 객체 반환

    Args:
        page_name: 페이지 이름

    Returns:
        페이지 객체

    Raises:
        ValueError: 페이지 이름이 유효하지 않을 때
    """
    pages = {
        "소인수분해": PrimeFactorPage,
        "정수와 유리수": RationalNumberPage,
        "문자와 식": AlgebraicExpressionPage,
        "일차방정식": LinearEquationPage,
        "일차부등식": LinearInequalityPage,
        "연립방정식": SimultaneousEquationsPage,
        "일차함수": LinearFunctionPage,
        "제곱근과 실수": SquareRootPage,
        "인수분해": FactorizationPage,
        "이차방정식": QuadraticEquationPage,
        "이차함수": QuadraticFunctionPage,
        "함수와 그래프": FunctionGraphPage,
        "통계": StatisticsPage,
        "확률": ProbabilityPage,
        "기하": GeometryPage,
        "좌표평면": CoordinatePage,
        "📚 연습 문제": PracticePage,
        "❌ 오답 노트": MistakeNotesPage,
        "📊 학습 진도": ProgressPage,
        "📜 계산 히스토리": HistoryPage
    }

    page_class = pages.get(page_name)
    if page_class is None:
        logger.error(f"알 수 없는 페이지: {page_name}")
        raise ValueError(f"알 수 없는 페이지: {page_name}")

    return page_class()
