import { test } from '@playwright/test';

const viewports = [
  { width: 360, height: 800, name: '360x800' },
  { width: 375, height: 812, name: '375x812' },
  { width: 390, height: 844, name: '390x844' },
  { width: 412, height: 915, name: '412x915' }
];

for (const vp of viewports) {
  test(`Inspect layout at ${vp.name}`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `tests/screenshots/home_${vp.name}.png` });

    // Also take screenshot of courier home
    await page.goto('/courier');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `tests/screenshots/courier_${vp.name}.png` });
  });
}

