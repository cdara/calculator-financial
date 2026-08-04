import { test, expect, type Page, type BrowserContext } from '@playwright/test'

/**
 * Load the app online so the service worker can cache assets,
 * then switch to offline mode and reload to verify PWA behavior.
 */
async function goOffline(page: Page, context: BrowserContext) {
  await page.goto('/')
  await page.waitForLoadState('networkidle')

  await page.waitForFunction(
    () => 'serviceWorker' in navigator && navigator.serviceWorker.controller !== null,
    { timeout: 15000 }
  )

  await context.setOffline(true)
  await page.reload({ waitUntil: 'domcontentloaded' })
}

test.describe('Offline Functionality', () => {
  test('should launch and load offline', async ({ page, context }) => {
    await goOffline(page, context)

    await expect(page.locator('h1')).toContainText('FinCalc Suite')
    await expect(page.locator('header').getByText('Professional Financial Calculator')).toBeVisible()
  })

  test('should perform calculations offline', async ({ page, context }) => {
    await goOffline(page, context)

    await page.click('text=Simple Interest')
    await page.fill('input[placeholder="Enter principal amount"]', '10000')
    await page.fill('input[placeholder="Enter interest rate"]', '5')
    await page.fill('input[placeholder="Enter time period"]', '3')
    await page.click('button:has-text("Calculate")')
    await page.waitForSelector('text=Results')

    await expect(page.locator('text=Results')).toBeVisible()
    await expect(page.getByText('1500.00', { exact: true })).toBeVisible()
    await expect(page.getByText('11500.00', { exact: true })).toBeVisible()
  })

  test('should have zero outbound network requests after initial load', async ({ page, context }) => {
    const requests: string[] = []

    context.on('request', request => {
      requests.push(request.url())
    })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    requests.length = 0

    await page.click('text=Simple Interest')
    await page.fill('input[placeholder="Enter principal amount"]', '10000')
    await page.fill('input[placeholder="Enter interest rate"]', '5')
    await page.fill('input[placeholder="Enter time period"]', '3')
    await page.click('button:has-text("Calculate")')
    await page.waitForSelector('text=Results')

    await page.click('text=Compound Interest')
    await page.fill('input[placeholder="Enter principal amount"]', '10000')
    await page.fill('input[placeholder="Enter annual interest rate"]', '5')
    await page.fill('input[placeholder="Enter compounding frequency"]', '12')
    await page.fill('input[placeholder="Enter investment duration"]', '10')
    await page.click('button:has-text("Calculate")')
    await page.waitForSelector('text=Results')

    expect(requests.length).toBe(0)
  })

  test('should handle all calculators offline', async ({ page, context }) => {
    await goOffline(page, context)

    await page.click('text=Compound Interest')
    await page.fill('input[placeholder="Enter principal amount"]', '10000')
    await page.fill('input[placeholder="Enter annual interest rate"]', '5')
    await page.fill('input[placeholder="Enter compounding frequency"]', '12')
    await page.fill('input[placeholder="Enter investment duration"]', '10')
    await page.click('button:has-text("Calculate")')
    await expect(page.locator('text=Results')).toBeVisible()

    await page.click('text=Simple Interest')
    await page.fill('input[placeholder="Enter principal amount"]', '10000')
    await page.fill('input[placeholder="Enter interest rate"]', '5')
    await page.fill('input[placeholder="Enter time period"]', '3')
    await page.click('button:has-text("Calculate")')
    await expect(page.locator('text=Results')).toBeVisible()

    await page.click('text=Mortgage')
    await page.fill('input[placeholder="Enter loan amount"]', '300000')
    await page.fill('input[placeholder="Enter annual interest rate"]', '4.5')
    await page.fill('input[placeholder="Enter loan term"]', '30')
    await page.click('button:has-text("Calculate")')
    await expect(page.locator('text=Monthly Payment Summary')).toBeVisible()

    await page.click('text=TVM Solver')
    await page.getByRole('button', { name: 'N', exact: true }).click()
    await page.fill('input[placeholder="Enter pv"]', '-1000')
    await page.fill('input[placeholder="Enter fv"]', '10000')
    await page.fill('input[placeholder="Enter pmt"]', '-100')
    await page.fill('input[placeholder="Enter iy"]', '5')
    await page.click('button:has-text("Calculate N")')
    await expect(page.locator('text=Result')).toBeVisible()

    await page.click('text=CAGR')
    await page.fill('input[placeholder="Enter beginning value"]', '1000')
    await page.fill('input[placeholder="Enter ending value"]', '2000')
    await page.fill('input[placeholder="Enter number of years"]', '10')
    await page.click('button:has-text("Calculate")')
    await expect(page.locator('text=Result')).toBeVisible()
  })

  test('should validate inputs offline', async ({ page, context }) => {
    await goOffline(page, context)

    await page.click('text=Simple Interest')
    await page.click('button:has-text("Calculate")')

    await expect(page.locator('text=Principal is required')).toBeVisible()
  })
})
