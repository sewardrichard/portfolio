/* ==========================================================================
   Seward Mupereri Portfolio - Main JavaScript
   ========================================================================== */

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
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    if (sections.length === 0 || navLinks.length === 0) return;
    
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
        
        navLinks.forEach(link => {
            link.classList.remove('text-brand-lime');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('text-brand-lime');
            }
        });
    }, { passive: true });
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
 * Creates a 3D tilt effect based on mouse position + continuous floating
 */
function initHeroImageEffects() {
    const wrapper = document.getElementById('hero-image-wrapper');
    if (!wrapper) return;
    
    let isHovering = false;
    let currentRotateX = 0;
    let currentRotateY = 0;
    let targetRotateX = 0;
    let targetRotateY = 0;
    let floatOffset = 0;
    let startTime = null;
    let isActive = false;
    
    // After slide-in animation completes, start the combined animation
    setTimeout(() => {
        wrapper.style.opacity = '1';
        isActive = true;
        startTime = performance.now();
    }, 3300); // 2.5s delay + 0.8s animation
    
    // Mouse move handler for tilt effect
    wrapper.addEventListener('mouseenter', () => {
        isHovering = true;
    });
    
    wrapper.addEventListener('mouseleave', () => {
        isHovering = false;
        // Smoothly return to center rotation
        targetRotateX = 0;
        targetRotateY = 0;
    });
    
    wrapper.addEventListener('mousemove', (e) => {
        if (!isHovering) return;
        
        const rect = wrapper.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Calculate mouse position relative to center (-1 to 1)
        const mouseX = (e.clientX - centerX) / (rect.width / 2);
        const mouseY = (e.clientY - centerY) / (rect.height / 2);
        
        // Set target rotation (max 15 degrees)
        targetRotateY = mouseX * 15;
        targetRotateX = -mouseY * 15;
    });
    
    // Combined animation loop: floating + mouse tilt
    function animate(timestamp) {
        if (!isActive) {
            requestAnimationFrame(animate);
            return;
        }
        
        // Calculate floating offset (sine wave for smooth up/down)
        const elapsed = timestamp - startTime;
        floatOffset = Math.sin(elapsed / 1000) * 12; // 12px amplitude, 1 second period
        
        // Lerp rotation towards target
        currentRotateX += (targetRotateX - currentRotateX) * 0.1;
        currentRotateY += (targetRotateY - currentRotateY) * 0.1;
        
        // Combine floating + rotation
        wrapper.style.transform = `translateY(${floatOffset}px) rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`;
        
        requestAnimationFrame(animate);
    }
    
    requestAnimationFrame(animate);
}

/**
 * Initialize all main functionality
 */
function init() {
    initTypingAnimation();
    initSmoothScroll();
    initScrollHeader();
    initScrollAnimations();
    initActiveNavHighlight();
    initHeroImageEffects();
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
