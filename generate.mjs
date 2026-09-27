import { readFileSync, writeFileSync } from 'node:fs';
const papers=JSON.parse(readFileSync(new URL('./publications.json',import.meta.url),'utf8'));
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const mine='Mohsen Nayebi Kerdabadi';
const authors=p=>p.authors?p.authors.map(a=>a===mine?`<strong>${escape(a)}</strong>`:escape(a)).join(', '):'';
const links=p=>`<div class="paper-links">${[['paper','Paper'],['code','Code'],['slides','Slides'],['poster','Poster']].filter(([k])=>p[k]).map(([k,label])=>`<a href="${escape(p[k])}" target="_blank" rel="noopener" aria-label="${label}: ${escape(p.name||p.title)}">${label} ↗</a>`).join('')}</div>`;
function diagram(id){
 const start='<svg viewBox="0 0 310 145" role="img" xmlns="http://www.w3.org/2000/svg"';
 const text=(x,y,s)=>`<text x="${x}" y="${y}" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" fill="#234656">${s}</text>`;
 const box=(x,y,w,h)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="#fff" stroke="#91b9b2"/>`;
 const line=(x,y,a,b)=>`<path d="M${x},${y} L${a},${b}" stroke="#6b9d93" stroke-width="1.4" fill="none"/>`;
 const dot=(x,y)=>`<circle cx="${x}" cy="${y}" r="5" fill="#137f72"/>`;
 if(id==='refine')return start+' aria-label="REFINE: patient history guides budgeted knowledge retrieval, followed by GNN and LLM encoding"><title>REFINE method overview</title>'+box(6,49,70,44)+text(41,67,'Patient')+text(41,82,'history')+line(76,71,113,71)+box(113,43,87,57)+text(156,65,'RL-budgeted')+text(156,81,'KG retrieval')+line(200,71,218,71)+line(218,38,218,106)+line(218,38,239,38)+line(218,106,239,106)+box(239,20,63,35)+text(271,42,'GNN')+box(239,88,63,35)+text(271,110,'LLM')+text(155,134,'Patient-personalized representations')+'</svg>';
 if(id==='medco')return start+' aria-label="MedCo: LLM-enriched node and edge text combines with a heterogeneous graph"><title>MedCo method overview</title>'+line(52,35,110,72)+line(52,111,110,72)+line(110,72,157,35)+line(110,72,157,111)+line(157,35,157,111)+[dot(52,35),dot(52,111),dot(110,72),dot(157,35),dot(157,111)].join('')+box(5,55,75,28)+text(42,73,'Clinical text')+line(170,72,208,72)+box(208,19,95,40)+text(255,44,'LoRA + LLM')+box(208,88,95,40)+text(255,113,'Hetero. GNN')+text(111,139,'Text-attributed knowledge graph')+'</svg>';
 return start+' aria-label="LINKO: vertical propagation within ontologies and horizontal propagation across diseases, drugs and procedures"><title>LINKO dual-axis propagation</title>'+text(52,17,'Diseases')+text(155,17,'Drugs')+text(258,17,'Procedures')+[52,155,258].map(x=>line(x,41,x,110)).join('')+[41,75,110].map(y=>line(52,y,258,y)).join('')+[52,155,258].flatMap(x=>[41,75,110].map(y=>dot(x,y))).join('')+text(155,139,'Within-ontology + cross-ontology learning')+'</svg>';
}
const first=['refine','medco','linko'].map(id=>papers.find(p=>p.id===id));
const featured=`<div class="featured-grid">${first.map(p=>`<article class="paper-card"><div class="paper-visual">${diagram(p.id)}</div><div class="paper-body"><p class="paper-meta">${escape(p.venue.split(' · ')[0])} · FIRST AUTHOR${p.status==='Accepted'?' · ACCEPTED':''}</p><h3>${escape(p.name)}</h3><p class="paper-title">${escape(p.title.replace(p.name+': ',''))}</p><p class="paper-summary">${escape(p.summary)}</p>${links(p)}</div></article>`).join('')}</div>`;
const additionalFeatured=['reta','reprompt'].map(id=>papers.find(p=>p.id===id));
const additionalCards=`<div class="collab-grid additional-featured">${additionalFeatured.map(p=>`<article class="collab-card"><p class="paper-meta">${escape(p.venue)} · ${p.authors.indexOf(mine)===1?'2ND':'3RD'} AUTHOR${p.status==='Accepted'?' · ACCEPTED':''}</p><h3>${escape(p.name)}</h3><p class="paper-title">${escape(p.title)}</p><p class="paper-summary">${escape(p.summary)}</p>${links(p)}</article>`).join('')}</div>`;
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
