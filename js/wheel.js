/**
 * wheel.js
 * SLOT MACHINE style picker - simple vertical scrolling, NO normalization!
 */

const Wheel = (() => {

  let container;
  let segments = [];
  let isSpinning = false;
  let onCompleteCallback = null;

  function init(canvasEl) {
    // We'll use the canvas container but create HTML elements instead
    container = document.getElementById('wheel-container');
  }

  function setSegments(items) {
    segments = items;
  }

  function spin(winnerIndex, onComplete) {
    if (isSpinning || segments.length < 2) return;
    
    // Force reset state
    isSpinning = true;
    onCompleteCallback = onComplete;

    // Get fresh reference to container every time
    container = document.getElementById('wheel-container');
    if (!container) {
      console.error('wheel-container not found');
      isSpinning = false;
      return;
    }

    // Clear and rebuild slot machine completely
    container.innerHTML = '';
    container.style.cssText = `
      position: relative;
      width: 340px;
      height: 340px;
      overflow: hidden;
      border-radius: 50%;
      background: linear-gradient(135deg, #1a1a35, #0d0d1a);
      border: 3px solid rgba(255,255,255,.2);
      box-shadow: 0 0 40px rgba(255,45,120,.3), 0 0 80px rgba(0,245,255,.2);
    `;

    // Create viewport window in center
    const viewport = document.createElement('div');
    viewport.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 280px;
      height: 100px;
      border: 3px solid rgba(255,230,0,.5);
      border-radius: 16px;
      background: rgba(0,0,0,.3);
      box-shadow: 
        inset 0 0 20px rgba(0,0,0,.5),
        0 0 30px rgba(255,230,0,.4);
      z-index: 10;
      pointer-events: none;
    `;
    container.appendChild(viewport);

    // Add pointer arrow
    const pointer = document.createElement('div');
    pointer.style.cssText = `
      position: absolute;
      left: -30px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 2.5rem;
      filter: drop-shadow(0 0 8px rgba(255,230,0,.8));
      z-index: 11;
    `;
    pointer.textContent = '▶';
    viewport.appendChild(pointer);

    // Create scrolling strip
    const strip = document.createElement('div');
    strip.style.cssText = `
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      width: 280px;
      will-change: top;
    `;
    strip.id = 'slot-strip';
    
    // Build a long repeating list of options
    const itemHeight = 80;
    const repeats = 20;
    const totalItems = segments.length * repeats;
    
    const items = [];
    for (let r = 0; r < repeats; r++) {
      segments.forEach((seg, i) => {
        items.push({ ...seg, originalIndex: i });
      });
    }

    // Add all items to strip
    items.forEach((item, idx) => {
      const div = document.createElement('div');
      div.style.cssText = `
        height: ${itemHeight}px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Fredoka', sans-serif;
        font-size: 1.3rem;
        font-weight: 700;
        color: white;
        background: ${item.ownerColor || '#2a2a50'};
        border-bottom: 2px solid rgba(0,0,0,.3);
        text-shadow: 0 2px 4px rgba(0,0,0,.5);
        padding: 0 20px;
        text-align: center;
        line-height: 1.2;
        word-break: break-word;
      `;
      div.textContent = item.text;
      strip.appendChild(div);
    });

    container.appendChild(strip);

    // Calculate final position
    const centerY = 170 - itemHeight / 2;
    const middleRepeat = Math.floor(repeats / 2);
    const winnerItemIndex = middleRepeat * segments.length + winnerIndex;
    const finalTop = centerY - (winnerItemIndex * itemHeight);

    // Start position - add randomness so each spin looks different
    const randomOffset = Math.floor(Math.random() * 3) * itemHeight;
    const startTop = centerY - (5 * itemHeight) + randomOffset;
    
    strip.style.top = startTop + 'px';
    strip.style.transition = 'none';

    // Trigger animation — ease-out-expo for fluid slot-machine feel:
    // fast start, smooth deceleration into final position
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        strip.style.transition = 'top 4.2s cubic-bezier(0.16, 1, 0.3, 1)';
        strip.style.top = finalTop + 'px';
      });
    });

    // Complete (match animation duration)
    setTimeout(() => {
      isSpinning = false;
      if (onCompleteCallback) onCompleteCallback(winnerIndex);
    }, 4400);
  }

  function stopImmediately(winnerIndex) {
    isSpinning = false;
    if (onCompleteCallback) onCompleteCallback(winnerIndex);
  }

  function draw() {
    // Not used in slot machine mode
  }

  function reset() {
    isSpinning = false;
    if (container) {
      container.innerHTML = '';
      // Restore original DOM structure - spin() destroys these on first run,
      // and buildDiscoRing() needs disco-ring to exist for "Spin Again"
      const discoRing = document.createElement('div');
      discoRing.className = 'disco-ring';
      discoRing.id = 'disco-ring';
      const canvas = document.createElement('canvas');
      canvas.id = 'wheel-canvas';
      canvas.width = 340;
      canvas.height = 340;
      const pointer = document.createElement('div');
      pointer.className = 'wheel-pointer';
      pointer.textContent = '▼';
      const cap = document.createElement('div');
      cap.className = 'wheel-cap';
      cap.textContent = '🎰';
      container.appendChild(discoRing);
      container.appendChild(canvas);
      container.appendChild(pointer);
      container.appendChild(cap);
    }
  }

  // Expose for test mode (?test=1)
  if (typeof window !== 'undefined' && /[?&]test=1/.test((window.location && window.location.search) || '')) {
    window.Wheel = { init, setSegments, spin, stopImmediately, draw, reset };
  }

  return { init, setSegments, spin, stopImmediately, draw, reset };
})();


// ── Spinner controller (unchanged) ──────────────────────────────────────────
const Spinner = (() => {

  let currentOptions  = [];
  let currentOwnerIds = [];
  let pendingWinner   = -1;

  function getInputData() {
    const rows  = document.querySelectorAll('.input-row');
    const owners = UI.getRowOwners();
    const options = [], ownerIds = [];
    rows.forEach(row => {
      const inp = row.querySelector('.option-input');
      const txt = inp?.value.trim();
      if (txt) {
        options.push(txt);
        ownerIds.push(owners[row.id] || null);
      }
    });
    return { options, ownerIds };
  }

  function spin() {
    const { options, ownerIds } = getInputData();
    if (options.length < 2) { UI.toast('Add at least 2 options! 🎯', 'error'); return; }

    currentOptions  = options;
    currentOwnerIds = ownerIds;
    pendingWinner   = Math.floor(Math.random() * options.length);

    const modal = document.getElementById('wheel-modal');
    modal.style.display = 'flex';
    if (typeof lockBodyScroll === 'function') lockBodyScroll(true);
    else document.body.style.overflow = 'hidden';

    const segments = options.map((text, i) => {
      const ownerId = ownerIds[i];
      const member  = ownerId ? getFamilyMember(ownerId) : null;
      return {
        text,
        color:      member ? member.color      : null,
        ownerColor: member ? member.color      : null,
        ownerEmoji: member ? member.emoji      : null,
        ownerGlow:  member ? member.colorGlow  : null,
      };
    });

    const canvas = document.getElementById('wheel-canvas');
    Wheel.init(canvas);
    Wheel.setSegments(segments);

    buildDiscoRing();
    startDiscoLights();

    setTimeout(() => Wheel.spin(pendingWinner, onWheelDone), 400);
  }

  function onWheelDone(winnerIdx) {
    stopDiscoLights();

    const winner   = currentOptions[winnerIdx];
    const ownerId  = currentOwnerIds[winnerIdx] || null;
    const owner    = ownerId ? getFamilyMember(ownerId) : null;
    const mode     = UI.getCurrentMode();

    const count = Storage.addToHistory(winner, mode.id, mode.emoji, ownerId);
    UI.updateHistoryBadge(count);
    Storage.saveList(mode.id, currentOptions.map((text, i) => ({ text, owner: currentOwnerIds[i] || null })));

    setTimeout(() => {
      closeWheel();
      UI.showResult(winner, owner, mode);
      Particles.explode(owner ? owner.color : null);
    }, 600);
  }

  function closeWheel() {
    document.getElementById('wheel-modal').style.display = 'none';
    if (typeof lockBodyScroll === 'function') lockBodyScroll(false);
    else document.body.style.overflow = '';
  }

  function skipToResult() { Wheel.stopImmediately(pendingWinner); }

  function again() {
    document.getElementById('result-modal').style.display = 'none';
    if (typeof lockBodyScroll === 'function') lockBodyScroll(false);
    else document.body.style.overflow = '';
    // Reset the wheel and spin again with new random winner
    setTimeout(() => {
      Wheel.reset();
      spin();
    }, 250);
  }

  // ── Disco ring ────────────────────────────────────────────────────────────
  let discoInterval = null;
  const DISCO_COLORS = ['#f59e0b','#f43f5e','#06b6d4','#a855f7','#ff2d78','#00f5ff','#ffe600','#39ff14'];

  function buildDiscoRing() {
    const ring = document.getElementById('disco-ring');
    if (!ring) return;
    ring.innerHTML = '';
    const size   = 340;
    const cx     = size / 2 + 20;
    const cy     = size / 2 + 20;
    const radius = size / 2 + 14;
    const count  = 24;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
      const x = cx + Math.cos(angle) * radius - 6;
      const y = cy + Math.sin(angle) * radius - 6;
      const light = document.createElement('div');
      light.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:12px;height:12px;border-radius:50%;transition:background .1s,box-shadow .1s`;
      ring.appendChild(light);
    }
  }

  function startDiscoLights() {
    const lights = document.querySelectorAll('#disco-ring div');
    let frame = 0;
    discoInterval = setInterval(() => {
      frame++;
      lights.forEach((l, i) => {
        const color = DISCO_COLORS[(i + frame) % DISCO_COLORS.length];
        const on = ((i + frame) % 3 === 0);
        l.style.background = on ? color : 'rgba(255,255,255,.05)';
        l.style.boxShadow  = on ? `0 0 8px 2px ${color}` : 'none';
      });
    }, 80);
  }

  function stopDiscoLights() {
    clearInterval(discoInterval);
    document.querySelectorAll('#disco-ring div').forEach(l => {
      l.style.background = 'rgba(255,255,255,.05)';
      l.style.boxShadow  = 'none';
    });
  }

  return { spin, skipToResult, again };
})();
