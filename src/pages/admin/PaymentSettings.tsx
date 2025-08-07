import { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Key, CreditCard } from 'lucide-react';

interface PaymentSettings {
  public_key: string;
  secret_key: string;
  is_active: boolean;
}

const PaymentSettings = () => {
  const [settings, setSettings] = useState<PaymentSettings>({
    public_key: '',
    secret_key: '',
    is_active: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-payment-settings', {
        method: 'GET'
      });

      if (error) throw error;

      setSettings(data);
    } catch (error) {
      console.error('Error fetching payment settings:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch payment settings"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      console.log('=== STARTING SAVE PROCESS ===');
      console.log('Settings to save:', settings);
      
      const session = await supabase.auth.getSession();
      console.log('Current session:', session);
      console.log('User ID:', session.data.session?.user?.id);
      console.log('Access token present:', !!session.data.session?.access_token);
      
      // Check user role
      if (session.data.session?.user?.id) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', session.data.session.user.id)
          .single();
        console.log('User profile:', profile);
        console.log('Profile error:', profileError);
      }
      
      console.log('=== INVOKING EDGE FUNCTION ===');
      console.log('Function name: admin-payment-settings');
      console.log('Method: PUT');
      console.log('Body:', settings);
      
      const { data, error } = await supabase.functions.invoke('admin-payment-settings', {
        method: 'PUT',
        body: settings,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.data.session?.access_token}`
        }
      });

      console.log('=== EDGE FUNCTION RESPONSE ===');
      console.log('Raw response data:', data);
      console.log('Raw response error:', error);
      console.log('Error type:', typeof error);
      console.log('Error properties:', error ? Object.keys(error) : 'No error object');

      if (error) {
        console.error('=== FUNCTION INVOKE ERROR ===');
        console.error('Error object:', error);
        console.error('Error message:', error.message);
        console.error('Error context:', error.context);
        console.error('Error details:', error.details);
        throw error;
      }

      // Check if the response indicates an error
      if (data && data.error) {
        console.error('=== FUNCTION RETURNED ERROR ===');
        console.error('Function error:', data.error);
        throw new Error(data.error);
      }

      console.log('=== SUCCESS ===');
      toast({
        title: "Success",
        description: "Payment settings saved successfully"
      });
    } catch (error) {
      console.error('=== CATCH BLOCK ===');
      console.error('Full error object:', error);
      console.error('Error constructor:', error.constructor.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      console.error('Error cause:', error.cause);
      
      let errorMessage = "Failed to save payment settings";
      if (error.message) {
        errorMessage += `: ${error.message}`;
      }
      
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof PaymentSettings, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AdminSidebar />
          <div className="flex-1">
            <AdminHeader title="Payment Settings" />
            <main className="flex-1 p-6">
              <div className="flex items-center justify-center min-h-96">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        <div className="flex-1">
          <AdminHeader title="Payment Settings" />
          <main className="flex-1 p-6">
            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <h1 className="text-3xl font-bold">Payment Settings</h1>
                <p className="text-muted-foreground">
                  Configure Paystack payment gateway for course purchases
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Paystack Configuration
                  </CardTitle>
                  <CardDescription>
                    Configure your Paystack API keys to enable course purchases. 
                    Get your keys from the Paystack Dashboard.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="public_key">Public Key</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="public_key"
                        placeholder="pk_test_..."
                        value={settings.public_key}
                        onChange={(e) => handleInputChange('public_key', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Your Paystack public key (safe to expose in frontend)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secret_key">Secret Key</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="secret_key"
                        type="password"
                        placeholder="sk_test_..."
                        value={settings.secret_key}
                        onChange={(e) => handleInputChange('secret_key', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Your Paystack secret key (encrypted and stored securely)
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={settings.is_active}
                      onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                    />
                    <Label htmlFor="is_active">Enable Paystack Gateway</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    When enabled, students can purchase courses using Paystack
                  </p>

                  <div className="pt-4">
                    <Button 
                      onClick={handleSave} 
                      disabled={isSaving}
                      className="w-full"
                    >
                      {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Getting Your Paystack Keys</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>1. Log in to your Paystack Dashboard</p>
                    <p>2. Go to Settings → API Keys</p>
                    <p>3. Copy your Public Key and Secret Key</p>
                    <p>4. Use Test keys for development, Live keys for production</p>
                  </div>
                  <Button variant="outline" asChild>
                    <a 
                      href="https://dashboard.paystack.com/#/settings/developer" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Open Paystack Dashboard
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default PaymentSettings;