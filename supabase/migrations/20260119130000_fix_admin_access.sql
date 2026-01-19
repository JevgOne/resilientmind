-- ============================================
-- FIX ADMIN ACCESS - Admins see everything regardless of membership
-- ============================================

-- Videos: Admins can view ALL videos (not just manage)
DROP POLICY IF EXISTS "Admins can view all videos" ON public.videos;
CREATE POLICY "Admins can view all videos"
  ON public.videos FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Resources: Admins can view ALL resources
DROP POLICY IF EXISTS "Admins can view all resources" ON public.resources;
CREATE POLICY "Admins can view all resources"
  ON public.resources FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- User Progress: Admins already have view access (existing policy is OK)

-- Session Bookings: Admins already have ALL access (existing policy is OK)

-- Premium Credits: Admins already have ALL access (existing policy is OK)

-- Premium Kit Orders: Admins already have ALL access (existing policy is OK)

-- Lead Magnets: Admins already have view access (existing policy is OK)

-- Testimonials: Admins already have ALL access (existing policy is OK)

-- Site Settings: Admins already have ALL access (existing policy is OK)

-- ============================================
-- VERIFICATION
-- ============================================

-- Check all RLS policies for admins
SELECT
  schemaname,
  tablename,
  policyname,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'public'
  AND policyname LIKE '%admin%'
ORDER BY tablename, cmd;
