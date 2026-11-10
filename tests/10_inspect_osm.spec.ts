import { test, expect } from '@playwright/test';

test('Inspect OpenStreetMap on live tracking', async ({ page }) => {
  await page.goto('/tracking');
  await expect(page.getByText('Start OTP')).toBeVisible();

  // Wait 1.5s for map tiles and markers to load
  await page.waitForTimeout(1500);

  // Take screenshot
  await page.screenshot({ path: 'screenshot-openstreetmap.png' });
});

