import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Lock, ShieldCheck, Flame, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const FLASHY_LIST_ID = 34516;

const ingredients = [
  "קמח כוסמין מלא",
  "ביצים חופש (גודל L)",
  "חלב שקדים לא ממותק",
  "רכיב על סודי: 2 כפות אבקת תזונה פורמולה 1 (טעם שוקולד) של הרבלייף",
];

const badges = ['כשר למהדרין (בד"ץ)', "ללא תוספת סוכר", "2 דקות הכנה"];

const macros = [
  { label: "חלבון", value: "32g", icon: Zap },
  { label: "פחמימות", value: "18g", icon: Flame },
  { label: "שומן", value: "4g", icon: ShieldCheck },
  { label: "קלוריות", value: "240", icon: Flame },
];

export default function ChocolateCakeProtocol() {
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || loading || !agreed) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setLoading(true);
    try {
      if (typeof window !== "undefined" && window.flashy?.contacts) {
        window.flashy.contacts.createOrUpdate({
          email,
          lists: { [FLASHY_LIST_ID]: true },
        });
        window.flashy("CustomEvent", { event_name: "chocolate_cake_unlock" });
      }
    } catch {
      // silent
    }
    navigate("/protocol");
  };

  return (
    <div dir="rtl" lang="he" className="min-h-screen bg-background text-foreground antialiased">
      <Helmet>
        <title>איך לאכול עוגת שוקולד מושחתת כל יום | פרוטוקול חלבון</title>
        <meta name="description" content="הפרוטוקול המדויק לסגירת פינת החלבון ב-2 דקות, בלי לעבור קלוריות, בכשרות בד״ץ." />
        <meta name="robots" content="noindex,follow" />
      </Helmet>

      <article className="mx-auto max-w-3xl px-5 py-10 sm:py-16">
        {/* Header */}
        <header className="mb-10 sm:mb-14">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-[#d4af37]">
            פרוטוקול בלעדי
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold leading-[1.15] tracking-tight">
            איך לאכול <span className="text-[#d4af37]">עוגת שוקולד מושחתת</span> בכל יום – ועדיין להיראות כמו כריסטיאנו רונאלדו
          </h1>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed">
            גלה את הפרוטוקול המדויק לסגירת פינת החלבון ב-2 דקות הכנה, בלי לעבור את מכסת הקלוריות ובכשרות המהודרת ביותר בישראל (בד״ץ).
          </p>
        </header>

        {/* Macros card */}
        <section className="mb-8 rounded-2xl border border-border bg-gradient-to-b from-white/[0.04] to-transparent p-5 sm:p-7">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-2">
            {macros.map((m) => (
              <div key={m.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-foreground">{m.value}</div>
                <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{m.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            {badges.map((b) => (
              <span key={b} className="rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 px-3 py-1 text-[11px] font-medium text-[#d4af37]">
                {b}
              </span>
            ))}
          </div>
        </section>

        {/* Ingredients preview */}
        <section className="mb-2">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">
            המרכיבים
          </h2>
          <ul className="space-y-3 select-none pointer-events-none">
            {ingredients.map((ing, i) => (
              <li key={i} className="flex items-start gap-3 rounded-xl border border-border bg-white/[0.03] p-4">
                <span className="mt-0.5 inline-block h-5 w-5 rounded border border-border bg-transparent flex-shrink-0" />
                <span className="text-foreground/90 text-[15px] leading-snug">{ing}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Fade-out teaser */}
        <div className="relative h-24 -mb-8 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black" />
          <div className="px-2 opacity-40 blur-[3px] space-y-2 text-sm">
            <p>שלב 1: מערבבים את הכוסמין עם………………</p>
            <p>שלב 2: מוסיפים 2 כפות פורמולה 1 ו-………………</p>
            <p>שלב 3: אופים בטמפ׳ ………………</p>
          </div>
        </div>

        {/* Gated wall */}
        <section className="relative mt-4 overflow-hidden rounded-2xl border border-border bg-[#0a0a0a] p-6 sm:p-10 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]">
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#d4af37]/10 blur-3xl" aria-hidden />
          <div className="relative">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10">
              <Lock className="h-6 w-6 text-[#d4af37]" />
            </div>
            <h3 className="text-center text-xl sm:text-2xl font-bold">
              🔒 המתכון האינטראקטיבי והוראות ההכנה נעולים
            </h3>
            <p className="mx-auto mt-4 max-w-xl text-center text-sm sm:text-base text-muted-foreground leading-relaxed">
              כדי לפתוח מיידית את כמויות המרכיבים המדויקות, שלבי ההכנה המהירים (פחות מ-2 דקות), וגישה ישירה לכפתורי הרכישה המהירה של רכיבי הבסיס המקוריים ב-10% הנחה – הזן את האימייל שלך עכשיו:
            </p>

            <form onSubmit={handleSubmit} className="mx-auto mt-7 max-w-md space-y-3">
              <Input
                type="email"
                required
                dir="ltr"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-xl border-border bg-secondary text-foreground placeholder:text-muted-foreground/30 focus-visible:border-[#d4af37] focus-visible:ring-[#d4af37]/30"
              />
              <Button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-xl bg-white text-black hover:bg-[#d4af37] hover:text-black transition-colors font-bold text-[15px]"
              >
                {loading ? "פותח..." : "פתח את המתכון והעבר אותי לעמוד הסודי ←"}
              </Button>
              <p className="pt-2 text-center text-[11px] text-muted-foreground leading-relaxed">
                הנתונים שלך מוגנים ב-SSL | הקובץ והגישה יישלחו במקביל למייל שלך דרך Flashy.
              </p>
            </form>
          </div>
        </section>

        {/* Disclaimer */}
        <footer className="mt-12 border-t border-border pt-6 text-center text-[11px] text-muted-foreground leading-relaxed">
          *המידע והמוצרים אינם מהווים התוויה רפואית או טיפולית. מפיץ עצמאי: נדב אונגר ID: 16Y0030013.
        </footer>
      </article>
    </div>
  );
}
