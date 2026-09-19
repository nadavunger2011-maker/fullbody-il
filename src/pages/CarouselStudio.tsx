import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Sparkles, Copy, Check, ArrowRight, Clock, Zap, Gift, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

import heroSlide1 from '@/assets/hero-slide-1.webp';
import heroSlide2 from '@/assets/hero-slide-2.webp';
import herbalifeF1Vanilla from '@/assets/herbalife-f1-vanilla.webp';
import herbalifePdm from '@/assets/herbalife-pdm.webp';
import img_fiber_apple from '@/assets/herbalife/fiber-apple.jpg';
import bgBerryBowl from '@/assets/recipes/berry-protein-bowl.jpg';
import bgEnergyBoost from '@/assets/recipes/green-energy-super-boost.jpg';
import bgPeachTea from '@/assets/recipes/instant-peach-iced-tea.jpg';

export default function CarouselStudio() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const slides = [
    {
      badge: '🔍 תעלומה פיזיולוגית',
      badgeBg: 'bg-amber-400 text-slate-950',
      title: 'למה אתה מתרסק מעייפות ב-14:00 בצהריים? 😴',
      desc: 'הטעות ש-90% מהאנשים עושים בארוחת הבוקר – ונוסחת 3 המרכיבים הפיזיולוגית שמחזירה את הפוקוס והאנרגיה ב-60 שניות.',
      cta: 'החלק שמאלה לגילוי ⬅️',
      number: '1 / 5',
      bgImage: heroSlide1,
      showClock: true,
    },
    {
      badge: '⚠️ הבעיה הפיזיולוגית',
      badgeBg: 'bg-rose-500 text-white',
      title: 'זינוק סוכר ענקי ואז נפילה כואבת 📉',
      desc: 'כשאתה אוכל פחמימות ריקות בבוקר (בורקס, מאפה, קורנפלקס), הסוכר בדם מזנק למעלה – ואז צונח בצהריים. התוצאה: עייפות כבדה, תסכול ורעב למתוק.',
      cta: 'החלק שמאלה לפתרון ⬅️',
      number: '2 / 5',
      bgImage: bgEnergyBoost,
      showChart: true,
    },
    {
      badge: '🥑 נוסחת PFF לשובע',
      badgeBg: 'bg-emerald-500 text-slate-950',
      title: 'חלבון + סיבים = שובע ל-4+ שעות ⏳',
      desc: 'נוסחת PFF (Protein + Fiber + Fat):\n• 18g חלבון איכותי (שומר על השריר)\n• 5g סיבים תזונתיים ממקור תפוח (מאיטים עיכול)',
      cta: 'החלק שמאלה למתכון ⬅️',
      number: '3 / 5',
      bgImage: bgBerryBowl,
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
      bgImage: heroSlide2,
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
      bgImage: bgPeachTea,
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
        <title>FullBody Canva Studio - קרוסלות אווירה פרימיום</title>
      </Helmet>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-7 h-7 text-emerald-500" />
              <h1 className="text-3xl sm:text-4xl font-black text-white">
                FullBody Canva Studio — קרוסלות אווירה פרימיום
              </h1>
            </div>
            <p className="text-sm text-slate-400 font-medium">
              שילוב צילומי אווירה באיכות סטודיו, תמונות מוצר מקוריות ועיצוב Dark Mode לאינסטגרם
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
              className="bg-slate-900 border-2 border-emerald-600 rounded-3xl relative overflow-hidden shadow-2xl flex flex-col justify-between aspect-square transition-transform hover:scale-[1.01]"
            >
              {/* Atmosphere Background Image with Gradient Overlay */}
              <div
                className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay"
                style={{ backgroundImage: `url(${slide.bgImage})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40 pointer-events-none" />

              {/* Foreground Content */}
              <div className="relative z-10 p-6 sm:p-8 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`font-black text-xs px-4 py-1.5 rounded-full uppercase tracking-wider ${slide.badgeBg}`}>
                      {slide.badge}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-400">{slide.number}</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-3 drop-shadow-md">
                    {slide.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium whitespace-pre-line mb-4 drop-shadow">
                    {slide.desc}
                  </p>

                  {/* Clock Indicator for Slide 1 */}
                  {slide.showClock && (
                    <div className="bg-slate-950/90 border border-amber-500/40 rounded-2xl p-4 my-2 text-center space-y-2 backdrop-blur">
                      <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                        <span>⏰ 08:00 - ארוחת בוקר סטנדרטית</span>
                        <span>😴 14:00 - נפילת אנרגיה קשה</span>
                      </div>
                      <div className="h-2 w-full bg-gradient-to-r from-amber-400 via-rose-500 to-amber-500 rounded-full animate-pulse"></div>
                      <span className="text-[11px] text-slate-300 block font-normal">
                        מה הגורם הסודי שמפיל אותך באמצע היום? (החלק שמאלה לגילוי ⬅️)
                      </span>
                    </div>
                  )}

                  {/* Visual Chart for Slide 2 */}
                  {slide.showChart && (
                    <div className="bg-slate-950/90 border border-rose-900/60 rounded-2xl p-4 my-2 text-center space-y-2 backdrop-blur">
                      <div className="flex items-center justify-between text-[11px] font-bold text-rose-400">
                        <span>08:00 - זינוק אינסולין 📈</span>
                        <span>14:00 - נפילת סוכר קשה 📉</span>
                      </div>
                      <div className="h-2 w-full bg-gradient-to-r from-rose-500 via-amber-400 to-rose-600 rounded-full"></div>
                      <span className="text-[10px] text-slate-300 block font-normal">
                        פחמימות ריקות גורמות לעייפות, עצבנות ודחף עז למתוק
                      </span>
                    </div>
                  )}

                  {/* Single Product Image */}
                  {slide.image && (
                    <div className="flex items-center gap-4 bg-slate-950/80 p-3 rounded-2xl border border-emerald-900/50 my-2 backdrop-blur">
                      <img src={slide.image} alt="מוצר הרבלייף" className="w-20 h-20 object-contain rounded-xl shrink-0" />
                      <div>
                        <span className="text-xs font-bold text-emerald-400 block">{slide.imageTag}</span>
                        <span className="text-[11px] text-slate-400 leading-tight block">100% מוצר מקורי - מפיץ מורשה</span>
                      </div>
                    </div>
                  )}

                  {/* Multiple Product Images */}
                  {slide.images && (
                    <div className="flex items-center gap-3 bg-slate-950/80 p-3 rounded-2xl border border-emerald-900/50 my-2 backdrop-blur">
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

                  {/* Gift Box Mockup */}
                  {slide.showGiftBox && (
                    <div className="bg-gradient-to-r from-emerald-950 to-amber-950/60 border border-amber-500/50 rounded-2xl p-4 my-2 text-center space-y-2 backdrop-blur">
                      <div className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 font-black text-xs px-3.5 py-1 rounded-full">
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
                    className="text-xs font-bold text-slate-300 hover:text-emerald-400 flex items-center gap-1.5 transition-colors"
                  >
                    {copiedIndex === idx ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedIndex === idx ? 'הועתק!' : 'העתק טקסט'}</span>
                  </button>
                  <span className="text-xs font-bold text-emerald-400">{slide.cta}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
