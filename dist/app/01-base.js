/* CCA SIEMMU · 01-base.js — parte 1 di 7. I file si caricano in ordine (index.html) e condividono le variabili globali. */
/* CCA SIEMMU · sito collegato alle API del Worker */
const scaledArt=(name,section='icone',size=32)=>`<g transform="scale(${16/size})">${window.CCAArt[section][name]||window.CCAArt.icone.star}</g>`;
const navIcons=Object.fromEntries(['home','calendario','missioni','comunita','referenti','profilo'].map(id=>[id,scaledArt(id)]));
const shapes=Object.fromEntries(Object.keys(window.CCAArt.icone).map(id=>[id,scaledArt(id)]));
const art=name=>`<div class="sprite-box">${pixelIcon(shapes[name]||shapes.star,'sprite')}</div>`;
const rainbowColors=['#DD9690','#E6B94D','#A5B865','#78B4C5','#8D7A9F','#82566E'];
const avatarColors={"rosa": ["Rosa fichidindia", "#DD9690"], "verde": ["Verde salvia", "#A5B865"], "blu": ["Blu cielo", "#78B4C5"], "sole": ["Giallo ginestra", "#E6B94D"], "terracotta": ["Terracotta", "#BF694C"], "viola": ["Viola tramonto", "#8D7A9F"], "ottanio": ["Verde ottanio", "#4F9291"], "crema": ["Crema pietra", "#F1E7CA"], "rosso": ["Rosso melograno", "#AA4F4B"], "bosco": ["Verde bosco", "#4D6547"], "cobalto": ["Blu cobalto", "#526EA1"], "prugna": ["Prugna", "#82566E"]};
avatarColors.arcobaleno=['Arcobaleno',`linear-gradient(90deg,${rainbowColors.map((c,i)=>`${c} ${i/6*100}% ${(i+1)/6*100}%`).join(',')})`];
const animals=Object.fromEntries(Object.entries(window.CCAArt.avatars).map(([id,name])=>[id,{name,art:scaledArt(id,'avatar-v2',128)}]));
const cheese=scaledArt('cheese');
function cowSprite(mood){return scaledArt(Object.hasOwn(window.CCAArt.mu,mood)?mood:'normale','mu',64);}
function cowMascot(mood,text,tips=[]){
 const all=[text,...tips.filter(t=>t&&t!==text)];
 return `<div class="mascot ${all.length>1?'talk':''}" ${all.length>1?`data-tips="${esc(JSON.stringify(all))}" data-i="0" tabindex="0" role="button" aria-label="Mù: tocca per un altro consiglio"`:''}>${pixelIcon(cowSprite(mood),'mu-sprite')}<div><strong>Mù</strong><p aria-live="polite">${esc(text)}</p></div></div>`;
}
const pixelIcon = (path,kind='')=>`<svg class="pixel-icon ${kind}" viewBox="0 0 16 16" shape-rendering="crispEdges" aria-hidden="true">${path}</svg>`;

/* ===== CCA SIEMMU · frontend collegato alle API ===== */
const LEVELS=[['Latte',0],['Cagliata',60],['Primo sale',300],['Stagionato',800],['Gran riserva',1600]];
const WEEKLY_CHEESE=12;
const main=document.querySelector('main');
const tumazzi=n=>`${n} ${Number(n)===1?'Tumazzu':'Tumazzi'}`;
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const S={me:null,totals:{xp:0,cheese:0},invite:null,loaded:false,unread:0};
const bellIcon=()=>pixelIcon(shapes.bell,'bell-icon');
const pref={get(k,d){try{return localStorage.getItem('cca-'+k)??d;}catch{return d;}},set(k,v){try{localStorage.setItem('cca-'+k,v);}catch{}}};

/* ---- rete ---- */
let networkPending=0, loadingTimer;
function beginLoading(){
 if(networkPending++===0)loadingTimer=setTimeout(()=>{
  let el=document.getElementById('operation-loading');
  if(!el){el=document.createElement('div');el.id='operation-loading';el.setAttribute('role','status');el.setAttribute('aria-live','polite');el.innerHTML='<span class="loading-spinner" aria-hidden="true"></span> Operazione in corso…';document.body.append(el);}
 },1000);
}
function endLoading(){if(--networkPending===0){clearTimeout(loadingTimer);document.getElementById('operation-loading')?.remove();}}
async function api(path,{method='GET',body}={}){
 beginLoading();
 try{
 let response;
 try{response=await fetch('/api'+path,{method,credentials:'same-origin',headers:body===undefined?{}:{'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)});}
 catch{const e=new Error('Connessione non riuscita. Controlla la rete e riprova.');e.status=0;throw e;}
 let data=null;try{data=await response.json();}catch{}
 if(!response.ok){const e=new Error(data?.error||`Errore ${response.status}`);e.status=response.status;throw e;}
 return data;
 }finally{endLoading();}
}
async function loadSession(){
 try{const d=await api('/auth/me');S.me=d.member;S.totals=d.totals??{xp:0,cheese:0};S.unread=d.unread??0;}
 catch{S.me=null;}
 S.loaded=true;
 checkLevelUp();
}
const isOrganizer=()=>S.me?.role==='organizer';

/* ---- helpers grafici ---- */
const badge=x=>`<span class="pill">${esc(x)}</span>`;
const card=(html,color='')=>`<article class="card ${color}">${html}</article>`;
const grid=(items,size='three')=>`<div class="grid ${size}">${items.join('')}</div>`;
const section=(name,content,action='',id='')=>`<section><div class="section-head"><h2${id?` id="${id}" tabindex="-1"`:''}>${name}</h2>${action}</div>${content}</section>`;
const title=(name,desc,eyebrow='CCA SIEMMU')=>`<header class="page-title"><span class="eyebrow">${eyebrow}</span><h1>${name}</h1>${desc?`<p>${desc}</p>`:''}</header>`;
const link=(label,href)=>`<a class="btn" href="#${href}">${label} →</a>`;
const btn=(label,action,id='',{secondary=false,extra=''}={})=>`<button type="button" data-action="${action}" data-id="${esc(id)}" ${extra} class="${secondary?'secondary':''}">${esc(label)}</button>`;
const field=(name,label,type='text',extra='')=>`<label>${label}<input name="${name}" type="${type}" ${extra}></label>`;
const form=(kind,body,label,{id='',cls='card'}={})=>`<form class="${cls}" data-form="${kind}" data-id="${esc(id)}">${body}<button>${label}</button></form>`;
const bar=(value,max,label,suffix='')=>`<div class="bar-row"><span class="bar-label">${esc(label)}</span><span class="bar-track"><span class="bar-fill" style="width:${max?Math.max(2,Math.round(value/max*100)):0}%"></span></span><span class="bar-value">${value}${suffix}</span></div>`;
const empty=text=>`<p class="muted">${text}</p>`;
const fmt=(sec,opts)=>new Intl.DateTimeFormat('it-IT',{timeZone:'Europe/Rome',...opts}).format(new Date(sec*1000));
const dateLong=sec=>fmt(sec,{weekday:'short',day:'numeric',month:'long',hour:'2-digit',minute:'2-digit'});
const romeDate=new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Rome',year:'numeric',month:'2-digit',day:'2-digit'});
const romeClock=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Rome',weekday:'short',hour:'2-digit',hourCycle:'h23'});
const romeNow=()=>{
 const parts=Object.fromEntries(romeClock.formatToParts(new Date()).map(p=>[p.type,p.value]));
 return {weekday:parts.weekday,hour:Number(parts.hour)};
};
function daysLabel(start, now=Date.now()){
 if(start*1000<=now)return '';
 const days=Math.round((Date.parse(romeDate.format(start*1000))-Date.parse(romeDate.format(now)))/86400000);
 return days===0?'Oggi':days===1?'Domani':`Tra ${days} giorni`;
}
function countdown(start){
 const label=daysLabel(start);
 return `<span class="activity-countdown" data-start="${Number(start)}"${label?'':' hidden'}>${label}</span>`;
}
const activityDate=start=>Number.isFinite(Number(start))&&Number(start)>0?`<time datetime="${new Date(start*1000).toISOString()}">${dateLong(start)}</time> ${countdown(start)}`:'Data da definire';
const dateShort=sec=>fmt(sec,{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});
const duration=min=>min>=60?`${Math.floor(min/60)} h ${min%60?String(min%60).padStart(2,'0')+' min':''}`.trim():`${min} min`;
const statusText={pending:'In attesa',verified:'Verificata',rejected:'Respinta',confirmed:'Confermata',declined:'Rifiutata',cancelled:'Annullata',draft:'Bozza',published:'Pubblicata',approved:'Attivo',disabled:'Disattivato'};
const avatar=(species=S.me?.avatarSpecies,color=S.me?.avatarColor)=>{
 const key=Object.hasOwn(animals,species)?species:'mucca';
 const colorKey=Object.hasOwn(avatarColors,color)?color:'rosa';
 const backdrop=colorKey==='arcobaleno'?rainbowColors.map((fill,i)=>`<rect x="${4+i*128/6}" y="4" width="${128/6+1}" height="128" fill="${fill}"/>`).join(''):`<rect x="4" y="4" width="128" height="128" fill="${avatarColors[colorKey][1]}"/>`;
 return `<svg class="avatar" viewBox="0 0 136 136" shape-rendering="crispEdges" role="img" aria-label="Avatar · ${esc(animals[key].name)}"><rect width="136" height="136" fill="#29251F"/>${backdrop}<g transform="translate(4 4)">${window.CCAArt['avatar-v2'][key]}</g></svg>`;
};
const trophyArt=t=>`<img class="cozy-trophy" src="art/trofei/${Object.hasOwn(window.CCAArt.trofei,t.id)?t.id:'cca'}.svg" width="128" height="128" alt="${esc(t.name)}" loading="lazy">`;
function level(xp){
 const i=LEVELS.findLastIndex(([,t])=>xp>=t),[name,t]=LEVELS[i],next=LEVELS[i+1];
 return {number:i+1,name,xp,progress:xp-t,range:next?next[1]-t:1,left:next?next[1]-xp:0,top:!next};
}
function profileChip(){
 const l=level(S.totals.xp);
 return `<div class="row">${avatar()}<div><span class="eyebrow">LIVELLO ${l.number} / ${LEVELS.length}</span><div class="metric">${esc(S.me.pseudonym)}</div><p>Livello ${l.number}: ${esc(l.name)}</p></div></div><p class="level-explanation">Il tuo livello cresce con gli XP delle attività: dal Latte alla Gran riserva, come un formaggio che matura.</p><progress value="${l.top?1:l.progress}" max="${l.range}" aria-label="Progresso del livello"></progress><p class="muted"><strong>${l.xp} XP permanenti</strong>${l.top?' · livello massimo':` · ${l.left} XP al livello ${l.number+1}`}</p>`;
}
const loading=()=>`<p role="status">Stamu arrivannu…</p>`;
const failCard=e=>card(`<h3>Qualcosa non ha funzionato</h3><p>${esc(e.message)}</p>${btn('Riprova','reload')}`);
const needLogin=()=>title('Serve l’accesso','Questa pagina è riservata a chi ha un account.')+card(`<p>Accedi con la tua email e la tua password.</p>${link('Accedi','accedi')}`);
const needOrganizer=()=>title('Area referenti','Riservata ai referenti.')+card('<p>Il tuo account non ha il ruolo di referente.</p>'+link('Torna alla Home','home'));
