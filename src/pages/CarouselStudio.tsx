import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Sparkles, Download, Copy, Check, ArrowRight, Layers, Palette, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function CarouselStudio() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const slides = [
    {
      badge: '💡 פתרון עייפות מנצח',
      badgeBg: 'bg-amber-400 text-slate-950',
      title: 'למה אתה מתרסק מעייפות ב-14:00 בצהריים? 😴',
      desc: 'הטעות ש-90% מהאנשים עושים בארוחת הבוקר – ואיך שייק חלבון מאוזן פותר אותה ב-60 שניות.',
      cta: 'החלק שמאלה לפתרון המלא ⬅️',
      number: '1 / 5',
    },
    {
      badge: '⚠️ הבעיה הפיזיולוגית',
      badgeBg: 'bg-rose-500 text-white',
      title: 'זינוק סוכר ענקי ואז נפילה כואבת 📉',
      desc: 'כשאתה אוכל פחמימות ריקות בבוקר (בורקס, מאפה, קורנפלקס), הסוכר בדם מזנק – ואז צונח בצהריים. התוצאה: עייפות כבדה, תסכול ורעב למתוק.',
      cta: 'החלק שמאלה לפתרון ⬅️',
      number: '2 / 5',
    },
    {
      badge: '🥑 נוסחת PFF לשובע',
      badgeBg: 'bg-emerald-500 text-slate-950',
      title: 'חלבון + סיבים = שובע ל-4+ שעות ⏳',
      desc: 'נוסחת PFF (Protein + Fiber + Fat):\n• 18g חלבון איכותי (שומר על השריר)\n• 5g סיבים תזונתיים ממקור תפוח (מאיטים עיכול)',
      cta: 'החלק שמאלה למתכון ⬅️',
      number: '3 / 5',
    },
    {
      badge: '🥤 המתכון המהיר',
      badgeBg: 'bg-amber-400 text-slate-950',
      title: 'שייק אנרגיה קרמי ב-60 שניות בלבד ⚡',
      desc: '1. 250 מ"ל חלב שקדים קר\n2. 2 כפות פורמולה 1 (וניל/עוגיות)\n3. 1 כף אבקת סיבים תפוח\n4. קרח / חצי בננה קפואה -> ערבול 45 שניות!',
      cta: 'החלק לשקופית האחרונה ⬅️',
      number: '4 / 5',
    },
    {
      badge: '🎁 מתנה בלעדית',
      badgeBg: 'bg-amber-400 text-slate-950',
      title: 'רוצים קופון 10% מתנה + ספר מתכונים? 🎁',
      desc: 'תגיבו "אנרגיה" בתגובות או בפרטי – ותקבלו ישירות ל-WhatsApp את ספר המתכונים הדיגיטלי + קופון WELCOME10 להזמנה ראשונה!',
      cta: 'FullBody.co.il | מפיץ מורשה הרבלייף',
      number: '5 / 5',
    },
  ];

  const handleCopyText = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success('טקסט השקופית הועתק בהצלחה!');
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 p-4 sm:p-8 font-sans" dir="rtl">
      <Helmet>
        <title>FullBody Canva Studio - מחולל קרוסלות פרימיום</title>
      </Helmet>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-7 h-7 text-emerald-500" />
              <h1 className="text-3xl sm:text-4xl font-black text-white">
                FullBody Canva Studio — קרוסלות סטודיו
              </h1>
            </div>
            <p className="text-sm text-slate-400 font-medium">
              תצוגה ויזואלית ברמת Canva Pro (1080x1080) לפרסום באינסטגרם
            </p>
          </div>

          <a
            href="/products"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg transition-all"
          >
            <span>חזרה לחנות</span>
            <ArrowRight className="w-4 h-4 rotate-180" />
          </a>
        </div>

        {/* Carousel Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className="bg-slate-900 border-2 border-emerald-600 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl flex flex-col justify-between aspect-square transition-transform hover:scale-[1.01]"
            >
              {/* Glow background effect */}
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className={`font-black text-xs px-4 py-1.5 rounded-full uppercase tracking-wider ${slide.badgeBg}`}>
                    {slide.badge}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500">{slide.number}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-4">
                  {slide.title}
                </h2>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium whitespace-pre-line">
                  {slide.desc}
                </p>
              </div>

              <div className="border-t border-slate-800/80 pt-4 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleCopyText(`${slide.title}\n\n${slide.desc}`, idx)}
                  className="text-xs font-bold text-slate-400 hover:text-emerald-400 flex items-center gap-1.5 transition-colors"
                >
                  {copiedIndex === idx ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedIndex === idx ? 'הועתק!' : 'העתק טקסט'}</span>
                </button>
                <span className="text-xs font-bold text-emerald-400">{slide.cta}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
