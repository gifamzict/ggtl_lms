-- Update the existing user to have SUPER_ADMIN role
UPDATE public.profiles 
SET role = 'SUPER_ADMIN' 
WHERE user_id = 'd6703c7c-dbe1-4e37-a95a-90f097e6cfae';