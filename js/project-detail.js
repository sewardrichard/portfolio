let __project_detail_inited = false;

function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

function setElText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text || '';
}

function showBtn(id, href) {
  const btn = document.getElementById(id);
  if (!btn) return;
  if (href && href !== '#') {
    btn.href = href;
    btn.classList.remove('hidden');
  }
}

function listToUl(ulId, items) {
  const ul = document.getElementById(ulId);
  if (!ul) return;
  ul.innerHTML = '';
  (items || []).forEach(item => {
    const li = document.createElement('li');
    li.className = 'flex gap-3';
    const bullet = document.createElement('span');
    bullet.textContent = '→';
    bullet.className = 'text-brand-lime';
    const text = document.createElement('span');
    text.textContent = item;
    li.appendChild(bullet);
    li.appendChild(text);
    ul.appendChild(li);
  });
}

function renderChals(containerId, pairs) {
  const wrap = document.getElementById(containerId);
  if (!wrap) return;
  wrap.innerHTML = '';
  (pairs || []).forEach(cs => {
    const box = document.createElement('div');
    box.className = 'bg-white/5 border border-white/10 rounded-xl p-4';

    const ch = document.createElement('p');
    ch.className = 'text-sm text-gray-400';
    ch.innerHTML = '<span class="font-semibold text-white">Challenge: </span>' + (cs.challenge || '');

    const sol = document.createElement('p');
    sol.className = 'text-sm text-gray-400 mt-2';
    sol.innerHTML = '<span class="font-semibold text-white">Solution: </span>' + (cs.solution || '');

    box.appendChild(ch);
    box.appendChild(sol);
    wrap.appendChild(box);
  });
}

// Tech stack name mapping for Iconify icons (same as coverflow.js)
const techIconMap = {
  'python': 'devicon:python',
  'pandas': 'devicon:pandas',
  'streamlit': 'devicon:streamlit',
  'git': 'devicon:git',
  'nextjs': 'devicon:nextjs',
  'react': 'devicon:react',
  'fastapi': 'devicon:fastapi',
  'sqlite': 'devicon:sqlite',
  'supabase': 'devicon:supabase',
  'typescript': 'devicon:typescript',
  'tailwindcss': 'devicon:tailwindcss',
  'langchain': 'simple-icons:langchain',
  'azure': 'mdi:microsoft-azure',
  'powerbi': 'simple-icons:powerbi',
  'aws': 'devicon:amazonwebservices-wordmark',
  'docker': 'devicon:docker',
  'github-actions': 'devicon:githubactions',
  'kubernetes': 'devicon:kubernetes',
  'vision': 'mdi:eye'
};

function chips(containerId, items) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = '';
  (items || []).forEach(t => {
    const s = document.createElement('span');
    s.className = 'text-xs bg-white/5 px-3 py-1 rounded-full text-gray-300 border border-white/10';
    s.textContent = t;
    el.appendChild(s);
  });
}

function techStackChips(containerId, items) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = '';
  (items || []).forEach(t => {
    const wrapper = document.createElement('div');
    wrapper.className = 'flex items-center gap-2 bg-white/5 px-3 py-2 rounded-full border border-white/10';
    
    const iconName = techIconMap[t] || t;
    const icon = document.createElement('span');
    icon.className = 'iconify w-5 h-5 text-brand-lime';
    icon.setAttribute('data-icon', iconName);
    
    const label = document.createElement('span');
    label.className = 'text-sm text-gray-300 capitalize';
    label.textContent = t;
    
    wrapper.appendChild(icon);
    wrapper.appendChild(label);
    el.appendChild(wrapper);
  });
}

function linksList(containerId, project) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = '';
  const links = [
    { label: 'GitHub Repository', href: project.repo_url },
    { label: 'Live Demo', href: project.live_url },
    { label: 'Demo Video', href: project.video_url }
  ];
  links.forEach(l => {
    if (l.href && l.href !== '#') {
      const a = document.createElement('a');
      a.href = l.href;
      a.target = '_blank';
      a.className = 'text-sm text-gray-300 underline hover:text-brand-lime';
      a.textContent = l.label;
      el.appendChild(a);
    }
  });
}

function gallery(containerId, images) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = '';
  (images || []).forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = 'project image';
    img.className = 'w-full h-48 object-cover rounded-lg';
    el.appendChild(img);
  });
}

function renderProject(project) {
  setElText('project-title', project.title);
  setElText('project-subtitle', project.short_description);
  setElText('overview-text', project.why_built);

  listToUl('approach-list', project.development_approach);
  renderChals('challenges-list', project.challenges);
  listToUl('outcomes-list', project.outcomes);
  chips('metrics-chips', project.metrics);
  techStackChips('stack-chips', project.tech_stack);
  linksList('links-list', project);
  gallery('gallery-grid', project.gallery && project.gallery.length ? project.gallery : [project.cover_image]);

  showBtn('btn-live', project.live_url);
  showBtn('btn-repo', project.repo_url);
  showBtn('btn-video', project.video_url);
}

function initProjectDetail() {
  if (__project_detail_inited) return;
  __project_detail_inited = true;

  const slug = getQueryParam('slug');
  if (!slug) {
    setElText('project-title', 'Project not found');
    setElText('project-subtitle', 'Missing project identifier.');
    return;
  }

  fetch('data/projects.json', { cache: 'no-cache' })
    .then(r => r.json())
    .then(items => {
      const project = (items || []).find(p => p.slug === slug);
      if (!project) {
        setElText('project-title', 'Project not found');
        setElText('project-subtitle', 'The requested project does not exist.');
        return;
      }
      renderProject(project);
    })
    .catch(err => {
      console.error('Failed to load project', err);
      setElText('project-title', 'Error loading project');
      setElText('project-subtitle', 'Please try again later.');
    });
}

function runProjectDetail() {
  const start = () => initProjectDetail();
  if (window.__partialsReady) {
    start();
  } else {
    window.addEventListener('partials:ready', start, { once: true });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runProjectDetail);
} else {
  runProjectDetail();
}
