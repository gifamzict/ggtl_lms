import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { toast } from 'sonner';
import { studentAuthApi, StudentUser } from '@/services/api/studentAuthApi';

interface StudentAuthContextType {
    user: StudentUser | null;
    loading: boolean;
    signUp: (username: string, fullName: string, email: string, password: string, passwordConfirmation: string) => Promise<{ error: Error | null }>;
    signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
    signOut: () => Promise<void>;
    isAuthenticated: boolean;
    updateProfile: (data: Partial<StudentUser>) => Promise<{ error: Error | null }>;
}

const StudentAuthContext = createContext<StudentAuthContextType | undefined>(undefined);

export function StudentAuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<StudentUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is already logged in
        const checkAuth = async () => {
            try {
                if (studentAuthApi.isAuthenticated()) {
                    const storedUser = studentAuthApi.getStoredUser();
                    if (storedUser) {
                        // Verify the token is still valid
                        const verifiedUser = await studentAuthApi.getCurrentUser();
                        setUser(verifiedUser);
                    }
                }
            } catch (error) {
                console.error('Auth verification failed:', error);
                // Clear invalid token
                localStorage.removeItem('student_auth_token');
                localStorage.removeItem('student_user');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const signUp = async (username: string, fullName: string, email: string, password: string, passwordConfirmation: string) => {
        try {
            setLoading(true);
            const response = await studentAuthApi.register({
                name: username,
                full_name: fullName,
                email,
                password,
                password_confirmation: passwordConfirmation,
            });

            setUser(response.user);
            toast.success('Account created successfully! Welcome to GGTL!');
            return { error: null };
        } catch (error: any) {
            console.error('Sign up error:', error);

            let errorMessage = 'Failed to create account. Please try again.';

            if (error.response?.data?.errors) {
                // Laravel validation errors
                const validationErrors = error.response.data.errors;
                const firstError = Object.values(validationErrors)[0] as string[];
                errorMessage = firstError[0];
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            toast.error(errorMessage);
            return { error: new Error(errorMessage) };
        } finally {
            setLoading(false);
        }
    };

    const signIn = async (email: string, password: string) => {
        try {
            setLoading(true);
            const response = await studentAuthApi.login({ email, password });

            setUser(response.user);
            toast.success(`Welcome back, ${response.user.full_name}!`);
            return { error: null };
        } catch (error: any) {
            console.error('Sign in error:', error);

            let errorMessage = 'Invalid email or password.';

            if (error.response?.data?.errors) {
                // Laravel validation errors
                const validationErrors = error.response.data.errors;
                const firstError = Object.values(validationErrors)[0] as string[];
                errorMessage = firstError[0];
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            toast.error(errorMessage);
            return { error: new Error(errorMessage) };
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        try {
            await studentAuthApi.logout();
            setUser(null);
            toast.success('Logged out successfully');
        } catch (error) {
            console.error('Sign out error:', error);
            // Still clear local state even if API call fails
            setUser(null);
        }
    };

    const updateProfile = async (data: Partial<StudentUser>) => {
        try {
            const updatedUser = await studentAuthApi.updateProfile(data);
            setUser(updatedUser);
            toast.success('Profile updated successfully');
            return { error: null };
        } catch (error: any) {
            console.error('Update profile error:', error);

            let errorMessage = 'Failed to update profile.';

            if (error.response?.data?.errors) {
                const validationErrors = error.response.data.errors;
                const firstError = Object.values(validationErrors)[0] as string[];
                errorMessage = firstError[0];
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            toast.error(errorMessage);
            return { error: new Error(errorMessage) };
        }
    };

    const value: StudentAuthContextType = {
        user,
        loading,
        signUp,
        signIn,
        signOut,
        isAuthenticated: !!user,
        updateProfile,
    };

    return (
        <StudentAuthContext.Provider value= { value } >
        { children }
        </StudentAuthContext.Provider>
    );
}

export function useStudentAuth() {
    const context = useContext(StudentAuthContext);
    if (context === undefined) {
        throw new Error('useStudentAuth must be used within a StudentAuthProvider');
    }
    return context;
}