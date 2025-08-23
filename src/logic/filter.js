import { computePattern, patternKey } from './patterns.js';
import { D } from '../util/debug.js';

/**
 * Filters the list of all champions based on the game's history.
 * It keeps only those champions that would have produced the same feedback for all past guesses.
 * @param {Champ[]} all - The full list of all champions.
 * @param {HistoryEntry[]} history - The history of guesses and feedback.
 * @returns {Champ[]} An array of champions that are still candidates.
 */
export function filterCandidates(all, history) {
  if (history.length === 0) return [...all];

  const byKey = new Map(all.map(c => [c.nameKey, c]));
  let pass = 0;
  const out = all.filter(target => {
    for (const h of history) {
      const g = byKey.get(h.guessKey);
      if (!g) return false;
      const pat = computePattern(g, target);
      if (patternKey(pat) !== patternKey(h.feedback)) return false;
    }
    pass++;
    return true;
  });
  D.log('filterCandidates summary:', { total: all.length, pass });
  return out;
}