import { describe, it, expect } from 'vitest';
import { chromium } from 'playwright';

describe('Singularity Background Animation Verification', () => {
  it('verifies continuous background animation in Singularity dimension', async () => {
    const browser = await chromium.launch({
      executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
      headless: true,
    });

    const page = await browser.newPage();
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2500);

    // Scroll to Singularity section
    await page.evaluate(() => {
      const el = document.getElementById('chapter-singularity');
      if (el) el.scrollIntoView({ behavior: 'instant' });
    });
    await page.waitForTimeout(1500);

    // Initial telemetry check
    const initialTelemetry = await page.evaluate(() => (window as any).__DIMENSION_CANVAS_DEBUG__);
    expect(initialTelemetry).toBeDefined();
    expect(initialTelemetry.state).toBe('running');

    // Wait 1.5 seconds and check advancement
    await page.waitForTimeout(1500);
    const updatedTelemetry = await page.evaluate(() => (window as any).__DIMENSION_CANVAS_DEBUG__);
    expect(updatedTelemetry.uTime).toBeGreaterThan(initialTelemetry.uTime + 0.5);
    expect(updatedTelemetry.frameCount).toBeGreaterThan(initialTelemetry.frameCount + 10);

    // Test tab visibility pause and resume
    await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', { value: true, writable: true });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await page.waitForTimeout(200);
    const pausedState = await page.evaluate(() => (window as any).__DIMENSION_CANVAS_DEBUG__.state);
    expect(pausedState).toBe('paused');

    await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', { value: false, writable: true });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await page.waitForTimeout(200);
    const resumedState = await page.evaluate(() => (window as any).__DIMENSION_CANVAS_DEBUG__.state);
    expect(resumedState).toBe('running');

    await browser.close();
  }, 35000);
});
