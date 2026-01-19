-- ============================================
-- CREATE ADMIN USER
-- Email: admin@test.com
-- Password: Admin123!
-- Name: Admin User
-- ============================================

-- STEP 1: Create auth user
-- You need to run this via Supabase Dashboard → Authentication → Add User
-- OR use the SQL below if you have service_role access

-- IMPORTANT: Replace this with the ACTUAL user_id after creating the user in Supabase Dashboard
-- Go to: Dashboard → Authentication → Users → Click "Add User"
-- Email: admin@test.com
-- Password: Admin123!
-- Then copy the user ID and paste it below:

DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- If you already created the user in Supabase Dashboard, paste the ID here:
  -- admin_user_id := 'PASTE-USER-ID-HERE';

  -- Or try to find existing user by email:
  SELECT user_id INTO admin_user_id
  FROM public.profiles
  WHERE email = 'admin@test.com'
  LIMIT 1;

  IF admin_user_id IS NULL THEN
    RAISE NOTICE 'User not found! Please create user first in Supabase Dashboard';
    RAISE NOTICE 'Go to: Authentication → Users → Add User';
    RAISE NOTICE 'Email: admin@test.com';
    RAISE NOTICE 'Password: Admin123!';
    RAISE NOTICE 'Then run this script again.';
  ELSE
    -- Add admin role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;

    -- Update profile
    UPDATE public.profiles
    SET
      full_name = 'Admin User',
      membership_type = 'free'  -- Admin doesn't need premium!
    WHERE user_id = admin_user_id;

    RAISE NOTICE 'SUCCESS! Admin user configured:';
    RAISE NOTICE 'Email: admin@test.com';
    RAISE NOTICE 'User ID: %', admin_user_id;
    RAISE NOTICE 'Role: admin';
    RAISE NOTICE 'You can now log in and access /admin';
  END IF;
END $$;

-- STEP 2: Verify admin access
SELECT
  p.email,
  p.full_name,
  p.membership_type,
  array_agg(ur.role) as roles
FROM public.profiles p
LEFT JOIN public.user_roles ur ON ur.user_id = p.user_id
WHERE p.email = 'admin@test.com'
GROUP BY p.user_id, p.email, p.full_name, p.membership_type;
