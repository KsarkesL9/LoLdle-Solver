/**
 * Normalizes champion names for display and key purposes.
 * - `nameDisplay`: keeps internal apostrophes (e.g., Kai'Sa), but strips stray trailing apostrophe (K'Sante' -> K'Sante).
 * - `nameKey`: removes all non-alphanumeric characters (A-Za-z0-9), e.g., "K'Sante" -> "KSante".
 */

/**
 * Normalizes a raw champion name for display.
 * @param {string} raw - The raw champion name.
 * @returns {string} The normalized display name.
 */
export function toDisplayName(raw) {
  if (!raw) return raw;
  let s = raw.trim();
  if (s.endsWith("'") && !s.endsWith("\'\'")) {
    s = s.slice(0, -1);
  }
  return s;
}

/**
 * Normalizes a champion name into a key-friendly format.
 * @param {string} name - The champion name.
 * @returns {string} The normalized key name.
 */
export function toKeyName(name) {
  const disp = toDisplayName(name);
  return disp.replace(/[^0-9A-Za-z]/g, "");
}