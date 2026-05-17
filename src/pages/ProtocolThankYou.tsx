import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Check, Truck, Clock, ShieldCheck } from "lucide-react";

const HERBA_GREEN = "hsl(142,70%,35%)";
const WHATSAPP_NUMBER = "972547308826";

const BUNDLE_MESSAGE = `היי! מגיע מעמוד ה-OTO של THE GUILT-FREE PROTOCOL.
אני רוצה את ערכת הסטארטר הרשמית במחיר חג ₪249:
- פורמולה 1 פרימיום (וניל / שוקולד לבן)
- אבקת חלבון PDM
- שייקר פרימיום FullBody
- משלוח אקספרס עד הבית לפני החג`;

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export default function ProtocolThankYou() {
  const [secondsLeft, setSecondsLeft] = useState(10 * 60);
  const navigate = useNavigate();

  useEffect(() => {
    const id = setInterval(() => setSecondsLeft(s => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  const mm = Math.floor(secondsLeft / 60);
  const ss = secondsLeft % 60;

  const handleAccept = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(BUNDLE_MESSAGE)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleDecline = () => {
    try {
      localStorage.setItem("gfp_unlocked", "1");
    } catch {}
    navigate("/recipes", { replace: true });
  };

  // Ensure recipes are unlocked on arrival (user submitted email)
  useEffect(() => {
    try {
      localStorage.setItem("gfp_unlocked", "1");
    } catch {}
  }, []);

  return (
    <div dir="rtl" className="min-h-screen bg-black text-white">
      <Helmet>
        <title>הצעה חד-פעמית | ערכת הסטארטר של הפרוטוקול</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Sticky top bar */}
      <div className="sticky top-0 z-50 bg-[hsl(142,70%,18%)] border-b border-[hsl(142,70%,35%)]/50 text-white text-center text-[12px] md:text-sm font-bold py-2.5 px-3 leading-tight">
        📩 הקישור ל-30 המתכונים נשלח לתיבת המייל שלך! אל תסגור את העמוד - יש לך 10 דקות לנצל את מבצע החג הקרוב
      </div>

      <main className="container mx-auto px-4 max-w-3xl py-8 md:py-12">
        {/* Countdown */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 md:p-5 flex items-center justify-between gap-4 mb-8">
          <div className="text-right">
            <p className="text-[11px] md:text-xs uppercase tracking-[0.2em] text-white/60 mb-1">הטבה חד-פעמית</p>
            <p className="text-sm md:text-base font-bold text-white">
              ההטבה החד-פעמית שלך לשבועות תפוג בעוד:
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
          כדי שהפנקייק ייצא ענן והקינוחים באמת יחסלו את הדחף למתוק בלי להרוס את החיטוב, אתה חייב את הבסיס הנכון.
          אל תבזבז זמן בחיפושים בסופרים. הרכבנו עבורך את ערכת הסטארטר הרשמית של הפרוטוקול במחיר חג חד-פעמי.
        </p>

        {/* Bundle grid */}
        <div className="grid sm:grid-cols-2 gap-3 mb-8">
          {[
            { t: "אבקת חלבון פורמולה 1 פרימיום", d: "וניל / שוקולד לבן - בסיס לכל קינוח ומאפה בספר" },
            { t: "אבקת תערובת חלבון מועשרת PDM", d: "מרקם מושלם + תוספת חלבון בכל מנה" },
            { t: "שייקר פרימיום ממותג FullBody", d: "סולידי, נוח, נסגר אטום - מלווה אותך כל היום" },
            { t: "בונוס חג: משלוח אקספרס עד הבית", d: "מתחייבים להגעה לפני ערב החג" },
          ].map((b, i) => (
            <div key={i} className="bg-white/[0.04] border border-white/10 rounded-xl p-4 flex gap-3">
              <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center" style={{ background: HERBA_GREEN }}>
                <Check className="w-4 h-4 text-black" strokeWidth={3} />
              </div>
              <div className="text-right">
                <p className="font-bold text-white text-sm md:text-base leading-tight">{b.t}</p>
                <p className="text-white/60 text-xs md:text-sm mt-1 leading-snug">{b.d}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-center mb-6">
          <div className="flex items-baseline justify-center gap-3 flex-wrap mb-2">
            <s className="text-white/40 text-2xl md:text-3xl font-bold">₪320</s>
            <span className="text-4xl md:text-5xl font-black" style={{ color: HERBA_GREEN }}>
              רק ₪249
            </span>
          </div>
          <p className="text-white/70 text-sm md:text-base font-bold">
            חיסכון של ₪71 - תקף לעמוד זה בלבד!
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={handleAccept}
          className="w-full text-base md:text-lg font-black py-5 px-6 rounded-2xl text-black shadow-2xl transition-transform hover:scale-[1.01] active:scale-[0.99] mb-4"
          style={{ background: HERBA_GREEN, boxShadow: `0 12px 40px -8px ${HERBA_GREEN}` }}
        >
          🔥 הוסף את הערכה לעגלה ופתח את המתכונים עכשיו
        </button>

        {/* Trust strip */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-white/60 text-[11px] md:text-xs mb-6">
          <span className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5" /> משלוח אקספרס</span>
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> כשרות מהדרין</span>
          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> מבצע חד-פעמי</span>
        </div>

        {/* Decline */}
        <div className="text-center">
          <button
            onClick={handleDecline}
            className="text-white/40 hover:text-white/70 text-xs md:text-sm underline underline-offset-4 transition-colors max-w-xl"
          >
            לא תודה, אני מעדיף לקנות את הרכיבים בנפרד ולשלם מחיר מלא. העבר אותי ל-30 המתכונים הפתוחים.
          </button>
        </div>
      </main>
    </div>
  );
}
