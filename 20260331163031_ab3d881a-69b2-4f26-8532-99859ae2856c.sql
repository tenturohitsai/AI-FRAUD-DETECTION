
-- Fix permissive insert policy on profiles
DROP POLICY "Allow trigger insert" ON public.profiles;
CREATE POLICY "Service role insert profiles" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Fix permissive insert policy on fraud_alerts
DROP POLICY "System insert alerts" ON public.fraud_alerts;
CREATE POLICY "Authenticated insert alerts" ON public.fraud_alerts
  FOR INSERT WITH CHECK (auth.uid() = user_id);
