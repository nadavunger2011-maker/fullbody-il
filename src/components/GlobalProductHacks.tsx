import React from 'react';
import { Sparkles, Award, Utensils, Zap, Flame, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

interface GlobalProductHacksProps {
  handle: string;
  category: string;
}

export default function GlobalProductHacks({ handle, category }: GlobalProductHacksProps) {
  const isFormula1 = handle.startsWith('formula-1');
  const isNiteworks = handle === 'niteworks';
  const isAloe = handle.startsWith('aloe');
  const isTea = handle.startsWith('instant-herbal');

  if (isNiteworks) {
    return (
      <div className="my-6 bg-gradient-to-br from-amber-500/10 via-card to-card border-2 border-amber-500/30 rounded-2xl p-5 shadow-card">
        <div className="flex items-center gap-2 mb-3">
          <Award className="w-6 h-6 text-amber-600 shrink-0" />
          <span className="bg-amber-500 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
            גיבוי מדע בינלאומי - זוכה פרס נובל
          </span>
        </div>
        <h3 className="text-xl font-black text-foreground mb-2">
          פורמולה שפותחה בשיתוף פרופ' לואיס איגנרו (זוכה פרס נובל לרפואה)
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Niteworks מבוססת על מחקר פריצת דרך שזיכה בפרס נובל לרפואה בתחום תפקוד חנקן חמצני (Nitric Oxide). הפורמולה מסייעת להרחבת כלי הדם, שיפור זרימת החמצן והתאוששות כלי הדם בזמן השינה.
        </p>
        <div className="grid grid-cols-2 gap-3 text-xs font-bold text-foreground bg-background/60 p-3 rounded-xl border border-amber-500/20">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-600" />
            <span>תמיכה בבריאות הלב והעורקים</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-600" />
            <span>התאוששות מטבולית לילית</span>
          </div>
        </div>
      </div>
    );
  }

  if (isFormula1) {
    return (
      <div className="my-6 bg-gradient-to-br from-emerald-500/10 via-card to-card border-2 border-emerald-500/30 rounded-2xl p-5 shadow-card space-y-4">
        {/* Pro Blender Method */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
            <h4 className="font-black text-base text-foreground">
              שיטת הבלנדר המקצועית: מרקם גלידה קרמי ב-60 שניות
            </h4>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
            טכניקה שנבדקה על מיליוני מנויים בעולם למניעת גושים ולמרקם קטיפתי מושלם:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center text-xs font-bold">
            <div className="bg-background/80 p-2.5 rounded-xl border border-border">
              <span className="text-emerald-600 block text-base font-black">1</span>
              <span>250 מ"ל נוזל קר</span>
              <span className="text-[10px] text-muted-foreground block font-normal">(מים / חלב שקדים)</span>
            </div>
            <div className="bg-background/80 p-2.5 rounded-xl border border-border">
              <span className="text-emerald-600 block text-base font-black">2</span>
              <span>2 כפות פורמולה 1</span>
              <span className="text-[10px] text-muted-foreground block font-normal">(+1 כף PDM לחלבון)</span>
            </div>
            <div className="bg-background/80 p-2.5 rounded-xl border border-border">
              <span className="text-emerald-600 block text-base font-black">3</span>
              <span>קרח / פרי קפוא</span>
              <span className="text-[10px] text-muted-foreground block font-normal">(חצי בננה קפואה)</span>
            </div>
            <div className="bg-background/80 p-2.5 rounded-xl border border-border">
              <span className="text-emerald-600 block text-base font-black">4</span>
              <span>ערבול 45 שניות</span>
              <span className="text-[10px] text-muted-foreground block font-normal">(מהירות גבוהה)</span>
            </div>
          </div>
        </div>

        {/* PFF Satiety Formula */}
        <div className="pt-3 border-t border-border/60">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-bold text-xs text-emerald-700 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 px-2.5 py-0.5 rounded-full">
              נוסחת PFF לשובע מתמשך (4+ שעות)
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            כדי למנוע תחושת רעב מהירה, הוסף לשייק **Protein** (אבקת PDM), **Fiber** (אבקת סיבים תזונתיים תפוח), ו-**Fat בריא** (כפית חמאת שקדים או צ'יה).
          </p>
        </div>
      </div>
    );
  }

  if (isAloe || isTea) {
    return (
      <div className="my-6 bg-gradient-to-br from-teal-500/10 via-card to-card border-2 border-teal-500/30 rounded-2xl p-5 shadow-card">
        <div className="flex items-center gap-2 mb-2">
          <Flame className="w-5 h-5 text-teal-600 shrink-0" />
          <h4 className="font-black text-base text-foreground">
            שילוב הטרנד העולמי: משקה "Loaded Tea & Aloe Detox"
          </h4>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed mb-3">
          שילוב של תרכיז אלוורה צמחי יחד עם תה נמס צמחי בבקבוק מים של 1 ליטר יוצר משקה אנרגיה ודיטוקס טבעי ללא סוכר, ששורף קלוריות, מרענן את העור ומנקה את מערכת העיכול לאורך היום.
        </p>
        <div className="flex items-center justify-between bg-background/80 p-3 rounded-xl border border-teal-500/20 text-xs font-bold">
          <span>🍹 מתכון 1 ליטר: 3 פקקי אלוורה + 1/2 כפית תה צמחים + מים קרים עם קרח</span>
          <Link to="/products" className="text-teal-600 hover:underline shrink-0 font-black">
            צפה במוצרים משלימים ←
          </Link>
        </div>
      </div>
    );
  }

  return null;
}
