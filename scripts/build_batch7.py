"""Render batch 7 (p37-p40) comparison/FAQ Instagram carousels; slide text (one line per slide) and captions kept together, verbatim as approved."""
import json, os, re, subprocess

BLOG = "public/images/blog"
DISC = "המחירים נכונים לנובמבר 2026 ומשתנים. המידע אינו מהווה ייעוץ רפואי."
MED = "המידע אינו מהווה ייעוץ רפואי."
# scheduled_at in Israel time (Asia/Jerusalem); converted to UTC when queued
POSTS = [
 {"name": "p37", "img": f"{BLOG}/best-creatine-iherb.jpg", "at": "2026-11-08 20:00",
  "slides": ["איזה קריאטין לקנות ב-iHerb? השווינו 5 מוצרים לפי מחיר למנה",
             "כל קריאטין מונוהידרט עובד אותו דבר. ההבדל הוא במחיר, בבדיקות ובנוחות",
             "הכי משתלם: California Gold Nutrition – כ-0.61 ₪ למנה, עם בדיקת צד שלישי",
             "לספורטאים שעוברים בדיקות: NOW Foods – תו Informed Sport, כ-0.86 ₪ למנה",
             "מתמוסס הכי טוב: Nutricost מיקרוניזד – כ-0.80 ₪ למנה",
             "קריאטין HCL? יקר בערך פי 2.5 למנה, ואין הוכחה שהוא עדיף",
             "רוצים את ההשוואה המלאה? כתבו \"קריאטין\" בתגובות ונשלח לכם את המדריך בפרטי"],
  "caption": "איזה קריאטין באמת שווה לקנות? 💪\nהשווינו 5 מוצרים פופולריים לפי מה שחשוב באמת – מחיר למנה, בדיקות צד שלישי ונוחות.\nכתבו \"קריאטין\" בתגובות ונשלח לכם בפרטי את ההשוואה המלאה 👇\n" + DISC + "\n#קריאטין #תוספי_תזונה #כושר #חדר_כושר #iherb #fullbody"},
 {"name": "p38", "img": f"{BLOG}/best-protein-powder-iherb.jpg", "at": "2026-11-10 20:00",
  "slides": ["איזו אבקת חלבון הכי משתלמת ב-iHerb?",
             "טעות נפוצה: להשוות מחיר לאריזה. משווים מחיר ל-100 גרם חלבון",
             "הנוסחה: מחיר ÷ (מנות × גרם חלבון במנה) × 100",
             "איזולט California Gold Nutrition ללא טעם – כ-16.6 ₪ ל-100 ג' חלבון",
             "חלבון אפונה NOW Foods – כ-19.2 ₪, טבעוני ובלי לקטוז",
             "Optimum Nutrition Gold Standard – כ-23.9 ₪, עם תו Informed Choice",
             "רוצים את הטבלה המלאה? כתבו \"חלבון\" בתגובות ונשלח לכם בפרטי"],
  "caption": "אל תקנו אבקת חלבון לפי מחיר האריזה 🥤\nמה שקובע הוא כמה עולים 100 גרם חלבון – והפערים בין המוצרים גדולים.\nכתבו \"חלבון\" בתגובות ונשלח לכם בפרטי את ההשוואה המלאה 👇\n" + DISC + "\n#אבקת_חלבון #חלבון #תזונת_ספורט #כושר #iherb #fullbody"},
 {"name": "p39", "img": f"{BLOG}/does-creatine-cause-weight-gain.jpg", "at": "2026-11-12 20:00",
  "slides": ["האם קריאטין משמין?",
             "התשובה הקצרה: לא. אין בו קלוריות משמעותיות והוא לא גורם לאגירת שומן",
             "אז למה עולים 1–2 ק\"ג בהתחלה? מים שנכנסים לתוך תאי השריר",
             "זה לא \"נפיחות\" מתחת לעור – המים נמצאים בתוך השריר",
             "העלייה נעצרת כשמאגרי הקריאטין מתמלאים",
             "רוצים פחות אי-נוחות? בלי העמסה, 3–5 גרם ביום, עם ארוחה",
             "כל ההסבר במדריך – כתבו \"משקל\" בתגובות ונשלח לכם בפרטי"],
  "caption": "\"התחלתי קריאטין ועליתי קילו וחצי\" – נשמע מוכר? ⚖️\nזה לא שומן. הנה מה שבאמת קורה במשקל, ואיך מפחיתים את התחושה.\nכתבו \"משקל\" בתגובות ונשלח לכם בפרטי את המדריך המלא 👇\n" + MED + "\n#קריאטין #כושר #ירידה_במשקל #חיטוב #fullbody"},
 {"name": "p40", "img": f"{BLOG}/casein-protein-before-sleep.jpg", "at": "2026-11-14 20:00",
  "slides": ["חלבון לפני השינה – באמת עוזר?",
             "קזאין נספג לאט ומשחרר חומצות אמינו לאורך הלילה",
             "במחקרים: 30–40 גרם חלבון, כ-30–60 דקות לפני השינה",
             "הכי חשוב: סך החלבון ביום. התזמון הוא בונוס",
             "לא חייבים אבקה: גביע קוטג' 5% ≈ 25 גרם חלבון",
             "גבינה לבנה ויוגורט חלבון – גם הם עשירים בקזאין",
             "רוצים את המדריך המלא? כתבו \"שינה\" בתגובות ונשלח לכם בפרטי"],
  "caption": "שייק קזאין לפני השינה – או פשוט קוטג'? 🌙\nמה המחקר אומר על חלבון לפני השינה, ולמה במקרר שלכם כבר יש אלטרנטיבה זולה.\nכתבו \"שינה\" בתגובות ונשלח לכם בפרטי את המדריך המלא 👇\n" + MED + "\n#חלבון #קזאין #בניית_שריר #תזונת_ספורט #fullbody"},
]

def esc(t):
    t = t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    # isolate Latin runs (brand/product names) so RTL punctuation order stays correct
    return re.sub(r"[A-Za-z][A-Za-z0-9 .]*[A-Za-z0-9]", lambda m: f'<bdi dir="ltr">{m.group(0)}</bdi>', t)

if __name__ == "__main__":
    os.makedirs("/tmp/browser/slides", exist_ok=True)
    out = []
    for p in POSTS:
        n = len(p["slides"])
        spec = [{"bg": p["img"], "brand": "FullBody",
                 "body": f'<h1 class="{"" if len(t) < 40 else "long"}" dir="rtl">{esc(t)}</h1>',
                 "swipe": f"{i}/{n}" if i == n else f"{i}/{n} ←"} for i, t in enumerate(p["slides"], 1)]
        path = f'/tmp/browser/slides/{p["name"]}.json'
        json.dump(spec, open(path, "w", encoding="utf-8"), ensure_ascii=False)
        subprocess.run(["python3", "scripts/render_carousel_slides.py", f'public/social/{p["name"]}', path], check=True)
        out.append({"name": p["name"], "caption": p["caption"], "at": p["at"], "count": n})
    json.dump(out, open("/tmp/browser/slides/batch7.json", "w", encoding="utf-8"), ensure_ascii=False)
