
-- Create security definer function to check role
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = _user_id AND role = 'admin'
  )
$$;

-- Fix profiles admin policy
DROP POLICY "Admins can read all profiles" ON public.profiles;
CREATE POLICY "Admins can read all profiles" ON public.profiles
  FOR SELECT USING (public.is_admin(auth.uid()));

-- Fix transactions admin policy
DROP POLICY "Admins read all transactions" ON public.transactions;
CREATE POLICY "Admins read all transactions" ON public.transactions
  FOR SELECT USING (public.is_admin(auth.uid()));
