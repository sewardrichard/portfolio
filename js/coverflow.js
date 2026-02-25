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
          class="group block w-full text-left bg-white/5 border border-white/10 rounded-2xl overflow-hidden transform transition duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-brand-lime/20 hover:border-brand-lime focus:outline-none focus:ring-2 focus:ring-brand-lime focus:ring-offset-2 focus:ring-offset-brand-black"
        >
          <div class="aspect-video overflow-hidden">
            <img
              src="${p.cover_image}"
              alt="${p.title}"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div class="p-5 flex flex-col gap-3">
            <h3 class="text-sm font-semibold text-white group-hover:text-brand-lime transition-colors">
              ${p.title}
            </h3>
            <p class="text-xs text-gray-400 line-clamp-3">
              ${p.short_description}
            </p>
            <div class="flex flex-wrap gap-1 mt-1">
              ${(p.tech_stack || [])
                .slice(0, 4)
                .map(
                  t => `<span class=\"px-2 py-0.5 rounded-full bg-white/5 text-[10px] uppercase tracking-wide text-gray-400\">${t}</span>`
                )
                .join('')}
            </div>
            <div class="mt-3">
              <span class="inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-brand-lime/10 text-brand-lime text-xs font-medium opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                View more
              </span>
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
