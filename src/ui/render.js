import { rankGuesses } from '../logic/scoring.js';
import { filterCandidates } from '../logic/filter.js';
import { initAutocomplete } from './autocomplete.js';
import { D } from '../util/debug.js';
import { translations } from '../i18n.js';

const BATCH_SIZE = 20;

export function populateDatalist(champs) {
  const dl = document.getElementById('championsList');
  dl.innerHTML = '';
  for (const c of champs) {
    const opt = document.createElement('option');
    opt.value = c.nameDisplay;
    dl.appendChild(opt);
  }
}

function indexByDisplay(champs) {
  const m = new Map();
  for (const c of champs) m.set(c.nameDisplay.toLowerCase(), c);
  return m;
}

export function initUIHandlers(champs, getState, setState, setFeedback) {
  const byDisplay = indexByDisplay(champs);

  const guessInput = /** @type {HTMLInputElement} */ (document.getElementById('guessInput'));
  const ac = initAutocomplete(guessInput, champs);

  const submitBtn = document.getElementById('submitGuess');
  const resetBtn = document.getElementById('resetBtn');

  // Modal handlers
  const resetModal = document.getElementById('resetModal');
  const cancelResetBtn = document.getElementById('cancelReset');
  const confirmResetBtn = document.getElementById('confirmReset');

  let currentCandidates = [];

  resetBtn.addEventListener('click', () => {
    resetModal.style.display = 'flex';
  });
  
  cancelResetBtn.addEventListener('click', () => {
    resetModal.style.display = 'none';
  });
  
  confirmResetBtn.addEventListener('click', () => {
    D.warn('Reset session confirmed');
    setState({ history: [] });
    window.__resetFeedback();
    guessInput.value = '';
    resetModal.style.display = 'none';
  });
  
  window.addEventListener('click', (event) => {
    if (event.target === resetModal) {
      resetModal.style.display = 'none';
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

    const ranking = rankGuesses(candidates, candidates, true).slice(0, 3);
    D.log('Top3 ranking:', ranking.map(r => ({ name: r.champ.nameDisplay, score: r.score })));
    const s = getState();
    const t = translations[s.lang];

    for (const r of ranking) {
      const li = document.createElement('li');
      const wrap = document.createElement('div'); wrap.className = 'top-item';
      const img = document.createElement('img'); addIcon(img, r.champ.nameKey);
      const span = document.createElement('span'); span.textContent = `${r.champ.nameDisplay} — score: ${r.score.toFixed(2)}`;
      wrap.appendChild(img); wrap.appendChild(span); li.appendChild(wrap); top3ol.appendChild(li);
    }
    const N = candidates.length;
    uniformP.textContent = N > 0 ? `${t.uniformProbability}: 1/${N.toString()}` : '';
  }

  function renderCandidates(candidates) {
    const cont = document.getElementById('candidates');
    const cnt = document.getElementById('candCount');
    
    cont.innerHTML = '';
    cnt.textContent = `(${candidates.length})`;

    const toDisplay = candidates.slice(0, BATCH_SIZE);

    for (const c of toDisplay) {
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
    const s = getState();
    const t = translations[s.lang];
    for (let i = 0; i < history.length; i++) {
      const h = history[i];
      const row = document.createElement('div'); row.className='history-row';
      const strong = document.createElement('span'); strong.className='history-name'; strong.textContent = h.guessDisplay;
      row.appendChild(strong);

      function badge(txt) { const b = document.createElement('span'); b.className='badge'; b.textContent = txt; return b; }
      const m = new Map(Object.entries(h.feedback));
      const order = ['gender','positions','species','resource','rangeType','regions','releaseYear'];
      const labels = {
        gender: t.gender, positions: t.positions, species: t.species, resource: t.resource, rangeType: t.rangeType, regions: t.regions, releaseYear: t.year
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
      
      const undoForRowBtn = document.createElement('button');
      undoForRowBtn.textContent = '❌';
      undoForRowBtn.className = 'undo-row-btn';
      undoForRowBtn.title = 'Cofnij i edytuj tę rundę';
      undoForRowBtn.dataset.index = i;

      undoForRowBtn.addEventListener('click', () => {
        const indexToRemove = parseInt(undoForRowBtn.dataset.index, 10);
        const currentHistory = getState().history;
        const entryToRestore = currentHistory[indexToRemove];
        
        const updatedHistory = currentHistory.filter((_, idx) => idx !== indexToRemove);
        
        D.log(`Removing history entry at index ${indexToRemove}:`, entryToRestore);
        setState({ history: updatedHistory });

        guessInput.value = entryToRestore.guessDisplay;
        setFeedback(entryToRestore.feedback);
      });

      row.appendChild(undoForRowBtn);
      box.appendChild(row);
    }
  }

  function recompute() {
    const s = getState();
    D.group('Recompute');
    D.log('History length:', (s.history||[]).length, s.history);
    
    currentCandidates = filterCandidates(champs, s.history);

    D.log('Candidates after filter:', currentCandidates.length);
    D.groupEnd();

    renderTop3(currentCandidates);
    renderCandidates(currentCandidates);
    renderHistory(s.history);
  }

  submitBtn.addEventListener('click', () => {
    const c = findByDisplay(guessInput.value);
    const s = getState();
    const t = translations[s.lang];
    if (!c) {
      D.warn('Guess not found for input:', guessInput.value);
      alert(t.invalidChampion);
      return;
    }
    const fb = window.__readFeedback();
    D.log('Read feedback:', fb);

    const vals = Object.values(fb);
    if (vals.every(v => v === 'unset')) {
      alert(t.setFeedback);
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