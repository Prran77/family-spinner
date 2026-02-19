/**
 * storage.js
 * Handles all localStorage persistence — now with owner metadata
 */

const Storage = (() => {

  const HISTORY_KEY  = 'spinner_history';
  const MAX_HISTORY  = 50;
  const MAX_SAVED    = 30;

  function getSavedList(modeId) {
    try {
      const raw = localStorage.getItem(`spinner_list_${modeId}`);
      if (!raw) return [];
      const data = JSON.parse(raw);
      // Normalise: support both old (string[]) and new ({ text, owner }[]) formats
      return data.map(d => typeof d === 'string' ? { text: d, owner: null } : d);
    } catch { return []; }
  }

  function saveList(modeId, options) {
    // options: array of { text, owner } or strings
    const cleaned = options
      .map(o => {
        const text  = (typeof o === 'string' ? o : o.text || '').trim();
        const owner = typeof o === 'object' ? (o.owner || null) : null;
        return text ? { text, owner } : null;
      })
      .filter(Boolean);
    if (!cleaned.length) return;

    const existing = getSavedList(modeId);
    // Merge: new entries first, deduplicate by text
    const seen = new Set();
    const merged = [...cleaned, ...existing].filter(o => {
      if (seen.has(o.text)) return false;
      seen.add(o.text);
      return true;
    }).slice(0, MAX_SAVED);

    localStorage.setItem(`spinner_list_${modeId}`, JSON.stringify(merged));
  }

  function clearList(modeId) {
    localStorage.removeItem(`spinner_list_${modeId}`);
  }

  function getHistory() {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }

  // owner param is now a memberId string or null
  function addToHistory(winner, modeId, modeEmoji, owner = null) {
    const history = getHistory();
    history.unshift({ winner, modeId, modeEmoji, owner, time: new Date().toISOString() });
    const trimmed = history.slice(0, MAX_HISTORY);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
    return trimmed.length;
  }

  function clearHistory() {
    localStorage.removeItem(HISTORY_KEY);
  }

  function getLastMode() {
    return localStorage.getItem('spinner_last_mode') || 'dinner';
  }

  function setLastMode(modeId) {
    localStorage.setItem('spinner_last_mode', modeId);
  }

  return { getSavedList, saveList, clearList, getHistory, addToHistory, clearHistory, getLastMode, setLastMode };
})();
