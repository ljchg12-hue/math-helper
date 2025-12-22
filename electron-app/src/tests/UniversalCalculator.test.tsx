/**
 * UniversalCalculator 컴포넌트 테스트
 * - 모드 전환
 * - 입력 검증
 * - 결과 표시 (항등식/일반)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import UniversalCalculator from '../components/UniversalCalculator'

// Mock window.mathAPI
beforeEach(() => {
  window.mathAPI = {
    evaluate: vi.fn((expr) => ({
      success: true,
      result: '5'
    })),
    solve: vi.fn((expr, variable) => ({
      success: true,
      solutions: [2],
      variable,
      steps: ['원래 방정식: 2x+3=7', '해: x = 2']
    })),
    differentiate: vi.fn((expr, variable) => ({
      success: true,
      result: '2*x'
    })),
    integrate: vi.fn((expr, variable) => ({
      success: true,
      result: 'x^2'
    })),
    simplify: vi.fn((expr) => ({
      success: true,
      result: '2*x+2'
    })),
    factor: vi.fn((expr) => ({
      success: true,
      result: '(x-2)(x-3)'
    })),
    expand: vi.fn((expr) => ({
      success: true,
      result: 'x^2+5*x+6'
    })),
    limit: vi.fn((expr, variable, value, direction) => ({
      success: true,
      result: '1'
    })),
  }
})

describe('UniversalCalculator - 모드 전환', () => {
  it('초기 모드가 "계산"이다', () => {
    render(<UniversalCalculator />)
    expect(screen.getByText(/\[현재 모드: 계산\]/)).toBeInTheDocument()
  })

  it('방정식 버튼을 클릭하면 모드가 전환된다', () => {
    render(<UniversalCalculator />)
    const equationButton = screen.getByRole('button', { name: /📐 방정식/ })
    fireEvent.click(equationButton)

    expect(screen.getByText(/\[현재 모드: 방정식\]/)).toBeInTheDocument()
  })

  it('미분 버튼을 클릭하면 모드가 전환된다', () => {
    render(<UniversalCalculator />)
    const diffButton = screen.getByRole('button', { name: /∂ 미분/ })
    fireEvent.click(diffButton)

    expect(screen.getByText(/\[현재 모드: 미분\]/)).toBeInTheDocument()
  })

  it('적분 버튼을 클릭하면 모드가 전환된다', () => {
    render(<UniversalCalculator />)
    const integralButton = screen.getByRole('button', { name: /∫ 적분/ })
    fireEvent.click(integralButton)

    expect(screen.getByText(/\[현재 모드: 적분\]/)).toBeInTheDocument()
  })

  it('극한 버튼을 클릭하면 추가 입력 필드가 표시된다', () => {
    render(<UniversalCalculator />)
    const limitButton = screen.getByRole('button', { name: /∞ 극한/ })
    fireEvent.click(limitButton)

    expect(screen.getByPlaceholderText(/0, inf/)).toBeInTheDocument()
    expect(screen.getByDisplayValue(/양방향/)).toBeInTheDocument()
  })

  it('모드 전환 시 입력과 결과가 초기화된다', () => {
    render(<UniversalCalculator />)

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '2+3' } })

    const equationButton = screen.getByRole('button', { name: /📐 방정식/ })
    fireEvent.click(equationButton)

    expect(input.value).toBe('')
  })
})

describe('UniversalCalculator - 입력 검증', () => {
  it('변수명 입력 시 알파벳만 허용된다', () => {
    render(<UniversalCalculator />)

    // 방정식 모드로 전환
    const equationButton = screen.getByRole('button', { name: /📐 방정식/ })
    fireEvent.click(equationButton)

    const variableInput = screen.getByDisplayValue(/x/)
    fireEvent.change(variableInput, { target: { value: '123abc' } })

    // 숫자는 제거되고 알파벳만 남는다
    expect(variableInput.value).toBe('abc')
  })

  it('극한 접근값 입력 시 숫자와 inf만 허용된다', () => {
    render(<UniversalCalculator />)

    const limitButton = screen.getByRole('button', { name: /∞ 극한/ })
    fireEvent.click(limitButton)

    const limitValueInput = screen.getByPlaceholderText(/0, inf/)

    // 숫자 입력
    fireEvent.change(limitValueInput, { target: { value: '5' } })
    expect(limitValueInput.value).toBe('5')

    // inf 입력
    fireEvent.change(limitValueInput, { target: { value: 'inf' } })
    expect(limitValueInput.value).toBe('inf')
  })
})

describe('UniversalCalculator - 결과 표시', () => {
  it('일반 방정식 결과를 표시한다', async () => {
    render(<UniversalCalculator />)

    const equationButton = screen.getByRole('button', { name: /📐 방정식/ })
    fireEvent.click(equationButton)

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '2x+3=7' } })

    const calculateButton = screen.getByRole('button', { name: /방정식하기/ })
    fireEvent.click(calculateButton)

    await waitFor(() => {
      // 결과가 표시되는지 확인 (색상은 CSS 클래스로만 구분)
      expect(screen.getByText(/결과:/)).toBeInTheDocument()
    })
  })

  it('항등식 결과를 표시한다', async () => {
    window.mathAPI.solve = vi.fn(() => ({
      success: true,
      solutions: [],
      variable: 'x',
      isIdentity: true,
      steps: ['원래 방정식: 2x=2x', '결과: 항등식 (모든 x 값이 해)']
    }))

    render(<UniversalCalculator />)

    const equationButton = screen.getByRole('button', { name: /📐 방정식/ })
    fireEvent.click(equationButton)

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '2x=2x' } })

    const calculateButton = screen.getByRole('button', { name: /방정식하기/ })
    fireEvent.click(calculateButton)

    await waitFor(() => {
      // 항등식 라벨 확인
      expect(screen.getByText(/항등식:/)).toBeInTheDocument()
    })
  })

  it('로딩 상태를 표시한다', async () => {
    // Delay the response to test loading state
    let resolvePromise
    window.mathAPI.evaluate = vi.fn(() =>
      new Promise(resolve => {
        resolvePromise = resolve
      })
    )

    render(<UniversalCalculator />)

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '2+3' } })

    const calculateButton = screen.getByRole('button', { name: /계산하기/ })
    fireEvent.click(calculateButton)

    // 로딩 중 상태 확인
    await waitFor(() => {
      expect(screen.getByText(/계산 중/)).toBeInTheDocument()
    })

    // 해결
    resolvePromise({ success: true, result: '5' })

    await waitFor(() => {
      expect(screen.queryByText(/계산 중/)).not.toBeInTheDocument()
    })
  })

  it('에러 메시지를 빨간색으로 표시한다', async () => {
    window.mathAPI.evaluate = vi.fn(() => ({
      success: false,
      error: '계산할 수 없습니다'
    }))

    render(<UniversalCalculator />)

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'invalid' } })

    const calculateButton = screen.getByRole('button', { name: /계산하기/ })
    fireEvent.click(calculateButton)

    await waitFor(() => {
      expect(screen.getByText(/❌ 계산할 수 없습니다/)).toBeInTheDocument()
    })
  })

  it('풀이 과정을 표시한다', async () => {
    render(<UniversalCalculator />)

    const equationButton = screen.getByRole('button', { name: /📐 방정식/ })
    fireEvent.click(equationButton)

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '2x+3=7' } })

    const calculateButton = screen.getByRole('button', { name: /방정식하기/ })
    fireEvent.click(calculateButton)

    await waitFor(() => {
      expect(screen.getByText(/풀이 과정:/)).toBeInTheDocument()
    })
  })
})
