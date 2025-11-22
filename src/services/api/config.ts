import axios from 'axios';

// API Base URL - Uses environment variable or defaults to Railway production
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://ggtllmsapi-production.up.railway.app/api';

// Create axios instance with default config
export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: false, // Set to false for now, we're using Bearer tokens instead
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Handle specific error status codes
            switch (error.response.status) {
                case 401:
                    // Unauthorized - clear token and redirect to login
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('user');
                    window.location.href = '/management-portal/login';
                    break;
                case 403:
                    console.error('Forbidden: You do not have permission to access this resource');
                    break;
                case 404:
                    console.error('Resource not found');
                    break;
                case 422:
                    // Validation error - return validation messages
                    console.error('Validation Error:', error.response.data.errors);
                    break;
                case 500:
                    console.error('Server Error: Something went wrong on the server');
                    break;
            }
        }
        return Promise.reject(error);
    }
);
