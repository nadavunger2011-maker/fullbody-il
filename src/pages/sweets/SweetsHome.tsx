import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, CheckCircle, Truck, Leaf, ShieldCheck, Star, Mail } from 'lucide-react';
import SweetsHeader from '@/components/sweets/SweetsHeader';
import SweetsFooter from '@/components/sweets/SweetsFooter';
import { SWEETS_CATEGORIES_FULL, BESTSELLERS } from '@/data/sweetsProducts';
import { toast } from 'sonner';

const TRUST_BADGES = [
  { icon: CheckCircle, title: 'מועשר בחלבון', text: 'עד 20 גרם ליחידה' },
  { icon: Leaf, title: 'מתאים לכל הדיאטות', text: 'קטו, טבעוני, ללא גלוטן' },
  { icon: ShieldCheck, title: 'ללא חומרים משמרים', text: 'רק חומרי גלם אמיתיים' },
  { icon: Truck, title: 'משלוח מהיר', text: '3-5 ימי עסקים' },
];

const PRESS_LOGOS = ['Ynet', 'Mako', 'Calcalist', 'The Marker', 'Globes'];

const TESTIMONIALS = [
  {
    name: 'שירה כ.',
    role: 'מתאמנת קרוספיט',
    text: 'סוף סוף חטיף חלבון שגם טעים וגם לא מטריף את הסוכר. הפכתי לחשוב הבית.',
    rating: 5,
  },
  {
    name: 'עומר ל.',
    role: 'רץ למרחקים ארוכים',
    text: 'העוגיות שיבולת שועל שווה את כל הכסף. אנרגיה נקייה לפני ריצה בבוקר.',
    rating: 5,
  },
  {
    name: 'טל מ.',
    role: 'אמא + כושר',
    text: 'קניתי מארז טעימה למשפחה, הילדים בקטע והאישה שלי מבקשת עוד. WOW.',
    rating: 5,
  },
];

export default function SweetsHome() {
  const [zip, setZip] = useState('');
  const [email, setEmail] = useState('');

  const checkZip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!zip.trim()) return;
    const sharon = ['4', '43', '44', '45', '46', '47'];
    const inArea = sharon.some((p) => zip.startsWith(p));
    if (inArea) toast.success('כן! אנחנו מחלקים באזור שלך - משלוח 30 ש"ח');
    else toast('אנחנו מגיעים בכל הארץ - משלוח סטנדרטי 3-5 ימי עסקים');
  };

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success('נרשמת בהצלחה - שווה לפתוח את המייל 💌');
    setEmail('');
  };

  return (
    <div dir="rtl" className="font-sans text-foreground bg-background min-h-screen">
      <Helmet>
        <title>FullBody מתוקים - חטיפים ומתוקים בריאים עם חלבון | FullBody</title>
        <meta
          name="description"
          content="קו המתוקים של FullBody: חטיפי חלבון, שוקולד ללא סוכר ועוגיות בריאות. חלק מאורח חיים ספורטיבי. משלוח לכל הארץ."
        />
        <link rel="canonical" href="https://fullbody.co.il/sweets" />
      </Helmet>

      <SweetsHeader />

      {/* HERO */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block bg-accent/10 text-accent px-4 py-1.5 rounded-full text-sm font-bold mb-4">
              קו חדש · חלק מאורח החיים של FullBody
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-primary mb-4 leading-tight">
              מתוקים שלא מוותרים על המטרה
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              חטיפי חלבון, שוקולד ועוגיות שהמתאמנים והדיאטנים שלנו מאשרים. פינוק אמיתי, בלי לפגוע בתוצאות.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/sweets/products"
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-bold px-8 py-4 rounded-full shadow-cta transition-all hover:scale-105"
              >
                לחנות המתוקים
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <Link
                to="/sweets/story"
                className="inline-flex items-center gap-2 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-bold px-8 py-4 rounded-full transition-all"
              >
                הסיפור שלנו
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="bg-card border-y border-border py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TRUST_BADGES.map((b, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-2">
                <b.icon className="w-8 h-8 text-accent" />
                <h3 className="font-bold text-sm">{b.title}</h3>
                <p className="text-xs text-muted-foreground">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-10 items-center max-w-5xl mx-auto">
            <div className="order-2 md:order-1">
              <span className="inline-block text-accent font-bold text-sm mb-3">הסיפור שלנו</span>
              <h2 className="text-3xl md:text-4xl font-black text-primary mb-4">
                מ-Shakes ותוספי תזונה, למתוקים שאפשר לאהוב
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                אחרי שנים של ליווי מתאמנים, ספורטאים ואנשים בדרך לגוף טוב יותר, גילינו שהנקודה הכי שוברת בדיאטה
                היא לא האימון - זה הרגע שמתחשק משהו מתוק. אז בנינו קו מתוקים שנשען על אותם עקרונות תזונתיים
                מהם FullBody בנוי: חלבון איכותי, מינימום סוכר, וטעם שמחזיר אותך לעוד ביס.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                אין כאן פשרה בין ״בריא״ ל״טעים״ - זה הליין שאנחנו בעצמנו אוכלים.
              </p>
              <Link to="/sweets/story" className="inline-flex items-center gap-2 mt-6 text-accent font-bold hover:underline">
                לסיפור המלא <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
            <div className="order-1 md:order-2">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-card">
                <img
                  src="https://images.unsplash.com/photo-1583500178690-f7a94a86a4e8?w=800&auto=format&fit=crop"
                  alt="נדב אונגר - FullBody"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRESS */}
      <section className="bg-secondary/40 py-10">
        <div className="container mx-auto px-4">
          <p className="text-center text-xs uppercase tracking-widest text-muted-foreground font-bold mb-6">
            מוזכרים בתקשורת
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14 opacity-60">
            {PRESS_LOGOS.map((logo) => (
              <span key={logo} className="text-lg md:text-2xl font-black text-muted-foreground">
                {logo}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES GRID */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black text-primary mb-3">קנו לפי קטגוריה</h2>
            <p className="text-muted-foreground">בחרו את הפינוק שמתאים לכם</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {SWEETS_CATEGORIES_FULL.map((c) => (
              <Link
                key={c.id}
                to={c.href}
                className="bg-card border border-border rounded-xl p-6 text-center shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all"
              >
                <div className="text-5xl mb-3">{c.emoji}</div>
                <h3 className="font-bold text-foreground mb-1">{c.name}</h3>
                <p className="text-xs text-muted-foreground">{c.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BESTSELLERS */}
      <section className="bg-secondary/40 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-3">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-primary mb-2">הכי נמכרים</h2>
              <p className="text-muted-foreground">המוצרים שהלקוחות שלנו לא מפסיקים להזמין מחדש</p>
            </div>
            <Link to="/sweets/products" className="text-accent font-bold hover:underline flex items-center gap-2">
              כל המוצרים <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {BESTSELLERS.map((p) => (
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
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black text-primary mb-2">מה אומרים עלינו</h2>
            <p className="text-muted-foreground">לקוחות אמיתיים, תגובות אמיתיות</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-6 shadow-card">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, k) => (
                    <Star key={k} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">"{t.text}"</p>
                <div className="border-t border-border pt-4">
                  <p className="font-bold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SHIPPING / ZIP CHECK */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Truck className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-black mb-3">בודקים משלוח לאזור שלכם</h2>
            <p className="text-primary-foreground/80 mb-6">
              משלוח באזור השרון ב-30 ש"ח · משלוח חינם מעל 300 ש"ח · לכל הארץ תוך 3-5 ימי עסקים
            </p>
            <form onSubmit={checkZip} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="text"
                inputMode="numeric"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                placeholder="מיקוד או שם עיר"
                className="flex-1 px-5 py-3 rounded-full text-foreground border-0 focus:outline-none focus:ring-4 focus:ring-accent/40"
              />
              <button
                type="submit"
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold px-6 py-3 rounded-full transition"
              >
                בדקו זמינות
              </button>
            </form>
            <Link to="/sweets/shipping" className="inline-block mt-4 text-sm text-primary-foreground/80 hover:text-primary-foreground underline">
              למדיניות המשלוחים המלאה
            </Link>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center bg-card border border-border rounded-2xl p-8 md:p-12 shadow-card">
            <Mail className="w-10 h-10 text-accent mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-black text-primary mb-2">
              10% הנחה על ההזמנה הראשונה
            </h2>
            <p className="text-muted-foreground mb-6">
              הצטרפו לרשימת הדיוור וקבלו קופון + מתכונים מתוקים במייל
            </p>
            <form onSubmit={subscribe} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="האימייל שלכם"
                className="flex-1 px-5 py-3 rounded-full border border-border focus:outline-none focus:ring-4 focus:ring-accent/30"
              />
              <button
                type="submit"
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold px-6 py-3 rounded-full transition"
              >
                אני בפנים
              </button>
            </form>
          </div>
        </div>
      </section>

      <SweetsFooter />
    </div>
  );
}
