import { rankGuesses } from '../logic/scoring.js';
import { filterCandidates } from '../logic/filter.js';
import { initAutocomplete } from './autocomplete.js';
import { D } from '../util/debug.js';

/**
 * Populates the datalist element for champion autocomplete.
 * @param {Champ[]} champs - The list of all champion objects.
 */
export function populateDatalist(champs) {
  const dl = document.getElementById('championsList');
  dl.innerHTML = '';
  for (const c of champs) {
    const opt = document.createElement('option');
    opt.value = c.nameDisplay;
    dl.appendChild(opt);
  }
}

/**
 * Creates a map for quick lookup of champions by their display name.
 * @param {Champ[]} champs - The list of all champion objects.
 * @returns {Map<string, Champ>} A map from normalized display name to champion object.
 */
function indexByDisplay(champs) {
  const m = new Map();
  for (const c of champs) m.set(c.nameDisplay.toLowerCase(), c);
  return m;
}

/**
 * Initializes all UI handlers and returns a recompute function.
 * @param {Champ[]} champs - The list of all champion objects.
 * @param {() => any} getState - Function to get the current application state.
 * @param {(p: any) => void} setState - Function to update the application state.
 * @returns {{recompute: Function}} An object containing the `recompute` function.
 */
export function initUIHandlers(champs, getState, setState) {
  const byDisplay = indexByDisplay(champs);

  const guessInput = /** @type {HTMLInputElement} */ (document.getElementById('guessInput'));
  const ac = initAutocomplete(guessInput, champs);

  const submitBtn = document.getElementById('submitGuess');
  const onlyCandChk = /** @type {HTMLInputElement} */ (document.getElementById('onlyCandidates'));
  const resetBtn = document.getElementById('resetBtn');

  onlyCandChk.checked = !!getState().onlyCandidates;
  D.log('UI init onlyCandidates:', getState().onlyCandidates);
  onlyCandChk.addEventListener('change', () => {
    D.log('Toggle onlyCandidates ->', onlyCandChk.checked);
    setState({ onlyCandidates: onlyCandChk.checked });
  });

  resetBtn.addEventListener('click', () => {
    if (confirm('Na pewno zresetować sesję?')) {
      D.warn('Reset session requested');
      setState({ history: [] });
    }
  });

  function findByDisplay(input) {
    const key = (input || '').trim().toLowerCase();
    return byDisplay.get(key);
  }

  function addIcon(img, key) {
    img.src = `icons/${key}.png`;
    img.alt = key;
    img.addEventListener('error', () => {
      img.src = '';
      img.style.display = 'none';
    });
  }

  function renderTop3(candidates) {
    const top3ol = document.getElementById('top3');
    const uniformP = document.getElementById('uniformP');
    top3ol.innerHTML = '';

    const s = getState();
    D.log('renderTop3 candidates:', candidates.length, 'onlyCandidates:', s.onlyCandidates);
    const universe = s.onlyCandidates ? candidates : champs;

    const ranking = rankGuesses(candidates, universe, s.onlyCandidates).slice(0, 3);
    D.log('Top3 ranking:', ranking.map(r => ({ name: r.champ.nameDisplay, score: r.score })));

    for (const r of ranking) {
      const li = document.createElement('li');
      const wrap = document.createElement('div'); wrap.className = 'top-item';
      const img = document.createElement('img'); addIcon(img, r.champ.nameKey);
      const span = document.createElement('span'); span.textContent = `${r.champ.nameDisplay} — wynik: ${r.score.toFixed(2)}`;
      wrap.appendChild(img); wrap.appendChild(span); li.appendChild(wrap); top3ol.appendChild(li);
    }
    const N = candidates.length;
    uniformP.textContent = N > 0 ? `Jednakowe P trafienia dla każdej propozycji: 1/${N.toString()}` : '';
  }

  function renderCandidates(candidates) {
    const cont = document.getElementById('candidates');
    const cnt = document.getElementById('candCount');
    cont.innerHTML = '';
    cnt.textContent = `(${candidates.length})`;
    for (const c of candidates) {
      const row = document.createElement('div'); row.className = 'candidate';
      const img = document.createElement('img'); addIcon(img, c.nameKey);
      const name = document.createElement('div'); name.className='name'; name.textContent = c.nameDisplay;
      row.appendChild(img); row.appendChild(name);
      cont.appendChild(row);
    }
  }

  function renderHistory(history) {
    const box = document.getElementById('history');
    box.innerHTML = '';
    for (const h of history) {
      const row = document.createElement('div'); row.className='history-row';
      const strong = document.createElement('span'); strong.className='history-name'; strong.textContent = h.guessDisplay;
      row.appendChild(strong);

      function badge(txt) { const b = document.createElement('span'); b.className='badge'; b.textContent = txt; return b; }
      const m = new Map(Object.entries(h.feedback));
      const order = ['gender','positions','species','resource','rangeType','regions','releaseYear'];
      const labels = {
        gender:'Płeć', positions:'Pozycje', species:'Gatunek', resource:'Zasób', rangeType:'Zasięg', regions:'Regiony', releaseYear:'Rok'
      };
      for (const k of order) {
        const v = m.get(k);
        let text = labels[k]+': ';
        if (k === 'releaseYear') {
          text += v==='green' ? '✅' : v==='lower' ? '❌🔽' : v==='higher' ? '❌🔼' : '•';
        } else {
          text += v==='green' ? '✅' : v==='orange' ? '🟧' : v==='red' ? '❌' : '•';
        }
        row.appendChild(badge(text));
      }
      box.appendChild(row);
    }
  }

  function recompute() {
    const s = getState();
    D.group('Recompute');
    D.log('History length:', (s.history||[]).length, s.history);
    const candidates = filterCandidates(champs, s.history);
    D.log('Candidates after filter:', candidates.length);
    D.groupEnd();

    renderTop3(candidates);
    renderCandidates(candidates);
    renderHistory(s.history);
  }

  submitBtn.addEventListener('click', () => {
    const c = findByDisplay(guessInput.value);
    if (!c) {
      D.warn('Guess not found for input:', guessInput.value);
      alert('Wybierz poprawną nazwę championa z listy.');
      return;
    }
    const fb = window.__readFeedback();
    D.log('Read feedback:', fb);

    const vals = Object.values(fb);
    if (vals.every(v => v === 'unset')) {
      alert('Ustaw feedback (kliknij kropki).');
      return;
    }

    const entry = {
      guessKey: c.nameKey,
      guessDisplay: c.nameDisplay,
      feedback: fb
    };
    const newHistory = (getState().history || []).concat(entry);
    D.log('Appending history entry:', entry);
    setState({ history: newHistory });

    window.__resetFeedback();
    guessInput.value = '';
  });

  return { recompute };
}