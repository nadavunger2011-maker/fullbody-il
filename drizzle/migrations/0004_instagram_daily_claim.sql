CREATE TABLE public.instagram_publish_days (
  local_date date PRIMARY KEY,
  post_id uuid NOT NULL REFERENCES public.social_posts(id),
  claimed_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.instagram_publish_days TO service_role;
ALTER TABLE public.instagram_publish_days ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role manages Instagram daily claims" ON public.instagram_publish_days FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.claim_instagram_daily_post(_post_id uuid)
RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  local_now timestamp := clock_timestamp() AT TIME ZONE 'Asia/Jerusalem';
  claimed date;
BEGIN
  IF extract(hour FROM local_now) <> 20 OR extract(minute FROM local_now) <> 0 THEN RETURN false; END IF;
  PERFORM pg_advisory_xact_lock(8420261108);
  IF EXISTS (SELECT 1 FROM public.social_posts WHERE platform = 'instagram' AND (published_at AT TIME ZONE 'Asia/Jerusalem')::date = local_now::date) THEN RETURN false; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.social_posts WHERE id = _post_id AND platform = 'instagram' AND status = 'queued' AND (scheduled_at <= clock_timestamp() OR (scheduled_at IS NULL AND (scheduled_for IS NULL OR scheduled_for <= local_now::date)))) THEN RETURN false; END IF;
  INSERT INTO public.instagram_publish_days(local_date, post_id) VALUES (local_now::date, _post_id) ON CONFLICT DO NOTHING RETURNING local_date INTO claimed;
  IF claimed IS NULL THEN RETURN false; END IF;
  UPDATE public.social_posts SET status = 'publishing', updated_at = clock_timestamp() WHERE id = _post_id AND status = 'queued';
  RETURN true;
END;
$$;
REVOKE ALL ON FUNCTION public.claim_instagram_daily_post(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_instagram_daily_post(uuid) TO service_role;