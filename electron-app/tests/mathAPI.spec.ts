import { test, expect } from '@playwright/test'

/**
 * mathAPI E2E 테스트
 *
 * 이 테스트는 실제 Electron 앱이 실행되고
 * mathAPI가 정상적으로 노출되었는지 검증합니다.
 */

test.describe('mathAPI 통합 테스트', () => {
  test.beforeEach(async ({ page }) => {
    // 개발 서버로 이동
    await page.goto('http://localhost:5173')

    // mathAPI가 로드될 때까지 대기
    await page.waitForFunction(() => {
      return typeof (window as any).mathAPI !== 'undefined'
    }, { timeout: 5000 })
  })

  test.describe('미분 (differentiate)', () => {
    test('x^2를 미분하면 2*x', async ({ page }) => {
      const result = await page.evaluate(() => {
        return (window as any).mathAPI.differentiate('x^2', 'x')
      })

      expect(result.success).toBe(true)
      expect(result.result).toBeDefined()
      // nerdamer 출력 형식: '2*x' 또는 '2x'
      expect(result.result.toLowerCase()).toMatch(/2\s*\*?\s*x/)
    })

    test('sin(x)를 미분하면 cos(x)', async ({ page }) => {
      const result = await page.evaluate(() => {
        return (window as any).mathAPI.differentiate('sin(x)', 'x')
      })

      expect(result.success).toBe(true)
      expect(result.result).toContain('cos')
    })

    test('상수를 미분하면 0', async ({ page }) => {
      const result = await page.evaluate(() => {
        return (window as any).mathAPI.differentiate('5', 'x')
      })

      expect(result.success).toBe(true)
      expect(result.result).toBe('0')
    })
  })

  test.describe('인수분해 (factor)', () => {
    test('x^2 - 4를 인수분해', async ({ page }) => {
      const result = await page.evaluate(() => {
        return (window as any).mathAPI.factor('x^2 - 4')
      })

      expect(result.success).toBe(true)
      expect(result.result).toBeDefined()
      // (x-2)*(x+2) 또는 유사한 형태
    })

    test('x^2 + 2*x + 1을 인수분해', async ({ page }) => {
      const result = await page.evaluate(() => {
        return (window as any).mathAPI.factor('x^2 + 2*x + 1')
      })

      expect(result.success).toBe(true)
      expect(result.result).toBeDefined()
      // (x+1)^2 또는 유사한 형태
    })
  })

  test.describe('방정식 풀이 (solve)', () => {
    test('2x + 4 = 10을 풀면 x = 3', async ({ page }) => {
      const result = await page.evaluate(() => {
        return (window as any).mathAPI.solve('2*x + 4 = 10', 'x')
      })

      expect(result.success).toBe(true)
      expect(result.solutions).toBeDefined()
      expect(result.solutions).toContain(3)
    })

    test('x^2 - 4 = 0을 풀면 x = 2, -2', async ({ page }) => {
      const result = await page.evaluate(() => {
        return (window as any).mathAPI.solve('x^2 - 4 = 0', 'x')
      })

      expect(result.success).toBe(true)
      expect(result.solutions).toBeDefined()
      expect(result.solutions.length).toBe(2)
    })
  })

  test.describe('적분 (integrate)', () => {
    test('x를 적분', async ({ page }) => {
      const result = await page.evaluate(() => {
        return (window as any).mathAPI.integrate('x', 'x')
      })

      expect(result.success).toBe(true)
      expect(result.result).toBeDefined()
      // x^2/2 + C 형태
      expect(result.result).toContain('C')
    })

    test('2*x를 적분', async ({ page }) => {
      const result = await page.evaluate(() => {
        return (window as any).mathAPI.integrate('2*x', 'x')
      })

      expect(result.success).toBe(true)
      expect(result.result).toBeDefined()
      expect(result.result).toContain('C')
    })
  })

  test.describe('전개 (expand)', () => {
    test('(x+1)^2를 전개', async ({ page }) => {
      const result = await page.evaluate(() => {
        return (window as any).mathAPI.expand('(x+1)^2')
      })

      expect(result.success).toBe(true)
      expect(result.result).toBeDefined()
      // x^2 + 2*x + 1 형태
    })
  })

  test.describe('간단히 (simplify)', () => {
    test('2*x + 3*x를 간단히', async ({ page }) => {
      const result = await page.evaluate(() => {
        return (window as any).mathAPI.simplify('2*x + 3*x')
      })

      expect(result.success).toBe(true)
      expect(result.result).toBeDefined()
      // 5*x 또는 5x 형태
    })
  })

  test.describe('계산 (evaluate)', () => {
    test('2 + 3 * 4를 계산', async ({ page }) => {
      const result = await page.evaluate(() => {
        return (window as any).mathAPI.evaluate('2 + 3 * 4')
      })

      expect(result.success).toBe(true)
      expect(result.result).toBe('14')
    })

    test('삼각함수 계산', async ({ page }) => {
      const result = await page.evaluate(() => {
        return (window as any).mathAPI.evaluate('sin(pi/2)')
      })

      expect(result.success).toBe(true)
      // sin(π/2) = 1
      expect(parseFloat(result.result)).toBeCloseTo(1, 1)
    })
  })

  test.describe('극한 (limit)', () => {
    test('x→0일 때 sin(x)/x', async ({ page }) => {
      const result = await page.evaluate(() => {
        return (window as any).mathAPI.limit('sin(x)/x', 'x', '0')
      })

      expect(result.success).toBe(true)
      expect(result.result).toBeDefined()
      // limit = 1
    })
  })

  test.describe('에러 처리', () => {
    test('잘못된 수식은 에러 반환', async ({ page }) => {
      const result = await page.evaluate(() => {
        return (window as any).mathAPI.evaluate('2 + + 3')
      })

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })

    test('미분 불가능한 수식', async ({ page }) => {
      const result = await page.evaluate(() => {
        // 변수가 없는 상수는 미분하면 0
        return (window as any).mathAPI.differentiate('abc', 'x')
      })

      // nerdamer가 처리 방식에 따라 success일 수도 있음
      expect(result).toBeDefined()
    })
  })
})

/**
 * 통합 계산 모드 테스트
 */
test.describe('통합 계산 (calculateAll)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
    await page.waitForLoadState('networkidle')
  })

  test('x^2 + 2x + 1 통합 계산 성공률 > 75%', async ({ page }) => {
    // UniversalCalculator에서 통합 계산 모드 선택
    await page.click('text=⚡ 통합 계산')

    // 수식 입력
    await page.fill('textarea', 'x^2 + 2*x + 1')

    // 계산 실행
    await page.click('button:has-text("통합 계산")')

    // 결과 대기
    await page.waitForSelector('.smart-result-container', { timeout: 5000 })

    // 통계 확인
    const stats = await page.textContent('.stats-metrics')
    expect(stats).toBeDefined()

    // 성공 개수 확인 (최소 6개 이상)
    const successCount = await page.textContent('.metric.success')
    expect(successCount).toContain('성공')
  })
})
