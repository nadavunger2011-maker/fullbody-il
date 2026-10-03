import json, os, subprocess, sys
sys.path.insert(0, 'scripts')
BG = "public/social/bg"

def b(bg, tag, title, sub=None, items=None, cta=None, swipe="החלק שמאלה ⬅️"):
    body = f'<span class="tag">{tag}</span><h1>{title}</h1>'
    if sub: body += f'<p class="sub">{sub}</p>'
    if items: body += "<ul>" + "".join(f"<li><b>{n}</b><span>{t}</span></li>" for n, t in items) + "</ul>"
    if cta: body += f'<div class="cta">{cta}</div>'
    return {"bg": f"{BG}/{bg}", "body": body, "swipe": swipe}

C = {
    "p20": [
        b("gym-energy.jpg", "תנועה", 'הליכה יומית <em>בלי מסגרת</em>', sub="לא חייבים אימון מסודר כדי לזוז יותר במהלך היום."),
        b("gym-energy.jpg", "רעיונות", 'שלוש דרכים <em>להוסיף צעדים</em>', items=[("1", "לרדת תחנה אחת קודם"), ("2", "שיחת טלפון בהליכה"), ("3", "הליכה קצרה אחרי ארוחה")]),
        b("morning-energy-woman.jpg", "ליישום", 'בחרו רגע קבוע <em>ביום</em>', sub="הצמדה לפעולה קיימת הופכת הליכה להרגל.", swipe="לשמור לפעם הבאה"),
    ],
    "p21": [
        b("protein-foods.jpg", "ארוחת בוקר", 'חלבון כבר <em>בבוקר</em>', sub="ארוחת בוקר עם חלבון עוזרת לרבים להרגיש שובע לאורך הבוקר."),
        b("protein-foods.jpg", "דוגמאות", 'שלוש אפשרויות <em>פשוטות</em>', items=[("1", "יוגורט יווני ופרי"), ("2", "ביצים ולחם"), ("3", "קוטג׳ וירקות")]),
        b("morning-energy-woman.jpg", "ליישום", 'מכינים מרכיב אחד <em>מהערב</em>', sub="ביצה קשה או קופסה מוכנה חוסכים החלטה בבוקר.", swipe="לשמור לפעם הבאה"),
    ],
    "p22": [
        b("morning-tired.jpg", "ערב", 'שגרת ערב <em>רגועה</em>', sub="שינה טובה מתחילה בשעה שלפני המיטה."),
        b("morning-lemon-water.jpg", "הרגלים", 'שלושה צעדים <em>פשוטים</em>', items=[("1", "מסכים במצב לילה"), ("2", "חדר קריר וחשוך"), ("3", "שעה קבועה לשכיבה")]),
        b("morning-energy-woman.jpg", "ליישום", 'מתחילים מצעד <em>אחד</em>', sub="שינוי קטן שחוזר על עצמו עדיף משגרה מושלמת שלא נשמרת.", swipe="לשמור לפעם הבאה"),
    ],
}

os.makedirs("/tmp/browser/slides", exist_ok=True)
for n, s in C.items():
    sp = f"/tmp/browser/slides/{n}.json"
    json.dump(s, open(sp, "w", encoding="utf-8"), ensure_ascii=False)
    subprocess.run(["python3", "scripts/render_carousel_slides.py", f"public/social/{n}", sp], check=True)
print("done")
