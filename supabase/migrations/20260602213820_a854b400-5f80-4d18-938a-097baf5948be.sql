-- Networking extension for outbound HTTP from the database
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Key/value settings table
CREATE TABLE public.app_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.app_settings TO authenticated;
GRANT ALL ON public.app_settings TO service_role;

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read settings"
ON public.app_settings FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert settings"
ON public.app_settings FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update settings"
ON public.app_settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Service role can manage settings"
ON public.app_settings FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE TRIGGER update_app_settings_updated_at
BEFORE UPDATE ON public.app_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_reviews_updated_at();

-- Trigger: notify the social webhook edge function on publish
CREATE OR REPLACE FUNCTION public.notify_blog_webhook()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (TG_OP = 'INSERT' AND NEW.published = true)
     OR (TG_OP = 'UPDATE' AND NEW.published = true AND COALESCE(OLD.published, false) = false) THEN
    PERFORM extensions.net_http_post(
      url := 'https://jfogxnstkykpsyeegmnm.supabase.co/functions/v1/blog-social-webhook',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'apikey', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impmb2d4bnN0a3lrcHN5ZWVnbW5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5ODY5OTksImV4cCI6MjA4NDU2Mjk5OX0.owHWtVpkeuMdfsGrlhyjdrtpklJ8VdxD4b6DZqObWys'
      ),
      body := jsonb_build_object('post_id', NEW.id)
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER blog_posts_social_webhook
AFTER INSERT OR UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.notify_blog_webhook();