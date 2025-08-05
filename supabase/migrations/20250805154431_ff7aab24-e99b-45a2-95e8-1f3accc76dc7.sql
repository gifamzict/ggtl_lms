-- Create payment gateway settings table
CREATE TABLE public.payment_gateway_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  public_key TEXT,
  secret_key TEXT, -- Will be encrypted before storage
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.payment_gateway_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for super admins only
CREATE POLICY "Super admins can manage payment settings" 
ON public.payment_gateway_settings 
FOR ALL 
USING (get_current_user_role() = 'SUPER_ADMIN'::user_role)
WITH CHECK (get_current_user_role() = 'SUPER_ADMIN'::user_role);

-- Create updated_at trigger
CREATE TRIGGER update_payment_gateway_settings_updated_at
  BEFORE UPDATE ON public.payment_gateway_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default Paystack record
INSERT INTO public.payment_gateway_settings (name, is_active) 
VALUES ('paystack', false);