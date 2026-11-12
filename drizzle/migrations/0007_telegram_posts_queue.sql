CREATE TABLE public.telegram_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body_html text NOT NULL,
  image_url text,
  button_text text,
  button_url text,
  sub_id text NOT NULL,
  scheduled_for timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','sending','published','failed','cancelled')),
  telegram_message_id bigint,
  error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.telegram_posts TO authenticated;
GRANT ALL ON public.telegram_posts TO service_role;
ALTER TABLE public.telegram_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage telegram posts" ON public.telegram_posts FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Service role manages telegram posts" ON public.telegram_posts FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE INDEX telegram_posts_due_idx ON public.telegram_posts (status, scheduled_for);

-- Atomically claim at most one due post; refuses while another is sending or one was published < 3h ago.
CREATE OR REPLACE FUNCTION public.claim_telegram_post()
RETURNS SETOF public.telegram_posts
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext('telegram_publish'));
  IF EXISTS (SELECT 1 FROM public.telegram_posts WHERE status = 'sending')
     OR EXISTS (SELECT 1 FROM public.telegram_posts WHERE status = 'published' AND published_at > now() - interval '3 hours') THEN
    RETURN;
  END IF;
  RETURN QUERY
  UPDATE public.telegram_posts SET status = 'sending'
  WHERE id = (SELECT id FROM public.telegram_posts WHERE status = 'queued' AND scheduled_for <= now()
              ORDER BY scheduled_for, created_at LIMIT 1 FOR UPDATE SKIP LOCKED)
  RETURNING *;
END $$;
REVOKE EXECUTE ON FUNCTION public.claim_telegram_post() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_telegram_post() TO service_role;

-- encodeURIComponent equivalent (UTF-8 bytes).
CREATE OR REPLACE FUNCTION public.uri_encode_component(_t text)
RETURNS text LANGUAGE sql IMMUTABLE SET search_path = public AS $$
  SELECT coalesce(string_agg(
    CASE WHEN b < 128 AND position(chr(b) IN 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.!~*''()') > 0
         THEN chr(b) ELSE '%' || upper(lpad(to_hex(b), 2, '0')) END, '' ORDER BY i), '')
  FROM (SELECT convert_to(_t, 'UTF8') AS bin) s,
       LATERAL generate_series(0, length(s.bin) - 1) AS i,
       LATERAL (SELECT get_byte(s.bin, i) AS b) g
$$;

CREATE OR REPLACE FUNCTION public.telegram_iherb_url(_sub_id text, _product_url text)
RETURNS text LANGUAGE sql IMMUTABLE SET search_path = public AS $$
  SELECT 'https://iherb.pxf.io/c/3215306/1665867/19332?subId1=' || public.uri_encode_component(_sub_id)
         || '&u=' || public.uri_encode_component(_product_url)
$$;

CREATE OR REPLACE FUNCTION public.telegram_article_url(_path text, _sub_id text)
RETURNS text LANGUAGE sql IMMUTABLE SET search_path = public AS $$
  SELECT 'https://fullbody.co.il/' || ltrim(_path, '/')
         || CASE WHEN position('?' IN _path) > 0 THEN '&' ELSE '?' END
         || 'utm_source=telegram&utm_medium=channel&utm_campaign=' || public.uri_encode_component(_sub_id)
$$;