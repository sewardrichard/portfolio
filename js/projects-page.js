let __projects_page_inited = false;

function initProjectsPage() {
  if (__projects_page_inited) return;
  __projects_page_inited = true;

  const grid = document.getElementById('projects-grid');
  const stackFiltersEl = document.getElementById('stack-filters');
  const tagFiltersEl = document.getElementById('tag-filters');
  const clearBtn = document.getElementById('clear-filters');
  const filtersPanel = document.getElementById('filters-panel');
  const toggleFiltersBtn = document.getElementById('toggle-filters');
  const toggleFiltersLabel = document.getElementById('toggle-filters-label');

  if (!grid || !stackFiltersEl || !tagFiltersEl) return;

  const selectedStacks = new Set();
  const selectedTags = new Set();
  let allProjects = [];

  function updateClearButton() {
    if (!clearBtn) return;
    if (selectedStacks.size > 0 || selectedTags.size > 0) {
      clearBtn.classList.remove('hidden');
    } else {
      clearBtn.classList.add('hidden');
    }
  }

  function toggleChip(chip, set, value) {
    if (set.has(value)) {
      set.delete(value);
      chip.classList.remove('active');
    } else {
      set.add(value);
      chip.classList.add('active');
    }
    updateClearButton();
    renderGrid();
  }

  function makeChip(text, onClick, active = false) {
    const btn = document.createElement('button');
    btn.className = 'filter-chip-btn' + (active ? ' active' : '');
    btn.textContent = text;
    btn.addEventListener('click', function() {
      onClick.call(this);
    });
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
      card.className = 'group project-card';
      card.setAttribute('aria-label', `View ${p.title}`);

      const img = document.createElement('img');
      img.src = p.cover_image;
      img.alt = p.title;
      img.className = 'w-full h-40 object-cover rounded-sm mb-4 border border-[#DED9CF] transition-transform duration-300 ease-out group-hover:scale-105';

      const metaHeader = document.createElement('div');
      metaHeader.className = 'flex items-center justify-between mb-2';
      metaHeader.innerHTML = `<span class="font-mono text-xs text-[#E57A1A] font-bold">MY WORK</span><span class="font-mono text-xs text-[#7A756D] font-semibold">${p.year || '2026'}</span>`;

      const title = document.createElement('h3');
      title.className = 'project-card-title';
      title.textContent = p.title;

      const desc = document.createElement('p');
      desc.className = 'project-card-desc line-clamp-2';
      desc.textContent = p.short_description;

      const chips = document.createElement('div');
      chips.className = 'flex flex-wrap gap-1.5 mt-4';
      (p.tech_stack || []).slice(0, 4).forEach(s => {
        const c = document.createElement('span');
        c.className = 'project-card-chip';
        c.textContent = s;
        chips.appendChild(c);
      });

      card.appendChild(img);
      card.appendChild(metaHeader);
      card.appendChild(title);
      card.appendChild(desc);
      card.appendChild(chips);

      const hint = document.createElement('div');
      hint.className = 'pointer-events-none absolute bottom-3 right-4 text-[11px] font-mono uppercase tracking-widest text-[#E57A1A] font-bold flex items-center gap-1 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition duration-300';
      hint.innerHTML = 'View details <span class="iconify w-4 h-4" data-icon="mdi:arrow-right"></span>';
      card.appendChild(hint);
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

    Array.from(tags).sort().forEach(t => {
      const chip = makeChip(t, function() {
        toggleChip(this, selectedTags, t);
      });
      tagFiltersEl.appendChild(chip);
    });
    Array.from(stacks).sort().forEach(s => {
      const chip = makeChip(s, function() {
        toggleChip(this, selectedStacks, s);
      });
      stackFiltersEl.appendChild(chip);
    });

    // Clear button handler
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        selectedStacks.clear();
        selectedTags.clear();
        // Reset chip styles
        [stackFiltersEl, tagFiltersEl].forEach(container => {
          container.querySelectorAll('button').forEach(el => {
            el.classList.remove('active');
          });
        });
        updateClearButton();
        renderGrid();
      });
    }

    // Filters panel toggle (collapsed by default)
    if (filtersPanel && toggleFiltersBtn && toggleFiltersLabel) {
      toggleFiltersBtn.addEventListener('click', () => {
        const isHidden = filtersPanel.classList.contains('hidden');
        if (isHidden) {
          filtersPanel.classList.remove('hidden');
          toggleFiltersLabel.textContent = 'Hide filters';
        } else {
          filtersPanel.classList.add('hidden');
          toggleFiltersLabel.textContent = 'Show filters';
        }
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
