/* ==========================================================================
   Seward Mupereri Portfolio - Main JavaScript
   ========================================================================== */

let __main_inited = false;

/**
 * Typing Animation for Hero Section
 * Creates a typewriter effect for the name display
 */
function initTypingAnimation() {
    const name = "SEWARD\nMUPERERI";
    const typedElement = document.getElementById('typed-name');
    const cursorElement = document.getElementById('cursor');
    const greenDot = document.getElementById('green-dot');
    const statusText = document.getElementById('status-text');
    
    // Exit if elements don't exist
    if (!typedElement || !cursorElement) return;
    
    let charIndex = 0;

    // Show cursor immediately
    setTimeout(() => {
        cursorElement.style.opacity = '1';
        cursorElement.classList.add('animate-blink');
    }, 500);

    // Start typing after a short delay
    setTimeout(() => {
        function typeWriter() {
            if (charIndex < name.length) {
                if (name.charAt(charIndex) === '\n') {
                    typedElement.innerHTML += '<br>';
                } else {
                    typedElement.innerHTML += name.charAt(charIndex);
                }
                charIndex++;
                setTimeout(typeWriter, 80);
            } else {
                // Typing complete - hide cursor and show green dot
                setTimeout(() => {
                    cursorElement.style.opacity = '0';
                    cursorElement.classList.remove('animate-blink');
                    
                    // Show green dot with blink animation
                    if (greenDot) {
                        greenDot.style.opacity = '1';
                        greenDot.classList.add('animate-blink');
                    }
                    
                    // Fade in status text
                    if (statusText) {
                        statusText.style.transition = 'opacity 0.5s ease';
                        statusText.style.opacity = '1';
                    }
                }, 300);
            }
        }
        typeWriter();
    }, 800);
}

/**
 * Smooth Scroll for Anchor Links
 * Handles smooth scrolling when clicking navigation links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Close mobile menu if open
                const mobileMenu = document.getElementById('mobile-menu');
                const menuOverlay = document.getElementById('mobile-menu-overlay');
                const hamburger = document.getElementById('hamburger');
                
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    menuOverlay?.classList.remove('active');
                    hamburger?.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
                
                // Scroll to target with offset for fixed header
                const headerHeight = 80;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Scroll-based Header Styling
 * Adds/removes classes based on scroll position
 */
function initScrollHeader() {
    const header = document.querySelector('header');
    if (!header) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add shadow when scrolled
        if (currentScroll > 50) {
            header.classList.add('shadow-lg');
        } else {
            header.classList.remove('shadow-lg');
        }
        
        lastScroll = currentScroll;
    }, { passive: true });
}

/**
 * Intersection Observer for Scroll Animations
 * Triggers animations when elements come into view
 */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                entry.target.style.opacity = '1';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements with data-animate attribute
    document.querySelectorAll('[data-animate]').forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

/**
 * Active Navigation Link Highlighting
 * Highlights the current section in the navigation
 */
function initActiveNavHighlight() {
    const navLinks = document.querySelectorAll('nav a[href^="#"]:not([data-brand])');
    if (navLinks.length === 0) return;
    
    // Get unique target IDs from nav links
    const targetIds = [...new Set(Array.from(navLinks).map(link => link.getAttribute('href')))];
    
    // Find corresponding elements
    const sections = targetIds.map(id => document.querySelector(id)).filter(el => el);
    if (sections.length === 0) return;
    // Additional sections that should map to Expertise highlight
    const educationEl = document.querySelector('#education');
    const certificationsEl = document.querySelector('#certifications');
    
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.pageYOffset + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        // If we're in Education or Certifications, treat it as Expertise for nav highlight
        if (!current) {
            const inEducation = educationEl && scrollPosition >= educationEl.offsetTop && scrollPosition < (educationEl.offsetTop + educationEl.offsetHeight);
            const inCerts = certificationsEl && scrollPosition >= certificationsEl.offsetTop && scrollPosition < (certificationsEl.offsetTop + certificationsEl.offsetHeight);
            if (inEducation || inCerts) {
                current = 'expertise';
            }
        }
        
        navLinks.forEach(link => {
            link.classList.remove('text-brand-lime');
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('text-brand-lime');
                link.classList.add('active');
            }
        });
    }, { passive: true });
}

// Cross-page nav highlight for projects pages
function initProjectsPageNavActive() {
    const path = (window.location.pathname || '').toLowerCase();
    const isProjects = path.endsWith('/projects.html') || path.endsWith('projects.html');
    const isProjectDetail = path.endsWith('/project.html') || path.endsWith('project.html');
    if (!isProjects && !isProjectDetail) return;
    const projectsLink = document.querySelector('nav a[href="#work"], nav a[href="index.html#work"]');
    const contactSection = document.querySelector('#contact');
    const update = () => {
        let contactInView = false;
        if (contactSection) {
            const sectionTop = contactSection.offsetTop;
            const sectionHeight = contactSection.offsetHeight;
            const scrollPosition = window.pageYOffset + 100;
            contactInView = scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight;
        }
        if (projectsLink) {
            if (contactInView) {
                projectsLink.classList.remove('text-brand-lime', 'active');
            } else {
                projectsLink.classList.add('text-brand-lime', 'active');
            }
        }
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
}

function initCrossPageNavLinks() {
    const path = (window.location.pathname || '').toLowerCase();
    const isHome = path.endsWith('/') || path.endsWith('/index.html') || path.endsWith('index.html');
    if (isHome) return;
    const map = {
        '#hero': 'index.html#hero',
        '#about': 'index.html#about',
        '#expertise': 'index.html#expertise',
        '#work': 'index.html#work',
        '#experience': 'index.html#experience',
    };
    document.querySelectorAll('nav a[href^="#"]').forEach(a => {
        const h = a.getAttribute('href');
        if (map[h]) a.setAttribute('href', map[h]);
    });
}

/**
 * Certificate Modal Functions
 * Opens and closes the certificate image modal
 */
function openCertModal(imageSrc, title) {
    const modal = document.getElementById('certModal');
    const modalImage = document.getElementById('certModalImage');
    const modalTitle = document.getElementById('certModalTitle');
    
    if (modal && modalImage && modalTitle) {
        modalImage.src = imageSrc;
        modalImage.alt = title;
        modalTitle.textContent = title;
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
    }
}

function closeCertModal() {
    const modal = document.getElementById('certModal');
    
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = '';
    }
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeCertModal();
    }
});

/**
 * Hero Image Mouse Tracking & Floating Animation
 * Floats when not hovering, tilts based on mouse position when hovering
 */
function initHeroImageEffects() {
    const wrapper = document.getElementById('hero-image-wrapper');
    if (!wrapper) return;
    
    let isHovering = false;
    let mouseX = 0;
    let mouseY = 0;
    
    // Set up styles for smooth transitions
    wrapper.style.transition = 'transform 0.1s ease-out';
    wrapper.style.transformStyle = 'preserve-3d';
    
    // After slide-in animation completes, enable floating and clean up initial animation
    setTimeout(() => {
        wrapper.style.opacity = '1';
        wrapper.classList.remove('animate-slide-in-right'); // Prevent re-triggering slide-in
        if (!isHovering) {
            wrapper.classList.add('floating');
        }
    }, 3300); // 2.5s delay + 0.8s animation
    
    // Mouse enter - stop floating, enable tilt
    wrapper.addEventListener('mouseenter', () => {
        isHovering = true;
        wrapper.classList.remove('floating');
    });
    
    // Mouse leave - reset tilt, resume floating
    wrapper.addEventListener('mouseleave', () => {
        isHovering = false;
        mouseX = 0;
        mouseY = 0;
        wrapper.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        
        // Resume floating after transform resets
        setTimeout(() => {
            if (!isHovering) {
                wrapper.classList.add('floating');
            }
        }, 50);
    });
    
    // Mouse move - calculate tilt based on position
    wrapper.addEventListener('mousemove', (e) => {
        if (!isHovering) return;
        
        const rect = wrapper.getBoundingClientRect();
        // Calculate position relative to center (-1 to 1)
        mouseX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        mouseY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
        
        // Apply tilt (30 degrees max like in the React example)
        const rotateX = -mouseY * 30;
        const rotateY = mouseX * 30;
        
        wrapper.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
}

/**
 * Initialize all main functionality
 */
function init() {
    if (__main_inited) return;
    __main_inited = true;
    initTypingAnimation();
    initCrossPageNavLinks();
    initSmoothScroll();
    initScrollHeader();
    initScrollAnimations();
    initActiveNavHighlight();
    initProjectsPageNavActive();
    initHeroImageEffects();
}

function runMainInit() {
    const start = () => init();
    const hasIncludes = document.querySelector('[data-include]') !== null;
    if (!hasIncludes) {
        start();
        return;
    }
    if (window.__partialsReady) {
        start();
    } else {
        window.addEventListener('partials:ready', start, { once: true });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runMainInit);
} else {
    runMainInit();
}
