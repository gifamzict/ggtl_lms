import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function AdminTest() {
  const { user, userProfile, loading, isAdmin, isSuperAdmin } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Admin Authentication Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">User Info:</h3>
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
              Go to Admin Dashboard
            </Button>
            <Button onClick={() => navigate('/')}>
              Go to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}