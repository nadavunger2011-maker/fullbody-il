CREATE TABLE public.social_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL DEFAULT 'instagram',
  title text,
  caption text NOT NULL,
  image_urls text[] NOT NULL DEFAULT '{}',
  scheduled_for date,
  status text NOT NULL DEFAULT 'queued',
  sort_order integer NOT NULL DEFAULT 0,
  provider_post_id text,
  permalink text,
  error text,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.social_posts TO authenticated;
GRANT ALL ON public.social_posts TO service_role;

ALTER TABLE public.social_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage social posts"
ON public.social_posts FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Service role can manage social posts"
ON public.social_posts FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE INDEX idx_social_posts_queue ON public.social_posts (status, sort_order, created_at);