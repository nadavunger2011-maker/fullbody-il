import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Flame, Dumbbell, Clock, Check, ExternalLink } from "lucide-react";
import { recipes, RECIPE_CATEGORIES, type Recipe, type RecipeCategory } from "@/data/recipes";

const HERBA_GREEN = "hsl(142,70%,35%)";

// Eagerly import all generated recipe photos as URLs
const recipeImages = import.meta.glob("@/assets/recipes/*.jpg", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

function getRecipeImage(id: string): string | undefined {
  const key = Object.keys(recipeImages).find(k => k.endsWith(`/${id}.jpg`));
  return key ? recipeImages[key] : undefined;
}

function NutritionBadge({ recipe }: { recipe: Recipe }) {
  return (
    <div className="absolute top-4 left-4 z-10 flex flex-col gap-1 bg-background/85 backdrop-blur-sm border border-[hsl(142,70%,35%)]/40 rounded-2xl px-3 py-2 shadow-lg">
      <div className="flex items-center gap-1.5 text-[hsl(142,70%,55%)] text-xs font-bold">
        <Dumbbell className="w-3 h-3" />
        <span>{recipe.protein}g חלבון</span>
      </div>
      <div className="flex items-center gap-1.5 text-foreground/90 text-xs font-bold">
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

  const img = getRecipeImage(recipe.id);
  return (
    <article className="relative bg-card border border-border rounded-3xl overflow-hidden flex flex-col hover:border-[hsl(142,70%,35%)]/50 transition-all duration-300 shadow-xl">
      {/* Hero — real food photo */}
      <div className="relative h-52 bg-gradient-to-br from-[hsl(142,40%,15%)] via-zinc-900 to-black overflow-hidden">
        <NutritionBadge recipe={recipe} />
        {img ? (
          <img src={img} alt={recipe.title} loading="lazy" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-7xl">
            <span aria-hidden>{recipe.emoji}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      </div>

      <div className="p-5 flex-1 flex flex-col gap-3">
        <div className="flex flex-wrap gap-1.5">
          {recipe.badges.map(b => (
            <span key={b} className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[hsl(142,70%,35%)]/15 text-[hsl(142,70%,55%)] border border-[hsl(142,70%,35%)]/30">
              {b}
            </span>
          ))}
        </div>

        <h3 className="text-xl font-black text-foreground leading-tight">{recipe.title}</h3>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{recipe.prepMinutes} דק'</span>
        </div>

        {expanded && (
          <div className="space-y-4 pt-2 animate-fade-in">
            <div>
              <h4 className="text-sm font-bold text-[hsl(142,70%,55%)] mb-2 uppercase tracking-wider">מרכיבים</h4>
              <ul className="space-y-1.5">
                {recipe.ingredients.map((ing, i) => {
                  const checked = checkedIngredients.has(i);
                  const isProduct = i === 0;
                  return (
                    <li key={i} className="flex items-start gap-2">
                      <button
                        onClick={() => toggle(checkedIngredients, setCheckedIngredients, i)}
                        aria-label="סמן"
                        className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all ${checked ? "bg-[hsl(142,70%,35%)] border-[hsl(142,70%,35%)]" : "border-border"}`}
                      >
                        {checked && <Check className="w-3 h-3 text-black" strokeWidth={3} />}
                      </button>
                      {isProduct ? (
                        <Link
                          to={`/product/${recipe.productHandle}`}
                          className={`flex-1 text-right text-sm font-bold inline-flex items-center gap-1 transition-colors ${checked ? "line-through text-muted-foreground" : "text-[hsl(142,70%,55%)] hover:text-[hsl(142,70%,65%)] underline decoration-dotted underline-offset-4"}`}
                        >
                          <span>{ing}</span>
                          <ExternalLink className="w-3 h-3 opacity-70" />
                        </Link>
                      ) : (
                        <button
                          onClick={() => toggle(checkedIngredients, setCheckedIngredients, i)}
                          className={`flex-1 text-right text-sm text-foreground/85 hover:text-foreground transition-colors ${checked ? "line-through text-muted-foreground" : ""}`}
                        >
                          {ing}
                        </button>
                      )}
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
                        className="w-full flex items-start gap-2 text-right text-sm text-foreground/85 hover:text-foreground transition-colors"
                      >
                        <span className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all ${checked ? "bg-[hsl(142,70%,35%)] border-[hsl(142,70%,35%)]" : "border-border"}`}>
                          {checked && <Check className="w-3 h-3 text-black" strokeWidth={3} />}
                        </span>
                        <span className={checked ? "line-through text-muted-foreground" : ""}>
                          <strong className="text-muted-foreground ml-1">{i + 1}.</strong>
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

        <div className="mt-auto pt-3">
          <button
            onClick={() => setExpanded(e => !e)}
            className="w-full text-sm font-bold text-foreground/80 hover:text-foreground py-2.5 rounded-lg border border-border hover:border-[hsl(142,70%,35%)]/50 transition-colors"
          >
            {expanded ? "הסתר מתכון" : "הצג מתכון מלא"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default function Recipes() {
  const [activeCategory, setActiveCategory] = useState<RecipeCategory | "all">("all");
  const navigate = useNavigate();

  // Email gate — must opt-in via /protocol landing page
  useEffect(() => {
    if (typeof window === "undefined") return;
    const unlocked = localStorage.getItem("gfp_unlocked") === "1";
    if (!unlocked) navigate("/protocol", { replace: true });
  }, [navigate]);

  const filtered = useMemo(
    () => activeCategory === "all" ? recipes : recipes.filter(r => r.category === activeCategory),
    [activeCategory]
  );

  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>ספר המתכונים | The Guilt-Free Protocol — פולבאדי</title>
        <meta name="description" content="30 מתכונים עתירי חלבון מבוססי הרבלייף — ארוחות בוקר, עיקריות, קינוחים ושייקים. כשרות מהדרין." />
      </Helmet>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-semibold">
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
      <section className="relative overflow-hidden border-b border-border">
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
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            30 מתכונים עתירי חלבון. ארוחות שמרגישות אסורות — אבל מקדמות אותך ליעד.
            כל מתכון בנוי סביב מוצר Herbalife מהדרין.
          </p>
        </div>
      </section>

      {/* Category nav */}
      <nav className="sticky top-[57px] z-30 bg-background/85 backdrop-blur-xl border-b border-border">
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
                      ? "bg-[hsl(142,70%,35%)] border-[hsl(142,70%,35%)] text-foreground shadow-lg shadow-[hsl(142,70%,35%)]/30"
                      : "bg-secondary border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
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
          <div className="text-center py-16 text-muted-foreground">לא נמצאו מתכונים בקטגוריה זו</div>
        )}
      </section>

      {/* Footer CTA */}
      <section className="border-t border-border bg-secondary">
        <div className="container mx-auto px-4 py-12 text-center max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-black mb-3">רוצה תפריט מותאם אישית?</h2>
          <p className="text-muted-foreground mb-6">קבל ייעוץ אישי וחבילת מוצרים שמתאימה ליעד שלך.</p>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-2 bg-[hsl(142,70%,35%)] hover:bg-[hsl(142,70%,40%)] text-foreground font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-[hsl(142,70%,35%)]/30"
          >
            דבר עם מאמן
          </Link>
        </div>
      </section>
    </div>
  );
}
