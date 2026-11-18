import { test, expect } from '@playwright/test';

test.describe('Skyppy Driver Experience (/driver-view) E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to start clean
    await page.goto('/driver-view');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('01. Direct URL access, refresh resilience, and driver app shell', async ({ page }) => {
    await page.goto('/driver-view');

    // Verify driver header
    await expect(page.getByText('Skyppy')).toBeVisible();
    await expect(page.getByText('Driver Partner').first()).toBeVisible();
    await expect(page.getByText('ONLINE').first()).toBeVisible();

    // Verify return to passenger app button
    const returnBtn = page.getByRole('button', { name: /Passenger App/i });
    await expect(returnBtn).toBeVisible();

    // Verify bottom nav items
    await expect(page.getByRole('button', { name: /Home/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Activity/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Earnings/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Profile/i })).toBeVisible();

    // Test browser refresh
    await page.reload();
    await expect(page.getByText('Driver Partner').first()).toBeVisible();
  });

  test('02. Online and Offline state transitions', async ({ page }) => {
    await page.goto('/driver-view');

    // Driver starts ONLINE by default
    await expect(page.getByText('ONLINE').first()).toBeVisible();

    // Toggle offline via header switch or bottom drawer
    const onlineSwitch = page.locator('button:has-text("ONLINE")').first();
    await onlineSwitch.click();

    // Now driver is OFFLINE
    await expect(page.getByText('OFFLINE').first()).toBeVisible();
    await expect(page.getByText('You are Offline')).toBeVisible();
    await expect(page.getByRole('button', { name: /Go Online Now/i })).toBeVisible();

    // Mysuru demand hotspots visible
    await expect(page.getByText('Mysuru Demand Hotspots')).toBeVisible();
    await expect(page.getByText('VVCE Campus & Gokulam')).toBeVisible();

    // Go back online
    await page.getByRole('button', { name: /Go Online Now/i }).click();
    await expect(page.getByText('ONLINE').first()).toBeVisible();
  });

  test('03. Full ride lifecycle: Request -> Pickup -> Waiting -> OTP -> Active Trip -> Completion', async ({ page }) => {
    await page.goto('/driver-view');

    // Trigger incoming ride request
    const triggerBtn = page.getByRole('button', { name: /Trigger Demo Ride Request/i });
    await expect(triggerBtn).toBeVisible();
    await triggerBtn.click();

    // Incoming Request Modal appears
    await expect(page.getByText('New Ride Request')).toBeVisible();
    await expect(page.getByText('Sneha R. Gowda')).toBeVisible();
    await expect(page.getByText('VVCE Campus Gate 2, Gokulam')).toBeVisible();
    await expect(page.getByText('Mysuru City Railway Station (MYS)')).toBeVisible();
    await expect(page.getByText('₹128').first()).toBeVisible(); // Net earnings

    // Accept ride
    const acceptBtn = page.getByRole('button', { name: /Accept Ride/i });
    await expect(acceptBtn).toBeVisible();
    await acceptBtn.click();

    // Status: Navigating to pickup
    await expect(page.getByText('Picking Up')).toBeVisible();
    await expect(page.getByText('Turn left towards VVCE Gate 2, Gokulam')).toBeVisible();

    // Arrive at pickup
    const arrivedBtn = page.getByRole('button', { name: /I Have Arrived at Pickup/i });
    await expect(arrivedBtn).toBeVisible();
    await arrivedBtn.click();

    // Status: Arrived at pickup / Waiting timer
    await expect(page.getByText('Waiting for Passenger')).toBeVisible();

    // Click "Verify OTP & Start Trip"
    const verifyOtpBtn = page.getByRole('button', { name: /Verify OTP & Start Trip/i });
    await expect(verifyOtpBtn).toBeVisible();
    await verifyOtpBtn.click();

    // OTP Modal opens
    await expect(page.getByRole('heading', { name: 'Enter Start OTP' })).toBeVisible();
    await expect(page.getByText('4821')).toBeVisible(); // Demo helper badge

    // Click quick autofill "4821"
    const autoFillBtn = page.getByRole('button', { name: 'Auto-fill' });
    await autoFillBtn.click();

    // Submit OTP verification
    const confirmOtpBtn = page.getByRole('button', { name: /Verify & Start Trip/i });
    await confirmOtpBtn.click();

    // Status: Trip in progress / Navigating to destination
    await expect(page.getByText('Trip In Progress')).toBeVisible();

    // Test Safety Center inside active trip
    const safetyBtn = page.getByTitle('Safety Toolkit');
    await expect(safetyBtn).toBeVisible();
    await safetyBtn.click();

    await expect(page.getByRole('heading', { name: 'Driver Safety Center' })).toBeVisible();
    // Close safety modal
    await page.locator('button:has-text("close")').first().click();

    // Complete Trip
    const completeTripBtn = page.getByRole('button', { name: /Complete Trip/i });
    await expect(completeTripBtn).toBeVisible();
    await completeTripBtn.click();

    // Trip Completed Receipt Modal
    await expect(page.getByText('Trip Completed!')).toBeVisible();
    await expect(page.getByText('₹128').first()).toBeVisible();
    await expect(page.getByText('Gross Passenger Fare')).toBeVisible();

    // Rate rider & return to online
    const confirmDoneBtn = page.getByRole('button', { name: /Confirm & Return to Online/i });
    await expect(confirmDoneBtn).toBeVisible();
    await confirmDoneBtn.click();

    // Driver returns to Online state ready for next ride
    await expect(page.getByText('Searching trips near Gokulam...')).toBeVisible();
  });

  test('04. Driver Activity tab displays completed trips and itemized receipt', async ({ page }) => {
    await page.goto('/driver-view');

    // Switch to Activity tab
    await page.getByRole('button', { name: /Activity/i }).click();

    await expect(page.getByRole('heading', { name: 'Trip Activity' })).toBeVisible();
    await expect(page.getByText('TRIP-MY-9801')).toBeVisible();

    // Click on trip item to open receipt
    await page.getByText('TRIP-MY-9801').click();
    await expect(page.getByText('Net Driver Payout')).toBeVisible();
    await expect(page.getByText('Skyppy Platform Fee')).toBeVisible();
  });

  test('05. Driver Earnings tab displays balance, chart, and instant withdrawal', async ({ page }) => {
    await page.goto('/driver-view');

    // Switch to Earnings tab
    await page.getByRole('button', { name: /Earnings/i }).click();

    await expect(page.getByRole('heading', { name: 'Earnings & Payouts' })).toBeVisible();
    await expect(page.getByText('Available Balance')).toBeVisible();
    await expect(page.getByText('This Week (Mon - Sun)')).toBeVisible();
    await expect(page.getByText('Daily Milestone Target')).toBeVisible();

    // Test Instant Cash Out
    const cashOutBtn = page.getByRole('button', { name: /Instant Cash Out to Bank/i });
    await expect(cashOutBtn).toBeVisible();
    await cashOutBtn.click();

    await expect(page.getByText(/Payout of .* initiated to HDFC Bank/i)).toBeVisible();
  });

  test('06. Driver Profile tab with vehicle switching and return to passenger app', async ({ page }) => {
    await page.goto('/driver-view');

    // Switch to Profile tab
    await page.getByRole('button', { name: /Profile/i }).click();

    await expect(page.getByRole('heading', { name: 'Driver Partner Profile' })).toBeVisible();
    await expect(page.getByText('Ramesh Kumar')).toBeVisible();
    await expect(page.getByText('Gold Partner')).toBeVisible();

    // Vehicle Switcher: Switch from Auto to Sedan
    await expect(page.getByText('Hyundai Aura CNG')).toBeVisible();
    await page.getByTestId('switch-btn-sedan').click();

    // Verify Sedan is now active
    await expect(page.getByTestId('vehicle-card-sedan').getByText('Active')).toBeVisible();

    // Return to passenger app
    const returnToPassengerBtn = page.getByRole('button', { name: /Return to Skyppy Passenger App/i });
    await returnToPassengerBtn.click();

    // URL is now back on passenger app
    await page.waitForURL('**/');
    await expect(page.getByRole('button', { name: /Book a Ride/i })).toBeVisible();
  });

  test('07. Regression: Passenger rides and Courier logistics remain intact', async ({ page }) => {
    // Check Passenger Home
    await page.goto('/');
    await expect(page.getByRole('button', { name: /Book a Ride/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Send a Parcel/i })).toBeVisible();

    // Check Courier Home
    await page.goto('/courier');
    await expect(page.getByRole('heading', { name: 'Send a Parcel' })).toBeVisible();
    await expect(page.getByRole('button', { name: /Create Shipment/i })).toBeVisible();

    // Check Passenger Profile has Driver Mode entry
    await page.goto('/profile');
    await expect(page.getByText('Skyppy Driver Experience')).toBeVisible();
    await page.getByRole('button', { name: /Launch Driver Experience/i }).click();
    await page.waitForURL('**/driver-view');
    await expect(page.getByText('Driver Partner').first()).toBeVisible();
  });
});
