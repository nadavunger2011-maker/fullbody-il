import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, Trash2, Pencil, X, Save, Search } from "lucide-react";

type Category = "breakfast" | "mains" | "desserts" | "shakes";

interface RecipeRow {
  id: string;
  title: string;
  category: Category;
  badges: string[];
  protein: number;
  calories: number;
  prep_minutes: number;
  emoji: string;
  product_handle: string;
  product_name: string;
  ingredients: string[];
  steps: string[];
  image_url: string | null;
  sort_order: number;
  published: boolean;
}

const EMPTY: RecipeRow = {
  id: "",
  title: "",
  category: "desserts",
  badges: [],
  protein: 0,
  calories: 0,
  prep_minutes: 5,
  emoji: "🍽️",
  product_handle: "",
  product_name: "",
  ingredients: [],
  steps: [],
  image_url: "",
  sort_order: 0,
  published: true,
};

const CATEGORIES: { id: Category | "all"; label: string }[] = [
  { id: "all", label: "הכל" },
  { id: "breakfast", label: "בוקר" },
  { id: "mains", label: "עיקריות" },
  { id: "desserts", label: "קינוחים" },
  { id: "shakes", label: "שייקים" },
];

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\u0590-\u05FF\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 80) || `recipe-${Date.now()}`;
}

export default function AdminRecipes() {
  const [rows, setRows] = useState<RecipeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Category | "all">("all");
  const [editing, setEditing] = useState<RecipeRow | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("recipes")
      .select("*")
      .order("sort_order", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) {
      console.error(error);
      alert("שגיאה בטעינת מתכונים: " + error.message);
    } else {
      setRows((data ?? []) as RecipeRow[]);
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function save(r: RecipeRow) {
    if (!r.title.trim()) { alert("חובה למלא כותרת"); return; }
    const id = r.id || slugify(r.title);
    setSaving(true);
    const payload = { ...r, id, image_url: r.image_url || null };
    const { error } = await supabase.from("recipes").upsert(payload);
    setSaving(false);
    if (error) { alert("שגיאה: " + error.message); return; }
    setEditing(null);
    await load();
  }

  async function remove(id: string) {
    if (!confirm("למחוק מתכון זה?")) return;
    const { error } = await supabase.from("recipes").delete().eq("id", id);
    if (error) { alert("שגיאה: " + error.message); return; }
    await load();
  }

  const filtered = rows.filter(r => {
    if (filter !== "all" && r.category !== filter) return false;
    if (search && !r.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="bg-white/[0.03] rounded-2xl border border-white/5 p-6 space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-lg font-bold text-white">ספר מתכונים — ניהול</h3>
          <p className="text-xs text-gray-500">הוסף, ערוך ומחק מתכונים. השינויים עולים מיד ל-/recipes.</p>
        </div>
        <button
          onClick={() => setEditing({ ...EMPTY })}
          className="bg-green-500 hover:bg-green-600 text-white text-sm font-bold py-2 px-4 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> מתכון חדש
        </button>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="חיפוש לפי כותרת..."
            className="w-full bg-black/30 border border-white/10 rounded-lg pr-9 pl-3 py-2 text-sm text-white"
          />
        </div>
        <div className="flex gap-1 bg-black/30 rounded-lg p-1">
          {CATEGORIES.map(c => (
            <button
              key={c.id}
              onClick={() => setFilter(c.id)}
              className={`text-xs px-3 py-1.5 rounded ${filter === c.id ? "bg-green-500 text-white" : "text-gray-400 hover:text-white"}`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 text-gray-500"><Loader2 className="w-5 h-5 animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-gray-500 py-12 text-sm">
          אין מתכונים עדיין. לחץ "מתכון חדש" כדי להוסיף.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-gray-500 border-b border-white/10">
              <tr>
                <th className="text-right px-2 py-2">כותרת</th>
                <th className="text-right px-2 py-2">קטגוריה</th>
                <th className="text-right px-2 py-2">חלבון</th>
                <th className="text-right px-2 py-2">קלוריות</th>
                <th className="text-right px-2 py-2">מוצר</th>
                <th className="text-right px-2 py-2">סטטוס</th>
                <th className="text-right px-2 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-2 py-3 text-white font-medium">{r.emoji} {r.title}</td>
                  <td className="px-2 py-3 text-gray-400">{r.category}</td>
                  <td className="px-2 py-3 text-gray-400">{r.protein}g</td>
                  <td className="px-2 py-3 text-gray-400">{r.calories}</td>
                  <td className="px-2 py-3 text-gray-400 text-xs">{r.product_handle || "—"}</td>
                  <td className="px-2 py-3">
                    {r.published
                      ? <span className="text-green-400 text-xs">פעיל</span>
                      : <span className="text-gray-500 text-xs">מוסתר</span>}
                  </td>
                  <td className="px-2 py-3 flex gap-2">
                    <button onClick={() => setEditing(r)} className="text-blue-400 hover:text-blue-300"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => remove(r.id)} className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <RecipeEditor
          recipe={editing}
          saving={saving}
          onClose={() => setEditing(null)}
          onSave={save}
        />
      )}
    </div>
  );
}

function RecipeEditor({
  recipe, saving, onClose, onSave,
}: {
  recipe: RecipeRow;
  saving: boolean;
  onClose: () => void;
  onSave: (r: RecipeRow) => void;
}) {
  const [r, setR] = useState<RecipeRow>(recipe);
  const update = <K extends keyof RecipeRow>(k: K, v: RecipeRow[K]) => setR(prev => ({ ...prev, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto" dir="rtl">
      <div className="bg-zinc-950 border border-white/10 rounded-2xl w-full max-w-3xl my-8">
        <div className="flex items-center justify-between p-4 border-b border-white/10 sticky top-0 bg-zinc-950 z-10">
          <h3 className="font-bold text-white">{recipe.id ? "עריכת מתכון" : "מתכון חדש"}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="כותרת *">
              <input value={r.title} onChange={e => update("title", e.target.value)} className={inputCls} />
            </Field>
            <Field label="אמוג'י">
              <input value={r.emoji} onChange={e => update("emoji", e.target.value)} className={inputCls} />
            </Field>
            <Field label="קטגוריה">
              <select value={r.category} onChange={e => update("category", e.target.value as Category)} className={inputCls}>
                <option value="breakfast">בוקר</option>
                <option value="mains">עיקריות</option>
                <option value="desserts">קינוחים</option>
                <option value="shakes">שייקים</option>
              </select>
            </Field>
            <Field label="תגיות (מופרד בפסיק) — Dairy, Parve, Vegan, Meat, Mehadrin Kosher">
              <input
                value={r.badges.join(", ")}
                onChange={e => update("badges", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                className={inputCls}
              />
            </Field>
            <Field label="חלבון (גרם)">
              <input type="number" value={r.protein} onChange={e => update("protein", Number(e.target.value))} className={inputCls} />
            </Field>
            <Field label="קלוריות">
              <input type="number" value={r.calories} onChange={e => update("calories", Number(e.target.value))} className={inputCls} />
            </Field>
            <Field label="זמן הכנה (דקות)">
              <input type="number" value={r.prep_minutes} onChange={e => update("prep_minutes", Number(e.target.value))} className={inputCls} />
            </Field>
            <Field label="סדר תצוגה (גבוה = מופיע ראשון)">
              <input type="number" value={r.sort_order} onChange={e => update("sort_order", Number(e.target.value))} className={inputCls} />
            </Field>
            <Field label="Product handle (למשל formula-1-vanilla)">
              <input value={r.product_handle} onChange={e => update("product_handle", e.target.value)} className={inputCls} />
            </Field>
            <Field label="שם המוצר">
              <input value={r.product_name} onChange={e => update("product_name", e.target.value)} className={inputCls} />
            </Field>
          </div>

          <Field label="תמונה (URL)">
            <input value={r.image_url ?? ""} onChange={e => update("image_url", e.target.value)} placeholder="https://..." className={inputCls} />
            {r.image_url && <img src={r.image_url} alt="" className="mt-2 max-h-32 rounded-lg" />}
          </Field>

          <Field label="מרכיבים (שורה לכל מרכיב)">
            <textarea
              rows={6}
              value={r.ingredients.join("\n")}
              onChange={e => update("ingredients", e.target.value.split("\n").map(s => s.trim()).filter(Boolean))}
              className={inputCls}
            />
          </Field>

          <Field label="שלבי הכנה (שורה לכל שלב)">
            <textarea
              rows={6}
              value={r.steps.join("\n")}
              onChange={e => update("steps", e.target.value.split("\n").map(s => s.trim()).filter(Boolean))}
              className={inputCls}
            />
          </Field>

          <label className="flex items-center gap-2 text-sm text-white">
            <input type="checkbox" checked={r.published} onChange={e => update("published", e.target.checked)} />
            פורסם (גלוי לציבור)
          </label>
        </div>

        <div className="flex justify-end gap-2 p-4 border-t border-white/10 sticky bottom-0 bg-zinc-950">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-400 hover:text-white">ביטול</button>
          <button
            onClick={() => onSave(r)}
            disabled={saving}
            className="bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 text-sm"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            שמור
          </button>
        </div>
      </div>
    </div>
  );
}

const inputCls = "w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500/50";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs text-gray-400 mb-1 block">{label}</span>
      {children}
    </label>
  );
}
