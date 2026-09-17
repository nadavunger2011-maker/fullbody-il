ALTER TABLE public.analytics_events
  ADD COLUMN IF NOT EXISTS user_email text,
  ADD COLUMN IF NOT EXISTS user_phone text,
  ADD COLUMN IF NOT EXISTS user_name text;