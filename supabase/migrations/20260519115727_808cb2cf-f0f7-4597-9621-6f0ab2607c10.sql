
CREATE TABLE public.recipes (
  id text PRIMARY KEY,
  title text NOT NULL,
  category text NOT NULL CHECK (category IN ('breakfast','mains','desserts','shakes')),
  badges text[] NOT NULL DEFAULT '{}',
  protein integer NOT NULL DEFAULT 0,
  calories integer NOT NULL DEFAULT 0,
  prep_minutes integer NOT NULL DEFAULT 0,
  emoji text NOT NULL DEFAULT '🍽️',
  product_handle text NOT NULL DEFAULT '',
  product_name text NOT NULL DEFAULT '',
  ingredients text[] NOT NULL DEFAULT '{}',
  steps text[] NOT NULL DEFAULT '{}',
  image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published recipes"
  ON public.recipes FOR SELECT
  USING (published = true);

CREATE POLICY "Authenticated users can insert recipes"
  ON public.recipes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update recipes"
  ON public.recipes FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete recipes"
  ON public.recipes FOR DELETE
  TO authenticated
  USING (true);

CREATE TRIGGER update_recipes_updated_at
  BEFORE UPDATE ON public.recipes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_reviews_updated_at();

CREATE INDEX idx_recipes_category_sort ON public.recipes (category, sort_order DESC, created_at DESC);
