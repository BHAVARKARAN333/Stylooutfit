// API Configuration
const API_CONFIG = {
    BASE_URL: 'https://stylooutfit-backend.onrender.com/api',  // Production Backend URL
    ENDPOINTS: {
        REGISTER: '/auth/register',
        LOGIN: '/auth/login',
        GOOGLE_AUTH: '/auth/google',
        VERIFY_TOKEN: '/auth/verify',
        USER_PROFILE: '/user/profile',
        UPDATE_PROFILE: '/user/profile'
    }
};

// Helper function to make API calls
async function apiCall(endpoint, method = 'GET', data = null, requiresAuth = false) {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    
    const headers = {
        'Content-Type': 'application/json'
    };

    // Add authorization token if required
    if (requiresAuth) {
        const token = localStorage.getItem('styloAuthToken');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    const options = {
        method,
        headers
    };

    if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'API request failed');
        }

        return result;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Export for use in other files
window.API_CONFIG = API_CONFIG;
window.apiCall = apiCall;
