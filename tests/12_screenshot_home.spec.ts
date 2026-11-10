import { test } from '@playwright/test';

test('capture home redesign screenshot', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'screenshot-home-redesign.png', fullPage: true });
});

