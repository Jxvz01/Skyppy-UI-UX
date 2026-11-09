import { test, expect } from '@playwright/test';

test.describe('08. Visual Inspection of All 5 Vehicle Categories', () => {
  test('Inspect Auto, Mini, Hatchback, Sedan, and SUV on Confirmation Screen', async ({ page }) => {
    await page.goto('/confirm');

    // Skip animation if still searching
    const skipBtn = page.getByRole('button', { name: /Skip/i }).first();
    if (await skipBtn.isVisible()) {
      await skipBtn.click();
      await page.waitForTimeout(500);
    }

    await expect(page.getByText('Your ride is confirmed!')).toBeVisible();

    const categories = [
      { key: 'auto', name: 'Auto', model: 'Bajaj RE Electric', img: '/vehicles/auto.png' },
      { key: 'mini', name: 'Mini', model: 'Tata Tiago', img: '/vehicles/mini.png' },
      { key: 'hatchback', name: 'Hatchback', model: 'Hyundai i20', img: '/vehicles/hatchback.png' },
      { key: 'sedan', name: 'Sedan', model: 'Honda City', img: '/vehicles/sedan.png' },
      { key: 'suv', name: 'SUV', model: 'Hyundai Creta', img: '/vehicles/suv.png' }
    ];

    for (const cat of categories) {
      // Click category selector button
      const catBtn = page.locator(`button:has-text("${cat.name}")`).last();
      await catBtn.click();
      await page.waitForTimeout(300);

      // Verify category model text is updated
      await expect(page.getByText(cat.model)).toBeVisible();

      // Verify vehicle hero image is visible with correct src
      const heroImg = page.locator('img[alt*=" - "]').first();
      await expect(heroImg).toBeVisible();
      await expect(heroImg).toHaveAttribute('src', cat.img);

      // Capture screenshot
      await page.screenshot({ path: `screenshot-inspection-${cat.key}.png` });
    }
  });
});

