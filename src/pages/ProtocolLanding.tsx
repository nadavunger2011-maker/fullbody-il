import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Check, Lock, Flame, Dumbbell, ShieldCheck, Sparkles, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Pull a few real food photos as social proof grid
const recipeImages = import.meta.glob("@/assets/recipes/*.jpg", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;
const previewImages = Object.values(recipeImages).slice(0, 6);

const FLASHY_LIST_ID = 37383;
const HERBA_GREEN = "hsl(142,70%,35%)";

export default function ProtocolLanding() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const target = searchParams.get("target")?.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || loading) return;
    setLoading(true);
    try {
      if (typeof window !== "undefined" && window.flashy?.contacts) {
        window.flashy.contacts.createOrUpdate({
          email,
          lists: { [FLASHY_LIST_ID]: true },
        });
        window.flashy("CustomEvent", { event_name: "guilt_free_protocol_unlock" });
      }
    } catch {
      // silent
    }
    try {
      localStorage.setItem("gfp_unlocked", "1");
      localStorage.setItem("gfp_email", email);
    } catch {}
    setLoading(false);
    const dest = target ? `/recipes?recipe=${encodeURIComponent(target)}` : "/recipes";
    navigate(dest, { replace: true });
  };

  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>The Guilt-Free Protocol | 30 מתכוני חלבון – פולבאדי</title>
        <meta
          name="description"
          content="הורד בחינם את ספר המתכונים של הספורטאי הכשר. 30 מתכוני חלבון מבוססי הרבלייף – ללא קליל-קלוריות, ללא אשמה."
        />
        <meta name="robots" content="index, follow" />
      </Helmet>

      {/* Top bar */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-semibold">
            <ArrowLeft className="w-4 h-4 rotate-180" />
            לאתר
          </Link>
          <p className="text-[10px] tracking-[0.3em] text-[hsl(142,70%,28%)] font-bold">FULLBODY · PROTOCOL</p>
          <div className="w-12" />
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-40"
          style={{ background: `radial-gradient(ellipse at top, ${HERBA_GREEN} 0%, transparent 60%)` }}
        />
        <div className="relative container mx-auto px-4 pt-10 pb-8 md:pt-16 md:pb-12 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Copy */}
            <div className="text-center md:text-right">
              <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.25em] text-[hsl(142,70%,28%)] font-bold bg-[hsl(142,70%,35%)]/10 border border-[hsl(142,70%,35%)]/30 px-3 py-1.5 rounded-full mb-5">
                <Sparkles className="w-3 h-3" />
                ❖ THE GUILT-FREE PROTOCOL · מהדורת פרימיום
              </span>
              <h1 className="text-3xl md:text-5xl font-black leading-[1.15] mb-4">
                ליהנות ממתוקים ומאפים.
                <br />
                <span className="text-[hsl(142,70%,28%)]">לשמור על החיטוב.</span>
                <br />
                באפס מאמץ.
              </h1>
              <h2 className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6 font-normal">
                30 מתכוני חלבון קלים לביצוע שמחסלים את החשק למתוק בלי רגשות אשם.
                <br />
                עד 45g חלבון למנה, פחות מ-420 קלוריות, ופחות מ-10 דקות הכנה.
              </h2>

              {/* Email form - most prominent */}
              <form
                onSubmit={handleSubmit}
                className="bg-card border-2 border-[hsl(142,70%,35%)] rounded-2xl p-5 shadow-2xl shadow-[hsl(142,70%,35%)]/20 max-w-md mx-auto md:mx-0"
              >
                <p className="text-[12px] md:text-[13px] text-[hsl(142,70%,45%)] font-bold mb-3 text-right">
                  *בשווי שוק של ₪149 - עכשיו בגישה דיגיטלית מיידית בחינם*
                </p>
                <label className="block text-sm font-bold text-foreground mb-3 text-right">
                  הכנס מייל וקבל גישה מיידית 👇
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 text-base bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:border-[hsl(142,70%,55%)]"
                    dir="ltr"
                  />
                  <Button
                    type="submit"
                    size="lg"
                    disabled={loading}
                    className="h-14 px-7 whitespace-nowrap font-black text-base shadow-lg shadow-[hsl(142,70%,35%)]/40 bg-[hsl(142,70%,35%)] hover:bg-[hsl(142,70%,40%)] text-white"
                  >
                    {loading ? "פותח..." : "פתח את הספר"}
                  </Button>
                </div>
                <p className="text-[11px] text-muted-foreground mt-3 flex items-center justify-center md:justify-start gap-1.5">
                  <Lock className="w-3 h-3" />
                  גישה מיידית · ללא ספאם · ניתן להסרה בכל עת
                </p>
              </form>
            </div>

            {/* Visual — photo grid */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-2.5">
                {previewImages.map((src, i) => (
                  <div
                    key={i}
                    className={`relative overflow-hidden rounded-2xl border border-border ${
                      i === 0 ? "row-span-2 aspect-[1/2.05]" : "aspect-square"
                    }`}
                  >
                    <img src={src} alt="" loading="lazy" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                ))}
              </div>
              <div
                className="absolute -inset-4 -z-10 blur-3xl opacity-30"
                style={{ background: `radial-gradient(circle, ${HERBA_GREEN} 0%, transparent 70%)` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stat strip */}
      <section className="border-y border-border bg-secondary">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto text-center">
            {[
              { icon: Dumbbell, n: "45g", l: "חלבון מקסימלי" },
              { icon: Flame, n: "<420", l: "קלוריות לארוחה" },
              { icon: ShieldCheck, n: "100%", l: "כשרות מהדרין" },
            ].map(({ icon: Icon, n, l }, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <Icon className="w-5 h-5 text-[hsl(142,70%,28%)] mb-1" />
                <div className="text-2xl md:text-3xl font-black">{n}</div>
                <div className="text-[11px] text-muted-foreground uppercase tracking-wider">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial / authority */}
      <section className="container mx-auto px-4 py-12 max-w-2xl text-center">
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed italic">
          "סוף סוף ספר מתכונים שמדבר את שפת הספורטאי. הילדים שלי אוכלים את הפנקייק וניל ולא מאמינים שזה
          חלבון. שווה כל שקל — ובחינם, פשוט מתנה."
        </p>
        <p className="text-sm text-muted-foreground mt-4">— ניצן ב., לקוחה Premium מאז 2023</p>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-border bg-gradient-to-b from-zinc-950 to-black">
        <div className="container mx-auto px-4 py-12 text-center max-w-xl">
          <h2 className="text-2xl md:text-3xl font-black mb-3 text-white">מוכן? הספר נפתח תוך 5 שניות.</h2>
          <p className="text-white/80 mb-6 text-sm">
            הכנס מייל למעלה — תקבל גישה מיידית + עדכוני מתכונים חדשים פעם בשבוע.
          </p>
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="inline-flex items-center justify-center gap-2 bg-[hsl(142,70%,35%)] hover:bg-[hsl(142,70%,40%)] text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-[hsl(142,70%,35%)]/30"
          >
            פתח את הספר בחינם
          </a>
        </div>
      </section>
    </div>
  );
}
