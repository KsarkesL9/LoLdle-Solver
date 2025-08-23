// Compute comparison pattern between a guess and a target champion.
// For all multi/single fields, treat them as sets.

/** @template T @param {T[]|T} v */
function toSet(v) {
  if (Array.isArray(v)) return new Set(v);
  return new Set([v]);
}

/** @param {Set<string>} a @param {Set<string>} b */
function setEquals(a, b) {
  if (a.size !== b.size) return false;
  for (const x of a) if (!b.has(x)) return false;
  return true;
}

/** @param {Set<string>} a @param {Set<string>} b */
function setIntersectNonEmpty(a, b) {
  for (const x of a) if (b.has(x)) return true;
  return false;
}

/** @param {Champ} guess @param {Champ} target */
export function computePattern(guess, target) {
  const fields = ['gender','positions','species','resource','rangeType','regions'];
  /** @type {Feedback} */
  const pat = {
    gender:'unset', positions:'unset', species:'unset', resource:'unset', rangeType:'unset', regions:'unset', releaseYear:'unset'
  };

  for (const f of fields) {
    const gs = toSet(guess[f]);
    const ts = toSet(target[f]);
    if (setEquals(gs, ts)) {
      pat[f] = 'green';
    } else if (setIntersectNonEmpty(gs, ts)) {
      // Partial overlap (e.g., positions: Jungle+Top vs Jungle)
      pat[f] = 'orange';
    } else {
      pat[f] = 'red';
    }
  }

  if (guess.releaseYear === target.releaseYear) {
    pat.releaseYear = 'green';
  } else if (guess.releaseYear > target.releaseYear) {
    // Need target year lower
    pat.releaseYear = 'lower';
  } else {
    pat.releaseYear = 'higher';
  }
  return pat;
}

/** Canonical string for pattern bucketing */
export function patternKey(pat) {
  // fixed field order
  const f = pat;
  return [
    f.gender, f.positions, f.species, f.resource, f.rangeType, f.regions, f.releaseYear
  ].join('|');
}
