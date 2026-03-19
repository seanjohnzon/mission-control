import { test, expect } from '@playwright/test';

// @visual — covers CREW-018 checklist items: 2, 3, 4, 5, 6
test.describe('Visual checks @visual', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5174');
    // Wait for Three.js canvas to be visible
    await page.waitForSelector('canvas', { timeout: 15000 });
  });

  test('page loads with no console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    // Reload and wait
    await page.reload();
    await page.waitForSelector('canvas', { timeout: 15000 });
    expect(errors.filter(e => !e.includes('favicon'))).toHaveLength(0);
  });

  test('canvas renders (scene is live)', async ({ page }) => {
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
    // Canvas should have non-zero dimensions
    const box = await canvas.boundingBox();
    expect(box?.width).toBeGreaterThan(100);
    expect(box?.height).toBeGreaterThan(100);
  });

  test('page title is set', async ({ page }) => {
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });
});
