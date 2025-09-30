// ============================================
// MOBILE HAMBURGER MENU - Side Panel Navigation
// ============================================

(function() {
    'use strict';

    // Create mobile menu elements
    function createMobileMenu() {
        // Check if mobile menu already exists
        if (document.querySelector('.mobile-nav-panel')) return;

        // Get current page for active state
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'mobile-nav-overlay';
        overlay.id = 'mobileNavOverlay';

        // Create mobile nav panel
        const panel = document.createElement('div');
        panel.className = 'mobile-nav-panel';
        panel.id = 'mobileNavPanel';
        panel.innerHTML = `
            <div class="mobile-nav-header">
                <a href="index.html" class="logo" aria-label="StyloOutfit Home">
                    <img src="./assets/images/STYLOOUTFIT.svg" alt="StyloOutfit Logo"/>
                </a>
                <button class="mobile-nav-close" id="mobileNavClose" aria-label="Close menu">×</button>
            </div>
            <nav class="mobile-nav-links" aria-label="Mobile Navigation">
                <a href="index.html" ${currentPage === 'index.html' ? 'aria-current="page"' : ''}>
                    <span class="nav-icon">🏠</span>
                    Home
                </a>
                <a href="avatar.html" ${currentPage === 'avatar.html' ? 'aria-current="page"' : ''}>
                    <span class="nav-icon">👤</span>
                    Create Avatar
                </a>
                <a href="outfit.html" ${currentPage === 'outfit.html' ? 'aria-current="page"' : ''}>
                    <span class="nav-icon">👔</span>
                    Try Outfits
                </a>
                <a href="services.html" ${currentPage === 'services.html' ? 'aria-current="page"' : ''}>
                    <span class="nav-icon">✨</span>
                    Services
                </a>
                <a href="about.html" ${currentPage === 'about.html' ? 'aria-current="page"' : ''}>
                    <span class="nav-icon">ℹ️</span>
                    About
                </a>
            </nav>
            <div class="mobile-nav-cta">
                <a href="auth.html" class="nav-cta">Get Started</a>
            </div>
        `;

        // Append to body
        document.body.appendChild(overlay);
        document.body.appendChild(panel);

        // Create hamburger button
        createHamburgerButton();
    }

    // Create hamburger button in header
    function createHamburgerButton() {
        const headerInner = document.querySelector('.header-inner');
        if (!headerInner) return;

        // Check if hamburger already exists
        if (document.querySelector('.hamburger-btn')) return;

        const hamburger = document.createElement('button');
        hamburger.className = 'hamburger-btn';
        hamburger.id = 'hamburgerBtn';
        hamburger.setAttribute('aria-label', 'Open menu');
        hamburger.innerHTML = `
            <div class="hamburger-icon">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;

        // Insert hamburger before logo
        const logo = headerInner.querySelector('.logo');
        if (logo) {
            headerInner.insertBefore(hamburger, logo);
        }
    }

    // Toggle mobile menu
    function toggleMobileMenu(open) {
        const panel = document.getElementById('mobileNavPanel');
        const overlay = document.getElementById('mobileNavOverlay');
        const hamburger = document.getElementById('hamburgerBtn');

        if (open) {
            panel.classList.add('active');
            overlay.classList.add('active');
            hamburger.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        } else {
            panel.classList.remove('active');
            overlay.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }
    }

    // Setup event listeners
    function setupEventListeners() {
        // Hamburger button click
        document.addEventListener('click', function(e) {
            if (e.target.closest('#hamburgerBtn')) {
                toggleMobileMenu(true);
            }
        });

        // Close button click
        document.addEventListener('click', function(e) {
            if (e.target.closest('#mobileNavClose')) {
                toggleMobileMenu(false);
            }
        });

        // Overlay click
        document.addEventListener('click', function(e) {
            if (e.target.id === 'mobileNavOverlay') {
                toggleMobileMenu(false);
            }
        });

        // Close menu when clicking a link
        document.addEventListener('click', function(e) {
            if (e.target.closest('.mobile-nav-links a')) {
                toggleMobileMenu(false);
            }
        });

        // Close menu on ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                toggleMobileMenu(false);
            }
        });

        // Close menu when window is resized to desktop
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                toggleMobileMenu(false);
            }
        });
    }

    // Initialize
    function init() {
        createMobileMenu();
        setupEventListeners();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose toggle function globally if needed
    window.toggleMobileMenu = toggleMobileMenu;
})();
