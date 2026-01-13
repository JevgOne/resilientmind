-- RLS POLICIES FOR ALL TABLES

-- RLS Policies for profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_roles
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for video_categories
DROP POLICY IF EXISTS "Anyone can view video categories" ON public.video_categories;
CREATE POLICY "Anyone can view video categories"
  ON public.video_categories FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage video categories" ON public.video_categories;
CREATE POLICY "Admins can manage video categories"
  ON public.video_categories FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for videos
DROP POLICY IF EXISTS "Anyone can view free videos" ON public.videos;
CREATE POLICY "Anyone can view free videos"
  ON public.videos FOR SELECT
  USING (is_free = true);

DROP POLICY IF EXISTS "Members can view videos based on membership" ON public.videos;
CREATE POLICY "Members can view videos based on membership"
  ON public.videos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.user_id = auth.uid()
      AND (
        (videos.min_membership = 'basic' AND profiles.membership_type IN ('basic', 'premium'))
        OR (videos.min_membership = 'premium' AND profiles.membership_type = 'premium')
      )
      AND (profiles.membership_expires_at IS NULL OR profiles.membership_expires_at > now())
    )
  );

DROP POLICY IF EXISTS "Admins can manage all videos" ON public.videos;
CREATE POLICY "Admins can manage all videos"
  ON public.videos FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for lead_magnets
DROP POLICY IF EXISTS "Anyone can insert lead magnets" ON public.lead_magnets;
CREATE POLICY "Anyone can insert lead magnets"
  ON public.lead_magnets FOR INSERT
  WITH CHECK (email IS NOT NULL AND email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

DROP POLICY IF EXISTS "Admins can view lead magnets" ON public.lead_magnets;
CREATE POLICY "Admins can view lead magnets"
  ON public.lead_magnets FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for testimonials
DROP POLICY IF EXISTS "Anyone can view visible testimonials" ON public.testimonials;
CREATE POLICY "Anyone can view visible testimonials"
  ON public.testimonials FOR SELECT
  USING (is_visible = true);

DROP POLICY IF EXISTS "Admins can manage testimonials" ON public.testimonials;
CREATE POLICY "Admins can manage testimonials"
  ON public.testimonials FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for site_settings
DROP POLICY IF EXISTS "Anyone can view site settings" ON public.site_settings;
CREATE POLICY "Anyone can view site settings"
  ON public.site_settings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage site settings" ON public.site_settings;
CREATE POLICY "Admins can manage site settings"
  ON public.site_settings FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));
