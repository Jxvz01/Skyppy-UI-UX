import { test, expect } from '@playwright/test';

test.describe('Comprehensive Application Translation (EN <-> KN)', () => {
  test('Toggling language switches entire application between English and Kannada', async ({ page }) => {
    // 1. Visit Home (Default: English)
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verify English initial state
    await expect(page.locator('body')).toContainText('Book a Ride');
    await expect(page.locator('body')).toContainText('Send a Parcel');
    await expect(page.locator('body')).toContainText('PLAN YOUR JOURNEY');
    await expect(page.locator('body')).toContainText('Where are we going today?');

    // 2. Click Language Toggle in Header to switch to Kannada (ಕನ್ನಡ)
    const langBtn = page.getByRole('button', { name: /switch language/i });
    await expect(langBtn).toBeVisible();
    await langBtn.click();

    // Verify Home in Kannada
    await expect(page.locator('body')).toContainText('ಸವಾರಿ ಬುಕ್ ಮಾಡಿ');
    await expect(page.locator('body')).toContainText('ಪಾರ್ಸೆಲ್ ಕಳುಹಿಸಿ');
    await expect(page.locator('body')).toContainText('ಪ್ರಯಾಣದ ಯೋಜನೆ');
    await expect(page.locator('body')).toContainText('ಇಂದು ಎಲ್ಲಿಗೆ ಹೋಗಬೇಕು?');
    await expect(page.locator('body')).toContainText('ಆರಂಭಿಕ ಸ್ಥಳ');
    await expect(page.locator('body')).toContainText('ಸ್ಕಿಪ್ಪಿ ಮೂವ್');
    await expect(page.locator('body')).toContainText('ತ್ವರಿತ ಕ್ರಮಗಳು');
    await expect(page.locator('body')).toContainText('ಸ್ಕಿಪ್ಪಿ ಮೈಲ್ಸ್');

    // Bottom Navigation tabs in Kannada
    await expect(page.locator('nav')).toContainText('ಮುಖಪುಟ');
    await expect(page.locator('nav')).toContainText('ಚಟುವಟಿಕೆ');
    await expect(page.locator('nav')).toContainText('ಮೈಲ್ಸ್');
    await expect(page.locator('nav')).toContainText('ಪ್ರೊಫೈಲ್');

    // 3. Test Courier Home in Kannada
    const courierTabBtn = page.getByRole('button', { name: /ಪಾರ್ಸೆಲ್ ಕಳುಹಿಸಿ/i });
    await courierTabBtn.click();
    await expect(page.locator('body')).toContainText('ಅಂತರನಗರ ವಿತರಣೆ');
    await expect(page.locator('body')).toContainText('ಸುರಕ್ಷಿತ ನಿರ್ವಹಣೆ');
    await expect(page.locator('body')).toContainText('ಲೈವ್ ಟ್ರ್ಯಾಕಿಂಗ್');
    await expect(page.locator('body')).toContainText('ವಿತರಣೆಯ ಪುರಾವೆ');
    await expect(page.locator('body')).toContainText('ಇಲ್ಲಿಂದ');
    await expect(page.locator('body')).toContainText('ಇಲ್ಲಿಗೆ');
    await expect(page.locator('body')).toContainText('ರವಾನೆ ರಚಿಸಿ');
    await expect(page.locator('body')).toContainText('ಹೊಸ ರವಾನೆ');

    // 4. Test Search / Location Picker in Kannada
    await page.goto('/search');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toContainText('ಸ್ಥಳಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ');
    await expect(page.locator('body')).toContainText('ಆರಂಭಿಕ ಸ್ಥಳ');
    await expect(page.locator('body')).toContainText('ತಲುಪುವ ಸ್ಥಳ');
    await expect(page.locator('body')).toContainText('ಹೆಸರಿನಿಂದ ಹುಡುಕಿ');
    await expect(page.locator('body')).toContainText('ನಕ್ಷೆಯಲ್ಲಿ ಆಯ್ಕೆಮಾಡಿ');
    await expect(page.locator('body')).toContainText('ಪ್ರಸ್ತುತ ಜಿಪಿಎಸ್ ಸ್ಥಳ ಬಳಸಿ');

    // Select on Map in Kannada
    await page.getByRole('button', { name: /ನಕ್ಷೆಯಲ್ಲಿ ಆಯ್ಕೆಮಾಡಿ/i }).first().click();
    await expect(page.locator('body')).toContainText('ನಿಖರವಾದ ಸ್ಥಳವನ್ನು ಹೊಂದಿಸಲು ನಕ್ಷೆಯನ್ನು ಸರಿಸಿ');
    await expect(page.locator('body')).toContainText('ದೃಢೀಕರಿಸಿ');

    // 5. Test Route Confirmation in Kannada
    await page.goto('/location');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toContainText('ಮಾರ್ಗ ದೃಢೀಕರಣ');
    await expect(page.locator('body')).toContainText('ಸವಾರಿ ಮಾರ್ಗ ದೃಢೀಕರಿಸಿ');
    await expect(page.locator('body')).toContainText('ಸಾಮಾನ್ಯ ಸಂಚಾರ');
    await expect(page.locator('body')).toContainText('ವಾಹನ ಆಯ್ಕೆಗೆ ಮುಂದುವರಿಯಿರಿ');

    // 6. Test Ride Options in Kannada
    await page.goto('/options');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toContainText('ಲಭ್ಯವಿರುವ ಸವಾರಿಗಳು');
    await expect(page.locator('body')).toContainText('ಉತ್ತಮ ಬೆಲೆ');
    await expect(page.locator('body')).toContainText('ದರ ವಿವರಣೆ');
    await expect(page.locator('body')).toContainText('ದೃಢೀಕರಿಸಿ ಮತ್ತು ಬುಕ್ ಮಾಡಿ');

    // 7. Test Activity History in Kannada
    await page.goto('/activity');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toContainText('ಚಟುವಟಿಕೆ ಮತ್ತು ಇತಿಹಾಸ');
    await expect(page.locator('body')).toContainText('ಪ್ರಯಾಣಿಕರ ಸವಾರಿಗಳು');
    await expect(page.locator('body')).toContainText('ಪಾರ್ಸೆಲ್ ರವಾನೆಗಳು');

    // 8. Test Skyppy Miles in Kannada
    await page.goto('/miles');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toContainText('ಸ್ಕಿಪ್ಪಿ ಮೈಲ್ಸ್');
    await expect(page.locator('body')).toContainText('ಒಟ್ಟು ಗಳಿಸಿದ ಮೈಲ್ಸ್');
    await expect(page.locator('body')).toContainText('ಬಹುಮಾನಗಳ ಪಟ್ಟಿ');

    // 9. Test Profile in Kannada
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toContainText('ಖಾತೆ ಮತ್ತು ವಿವರ');
    await expect(page.locator('body')).toContainText('ಮೈಸೂರು ಸ್ಮಾರ್ಟ್ ಪ್ರಯಾಣಿಕ');
    await expect(page.locator('body')).toContainText('ಉಳಿಸಿದ ಸ್ಥಳಗಳು');
    await expect(page.locator('body')).toContainText('ಪಾವತಿ ವಿಧಾನಗಳು');
    await expect(page.locator('body')).toContainText('ಸವಾರಿ ಆದ್ಯತೆಗಳು');
    await expect(page.locator('body')).toContainText('ಸಹಾಯ ಮತ್ತು ಬೆಂಬಲ');
    await expect(page.locator('body')).toContainText('ರೂಪ ಮತ್ತು ಥೀಮ್');
    await expect(page.locator('body')).toContainText('ಡೆಮೊ ಮರುಹೊಂದಿಸಿ');

    // 10. Switch back to English and verify
    await page.getByRole('button', { name: 'English', exact: true }).click();
    await expect(page.locator('body')).toContainText('Account & Profile');
    await expect(page.locator('body')).toContainText('Saved Places');
    await expect(page.locator('body')).toContainText('Payment Methods');
    await expect(page.locator('body')).toContainText('Ride Preferences');
  });
});
