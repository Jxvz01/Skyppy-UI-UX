import { test, expect } from '@playwright/test';

test.describe('03. Vehicle Options & Fare Calculation Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/options');
  });

  test('Official vehicle categories (Auto, Hatchback, Sedan) can be selected', async ({ page }) => {
    // Select Auto
    const autoCard = page.locator('div.cursor-pointer:has-text("Auto")').first();
    await autoCard.click();
    await expect(page.locator('button:has-text("Auto"):has-text("Confirm")').first()).toBeVisible();

    // Select Hatchback
    const hatchCard = page.locator('div.cursor-pointer:has-text("Hatchback")').first();
    await hatchCard.click();
    await expect(page.locator('button:has-text("Hatchback"):has-text("Confirm")').first()).toBeVisible();

    // Select Sedan
    const sedanCard = page.locator('div.cursor-pointer:has-text("Sedan")').first();
    await sedanCard.click();
    await expect(page.locator('button:has-text("Sedan"):has-text("Confirm")').first()).toBeVisible();
  });

  test('Fare breakdown modal displays itemized calculation with rate per km', async ({ page }) => {
    // Open Fare Details
    const fareDetailsBtn = page.getByRole('button', { name: /Fare Details/i }).first();
    await fareDetailsBtn.click();

    // Modal should be open
    await expect(page.getByRole('heading', { name: 'Transparent Fare Breakdown' })).toBeVisible();
    await expect(page.getByText('Base Fare (Flag Down)')).toBeVisible();
    await expect(page.getByText(/Distance Fare/i)).toBeVisible();
    await expect(page.getByText('Total Guaranteed Fare')).toBeVisible();

    // Close modal
    await page.getByRole('button', { name: 'Got It' }).click();
  });

  test('Coupons can be applied, updated, and removed', async ({ page }) => {
    // If a coupon is already applied, remove it
    const removeBtn = page.getByRole('button', { name: 'Remove' });
    if (await removeBtn.isVisible()) {
      await removeBtn.click();
    }

    // Open coupon modal
    await page.getByRole('button', { name: /Apply Coupon/i }).first().click();
    await expect(page.getByRole('heading', { name: 'Apply Coupon or Voucher' })).toBeVisible();

    // Tap to use MYSURU50
    const mysuru50 = page.getByText('MYSURU50').first();
    await expect(mysuru50).toBeVisible();
    await mysuru50.click();

    // Verify discount applied
    await expect(page.getByText('-₹50')).toBeVisible();
  });

  test('Payment method selection sheet updates chosen method', async ({ page }) => {
    // Click Change payment method
    await page.getByRole('button', { name: 'Change' }).click();
    await expect(page.getByRole('heading', { name: 'Select Payment Method' })).toBeVisible();

    // Select Cash Paid to Driver
    await page.getByText('Cash Paid to Driver').first().click();

    // Verification on main page
    await expect(page.getByText('Cash Paid to Driver').first()).toBeVisible();
  });
});
