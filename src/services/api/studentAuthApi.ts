import axios from 'axios';

// API Base URL
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Create an axios instance for student authentication
const studentApiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Request interceptor to add auth token
studentApiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('student_auth_token');
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
studentApiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token is invalid, clear it
            localStorage.removeItem('student_auth_token');
            localStorage.removeItem('student_user');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

// ==================== Types ====================

export interface StudentUser {
    id: number;
    name: string;
    email: string;
    full_name: string;
    role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN' | 'SUPER_ADMIN';
    bio?: string;
    avatar_url?: string;
    phone?: string;
    email_verified_at?: string;
    created_at: string;
    updated_at: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    password_confirmation: string;
    full_name: string;
    name: string; // username
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: StudentUser;
    token: string;
}

// ==================== Student Auth API Functions ====================

export const studentAuthApi = {
    // Register a new student
    async register(data: RegisterRequest): Promise<AuthResponse> {
        const response = await studentApiClient.post('/register', {
            ...data,
            role: 'STUDENT'
        });

        // Store token and user data
        localStorage.setItem('student_auth_token', response.data.token);
        localStorage.setItem('student_user', JSON.stringify(response.data.user));

        return response.data;
    },

    // Login student
    async login(data: LoginRequest): Promise<AuthResponse> {
        const response = await studentApiClient.post('/login', data);

        // Store token and user data
        localStorage.setItem('student_auth_token', response.data.token);
        localStorage.setItem('student_user', JSON.stringify(response.data.user));

        return response.data;
    },

    // Logout student
    async logout(): Promise<void> {
        try {
            await studentApiClient.post('/logout');
        } catch (error) {
            // Continue with logout even if API call fails
            console.error('Logout API error:', error);
        } finally {
            // Clear local storage
            localStorage.removeItem('student_auth_token');
            localStorage.removeItem('student_user');
        }
    },

    // Get current user
    async getCurrentUser(): Promise<StudentUser> {
        const response = await studentApiClient.get('/user');
        return response.data.user;
    },

    // Get stored user from localStorage
    getStoredUser(): StudentUser | null {
        const stored = localStorage.getItem('student_user');
        return stored ? JSON.parse(stored) : null;
    },

    // Check if user is authenticated
    isAuthenticated(): boolean {
        return !!localStorage.getItem('student_auth_token') && !!this.getStoredUser();
    },

    // Update user profile
    async updateProfile(data: Partial<StudentUser>): Promise<StudentUser> {
        const response = await studentApiClient.put('/user/profile', data);

        // Update stored user data
        localStorage.setItem('student_user', JSON.stringify(response.data.user));

        return response.data.user;
    },

    // Change password
    async changePassword(data: { current_password: string; password: string; password_confirmation: string }): Promise<void> {
        await studentApiClient.put('/user/change-password', data);
    }
};

export default studentAuthApi;