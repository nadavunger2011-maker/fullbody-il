import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowRight, ArrowLeft, Sparkles, Target, User, Dumbbell,
  Phone, CheckCircle2, Flame, Utensils, RefreshCw, Loader2,
} from "lucide-react";
import { herbalifeProducts, type HerbalifeProduct } from "@/data/herbalifeProducts";
import ProFooter from "@/components/ProFooter";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import greenLogo from "@/assets/logo-green.webp";

/* ---------- types & constants ---------- */

type Goal = "weight-loss" | "toning" | "muscle";
type Gender = "male" | "female";
type Experience = "beginner" | "intermediate" | "advanced";

interface FormData {
  goal: Goal;
  gender: Gender;
  age: string;
  height: string;
  weight: string;
  activity: number;
  days: number;
  experience: Experience | "";
  flavor: string;
  kosher: boolean;
  sensitivities: string[];
  sensitivitiesOther: string;
  name: string;
  phone: string;
  email: string;
}


const GOALS: { id: Goal; name: string; desc: string; calorieFactor: number; proteinPerKg: number; productGoal: string }[] = [
  { id: "weight-loss", name: "ירידה במשקל", desc: "גירעון קלורי מבוקר", calorieFactor: 0.8, proteinPerKg: 2.0, productGoal: "weight-loss" },
  { id: "toning", name: "חיטוב", desc: "שמירה על מסת שריר, הפחתת שומן", calorieFactor: 0.9, proteinPerKg: 1.8, productGoal: "recovery" },
  { id: "muscle", name: "בניית שריר", desc: "עודף קלורי מתון", calorieFactor: 1.1, proteinPerKg: 2.2, productGoal: "muscle" },
];

const ACTIVITIES = [
  { value: 1.2, name: "יושבני", desc: "מעט מאוד תנועה ביום" },
  { value: 1.375, name: "קליל", desc: "1-3 אימונים בשבוע" },
  { value: 1.55, name: "בינוני", desc: "3-5 אימונים בשבוע" },
  { value: 1.725, name: "גבוה", desc: "6-7 אימונים בשבוע" },
];

const FLAVORS = ["וניל", "שוקולד", "עוגיות", "בננה", "פירות יער", "מנגו", "לאטה"];

const EXPERIENCES: { id: Experience; name: string; desc: string }[] = [
  { id: "beginner", name: "מתחיל/ה", desc: "עד חצי שנה של אימונים" },
  { id: "intermediate", name: "בינוני/ת", desc: "בין חצי שנה לשנתיים" },
  { id: "advanced", name: "מתקדם/ת", desc: "שנתיים ומעלה" },
];

const EXPERIENCE_NAME = (id?: string) => EXPERIENCES.find((e) => e.id === id)?.name || "";

const BASE_WEEKS = 4;

/** which week of the program the user is in, 1-based */
function weekInProgram(startDate?: string | null): number {
  if (!startDate) return 1;
  const start = new Date(startDate).getTime();
  if (Number.isNaN(start)) return 1;
  const diffDays = Math.floor((Date.now() - start) / 86400000);
  return Math.max(1, Math.floor(diffDays / 7) + 1);
}


const SENSITIVITIES: { id: string; name: string; desc: string }[] = [
  { id: "lactose", name: "רגישות ללקטוז", desc: "נחליף חלב במשקה שקדים / סויה או חלב ללא לקטוז" },
  { id: "gluten", name: "רגישות לגלוטן", desc: "נשתמש בדגנים ללא גלוטן בלבד" },
  { id: "soy", name: "רגישות לסויה", desc: "בלי סויה, טופו או משקה סויה" },
  { id: "nuts", name: "רגישות לאגוזים", desc: "נחליף אגוזים בזרעים (חמניה, דלעת)" },
  { id: "eggs", name: "רגישות לביצים", desc: "נציע חלופות חלבון ללא ביצים" },
  { id: "vegan", name: "צמחוני / טבעוני", desc: "מקורות חלבון מהצומח בלבד" },
  { id: "sugar", name: "רגישות לסוכר / סוכרת", desc: "נשמור על פחמימות מורכבות ומדד גליקמי נמוך" },
  { id: "fish", name: "רגישות לדגים", desc: "בלי דגים ופירות ים" },
];

const STEP_TITLES = ["פתיחה", "פרטים אישיים", "העדפות ורגישויות", "פרטי קשר", "התוכנית שלך"];

const LS_KEY = "fullbody_plan_v1";


/* ---------- calculation logic ---------- */

interface WorkoutDay { name: string; focus: string; exercises: string[] }
interface PlanResults {
  bmr: number;
  tdee: number;
  targetCalories: number;
  protein: number;
  fat: number;
  carbs: number;
  water: number;
  splitName: string;
  reps: string;
  rest: string;
  workouts: WorkoutDay[];
  meals: { name: string; time: string; content: string }[];
  productHandles: string[];
  isBasePhase: boolean;
}

function buildPlan(f: FormData, week = 1): PlanResults {
  const weight = parseFloat(f.weight) || 0;
  const height = parseFloat(f.height) || 0;
  const age = parseFloat(f.age) || 0;
  const goal = GOALS.find((g) => g.id === f.goal)!;

  const bmr = 10 * weight + 6.25 * height - 5 * age + (f.gender === "male" ? 5 : -161);
  const tdee = bmr * f.activity;
  const targetCalories = tdee * goal.calorieFactor;

  const protein = weight * goal.proteinPerKg;
  const fat = (targetCalories * 0.25) / 9;
  const carbs = (targetCalories - protein * 4 - fat * 9) / 4;

  /* workout split - beginners start with 4 weeks of full body */
  const isBasePhase = f.experience === "beginner" && week <= BASE_WEEKS;
  let splitName = "אימון גוף מלא";
  let workouts: WorkoutDay[] = [];
  if (isBasePhase || f.days <= 3) {
    splitName = isBasePhase ? "גוף מלא (Full Body) - שלב בניית הבסיס" : "גוף מלא (Full Body)";
    workouts = Array.from({ length: f.days }, (_, i) => ({
      name: `אימון ${i + 1}`,
      focus: "גוף מלא",
      exercises: ["סקוואט", "לחיצת חזה", "חתירה", "לחיצת כתפיים", "מתח / פולי עליון", "בטן ופלאנק"],
    }));
  } else if (f.days === 4) {
    splitName = "פיצול עליון / תחתון (Upper-Lower)";
    workouts = [
      { name: "יום 1", focus: "פלג גוף עליון", exercises: ["לחיצת חזה", "חתירה", "לחיצת כתפיים", "כפיפות מרפק", "פשיטות מרפק"] },
      { name: "יום 2", focus: "פלג גוף תחתון", exercises: ["סקוואט", "מכרעים", "לחיצת רגליים", "כפיפות ברך", "עליות עקב"] },
      { name: "יום 3", focus: "פלג גוף עליון", exercises: ["מתח / פולי עליון", "לחיצת חזה בשיפוע", "הרחקות כתף", "חתירה בפולי"] },
      { name: "יום 4", focus: "פלג גוף תחתון + ליבה", exercises: ["דדליפט רומני", "סקוואט בולגרי", "היפ תראסט", "פלאנק"] },
    ];
  } else {
    splitName = "Push / Pull / Legs";
    const base: WorkoutDay[] = [
      { name: "Push", focus: "חזה, כתפיים, יד אחורית", exercises: ["לחיצת חזה", "לחיצת כתפיים", "מקבילים", "הרחקות כתף", "פשיטות מרפק"] },
      { name: "Pull", focus: "גב, יד קדמית", exercises: ["מתח", "חתירה עם מוט", "פולי עליון", "כפיפות מרפק", "פייס פול"] },
      { name: "Legs", focus: "רגליים וליבה", exercises: ["סקוואט", "דדליפט רומני", "לחיצת רגליים", "כפיפות ברך", "פלאנק"] },
    ];
    workouts = Array.from({ length: f.days }, (_, i) => ({ ...base[i % 3], name: `יום ${i + 1} - ${base[i % 3].name}` }));
  }


  const reps = f.goal === "muscle" ? "6-10 חזרות, 4 סטים" : f.goal === "toning" ? "10-12 חזרות, 3-4 סטים" : "12-15 חזרות, 3 סטים";
  const rest = f.goal === "muscle" ? "90-120 שניות מנוחה" : f.goal === "toning" ? "60-75 שניות מנוחה" : "30-45 שניות מנוחה";

  /* sample daily menu, adjusted to sensitivities */
  const s = (id: string) => f.sensitivities?.includes(id);
  const milk = s("lactose")
    ? s("soy") ? 'משקה שקדים או חלב ללא לקטוז' : 'משקה סויה או חלב ללא לקטוז'
    : 'חלב 1% או 3%';
  const grain = s("gluten") ? "כף קוואקר ללא גלוטן או קינואה תפוחה" : "כף שיבולת שועל";
  const snackFat = s("nuts") ? "חופן זרעי דלעת או חמניה" : "חופן שקדים";
  const lunchProtein = s("vegan")
    ? s("soy") ? "עדשים, חומוס או שעועית" : "טופו, עדשים או שעועית"
    : s("fish") ? "עוף או הודו רזה" : "עוף, דג או הודו רזה";
  const lunchCarb = s("sugar") ? "קינואה או אורז מלא במידה מדודה" : "אורז מלא או קינואה";
  const preWorkout = s("gluten") ? "פריכיות אורז עם ממרח חלבוני או משקה חלבון קל" : "פרוסת לחם מלא עם ממרח חלבוני או משקה חלבון קל";
  const dinner = s("vegan")
    ? "יוגורט על בסיס צמחי / חלבון מהצומח + ירקות מאודים"
    : s("eggs")
      ? s("lactose") ? "עוף בגריל + ירקות מאודים" : "יוגורט יווני או גבינה רזה + ירקות מאודים"
      : s("lactose") ? "חביתה + ירקות מאודים" : "חביתה / יוגורט יווני / דג אפוי + ירקות מאודים";

  const meals = [
    { name: "ארוחת בוקר", time: "07:00", content: `שייק פורמולה 1 בטעם ${f.flavor} עם 250 מ"ל ${milk} + ${grain}` },
    { name: "ביניים", time: "10:30", content: `פרי עונתי + ${snackFat}` },
    { name: "צהריים", time: "13:00", content: `${Math.round(weight * 2)} גרם חלבון רזה (${lunchProtein}) + ${lunchCarb} + סלט ירקות בשמן זית` },
    { name: "לפני האימון", time: "16:30", content: preWorkout },
    { name: "ערב", time: "19:30", content: dinner },
  ];


  /* product recommendations from the existing catalog */
  const pool = herbalifeProducts.filter((p) => (f.kosher ? p.isKosherMehadrin : true));
  const src = pool.length ? pool : herbalifeProducts;
  const byGoal = src.filter((p) => p.goals?.includes(goal.productGoal));
  const flavorMatch = src.filter((p) => p.flavors?.includes(f.flavor));
  const fillers = src.filter((p) => p.goals?.includes("general-health") || p.goals?.includes("meal-replacement"));
  const handles: string[] = [];
  [...flavorMatch, ...byGoal, ...fillers, ...src].forEach((p) => {
    if (handles.length < 4 && !handles.includes(p.handle)) handles.push(p.handle);
  });

  return {
    isBasePhase,

    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    targetCalories: Math.round(targetCalories),
    protein: Math.round(protein),
    fat: Math.round(fat),
    carbs: Math.round(carbs),
    water: Math.round(weight * 35),
    splitName,
    reps,
    rest,
    workouts,
    meals,
    productHandles: handles,
  };
}

/* ---------- small UI helpers ---------- */

const OptionCard = ({ active, title, desc, onClick }: { active: boolean; title: string; desc?: string; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full text-right rounded-xl border p-4 transition-all ${
      active ? "border-primary bg-primary/5 shadow-cta" : "border-border bg-card hover:border-primary/50"
    }`}
  >
    <span className={`block font-bold ${active ? "text-primary" : "text-foreground"}`}>{title}</span>
    {desc && <span className="block text-sm text-muted-foreground mt-0.5">{desc}</span>}
  </button>
);

const Field = ({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <label className="block">
    <span className="block text-sm font-semibold text-foreground mb-1.5">{label}</span>
    <input
      {...props}
      className="w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
    />
  </label>
);

/* ---------- page ---------- */

const emptyForm: FormData = {
  goal: "weight-loss",
  gender: "male",
  age: "",
  height: "",
  weight: "",
  activity: 1.375,
  days: 3,
  experience: "",
  flavor: "וניל",

  kosher: false,
  sensitivities: [],
  sensitivitiesOther: "",
  name: "",
  phone: "",

  email: "",
};

export default function PlanWizard() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<{ form: FormData; results: PlanResults } | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.form && parsed?.results) {
          setSaved({ ...parsed, form: { ...emptyForm, ...parsed.form } });
          setForm({ ...emptyForm, ...parsed.form });
          if (parsed.program_start_date) setStartDate(parsed.program_start_date);
          setStep(4);
        }
      }
    } catch {
      /* ignore */
    }

    // touch last_seen_at for returning registrants
    const leadId = localStorage.getItem("fullbody_lead_id");
    if (leadId) {
      supabase
        .from("leads")
        .update({ last_seen_at: new Date().toISOString() })
        .eq("id", leadId)
        .then(() => undefined);
    }
  }, []);

  const set = <K extends keyof FormData>(k: K, v: FormData[K]) => setForm((p) => ({ ...p, [k]: v }));

  const toggleSensitivity = (id: string) =>
    setForm((p) => ({
      ...p,
      sensitivities: p.sensitivities.includes(id) ? p.sensitivities.filter((x) => x !== id) : [...p.sensitivities, id],
    }));

  const week = useMemo(() => weekInProgram(startDate), [startDate]);

  // recomputed live, so the flavor picked at the end updates the menu and products
  const results = useMemo(() => buildPlan(form, week), [form, week]);
  const graduated = form.experience === "beginner" && week > BASE_WEEKS;

  const pickFlavor = (fl: string) => {
    set("flavor", fl);
    if (saved) {
      const next = { ...form, flavor: fl };
      const computed = buildPlan(next, week);
      setSaved({ form: next, results: computed });
      try {
        const raw = localStorage.getItem(LS_KEY);
        const prev = raw ? JSON.parse(raw) : {};
        localStorage.setItem(LS_KEY, JSON.stringify({ ...prev, form: next, results: computed }));
      } catch {
        /* ignore */
      }
    }
  };


  const recommended: HerbalifeProduct[] = useMemo(
    () => results.productHandles.map((h) => herbalifeProducts.find((p) => p.handle === h)).filter(Boolean) as HerbalifeProduct[],
    [results.productHandles]
  );

  const step1Valid =
    form.age && form.height && form.weight && +form.age > 0 && +form.height > 0 && +form.weight > 0 && !!form.experience;
  const phoneValid = /^0\d{1,2}-?\d{7}$/.test(form.phone.replace(/\s/g, ""));
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim());


  const handleSubmit = async () => {
    if (!form.name.trim()) return toast.error("נא למלא שם מלא");
    if (!phoneValid) return toast.error("נא למלא מספר טלפון תקין");
    setSaving(true);
    const computed = buildPlan(form);
    try {
      const { data: lead, error } = await supabase
        .from("leads")
        .insert({
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim() || null,
          goal: form.goal,
          gender: form.gender,
          age: parseInt(form.age),
          height: parseFloat(form.height),
          weight: parseFloat(form.weight),
          activity: form.activity,
          days: form.days,
          kosher: form.kosher,
          flavor: form.flavor,
          target_calories: computed.targetCalories,
        })
        .select("id")
        .single();
      if (error) throw error;

      await supabase.from("plans").insert([
        {
          lead_id: lead.id,
          form_data: form as unknown as never,
          results_data: computed as unknown as never,
        },
      ]);


      localStorage.setItem("fullbody_lead_id", lead.id);
      localStorage.setItem(LS_KEY, JSON.stringify({ form, results: computed, lead_id: lead.id }));
      setSaved({ form, results: computed });
      setStep(4);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      console.error(e);
      toast.error("אירעה שגיאה בשמירת התוכנית, נסו שוב");
    } finally {
      setSaving(false);
    }
  };

  const restart = () => {
    localStorage.removeItem(LS_KEY);
    localStorage.removeItem("fullbody_lead_id");
    setSaved(null);
    setForm(emptyForm);
    setStep(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goalName = GOALS.find((g) => g.id === form.goal)!.name;

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Helmet>
        <title>תוכנית אישית תוך 2 דקות | FullBody</title>
        <meta
          name="description"
          content="שאלון קצר שבונה לכם תוכנית תזונה ואימונים אישית: יעד קלוריות, חלוקת מאקרו, תוכנית אימון שבועית ותפריט יומי לדוגמה."
        />
        <link rel="canonical" href="https://fullbody.co.il/plan" />
      </Helmet>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={greenLogo} alt="FullBody" className="h-10" />
          </Link>
          <Link to="/products" className="text-sm font-semibold text-foreground hover:text-primary flex items-center gap-1">
            לחנות <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Progress */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-3 max-w-3xl">
          <div className="flex items-center gap-1.5">
            {STEP_TITLES.map((t, i) => (
              <div key={t} className="flex-1">
                <div className={`h-1.5 rounded-full ${i <= step ? "bg-primary" : "bg-muted"}`} />
                <span className={`mt-1 block text-[11px] ${i === step ? "text-primary font-bold" : "text-muted-foreground"}`}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* STEP 0 - intro */}
        {step === 0 && (
          <section className="text-center py-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-4 py-1.5 text-sm font-bold">
              <Sparkles className="w-4 h-4" /> חינם, ללא התחייבות
            </span>
            <h1 className="mt-5 text-3xl md:text-4xl font-extrabold text-foreground leading-tight">
              התוכנית האישית שלך תוך 2 דקות
            </h1>
            <p className="mt-3 text-muted-foreground text-lg">
              עונים על כמה שאלות קצרות ומקבלים יעד קלוריות מדויק, חלוקת מאקרו, תוכנית אימונים שבועית, תפריט יומי לדוגמה והתאמת מוצרים מהקטלוג שלנו.
            </p>
            <div className="mt-8 grid sm:grid-cols-3 gap-3 text-right">
              {[
                { icon: Flame, title: "יעד קלוריות מדויק", desc: "חישוב BMR ו-TDEE לפי הנתונים שלך" },
                { icon: Dumbbell, title: "תוכנית אימונים", desc: "פיצול שבועי שמתאים למספר הימים שלך" },
                { icon: Utensils, title: "תפריט לדוגמה", desc: "5 ארוחות ביום כולל שייק הבוקר" },
              ].map((c) => (
                <div key={c.title} className="rounded-xl border border-border bg-card p-4 shadow-card">
                  <c.icon className="w-6 h-6 text-primary mb-2" />
                  <h2 className="font-bold text-foreground">{c.title}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{c.desc}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setStep(1)}
              className="mt-8 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-8 py-4 font-bold text-lg shadow-cta hover:opacity-90 transition"
            >
              בואו נתחיל <ArrowLeft className="w-5 h-5" />
            </button>
          </section>
        )}

        {/* STEP 1 - personal details */}
        {step === 1 && (
          <section className="space-y-6">
            <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
              <Target className="w-6 h-6 text-primary" /> מה המטרה שלך?
            </h1>
            <div className="grid sm:grid-cols-3 gap-3">
              {GOALS.map((g) => (
                <OptionCard key={g.id} active={form.goal === g.id} title={g.name} desc={g.desc} onClick={() => set("goal", g.id)} />
              ))}
            </div>

            <h2 className="text-lg font-bold text-foreground flex items-center gap-2 pt-2">
              <User className="w-5 h-5 text-primary" /> פרטים אישיים
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <OptionCard active={form.gender === "male"} title="גבר" onClick={() => set("gender", "male")} />
              <OptionCard active={form.gender === "female"} title="אישה" onClick={() => set("gender", "female")} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Field label="גיל" type="number" inputMode="numeric" value={form.age} onChange={(e) => set("age", e.target.value)} placeholder="30" />
              <Field label='גובה (ס"מ)' type="number" inputMode="numeric" value={form.height} onChange={(e) => set("height", e.target.value)} placeholder="175" />
              <Field label={'משקל (ק"ג)'} type="number" inputMode="decimal" value={form.weight} onChange={(e) => set("weight", e.target.value)} placeholder="80" />
            </div>

            <h2 className="text-lg font-bold text-foreground pt-2">רמת פעילות</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {ACTIVITIES.map((a) => (
                <OptionCard key={a.value} active={form.activity === a.value} title={a.name} desc={a.desc} onClick={() => set("activity", a.value)} />
              ))}
            </div>
          </section>
        )}

        {/* STEP 2 - training preferences */}
        {step === 2 && (
          <section className="space-y-6">
            <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
              <Dumbbell className="w-6 h-6 text-primary" /> העדפות ורגישויות
            </h1>

            <div>
              <h2 className="text-lg font-bold text-foreground mb-3">כמה ימים בשבוע תתאמנו?</h2>
              <div className="grid grid-cols-5 gap-2">
                {[2, 3, 4, 5, 6].map((d) => (
                  <button
                    key={d}
                    onClick={() => set("days", d)}
                    className={`rounded-xl border py-3 font-bold transition ${
                      form.days === d ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:border-primary/50"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground mb-1">רגישויות והעדפות תזונה</h2>
              <p className="text-sm text-muted-foreground mb-3">אפשר לסמן כמה שרוצים, נתאים את התפריט וההמלצות בהתאם.</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {SENSITIVITIES.map((sv) => {
                  const active = form.sensitivities.includes(sv.id);
                  return (
                    <button
                      key={sv.id}
                      type="button"
                      onClick={() => toggleSensitivity(sv.id)}
                      className={`text-right rounded-xl border p-4 transition-all ${
                        active ? "border-primary bg-primary/5 shadow-cta" : "border-border bg-card hover:border-primary/50"
                      }`}
                    >
                      <span className={`block font-bold ${active ? "text-primary" : "text-foreground"}`}>{sv.name}</span>
                      <span className="block text-sm text-muted-foreground mt-0.5">{sv.desc}</span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-3">
                <Field
                  label="רגישות אחרת (לא חובה)"
                  value={form.sensitivitiesOther}
                  onChange={(e) => set("sensitivitiesOther", e.target.value)}
                  placeholder="לדוגמה: רגישות לשומשום, צליאק, אלרגיה לתותים"
                  maxLength={200}
                />
              </div>
            </div>


            <label className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 cursor-pointer">
              <input
                type="checkbox"
                checked={form.kosher}
                onChange={(e) => set("kosher", e.target.checked)}
                className="mt-1 w-5 h-5 accent-[hsl(var(--primary))]"
              />
              <span>
                <span className="block font-bold text-foreground">חשוב לי כשר למהדרין</span>
                <span className="block text-sm text-muted-foreground">נמליץ רק על מוצרים בעלי תעודת כשרות למהדרין</span>
              </span>
            </label>
          </section>
        )}

        {/* STEP 3 - lead form */}
        {step === 3 && (
          <section className="space-y-5">
            <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
              <Phone className="w-6 h-6 text-primary" /> לאן לשלוח את התוכנית?
            </h1>
            <p className="text-muted-foreground">התוכנית תוצג מיד על המסך. נשמח גם ליצור קשר לליווי אישי במידת הצורך.</p>
            <Field label="שם מלא *" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="ישראל ישראלי" maxLength={80} />
            <Field label="טלפון *" type="tel" inputMode="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="050-0000000" maxLength={20} />
            <Field label="אימייל (לא חובה)" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="mail@example.com" maxLength={120} />
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-8 py-4 font-bold text-lg shadow-cta hover:opacity-90 transition disabled:opacity-60"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              {saving ? "בונה את התוכנית..." : "צפו בתוכנית שלי"}
            </button>
            <p className="text-xs text-muted-foreground text-center">
              הפרטים נשמרים לצורך יצירת קשר בלבד. המידע כאן אינו מהווה ייעוץ רפואי, ואינו מיועד לאבחון או טיפול.
            </p>
          </section>
        )}

        {/* STEP 4 - results */}
        {step === 4 && (
          <section className="space-y-8">
            <div className="text-center">
              <CheckCircle2 className="w-10 h-10 text-primary mx-auto" />
              <h1 className="mt-3 text-2xl md:text-3xl font-extrabold text-foreground">
                {form.name ? `${form.name}, ` : ""}התוכנית האישית שלך מוכנה
              </h1>
              <p className="text-muted-foreground mt-2">
                מטרה: {goalName} · {form.days} אימונים בשבוע
              </p>
            </div>

            {/* numbers */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "קלוריות ליום", value: results.targetCalories },
                { label: "חלבון (גרם)", value: results.protein },
                { label: "פחמימה (גרם)", value: results.carbs },
                { label: "שומן (גרם)", value: results.fat },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-border bg-card p-4 text-center shadow-card">
                  <div className="text-2xl font-extrabold text-primary">{s.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground text-center">
              BMR: {results.bmr} קק"ל · TDEE: {results.tdee} קק"ל · מים מומלצים: כ-{results.water} מ"ל ליום
            </p>

            {/* workouts */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-primary" /> תוכנית אימונים: {results.splitName}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">{results.reps} · {results.rest}</p>
              <div className="mt-4 grid sm:grid-cols-2 gap-3">
                {results.workouts.map((w, i) => (
                  <div key={i} className="rounded-xl border border-border p-4">
                    <div className="font-bold text-foreground">{w.name}</div>
                    <div className="text-xs text-primary font-semibold mb-2">{w.focus}</div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {w.exercises.map((ex) => (
                        <li key={ex}>· {ex}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* menu */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Utensils className="w-5 h-5 text-primary" /> תפריט יומי לדוגמה
              </h2>
              <div className="mt-4 space-y-3">
                {results.meals.map((m) => (
                  <div key={m.name} className="flex gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
                    <div className="shrink-0 w-14 text-sm font-bold text-primary">{m.time}</div>
                    <div>
                      <div className="font-semibold text-foreground">{m.name}</div>
                      <div className="text-sm text-muted-foreground">{m.content}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* flavor - last step, after the plan itself */}
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5">
              <h2 className="text-xl font-bold text-foreground">השלב האחרון: בחרו טעם לשייק</h2>
              <p className="text-sm text-muted-foreground mt-1">
                הטעם משפיע על התפריט ועל המוצרים שנמליץ. אפשר לשנות בכל רגע.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {FLAVORS.map((fl) => (
                  <button
                    key={fl}
                    onClick={() => pickFlavor(fl)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      form.flavor === fl ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:border-primary/50"
                    }`}
                  >
                    {fl}
                  </button>
                ))}
              </div>
              {form.sensitivities.length > 0 && (
                <p className="mt-3 text-xs text-muted-foreground">
                  התפריט הותאם לרגישויות שסימנתם: {form.sensitivities.map((id) => SENSITIVITIES.find((s) => s.id === id)?.name).filter(Boolean).join(", ")}
                  {form.sensitivitiesOther ? `, ${form.sensitivitiesOther}` : ""}
                </p>
              )}
            </div>



            {/* products */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">המוצרים שמתאימים לתוכנית שלך</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {recommended.map((p) => (
                  <Link
                    key={p.handle}
                    to={`/product/${p.handle}`}
                    className="rounded-xl border border-border bg-card p-3 shadow-card hover:shadow-hover transition"
                  >
                    <img src={p.image} alt={p.title} loading="lazy" className="w-full h-32 object-contain" />
                    <div className="mt-2 text-sm font-bold text-foreground line-clamp-2">{p.title}</div>
                    <div className="text-primary font-extrabold mt-1">₪{p.price}</div>
                  </Link>
                ))}
              </div>
              <Link
                to="/products"
                className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-8 py-4 font-bold shadow-cta hover:opacity-90 transition"
              >
                לכל המוצרים בחנות <ArrowLeft className="w-5 h-5" />
              </Link>
            </div>

            <button onClick={restart} className="w-full inline-flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary">
              <RefreshCw className="w-4 h-4" /> מילוי שאלון מחדש
            </button>

            <p className="text-xs text-muted-foreground text-center">
              התוכנית מבוססת על נוסחאות תזונה מקובלות ומהווה המלצה כללית בלבד. אינה מהווה ייעוץ רפואי או תחליף להתייעצות עם רופא או דיאטן מוסמך.
            </p>
          </section>
        )}

        {/* nav buttons */}
        {step > 0 && step < 3 && (
          <div className="mt-8 flex items-center gap-3">
            <button
              onClick={() => setStep((s) => s - 1)}
              className="rounded-xl border border-border bg-card px-5 py-3 font-semibold text-foreground inline-flex items-center gap-1"
            >
              <ArrowRight className="w-4 h-4" /> חזרה
            </button>
            <button
              onClick={() => {
                if (step === 1 && !step1Valid) return toast.error("נא למלא גיל, גובה ומשקל");
                setStep((s) => s + 1);
              }}
              className="flex-1 rounded-xl bg-primary text-primary-foreground px-6 py-3 font-bold shadow-cta hover:opacity-90 transition inline-flex items-center justify-center gap-1"
            >
              המשך <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>

      <ProFooter />
    </div>
  );
}
