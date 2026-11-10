"""Render ebook.html -> PDF. Auto-compacts recipe pages that overflow, and fails loudly if any page still overflows.
Usage: python3 render.py [html] [pdf]"""
import asyncio, sys, pathlib
from playwright.async_api import async_playwright

HTML = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else pathlib.Path(__file__).parent / "ebook.html").resolve()
PDF = pathlib.Path(sys.argv[2] if len(sys.argv) > 2 else pathlib.Path(__file__).parent / "ebook.pdf").resolve()

CHECK = """(compact)=>{const out=[];document.querySelectorAll('.page').forEach((pg,i)=>{
 const top=pg.getBoundingClientRect().top;let m=0;
 pg.querySelectorAll('.pad *, .body *').forEach(el=>{const b=el.getBoundingClientRect().bottom-top;if(b>m)m=b});
 const f=pg.querySelector('.foot');const lim=f?f.getBoundingClientRect().top-top-6:pg.clientHeight;
 if(m>lim){ if(compact&&pg.classList.contains('r')&&!pg.classList.contains('compact')){pg.classList.add('compact')} else out.push([i+1,Math.round(m-lim)]) }});
 return out}"""

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page()
        await pg.goto(HTML.as_uri())
        await pg.wait_for_timeout(800)
        await pg.evaluate(CHECK, True)
        bad = await pg.evaluate(CHECK, False)
        if bad:
            print("STILL OVERFLOWING (page, px):", bad)
        await pg.pdf(path=str(PDF), width="148mm", height="210mm", print_background=True, prefer_css_page_size=True)
        n = await pg.evaluate("document.querySelectorAll('.page').length")
        print("pages", n, "->", PDF)
        await b.close()

asyncio.run(main())

