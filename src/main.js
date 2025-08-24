import './types.js';
import { loadChampions } from './data/loader.js';
import { loadState, saveState } from './state/store.js';
import { initUIHandlers, populateDatalist } from './ui/render.js';
import { initFeedbackControls } from './ui/feedbackControls.js';
import { D } from './util/debug.js';
import { translations } from './i18n.js';

async function main() {
  D.group('INIT');

  let currentLang = localStorage.getItem('loldle-lang') || 'pl';

  function applyTranslations() {
    const t = translations[currentLang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (t[key]) {
        el.textContent = t[key];
      }
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.dataset.i18nPlaceholder;
      if (t[key]) {
        el.placeholder = t[key];
      }
    });
    document.documentElement.lang = currentLang;
  }

  const langToggleBtn = document.getElementById('lang-toggle');
  langToggleBtn.addEventListener('click', () => {
    currentLang = currentLang === 'pl' ? 'en' : 'pl';
    localStorage.setItem('loldle-lang', currentLang);
    applyTranslations();
    renderer.recompute(getState);
  });

  const champs = await loadChampions('./champions.json');
  D.log('Champions loaded:', champs.length);

  populateDatalist(champs);
  D.log('Datalist populated');

  const { readFeedback, reset, setFeedback } = initFeedbackControls(document);
  D.log('Feedback controls ready');

  window.__readFeedback = readFeedback;
  window.__resetFeedback = reset;

  let state = loadState();
  D.log('Initial state:', JSON.stringify(state));

  function getState() { return { ...state, lang: currentLang }; }

  function setState(patch) {
    const before = state;
    state = saveState(patch);
    D.log('setState patch:', patch, 'before:', before, 'after:', state);
    renderer.recompute(getState);
  }

  const renderer = initUIHandlers(champs, getState, setState, setFeedback);
  D.groupEnd();
  
  applyTranslations();
  renderer.recompute(getState);
}

main().catch(err => {
  console.error(err);
  alert('Błąd inicjalizacji: ' + err.message);
});