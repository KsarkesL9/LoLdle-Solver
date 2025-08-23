import { toDisplayName, toKeyName } from '../util/normalize.js';

/** @returns {Promise<Champ[]>} */
export async function loadChampions(url = './champions.json') {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Nie można wczytać champions.json');
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
