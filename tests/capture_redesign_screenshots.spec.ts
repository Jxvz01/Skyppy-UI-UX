import { test } from '@playwright/test';

test('Capture overhauled passenger flow screenshots', async ({ page }) => {
  // 1. Home
  await page.goto('http://localhost:3000/');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'docs/uiux-audit/screenshots/redesign_01_home.png' });

  // 2. Search (replaces cluttered "02 Select Locations")
  await page.goto('http://localhost:3000/search');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'docs/uiux-audit/screenshots/redesign_02_search.png' });

  // 3. Search with query "Palace"
  const searchInput = page.locator('input[placeholder*="Mysuru"]');
  if (await searchInput.isVisible()) {
    await searchInput.fill('Palace');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'docs/uiux-audit/screenshots/redesign_02_search_query.png' });
  }

  // 4. Map Picker mode
  await page.goto('http://localhost:3000/search?mode=destination&tab=map');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'docs/uiux-audit/screenshots/redesign_02_map_picker.png' });

  // 5. Route Confirmation (/location)
  await page.goto('http://localhost:3000/location');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'docs/uiux-audit/screenshots/redesign_03_route_confirm.png' });

  // 6. Ride Options (/options)
  await page.goto('http://localhost:3000/options');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'docs/uiux-audit/screenshots/redesign_04_ride_options.png' });
});
