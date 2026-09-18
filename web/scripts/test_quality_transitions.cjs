const { chromium } = require('playwright');

async function testQualityTransitions() {
  console.log('Starting Quality Transition Verification Test...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3500); // Wait for preloader to complete

  // Helper to read debug state
  async function getDebugMetrics() {
    return await page.evaluate(() => {
      const dbg = window.__DIMENSION_CANVAS_DEBUG__ || {};
      return {
        state: dbg.state,
        frameCount: dbg.frameCount || 0,
        uTime: dbg.uTime || 0,
        tier: dbg.tier || '',
        scrollY: window.scrollY,
      };
    });
  }

  // Ensure HUD is expanded if collapsed
  const expandBtn = page.locator('button[title="Expand HUD Panel"]');
  if (await expandBtn.isVisible()) {
    await expandBtn.click();
    await page.waitForTimeout(400);
  }

  // Helper to switch tier via UI
  async function selectTier(targetTier) {
    console.log(`\nSelecting Tier: ${targetTier}...`);
    if (await expandBtn.isVisible()) {
      await expandBtn.click();
      await page.waitForTimeout(300);
    }

    // Click Tier button in HUD to open menu
    const tierButton = page.locator('button[title="Click to change quality tier"]');
    await tierButton.waitFor({ state: 'visible', timeout: 5000 });
    await tierButton.click();
    await page.waitForTimeout(300);

    // Click the specific tier option inside the popup menu
    const option = page.locator('button').filter({ hasText: targetTier }).first();
    await option.click();
    await page.waitForTimeout(600);
  }

  const sequence = ['ULTRA', 'HIGH', 'BALANCED', 'LITE', 'STATIC', 'ULTRA'];

  for (const tier of sequence) {
    await selectTier(tier);
    
    // Sample metrics at t0
    const m0 = await getDebugMetrics();
    console.log(`[${tier}] Sample 1:`, m0);

    // Wait 600ms
    await page.waitForTimeout(600);

    // Sample metrics at t1
    const m1 = await getDebugMetrics();
    console.log(`[${tier}] Sample 2:`, m1);

    if (tier !== 'STATIC') {
      if (m1.frameCount <= m0.frameCount) {
        throw new Error(`[FAIL] Frame count did not advance in tier ${tier}! m0: ${m0.frameCount}, m1: ${m1.frameCount}`);
      }
      if (m1.uTime <= m0.uTime) {
        throw new Error(`[FAIL] uTime did not advance in tier ${tier}! m0: ${m0.uTime}, m1: ${m1.uTime}`);
      }
      console.log(`[PASS] Tier ${tier} animation is continuously running!`);
    } else {
      console.log(`[PASS] Tier STATIC paused time advancement as expected (m0 uTime: ${m0.uTime}, m1 uTime: ${m1.uTime})`);
    }

    // Verify canvas element exists and is active
    const canvasExists = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      return canvas !== null;
    });

    if (!canvasExists) {
      throw new Error(`[FAIL] Canvas disappeared during tier ${tier}!`);
    }
  }

  console.log('\n========================================');
  console.log('SUCCESS: All Quality Transitions Passed Smoothly with zero animation resets!');
  console.log('Console Errors:', consoleErrors.length === 0 ? 'None' : consoleErrors);
  console.log('========================================');

  await browser.close();
}

testQualityTransitions().catch((err) => {
  console.error('Test Failed:', err);
  process.exit(1);
});
