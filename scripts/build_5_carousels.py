import json, os, subprocess

BG = "public/social/bg"

def b(bg, tag, title, sub=None, items=None, cta=None, swipe=""):
    body = f'<span class="tag">{tag}</span><h1>{title}</h1>'
    if sub:
        body += f'<p class="sub">{sub}</p>'
    if items:
        body += "<ul>" + "".join(f"<li><b>{n}</b><span>{t}</span></li>" for n, t in items) + "</ul>"
    if cta:
        body += f'<div class="cta">{cta}</div>'
    return {"bg": f"{BG}/{bg}", "body": body, "swipe": swipe}


CAROUSELS = {
    # 1 - upgrade of the morning routine carousel
    "p1": [
        b("morning-tired.jpg", "⏰ בוקר טוב?", 'קמת <em>נפוח וכבד</em> שוב הבוקר?',
          sub="3 דקות פשוטות אחרי הקימה, וכל היום נראה אחרת.", swipe="החלק שמאלה ⬅️"),
        b("morning-tired.jpg", "❌ הטעות", 'קפה על <em>קיבה ריקה</em>',
          sub="בלי נוזלים ובלי חלבון בבוקר: העיכול מתעורר לאט, הבטן תופחת והאנרגיה נופלת עד 11:00.",
          swipe="החלק שמאלה ⬅️"),
        b("aloe-green-flatlay.jpg", "✅ שגרת 3 הדקות", 'ככה פותחים <em>יום קל</em>',
          items=[("1", "כוס מים גדולה עם לימון"), ("2", "אלוורה לעיכול נעים"), ("3", "שייק חלבון פורמולה 1")],
          swipe="החלק שמאלה ⬅️"),
        b("morning-lemon-water.jpg", "🕐 התזמון", '60 שניות <em>לכל שלב</em>',
          items=[("07:00", "מים + לימון מיד בקימה"), ("07:02", "אלוורה בכוס מים"), ("07:20", "שייק במקום המאפה")],
          swipe="עוד שקופית ⬅️"),
        b("morning-energy-woman.jpg", "🎁 מתנה בשבילך", 'ספר 25 מתכונים <em>+ 10% הנחה</em>',
          sub="נכנסים לאתר, נרשמים בחלונית שנפתחת, והמתנה נשלחת למייל.",
          cta="FullBody.co.il", swipe="נרשמים באתר 🎁"),
    ],
    # 2 - upgrade of the 14:00 energy crash carousel
    "p2": [
        b("afternoon-crash.jpg", "😴 14:00", 'למה אתה <em>מתרסק</em> בצהריים?',
          sub="זו לא עייפות. זו ארוחת הבוקר שאכלת לפני 6 שעות.", swipe="החלק שמאלה ⬅️"),
        b("afternoon-crash.jpg", "📉 מה קורה בגוף", 'סוכר עולה, <em>ואז צונח</em>',
          sub="מאפה או קורנפלקס בבוקר מקפיצים את הסוכר בדם, והנפילה מגיעה בדיוק אחרי הצהריים.",
          swipe="החלק שמאלה ⬅️"),
        b("protein-foods.jpg", "✅ הפתרון", 'חלבון <em>לפני</em> פחמימה',
          items=[("20g", "חלבון בארוחת הבוקר"), ("5g", "סיבים תזונתיים"), ("0", "מאפים על קיבה ריקה")],
          swipe="החלק שמאלה ⬅️"),
        b("office-lunch.jpg", "🍽️ ארוחת צהריים", 'צלחת שלא <em>מפילה אותך</em>',
          items=[("1", "חלבון: עוף, טונה, קטניות"), ("2", "המון ירוקים"), ("3", "פחמימה מלאה, לא לבנה")],
          swipe="עוד שקופית ⬅️"),
        b("gym-energy.jpg", "🎁 מתנה בשבילך", 'ספר 25 מתכונים <em>+ 10% הנחה</em>',
          sub="נכנסים לאתר, נרשמים בחלונית שנפתחת, והמתנה נשלחת למייל.",
          cta="FullBody.co.il", swipe="נרשמים באתר 🎁"),
    ],
    # 3 - shake that keeps you full
    "p3": [
        b("protein-shake-glass.jpg", "🥤 שייק", 'רעב <em>שעה</em> אחרי השייק?',
          sub="הבעיה היא לא הכמות. היא המרקם.", swipe="החלק שמאלה ⬅️"),
        b("protein-shake-glass.jpg", "❌ הטעות", 'אבקה <em>ומים</em> בלבד',
          sub="נוזל דליל עובר את הקיבה ב-30 דקות, והמוח לא מקבל אות שובע.",
          swipe="החלק שמאלה ⬅️"),
        b("protein-foods.jpg", "✅ נוסחת השובע", 'חלבון + סיבים <em>+ שומן טוב</em>',
          items=[("24g", "חלבון איכותי"), ("6g", "סיבים: שיבולת שועל, תפוח"), ("1 כף", "טחינה או חמאת שקדים")],
          swipe="החלק שמאלה ⬅️"),
        b("protein-shake-glass.jpg", "⏱️ 60 שניות", 'השייק <em>שמחזיק</em> עד הצהריים',
          items=[("250 מל", "משקה שקדים קר + קרח"), ("2 כפות", "פורמולה 1"), ("1 כף", "אבקת חלבון PDM")],
          swipe="עוד שקופית ⬅️"),
        b("morning-energy-woman.jpg", "🎁 מתנה בשבילך", 'ספר 25 מתכונים <em>+ 10% הנחה</em>',
          sub="נכנסים לאתר, נרשמים בחלונית שנפתחת, והמתנה נשלחת למייל.",
          cta="FullBody.co.il", swipe="נרשמים באתר 🎁"),
    ],
    # 4 - how much protein
    "p4": [
        b("protein-foods.jpg", "🥩 חלבון", 'כמה חלבון <em>אתה באמת</em> צריך?',
          sub="רוב האנשים אוכלים חצי מהכמות, ומתפלאים שאין תוצאות.", swipe="החלק שמאלה ⬅️"),
        b("gym-energy.jpg", "📐 המספר שלך", '1.6 גרם <em>לכל קילו</em>',
          items=[("70 קג", "כ-110 גרם ביום"), ("85 קג", "כ-135 גרם ביום"), ("מתאמן?", "לכו לכיוון הגבוה")],
          swipe="החלק שמאלה ⬅️"),
        b("protein-foods.jpg", "🍳 איך מגיעים לזה", 'מחלקים <em>לכל ארוחה</em>',
          items=[("בוקר", "שייק או חביתה, 25 גרם"), ("צהריים", "עוף או דג, 35 גרם"), ("ערב", "קוטג' וקטניות, 25 גרם")],
          swipe="החלק שמאלה ⬅️"),
        b("protein-shake-glass.jpg", "⚡ הקיצור", 'שייק אחד <em>= 24 גרם</em>',
          sub="כשאין זמן לבשל, שייק חלבון סוגר את הפער בדקה אחת.", swipe="עוד שקופית ⬅️"),
        b("gym-energy.jpg", "🎁 מתנה בשבילך", 'ספר 25 מתכונים <em>+ 10% הנחה</em>',
          sub="נכנסים לאתר, נרשמים בחלונית שנפתחת, והמתנה נשלחת למייל.",
          cta="FullBody.co.il", swipe="נרשמים באתר 🎁"),
    ],
    # 5 - three mistakes that stop fat loss
    "p5": [
        b("scale-frustration.jpg", "⚖️ תקוע?", '3 טעויות <em>שעוצרות</em> הרזיה',
          sub="לא האימונים ולא הגנטיקה. זה משהו אחר.", swipe="החלק שמאלה ⬅️"),
        b("scale-frustration.jpg", "1️⃣ הטעות הראשונה", 'מדלגים על <em>ארוחת בוקר</em>',
          sub="הגוף מפצה בערב, ואז הרעב חזק מכל החלטה.", swipe="החלק שמאלה ⬅️"),
        b("office-lunch.jpg", "2️⃣ הטעות השנייה", 'מעט מדי <em>חלבון</em>',
          sub="בלי חלבון מאבדים שריר במקום שומן, והמטבוליזם יורד.", swipe="החלק שמאלה ⬅️"),
        b("protein-shake-glass.jpg", "3️⃣ הטעות השלישית", 'שותים <em>מעט מדי</em>',
          items=[("2-3 ליטר", "מים ביום"), ("לפני", "כל ארוחה, כוס מים"), ("במקום", "משקה ממותק")],
          swipe="עוד שקופית ⬅️"),
        b("morning-energy-woman.jpg", "🎁 מתנה בשבילך", 'ספר 25 מתכונים <em>+ 10% הנחה</em>',
          sub="נכנסים לאתר, נרשמים בחלונית שנפתחת, והמתנה נשלחת למייל.",
          cta="FullBody.co.il", swipe="נרשמים באתר 🎁"),
    ],
}

os.makedirs("/tmp/browser/slides", exist_ok=True)
for name, slides in CAROUSELS.items():
    spec_path = f"/tmp/browser/slides/{name}.json"
    with open(spec_path, "w", encoding="utf-8") as f:
        json.dump(slides, f, ensure_ascii=False)
    out = f"public/social/{name}"
    print("==>", name)
    subprocess.run(["python3", "scripts/render_carousel_slides.py", out, spec_path], check=True)
