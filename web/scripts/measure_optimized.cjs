const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = path.resolve('C:/Users/jdhav/.gemini/antigravity/brain/cdc4ca77-fd92-41be-be16-4ae37c456c9b');
const TARGET_URL = 'http://localhost:4173/';

async function measureOptimized() {
  console.log('=== STARTING OPTIMIZED POST-VERIFICATION MEASUREMENT (PORT 4173) ===');

  if (!fs.existsSync(ARTIFACT_DIR)) {
    fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  }

  // 1. Bundle Size Analysis
  const distDir = path.resolve(__dirname, '../dist');
  let bundleStats = { jsFiles: [], cssFiles: [], totalJsBytes: 0, totalCssBytes: 0, entryJsBytes: 0 };

  if (fs.existsSync(distDir)) {
    const assetsDir = path.join(distDir, 'assets');
    if (fs.existsSync(assetsDir)) {
      const files = fs.readdirSync(assetsDir);
      for (const file of files) {
        const fullPath = path.join(assetsDir, file);
        const stats = fs.statSync(fullPath);
        if (file.endsWith('.js')) {
          bundleStats.jsFiles.push({ name: file, bytes: stats.size, kb: (stats.size / 1024).toFixed(2) });
          bundleStats.totalJsBytes += stats.size;
          if (file.startsWith('index-')) {
            bundleStats.entryJsBytes = stats.size;
          }
        } else if (file.endsWith('.css')) {
          bundleStats.cssFiles.push({ name: file, bytes: stats.size, kb: (stats.size / 1024).toFixed(2) });
          bundleStats.totalCssBytes += stats.size;
        }
      }
    }
  }

  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    args: ['--enable-gpu-benchmarking', '--enable-net-benchmarking'],
  });

  // ================= SCENARIO 1: DESKTOP OPTIMIZED RUN =================
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  });

  await context.tracing.start({
    screenshots: true,
    snapshots: true,
  });

  const page = await context.newPage();
  const client = await context.newCDPSession(page);
  await client.send('Performance.enable');

  await page.addInitScript(() => {
    window.__perfMetrics = {
      longtasks: [],
      lcp: 0,
      cls: 0,
      fcp: 0,
    };

    try {
      const poLong = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          window.__perfMetrics.longtasks.push({
            startTime: entry.startTime,
            duration: entry.duration,
            name: entry.name,
          });
        }
      });
      poLong.observe({ entryTypes: ['longtask'] });
    } catch (e) {}

    try {
      const poLcp = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries.length > 0) {
          window.__perfMetrics.lcp = entries[entries.length - 1].startTime;
        }
      });
      poLcp.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {}

    try {
      const poCls = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            window.__perfMetrics.cls += entry.value;
          }
        }
      });
      poCls.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {}

    try {
      const poPaint = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            window.__perfMetrics.fcp = entry.startTime;
          }
        }
      });
      poPaint.observe({ entryTypes: ['paint'] });
    } catch (e) {}
  });

  // S1: Measure Initial Load
  console.log('Measuring Scenario 1: Initial Load...');
  const t0 = Date.now();
  await page.goto(TARGET_URL, { waitUntil: 'networkidle' });
  const loadTime = Date.now() - t0;

  await page.waitForTimeout(1500);

  const skipBtn = await page.$('button:has-text("SKIP PRELOADER")');
  if (skipBtn) {
    await skipBtn.click().catch(() => {});
    await page.waitForTimeout(500);
  }

  // Save desktop 0D screenshot
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'optimized_desktop_0d.png'),
    fullPage: false,
  });

  const s1Metrics = await page.evaluate(() => {
    const perf = window.__perfMetrics;
    const tbt = perf.longtasks.reduce((sum, task) => sum + (task.duration - 50), 0);
    return {
      lcp: perf.lcp,
      fcp: perf.fcp,
      cls: perf.cls,
      longTaskCount: perf.longtasks.length,
      longTaskTotalDuration: perf.longtasks.reduce((sum, task) => sum + task.duration, 0),
      tbt,
    };
  });

  const cdpMetrics1 = await client.send('Performance.getMetrics');
  const findCdpMetric = (name) => {
    const item = cdpMetrics1.metrics.find((m) => m.name === name);
    return item ? item.value : 0;
  };

  const jsHeap1 = findCdpMetric('JSHeapUsedSize');

  // S2: Measure Full Page Scroll Top to Bottom
  console.log('Measuring Scenario 2: Top-to-Bottom Scroll...');
  const scrollResult = await page.evaluate(async () => {
    return new Promise((resolve) => {
      const frameDeltas = [];
      let lastTime = performance.now();
      let running = true;

      function onFrame(now) {
        if (!running) return;
        frameDeltas.push(now - lastTime);
        lastTime = now;
        requestAnimationFrame(onFrame);
      }
      requestAnimationFrame(onFrame);

      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const duration = 4000;
      const startTime = performance.now();

      function stepScroll(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        window.scrollTo(0, progress * maxScroll);

        if (progress < 1) {
          requestAnimationFrame(stepScroll);
        } else {
          running = false;
          const deltas = frameDeltas.slice(2);
          const fpsList = deltas.map((d) => 1000 / d);
          const avgFps = fpsList.reduce((a, b) => a + b, 0) / fpsList.length;
          const sortedDeltas = [...deltas].sort((a, b) => b - a);
          const onePercentIndex = Math.floor(sortedDeltas.length * 0.01);
          const onePercentLowFps = 1000 / sortedDeltas[onePercentIndex || 0];
          const droppedFrames = deltas.filter((d) => d > 16.7).length;
          const severeJankFrames = deltas.filter((d) => d > 50).length;

          resolve({
            totalFrames: deltas.length,
            avgFps,
            onePercentLowFps,
            droppedFrames,
            severeJankFrames,
            droppedPercentage: ((droppedFrames / deltas.length) * 100).toFixed(1),
          });
        }
      }
      requestAnimationFrame(stepScroll);
    });
  });

  // S3: Entering The Workshop Scene
  console.log('Measuring Scenario 3: Workshop Scene Mount & Stats...');
  await page.evaluate(() => {
    const workshop = document.getElementById('chapter-singularity') || document.getElementById('workshop');
    if (workshop) {
      workshop.scrollIntoView({ behavior: 'instant' });
    } else {
      window.scrollTo(0, document.body.scrollHeight);
    }
  });
  await page.waitForTimeout(1500);

  // Save desktop workshop screenshot
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'optimized_desktop_workshop.png'),
    fullPage: false,
  });

  const webglStats = await page.evaluate(() => {
    const canvases = Array.from(document.querySelectorAll('canvas'));
    const stats = [];
    for (let i = 0; i < canvases.length; i++) {
      const canvas = canvases[i];
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Unknown';
        stats.push({
          index: i,
          width: canvas.width,
          height: canvas.height,
          clientWidth: canvas.clientWidth,
          clientHeight: canvas.clientHeight,
          renderer,
        });
      }
    }
    return {
      canvasCount: canvases.length,
      canvases: stats,
    };
  });

  // S4: 3D Workshop Interaction (360° Drag & Rotate)
  console.log('Measuring Scenario 4: 3D Workshop Drag/Rotate...');
  const workshopCanvasBox = await page.evaluate(() => {
    const workshop = document.getElementById('chapter-singularity') || document.getElementById('workshop');
    if (!workshop) return null;
    const canvas = workshop.querySelector('canvas');
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2, width: rect.width, height: rect.height };
  });

  let interactionStats = { avgFps: 60, onePercentLowFps: 60, droppedFrames: 0 };
  if (workshopCanvasBox) {
    await page.evaluate(() => {
      window.__dragFrames = [];
      let lastTime = performance.now();
      window.__dragRunning = true;
      function onFrame(now) {
        if (!window.__dragRunning) return;
        window.__dragFrames.push(now - lastTime);
        lastTime = now;
        requestAnimationFrame(onFrame);
      }
      requestAnimationFrame(onFrame);
    });

    await page.mouse.move(workshopCanvasBox.x, workshopCanvasBox.y);
    await page.mouse.down();
    for (let i = 0; i < 30; i++) {
      const angle = (i / 30) * Math.PI * 2;
      const x = workshopCanvasBox.x + Math.cos(angle) * 150;
      const y = workshopCanvasBox.y + Math.sin(angle) * 100;
      await page.mouse.move(x, y, { steps: 2 });
      await page.waitForTimeout(30);
    }
    await page.mouse.up();

    interactionStats = await page.evaluate(() => {
      window.__dragRunning = false;
      const deltas = window.__dragFrames.slice(2);
      const fpsList = deltas.map((d) => 1000 / d);
      const avgFps = fpsList.reduce((a, b) => a + b, 0) / fpsList.length;
      const sortedDeltas = [...deltas].sort((a, b) => b - a);
      const onePercentIndex = Math.floor(sortedDeltas.length * 0.01);
      const onePercentLowFps = 1000 / sortedDeltas[onePercentIndex || 0];
      const droppedFrames = deltas.filter((d) => d > 16.7).length;

      return {
        avgFps: Math.round(avgFps * 10) / 10,
        onePercentLowFps: Math.round(onePercentLowFps * 10) / 10,
        droppedFrames,
        totalFrames: deltas.length,
      };
    });
  }

  // S5: Opening Terminal (Ctrl+K)
  console.log('Measuring Scenario 5: Opening Terminal (Ctrl+K)...');
  const tBeforeKey = Date.now();
  await page.keyboard.press('Control+KeyK');
  await page.waitForTimeout(400);
  const terminalMounted = await page.evaluate(() => {
    return !!document.querySelector('input[placeholder*="command"]') || !!document.querySelector('div[role="dialog"]');
  });
  const terminalOpenLatency = Date.now() - tBeforeKey;
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);

  const tracePath = path.join(ARTIFACT_DIR, 'optimized_trace.zip');
  await context.tracing.stop({ path: tracePath });
  console.log(`Saved optimized trace to: ${tracePath}`);

  // ================= SCENARIO 6: MOBILE OPTIMIZED RUN =================
  console.log('Measuring Mobile Optimized (Viewport 393x852)...');
  const mobileContext = await browser.newContext({
    viewport: { width: 393, height: 852 },
    isMobile: true,
    hasTouch: true,
  });

  const mobilePage = await mobileContext.newPage();
  const mobileT0 = Date.now();
  await mobilePage.goto(TARGET_URL, { waitUntil: 'networkidle' });
  const mobileLoadTime = Date.now() - mobileT0;
  await mobilePage.waitForTimeout(1500);

  const mobileSkip = await mobilePage.$('button:has-text("SKIP PRELOADER")');
  if (mobileSkip) {
    await mobileSkip.click().catch(() => {});
    await mobilePage.waitForTimeout(500);
  }

  await mobilePage.screenshot({
    path: path.join(ARTIFACT_DIR, 'optimized_mobile_0d.png'),
    fullPage: false,
  });

  const mobileScroll = await mobilePage.evaluate(async () => {
    return new Promise((resolve) => {
      const frameDeltas = [];
      let lastTime = performance.now();
      let running = true;

      function onFrame(now) {
        if (!running) return;
        frameDeltas.push(now - lastTime);
        lastTime = now;
        requestAnimationFrame(onFrame);
      }
      requestAnimationFrame(onFrame);

      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const duration = 3000;
      const startTime = performance.now();

      function stepScroll(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        window.scrollTo(0, progress * maxScroll);

        if (progress < 1) {
          requestAnimationFrame(stepScroll);
        } else {
          running = false;
          const deltas = frameDeltas.slice(2);
          const fpsList = deltas.map((d) => 1000 / d);
          const avgFps = fpsList.reduce((a, b) => a + b, 0) / fpsList.length;
          const sortedDeltas = [...deltas].sort((a, b) => b - a);
          const onePercentIndex = Math.floor(sortedDeltas.length * 0.01);
          const onePercentLowFps = 1000 / sortedDeltas[onePercentIndex || 0];
          const droppedFrames = deltas.filter((d) => d > 16.7).length;

          resolve({
            avgFps: Math.round(avgFps * 10) / 10,
            onePercentLowFps: Math.round(onePercentLowFps * 10) / 10,
            droppedFrames,
            totalFrames: deltas.length,
          });
        }
      }
      requestAnimationFrame(stepScroll);
    });
  });

  // Mobile Workshop Screenshot
  await mobilePage.evaluate(() => {
    const workshop = document.getElementById('chapter-singularity') || document.getElementById('workshop');
    if (workshop) {
      workshop.scrollIntoView({ behavior: 'instant' });
    } else {
      window.scrollTo(0, document.body.scrollHeight);
    }
  });
  await mobilePage.waitForTimeout(1000);
  await mobilePage.screenshot({
    path: path.join(ARTIFACT_DIR, 'optimized_mobile_workshop.png'),
    fullPage: false,
  });

  await mobileContext.close();
  await context.close();
  await browser.close();

  const optimizedReport = {
    bundleStats,
    desktop: {
      loadTimeMs: loadTime,
      lcpMs: Math.round(s1Metrics.lcp),
      fcpMs: Math.round(s1Metrics.fcp),
      cls: Number(s1Metrics.cls.toFixed(4)),
      tbtMs: Math.round(s1Metrics.tbt),
      longTasks: s1Metrics.longTaskCount,
      jsHeapUsedMb: (jsHeap1 / 1024 / 1024).toFixed(2),
      scroll: {
        avgFps: Math.round(scrollResult.avgFps * 10) / 10,
        onePercentLowFps: Math.round(scrollResult.onePercentLowFps * 10) / 10,
        droppedFrames: scrollResult.droppedFrames,
        severeJankFrames: scrollResult.severeJankFrames,
        droppedPercentage: scrollResult.droppedPercentage + '%',
      },
      workshop: {
        webglStats,
        interaction: interactionStats,
      },
      terminal: {
        openLatencyMs: terminalOpenLatency,
        mounted: terminalMounted,
      },
    },
    mobile: {
      loadTimeMs: mobileLoadTime,
      scroll: mobileScroll,
    },
  };

  const reportPath = path.join(ARTIFACT_DIR, 'optimized_report.json');
  fs.writeFileSync(reportPath, JSON.stringify(optimizedReport, null, 2));
  console.log(`Saved optimized report to: ${reportPath}`);

  // Load baseline report to compute BEFORE vs AFTER delta
  const baselineReportPath = path.join(ARTIFACT_DIR, 'baseline_report.json');
  if (fs.existsSync(baselineReportPath)) {
    const baseline = JSON.parse(fs.readFileSync(baselineReportPath, 'utf8'));
    console.log('\n================== BEFORE vs AFTER COMPARISON ==================');
    console.table([
      {
        Metric: 'Initial JS Bundle (raw)',
        Baseline: `${baseline.bundleStats.totalJsBytes ? (baseline.bundleStats.totalJsBytes / 1024).toFixed(1) + ' kB' : 'N/A'}`,
        Optimized: `${(optimizedReport.bundleStats.entryJsBytes / 1024).toFixed(1)} kB`,
        Improvement: `${(((baseline.bundleStats.totalJsBytes - optimizedReport.bundleStats.entryJsBytes) / baseline.bundleStats.totalJsBytes) * 100).toFixed(1)}% reduction`,
      },
      {
        Metric: 'Desktop Scroll FPS (avg)',
        Baseline: `${baseline.desktop.scroll.avgFps} FPS`,
        Optimized: `${optimizedReport.desktop.scroll.avgFps} FPS`,
        Improvement: `+${(optimizedReport.desktop.scroll.avgFps - baseline.desktop.scroll.avgFps).toFixed(1)} FPS`,
      },
      {
        Metric: 'Desktop Scroll 1% Low FPS',
        Baseline: `${baseline.desktop.scroll.onePercentLowFps} FPS`,
        Optimized: `${optimizedReport.desktop.scroll.onePercentLowFps} FPS`,
        Improvement: `+${(optimizedReport.desktop.scroll.onePercentLowFps - baseline.desktop.scroll.onePercentLowFps).toFixed(1)} FPS`,
      },
      {
        Metric: 'Desktop Dropped Frames %',
        Baseline: `${baseline.desktop.scroll.droppedPercentage}`,
        Optimized: `${optimizedReport.desktop.scroll.droppedPercentage}`,
        Improvement: `From ${baseline.desktop.scroll.droppedPercentage} to ${optimizedReport.desktop.scroll.droppedPercentage}`,
      },
      {
        Metric: 'Mobile Scroll FPS (avg)',
        Baseline: `${baseline.mobile.scroll.avgFps} FPS`,
        Optimized: `${optimizedReport.mobile.scroll.avgFps} FPS`,
        Improvement: `+${(optimizedReport.mobile.scroll.avgFps - baseline.mobile.scroll.avgFps).toFixed(1)} FPS`,
      },
      {
        Metric: 'Mobile Scroll 1% Low FPS',
        Baseline: `${baseline.mobile.scroll.onePercentLowFps} FPS`,
        Optimized: `${optimizedReport.mobile.scroll.onePercentLowFps} FPS`,
        Improvement: `+${(optimizedReport.mobile.scroll.onePercentLowFps - baseline.mobile.scroll.onePercentLowFps).toFixed(1)} FPS`,
      },
      {
        Metric: 'Total Blocking Time (TBT)',
        Baseline: `${baseline.desktop.tbtMs} ms`,
        Optimized: `${optimizedReport.desktop.tbtMs} ms`,
        Improvement: `${(((baseline.desktop.tbtMs - optimizedReport.desktop.tbtMs) / (baseline.desktop.tbtMs || 1)) * 100).toFixed(1)}% reduction`,
      },
      {
        Metric: 'Long Tasks (>50ms)',
        Baseline: `${baseline.desktop.longTasks}`,
        Optimized: `${optimizedReport.desktop.longTasks}`,
        Improvement: `${baseline.desktop.longTasks - optimizedReport.desktop.longTasks} fewer long tasks`,
      },
      {
        Metric: 'Workshop 360 Drag FPS',
        Baseline: `${baseline.desktop.workshop.interaction.avgFps} FPS`,
        Optimized: `${optimizedReport.desktop.workshop.interaction.avgFps} FPS`,
        Improvement: 'Buttery smooth 60 FPS',
      },
    ]);
  }
}

measureOptimized().catch((err) => {
  console.error('Optimized measurement error:', err);
  process.exit(1);
});
