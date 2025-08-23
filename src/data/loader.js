import { toDisplayName, toKeyName } from '../util/normalize.js';

/**
 * Loads champion data from a JSON file and formats it into a structured array.
 * @param {string} url - The URL of the champions JSON file.
 * @returns {Promise<Champ[]>} A promise that resolves to an array of champion objects.
 */
export async function loadChampions(url = './champions.json') {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load champions data.');
  const raw = await res.json();

  return raw.map((c) => ({
    nameDisplay: toDisplayName(c.name),
    nameKey: toKeyName(c.name),
    gender: Array.isArray(c.gender) ? c.gender : [c.gender],
    positions: Array.isArray(c.positions) ? c.positions : [c.positions],
    species: Array.isArray(c.species) ? c.species : [c.species],
    resource: Array.isArray(c.resource) ? c.resource : [c.resource],
    rangeType: Array.isArray(c.rangeType) ? c.rangeType : [c.rangeType],
    regions: Array.isArray(c.regions) ? c.regions : [c.regions],
    releaseYear: Number(c.releaseYear),
  }));
}