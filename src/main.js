import './types.js';
import { loadChampions } from './data/loader.js';
import { loadState, saveState } from './state/store.js';
import { initUIHandlers, populateDatalist } from './ui/render.js';
import { initFeedbackControls } from './ui/feedbackControls.js';
import { D } from './util/debug.js';

async function main() {
  D.group('INIT');

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

  function getState() { return state; }

  function setState(patch) {
    const before = state;
    state = saveState(patch);
    D.log('setState patch:', patch, 'before:', before, 'after:', state);
    renderer.recompute(getState);
  }

  const renderer = initUIHandlers(champs, getState, setState, setFeedback);
  D.groupEnd();

  renderer.recompute(getState);
}

main().catch(err => {
  console.error(err);
  alert('Błąd inicjalizacji: ' + err.message);
});