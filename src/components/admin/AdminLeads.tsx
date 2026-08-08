import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, ChevronDown, ChevronUp, Search, Download } from 'lucide-react';

type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  goal: string | null;
  gender: string | null;
  age: number | null;
  height: number | null;
  weight: number | null;
  activity: number | null;
  days: number | null;
  kosher: boolean | null;
  flavor: string | null;
  target_calories: number | null;
  experience_level: string | null;
  program_start_date: string | null;
  last_seen_at: string | null;
  created_at: string;
};


type Plan = {
  id: string;
  lead_id: string | null;
  form_data: any;
  results_data: any;
  created_at: string;
};

const goalLabels: Record<string, string> = {
  lose: 'ירידה במשקל',
  gain: 'עלייה במסה',
  maintain: 'שמירה על המשקל',
  tone: 'חיטוב',
};

const activityLabels: Record<string, string> = {
  '1.2': 'יושבני',
  '1.375': 'קל',
  '1.55': 'בינוני',
  '1.725': 'גבוה',
  '1.9': 'ספורטיבי מאוד',
};

const sensitivityLabels: Record<string, string> = {
  lactose: 'לקטוז',
  gluten: 'גלוטן',
  soy: 'סויה',
  nuts: 'אגוזים',
  eggs: 'ביצים',
  vegan: 'צמחוני/טבעוני',
  sugar: 'סוכר/סוכרת',
  fish: 'דגים',
};

const experienceLabels: Record<string, string> = {
  beginner: 'מתחיל/ה',
  intermediate: 'בינוני/ת',
  advanced: 'מתקדם/ת',
};

function fmt(d: string) {
  return new Date(d).toLocaleString('he-IL', { dateStyle: 'short', timeStyle: 'short' });
}

function relTime(d?: string | null) {
  if (!d) return 'מעולם';
  const diff = Date.now() - new Date(d).getTime();
  if (Number.isNaN(diff)) return '—';
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'עכשיו';
  if (m < 60) return `לפני ${m} דקות`;
  const h = Math.floor(m / 60);
  if (h < 24) return `לפני ${h} שעות`;
  const days = Math.floor(h / 24);
  if (days === 1) return 'לפני יום';
  if (days < 30) return `לפני ${days} ימים`;
  const months = Math.floor(days / 30);
  return months === 1 ? 'לפני חודש' : `לפני ${months} חודשים`;
}

function weekInProgram(start?: string | null) {
  if (!start) return null;
  const t = new Date(start).getTime();
  if (Number.isNaN(t)) return null;
  return Math.max(1, Math.floor(Math.floor((Date.now() - t) / 86400000) / 7) + 1);
}


export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<string | null>(null);
  const [q, setQ] = useState('');

  useEffect(() => {
    (async () => {
      const [{ data: l }, { data: p }] = await Promise.all([
        supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(500),
        supabase.from('plans').select('*').order('created_at', { ascending: false }).limit(500),
      ]);
      setLeads((l as Lead[]) || []);
      setPlans((p as Plan[]) || []);
      setLoading(false);
    })();
  }, []);

  const filtered = leads.filter(l => {
    if (!q.trim()) return true;
    const s = q.toLowerCase();
    return [l.name, l.phone, l.email].some(v => (v || '').toLowerCase().includes(s));
  });

  const planFor = (leadId: string) => plans.find(p => p.lead_id === leadId);

  function exportCsv() {
    const headers = ['תאריך', 'שם', 'טלפון', 'אימייל', 'מטרה', 'מין', 'גיל', 'גובה', 'משקל', 'ימי אימון', 'כשר', 'טעם', 'קלוריות יעד'];
    const rows = filtered.map(l => [
      fmt(l.created_at), l.name, l.phone, l.email || '', goalLabels[l.goal || ''] || l.goal || '',
      l.gender === 'male' ? 'גבר' : l.gender === 'female' ? 'אישה' : '', l.age ?? '', l.height ?? '',
      l.weight ?? '', l.days ?? '', l.kosher ? 'כן' : 'לא', l.flavor || '', l.target_calories ?? '',
    ]);
    const csv = '\uFEFF' + [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `plan-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return <div className="flex items-center justify-center py-16 text-gray-400"><Loader2 className="w-5 h-5 animate-spin" /></div>;
  }

  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="חיפוש לפי שם / טלפון / אימייל"
            className="w-full bg-white/[0.03] border border-white/10 rounded-lg py-2 pr-9 pl-3 text-sm text-white outline-none focus:border-blue-500"
          />
        </div>
        <span className="text-xs text-gray-500">{filtered.length} נרשמים</span>
        <button onClick={exportCsv} className="flex items-center gap-1.5 bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 rounded-lg px-3 py-2 text-xs">
          <Download className="w-3.5 h-3.5" /> ייצוא CSV
        </button>
      </div>

      {filtered.length === 0 && <p className="text-sm text-gray-500 py-8 text-center">אין נרשמים עדיין</p>}

      <div className="space-y-2">
        {filtered.map(l => {
          const plan = planFor(l.id);
          const isOpen = open === l.id;
          const recs: any[] = plan?.results_data?.products || plan?.results_data?.recommendations || [];
          return (
            <div key={l.id} className="bg-white/[0.03] border border-white/5 rounded-xl overflow-hidden">
              <button onClick={() => setOpen(isOpen ? null : l.id)} className="w-full flex items-center justify-between gap-3 p-4 text-right hover:bg-white/[0.03] transition">
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{l.name} <span className="text-gray-500 font-normal" dir="ltr">{l.phone}</span></p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {fmt(l.created_at)} · {goalLabels[l.goal || ''] || l.goal || 'ללא מטרה'}
                    {l.target_calories ? ` · ${l.target_calories} קק"ל` : ''}
                  </p>
                </div>
                {isOpen ? <ChevronUp className="w-4 h-4 text-gray-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />}
              </button>

              {isOpen && (
                <div className="border-t border-white/5 p-4 space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    {[
                      ['אימייל', l.email || '—'],
                      ['מין', l.gender === 'male' ? 'גבר' : l.gender === 'female' ? 'אישה' : '—'],
                      ['גיל', l.age ?? '—'],
                      ['גובה', l.height ? `${l.height} ס"מ` : '—'],
                      ['משקל', l.weight ? `${l.weight} ק"ג` : '—'],
                      ['רמת פעילות', activityLabels[String(l.activity)] || l.activity || '—'],
                      ['ימי אימון', l.days ?? '—'],
                      ['כשר למהדרין', l.kosher ? 'כן' : 'לא'],
                      ['טעם מועדף', l.flavor || '—'],
                      ['קלוריות יעד', l.target_calories ?? '—'],
                      ['זמן כניסה לתוכנית', plan ? fmt(plan.created_at) : '—'],
                    ].map(([k, v]) => (
                      <div key={String(k)} className="bg-white/[0.03] rounded-lg p-2.5">
                        <p className="text-gray-500">{k}</p>
                        <p className="text-white font-medium mt-0.5">{String(v)}</p>
                      </div>
                    ))}
                  </div>

                  {(plan?.form_data?.sensitivities?.length > 0 || plan?.form_data?.sensitivitiesOther) && (
                    <div>
                      <p className="text-xs text-gray-400 mb-2">רגישויות והעדפות תזונה</p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        {(plan?.form_data?.sensitivities || []).map((s: string) => (
                          <span key={s} className="bg-amber-500/10 text-amber-300 rounded-lg px-2.5 py-1">{sensitivityLabels[s] || s}</span>
                        ))}
                        {plan?.form_data?.sensitivitiesOther && (
                          <span className="bg-amber-500/10 text-amber-300 rounded-lg px-2.5 py-1">{plan.form_data.sensitivitiesOther}</span>
                        )}
                      </div>
                    </div>
                  )}


                  {plan?.results_data?.macros && (
                    <div>
                      <p className="text-xs text-gray-400 mb-2">מאקרו</p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        {Object.entries(plan.results_data.macros as Record<string, any>).map(([k, v]) => (
                          <span key={k} className="bg-blue-500/10 text-blue-300 rounded-lg px-2.5 py-1">{k}: {String(v)}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {recs.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-400 mb-2">מוצרים שהתעניין בהם (הומלצו)</p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        {recs.map((r: any, i: number) => (
                          <span key={i} className="bg-emerald-500/10 text-emerald-300 rounded-lg px-2.5 py-1">
                            {r?.name || r?.title || r?.handle || String(r)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {plan && (
                    <details className="text-xs">
                      <summary className="cursor-pointer text-gray-500 hover:text-gray-300">נתונים גולמיים (JSON)</summary>
                      <pre dir="ltr" className="mt-2 bg-black/40 rounded-lg p-3 overflow-auto max-h-64 text-[10px] text-gray-400">
{JSON.stringify({ form: plan.form_data, results: plan.results_data }, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
