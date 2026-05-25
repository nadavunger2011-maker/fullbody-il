import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ShoppingBag, Check, Shield, Truck, Award, Loader2 } from "lucide-react";
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

const RECIPES = [
  { title: "סופלה שוקולד מיקרוגל ב-3 דקות", protein: "34g חלבון", note: "אפס סוכר · Formula 1 שוקולד + PDM" },
  { title: "גלידת חלבון אנבולית סמיכה", protein: "42g חלבון", note: "טקסטורה רכה · Formula 1 וניל + PDM" },
  { title: "פנקייק קראנץ' מושחת לחיטוב", protein: "38g חלבון", note: "מספק חשק למתוק · Formula 1" },
];

const BUNDLE_DISCOUNT = 0.15; // 15%

export default function StarterStack() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [adding, setAdding] = useState(false);
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
    return { original: Math.round(original), final, savings: Math.round(original - final), discountPct: Math.round(discount * 100) };
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

  // Subtle reveal on mount
  useEffect(() => {
    document.documentElement.classList.add("dark-stack-page");
    return () => document.documentElement.classList.remove("dark-stack-page");
  }, []);

  return (
    <div dir="rtl" className="min-h-screen bg-black text-white antialiased selection:bg-white selection:text-black">
      <Helmet>
        <title>FullBody Starter Stack, 150g חלבון מקינוחים מושחתים</title>
        <meta name="description" content="ערכת ההתחלה של פרוטוקול העצלנים: Formula 1 וניל + שוקולד + PDM. 15% הנחה אוטומטית, שייקר פרימיום מתנה." />
        <link rel="canonical" href="https://fullbody.co.il/starter-stack" />
      </Helmet>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Minimal top bar */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link to="/" className="text-sm font-extrabold tracking-wider">FULLBODY</Link>
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-white/80 hover:text-white"
            aria-label="עגלה"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -left-1 bg-white text-black text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-50" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.08), transparent 60%)" }} />
        <div className="max-w-6xl mx-auto px-5 pt-16 pb-12 md:pt-24 md:pb-16 text-center relative">
          <span className="inline-block text-[11px] tracking-[0.25em] uppercase text-white/60 mb-6">The Lazy Protocol</span>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black leading-[1.15] max-w-4xl mx-auto">
            איך להכניס 150 גרם חלבון ביום מקינוחים מושחתים -
            <span className="block text-white/70 font-bold mt-2">בלי לבזבז יותר מ-5 דקות במטבח</span>
          </h1>
          <p className="mt-6 text-base md:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
            תפסיק לדחוף חזה עוף יבש שנתקע בגרון. קבל את התשתית המדויקת של פרוטוקול העצלנים: ארוחות מתוקות, אפס ייסורי מצפון, ומקסימום חלבון לבניית שריר.
          </p>

          {/* Visual product frame */}
          <div className="mt-12 grid grid-cols-3 gap-3 md:gap-6 max-w-3xl mx-auto">
            {ITEMS.map((it) => {
              const p = getProductByHandle(it.handle);
              return (
                <div key={it.key} className="aspect-square rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/10 p-4 flex items-center justify-center overflow-hidden">
                  {p?.image && <img src={p.image} alt={p.title} className="max-h-full max-w-full object-contain drop-shadow-[0_20px_30px_rgba(255,255,255,0.05)]" loading="eager" />}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CONFIGURATOR */}
      <section className="px-5 pb-32 md:pb-16">
        <div className="max-w-3xl mx-auto bg-white/[0.03] border border-white/10 rounded-3xl p-6 md:p-10">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-black">בנה את הערכה שלך</h2>
            <span className="text-[11px] tracking-widest uppercase text-white/40">Starter Stack</span>
          </div>

          <div className="space-y-3">
            {ITEMS.map((it) => {
              const p = getProductByHandle(it.handle);
              const isOn = selected[it.key];
              return (
                <label
                  key={it.key}
                  className={`group flex items-center gap-4 p-4 md:p-5 rounded-2xl border cursor-pointer transition-all ${
                    isOn ? "bg-white/[0.06] border-white/30" : "bg-transparent border-white/10 hover:border-white/20"
                  }`}
                >
                  <span
                    className={`relative shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                      isOn ? "bg-white border-white" : "bg-transparent border-white/40"
                    }`}
                    aria-hidden
                  >
                    {isOn && <Check className="w-4 h-4 text-black" strokeWidth={3} />}
                  </span>
                  <input type="checkbox" checked={isOn} onChange={() => toggle(it.key)} className="sr-only" />
                  <div className="shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center">
                    {p?.image && <img src={p.image} alt="" className="max-h-full max-w-full object-contain" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm md:text-base truncate">{it.title}</div>
                    <div className="text-xs md:text-sm text-white/50 truncate">{it.subtitle}</div>
                  </div>
                  <div className="shrink-0 text-sm md:text-base font-bold text-white/80">₪{p?.price ?? 0}</div>
                </label>
              );
            })}
          </div>

          {/* Pricing */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-white/60">{selectedItems.length} פריטים נבחרו</span>
              {allThree && (
                <span className="text-[11px] font-bold tracking-wide uppercase bg-white text-black px-2.5 py-1 rounded-full">
                  חיסכון חבילה · 15% הנחה אוטומטית
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-4">
              {allThree && pricing.savings > 0 && (
                <span className="text-xl md:text-2xl text-white/40 line-through">₪{pricing.original}</span>
              )}
              <span className="text-4xl md:text-5xl font-black tracking-tight">₪{pricing.final}</span>
              {allThree && pricing.savings > 0 && (
                <span className="text-sm text-white/60">חיסכון ₪{pricing.savings}</span>
              )}
            </div>
          </div>

          {/* CTA (desktop) */}
          <button
            onClick={handleAdd}
            disabled={adding || selectedItems.length === 0}
            className="hidden md:flex mt-8 w-full items-center justify-center gap-2 bg-white text-black font-black text-base py-5 rounded-2xl hover:bg-white/90 active:scale-[0.99] transition-all disabled:opacity-50"
          >
            {adding ? <Loader2 className="w-5 h-5 animate-spin" /> : "חטוף את ערכת הפרוטוקול עכשיו + שייקר פרימיום מתנה"}
          </button>
          <p className="hidden md:block mt-3 text-center text-xs text-white/40">משלוח עד 3 ימי עסקים · החזר תוך 30 יום</p>
        </div>
      </section>

      {/* VALUE SHOWCASE */}
      <section className="px-5 pb-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-black text-center mb-3">מה המטבח שלך הולך לייצר ממחר בבוקר?</h2>
          <p className="text-center text-white/50 mb-12 max-w-2xl mx-auto">קינוחים מושחתים. אפס אשמה. מקסימום שריר.</p>

          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            {RECIPES.map((r, i) => (
              <div
                key={i}
                className="group relative bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-7 hover:bg-white/[0.05] hover:border-white/20 transition-all"
              >
                <div className="text-[10px] tracking-[0.2em] uppercase text-white/40 mb-3">Recipe 0{i + 1}</div>
                <h3 className="text-lg md:text-xl font-bold leading-snug mb-5">{r.title}</h3>
                <div className="inline-flex items-center gap-2 bg-white text-black text-xs font-black px-3 py-1.5 rounded-full">
                  <span>{r.protein}</span>
                </div>
                <p className="mt-5 text-sm text-white/55 leading-relaxed">{r.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST & COMPLIANCE */}
      <section className="px-5 pb-32 md:pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-10">
            {[
              { icon: Award, label: "כשר למהדרין" },
              { icon: Shield, label: 'בד"ץ העדה החרדית' },
              { icon: Truck, label: "משלוח עד 3 ימי עסקים" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center justify-center gap-3 py-4 px-5 rounded-xl bg-white/[0.03] border border-white/10">
                <Icon className="w-5 h-5 text-white/70" />
                <span className="text-sm font-bold text-white/90">{label}</span>
              </div>
            ))}
          </div>

          <div className="text-center space-y-1 mb-8">
            <p className="text-sm text-white/70">
              משווק עצמאי מורשה הרבלייף, <span className="font-bold text-white">נדב אונגר</span>
            </p>
            <p className="text-xs text-white/50">מספר משווק: 16Y0030013</p>
          </div>

          <div className="max-w-3xl mx-auto text-[11px] leading-relaxed text-white/35 text-center space-y-2">
            <p>
              FullBody היא יוזמה עצמאית של משווק מורשה הרבלייף ואינה אתר רשמי של חברת Herbalife Nutrition.
              מוצרי הרבלייף אינם מיועדים לאבחון, טיפול, ריפוי או מניעה של מחלה כלשהי.
              תוצאות עשויות להשתנות בהתאם לאדם, לפעילות גופנית ולתזונה כללית.
              אין באמור משום הבטחת הכנסה, הצלחת משווקים תלויה בעבודה, בזמן וביכולת אישית.
              מומלץ להיוועץ ברופא לפני תחילת תוכנית תזונתית, בייחוד בהריון, הנקה או מצב רפואי קיים.
            </p>
          </div>
        </div>
      </section>

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
            <span className="text-[10px] font-bold tracking-wide uppercase bg-white text-black px-2 py-1 rounded-full">15% הנחה</span>
          )}
        </div>
        <button
          onClick={handleAdd}
          disabled={adding || selectedItems.length === 0}
          className="w-full flex items-center justify-center gap-2 bg-white text-black font-black text-sm py-4 rounded-xl active:scale-[0.99] disabled:opacity-50"
        >
          {adding ? <Loader2 className="w-5 h-5 animate-spin" /> : "חטוף את הערכה + שייקר מתנה"}
        </button>
      </div>
    </div>
  );
}
