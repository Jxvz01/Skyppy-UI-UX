import { test, expect } from '@playwright/test';

test.describe('01. Navigation & App Shell Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Persistent bottom navigation is visible on Home, Activity, Miles, and Profile', async ({ page }) => {
    // 1. Home tab active
    const homeTab = page.locator('nav a:has-text("Home"), nav button:has-text("Home")').first();
    await expect(page.locator('nav')).toBeVisible();

    // 2. Click Activity tab
    await page.locator('nav a[href="/activity"], nav button:has-text("Activity")').first().click();
    await expect(page).toHaveURL(/.*\/activity/);
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Your Activity' })).toBeVisible();

    // 3. Click Miles tab
    await page.locator('nav a[href="/miles"], nav button:has-text("Miles")').first().click();
    await expect(page).toHaveURL(/.*\/miles/);
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.getByText('Skyppy Miles', { exact: false }).first()).toBeVisible();

    // 4. Click Profile tab
    await page.locator('nav a[href="/profile"], nav button:has-text("Profile")').first().click();
    await expect(page).toHaveURL(/.*\/profile/);
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.getByText('Jeevan H.').first()).toBeVisible();

    // 5. Navigate back to Home
    await page.locator('nav a[href="/"], nav button:has-text("Home")').first().click();
    await expect(page).toHaveURL(/.*\//);
    await expect(page.locator('nav')).toBeVisible();
  });

  test('Language toggle switches between English and Kannada across interface', async ({ page }) => {
    const langBtn = page.getByRole('button', { name: /Switch language/i });
    await expect(langBtn).toBeVisible();

    // Switch to Kannada
    await langBtn.click();
    await expect(page.getByText(/ತಕ್ಷಣದ ಸವಾರಿ|ಮುಖಪುಟ|ರೈಡ್‌ಗಳು|ಹೋಮ್/i).first()).toBeVisible();

    // Switch back to English
    await langBtn.click();
    await expect(page.getByText(/Instant Ride|Where to in Mysuru/i).first()).toBeVisible();
  });

  test('Notifications modal opens, displays live alerts, and marks all as read', async ({ page }) => {
    const notifBtn = page.getByRole('button', { name: 'Notifications' });
    await notifBtn.click();

    // Modal should be visible
    await expect(page.getByRole('heading', { name: 'Mysuru Live Alerts' })).toBeVisible();
    await expect(page.getByText('Driver Ramesh K. is on the way')).toBeVisible();

    // Click Mark All as Read
    const markReadBtn = page.getByRole('button', { name: 'Mark All as Read' });
    await markReadBtn.click();

    // Close modal
    const closeBtn = page.locator('div:has(> h3:has-text("Mysuru Live Alerts")) button:has(span:has-text("close"))').first();
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
    }
  });
});
