import { test, expect } from '@playwright/test';

test.describe('Skyppy Experience Redesign: Miles Orbit, Product Cohesion & Map Experience', () => {
  test.beforeEach(async ({ page }) => {
    // Set standard mobile device viewport
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
  });

  test('01. Home Page renders signature Miles Orbit preview and navigates to Miles Hub', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Verify Home page branding
    await expect(page.locator('text=Skyppy').first()).toBeVisible();

    // Verify Skyppy Miles bento card with preview
    const milesCard = page.locator('text=Skyppy Miles').first();
    await expect(milesCard).toBeVisible();

    // Verify compact Miles Orbit SVG is present
    const milesSvg = page.locator('svg[aria-label="Skyppy Miles Orbit System"]').first();
    await expect(milesSvg).toBeVisible();

    // Click to explore Skyppy Miles
    await page.locator('text=View Rewards').click();
    await expect(page).toHaveURL(/.*\/miles/);
  });

  test('02. Skyppy Miles Hub renders complete signature Miles Orbit hero with all visual elements', async ({ page }) => {
    await page.goto('/miles');
    await page.waitForLoadState('networkidle');

    // Verify Header and Branding
    await expect(page.locator('text=Skyppy Miles').first()).toBeVisible();
    await expect(page.locator('text=Gold Explorer').first()).toBeVisible();

    // Check balance and tagline
    await expect(page.locator('text=YOUR MILES').first()).toBeVisible();
    await expect(page.locator('text=Ride. Send. Earn. Redeem.').first()).toBeVisible();

    // Check Quick Action buttons
    await expect(page.getByRole('button', { name: 'Earn', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Redeem', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Benefits', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'History', exact: true })).toBeVisible();

    // Check Featured rewards and Ways to earn
    await expect(page.locator('text=Featured rewards').first()).toBeVisible();
    await expect(page.locator('text=Ways to earn Miles').first()).toBeVisible();
    await expect(page.locator('text=Your progress').first()).toBeVisible();
  });

  test('03. Miles interactive lifecycle: Earning simulation, and voucher redemption', async ({ page }) => {
    await page.goto('/miles');
    await page.waitForLoadState('networkidle');

    // 1. Simulate ride earn
    const earnButton = page.getByRole('button', { name: 'Earn', exact: true });
    await expect(earnButton).toBeVisible();
    await earnButton.click();

    // 2. Simulate voucher redemption
    const redeemButton = page.getByRole('button', { name: 'Redeem', exact: true });
    await expect(redeemButton).toBeVisible();
    await redeemButton.click();
  });

  test('04. Map Experience: Custom desaturated tiles, bespoke markers, and glassmorphic controls', async ({ page }) => {
    await page.goto('/tracking');
    await page.waitForLoadState('networkidle');

    // Verify OpenStreetMap container and tiles
    const mapContainer = page.locator('.skyppy-osm-container');
    await expect(mapContainer).toBeVisible();

    // Verify live transit pill
    await expect(page.locator('text=Live Transit • Mysuru Central')).toBeVisible();

    // Verify custom markers
    await expect(page.locator('.custom-osm-pickup')).toBeVisible();
    await expect(page.locator('.custom-osm-dest')).toBeVisible();
    await expect(page.locator('.custom-osm-vehicle')).toBeVisible();

    // Verify driver telemetry on vehicle marker
    await expect(page.locator('.custom-osm-vehicle:has-text("Ramesh")')).toBeVisible();

    // Verify glassmorphic map controls (Compass, Zoom in/out, Recenter)
    await expect(page.locator('button[aria-label="Zoom in map"]')).toBeVisible();
    await expect(page.locator('button[aria-label="Zoom out map"]')).toBeVisible();
    await expect(page.locator('button[aria-label="Recenter map"]')).toBeVisible();

    // Test Zoom In
    await page.locator('button[aria-label="Zoom in map"]').click();

    // Test Recenter
    await page.locator('button[aria-label="Recenter map"]').click();
  });

  test('05. Navigation Continuity: Bottom tab bar indicator and screen transitions', async ({ page }) => {
    // Switch between bottom tabs and check active indicators
    await page.locator('nav button:has-text("Activity")').click();
    await expect(page).toHaveURL(/.*\/activity/);

    await page.locator('nav button:has-text("Miles")').click();
    await expect(page).toHaveURL(/.*\/miles/);

    await page.locator('nav button:has-text("Profile")').click();
    await expect(page).toHaveURL(/.*\/profile/);

    await page.locator('nav button:has-text("Home")').click();
    await expect(page).toHaveURL('/');
  });

  test('06. System Regression Protection: Courier and Driver Experience remain fully functional', async ({ page }) => {
    // Test Courier Experience
    await page.goto('/courier');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Send a Parcel').first()).toBeVisible();

    // Test Driver Experience route
    await page.goto('/driver-view');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText('Driver Partner').first()).toBeVisible();
    await expect(page.getByText('ONLINE').first()).toBeVisible();
    await expect(page.getByRole('button', { name: /Passenger App/i })).toBeVisible();
  });
});
