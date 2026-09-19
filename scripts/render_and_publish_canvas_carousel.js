const fs = require('fs');
const path = require('path');
const https = require('https');
const { createCanvas, loadImage, GlobalFonts } = require('/tmp/node_graphics/node_modules/@napi-rs/canvas');

// Register Hebrew fonts
GlobalFonts.registerFromPath('/opt/data/fonts/Heebo-Bold.ttf', 'HeeboBold');
GlobalFonts.registerFromPath('/opt/data/fonts/Heebo-Medium.ttf', 'HeeboMedium');

const TOKEN = 'IGAAaT4FvO6hlBZAGJHWm9JLWVFdXRnaG1zdmpqai1DdU11ZA19DLVVZAQ2FEMmxRaF9CU01fWi1TY2Y0REVHNkJWTFFPbEhjMERNM3RuWFhiOEFSRWN1ckNUX0ZAHbk5MaGRYTV8tYzNwdWg3RWRFOWVHRGU4RXJ1d1pROVl6NW9KdwZDZD';
const IG_USER_ID = '28425450893730217';

// Slide definitions
const slidesData = [
  {
    badge: '🔍 תעלומה פיזיולוגית',
    badgeBg: '#f59e0b',
    badgeText: '#0f172a',
    title: 'למה אתה מתרסק\nמעייפות ב-14:00? 😴',
    desc: 'הטעות ש-90% מהאנשים עושים בארוחת הבוקר – ונוסחת 3 המרכיבים הפיזיולוגית שמחזירה את האנרגיה ב-60 שניות.',
    cta: 'החלק שמאלה לגילוי ⬅️',
    step: '1 / 5',
  },
  {
    badge: '⚠️ הבעיה הפיזיולוגית',
    badgeBg: '#f43f5e',
    badgeText: '#ffffff',
    title: 'זינוק סוכר ענקי\nואז נפילה כואבת 📉',
    desc: 'כשאתה אוכל פחמימות ריקות בבוקר (בורקס, מאפה, קורנפלקס), הסוכר בדם מזנק למעלה – ואז צונח בצהריים.\n\nהתוצאה: עייפות כבדה, תסכול ורעב עז למתוק.',
    cta: 'החלק שמאלה לפתרון ⬅️',
    step: '2 / 5',
  },
  {
    badge: '🥑 נוסחת PFF לשובע',
    badgeBg: '#10b981',
    badgeText: '#0f172a',
    title: 'חלבון + סיבים =\nשובע ל-4+ שעות ⏳',
    desc: 'נוסחת PFF (Protein + Fiber + Fat):\n• 18g חלבון איכותי (שומר על השריר)\n• 5g סיבים תזונתיים ממקור תפוח (מאיטים עיכול)\n\nמונע נפילות אנרגיה ושומר על פוקוס יציב.',
    cta: 'החלק שמאלה למתכון ⬅️',
    step: '3 / 5',
  },
  {
    badge: '🥤 המתכון המהיר',
    badgeBg: '#f59e0b',
    badgeText: '#0f172a',
    title: 'שייק אנרגיה קרמי\nב-60 שניות בלבד ⚡',
    desc: '1. 250 מ"ל חלב שקדים קר\n2. 2 כפות פורמולה 1 (וניל / עוגיות)\n3. 1 כף אבקת סיבים תפוח\n4. קרח / חצי בננה קפואה\n\nערבול 45 שניות בבלנדר לקבלת מרקם גלידה!',
    cta: 'החלק לשקופית האחרונה ⬅️',
    step: '4 / 5',
  },
  {
    badge: '🎁 מתנה בלעדית',
    badgeBg: '#f59e0b',
    badgeText: '#0f172a',
    title: 'רוצים קופון 10% מתנה\n+ ספר מתכונים? 🎁',
    desc: 'תגיבו "אנרגיה" בתגובות או בפרטי – ותקבלו ישירות ל-WhatsApp את ספר המתכונים הדיגיטלי + קופון WELCOME10 להזמנה ראשונה!',
    cta: 'FullBody.co.il | מפיץ מורשה הרבלייף',
    step: '5 / 5',
  }
];

function drawTextRtl(ctx, text, x, y, maxWidth, lineHeight) {
  const lines = text.split('\n');
  let currentY = y;

  lines.forEach(line => {
    ctx.fillText(line, x, currentY);
    currentY += lineHeight;
  });
  return currentY;
}

async function renderSlides() {
  const publicDir = '/opt/data/fullbody-il/public';
  
  for (let i = 0; i < slidesData.length; i++) {
    const s = slidesData[i];
    const canvas = createCanvas(1080, 1080);
    const ctx = canvas.getContext('2d');

    // Background Gradient (Dark Emerald)
    const grad = ctx.createLinearGradient(0, 0, 1080, 1080);
    grad.addColorStop(0, '#064e3b');
    grad.addColorStop(0.5, '#0f172a');
    grad.addColorStop(1, '#020617');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1080);

    // Glowing Inner Frame
    ctx.strokeStyle = '#16a34a';
    ctx.lineWidth = 12;
    ctx.roundRect(30, 30, 1020, 1020, 36);
    ctx.stroke();

    // Set RTL alignment
    ctx.direction = 'rtl';
    ctx.textAlign = 'right';

    // Step Indicator
    ctx.font = 'bold 28px HeeboMedium';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(s.step, 140, 100);

    // Badge
    ctx.fillStyle = s.badgeBg;
    ctx.beginPath();
    ctx.roundRect(620, 70, 380, 60, 30);
    ctx.fill();

    ctx.fillStyle = s.badgeText;
    ctx.font = 'bold 28px HeeboBold';
    ctx.textAlign = 'center';
    ctx.fillText(s.badge, 810, 110);

    // Title
    ctx.textAlign = 'right';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 54px HeeboBold';
    drawTextRtl(ctx, s.title, 1000, 240, 900, 70);

    // Description
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '28px HeeboMedium';
    drawTextRtl(ctx, s.desc, 1000, 460, 900, 48);

    // Footer CTA
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(80, 960);
    ctx.lineTo(1000, 960);
    ctx.stroke();

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 32px HeeboBold';
    ctx.textAlign = 'right';
    ctx.fillText(s.cta, 1000, 1015);

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 26px HeeboMedium';
    ctx.textAlign = 'left';
    ctx.fillText('FullBody.co.il', 80, 1015);

    const filename = `slide_${i + 1}.jpg`;
    const filepath = path.join(publicDir, filename);
    const buf = canvas.toBuffer('image/jpeg', { quality: 0.95 });
    fs.writeFileSync(filepath, buf);
    console.log(`Rendered studio slide: ${filepath} (${buf.length} bytes)`);
  }
}

renderSlides().catch(console.error);
