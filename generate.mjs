import { readFileSync, writeFileSync } from 'node:fs';
const papers=JSON.parse(readFileSync(new URL('./publications.json',import.meta.url),'utf8'));
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const mine='Mohsen Nayebi Kerdabadi';
const authors=p=>p.authors?p.authors.map(a=>a===mine?`<strong>${escape(a)}</strong>`:escape(a)).join(', '):'';
const links=p=>`<div class="paper-links">${[['paper','Paper'],['code','Code'],['slides','Slides'],['poster','Poster']].filter(([k])=>p[k]).map(([k,label])=>`<a href="${escape(p[k])}" target="_blank" rel="noopener" aria-label="${label}: ${escape(p.name||p.title)}">${label}</a>`).join('')}</div>`;
const first=['refine','medco','linko','reta','reprompt'].map(id=>papers.find(p=>p.id===id));
const additionalFeatured=[];
const featured=`<div class="selected-list">${first.map(p=>`<article class="selected-paper"><h3>${escape(p.title)}</h3><p class="pub-authors">${authors(p)}</p><p class="paper-meta">${escape(p.venue)}${p.status==='Accepted'?' · Accepted':''}</p><p class="paper-summary">${escape(p.summary)}</p>${links(p)}</article>`).join('')}</div>`;
const additionalCards='';
const entry=p=>`<article class="pub-entry" id="pub-${p.id}"><h3>${escape(p.title)}</h3>${p.authors?.length?`<p class="pub-authors">${authors(p)}</p>`:''}<div class="pub-bottom"><p class="pub-venue">${escape(p.venue)}${p.status==='Accepted'||(p.status==='Under review'&&p.venue!=='Manuscript under review')?` <span class="pub-status ${p.status==='Under review'?'review':''}">${escape(p.status)}</span>`:''}</p>${links(p)}</div></article>`;
const groups=['2026','2025','2024','2023','Journal article'];
const publications=groups.map(year=>`<div class="pub-year-group"><h3 class="pub-year">${year}</h3><div>${papers.filter(p=>p.year===year).map(entry).join('')}</div></div>`).join('');
let html=readFileSync(new URL('./index.html',import.meta.url),'utf8');
for(const [id,content] of [['featured-papers',featured+additionalCards],['publication-list',publications]]){
 const re=new RegExp(`(<div id="${id}">)[\\s\\S]*?(<!-- end-${id} -->|</div>)`);
 // Explicit end markers make regeneration safe after the first build.
 const marker=`<!-- end-${id} -->`;
 if(html.includes(marker)){const start=html.indexOf(`<div id="${id}">`);const end=html.indexOf(marker,start)+marker.length;html=html.slice(0,start)+`<div id="${id}">${content}</div>${marker}`+html.slice(end)}
 else html=html.replace(`<div id="${id}"></div>`,`<div id="${id}">${content}</div>${marker}`);
}
writeFileSync(new URL('./index.html',import.meta.url),html);
console.log(`Generated ${papers.length} publication records and ${first.length+additionalFeatured.length} featured papers.`);
