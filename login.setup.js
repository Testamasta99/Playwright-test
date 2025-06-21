const { chromium } = require('@playwright/test');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    await page.fill('input[name="username"]', 'Admin');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');

    // Wait for dashboard page
    await page.waitForURL(/.*dashboard.*/);

  const state = await page.context().storageState();
  fs.writeFileSync('state.json', JSON.stringify(state));

  await browser.close();
})();
