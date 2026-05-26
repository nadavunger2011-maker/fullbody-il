import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ShoppingBag, Check, Shield, Truck, Award, Loader2, ChevronDown, Star, Gift, FileText, ClipboardList, Flame, Dumbbell, Zap } from "lucide-react";
import { getProductByHandle } from "@/data/herbalifeProducts";
import { useCartStore } from "@/stores/cartStore";
import { fetchProductByHandle, getFirstAvailableVariant } from "@/lib/shopify";
import { toast } from "sonner";
import CartDrawer from "@/components/CartDrawer";

type StackItem = {
  key: "vanilla" | "chocolate" | "pdm";
  handle: string;
  title: string;
  subtitle: string;
};

const ITEMS: StackItem[] = [
  { key: "vanilla", handle: "formula-1-vanilla", title: "Formula 1 וניל פרימיום", subtitle: "בסיס מתוק נייטרלי לקינוחים אנבוליים" },
  { key: "chocolate", handle: "formula-1-chocolate", title: "Formula 1 שוקולד פרימיום", subtitle: "תחושת מוס שוקולד מושחת, בלי סוכר" },
  { key: "pdm", handle: "pdm-protein", title: "Protein Drink Mix (PDM)", subtitle: "+15g חלבון נוסף, מעבה ומחזק טקסטורה" },
];

const PAIN_POINTS = [
  "נמאס לך מחזה עוף יבש שנתקע בגרון?",
  "אין לך זמן לבשל 3 שעות ביום כדי להגיע ליעד?",
  "אתה מתקשה להגיע ל-150 גרם חלבון ביום בלי להרגיש רעב?",
  "כל דיאטה נגמרת באותו מקום: חשק עז למתוק שמפיל אותך?",
];

const BONUSES = [
  { icon: FileText, title: "מדריך הקינוחים המושחתים של FullBody (PDF)", desc: "20 מתכונים מדודים: גלידות, מוסים, פנקייקים, סופלה. הכל בפחות מ-5 דקות.", value: "₪149" },
  { icon: ClipboardList, title: "תוכנית תזונה מותאמת אישית", desc: "חישוב מדויק של יעדי חלבון וקלוריות לפי המטרה שלך, חיטוב או מסה.", value: "₪199" },
  { icon: Gift, title: "שייקר פרימיום במתנה", desc: "שייקר 700 מ\"ל עם רשת ערבוב פנימית, מגיע אוטומטית עם הערכה.", value: "₪59" },
];

const TESTIMONIALS = [
  { name: "יונתן ל.", category: "Performance", text: "סוגר 180 גרם חלבון ביום בלי לשבור את התפריט. הסופלה אחרי אימון הפך לטקס." },
  { name: "רוני ש.", category: "Results", text: "ירדתי 7 ק\"ג חיטוב תוך 11 שבועות. בלי דיאטות מטופשות, בלי לוותר על משהו מתוק." },
  { name: "אדם ק.", category: "Performance", text: "אימוני כוח 5 פעמים בשבוע, הפלטו נשבר. ההתאוששות בין אימונים מורגשת אחרת לגמרי." },
];

const WHY_STACK = [
  { icon: Flame, tag: "דלק", title: "פורמולה 1", desc: "אנרגיה נקייה לאורך כל היום, בלי קריסות סוכר." },
  { icon: Dumbbell, tag: "בנייה", title: "PDM", desc: "חלבון איכותי לבנייה, התאוששות ושימור מסה." },
  { icon: Zap, tag: "הכנה", title: "שייקר FullBody", desc: "מהירות מקסימלית - שייק מושלם ב-10 שניות." },
];

const FAQ = [
  { q: "האם המוצרים כשרים?", a: "כן. מוצרי הרבלייף שבערכה מאושרים ע\"י בד\"ץ העדה החרדית." },
  { q: "תוך כמה זמן המשלוח מגיע?", a: "משלוח עד הבית בכל הארץ תוך 1-3 ימי עסקים. אפשרות איסוף עצמי ברעננה." },
  { q: "מה כולל ה-Starter Stack?", a: "Formula 1 וניל, Formula 1 שוקולד, ו-Protein Drink Mix (PDM). בנוסף: שייקר פרימיום, מדריך קינוחים PDF ותוכנית תזונה מותאמת." },
  { q: "האם יש מדיניות החזרים?", a: "כן. החזר מלא תוך 30 יום, כל עוד המוצר לא נפתח. ראה מדיניות החזרים בפוטר." },
  { q: "האם אני יכול לשלב עם דיאטה קיימת?", a: "בהחלט. הערכה משתלבת בכל תפריט. תוכנית התזונה המותאמת תעזור להתאים את הכמויות ליעדים שלך." },
  { q: "כמה זמן מחזיקה הערכה?", a: "כ-30 ימי שימוש בתפריט מלא של 150 גרם חלבון ביום." },
];

const BUNDLE_DISCOUNT = 0.15;

export default function StarterStack() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [selected, setSelected] = useState<Record<StackItem["key"], boolean>>({
    vanilla: true,
    chocolate: true,
    pdm: true,
  });

  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const selectedItems = useMemo(() => ITEMS.filter((it) => selected[it.key]), [selected]);
  const allThree = selectedItems.length === 3;

  const pricing = useMemo(() => {
    const original = selectedItems.reduce((sum, it) => sum + (getProductByHandle(it.handle)?.price || 0), 0);
    const discount = allThree ? BUNDLE_DISCOUNT : 0;
    const final = Math.round(original * (1 - discount));
    return { original: Math.round(original), final, savings: Math.round(original - final) };
  }, [selectedItems, allThree]);

  const toggle = (k: StackItem["key"]) =>
    setSelected((s) => ({ ...s, [k]: !s[k] }));

  const handleAdd = async () => {
    if (selectedItems.length === 0) {
      toast.error("בחרו לפחות מוצר אחד");
      return;
    }
    setAdding(true);
    try {
      let added = 0;
      for (const it of selectedItems) {
        const local = getProductByHandle(it.handle);
        if (!local) continue;
        const sp = await fetchProductByHandle(local.shopifyHandle);
        if (!sp) continue;
        const variant = getFirstAvailableVariant(sp);
        if (!variant) continue;
        const ok = await addItem({
          product: sp,
          variantId: variant.id,
          variantTitle: variant.title,
          price: variant.price,
          quantity: 1,
          selectedOptions: variant.selectedOptions || [],
          bundleId: allThree ? "starter-stack" : undefined,
          bundleTitle: allThree ? "FullBody Starter Stack" : undefined,
          bundleDiscountPct: allThree ? 15 : 0,
        });
        if (ok) added++;
      }
      if (added > 0) {
        toast.success("נוסף לעגלה!", { description: allThree ? "הנחת ערכה 15% תופעל בקופה." : undefined });
        setIsCartOpen(true);
      } else {
        toast.error("לא הצלחנו להוסיף, נסו שוב");
      }
    } finally {
      setAdding(false);
    }
  };

  useEffect(() => {
    document.documentElement.classList.add("dark-stack-page");
    return () => document.documentElement.classList.remove("dark-stack-page");
  }, []);

  const GOLD = "#D4AF37";

  return (
    <div dir="rtl" className="min-h-screen bg-black text-white antialiased selection:bg-[#D4AF37] selection:text-black">
      <Helmet>
        <title>FullBody Starter Stack - 150g חלבון ביום מקינוחים מושחתים</title>
        <meta name="description" content="ערכת ההתחלה של FullBody: 150g חלבון ביום ב-5 דקות הכנה. Formula 1 וניל + שוקולד + PDM. 15% הנחה אוטומטית + שייקר פרימיום מתנה." />
        <link rel="canonical" href="https://fullbody.co.il/starter-stack" />
      </Helmet>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-black/85 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link to="/" className="text-sm font-extrabold tracking-[0.2em]">FULLBODY</Link>
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-white/80 hover:text-white"
            aria-label="עגלה"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -left-1 text-black text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center" style={{ background: GOLD }}>
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-40" style={{ background: `radial-gradient(ellipse at 50% 0%, ${GOLD}22, transparent 55%)` }} />
        <div className="max-w-6xl mx-auto px-5 pt-14 pb-10 md:pt-24 md:pb-16 text-center relative">
          <span className="inline-block text-[11px] tracking-[0.3em] uppercase mb-6" style={{ color: GOLD }}>The Lazy Protocol</span>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black leading-[1.15] max-w-4xl mx-auto">
            150 גרם חלבון ביום מקינוחים מושחתים -
            <span className="block font-bold mt-3" style={{ color: GOLD }}>הדרך הקלה לחיטוב שחשבת שבלתי אפשרי.</span>
          </h1>
          <p className="mt-6 text-base md:text-lg text-white/65 max-w-2xl mx-auto leading-relaxed">
            בלי להעביר שעות במטבח. בלי להרגיש רעב. השיטה המדעית של FullBody להשגת תוצאות שיא במינימום מאמץ.
          </p>

          {/* Product visual 1:1 */}
          <div className="mt-10 md:mt-12 grid grid-cols-3 gap-3 md:gap-6 max-w-3xl mx-auto">
            {ITEMS.map((it) => {
              const p = getProductByHandle(it.handle);
              return (
                <div key={it.key} className="aspect-square rounded-2xl bg-gradient-to-b from-white/[0.05] to-transparent border border-white/10 p-4 flex items-center justify-center overflow-hidden">
                  {p?.image && (
                    <img
                      src={p.image}
                      alt={p.title}
                      width={400}
                      height={400}
                      className="max-h-full max-w-full object-contain"
                      loading="eager"
                      decoding="async"
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="hidden md:flex items-center justify-center gap-2 mt-8 text-xs text-white/50">
            <Star className="w-4 h-4 fill-current" style={{ color: GOLD }} />
            <Star className="w-4 h-4 fill-current" style={{ color: GOLD }} />
            <Star className="w-4 h-4 fill-current" style={{ color: GOLD }} />
            <Star className="w-4 h-4 fill-current" style={{ color: GOLD }} />
            <Star className="w-4 h-4 fill-current" style={{ color: GOLD }} />
            <span className="mr-2">מעל 4,800 ספורטאים פעילים</span>
          </div>
        </div>
      </section>

      {/* PROBLEM & AGITATION */}
      <section className="px-5 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <div className="text-[11px] tracking-[0.3em] uppercase mb-3" style={{ color: GOLD }}>The Problem</div>
          <h2 className="text-2xl md:text-4xl font-black leading-tight mb-8">למה רוב הספורטאים נכשלים בלהגיע ליעד החלבון?</h2>
          <ul className="space-y-3">
            {PAIN_POINTS.map((p) => (
              <li key={p} className="flex items-start gap-3 bg-white/[0.03] border border-white/10 rounded-xl p-4 md:p-5">
                <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-2.5" style={{ background: GOLD }} />
                <span className="text-base md:text-lg text-white/85 leading-relaxed">{p}</span>
              </li>
            ))}
          </ul>

          {/* Value Equation */}
          <div className="mt-12 p-6 md:p-10 rounded-3xl border" style={{ borderColor: `${GOLD}40`, background: `linear-gradient(180deg, ${GOLD}10, transparent)` }}>
            <div className="text-[11px] tracking-[0.3em] uppercase mb-3" style={{ color: GOLD }}>The Solution</div>
            <h3 className="text-2xl md:text-3xl font-black leading-tight">
              FullBody Starter Stack
            </h3>
            <p className="mt-4 text-base md:text-lg text-white/80 leading-relaxed">
              אנחנו נותנים לך את כל מה שאתה צריך כדי להגיע ל-150 גרם חלבון ביום, ב-5 דקות הכנה, בלי לוותר על הנאה.
            </p>
          </div>
        </div>
      </section>

      {/* OFFER STACK */}
      <section className="px-5 pb-20" id="offer">
        <div className="max-w-3xl mx-auto bg-white/[0.03] border border-white/10 rounded-3xl p-6 md:p-10">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-black">בנה את הערכה שלך</h2>
            <span className="text-[11px] tracking-widest uppercase" style={{ color: GOLD }}>Starter Stack</span>
          </div>

          <div className="space-y-3">
            {ITEMS.map((it) => {
              const p = getProductByHandle(it.handle);
              const isOn = selected[it.key];
              return (
                <label
                  key={it.key}
                  className={`group flex items-center gap-4 p-4 md:p-5 rounded-2xl border cursor-pointer transition-all ${
                    isOn ? "bg-white/[0.06]" : "bg-transparent border-white/10 hover:border-white/20"
                  }`}
                  style={isOn ? { borderColor: `${GOLD}80` } : undefined}
                >
                  <span
                    className="relative shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors"
                    style={isOn ? { background: GOLD, borderColor: GOLD } : { borderColor: "rgba(255,255,255,0.4)" }}
                    aria-hidden
                  >
                    {isOn && <Check className="w-4 h-4 text-black" strokeWidth={3} />}
                  </span>
                  <input type="checkbox" checked={isOn} onChange={() => toggle(it.key)} className="sr-only" />
                  <div className="shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center">
                    {p?.image && <img src={p.image} alt="" className="max-h-full max-w-full object-contain" loading="lazy" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm md:text-base truncate">{it.title}</div>
                    <div className="text-xs md:text-sm text-white/55 truncate">{it.subtitle}</div>
                  </div>
                  <div className="shrink-0 text-sm md:text-base font-bold text-white/85">₪{p?.price ?? 0}</div>
                </label>
              );
            })}
          </div>

          {/* Bonuses */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="text-[11px] tracking-[0.3em] uppercase mb-4" style={{ color: GOLD }}>Bonuses כלולים בערכה</div>
            <div className="space-y-3">
              {BONUSES.map((b) => (
                <div key={b.title} className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/10">
                  <div className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${GOLD}1a`, color: GOLD }}>
                    <b.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-bold text-sm md:text-base">{b.title}</div>
                      <div className="shrink-0 text-xs font-black" style={{ color: GOLD }}>שווי {b.value}</div>
                    </div>
                    <p className="text-xs md:text-sm text-white/55 mt-1 leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-white/60">{selectedItems.length} פריטים נבחרו</span>
              {allThree && (
                <span className="text-[11px] font-black tracking-wide uppercase text-black px-2.5 py-1 rounded-full" style={{ background: GOLD }}>
                  15% הנחה אוטומטית
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-4 flex-wrap">
              {allThree && pricing.savings > 0 && (
                <span className="text-xl md:text-2xl text-white/40 line-through">₪{pricing.original}</span>
              )}
              <span className="text-4xl md:text-5xl font-black tracking-tight">₪{pricing.final}</span>
              {allThree && pricing.savings > 0 && (
                <span className="text-sm text-white/65">חיסכון ₪{pricing.savings}</span>
              )}
            </div>
          </div>

          {/* CTA (desktop) */}
          <button
            onClick={handleAdd}
            disabled={adding || selectedItems.length === 0}
            className="hidden md:flex mt-8 w-full items-center justify-center gap-2 text-black font-black text-base py-5 rounded-2xl active:scale-[0.99] transition-all disabled:opacity-50 hover:brightness-110"
            style={{ background: GOLD }}
          >
            {adding ? <Loader2 className="w-5 h-5 animate-spin" /> : "חטוף את ערכת ההתחלה עכשיו"}
          </button>
          <p className="hidden md:block mt-3 text-center text-xs text-white/45">משלוח עד 3 ימי עסקים · החזר תוך 30 יום</p>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="px-5 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-[11px] tracking-[0.3em] uppercase mb-3" style={{ color: GOLD }}>Social Proof</div>
            <h2 className="text-2xl md:text-4xl font-black">מה ספורטאים בישראל מספרים</h2>
            <p className="text-white/55 mt-3 text-sm md:text-base">ביצועים וכושר בלבד. בלי הבטחות רפואיות.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] tracking-[0.2em] uppercase font-black px-2.5 py-1 rounded-full" style={{ background: `${GOLD}1a`, color: GOLD, border: `1px solid ${GOLD}40` }}>
                    {t.category}
                  </span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, k) => (
                      <Star key={k} className="w-3.5 h-3.5 fill-current" style={{ color: GOLD }} />
                    ))}
                  </div>
                </div>
                <p className="text-white/85 leading-relaxed text-sm md:text-base mb-4">"{t.text}"</p>
                <div className="text-xs text-white/50 font-bold">- {t.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="px-5 pb-20">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {[
            { icon: Award, label: "מוצרים מאושרי בד\"ץ" },
            { icon: Truck, label: "משלוח 1-3 ימי עסקים" },
            { icon: Shield, label: "החזר מלא תוך 30 יום" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center justify-center gap-3 py-4 px-5 rounded-xl bg-white/[0.03] border border-white/10">
              <Icon className="w-5 h-5" style={{ color: GOLD }} />
              <span className="text-sm font-bold text-white/90">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-5 pb-24">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-[11px] tracking-[0.3em] uppercase mb-3" style={{ color: GOLD }}>FAQ</div>
            <h2 className="text-2xl md:text-4xl font-black">שאלות נפוצות</h2>
          </div>
          <div className="space-y-3">
            {FAQ.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={i} className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-right hover:bg-white/[0.02]"
                    aria-expanded={open}
                  >
                    <span className="font-bold text-sm md:text-base">{f.q}</span>
                    <ChevronDown className={`w-5 h-5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} style={{ color: GOLD }} />
                  </button>
                  {open && (
                    <div className="px-5 pb-5 text-sm md:text-base text-white/70 leading-relaxed">
                      {f.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 px-5 py-12 pb-32 md:pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <div className="text-lg font-black tracking-[0.2em]">FULLBODY</div>
              <p className="text-xs text-white/45 mt-2 max-w-md leading-relaxed">
                ערכות תזונה ספורטיביות לחיטוב, מסה וביצועים. שירות לקוחות בישראל, משלוח עד הבית.
              </p>
            </div>
            <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
              <Link to="/nava/shipping" className="text-white/70 hover:text-white">מדיניות משלוחים</Link>
              <Link to="/nava/returns" className="text-white/70 hover:text-white">מדיניות החזרים</Link>
              <Link to="/nava/terms" className="text-white/70 hover:text-white">תנאי שימוש</Link>
              <Link to="/nava/privacy" className="text-white/70 hover:text-white">מדיניות פרטיות</Link>
              <Link to="/nava/accessibility" className="text-white/70 hover:text-white">הצהרת נגישות</Link>
            </nav>
          </div>
          <div className="mt-10 pt-6 border-t border-white/5 text-[11px] text-white/35 leading-relaxed text-center max-w-3xl mx-auto">
            <p>
              © {new Date().getFullYear()} FullBody. תוצאות עשויות להשתנות בהתאם לאדם, פעילות גופנית ותזונה כללית.
              המוצרים אינם מיועדים לאבחון, טיפול, ריפוי או מניעת מחלה. מומלץ להיוועץ ברופא לפני תחילת תוכנית תזונתית, בייחוד בהריון, הנקה או מצב רפואי קיים.
            </p>
          </div>
        </div>
      </footer>

      {/* MOBILE STICKY CTA */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-black/95 backdrop-blur-md border-t border-white/10 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-baseline gap-2">
            {allThree && pricing.savings > 0 && (
              <span className="text-sm text-white/40 line-through">₪{pricing.original}</span>
            )}
            <span className="text-2xl font-black">₪{pricing.final}</span>
          </div>
          {allThree && (
            <span className="text-[10px] font-black tracking-wide uppercase text-black px-2 py-1 rounded-full" style={{ background: GOLD }}>15% הנחה</span>
          )}
        </div>
        <button
          onClick={handleAdd}
          disabled={adding || selectedItems.length === 0}
          className="w-full flex items-center justify-center gap-2 text-black font-black text-sm py-4 rounded-xl active:scale-[0.99] disabled:opacity-50"
          style={{ background: GOLD }}
        >
          {adding ? <Loader2 className="w-5 h-5 animate-spin" /> : "חטוף את ערכת ההתחלה עכשיו"}
        </button>
      </div>
    </div>
  );
}
