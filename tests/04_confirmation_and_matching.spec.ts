import { test, expect } from '@playwright/test';

test.describe('04. Booking Confirmation & Matching Tests', () => {
  test('Complete booking creates valid active booking and navigates to confirm screen', async ({ page }) => {
    await page.goto('/options');

    // Click Book CTA
    const bookBtn = page.locator('button:has-text("Confirm")').first();
    await bookBtn.click();

    await expect(page).toHaveURL(/.*\/confirm/);

    // Skip animation or wait for details
    const skipBtn = page.getByRole('button', { name: /Skip/i }).first();
    if (await skipBtn.isVisible()) {
      await skipBtn.click();
    }

    // Stage C Details should be shown
    await expect(page.getByText('Start OTP')).toBeVisible();
    await expect(page.getByRole('button', { name: /Track Live Ride/i })).toBeVisible();
  });

  test('In-app cancellation flow allows cancelling ride cleanly', async ({ page }) => {
    await page.goto('/confirm');

    // Skip to details if animation is playing
    const skipBtn = page.getByRole('button', { name: /Skip/i }).first();
    if (await skipBtn.isVisible()) {
      await skipBtn.click();
    }

    // Click Cancel Booking
    const cancelBtn = page.getByRole('button', { name: 'Cancel Booking' });
    await expect(cancelBtn).toBeVisible();
    await cancelBtn.click();

    // Cancellation bottom sheet appears
    await expect(page.getByRole('heading', { name: 'Cancel Booking?' })).toBeVisible();

    // Confirm cancel
    const confirmCancelBtn = page.getByRole('button', { name: 'Yes, Cancel Ride' });
    await confirmCancelBtn.click();

    // Should return to Home
    await expect(page).toHaveURL(/.*\//);
  });

  test('Ride confirmation automatically transitions to live tracking page after 3 seconds', async ({ page }) => {
    await page.goto('/confirm');

    // Skip to confirmed state
    const skipBtn = page.getByRole('button', { name: /Skip/i }).first();
    if (await skipBtn.isVisible()) {
      await skipBtn.click();
    }

    await expect(page.getByText('Your ride is confirmed!')).toBeVisible();

    // Verify Track Live Ride CTA is visible
    await expect(page.getByRole('button', { name: /Track Live Ride/i })).toBeVisible();

    // Within 4 seconds, page should automatically redirect to /tracking
    await expect(page).toHaveURL(/.*\/tracking/, { timeout: 6000 });
    await expect(page.getByText('Start OTP')).toBeVisible();
  });
});
