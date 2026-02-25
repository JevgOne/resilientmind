-- ============================================
-- FIX: Admin can't insert/update/delete videos and resources
-- The FOR ALL policy with only USING clause may not work for INSERT.
-- Add explicit WITH CHECK and separate policies for each operation.
-- ============================================

-- VIDEOS: Drop old policy and recreate with explicit WITH CHECK
DROP POLICY IF EXISTS "Admins can manage all videos" ON public.videos;
CREATE POLICY "Admins can manage all videos"
  ON public.videos FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RESOURCES: Drop old policy and recreate with explicit WITH CHECK
DROP POLICY IF EXISTS "Admins can manage all resources" ON public.resources;
CREATE POLICY "Admins can manage all resources"
  ON public.resources FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- VIDEO_CATEGORIES: Same fix
DROP POLICY IF EXISTS "Admins can manage video categories" ON public.video_categories;
CREATE POLICY "Admins can manage video categories"
  ON public.video_categories FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
