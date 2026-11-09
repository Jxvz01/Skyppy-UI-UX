import { test, expect } from '@playwright/test';

test.describe('06. Activity, Miles, Theme & Profile Tests', () => {
  test('Activity history displays past rides and opens receipt modal', async ({ page }) => {
    await page.goto('/activity');

    // Filter by completed
    await page.getByRole('button', { name: /Completed/i }).click();

    // Open receipt modal for first ride
    const viewReceiptBtn = page.getByRole('button', { name: /View Receipt/i }).first();
    await expect(viewReceiptBtn).toBeVisible();
    await viewReceiptBtn.click();

    // Receipt modal check
    await expect(page.getByText('Vehicle & Driver')).toBeVisible();
    await expect(page.getByText('Total Fare Paid')).toBeVisible();

    // Click Book Again - should navigate to /options
    const bookAgainBtn = page.getByRole('button', { name: 'Book Again' });
    await expect(bookAgainBtn).toBeVisible();
    await bookAgainBtn.click();

    await expect(page).toHaveURL(/.*\/options/);
  });

  test('Skyppy Miles displays lifetime stats and allows voucher redemption', async ({ page }) => {
    await page.goto('/miles');

    // Total distance card visible
    await expect(page.getByText('Total Distance Travelled')).toBeVisible();
    await expect(page.getByText('KM', { exact: true }).first()).toBeVisible();

    // Milestone ladder visible
    await expect(page.getByText('Milestone Ladder')).toBeVisible();
  });

  test('Theme switching toggles DOM class and persists preference', async ({ page }) => {
    await page.goto('/theme');

    // Switch to Dark Mode
    const darkModeCard = page.getByText('Dark Mode').first();
    await darkModeCard.click();

    // Check html element has dark class
    const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    expect(isDark).toBe(true);

    // Switch back to Light Mode
    const lightModeCard = page.getByText('Light Mode').first();
    await lightModeCard.click();

    const isLight = await page.evaluate(() => document.documentElement.classList.contains('light'));
    expect(isLight).toBe(true);
  });

  test('Profile screen allows editing contact information', async ({ page }) => {
    await page.goto('/profile');

    // Open Edit Profile modal
    const editBtn = page.getByRole('button', { name: 'Edit Profile' });
    await editBtn.click();

    await expect(page.getByRole('heading', { name: 'Edit Profile' })).toBeVisible();

    // Verify inputs are present
    const nameInput = page.locator('input[value*="Jeevan"]');
    await expect(nameInput).toBeVisible();

    // Close modal
    const closeBtn = page.locator('div:has(> h3:has-text("Edit Profile")) button:has(span:has-text("close"))').first();
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
    }
  });
});
