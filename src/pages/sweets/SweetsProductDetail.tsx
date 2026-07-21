import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams, Navigate } from 'react-router-dom';
import {
  Star, Minus, Plus, ChevronDown, Truck, ShieldCheck, Leaf,
  Wheat, Dumbbell, Flame, Clock, ArrowLeft,
} from 'lucide-react';
import SweetsHeader from '@/components/sweets/SweetsHeader';
import SweetsFooter from '@/components/sweets/SweetsFooter';
import { BESTSELLERS } from '@/data/sweetsProducts';
import { toast } from 'sonner';

const ACCORDION = [
  {
    id: 'ingredients',
    title: 'מרכיבים עיקריים',
    body: 'שקדים, קקאו איכותי, חלבון מי גבינה מבוקר, מתוק טבעי (אריתריטול + מונק פרוט), ליבת קקאו, שמן קוקוס, מלח ים אטלנטי, טעם וניל טבעי. ללא סוכר לבן, ללא צבעי מאכל, ללא חומרים משמרים.',
  },
  {
    id: 'nutrition',
    title: 'ערכים תזונתיים ל-100 גרם',
    body: 'אנרגיה: 380 קק"ל · חלבון: 22 גרם · פחמימות: 18 גרם (מתוכן סוכרים: 1.2 גרם) · שומן: 24 גרם (שומן רווי: 8 גרם) · סיבים תזונתיים: 9 גרם · נתרן: 90 מ"ג. מנה אחת (30 גרם) מספקת כ-7 גרם חלבון וכ-114 קק"ל.',
  },
  {
    id: 'storage',
    title: 'הוראות אחסון',
    body: 'לשמור במקום קריר ויבש, מוגן מאור שמש ישיר. לאחר פתיחה מומלץ לשמור במקרר בכלי אטום. הימנעו מטמפרטורות מעל 25°C.',
  },
  {
    id: 'shipping',
    title: 'משלוח והחזרות',
    body: 'משלוח לכל הארץ תוך 3-5 ימי עסקים. אזור השרון ב-30 ש"ח, משלוח חינם מעל 300 ש"ח. אחריות טעם מלאה: לא אהבתם, נחזיר לכם את הכסף.',
  },
];

const HIGHLIGHTS = [
  { icon: Dumbbell, label: 'עשיר בחלבון' },
  { icon: Leaf, label: 'טבעי, ללא צבעי מאכל' },
  { icon: Wheat, label: 'ללא גלוטן' },
  { icon: Flame, label: 'ללא תוספת סוכר' },
];

export default function SweetsProductDetail() {
  const { handle } = useParams();
  const product = BESTSELLERS.find((p) => p.handle === handle);

  const gallery = useMemo(() => {
    if (!product) return [];
    return [
      product.image,
      product.image.replace('w=600', 'w=800'),
      product.image.replace('w=600', 'w=1000'),
    ];
  }, [product]);

  const [mainImage, setMainImage] = useState(0);
  const [flavor, setFlavor] = useState('שוקולד מריר');
  const [qty, setQty] = useState(1);
  const [open, setOpen] = useState<string | null>('ingredients');

  if (!product) return <Navigate to="/sweets/products" replace />;

  const related = BESTSELLERS.filter((p) => p.handle !== product.handle).slice(0, 4);

  const handleAdd = () => {
    toast.success(`${product.name} נוסף לעגלה (${qty})`);
  };

  return (
    <div dir="rtl" className="sweets-theme font-sans text-foreground bg-background min-h-screen">
      <Helmet>
        <title>{`${product.name} | FullBody מתוקים`}</title>
        <meta name="description" content={`${product.name} - ${product.proteinG} גרם חלבון, ${product.caloriesPerUnit} קלוריות. פינוק בריא מקו המתוקים של FullBody.`} />
        <link rel="canonical" href={`https://fullbody.co.il/sweets/product/${product.handle}`} />
      </Helmet>

      <SweetsHeader />

      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-4 text-xs text-muted-foreground">
        <Link to="/sweets" className="hover:text-accent">ראשי</Link>
        <span className="mx-2">›</span>
        <Link to="/sweets/products" className="hover:text-accent">מוצרים</Link>
        <span className="mx-2">›</span>
        <span className="text-foreground">{product.name}</span>
      </div>

      {/* MAIN PDP */}
      <section className="py-4 md:py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-[100px_1fr_1fr] gap-4 md:gap-8 max-w-6xl mx-auto">

            {/* Thumbnails (desktop) */}
            <div className="hidden md:flex flex-col gap-3">
              {gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setMainImage(i)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition ${mainImage === i ? 'border-primary shadow-card' : 'border-border hover:border-primary/50'}`}
                >
                  <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>

            {/* Main image */}
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden bg-white border border-border shadow-card">
                <img src={gallery[mainImage]} alt={product.name} className="w-full h-full object-cover" />
              </div>
              {product.badge && (
                <span className="absolute top-4 right-4 bg-accent text-accent-foreground text-xs font-black px-3 py-1.5 rounded-full shadow">
                  {product.badge}
                </span>
              )}
              {/* Mobile thumbnails */}
              <div className="md:hidden flex gap-2 mt-3">
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setMainImage(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${mainImage === i ? 'border-primary' : 'border-border'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            </div>

            {/* Buy box */}
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-2">{product.category}</p>
              <h1 className="text-3xl md:text-4xl font-black text-foreground mb-3 leading-tight">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">(81 ביקורות)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-black text-primary">₪{product.price}</span>
                {product.comparePrice && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">₪{product.comparePrice}</span>
                    <span className="bg-accent/10 text-accent text-xs font-bold px-2 py-1 rounded-full">
                      חסכון ₪{product.comparePrice - product.price}
                    </span>
                  </>
                )}
              </div>

              {/* Nutrition highlights (icons row) */}
              <div className="grid grid-cols-3 gap-2 bg-secondary/50 rounded-xl p-4 mb-6">
                <div className="text-center">
                  <Dumbbell className="w-5 h-5 text-primary mx-auto mb-1" />
                  <p className="text-lg font-black text-foreground leading-none">{product.proteinG}g</p>
                  <p className="text-[10px] text-muted-foreground mt-1">חלבון</p>
                </div>
                <div className="text-center border-x border-border">
                  <Flame className="w-5 h-5 text-primary mx-auto mb-1" />
                  <p className="text-lg font-black text-foreground leading-none">{product.caloriesPerUnit}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">קלוריות</p>
                </div>
                <div className="text-center">
                  <Clock className="w-5 h-5 text-primary mx-auto mb-1" />
                  <p className="text-lg font-black text-foreground leading-none">30g</p>
                  <p className="text-[10px] text-muted-foreground mt-1">גודל מנה</p>
                </div>
              </div>

              {/* Highlights chips */}
              <div className="flex flex-wrap gap-2 mb-6">
                {HIGHLIGHTS.map((h, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 bg-primary/5 border border-primary/20 text-primary text-xs font-bold px-3 py-1.5 rounded-full">
                    <h.icon className="w-3.5 h-3.5" /> {h.label}
                  </span>
                ))}
              </div>

              {/* Flavor selector */}
              <div className="mb-5">
                <p className="text-sm font-bold text-foreground mb-2">כמות יחידות / טעם</p>
                <div className="flex flex-wrap gap-2">
                  {['שוקולד מריר', 'שוקולד חלב', 'וניל'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFlavor(f)}
                      className={`px-4 py-2 rounded-full text-sm font-bold border-2 transition ${
                        flavor === f
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-card text-foreground border-border hover:border-primary'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity + CTA */}
              <div className="flex items-stretch gap-3 mb-4">
                <div className="flex items-center border-2 border-border rounded-full">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-12 flex items-center justify-center text-foreground hover:text-primary" aria-label="הפחת">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-bold">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="w-10 h-12 flex items-center justify-center text-foreground hover:text-primary" aria-label="הוסף">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={handleAdd}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-full shadow-cta transition-all hover:scale-[1.02]"
                >
                  הוספה לסל · ₪{product.price * qty}
                </button>
              </div>

              {/* Trust row */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Truck className="w-4 h-4 text-primary" /> משלוח 3-5 ימי עסקים
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="w-4 h-4 text-primary" /> אחריות טעם מלאה
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ACCORDIONS */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-card">
            {ACCORDION.map((item, i) => {
              const isOpen = open === item.id;
              return (
                <div key={item.id} className={i > 0 ? 'border-t border-border' : ''}>
                  <button
                    onClick={() => setOpen(isOpen ? null : item.id)}
                    className="w-full flex items-center justify-between px-6 py-5 text-right hover:bg-secondary/40 transition"
                  >
                    <span className="font-bold text-foreground">{item.title}</span>
                    <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 text-muted-foreground leading-relaxed">{item.body}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* LIFESTYLE BANNER */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="relative rounded-3xl overflow-hidden shadow-card">
            <img
              src="https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=1600&auto=format&fit=crop"
              alt="פינוק שוקולד FullBody"
              className="w-full h-72 md:h-96 object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-primary/90 via-primary/60 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-md p-8 md:p-12 text-primary-foreground">
                <h2 className="text-3xl md:text-4xl font-black mb-3 leading-tight">
                  פינוק בריא, בלי אשמה
                </h2>
                <p className="text-primary-foreground/90 leading-relaxed">
                  כל חטיף שלנו נוסח יחד עם דיאטנים ומתאמנים. אותו הטעם של פינוק אמיתי, בלי הסוכר, בלי החרטות.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS TEASER */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-primary mb-1">לקוחות מספרות</h2>
              <div className="flex items-center gap-2">
                <div className="flex">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-4 h-4 fill-accent text-accent" />)}</div>
                <span className="text-sm text-muted-foreground">4.9 · 81 ביקורות</span>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { name: 'שירה כ.', text: 'ממש טעים, אני קונה כל חודש. הילדים מתחננים.', rating: 5 },
              { name: 'עומר ל.', text: 'הכי טוב שאכלתי בקטגוריה. חלבון גבוה בלי טעם מוזר.', rating: 5 },
              { name: 'טל מ.', text: 'סוף סוף פינוק בריא בלי לוותר על הטעם.', rating: 5 },
            ].map((r, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-5 shadow-card">
                <div className="flex mb-2">{Array.from({ length: r.rating }).map((_, k) => <Star key={k} className="w-4 h-4 fill-accent text-accent" />)}</div>
                <p className="text-muted-foreground leading-relaxed mb-3">"{r.text}"</p>
                <p className="font-bold text-foreground text-sm">{r.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* YOU MIGHT LIKE */}
      <section className="py-12 bg-secondary/40">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
            <h2 className="text-2xl md:text-3xl font-black text-primary">חשבנו שתאהבו גם</h2>
            <Link to="/sweets/products" className="text-accent font-bold hover:underline flex items-center gap-1">
              כל המוצרים <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p) => (
              <Link
                key={p.id}
                to={`/sweets/product/${p.handle}`}
                className="bg-card rounded-xl overflow-hidden border border-border shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all flex flex-col"
              >
                <div className="relative aspect-square bg-white">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
                  {p.badge && (
                    <span className="absolute top-3 right-3 bg-accent text-accent-foreground text-[10px] font-black px-2.5 py-1 rounded-full">{p.badge}</span>
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-bold text-foreground mb-3 leading-snug line-clamp-2 text-sm">{p.name}</h3>
                  <div className="mt-auto flex items-baseline gap-2">
                    <span className="text-lg font-black text-primary">₪{p.price}</span>
                    {p.comparePrice && <span className="text-sm text-muted-foreground line-through">₪{p.comparePrice}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SweetsFooter />
    </div>
  );
}
