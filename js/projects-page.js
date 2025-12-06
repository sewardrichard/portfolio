let __projects_page_inited = false;

function initProjectsPage() {
  if (__projects_page_inited) return;
  __projects_page_inited = true;

  const grid = document.getElementById('projects-grid');
  const stackFiltersEl = document.getElementById('stack-filters');
  const tagFiltersEl = document.getElementById('tag-filters');
  const clearBtn = document.getElementById('clear-filters');

  if (!grid || !stackFiltersEl || !tagFiltersEl) return;

  const selectedStacks = new Set();
  const selectedTags = new Set();
  let allProjects = [];

  function toggleChip(chip, set, value) {
    if (set.has(value)) {
      set.delete(value);
      chip.classList.remove('bg-brand-lime', 'text-black', 'border-brand-lime');
      chip.classList.add('bg-white/5', 'text-gray-300', 'border-white/10');
    } else {
      set.add(value);
      chip.classList.remove('bg-white/5', 'text-gray-300', 'border-white/10');
      chip.classList.add('bg-brand-lime', 'text-black', 'border-brand-lime');
    }
    renderGrid();
  }

  function makeChip(text, onClick, active = false) {
    const btn = document.createElement('button');
    btn.className = 'px-3 py-1 rounded-full text-xs font-mono border transition ' +
      (active ? 'bg-brand-lime text-black border-brand-lime' : 'bg-white/5 text-gray-300 border-white/10 hover:border-brand-lime hover:text-brand-lime');
    btn.textContent = text;
    btn.addEventListener('click', onClick);
    return btn;
  }

  function intersect(selected, arr) {
    if (selected.size === 0) return true;
    for (const v of arr || []) {
      if (selected.has(v)) return true;
    }
    return false;
  }

  function renderGrid() {
    grid.innerHTML = '';
    const filtered = allProjects.filter(p => intersect(selectedStacks, p.tech_stack) && intersect(selectedTags, p.tags));

    filtered.forEach(p => {
      const card = document.createElement('a');
      card.href = `project.html?slug=${encodeURIComponent(p.slug)}`;
      card.className = 'block bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-brand-lime transition duration-300';

      const img = document.createElement('img');
      img.src = p.cover_image;
      img.alt = p.title;
      img.className = 'w-full h-40 object-cover rounded-lg mb-4';

      const title = document.createElement('h3');
      title.className = 'font-bold text-white text-lg';
      title.textContent = p.title;

      const desc = document.createElement('p');
      desc.className = 'text-gray-400 text-sm mt-1';
      desc.textContent = p.short_description;

      const chips = document.createElement('div');
      chips.className = 'flex flex-wrap gap-2 mt-3';
      (p.tech_stack || []).slice(0, 6).forEach(s => {
        const c = document.createElement('span');
        c.className = 'text-xs bg-white/5 px-3 py-1 rounded-full text-gray-300 border border-white/10';
        c.textContent = s;
        chips.appendChild(c);
      });

      card.appendChild(img);
      card.appendChild(title);
      card.appendChild(desc);
      card.appendChild(chips);
      grid.appendChild(card);
    });
  }

  function renderFilters(projects) {
    const stacks = new Set();
    const tags = new Set();
    projects.forEach(p => {
      (p.tech_stack || []).forEach(s => stacks.add(s));
      (p.tags || []).forEach(t => tags.add(t));
    });

    stackFiltersEl.innerHTML = '';
    tagFiltersEl.innerHTML = '';

    Array.from(stacks).sort().forEach(s => {
      const chip = makeChip(s, () => toggleChip(chip, selectedStacks, s));
      stackFiltersEl.appendChild(chip);
    });
    Array.from(tags).sort().forEach(t => {
      const chip = makeChip(t, () => toggleChip(chip, selectedTags, t));
      tagFiltersEl.appendChild(chip);
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        selectedStacks.clear();
        selectedTags.clear();
        // Reset chip styles
        [...stackFiltersEl.children, ...tagFiltersEl.children].forEach(el => {
          el.classList.remove('bg-brand-lime', 'text-black', 'border-brand-lime');
          el.classList.add('bg-white/5', 'text-gray-300', 'border-white/10');
        });
        renderGrid();
      });
    }
  }

  fetch('data/projects.json', { cache: 'no-cache' })
    .then(r => r.json())
    .then(projects => {
      allProjects = projects || [];
      renderFilters(allProjects);
      renderGrid();
    })
    .catch(err => {
      console.error('Failed to load projects.json', err);
      grid.innerHTML = '<p class="text-sm text-gray-500">Failed to load projects.</p>';
    });
}

function runProjectsPage() {
  const start = () => initProjectsPage();
  if (window.__partialsReady) {
    start();
  } else {
    window.addEventListener('partials:ready', start, { once: true });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runProjectsPage);
} else {
  runProjectsPage();
}
