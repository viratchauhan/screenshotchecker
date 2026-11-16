"""Render fictional annotated example figures for ScreenshotChecker guides.

usage: python scripts/content/render-figures.py scripts/content/figure-specs/<batch>.json . [slug ...]
Writes public/images/blog/<slug>/fictional-example.png (1200x760).
"""
import html, json, sys
from pathlib import Path
from playwright.sync_api import sync_playwright

W, H = 1200, 760
CSS = """
*{box-sizing:border-box;margin:0;padding:0}
body{width:1200px;height:760px;background:#faf9f5;font-family:'Inter','Segoe UI','Nirmala UI',Arial,sans-serif;color:#141413;overflow:hidden}
.banner{height:56px;background:#141413;color:#faf9f5;display:flex;align-items:center;justify-content:space-between;padding:0 36px;font-size:19px;letter-spacing:.06em;text-transform:uppercase;font-weight:600}
.banner span:last-child{color:#e8b4a0;text-transform:none;letter-spacing:0;font-weight:500}
.wrap{display:flex;gap:44px;padding:34px 40px 0 56px}
.phone{width:470px;height:640px;border:3px solid #141413;border-radius:38px;background:#fff;overflow:hidden;flex-shrink:0;position:relative}
.phone .top{background:#efece4;padding:22px 26px 16px;border-bottom:1px solid #ddd6c8}
.phone .title{font-size:24px;font-weight:700;word-break:break-all}
.phone .sub{font-size:16px;color:#6b665c;margin-top:4px;word-break:break-all}
.phone .body{padding:20px 22px;display:flex;flex-direction:column;gap:14px}
.blk{position:relative;padding-right:46px}
.bubble{background:#f1eee7;border-radius:18px 18px 18px 4px;padding:13px 16px;font-size:19px;line-height:1.38;max-width:100%}
.bubble.out{background:#dcefe2;border-radius:18px 18px 4px 18px;margin-left:60px}
.bubble.link{color:#1a5fb4;text-decoration:underline;word-break:break-all}
.big{text-align:center;padding:18px 0 10px}
.big .t{font-size:38px;font-weight:700;color:#1d7a46}
.big.bad .t{color:#c0392b}
.big .s{font-size:19px;color:#4a463e;margin-top:6px}
.row{display:flex;justify-content:space-between;gap:14px;border-bottom:1px solid #ece7dd;padding:10px 2px;font-size:18px}
.row .k{color:#6b665c;flex-shrink:0;max-width:52%;word-break:break-all;font-family:'JetBrains Mono',Consolas,monospace;font-size:16px}
.row .v{text-align:right;font-weight:600}
.note{background:#fdf1ec;border:2px dashed #cc785c;border-radius:12px;padding:12px 14px;font-size:18px;font-weight:600;color:#7a3a22}
.code{font-family:'JetBrains Mono',Consolas,monospace;font-size:17px;background:#141413;color:#faf9f5;border-radius:10px;padding:14px;word-break:break-all;line-height:1.45}
.badge{position:absolute;right:0;top:50%;transform:translateY(-50%);width:36px;height:36px;border-radius:50%;background:#c0392b;color:#fff;font-weight:700;font-size:20px;display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 3px #fff}
.side{flex:1;padding-top:8px}
.side h2{font-family:'Cormorant Garamond',Georgia,serif;font-weight:500;font-size:40px;margin-bottom:22px}
.side ol{list-style:none;display:flex;flex-direction:column;gap:18px}
.side li{display:flex;gap:16px;font-size:23px;line-height:1.36}
.side li .n{width:36px;height:36px;border-radius:50%;background:#c0392b;color:#fff;font-weight:700;font-size:20px;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px}
.side li.tip .n{background:#1d7a46}
"""


def block_html(b):
    e = html.escape
    t = b["type"]
    if t == "bubble":
        cls = "bubble" + (" out" if b.get("side") == "out" else "") + (" link" if b.get("link") else "")
        inner = f'<div class="{cls}">{e(b["text"])}</div>'
    elif t == "big":
        inner = f'<div class="big{" bad" if b.get("tone") == "bad" else ""}"><div class="t">{e(b["text"])}</div><div class="s">{e(b.get("sub", ""))}</div></div>'
    elif t == "row":
        inner = f'<div class="row"><span class="k">{e(b["k"])}</span><span class="v">{e(b["v"])}</span></div>'
    elif t == "note":
        inner = f'<div class="note">{e(b["text"])}</div>'
    elif t == "code":
        inner = f'<div class="code">{e(b["text"])}</div>'
    else:
        raise ValueError(t)
    badge = f'<span class="badge">{b["badge"]}</span>' if b.get("badge") else ""
    return f'<div class="blk">{inner}{badge}</div>'


def page(spec):
    badges = {b["badge"] for b in spec["blocks"] if b.get("badge")}
    items = []
    for i, text in enumerate(spec["callouts"], 1):
        tip = i not in badges
        items.append(f'<li class="{"tip" if tip else ""}"><span class="n">{"→" if tip else i}</span><span>{html.escape(text)}</span></li>')
    left, right = spec.get("banner", "Fictional example · ScreenshotChecker").split(" · ", 1)
    return f"""<!doctype html><html lang="{spec.get('lang', 'en')}"><head><meta charset="utf-8"><style>{CSS}</style></head><body>
<div class="banner"><span>{html.escape(left)}</span><span>{html.escape(right)}</span></div>
<div class="wrap">
  <div class="phone"><div class="top"><div class="title">{html.escape(spec['app'])}</div><div class="sub">{html.escape(spec['sub'])}</div></div>
  <div class="body">{''.join(block_html(b) for b in spec['blocks'])}</div></div>
  <div class="side"><h2>{html.escape(spec.get('callout_title', 'What to check'))}</h2><ol>{''.join(items)}</ol></div>
</div></body></html>"""


def main():
    specs = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    repo = Path(sys.argv[2])
    only = set(sys.argv[3:])
    with sync_playwright() as p:
        browser = p.chromium.launch()
        pg = browser.new_page(viewport={"width": W, "height": H}, device_scale_factor=1)
        for spec in specs:
            if only and spec["slug"] not in only:
                continue
            out = repo / "public" / "images" / "blog" / spec["slug"] / "fictional-example.png"
            out.parent.mkdir(parents=True, exist_ok=True)
            pg.set_content(page(spec))
            overflow = pg.evaluate("() => [...document.querySelectorAll('.phone .body, .side')].some(el => el.scrollHeight > el.clientHeight + 2 || el.getBoundingClientRect().bottom > 760)")
            pg.screenshot(path=str(out), full_page=False)
            print(("OVERFLOW " if overflow else "ok ") + str(out.relative_to(repo)), out.stat().st_size // 1024, "KB")
        browser.close()


if __name__ == "__main__":
    main()
