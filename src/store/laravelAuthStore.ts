import { create } from 'zustand';

export interface LaravelUser {
    id: number;
    name: string;
    email: string;
    full_name: string;
    role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN' | 'SUPER_ADMIN';
    email_verified_at?: string | null;
    bio?: string;
    avatar_url?: string;
    phone?: string;
    created_at: string;
    updated_at: string;
}

interface LaravelAuthState {
    user: LaravelUser | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    isAuthModalOpen: boolean;

    // Actions
    setUser: (user: LaravelUser | null) => void;
    setToken: (token: string | null) => void;
    setLoading: (loading: boolean) => void;
    login: (user: LaravelUser, token: string) => void;
    logout: () => void;
    openAuthModal: () => void;
    closeAuthModal: () => void;
}

export const useLaravelAuth = create<LaravelAuthState>((set, get) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    isAuthModalOpen: false,

    setUser: (user) => set({
        user,
        isAuthenticated: !!user
    }),

    setToken: (token) => set({ token }),

    setLoading: (loading) => set({ loading }),

    login: (user, token) => {
        set({
            user,
            token,
            isAuthenticated: true,
            isAuthModalOpen: false
        });

        // Store token in localStorage for API calls
        if (token) {
            localStorage.setItem('auth_token', token);
        }
    },

    logout: () => {
        set({
            user: null,
            token: null,
            isAuthenticated: false
        });

        // Remove token from localStorage
        localStorage.removeItem('auth_token');
    },

    openAuthModal: () => set({ isAuthModalOpen: true }),
    closeAuthModal: () => set({ isAuthModalOpen: false }),
}));