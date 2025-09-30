// ============================================
// AUTH STATE MANAGER - Global Authentication State
// ============================================

(function() {
    'use strict';

    // Check if user is logged in
    function isUserLoggedIn() {
        const userData = localStorage.getItem('styloUserData');
        const authToken = localStorage.getItem('styloAuthToken');
        return !!(userData && authToken);
    }

    // Get user data
    function getUserData() {
        try {
            const userData = localStorage.getItem('styloUserData');
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('Error parsing user data:', error);
            return null;
        }
    }

    // Update header based on auth state
    function updateHeader() {
        const headerInner = document.querySelector('.header-inner');
        if (!headerInner) return;

        // Find or create the auth container (right side of header)
        let authContainer = headerInner.querySelector('.header-auth-container');
        
        if (!authContainer) {
            // If it doesn't exist, find the nav-cta and replace it
            const navCta = headerInner.querySelector('.nav-cta');
            if (navCta) {
                authContainer = document.createElement('div');
                authContainer.className = 'header-auth-container';
                navCta.parentNode.replaceChild(authContainer, navCta);
            } else {
                // Create and append if nothing exists
                authContainer = document.createElement('div');
                authContainer.className = 'header-auth-container';
                headerInner.appendChild(authContainer);
            }
        }

        if (isUserLoggedIn()) {
            const userData = getUserData();
            const firstName = userData?.firstName || 'User';
            const userImage = userData?.picture || 'https://i.pravatar.cc/150?img=12';
            
            // Show user menu
            authContainer.innerHTML = `
                <div class="user-menu">
                    <button class="notification-btn" aria-label="Notifications">
                        <span class="notification-icon">🔔</span>
                        <span class="notification-badge">3</span>
                    </button>
                    <div class="user-profile-dropdown">
                        <button class="user-profile-btn" id="userProfileBtn">
                            <img src="${userImage}" alt="User Avatar" class="user-avatar" />
                            <span class="user-name" id="userName">${firstName}</span>
                            <span class="dropdown-arrow">▼</span>
                        </button>
                        <div class="dropdown-menu" id="dropdownMenu">
                            <a href="dashboard.html" class="dropdown-item">
                                <span class="item-icon">📊</span>
                                Dashboard
                            </a>
                            <a href="avatar.html" class="dropdown-item">
                                <span class="item-icon">👤</span>
                                My Avatar
                            </a>
                            <a href="outfit.html" class="dropdown-item">
                                <span class="item-icon">👔</span>
                                My Outfits
                            </a>
                            <hr class="dropdown-divider" />
                            <a href="#" class="dropdown-item" id="logoutBtn">
                                <span class="item-icon">🚪</span>
                                Logout
                            </a>
                        </div>
                    </div>
                </div>
            `;

            // Add event listeners after creating the elements
            setTimeout(() => {
                setupUserMenuListeners();
            }, 0);
        } else {
            // Show "Get Started" button
            authContainer.innerHTML = `
                <a href="auth.html" class="nav-cta">Get Started</a>
            `;
        }
    }

    // Setup user menu event listeners
    function setupUserMenuListeners() {
        const userProfileBtn = document.getElementById('userProfileBtn');
        const userProfileDropdown = document.querySelector('.user-profile-dropdown');
        const logoutBtn = document.getElementById('logoutBtn');
        const notificationBtn = document.querySelector('.notification-btn');

        // User Profile Dropdown Toggle
        if (userProfileBtn && userProfileDropdown) {
            userProfileBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                userProfileDropdown.classList.toggle('active');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!userProfileDropdown.contains(e.target)) {
                    userProfileDropdown.classList.remove('active');
                }
            });
        }

        // Logout functionality
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Clear user data
                localStorage.removeItem('styloUserData');
                localStorage.removeItem('styloAuthToken');
                
                // Show logout message
                alert('You have been logged out successfully!');
                
                // Redirect to home page
                window.location.href = 'index.html';
            });
        }

        // Notification button
        if (notificationBtn) {
            notificationBtn.addEventListener('click', function() {
                alert('Notifications:\n\n• New outfit recommendations available\n• Your avatar is ready\n• Special offer: 20% off styling service');
            });
        }
    }

    // Initialize on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateHeader);
    } else {
        updateHeader();
    }

    // Expose functions globally if needed
    window.StyloAuth = {
        isLoggedIn: isUserLoggedIn,
        getUserData: getUserData,
        updateHeader: updateHeader
    };
})();
