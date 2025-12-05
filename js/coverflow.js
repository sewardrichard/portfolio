/* ==========================================================================
   Seward Mupereri Portfolio - Coverflow Projects Component
   ========================================================================== */

const projects = [
    {
        title: "WP2 - Working Paper Populator",
        description: "Full-stack automation tool for audit working papers. Reduced prep time from 3-4 hours to under 5 minutes.",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=640&h=360&fit=crop",
        tools: ["python", "pandas", "streamlit", "git"],
        github: "#",
        demo: "#"
    },
    {
        title: "UniExplorer",
        description: "SA University Program Recommender helping students discover programs based on academic results.",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=640&h=360&fit=crop",
        tools: ["nextdotjs", "react", "fastapi", "sqlite"],
        github: "#",
        demo: "#"
    },
    {
        title: "AI Prompt Optimization Tool",
        description: "Interactive tool for refining and testing LLM prompts to improve AI output quality.",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=640&h=360&fit=crop",
        tools: ["python", "langchain", "google", "streamlit"],
        github: "#",
        demo: "#"
    },
    {
        title: "Member Data Manager",
        description: "Cloud-based tool for managing member lifecycle in Project Y with real-time dashboards.",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=640&h=360&fit=crop",
        tools: ["microsoftazure", "powerbi", "python", "git"],
        github: "#",
        demo: "#"
    },
    {
        title: "Multi-Cloud Deployment",
        description: "Production-grade Streamlit app deployed on AWS & Azure with unified CI/CD pipeline.",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=640&h=360&fit=crop",
        tools: ["amazonaws", "microsoftazure", "docker", "githubactions"],
        github: "#",
        demo: "#"
    },
    {
        title: "AI Car Inspector",
        description: "AI-powered web app analyzing car images to extract make, model, condition, and issues.",
        image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=640&h=360&fit=crop",
        tools: ["python", "google", "docker", "kubernetes"],
        github: "#",
        demo: "#"
    }
];

let currentIndex = 0;
let autoScrollInterval = null;

function createCoverFlow() {
    const coverflow = document.getElementById('coverflow');
    if (!coverflow) return;
    
    coverflow.innerHTML = '';

    projects.forEach((project, index) => {
        const item = document.createElement('div');
        item.className = 'cover-item';
        item.onclick = () => navigateToIndex(index);

        const toolIcons = project.tools.map(tool => 
            `<img src="https://cdn.simpleicons.org/${tool}/baff00" alt="${tool}" class="w-5 h-5" title="${tool}">`
        ).join('');

        item.innerHTML = `
            <div class="cover">
                <img src="${project.image}" alt="${project.title}" class="cover-image">
                <div class="cover-overlay"></div>
                <div class="absolute bottom-3 left-3 flex gap-2 z-10">
                    ${toolIcons}
                </div>
            </div>
            <div class="text-center mt-4">
                <div class="text-sm font-semibold uppercase text-brand-lime tracking-widest">
                    ${project.title}
                </div>
                <div class="cover-description text-xs text-gray-400 mt-1 px-2 transition-opacity duration-500 opacity-0">
                    ${project.description}
                </div>
                <div class="cover-links flex justify-center gap-3 mt-3 transition-opacity duration-500 opacity-0">
                    <a href="${project.github}" target="_blank" class="flex items-center gap-1 text-xs text-gray-400 hover:text-brand-lime transition">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                        GitHub
                    </a>
                    <a href="${project.demo}" target="_blank" class="flex items-center gap-1 text-xs text-gray-400 hover:text-brand-lime transition">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                        Live Demo
                    </a>
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
        const links = item.querySelector('.cover-links');

        const diff = index - currentIndex;

        if (diff === 0) {
            item.classList.add('center');
            // Fade in description and links for center item
            if (description) {
                description.classList.remove('opacity-0');
                description.classList.add('opacity-100');
            }
            if (links) {
                links.classList.remove('opacity-0');
                links.classList.add('opacity-100');
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

        // Fade out description and links for non-center items
        if (diff !== 0) {
            if (description) {
                description.classList.remove('opacity-100');
                description.classList.add('opacity-0');
            }
            if (links) {
                links.classList.remove('opacity-100');
                links.classList.add('opacity-0');
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

function initCoverflow() {
    const container = document.querySelector('.coverflow-container');
    if (!container) return;
    
    createCoverFlow();
    
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

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCoverflow);
} else {
    initCoverflow();
}
