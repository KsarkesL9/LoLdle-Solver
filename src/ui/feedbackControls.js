import { D } from '../util/debug.js';

const triOrder = ['unset','green','orange','red'];
const yearOrder = ['unset','green','lower','higher'];

function iconFor(state, isYear=false) {
  if (!isYear) {
    return state === 'green' ? '✅' : state === 'orange' ? '🟧' : state === 'red' ? '❌' : '•';
  }
  if (state === 'green') return '✅';
  if (state === 'lower') return '❌🔽';
  if (state === 'higher') return '❌🔼';
  return '•';
}

/** @param {HTMLElement} btn @param {boolean} isYear */
function setState(btn, state, isYear=false) {
  btn.dataset.state = state;
  btn.textContent = iconFor(state, isYear);
}

/** Initialize feedback buttons; returns a function to read the current feedback state. */
export function initFeedbackControls(root=document) {
  const triBtns = Array.from(root.querySelectorAll('.fb-cycle'));
  const yearBtns = Array.from(root.querySelectorAll('.fb-cycle-year'));

  triBtns.forEach(btn => setState(btn, 'unset'));
  yearBtns.forEach(btn => setState(btn, 'unset', true));

  triBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cur = btn.dataset.state || 'unset';
      const next = triOrder[(triOrder.indexOf(cur) + 1) % triOrder.length];
      D.log('Tri feedback change', btn.dataset.field, cur, '->', next);
      setState(btn, next);
    });
  });
  yearBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cur = btn.dataset.state || 'unset';
      const next = yearOrder[(yearOrder.indexOf(cur) + 1) % yearOrder.length];
      D.log('Year feedback change', btn.dataset.field, cur, '->', next);
      setState(btn, next, true);
    });
  });

  function readFeedback() {
    /** @type {Feedback} */
    const fb = {
      gender: 'unset',
      positions: 'unset',
      species: 'unset',
      resource: 'unset',
      rangeType: 'unset',
      regions: 'unset',
      releaseYear: 'unset',
    };
    triBtns.forEach(btn => {
      const field = btn.dataset.field;
      fb[field] = /** @type {any} */ (btn.dataset.state || 'unset');
    });
    yearBtns.forEach(btn => {
      fb['releaseYear'] = /** @type {any} */ (btn.dataset.state || 'unset');
    });
    D.log('readFeedback() ->', fb);
    return fb;
  }

  function reset() {
    D.log('Reset feedback controls');
    triBtns.forEach(btn => setState(btn, 'unset'));
    yearBtns.forEach(btn => setState(btn, 'unset', true));
  }

  return { readFeedback, reset };
}
