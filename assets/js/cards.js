import{loadRepository,esc,norm,actorClaim,evidenceHtml,citationLinks,label}from'./data-loader.js?v=amiens-20261110';
import { initEvolution } from './evolution.js?v=amiens-20261110';
const d=await loadRepository();
const elements={title:document.getElementById('title'),subtitle:document.getElementById('subtitle'),notice:document.getElementById('notice'),categories:document.getElementById('categories'),stances:document.getElementById('stances'),count:document.getElementById('count'),grid:document.getElementById('grid'),search:document.getElementById('search'),reset:document.getElementById('reset'),detail:document.getElementById('detail'),dialog:document.getElementById('dialog')};
let cat='all',stance='all',q='';
elements.title.textContent=d.meta.title;elements.subtitle.textContent=d.meta.subtitle;elements.notice.textContent=d.meta.data_notice;
const stanceColor=s=>d.taxonomy.stances[s]?.color||'#64748b';
const allCards=()=>d.actors.filter(a=>a.id!==d.meta.id&&a.display_in_cards!==false&&actorClaim(d,a.id));
function filters(){
 const categories=[...Object.entries(d.taxonomy.categories)].filter(([k])=>k==='all'||allCards().some(a=>a.categories.includes(k)));
 elements.categories.innerHTML=categories.map(([k,v])=>'<button class="filter '+(cat===k?'active':'')+'" data-cat="'+esc(k)+'"><span>'+esc(v.label)+'</span><b>'+(k==='all'?allCards().length:allCards().filter(a=>a.categories.includes(k)).length)+'</b></button>').join('');
 elements.stances.innerHTML=Object.entries(d.taxonomy.stances).map(([k,v])=>'<button class="filter '+(stance===k?'active':'')+'" data-stance="'+esc(k)+'"><span>'+esc(v.label)+'</span><b>'+(k==='all'?d.claims.length:d.claims.filter(c=>c.value===k).length)+'</b></button>').join('');
}
function render(){
 const list=allCards().filter(a=>{const c=actorClaim(d,a.id);const full=norm([a.name,a.description,c?.summary,...(c?.evidence_ids||[]).map(id=>d.evidenceById.get(id)?.text)].join(' '));return(cat==='all'||a.categories.includes(cat))&&(stance==='all'||c?.value===stance)&&(!q||full.includes(q))});
 elements.count.textContent=list.length+' acteurs affichés sur '+allCards().length;
 elements.grid.innerHTML=list.map(a=>{const c=actorClaim(d,a.id);return '<article class="card" data-id="'+esc(a.id)+'" style="--stance:'+stanceColor(c?.value)+'"><h3>'+esc(a.name)+'</h3><div class="role">'+esc(a.description)+'</div><p class="position">'+esc(c?.summary||'Position propre à ce projet non documentée')+'</p><div class="footer"><span class="badge">'+esc(c?label(d,c.value):'Non qualifié')+'</span><span>Certitude : '+esc(d.taxonomy.certainty_levels[c?.certainty]?.label||'Non qualifiée')+'</span></div></article>'}).join('');
}
function open(id){
 const a=d.actorById.get(id);if(!a)return;
 const c=actorClaim(d,id),rels=d.relations.filter(x=>x.source_id===id||x.target_id===id);
 elements.detail.innerHTML='<h2>'+esc(a.name)+'</h2><p class="role">'+esc(a.description)+'</p><h3>Position</h3><p>'+esc(c?.summary||'Aucune prise de position propre établie pour ce projet.')+'</p><p><b>Certitude :</b> '+esc(d.taxonomy.certainty_levels[c?.certainty]?.label||'Non qualifiée')+'</p><h3>Preuves et sources</h3>'+evidenceHtml(d,c?.evidence_ids||[])+'<h3>Relations documentées ('+rels.length+')</h3>'+(rels.length?rels.map(r=>{const other=d.actorById.get(r.source_id===id?r.target_id:r.source_id);return '<div class="relation"><button data-open="'+esc(other?.id||'')+'">'+esc(other?.name||'Inconnu')+'</button><div><b>'+esc(d.taxonomy.relation_types[r.type]?.label||r.type)+'</b></div><p>'+esc(r.summary)+'</p><small>Certitude : '+esc(d.taxonomy.certainty_levels[r.certainty]?.label||r.certainty)+' · '+r.evidence_ids.length+' preuve(s)</small><div class="source-citations">'+citationLinks(d,r.evidence_ids)+'</div></div>'}).join(''):'<p class="muted">Aucune relation.</p>');
 if(!elements.dialog.open)elements.dialog.showModal();
}
document.addEventListener('click',event=>{
 const c=event.target.closest('[data-cat]'),s=event.target.closest('[data-stance]'),card=event.target.closest('[data-id]'),op=event.target.closest('[data-open]');
 if(c){cat=c.dataset.cat;filters();render()}if(s){stance=s.dataset.stance;filters();render()}
 if(card){open(card.dataset.id)}if(op){open(op.dataset.open)}
});
elements.search.addEventListener('input',event=>{q=norm(event.target.value);render()});
elements.reset.addEventListener('click',()=>{cat='all';stance='all';q='';elements.search.value='';filters();render()});
document.querySelector('.close').addEventListener('click',()=>elements.dialog.close());
elements.dialog.addEventListener('click',event=>{if(event.target===elements.dialog)elements.dialog.close()});
filters();render();
const supplement=ids=>{const v=citationLinks(d,ids||[],true);return v?'<div class="source-citations"><b>Sources :</b> '+v+'</div>':''};

const documentaryDetail=ids=>{
 if(!ids?.length)return '';
 return '<details class="synth-proofs"><summary>Consulter les preuves documentaires ('+ids.length+')</summary>'+ids.map(id=>{
  const item=d.evidenceById.get(id);
  return item?'<div class="synth-proof"><p>'+esc(item.text)+'</p><small>'+citationLinks(d,[id],false)+'</small></div>':'';
 }).join('')+'</details>';
};
const intro=document.getElementById('opposition-intro');
intro.innerHTML='<h2>État des oppositions et positions critiques</h2><p>'+esc(d.synthesis.intro||'')+'</p><p class="muted">Les oppositions au tracé et les demandes d’indemnisation agricole sont distinguées. Les annonces de recours, études et travaux ne valent pas procédures ou impacts déjà constatés.</p>'+supplement(d.synthesis.opposition_status?.evidence_ids);

document.getElementById('griefGrid').innerHTML=d.synthesis.griefs.map(g=>'<article class="griefCard"><h2>'+esc(g.title)+'</h2><p>'+esc(g.text)+'</p>'+'<p class="synth-qualification">'+esc(g.qualification||'')+'</p>'+supplement(g.evidence_ids)+documentaryDetail(g.evidence_ids)+'</article>').join('');
document.getElementById('vigilance').innerHTML=d.synthesis.vigilance.map(v=>'<li><b>'+esc(v.title)+'</b><p>'+esc(v.text)+'</p>'+supplement(v.evidence_ids)+'</li>').join('');
document.getElementById('sources').innerHTML=d.sources.filter(s=>s.url).map(s=>'<li><a href="'+esc(s.url)+'" rel="noopener noreferrer" target="_blank">'+esc(s.publisher)+' — '+esc(s.title)+'</a> <small class="muted">('+esc(s.published_at||'date inconnue')+' ; '+esc(s.verification||s.status||'origine signalée')+')</small></li>').join('');
document.querySelectorAll('[data-tab]').forEach(b=>b.addEventListener('click',()=>{
 document.querySelectorAll('[data-tab]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-selected',String(x===b))});
 document.querySelectorAll('.tab-pane').forEach(x=>x.classList.toggle('active',x.id==='tab-'+b.dataset.tab))
}));
const period=m=>m.period_precision==='year'?m.date.slice(0,4):m.period_precision==='month'?m.date.slice(0,7):m.date;
const chronoType=m=>m.status==='forecast'?(m.date<'2026-11'?'ANNONCE ANTICIPÉE, NON CONFIRMÉE':'PRÉVISION'):m.status==='reported'?'HYPOTHÈSE RAPPORTÉE':m.status==='documented_regional_position'?'CRITIQUE RÉGIONALE':'ÉTAPE DOCUMENTÉE';
document.getElementById('timelineGrid').innerHTML=d.content.milestones.map(m=>'<article class="griefCard '+(m.status==='forecast'?'chrono-forecast':'')+'"><div class="chrono-date">'+esc(period(m))+' · '+chronoType(m)+'</div><h2>'+esc(m.title)+'</h2><p>'+esc(m.details)+'</p>'+supplement(m.evidence_ids)+'</article>').join('');
document.getElementById('factGrid').innerHTML=d.content.fact_sheet.map(f=>'<article class="griefCard"><h2>'+esc(f.label)+'</h2><p><strong>'+esc(f.value)+'</strong></p><p class="muted">'+esc(f.qualifier)+'</p>'+supplement(f.evidence_ids)+'</article>').join('');

// Graphique mensuel : nouveaux / cumulés / par position, périmètre local ou élargi.
initEvolution({repository:d,root:document.getElementById('evolution-root')});
