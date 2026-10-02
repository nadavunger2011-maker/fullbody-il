ALTER TABLE public.social_posts ADD COLUMN scheduled_at TIMESTAMPTZ;
CREATE INDEX social_posts_publish_queue_idx ON public.social_posts (platform, status, scheduled_at, sort_order);