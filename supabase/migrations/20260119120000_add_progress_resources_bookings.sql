-- ============================================
-- RESILIENT JOURNEYS - PROGRESS, RESOURCES & BOOKINGS
-- Migration: Add user progress tracking, downloadable resources, and booking system
-- ============================================

-- ============================================
-- 1. USER PROGRESS TRACKING
-- ============================================

-- Create user_progress table
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  watch_time_seconds INTEGER DEFAULT 0,
  last_watched_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, video_id)
);

-- Enable RLS
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_progress
DROP POLICY IF EXISTS "Users can view their own progress" ON public.user_progress;
CREATE POLICY "Users can view their own progress"
  ON public.user_progress FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own progress" ON public.user_progress;
CREATE POLICY "Users can insert their own progress"
  ON public.user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own progress" ON public.user_progress;
CREATE POLICY "Users can update their own progress"
  ON public.user_progress FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all progress" ON public.user_progress;
CREATE POLICY "Admins can view all progress"
  ON public.user_progress FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_user_progress_updated_at ON public.user_progress;
CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON public.user_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 2. DOWNLOADABLE RESOURCES
-- ============================================

-- Create resource_type enum
CREATE TYPE IF NOT EXISTS public.resource_type AS ENUM ('worksheet', 'meditation', 'pdf', 'audio', 'video', 'other');

-- Create resources table
CREATE TABLE IF NOT EXISTS public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.video_categories(id) ON DELETE CASCADE,
  video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  resource_type resource_type NOT NULL DEFAULT 'pdf',
  file_url TEXT NOT NULL,
  file_size_mb DECIMAL(10,2),
  min_membership membership_type NOT NULL DEFAULT 'basic',
  is_free BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- RLS Policies for resources
DROP POLICY IF EXISTS "Anyone can view free resources" ON public.resources;
CREATE POLICY "Anyone can view free resources"
  ON public.resources FOR SELECT
  USING (is_free = true);

DROP POLICY IF EXISTS "Members can view resources based on membership" ON public.resources;
CREATE POLICY "Members can view resources based on membership"
  ON public.resources FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.user_id = auth.uid()
      AND (
        (resources.min_membership = 'basic' AND profiles.membership_type IN ('basic', 'premium'))
        OR (resources.min_membership = 'premium' AND profiles.membership_type = 'premium')
      )
      AND (profiles.membership_expires_at IS NULL OR profiles.membership_expires_at > now())
    )
  );

DROP POLICY IF EXISTS "Admins can manage all resources" ON public.resources;
CREATE POLICY "Admins can manage all resources"
  ON public.resources FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_resources_updated_at ON public.resources;
CREATE TRIGGER update_resources_updated_at
  BEFORE UPDATE ON public.resources
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 3. SESSION BOOKINGS
-- ============================================

-- Create session_status enum
CREATE TYPE IF NOT EXISTS public.session_status AS ENUM ('scheduled', 'completed', 'cancelled', 'no_show');

-- Create session_type enum
CREATE TYPE IF NOT EXISTS public.session_type AS ENUM ('discovery', 'one_on_one', 'family', 'premium_consultation');

-- Create session_bookings table
CREATE TABLE IF NOT EXISTS public.session_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_type session_type NOT NULL,
  session_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  price_paid DECIMAL(10,2) DEFAULT 0,
  is_premium_credit BOOLEAN NOT NULL DEFAULT false,
  status session_status NOT NULL DEFAULT 'scheduled',
  notes TEXT,
  booking_notes TEXT,
  cancellation_reason TEXT,
  calendly_event_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.session_bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for session_bookings
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.session_bookings;
CREATE POLICY "Users can view their own bookings"
  ON public.session_bookings FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own bookings" ON public.session_bookings;
CREATE POLICY "Users can insert their own bookings"
  ON public.session_bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own bookings" ON public.session_bookings;
CREATE POLICY "Users can update their own bookings"
  ON public.session_bookings FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all bookings" ON public.session_bookings;
CREATE POLICY "Admins can manage all bookings"
  ON public.session_bookings FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_session_bookings_updated_at ON public.session_bookings;
CREATE TRIGGER update_session_bookings_updated_at
  BEFORE UPDATE ON public.session_bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 4. PREMIUM CONSULTATION CREDITS
-- ============================================

-- Create premium_credits table
CREATE TABLE IF NOT EXISTS public.premium_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  year INTEGER NOT NULL,
  total_credits INTEGER NOT NULL DEFAULT 4,
  used_credits INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, year)
);

-- Enable RLS
ALTER TABLE public.premium_credits ENABLE ROW LEVEL SECURITY;

-- RLS Policies for premium_credits
DROP POLICY IF EXISTS "Users can view their own credits" ON public.premium_credits;
CREATE POLICY "Users can view their own credits"
  ON public.premium_credits FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all credits" ON public.premium_credits;
CREATE POLICY "Admins can manage all credits"
  ON public.premium_credits FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_premium_credits_updated_at ON public.premium_credits;
CREATE TRIGGER update_premium_credits_updated_at
  BEFORE UPDATE ON public.premium_credits
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to auto-create premium credits when user upgrades to premium
CREATE OR REPLACE FUNCTION public.create_premium_credits_on_upgrade()
RETURNS TRIGGER AS $$
BEGIN
  -- If user upgraded to premium
  IF NEW.membership_type = 'premium' AND (OLD.membership_type IS NULL OR OLD.membership_type != 'premium') THEN
    -- Create credits for current year if not exists
    INSERT INTO public.premium_credits (user_id, year, total_credits, used_credits)
    VALUES (NEW.user_id, EXTRACT(YEAR FROM now())::INTEGER, 4, 0)
    ON CONFLICT (user_id, year) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to auto-create credits on premium upgrade
DROP TRIGGER IF EXISTS create_premium_credits_trigger ON public.profiles;
CREATE TRIGGER create_premium_credits_trigger
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  WHEN (NEW.membership_type = 'premium')
  EXECUTE FUNCTION public.create_premium_credits_on_upgrade();

-- ============================================
-- 5. PREMIUM KIT ORDERS (BONUS)
-- ============================================

-- Create kit_status enum
CREATE TYPE IF NOT EXISTS public.kit_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');

-- Create premium_kit_orders table
CREATE TABLE IF NOT EXISTS public.premium_kit_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  shipping_address JSONB,
  order_status kit_status NOT NULL DEFAULT 'pending',
  tracking_number TEXT,
  carrier TEXT,
  shipped_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.premium_kit_orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view their own kit orders" ON public.premium_kit_orders;
CREATE POLICY "Users can view their own kit orders"
  ON public.premium_kit_orders FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all kit orders" ON public.premium_kit_orders;
CREATE POLICY "Admins can manage all kit orders"
  ON public.premium_kit_orders FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_premium_kit_orders_updated_at ON public.premium_kit_orders;
CREATE TRIGGER update_premium_kit_orders_updated_at
  BEFORE UPDATE ON public.premium_kit_orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 6. INDEXES FOR PERFORMANCE
-- ============================================

-- user_progress indexes
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_video_id ON public.user_progress(video_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_completed ON public.user_progress(completed);

-- resources indexes
CREATE INDEX IF NOT EXISTS idx_resources_category_id ON public.resources(category_id);
CREATE INDEX IF NOT EXISTS idx_resources_video_id ON public.resources(video_id);
CREATE INDEX IF NOT EXISTS idx_resources_min_membership ON public.resources(min_membership);

-- session_bookings indexes
CREATE INDEX IF NOT EXISTS idx_session_bookings_user_id ON public.session_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_session_bookings_session_date ON public.session_bookings(session_date);
CREATE INDEX IF NOT EXISTS idx_session_bookings_status ON public.session_bookings(status);

-- premium_credits indexes
CREATE INDEX IF NOT EXISTS idx_premium_credits_user_id ON public.premium_credits(user_id);
CREATE INDEX IF NOT EXISTS idx_premium_credits_year ON public.premium_credits(year);

-- premium_kit_orders indexes
CREATE INDEX IF NOT EXISTS idx_premium_kit_orders_user_id ON public.premium_kit_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_premium_kit_orders_status ON public.premium_kit_orders(order_status);

-- ============================================
-- VERIFICATION QUERIES (comment out after testing)
-- ============================================

-- Check tables exist
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('user_progress', 'resources', 'session_bookings', 'premium_credits', 'premium_kit_orders');

-- Check RLS policies
-- SELECT schemaname, tablename, policyname FROM pg_policies WHERE schemaname = 'public' AND tablename IN ('user_progress', 'resources', 'session_bookings', 'premium_credits', 'premium_kit_orders');
