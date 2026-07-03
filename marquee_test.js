const { chromium } = require('playwright');
const path = require('path');

const widths = [1920, 1280, 768, 375];
const fileUrl = 'file:///' + path.resolve(__dirname, 'index.html').replace(/\\/g, '/');

async function measure(page) {
  return await page.evaluate(() => {
    const container = document.getElementById('originsMarquee');
    const track = document.getElementById('originsTrack');
    const sets = track.querySelectorAll('.marquee-set');
    const cs = getComputedStyle(track);
    const trackRect = track.getBoundingClientRect();
    return {
      containerWidth: container.clientWidth,
      trackWidth: trackRect.width,
      setCount: sets.length,
      animationDuration: cs.animationDuration,
      animationName: cs.animationName,
    };
  });
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log('=== FRESH LOAD TEST (separate page per width) ===');
  const freshResults = [];
  for (const w of widths) {
    const p = await browser.newPage({ viewport: { width: w, height: 800 } });
    await p.setViewportSize({ width: w, height: 800 });
    await p.goto(fileUrl);
    await p.waitForTimeout(200); // let rebuild()/load fire
    const m = await measure(p);
    freshResults.push({ width: w, ...m });
    await p.close();
  }
  freshResults.forEach(r => {
    const ratio = parseFloat(r.animationDuration) / r.trackWidth;
    console.log(JSON.stringify({ ...r, durationPerPx: ratio.toFixed(5) }));
  });

  console.log('\n=== RESIZE TEST (same page, resized in sequence) ===');
  const page2 = await browser.newPage();
  await page2.setViewportSize({ width: 1920, height: 800 });
  await page2.goto(fileUrl);
  await page2.waitForTimeout(200);

  const resizeResults = [];
  for (const w of widths) {
    await page2.setViewportSize({ width: w, height: 800 });
    // wait for debounce (150ms) + buffer
    await page2.waitForTimeout(350);
    const m = await measure(page2);
    resizeResults.push({ width: w, ...m });
  }
  resizeResults.forEach(r => {
    const ratio = parseFloat(r.animationDuration) / r.trackWidth;
    console.log(JSON.stringify({ ...r, durationPerPx: ratio.toFixed(5) }));
  });

  await browser.close();

  // Print summary as JSON for parsing
  console.log('\n=== JSON_SUMMARY ===');
  console.log(JSON.stringify({ fresh: freshResults, resize: resizeResults }, null, 2));
})();
