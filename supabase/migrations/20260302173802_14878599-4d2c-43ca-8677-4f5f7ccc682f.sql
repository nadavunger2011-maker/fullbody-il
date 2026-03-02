
-- Analytics events table for tracking all user interactions
CREATE TABLE public.analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  page_path text,
  product_handle text,
  product_title text,
  product_id text,
  variant_id text,
  variant_title text,
  price numeric,
  quantity integer DEFAULT 1,
  currency text DEFAULT 'ILS',
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  session_id text,
  user_agent text,
  screen_width integer,
  order_id text,
  order_total numeric,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.ad_spend (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  source text NOT NULL,
  campaign text,
  spend numeric NOT NULL DEFAULT 0,
  impressions integer DEFAULT 0,
  clicks integer DEFAULT 0,
  currency text DEFAULT 'ILS',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_analytics_events_type_created ON public.analytics_events (event_type, created_at);
CREATE INDEX idx_analytics_events_product ON public.analytics_events (product_handle, event_type);
CREATE INDEX idx_analytics_events_session ON public.analytics_events (session_id);
CREATE INDEX idx_ad_spend_date_source ON public.ad_spend (date, source);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_spend ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert events" ON public.analytics_events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can read events" ON public.analytics_events
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage ad_spend" ON public.ad_spend
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
