"""UPI fraud chart for /blog/scam-statistics/. usage: python scripts/content/render-upi-chart.py .  (update DATA when new official figures are published)"""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

DATA = [("FY 2021-22", 4.07, 242), ("FY 2022-23", 7.25, 573), ("FY 2023-24", 13.42, 1087), ("FY 2024-25", 12.64, 981)]
MAXV = 1200
bars = ""
for label, cases, amt in DATA:
    h = amt / MAXV * 400
    bars += f"""<div class="col"><div class="val">₹{amt:,} cr</div><div class="bar" style="height:{h:.0f}px"></div>
    <div class="lab">{label}</div><div class="cases">{cases} lakh cases</div></div>"""
HTML = f"""<!doctype html><html><head><meta charset="utf-8"><style>
*{{box-sizing:border-box;margin:0;padding:0}}
body{{width:1200px;height:760px;background:#faf9f5;font-family:'Inter','Segoe UI',Arial,sans-serif;color:#141413}}
.banner{{height:56px;background:#141413;color:#faf9f5;display:flex;align-items:center;justify-content:space-between;padding:0 36px;font-size:19px;letter-spacing:.06em;text-transform:uppercase;font-weight:600}}
.banner span:last-child{{color:#e8b4a0;text-transform:none;letter-spacing:0;font-weight:500}}
h2{{font-family:'Cormorant Garamond',Georgia,serif;font-weight:500;font-size:40px;padding:26px 56px 0}}
.sub{{padding:6px 56px 0;font-size:19px;color:#4a463e}}
.chart{{display:flex;align-items:flex-end;gap:70px;height:535px;padding:0 100px 0 120px;border-bottom:0}}
.col{{display:flex;flex-direction:column;align-items:center;width:170px}}
.bar{{width:120px;background:#cc785c;border-radius:10px 10px 0 0}}
.col:nth-child(3) .bar{{background:#c0392b}}
.val{{font-size:24px;font-weight:700;margin-bottom:10px}}
.lab{{font-size:20px;font-weight:600;margin-top:14px;border-top:3px solid #141413;padding-top:10px;width:170px;text-align:center}}
.cases{{font-size:18px;color:#4a463e;margin-top:4px}}
.src{{position:absolute;bottom:18px;left:56px;font-size:15px;color:#6b665c}}
</style></head><body>
<div class="banner"><span>UPI fraud in India</span><span>ScreenshotChecker</span></div>
<h2>Reported UPI fraud: amount and cases by year</h2>
<div class="sub">Peaked in FY 2023-24, slightly lower in FY 2024-25</div>
<div class="chart">{bars}</div>
<div class="src">Source: Ministry of Finance reply in the Lok Sabha, 15 December 2025. cr = crore.</div>
</body></html>"""
out = Path(sys.argv[1]) / "public/images/blog/scam-statistics/upi-fraud-by-year.png"
out.parent.mkdir(parents=True, exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 1200, "height": 760})
    pg.set_content(HTML)
    pg.screenshot(path=str(out))
    b.close()
print(out, out.stat().st_size // 1024, "KB")
