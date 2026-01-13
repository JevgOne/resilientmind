-- RESILIENT MIND DATABASE SETUP - CORRECT VERSION
-- Copy this ENTIRE file and paste into Supabase SQL Editor, then click RUN

-- Create enums (drop first if they exist)
DO $$ BEGIN
    CREATE TYPE public.membership_type AS ENUM ('free', 'basic', 'premium');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  membership_type membership_type NOT NULL DEFAULT 'free',
  membership_started_at TIMESTAMP WITH TIME ZONE,
  membership_expires_at TIMESTAMP WITH TIME ZONE,
  stripe_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Create video_categories table
CREATE TABLE IF NOT EXISTS public.video_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  month_number INTEGER NOT NULL,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create videos table
CREATE TABLE IF NOT EXISTS public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.video_categories(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration_minutes INTEGER,
  is_free BOOLEAN NOT NULL DEFAULT false,
  min_membership membership_type NOT NULL DEFAULT 'basic',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lead_magnets table
CREATE TABLE IF NOT EXISTS public.lead_magnets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  name TEXT,
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  source TEXT DEFAULT 'website',
  CONSTRAINT lead_magnets_email_unique UNIQUE (email)
);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT,
  content TEXT NOT NULL,
  avatar_url TEXT,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  is_visible BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create site_settings table
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_magnets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Create functions
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name')
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_testimonials_updated_at ON public.testimonials;
CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_site_settings_updated_at ON public.site_settings;
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

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

-- Insert 12 video categories
INSERT INTO public.video_categories (name, description, month_number, icon) VALUES
  ('Self-Acceptance', 'Foundations of self-love and embracing your uniqueness', 1, 'heart'),
  ('Emotional Intelligence', 'Recognizing and working with emotions', 2, 'brain'),
  ('Stress Management', 'Techniques for managing stress and anxiety', 3, 'shield'),
  ('Creative Expression', 'Art therapy and creative techniques', 4, 'palette'),
  ('Mindfulness', 'Present moment awareness and meditation', 5, 'eye'),
  ('Relationships & Boundaries', 'Healthy relationships and personal boundaries', 6, 'users'),
  ('Inner Strength', 'Building mental resilience', 7, 'zap'),
  ('Adaptation', 'Navigating change and new situations', 8, 'compass'),
  ('Self-Efficacy', 'Believing in your own abilities', 9, 'target'),
  ('Community', 'Building a supportive network', 10, 'globe'),
  ('Gratitude', 'Practices of gratitude and positivity', 11, 'sun'),
  ('Integration', 'Connecting all learned skills together', 12, 'puzzle')
ON CONFLICT DO NOTHING;

-- Setup admin account
INSERT INTO public.user_roles (user_id, role)
VALUES ('2131fb85-2685-4ee2-acae-8d9e577357bb', 'admin')
ON CONFLICT DO NOTHING;

UPDATE public.profiles SET
  full_name = 'Admin User',
  membership_type = 'premium',
  membership_started_at = now(),
  membership_expires_at = now() + interval '10 years'
WHERE user_id = '2131fb85-2685-4ee2-acae-8d9e577357bb';

-- Setup free account
UPDATE public.profiles SET full_name = 'Free User'
WHERE user_id = '88c0d82d-dd69-4803-99ec-042250614d5d';

-- Setup basic membership
UPDATE public.profiles SET
  full_name = 'Basic Member',
  membership_type = 'basic',
  membership_started_at = now(),
  membership_expires_at = now() + interval '1 year'
WHERE user_id = '9ab26e29-e5f2-43e4-9f27-153a7bc94eb9';

-- Setup premium membership
UPDATE public.profiles SET
  full_name = 'Premium Member',
  membership_type = 'premium',
  membership_started_at = now(),
  membership_expires_at = now() + interval '1 year'
WHERE user_id = '9fd3a975-4949-46c7-87b7-b63608f44df2';

-- Verify setup
SELECT
  p.email,
  p.full_name,
  p.membership_type,
  p.membership_expires_at,
  COALESCE(array_agg(ur.role) FILTER (WHERE ur.role IS NOT NULL), ARRAY[]::app_role[]) as roles
FROM public.profiles p
LEFT JOIN public.user_roles ur ON ur.user_id = p.user_id
GROUP BY p.user_id, p.email, p.full_name, p.membership_type, p.membership_expires_at
ORDER BY p.created_at;
