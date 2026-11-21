import { test, expect } from '@playwright/test';
import * as path from 'path';

test.describe('17. Skyppy Real Road Map, Driver Approach & Safety Sharing', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
  });

  test('01. Live tracking renders clean road network without fake lines and shows driver approach', async ({ page }) => {
    await page.goto('/tracking');
    await page.waitForLoadState('domcontentloaded');

    // 1. Verify clean map container
    const map = page.locator('.skyppy-osm-container');
    await expect(map).toBeVisible();

    // 2. Verify clean road elements (Pickup pin, vehicle marker, and corridor pill)
    await expect(page.locator('.custom-osm-pickup')).toBeVisible();
    await expect(page.locator('.custom-osm-vehicle')).toBeVisible();
    await expect(page.locator('text=Live Transit • Mysuru Central')).toBeVisible();

    // 3. Verify driver telemetry on vehicle marker
    await expect(page.locator('.custom-osm-vehicle:has-text("Ramesh")')).toBeVisible();

    // 4. Verify Start OTP card and vehicle plate
    await expect(page.getByText('Start OTP')).toBeVisible();
    await expect(page.getByText('KA-09 AB 4217', { exact: true })).toBeVisible();

    // 5. Verify no fake dashed lines
    const dashedLines = page.locator('path[stroke-dasharray="4, 8"]');
    await expect(dashedLines).toHaveCount(0);

    // Capture screenshot of driver approach on live map
    await page.screenshot({ path: 'docs/uiux-audit/screenshots/real_driver_approach.png' });
  });

  test('02. Interactive stepper advances through real road stages to destination', async ({ page }) => {
    await page.goto('/tracking');
    await page.waitForLoadState('domcontentloaded');

    // 1. Click "At Pickup" stage
    const atPickupStage = page.locator('span:has-text("At Pickup")').first();
    await atPickupStage.click();
    await expect(page.getByText('Driver Arrived at Pickup')).toBeVisible();
    await expect(page.getByText(/Share your Start OTP to board/i)).toBeVisible();

    // 2. Click "On Ride" stage
    const onRideStage = page.locator('span:has-text("On Ride")').first();
    await onRideStage.click();
    await expect(page.getByText('Trip in Progress')).toBeVisible();

    // Destination pin should now be clearly visible
    await expect(page.locator('.custom-osm-dest')).toBeVisible();

    // Capture screenshot of on-ride road navigation
    await page.screenshot({ path: 'docs/uiux-audit/screenshots/real_on_ride_navigation.png' });
  });

  test('03. Live trip sharing modal allows selecting contacts, sharing link, and stopping sharing', async ({ page }) => {
    await page.goto('/tracking');
    await page.waitForLoadState('domcontentloaded');

    // 1. Click "Share Live Trip" button
    const shareBtn = page.getByRole('button', { name: 'Share Live Trip' });
    await expect(shareBtn).toBeVisible();
    await shareBtn.click();

    // 2. Verify Share Live Trip Modal appears
    await expect(page.getByRole('heading', { name: 'Share Live Trip' })).toBeVisible();
    await expect(page.getByText('Live passenger safety tracking')).toBeVisible();

    // 3. Verify trusted contacts list
    await expect(page.getByText('Ananya H. (Sister)')).toBeVisible();
    await expect(page.getByText('K. Venkatesh (Father)')).toBeVisible();

    // 4. Verify granular sharing options
    await expect(page.getByText('Live Vehicle Road Position & Route')).toBeVisible();
    await expect(page.getByText('Driver & Vehicle License Plate')).toBeVisible();
    await expect(page.getByText('Real-Time Estimated Arrival (ETA)')).toBeVisible();

    // Capture screenshot of safety sharing modal
    await page.screenshot({ path: 'docs/uiux-audit/screenshots/share_trip_safety_modal.png' });

    // 5. Click "Start Sharing Live Trip"
    const startSharingBtn = page.getByRole('button', { name: 'Start Sharing Live Trip' });
    await startSharingBtn.click();

    // 6. Verify Active status banner and actions appear
    await expect(page.getByText('Live GPS Location Broadcasting')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Copy Link' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Stop Sharing Live Trip' })).toBeVisible();

    // 7. Stop sharing live trip
    const stopBtn = page.getByRole('button', { name: 'Stop Sharing Live Trip' });
    await stopBtn.click();

    // Verify it reverts to inactive start sharing button
    await expect(page.getByRole('button', { name: 'Start Sharing Live Trip' })).toBeVisible();
  });

  test('04. Public Recipient Tracking View (/share-trip) displays live vehicle route and emergency tools', async ({ page }) => {
    await page.goto('/share-trip?id=SKY784392');
    await page.waitForLoadState('domcontentloaded');

    // 1. Verify Safety Monitor header
    await expect(page.getByText('Safety Monitor')).toBeVisible();
    await expect(page.getByText('Live trip shared by passenger')).toBeVisible();

    // 2. Verify recipient map
    const map = page.locator('.skyppy-osm-container');
    await expect(map).toBeVisible();
    await expect(page.locator('.custom-osm-vehicle')).toBeVisible();
    await expect(page.locator('.custom-osm-pickup')).toBeVisible();

    // 3. Verify driver and vehicle verification card
    await expect(page.getByText('Ramesh K.')).toBeVisible();
    await expect(page.getByText('KA-09 AB 4217', { exact: true })).toBeVisible();
    await expect(page.getByText('VERIFIED', { exact: true })).toBeVisible();

    // 4. Verify recipient safety tools (112 Police, Message Rider)
    await expect(page.getByRole('link', { name: /Call 112 Police/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Message Rider/i })).toBeVisible();

    // Capture screenshot of recipient safety monitor
    await page.screenshot({ path: 'docs/uiux-audit/screenshots/public_recipient_safety_monitor.png' });
  });
});
