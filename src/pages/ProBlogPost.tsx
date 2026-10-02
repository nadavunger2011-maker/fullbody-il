import { shopProductUrl } from '@/lib/shopLinks';
import { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calendar, Clock, ArrowRight, Tag, Menu, X, ShoppingBag } from 'lucide-react';
import { proBlogCategories } from '@/data/proBlogPosts';
import { useBlogPostBySlug, useBlogRedirect, useAllBlogPosts } from '@/hooks/useBlogPosts';
import { BLOG_DUPLICATE_REDIRECTS, isIndexedSlug, indexRank } from '@/lib/blogIndex';
import { BUSINESS } from '@/lib/business';
import { getProductByHandle, herbalifeProducts, HerbalifeProduct } from '@/data/herbalifeProducts';
import greenLogo from '@/assets/logo-green.webp';
import ProFooter from '@/components/ProFooter';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { normalizeBlogContent, splitContentByH2, pickContextualProducts, appendDisclaimer, sanitizeClaimText } from '@/lib/blogContent';
import BlogProductCard from '@/components/BlogProductCard';
import BlogCTAWidget from '@/components/BlogCTAWidget';

export default function ProBlogPost() {
  const { slug } = useParams();
  const duplicateOf = slug ? BLOG_DUPLICATE_REDIRECTS[slug] : undefined;
  useEffect(() => {
    if (duplicateOf) window.location.replace(`/blog/${duplicateOf}`);
  }, [duplicateOf]);
  if (duplicateOf) {
    return (
      <Helmet>
        <link rel="canonical" href={`https://fullbody.co.il/blog/${duplicateOf}`} />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
    );
  }
  return <ProBlogPostInner />;
}

function ProBlogPostInner() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { post, isLoading } = useBlogPostBySlug(slug);
  const { posts: allPosts } = useAllBlogPosts();
  const { redirectTo, isLoading: redirectLoading } = useBlogRedirect(slug, !isLoading && !post);

  useEffect(() => {
    if (isLoading || post) return;
    if (redirectTo) {
      window.location.replace(redirectTo === 'blog' ? '/blog' : `/blog/${redirectTo}`);
      return;
    }
    if (!redirectLoading) navigate('/blog', { replace: true });
  }, [post, isLoading, redirectTo, redirectLoading, navigate]);

  if (isLoading || redirectLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><Skeleton className="w-32 h-8" /></div>;
  if (!post) return null;

  const normalizedContent = normalizeBlogContent(post.content);
  const contentChunks = splitContentByH2(normalizedContent);
  const midIndex = Math.max(1, Math.floor(contentChunks.length / 2));
  const articleImage = post.image || '/placeholder.svg';
  const category = proBlogCategories.find(c => c.id === post.categoryId);
  const relatedProducts = getMinimumRelatedProducts(post.relatedProductHandles, post.categoryId, 3);
  const inlineProducts = pickContextualProducts(normalizedContent, post.relatedProductHandles, 2);
  const indexed = isIndexedSlug(post.slug);
  const relatedArticles = indexed
    ? allPosts
        .filter(p => p.slug !== post.slug && isIndexedSlug(p.slug) && p.categoryId === post.categoryId)
        .sort((a, b) => indexRank(a.slug) - indexRank(b.slug))
        .slice(0, 3)
    : [];
  const modified = ((post as { updatedAt?: string }).updatedAt || post.date).slice(0, 10);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: sanitizeClaimText(post.title),
    description: sanitizeClaimText(post.metaDescription),
    image: articleImage,
    datePublished: post.date,
    dateModified: modified,
    author: { '@type': 'Person', name: BUSINESS.owner, url: 'https://fullbody.co.il/about' },
    publisher: { '@type': 'Organization', name: 'FullBody', url: 'https://fullbody.co.il', logo: { '@type': 'ImageObject', url: 'https://fullbody.co.il/favicon.png' } },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://fullbody.co.il/blog/${post.slug}` },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: post.faq.map(f => ({
      '@type': 'Question',
       name: sanitizeClaimText(f.question),
       acceptedAnswer: { '@type': 'Answer', text: sanitizeClaimText(f.answer) },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'ראשי', item: 'https://fullbody.co.il/' },
      { '@type': 'ListItem', position: 2, name: 'בלוג', item: 'https://fullbody.co.il/blog' },
      { '@type': 'ListItem', position: 3, name: post.title, item: `https://fullbody.co.il/blog/${post.slug}` },
    ],
  };

  return (
    <div dir="rtl" className="font-sans text-foreground bg-background min-h-screen">
      <Helmet>
         <title>{sanitizeClaimText(post.title)} | FullBody</title>
         <meta name="description" content={sanitizeClaimText(post.metaDescription)} />
        <link rel="canonical" href={`https://fullbody.co.il/blog/${post.slug}`} />
        {!indexed && <meta name="robots" content="noindex, follow" />}
         <meta property="og:title" content={sanitizeClaimText(post.title)} />
         <meta property="og:description" content={sanitizeClaimText(post.metaDescription)} />
        <meta property="og:image" content={articleImage} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://fullbody.co.il/blog/${post.slug}`} />
        <meta property="og:locale" content="he_IL" />
        <meta property="article:published_time" content={post.date} />
        <meta name="twitter:card" content="summary_large_image" />
         <meta name="twitter:title" content={sanitizeClaimText(post.title)} />
         <meta name="twitter:description" content={sanitizeClaimText(post.metaDescription)} />
        <meta name="twitter:image" content={articleImage} />
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        {post.faq.length > 0 && <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>}
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <div className="bg-[hsl(142,70%,35%)] text-white text-center py-2.5 text-sm font-medium">
        מוצרי Herbalife מקוריים | משלוח חינם מעל ₪299
      </div>

      <header className="sticky top-0 z-40 bg-card shadow-card border-b border-border">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-muted-foreground"><Menu className="w-6 h-6" /></button>
          <Link to="/"><img src={greenLogo} alt="FullBody Pro" className="h-14 md:h-16 w-auto" /></Link>
          <nav className="hidden lg:flex items-center gap-8 font-bold text-muted-foreground">
            <Link to="/" className="hover:text-accent transition-colors">ראשי</Link>
            <a href="/#products" className="hover:text-accent transition-colors">מוצרים</a>
            <Link to="/blog" className="text-[hsl(142,70%,35%)]">מאמרים</Link>
            <Link to="/contact" className="hover:text-accent transition-colors">צור קשר</Link>
          </nav>
          <a href="https://shop.fullbody.co.il" className="p-2 text-muted-foreground" aria-label="לחנות"><ShoppingBag className="w-6 h-6" /></a>
        </div>
      </header>

      {isMobileMenuOpen && <div onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-foreground/50 z-40" />}
      <div className={`fixed inset-y-0 right-0 w-72 bg-card shadow-hover z-50 flex flex-col pt-20 px-6 transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-5 left-5"><X className="w-6 h-6" /></button>
        <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="py-4 border-b border-border text-lg font-bold">ראשי</Link>
        <a href="/#products" onClick={() => setIsMobileMenuOpen(false)} className="py-4 border-b border-border text-lg font-bold">מוצרים</a>
        <Link to="/blog" onClick={() => setIsMobileMenuOpen(false)} className="py-4 border-b border-border text-lg font-bold text-[hsl(142,70%,35%)]">מאמרים</Link>
        <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="py-4 border-b border-border text-lg font-bold">צור קשר</Link>
      </div>


      <div className="bg-secondary border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-[hsl(142,70%,35%)]">ראשי</Link>
            <ArrowRight className="w-4 h-4" />
            <Link to="/blog" className="hover:text-[hsl(142,70%,35%)]">בלוג</Link>
            <ArrowRight className="w-4 h-4" />
            <span className="text-foreground font-medium truncate max-w-[200px]">{post.title}</span>
          </div>
        </div>
      </div>

      <section className="relative">
        <div className="aspect-[21/9] max-h-[400px] overflow-hidden">
          <img
            src={articleImage}
            alt={post.title}
            className="w-full h-full object-cover"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = '/placeholder.svg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
        </div>
        <div className="container mx-auto px-4">
          <div className="relative -mt-32 bg-card rounded-t-2xl p-6 sm:p-10 max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <span className="bg-[hsl(142,70%,35%)] text-white text-sm font-bold px-4 py-1.5 rounded-full flex items-center gap-2">
                <Tag className="w-4 h-4" />{category?.name}
              </span>
              <span className="flex items-center gap-1 text-muted-foreground"><Calendar className="w-4 h-4" />{new Date(post.date).toLocaleDateString('he-IL')}</span>
              <span className="flex items-center gap-1 text-muted-foreground"><Clock className="w-4 h-4" />{post.readTime} דקות קריאה</span>
            </div>
             <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground leading-tight">{sanitizeClaimText(post.title)}</h1>
          </div>
        </div>
      </section>

      <article className="pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-card rounded-b-2xl p-6 sm:p-10 -mt-1">
            <div className="blog-content prose prose-lg max-w-none text-foreground prose-headings:text-foreground prose-headings:font-bold prose-h1:text-4xl prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-p:text-foreground prose-p:leading-relaxed prose-p:mb-4 prose-ul:text-foreground prose-li:my-1 prose-strong:text-foreground">
              {contentChunks.map((chunk, i) => (
                <div key={i}>
                  <div dangerouslySetInnerHTML={{ __html: chunk }} />
                  {i === midIndex - 1 && inlineProducts.map(p => (
                    <BlogProductCard key={p.handle} product={p} variant="inline"  />
                  ))}
                  {i === Math.min(1, contentChunks.length - 1) && (
                    <BlogCTAWidget variant="inline" source={post.slug} />
                  )}
                </div>
              ))}
              <BlogCTAWidget
                variant="conclusion"
                source={post.slug}
                title="סיימת לקרוא? עכשיו תורך ליישם"
                description="קבל תוכנית תזונה ואימונים אישית, מבוססת על הנתונים שלך, בלי לנחש."
                buttonText="קבל את התוכנית שלי"
              />
              <div dangerouslySetInnerHTML={{ __html: appendDisclaimer('') }} />
              <aside className="mt-8 p-5 rounded-xl border border-border bg-secondary/40" aria-label="על הכותב">
                <p className="font-bold text-foreground mb-1">על הכותב</p>
                <p className="text-sm text-muted-foreground">
                  {BUSINESS.owner}, מפיץ עצמאי מורשה של Herbalife.{' '}
                  <Link to="/about" className="font-bold text-[hsl(142,70%,35%)] hover:underline">עוד עליי</Link>
                </p>
              </aside>
            </div>
          </div>
        </div>
      </article>

      {post.faq.length > 0 && (
        <section className="py-12 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-black text-foreground mb-6 text-center">שאלות ותשובות</h2>
              <div className="space-y-3">
                {post.faq.map((item, i) => (
                  <details key={i} className="bg-card border border-border rounded-xl group">
                    <summary className="px-6 py-4 cursor-pointer font-bold text-foreground flex items-center justify-between list-none">
                       {sanitizeClaimText(item.question)}
                      <ChevronIcon />
                    </summary>
                     <div className="px-6 pb-4 text-muted-foreground">{sanitizeClaimText(item.answer)}</div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {relatedProducts.length > 0 && (
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-black text-foreground mb-8 text-center">מוצרים מומלצים מהמאמר</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {relatedProducts.map((product, i) => (
                  <div key={product.sku} className="group bg-card rounded-xl overflow-hidden border border-border hover:shadow-hover transition-all animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                    <Link to={shopProductUrl(product.shopifyHandle)}>
                      <div className="aspect-square overflow-hidden bg-secondary/20 flex items-center justify-center p-4">
                        <img src={product.image} alt={product.title} className="max-w-[75%] max-h-[75%] object-contain group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      </div>
                    </Link>
                    <div className="p-3">
                      <Link to={shopProductUrl(product.shopifyHandle)}>
                        <h3 className="font-bold text-sm text-foreground mb-1 group-hover:text-[hsl(142,70%,35%)] transition-colors line-clamp-2">{product.title}</h3>
                      </Link>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-black text-lg text-foreground">₪{product.price}</span>
                      </div>
                      <a href={shopProductUrl(product.shopifyHandle)} className="w-full bg-[hsl(142,70%,35%)] text-white font-bold py-2 text-sm rounded-lg transition-all hover:opacity-90 flex items-center justify-center gap-1">
                        לצפייה בחנות <ShoppingBag className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {relatedArticles.length > 0 && (
        <section className="py-12 bg-secondary/30" aria-label="מאמרים קשורים">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-black text-foreground mb-6 text-center">מאמרים קשורים</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedArticles.map(a => (
                  <Link key={a.slug} to={`/blog/${a.slug}`} className="group bg-card rounded-xl overflow-hidden border border-border hover:shadow-hover transition-all">
                    <div className="aspect-[16/9] overflow-hidden"><img src={a.image} alt={a.title} className="w-full h-full object-cover" loading="lazy" /></div>
                    <p className="p-4 font-bold text-sm text-foreground line-clamp-2 group-hover:text-[hsl(142,70%,35%)]">{sanitizeClaimText(a.title)}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="py-8">
        <div className="container mx-auto px-4 text-center">
          <Link to="/blog" className="inline-flex items-center gap-2 text-[hsl(142,70%,35%)] font-bold hover:gap-3 transition-all">
            <ArrowRight className="w-5 h-5" />חזרה לכל המאמרים
          </Link>
        </div>
      </section>

      <BlogCTAWidget variant="sticky" source={post.slug} />
      <div className="h-20 lg:hidden" />
      <ProFooter />
    </div>
  );
}

const FALLBACK_PRODUCTS_BY_CATEGORY: Record<string, string[]> = {
  nutrition: ['formula-1-vanilla', 'pdm-protein', 'aloe-natural'],
  weight: ['formula-1-vanilla', 'formula-1-chocolate', 'pdm-protein'],
  fitness: ['pdm-protein', 'h24-rebuild-strength', 'formula-1-chocolate'],
  recipes: ['formula-1-vanilla', 'pdm-protein', 'aloe-mango'],
  wellness: ['niteworks', 'aloe-natural', 'formula-1-kosher'],
};

/** Always surface at least `min` real product links inside every article. */
function getMinimumRelatedProducts(handles: string[], categoryId: string, min = 3): HerbalifeProduct[] {
  const picked: HerbalifeProduct[] = [];
  const seen = new Set<string>();
  const push = (handle?: string) => {
    if (!handle || seen.has(handle)) return;
    const product = getProductByHandle(handle);
    if (!product) return;
    seen.add(handle);
    picked.push(product);
  };
  handles.forEach(push);
  (FALLBACK_PRODUCTS_BY_CATEGORY[categoryId] || FALLBACK_PRODUCTS_BY_CATEGORY.nutrition).forEach(h => {
    if (picked.length < min) push(h);
  });
  herbalifeProducts.forEach(p => { if (picked.length < min) push(p.handle); });
  return picked;
}

function ChevronIcon() {
  return (
    <svg className="w-5 h-5 text-muted-foreground transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}
