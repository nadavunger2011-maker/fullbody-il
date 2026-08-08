CREATE TABLE public.email_sends (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id uuid REFERENCES public.leads(id) ON DELETE CASCADE,
  template text NOT NULL,
  recipient text NOT NULL,
  provider_message_id text,
  status text NOT NULL DEFAULT 'sent',
  error text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.email_sends TO authenticated;
GRANT ALL ON public.email_sends TO service_role;

ALTER TABLE public.email_sends ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read email sends"
ON public.email_sends FOR SELECT TO authenticated USING (true);

CREATE POLICY "Service role can manage email sends"
ON public.email_sends FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE INDEX idx_email_sends_lead_id ON public.email_sends(lead_id);