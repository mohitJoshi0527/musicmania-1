const API_BASE = '/api';

export const authFetch = async (url, options = {}) => {
    const token = localStorage.getItem('token');
    
    const headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`
    };

    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_BASE}${url}`, {
        ...options,
        headers
    });

    if (response.status === 401) {
        // Handle token expiration
        window.location.href = '/login';
    }

    return response;
};