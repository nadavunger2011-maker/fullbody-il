import React, { useState, useEffect, useCallback } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote, TrendingDown, Users, Award, Heart, Dumbbell, Zap, Leaf } from 'lucide-react';

/* ─── Types ─── */
type TestimonialCategory = 'weight-loss' | 'daily-nutrition' | 'sports';

interface Testimonial {
  name: string;
  age: number;
  quote: string;
  result: string;
  category: TestimonialCategory;
  rating: number;
}

/* ─── Data (extracted from official Herbalife brochure) ─── */
const testimonials: Testimonial[] = [
  {
    name: 'גיל קרן',
    age: 47,
    quote: 'הפחתתי כ-21 ק"ג וצמצמתי כ-70 ס"מ בהיקפים. אני מרגיש הרבה יותר אנרגטי, ערני וקליל. המטרה שלי היא להמשיך עד שאראה קוביות בבטן.',
    result: 'הפחתה של 21 ק"ג',
    category: 'weight-loss',
    rating: 5,
  },
  {
    name: 'הדר כהן',
    age: 28,
    quote: 'הפחתתי 35.5 ק"ג וירדתי 6 מידות מכנסיים, מ-46 ל-36. למדתי לשמור על אורח חיים בריא ופעיל באמצעות שימוש נכון במוצרים והכוונה מהמאמן שלי.',
    result: 'הפחתה של 35.5 ק"ג',
    category: 'weight-loss',
    rating: 5,
  },
  {
    name: 'רחלי ליברמן',
    age: 29,
    quote: 'הפחתתי 25 ק"ג ומעלה מ-14% אחוזי שומן. בעזרת הליווי והמעטפת התומכת שקיבלתי, הגעתי לצמצום משמעותי בהיקפים.',
    result: 'הפחתה של 25 ק"ג',
    category: 'weight-loss',
    rating: 5,
  },
  {
    name: 'יובל לוי',
    age: 24,
    quote: 'ההישגים הם בראש ובראשונה הביטחון שלי, השמחה שלי והסיפוק. קיבלתי את החיים שלי בחזרה, ואני אוהבת שאני עוסקת בתחום שמאפשר לי לעזור לאנשים.',
    result: 'ביטחון וסיפוק',
    category: 'daily-nutrition',
    rating: 5,
  },
  {
    name: 'ספיר מהצרי',
    age: 30,
    quote: 'הפחתתי 28 ק"ג ו-19 אחוזי שומן. האוכל כבר לא אויב שלי, קיבלתי שליטה על החיים שלי והביצועים הספורטיביים השתפרו באופן מדהים.',
    result: 'השינוי הוא גם פנימי',
    category: 'sports',
    rating: 5,
  },
  {
    name: 'רועי חייט',
    age: 21,
    quote: 'הפחתתי 48 ק"ג ו-27 אחוזי שומן. לפני שבחרתי את הדרך, עמדתי בפני ניתוח קיבה. נתתי צ\'אנס להרבלייף ועבד בגדול!',
    result: 'הפחתה של 48 ק"ג',
    category: 'weight-loss',
    rating: 5,
  },
];

const categoryLabels: Record<TestimonialCategory, { label: string; icon: React.ElementType }> = {
  'weight-loss': { label: 'שליטה במשקל', icon: TrendingDown },
  'daily-nutrition': { label: 'תזונה יומית', icon: Leaf },
  'sports': { label: 'ספורט וביצועים', icon: Dumbbell },
};

/* ─── Filtering helpers ─── */
export type TestimonialFilter = TestimonialCategory | 'mix' | 'all';

/** Map an internal product categoryId (or Shopify tag) to a testimonial category. */
export const mapCategoryToTestimonialFilter = (categoryId?: string): TestimonialFilter => {
  if (!categoryId) return 'all';
  const id = categoryId.toLowerCase();
  if (['weight', 'weight-loss', 'weightloss'].includes(id)) return 'weight-loss';
  if (['sport', 'sports', 'fitness', 'h24'].includes(id)) return 'sports';
  if (['vitamins', 'digestion', 'snacks', 'tea', 'supplements', 'daily'].includes(id)) return 'daily-nutrition';
  return 'all';
};

/* The "mix" preset for the homepage — top 3 across categories. */
const MIX_NAMES = ['הדר כהן', 'ספיר מהצרי', 'יובל לוי'];

const getFilteredTestimonials = (filter: TestimonialFilter): Testimonial[] => {
  if (filter === 'mix') return testimonials.filter(t => MIX_NAMES.includes(t.name));
  if (filter === 'all') return testimonials;
  const subset = testimonials.filter(t => t.category === filter);
  return subset.length ? subset : testimonials;
};

/* ─── Testimonial Slider ─── */
const TestimonialSlider = ({ filter = 'all' }: { filter?: TestimonialFilter }) => {
  const list = React.useMemo(() => getFilteredTestimonials(filter), [filter]);
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Reset when filter changes
  useEffect(() => { setCurrent(0); }, [filter]);

  const goTo = useCallback((index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent(index);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating]);

  const next = useCallback(() => goTo((current + 1) % list.length), [current, goTo, list.length]);
  const prev = useCallback(() => goTo((current - 1 + list.length) % list.length), [current, goTo, list.length]);

  useEffect(() => {
    if (list.length <= 1) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, list.length]);

  const t = list[current] ?? list[0];
  if (!t) return null;
  const CatIcon = categoryLabels[t.category].icon;

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-[hsl(142,70%,35%)] font-bold text-sm tracking-widest uppercase">Social Proof</span>
          <h2 className="text-3xl md:text-4xl font-black text-foreground mt-2">סיפורי הצלחה אמיתיים</h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">אנשים אמיתיים, תוצאות אמיתיות — ישירות מתוך הקהילה שלנו</p>
        </div>

        <div className="relative max-w-3xl mx-auto">
          {/* Card */}
          <div
            key={`${filter}-${current}`}
            className="bg-card border border-border rounded-2xl p-8 md:p-12 shadow-sm animate-fade-in"
          >
            {/* Category badge */}
            <div className="flex items-center gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 bg-[hsl(142,70%,35%)]/10 text-[hsl(142,70%,35%)] text-xs font-bold px-3 py-1.5 rounded-full">
                <CatIcon className="w-3.5 h-3.5" />
                {categoryLabels[t.category].label}
              </span>
            </div>

            <Quote className="w-8 h-8 text-[hsl(142,70%,35%)]/20 mb-4" />

            <blockquote className="text-lg md:text-xl leading-relaxed text-foreground mb-6">
              "{t.quote}"
            </blockquote>

            {/* Stars */}
            <div className="flex gap-1 mb-4">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[hsl(45,93%,47%)] text-[hsl(45,93%,47%)]" />
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-foreground">{t.name}, {t.age}</p>
                <p className="text-sm text-[hsl(142,70%,35%)] font-semibold">{t.result}</p>
              </div>
            </div>

            <p className="text-[10px] text-muted-foreground mt-6 border-t border-border pt-4">
              *התוצאות אינן אופייניות. תוצאות אישיות עשויות להשתנות.
            </p>
          </div>

          {/* Nav buttons */}
          <button
            onClick={prev}
            className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-14 w-10 h-10 rounded-full bg-card border border-border shadow-sm flex items-center justify-center hover:bg-secondary transition-colors"
            aria-label="הקודם"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
          <button
            onClick={next}
            className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-14 w-10 h-10 rounded-full bg-card border border-border shadow-sm flex items-center justify-center hover:bg-secondary transition-colors"
            aria-label="הבא"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {list.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${i === current ? 'bg-[hsl(142,70%,35%)] scale-125' : 'bg-border'}`}
                aria-label={`עדות ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ─── Success by the Numbers ─── */
const stats = [
  { value: '35.5', suffix: 'ק"ג', label: 'הפחתה מקסימלית', icon: TrendingDown },
  { value: '6', suffix: '', label: 'סיפורי הצלחה', icon: Users },
  { value: '48', suffix: 'ק"ג', label: 'שיא הפחתה - רועי', icon: Award },
  { value: '19%', suffix: '', label: 'ירידה באחוזי שומן', icon: Heart },
];

const SuccessByNumbers = () => (
  <section className="py-16 bg-card border-y border-border">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-black text-foreground">הצלחה במספרים</h2>
        <p className="text-muted-foreground mt-2">נתונים אמיתיים מלקוחות Herbalife בישראל</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div
            key={i}
            className="text-center p-6 rounded-2xl bg-background border border-border hover:shadow-sm transition-shadow"
          >
            <div className="w-12 h-12 mx-auto mb-4 bg-[hsl(142,70%,35%)]/10 rounded-full flex items-center justify-center text-[hsl(142,70%,35%)]">
              <s.icon className="w-6 h-6" />
            </div>
            <p className="text-3xl md:text-4xl font-black text-foreground">
              {s.value}
              {s.suffix && <span className="text-lg mr-1">{s.suffix}</span>}
            </p>
            <p className="text-sm text-muted-foreground mt-1 font-medium">{s.label}</p>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-muted-foreground text-center mt-8">
        *התוצאות אינן אופייניות. תוצאות אישיות עשויות להשתנות. כל ההפניות לבקרת משקל קשורות לתוכנית ניהול משקל של הרבלייף הכוללת תזונה מאוזנת, פעילות גופנית קבועה, שתיית נוזלים מספקת ומנוחה נאותה.
      </p>
    </div>
  </section>
);

/* ─── Cross-Category Fitness ─── */
const crossCategories: { title: string; description: string; icon: React.ElementType; testimonialNames: string[] }[] = [
  {
    title: 'שליטה במשקל',
    description: 'שייקי Formula 1 ותוספי תזונה לתמיכה בהפחתת משקל בריאה ומבוקרת.',
    icon: TrendingDown,
    testimonialNames: ['גיל קרן', 'הדר כהן', 'רחלי ליברמן', 'רועי חייט'],
  },
  {
    title: 'תזונה יומית וחיוניות',
    description: 'ויטמינים, מינרלים ותוספים לאנרגיה יומית ותחושת חיוניות.',
    icon: Zap,
    testimonialNames: ['יובל לוי'],
  },
  {
    title: 'ספורט וביצועים',
    description: 'קו H24 לספורטאים — חלבון, התאוששות ואנרגיה לביצועים מיטביים.',
    icon: Dumbbell,
    testimonialNames: ['ספיר מהצרי'],
  },
];

const CrossCategoryFitness = () => (
  <section className="py-20 bg-secondary/30">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <span className="text-[hsl(142,70%,35%)] font-bold text-sm tracking-widest uppercase">Cross-Category</span>
        <h2 className="text-3xl md:text-4xl font-black text-foreground mt-2">הצלחה בכל קטגוריה</h2>
        <p className="text-muted-foreground mt-3 max-w-xl mx-auto">מוצרי Herbalife תומכים במגוון מטרות — מהפחתת משקל ועד ביצועים ספורטיביים</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {crossCategories.map((cat, i) => {
          const relatedTestimonials = testimonials.filter(t => cat.testimonialNames.includes(t.name));
          return (
            <div key={i} className="bg-card rounded-2xl p-8 border border-border hover:shadow-sm transition-shadow">
              <div className="w-14 h-14 mb-5 bg-[hsl(142,70%,35%)]/10 rounded-full flex items-center justify-center text-[hsl(142,70%,35%)]">
                <cat.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">{cat.title}</h3>
              <p className="text-sm text-muted-foreground mb-6">{cat.description}</p>

              <div className="space-y-4">
                {relatedTestimonials.map((t, j) => (
                  <div key={j} className="border-t border-border pt-4">
                    <div className="flex items-center gap-1 mb-1">
                      {Array.from({ length: 5 }).map((_, k) => (
                        <Star key={k} className="w-3 h-3 fill-[hsl(45,93%,47%)] text-[hsl(45,93%,47%)]" />
                      ))}
                    </div>
                    <p className="text-sm text-foreground leading-relaxed line-clamp-3">"{t.quote}"</p>
                    <p className="text-xs text-muted-foreground mt-2 font-medium">{t.name}, {t.age} — <span className="text-[hsl(142,70%,35%)]">{t.result}</span></p>
                  </div>
                ))}
              </div>

              <p className="text-[9px] text-muted-foreground mt-4">*התוצאות אינן אופייניות. תוצאות אישיות עשויות להשתנות.</p>
            </div>
          );
        })}
      </div>

      {/* Global disclaimer */}
      <div className="mt-12 text-center p-4 bg-card border border-border rounded-xl">
        <p className="text-xs text-muted-foreground">
          ⚠️ מוצרי Herbalife אינם מיועדים לאבחון, טיפול, ריפוי או מניעה של מחלות כלשהן. תוצאות אישיות עשויות להשתנות. כל ההפניות לבקרת משקל קשורות לתוכנית ניהול משקל של הרבלייף הכוללת, בין היתר, תזונה מאוזנת, פעילות גופנית קבועה, שתיית נוזלים מספקת בכל יום, תוספי תזונה אם צריך ומנוחה נאותה.
        </p>
      </div>
    </div>
  </section>
);

/* ─── Combined Export ─── */
export { TestimonialSlider, SuccessByNumbers, CrossCategoryFitness };
