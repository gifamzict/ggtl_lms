import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { toast } from '@/components/ui/use-toast';
import { adminApi, User as LaravelUser } from '@/services/api/adminApi';

interface AuthContextType {
    user: LaravelUser | null;
    loading: boolean;
    signUp: (email: string, password: string, fullName: string, role?: string) => Promise<{ error: Error | null }>;
    signIn: (email: string, password: string, roleFilter?: string[]) => Promise<{ error: Error | null }>;
    signOut: () => Promise<void>;
    isAdmin: () => boolean;
    isSuperAdmin: () => boolean;
    isStudent: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<LaravelUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is already logged in
        const checkAuth = async () => {
            const storedUser = adminApi.auth.getCurrentUser();
            if (storedUser) {
                try {
                    // Verify the token is still valid
                    const verifiedUser = await adminApi.auth.verifyAdmin();
                    setUser(verifiedUser);
                } catch (error) {
                    // Token is invalid, clear it
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('user');
                    setUser(null);
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const signUp = async (email: string, password: string, fullName: string, role: string = 'STUDENT') => {
        try {
            // TODO: Implement registration endpoint in Laravel if needed
            // For now, only admins can create users through the admin panel
            const error = new Error('Registration is currently disabled. Please contact an administrator.');
            toast({
                variant: "destructive",
                title: "Registration disabled",
                description: error.message
            });
            return { error };
        } catch (error) {
            const err = error as Error;
            toast({
                variant: "destructive",
                title: "Sign up failed",
                description: err.message
            });
            return { error: err };
        }
    };

    const signIn = async (email: string, password: string, roleFilter?: string[]) => {
        console.log('signIn called with:', { email, roleFilter });

        try {
            const { user: loggedInUser } = await adminApi.auth.login(email, password);
            console.log('Laravel auth response:', loggedInUser);

            // Check role if roleFilter is provided
            if (roleFilter && loggedInUser) {
                console.log('Checking role for user:', loggedInUser.id, 'Role:', loggedInUser.role);

                if (!roleFilter.includes(loggedInUser.role)) {
                    console.log('Role mismatch. User role:', loggedInUser.role, 'Required roles:', roleFilter);
                    await adminApi.auth.logout();
                    const roleError = new Error(`Access denied. This login is for ${roleFilter.join(' or ')} only.`);
                    toast({
                        variant: "destructive",
                        title: "Access denied",
                        description: roleError.message
                    });
                    return { error: roleError };
                }
            }

            setUser(loggedInUser);

            toast({
                title: "Welcome back!",
                description: "You have successfully signed in."
            });

            console.log('Sign in successful');
            return { error: null };
        } catch (error: any) {
            console.error('Laravel auth error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Sign in failed';
            toast({
                variant: "destructive",
                title: "Sign in failed",
                description: errorMessage
            });
            return { error: new Error(errorMessage) };
        }
    };

    const signOut = async () => {
        try {
            await adminApi.auth.logout();
            setUser(null);
            toast({
                title: "Signed out",
                description: "You have been successfully signed out."
            });
            // Force page refresh for clean state
            window.location.href = '/';
        } catch (error: any) {
            console.error('Sign out error:', error);
            // Even if the API call fails, clear local data
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            setUser(null);
            toast({
                title: "Signed out",
                description: "You have been signed out locally."
            });
            window.location.href = '/';
        }
    };

    const isAdmin = () => user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
    const isSuperAdmin = () => user?.role === 'SUPER_ADMIN';
    const isStudent = () => user?.role === 'STUDENT';

    return (
        <AuthContext.Provider value= {{
        user,
            loading,
            signUp,
            signIn,
            signOut,
            isAdmin,
            isSuperAdmin,
            isStudent
    }
}>
    { children }
    </AuthContext.Provider>
  );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
