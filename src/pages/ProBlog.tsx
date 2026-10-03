import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';
import { proBlogCategories } from '@/data/proBlogPosts';
import { useAllBlogPosts, useAllBlogCategories } from '@/hooks/useBlogPosts';
import ProFooter from '@/components/ProFooter';
import ContentHeader from '@/components/ContentHeader';
import { Skeleton } from '@/components/ui/skeleton';
import { sanitizeClaimText } from '@/lib/blogContent';
import { indexRank, isIndexedSlug, POPULAR_GUIDE_COUNT } from '@/lib/blogIndex';

export default function ProBlog() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { posts: rawPosts, isLoading } = useAllBlogPosts();
  // Indexed articles first (in priority order), then the rest of the archive.
  const allPosts = [...rawPosts].sort((a, b) => indexRank(a.slug) - indexRank(b.slug));
  const popularGuides = allPosts.filter(p => isIndexedSlug(p.slug)).slice(0, POPULAR_GUIDE_COUNT);
  const activeCategories = useAllBlogCategories(allPosts);

  const filteredPosts = selectedCategory === 'all'
    ? allPosts
    : allPosts.filter(p => p.categoryId === selectedCategory);

  return (
    <div dir="rtl" className="font-sans text-foreground bg-background min-h-screen">
      <Helmet>
        <title>בלוג תזונה וכושר | FullBody - מדריכים מקצועיים</title>
        <meta name="description" content="מידע כללי בנושאי תזונה, חלבון, כושר וניהול משקל כחלק מאורח חיים פעיל." />
        <link rel="canonical" href="https://fullbody.co.il/blog" />
        <meta property="og:title" content="בלוג תזונה וכושר | FullBody" />
        <meta property="og:description" content="מאמרים מקצועיים בנושאי תזונה, חלבון, כושר וניהול משקל. טיפים מומחים." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fullbody.co.il/blog" />
        <meta property="og:locale" content="he_IL" />
        <meta property="og:image" content="https://fullbody.co.il/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="בלוג תזונה וכושר | FullBody" />
        <meta name="twitter:description" content="מאמרים מקצועיים בנושאי תזונה, חלבון, כושר וניהול משקל." />
        <meta name="twitter:image" content="https://fullbody.co.il/og-image.jpg" />
      </Helmet>

      <ContentHeader />

      {/* Hero */}
      <section className="bg-[hsl(142,70%,35%)] py-16 text-center text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-black mb-4">בלוג FullBody Pro</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">מאמרים, מדריכים וטיפים בנושאי תזונה, כושר ואורח חיים בריא</p>
        </div>
      </section>

      {popularGuides.length > 0 && (
        <section className="py-10 bg-card border-b border-border" aria-label="המדריכים הפופולריים">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-black text-foreground mb-6 text-center">המדריכים הפופולריים</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularGuides.map(p => (
                <Link key={p.slug} to={`/blog/${p.slug}`} className="group flex gap-3 items-center bg-background rounded-xl border border-border p-3 hover:shadow-hover transition-all">
                  <img src={p.image} alt={p.title} className="w-20 h-14 object-cover rounded-lg shrink-0" loading="lazy" />
                  <span className="font-bold text-sm text-foreground line-clamp-2 group-hover:text-[hsl(142,70%,35%)]">{sanitizeClaimText(p.title)}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="py-8 border-b border-border bg-card">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2">
            <button onClick={() => setSelectedCategory('all')} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${selectedCategory === 'all' ? 'bg-[hsl(142,70%,35%)] text-white' : 'bg-secondary text-muted-foreground hover:text-[hsl(142,70%,35%)]'}`}>
              הכל
            </button>
            {activeCategories.map(cat => (
              <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${selectedCategory === cat.id ? 'bg-[hsl(142,70%,35%)] text-white' : 'bg-secondary text-muted-foreground hover:text-[hsl(142,70%,35%)]'}`}>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading && Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card rounded-xl overflow-hidden border border-border">
                <Skeleton className="aspect-[16/9] w-full" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
            {filteredPosts.map((post, i) => (
              <Link key={post.id} to={`/blog/${post.slug}`} className="group bg-card rounded-xl overflow-hidden border border-border hover:shadow-hover transition-all animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="aspect-[16/9] overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground">
                    <span className="bg-[hsl(142,70%,35%)]/10 text-[hsl(142,70%,35%)] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Tag className="w-3 h-3" />{post.category}
                    </span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(post.date).toLocaleDateString('he-IL')}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime} דק'</span>
                  </div>
                   <h2 className="font-bold text-lg text-foreground mb-2 group-hover:text-[hsl(142,70%,35%)] transition-colors line-clamp-2">{sanitizeClaimText(post.title)}</h2>
                   <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{sanitizeClaimText(post.excerpt)}</p>
                  <span className="text-[hsl(142,70%,35%)] font-bold text-sm flex items-center gap-1">
                    קרא עוד <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
          {filteredPosts.length === 0 && (
            <p className="text-center text-muted-foreground py-12">לא נמצאו מאמרים בקטגוריה זו</p>
          )}
        </div>
      </section>

      <ProFooter />
    </div>
  );
}
