/* ========================================================================== 
   Seward Mupereri Portfolio - Featured Projects Row (3 animated cards)
   ========================================================================== */

let __featured_row_inited = false;

async function loadFeaturedProjectsRow() {
  try {
    const response = await fetch('data/projects.json', { cache: 'no-cache' });
    const allProjects = await response.json();

    const featured = (allProjects || [])
      .filter(p => p.featured === true)
      .slice(0, 3);

    return featured;
  } catch (err) {
    console.error('Failed to load featured projects', err);
    return [];
  }
}

async function renderFeaturedProjectsRow() {
  if (__featured_row_inited) return;
  __featured_row_inited = true;

  const container = document.getElementById('featured-projects-row');
  if (!container) return;

  const projects = await loadFeaturedProjectsRow();
  if (!projects.length) {
    container.innerHTML = '<p class="text-sm text-gray-500 text-center">No featured projects yet.</p>';
    return;
  }

  container.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      ${projects
        .map(
          p => `
        <button
          type="button"
          onclick="window.location.href='project.html?slug=${p.slug}'"
          class="group project-card w-full text-left cursor-pointer"
        >
          <div class="aspect-video overflow-hidden rounded-sm mb-4 border border-[#DED9CF] bg-[#F5F0E8]">
            <img
              src="${p.cover_image}"
              alt="${p.title}"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div class="flex flex-col gap-3">
            <div class="flex items-center justify-between">
              <span class="font-mono text-xs text-[#E57A1A] font-bold">MY WORK</span>
              <span class="font-mono text-xs text-[#7A756D] font-semibold">${p.year || '2026'}</span>
            </div>
            <h3 class="project-card-title">
              ${p.title}
            </h3>
            <p class="project-card-desc line-clamp-3">
              ${p.short_description}
            </p>
            <div class="flex flex-wrap gap-1.5 mt-2">
              ${(p.tech_stack || [])
                .slice(0, 4)
                .map(
                  t => `<span class="project-card-chip">${t}</span>`
                )
                .join('')}
            </div>
            <div class="mt-4 pt-4 border-t border-[#DED9CF] flex items-center justify-between text-xs font-mono font-semibold text-[#1C1C1A] group-hover:text-[#E57A1A] transition-colors">
              <span>View Case Study</span>
              <span>→</span>
            </div>
          </div>
        </button>
      `
        )
        .join('')}
    </div>
  `;
}

function initFeaturedProjectsRow() {
  const start = () => renderFeaturedProjectsRow();
  if (window.__partialsReady) {
    start();
  } else {
    window.addEventListener('partials:ready', start, { once: true });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFeaturedProjectsRow);
} else {
  initFeaturedProjectsRow();
}
