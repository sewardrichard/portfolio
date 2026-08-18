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
  const searchInput = document.getElementById('project-search-input');
  const clearSearchBtn = document.getElementById('clear-search-btn');

  const paginationInfo = document.getElementById('pagination-info');
  const prevPageBtn = document.getElementById('prev-page-btn');
  const nextPageBtn = document.getElementById('next-page-btn');
  const pageNumbersEl = document.getElementById('page-numbers');
  const paginationWrapper = document.getElementById('pagination-wrapper');

  if (!grid || !stackFiltersEl || !tagFiltersEl) return;

  const selectedStacks = new Set();
  const selectedTags = new Set();
  let searchQuery = '';
  let currentPage = 1;
  const PAGE_SIZE = 9;
  let allProjects = [];

  function updateClearButton() {
    if (!clearBtn) return;
    if (selectedStacks.size > 0 || selectedTags.size > 0 || searchQuery.trim() !== '') {
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
    currentPage = 1;
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

  function matchesSearch(project, query) {
    if (!query || !query.trim()) return true;
    const terms = query.toLowerCase().trim().split(/\s+/);
    const textPool = [
      project.title || '',
      project.short_description || '',
      project.why_built || '',
      project.category || '',
      project.client || '',
      (project.tech_stack || []).join(' '),
      (project.tags || []).join(' ')
    ].join(' ').toLowerCase();

    return terms.every(term => textPool.includes(term));
  }

  function renderGrid() {
    grid.innerHTML = '';
    const filtered = allProjects.filter(p => 
      intersect(selectedStacks, p.tech_stack) && 
      intersect(selectedTags, p.tags) &&
      matchesSearch(p, searchQuery)
    );

    const totalProjects = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalProjects / PAGE_SIZE));

    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const startIdx = (currentPage - 1) * PAGE_SIZE;
    const endIdx = Math.min(startIdx + PAGE_SIZE, totalProjects);
    const visibleProjects = filtered.slice(startIdx, endIdx);

    if (visibleProjects.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full py-12 text-center border border-dashed border-[#DED9CF] rounded-sm bg-[#EDE8DF] px-6">
          <p class="font-serif text-lg font-semibold text-[#1C1C1A] mb-2">No projects found</p>
          <p class="font-mono text-xs text-[#7A756D] max-w-md mx-auto">No system or application matches your current search or tag filters. Try clearing your filters or searching for different terms.</p>
        </div>
      `;
    } else {
      visibleProjects.forEach(p => {
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

    renderPagination(totalProjects, totalPages, startIdx, endIdx);
  }

  function renderPagination(totalProjects, totalPages, startIdx, endIdx) {
    if (!paginationInfo || !prevPageBtn || !nextPageBtn || !pageNumbersEl) return;

    if (totalProjects === 0) {
      paginationInfo.textContent = 'Showing 0 of 0 projects';
      if (paginationWrapper) paginationWrapper.classList.add('hidden');
      return;
    }

    if (paginationWrapper) paginationWrapper.classList.remove('hidden');
    paginationInfo.textContent = `Showing ${startIdx + 1}-${endIdx} of ${totalProjects} projects`;

    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;

    pageNumbersEl.innerHTML = '';

    // Render page numbers (1 .. totalPages)
    for (let i = 1; i <= totalPages; i++) {
      const pageBtn = document.createElement('button');
      pageBtn.type = 'button';
      pageBtn.className = `w-8 h-8 rounded-sm font-mono text-xs font-semibold border transition ${
        i === currentPage
          ? 'bg-[#E57A1A] border-[#E57A1A] text-black font-bold'
          : 'bg-[#EDE8DF] border-[#DED9CF] text-[#1C1C1A] hover:border-[#E57A1A] hover:text-[#E57A1A]'
      }`;
      pageBtn.textContent = i;
      pageBtn.addEventListener('click', () => {
        if (currentPage !== i) {
          currentPage = i;
          renderGrid();
          scrollToGridTop();
        }
      });
      pageNumbersEl.appendChild(pageBtn);
    }
  }

  function scrollToGridTop() {
    if (grid) {
      const rect = grid.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      window.scrollTo({
        top: rect.top + scrollTop - 100,
        behavior: 'smooth'
      });
    }
  }

  if (prevPageBtn) {
    prevPageBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderGrid();
        scrollToGridTop();
      }
    });
  }

  if (nextPageBtn) {
    nextPageBtn.addEventListener('click', () => {
      const totalPages = Math.ceil(allProjects.length / PAGE_SIZE);
      if (currentPage < totalPages) {
        currentPage++;
        renderGrid();
        scrollToGridTop();
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      currentPage = 1;
      if (clearSearchBtn) {
        if (searchQuery.trim() !== '') {
          clearSearchBtn.classList.remove('hidden');
        } else {
          clearSearchBtn.classList.add('hidden');
        }
      }
      updateClearButton();
      renderGrid();
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      searchQuery = '';
      if (searchInput) searchInput.value = '';
      clearSearchBtn.classList.add('hidden');
      currentPage = 1;
      updateClearButton();
      renderGrid();
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
        searchQuery = '';
        if (searchInput) searchInput.value = '';
        if (clearSearchBtn) clearSearchBtn.classList.add('hidden');
        currentPage = 1;

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

