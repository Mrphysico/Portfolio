const { chromium } = require('playwright');

async function diagnose() {
  console.log('Launching browser to diagnose Singularity background freeze...');
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

  // Wait for preloader to dismiss
  console.log('Waiting for preloader to finish...');
  await page.waitForTimeout(2500);

  const headerHtml = await page.evaluate(() => document.querySelector('header')?.innerHTML || 'no header');
  console.log('Header HTML:', headerHtml.slice(0, 300));

  // Click Singularity button
  console.log('Clicking Singularity button in Navbar...');
  const singularityBtn = await page.$('button:has-text("Singularity")');
  if (singularityBtn) {
    await singularityBtn.click();
    console.log('Clicked Singularity button.');
  }

  // Also scroll to the very bottom
  await page.evaluate(() => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });
  });

  await page.waitForTimeout(3000);

  await page.waitForTimeout(1000);

  // Repeat scroll to bottom in case height changed after lazy loading
  await page.evaluate(() => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });
  });

  await page.waitForTimeout(2000);

  const scrollInfo = await page.evaluate(() => {
    return {
      scrollY: window.scrollY,
      docHeight: document.documentElement.scrollHeight,
      bodyHeight: document.body.scrollHeight,
      innerHeight: window.innerHeight,
      ratioDoc: window.scrollY / (document.documentElement.scrollHeight - window.innerHeight),
      meterText: document.querySelector('div.fixed.bottom-6, #dimension-meter')?.innerText,
    };
  });
  console.log('Scroll info at bottom:', JSON.stringify(scrollInfo, null, 2));

  // Check dimension meter text or state
  const dimensionState = await page.evaluate(() => {
    const canvases = Array.from(document.querySelectorAll('canvas'));
    const backgroundDiv = document.querySelector('div.fixed.inset-0');
    const bgCanvas = backgroundDiv ? backgroundDiv.querySelector('canvas') : null;
    const navText = document.querySelector('nav')?.innerText || '';
    const meterText = document.querySelector('#dimension-meter, div.fixed.bottom-6')?.innerText || '';
    return {
      canvasCount: canvases.length,
      hasBackgroundCanvas: !!bgCanvas,
      navText,
      meterText,
      dimensionBadge: document.querySelector('#chapter-singularity')?.innerText.slice(0, 100),
    };
  });
  console.log('Dimension State at Singularity:', JSON.stringify(dimensionState, null, 2));

  // Inspect if the background canvas is updating by capturing 2 screenshots of the background canvas or comparing pixels
  const bgCanvasHandle = await page.$('div.fixed.inset-0 canvas');
  if (bgCanvasHandle) {
    const screenshot1 = await bgCanvasHandle.screenshot();
    await page.waitForTimeout(2000);
    const screenshot2 = await bgCanvasHandle.screenshot();
    const isIdentical = screenshot1.equals(screenshot2);
    console.log(`Background Canvas Pixel Buffer Comparison over 2000ms: isIdentical = ${isIdentical}`);
    if (isIdentical) {
      console.log('CONFIRMED: Background canvas pixel buffer is 100% frozen / identical between frames!');
    } else {
      console.log('Background canvas is actively updating.');
    }
  } else {
    console.log('Background canvas not found!');
  }

  console.log('Console errors found:', consoleErrors);

  await browser.close();
}

diagnose().catch(err => {
  console.error('Diagnosis failed:', err);
  process.exit(1);
});
