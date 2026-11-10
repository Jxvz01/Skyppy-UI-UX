import { test, expect } from '@playwright/test';

test.describe('Skyppy Courier & Logistics Service E2E Tests', () => {
  test('Service Switcher: can toggle between Rides and Courier on Home', async ({ page }) => {
    await page.goto('/');

    // Check service switcher presence
    const ridesBtn = page.getByRole('button', { name: /Skyppy Rides/i });
    const courierBtn = page.getByRole('button', { name: /Skyppy Courier/i });
    await expect(ridesBtn).toBeVisible();
    await expect(courierBtn).toBeVisible();

    // Switch to Courier
    await courierBtn.click();
    await page.waitForURL('**/courier');

    // Courier Home verification
    await expect(page.getByText(/Send an Intercity Parcel/i)).toBeVisible();
    await expect(page.getByText(/Fast, Guaranteed Freight/i)).toBeVisible();
  });

  test('Courier Home: displays services, quick tracking, and recent shipments', async ({ page }) => {
    await page.goto('/courier');

    // Check express corridor badge & service tiers
    await expect(page.getByText(/Express Corridor Active/i)).toBeVisible();
    await expect(page.getByText(/Same-Day Prime/i)).toBeVisible();
    await expect(page.getByText(/Express Cargo/i)).toBeVisible();
    await expect(page.getByText(/Surface Cargo/i)).toBeVisible();

    // Check recent shipment card
    await expect(page.getByText(/SKP-EXP-849204/i).first()).toBeVisible();

    // Quick track search
    const trackInput = page.getByPlaceholder(/Track shipment/i);
    await trackInput.fill('SKP-EXP-849204');
    await page.getByRole('button', { name: 'Track', exact: true }).click();
    await page.waitForURL('**/courier/track/shp_849204');
    await expect(page.getByText(/Live Shipment Tracking/i)).toBeVisible();
  });

  test('Create Shipment 4-step wizard: validates volumetric weight and creates booking', async ({ page }) => {
    await page.goto('/courier/send');

    // Step 1: Package Details
    await expect(page.getByText(/What are you sending\?/i)).toBeVisible();
    await page.getByRole('button', { name: /Electronics/i }).click();

    // Check volumetric weight calculation
    await expect(page.getByText(/Chargeable Weight/i)).toBeVisible();

    // Check fragile toggle
    const fragileCheckbox = page.getByRole('checkbox').first();
    await fragileCheckbox.check();

    // Continue to Step 2
    await page.getByRole('button', { name: /Continue/i }).click();

    // Step 2: Pickup / Sender Details
    await expect(page.getByText(/Pickup & Sender Details/i)).toBeVisible();
    await page.getByRole('button', { name: 'Tomorrow' }).click();

    // Continue to Step 3
    await page.getByRole('button', { name: /Continue/i }).click();

    // Step 3: Receiver Details
    await expect(page.getByText(/Receiver & Destination/i)).toBeVisible();
    await expect(page.getByText(/Intercity Corridor/i)).toBeVisible();

    // Continue to Step 4
    await page.getByRole('button', { name: /Continue/i }).click();

    // Step 4: Speed & Price Review
    await expect(page.getByText(/Choose Speed & Review/i)).toBeVisible();
    await expect(page.getByText(/Fare Calculation Breakdown/i)).toBeVisible();
    await expect(page.getByText(/Total Estimated Fare/i)).toBeVisible();

    // Confirm booking
    await page.getByRole('button', { name: /Confirm & Schedule Pickup/i }).click();
    await page.waitForURL('**/courier/confirm?id=*');

    // Verification of Confirmation Screen
    await expect(page.getByText(/Consignment Scheduled!/i)).toBeVisible();
    await expect(page.getByText(/Delivery Security OTP/i)).toBeVisible();
    await expect(page.getByText(/SKYPPY-CARGO/i)).toBeVisible();
  });

  test('Shipment Tracking: simulates status milestones, delay, and OTP delivery sign-off', async ({ page }) => {
    await page.goto('/courier/track/shp_849204');

    await expect(page.getByText(/SKP-EXP-849204/i)).toBeVisible();
    await expect(page.getByText(/Consignment Milestones/i)).toBeVisible();

    // Toggle simulation controls
    const simBtn = page.getByRole('button', { name: /Simulate/i });
    await simBtn.click();
    await expect(page.getByText(/QA Logistics State Simulator/i)).toBeVisible();

    // Advance to next stage
    await page.getByRole('button', { name: /Advance Next Stage/i }).click();

    // Simulate delay
    await page.getByRole('button', { name: /Simulate Delay/i }).click();
    await expect(page.getByText(/DELAYED/i)).toBeVisible();

    // Complete delivery with OTP
    const otpInput = page.getByPlaceholder(/Enter 4-digit OTP/i);
    await otpInput.fill('7842');
    await page.getByRole('button', { name: /Verify & Deliver/i }).click();

    // Proof of delivery verification
    await expect(page.getByText(/Proof of Delivery \(POD\)/i)).toBeVisible();
    await expect(page.getByText(/OTP VERIFIED/i)).toBeVisible();
  });

  test('Public Receiver Portal: displays incoming shipment and lets receiver confirm receipt', async ({ page }) => {
    await page.goto('/courier/receiver/shp_849204');

    await expect(page.getByText(/Incoming Consignment/i)).toBeVisible();
    await expect(page.getByText(/Delivery Verification PIN/i)).toBeVisible();

    // Enter recipient PIN
    const otpInput = page.getByPlaceholder(/Enter 4-digit PIN/i);
    await otpInput.fill('7842');
    await page.getByRole('button', { name: /Confirm Receipt/i }).click();

    // Proof of delivery card
    await expect(page.getByText(/Proof of Delivery \(POD\)/i)).toBeVisible();
    await expect(page.getByText(/Digital consignee sign-off verified/i)).toBeVisible();
  });

  test('Small Business Logistics Dashboard: metrics, search, and manifest export', async ({ page }) => {
    await page.goto('/courier/business');

    await expect(page.getByText(/Skyppy Enterprise Logistics/i)).toBeVisible();
    await expect(page.getByText(/Total Consignments/i)).toBeVisible();
    await expect(page.getByText(/Active In Transit/i)).toBeVisible();
    await expect(page.getByText(/Logistics Spend/i)).toBeVisible();

    // Search filter
    const searchInput = page.getByPlaceholder(/Search by ID/i);
    await searchInput.fill('Bengaluru');
    await expect(page.getByText(/SKP-EXP-849204/i)).toBeVisible();

    // Export manifest simulation
    const exportBtn = page.getByRole('button', { name: /Export/i });
    await exportBtn.click();
    await expect(page.getByText(/Manifest Exported!/i)).toBeVisible();
  });

  test('Activity History: displays both passenger Rides and Courier Shipments tabs', async ({ page }) => {
    await page.goto('/activity');

    // Rides Tab active by default
    await expect(page.getByRole('button', { name: /Rides \(/i })).toBeVisible();
    await expect(page.getByText(/Trip Ledger & History/i)).toBeVisible();

    // Switch to Shipments Tab
    const shipmentsTab = page.getByRole('button', { name: /Shipments \(/i });
    await shipmentsTab.click();

    // Verify shipments list
    await expect(page.getByText(/SKP-EXP-849204/i)).toBeVisible();
    await expect(page.getByText(/SKP-STD-512903/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Send Another Intercity Parcel/i })).toBeVisible();
  });
});
