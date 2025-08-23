// JSDoc typedefs for clarity
/**
 * @typedef {Object} Champ
 * @property {string} nameDisplay  // e.g. "K'Sante"
 * @property {string} nameKey      // e.g. "KSante" (no special chars, for icons)
 * @property {string[]} gender
 * @property {string[]} positions
 * @property {string[]} species
 * @property {string[]} resource
 * @property {string[]} rangeType
 * @property {string[]} regions
 * @property {number} releaseYear
 */

/**
 * @typedef {"unset"|"green"|"orange"|"red"} TriState
 * @typedef {"unset"|"green"|"lower"|"higher"} YearState
 */

/**
 * @typedef {Object} Feedback
 * @property {TriState} gender
 * @property {TriState} positions
 * @property {TriState} species
 * @property {TriState} resource
 * @property {TriState} rangeType
 * @property {TriState} regions
 * @property {YearState} releaseYear
 */

/**
 * @typedef {Object} HistoryEntry
 * @property {string} guessKey
 * @property {Feedback} feedback
 */
