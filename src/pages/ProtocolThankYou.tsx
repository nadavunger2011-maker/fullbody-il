import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Check, Truck, Clock, ShieldCheck, BookOpen, Mail } from "lucide-react";
import { getProductByHandle } from "@/data/herbalifeProducts";
import { useCartStore } from "@/stores/cartStore";
import { fetchProductByHandle, getFirstAvailableVariant } from "@/lib/shopify";
import { toast } from "sonner";
import CartDrawer from "@/components/CartDrawer";

const HERBA_GREEN = "hsl(142,70%,35%)";

// Bundle: 1x Formula 1 + 1x PDM (שייקר ומשלוח כבונוס)
const BUNDLE_HANDLES = ["formula-1-vanilla", "pdm-protein"];
const EXTRA_DISCOUNT_PCT = 10;

// Marketing pricing (independent of Shopify real prices)
const RETAIL_PRICE = 640;       // מחיר מלא בקנייה רגילה
const BUNDLE_PRICE = 498;       // מחיר באנדל לפני הנחת OTO
const FINAL_PRICE = 448;        // מחיר סופי אחרי 10% OTO
const BUNDLE_SAVINGS = RETAIL_PRICE - BUNDLE_PRICE; // 142
const OTO_SAVINGS = BUNDLE_PRICE - FINAL_PRICE;     // 50
const TOTAL_SAVINGS = RETAIL_PRICE - FINAL_PRICE;   // 192

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export default function ProtocolThankYou() {
  const [secondsLeft, setSecondsLeft] = useState(10 * 60);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    const id = setInterval(() => setSecondsLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  // Ensure recipes are unlocked on arrival
  useEffect(() => {
    try {
      localStorage.setItem("gfp_unlocked", "1");
    } catch {}
  }, []);

  const mm = Math.floor(secondsLeft / 60);
  const ss = secondsLeft % 60;

  // Pricing math from real product data
  const baseProducts = BUNDLE_HANDLES.map((h) => getProductByHandle(h)).filter(Boolean) as Array<{
    price: number;
    title: string;
    handle: string;
  }>;
  const originalTotal = baseProducts.reduce((sum, p) => sum + (p.price || 0), 0);
  const finalTotal = Math.round(originalTotal * (1 - EXTRA_DISCOUNT_PCT / 100));
  const totalSavings = originalTotal - finalTotal;

  const handleAccept = async () => {
    setIsAdding(true);
    try {
      // Count duplicates per handle
      const counts: Record<string, number> = {};
      BUNDLE_HANDLES.forEach((h) => (counts[h] = (counts[h] || 0) + 1));

      let added = 0;
      for (const handle of Object.keys(counts)) {
        const local = getProductByHandle(handle);
        if (!local) continue;
        const shopifyProduct = await fetchProductByHandle(local.shopifyHandle);
        if (!shopifyProduct) continue;
        const variant = getFirstAvailableVariant(shopifyProduct);
        if (!variant) continue;
        const ok = await addItem({
          product: shopifyProduct,
          variantId: variant.id,
          variantTitle: variant.title,
          price: variant.price,
          quantity: counts[handle],
          selectedOptions: variant.selectedOptions || [],
          bundleId: "protocol-oto",
          bundleTitle: "ערכת הסטארטר של הפרוטוקול",
          bundleDiscountPct: EXTRA_DISCOUNT_PCT,
        });
        if (ok) added++;
      }
      if (added > 0) {
        toast.success("הערכה נוספה לעגלה!", {
          description: `הנחה של ${EXTRA_DISCOUNT_PCT}% תחושב אוטומטית בקופה.`,
        });
        setIsCartOpen(true);
      } else {
        toast.error("לא הצלחנו להוסיף את הערכה. נסו שוב.");
      }
    } catch {
      toast.error("שגיאה בהוספה לעגלה");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDecline = () => {
    navigate("/recipes", { replace: true });
  };

  return (
    <div dir="rtl" className="min-h-screen bg-black text-white">
      <Helmet>
        <title>הצעה חד-פעמית | ערכת הסטארטר של הפרוטוקול</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Sticky top bar: email confirmation + direct link to recipes */}
      <div className="sticky top-0 z-40 bg-[hsl(142,70%,18%)] border-b border-[hsl(142,70%,35%)]/50 text-white py-2.5 px-3">
        <div className="container mx-auto max-w-3xl flex items-center justify-between gap-3 flex-wrap">
          <p className="flex items-center gap-2 text-[12px] md:text-sm font-bold leading-tight">
            <Mail className="w-4 h-4 flex-shrink-0" />
            ספר המתכונים נשלח למייל שלך!
          </p>
          <Link
            to="/recipes"
            onClick={() => {
              try {
                localStorage.setItem("gfp_unlocked", "1");
              } catch {}
            }}
            className="text-[12px] md:text-sm font-bold underline underline-offset-4 hover:text-white/80"
          >
            פתח את הספר עכשיו ←
          </Link>
        </div>
      </div>

      <main className="container mx-auto px-4 max-w-3xl py-8 md:py-12">
        {/* Countdown */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 md:p-5 flex items-center justify-between gap-4 mb-8">
          <div className="text-right">
            <p className="text-[11px] md:text-xs uppercase tracking-[0.2em] text-white/60 mb-1">
              הטבה חד-פעמית
            </p>
            <p className="text-sm md:text-base font-bold text-white">
              ההטבה תפוג בעוד:
            </p>
          </div>
          <div
            className="font-black text-3xl md:text-4xl tabular-nums tracking-wider px-4 py-2 rounded-xl border"
            style={{ color: HERBA_GREEN, borderColor: HERBA_GREEN }}
          >
            {pad(mm)}:{pad(ss)}
          </div>
        </div>

        {/* Hook */}
        <h1 className="text-3xl md:text-5xl font-black leading-[1.15] mb-5 text-center">
          חכה! פתרת את בעיית המתכונים,
          <br />
          <span style={{ color: HERBA_GREEN }}>אבל מה עם חומרי הגלם?</span>
        </h1>

        <p className="text-white/80 text-base md:text-lg leading-relaxed text-center max-w-2xl mx-auto mb-10">
          כדי שכל הקינוחים והפנקייקים בספר ייצאו מושלמים, אתה צריך את הבסיס הנכון - וכמות שתספיק לכל החודש.
          הרכבנו ערכת סטארטר זוגית: 2 שייקי פורמולה 1 + 2 אבקות PDM. כפול ממה שהצענו במקור, ועם 10% הנחה נוספת רק בעמוד הזה.
        </p>

        {/* Bundle grid */}
        <div className="grid sm:grid-cols-2 gap-3 mb-6">
          {[
            { t: "2 x פורמולה 1 פרימיום", d: "וניל + שוקולד - בסיס לכל קינוח ומאפה בספר" },
            { t: "2 x אבקת חלבון PDM", d: "תוספת חלבון מי גבינה - מרקם מושלם ועד 45g לארוחה" },
            { t: "שייקר פרימיום FullBody", d: "מתנה - סולידי, נוח, אטום לחלוטין" },
            { t: "משלוח אקספרס עד הבית", d: "מתחייבים להגעה לפני ערב החג" },
          ].map((b, i) => (
            <div key={i} className="bg-white/[0.04] border border-white/10 rounded-xl p-4 flex gap-3">
              <div
                className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
                style={{ background: HERBA_GREEN }}
              >
                <Check className="w-4 h-4 text-black" strokeWidth={3} />
              </div>
              <div className="text-right">
                <p className="font-bold text-white text-sm md:text-base leading-tight">{b.t}</p>
                <p className="text-white/60 text-xs md:text-sm mt-1 leading-snug">{b.d}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Savings breakdown */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-6">
          <div className="space-y-2 text-sm md:text-base mb-4">
            <div className="flex items-center justify-between text-white/70">
              <span>מחיר מלא בקנייה רגילה</span>
              <s className="font-bold">₪{originalTotal}</s>
            </div>
            <div className="flex items-center justify-between text-white">
              <span className="flex items-center gap-2">
                <span
                  className="text-[10px] font-black px-2 py-0.5 rounded text-black"
                  style={{ background: HERBA_GREEN }}
                >
                  OTO
                </span>
                בונוס הנחה -{EXTRA_DISCOUNT_PCT}% (רק בעמוד זה)
              </span>
              <span className="font-bold" style={{ color: HERBA_GREEN }}>
                -₪{totalSavings}
              </span>
            </div>
          </div>
          <div className="border-t border-white/10 pt-4 text-center">
            <p className="text-white/60 text-xs md:text-sm mb-1">המחיר הסופי שלך היום</p>
            <p className="text-4xl md:text-5xl font-black mb-2" style={{ color: HERBA_GREEN }}>
              ₪{finalTotal}
            </p>
            <p className="text-white/80 text-sm md:text-base font-bold">
              חיסכון כולל של ₪{totalSavings} - תקף לעמוד זה בלבד
            </p>
          </div>
        </div>

        {/* Primary CTA - opens cart */}
        <button
          onClick={handleAccept}
          disabled={isAdding}
          className="w-full text-base md:text-lg font-black py-5 px-6 rounded-2xl text-black shadow-2xl transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed mb-3"
          style={{ background: HERBA_GREEN, boxShadow: `0 12px 40px -8px ${HERBA_GREEN}` }}
        >
          {isAdding ? "מוסיף לעגלה..." : `🔥 הוסף לעגלה וחסוך ₪${totalSavings}`}
        </button>

        {/* Secondary CTA - go to recipe book */}
        <Link
          to="/recipes"
          onClick={() => {
            try {
              localStorage.setItem("gfp_unlocked", "1");
            } catch {}
          }}
          className="w-full flex items-center justify-center gap-2 text-sm md:text-base font-bold py-3.5 px-6 rounded-2xl border border-white/20 text-white hover:bg-white/5 transition-colors mb-6"
        >
          <BookOpen className="w-4 h-4" />
          פתח את 30 המתכונים עכשיו
        </Link>

        {/* Trust strip */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-white/60 text-[11px] md:text-xs mb-6">
          <span className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5" /> משלוח אקספרס
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> כשרות מהדרין
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> מבצע חד-פעמי
          </span>
        </div>

        {/* Decline */}
        <div className="text-center">
          <button
            onClick={handleDecline}
            className="text-white/40 hover:text-white/70 text-xs md:text-sm underline underline-offset-4 transition-colors max-w-xl"
          >
            לא תודה, אעבור ישר לספר המתכונים בלי הערכה.
          </button>
        </div>
      </main>
    </div>
  );
}
