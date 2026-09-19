import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Sparkles, Download, Copy, Check, ArrowRight, TrendingDown, Flame, Gift, ShieldCheck, Zap, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

import herbalifeF1Vanilla from '@/assets/herbalife-f1-vanilla.webp';
import herbalifePdm from '@/assets/herbalife-pdm.webp';
import img_fiber_apple from '@/assets/herbalife/fiber-apple.jpg';

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
      image: herbalifeF1Vanilla,
      imageTag: 'שייק פורמולה 1 וניל - 18g חלבון',
    },
    {
      badge: '⚠️ הבעיה הפיזיולוגית',
      badgeBg: 'bg-rose-500 text-white',
      title: 'זינוק סוכר ענקי ואז נפילה כואבת 📉',
      desc: 'כשאתה אוכל פחמימות ריקות בבוקר (בורקס, מאפה, קורנפלקס), הסוכר בדם מזנק למעלה – ואז צונח בצהריים. התוצאה: עייפות כבדה, תסכול ורעב למתוק.',
      cta: 'החלק שמאלה לפתרון ⬅️',
      number: '2 / 5',
      showChart: true,
    },
    {
      badge: '🥑 נוסחת PFF לשובע',
      badgeBg: 'bg-emerald-500 text-slate-950',
      title: 'חלבון + סיבים = שובע ל-4+ שעות ⏳',
      desc: 'נוסחת PFF (Protein + Fiber + Fat):\n• 18g חלבון איכותי (שומר על השריר)\n• 5g סיבים תזונתיים ממקור תפוח (מאיטים עיכול)',
      cta: 'החלק שמאלה למתכון ⬅️',
      number: '3 / 5',
      images: [herbalifePdm, img_fiber_apple],
      imageTag: 'PDM חלבון + אבקת סיבי תפוח',
    },
    {
      badge: '🥤 המתכון המהיר',
      badgeBg: 'bg-amber-400 text-slate-950',
      title: 'שייק אנרגיה קרמי ב-60 שניות בלבד ⚡',
      desc: '1. 250 מ"ל חלב שקדים קר\n2. 2 כפות פורמולה 1 (וניל/עוגיות)\n3. 1 כף אבקת סיבים תפוח\n4. קרח / חצי בננה קפואה -> ערבול 45 שניות!',
      cta: 'החלק לשקופית האחרונה ⬅️',
      number: '4 / 5',
      image: herbalifeF1Vanilla,
      imageTag: 'מרקם גלידה קטיפתי ב-60 שניות',
    },
    {
      badge: '🎁 מתנה בלעדית',
      badgeBg: 'bg-amber-400 text-slate-950',
      title: 'רוצים קופון 10% מתנה + ספר מתכונים? 🎁',
      desc: 'תגיבו "אנרגיה" בתגובות או בפרטי – ותקבלו ישירות ל-WhatsApp את ספר המתכונים הדיגיטלי + קופון WELCOME10 להזמנה ראשונה!',
      cta: 'FullBody.co.il | מפיץ מורשה הרבלייף',
      number: '5 / 5',
      showGiftBox: true,
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
                FullBody Canva Studio — קרוסלות ויזואליות
              </h1>
            </div>
            <p className="text-sm text-slate-400 font-medium">
              שילוב תמונות מוצר מקוריות, גרפים ויזואליים ועיצוב Dark Mode לאינסטגרם
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
                <div className="flex items-center justify-between mb-4">
                  <span className={`font-black text-xs px-4 py-1.5 rounded-full uppercase tracking-wider ${slide.badgeBg}`}>
                    {slide.badge}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500">{slide.number}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-3">
                  {slide.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium whitespace-pre-line mb-4">
                  {slide.desc}
                </p>

                {/* Visual Graph for Slide 2 */}
                {slide.showChart && (
                  <div className="bg-slate-950/80 border border-rose-900/50 rounded-2xl p-4 my-3 text-center space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-rose-400">
                      <span>08:00 - מאפה/סוכר 📈</span>
                      <span>14:00 - נפילת סוכר קשה 📉</span>
                    </div>
                    <div className="h-2 w-full bg-gradient-to-r from-rose-500 via-amber-400 to-rose-600 rounded-full"></div>
                    <span className="text-[10px] text-slate-400 block font-normal">
                      זינוק אינסולין חד שגורם לעייפות, עצבנות ודחף עז למתוק
                    </span>
                  </div>
                )}

                {/* Single Product Cutout Image */}
                {slide.image && (
                  <div className="flex items-center gap-4 bg-slate-950/60 p-3 rounded-2xl border border-emerald-900/40 my-2">
                    <img src={slide.image} alt="מוצר הרבלייף" className="w-20 h-20 object-contain rounded-xl shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-emerald-400 block">{slide.imageTag}</span>
                      <span className="text-[11px] text-slate-400 leading-tight block">100% מוצר מקורי - מפיץ מורשה</span>
                    </div>
                  </div>
                )}

                {/* Multiple Product Images for Slide 3 */}
                {slide.images && (
                  <div className="flex items-center gap-3 bg-slate-950/60 p-3 rounded-2xl border border-emerald-900/40 my-2">
                    <div className="flex -space-x-2 space-x-reverse shrink-0">
                      {slide.images.map((imgSrc, i) => (
                        <img key={i} src={imgSrc} alt="מוצר" className="w-16 h-16 object-contain rounded-xl border border-emerald-600/30 bg-slate-900" />
                      ))}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-emerald-400 block">{slide.imageTag}</span>
                      <span className="text-[11px] text-slate-400 leading-tight block">השילוב המשלים לשובע של 4+ שעות</span>
                    </div>
                  </div>
                )}

                {/* Gift Box Mockup for Slide 5 */}
                {slide.showGiftBox && (
                  <div className="bg-gradient-to-r from-emerald-950 to-amber-950/40 border border-amber-500/40 rounded-2xl p-4 my-2 text-center space-y-2">
                    <div className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full">
                      🎁 מתנה מיוחדת: ספר מתכונים + קופון 10%
                    </div>
                    <span className="text-xs font-bold text-slate-200 block">
                      תגיבו "אנרגיה" או שלחו הודעה לקבלת הקישור ב-WhatsApp!
                    </span>
                  </div>
                )}
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
