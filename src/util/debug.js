export const DEBUG = true;
export const D = {
  log: (...args) => { if (DEBUG) console.log('[LOLDLE]', ...args); },
  warn: (...args) => { if (DEBUG) console.warn('[LOLDLE]', ...args); },
  error: (...args) => { if (DEBUG) console.error('[LOLDLE]', ...args); },
  group: (label) => { if (DEBUG) console.group('[LOLDLE]', label); },
  groupEnd: () => { if (DEBUG) console.groupEnd(); },
  time: (label) => { if (DEBUG) console.time('[LOLDLE] ' + label); },
  timeEnd: (label) => { if (DEBUG) console.timeEnd('[LOLDLE] ' + label); },
};