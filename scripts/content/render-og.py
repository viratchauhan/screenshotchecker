"""Render 1200x630 share cards (public/og/<name>.png) in the site's existing card style.

Usage: python scripts/content/render-og.py spec.json <repo-root>
spec.json: [{"name": "blog-some-slug", "label": "GUIDE", "title": "...", "sub": "...", "lang": "en"|"hi"}]
Needs Playwright with Chromium (see HANDOFF.md). Existing cards are skipped unless "force": true.
"""
import html
import json
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

TEMPLATE = """<!doctype html><html lang="{lang}"><head><meta charset="utf-8"><style>
*{{box-sizing:border-box;margin:0;padding:0}}
body{{width:1200px;height:630px;background:#faf8f4;font-family:{font};color:#141413;position:relative;overflow:hidden}}
.bar{{position:absolute;top:0;left:0;right:0;height:12px;background:#cc7a5c}}
.wrap{{position:absolute;left:80px;right:80px;top:72px}}
.brand{{font-size:26px;font-weight:700;letter-spacing:.02em;color:#6b6862}}
.pill{{display:inline-block;margin-top:24px;background:#b0583e;color:#fff;font-weight:700;font-size:24px;padding:8px 20px;border-radius:999px}}
h1{{margin-top:34px;font-size:{size}px;line-height:1.12;font-weight:800;letter-spacing:-.01em;max-width:1000px}}
p{{margin-top:22px;font-size:30px;color:#3d3b37;max-width:1000px}}
.foot{{position:absolute;left:80px;right:80px;bottom:30px;display:flex;justify-content:space-between;align-items:baseline}}
.site{{font-size:28px;font-weight:700}}
.tag{{font-size:24px;color:#6b6862}}
</style></head><body><div class="bar"></div><div class="wrap">
<div class="brand">SCREENSHOTCHECKER</div><div class="pill">{label}</div>
<h1>{title}</h1><p>{sub}</p></div>
<div class="foot"><div class="site">screenshotchecker.com</div><div class="tag">{tag}</div></div></body></html>"""


def main() -> None:
    spec = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    root = Path(sys.argv[2])
    out_dir = root / "public" / "og"
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1200, "height": 630})
        for card in spec:
            out = out_dir / f"{card['name']}.png"
            if out.exists() and not card.get("force"):
                print("skip", out.name)
                continue
            hindi = card.get("lang") == "hi"
            title = card["title"]
            size = 72 if len(title) <= 40 else 62 if len(title) <= 60 else 54
            page.set_content(TEMPLATE.format(
                lang="hi" if hindi else "en",
                font="'Nirmala UI','Noto Sans Devanagari','Segoe UI',Inter,Arial,sans-serif" if hindi else "Inter,'Segoe UI',Arial,sans-serif",
                size=size,
                label=html.escape(card.get("label", "GUIDE")),
                title=html.escape(title),
                sub=html.escape(card.get("sub", "")),
                tag="मुफ़्त · आपके ब्राउज़र में · बिना साइनअप" if hindi else "Free · in your browser · no signup",
            ))
            page.screenshot(path=str(out))
            print("wrote", out.name)
        browser.close()


if __name__ == "__main__":
    main()
