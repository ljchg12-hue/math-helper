import { test, expect } from '@playwright/test'

// ✅ LOW #10: E2E 기본 시나리오 테스트

test.describe('MathHelper 기본 기능', () => {
  test('앱이 정상적으로 로드된다', async ({ page }) => {
    await page.goto('/')

    // 헤더 확인
    await expect(page.getByRole('heading', { name: /수학 도우미/ })).toBeVisible()

    // 탭 확인
    await expect(page.getByRole('button', { name: /계산기/ })).toBeVisible()
    await expect(page.getByRole('button', { name: /개념/ })).toBeVisible()
    await expect(page.getByRole('button', { name: /기출문제/ })).toBeVisible()
    await expect(page.getByRole('button', { name: /설정/ })).toBeVisible()
  })

  test('카테고리를 선택하면 계산기가 표시된다', async ({ page }) => {
    await page.goto('/')

    // 일차방정식 카테고리 클릭
    await page.getByRole('button', { name: /일차방정식/ }).click()

    // UniversalCalculator가 표시됨
    await expect(page.getByText(/현재 모드:/)).toBeVisible()
    await expect(page.getByRole('textbox')).toBeVisible()
  })

  test('모드를 전환할 수 있다', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /일차방정식/ }).click()

    // 방정식 모드로 전환
    await page.getByRole('button', { name: /📐 방정식/ }).click()
    await expect(page.getByText(/현재 모드: 방정식/)).toBeVisible()

    // 미분 모드로 전환
    await page.getByRole('button', { name: /∂ 미분/ }).click()
    await expect(page.getByText(/현재 모드: 미분/)).toBeVisible()
  })

  test('수식을 입력하고 계산할 수 있다', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /일차방정식/ }).click()

    // 수식 입력
    const input = page.getByRole('textbox')
    await input.fill('2 + 3')

    // 계산 버튼 클릭
    await page.getByRole('button', { name: /계산하기/ }).click()

    // 결과 확인 (비동기이므로 기다림)
    await expect(page.getByText(/결과:/)).toBeVisible({ timeout: 3000 })
  })
})

test.describe('키보드 단축키', () => {
  test('Ctrl+1-8로 모드를 전환할 수 있다', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /일차방정식/ }).click()

    // Ctrl+2로 방정식 모드로 전환
    await page.keyboard.press('Control+2')
    await expect(page.getByText(/현재 모드: 방정식/)).toBeVisible()

    // Ctrl+3으로 미분 모드로 전환
    await page.keyboard.press('Control+3')
    await expect(page.getByText(/현재 모드: 미분/)).toBeVisible()
  })

  test('Ctrl+Enter로 계산을 실행할 수 있다', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /일차방정식/ }).click()

    // 수식 입력
    const input = page.getByRole('textbox')
    await input.fill('5 + 3')

    // Ctrl+Enter로 계산
    await input.press('Control+Enter')

    // 결과 확인
    await expect(page.getByText(/결과:/)).toBeVisible({ timeout: 3000 })
  })

  test('Ctrl+K로 키보드를 토글할 수 있다', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /일차방정식/ }).click()

    // 초기 상태: 키보드 표시
    await expect(page.getByText(/키보드 숨기기/)).toBeVisible()

    // Ctrl+K로 토글
    await page.keyboard.press('Control+K')
    await expect(page.getByText(/키보드 표시/)).toBeVisible()

    // 다시 Ctrl+K로 토글
    await page.keyboard.press('Control+K')
    await expect(page.getByText(/키보드 숨기기/)).toBeVisible()
  })
})

test.describe('언어 전환', () => {
  test('언어를 한국어에서 영어로 전환할 수 있다', async ({ page }) => {
    await page.goto('/')

    // 초기: 한국어
    await expect(page.getByRole('heading', { name: /수학 도우미/ })).toBeVisible()

    // 언어 전환 버튼 클릭
    await page.getByRole('button', { name: /한국어/ }).click()

    // 영어로 변경됨
    await expect(page.getByRole('heading', { name: /Math Helper/ })).toBeVisible()
    await expect(page.getByRole('button', { name: /Calculator/ })).toBeVisible()
  })

  test('언어가 localStorage에 저장된다', async ({ page }) => {
    await page.goto('/')

    // 영어로 전환
    await page.getByRole('button', { name: /한국어/ }).click()

    // 페이지 새로고침
    await page.reload()

    // 영어 유지
    await expect(page.getByRole('heading', { name: /Math Helper/ })).toBeVisible()
  })
})
