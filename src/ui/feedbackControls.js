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

/**
 * Sets the state and icon for a feedback button.
 * @param {HTMLElement} btn - The button element.
 * @param {string} state - The new state ('green', 'orange', etc.).
 * @param {boolean} isYear - True if it's a year feedback button.
 */
function setState(btn, state, isYear=false) {
  btn.dataset.state = state;
  btn.textContent = iconFor(state, isYear);
}

/**
 * Initializes feedback buttons and returns functions to manage their state.
 * @param {Document|HTMLElement} root - The root element to search for buttons.
 * @returns {{readFeedback: Function, reset: Function}} An object with functions to read and reset the feedback state.
 */
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

  /**
   * Reads the current state of all feedback buttons.
   * @returns {Feedback} A Feedback object representing the current state.
   */
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

  /** Resets all feedback buttons to their initial 'unset' state. */
  function reset() {
    D.log('Reset feedback controls');
    triBtns.forEach(btn => setState(btn, 'unset'));
    yearBtns.forEach(btn => setState(btn, 'unset', true));
  }

  return { readFeedback, reset };
}