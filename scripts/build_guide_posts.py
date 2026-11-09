"""Converts approved markdown guide articles into src/data/guidePosts.ts.
Usage: python3 scripts/build_guide_posts.py <dir with meta.json and <slug>.md>
Text is kept verbatim; only markdown syntax is converted to HTML.
The "## שאלות נפוצות" section becomes the structured faq list (rendered + FAQPage schema)."""
import html, json, re, sys
from pathlib import Path

DATE = "2026-11-05"
EXPLICIT_AFFILIATE_ONLY = {"best-creatine-iherb", "creatine-monohydrate-vs-hcl", "does-creatine-cause-weight-gain", "creatine-for-women",
                           "best-protein-powder-iherb", "casein-protein-before-sleep", "protein-powder-for-women", "whey-vs-plant-protein",
                           "magnesium-types-guide", "best-magnesium-iherb", "magnesium-oxide", "magnesium-for-sleep",
                           "protein-bars-guide", "pre-workout-guide", "multivitamin-for-athletes",
                           "bcaa-guide", "fat-burner-guide", "omega-3-for-athletes"}
LINKS = {
    "מחשבון החלבון היומי": "/protein-calculator",
    "מתכוני שייקים עם חלבון": "/blog/protein-shake-recipes",
    "שייק חלבון אחרי אימון: כמה, מתי ואיך לבחור": "/blog/best-protein-after-workout",
    "קריאטין – המדריך המלא": "/blog/creatine-guide",
    "איזו אבקת חלבון לבחור": "/blog/protein-powder-types-guide",
    "איזה קריאטין לקנות": "/blog/best-creatine-iherb",
    "קריאטין מונוהידרט מול HCL": "/blog/creatine-monohydrate-vs-hcl",
    "האם קריאטין משמין": "/blog/does-creatine-cause-weight-gain",
    "קריאטין לנשים": "/blog/creatine-for-women",
    "תוספי תזונה למתאמנים": "/blog/gym-supplements-what-works",
    "איזו אבקת חלבון לקנות": "/blog/best-protein-powder-iherb",
    "חלבון לפני שינה": "/blog/casein-protein-before-sleep",
    "אבקת חלבון לנשים": "/blog/protein-powder-for-women",
    "חלבון צמחי מול מי גבינה": "/blog/whey-vs-plant-protein",
    "שייק חלבון אחרי אימון": "/blog/best-protein-after-workout",
    "סוגי מגנזיום": "/blog/magnesium-types-guide",
    "איזה מגנזיום לקנות": "/blog/best-magnesium-iherb",
    "מגנזיום אוקסיד": "/blog/magnesium-oxide",
    "מגנזיום לשינה": "/blog/magnesium-for-sleep",
    "חטיפי חלבון": "/blog/protein-bars-guide",
    "פרה-וורקאאוט": "/blog/pre-workout-guide",
    "מולטי ויטמין למתאמנים": "/blog/multivitamin-for-athletes",
    "BCAA": "/blog/bcaa-guide",
    "שורף שומן": "/blog/fat-burner-guide",
    "אומגה 3 לספורטאים": "/blog/omega-3-for-athletes",
}

# (AFF:key) placeholders -> tracked deeplink with subId1 = the article's slug.
AFF_PRODUCTS = {
    "on_whey": "https://www.iherb.com/pr/optimum-nutrition-gold-standard-100-whey-protein-double-rich-chocolate-5-05-lb-2-29-kg/27509",
    "cgn_iso_van": "https://www.iherb.com/pr/california-gold-nutrition-whey-protein-isolate-very-vanilla-5-lb-2-27-kg/82707",
    "cgn_iso_unf": "https://www.iherb.com/pr/california-gold-nutrition-sport-whey-protein-isolate-unflavored-5-lb-2-27-kg/76479",
    "now_pea": "https://www.iherb.com/pr/now-foods-sports-pea-protein-pure-unflavored-2-lbs-907-g/9858",
    "on_casein": "https://www.iherb.com/pr/optimum-nutrition-gold-standard-100-casein-chocolate-supreme-1-87-lb-850-g/27527",
    "mg_db": "https://www.iherb.com/pr/doctor-s-best-high-absorption-magnesium-120-tablets-100-mg-per-tablet/15",
    "mg_cgn": "https://www.iherb.com/pr/california-gold-nutrition-magnesium-bisglycinate-chelate-albion-traacs-240-veggie-capsules-100-mg-per-capsule/103274",
    "mg_citrate": "https://www.iherb.com/pr/now-foods-magnesium-citrate-200-mg-250-tablets/691",
    "mg_now_caps": "https://www.iherb.com/pr/now-foods-magnesium-caps-400-mg-180-veg-capsules/662",
    "mg_threonate": "https://www.iherb.com/pr/life-extension-neuro-mag-magnesium-l-threonate-90-vegetarian-capsules-48-mg-per-capsule/40244",
    "mt_creatine": "https://www.iherb.com/pr/muscletech-essential-series-platinum-100-creatine-unflavored-14-11-oz-400-g/74271",
    "c4_fp": "https://www.iherb.com/pr/c4-cellucor-c4-original-pre-workout-fruit-punch-12-7-oz-360-g/64195",
    "quest_ccd": "https://www.iherb.com/pr/quest-nutrition-protein-bar-chocolate-chip-cookie-dough-12-bars-2-12-oz-60-g-each/63559",
    "xtend_mango": "https://www.iherb.com/pr/xtend-7g-bcaa-mango-madness-14-3-oz-405-g/57800",
    "hydroxycut_se": "https://www.iherb.com/pr/muscletech-hydroxycut-hardcore-super-elite-120-rapid-release-thermo-capsules/106000",
    "on_optimen": "https://www.iherb.com/pr/optimum-nutrition-opti-men-multivitamin-for-active-men-150-tablets/57069",
    "cgn_omega3": "https://www.iherb.com/pr/california-gold-nutrition-omega-3-premium-fish-oil-100-fish-gelatin-softgels-1-100-mg-per-softgel/62118",
    "le_mg_caps": "https://www.iherb.com/pr/life-extension-magnesium-caps-500-mg-100-vegetarian-capsules/48803",
    "vega_sport_choc": "https://www.iherb.com/pr/vega-sport-plant-based-premium-protein-powder-chocolate-1-lb-13-5-oz-837-g/66667",
}

def aff_url(key: str, slug: str) -> str:
    from urllib.parse import quote
    if key not in AFF_PRODUCTS:
        raise SystemExit(f"unknown AFF key: {key}")
    if not slug:
        raise SystemExit("AFF placeholder needs the article slug")
    # quote(safe="-_.!~*'()") matches JS encodeURIComponent.
    return f"https://iherb.pxf.io/c/3215306/1665867/19332?subId1={slug}&u={quote(AFF_PRODUCTS[key], safe="-_.!~*'()")}"

FURTHER_READING = {
    "creatine-guide": "להמשך קריאה: [איזה קריאטין לקנות], [קריאטין מונוהידרט מול HCL], [האם קריאטין משמין] ו[קריאטין לנשים].",
    "protein-powder-types-guide": "להמשך קריאה: [איזו אבקת חלבון לקנות], [חלבון צמחי מול מי גבינה], [חלבון לפני שינה] ו[אבקת חלבון לנשים].",
}

AFFILIATE_BASE = "https://iherb.pxf.io/c/3215306/1665867/19332?u="
CREATINE_CATEGORY = AFFILIATE_BASE + "https%3A%2F%2Fwww.iherb.com%2Fc%2Fcreatine-monohydrate"
GAINER_CATEGORY = AFFILIATE_BASE + "https%3A%2F%2Fwww.iherb.com%2Fc%2FWeight-Gainers"
CREATINE_PRODUCT = "https://iherb.pxf.io/TYJwGXB"
GAINER_PRODUCT = AFFILIATE_BASE + "https%3A%2F%2Fwww.iherb.com%2Fpr%2Foptimum-nutrition-serious-mass-vanilla-6-lb-2-72-kg%2F66478"
WHEY_PRODUCT = AFFILIATE_BASE + "https%3A%2F%2Fwww.iherb.com%2Fpr%2Foptimum-nutrition-gold-standard-100-whey-protein-double-rich-chocolate-5-05-lb-2-29-kg%2F27509"
ISOLATE_PRODUCT = AFFILIATE_BASE + "https%3A%2F%2Fwww.iherb.com%2Fpr%2Fcalifornia-gold-nutrition-sport-whey-protein-isolate-unflavored-5-lb-2-27-kg%2F76479"
PEA_PRODUCT = AFFILIATE_BASE + "https%3A%2F%2Fwww.iherb.com%2Fpr%2Fnow-foods-sports-pea-protein-pure-unflavored-2-lbs-907-g%2F9858"
BETA_ALANINE_PRODUCT = AFFILIATE_BASE + "https%3A%2F%2Fwww.iherb.com%2Fpr%2Fnow-foods-sports-beta-alanine-pure-powder-17-6-oz-500-g%2F10940"
AFFILIATE_SECTIONS = {
    "creatine-guide": f"""## דוגמה למוצר שעומד בקריטריונים

- [California Gold Nutrition, Sport, קריאטין מונוהידרט טהור, ללא טעם]({CREATINE_PRODUCT}) – קריאטין מונוהידרט בלבד, בלי טעם ובלי תוספות, עם בדיקת צד שלישי.

לפני רכישה כדאי להשוות מחיר לגרם מול אפשרויות אחרות.""",
    "mass-gainer-guide": f"""## אם בכל זאת רוצים גיינר קנוי

- [Optimum Nutrition, Serious Mass]({GAINER_PRODUCT}) – אחד הגיינרים המוכרים בעולם. שימו לב: המנה המלאה גדולה מאוד ויש בה הרבה סוכר, ולכן כדאי להתחיל בחצי מנה ולבדוק את הטבלה התזונתית.

אפשר גם לעבור על [כל הגיינרים ב-iHerb]({GAINER_CATEGORY}) ולהשוות לפי הקריטריונים שלמעלה.""",
    "protein-powder-types-guide": f"""## דוגמאות למוצרים לפי סוג

- **מי גבינה (קונסנטרייט ואיזולט משולבים):** [Optimum Nutrition, Gold Standard 100% Whey]({WHEY_PRODUCT})
- **איזולט:** [California Gold Nutrition, Sport, Whey Protein Isolate, ללא טעם]({ISOLATE_PRODUCT})
- **צמחי:** [NOW Foods, Sports, Pea Protein, ללא טעם]({PEA_PRODUCT}) – חלבון אפונה. כדי לקבל פרופיל חומצות אמינו מלא יותר, אפשר לשלב עם מקורות חלבון נוספים במהלך היום.

לפני רכישה, חשבו מחיר לגרם חלבון לפי הנוסחה שלמעלה.""",
    "gym-supplements-what-works": f"""## דוגמאות למוצרים מהרשימה

- **קריאטין מונוהידרט:** [California Gold Nutrition, Sport, קריאטין מונוהידרט טהור]({CREATINE_PRODUCT})
- **בטא אלנין:** [NOW Foods, Sports, Beta-Alanine, אבקה]({BETA_ALANINE_PRODUCT})""",
}

def affiliate_link(label: str, url: str) -> str:
    return f'<a href="{html.escape(url, quote=True)}" target="_blank" rel="sponsored nofollow noopener">{label}</a>'

def inline(t: str, auto_link_iherb: bool = True, slug: str = "") -> str:
    t = html.escape(t, quote=False)
    t = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", t)
    # Replace plain mentions only outside markdown links, avoiding nested anchors.
    parts, start = [], 0
    for m in re.finditer(r"\[([^\]]+)\](?:\(([^)]+)\))?", t):
        plain = t[start:m.start()]
        parts.append(plain.replace("iHerb", affiliate_link("iHerb", "https://iherb.pxf.io/AgOK61")) if auto_link_iherb else plain)
        label, url = m.group(1), m.group(2)
        if url and url.startswith("AFF:"):
            parts.append(affiliate_link(label, aff_url(url[4:], slug)))
        elif url:
            if not url.startswith("https://iherb.pxf.io/"):
                raise SystemExit(f"unsupported external link: {url}")
            parts.append(affiliate_link(label, html.unescape(url)))
        elif label in LINKS:
            parts.append(f'<a href="{LINKS[label]}">{label}</a>')
        else:
            raise SystemExit(f"unknown internal link: {label}")
        start = m.end()
    plain = t[start:]
    parts.append(plain.replace("iHerb", affiliate_link("iHerb", "https://iherb.pxf.io/AgOK61")) if auto_link_iherb else plain)
    return "".join(parts)

def apply_affiliate_sections(content: str, slug: str) -> str:
    if slug not in AFFILIATE_SECTIONS:
        return content
    category = {"creatine-guide": CREATINE_CATEGORY, "mass-gainer-guide": GAINER_CATEGORY}.get(slug)
    if category:
        content = content.replace(affiliate_link("iHerb", "https://iherb.pxf.io/AgOK61"), affiliate_link("iHerb", category))
    section, _ = convert(AFFILIATE_SECTIONS[slug])
    if section in content:
        return content
    marker = "<h2>השורה התחתונה</h2>"
    if marker in content:
        return content.replace(marker, section + "\n" + marker, 1)
    # The gym guide has no bottom-line section: preserve its text and append before FAQ.
    return content + "\n" + section

def convert(md: str, auto_link_iherb: bool = True, linked_faq: bool = False, slug: str = ""):
    def inline(t):
        return globals()["inline"](t, auto_link_iherb=auto_link_iherb, slug=slug)
    body, _, faq_md = md.partition("## שאלות נפוצות")
    out, lines, i = [], body.strip().split("\n"), 0
    while i < len(lines):
        l = lines[i].rstrip()
        if not l: i += 1; continue
        if l.startswith("### "): out.append(f"<h3>{inline(l[4:])}</h3>"); i += 1; continue
        if l.startswith("## "): out.append(f"<h2>{inline(l[3:])}</h2>"); i += 1; continue
        if l.startswith("|"):
            rows = []
            while i < len(lines) and lines[i].startswith("|"):
                rows.append([c.strip() for c in lines[i].strip().strip("|").split("|")]); i += 1
            head, data = rows[0], [r for r in rows[2:]]
            out.append('<div class="not-prose overflow-x-auto"><table><thead><tr>' + "".join(f"<th>{inline(c)}</th>" for c in head)
                       + "</tr></thead><tbody>" + "".join("<tr>" + "".join(f"<td>{inline(c)}</td>" for c in r) + "</tr>" for r in data) + "</tbody></table></div>")
            continue
        if l.startswith("- "):
            items = []
            while i < len(lines) and lines[i].startswith("- "):
                items.append(f"<li>{inline(lines[i][2:].rstrip())}</li>"); i += 1
            out.append("<ul>" + "".join(items) + "</ul>"); continue
        if re.match(r"\d+\. ", l):
            items = []
            while i < len(lines) and re.match(r"\d+\. ", lines[i]):
                items.append(f"<li>{inline(re.sub(r'^\d+\. ', '', lines[i].rstrip()))}</li>"); i += 1
            out.append("<ol>" + "".join(items) + "</ol>"); continue
        para = []
        while i < len(lines) and lines[i].strip() and not lines[i].startswith(("- ", "|", "## ", "### ")) and not re.match(r"\d+\. ", lines[i]):
            para.append(inline(lines[i].rstrip())); i += 1
        out.append("<p>" + "<br />".join(para) + "</p>")
    faq = []
    for block in [b for b in faq_md.strip().split("\n\n") if b.strip()]:
        q, a = block.strip().split("\n", 1)
        faq.append({"question": q.strip().strip("*").strip(), "answer": inline(a.strip()) if linked_faq else re.sub(r"\[([^\]]+)\]", r"\1", a.strip())})
    return "\n".join(out), faq

def main():
    src = Path(sys.argv[1])
    posts = []
    for m in json.loads((src / "meta.json").read_text()):
        explicit_only = m["slug"] in EXPLICIT_AFFILIATE_ONLY
        content, faq = convert((src / f"{m['slug']}.md").read_text(), auto_link_iherb=not explicit_only, linked_faq=explicit_only, slug=m["slug"])
        content = apply_affiliate_sections(content, m["slug"])
        words = len(re.sub(r"<[^>]+>", " ", content).split())
        posts.append({"id": f"guide-{m['slug']}", "slug": m["slug"], "title": m["title"], "seoTitle": m["seoTitle"],
                      "excerpt": m["excerpt"], "content": content, "image": f"/images/blog/{m['slug']}.jpg",
                      "category": m["category"], "categoryId": m["categoryId"], "date": m.get("date", DATE), "updatedAt": m.get("updatedAt", m.get("date", DATE)),
                      "readTime": max(3, round(words / 200)), "relatedProductHandles": [], "faq": faq,
                      "metaDescription": m["metaDescription"]})
    out = Path("src/data/guidePosts.ts")
    existing = []
    if out.exists():
        mt = re.search(r"= (\[.*\]);", out.read_text(), re.S)
        existing = [p for p in json.loads(mt.group(1)) if p["slug"] not in {x["slug"] for x in posts}] if mt else []
    allp = existing + posts
    for post in allp:
        if post["slug"] not in FURTHER_READING:
            continue
        paragraph = "<p>" + inline(FURTHER_READING[post["slug"]], auto_link_iherb=False) + "</p>"
        if paragraph not in post["content"]:
            marker = "<h2>השורה התחתונה</h2>"
            start = post["content"].index(marker) + len(marker)
            end = post["content"].find("<h2>", start)
            end = len(post["content"]) if end == -1 else end
            post["content"] = post["content"][:end].rstrip() + "\n" + paragraph + post["content"][end:]
    out.write_text("// Generated by scripts/build_guide_posts.py from approved article text. Do not hand-edit content.\n"
                   "import type { ProBlogPost } from './proBlogPosts';\n\n"
                   f"export const GUIDE_POSTS: (ProBlogPost & {{ updatedAt: string }})[] = {json.dumps(allp, ensure_ascii=False, indent=1)};\n")
    print("wrote", [p["slug"] for p in allp])

if __name__ == "__main__":
    main()
