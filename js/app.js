/**
 * app.js
 * Main UI controller — now with family member ownership per option
 */

const UI = (() => {

  let currentMode = MODES[0];
  let inputCount  = 4;
  // Tracks owner per row: { rowId: memberId|null }
  let rowOwners   = {};

  const $ = id => document.getElementById(id);

  // ── Body scroll lock (iOS Safari modal fix) ────────────────────────────────
  function lockBodyScroll(lock) {
    if (lock) {
      document.body.dataset.scrollY = String(window.scrollY);
      document.body.style.position = 'fixed';
      document.body.style.top = `-${window.scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
    } else {
      const y = parseInt(document.body.dataset.scrollY || '0', 10);
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      delete document.body.dataset.scrollY;
      window.scrollTo(0, y);
    }
  }

  // ── Init ──────────────────────────────────────────────────────────────────
  function init() {
    buildModeGrid();
    buildFamilyLegend();

    const lastModeId = Storage.getLastMode();
    const lastMode   = MODES.find(m => m.id === lastModeId) || MODES[0];
    selectMode(lastMode, false);

    updateHistoryBadge(Storage.getHistory().length);
  }

  // ── Family legend in header ────────────────────────────────────────────────
  function buildFamilyLegend() {
    const legend = $('family-legend');
    if (!legend) return;
    legend.innerHTML = FAMILY.map(m => `
      <div class="legend-pill" style="background:${m.colorBg};border-color:${m.colorBorder};color:${m.color}">
        <span>${m.emoji}</span><span>${m.name}</span>
      </div>
    `).join('');
  }

  // ── Mode grid ─────────────────────────────────────────────────────────────
  function buildModeGrid() {
    const grid = $('mode-grid');
    grid.innerHTML = MODES.map(mode => `
      <div class="mode-card" id="mode-${mode.id}"
           style="--card-color: ${mode.color}"
           onclick="UI.selectMode(UI.getModeById('${mode.id}'))">
        <span class="mode-emoji">${mode.emoji}</span>
        <span class="mode-name">${mode.name}</span>
      </div>
    `).join('');
  }

  function getModeById(id) {
    return MODES.find(m => m.id === id) || MODES[0];
  }

  function selectMode(mode, animate = true) {
    currentMode = mode;
    Storage.setLastMode(mode.id);

    document.querySelectorAll('.mode-card').forEach(c => c.classList.remove('active'));
    const card = $(`mode-${mode.id}`);
    if (card) {
      card.classList.add('active');
      if (animate) { card.style.transform = 'scale(1.08)'; setTimeout(() => { if(card) card.style.transform=''; }, 200); }
    }

    $('input-title').textContent = mode.question;
    rowOwners = {};
    buildInputs(mode.defaultOptions);
    renderSuggestions(mode.id);
  }

  function getCurrentMode() { return currentMode; }

  // ── Inputs ────────────────────────────────────────────────────────────────
  function buildInputs(defaults = []) {
    const wrap = $('inputs-wrap');
    wrap.innerHTML = '';
    inputCount = 0;
    rowOwners  = {};

    const items = defaults.length ? defaults : Array(4).fill({ text: '', owner: null });
    items.forEach(item => {
      const val   = typeof item === 'string' ? item : (item.text  || '');
      const owner = typeof item === 'string' ? null  : (item.owner || null);
      addInput(val, owner);
    });
    while (inputCount < 4) addInput('', null);
  }

  function addInput(value = '', ownerId = null) {
    if (inputCount >= 10) { toast('Max 10 options! 🛑', 'error'); return; }

    inputCount++;
    const num = inputCount;
    const idx = num - 1;
    const ph  = currentMode.placeholder[idx % currentMode.placeholder.length] || `Option ${num}`;

    rowOwners[`row-${num}`] = ownerId;

    const row = document.createElement('div');
    row.className = 'input-row';
    row.id = `row-${num}`;

    // Build family picker buttons
    const pickerBtns = FAMILY.map(m => `
      <button class="owner-btn ${ownerId === m.id ? 'owner-btn-active' : ''}"
              id="owner-${num}-${m.id}"
              data-member="${m.id}"
              data-row="${num}"
              style="${ownerId === m.id ? `background:${m.colorBg};border-color:${m.color};box-shadow:0 0 8px ${m.colorGlow}` : ''}"
              title="${m.name} (${m.role})"
              onclick="UI.setOwner(${num}, '${m.id}')">
        ${m.emoji}
      </button>
    `).join('');

    const owner  = getFamilyMember(ownerId);
    const border = owner ? `border-color:${owner.colorBorder};box-shadow:0 0 0 2px ${owner.colorGlow}` : '';

    row.innerHTML = `
      <div class="input-row-inner" style="${border}" id="inner-${num}">
        <span class="input-num">${num}</span>
        <input type="text"
               class="option-input"
               placeholder="${ph}"
               value="${value ? escapeHtml(value) : ''}"
               maxlength="40"
               autocomplete="off" autocorrect="off" spellcheck="false" inputmode="text"
        />
        <div class="owner-picker" id="picker-${num}">
          ${pickerBtns}
        </div>
        <button class="btn-remove-input" onclick="UI.removeInput(${num})" title="Remove">✕</button>
      </div>
    `;

    $('inputs-wrap').appendChild(row);
  }

  function setOwner(rowNum, memberId) {
    const rowId  = `row-${rowNum}`;
    const current = rowOwners[rowId];
    // Toggle off if same
    const newOwner = current === memberId ? null : memberId;
    rowOwners[rowId] = newOwner;

    // Update picker buttons
    const picker = $(`picker-${rowNum}`);
    if (!picker) return;
    picker.querySelectorAll('.owner-btn').forEach(btn => {
      const mid = btn.dataset.member;
      const m   = getFamilyMember(mid);
      if (mid === newOwner) {
        btn.classList.add('owner-btn-active');
        btn.style.background   = m.colorBg;
        btn.style.borderColor  = m.color;
        btn.style.boxShadow    = `0 0 8px ${m.colorGlow}`;
      } else {
        btn.classList.remove('owner-btn-active');
        btn.style.background  = '';
        btn.style.borderColor = '';
        btn.style.boxShadow   = '';
      }
    });

    // Update row border glow
    const inner = $(`inner-${rowNum}`);
    if (inner) {
      if (newOwner) {
        const m = getFamilyMember(newOwner);
        inner.style.borderColor = m.colorBorder;
        inner.style.boxShadow   = `0 0 0 2px ${m.colorGlow}`;
      } else {
        inner.style.borderColor = '';
        inner.style.boxShadow   = '';
      }
    }
  }

  // Expose owners for wheel.js to read
  function getRowOwners() { return rowOwners; }

  function removeInput(num) {
    const row = $(`row-${num}`);
    if (!row) return;
    if (document.querySelectorAll('.option-input').length <= 2) {
      toast('Need at least 2 options! 🙏', 'error'); return;
    }
    row.style.opacity = '0';
    row.style.transform = 'translateX(-20px)';
    row.style.transition = 'all 0.2s';
    setTimeout(() => { row.remove(); renumberInputs(); }, 200);
  }

  function renumberInputs() {
    const rows = document.querySelectorAll('.input-row');
    const newOwners = {};
    inputCount = rows.length;
    rows.forEach((row, i) => {
      const oldId = row.id;
      const newId = `row-${i + 1}`;
      newOwners[newId] = rowOwners[oldId] || null;
      row.id = newId;
      const inner = row.querySelector('.input-row-inner');
      if (inner) inner.id = `inner-${i + 1}`;
      const num = row.querySelector('.input-num');
      if (num) num.textContent = i + 1;
      const removeBtn = row.querySelector('.btn-remove-input');
      if (removeBtn) removeBtn.setAttribute('onclick', `UI.removeInput(${i + 1})`);
      const picker = row.querySelector('.owner-picker');
      if (picker) {
        picker.id = `picker-${i + 1}`;
        picker.querySelectorAll('.owner-btn').forEach(btn => {
          btn.dataset.row = i + 1;
          btn.setAttribute('onclick', `UI.setOwner(${i + 1}, '${btn.dataset.member}')`);
        });
      }
    });
    rowOwners = newOwners;
  }

  function clearAll() {
    document.querySelectorAll('.option-input').forEach(i => i.value = '');
    // Clear all owners
    Object.keys(rowOwners).forEach(k => { rowOwners[k] = null; });
    document.querySelectorAll('.input-row-inner').forEach(el => {
      el.style.borderColor = '';
      el.style.boxShadow   = '';
    });
    document.querySelectorAll('.owner-btn').forEach(btn => {
      btn.classList.remove('owner-btn-active');
      btn.style.background = btn.style.borderColor = btn.style.boxShadow = '';
    });
    document.querySelectorAll('.option-input')[0]?.focus();
    toast('Cleared! ✨', 'info');
  }

  function saveList() {
    const rows = document.querySelectorAll('.input-row');
    const options = [];
    rows.forEach(row => {
      const inp   = row.querySelector('.option-input');
      const txt   = inp?.value.trim();
      const rowId = row.id;
      const owner = rowOwners[rowId] || null;
      if (txt) options.push({ text: txt, owner });
    });
    if (!options.length) { toast('Add some options first! 📝', 'error'); return; }
    Storage.saveList(currentMode.id, options);
    renderSuggestions(currentMode.id);
    toast(`Saved ${options.length} options! 💾`, 'success');
  }

  function loadSuggestions() {
    const saved = Storage.getSavedList(currentMode.id);
    if (!saved.length) { toast('No saved options yet! 💾', 'info'); return; }
    buildInputs(saved.slice(0, 10));
    toast(`Loaded ${Math.min(saved.length, 10)} saved options! ✅`, 'success');
  }

  // ── Suggestions ───────────────────────────────────────────────────────────
  function renderSuggestions(modeId) {
    const area  = $('suggestions-area');
    const chips = $('suggestion-chips');
    const saved = Storage.getSavedList(modeId);
    if (!saved.length) { area.style.display = 'none'; return; }

    area.style.display = 'block';
    chips.innerHTML = saved.slice(0, 15).map((s, i) => {
      const text  = typeof s === 'string' ? s : s.text;
      const owner = typeof s === 'object' ? getFamilyMember(s.owner) : null;
      const style = owner
        ? `background:${owner.colorBg};border-color:${owner.colorBorder};color:${owner.color}`
        : '';
      const payload = encodeURIComponent(JSON.stringify(typeof s === 'string' ? s : s));
      return `<div class="chip" style="${style}" data-chip="${payload}" role="button" tabindex="0">
        ${owner ? `<span>${owner.emoji}</span>` : ''}
        <span>${escapeHtml(text)}</span>
      </div>`;
    }).join('');
    chips.querySelectorAll('.chip').forEach(el => {
      el.addEventListener('click', () => {
        try {
          const data = JSON.parse(decodeURIComponent(el.dataset.chip || '""'));
          UI.addChipToInput(data);
        } catch (_) { /* fallback for malformed data */ }
      });
      el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); } });
    });
  }

  function addChipToInput(item) {
    const text  = typeof item === 'string' ? item : item.text;
    const owner = typeof item === 'object' ? (item.owner || null) : null;

    const rows = document.querySelectorAll('.input-row');
    for (const row of rows) {
      const inp = row.querySelector('.option-input');
      if (inp && !inp.value.trim()) {
        inp.value = text;
        inp.focus();
        if (owner) {
          const rowNum = parseInt(row.id.replace('row-', ''));
          setOwner(rowNum, owner);
        }
        return;
      }
    }
    addInput(text, owner);
  }

  // ── History ───────────────────────────────────────────────────────────────
  function showHistory() {
    const history = Storage.getHistory();
    const list    = $('history-list');

    if (!history.length) {
      list.innerHTML = `<div style="padding:24px;text-align:center;color:rgba(255,255,255,.3);font-family:var(--font2);font-size:0.85rem">No spins yet!<br>Go spin something 🎰</div>`;
    } else {
      list.innerHTML = history.map(h => {
        const d    = new Date(h.time);
        const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const date = d.toLocaleDateString([], { month: 'short', day: 'numeric' });
        const m    = getFamilyMember(h.owner);
        const ownerTag = m
          ? `<span class="history-owner-tag" style="background:${m.colorBg};border:1px solid ${m.colorBorder};color:${m.color}">${m.emoji} ${m.name}</span>`
          : '';
        return `
          <div class="history-item">
            <span style="font-size:1.2rem">${h.modeEmoji}</span>
            <div class="history-winner-wrap">
              <span class="history-winner">${escapeHtml(h.winner)}</span>
              ${ownerTag}
            </div>
            <span class="history-time">${date} ${time}</span>
          </div>
        `;
      }).join('');
    }

    $('history-modal').style.display = 'flex';
    lockBodyScroll(true);
  }

  function closeHistory(e) {
    if (e && e.target !== $('history-modal')) return;
    $('history-modal').style.display = 'none';
    lockBodyScroll(false);
  }

  function clearHistory() {
    Storage.    clearHistory();
    updateHistoryBadge(0);
    $('history-modal').style.display = 'none';
    lockBodyScroll(false);
    toast('History cleared! 🗑', 'success');
  }

  function updateHistoryBadge(count) {
    $('history-badge').textContent = count > 99 ? '99+' : count;
  }

  // ── Result display ────────────────────────────────────────────────────────
  function showResult(winner, ownerMember, mode) {
    const msgs  = mode.winMessages[ownerMember?.id || 'none'] || mode.winMessages.none;
    const msg   = msgs[Math.floor(Math.random() * msgs.length)];
    const emojis = RESULT_EMOJIS[mode.id] || ['🎉'];
    const emoji  = ownerMember ? ownerMember.emoji : emojis[Math.floor(Math.random() * emojis.length)];

    $('result-emoji').textContent = emoji;
    $('result-text').textContent  = winner;
    $('result-sub').textContent   = msg;

    // Colour the result card with the owner's colour
    const card = $('result-card');
    if (ownerMember) {
      card.style.setProperty('--owner-color',        ownerMember.color);
      card.style.setProperty('--owner-color-glow',   ownerMember.colorGlow);
      card.style.setProperty('--owner-color-bg',     ownerMember.colorBg);
      card.style.setProperty('--owner-color-border', ownerMember.colorBorder);
      card.classList.add('has-owner');
      // Show owner banner
      $('result-owner-banner').innerHTML = `
        <span class="owner-banner-emoji">${ownerMember.emoji}</span>
        <span class="owner-banner-name">${ownerMember.name}'s pick!</span>
        <span class="owner-banner-role">${ownerMember.role}</span>
      `;
      $('result-owner-banner').style.display = 'flex';
      $('result-owner-banner').style.background = ownerMember.colorBg;
      $('result-owner-banner').style.borderColor = ownerMember.colorBorder;
      $('result-owner-banner').style.color = ownerMember.color;
    } else {
      card.classList.remove('has-owner');
      card.style.removeProperty('--owner-color');
      card.style.removeProperty('--owner-color-glow');
      card.style.removeProperty('--owner-color-bg');
      card.style.removeProperty('--owner-color-border');
      $('result-owner-banner').style.display = 'none';
    }

    $('result-modal').style.display = 'flex';
    lockBodyScroll(true);
  }

  function closeResult() {
    $('result-modal').style.display = 'none';
    lockBodyScroll(false);
  }

  // ── Toast ─────────────────────────────────────────────────────────────────
  let toastTimer;
  function toast(msg, type = '') {
    const el = $('toast');
    el.textContent = msg;
    el.className = 'toast show' + (type ? ' ' + type : '');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.className = 'toast'; }, 3000);
  }

  // ── Utility ───────────────────────────────────────────────────────────────
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  document.addEventListener('DOMContentLoaded', init);

  window.lockBodyScroll = lockBodyScroll; // for wheel.js

  return {
    selectMode, getModeById, getCurrentMode,
    addInput, removeInput, clearAll, saveList, loadSuggestions,
    setOwner, getRowOwners,
    addChipToInput, renderSuggestions,
    showHistory, closeHistory, clearHistory, updateHistoryBadge,
    showResult, closeResult, toast,
  };
})();
