import json, os, subprocess, sys
sys.path.insert(0,'scripts')
BG="public/social/bg"
def b(bg, tag, title, sub=None, items=None, cta=None, swipe="החלק שמאלה ⬅️"):
    body=f'<span class="tag">{tag}</span><h1>{title}</h1>'
    if sub: body+=f'<p class="sub">{sub}</p>'
    if items: body+="<ul>"+"".join(f"<li><b>{n}</b><span>{t}</span></li>" for n,t in items)+"</ul>"
    if cta: body+=f'<div class="cta">{cta}</div>'
    return {"bg":f"{BG}/{bg}","body":body,"swipe":swipe}
C={
"p6":[b("office-lunch.jpg","טיפ מעשי",'איך בונים <em>נשנוש משביע</em>',sub="שלבו מקור חלבון, פרי או ירק ומשקה ללא סוכר."),b("protein-foods.jpg","דוגמה",'שלוש אפשרויות <em>פשוטות</em>',items=[("1","יוגורט ופרי"),("2","ביצה וירקות"),("3","קטניות קלויות")]),b("morning-energy-woman.jpg","ליישום",'בחרו אפשרות אחת <em>למחר</em>',sub="הכנה מראש מקלה על בחירה נוחה במהלך היום.",swipe="לשמור לפעם הבאה")],
"p7":[b("gym-energy.jpg","אימון",'לא חייבים להספיק הכול <em>בשבוע אחד</em>',sub="בחרו שני אימונים קבועים והוסיפו רק כשזה מתאים."),b("gym-energy.jpg","תכנון",'קובעים זמן <em>ריאלי</em>',items=[("1","יום ושעה"),("2","משך שמתאים לכם"),("3","חלופה ליום עמוס")]),b("morning-energy-woman.jpg","ליישום",'עקביות לפני <em>שלמות</em>',sub="אימון קצר שמתבצע עדיף מתוכנית גדולה שנשארת על הנייר.",swipe="לשמור לפעם הבאה")],
"p8":[b("morning-lemon-water.jpg","שתייה",'דרך פשוטה לזכור <em>לשתות</em>',sub="הניחו בקבוק במקום שבו אתם עובדים או לומדים."),b("morning-lemon-water.jpg","הרגל",'מצמידים שתייה <em>לפעולה קבועה</em>',items=[("1","כוס ליד ארוחת הבוקר"),("2","בקבוק ליד המחשב"),("3","מילוי נוסף בצהריים")]),b("morning-energy-woman.jpg","ליישום",'בדקו את צבע השתן <em>ואת תחושת הצמא</em>',sub="הצרכים משתנים לפי מזג האוויר והפעילות.",swipe="לשמור לפעם הבאה")],
"p9":[b("office-lunch.jpg","מטבח",'ארוחת ערב <em>בלי להסתבך</em>',sub="בוחרים חלבון, ירקות ותוספת שאוהבים."),b("protein-foods.jpg","דוגמאות",'שלושה שילובים <em>מהירים</em>',items=[("1","חביתה, סלט ולחם"),("2","קוטג׳, ירקות ותפוח אדמה"),("3","טופו, ירקות ואורז")]),b("office-lunch.jpg","ליישום",'שמרו שני מרכיבים <em>זמינים</em>',sub="ארוחה פשוטה אינה צריכה להיות מושלמת כדי להיות שימושית.",swipe="לשמור לפעם הבאה")],
"p10":[b("gym-energy.jpg","אחרי אימון",'הכמות היומית <em>חשובה מהדקה</em>',sub="אין חובה לשתות שייק מיד כשמסיימים."),b("protein-foods.jpg","אוכל רגיל",'אפשר לבחור <em>ארוחה</em>',items=[("1","יוגורט ופרי"),("2","ביצים ולחם"),("3","עוף, טופו או קטניות")]),b("gym-energy.jpg","ליישום",'תכננו את הארוחה <em>הבאה</em>',sub="אם היא רחוקה, קחו נשנוש נוח עם חלבון.",swipe="לשמור לפעם הבאה")],
"p11":[b("morning-tired.jpg","בוקר",'ארוחה פשוטה <em>בחמש דקות</em>',sub="בחרו אפשרות שקל לחזור אליה גם ביום עמוס."),b("protein-foods.jpg","רעיונות",'שלוש ארוחות <em>מהירות</em>',items=[("1","יוגורט ושיבולת שועל"),("2","ביצים וירקות"),("3","כריך טונה או טופו")]),b("morning-energy-woman.jpg","ליישום",'מכינים רכיב אחד <em>בערב</em>',sub="קופסה, בקבוק או פרי מוכן חוסכים החלטה בבוקר.",swipe="לשמור לפעם הבאה")],
}
os.makedirs("/tmp/browser/slides",exist_ok=True)
for n,s in C.items():
    sp=f"/tmp/browser/slides/{n}.json"; json.dump(s,open(sp,"w",encoding="utf-8"),ensure_ascii=False)
    subprocess.run(["python3","scripts/render_carousel_slides.py",f"public/social/{n}",sp],check=True)
