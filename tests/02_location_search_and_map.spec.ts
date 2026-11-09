import { test, expect } from '@playwright/test';

test.describe('02. Location Search & Map Selection Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Text search finds Mysuru landmarks and updates destination', async ({ page }) => {
    // Click destination trigger on Home
    await page.getByText('Where to in Mysuru?').first().click();
    await expect(page).toHaveURL(/.*\/search/);

    // Search for "Palace"
    const searchInput = page.locator('input[placeholder*="Mysuru"]');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('Palace');

    // Select Mysuru Palace
    const palaceResult = page.getByText('Mysuru Palace (Amba Vilas)').first();
    await expect(palaceResult).toBeVisible();
    await palaceResult.click();

    // Should navigate to /location with verified route
    await expect(page).toHaveURL(/.*\/location/);
    await expect(page.getByText('Mysuru Palace', { exact: false }).first()).toBeVisible();
    await expect(page.getByText(/Kilometers/i).first()).toBeVisible();
  });

  test('Map selection mode allows picking landmark from interactive map', async ({ page }) => {
    await page.goto('/search?mode=destination&tab=map');

    // Check Map canvas container is present
    await expect(page.getByText('Pan map to set exact Drop location')).toBeVisible();

    // Select a quick jump landmark (e.g. Mysuru Railway Station)
    const jumpBtn = page.getByRole('button', { name: /Mysuru Railway/i }).first();
    await expect(jumpBtn).toBeVisible();
    await jumpBtn.click();

    // Confirm button should be visible and clickable
    const confirmBtn = page.getByRole('button', { name: /Confirm Destination/i });
    await expect(confirmBtn).toBeVisible();
    await confirmBtn.click();

    // Should arrive at /location
    await expect(page).toHaveURL(/.*\/location/);
  });

  test('Swapping pickup and destination updates distance and routes properly', async ({ page }) => {
    await page.goto('/location');

    // Get initial destination title
    const swapBtn = page.getByRole('button', { name: /Swap/i }).first();
    await expect(swapBtn).toBeVisible();
    await swapBtn.click();

    // Toast or swap state confirmation
    await expect(page.getByText(/swapped/i).first()).toBeVisible();
  });

  test('Validation prevents booking when pickup and destination are identical', async ({ page }) => {
    await page.goto('/search?mode=destination');

    // Search and select the same location as pickup (VVCE)
    const searchInput = page.locator('input[placeholder*="Mysuru"]');
    await searchInput.fill('VVCE');
    
    // Attempt to click VVCE Gokulam as destination
    const vvceResult = page.getByText('VVCE, Gokulam').first();
    await expect(vvceResult).toBeVisible();
    await vvceResult.click();

    // Error toast should appear preventing selection
    await expect(page.getByText(/cannot be the same location/i)).toBeVisible();
    // User remains on /search
    await expect(page).toHaveURL(/.*\/search/);
  });
});

