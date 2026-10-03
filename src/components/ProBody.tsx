import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Calculator, BookOpen, Utensils, Store } from 'lucide-react';
import { useAllBlogPosts } from '@/hooks/useBlogPosts';
import { isIndexedSlug, indexRank, POPULAR_GUIDE_COUNT } from '@/lib/blogIndex';
import { sanitizeClaimText } from '@/lib/blogContent';
import ContentHeader from '@/components/ContentHeader';
import ProFooter from '@/components/ProFooter';

const TITLE = 'FullBody – מדריכי תזונה, חלבון וכושר בגובה העיניים';
const DESCRIPTION = 'טיפים כנים לתזונה מאוזנת, חלבון ואימונים: מדריכים, מתכונים ומחשבון חלבון יומי. בלי הבטחות ובלי דיאטות קיצוניות.';

export default function ProBody() {
  const { posts } = useAllBlogPosts();
  const popular = [...posts].filter(p => isIndexedSlug(p.slug)).sort((a, b) => indexRank(a.slug) - indexRank(b.slug)).slice(0, POPULAR_GUIDE_COUNT);

  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>{TITLE}</title><meta name="description" content={DESCRIPTION} /><link rel="canonical" href="https://fullbody.co.il/" />
        <meta property="og:title" content={TITLE} /><meta property="og:description" content={DESCRIPTION} /><meta property="og:type" content="website" /><meta property="og:url" content="https://fullbody.co.il/" />
        <meta name="twitter:card" content="summary_large_image" /><meta name="twitter:title" content={TITLE} /><meta name="twitter:description" content={DESCRIPTION} />
        <script type="application/ld+json">{JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebSite', name: 'FullBody', url: 'https://fullbody.co.il', description: DESCRIPTION })}</script>
      </Helmet>
      <ContentHeader />

      <main>
        <section className="border-b border-border bg-card py-16 md:py-24">
          <div className="container mx-auto max-w-5xl px-4">
            <p className="mb-4 font-bold text-accent">תזונה וכושר, בלי רעש מסביב</p>
            <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-6xl">מדריכים שעוזרים לאכול, להתאמן ולהבין מה באמת מתאים לכם</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">מידע מעשי בגובה העיניים, מתכונים וכלים חינמיים. בלי הבטחות לתוצאות ובלי דיאטות קיצוניות.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/blog" className="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 font-bold text-accent-foreground">למדריכים <ArrowLeft className="h-4 w-4" /></Link>
              <Link to="/protein-calculator" className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-6 py-3 font-bold">מחשבון חלבון <Calculator className="h-4 w-4" /></Link>
            </div>
          </div>
        </section>

        <section className="py-16" aria-labelledby="popular-heading">
          <div className="container mx-auto px-4">
            <div className="mb-8 flex items-end justify-between gap-4"><div><p className="font-bold text-accent">נקודת התחלה טובה</p><h2 id="popular-heading" className="mt-2 text-3xl font-black">המדריכים הפופולריים</h2></div><Link to="/blog" className="hidden font-bold text-accent sm:inline">כל המדריכים</Link></div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {popular.map(post => <Link key={post.slug} to={`/blog/${post.slug}`} className="group overflow-hidden rounded-md border border-border bg-card transition-shadow hover:shadow-hover"><div className="aspect-[16/9] overflow-hidden"><img src={post.image} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" /></div><div className="p-5"><p className="mb-2 text-xs font-bold text-accent">{post.category}</p><h3 className="text-lg font-black leading-snug">{sanitizeClaimText(post.title)}</h3><p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{sanitizeClaimText(post.excerpt)}</p></div></Link>)}
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-secondary/50 py-16">
          <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-2 lg:items-center">
            <div><div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-md bg-accent text-accent-foreground"><Calculator className="h-6 w-6" /></div><h2 className="text-3xl font-black">מחשבון חלבון יומי</h2><p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">קבלו הערכה מעשית לפי משקל, רמת פעילות ומטרה — ואז ראו איך להגיע לכמות מהמזון הרגיל.</p><Link to="/protein-calculator" className="mt-6 inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 font-bold text-accent-foreground">למחשבון החינמי <ArrowLeft className="h-4 w-4" /></Link></div>
            <div className="grid grid-cols-3 gap-3" aria-hidden="true"><div className="rounded-md border border-border bg-card p-5 text-center"><span className="block text-3xl font-black text-accent">גרם</span><span className="text-sm text-muted-foreground">ליום</span></div><div className="rounded-md border border-border bg-card p-5 text-center"><span className="block text-3xl font-black text-accent">מזון</span><span className="text-sm text-muted-foreground">לפני אבקה</span></div><div className="rounded-md border border-border bg-card p-5 text-center"><span className="block text-3xl font-black text-accent">חינם</span><span className="text-sm text-muted-foreground">ללא הרשמה</span></div></div>
          </div>
        </section>

        <section className="py-16"><div className="container mx-auto grid gap-6 px-4 md:grid-cols-2"><Link to="/recipes" className="group flex min-h-64 flex-col justify-between rounded-md border border-border bg-card p-8 hover:shadow-hover"><Utensils className="h-8 w-8 text-accent" /><div><h2 className="text-3xl font-black">ספר המתכונים</h2><p className="mt-3 text-muted-foreground">רעיונות פשוטים לארוחות, שייקים וקינוחים שאפשר לשלב בשגרה.</p><span className="mt-5 inline-flex items-center gap-2 font-bold text-accent">למתכונים <ArrowLeft className="h-4 w-4" /></span></div></Link><a href="https://shop.fullbody.co.il/?utm_source=blog&utm_medium=home_banner" className="group flex min-h-64 flex-col justify-between rounded-md bg-foreground p-8 text-background"><BookOpen className="h-8 w-8 text-accent" /><div><p className="mb-2 text-sm font-bold text-accent">מתנה לקוראי FullBody</p><h2 className="text-3xl font-black">ספר קינוחי חלבון במתנה</h2><span className="mt-5 inline-flex items-center gap-2 font-bold">לפרטים בחנות <Store className="h-4 w-4" /></span></div></a></div></section>
      </main>
      <ProFooter />
    </div>
  );
}
