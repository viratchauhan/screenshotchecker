"""Read-only checks of built HTML and public website endpoints."""
import concurrent.futures, json, pathlib, urllib.request, urllib.error, re
from html.parser import HTMLParser

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / 'audit'
OUT.mkdir(exist_ok=True)
class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.links=[]; self.h1=0; self.title=''; self.in_title=False; self.canonical=''; self.description=''
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if tag=='a': self.links.append(a.get('href',''))
        if tag=='h1': self.h1+=1
        if tag=='title': self.in_title=True
        if tag=='link' and a.get('rel')=='canonical': self.canonical=a.get('href','')
        if tag=='meta' and a.get('name')=='description': self.description=a.get('content','')
    def handle_endtag(self,tag):
        if tag=='title': self.in_title=False
    def handle_data(self,data):
        if self.in_title: self.title+=data

pages=[]; paths=set(['/robots.txt','/sitemap.xml','/sitemap-index.xml','/sitemap-0.xml','/api/health','/urldataIndex/manifest.json','/audit-nonexistent-20260922'])
for f in (ROOT/'dist').rglob('*.html'):
    rel=f.relative_to(ROOT/'dist').as_posix(); route='/'+rel.removesuffix('index.html')
    p=Page(); p.feed(f.read_text(encoding='utf-8')); broken=[]
    for link in p.links:
        if link.startswith('/') and not link.startswith('//'):
            target=link.split('#')[0].split('?')[0].strip('/')
            if not target: continue
            candidates=[ROOT/'dist'/target, ROOT/'dist'/target/'index.html', ROOT/'dist'/(target+'.html')]
            if not any(x.exists() for x in candidates): broken.append(link)
    pages.append(dict(route=route,title=p.title,description=p.description,h1=p.h1,canonical=p.canonical,bytes=f.stat().st_size,broken_links=sorted(set(broken))))
    paths.add(route)

def fetch(route):
    url='https://screenshotchecker.com'+route
    req=urllib.request.Request(url,headers={'User-Agent':'ScreenshotChecker-owner-audit/1.0'})
    try:
        res=urllib.request.urlopen(req,timeout=30)
    except urllib.error.HTTPError as e: res=e
    except Exception as e: return dict(route=route,error=str(e))
    body=res.read(); headers=dict(res.headers)
    result=dict(route=route,status=res.status,final_url=res.url,headers=headers,bytes=len(body))
    if 'text/html' in res.headers.get('Content-Type',''):
        p=Page(); p.feed(body.decode('utf-8',errors='replace')); result.update(title=p.title,h1=p.h1,canonical=p.canonical,description=p.description)
    elif len(body)<3000: result['body']=body.decode('utf-8',errors='replace')
    return result
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool: live=list(pool.map(fetch,sorted(paths)))
result=dict(built_pages=pages,live=live)
(OUT/'site-checks.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
print(json.dumps(dict(pages=len(pages),broken=[p for p in pages if p['broken_links']],h1_issues=[(p['route'],p['h1']) for p in pages if p['h1']!=1],live=[{k:v for k,v in r.items() if k in ['route','status','error','final_url']} for r in live]),indent=2))
