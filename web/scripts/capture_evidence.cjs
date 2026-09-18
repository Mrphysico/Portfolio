const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function capture() {
  const artifactDir = path.resolve('C:/Users/jdhav/.gemini/antigravity/brain/cdc4ca77-fd92-41be-be16-4ae37c456c9b');
  if (!fs.existsSync(artifactDir)) {
    fs.mkdirSync(artifactDir, { recursive: true });
  }

  console.log('Launching Chromium with Playwright for artifact capture...');
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
  });

  // 1. Desktop Viewport (1920x1080) with video recording and tracing
  const contextDesktop = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: artifactDir,
      size: { width: 1280, height: 720 },
    },
  });

  await contextDesktop.tracing.start({
    screenshots: true,
    snapshots: true,
    sources: true,
  });

  const pageDesktop = await contextDesktop.newPage();
  console.log('Navigating desktop to http://localhost:5173...');
  await pageDesktop.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

  // Wait for preloader to advance or dismiss
  await pageDesktop.waitForTimeout(2000);
  const skipBtn = await pageDesktop.$('button:has-text("SKIP PRELOADER")');
  if (skipBtn) {
    await skipBtn.click();
    await pageDesktop.waitForTimeout(1000);
  }

  // Capture Desktop 0D Hero Screenshot
  await pageDesktop.screenshot({
    path: path.join(artifactDir, 'desktop_0d_hero.png'),
    fullPage: false,
  });
  console.log('Saved desktop_0d_hero.png');

  // Scroll to Chapter 1D (Amazon Clone)
  await pageDesktop.evaluate(() => window.scrollTo({ top: window.innerHeight * 1.5, behavior: 'smooth' }));
  await pageDesktop.waitForTimeout(1000);
  await pageDesktop.screenshot({
    path: path.join(artifactDir, 'desktop_1d_amazon.png'),
    fullPage: false,
  });
  console.log('Saved desktop_1d_amazon.png');

  // Scroll to Chapter 3D (Accident Detection)
  await pageDesktop.evaluate(() => window.scrollTo({ top: window.innerHeight * 3.5, behavior: 'smooth' }));
  await pageDesktop.waitForTimeout(1000);
  await pageDesktop.screenshot({
    path: path.join(artifactDir, 'desktop_3d_accident.png'),
    fullPage: false,
  });
  console.log('Saved desktop_3d_accident.png');

  // Scroll to Chapter 4D (RigForge)
  await pageDesktop.evaluate(() => window.scrollTo({ top: window.innerHeight * 5.0, behavior: 'smooth' }));
  await pageDesktop.waitForTimeout(1000);
  await pageDesktop.screenshot({
    path: path.join(artifactDir, 'desktop_4d_rigforge.png'),
    fullPage: false,
  });
  console.log('Saved desktop_4d_rigforge.png');

  // Scroll to Language Galaxy & Contact
  await pageDesktop.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
  await pageDesktop.waitForTimeout(1000);
  await pageDesktop.screenshot({
    path: path.join(artifactDir, 'desktop_singularity_contact.png'),
    fullPage: false,
  });
  console.log('Saved desktop_singularity_contact.png');

  // Stop desktop tracing and save trace file
  const tracePath = path.join(artifactDir, 'chrome_performance_trace.zip');
  await contextDesktop.tracing.stop({ path: tracePath });
  console.log('Saved chrome_performance_trace.zip');

  // Close desktop context to finalize video recording
  await contextDesktop.close();

  // Find the recorded video and rename to screen_recording.webm
  const files = fs.readdirSync(artifactDir);
  const videoFile = files.find(f => f.endsWith('.webm'));
  if (videoFile) {
    const oldPath = path.join(artifactDir, videoFile);
    const newPath = path.join(artifactDir, 'screen_recording.webm');
    if (oldPath !== newPath) {
      if (fs.existsSync(newPath)) fs.unlinkSync(newPath);
      fs.renameSync(oldPath, newPath);
      console.log('Saved screen_recording.webm');
    }
  }

  // 2. Mobile Viewport (iPhone 14 Pro: 393x852)
  const contextMobile = await browser.newContext({
    viewport: { width: 393, height: 852 },
    isMobile: true,
    hasTouch: true,
  });

  const pageMobile = await contextMobile.newPage();
  console.log('Navigating mobile to http://localhost:5173...');
  await pageMobile.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await pageMobile.waitForTimeout(1500);

  try {
    const mobileSkip = await pageMobile.$('button:has-text("SKIP PRELOADER")');
    if (mobileSkip) {
      await mobileSkip.click({ timeout: 1000 }).catch(() => {});
    }
  } catch (e) {
    // Preloader already completed
  }
  await pageMobile.waitForTimeout(1000);

  await pageMobile.screenshot({
    path: path.join(artifactDir, 'mobile_0d_hero.png'),
    fullPage: false,
  });
  console.log('Saved mobile_0d_hero.png');

  // Scroll mobile to RigForge 4D
  await pageMobile.evaluate(() => window.scrollTo({ top: window.innerHeight * 4.5, behavior: 'smooth' }));
  await pageMobile.waitForTimeout(1000);
  await pageMobile.screenshot({
    path: path.join(artifactDir, 'mobile_4d_rigforge.png'),
    fullPage: false,
  });
  console.log('Saved mobile_4d_rigforge.png');

  await contextMobile.close();
  await browser.close();
  console.log('All verification artifacts successfully captured!');
}

capture().catch((err) => {
  console.error('Capture error:', err);
  process.exit(1);
});
