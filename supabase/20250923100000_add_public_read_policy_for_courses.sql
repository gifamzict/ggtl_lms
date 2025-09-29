-- Drop the existing policy to replace it with a more comprehensive one.
DROP POLICY IF EXISTS "Allow public read access to published courses" ON public.courses;

-- Create a new, more robust policy for viewing courses.
-- This policy allows:
-- 1. Any visitor (logged in or not) to view courses that are 'PUBLISHED'.
-- 2. Users with 'ADMIN' or 'SUPER_ADMIN' roles to view ALL courses, regardless of status.
CREATE POLICY "Allow public read access to published courses"
ON public.courses
FOR SELECT
USING (
  (status = 'PUBLISHED')
  OR
  (
    auth.role() = 'authenticated' AND
    (get_current_user_role() IN ('ADMIN', 'SUPER_ADMIN'))
  )
);

-- Add a comment for documentation
COMMENT ON POLICY "Allow public read access to published courses" ON public.courses IS 'Ensures that visitors can see PUBLISHED courses, and Admins/Super Admins can see all courses.';