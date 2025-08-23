import { computePattern, patternKey } from './patterns.js';
import { D } from '../util/debug.js';

/**
 * Ranks possible guesses by their expected remaining candidate size.
 * A lower score is better, indicating a guess that is more likely to reduce the candidate pool.
 * @param {Champ[]} candidates - The current list of possible target champions.
 * @param {Champ[]} universe - The full list of all possible champions.
 * @param {boolean} onlyCandidates - If true, guesses are ranked from the `candidates` pool; otherwise, from the `universe`.
 * @returns {{champ: Champ, score: number}[]} A sorted array of guess rankings.
 */
export function rankGuesses(candidates, universe, onlyCandidates=true) {
  const N = candidates.length;
  if (N <= 1) {
    const pool = onlyCandidates ? candidates : universe;
    return pool.slice(0, 3).map(c => ({ champ: c, score: 0 }));
  }

  const guessPool = onlyCandidates ? candidates : universe;
  D.log('rankGuesses start', { N, guessPool: guessPool.length, onlyCandidates });

  const results = [];
  for (const guess of guessPool) {
    const buckets = new Map();
    for (const target of candidates) {
      const pat = computePattern(guess, target);
      const key = patternKey(pat);
      buckets.set(key, (buckets.get(key) || 0) + 1);
    }
    let sumsq = 0;
    for (const n of buckets.values()) sumsq += n * n;
    const score = sumsq / N;
    results.push({ champ: guess, score });
    if (results.length <= 5) D.log('score', guess.nameDisplay, score.toFixed(3), 'buckets:', buckets.size);
  }

  results.sort((a,b) => (a.score - b.score) || a.champ.nameDisplay.localeCompare(b.champ.nameDisplay));
  return results;
}