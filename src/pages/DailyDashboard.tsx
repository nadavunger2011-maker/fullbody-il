import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Flame, Dumbbell, Utensils, CheckCircle2, Loader2, Moon, TrendingUp, ArrowLeft,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ProFooter from "@/components/ProFooter";
import greenLogo from "@/assets/logo-green.webp";
import { buildPlan, weekInProgram, BASE_WEEKS, EXPERIENCE_NAME, type FormData, type PlanResults } from "./PlanWizard";

const LS_KEY = "fullbody_plan_v1";

/** training weekdays per days-per-week, 0 = Sunday */
const SCHEDULES: Record<number, number[]> = {
  1: [0],
  2: [0, 3],
  3: [0, 2, 4],
  4: [0, 1, 3, 4],
  5: [0, 1, 2, 4, 5],
  6: [0, 1, 2, 3, 4, 5],
};

const DAY_NAMES = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

type Checkin = {
  checkin_date: string;
  shake_done: boolean;
  workout_done: boolean;
  diet_done: boolean;
};

function computeStreak(rows: Checkin[]) {
  const good = new Set(
    rows
      .filter((r) => [r.shake_done, r.workout_done, r.diet_done].filter(Boolean).length >= 2)
      .map((r) => r.checkin_date)
  );
  let streak = 0;
  const d = new Date();
  // allow the streak to survive a day that has not been filled yet
  for (let i = 0; i < 400; i++) {
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    if (good.has(key)) streak++;
    else if (i > 0) break;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export default function DailyDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [experience, setExperience] = useState<string>("");
  const [name, setName] = useState("");
  const [rows, setRows] = useState<Checkin[]>([]);
  const [today, setToday] = useState<Checkin>({
    checkin_date: todayStr(),
    shake_done: false,
    workout_done: false,
    diet_done: false,
  });

  useEffect(() => {
    (async () => {
      const id = localStorage.getItem("fullbody_lead_id");
      if (!id) {
        navigate("/plan", { replace: true });
        return;
      }
      setLeadId(id);

      let localForm: FormData | null = null;
      try {
        const raw = localStorage.getItem(LS_KEY);
        if (raw) localForm = JSON.parse(raw)?.form ?? null;
      } catch { /* ignore */ }

      const [{ data: lead }, { data: plan }, { data: checkins }] = await Promise.all([
        supabase.from("leads").select("*").eq("id", id).maybeSingle(),
        supabase.from("plans").select("*").eq("lead_id", id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
        supabase.from("daily_checkins").select("checkin_date, shake_done, workout_done, diet_done").eq("lead_id", id).order("checkin_date", { ascending: false }).limit(400),
      ]);

      if (!lead) {
        navigate("/plan", { replace: true });
        return;
      }

      const f = ((plan?.form_data as unknown) as FormData | null) || localForm;
      setForm(f);
      setName(lead.name || "");
      setExperience(lead.experience_level || f?.experience || "");
      setStartDate(lead.program_start_date || lead.created_at?.slice(0, 10) || null);

      const list = (checkins as Checkin[]) || [];
      setRows(list);
      const t = list.find((r) => r.checkin_date === todayStr());
      if (t) setToday(t);

      // touch last seen
      supabase.from("leads").update({ last_seen_at: new Date().toISOString() }).eq("id", id).then(() => {});

      setLoading(false);
    })();
  }, [navigate]);

  const week = weekInProgram(startDate);

  const plan: PlanResults | null = useMemo(() => {
    if (!form) return null;
    return buildPlan({ ...form, experience: (experience as FormData["experience"]) || form.experience }, week);
  }, [form, experience, week]);

  const dow = new Date().getDay();
  const trainingDays = SCHEDULES[Math.min(6, Math.max(1, form?.days || 3))] || SCHEDULES[3];
  const isTrainingDay = trainingDays.includes(dow);
  const workout = isTrainingDay && plan
    ? plan.workouts[trainingDays.indexOf(dow) % Math.max(1, plan.workouts.length)]
    : null;

  const streak = useMemo(() => {
    const merged = [...rows.filter((r) => r.checkin_date !== today.checkin_date), today];
    return computeStreak(merged);
  }, [rows, today]);

  async function toggle(field: "shake_done" | "workout_done" | "diet_done") {
    if (!leadId) return;
    const next = { ...today, [field]: !today[field] };
    setToday(next);
    setSaving(true);
    const { error } = await supabase.from("daily_checkins").upsert(
      {
        lead_id: leadId,
        checkin_date: next.checkin_date,
        shake_done: next.shake_done,
        workout_done: next.workout_done,
        diet_done: next.diet_done,
      },
      { onConflict: "lead_id,checkin_date" }
    );
    setSaving(false);
    if (error) {
      console.error(error);
      toast.error("שמירת הצ'ק-אין נכשלה");
      setToday(today);
      return;
    }
    setRows((prev) => [next, ...prev.filter((r) => r.checkin_date !== next.checkin_date)]);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const basePhase = experience === "beginner" && week <= BASE_WEEKS;
  const progressPct = Math.min(100, Math.round((Math.min(week, BASE_WEEKS) / BASE_WEEKS) * 100));

  const Check = ({
    field, label, icon: Icon,
  }: { field: "shake_done" | "workout_done" | "diet_done"; label: string; icon: typeof Utensils }) => (
    <button
      type="button"
      onClick={() => toggle(field)}
      className={`w-full flex items-center gap-3 rounded-xl border p-4 text-right transition-all ${
        today[field] ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/50"
      }`}
    >
      <span
        className={`w-6 h-6 rounded-md border flex items-center justify-center shrink-0 ${
          today[field] ? "bg-primary border-primary text-primary-foreground" : "border-border"
        }`}
      >
        {today[field] && <CheckCircle2 className="w-4 h-4" />}
      </span>
      <Icon className="w-5 h-5 text-primary shrink-0" />
      <span className="font-semibold">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Helmet>
        <title>הדשבורד היומי שלך | FullBody</title>
        <meta name="description" content="התוכנית שלך להיום, צ'ק-אין יומי ורצף ההתמדה שלך בתוכנית האישית של FullBody." />
        <meta name="robots" content="noindex" />
      </Helmet>

      <header className="border-b border-border bg-card/60 backdrop-blur">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/"><img src={greenLogo} alt="FullBody" className="h-8 w-auto" loading="lazy" /></Link>
          <Link to="/plan" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1">
            התוכנית המלאה <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* streak */}
        <section className="rounded-2xl border border-border bg-card p-6 text-center">
          <p className="text-sm text-muted-foreground">שלום {name || "שם"}, זה הרצף שלך</p>
          <p className="text-5xl font-extrabold mt-1 flex items-center justify-center gap-2">
            {streak} <Flame className="w-9 h-9 text-orange-500" />
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {streak === 0 ? "סמן/י לפחות 2 מתוך 3 היום כדי להתחיל רצף" : `ימים רצופים עם לפחות 2 מתוך 3`}
          </p>
        </section>

        {/* week progress */}
        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 font-bold">
            <TrendingUp className="w-5 h-5 text-primary" />
            {basePhase ? `שבוע ${week} מתוך ${BASE_WEEKS} - שלב בניית הבסיס` : `שבוע ${week} בתוכנית`}
          </div>
          {basePhase && (
            <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progressPct}%` }} />
            </div>
          )}
          <p className="text-sm text-muted-foreground mt-2">
            {experience ? `רמת ניסיון: ${EXPERIENCE_NAME(experience)} · ` : ""}
            {plan?.splitName}
          </p>
        </section>

        {/* today */}
        <section className="rounded-2xl border border-border bg-card p-5">
          <h1 className="text-xl font-extrabold">התוכנית שלך היום · יום {DAY_NAMES[dow]}</h1>

          {isTrainingDay && workout ? (
            <div className="mt-4">
              <div className="flex items-center gap-2 font-bold text-primary">
                <Dumbbell className="w-5 h-5" /> יום אימון: {workout.name} · {workout.focus}
              </div>
              <ul className="mt-3 grid sm:grid-cols-2 gap-2">
                {workout.exercises.map((ex) => (
                  <li key={ex} className="rounded-xl bg-muted/50 px-3 py-2 text-sm">{ex}</li>
                ))}
              </ul>
              {plan && (
                <p className="text-xs text-muted-foreground mt-3">{plan.reps} · {plan.rest}</p>
              )}
            </div>
          ) : (
            <div className="mt-4 flex items-center gap-2 font-bold text-muted-foreground">
              <Moon className="w-5 h-5" /> יום מנוחה - התמקד/י בתזונה, שתייה ושינה
            </div>
          )}

          {plan && (
            <div className="mt-5">
              <div className="flex items-center gap-2 font-bold">
                <Utensils className="w-5 h-5 text-primary" /> התפריט של היום
              </div>
              <div className="mt-3 space-y-2">
                {plan.meals.map((m) => (
                  <div key={m.name} className="rounded-xl border border-border p-3">
                    <p className="text-sm font-semibold">{m.name} <span className="text-muted-foreground font-normal">{m.time}</span></p>
                    <p className="text-sm text-muted-foreground mt-0.5">{m.content}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                יעד יומי: {plan.targetCalories} קק"ל · {plan.protein} גרם חלבון · {plan.water} מ"ל מים
              </p>
            </div>
          )}
        </section>

        {/* check-in */}
        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="font-extrabold flex items-center gap-2">
            צ'ק-אין יומי {saving && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
          </h2>
          <div className="mt-4 space-y-3">
            <Check field="shake_done" label="עשיתי את השייק היום" icon={Utensils} />
            {isTrainingDay && <Check field="workout_done" label="התאמנתי היום" icon={Dumbbell} />}
            <Check field="diet_done" label="עמדתי בתפריט" icon={CheckCircle2} />
          </div>
        </section>

        {/* history */}
        {rows.length > 0 && (
          <section className="rounded-2xl border border-border bg-card p-5">
            <h2 className="font-extrabold">7 הימים האחרונים</h2>
            <div className="mt-3 space-y-2">
              {rows.slice(0, 7).map((r) => (
                <div key={r.checkin_date} className="flex items-center justify-between text-sm rounded-xl bg-muted/40 px-3 py-2">
                  <span>{new Date(r.checkin_date).toLocaleDateString("he-IL", { day: "2-digit", month: "2-digit" })}</span>
                  <span className="flex gap-2 text-xs text-muted-foreground">
                    <span className={r.shake_done ? "text-primary font-semibold" : ""}>שייק</span>
                    <span className={r.workout_done ? "text-primary font-semibold" : ""}>אימון</span>
                    <span className={r.diet_done ? "text-primary font-semibold" : ""}>תפריט</span>
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <ProFooter />
    </div>
  );
}
