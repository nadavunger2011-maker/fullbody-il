CREATE TABLE IF NOT EXISTS public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  goal text,
  gender text,
  age int,
  height numeric,
  weight numeric,
  activity numeric,
  days int,
  kosher boolean,
  flavor text,
  target_calories int,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES public.leads(id) ON DELETE CASCADE,
  form_data jsonb,
  results_data jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.leads TO anon, authenticated;
GRANT INSERT ON public.plans TO anon, authenticated;
GRANT SELECT ON public.leads TO authenticated;
GRANT SELECT ON public.plans TO authenticated;
GRANT ALL ON public.leads TO service_role;
GRANT ALL ON public.plans TO service_role;

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a lead" ON public.leads FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can submit a plan" ON public.plans FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can read leads" ON public.leads FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read plans" ON public.plans FOR SELECT TO authenticated USING (true);