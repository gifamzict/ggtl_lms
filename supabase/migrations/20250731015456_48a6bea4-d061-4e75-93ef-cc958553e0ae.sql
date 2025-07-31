-- Add user role enum
CREATE TYPE public.user_role AS ENUM ('STUDENT', 'ADMIN', 'SUPER_ADMIN');

-- Add role column to profiles table with default value
ALTER TABLE public.profiles 
ADD COLUMN role public.user_role NOT NULL DEFAULT 'STUDENT';

-- Update the existing update_updated_at trigger to work with the new column
-- This ensures the trigger continues to work properly

-- Create function to get current user role (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS public.user_role AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create RLS policies for role-based access

-- Admin and Super Admin can view all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT USING (
  public.get_current_user_role() IN ('ADMIN', 'SUPER_ADMIN')
  OR user_id = auth.uid()
);

-- Only Super Admins can create new admin accounts
CREATE POLICY "Super Admins can create admin accounts" ON public.profiles
FOR INSERT WITH CHECK (
  (NEW.role = 'STUDENT' AND auth.uid() = NEW.user_id)
  OR 
  (NEW.role IN ('ADMIN', 'SUPER_ADMIN') AND public.get_current_user_role() = 'SUPER_ADMIN')
);

-- Update existing policies
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile or admins can update any" ON public.profiles
FOR UPDATE USING (
  user_id = auth.uid() 
  OR public.get_current_user_role() IN ('ADMIN', 'SUPER_ADMIN')
);

-- Seed the first Super Admin account
-- Note: This will need to be updated with actual credentials
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, confirmation_token, email_change_token_current, email_change_confirm_status, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, role)
VALUES (gen_random_uuid(), 'superadmin@ggtl.com', crypt('SecurePassword123!', gen_salt('bf')), now(), now(), now(), '', '', 0, now(), '{}', '{"full_name": "Super Admin"}', false, 'authenticated')
ON CONFLICT (email) DO NOTHING;

-- Insert corresponding profile for super admin
INSERT INTO public.profiles (user_id, full_name, email_verified, role)
SELECT u.id, 'Super Admin', true, 'SUPER_ADMIN'
FROM auth.users u 
WHERE u.email = 'superadmin@ggtl.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'SUPER_ADMIN';