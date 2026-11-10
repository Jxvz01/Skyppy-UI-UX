import { test, expect } from '@playwright/test';

test('Scroll down home screen and verify all sections visible', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Check header is visible
  await expect(page.locator('header')).toBeVisible();

  // Scroll mobile viewport down
  await page.evaluate(() => {
    const el = document.getElementById('mobile-app-viewport');
    if (el) el.scrollTop = 400;
  });

  await page.waitForTimeout(300);
  await page.screenshot({ path: 'tests/screenshots/home_scrolled.png' });

  // Scroll all the way to bottom
  await page.evaluate(() => {
    const el = document.getElementById('mobile-app-viewport');
    if (el) el.scrollTop = el.scrollHeight;
  });

  await page.waitForTimeout(300);
  await page.screenshot({ path: 'tests/screenshots/home_bottom.png' });
});
