const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage, GlobalFonts } = require('/tmp/node_graphics/node_modules/@napi-rs/canvas');

// Register Hebrew fonts
GlobalFonts.registerFromPath('/opt/data/fonts/Heebo-Bold.ttf', 'HeeboBold');
GlobalFonts.registerFromPath('/opt/data/fonts/Heebo-Medium.ttf', 'HeeboMedium');

const publicDir = '/opt/data/fullbody-il/public';

async function generateAllSlides() {
  // Load product images
  let imgF1 = null, imgPdm = null, imgFiber = null;
  try {
    imgF1 = await loadImage('/opt/data/fullbody-il/src/assets/herbalife-f1-vanilla.webp');
    imgPdm = await loadImage('/opt/data/fullbody-il/src/assets/herbalife-pdm.webp');
    imgFiber = await loadImage('/opt/data/fullbody-il/src/assets/herbalife/fiber-apple.jpg');
  } catch (e) {
    console.log('Product image load note:', e.message);
  }

  // --- SLIDE 1: Hook ---
  {
    const canvas = createCanvas(1080, 1080);
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 1080, 1080);
    grad.addColorStop(0, '#064e3b');
    grad.addColorStop(0.5, '#0f172a');
    grad.addColorStop(1, '#020617');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1080);

    ctx.strokeStyle = '#16a34a';
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.roundRect(30, 30, 1020, 1020, 40);
    ctx.stroke();

    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.roundRect(620, 70, 380, 64, 32);
    ctx.fill();

    ctx.direction = 'rtl';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 28px HeeboBold';
    ctx.fillText('🔍 תעלומה פיזיולוגית', 810, 112);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 56px HeeboBold';
    ctx.fillText('למה אתה מתרסק', 1000, 240);
    ctx.fillText('מעייפות ב-14:00 בצהריים? 😴', 1000, 315);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '30px HeeboMedium';
    ctx.fillText('הטעות ש-90% מהאנשים עושים בארוחת הבוקר –', 1000, 420);
    ctx.fillText('ונוסחת 3 המרכיבים הפיזיולוגית שמחזירה', 1000, 470);
    ctx.fillText('את הפוקוס והאנרגיה ב-60 שניות.', 1000, 520);

    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(80, 610, 920, 220, 24);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 28px HeeboBold';
    ctx.fillText('⏰ 08:00 - ארוחת בוקר סטנדרטית', 960, 670);
    ctx.textAlign = 'left';
    ctx.fillText('😴 14:00 - נפילת אנרגיה קשה', 120, 670);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '24px HeeboMedium';
    ctx.fillText('מה הגורם הסודי שמפיל אותך באמצע היום? (החלק שמאלה לגילוי ⬅️)', 960, 770);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(80, 960);
    ctx.lineTo(1000, 960);
    ctx.stroke();

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 30px HeeboBold';
    ctx.fillText('החלק שמאלה לגילוי ⬅️', 1000, 1015);

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 26px HeeboMedium';
    ctx.textAlign = 'left';
    ctx.fillText('FullBody.co.il', 80, 1015);

    fs.writeFileSync(path.join(publicDir, 'slide_1.jpg'), canvas.toBuffer('image/jpeg', { quality: 0.95 }));
  }

  // --- SLIDE 2: Problem ---
  {
    const canvas = createCanvas(1080, 1080);
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 1080, 1080);
    grad.addColorStop(0, '#064e3b');
    grad.addColorStop(0.5, '#0f172a');
    grad.addColorStop(1, '#020617');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1080);

    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.roundRect(30, 30, 1020, 1020, 40);
    ctx.stroke();

    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.roundRect(620, 70, 380, 64, 32);
    ctx.fill();

    ctx.direction = 'rtl';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px HeeboBold';
    ctx.fillText('⚠️ הבעיה הפיזיולוגית', 810, 112);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 56px HeeboBold';
    ctx.fillText('זינוק סוכר ענקי', 1000, 240);
    ctx.fillText('ואז נפילה כואבת 📉', 1000, 315);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '30px HeeboMedium';
    ctx.fillText('כשאתה אוכל פחמימות ריקות בבוקר (בורקס, מאפה, קורנפלקס),', 1000, 420);
    ctx.fillText('הסוכר בדם מזנק למעלה – ואז צונח בצהריים.', 1000, 470);
    ctx.fillText('התוצאה: עייפות כבדה, תסכול ורעב עז למתוק.', 1000, 520);

    // Chart Box
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = 'rgba(244, 63, 94, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(80, 610, 920, 220, 24);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#f43f5e';
    ctx.font = 'bold 28px HeeboBold';
    ctx.fillText('📈 08:00 - זינוק אינסולין חד בדם', 960, 670);
    ctx.textAlign = 'left';
    ctx.fillText('📉 14:00 - נפילת סוכר קשה (Crash)', 120, 670);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '24px HeeboMedium';
    ctx.fillText('תסמינים: חוסר סבלנות, ערפול מוחי והשתוקקות לסוכר (החלק שמאלה ⬅️)', 960, 770);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(80, 960);
    ctx.lineTo(1000, 960);
    ctx.stroke();

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 30px HeeboBold';
    ctx.fillText('החלק שמאלה לפתרון ⬅️', 1000, 1015);

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 26px HeeboMedium';
    ctx.textAlign = 'left';
    ctx.fillText('FullBody.co.il', 80, 1015);

    fs.writeFileSync(path.join(publicDir, 'slide_2.jpg'), canvas.toBuffer('image/jpeg', { quality: 0.95 }));
  }

  // --- SLIDE 3: PFF Formula ---
  {
    const canvas = createCanvas(1080, 1080);
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 1080, 1080);
    grad.addColorStop(0, '#064e3b');
    grad.addColorStop(0.5, '#0f172a');
    grad.addColorStop(1, '#020617');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1080);

    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.roundRect(30, 30, 1020, 1020, 40);
    ctx.stroke();

    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.roundRect(620, 70, 380, 64, 32);
    ctx.fill();

    ctx.direction = 'rtl';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 28px HeeboBold';
    ctx.fillText('🥑 נוסחת PFF לשובע', 810, 112);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 56px HeeboBold';
    ctx.fillText('חלבון + סיבים תזונתיים', 1000, 240);
    ctx.fillText('= שובע ל-4+ שעות ⏳', 1000, 315);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '30px HeeboMedium';
    ctx.fillText('נוסחת PFF (Protein + Fiber + Fat):', 1000, 420);
    ctx.fillText('• 18g חלבון איכותי (שומר על מסת השריר והמטבוליזם)', 1000, 470);
    ctx.fillText('• 5g סיבים תזונתיים ממקור תפוח (מאיטים עיכול)', 1000, 520);

    // Product Images Overlay
    if (imgPdm) {
      ctx.drawImage(imgPdm, 100, 580, 220, 220);
    }
    if (imgFiber) {
      ctx.drawImage(imgFiber, 340, 580, 220, 220);
    }

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 26px HeeboBold';
    ctx.fillText('★ PDM חלבון + אבקת סיבי תפוח – השילוב המושלם לשובע', 1000, 850);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(80, 960);
    ctx.lineTo(1000, 960);
    ctx.stroke();

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 30px HeeboBold';
    ctx.fillText('החלק שמאלה למתכון ⬅️', 1000, 1015);

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 26px HeeboMedium';
    ctx.textAlign = 'left';
    ctx.fillText('FullBody.co.il', 80, 1015);

    fs.writeFileSync(path.join(publicDir, 'slide_3.jpg'), canvas.toBuffer('image/jpeg', { quality: 0.95 }));
  }

  // --- SLIDE 4: Recipe Reveal ---
  {
    const canvas = createCanvas(1080, 1080);
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 1080, 1080);
    grad.addColorStop(0, '#064e3b');
    grad.addColorStop(0.5, '#0f172a');
    grad.addColorStop(1, '#020617');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1080);

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.roundRect(30, 30, 1020, 1020, 40);
    ctx.stroke();

    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.roundRect(620, 70, 380, 64, 32);
    ctx.fill();

    ctx.direction = 'rtl';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 28px HeeboBold';
    ctx.fillText('🥤 המתכון המהיר', 810, 112);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 56px HeeboBold';
    ctx.fillText('שייק אנרגיה קרמי', 1000, 240);
    ctx.fillText('ב-60 שניות בלבד ⚡', 1000, 315);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '30px HeeboMedium';
    ctx.fillText('1. 250 מ"ל חלב שקדים קר / מים', 1000, 420);
    ctx.fillText('2. 2 כפות פורמולה 1 (וניל / עוגיות)', 1000, 470);
    ctx.fillText('3. 1 כף אבקת סיבים תזונתיים תפוח', 1000, 520);
    ctx.fillText('4. קרח / חצי בננה קפואה -> ערבול 45 שניות בבלנדר!', 1000, 570);

    if (imgF1) {
      ctx.drawImage(imgF1, 100, 620, 250, 250);
    }

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 26px HeeboBold';
    ctx.fillText('★ מרקם גלידה קטיפתי, עשיר ב-21 ויטמינים ומינרלים!', 1000, 850);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(80, 960);
    ctx.lineTo(1000, 960);
    ctx.stroke();

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 30px HeeboBold';
    ctx.fillText('החלק לשקופית האחרונה ⬅️', 1000, 1015);

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 26px HeeboMedium';
    ctx.textAlign = 'left';
    ctx.fillText('FullBody.co.il', 80, 1015);

    fs.writeFileSync(path.join(publicDir, 'slide_4.jpg'), canvas.toBuffer('image/jpeg', { quality: 0.95 }));
  }

  // --- SLIDE 5: Grand Slam Offer ---
  {
    const canvas = createCanvas(1080, 1080);
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 1080, 1080);
    grad.addColorStop(0, '#064e3b');
    grad.addColorStop(0.5, '#0f172a');
    grad.addColorStop(1, '#020617');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1080);

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.roundRect(30, 30, 1020, 1020, 40);
    ctx.stroke();

    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.roundRect(620, 70, 380, 64, 32);
    ctx.fill();

    ctx.direction = 'rtl';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 28px HeeboBold';
    ctx.fillText('🎁 מתנה בלעדית', 810, 112);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 56px HeeboBold';
    ctx.fillText('רוצים קופון 10% מתנה', 1000, 240);
    ctx.fillText('+ ספר מתכונים? 🎁', 1000, 315);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '32px HeeboMedium';
    ctx.fillText('תגיבו "אנרגיה" בתגובות או בפרטי –', 1000, 430);
    ctx.fillText('ותקבלו ישירות ל-WhatsApp את ספר המתכונים הדיגיטלי', 1000, 490);
    ctx.fillText('+ קופון WELCOME10 להזמנה ראשונה!', 1000, 550);

    // Coupon Box
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = '#16a34a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(140, 640, 800, 180, 24);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 36px HeeboBold';
    ctx.textAlign = 'center';
    ctx.fillText('קוד קופון: WELCOME10 (10% הנחה)', 540, 720);
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '24px HeeboMedium';
    ctx.fillText('תקף לכל מוצרי הרבלייף באתר | משלוח חינם מעל ₪299', 540, 770);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(80, 960);
    ctx.lineTo(1000, 960);
    ctx.stroke();

    ctx.textAlign = 'right';
    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 30px HeeboBold';
    ctx.fillText('FullBody.co.il | מפיץ מורשה הרבלייף', 1000, 1015);

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 26px HeeboMedium';
    ctx.textAlign = 'left';
    ctx.fillText('054-7308826', 80, 1015);

    fs.writeFileSync(path.join(publicDir, 'slide_5.jpg'), canvas.toBuffer('image/jpeg', { quality: 0.95 }));
  }

  console.log('Successfully generated all 5 canvas slides with perfect RTL Hebrew & product images.');
}

generateAllSlides().catch(console.error);
