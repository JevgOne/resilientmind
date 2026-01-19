-- ============================================
-- RESILIENT JOURNEYS - COMPLETE SETUP
-- ============================================
-- Copy this ENTIRE file and paste into Supabase SQL Editor
-- Then click RUN
-- ============================================

-- ============================================
-- PART 1: CREATE ALL TABLES
-- ============================================

-- Create enums
CREATE TYPE IF NOT EXISTS public.resource_type AS ENUM ('worksheet', 'meditation', 'pdf', 'audio', 'video', 'other');
CREATE TYPE IF NOT EXISTS public.session_status AS ENUM ('scheduled', 'completed', 'cancelled', 'no_show');
CREATE TYPE IF NOT EXISTS public.session_type AS ENUM ('discovery', 'one_on_one', 'family', 'premium_consultation');
CREATE TYPE IF NOT EXISTS public.kit_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');

-- 1. USER PROGRESS TABLE
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

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own progress" ON public.user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own progress" ON public.user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own progress" ON public.user_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all progress" ON public.user_progress FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON public.user_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_video_id ON public.user_progress(video_id);

-- 2. RESOURCES TABLE
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

ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view free resources" ON public.resources FOR SELECT USING (is_free = true);
CREATE POLICY "Members can view resources based on membership" ON public.resources FOR SELECT
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
CREATE POLICY "Admins can view all resources" ON public.resources FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage all resources" ON public.resources FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON public.resources
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_resources_category_id ON public.resources(category_id);

-- 3. SESSION BOOKINGS TABLE
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

ALTER TABLE public.session_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookings" ON public.session_bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own bookings" ON public.session_bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own bookings" ON public.session_bookings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all bookings" ON public.session_bookings FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_session_bookings_updated_at BEFORE UPDATE ON public.session_bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. PREMIUM CREDITS TABLE
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

ALTER TABLE public.premium_credits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own credits" ON public.premium_credits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all credits" ON public.premium_credits FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_premium_credits_updated_at BEFORE UPDATE ON public.premium_credits
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create credits on premium upgrade
CREATE OR REPLACE FUNCTION public.create_premium_credits_on_upgrade()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.membership_type = 'premium' AND (OLD.membership_type IS NULL OR OLD.membership_type != 'premium') THEN
    INSERT INTO public.premium_credits (user_id, year, total_credits, used_credits)
    VALUES (NEW.user_id, EXTRACT(YEAR FROM now())::INTEGER, 4, 0)
    ON CONFLICT (user_id, year) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS create_premium_credits_trigger ON public.profiles;
CREATE TRIGGER create_premium_credits_trigger
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  WHEN (NEW.membership_type = 'premium')
  EXECUTE FUNCTION public.create_premium_credits_on_upgrade();

-- 5. PREMIUM KIT ORDERS TABLE
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

ALTER TABLE public.premium_kit_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own kit orders" ON public.premium_kit_orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all kit orders" ON public.premium_kit_orders FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_premium_kit_orders_updated_at BEFORE UPDATE ON public.premium_kit_orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- PART 2: FIX ADMIN ACCESS TO VIDEOS
-- ============================================

-- Admins can view ALL videos (not just manage)
DROP POLICY IF EXISTS "Admins can view all videos" ON public.videos;
CREATE POLICY "Admins can view all videos"
  ON public.videos FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- PART 3: CREATE ADMIN USER
-- ============================================

-- INSTRUCTIONS:
-- After running this SQL, you need to CREATE the user account manually:
--
-- Go to: Supabase Dashboard → Authentication → Users → "Add User"
-- Email: admin@test.com
-- Password: Admin123!
-- Auto Confirm User: YES
--
-- Then come back and run the SQL below with the user's ID:

-- STEP 1: Create user via Dashboard first!
-- STEP 2: Run this SQL with the user_id:

DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Try to find the admin user by email
  SELECT user_id INTO admin_user_id
  FROM public.profiles
  WHERE email = 'admin@test.com'
  LIMIT 1;

  IF admin_user_id IS NULL THEN
    RAISE NOTICE '⚠️  Admin user not found!';
    RAISE NOTICE '';
    RAISE NOTICE 'Please create the user first:';
    RAISE NOTICE '1. Go to: Authentication → Users → Add User';
    RAISE NOTICE '2. Email: admin@test.com';
    RAISE NOTICE '3. Password: Admin123!';
    RAISE NOTICE '4. Auto Confirm User: YES';
    RAISE NOTICE '5. Then run this SQL again';
  ELSE
    -- Add admin role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;

    -- Update profile
    UPDATE public.profiles
    SET full_name = 'Admin User'
    WHERE user_id = admin_user_id;

    RAISE NOTICE '✅ SUCCESS! Admin user configured:';
    RAISE NOTICE 'Email: admin@test.com';
    RAISE NOTICE 'Password: Admin123!';
    RAISE NOTICE 'User ID: %', admin_user_id;
    RAISE NOTICE '';
    RAISE NOTICE '🚀 You can now log in at /auth';
  END IF;
END $$;

-- Verify
SELECT
  p.email,
  p.full_name,
  p.membership_type,
  array_agg(ur.role) as roles
FROM public.profiles p
LEFT JOIN public.user_roles ur ON ur.user_id = p.user_id
WHERE p.email = 'admin@test.com'
GROUP BY p.user_id, p.email, p.full_name, p.membership_type;
