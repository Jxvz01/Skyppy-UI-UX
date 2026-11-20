import { test, expect } from '@playwright/test';
import * as path from 'path';

const SCREENSHOT_DIR = path.resolve('docs/uiux-audit/screenshots');

test.describe('Skyppy UI/UX Audit Screenshot Capture Suite', () => {
  // Mobile device standard viewport
  const mobileViewport = { width: 390, height: 844 };

  test('01. Capture Passenger Screens & Modals', async ({ page }) => {
    await page.setViewportSize(mobileViewport);

    // 1. Passenger Home
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'passenger-home.png'), fullPage: false });

    // 2. City Selector Modal
    const cityBtn = page.locator('button:has-text("Mysuru")').first();
    if (await cityBtn.isVisible()) {
      await cityBtn.click();
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'header-city-selector.png') });
      const closeCity = page.locator('button:has-text("close"), button:has-text("Cancel"), button[aria-label="Close"]').first();
      if (await closeCity.isVisible()) await closeCity.click();
    }

    // 3. Notifications Modal
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const notifBtn = page.locator('button:has-text("notifications"), button[aria-label="Notifications"]').first();
    if (await notifBtn.isVisible()) {
      await notifBtn.click();
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'header-notifications-modal.png') });
      const closeNotif = page.locator('button:has-text("close"), button[aria-label="Close"]').first();
      if (await closeNotif.isVisible()) await closeNotif.click();
    }

    // 4. Destination Search
    await page.goto('/search');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'passenger-location-search.png') });

    // 5. Location Selection on Interactive Map
    await page.goto('/location');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(600); // Allow OSM tiles to render
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'passenger-location-picker.png') });

    // 6. Ride Options
    await page.goto('/options');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'passenger-ride-options.png') });

    // 7. Fare Details Modal
    const fareDetailsBtn = page.getByRole('button', { name: /Fare Details/i }).first();
    if (await fareDetailsBtn.isVisible()) {
      await fareDetailsBtn.click();
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'passenger-fare-breakdown.png') });
      const closeFare = page.getByRole('button', { name: 'Got It' });
      if (await closeFare.isVisible()) await closeFare.click();
    }

    // 8. Coupon Modal
    const couponBtn = page.getByRole('button', { name: /Apply Coupon/i }).first();
    if (await couponBtn.isVisible()) {
      await couponBtn.click();
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'passenger-coupon-modal.png') });
      const closeCoupon = page.locator('button:has-text("close"), button[aria-label="Close"]').first();
      if (await closeCoupon.isVisible()) await closeCoupon.click();
    }

    // 9. Payment Method Sheet
    const payMethodBtn = page.locator('div:has-text("Payment Method"), button:has-text("Payment")').first();
    if (await payMethodBtn.isVisible()) {
      await payMethodBtn.click();
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'passenger-payment-sheet.png') });
    }

    // 10. Booking Confirmation / Searching Dispatch
    await page.goto('/confirm');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'passenger-booking-confirming.png') });

    // 11. Live Tracking Screen
    await page.goto('/tracking');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'passenger-live-tracking.png') });
  });

  test('02. Capture Courier & Logistics Screens', async ({ page }) => {
    await page.setViewportSize(mobileViewport);

    // 1. Courier Home
    await page.goto('/courier');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'courier-home.png') });

    // 2. Create Shipment Wizard - Step 1: Package
    await page.goto('/courier/send');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'courier-create-step1.png') });

    // Step 2: Addresses
    const nextBtn = page.locator('button:has-text("Next"), button:has-text("Continue")').first();
    if (await nextBtn.isVisible()) {
      await nextBtn.click();
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'courier-create-step2.png') });

      // Step 3: Speed & Addons
      if (await nextBtn.isVisible()) {
        await nextBtn.click();
        await page.waitForTimeout(400);
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'courier-create-step3.png') });
      }
    }

    // 3. Shipment Confirmation / Consignment Pass
    await page.goto('/courier/confirm');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'courier-confirmation.png') });

    // 4. Shipment Tracking
    await page.goto('/courier/track');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'courier-tracking.png') });

    // 5. Receiver Portal
    await page.goto('/courier/receiver/SKP-MYBLR-8841');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'courier-receiver-portal.png') });

    // 6. Business Logistics Dashboard
    await page.goto('/courier/business');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'courier-business-dashboard.png') });
  });

  test('03. Capture Miles, Activity, Profile & Settings', async ({ page }) => {
    await page.setViewportSize(mobileViewport);

    // 1. Skyppy Miles Hub
    await page.goto('/miles');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'miles-main.png') });

    // 2. Miles Explainer Modal
    const infoBtn = page.locator('button[aria-label="Miles rules information"]').first();
    if (await infoBtn.isVisible()) {
      await infoBtn.click();
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'miles-explainer-modal.png') });
      const closeExplainer = page.locator('button:has-text("close"), button:has-text("Got It"), button:has-text("Close")').first();
      if (await closeExplainer.isVisible()) await closeExplainer.click();
    }

    // 3. Miles Journey Node Detail
    await page.goto('/miles');
    await page.waitForLoadState('networkidle');
    const nodeBtn = page.getByRole('button', { name: /^Journey:/ }).first();
    if (await nodeBtn.isVisible()) {
      await nodeBtn.click({ force: true });
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'miles-node-detail.png') });
    }

    // 4. Miles Earned Pop-in
    const earnBtn = page.locator('button:has-text("Simulate Ride Earn (+24 km)")');
    if (await earnBtn.isVisible()) {
      await earnBtn.click();
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'miles-earned-state.png') });
    }

    // 5. Miles Redemption
    const redeemBtn = page.locator('button:has-text("Redeem Test Voucher")');
    if (await redeemBtn.isVisible()) {
      await redeemBtn.click();
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'miles-redemption.png') });
    }

    // 6. Activity History - Rides
    await page.goto('/activity');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'activity.png') });

    // 7. Activity History - Courier Tab
    const courierTab = page.locator('button:has-text("Courier"), button:has-text("Parcels")').first();
    if (await courierTab.isVisible()) {
      await courierTab.click();
      await page.waitForTimeout(300);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'activity-courier-tab.png') });
    }

    // 8. Activity Itemized Receipt Modal
    await page.goto('/activity');
    await page.waitForLoadState('networkidle');
    const firstReceiptBtn = page.locator('button:has-text("Receipt"), button:has-text("View Receipt")').first();
    if (await firstReceiptBtn.isVisible()) {
      await firstReceiptBtn.click();
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'activity-receipt-modal.png') });
      const closeReceipt = page.locator('button:has-text("close"), button[aria-label="Close"]').first();
      if (await closeReceipt.isVisible()) await closeReceipt.click();
    }

    // 9. Profile & Settings Main
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'profile.png') });

    // 10. Theme Settings
    await page.goto('/theme');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'theme-settings.png') });
  });

  test('04. Capture Driver Experience (/driver-view) Complete Lifecycle', async ({ page }) => {
    await page.setViewportSize(mobileViewport);

    // Clear driver localStorage to start in fresh state
    await page.goto('/driver-view');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForLoadState('networkidle');

    // 1. Driver Home Online
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'driver-home-online.png') });

    // 2. Driver Home Offline
    const onlineToggle = page.locator('button:has-text("ONLINE")').first();
    if (await onlineToggle.isVisible()) {
      await onlineToggle.click();
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'driver-home-offline.png') });
      // Go back online
      await page.getByRole('button', { name: /Go Online Now/i }).click();
      await page.waitForTimeout(300);
    }

    // 3. Incoming Ride Request Modal
    const triggerRequestBtn = page.getByRole('button', { name: /Trigger Demo Ride Request/i });
    if (await triggerRequestBtn.isVisible()) {
      await triggerRequestBtn.click();
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'driver-incoming-request.png') });

      // 4. Accept Ride -> Heading to Pickup
      const acceptBtn = page.getByRole('button', { name: /Accept Ride/i });
      if (await acceptBtn.isVisible()) {
        await acceptBtn.click();
        await page.waitForTimeout(500);
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'driver-heading-to-pickup.png') });

        // Contact Passenger Modal
        const contactBtn = page.locator('button[aria-label="Call passenger"], button:has-text("Call"), button:has-text("Message")').first();
        if (await contactBtn.isVisible()) {
          await contactBtn.click();
          await page.waitForTimeout(400);
          await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'driver-contact-passenger.png') });
          const closeContact = page.locator('button:has-text("close"), button[aria-label="Close"]').first();
          if (await closeContact.isVisible()) await closeContact.click();
        }

        // 5. Arrived at Pickup / Waiting for Passenger
        const arrivedBtn = page.getByRole('button', { name: /I Have Arrived at Pickup/i });
        if (await arrivedBtn.isVisible()) {
          await arrivedBtn.click();
          await page.waitForTimeout(500);
          await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'driver-arrived-waiting.png') });

          // 6. OTP Verification Modal
          const verifyOtpBtn = page.getByRole('button', { name: /Verify OTP & Start Trip/i });
          if (await verifyOtpBtn.isVisible()) {
            await verifyOtpBtn.click();
            await page.waitForTimeout(400);
            await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'driver-otp-verification.png') });

            // Auto-fill OTP and start trip
            const autoFill = page.getByRole('button', { name: 'Auto-fill' });
            if (await autoFill.isVisible()) await autoFill.click();
            const startTripBtn = page.getByRole('button', { name: /Verify & Start Trip/i });
            if (await startTripBtn.isVisible()) await startTripBtn.click();
            await page.waitForTimeout(500);

            // 7. Active Trip Navigation
            await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'driver-active-trip.png') });

            // Driver Safety Modal
            const safetyBtn = page.getByTitle('Safety Toolkit');
            if (await safetyBtn.isVisible()) {
              await safetyBtn.click();
              await page.waitForTimeout(400);
              await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'driver-safety-modal.png') });
              const closeSafety = page.locator('button:has-text("close")').first();
              if (await closeSafety.isVisible()) await closeSafety.click();
            }

            // 8. Complete Trip & Receipt Modal
            const completeBtn = page.getByRole('button', { name: /Complete Trip/i });
            if (await completeBtn.isVisible()) {
              await completeBtn.click();
              await page.waitForTimeout(500);
              await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'driver-trip-completed.png') });

              // Confirm and return to online
              const confirmDoneBtn = page.getByRole('button', { name: /Confirm & Return to Online/i });
              if (await confirmDoneBtn.isVisible()) await confirmDoneBtn.click();
            }
          }
        }
      }
    }

    // 9. Driver Activity Tab
    await page.locator('button:has-text("Activity")').click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'driver-activity.png') });

    // 10. Driver Earnings Tab
    await page.locator('button:has-text("Earnings")').click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'driver-earnings.png') });

    // 11. Driver Profile Tab
    await page.locator('button:has-text("Profile")').click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'driver-profile.png') });
  });

  test('05. Capture Desktop Viewports (Responsive / DeviceFrame Inspection)', async ({ page }) => {
    // Desktop 1280x800 showing DeviceFrame
    await page.setViewportSize({ width: 1280, height: 800 });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'passenger-home-desktop.png') });

    await page.goto('/courier');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'courier-home-desktop.png') });

    await page.goto('/driver-view');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'driver-home-desktop.png') });
  });
});
