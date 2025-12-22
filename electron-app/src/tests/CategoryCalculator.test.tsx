/**
 * CategoryCalculator 컴포넌트 테스트
 * - 카테고리 전환 시 UniversalCalculator 재마운트
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import CategoryCalculator from '../components/CategoryCalculator'

// Mock window.mathAPI
beforeEach(() => {
  window.mathAPI = {
    evaluate: vi.fn(() => ({ success: true, result: '5' })),
    solve: vi.fn(() => ({ success: true, solutions: [2], variable: 'x', steps: [] })),
    differentiate: vi.fn(() => ({ success: true, result: '2*x' })),
    integrate: vi.fn(() => ({ success: true, result: 'x^2' })),
    simplify: vi.fn(() => ({ success: true, result: '2*x+2' })),
    factor: vi.fn(() => ({ success: true, result: '(x-2)(x-3)' })),
    expand: vi.fn(() => ({ success: true, result: 'x^2+5*x+6' })),
    limit: vi.fn(() => ({ success: true, result: '1' })),
  }
})

describe('CategoryCalculator - 재마운트 검증', () => {
  it('카테고리를 선택하면 UniversalCalculator가 마운트된다', () => {
    render(<CategoryCalculator />)

    // 초기에는 카테고리 목록만 표시
    expect(screen.getByText(/일차방정식/)).toBeInTheDocument()

    // 카테고리 선택
    const categoryButton = screen.getByRole('button', { name: /일차방정식/ })
    fireEvent.click(categoryButton)

    // UniversalCalculator가 마운트됨 (현재 모드 표시 확인)
    expect(screen.getByText(/\[현재 모드: 계산\]/)).toBeInTheDocument()
  })

  it('다른 카테고리로 전환하면 UniversalCalculator가 재마운트된다', () => {
    render(<CategoryCalculator />)

    // 첫 번째 카테고리 선택
    const category1 = screen.getByRole('button', { name: /일차방정식/ })
    fireEvent.click(category1)

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '2x+3=7' } })
    expect(input.value).toBe('2x+3=7')

    // 두 번째 카테고리 선택 (뒤로가기)
    const backButton = screen.getByRole('button', { name: /← 뒤로/ })
    fireEvent.click(backButton)

    const category2 = screen.getByRole('button', { name: /이차방정식/ })
    fireEvent.click(category2)

    // 입력이 초기화됨 (재마운트되었음을 의미)
    const newInput = screen.getByRole('textbox')
    expect(newInput.value).toBe('')
  })

  it('key prop이 selectedCategory로 설정되어 있다', () => {
    // This is an implementation detail test
    // The key prop should be set to force remounting
    // We verify this by checking that state is reset when category changes
    render(<CategoryCalculator />)

    const category1 = screen.getByRole('button', { name: /일차방정식/ })
    fireEvent.click(category1)

    // 방정식 모드로 전환
    const equationButton = screen.getByRole('button', { name: /📐 방정식/ })
    fireEvent.click(equationButton)
    expect(screen.getByText(/\[현재 모드: 방정식\]/)).toBeInTheDocument()

    // 뒤로가기 후 다른 카테고리 선택
    const backButton = screen.getByRole('button', { name: /← 뒤로/ })
    fireEvent.click(backButton)

    const category2 = screen.getByRole('button', { name: /이차방정식/ })
    fireEvent.click(category2)

    // 모드가 초기값(계산)으로 리셋됨
    expect(screen.getByText(/\[현재 모드: 계산\]/)).toBeInTheDocument()
  })
})
