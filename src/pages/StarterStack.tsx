import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Check } from "lucide-react";
import { getProductByHandle } from "@/data/herbalifeProducts";
import { shopUrlForHandle } from "@/lib/shopLinks";
import { BUSINESS, MEDICAL_DISCLAIMER } from "@/lib/business";

const ITEMS = [
  { handle: "formula-1-vanilla", title: "Formula 1 וניל" },
  { handle: "formula-1-chocolate", title: "Formula 1 שוקולד" },
  { handle: "pdm-protein", title: "Protein Drink Mix (PDM)" },
];

export default function StarterStack() {
  useEffect(() => {
    document.documentElement.classList.add("dark-stack-page");
    return () => document.documentElement.classList.remove("dark-stack-page");
  }, []);

  return (
    <div dir="rtl" className="min-h-screen bg-black text-white">
      <Helmet>
        <title>המלצת שילוב למוצרי Herbalife | FullBody</title>
        <meta name="description" content="המלצת שילוב של Formula 1 ו-PDM כחלק מתזונה מאוזנת ואורח חיים פעיל. כל מוצר נרכש בנפרד בחנות." />
        <link rel="canonical" href="https://fullbody.co.il/starter-stack" />
      </Helmet>
      <header className="border-b border-white/10">
        <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link to="/" className="font-black tracking-widest">FULLBODY</Link>
          <a href="https://shop.fullbody.co.il" className="text-sm font-bold text-white/80">לחנות <ArrowLeft className="inline w-4 h-4" /></a>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-5 py-16 md:py-24">
        <div className="max-w-3xl mb-12">
          <p className="text-sm font-bold text-amber-300 mb-3">המלצת שילוב בלבד</p>
          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-5">Formula 1 ו-PDM בשגרה אחת</h1>
          <p className="text-lg text-white/70 leading-relaxed">שלושה מוצרים שניתן לשלב בתפריט מאוזן בהתאם להוראות השימוש שעל גבי התווית. אין בערכה הנחה אוטומטית, מתנות או התחייבות לתוצאה.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {ITEMS.map((item) => {
            const product = getProductByHandle(item.handle);
            if (!product) return null;
            return (
              <article key={item.handle} className="border border-white/15 rounded-2xl p-5 bg-white/[0.03]">
                <div className="aspect-square bg-white rounded-xl p-5 mb-5"><img src={product.image} alt={item.title} className="w-full h-full object-contain" /></div>
                <h2 className="text-xl font-bold mb-2">{item.title}</h2>
                <p className="text-sm text-white/60 mb-5 flex gap-2"><Check className="w-4 h-4 shrink-0 text-amber-300" />חלק מתזונה מאוזנת ואורח חיים פעיל</p>
                <a href={shopUrlForHandle(item.handle)} className="block text-center border border-amber-300 text-amber-300 rounded-xl py-3 font-bold">לצפייה במוצר בחנות</a>
              </article>
            );
          })}
        </div>
        <aside className="mt-12 border-t border-white/10 pt-6 text-sm text-white/60 leading-relaxed">{MEDICAL_DISCLAIMER}</aside>
      </main>
      <footer className="border-t border-white/10 px-5 py-8 text-center text-xs text-white/55">{BUSINESS.disclosure}</footer>
    </div>
  );
}
