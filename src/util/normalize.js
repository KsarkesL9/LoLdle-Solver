/**
 * Normalize champion names:
 * - nameDisplay: keep internal apostrophes (e.g., Kai'Sa), but strip stray trailing apostrophe (K'Sante' -> K'Sante)
 * - nameKey: remove all non-alphanumeric (A-Za-z0-9), e.g., "K'Sante" -> "KSante"
 */

/** @param {string} raw */
export function toDisplayName(raw) {
  if (!raw) return raw;
  // Strip whitespace
  let s = raw.trim();
  // If ends with a single stray apostrophe, drop it
  if (s.endsWith("'") && !s.endsWith("\'\'")) {
    s = s.slice(0, -1);
  }
  return s;
}

/** @param {string} name */
export function toKeyName(name) {
  const disp = toDisplayName(name);
  return disp.replace(/[^0-9A-Za-z]/g, "");
}
