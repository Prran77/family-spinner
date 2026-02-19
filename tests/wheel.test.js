/**
 * Wheel & Spinner test suite
 * Run from index.html?test=1
 */
(function() {
  'use strict';

  if (typeof Wheel === 'undefined' || typeof Spinner === 'undefined') {
    console.error('Tests require Wheel and Spinner. Open index.html?test=1');
    return;
  }

  const results = [];
  let pass = 0, fail = 0;

  function ok(cond, msg) {
    if (cond) { pass++; results.push({ ok: true, msg }); return true; }
    fail++; results.push({ ok: false, msg }); return false;
  }

  function run() {
    pass = 0; fail = 0; results.length = 0;
    const container = document.getElementById('wheel-container');

    // ── Positive ─────────────────────────────────────────────────────────
    ok(!!container, 'wheel-container exists');
    ok(typeof Wheel.spin === 'function', 'Wheel.spin is callable');

    // ── Edge: 0 segments ─────────────────────────────────────────────────
    Wheel.setSegments([]);
    Wheel.spin(0, () => {});
    ok(!container.querySelector('#slot-strip'), '0 segments: early return, no slot strip');

    // ── Edge: 1 segment ──────────────────────────────────────────────────
    Wheel.setSegments([{ text: 'Only', ownerColor: '#fff' }]);
    Wheel.spin(0, () => {});
    ok(!container.querySelector('#slot-strip'), '1 segment: early return');

    // ── Edge: many segments (50) ─────────────────────────────────────────
    const many = Array.from({ length: 50 }, (_, i) => ({ text: `Opt${i}`, ownerColor: '#333' }));
    Wheel.setSegments(many);
    Wheel.spin(25, () => {});
    ok(!!container.querySelector('#slot-strip'), '50 segments: renders strip');
    const items = container.querySelectorAll('#slot-strip > div');
    ok(items.length >= 50, '50+ items in strip');

    // ── Reset restores DOM for Spin Again ────────────────────────────────
    Wheel.reset();
    ok(!!document.getElementById('disco-ring'), 'Reset: disco-ring restored');
    ok(!!document.getElementById('wheel-canvas'), 'Reset: wheel-canvas restored');

    // ── Edge: winnerIndex at boundary ────────────────────────────────────
    Wheel.setSegments([{ text: 'A', ownerColor: '#f00' }, { text: 'B', ownerColor: '#0f0' }]);
    Wheel.spin(1, () => {}); // last valid index
    ok(!!container.querySelector('#slot-strip'), 'winnerIndex at max: renders correctly');

    // ── Spinner.again flow (structural) ───────────────────────────────────
    ok(typeof Spinner.again === 'function', 'Spinner.again exists');
    ok(typeof Spinner.skipToResult === 'function', 'Spinner.skipToResult exists');

    // ── buildDiscoRing robustness: null check would prevent crash ─────────
    const ring = document.getElementById('disco-ring');
    ok(!!ring, 'disco-ring exists after reset (needed for Spin Again)');

    // Report
    const total = pass + fail;
    const summary = `\n🎰 Wheel tests: ${pass} passed, ${fail} failed (${total} total)\n`;
    console.log(summary);
    results.forEach(r => console.log(r.ok ? '  ✓' : '  ✗', r.msg));

    // Toast in app if UI exists
    if (typeof UI !== 'undefined' && UI.toast) {
      UI.toast(fail === 0 ? `All ${pass} tests passed! ✓` : `${fail} test(s) failed. See console.`, fail ? 'error' : '');
    }
  }

  // Run after app init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(run, 600));
  } else {
    setTimeout(run, 600);
  }
})();
