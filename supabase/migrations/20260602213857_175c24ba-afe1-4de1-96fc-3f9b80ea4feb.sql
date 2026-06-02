CREATE OR REPLACE FUNCTION public.notify_blog_webhook()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (TG_OP = 'INSERT' AND NEW.published = true)
     OR (TG_OP = 'UPDATE' AND NEW.published = true AND COALESCE(OLD.published, false) = false) THEN
    PERFORM net.http_post(
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