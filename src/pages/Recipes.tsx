import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, ShoppingCart, Flame, Dumbbell, Clock, Check } from "lucide-react";
import { recipes, RECIPE_CATEGORIES, type Recipe, type RecipeCategory } from "@/data/recipes";

const HERBA_GREEN = "hsl(142,70%,35%)";

function NutritionBadge({ recipe }: { recipe: Recipe }) {
  return (
    <div className="absolute top-4 left-4 z-10 flex flex-col gap-1 bg-black/85 backdrop-blur-sm border border-[hsl(142,70%,35%)]/40 rounded-2xl px-3 py-2 shadow-lg">
      <div className="flex items-center gap-1.5 text-[hsl(142,70%,55%)] text-xs font-bold">
        <Dumbbell className="w-3 h-3" />
        <span>{recipe.protein}g חלבון</span>
      </div>
      <div className="flex items-center gap-1.5 text-white/90 text-xs font-bold">
        <Flame className="w-3 h-3 text-orange-400" />
        <span>{recipe.calories} קל'</span>
      </div>
    </div>
  );
}

function RecipeCard({ recipe }: { recipe: Recipe }) {
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());
  const [checkedSteps, setCheckedSteps] = useState<Set<number>>(new Set());
  const [expanded, setExpanded] = useState(false);

  const toggle = (set: Set<number>, setter: (s: Set<number>) => void, idx: number) => {
    const next = new Set(set);
    next.has(idx) ? next.delete(idx) : next.add(idx);
    setter(next);
  };

  return (
    <article className="relative bg-zinc-900/80 border border-white/10 rounded-3xl overflow-hidden flex flex-col hover:border-[hsl(142,70%,35%)]/50 transition-all duration-300 shadow-xl">
      {/* Hero — gradient block w/ emoji */}
      <div className="relative h-44 bg-gradient-to-br from-[hsl(142,40%,15%)] via-zinc-900 to-black flex items-center justify-center text-7xl">
        <NutritionBadge recipe={recipe} />
        <span aria-hidden className="drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)]">{recipe.emoji}</span>
      </div>

      <div className="p-5 flex-1 flex flex-col gap-3">
        <div className="flex flex-wrap gap-1.5">
          {recipe.badges.map(b => (
            <span key={b} className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[hsl(142,70%,35%)]/15 text-[hsl(142,70%,55%)] border border-[hsl(142,70%,35%)]/30">
              {b}
            </span>
          ))}
        </div>

        <h3 className="text-xl font-black text-white leading-tight">{recipe.title}</h3>

        <div className="flex items-center gap-3 text-xs text-white/60">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{recipe.prepMinutes} דק'</span>
          <span>•</span>
          <span>מבוסס {recipe.productName}</span>
        </div>

        {expanded && (
          <div className="space-y-4 pt-2 animate-fade-in">
            <div>
              <h4 className="text-sm font-bold text-[hsl(142,70%,55%)] mb-2 uppercase tracking-wider">מרכיבים</h4>
              <ul className="space-y-1.5">
                {recipe.ingredients.map((ing, i) => {
                  const checked = checkedIngredients.has(i);
                  return (
                    <li key={i}>
                      <button
                        onClick={() => toggle(checkedIngredients, setCheckedIngredients, i)}
                        className="w-full flex items-start gap-2 text-right text-sm text-white/85 hover:text-white transition-colors"
                      >
                        <span className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all ${checked ? "bg-[hsl(142,70%,35%)] border-[hsl(142,70%,35%)]" : "border-white/30"}`}>
                          {checked && <Check className="w-3 h-3 text-black" strokeWidth={3} />}
                        </span>
                        <span className={checked ? "line-through text-white/40" : ""}>{ing}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-[hsl(142,70%,55%)] mb-2 uppercase tracking-wider">הכנה</h4>
              <ol className="space-y-1.5">
                {recipe.steps.map((step, i) => {
                  const checked = checkedSteps.has(i);
                  return (
                    <li key={i}>
                      <button
                        onClick={() => toggle(checkedSteps, setCheckedSteps, i)}
                        className="w-full flex items-start gap-2 text-right text-sm text-white/85 hover:text-white transition-colors"
                      >
                        <span className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all ${checked ? "bg-[hsl(142,70%,35%)] border-[hsl(142,70%,35%)]" : "border-white/30"}`}>
                          {checked && <Check className="w-3 h-3 text-black" strokeWidth={3} />}
                        </span>
                        <span className={checked ? "line-through text-white/40" : ""}>
                          <strong className="text-white/60 ml-1">{i + 1}.</strong>
                          {step}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        )}

        <div className="mt-auto flex flex-col gap-2 pt-3">
          <button
            onClick={() => setExpanded(e => !e)}
            className="w-full text-sm font-bold text-white/70 hover:text-white py-2 rounded-lg border border-white/15 hover:border-white/30 transition-colors"
          >
            {expanded ? "הסתר" : "הצג מתכון מלא"}
          </button>
          <Link
            to={`/product/${recipe.productHandle}`}
            className="w-full inline-flex items-center justify-center gap-2 bg-[hsl(142,70%,35%)] hover:bg-[hsl(142,70%,40%)] text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-[hsl(142,70%,35%)]/30 hover:scale-[1.02]"
          >
            <ShoppingCart className="w-4 h-4" />
            קנה {recipe.productName}
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function Recipes() {
  const [activeCategory, setActiveCategory] = useState<RecipeCategory | "all">("all");

  const filtered = useMemo(
    () => activeCategory === "all" ? recipes : recipes.filter(r => r.category === activeCategory),
    [activeCategory]
  );

  return (
    <div dir="rtl" className="min-h-screen bg-black text-white">
      <Helmet>
        <title>ספר המתכונים | The Guilt-Free Protocol — פולבאדי</title>
        <meta name="description" content="30 מתכונים עתירי חלבון מבוססי הרבלייף — ארוחות בוקר, עיקריות, קינוחים ושייקים. כשרות מהדרין." />
      </Helmet>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/85 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 text-white/70 hover:text-white text-sm font-semibold">
            <ArrowLeft className="w-4 h-4 rotate-180" />
            לאתר
          </Link>
          <div className="text-center flex-1">
            <p className="text-[10px] tracking-[0.3em] text-[hsl(142,70%,55%)] font-bold">FULLBODY · PROTOCOL</p>
          </div>
          <div className="w-12" />
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div
          className="absolute inset-0 opacity-30"
          style={{ background: `radial-gradient(ellipse at top, ${HERBA_GREEN} 0%, transparent 60%)` }}
        />
        <div className="relative container mx-auto px-4 py-12 md:py-20 text-center max-w-3xl">
          <p className="text-xs tracking-[0.3em] text-[hsl(142,70%,55%)] font-bold mb-4">THE GUILT-FREE PROTOCOL</p>
          <h1 className="text-4xl md:text-6xl font-black leading-[1.05] mb-4">
            ספר המתכונים
            <span className="block text-[hsl(142,70%,55%)] mt-2">של הספורטאי הכשר.</span>
          </h1>
          <p className="text-base md:text-lg text-white/70 leading-relaxed">
            30 מתכונים עתירי חלבון. ארוחות שמרגישות אסורות — אבל מקדמות אותך ליעד.
            כל מתכון בנוי סביב מוצר Herbalife מהדרין.
          </p>
        </div>
      </section>

      {/* Category nav */}
      <nav className="sticky top-[57px] z-30 bg-black/85 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
            {RECIPE_CATEGORIES.map(cat => {
              const active = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all border ${
                    active
                      ? "bg-[hsl(142,70%,35%)] border-[hsl(142,70%,35%)] text-white shadow-lg shadow-[hsl(142,70%,35%)]/30"
                      : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Grid */}
      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(r => <RecipeCard key={r.id} recipe={r} />)}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-white/50">לא נמצאו מתכונים בקטגוריה זו</div>
        )}
      </section>

      {/* Footer CTA */}
      <section className="border-t border-white/10 bg-zinc-950">
        <div className="container mx-auto px-4 py-12 text-center max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-black mb-3">רוצה תפריט מותאם אישית?</h2>
          <p className="text-white/60 mb-6">קבל ייעוץ אישי וחבילת מוצרים שמתאימה ליעד שלך.</p>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-2 bg-[hsl(142,70%,35%)] hover:bg-[hsl(142,70%,40%)] text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-[hsl(142,70%,35%)]/30"
          >
            דבר עם מאמן
          </Link>
        </div>
      </section>
    </div>
  );
}
