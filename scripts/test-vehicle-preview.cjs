const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  
  const vehicles = ['auto', 'mini', 'hatchback', 'sedan', 'suv'];
  
  // Read images as base64 data URLs so no web server needed
  const renderRow = (suffix, label) => vehicles.map(v => {
    const filePath = path.resolve(`public/vehicles/${v}${suffix}`);
    let dataUrl = '';
    if (fs.existsSync(filePath)) {
      const b64 = fs.readFileSync(filePath).toString('base64');
      dataUrl = `data:image/png;base64,${b64}`;
    }
    return `
      <div style="background: white; border-radius: 16px; padding: 12px; border: 1px solid #e2e8f0; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
        <h4 style="margin: 0 0 8px 0; text-transform: capitalize; color: #1e293b;">${v} (${label})</h4>
        <div style="height: 180px; display: flex; align-items: center; justify-content: center; background: #f8f9fc; border-radius: 12px; padding: 8px;">
          <img src="${dataUrl}" style="max-width: 100%; max-height: 160px; object-fit: contain;" />
        </div>
      </div>
    `;
  }).join('');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Vehicle Asset Inspection</title>
      </head>
      <body style="background: #f1f5f9; font-family: system-ui, -apple-system, sans-serif; padding: 30px;">
        <h2 style="color: #0f172a; margin-bottom: 20px;">1. Standard Studio (.png)</h2>
        <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; margin-bottom: 30px;">
          ${renderRow('.png', 'Studio')}
        </div>

        <h2 style="color: #0f172a; margin-bottom: 20px;">2. Transparent Cutout (_transparent.png)</h2>
        <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px;">
          ${renderRow('_transparent.png', 'Transparent')}
        </div>
      </body>
    </html>
  `;
  
  await page.setContent(html);
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'test-vehicle-preview.png', fullPage: true });
  console.log('Saved test-vehicle-preview.png');
  await browser.close();
})();

