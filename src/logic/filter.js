import { computePattern, patternKey } from './patterns.js';
import { D } from '../util/debug.js';

/**
 * Given history (guess+feedback) keep only champions that would have produced
 * exactly the same feedback if they were the hidden target.
 * @param {Champ[]} all
 * @param {HistoryEntry[]} history
 * @returns {Champ[]}
 */
export function filterCandidates(all, history) {
  if (history.length === 0) return [...all];

  const byKey = new Map(all.map(c => [c.nameKey, c]));
  let pass = 0;
  const out = all.filter(target => {
    for (const h of history) {
      const g = byKey.get(h.guessKey);
      if (!g) return false; // unknown guess
      const pat = computePattern(g, target);
      if (patternKey(pat) !== patternKey(h.feedback)) return false;
    }
    pass++;
    return true;
  });
  D.log('filterCandidates summary:', { total: all.length, pass });
  return out;
}
