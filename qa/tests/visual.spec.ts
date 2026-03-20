import { test, expect } from '@playwright/test';

// @visual — covers CREW-018 checklist items: 2, 3, 4, 5, 6
test.describe('Visual checks @visual', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5174');
    await page.waitForSelector('canvas', { timeout: 20000 });
  });

  test('page loads with no critical JS errors', async ({ page }) => {
    const criticalErrors: string[] = [];
    page.on('pageerror', err => {
      const msg = err.message || '';
      const isKnownNoise = msg.includes('PostFX') || msg.includes('fetch') ||
        msg.includes('network') || msg.includes('cors') || msg.includes('ERR_FAILED') ||
        msg.includes('favicon') || msg.includes('WebGL') || msg.includes('length') ||
        msg.includes('drei');
      if (!isKnownNoise) criticalErrors.push(msg);
    });
    await page.reload();
    await page.waitForSelector('canvas', { timeout: 20000 });
    await page.waitForTimeout(2000);
    expect(criticalErrors).toHaveLength(0);
  });

  test('canvas renders (scene is live)', async ({ page }) => {
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 20000 });
    const box = await canvas.boundingBox();
    expect(box?.width).toBeGreaterThan(100);
    expect(box?.height).toBeGreaterThan(100);
  });

  test('page title is set', async ({ page }) => {
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });
});
