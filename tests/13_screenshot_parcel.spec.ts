import { test } from '@playwright/test';

test('capture send parcel redesign screenshot', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/courier');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'screenshot-parcel-redesign.png', fullPage: true });
});
