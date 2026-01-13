-- RESILIENT MIND DATABASE SETUP - SIMPLE VERSION
-- This version avoids $$ syntax issues

-- Drop types if they exist
DROP TYPE IF EXISTS public.membership_type CASCADE;
DROP TYPE IF EXISTS public.app_role CASCADE;

-- Create enums
CREATE TYPE public.membership_type AS ENUM ('free', 'basic', 'premium');
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

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
  email,
  full_name,
  membership_type,
  membership_expires_at,
  created_at
FROM public.profiles
ORDER BY created_at;
