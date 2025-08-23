export function initAutocomplete(inputEl, champs) {
  const listEl = document.getElementById('acList');
  let items = [];
  let activeIndex = -1;

  function norm(s) { return (s||'').toLowerCase(); }
  function matchers(q) {
    const qq = norm(q);
    return function(c) {
      const name = norm(c.nameDisplay);
      const i = name.indexOf(qq);
      if (i < 0) return null;
      return { champ: c, index: i };
    };
  }

  function render(q) {
    const matcher = matchers(q);
    const found = [];
    for (const c of champs) {
      const m = matcher(c);
      if (m) found.push(m);
    }
    found.sort((a,b) => (a.index - b.index) || a.champ.nameDisplay.localeCompare(b.champ.nameDisplay));
    items = found.slice(0, 12).map(m => m.champ);
    activeIndex = -1;

    listEl.innerHTML = '';
    if (items.length === 0) {
      const div = document.createElement('div'); div.className='ac-empty'; div.textContent = 'Brak dopasowań';
      listEl.appendChild(div);
    } else {
      for (let i=0;i<items.length;i++) {
        const c = items[i];
        const row = document.createElement('div'); row.className='ac-item'; row.dataset.index = i.toString();
        const img = document.createElement('img'); img.src = `icons/${c.nameKey}.png`; img.alt = c.nameKey;
        img.addEventListener('error', () => { img.style.display='none'; });
        const span = document.createElement('span'); span.textContent = c.nameDisplay;
        row.appendChild(img); row.appendChild(span);
        row.addEventListener('mousedown', (e) => {
          e.preventDefault(); pick(i);
        });
        listEl.appendChild(row);
      }
    }
    listEl.hidden = false;
  }

  function clear() {
    listEl.hidden = true;
    listEl.innerHTML = '';
    items = [];
    activeIndex = -1;
  }

  function pick(i) {
    const c = items[i];
    if (!c) return;
    inputEl.value = c.nameDisplay;
    clear();
    inputEl.dispatchEvent(new Event('change'));
    inputEl.focus();
  }

  function updateActive(newIdx) {
    const rows = listEl.querySelectorAll('.ac-item');
    rows.forEach(r => r.classList.remove('active'));
    activeIndex = newIdx;
    if (activeIndex >=0 && rows[activeIndex]) rows[activeIndex].classList.add('active');
  }

  inputEl.addEventListener('input', () => {
    const q = inputEl.value;
    if (q && q.length >= 1) render(q); else clear();
  });
  inputEl.addEventListener('keydown', (e) => {
    if (listEl.hidden) return;
    const rows = listEl.querySelectorAll('.ac-item');
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = Math.min((activeIndex + 1), rows.length - 1);
      updateActive(next);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = Math.max((activeIndex - 1), 0);
      updateActive(prev);
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0) { e.preventDefault(); pick(activeIndex); }
    } else if (e.key === 'Escape') {
      clear();
    }
  });
  inputEl.addEventListener('blur', () => {
    setTimeout(clear, 100);
  });

  return { clear };
}