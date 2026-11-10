import html, base64, pathlib
import os, sys
from content import RECIPES as R1, SECTIONS, HL, IHB
from content_more import MORE, ORDER, IMG
RECIPES = sorted(R1 + MORE, key=lambda r: ORDER.index(r["sec"]))
IMGDIR = pathlib.Path(os.environ.get("IMGDIR", pathlib.Path(__file__).parent / "img"))
def img_uri(n):
    for ext in ("jpg", "jpeg", "png", "webp"):
        f = IMGDIR / f"r{n:02d}.{ext}"
        if f.exists():
            mime = "jpeg" if ext in ("jpg", "jpeg") else ext
            return f"data:image/{mime};base64," + base64.b64encode(f.read_bytes()).decode()
    return None

ROOT = pathlib.Path(__file__).parent
def font(fam, path, w):
    b = base64.b64encode((ROOT / path).read_bytes()).decode()
    return f"@font-face{{font-family:'{fam}';src:url(data:font/woff2;base64,{b}) format('woff2');font-weight:{w};}}"

FONTS = "".join([
    font("Heebo", "fontsource-heebo-5.2.8/files/heebo-hebrew-400-normal.woff2", 400),
    font("Heebo", "fontsource-heebo-5.2.8/files/heebo-latin-400-normal.woff2", 400),
    font("Heebo", "fontsource-heebo-5.2.8/files/heebo-hebrew-500-normal.woff2", 500),
    font("Heebo", "fontsource-heebo-5.2.8/files/heebo-latin-500-normal.woff2", 500),
    font("Heebo", "fontsource-heebo-5.2.8/files/heebo-hebrew-700-normal.woff2", 700),
    font("Heebo", "fontsource-heebo-5.2.8/files/heebo-latin-700-normal.woff2", 700),
    font("Rubik", "fontsource-rubik-5.2.8/files/rubik-hebrew-700-normal.woff2", 700),
    font("Rubik", "fontsource-rubik-5.2.8/files/rubik-latin-700-normal.woff2", 700),
    font("Rubik", "fontsource-rubik-5.2.8/files/rubik-hebrew-900-normal.woff2", 900),
    font("Rubik", "fontsource-rubik-5.2.8/files/rubik-latin-900-normal.woff2", 900),
])
e = html.escape

CSS = FONTS + """
@page{size:148mm 210mm;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Heebo,sans-serif;color:#2b1d14;direction:rtl;-webkit-print-color-adjust:exact;print-color-adjust:exact}
a{color:inherit;text-decoration:none}a.row{display:flex;justify-content:space-between;align-items:center;gap:2mm;width:100%}a.row u{text-decoration-color:#c9b49c;text-underline-offset:1mm}
.page{width:148mm;height:210mm;position:relative;overflow:hidden;page-break-after:always;background:#fbf6ef}
.pad{padding:14mm 13mm 12mm}
h1,h2,h3,.disp{font-family:Rubik,Heebo,sans-serif}
.foot{position:absolute;bottom:6mm;left:13mm;right:13mm;display:flex;justify-content:space-between;font-size:7.5pt;color:#9a8572}
/* cover */
.cover{background:#2b1d14;color:#fbf6ef}
.cover .blob{position:absolute;border-radius:50%}
.cover .k{font-size:10pt;letter-spacing:.2em;color:#e7b45a;font-weight:700}
.cover h1{font-size:46pt;line-height:.95;font-weight:900;margin-top:6mm}
.cover h1 span{color:#e7b45a}
.cover .sub{font-size:13pt;margin-top:7mm;line-height:1.45;max-width:95mm;color:#eadccb}
.cover .brand{position:absolute;bottom:13mm;right:13mm;font-family:Rubik;font-weight:900;font-size:16pt;letter-spacing:.02em}
.cover .brand small{display:block;font-family:Heebo;font-weight:400;font-size:8.5pt;color:#bfa991;letter-spacing:0}
.cover .count{position:absolute;bottom:13mm;left:13mm;text-align:center;border:1.5px solid #e7b45a;border-radius:50%;width:26mm;height:26mm;display:flex;flex-direction:column;justify-content:center;color:#e7b45a}
.cover .count b{font-family:Rubik;font-size:24pt;line-height:1}
.cover .count i{font-style:normal;font-size:8pt}
/* generic */
.eyebrow{font-size:8.5pt;font-weight:700;letter-spacing:.15em;color:#c58b3c}
h2{font-size:22pt;font-weight:900;line-height:1.1;margin:2mm 0 5mm}
p.lead{font-size:10.5pt;line-height:1.6;margin-bottom:4mm}
.legend{display:flex;flex-direction:column;gap:3mm;margin:5mm 0}
.legend div{display:flex;gap:3mm;align-items:flex-start;font-size:9.5pt;line-height:1.5}
.b{display:inline-block;font-size:7.4pt;font-weight:700;padding:.7mm 2.6mm;border-radius:10mm;white-space:nowrap;vertical-align:1px}
.b.fb{background:#2b1d14;color:#e7b45a}
.b.ih{background:#4e8a3e;color:#fff}
.note{font-size:8pt;line-height:1.5;color:#7d6a58;border-top:1px solid #e3d5c4;padding-top:3mm;margin-top:5mm}
.rules{counter-reset:r}
.rules li{list-style:none;counter-increment:r;position:relative;padding-right:11mm;margin-bottom:4.2mm;font-size:9.8pt;line-height:1.5}
.rules li::before{content:counter(r);position:absolute;right:0;top:0;width:7.5mm;height:7.5mm;border-radius:50%;background:#e7b45a;color:#2b1d14;font-family:Rubik;font-weight:900;font-size:10pt;display:flex;align-items:center;justify-content:center}
.rules b{display:block;font-family:Rubik;font-size:10.5pt}
.toc{margin-top:1mm;columns:2;column-gap:7mm}.toc .grp{break-inside:avoid}
.toc .sec{font-family:Rubik;font-weight:900;font-size:9.5pt;margin:2.4mm 0 .8mm;display:flex;align-items:center;gap:2mm}
.toc .sec i{width:3mm;height:3mm;border-radius:50%;display:inline-block}
.toc a{display:flex;justify-content:space-between;gap:2mm;font-size:7.9pt;line-height:1.5;border-bottom:1px dotted #d9c8b4}
.toc a span:last-child{color:#9a8572;font-variant-numeric:tabular-nums}
/* recipe */
.r .band{height:62mm;position:relative;color:#fff;padding:0 13mm 6mm;display:flex;flex-direction:column;justify-content:flex-end;background-size:cover;background-position:center}.r .band .shade{position:absolute;inset:0;background:linear-gradient(to top,rgba(30,18,10,.85) 0%,rgba(30,18,10,.35) 55%,rgba(30,18,10,0) 100%)}.r .band>*:not(.shade){position:relative}.r.compact .ing li{font-size:9.2pt;padding:.9mm 0}.r.compact ol.steps li{font-size:9.2pt;margin-bottom:1.4mm}.r.compact .tip{font-size:8.8pt;margin-top:3mm}.r.compact .body{padding-top:4.5mm}.r.compact .ing{margin-bottom:3.5mm;padding:3mm 4.5mm}
.r .band .num{position:absolute;left:9mm;bottom:3mm;font-family:Rubik;font-weight:900;font-size:78pt;opacity:.16;line-height:1}
.r .band .secname{font-size:8.5pt;font-weight:700;letter-spacing:.15em;opacity:.85}
.r .band h3{font-size:21pt;font-weight:900;line-height:1.1;margin-top:2mm;max-width:84mm;text-shadow:0 .4mm 2mm rgba(0,0,0,.35)}
.r .meta{display:flex;gap:2mm;margin-top:4mm}
.r .meta span{background:rgba(255,255,255,.18);border-radius:10mm;padding:.8mm 3mm;font-size:8pt;font-weight:500}
.r .body{padding:6mm 13mm 0}
.r h4{font-family:Rubik;font-size:11.5pt;font-weight:900;margin-bottom:2mm}
.r .ing{background:#fff;border-radius:3mm;padding:4mm 5mm;margin-bottom:5mm;box-shadow:0 .3mm 1.2mm rgba(60,30,10,.08)}
.r .ing li{list-style:none;font-size:10.3pt;line-height:1.35;padding:1.4mm 0;border-bottom:1px solid #f1e8dc;display:flex;justify-content:space-between;align-items:center;gap:2mm}
.r .ing li:last-child{border-bottom:0}
.r .ing .amt{color:#8a7461;font-weight:500;margin-left:1.5mm}
.r ol.steps{counter-reset:s}
.r ol.steps li{list-style:none;counter-increment:s;position:relative;padding-right:7.5mm;font-size:10.2pt;line-height:1.5;margin-bottom:2.2mm}
.r ol.steps li::before{content:counter(s);position:absolute;right:0;top:.2mm;font-family:Rubik;font-weight:900;font-size:10pt}
.r .tip{margin-top:4mm;border-radius:3mm;padding:3mm 4.5mm;font-size:9.6pt;line-height:1.45}
.r .tip b{font-family:Rubik}
/* pantry */
.prod{display:flex;gap:3mm;padding:1.5mm 0;border-bottom:1px solid #e9dccb;align-items:center}
.prod .n{font-family:Rubik;font-weight:900;font-size:13pt;color:#c58b3c;width:7mm;flex:none}
.prod .t{flex:1}
.prod .t b{font-size:9.6pt;display:block}
.prod .t small{font-size:7.4pt;color:#8a7461;direction:ltr;display:block;text-align:right}
.prod .t em{font-style:normal;font-size:8pt;line-height:1.35;display:block}
.btn{flex:none;font-size:7.5pt;font-weight:700;padding:1.3mm 3mm;border-radius:10mm;white-space:nowrap}
.btn.ih{background:#4e8a3e;color:#fff}
.btn.fb{background:#2b1d14;color:#e7b45a}
.end{background:#2b1d14;color:#fbf6ef}
.end h2{color:#e7b45a}
.cta{display:inline-block;margin-top:6mm;background:#e7b45a;color:#2b1d14;font-family:Rubik;font-weight:900;font-size:12pt;padding:3mm 7mm;border-radius:10mm}
"""

def badge(kind, url):
    lab = "לחנות FullBody" if kind == "hl" else "לקנייה ב-iHerb"
    cls = "fb" if kind == "hl" else "ih"
    return f'<a class="b {cls}" href="{e(url)}">{lab} ›</a>'

pages = []
foot = lambda n: f'<div class="foot"><span>fullbody.co.il</span><span>{n}</span></div>'

# cover
_cov = None
for _ext in ("jpg","jpeg","png","webp"):
    _f = IMGDIR / f"cover.{_ext}"
    if _f.exists():
        _cov = f"data:image/{'jpeg' if _ext in ('jpg','jpeg') else _ext};base64," + base64.b64encode(_f.read_bytes()).decode()
        break
_covimg = (f'<div style="position:absolute;left:0;right:0;bottom:0;height:120mm;background:url({_cov}) center/cover"></div>'
           '<div style="position:absolute;left:0;right:0;bottom:0;height:120mm;background:linear-gradient(to bottom,#2b1d14 0%,rgba(43,29,20,.2) 45%,rgba(43,29,20,.75) 100%)"></div>') if _cov else ""
pages.append("""<div class="page cover">"""+_covimg+"""
<div class="blob" style="width:120mm;height:120mm;background:#5b3a29;left:-35mm;top:-30mm"></div>
<div class="blob" style="width:70mm;height:70mm;background:#c58b3c;opacity:.55;right:-22mm;top:95mm"></div>
<div class="blob" style="width:34mm;height:34mm;background:#c0485a;opacity:.8;left:30mm;top:118mm"></div>
<div class="pad" style="position:relative">
<div class="k">ספר מתכונים · מתנה</div>
<h1>קינוחי<br><span>חלבון</span></h1>
<p class="sub">40 קינוחים מתוקים באמת, עם יותר חלבון ופחות סוכר. רובם דורשים פחות מ-15 דקות עבודה.</p>
</div>
<div class="count"><b>40</b><i>מתכונים</i></div>
<div class="brand">FullBody<small>תזונה · כושר · בריאות</small></div>
</div>""")

import re as _re
if _cov: pages[-1] = _re.sub(r'<div class="blob"[^>]*></div>', '', pages[-1])
# intro
pages.append(f"""<div class="page"><div class="pad">
<div class="eyebrow">לפני שמתחילים</div>
<h2>מתוק, בלי רגשות אשמה</h2>
<p class="lead">בנינו את הספר הזה סביב רעיון פשוט: קינוח לא חייב להיות "חריגה". כשמחליפים חלק מהסוכר והקמח בחלבון, בשיבולת שועל ובקמח שקדים, מקבלים קינוח שמשביע יותר ומתאים גם לתפריט של מתאמנים.</p>
<p class="lead">כל מתכון כתוב בשפה פשוטה, עם מרכיבים שקל להשיג. ליד מרכיבים מסוימים תראו תגית. לחיצה עליה מובילה ישר למוצר:</p>
<div class="legend">
<div><span class="b fb">FullBody ›</span><span>מוצרי התזונה מהחנות שלנו: פורמולה 1, אבקת החלבון וחטיפי החלבון. הם הבסיס החלבוני של המתכונים.</span></div>
<div><span class="b ih">iHerb ›</span><span>מרכיבי מזווה שבחרנו ב-iHerb: קמח שקדים, קקאו, ממתיק בלי סוכר ועוד. הרשימה המלאה בסוף הספר.</span></div>
</div>
<p class="lead">אין לכם מרכיב? כמעט תמיד אפשר להחליף. בעמוד הבא יש כמה כללים שיעזרו לכם לאלתר.</p>
<p class="note">גילוי נאות: הקישורים ל-iHerb הם קישורי שותפים. אם תקנו דרכם, נקבל עמלה קטנה, בלי שום תוספת למחיר שלכם. פורמולה 1 היא תחליף ארוחה, ובמתכונים היא משמשת כמרכיב. מי שיש לו אלרגיה (אגוזים, בוטנים, חלב, ביצים) צריך לבדוק את רשימת הרכיבים של כל מוצר.</p>
</div>{foot(2)}</div>""")

# rules
rules = [
 ("אל תאפו יותר מדי", "אבקת חלבון מתייבשת מהר. הוציאו מהתנור או מהמיקרוגל כשהמרכז עדיין מעט רך."),
 ("לחות היא החבר הכי טוב", "יוגורט, בננה, גבינה לבנה או ביצה שומרים על מרקם רך. אל תוותרו עליהם."),
 ("לא יותר משליש חלבון", "אם תחליפו את כל הקמח באבקת חלבון, הקינוח יהיה גומי. שליש מהיבשים זה המקסימום."),
 ("אש בינונית", "במחבת ובסיר, אבקת חלבון נשרפת על אש גבוהה. סבלנות משתלמת."),
 ("מוסיפים מחוץ לאש", "בקרמים ופודינגים, מקציפים את אבקת החלבון פנימה רק אחרי שהורדתם מהאש."),
 ("טעמו לפני שממתיקים", "פורמולה 1 כבר מתוקה. הוסיפו ממתיק רק אם צריך."),
]
pages.append('<div class="page"><div class="pad"><div class="eyebrow">6 כללים</div><h2>איך אופים עם חלבון</h2><ol class="rules">'
             + "".join(f"<li><b>{e(a)}</b>{e(b)}</li>" for a, b in rules) + f"</ol></div>{foot(3)}</div>")

# toc
FIRST = 5
toc = '<div class="page"><div class="pad"><div class="eyebrow">מה בספר</div><h2>תוכן העניינים</h2><div class="toc">'
cur = None
for i, r in enumerate(RECIPES):
    if r["sec"] != cur:
        if cur: toc += '</div>'
        cur = r["sec"]; nm, col = SECTIONS[cur]
        toc += f'<div class="grp"><div class="sec"><i style="background:{col}"></i>{e(nm)}</div>'
    toc += f'<a href="#r{i+1}"><span>{e(r["name"])}</span><span>{FIRST+i}</span></a>'
toc += '</div>'
toc += f'<div class="grp"><div class="sec"><i style="background:#4e8a3e"></i>נספחים</div><a href="#pantry"><span>המזווה: מה כדאי שיהיה בבית</span><span>{FIRST+len(RECIPES)}</span></a>'
toc += f'<a href="#base"><span>הבסיס החלבוני</span><span>{FIRST+len(RECIPES)+1}</span></a></div></div></div>{foot(4)}</div>'
pages.append(toc)

# recipes
for i, r in enumerate(RECIPES):
    nm, col = SECTIONS[r["sec"]]
    lis = ""
    for kind, a, k in r["ing"]:
        if kind == "p":
            lis += f"<li><span>{e(a)}</span></li>"
        elif kind == "hl":
            lis += f'<li><a class="row" href="{e(HL[k][1])}"><span><span class="amt">{e(a)}</span><u>{e(HL[k][0])}</u></span>{badge("hl", HL[k][1]).replace("<a ","<span ").replace("</a>","</span>")}</a></li>'
        else:
            lis += f'<li><a class="row" href="{e(IHB[k][2])}"><span><span class="amt">{e(a)}</span><u>{e(IHB[k][0])}</u></span>{badge("ih", IHB[k][2]).replace("<a ","<span ").replace("</a>","</span>")}</a></li>'
    steps = "".join(f"<li>{e(s)}</li>" for s in r["steps"])
    pages.append(f"""<div class="page r" id="r{i+1}">
<div class="band" style="background-color:{col};{('background-image:url('+img_uri(i+1)+');') if img_uri(i+1) else ''}"><div class="shade"></div><div class="num">{i+1:02d}</div>
<div class="secname">{e(nm)}</div><h3>{e(r['name'])}</h3>
<div class="meta"><span>⏱ {e(r['time'])}</span><span>{e(r['serv'])}</span><span>{e(r['tag'])}</span></div></div>
<div class="body"><div class="ing"><h4>מה צריך</h4><ul>{lis}</ul></div>
<h4>איך מכינים</h4><ol class="steps">{steps}</ol>
<div class="tip" style="background:{col}1f"><b>טיפ:</b> {e(r['tip'])}</div></div>
{foot(FIRST+i)}</div>""")

# pantry
n = FIRST + len(RECIPES)
pp = '<div class="page" id="pantry"><div class="pad" style="padding-top:12mm"><div class="eyebrow">נספח</div><h2 style="margin-bottom:2mm">המזווה</h2><p class="lead" style="font-size:9pt;margin-bottom:2mm">עשרה מרכיבים שמופיעים שוב ושוב בספר. כולם ב-iHerb, במשלוח עד הבית.</p>'
for j, (k, (he, en, url, desc)) in enumerate(IHB.items()):
    pp += f'<div class="prod"><div class="n">{j+1}</div><div class="t"><b>{e(he)}</b><small>{e(en)}</small><em>{e(desc)}</em></div><a class="btn ih" href="{e(url)}">ל-iHerb ›</a></div>'
pages.append(pp + f"</div>{foot(n)}</div>")

# base products
base = [("f1c", "תחליף ארוחה בטעם שוקולד. הבסיס לכל קינוחי השוקולד."),
        ("f1v", "בטעם וניל עדין. מתאים לעוגות גבינה, עוגיות ומאפינס."),
        ("f1l", "בטעם קפה לאטה. לטירמיסו, פרפצ'ינו וארטיקים."),
        ("pdm", "תוספת חלבון לשייק, כשרוצים להעלות עוד את כמות החלבון."),
        ("barL", "חטיף חלבון בטעם לימון. בסיס פריך לעוגת גבינה."),
        ("barV", "חטיף בטעם וניל ושקדים. הופך לפרלינים בחמש דקות.")]
bp = '<div class="page" id="base"><div class="pad"><div class="eyebrow">נספח</div><h2>הבסיס החלבוני</h2><p class="lead" style="font-size:9.5pt">המוצרים שנותנים למתכונים את החלבון ואת הטעם. כולם בחנות של FullBody.</p>'
for k, d in base:
    bp += f'<div class="prod"><div class="t"><b>{e(HL[k][0])}</b><em>{e(d)}</em></div><a class="btn fb" href="{e(HL[k][1])}">לחנות ›</a></div>'
pages.append(bp + f"</div>{foot(n+1)}</div>")

# end
pages.append("""<div class="page end"><div class="pad" style="padding-top:60mm">
<div class="eyebrow" style="color:#e7b45a">בתיאבון</div><h2>רוצים עוד?</h2>
<p class="lead" style="color:#eadccb">באתר מחכים לכם עוד מתכונים, מחשבון חלבון יומי ומדריכים על תוספים, אימונים ותזונה, בלי הבטחות ריקות.</p>
<a class="cta" href="https://fullbody.co.il/?utm_source=ebook&utm_medium=pdf&utm_campaign=dessert-ebook">fullbody.co.il</a>
<p class="note" style="color:#bfa991;border-color:#4a362a;margin-top:30mm">המידע בספר הוא כללי ואינו מחליף ייעוץ תזונתי או רפואי. קישורי iHerb הם קישורי שותפים. מחירים וזמינות נקבעים באתרים עצמם.</p>
</div></div>""")

out = f"<!doctype html><html lang='he' dir='rtl'><head><meta charset='utf-8'><style>{CSS}</style></head><body>{''.join(pages)}</body></html>"
(ROOT / "ebook.html").write_text(out)
print("pages", len(pages))

