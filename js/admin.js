// ============================================
// ADMIN PANEL JAVASCRIPT
// ============================================

let currentSection = 'dashboard';
let allUsers = [];
let allImages = [];
let allOutfits = [];
let deleteCallback = null;

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initializeAdmin();
    setupEventListeners();
    loadDashboardData();
});

function initializeAdmin() {
    // Check if admin is logged in (for now, we'll use a simple check)
    const userData = JSON.parse(localStorage.getItem('styloUserData') || '{}');
    
    if (userData.firstName) {
        document.getElementById('adminName').textContent = userData.firstName;
    }
    
    // Load initial section
    showSection('dashboard');
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.admin-nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;
            showSection(section);
        });
    });

    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.admin-sidebar');
    menuToggle?.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    // Logout
    document.getElementById('adminLogout')?.addEventListener('click', handleLogout);

    // Refresh button
    document.getElementById('refreshBtn')?.addEventListener('click', () => {
        loadDashboardData();
        showNotification('Data refreshed!', 'success');
    });

    // Users section
    document.getElementById('userSearch')?.addEventListener('input', handleUserSearch);
    document.getElementById('exportUsers')?.addEventListener('click', exportUsersToCSV);

    // Images section
    document.getElementById('uploadImageBtn')?.addEventListener('click', () => openModal('uploadModal'));
    document.getElementById('closeUploadModal')?.addEventListener('click', () => closeModal('uploadModal'));
    document.getElementById('cancelUpload')?.addEventListener('click', () => closeModal('uploadModal'));
    document.getElementById('saveImage')?.addEventListener('click', handleSaveImage);
    document.getElementById('browseBtn')?.addEventListener('click', () => document.getElementById('imageInput').click());
    
    // Image upload drag and drop
    const uploadArea = document.getElementById('uploadArea');
    uploadArea?.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    uploadArea?.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    uploadArea?.addEventListener('drop', handleImageDrop);

    // Image categories
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            filterImages(e.target.dataset.category);
        });
    });

    // Outfits section
    document.getElementById('addOutfitBtn')?.addEventListener('click', () => openOutfitModal());
    document.getElementById('closeOutfitModal')?.addEventListener('click', () => closeModal('outfitModal'));
    document.getElementById('cancelOutfit')?.addEventListener('click', () => closeModal('outfitModal'));
    document.getElementById('saveOutfit')?.addEventListener('click', handleSaveOutfit);

    // Content tabs
    document.querySelectorAll('.content-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            const tabName = e.target.dataset.tab;
            switchContentTab(tabName);
        });
    });

    // Content save buttons
    document.getElementById('saveHeroContent')?.addEventListener('click', saveHeroContent);
    document.getElementById('saveStats')?.addEventListener('click', saveStats);
    document.getElementById('saveFooter')?.addEventListener('click', saveFooter);
    document.getElementById('addPromoSlide')?.addEventListener('click', addPromoSlide);

    // Settings
    document.getElementById('testConnection')?.addEventListener('click', testAPIConnection);
    document.getElementById('clearCache')?.addEventListener('click', clearCache);
    document.getElementById('backupData')?.addEventListener('click', backupData);
    document.getElementById('resetDemo')?.addEventListener('click', resetDemoData);

    // Delete modal
    document.getElementById('closeDeleteModal')?.addEventListener('click', () => closeModal('deleteModal'));
    document.getElementById('cancelDelete')?.addEventListener('click', () => closeModal('deleteModal'));
    document.getElementById('confirmDelete')?.addEventListener('click', handleConfirmDelete);
}

// ============================================
// NAVIGATION
// ============================================

function showSection(sectionName) {
    currentSection = sectionName;
    
    // Update nav links
    document.querySelectorAll('.admin-nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.section === sectionName) {
            link.classList.add('active');
        }
    });

    // Update sections
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(`section-${sectionName}`)?.classList.add('active');

    // Update page title
    const titles = {
        dashboard: 'Dashboard',
        users: 'Users Management',
        images: 'Image Gallery',
        outfits: 'Outfits Management',
        content: 'Website Content',
        settings: 'Settings'
    };
    document.getElementById('pageTitle').textContent = titles[sectionName] || 'Admin Panel';

    // Load section data
    loadSectionData(sectionName);
}

function loadSectionData(section) {
    switch(section) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'users':
            loadUsers();
            break;
        case 'images':
            loadImages();
            break;
        case 'outfits':
            loadOutfits();
            break;
        case 'content':
            loadContentData();
            break;
        case 'settings':
            loadSettings();
            break;
    }
}

// ============================================
// DASHBOARD
// ============================================

async function loadDashboardData() {
    try {
        // Load users to calculate stats
        const response = await apiCall('/user/all', 'GET', null, true);
        
        if (response.success) {
            allUsers = response.users;
            
            // Update stats
            document.getElementById('totalUsers').textContent = allUsers.length;
            
            // Count login methods
            const googleLogins = allUsers.filter(u => u.loginMethod === 'google').length;
            const manualLogins = allUsers.filter(u => u.loginMethod === 'manual').length;
            
            document.getElementById('googleLogins').textContent = googleLogins;
            document.getElementById('manualLogins').textContent = manualLogins;
            
            // Mock data for other stats
            document.getElementById('totalImages').textContent = '48';
            document.getElementById('totalOutfits').textContent = '156';
            document.getElementById('todayLogins').textContent = Math.floor(Math.random() * 20);
            document.getElementById('activeToday').textContent = Math.floor(allUsers.length * 0.3);
            
            // Load recent activity
            loadRecentActivity();
        }
    } catch (error) {
        console.error('Error loading dashboard:', error);
        showNotification('Failed to load dashboard data', 'error');
    }
}

function loadRecentActivity() {
    const activityList = document.getElementById('recentActivity');
    
    if (!allUsers.length) {
        activityList.innerHTML = '<p class="loading">No recent activity</p>';
        return;
    }

    // Generate mock activity from recent users
    const recentUsers = allUsers.slice(0, 5);
    const activities = recentUsers.map(user => {
        const timeAgo = getTimeAgo(new Date(user.createdAt));
        return `
            <div class="activity-item">
                <strong>${user.firstName} ${user.lastName}</strong> registered via ${user.loginMethod}
                <br><small>${timeAgo}</small>
            </div>
        `;
    }).join('');

    activityList.innerHTML = activities || '<p class="loading">No recent activity</p>';
}

// ============================================
// USERS MANAGEMENT
// ============================================

async function loadUsers() {
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '<tr><td colspan="6" class="loading">Loading users...</td></tr>';

    try {
        const response = await apiCall('/user/all', 'GET', null, true);
        
        if (response.success) {
            allUsers = response.users;
            displayUsers(allUsers);
        }
    } catch (error) {
        console.error('Error loading users:', error);
        tbody.innerHTML = '<tr><td colspan="6" class="loading">Failed to load users</td></tr>';
        showNotification('Failed to load users', 'error');
    }
}

function displayUsers(users) {
    const tbody = document.getElementById('usersTableBody');
    
    if (!users.length) {
        tbody.innerHTML = '<tr><td colspan="6" class="loading">No users found</td></tr>';
        return;
    }

    const rows = users.map((user, index) => {
        const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
        const joinDate = new Date(user.createdAt).toLocaleDateString();
        const loginBadge = user.loginMethod === 'google' 
            ? '<span class="badge badge-google">Google</span>'
            : '<span class="badge badge-manual">Manual</span>';

        return `
            <tr>
                <td>${index + 1}</td>
                <td>
                    <div class="user-info">
                        ${user.picture 
                            ? `<img src="${user.picture}" alt="${user.firstName}" class="user-avatar">`
                            : `<div class="user-avatar-placeholder">${initials}</div>`
                        }
                        <span>${user.firstName} ${user.lastName || ''}</span>
                    </div>
                </td>
                <td>${user.email}</td>
                <td>${loginBadge}</td>
                <td>${joinDate}</td>
                <td>
                    <button class="btn-action" onclick="viewUser('${user._id}')" title="View">👁️</button>
                    <button class="btn-action" onclick="deleteUser('${user._id}')" title="Delete">🗑️</button>
                </td>
            </tr>
        `;
    }).join('');

    tbody.innerHTML = rows;
}

function handleUserSearch(e) {
    const query = e.target.value.toLowerCase();
    const filtered = allUsers.filter(user => 
        user.firstName?.toLowerCase().includes(query) ||
        user.lastName?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query)
    );
    displayUsers(filtered);
}

function viewUser(userId) {
    const user = allUsers.find(u => u._id === userId);
    if (user) {
        alert(`User Details:\n\nName: ${user.firstName} ${user.lastName || ''}\nEmail: ${user.email}\nLogin Method: ${user.loginMethod}\nJoined: ${new Date(user.createdAt).toLocaleString()}`);
    }
}

function deleteUser(userId) {
    const user = allUsers.find(u => u._id === userId);
    if (user) {
        showDeleteConfirmation(
            `Are you sure you want to delete user "${user.firstName} ${user.lastName}"?`,
            () => {
                // In a real app, this would call the API
                allUsers = allUsers.filter(u => u._id !== userId);
                displayUsers(allUsers);
                showNotification('User deleted successfully', 'success');
            }
        );
    }
}

function exportUsersToCSV() {
    if (!allUsers.length) {
        showNotification('No users to export', 'warning');
        return;
    }

    const headers = ['Name', 'Email', 'Login Method', 'Joined Date'];
    const rows = allUsers.map(user => [
        `${user.firstName} ${user.lastName || ''}`,
        user.email,
        user.loginMethod,
        new Date(user.createdAt).toLocaleDateString()
    ]);

    let csv = headers.join(',') + '\n';
    csv += rows.map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_${Date.now()}.csv`;
    a.click();
    
    showNotification('Users exported successfully', 'success');
}

// ============================================
// IMAGES MANAGEMENT
// ============================================

function loadImages() {
    // Mock image data
    allImages = [
        { id: 1, url: 'https://picsum.photos/seed/img1/600/400', category: 'hero', alt: 'Hero Banner 1' },
        { id: 2, url: 'https://picsum.photos/seed/img2/600/400', category: 'outfits', alt: 'Outfit 1' },
        { id: 3, url: 'https://picsum.photos/seed/img3/600/400', category: 'gallery', alt: 'Gallery 1' },
        { id: 4, url: 'https://picsum.photos/seed/img4/600/400', category: 'promo', alt: 'Promo 1' },
        { id: 5, url: 'https://picsum.photos/seed/img5/600/400', category: 'hero', alt: 'Hero Banner 2' },
        { id: 6, url: 'https://picsum.photos/seed/img6/600/400', category: 'outfits', alt: 'Outfit 2' },
    ];

    displayImages(allImages);
}

function displayImages(images) {
    const grid = document.getElementById('imagesGrid');
    
    if (!images.length) {
        grid.innerHTML = '<p class="loading">No images found</p>';
        return;
    }

    const cards = images.map(img => `
        <div class="image-card">
            <img src="${img.url}" alt="${img.alt}" class="image-preview">
            <div class="image-info">
                <div class="image-title">${img.alt}</div>
                <div class="image-meta">Category: ${img.category}</div>
                <div class="image-actions">
                    <button class="btn btn-sm btn-outline" onclick="editImage(${img.id})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteImage(${img.id})">Delete</button>
                </div>
            </div>
        </div>
    `).join('');

    grid.innerHTML = cards;
}

function filterImages(category) {
    if (category === 'all') {
        displayImages(allImages);
    } else {
        const filtered = allImages.filter(img => img.category === category);
        displayImages(filtered);
    }
}

function handleImageDrop(e) {
    e.preventDefault();
    const uploadArea = document.getElementById('uploadArea');
    uploadArea.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        document.getElementById('imageInput').files = files;
        showNotification(`${files.length} file(s) selected`, 'success');
    }
}

function handleSaveImage() {
    const url = document.getElementById('imageUrl').value;
    const category = document.getElementById('imageCategory').value;
    const alt = document.getElementById('imageAlt').value;

    if (!url || !alt) {
        showNotification('Please fill all required fields', 'warning');
        return;
    }

    const newImage = {
        id: allImages.length + 1,
        url,
        category,
        alt
    };

    allImages.push(newImage);
    displayImages(allImages);
    closeModal('uploadModal');
    
    // Clear form
    document.getElementById('imageUrl').value = '';
    document.getElementById('imageAlt').value = '';
    
    showNotification('Image added successfully', 'success');
}

function editImage(id) {
    const image = allImages.find(img => img.id === id);
    if (image) {
        document.getElementById('imageUrl').value = image.url;
        document.getElementById('imageCategory').value = image.category;
        document.getElementById('imageAlt').value = image.alt;
        openModal('uploadModal');
    }
}

function deleteImage(id) {
    showDeleteConfirmation(
        'Are you sure you want to delete this image?',
        () => {
            allImages = allImages.filter(img => img.id !== id);
            displayImages(allImages);
            showNotification('Image deleted successfully', 'success');
        }
    );
}

// ============================================
// OUTFITS MANAGEMENT
// ============================================

function loadOutfits() {
    // Mock outfit data
    allOutfits = [
        { id: 1, name: 'Summer Casual Look', image: 'https://picsum.photos/seed/outfit1/400/600', category: 'casual', occasion: 'Weekend Brunch' },
        { id: 2, name: 'Business Professional', image: 'https://picsum.photos/seed/outfit2/400/600', category: 'formal', occasion: 'Office Meeting' },
        { id: 3, name: 'Evening Elegance', image: 'https://picsum.photos/seed/outfit3/400/600', category: 'party', occasion: 'Date Night' },
        { id: 4, name: 'Street Style', image: 'https://picsum.photos/seed/outfit4/400/600', category: 'casual', occasion: 'Casual Outing' },
    ];

    displayOutfits(allOutfits);
}

function displayOutfits(outfits) {
    const grid = document.getElementById('outfitsGrid');
    
    if (!outfits.length) {
        grid.innerHTML = '<p class="loading">No outfits found</p>';
        return;
    }

    const cards = outfits.map(outfit => `
        <div class="outfit-card-admin">
            <img src="${outfit.image}" alt="${outfit.name}" class="outfit-image-admin">
            <div class="outfit-details">
                <div class="outfit-name">${outfit.name}</div>
                <div class="outfit-category">${outfit.category}</div>
                <p style="font-size: 0.875rem; color: var(--admin-text-light); margin-bottom: 1rem;">
                    ${outfit.occasion}
                </p>
                <div class="outfit-actions">
                    <button class="btn btn-sm btn-outline" onclick="editOutfit(${outfit.id})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteOutfit(${outfit.id})">Delete</button>
                </div>
            </div>
        </div>
    `).join('');

    grid.innerHTML = cards;
}

function openOutfitModal(outfitId = null) {
    if (outfitId) {
        const outfit = allOutfits.find(o => o.id === outfitId);
        if (outfit) {
            document.getElementById('outfitModalTitle').textContent = 'Edit Outfit';
            document.getElementById('outfitName').value = outfit.name;
            document.getElementById('outfitImage').value = outfit.image;
            document.getElementById('outfitCategory').value = outfit.category;
            document.getElementById('outfitOccasion').value = outfit.occasion;
        }
    } else {
        document.getElementById('outfitModalTitle').textContent = 'Add New Outfit';
        document.getElementById('outfitName').value = '';
        document.getElementById('outfitImage').value = '';
        document.getElementById('outfitOccasion').value = '';
    }
    
    openModal('outfitModal');
}

function handleSaveOutfit() {
    const name = document.getElementById('outfitName').value;
    const image = document.getElementById('outfitImage').value;
    const category = document.getElementById('outfitCategory').value;
    const occasion = document.getElementById('outfitOccasion').value;

    if (!name || !image) {
        showNotification('Please fill all required fields', 'warning');
        return;
    }

    const newOutfit = {
        id: allOutfits.length + 1,
        name,
        image,
        category,
        occasion
    };

    allOutfits.push(newOutfit);
    displayOutfits(allOutfits);
    closeModal('outfitModal');
    showNotification('Outfit saved successfully', 'success');
}

function editOutfit(id) {
    openOutfitModal(id);
}

function deleteOutfit(id) {
    showDeleteConfirmation(
        'Are you sure you want to delete this outfit?',
        () => {
            allOutfits = allOutfits.filter(o => o.id !== id);
            displayOutfits(allOutfits);
            showNotification('Outfit deleted successfully', 'success');
        }
    );
}

// ============================================
// CONTENT MANAGEMENT
// ============================================

function loadContentData() {
    // Load existing content from localStorage or use defaults
    const savedContent = JSON.parse(localStorage.getItem('websiteContent') || '{}');
    
    // Hero content
    document.getElementById('heroBadge').value = savedContent.heroBadge || 'AI-Powered Styling';
    document.getElementById('heroTitle').value = savedContent.heroTitle || 'Your Personal Style Revolution';
    document.getElementById('heroSubtitle').value = savedContent.heroSubtitle || 'Discover your perfect style with our AI-powered outfit recommendations, curated by professional stylists just for you.';
    document.getElementById('heroCTA').value = savedContent.heroCTA || 'Create Your 3D Avatar & Try Outfits →';
    
    // Stats
    document.getElementById('statClients').value = savedContent.statClients || '10k+';
    document.getElementById('statOutfits').value = savedContent.statOutfits || '50k+';
    document.getElementById('statRating').value = savedContent.statRating || '4.9★';
    
    // Footer
    document.getElementById('footerText').value = savedContent.footerText || '© 2025 StyloOutfit. All rights reserved.';
}

function switchContentTab(tabName) {
    // Update tabs
    document.querySelectorAll('.content-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.tab === tabName) {
            tab.classList.add('active');
        }
    });

    // Update panels
    document.querySelectorAll('.content-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    document.getElementById(`panel-${tabName}`)?.classList.add('active');
}

function saveHeroContent() {
    const content = {
        heroBadge: document.getElementById('heroBadge').value,
        heroTitle: document.getElementById('heroTitle').value,
        heroSubtitle: document.getElementById('heroSubtitle').value,
        heroCTA: document.getElementById('heroCTA').value
    };

    const existing = JSON.parse(localStorage.getItem('websiteContent') || '{}');
    localStorage.setItem('websiteContent', JSON.stringify({...existing, ...content}));
    
    showNotification('Hero content saved successfully', 'success');
}

function saveStats() {
    const content = {
        statClients: document.getElementById('statClients').value,
        statOutfits: document.getElementById('statOutfits').value,
        statRating: document.getElementById('statRating').value
    };

    const existing = JSON.parse(localStorage.getItem('websiteContent') || '{}');
    localStorage.setItem('websiteContent', JSON.stringify({...existing, ...content}));
    
    showNotification('Stats saved successfully', 'success');
}

function saveFooter() {
    const content = {
        footerText: document.getElementById('footerText').value
    };

    const existing = JSON.parse(localStorage.getItem('websiteContent') || '{}');
    localStorage.setItem('websiteContent', JSON.stringify({...existing, ...content}));
    
    showNotification('Footer content saved successfully', 'success');
}

function addPromoSlide() {
    const url = prompt('Enter image URL for promo slide:');
    if (url) {
        showNotification('Promo slide added successfully', 'success');
    }
}

// ============================================
// SETTINGS
// ============================================

function loadSettings() {
    // Check API status
    testAPIConnection();
}

async function testAPIConnection() {
    const statusIndicator = document.getElementById('apiStatus');
    const statusText = document.getElementById('apiStatusText');
    
    statusText.textContent = 'Testing...';
    
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/auth/verify`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('styloAuthToken')}`
            }
        });
        
        if (response.ok) {
            statusIndicator.textContent = '🟢';
            statusText.textContent = 'Connected';
            showNotification('API connection successful', 'success');
        } else {
            throw new Error('Connection failed');
        }
    } catch (error) {
        statusIndicator.textContent = '🔴';
        statusText.textContent = 'Disconnected';
        showNotification('API connection failed', 'error');
    }
}

function clearCache() {
    if (confirm('Are you sure you want to clear all cached data?')) {
        localStorage.removeItem('websiteContent');
        showNotification('Cache cleared successfully', 'success');
    }
}

function backupData() {
    const backup = {
        users: allUsers,
        images: allImages,
        outfits: allOutfits,
        content: JSON.parse(localStorage.getItem('websiteContent') || '{}'),
        timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_${Date.now()}.json`;
    a.click();
    
    showNotification('Backup created successfully', 'success');
}

function resetDemoData() {
    if (confirm('⚠️ This will reset all demo data. Are you sure?')) {
        localStorage.removeItem('websiteContent');
        allImages = [];
        allOutfits = [];
        showNotification('Demo data reset successfully', 'success');
        loadDashboardData();
    }
}

// ============================================
// MODAL HELPERS
// ============================================

function openModal(modalId) {
    document.getElementById(modalId)?.classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId)?.classList.remove('active');
}

function showDeleteConfirmation(message, callback) {
    document.getElementById('deleteMessage').textContent = message;
    deleteCallback = callback;
    openModal('deleteModal');
}

function handleConfirmDelete() {
    if (deleteCallback) {
        deleteCallback();
        deleteCallback = null;
    }
    closeModal('deleteModal');
}

// ============================================
// UTILITIES
// ============================================

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('styloUserData');
        localStorage.removeItem('styloAuthToken');
        window.location.href = 'auth.html';
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#6366f1'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    
    return date.toLocaleDateString();
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
