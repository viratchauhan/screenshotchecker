// usage: node scripts/content/insert-articles.cjs new-articles.json . "existingSlug>newSlug,..." "llms.txt line to insert after|||new lines"
// Appends articles (BlogArticle JSON) to src/data/blogArticles.ts, adds the new slug to existing guides relatedSlugs, and adds lines to public/llms.txt.
const fs=require('fs'),path=require('path');
const [,,file,repo,rel,llms]=process.argv;const arts=JSON.parse(fs.readFileSync(file,'utf8'));
const blog=path.join(repo,'src/data/blogArticles.ts');let b=fs.readFileSync(blog,'utf8').replace(/\r\n/g,'\n');
for(const a of arts) if(b.includes(`"slug": "${a.slug}"`)) throw new Error('exists '+a.slug);
const close='\n];\n\nexport function getAllArticles';b=b.replace(close,'\n'+arts.map(a=>'  '+JSON.stringify(a,null,2).split('\n').join('\n  ')+',').join('\n')+close);
for(const pair of (rel||'').split(',').filter(Boolean)){const [slug,n]=pair.split('>');let s=b.indexOf(`"slug": "${slug}"`);if(s<0)s=b.indexOf(`slug: '${slug}'`);if(s<0)throw new Error(slug);const o=b.indexOf('[',b.indexOf('elatedSlugs',s));b=b.slice(0,o+1)+`"${n}", `+b.slice(o+1);}
fs.writeFileSync(blog,b);
if(llms){const [after,add]=llms.split('|||');const l=path.join(repo,'public/llms.txt');let t=fs.readFileSync(l,'utf8');const i=t.indexOf(after);if(i<0)throw new Error('llms');const e=t.indexOf('\n',i);t=t.slice(0,e)+'\n'+add.replace(/\n/g,'\n')+t.slice(e);fs.writeFileSync(l,t);}
console.log('ok');
