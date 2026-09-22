import asyncio, json, os, sys
from playwright.async_api import async_playwright

OUT_DIR = sys.argv[1] if len(sys.argv) > 1 else "public/social/carousel_3"
SPEC_PATH = sys.argv[2] if len(sys.argv) > 2 else "/tmp/browser/slides/spec.json"

TEMPLATE = """
<!doctype html><html dir="rtl"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;700;900&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1080px;font-family:Heebo,sans-serif;overflow:hidden}
.slide{position:relative;width:1080px;height:1080px;display:flex;flex-direction:column;justify-content:flex-end}
.bg{position:absolute;inset:0;background-size:cover;background-position:center}
.scrim{position:absolute;inset:0;background:linear-gradient(180deg,rgba(2,6,23,.55) 0%,rgba(2,6,23,.82) 45%,rgba(2,6,23,.95) 100%)}
.content{position:relative;padding:70px 64px 150px;text-align:right}
.tag{display:inline-block;background:#10B981;color:#04170f;font-weight:900;font-size:38px;padding:12px 30px;border-radius:999px;margin-bottom:34px}
h1{color:#fff;font-weight:900;font-size:96px;line-height:1.05;letter-spacing:-2px;text-shadow:0 6px 30px rgba(0,0,0,.6)}
h1 em{font-style:normal;color:#F59E0B}
p.sub{color:#e2e8f0;font-weight:700;font-size:48px;line-height:1.25;margin-top:34px}
ul{list-style:none;margin-top:38px}
li{color:#fff;font-weight:700;font-size:50px;line-height:1.25;background:rgba(255,255,255,.08);border:2px solid rgba(16,185,129,.45);
border-radius:26px;padding:24px 30px;margin-bottom:20px;display:flex;gap:20px;align-items:center}
li b{color:#34d399;font-weight:900;font-size:54px}
.cta{margin-top:34px;background:#F59E0B;color:#1a1204;font-weight:900;font-size:52px;border-radius:26px;padding:28px 32px;text-align:center}
.footer{position:absolute;bottom:0;right:0;left:0;padding:38px 64px;display:flex;justify-content:space-between;align-items:center;
border-top:2px solid rgba(255,255,255,.18)}
.footer .brand{color:#94a3b8;font-weight:700;font-size:34px;direction:ltr}
.footer .swipe{color:#34d399;font-weight:900;font-size:36px}
</style></head><body>
<div class="slide">
  <div class="bg" style="background-image:url('__BG__')"></div>
  <div class="scrim"></div>
  <div class="content">__BODY__</div>
  <div class="footer"><span class="swipe">__SWIPE__</span><span class="brand">FullBody.co.il</span></div>
</div></body></html>
"""


async def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    spec = json.load(open(SPEC_PATH, encoding="utf-8"))
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        ctx = await browser.new_context(viewport={"width": 1080, "height": 1080}, device_scale_factor=1)
        page = await ctx.new_page()
        for i, s in enumerate(spec, start=1):
            html = TEMPLATE.replace("__BG__", "file://" + os.path.abspath(s["bg"]))
            html = html.replace("__BODY__", s["body"]).replace("__SWIPE__", s.get("swipe", ""))
            path = f"/tmp/browser/slides/slide_{i}.html"
            os.makedirs(os.path.dirname(path), exist_ok=True)
            open(path, "w", encoding="utf-8").write(html)
            await page.goto("file://" + path, wait_until="load")
            await page.wait_for_timeout(1200)
            await page.screenshot(path=os.path.join(OUT_DIR, f"slide_{i}.jpg"), type="jpeg", quality=92)
            print("rendered", i)
        await browser.close()

asyncio.run(main())
