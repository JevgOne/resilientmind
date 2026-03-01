-- ============================================
-- SEASONAL AVAILABILITY
-- Add support for date-range-specific availability schedules
-- e.g. "Summer: Wed only 10-16", "Winter: Mon-Fri normal"
-- ============================================

-- 1. Add seasonal columns
ALTER TABLE public.availability
ADD COLUMN IF NOT EXISTS schedule_name TEXT,
ADD COLUMN IF NOT EXISTS effective_from DATE,
ADD COLUMN IF NOT EXISTS effective_until DATE;

-- 2. CHECK constraint: both dates NULL or both filled, until >= from
ALTER TABLE public.availability
ADD CONSTRAINT seasonal_dates_check CHECK (
  (effective_from IS NULL AND effective_until IS NULL)
  OR (effective_from IS NOT NULL AND effective_until IS NOT NULL AND effective_until >= effective_from)
);

-- 3. Drop old unique index (it prevented same day+time in different seasons)
DROP INDEX IF EXISTS idx_availability_unique_slot;

-- 4. New unique index: same day+time+season combo can't exist twice
CREATE UNIQUE INDEX idx_availability_unique_slot
  ON public.availability(day_of_week, start_time, end_time, COALESCE(effective_from, '1970-01-01'), COALESCE(effective_until, '1970-01-01'))
  WHERE is_active = true;

-- 5. Index for fast seasonal lookup
CREATE INDEX IF NOT EXISTS idx_availability_seasonal
  ON public.availability(effective_from, effective_until)
  WHERE effective_from IS NOT NULL;

-- 6. Fix admin RLS policy with explicit WITH CHECK
DROP POLICY IF EXISTS "Admini mohou spravovat dostupnost" ON public.availability;
CREATE POLICY "Admini mohou spravovat dostupnost"
  ON public.availability FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
