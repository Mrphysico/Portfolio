const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function runTestSuite() {
  const artifactDir = path.resolve('C:/Users/jdhav/.gemini/antigravity/brain/72e3e3c0-f38c-418e-b0b0-1acd921b2e7a');
  if (!fs.existsSync(artifactDir)) {
    fs.mkdirSync(artifactDir, { recursive: true });
  }

  console.log('=== STARTING SINGULARITY ANIMATION VERIFICATION TEST SUITE ===');
  console.log('Target Artifact Directory:', artifactDir);

  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
  });

  // Context with video recording
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: artifactDir,
      size: { width: 1280, height: 720 },
    },
  });

  const page = await context.newPage();
  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  console.log('\n[1. Initial Load & Preloader]');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500); // Wait for preloader auto-dismiss

  console.log('\n[2. Scrolling into Singularity Section]');
  // Scroll to Singularity
  await page.evaluate(() => {
    const el = document.getElementById('chapter-singularity');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await page.waitForTimeout(1500);

  // Take Screenshot 1 at T=0s
  const screenshot1Path = path.join(artifactDir, 'singularity_t0.png');
  await page.screenshot({ path: screenshot1Path });
  console.log('Saved Screenshot 1 (T=0s): singularity_t0.png');

  // Read initial debug telemetry
  const initialTelemetry = await page.evaluate(() => {
    return window.__DIMENSION_CANVAS_DEBUG__ || null;
  });
  console.log('Initial Telemetry at T=0s:', initialTelemetry);

  if (!initialTelemetry) {
    throw new Error('FAIL: window.__DIMENSION_CANVAS_DEBUG__ is not defined!');
  }
  if (initialTelemetry.state !== 'running') {
    throw new Error(`FAIL: Background state is ${initialTelemetry.state}, expected 'running'!`);
  }

  // Wait 2.0 seconds and capture Screenshot 2
  await page.waitForTimeout(2000);
  const screenshot2Path = path.join(artifactDir, 'singularity_t2.png');
  await page.screenshot({ path: screenshot2Path });
  console.log('Saved Screenshot 2 (T=2s): singularity_t2.png');

  const telemetry2 = await page.evaluate(() => window.__DIMENSION_CANVAS_DEBUG__);
  console.log('Telemetry at T=2s:', telemetry2);

  // Assert uTime and frame counter advanced
  const uTimeDiff = telemetry2.uTime - initialTelemetry.uTime;
  const frameDiff = telemetry2.frameCount - initialTelemetry.frameCount;
  console.log(`Advancement over 2.0s: uTime delta = +${uTimeDiff.toFixed(3)}s, frames delta = +${frameDiff}`);

  if (uTimeDiff <= 0.5) {
    throw new Error(`FAIL: uTime did not advance sufficiently! Delta = ${uTimeDiff}`);
  }
  if (frameDiff <= 10) {
    throw new Error(`FAIL: Frame counter did not advance sufficiently! Delta = ${frameDiff}`);
  }

  // Compare screenshots to verify visual change in pixel buffer
  const buf1 = fs.readFileSync(screenshot1Path);
  const buf2 = fs.readFileSync(screenshot2Path);
  const isPixelIdentical = buf1.equals(buf2);
  console.log(`Pixel comparison between T=0s and T=2s: isIdentical = ${isPixelIdentical}`);
  if (isPixelIdentical) {
    throw new Error('FAIL: Screenshots 2 seconds apart are visually identical!');
  }
  console.log('PASS: Background is visibly animated and pixels are continuously changing.');

  console.log('\n[3. Testing Tab Switching (Page Visibility API)]');
  // Trigger visibilitychange to hidden
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { value: true, writable: true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.waitForTimeout(300);

  const hiddenState = await page.evaluate(() => window.__DIMENSION_CANVAS_DEBUG__.state);
  console.log('State when tab hidden:', hiddenState);
  if (hiddenState !== 'paused') {
    throw new Error(`FAIL: Expected state 'paused' when hidden, got '${hiddenState}'`);
  }

  // Restore visibility
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { value: false, writable: true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.waitForTimeout(500);

  const restoredState = await page.evaluate(() => window.__DIMENSION_CANVAS_DEBUG__.state);
  console.log('State when tab restored:', restoredState);
  if (restoredState !== 'running') {
    throw new Error(`FAIL: Expected state 'running' when restored, got '${restoredState}'`);
  }

  console.log('\n[4. Testing Window Resizing]');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForTimeout(500);
  const postResizeTelemetry = await page.evaluate(() => window.__DIMENSION_CANVAS_DEBUG__);
  console.log('Telemetry after resize:', postResizeTelemetry);
  if (postResizeTelemetry.uTime <= telemetry2.uTime) {
    throw new Error('FAIL: uTime stopped advancing after window resize!');
  }

  console.log('\n[5. Testing Anti-Gravity Toggle]');
  const antiGBtn = await page.$('button[title*="Anti-Gravity"]');
  if (antiGBtn) {
    await antiGBtn.click({ force: true });
    console.log('Toggled Anti-Gravity ON');
    await page.waitForTimeout(500);
    await antiGBtn.click({ force: true });
    console.log('Toggled Anti-Gravity OFF');
  }

  console.log('\n[6. Testing Quality Tier Switching]');
  // Expand HUD if collapsed in Singularity
  const expandBtn = await page.$('button[title="Expand HUD Panel"]');
  if (expandBtn) {
    await expandBtn.click();
    await page.waitForTimeout(300);
  }

  // Open tier menu and switch to LITE
  const tierMenuBtn = await page.$('button[title*="change quality tier"]');
  if (tierMenuBtn) {
    await tierMenuBtn.click();
    await page.waitForTimeout(300);
    const liteBtn = await page.$('div:has-text("Graphics Quality Tier") button:has-text("LITE")');
    if (liteBtn) await liteBtn.click();
  }
  await page.waitForTimeout(600);
  const liteTelemetry = await page.evaluate(() => window.__DIMENSION_CANVAS_DEBUG__);
  console.log('Telemetry in LITE tier:', liteTelemetry);

  // Open tier menu and switch to STATIC tier to verify reduced motion notice
  if (tierMenuBtn) {
    await tierMenuBtn.click();
    await page.waitForTimeout(300);
    const staticBtn = await page.$('div:has-text("Graphics Quality Tier") button:has-text("STATIC")');
    if (staticBtn) await staticBtn.click();
  }
  await page.waitForTimeout(600);

  const noticeVisible = await page.$('#reduced-motion-notice');
  console.log('Reduced Motion Notice visible in STATIC mode:', !!noticeVisible);
  if (!noticeVisible) {
    throw new Error('FAIL: Reduced motion notice did not appear in STATIC mode!');
  }

  // Click "Enable Animations" button in notice
  const enableBtn = await page.$('#reduced-motion-notice button');
  if (enableBtn) {
    await enableBtn.click();
    console.log('Clicked "Enable Animations" button.');
    await page.waitForTimeout(600);
  }

  const postEnableTelemetry = await page.evaluate(() => window.__DIMENSION_CANVAS_DEBUG__);
  console.log('Telemetry after enabling animations:', postEnableTelemetry);
  if (postEnableTelemetry.tier === 'STATIC') {
    throw new Error('FAIL: Tier was not upgraded after clicking Enable Animations!');
  }

  console.log('\n[7. Testing Terminal (Ctrl+K) Toggle]');
  await page.keyboard.press('Control+KeyK');
  await page.waitForTimeout(500);
  const terminalOpen = await page.$('text=COMMAND PALETTE');
  console.log('Terminal open:', !!terminalOpen);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  // Let the video record for another 4 seconds to achieve a complete 10-second recording
  console.log('\n[8. Finalizing 10-second Screen Recording]');
  await page.waitForTimeout(4000);

  // Close context to finalize video
  await context.close();
  await browser.close();

  // Rename video to singularity_background_moving.webm
  const files = fs.readdirSync(artifactDir);
  const videoFile = files.find(f => f.endsWith('.webm') && !f.includes('singularity_background_moving'));
  if (videoFile) {
    const oldPath = path.join(artifactDir, videoFile);
    const newPath = path.join(artifactDir, 'singularity_background_moving.webm');
    fs.renameSync(oldPath, newPath);
    console.log(`Saved 10-second screen recording: ${newPath}`);
  }

  console.log('\n[9. Console Error Verification]');
  console.log('Console Errors intercepted:', consoleErrors);
  const realErrors = consoleErrors.filter(e => !e.includes('404') && !e.includes('favicon'));
  if (realErrors.length > 0) {
    throw new Error(`FAIL: Console errors detected: ${JSON.stringify(realErrors)}`);
  }
  console.log('PASS: Zero console errors.');

  console.log('\n=== ALL TESTS PASSED SUCCESSFULLY! ===');
}

runTestSuite().catch((err) => {
  console.error('\n*** TEST SUITE FAILED ***\n', err);
  process.exit(1);
});
