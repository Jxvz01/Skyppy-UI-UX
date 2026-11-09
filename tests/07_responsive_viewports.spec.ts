import { test, expect } from '@playwright/test';

const viewports = [
  { width: 360, height: 800, name: '360x800' },
  { width: 375, height: 812, name: '375x812' },
  { width: 390, height: 844, name: '390x844' },
  { width: 412, height: 915, name: '412x915' }
];

for (const vp of viewports) {
  test.describe(`07. Responsive Viewport Checks [${vp.name}]`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test(`Home screen renders without horizontal scroll overflow in ${vp.name}`, async ({ page }) => {
      await page.goto('/');

      // Check no horizontal scrollbar on body
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasHorizontalScroll).toBe(false);

      // Verify bottom nav is visible
      await expect(page.locator('nav')).toBeVisible();
    });

    test(`Ride options and booking sheet fit correctly in ${vp.name}`, async ({ page }) => {
      await page.goto('/options');

      // Book button visible and clickable
      const bookBtn = page.locator('button:has-text("Book")').first();
      await expect(bookBtn).toBeVisible();

      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasHorizontalScroll).toBe(false);
    });
  });
}

