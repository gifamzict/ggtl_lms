import { useState, useEffect } from 'react';
import { Plus, Shield, Trash2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

interface AdminUser {
  id: string;
  user_id: string;
  full_name: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
  created_at: string;
  email?: string;
}

export default function ManageAdmins() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newAdminData, setNewAdminData] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'ADMIN' as 'ADMIN' | 'SUPER_ADMIN'
  });
  const [addingAdmin, setAddingAdmin] = useState(false);
  const { isSuperAdmin, signUp } = useAuth();

  const fetchAdmins = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .in('role', ['ADMIN', 'SUPER_ADMIN'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAdmins((data || []).filter(user => user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') as AdminUser[]);
    } catch (error) {
      console.error('Error fetching admins:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load admin users."
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingAdmin(true);

    try {
      const { error } = await signUp(
        newAdminData.email,
        newAdminData.password,
        newAdminData.fullName,
        newAdminData.role
      );

      if (!error) {
        toast({
          title: "Admin added successfully",
          description: "The new admin account has been created."
        });
        setIsAddModalOpen(false);
        setNewAdminData({ email: '', password: '', fullName: '', role: 'ADMIN' });
        fetchAdmins();
      }
    } catch (error) {
      console.error('Error adding admin:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create admin account."
      });
    } finally {
      setAddingAdmin(false);
    }
  };

  if (!isSuperAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 mx-auto text-destructive" />
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              You need Super Admin privileges to access this page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Manage Administrators</h1>
                <p className="text-muted-foreground mt-2">
                  Add and manage administrator accounts
                </p>
              </div>
              
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add New Admin
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Administrator</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddAdmin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={newAdminData.fullName}
                        onChange={(e) => setNewAdminData(prev => ({ ...prev, fullName: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newAdminData.email}
                        onChange={(e) => setNewAdminData(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={newAdminData.password}
                        onChange={(e) => setNewAdminData(prev => ({ ...prev, password: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select value={newAdminData.role} onValueChange={(value: 'ADMIN' | 'SUPER_ADMIN') => setNewAdminData(prev => ({ ...prev, role: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                          <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button type="submit" disabled={addingAdmin}>
                        {addingAdmin ? 'Adding...' : 'Add Admin'}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Administrator Accounts ({admins.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-muted-foreground">Loading administrators...</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {admins.map((admin) => (
                        <TableRow key={admin.id}>
                          <TableCell className="font-medium">
                            {admin.full_name}
                          </TableCell>
                          <TableCell>
                            <Badge variant={admin.role === 'SUPER_ADMIN' ? 'default' : 'secondary'}>
                              {admin.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(admin.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}