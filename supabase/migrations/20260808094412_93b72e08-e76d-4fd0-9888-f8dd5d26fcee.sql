ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS experience_level text,
  ADD COLUMN IF NOT EXISTS program_start_date date DEFAULT CURRENT_DATE,
  ADD COLUMN IF NOT EXISTS last_seen_at timestamptz DEFAULT now();

GRANT UPDATE (last_seen_at) ON public.leads TO anon, authenticated;

DROP POLICY IF EXISTS "Lead can touch last_seen_at" ON public.leads;
CREATE POLICY "Lead can touch last_seen_at"
ON public.leads FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);