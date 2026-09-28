import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { BookOpen, ShoppingBag } from "lucide-react";
import { shopUrlForHandle } from "@/lib/shopLinks";

export default function ProtocolThankYou() {
  useEffect(() => {
    try { localStorage.setItem("gfp_unlocked", "1"); } catch { /* storage may be unavailable */ }
  }, []);

  return (
    <div dir="rtl" className="min-h-screen bg-black text-white flex items-center">
      <Helmet><title>ההרשמה הושלמה | FullBody</title><meta name="robots" content="noindex, nofollow" /></Helmet>
      <main className="container mx-auto px-4 max-w-2xl py-16 text-center">
        <p className="text-sm text-emerald-400 font-bold mb-3">ההרשמה הושלמה</p>
        <h1 className="text-4xl md:text-5xl font-black mb-5">ספר המתכונים פתוח עבורך באתר</h1>
        <p className="text-white/70 leading-relaxed mb-9">אפשר לעבור לספר המתכונים או לצפות במוצרים המתאימים בחנות. המחירים, המלאי ותנאי הרכישה מוצגים בחנות בלבד.</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <Link to="/recipes" className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-4 font-bold"><BookOpen className="w-5 h-5" />לספר המתכונים</Link>
          <a href={shopUrlForHandle("formula-1-vanilla")} className="flex items-center justify-center gap-2 rounded-xl border border-white/25 py-4 font-bold"><ShoppingBag className="w-5 h-5" />למוצרים בחנות</a>
        </div>
      </main>
    </div>
  );
}
