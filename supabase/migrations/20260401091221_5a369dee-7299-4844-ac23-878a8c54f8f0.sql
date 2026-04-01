
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  image TEXT,
  category TEXT NOT NULL,
  category_id TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  read_time INTEGER NOT NULL DEFAULT 5,
  related_product_handles TEXT[] DEFAULT '{}',
  faq JSONB DEFAULT '[]',
  meta_description TEXT NOT NULL,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published posts"
ON public.blog_posts FOR SELECT
TO public
USING (published = true);

CREATE POLICY "Service role can manage posts"
ON public.blog_posts FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_posts_category_id ON public.blog_posts(category_id);
CREATE INDEX idx_blog_posts_date ON public.blog_posts(date DESC);
