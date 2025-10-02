// API Configuration
const API_CONFIG = {
    BASE_URL: 'https://stylooutfit-backend.onrender.com/api',  // Production Backend URL
    ENDPOINTS: {
        REGISTER: '/auth/register',
        LOGIN: '/auth/login',
        GOOGLE_AUTH: '/auth/google',
        VERIFY_TOKEN: '/auth/verify',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password',
        USER_PROFILE: '/user/profile',
        UPDATE_PROFILE: '/user/profile'
    },
    TIMEOUT: 10000  // 10 seconds timeout
};

// Helper function to make API calls with timeout
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
        // Add timeout to prevent long waits
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
        options.signal = controller.signal;

        const response = await fetch(url, options);
        clearTimeout(timeoutId);
        
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'API request failed');
        }

        return result;
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Request timeout - please check your connection');
        }
        console.error('API Error:', error);
        throw error;
    }
}

// Export for use in other files
window.API_CONFIG = API_CONFIG;
window.apiCall = apiCall;
