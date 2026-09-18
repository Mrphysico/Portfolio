const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function inspectLayout() {
  const artifactDir = path.resolve('C:/Users/jdhav/.gemini/antigravity/brain/72e3e3c0-f38c-418e-b0b0-1acd921b2e7a');
  console.log('Launching browser to inspect desktop fullscreen responsive layout...');

  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
  });

  const viewports = [
    { width: 1920, height: 1080, name: '1920x1080' },
    { width: 1440, height: 900, name: '1440x900' },
    { width: 1366, height: 768, name: '1366x768' },
    { width: 2560, height: 1440, name: '2560x1440' },
    { width: 3440, height: 1440, name: '3440x1440_ultrawide' },
    { width: 390, height: 844, name: '390x844_mobile' },
  ];

  for (const vp of viewports) {
    console.log(`\n=== Testing Viewport: ${vp.name} (${vp.width}x${vp.height}) ===`);
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();

    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000); // Wait for preloader

    // Scroll to Singularity
    await page.evaluate(() => {
      const el = document.getElementById('chapter-singularity');
      if (el) el.scrollIntoView({ behavior: 'instant' });
    });
    await page.waitForTimeout(1000);

    const metrics = await page.evaluate(() => {
      const docW = document.documentElement.scrollWidth;
      const winW = window.innerWidth;
      const bodyW = document.body.scrollWidth;
      const clientW = document.documentElement.clientWidth;

      // Find all overflowing elements
      const overflowingElements = [];
      const allElements = document.querySelectorAll('*');
      allElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.right > winW + 1) {
          overflowingElements.push({
            tag: el.tagName,
            id: el.id,
            className: typeof el.className === 'string' ? el.className.slice(0, 80) : '',
            right: rect.right,
            width: rect.width,
            overflowX: rect.right - winW,
          });
        }
      });

      return {
        docW,
        winW,
        bodyW,
        clientW,
        hasHorizontalOverflow: docW > winW,
        overflowingElementsCount: overflowingElements.length,
        topOverflowing: overflowingElements.slice(0, 8),
      };
    });

    console.log(`Metrics for ${vp.name}:`, JSON.stringify(metrics, null, 2));

    // Save screenshot
    const shotPath = path.join(artifactDir, `inspect_${vp.name}.png`);
    await page.screenshot({ path: shotPath, fullPage: false });
    console.log(`Saved screenshot: ${shotPath}`);

    await context.close();
  }

  await browser.close();
}

inspectLayout().catch((err) => {
  console.error('Inspection failed:', err);
  process.exit(1);
});
