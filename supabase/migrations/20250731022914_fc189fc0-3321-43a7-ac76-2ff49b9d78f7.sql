-- Clear existing admin and super admin profiles to allow fresh registration
DELETE FROM public.profiles 
WHERE role IN ('ADMIN', 'SUPER_ADMIN');