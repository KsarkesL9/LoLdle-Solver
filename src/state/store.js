const KEY = 'loldle-classic-solver-v1';

/** @type {{history: HistoryEntry[], onlyCandidates: boolean}} */
const defaultState = {
  history: [],
  onlyCandidates: true,
};

/**
 * Loads the application state from local storage.
 * @returns {{history: HistoryEntry[], onlyCandidates: boolean}} The loaded state or default state if not found.
 */
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

/**
 * Saves a partial state object to local storage.
 * @param {Partial<typeof defaultState>} patch - A partial object with state properties to update.
 * @returns {{history: HistoryEntry[], onlyCandidates: boolean}} The updated state.
 */
export function saveState(patch) {
  const cur = loadState();
  const next = { ...cur, ...patch };
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

/** Resets the application state by clearing local storage. */
export function clearState() {
  localStorage.removeItem(KEY);
}