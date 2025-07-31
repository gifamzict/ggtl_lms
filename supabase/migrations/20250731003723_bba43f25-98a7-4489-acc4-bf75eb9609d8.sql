-- Fix category insertion by adding proper RLS policies
CREATE POLICY "Admins can insert categories" 
ON public.categories 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can update categories" 
ON public.categories 
FOR UPDATE 
USING (true);

CREATE POLICY "Admins can delete categories" 
ON public.categories 
FOR DELETE 
USING (true);