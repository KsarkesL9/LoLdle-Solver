const KEY = 'loldle-classic-solver-v1';

/** @type {{history: HistoryEntry[], onlyCandidates: boolean}} */
const defaultState = {
  history: [],
  onlyCandidates: true,
};

/** @returns {{history: HistoryEntry[], onlyCandidates: boolean}} */
export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...defaultState };
    const parsed = JSON.parse(raw);
    return { ...defaultState, ...parsed };
  } catch {
    return { ...defaultState };
  }
}

/** @param {Partial<typeof defaultState>} patch */
export function saveState(patch) {
  const cur = loadState();
  const next = { ...cur, ...patch };
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

/** Reset session */
export function clearState() {
  localStorage.removeItem(KEY);
}
