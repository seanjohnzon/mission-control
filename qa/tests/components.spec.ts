import { test, expect } from '@playwright/test';

// @components — covers CREW-018 checklist items: 11, 12, 13
test.describe('UI Component checks @components', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5174');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
  });

  test('top UI roster bar is present', async ({ page }) => {
    const rosterText = page.getByText('STRAW HAT HQ');
    const namiText = page.getByText('Nami');
    const headingCount = await rosterText.count();
    const namiCount = await namiText.count();
    expect(headingCount + namiCount).toBeGreaterThan(0);
  });

  test('crew names exist in DOM', async ({ page }) => {
    const crewNames = ['Nami', 'Franky', 'Chopper'];
    let found = 0;
    for (const name of crewNames) {
      const count = await page.getByText(name).count();
      if (count > 0) found++;
    }
    expect(found).toBeGreaterThan(0);
  });

  test('no JS critical errors in DOM', async ({ page }) => {
    const errorText = page.getByText(/something went wrong|error boundary/i);
    await expect(errorText).toHaveCount(0);
  });
});
