import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

const Auth = () => {
  const { user, loading, openAuthModal } = useAuthStore();

  useEffect(() => {
    // If not logged in and not loading, open the auth modal
    if (!user && !loading) {
      openAuthModal();
    }
  }, [user, loading, openAuthModal]);

  // If already authenticated, redirect to home
  if (user) {
    return <Navigate to="/" replace />;
  }

  // If loading, show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to home where the auth modal will be opened
  return <Navigate to="/" replace />;
};

export default Auth;