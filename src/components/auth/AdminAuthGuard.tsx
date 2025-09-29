import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const { user, userProfile, loading, isAdmin } = useAuth();
  const location = useLocation();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Wait for auth to finish loading
    if (!loading) {
      setIsCheckingAuth(false);
    }
  }, [loading]);

  // Show loading spinner while checking authentication
  if (loading || isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Debug logging
  console.log('AdminAuthGuard Debug:', {
    user: user?.id,
    userProfile: userProfile?.role,
    isAdminResult: isAdmin(),
    loading,
    userEmail: user?.email
  });

  // Check if user is authenticated and has admin privileges
  if (!user || !userProfile || !isAdmin()) {
    console.log('AdminAuthGuard: Redirecting to login - insufficient privileges');
    // Store the intended destination for redirect after login
    const redirectTo = location.pathname + location.search;
    return (
      <Navigate 
        to={`/management-portal/login?redirect=${encodeURIComponent(redirectTo)}`} 
        replace 
      />
    );
  }

  console.log('AdminAuthGuard: Access granted to admin user');
  // User is authenticated and authorized - render the protected content
  return <>{children}</>;
}