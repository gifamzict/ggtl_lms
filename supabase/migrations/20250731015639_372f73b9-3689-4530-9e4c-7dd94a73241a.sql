-- Add role column to profiles table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'role') THEN
        ALTER TABLE public.profiles ADD COLUMN role public.user_role NOT NULL DEFAULT 'STUDENT';
    END IF;
END $$;

-- Create function to get current user role (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS public.user_role AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Drop existing conflicting policies if they exist
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Super Admins can create admin accounts" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile or admins can update any" ON public.profiles;

-- Create new RLS policies for role-based access
CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT USING (
  public.get_current_user_role() IN ('ADMIN', 'SUPER_ADMIN')
  OR user_id = auth.uid()
);

-- Only Super Admins can create new admin accounts, anyone can create student accounts
CREATE POLICY "Role-based account creation" ON public.profiles
FOR INSERT WITH CHECK (
  (NEW.role = 'STUDENT' AND auth.uid() = NEW.user_id)
  OR 
  (NEW.role IN ('ADMIN', 'SUPER_ADMIN') AND public.get_current_user_role() = 'SUPER_ADMIN')
);

-- Users can update their own profile, admins can update any
CREATE POLICY "Role-based profile updates" ON public.profiles
FOR UPDATE USING (
  user_id = auth.uid() 
  OR public.get_current_user_role() IN ('ADMIN', 'SUPER_ADMIN')
);