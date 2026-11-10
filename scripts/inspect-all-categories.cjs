const { chromium } = require('@playwright/test');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 420, height: 880 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:5173/confirm...');
  await page.goto('http://localhost:5173/confirm');
  await page.waitForTimeout(1000);

  // Skip animation if still searching
  const skipBtn = page.getByRole('button', { name: /Skip/i }).first();
  if (await skipBtn.isVisible()) {
    await skipBtn.click();
    await page.waitForTimeout(600);
  }

  const categories = ['auto', 'mini', 'hatchback', 'sedan', 'suv'];
  
  for (const cat of categories) {
    console.log(`Selecting and inspecting ${cat}...`);
    // Find category button in the demo selector
    const catBtn = page.locator(`button:has-text("${cat}")`).last();
    if (await catBtn.isVisible()) {
      await catBtn.click();
      await page.waitForTimeout(500);
    }
    
    // Check that image loaded
    const imgLocator = page.locator('img[alt*=" - "]').first();
    const imgSrc = await imgLocator.getAttribute('src');
    console.log(`${cat} image src:`, imgSrc);
    
    await page.screenshot({ path: `screenshot-inspection-${cat}.png` });
  }

  await browser.close();
  console.log('All 5 category screenshots captured successfully!');
})();

