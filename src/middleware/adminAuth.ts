import { supabase } from '@/integrations/supabase/client';

export const isAdminOrSuperAdmin = async (): Promise<{ isAuthorized: boolean; error?: string }> => {
  try {
    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      return { isAuthorized: false, error: 'Session error' };
    }

    if (!session || !session.user) {
      return { isAuthorized: false, error: 'Not authenticated' };
    }

    // Get user profile to check role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', session.user.id)
      .single();

    if (profileError) {
      return { isAuthorized: false, error: 'Failed to fetch user profile' };
    }

    if (!profile) {
      return { isAuthorized: false, error: 'User profile not found' };
    }

    // Check if user has admin or super admin role
    const isAuthorized = profile.role === 'ADMIN' || profile.role === 'SUPER_ADMIN';
    
    return { 
      isAuthorized, 
      error: isAuthorized ? undefined : 'Insufficient permissions' 
    };
  } catch (error) {
    console.error('Admin auth check failed:', error);
    return { isAuthorized: false, error: 'Authentication check failed' };
  }
};

export const requireAdminAuth = async () => {
  const { isAuthorized, error } = await isAdminOrSuperAdmin();
  
  if (!isAuthorized) {
    throw new Error(error || 'Admin access required');
  }
  
  return true;
};