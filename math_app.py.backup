import streamlit as st
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

def main():
    st.set_page_config(page_title="중1 수학 도우미", layout="wide")
    
    # 1. 사이드바 메뉴
    menu = st.sidebar.selectbox("학습 메뉴 선택", ["소인수분해", "일차방정식", "함수와 그래프"])
    
    st.title("중학교 1학년 수학 학습 도우미")

    # 2. 소인수분해 기능
    if menu == "소인수분해":
        st.header("소인수분해 계산기")
        st.write("자연수를 입력하면 소인수의 곱으로 나타냅니다.")
        
        number = st.number_input("2 이상의 자연수를 입력하세요", min_value=2, step=1, value=12)
        
        if st.button("소인수분해 하기"):
            n = int(number)
            original_n = n
            factors = {}
            d = 2
            
            # 소인수 구하기 로직
            while d * d <= n:
                while n % d == 0:
                    factors[d] = factors.get(d, 0) + 1
                    n //= d
                d += 1
            if n > 1:
                factors[n] = factors.get(n, 0) + 1
            
            # 결과 문자열 포맷팅
            result_parts = []
            for factor in sorted(factors.keys()):
                count = factors[factor]
                if count == 1:
                    result_parts.append(f"{factor}")
                else:
                    result_parts.append(f"{factor}^{count}")
            
            result_str = " x ".join(result_parts)
            
            st.success(f"결과: {original_n} = {result_str}")

    # 3. 일차방정식 기능
    elif menu == "일차방정식":
        st.header("일차방정식 풀이 (ax + b = c)")
        
        col1, col2, col3 = st.columns(3)
        with col1:
            a = st.number_input("a 값 (x의 계수)", value=2.0)
        with col2:
            b = st.number_input("b 값 (상수항 1)", value=3.0)
        with col3:
            c = st.number_input("c 값 (상수항 2)", value=7.0)
            
        st.latex(f"{a}x + {b} = {c}")
        
        if st.button("방정식 풀기"):
            st.subheader("풀이 과정")
            
            # 1단계: 이항
            rhs = c - b
            st.write(f"1. 상수항 이항: {b}를 우변으로 옮깁니다.")
            st.code(f"{a}x = {c} - {b}")
            
            # 2단계: 정리
            st.write(f"2. 우변 정리:")
            st.code(f"{a}x = {rhs}")
            
            # 3단계: 답 구하기 및 예외처리
            if a == 0:
                if rhs == 0:
                    st.warning("결과: 해가 무수히 많습니다 (부정)")
                else:
                    st.error("결과: 해가 없습니다 (불능)")
            else:
                x = rhs / a
                # 정수로 떨어지면 정수로 표현
                if x.is_integer():
                    x = int(x)
                
                st.write(f"3. 양변을 x의 계수({a})로 나눕니다.")
                st.success(f"정답: x = {x}")

    # 4. 함수와 그래프 기능
    elif menu == "함수와 그래프":
        st.header("함수 그래프 그리기")
        
        func_type = st.radio("함수 종류 선택", ["정비례 (y = ax)", "반비례 (y = a/x)"])
        
        col1, col2 = st.columns(2)
        with col1:
            a_val = st.number_input("a 값 (상수)", value=1.0)
        with col2:
            x_range = st.slider("x축 범위 설정", -10, 10, (-5, 5))
        
        if st.button("그래프 그리기"):
            fig, ax = plt.subplots()
            
            # x축, y축 중심선 그리기
            ax.axhline(y=0, color='k', linewidth=1)
            ax.axvline(x=0, color='k', linewidth=1)
            ax.grid(True, linestyle='--', alpha=0.6)
            
            start, end = x_range
            
            if func_type == "정비례 (y = ax)":
                x = np.linspace(start, end, 100)
                y = a_val * x
                ax.plot(x, y, label=f'y = {a_val}x', color='blue')
                
            else: # 반비례 (y = a/x)
                if a_val == 0:
                    st.warning("a가 0이면 반비례 그래프를 그릴 수 없습니다.")
                    return

                # 0을 포함하지 않도록 구간 분리
                x_neg = np.linspace(start, -0.01, 100)
                x_pos = np.linspace(0.01, end, 100)
                
                # 범위 내에 데이터가 있을 때만 그리기
                if start < 0:
                    y_neg = a_val / x_neg
                    ax.plot(x_neg, y_neg, color='red')
                if end > 0:
                    y_pos = a_val / x_pos
                    ax.plot(x_pos, y_pos, color='red', label=f'y = {a_val}/x')
                
                # y축 범위 제한 (무한대로 발산하는 것 방지)
                ax.set_ylim(-10, 10)

            ax.legend()
            st.pyplot(fig)

if __name__ == "__main__":
    main()