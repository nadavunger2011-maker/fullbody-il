CREATE TABLE public.product_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_handle TEXT NOT NULL,
  reviewer_name TEXT NOT NULL,
  reviewer_email TEXT,
  rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT NOT NULL,
  is_verified_purchase BOOLEAN NOT NULL DEFAULT false,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_product_reviews_handle ON public.product_reviews(product_handle) WHERE is_approved = true;
CREATE INDEX idx_product_reviews_pending ON public.product_reviews(created_at DESC) WHERE is_approved = false;

ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a new review (will be unapproved by default)
CREATE POLICY "Anyone can submit reviews"
ON public.product_reviews
FOR INSERT
TO public
WITH CHECK (is_approved = false);

-- Anyone can read approved reviews (no email field exposed via this policy via app)
CREATE POLICY "Anyone can read approved reviews"
ON public.product_reviews
FOR SELECT
TO public
USING (is_approved = true);

-- Service role manages everything (admin via edge functions)
CREATE POLICY "Service role can manage reviews"
ON public.product_reviews
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Updated at trigger
CREATE OR REPLACE FUNCTION public.update_reviews_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_product_reviews_updated_at
BEFORE UPDATE ON public.product_reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_reviews_updated_at();