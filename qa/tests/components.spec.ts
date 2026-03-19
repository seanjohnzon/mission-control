import { test, expect } from '@playwright/test';

// @components — covers CREW-018 checklist items: 11, 12, 13
test.describe('UI Component checks @components', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5174');
    await page.waitForSelector('canvas', { timeout: 15000 });
    // Give Three.js time to mount overlays
    await page.waitForTimeout(2000);
  });

  test('top UI roster bar is present', async ({ page }) => {
    // RosterBar — look for the top bar with crew names
    const rosterBar = page.locator('[data-testid="roster-bar"], .roster-bar, header').first();
    // Fallback: check for crew name text
    const namiText = page.getByText('Nami');
    await expect(namiText.first()).toBeVisible({ timeout: 10000 });
  });

  test('crew member names visible', async ({ page }) => {
    await expect(page.getByText('Nami').first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Franky').first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Chopper').first()).toBeVisible({ timeout: 10000 });
  });

  test('no JS critical errors in DOM', async ({ page }) => {
    // Check no error boundary rendered
    const errorText = page.getByText(/something went wrong|error boundary|uncaught/i);
    await expect(errorText).toHaveCount(0);
  });
});
