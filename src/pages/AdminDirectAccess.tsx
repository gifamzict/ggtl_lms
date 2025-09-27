import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';

export default function AdminDirectAccess() {
  const { user, userProfile, loading, isAdmin, isSuperAdmin } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading admin access...</p>
        </div>
      </div>
    );
  }

  console.log('AdminDirectAccess - Auth Status:', {
    user: user?.id,
    userProfile: userProfile?.role,
    isAdmin: isAdmin(),
    isSuperAdmin: isSuperAdmin(),
    loading
  });

  // If user is admin, show dashboard directly
  if (user && userProfile && (isAdmin() || isSuperAdmin())) {
    return <AdminDashboard />;
  }

  // If not admin, show test info and login option
  return (
    <div className="min-h-screen p-8 bg-background">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Admin Direct Access - Debug Mode</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-800">Admin Credentials for Testing:</h3>
            <p className="text-yellow-700">Email: ggtltechmail@gmail.com</p>
            <p className="text-yellow-700">Role: SUPER_ADMIN</p>
            <p className="text-yellow-700">Status: Email Confirmed</p>
          </div>
          
          <div>
            <h3 className="font-semibold">Current User Info:</h3>
            <p>ID: {user?.id || 'Not logged in'}</p>
            <p>Email: {user?.email || 'No email'}</p>
          </div>
          
          <div>
            <h3 className="font-semibold">Profile Info:</h3>
            <p>Role: {userProfile?.role || 'No role'}</p>
            <p>Full Name: {userProfile?.full_name || 'No name'}</p>
          </div>
          
          <div>
            <h3 className="font-semibold">Auth Status:</h3>
            <p>Is Admin: {isAdmin() ? 'Yes' : 'No'}</p>
            <p>Is Super Admin: {isSuperAdmin() ? 'Yes' : 'No'}</p>
          </div>

          <div className="space-x-4">
            <Button onClick={() => navigate('/admin/login')}>
              Go to Admin Login
            </Button>
            <Button onClick={() => navigate('/admin')}>
              Try Admin Dashboard
            </Button>
            <Button onClick={() => navigate('/admin-test')}>
              Go to Admin Test
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}