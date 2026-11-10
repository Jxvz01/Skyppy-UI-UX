import { test, expect } from '@playwright/test';

test('Scroll down home screen and verify all sections visible including recent destinations', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Check header is visible
  await expect(page.locator('header')).toBeVisible();

  // Scroll down to view Quick Actions & Miles
  await page.evaluate(() => {
    const el = document.getElementById('mobile-app-viewport');
    if (el) el.scrollTop = 380;
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'tests/screenshots/home_scrolled.png' });

  // Scroll all the way to bottom to view Recent Destinations
  await page.evaluate(() => {
    const el = document.getElementById('mobile-app-viewport');
    if (el) el.scrollTop = el.scrollHeight;
  });
  await page.waitForTimeout(300);

  // Verify Recent Destinations header and items exist
  await expect(page.locator('text=Recent Destinations').or(page.locator('text=ಇತ್ತೀಚಿನ ತಾಣಗಳು'))).toBeVisible();
  await expect(page.locator('text=JSS Medical College & Hospital')).toBeVisible();
  await expect(page.locator('text=Mysuru Railway Station (MYS)')).toBeVisible();

  await page.screenshot({ path: 'tests/screenshots/home_bottom.png' });
});
