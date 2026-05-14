import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Sparkles, Lock, ArrowLeft, CheckCircle2, Flame, Dumbbell, Trophy } from "lucide-react";

const FLASHY_LIST_ID = 34516;

type Activity = "sedentary" | "moderate" | "intense";
type Goal = "fat_loss" | "muscle_gain" | "performance";

const activityMultiplier: Record<Activity, number> = {
  sedentary: 1.4,
  moderate: 1.65,
  intense: 1.9,
};

const proteinPerKg = (goal: Goal, activity: Activity): number => {
  if (goal === "muscle_gain") return activity === "intense" ? 2.2 : 2.0;
  if (goal === "performance") return activity === "intense" ? 2.0 : 1.8;
  return activity === "intense" ? 1.8 : 1.6;
};

const goalCalorieAdjust: Record<Goal, number> = {
  fat_loss: -400,
  muscle_gain: 350,
  performance: 0,
};

const ProteinCalculator = () => {
  const [weight, setWeight] = useState<string>("");
  const [activity, setActivity] = useState<Activity>("moderate");
  const [goal, setGoal] = useState<Goal>("muscle_gain");
  const [mehadrin, setMehadrin] = useState(false);
  const [calculated, setCalculated] = useState(false);
  const [email, setEmail] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);

  const results = useMemo(() => {
    const w = parseFloat(weight);
    if (!w || w < 30 || w > 250) return null;
    const protein = Math.round(w * proteinPerKg(goal, activity));
    const bmr = 22 * w + 500; // simplified
    const tdee = Math.round(bmr * activityMultiplier[activity] + goalCalorieAdjust[goal]);
    const shakes = Math.max(1, Math.round(protein / 25));
    return { protein, tdee, shakes };
  }, [weight, activity, goal]);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!results) return;
    setCalculated(true);
    setTimeout(() => {
      document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || loading) return;
    setLoading(true);
    try {
      if (typeof window !== "undefined" && window.flashy?.contacts) {
        window.flashy.contacts.createOrUpdate({
          email,
          lists: { [FLASHY_LIST_ID]: true },
          protein_goal: goal,
          activity_level: activity,
          weight_kg: weight,
          mehadrin: mehadrin ? "yes" : "no",
        });
        window.flashy("CustomEvent", { event_name: "protein_calculator_lead" });
      }
    } catch {}
    setLoading(false);
    setUnlocked(true);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-black text-white font-sans antialiased">
      <Helmet>
        <title>מחשבון חלבון AI - הפרוטוקול לספורטאי הכשר | FullBody</title>
        <meta name="description" content="חישוב מותאם אישית של צריכת חלבון, קלוריות וסטאק תוספי H24. מחשבון AI חינמי לספורטאים השומרים על כשרות מהדרין." />
        <meta name="robots" content="index, follow" />
      </Helmet>

      {/* Subtle gold gradient backdrop */}
      <div
        className="fixed inset-0 pointer-events-none opacity-40"
        style={{
          background:
            "radial-gradient(circle at 20% 10%, rgba(201,168,76,0.12), transparent 50%), radial-gradient(circle at 80% 90%, rgba(201,168,76,0.08), transparent 50%)",
        }}
      />

      <div className="relative z-10">
        {/* Top bar */}
        <header className="border-b border-white/10">
          <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between">
            <Link to="/" className="text-sm text-white/60 hover:text-[#c9a84c] flex items-center gap-1.5 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              חזרה לחנות
            </Link>
            <span className="text-xs tracking-[0.3em] text-[#c9a84c] font-light uppercase">FullBody · Pro</span>
          </div>
        </header>

        {/* Hero */}
        <section className="px-5 pt-14 pb-10 sm:pt-20 sm:pb-14 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#c9a84c]/30 bg-[#c9a84c]/5 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[#c9a84c]" />
            <span className="text-xs tracking-widest text-[#c9a84c] font-light">מחשבון AI · חינמי</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-[1.05] mb-5">
            הפסיקו לנחש.
            <br />
            <span className="bg-gradient-to-l from-[#c9a84c] via-[#f0d78c] to-[#c9a84c] bg-clip-text text-transparent">
              התחילו לגדול.
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-white/60 font-light max-w-xl mx-auto leading-relaxed">
            הפרוטוקול המבוסס AI לספורטאי הכשר. תזונה מדויקת, תוספי H24 מותאמים, תוך 30 שניות.
          </p>
        </section>

        {/* Calculator */}
        <section className="px-5 pb-20">
          <form
            onSubmit={handleCalculate}
            className="max-w-2xl mx-auto bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-10 shadow-[0_0_60px_-15px_rgba(201,168,76,0.15)]"
          >
            {/* Weight */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-white/80 mb-3 tracking-wide">משקל נוכחי (ק״ג)</label>
              <input
                type="number"
                inputMode="decimal"
                min={30}
                max={250}
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
                placeholder="75"
                className="w-full bg-black/40 border border-white/15 rounded-xl px-5 py-4 text-2xl font-light text-white text-center focus:border-[#c9a84c] focus:outline-none focus:ring-2 focus:ring-[#c9a84c]/20 transition"
              />
            </div>

            {/* Activity */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-white/80 mb-3 tracking-wide">רמת פעילות</label>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { v: "sedentary", l: "נמוכה" },
                  { v: "moderate", l: "בינונית" },
                  { v: "intense", l: "אינטנסיבית" },
                ] as { v: Activity; l: string }[]).map((opt) => (
                  <button
                    type="button"
                    key={opt.v}
                    onClick={() => setActivity(opt.v)}
                    className={`py-3.5 px-2 rounded-xl text-sm font-medium border transition-all ${
                      activity === opt.v
                        ? "bg-[#c9a84c] text-black border-[#c9a84c] shadow-[0_0_20px_-5px_rgba(201,168,76,0.6)]"
                        : "bg-transparent text-white/70 border-white/15 hover:border-white/30"
                    }`}
                  >
                    {opt.l}
                  </button>
                ))}
              </div>
            </div>

            {/* Goal */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-white/80 mb-3 tracking-wide">המטרה שלך</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {([
                  { v: "fat_loss", l: "ירידה בשומן", icon: Flame },
                  { v: "muscle_gain", l: "בניית שריר", icon: Dumbbell },
                  { v: "performance", l: "ביצועים", icon: Trophy },
                ] as { v: Goal; l: string; icon: typeof Flame }[]).map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <button
                      type="button"
                      key={opt.v}
                      onClick={() => setGoal(opt.v)}
                      className={`py-4 px-3 rounded-xl text-sm font-medium border transition-all flex items-center justify-center gap-2 ${
                        goal === opt.v
                          ? "bg-[#c9a84c] text-black border-[#c9a84c] shadow-[0_0_20px_-5px_rgba(201,168,76,0.6)]"
                          : "bg-transparent text-white/70 border-white/15 hover:border-white/30"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {opt.l}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mehadrin */}
            <label className="flex items-start gap-3 mb-8 cursor-pointer group">
              <input
                type="checkbox"
                checked={mehadrin}
                onChange={(e) => setMehadrin(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-white/30 bg-black/40 accent-[#c9a84c] cursor-pointer"
              />
              <span className="text-sm text-white/80 group-hover:text-white transition-colors leading-relaxed">
                <span className="font-medium">דורש כשרות מהדרין</span>
                <span className="block text-xs text-white/50 mt-0.5">
                  התאמת המוצרים בלבד למוצרים בעלי תעודת כשרות מהדרין
                </span>
              </span>
            </label>

            {/* CTA */}
            <button
              type="submit"
              disabled={!results}
              className="w-full py-5 rounded-xl bg-gradient-to-r from-[#c9a84c] via-[#f0d78c] to-[#c9a84c] text-black font-bold text-lg tracking-wide hover:shadow-[0_0_40px_-5px_rgba(201,168,76,0.7)] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              חשב את הפרוטוקול שלי ←
            </button>
          </form>

          {/* Results */}
          {calculated && results && (
            <div id="results-section" className="max-w-2xl mx-auto mt-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="text-center mb-6">
                <p className="text-xs tracking-[0.3em] text-[#c9a84c] uppercase mb-2">הפרוטוקול שלך</p>
                <h2 className="text-2xl sm:text-3xl font-bold">תוצאות מותאמות אישית</h2>
              </div>

              <div className={`relative bg-white/[0.03] border border-white/10 rounded-2xl p-6 sm:p-10 ${!unlocked ? "overflow-hidden" : ""}`}>
                <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 ${!unlocked ? "blur-md select-none pointer-events-none" : ""}`}>
                  <Stat label="חלבון יומי" value={`${results.protein}g`} />
                  <Stat label="קלוריות יומיות" value={`${results.tdee}`} />
                  <Stat label="שייקים מומלצים" value={`${results.shakes}/יום`} />
                </div>

                {unlocked && (
                  <div className="mt-8 pt-8 border-t border-white/10 space-y-3 text-sm text-white/80">
                    <h3 className="text-base font-bold text-[#c9a84c] mb-3">סטאק התוספים המומלץ:</h3>
                    {[
                      `Formula 1 ${mehadrin ? "מהדרין (וניל)" : "לבחירתך"} × ${results.shakes} מנות ביום`,
                      goal === "muscle_gain" ? "PDM - תוספת חלבון לשייק (25g חלבון נוסף)" : "Niteworks - תמיכה בהתאוששות",
                      activity === "intense" ? "H24 Rebuild Strength - אחרי אימון" : "תרכיז אלוורה - לעיכול תקין",
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#c9a84c] mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                    <div className="pt-6 mt-6 border-t border-white/10 flex flex-col sm:flex-row gap-3">
                      <Link
                        to="/products"
                        className="flex-1 py-4 rounded-xl bg-gradient-to-r from-[#c9a84c] via-[#f0d78c] to-[#c9a84c] text-black font-bold text-center hover:shadow-[0_0_30px_-5px_rgba(201,168,76,0.6)] transition"
                      >
                        רכוש את הסטאק שלך ←
                      </Link>
                      <Link
                        to="/bundles"
                        className="flex-1 py-4 rounded-xl border border-white/20 text-white font-medium text-center hover:bg-white/5 transition"
                      >
                        צפה בחבילות
                      </Link>
                    </div>
                  </div>
                )}

                {/* Lead capture overlay */}
                {!unlocked && (
                  <div className="absolute inset-0 flex items-center justify-center p-6">
                    <div className="w-full max-w-md text-center">
                      <div className="inline-flex w-14 h-14 items-center justify-center rounded-full bg-[#c9a84c]/15 border border-[#c9a84c]/40 mb-4">
                        <Lock className="w-6 h-6 text-[#c9a84c]" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">פתחו את הפרוטוקול המלא</h3>
                      <p className="text-sm text-white/60 mb-5 leading-relaxed">
                        הזינו אימייל לקבלת ה-PDF המלא + סטאק תוספי H24 המותאם לכם
                      </p>
                      <form onSubmit={handleUnlock} className="flex flex-col gap-3">
                        <input
                          type="email"
                          required
                          dir="ltr"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="w-full bg-black/60 border border-white/20 rounded-xl px-5 py-3.5 text-base text-white text-center focus:border-[#c9a84c] focus:outline-none focus:ring-2 focus:ring-[#c9a84c]/20"
                        />
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full py-4 rounded-xl bg-gradient-to-r from-[#c9a84c] via-[#f0d78c] to-[#c9a84c] text-black font-bold disabled:opacity-50 hover:shadow-[0_0_30px_-5px_rgba(201,168,76,0.6)] transition"
                        >
                          {loading ? "פותח..." : "פתחו את הפרוטוקול שלי"}
                        </button>
                        <p className="text-[11px] text-white/40">ללא ספאם. ביטול בכל עת.</p>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Trust strip */}
          <div className="max-w-2xl mx-auto mt-12 grid grid-cols-3 gap-4 text-center">
            {[
              { n: "10K+", l: "ספורטאים" },
              { n: "כשר", l: "מהדרין זמין" },
              { n: "AI", l: "מותאם אישית" },
            ].map((t) => (
              <div key={t.l} className="border-t border-white/10 pt-4">
                <div className="text-xl font-bold text-[#c9a84c]">{t.n}</div>
                <div className="text-xs text-white/50 mt-1 tracking-wide">{t.l}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="text-center">
    <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
      {value}
    </div>
    <div className="text-xs text-white/50 mt-2 tracking-widest uppercase">{label}</div>
  </div>
);

export default ProteinCalculator;
