import { test, expect } from '@playwright/test';

test('Inspect new high-fidelity daylight vector map on live tracking', async ({ page }) => {
  await page.goto('/tracking');
  await expect(page.getByText('Start OTP')).toBeVisible();
  await expect(page.getByText('Live Transit • Mysuru Central')).toBeVisible();

  // Wait 1 second for animations to settle
  await page.waitForTimeout(1000);

  // Take screenshot of live tracking screen
  await page.screenshot({ path: 'screenshot-live-tracking-map.png' });
});

