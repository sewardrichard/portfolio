/* ==========================================================================
   Seward Mupereri Portfolio - Coverflow Projects Component
   ========================================================================== */

let __coverflow_inited = false;
let projects = [];
let currentIndex = 0;
let autoScrollInterval = null;

// Tech stack name mapping for Iconify icons
const techIconMap = {
    'python': 'devicon:python',
    'python 3.11': 'devicon:python',
    'python (pandas, sqlalchemy)': 'devicon:python',
    'pandas': 'devicon:pandas',
    'streamlit': 'devicon:streamlit',
    'git': 'devicon:git',
    'git/github': 'devicon:github',
    'nextjs': 'devicon:nextjs',
    'nextjs 14 (app router)': 'devicon:nextjs',
    'react': 'devicon:react',
    'react 18': 'devicon:react',
    'fastapi': 'devicon:fastapi',
    'sqlite': 'devicon:sqlite',
    'supabase': 'devicon:supabase',
    'typescript': 'devicon:typescript',
    'tailwindcss': 'devicon:tailwindcss',
    'langchain': 'simple-icons:langchain',
    'azure': 'mdi:microsoft-azure',
    'azure sql': 'mdi:microsoft-azure',
    'power bi': 'simple-icons:powerbi',
    'power apps': 'mdi:microsoft-azure',
    'powerbi': 'simple-icons:powerbi',
    'aws': 'devicon:amazonwebservices-wordmark',
    'docker': 'devicon:docker',
    'github actions': 'devicon:githubactions',
    'github-actions': 'devicon:githubactions',
    'kubernetes': 'devicon:kubernetes',
    'kubernetes (eks)': 'devicon:kubernetes',
    'vision': 'mdi:eye',
    'vision api (gemini 2.0 flash)': 'mdi:eye',
    'gradio': 'simple-icons:gradio',
    'server actions': 'mdi:server',
    'data modeling': 'mdi:database',
    'agile/scrum': 'mdi:chart-gantt'
};

async function loadFeaturedProjects() {
    try {
        const response = await fetch('data/projects.json');
        const allProjects = await response.json();
        // Filter only featured projects
        projects = allProjects
            .filter(p => p.featured === true)
            .map(p => ({
                slug: p.slug,
                title: p.title,
                description: p.short_description,
                image: p.cover_image,
                tools: p.tech_stack.map(t => techIconMap[t] || t),
                github: p.repo_url,
                demo: p.live_url
            }));
        return projects;
    } catch (error) {
        console.error('Error loading projects:', error);
        return [];
    }
}

async function createCoverFlow() {
    const coverflow = document.getElementById('coverflow');
    if (!coverflow) return;
    
    // Load projects from JSON
    await loadFeaturedProjects();
    if (projects.length === 0) return;
    
    coverflow.innerHTML = '';

    projects.forEach((project, index) => {
        const item = document.createElement('div');
        item.className = 'cover-item';
        item.onclick = () => navigateToIndex(index);

        const toolIcons = project.tools.map(tool => 
            `<span class="iconify w-5 h-5 text-brand-lime" data-icon="${tool}" title="${tool}"></span>`
        ).join('');

        item.innerHTML = `
            <a href="project.html?slug=${project.slug}" class="cover block cursor-pointer">
                <img src="${project.image}" alt="${project.title}" class="cover-image">
                <div class="cover-overlay"></div>
                <div class="absolute bottom-3 left-3 flex gap-2 z-10">
                    ${toolIcons}
                </div>
            </a>
            <div class="text-center mt-4">
                <div class="text-sm font-semibold uppercase text-brand-lime tracking-widest">
                    ${project.title}
                </div>
                <div class="cover-description text-xs text-gray-400 mt-1 px-2 transition-opacity duration-500 opacity-0">
                    ${project.description}
                </div>
            </div>
        `;

        coverflow.appendChild(item);
    });

    updatePositions();
}

function updatePositions() {
    const items = document.querySelectorAll('.cover-item');

    items.forEach((item, index) => {
        item.className = 'cover-item';
        const description = item.querySelector('.cover-description');

        const diff = index - currentIndex;

        if (diff === 0) {
            item.classList.add('center');
            // Fade in description for center item
            if (description) {
                description.classList.remove('opacity-0');
                description.classList.add('opacity-100');
            }
        } else if (diff === -1) {
            item.classList.add('left-1');
        } else if (diff === -2) {
            item.classList.add('left-2');
        } else if (diff === 1) {
            item.classList.add('right-1');
        } else if (diff === 2) {
            item.classList.add('right-2');
        } else {
            item.classList.add('hidden');
        }

        // Fade out description for non-center items
        if (diff !== 0) {
            if (description) {
                description.classList.remove('opacity-100');
                description.classList.add('opacity-0');
            }
        }
    });
}

function navigate(direction) {
    currentIndex += direction;

    if (currentIndex < 0) {
        currentIndex = projects.length - 1;
    } else if (currentIndex >= projects.length) {
        currentIndex = 0;
    }

    updatePositions();
}

function navigateToIndex(index) {
    currentIndex = index;
    updatePositions();
}

async function initCoverflow() {
    if (__coverflow_inited) return;
    __coverflow_inited = true;
    const container = document.querySelector('.coverflow-container');
    if (!container) return;
    
    await createCoverFlow();
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') navigate(-1);
        if (e.key === 'ArrowRight') navigate(1);
    });

    // Auto-scroll every 3 seconds
    autoScrollInterval = setInterval(() => navigate(1), 3000);

    // Pause auto-scroll on hover, resume on leave
    container.addEventListener('mouseenter', () => {
        if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
            autoScrollInterval = null;
        }
    });
    
    container.addEventListener('mouseleave', () => {
        if (!autoScrollInterval) {
            autoScrollInterval = setInterval(() => navigate(1), 3000);
        }
    });
    
    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    container.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    container.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const swipeDistance = touchEndX - touchStartX;
        
        if (Math.abs(swipeDistance) > 50) {
            if (swipeDistance > 0) {
                navigate(-1); // Swipe right = previous
            } else {
                navigate(1); // Swipe left = next
            }
        }
    }, { passive: true });
}

// Make navigate function globally available for button onclick
window.navigate = navigate;

// Initialize when DOM is ready and partials are loaded
function runCoverflowInit() {
    const start = () => initCoverflow();
    if (window.__partialsReady) {
        start();
    } else {
        window.addEventListener('partials:ready', start, { once: true });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runCoverflowInit);
} else {
    runCoverflowInit();
}
