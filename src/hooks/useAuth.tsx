import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useAuthStore } from '@/store/authStore';

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  role: 'STUDENT' | 'ADMIN' | 'SUPER_ADMIN' | 'INSTRUCTOR';
  email_verified: boolean;
  avatar_url?: string;
  bio?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, role?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string, roleFilter?: string[]) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
  isStudent: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { setUser: setStoreUser, setSession: setStoreSession, setLoading: setStoreLoading } = useAuthStore();

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data as UserProfile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        // Sync with auth store
        setStoreSession(session);
        setStoreUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer profile fetching to prevent deadlocks
          setTimeout(async () => {
            const profile = await fetchUserProfile(session.user.id);
            setUserProfile(profile);
            setLoading(false);
            setStoreLoading(false);
          }, 0);
        } else {
          setUserProfile(null);
          setLoading(false);
          setStoreLoading(false);
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      // Sync with auth store
      setStoreSession(session);
      setStoreUser(session?.user ?? null);
      
      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id);
        setUserProfile(profile);
      }
      setLoading(false);
      setStoreLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [setStoreUser, setStoreSession, setStoreLoading]);

  const signUp = async (email: string, password: string, fullName: string, role: string = 'STUDENT') => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
          role: role
        }
      }
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: error.message
      });
    } else {
      toast({
        title: "Check your email",
        description: "We've sent you a confirmation link to complete your registration."
      });
    }

    return { error };
  };

  const signIn = async (email: string, password: string, roleFilter?: string[]) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: error.message
      });
      return { error };
    }

    // Check role if roleFilter is provided
    if (roleFilter && data.user) {
      const profile = await fetchUserProfile(data.user.id);
      if (profile && !roleFilter.includes(profile.role)) {
        await supabase.auth.signOut();
        const roleError = new Error(`Access denied. This login is for ${roleFilter.join(' or ')} only.`);
        toast({
          variant: "destructive",
          title: "Access denied",
          description: roleError.message
        });
        return { error: roleError };
      }
    }

    toast({
      title: "Welcome back!",
      description: "You have successfully signed in."
    });

    return { error: null };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: error.message
      });
    } else {
      toast({
        title: "Signed out",
        description: "You have been successfully signed out."
      });
      // Force page refresh for clean state
      window.location.href = '/';
    }
  };

  const isAdmin = () => userProfile?.role === 'ADMIN' || userProfile?.role === 'SUPER_ADMIN';
  const isSuperAdmin = () => userProfile?.role === 'SUPER_ADMIN';
  const isStudent = () => userProfile?.role === 'STUDENT';

  return (
    <AuthContext.Provider value={{
      user,
      userProfile,
      session,
      loading,
      signUp,
      signIn,
      signOut,
      isAdmin,
      isSuperAdmin,
      isStudent
    }}>
      {children}
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