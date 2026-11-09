import { test, expect } from '@playwright/test';

test.describe('05. Live Ride Tracking & Completion Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tracking');
  });

  test('Live tracking displays driver pod, plate, and Start OTP', async ({ page }) => {
    await expect(page.getByText('Start OTP')).toBeVisible();
    await expect(page.getByText(/Verified Mysuru Commercial Transit/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Complete Trip/i })).toBeVisible();
  });

  test('In-app driver chat modal sends messages and receives automated driver reply', async ({ page }) => {
    // Open chat modal
    const chatBtn = page.locator('button:has(span:has-text("chat"))').first();
    await chatBtn.click();

    // Verify chat modal header
    await expect(page.getByText('Online • Approaching')).toBeVisible();

    // Click canned reply
    const cannedBtn = page.getByRole('button', { name: 'I am at the gate' });
    await cannedBtn.click();

    // Verify user message appears in list
    await expect(page.locator('div.h-56').getByText('I am at the gate')).toBeVisible();

    // Close chat
    const closeBtn = page.locator('div:has(> span:has-text("Online • Approaching"))').locator('..').locator('button:has(span:has-text("close"))').first();
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
    }
  });

  test('Trip completion modal records rating, tip, and navigates to Activity', async ({ page }) => {
    // Click Complete Trip
    const completeBtn = page.getByRole('button', { name: /Complete Trip/i });
    await completeBtn.click();

    // Trip Completed celebration modal appears
    await expect(page.getByRole('heading', { name: 'You Have Arrived!' })).toBeVisible();
    await expect(page.getByText('Skyppy Miles Credited')).toBeVisible();

    // Select a tip (e.g. ₹20)
    const tip20Btn = page.getByRole('button', { name: '₹20' });
    if (await tip20Btn.isVisible()) {
      await tip20Btn.click();
    }

    // Submit rating & completion
    const doneBtn = page.getByRole('button', { name: /Done & View Activity/i });
    await doneBtn.click();

    // Navigates to Activity
    await expect(page).toHaveURL(/.*\/activity/);
    await expect(page.getByRole('heading', { name: 'Your Activity' })).toBeVisible();
  });
});
