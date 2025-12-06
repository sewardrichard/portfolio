/* ==========================================================================
   Seward Mupereri Portfolio - Mobile Menu JavaScript
   ========================================================================== */

/**
 * Mobile Menu Controller
 * Handles hamburger menu toggle, overlay, and accessibility
 */
let __mobile_inited = false;
class MobileMenu {
    constructor() {
        this.hamburger = document.getElementById('hamburger');
        this.mobileMenu = document.getElementById('mobile-menu');
        this.menuOverlay = document.getElementById('mobile-menu-overlay');
        this.closeBtn = document.getElementById('mobile-menu-close');
        this.menuLinks = document.querySelectorAll('.mobile-menu-nav a');
        
        this.isOpen = false;
        
        this.init();
    }
    
    init() {
        if (!this.hamburger || !this.mobileMenu) {
            console.warn('Mobile menu elements not found');
            return;
        }
        
        // Hamburger click
        this.hamburger.addEventListener('click', () => this.toggle());
        
        // Close button click
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }
        
        // Overlay click to close
        if (this.menuOverlay) {
            this.menuOverlay.addEventListener('click', () => this.close());
        }
        
        // Close on menu link click
        this.menuLinks.forEach(link => {
            link.addEventListener('click', () => this.close());
        });
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
        
        // Handle resize - close menu if window becomes large
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768 && this.isOpen) {
                this.close();
            }
        });
    }
    
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }
    
    open() {
        this.isOpen = true;
        this.hamburger.classList.add('active');
        this.mobileMenu.classList.add('active');
        
        if (this.menuOverlay) {
            this.menuOverlay.classList.add('active');
        }
        
        // Prevent body scroll
        document.body.classList.add('menu-open');
        
        // Set focus to close button for accessibility
        if (this.closeBtn) {
            setTimeout(() => this.closeBtn.focus(), 100);
        }
        
        // Trap focus within menu
        this.trapFocus();
    }
    
    close() {
        this.isOpen = false;
        this.hamburger.classList.remove('active');
        this.mobileMenu.classList.remove('active');
        
        if (this.menuOverlay) {
            this.menuOverlay.classList.remove('active');
        }
        
        // Restore body scroll
        document.body.classList.remove('menu-open');
        
        // Return focus to hamburger
        this.hamburger.focus();
    }
    
    trapFocus() {
        const focusableElements = this.mobileMenu.querySelectorAll(
            'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        this.mobileMenu.addEventListener('keydown', (e) => {
            if (e.key !== 'Tab') return;
            
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }
}

/**
 * Touch Swipe Detection for Mobile Menu
 * Allows swiping right to close the menu
 */
class SwipeHandler {
    constructor(element, onSwipeRight) {
        this.element = element;
        this.onSwipeRight = onSwipeRight;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.minSwipeDistance = 50;
        
        this.init();
    }
    
    init() {
        if (!this.element) return;
        
        this.element.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        this.element.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        }, { passive: true });
    }
    
    handleSwipe() {
        const swipeDistance = this.touchEndX - this.touchStartX;
        
        if (swipeDistance > this.minSwipeDistance) {
            // Swiped right
            if (this.onSwipeRight) {
                this.onSwipeRight();
            }
        }
    }
}

// Initialize mobile menu when DOM is ready
function initMobileMenu() {
    if (__mobile_inited) return;
    __mobile_inited = true;
    const mobileMenu = new MobileMenu();
    
    // Add swipe to close functionality
    const menuElement = document.getElementById('mobile-menu');
    if (menuElement) {
        new SwipeHandler(menuElement, () => mobileMenu.close());
    }
}

function runMobileInit() {
    const start = () => initMobileMenu();
    if (window.__partialsReady) {
        start();
    } else {
        window.addEventListener('partials:ready', start, { once: true });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runMobileInit);
} else {
    runMobileInit();
}
