import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import SweetsHeader from '@/components/sweets/SweetsHeader';
import SweetsFooter from '@/components/sweets/SweetsFooter';
import { BESTSELLERS, SWEETS_CATEGORIES_FULL } from '@/data/sweetsProducts';

export default function SweetsProducts() {
  const { categoryId } = useParams();
  const category = SWEETS_CATEGORIES_FULL.find((c) => c.id === categoryId);
  const title = category ? category.name : 'כל המוצרים';

  const items = useMemo(() => {
    if (!category) return BESTSELLERS;
    return BESTSELLERS.filter((p) => p.category.includes(category.name.split(' ')[0]));
  }, [category]);

  return (
    <div dir="rtl" className="font-sans text-foreground bg-background min-h-screen">
      <Helmet>
        <title>{title} | FullBody מתוקים</title>
        <meta name="description" content={`${title} - חטיפים ומתוקים בריאים ב-FullBody`} />
      </Helmet>
      <SweetsHeader />
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-black text-primary mb-2">{title}</h1>
            {category && <p className="text-muted-foreground">{category.description}</p>}
          </div>

          {/* Category chips */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Link
              to="/sweets/products"
              className={`px-4 py-2 rounded-full text-sm font-bold transition ${!category ? 'bg-primary text-primary-foreground' : 'bg-card border border-border hover:bg-secondary'}`}
            >
              הכל
            </Link>
            {SWEETS_CATEGORIES_FULL.map((c) => (
              <Link
                key={c.id}
                to={c.href}
                className={`px-4 py-2 rounded-full text-sm font-bold transition ${category?.id === c.id ? 'bg-primary text-primary-foreground' : 'bg-card border border-border hover:bg-secondary'}`}
              >
                {c.name}
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {items.map((p) => (
              <Link
                key={p.id}
                to={`/sweets/product/${p.handle}`}
                className="bg-card rounded-xl overflow-hidden border border-border shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all flex flex-col"
              >
                <div className="relative aspect-square bg-white">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
                  {p.badge && (
                    <span className="absolute top-3 right-3 bg-accent text-accent-foreground text-[10px] font-black px-2.5 py-1 rounded-full">
                      {p.badge}
                    </span>
                  )}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-full shadow">
                      {p.proteinG} גרם חלבון
                    </span>
                    <span className="bg-white/95 text-foreground text-[10px] font-bold px-2 py-1 rounded-full shadow">
                      {p.caloriesPerUnit} קלוריות
                    </span>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <p className="text-[10px] uppercase text-muted-foreground font-bold mb-1">{p.category}</p>
                  <h3 className="font-bold text-foreground mb-3 leading-snug line-clamp-2">{p.name}</h3>
                  <div className="mt-auto flex items-baseline gap-2">
                    <span className="text-lg font-black text-primary">₪{p.price}</span>
                    {p.comparePrice && (
                      <span className="text-sm text-muted-foreground line-through">₪{p.comparePrice}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {items.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">מוצרים בקטגוריה זו יעלו בקרוב.</p>
            </div>
          )}
        </div>
      </section>
      <SweetsFooter />
    </div>
  );
}
