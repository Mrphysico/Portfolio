const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (err) => errors.push(err.toString()));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(2000);

  console.log('Page title:', await page.title());
  console.log('Errors:', errors);
  console.log('Root HTML:', (await page.$eval('#root', (el) => el.innerHTML)).slice(0, 500));
  await browser.close();
})();
