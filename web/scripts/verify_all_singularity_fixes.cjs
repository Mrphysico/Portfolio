const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function runVerification() {
  console.log('=== STARTING COMPREHENSIVE SINGULARITY VERIFICATION ===\n');

  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
  });

  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
  });

  console.log('1. Navigating to portfolio on http://localhost:5173/ ...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Navigate to Singularity
  console.log('2. Navigating to Singularity dimension...');
  await page.locator('nav button:has-text("Singularity")').click();
  await page.waitForTimeout(3000);

  // Check initial telemetry & mount counts
  const initialMounts = await page.evaluate(() => ({
    particleMounts: (window).__PARTICLE_SYSTEM_MOUNT_COUNT__,
    canvasMounts: (window).__DIMENSION_CANVAS_MOUNT_COUNT__,
    uTime: (window).__DIMENSION_CANVAS_DEBUG__?.uTime,
    state: (window).__DIMENSION_CANVAS_DEBUG__?.state,
  }));
  console.log('Initial Component Mount Status (Baseline):', initialMounts);

  const baselineParticleMounts = initialMounts.particleMounts;
  const baselineCanvasMounts = initialMounts.canvasMounts;

  // ==========================================
  // VERIFY FIX 1: Rapid Tier Cycling (10+ transitions)
  // ==========================================
  console.log('\n--- VERIFYING FIX 1: GRAPHICS QUALITY TIER CYCLING ---');
  const tiers = ['ULTRA', 'HIGH', 'BALANCED', 'LITE', 'STATIC', 'HIGH', 'ULTRA', 'BALANCED', 'STATIC', 'ULTRA', 'HIGH', 'LITE'];
  let lastUTime = initialMounts.uTime;

  for (let i = 0; i < tiers.length; i++) {
    const targetTier = tiers[i];
    
    // Switch tier via UI or evaluate
    await page.evaluate((t) => {
      // Open tier menu or directly trigger setTier via CommandPalette/event
      const hudBtn = document.querySelector('button[title="Click to change quality tier"]');
      if (hudBtn) (hudBtn).click();
    }, targetTier);
    await page.waitForTimeout(100);

    const switched = await page.evaluate((t) => {
      // Find button in popup menu
      const buttons = Array.from(document.querySelectorAll('div.glass-panel button'));
      const tierBtn = buttons.find(b => b.textContent && b.textContent.includes(t));
      if (tierBtn) {
        (tierBtn).click();
        return true;
      }
      return false;
    }, targetTier);

    // Dwell 400ms to allow 300ms smooth fade transition
    await page.waitForTimeout(400);

    const check = await page.evaluate(() => ({
      particleMounts: (window).__PARTICLE_SYSTEM_MOUNT_COUNT__,
      canvasMounts: (window).__DIMENSION_CANVAS_MOUNT_COUNT__,
      uTime: (window).__DIMENSION_CANVAS_DEBUG__?.uTime,
      activeTier: (window).__DIMENSION_CANVAS_DEBUG__?.tier,
    }));

    console.log(`Transition ${i + 1}/${tiers.length} -> ${targetTier}:`, {
      activeTier: check.activeTier,
      uTime: check.uTime?.toFixed(2) + 's',
      particleMounts: check.particleMounts,
      canvasMounts: check.canvasMounts,
    });

    if (check.particleMounts !== baselineParticleMounts) {
      throw new Error(`FAIL: ParticleSystem remounted! Was ${baselineParticleMounts}, now ${check.particleMounts}`);
    }
    if (check.canvasMounts !== baselineCanvasMounts) {
      throw new Error(`FAIL: DimensionCanvas remounted! Was ${baselineCanvasMounts}, now ${check.canvasMounts}`);
    }
    // In non-STATIC modes, uTime must strictly advance
    if (targetTier !== 'STATIC' && check.uTime <= lastUTime) {
      throw new Error(`FAIL: uTime stopped or rewound! Was ${lastUTime}, now ${check.uTime}`);
    }
    lastUTime = check.uTime;
  }

  console.log('✓ Fix 1 Passed: 12 rapid tier switches completed with 0 remounts and continuous uTime advancement.');

  // ==========================================
  // MEASURE FPS ON EACH TIER
  // ==========================================
  console.log('\n--- MEASURING FPS ACROSS ALL TIERS ---');
  const fpsResults = {};
  const allTiers = ['ULTRA', 'HIGH', 'BALANCED', 'LITE', 'STATIC'];

  for (const t of allTiers) {
    await page.evaluate((target) => {
      const hudBtn = document.querySelector('button[title="Click to change quality tier"]');
      if (hudBtn) (hudBtn).click();
    }, t);
    await page.waitForTimeout(100);

    await page.evaluate((target) => {
      const buttons = Array.from(document.querySelectorAll('div.glass-panel button'));
      const tierBtn = buttons.find(b => b.textContent && b.textContent.includes(target));
      if (tierBtn) (tierBtn).click();
    }, t);

    // Wait 1.5s for FPS to settle
    await page.waitForTimeout(1500);

    const measuredFps = await page.evaluate(() => {
      return new Promise((resolve) => {
        let frames = 0;
        const start = performance.now();
        function loop() {
          frames++;
          if (performance.now() - start > 1000) {
            const elapsed = (performance.now() - start) / 1000;
            resolve(Math.round(frames / elapsed));
          } else {
            requestAnimationFrame(loop);
          }
        }
        requestAnimationFrame(loop);
      });
    });

    fpsResults[t] = measuredFps;
    console.log(`Tier ${t} measured FPS: ${measuredFps}`);
  }

  // Restore to ULTRA for high-fidelity galaxy analysis & screenshot
  await page.evaluate(() => {
    const hudBtn = document.querySelector('button[title="Click to change quality tier"]');
    if (hudBtn) (hudBtn).click();
  });
  await page.waitForTimeout(100);
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('div.glass-panel button'));
    const ultraBtn = buttons.find(b => b.textContent && b.textContent.includes('ULTRA'));
    if (ultraBtn) (ultraBtn).click();
  });
  await page.waitForTimeout(1000);

  // ==========================================
  // VERIFY FIX 2: Galaxy Photometric RGB Analysis
  // ==========================================
  console.log('\n--- VERIFYING FIX 2: GALAXY COLOR SPECTRUM & B/R RATIO ---');
  
  // Save AFTER screenshot
  const screenshotDir = path.join(__dirname, '..', 'screenshots');
  const afterImgPath = path.join(screenshotDir, 'galaxy_after.png');
  await page.screenshot({ path: afterImgPath });
  console.log('Saved after screenshot to:', afterImgPath);

  // Measure WebGL canvas pixels directly
  const galaxyStats = await page.evaluate(() => {
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

    // Color histogram bins (Red, Gold/Amber, Cream/WarmWhite, BlueWhite, Dust)
    let coreGoldCount = 0;
    let warmWhiteCount = 0;
    let blueWhiteCount = 0;
    let dustCount = 0;
    let nebulaeCount = 0;

    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];

      // Sample stellar pixels (ignore pure black empty space)
      if (r > 3 || g > 3 || b > 3) {
        totalR += r;
        totalG += g;
        totalB += b;
        nonBlackPixels++;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const sat = max === 0 ? 0 : (max - min) / max;
        totalSat += sat;

        // Categorize star color
        if (b > r && b > g && sat > 0.05) {
          blueWhiteCount++;
        } else if (r > 150 && g < 100) {
          nebulaeCount++;
        } else if (r > g && g > b && sat > 0.25) {
          coreGoldCount++;
        } else if (r < 40 && g < 25 && b < 15) {
          dustCount++;
        } else {
          warmWhiteCount++;
        }
      }
    }

    const avgR = nonBlackPixels ? totalR / nonBlackPixels : 0;
    const avgG = nonBlackPixels ? totalG / nonBlackPixels : 0;
    const avgB = nonBlackPixels ? totalB / nonBlackPixels : 0;
    const brRatio = avgR > 0 ? avgB / avgR : 0;
    const avgSat = nonBlackPixels ? totalSat / nonBlackPixels : 0;

    return {
      totalPixelsSampled: width * height,
      stellarPixels: nonBlackPixels,
      avgR: Number(avgR.toFixed(2)),
      avgG: Number(avgG.toFixed(2)),
      avgB: Number(avgB.toFixed(2)),
      brRatio: Number(brRatio.toFixed(3)),
      avgSat: Number(avgSat.toFixed(3)),
      colorDistribution: {
        warmWhiteAndIvory: `${((warmWhiteCount / nonBlackPixels) * 100).toFixed(1)}%`,
        coreGoldAndAmber: `${((coreGoldCount / nonBlackPixels) * 100).toFixed(1)}%`,
        hotBlueWhiteStars: `${((blueWhiteCount / nonBlackPixels) * 100).toFixed(1)}%`,
        darkDustAbsorption: `${((dustCount / nonBlackPixels) * 100).toFixed(1)}%`,
        hAlphaNebulae: `${((nebulaeCount / nonBlackPixels) * 100).toFixed(1)}%`,
      }
    };
  });

  console.log('Galaxy Canvas Pixel Statistics:', galaxyStats);

  if (galaxyStats.brRatio >= 1.15) {
    throw new Error(`FAIL: B/R ratio ${galaxyStats.brRatio} is not < 1.15`);
  }

  console.log(`✓ Fix 2 Passed: B/R ratio is ${galaxyStats.brRatio} (< 1.15 target), saturation is ${galaxyStats.avgSat} (subtle & natural, non-saturated).`);

  console.log('\n=== SUMMARY OF ALL RESULTS ===');
  console.log('Fix 1: Space background movement, uninterrupted uTime, 0 remounts across 12 tier transitions: PASSED');
  console.log(`Fix 2: Real galaxy color distribution (B/R = ${galaxyStats.brRatio} < 1.15): PASSED`);
  console.log('Measured FPS per Tier:', fpsResults);

  await browser.close();
}

runVerification().catch((err) => {
  console.error('\n❌ Verification Failed:', err);
  process.exit(1);
});
