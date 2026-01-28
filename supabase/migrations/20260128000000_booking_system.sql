-- =====================================================
-- BOOKING SYSTEM MIGRATION
-- Přidání podpory pro booking systém s dostupností,
-- blokovanými dny a Stripe integrací
-- =====================================================

-- 1. ÚPRAVA EXISTUJÍCÍ TABULKY session_bookings
-- =====================================================

-- Přidat chybějící sloupce pro Stripe integraci a host rezervace
ALTER TABLE public.session_bookings
ADD COLUMN IF NOT EXISTS client_name TEXT,
ADD COLUMN IF NOT EXISTS client_email TEXT,
ADD COLUMN IF NOT EXISTS stripe_session_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS payment_expires_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS end_time TIMESTAMPTZ;

-- Rozšířit session_status enum o pending_payment a expired
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'session_status') THEN
    CREATE TYPE session_status AS ENUM ('scheduled', 'completed', 'cancelled', 'no_show');
  END IF;

  ALTER TYPE session_status ADD VALUE IF NOT EXISTS 'pending_payment';
  ALTER TYPE session_status ADD VALUE IF NOT EXISTS 'expired';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Přejmenovat price_paid na price_cents a převést existující data
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_name = 'session_bookings' AND column_name = 'price_paid') THEN

    -- Převést existující data na centy (pokud už nejsou)
    UPDATE public.session_bookings
    SET price_paid = price_paid * 100
    WHERE price_paid < 1000;

    -- Přejmenovat sloupec
    ALTER TABLE public.session_bookings
    RENAME COLUMN price_paid TO price_cents;
  END IF;
END $$;

-- Přidat indexy pro výkon
CREATE INDEX IF NOT EXISTS idx_session_bookings_stripe_session_id
  ON public.session_bookings(stripe_session_id)
  WHERE stripe_session_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_session_bookings_payment_expires_at
  ON public.session_bookings(payment_expires_at)
  WHERE status = 'pending_payment';

CREATE INDEX IF NOT EXISTS idx_session_bookings_session_date
  ON public.session_bookings(session_date);

-- 2. VYTVOŘENÍ TABULKY AVAILABILITY (týdenní dostupnost)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- RLS Policies
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Kdokoliv může zobrazit aktivní dostupnost" ON public.availability;
CREATE POLICY "Kdokoliv může zobrazit aktivní dostupnost"
  ON public.availability FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Admini mohou spravovat dostupnost" ON public.availability;
CREATE POLICY "Admini mohou spravovat dostupnost"
  ON public.availability FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Triggers
DROP TRIGGER IF EXISTS update_availability_updated_at ON public.availability;
CREATE TRIGGER update_availability_updated_at
  BEFORE UPDATE ON public.availability
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexy
CREATE INDEX IF NOT EXISTS idx_availability_day_active
  ON public.availability(day_of_week, is_active)
  WHERE is_active = true;

-- 3. VYTVOŘENÍ TABULKY BLOCKED_DATES (blokované dny)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.blocked_dates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS Policies
ALTER TABLE public.blocked_dates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Kdokoliv může zobrazit blokované dny" ON public.blocked_dates;
CREATE POLICY "Kdokoliv může zobrazit blokované dny"
  ON public.blocked_dates FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admini mohou spravovat blokované dny" ON public.blocked_dates;
CREATE POLICY "Admini mohou spravovat blokované dny"
  ON public.blocked_dates FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Triggers
DROP TRIGGER IF EXISTS update_blocked_dates_updated_at ON public.blocked_dates;
CREATE TRIGGER update_blocked_dates_updated_at
  BEFORE UPDATE ON public.blocked_dates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexy
CREATE INDEX IF NOT EXISTS idx_blocked_dates_date
  ON public.blocked_dates(date);

-- 4. AKTUALIZACE RLS POLICIES PRO HOST REZERVACE
-- =====================================================

-- Povolit nepřihlášeným uživatelům vytvářet rezervace (pro hosty)
DROP POLICY IF EXISTS "Kdokoliv může vytvořit pending rezervace" ON public.session_bookings;
CREATE POLICY "Kdokoliv může vytvořit pending rezervace"
  ON public.session_bookings FOR INSERT
  WITH CHECK (
    status = 'pending_payment'
    OR (status = 'confirmed' AND session_type = 'discovery')
  );

-- Povolit kdokoliv zobrazit rezervaci přes stripe_session_id (bez auth)
DROP POLICY IF EXISTS "Kdokoliv může zobrazit rezervaci podle stripe_session_id" ON public.session_bookings;
CREATE POLICY "Kdokoliv může zobrazit rezervaci podle stripe_session_id"
  ON public.session_bookings FOR SELECT
  USING (
    stripe_session_id IS NOT NULL
    OR auth.uid() = user_id
    OR public.has_role(auth.uid(), 'admin')
  );

-- 5. FUNKCE PRO ZÍSKÁNÍ CENY SESSION TYPU
-- =====================================================

CREATE OR REPLACE FUNCTION public.get_session_price(p_session_type session_type)
RETURNS INTEGER
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  RETURN CASE p_session_type
    WHEN 'discovery' THEN 0
    WHEN 'one_on_one' THEN 8700  -- €87 v centech
    WHEN 'family' THEN 12000      -- €120 v centech
    WHEN 'premium_consultation' THEN 8700  -- €87 v centech (pokud není zahrnuto v membership)
    ELSE 0
  END;
END;
$$;

-- 6. VLOŽENÍ TESTOVACÍCH DAT (volitelné - zakomentováno)
-- =====================================================

-- Výchozí týdenní dostupnost (Po-Pá 9:00-17:00)
-- INSERT INTO public.availability (day_of_week, start_time, end_time, is_active) VALUES
--   (1, '09:00', '17:00', true),  -- Pondělí
--   (2, '09:00', '17:00', true),  -- Úterý
--   (3, '09:00', '17:00', true),  -- Středa
--   (4, '09:00', '17:00', true),  -- Čtvrtek
--   (5, '09:00', '17:00', true)   -- Pátek
-- ON CONFLICT DO NOTHING;

-- =====================================================
-- KONEC MIGRACE
-- =====================================================
