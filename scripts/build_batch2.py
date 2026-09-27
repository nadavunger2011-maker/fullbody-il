import json, os, subprocess, sys
sys.path.insert(0,'scripts')
BG="public/social/bg"
def b(bg, tag, title, sub=None, items=None, cta=None, swipe="החלק שמאלה ⬅️"):
    body=f'<span class="tag">{tag}</span><h1>{title}</h1>'
    if sub: body+=f'<p class="sub">{sub}</p>'
    if items: body+="<ul>"+"".join(f"<li><b>{n}</b><span>{t}</span></li>" for n,t in items)+"</ul>"
    if cta: body+=f'<div class="cta">{cta}</div>'
    return {"bg":f"{BG}/{bg}","body":body,"swipe":swipe}
GIFT=lambda bg: b(bg,"🎁 מתנה בשבילך",'ספר 25 מתכונים <em>+ 10% הנחה</em>',sub="נכנסים לאתר, נרשמים בחלונית שנפתחת, והמתנה נשלחת למייל.",cta="FullBody.co.il",swipe="נרשמים באתר 🎁")
C={
"p6":[b("office-lunch.jpg","🍫 16:00",'החשק <em>למתוק</em> אחר הצהריים',sub="זה לא חוסר כוח רצון. זה חוסר חלבון."),
 b("afternoon-crash.jpg","🧠 למה זה קורה",'המוח <em>מבקש אנרגיה מהירה</em>',sub="ארוחת צהריים דלת חלבון = נפילת סוכר = יד שנשלחת לעוגיות."),
 b("protein-foods.jpg","✅ מה עושים",'3 תחליפים <em>שעובדים</em>',items=[("1","חטיף חלבון במקום עוגייה"),("2","יוגורט חלבון עם פירות יער"),("3","שייק קר בטעם עוגיות")]),
 b("protein-shake-glass.jpg","🥤 הטריק","מתוק <em>בלי רגשות אשם</em>",sub="שייק פורמולה 1 בטעם עוגיות וקרח: טעם של קינוח, 18 גרם חלבון.",swipe="עוד שקופית ⬅️"),GIFT("morning-energy-woman.jpg")],
"p7":[b("scale-frustration.jpg","⚖️ המשקל",'המשקל <em>נתקע</em> כבר שבועיים?',sub="זה נורמלי. והנה מה שבאמת קורה."),
 b("scale-frustration.jpg","💧 האמת",'המשקל <em>לא מספר הכל</em>',sub="מים, מלח ומחזור משנים את המספר ב-1-2 קילו ביום, גם כשהשומן יורד."),
 b("gym-energy.jpg","📏 מודדים נכון",'3 מדדים <em>טובים יותר</em>',items=[("1","היקף מותניים פעם בשבוע"),("2","איך הבגדים יושבים"),("3","תמונה באותה תאורה")]),
 b("protein-foods.jpg","🔁 שוברים את הקיפאון",'שינוי קטן, <em>תוצאה גדולה</em>',items=[("+20g","חלבון ביום"),("+2000","צעדים ביום"),("7ש׳","שינה בלילה")],swipe="עוד שקופית ⬅️"),GIFT("gym-energy.jpg")],
"p8":[b("morning-lemon-water.jpg","💧 מים",'שותה מספיק? <em>כנראה שלא</em>',sub="צמא מתחפש לרעב, ועייפות מתחפשת לחוסר אנרגיה."),
 b("afternoon-crash.jpg","⚠️ הסימנים",'הגוף <em>מבקש מים</em>',items=[("1","כאב ראש אחר הצהריים"),("2","רעב שעה אחרי ארוחה"),("3","ריכוז שנעלם")]),
 b("aloe-green-flatlay.jpg","✅ הנוסחה",'30 מ״ל <em>לכל קילו</em>',items=[("60 קג","כ-1.8 ליטר"),("80 קג","כ-2.4 ליטר"),("מתאמן?","להוסיף חצי ליטר")]),
 b("aloe-green-flatlay.jpg","🌿 הטריק",'מים <em>שבא לשתות</em>',sub="כף אלוורה או משקה צמחי בבקבוק גדול, וסוגרים ליטר עד הצהריים.",swipe="עוד שקופית ⬅️"),GIFT("morning-energy-woman.jpg")],
"p9":[b("office-lunch.jpg","🌙 ערב",'הנשנוש <em>של 22:00</em>',sub="אכלת טוב כל היום, ואז המקרר קורא לך."),
 b("office-lunch.jpg","🔍 הסיבה",'דילגת <em>על ארוחה</em>',sub="יום של קפה ושתי ארוחות קטנות נגמר תמיד ברעב גדול בלילה."),
 b("protein-foods.jpg","✅ ארוחת ערב שסוגרת",'חלבון <em>+ ירוק</em>',items=[("1","חביתה משתי ביצים וירקות"),("2","קוטג' עם סלט גדול"),("3","דג או עוף עם ירקות אפויים")]),
 b("protein-shake-glass.jpg","🥛 ואם עדיין רעב","שייק <em>לפני השינה</em>",sub="שייק חלבון קטן עם חלב: שובע עד הבוקר, בלי להתנפל על המקרר.",swipe="עוד שקופית ⬅️"),GIFT("gym-energy.jpg")],
"p10":[b("gym-energy.jpg","💪 אימון",'מה אוכלים <em>אחרי אימון?</em>',sub="החלון של השעה הראשונה קובע כמה תרוויח מהאימון."),
 b("gym-energy.jpg","❌ הטעות",'לא לאכול <em>כדי לשרוף יותר</em>',sub="בלי חלבון אחרי האימון הגוף מפרק שריר, ואתה רעב כפליים בערב."),
 b("protein-shake-glass.jpg","✅ המספרים",'חלבון <em>+ פחמימה</em>',items=[("25g","חלבון תוך שעה"),("30g","פחמימה: בננה או שיבולת שועל"),("500 מל","מים")]),
 b("protein-foods.jpg","⚡ הכי פשוט","שייק <em>בדרך הביתה</em>",sub="שייקר עם אבקת חלבון במים, בננה ביד, ויש לך ארוחת התאוששות.",swipe="עוד שקופית ⬅️"),GIFT("morning-energy-woman.jpg")],
"p11":[b("morning-tired.jpg","🍳 בוקר",'אין לך זמן <em>לארוחת בוקר?</em>',sub="יש לך 2 דקות. זה כל מה שצריך."),
 b("morning-tired.jpg","❌ מה שקורה בלי",'דילוג <em>= נשנוש</em>',sub="מי שמדלג על הבוקר אוכל בממוצע יותר עד סוף היום."),
 b("protein-shake-glass.jpg","✅ 3 אפשרויות",'בוקר <em>ב-2 דקות</em>',items=[("1","שייק פורמולה 1 עם חלב"),("2","יוגורט חלבון ושיבולת שועל"),("3","2 ביצים קשות מוכנות מראש")]),
 b("morning-lemon-water.jpg","📅 הטריק","מכינים <em>בערב</em>",sub="מנות אבקה בשקיות, שייקר מוכן על השיש. בבוקר רק מים וסוגרים.",swipe="עוד שקופית ⬅️"),GIFT("gym-energy.jpg")],
}
os.makedirs("/tmp/browser/slides",exist_ok=True)
for n,s in C.items():
    sp=f"/tmp/browser/slides/{n}.json"; json.dump(s,open(sp,"w",encoding="utf-8"),ensure_ascii=False)
    subprocess.run(["python3","scripts/render_carousel_slides.py",f"public/social/{n}",sp],check=True)
