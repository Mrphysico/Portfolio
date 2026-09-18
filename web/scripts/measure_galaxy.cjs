const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function measure() {
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
  });

  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 }
  });

  console.log('Navigating to http://localhost:5173/ ...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Click Singularity in navbar
  await page.locator('nav button:has-text("Singularity")').click();
  await page.waitForTimeout(3000);

  // Take screenshot of Singularity before
  const screenshotDir = path.join(__dirname, '..', 'screenshots');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }
  const beforeImgPath = path.join(screenshotDir, 'galaxy_before.png');
  const screenshotBuffer = await page.screenshot({ path: beforeImgPath });
  console.log('Saved screenshot to:', beforeImgPath);

  // Measure the actual Three.js galaxy canvas pixels directly
  const canvasStats = await page.evaluate(() => {
    const canvas = document.querySelector('div.fixed.inset-0 canvas');
    if (!canvas) return { error: 'No canvas found' };

    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return { error: 'No WebGL context' };

    const width = canvas.width;
    const height = canvas.height;
    const pixels = new Uint8Array(width * height * 4);
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

    let totalR = 0, totalG = 0, totalB = 0;
    let nonBlackPixels = 0;
    let totalSat = 0;

    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const a = pixels[i + 3];

      // Sample all stars and glowing accretion / nebulae (ignore pure black empty space)
      if (r > 3 || g > 3 || b > 3) {
        totalR += r;
        totalG += g;
        totalB += b;
        nonBlackPixels++;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const sat = max === 0 ? 0 : (max - min) / max;
        totalSat += sat;
      }
    }

    const avgR = nonBlackPixels ? totalR / nonBlackPixels : 0;
    const avgG = nonBlackPixels ? totalG / nonBlackPixels : 0;
    const avgB = nonBlackPixels ? totalB / nonBlackPixels : 0;
    const brRatio = avgR > 0 ? avgB / avgR : 0;
    const avgSat = nonBlackPixels ? totalSat / nonBlackPixels : 0;

    return {
      width,
      height,
      nonBlackPixels,
      avgR: Number(avgR.toFixed(2)),
      avgG: Number(avgG.toFixed(2)),
      avgB: Number(avgB.toFixed(2)),
      brRatio: Number(brRatio.toFixed(3)),
      avgSat: Number(avgSat.toFixed(3)),
    };
  });

  console.log('Galaxy Canvas Pixel Stats (Direct WebGL Canvas):', canvasStats);
  await browser.close();
}

measure().catch(err => {
  console.error('Measurement error:', err);
  process.exit(1);
});
