// ============================================
// DASHBOARD PAGE JAVASCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    
    // Get user data from localStorage (set during login)
    const userData = JSON.parse(localStorage.getItem('styloUserData') || '{}');
    
    // Display user name
    const userNameElements = document.querySelectorAll('#userName, #userNameDisplay');
    if (userData.firstName) {
        userNameElements.forEach(el => {
            if (el.id === 'userName') {
                el.textContent = `${userData.firstName} ${userData.lastName || ''}`.trim();
            } else {
                el.textContent = userData.firstName;
            }
        });
    }

    // User Profile Dropdown Toggle
    const userProfileBtn = document.getElementById('userProfileBtn');
    const userProfileDropdown = document.querySelector('.user-profile-dropdown');
    
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

    // Logout Functionality
    const logoutBtn = document.getElementById('logoutBtn');
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

    // Like Button Toggle
    const likeButtons = document.querySelectorAll('.card-like-btn');
    likeButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Toggle liked state
            if (this.textContent === '❤️') {
                this.textContent = '💔';
                this.style.color = '#ef4444';
            } else {
                this.textContent = '❤️';
                this.style.color = '';
            }
        });
    });

    // Try On Avatar Buttons
    const tryOnButtons = document.querySelectorAll('.outfit-card .btn-primary');
    tryOnButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const outfitName = this.closest('.outfit-card').querySelector('h3').textContent;
            
            // In a real app, this would load the outfit on the avatar
            alert(`Loading "${outfitName}" on your avatar...`);
            
            // Redirect to avatar page
            setTimeout(() => {
                window.location.href = 'avatar.html';
            }, 1000);
        });
    });

    // Collection Items Click
    const collectionItems = document.querySelectorAll('.collection-item');
    collectionItems.forEach(item => {
        item.addEventListener('click', function() {
            const collectionName = this.querySelector('h4').textContent;
            alert(`Opening collection: ${collectionName}`);
            // In a real app, this would navigate to the collection page
        });
    });

    // Notification Button
    const notificationBtn = document.querySelector('.notification-btn');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function() {
            alert('Notifications:\n\n• New outfit recommendations available\n• Your avatar is ready\n• Special offer: 20% off styling service');
            // In a real app, this would open a notifications panel
        });
    }

    // Quick Action Buttons Analytics
    const quickActionBtns = document.querySelectorAll('.quick-action-btn');
    quickActionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const actionName = this.querySelector('span:last-child').textContent;
            console.log(`Quick action clicked: ${actionName}`);
            // In a real app, this would track analytics
        });
    });

    // Activity Items Click
    const activityItems = document.querySelectorAll('.activity-item');
    activityItems.forEach(item => {
        item.addEventListener('click', function() {
            const activityText = this.querySelector('.activity-text').textContent;
            console.log(`Activity clicked: ${activityText}`);
            // In a real app, this would show activity details
        });
    });

    // Add Event Button
    const addEventBtn = document.querySelector('.events-list + .btn-outline');
    if (addEventBtn) {
        addEventBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const eventName = prompt('Enter event name:');
            const eventDate = prompt('Enter event date (DD/MM/YYYY):');
            
            if (eventName && eventDate) {
                alert(`Event "${eventName}" added for ${eventDate}!\n\nWe'll send you outfit recommendations closer to the date.`);
                // In a real app, this would save the event to the backend
            }
        });
    }

    // Update Preferences Button
    const updatePrefsBtn = document.querySelector('.style-tags + .btn-outline');
    if (updatePrefsBtn) {
        updatePrefsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Opening style preferences...');
            // In a real app, this would open a preferences modal or page
        });
    }

    // Animate stats on page load
    animateStats();

    // Check if user is logged in
    checkAuthStatus();
});

// Animate stat numbers
function animateStats() {
    const statValues = document.querySelectorAll('.stat-value');
    
    statValues.forEach(stat => {
        const finalValue = stat.textContent;
        const isPercentage = finalValue.includes('%');
        const numericValue = parseInt(finalValue.replace(/\D/g, ''));
        
        if (!isNaN(numericValue)) {
            let currentValue = 0;
            const increment = Math.ceil(numericValue / 30);
            const duration = 1000; // 1 second
            const stepTime = duration / (numericValue / increment);
            
            const counter = setInterval(() => {
                currentValue += increment;
                if (currentValue >= numericValue) {
                    currentValue = numericValue;
                    clearInterval(counter);
                }
                stat.textContent = isPercentage ? `${currentValue}%` : currentValue;
            }, stepTime);
        }
    });
}

// Check if user is authenticated
function checkAuthStatus() {
    const userData = localStorage.getItem('styloUserData');
    const authToken = localStorage.getItem('styloAuthToken');
    
    // If no user data, redirect to auth page
    if (!userData || !authToken) {
        console.log('User not authenticated, redirecting to login...');
        // Uncomment the line below to enforce authentication
        // window.location.href = 'auth.html';
    }
}

// Helper function to format time ago
function timeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    
    return Math.floor(seconds) + " seconds ago";
}
