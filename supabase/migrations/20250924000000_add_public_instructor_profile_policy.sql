-- This policy allows anyone to view the profiles of users who are instructors.
-- It is necessary for public pages (like the home page or course details page)
-- to display the instructor's name next to a course.
-- It is secure because it does NOT expose the profiles of students.

CREATE POLICY "Allow public read access to instructor profiles"
ON public.profiles
FOR SELECT
USING (role = 'INSTRUCTOR');

COMMENT ON POLICY "Allow public read access to instructor profiles" ON public.profiles IS 'Ensures that instructor profiles are publicly viewable for course display purposes.';