import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { proBlogPosts, proBlogCategories, type ProBlogPost, type ProBlogCategory } from '@/data/proBlogPosts';

interface DbBlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string | null;
  category: string;
  category_id: string;
  date: string;
  read_time: number;
  related_product_handles: string[];
  faq: { question: string; answer: string }[];
  meta_description: string;
}

function dbToProBlogPost(db: any): ProBlogPost {
  return {
    id: db.id,
    slug: db.slug,
    title: db.title,
    excerpt: db.excerpt,
    content: db.content,
    image: db.image || 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=450&fit=crop',
    category: db.category,
    categoryId: db.category_id,
    date: db.date,
    readTime: db.read_time,
    relatedProductHandles: db.related_product_handles || [],
    faq: (db.faq as any) || [],
    metaDescription: db.meta_description,
    noindex: db.noindex === true,
  };
}

export function useAllBlogPosts() {
  const { data: dbPosts = [], isLoading } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('date', { ascending: false });
      if (error) throw error;
      return (data || []).map(dbToProBlogPost);
    },
  });

  // Merge: DB posts first (newest), then static posts (deduped by slug)
  const dbSlugs = new Set(dbPosts.map(p => p.slug));
  const staticFiltered = proBlogPosts.filter(p => !dbSlugs.has(p.slug));
  const allPosts = [...dbPosts, ...staticFiltered];

  return { posts: allPosts, isLoading };
}

export function useBlogPostBySlug(slug: string | undefined) {
  const { data: dbPost, isLoading } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      if (!slug) return null;
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .maybeSingle();
      if (error) throw error;
      return data ? dbToProBlogPost(data) : null;
    },
    enabled: !!slug,
  });

  // Fallback to static
  const staticPost = slug ? proBlogPosts.find(p => p.slug === slug) : undefined;
  const post = dbPost || staticPost || undefined;

  return { post, isLoading };
}

export function useAllBlogCategories(posts: ProBlogPost[]): ProBlogCategory[] {
  const categoryIds = new Set(posts.map(p => p.categoryId));
  return proBlogCategories.filter(c => categoryIds.has(c.id));
}

/** Resolve an old (retired/merged) blog slug to its current one for 301-style redirects. */
export function useBlogRedirect(slug: string | undefined, enabled: boolean) {
  const { data, isLoading } = useQuery({
    queryKey: ['blog-redirect', slug],
    queryFn: async () => {
      if (!slug) return null;
      const { data, error } = await supabase
        .from('blog_redirects')
        .select('new_slug')
        .eq('old_slug', slug)
        .maybeSingle();
      if (error) throw error;
      return data?.new_slug ?? null;
    },
    enabled: enabled && !!slug,
  });

  return { redirectTo: data ?? null, isLoading: enabled ? isLoading : false };
}
