-- SECURITY FIX: Remove dangerous public access to profiles table
-- This fixes a critical vulnerability where anyone could access all student personal information

-- Drop the dangerous policy that allows everyone to view all profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- The existing "Admins can view all profiles" policy already provides proper access control:
-- - Users can view their own profiles (user_id = auth.uid())
-- - Admins and Super Admins can view all profiles when needed
-- This policy remains active and provides secure access control

-- Add a comment for documentation
COMMENT ON TABLE public.profiles IS 'User profiles table with restricted access - users can only view their own profile, admins can view all profiles for management purposes';