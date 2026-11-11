/* CCA SIEMMU · sito collegato alle API del Worker */
const navIcons = {
 home:'<path d="M1 7h2V5h2V3h2V1h2v2h2v2h2v2h2v3h-2v5H3v-5H1z"/><path fill="#B30016" d="M3 8h2V6h2V4h2v2h2v2h2v1H3z"/><path fill="#FFFFFF" d="M5 10h6v3H9v-2H7v2H5z"/>',
 calendario:'<path d="M4 1h2v2h4V1h2v2h3v12H1V3h3z"/><path fill="#B30016" d="M3 5h10v2H3z"/><path fill="#FFFFFF" d="M3 8h10v5H3z"/><path fill="#6f440f" d="M4 9h2v1H4z M7 9h2v1H7z M10 9h2v1h-2z M4 11h2v1H4z M7 11h2v1H7z"/>',
 missioni:'<path d="M4 1h8v2h3v5h-2v2h-3v2h3v3H3v-3h3v-2H3V8H1V3h3z"/><path fill="#b9954b" d="M5 3h6v5h-1v1H6V8H5z M7 10h2v2H7z M5 13h6v1H5z"/><path fill="#FFFFFF" d="M7 4h2v2H7z M3 5h1v2H3z M12 5h1v2h-1z"/>',
 comunita:'<path d="M2 2h4v1h1v4H6v1h4V7H9V3h1V2h4v1h1v4h-1v2h1v1h1v4H0v-4h1V9h1V7H1V3h1z"/><path fill="#bdd9da" d="M3 4h2v2H3z M2 10h4v2H2z"/><path fill="#B30016" d="M11 4h2v2h-2z M10 10h4v2h-4z"/>',
 referenti:'<path d="M5 1h6v2h3v9h-2v2H4v-2H2V3h3z"/><path fill="#bdd9da" d="M4 5h8v6h-2v2H6v-2H4z"/><path fill="#B30016" d="M6 3h4v2H6z"/><path d="M6 7h2v2h2v1H6z M9 6h2v2H9z"/>',
 profilo:'<path d="M2 1h12v1h1v12h-1v1H2v-1H1V2h1z"/><path fill="#FFFFFF" d="M3 3h10v10H3z"/><path d="M6 4h4v4H6z M5 9h6v1h1v2H4v-2h1z"/><path fill="#b9954b" d="M7 5h2v2H7z"/><path fill="#B30016" d="M6 10h4v1H6z"/>'
};
const shapes = {
 sun:'<path fill="#6d3519" d="M7 0h2v3H7z M7 13h2v3H7z M0 7h3v2H0z M13 7h3v2h-3z M2 2h2v2H2z M12 2h2v2h-2z M2 12h2v2H2z M12 12h2v2h-2z M6 4h4v1h1v1h1v4h-1v1h-1v1H6v-1H5v-1H4V6h1V5h1z"/><path fill="#ffb32f" d="M6 5h4v1h1v4h-1v1H6v-1H5V6h1z"/><path fill="#fff1aa" d="M6 6h3v1H7v2H6z"/>',
 moon:'<path fill="#292039" d="M7 1h3v2H8v2H7v4h1v2h2v1h3v-1h2v2h-2v2H6v-1H4v-2H3V9H2V6h1V4h2V2h2z"/><path fill="#e7ad42" d="M6 3h1v2H6v4h1v2h1v1h2v1h3v1H6v-1H5v-2H4V6h1V4h1z"/><path fill="#fff0ae" d="M5 6h1v5H5z M6 11h1v2H6z"/><path fill="#bd7a33" d="M11 3h1v1h1v1h-1v1h-1V5h-1V4h1z"/>',
 crown:'<path fill="#382332" d="M1 3h3v2h2V3h1V1h2v2h1v2h2V3h3v4h-1v5h-1v2H3v-2H2V7H1z"/><path fill="#eaa334" d="M2 4h1v2h3V5h1V3h2v2h1v1h3V4h1v3h-1v5H3V7H2z"/><path fill="#fff1a1" d="M4 8h1v2H4z M7 5h1v2H7z M4 11h8v1H4z"/><path fill="#bb3148" d="M7 8h2v2H7z M11 8h1v2h-1z"/>',
 book:'<path fill="#111111" d="M1 3h6v1h2V3h6v10H9v1H7v-1H1z"/><path fill="#eee7d9" d="M2 4h4v1h1v7H6v-1H2z M9 5h1V4h4v7h-4v1H9z"/><path fill="#5876df" d="M3 6h3v1H3z M3 8h3v1H3z M10 6h3v1h-3z M10 8h3v1h-3z"/>',
 camera:'<path fill="#111111" d="M1 5h3V3h7v2h4v9H1z"/><path fill="#eee7d9" d="M2 6h12v6H2z"/><path fill="#73528f" d="M6 6h5v1h1v4h-1v1H6v-1H5V7h1z"/><path fill="#9de2ff" d="M7 7h3v3H7z"/>',
 plant:'<path fill="#111111" d="M1 2h5v2h2v2h1V4h2V2h4v6h-2v2h-3v2h3v3H3v-3h4v-2H4V8H1z"/><path fill="#a8ef69" d="M2 3h3v2h2v4H5V7H2z M11 5h1V3h2v4h-2v2h-2V6h1z"/><path fill="#d37c4a" d="M4 13h8v1H4z"/>',
 heart:'<path fill="#111111" d="M1 3h5v1h4V3h5v6h-2v2h-2v2H9v2H7v-2H5v-2H3V9H1z"/><path fill="#B30016" d="M2 4h3v1h2v1h2V5h2V4h3v4h-2v2h-2v2H8v1H7v-1H6v-2H4V8H2z"/>',
 pin:'<path fill="#111111" d="M3 2h9v2h2v9h-2v2H3v-2H1V4h2z"/><path fill="#B30016" d="M4 4h7v1h1v7h-1v1H4v-1H3V5h1z"/><path fill="#FFFFFF" d="M7 5h2v2h2v2H9v2H7V9H5V7h2z"/>',
 bag:'<path fill="#111111" d="M5 1h6v2h1v3h2v9H2V6h2V3h1z"/><path fill="#b9954b" d="M6 3h4v3H9V4H7v2H6z M4 8h8v5H4z"/><path fill="#FFFFFF" d="M7 9h2v2H7z"/>',
 shirt:'<path fill="#111111" d="M5 1h6v1h2v2h2v5h-3v6H4V9H1V4h2V2h2z"/><path fill="#bdd9da" d="M3 5h2V3h1v2h4V3h1v2h2v2h-3v6H6V7H3z"/><path fill="#6f440f" d="M7 7h2v2H7z"/>',
 star:'<path fill="#111111" d="M7 1h2v3h2v2h4v3h-3v3h1v3h-3v-2H6v2H3v-3h1V9H1V6h4V4h2z"/><path fill="#FFD400" d="M7 3h2v3h2v1h3v1h-3v4H9v-1H7v1H5V8H2V7h3V6h2z"/>'
};
const spriteDetails={
 book:'<path fill="#d7bba3" d="M2 10h4v1H2z M10 10h4v1h-4z"/><path fill="#d0a053" d="M7 5h1v8H7z"/>',
 camera:'<path fill="#e8faff" d="M7 7h2v1H8v1H7z"/><path fill="#594268" d="M3 10h2v1H3z"/>',
 plant:'<path fill="#579554" d="M3 6h2v1H3z M11 7h2v1h-2z"/><path fill="#f6a45d" d="M4 13h5v1H4z"/>',
 heart:'<path fill="#ff827c" d="M3 5h2v1H4v1H3z"/><path fill="#780c31" d="M11 7h2v1h-2v2H9v1H8v1H7v-1h1v-1h1V9h2z"/>',
 star:'<path fill="#fff2a2" d="M7 4h1v3H7z M4 7h3v1H4z"/>',
 bag:'<path fill="#805737" d="M11 8h1v5H4v-1h7z"/>',
 shirt:'<path fill="#5983a5" d="M10 8h1v5H6v-1h4z"/>',
 pin:'<path fill="#f78072" d="M4 5h2v1H5v1H4z"/>'
};
const art = name=>`<div class="sprite-box"><svg class="sprite" viewBox="-2 -2 20 20" shape-rendering="crispEdges" aria-hidden="true"><path fill="#b9a88d" d="M2 15h12v1H2z"/>${shapes[name]}${spriteDetails[name]||''}<path fill="#FFFFFF" opacity=".6" d="M-1 0h1v1h-1z M16 3h1v1h-1z"/></svg></div>`;
const avatarColors = {
 rosa:['Rosa fichidindia','#FFD400'],verde:['Verde salvia','#9abe7f'],blu:['Blu cielo','#699cff'],
 sole:['Giallo ginestra','#ffce39'],terracotta:['Terracotta','#dc7046'],viola:['Viola tramonto','#ad82ed'],
 ottanio:['Verde ottanio','#138f91'],crema:['Crema pietra','#FFFFFF'],rosso:['Rosso melograno','#e9435d'],
 bosco:['Verde bosco','#428357'],cobalto:['Blu cobalto','#3456c7'],prugna:['Prugna','#953c83'],
 arcobaleno:['Arcobaleno','linear-gradient(90deg,#ff697b 0 17%,#ffaf55 17% 34%,#f6df6c 34% 51%,#8bd294 51% 68%,#77bde9 68% 85%,#be9af0 85%)']
};
const animals = {
 mucca:{name:'Mucca',art:'<path fill="#b9954b" d="M4 2h2v3H4z M10 2h2v3h-2z"/><path fill="#111111" d="M2 4h4V3h4v1h4v4h-2v4H4V8H2z"/><path fill="#FFFFFF" d="M4 5h8v5H4z"/><path fill="#73584e" d="M4 5h3v3H4z"/><path fill="#111111" d="M6 6h1v2H6z M10 6h1v2h-1z"/><path fill="#ee99aa" d="M5 9h6v2H5z"/><path fill="#111111" d="M6 9h1v1H6z M9 9h1v1H9z"/>'},
 pecora:{name:'Pecora',art:'<path fill="#111111" d="M4 3h2V2h4v1h2v2h2v5h-2v2H4v-2H2V5h2z"/><path fill="#FFFFFF" d="M5 4h2V3h2v1h2v2h2v3h-2v2H5V9H3V6h2z"/><path fill="#7e6e80" d="M5 6h6v4H5z"/><path fill="#111111" d="M6 7h1v1H6z M9 7h1v1H9z M7 9h2v1H7z"/>'},
 gallina:{name:'Gallina',art:'<path fill="#111111" d="M7 2h4v2h1v2h3v3h-3v3H3v-2H2V6h3v1h1V4h1z"/><path fill="#B30016" d="M8 3h2v2H8z M10 9h1v2h-1z"/><path fill="#FFFFFF" d="M3 7h2v2h2V5h4v6H4V9H3z"/><path fill="#ffbd37" d="M11 7h3v1h-3z"/><path fill="#111111" d="M9 6h1v1H9z"/>'},
 asino:{name:'Asino',art:'<path fill="#111111" d="M3 1h3v3h4V1h3v5h-1v6H4V6H3z"/><path fill="#a8a0ad" d="M4 2h1v4h6V2h1v3h-1v6H5V5H4z"/><path fill="#FFFFFF" d="M5 9h6v2H5z"/><path fill="#111111" d="M6 6h1v2H6z M9 6h1v2H9z M7 9h2v1H7z"/>'},
 maiale:{name:'Maiale',art:'<path fill="#111111" d="M2 3h4v2h4V3h4v5h-1v3h-2v1H5v-1H3V8H2z"/><path fill="#ee99aa" d="M3 4h2v2h6V4h2v3h-1v3h-2v1H6v-1H4V7H3z"/><path fill="#cf6789" d="M6 8h4v2H6z"/><path fill="#111111" d="M5 6h1v1H5z M10 6h1v1h-1z M6 9h1v1H6z M9 9h1v1H9z"/>'},
 capra:{name:'Capra',art:'<path fill="#111111" d="M4 1h2v3h4V1h2v4h3v3h-3v2h-2v2H6v-2H4V8H1V5h3z"/><path fill="#b9954b" d="M5 2h1v3H5z M10 2h1v3h-1z"/><path fill="#FFFFFF" d="M2 6h3V5h6v1h3v1h-3v2H9v2H7V9H5V7H2z"/><path fill="#111111" d="M6 6h1v1H6z M9 6h1v1H9z M7 8h2v1H7z"/>'},
 ricotta:{name:'Vascello di ricotta',art:'<path fill="#111111" d="M6 2h4v1h2v2h2v4h-1v2h-2v1H5v-1H3V9H2V5h2V3h2z"/><path fill="#FFFFFF" d="M6 3h4v1h2v2h1v1H3V6h2V4h1z"/><path fill="#b9954b" d="M3 8h10v1h-1v2H4V9H3z"/><path fill="#6f440f" d="M5 8h1v3H5z M8 8h1v3H8z M11 8h1v2h-1z"/>'},
 ficodindia:{name:'Pala di fico d’India',art:'<path fill="#111111" d="M6 2h4v1h2v3h1v3h-2v2H9v1H6v-1H4V9H3V6h1V3h2z"/><path fill="#69a650" d="M6 3h4v1h1v3h1v1h-2v2H8v1H6v-1H5V8H4V6h1V4h1z"/><path fill="#FFFFFF" d="M6 5h1v1H6z M9 6h1v1H9z M6 8h1v1H6z"/><path fill="#B30016" d="M9 1h2v2H9z"/>'},
 torre:{name:'Torre in rovina',art:'<path fill="#111111" d="M3 2h3v2h2v1h2V3h3v9H3z"/><path fill="#b9954b" d="M4 3h1v2h3v1h3V4h1v7H4z"/><path fill="#FFFFFF" d="M4 6h3v1H4z M9 7h3v1H9z"/><path fill="#111111" d="M7 7h2v4H7z M5 9h1v1H5z M10 9h1v1h-1z"/>'},
 serpente:{name:'Serpente',art:'<path fill="#111111" d="M9 2h4v1h2v5h-3v4H2V9h2V7h5z"/><path fill="#69a650" d="M10 3h3v1h1v3h-3v4H3v-1h2V8h5z"/><path fill="#B30016" d="M4 10h6v1H4z"/><path fill="#111111" d="M12 4h1v1h-1z"/><path fill="#B30016" d="M13 7h3v1h-3z"/>'},
 cane:{name:'Cane',art:'<path fill="#111111" d="M2 3h4v1h4V3h4v7h-2v2H4v-2H2z"/><path fill="#b9954b" d="M3 4h2v5H3z M11 4h2v5h-2z"/><path fill="#FFFFFF" d="M5 5h6v6H5z"/><path fill="#111111" d="M6 6h1v1H6z M9 6h1v1H9z M7 8h2v1H7z"/><path fill="#ee99aa" d="M7 10h2v1H7z"/>'},
 civetta:{name:'Civetta',art:'<path fill="#111111" d="M2 2h3v2h6V2h3v8h-2v2H4v-2H2z"/><path fill="#b9954b" d="M3 3h1v2h8V3h1v6h-2v2H5V9H3z"/><path fill="#FFFFFF" d="M4 6h3v3H4z M9 6h3v3H9z"/><path fill="#111111" d="M5 7h1v1H5z M10 7h1v1h-1z"/><path fill="#B30016" d="M7 9h2v1H7z"/>'},
 leone:{name:'Leone rampante',art:'<path fill="#111111" d="M3 3h3V1h1v1h2V1h1v2h3v2h2v5h-2v2h-2v1H5v-1H3v-2H1V5h2z"/><path fill="#b96535" d="M4 4h8v1h2v4h-2v2h-2v1H6v-1H4V9H2V6h2z"/><path fill="#c6a55b" d="M6 5h4v1h2v3h-1v2H5V9H4V6h2z M6 3h4v1H6z"/><path fill="#111111" d="M5 7h2v1H5z M9 7h2v1H9z M7 9h2v1H7z"/><path fill="#ffe5aa" d="M6 10h4v1H6z"/>'}
};
const cheese='<path fill="#111111" d="M10 1h2v1h2v2h1v10H1V7h2V6h2V5h2V4h2V2h1z"/><path fill="#f4bf57" d="M10 3h2v1h1v2H5V5h2V4h3z"/><path fill="#ffd782" d="M3 8h10v4H3z"/><path fill="#a96a32" d="M5 9h2v2H5z M10 10h2v1h-2z"/>';
function cowSprite(mood){
 const faces={
  felice:'<path fill="#fff9ed" d="M5 6h7v3H5z"/><path fill="#2e2132" d="M5 8V7h1V6h1v1h1v1H7V7H6v1z M9 8V7h1V6h1v1h1v1h-1V7h-1v1z"/><path fill="#e7758e" d="M5 8h1v1H5z M11 8h1v1h-1z"/>',
  triste:'<path fill="#fff9ed" d="M5 6h7v3H5z"/><path fill="#2e2132" d="M5 7h1V6h2v1H6v1H5z M9 6h2v1h1v1h-1V7H9z M7 11h2v1H7z"/><path fill="#739bc4" d="M11 8h1v2h-1z"/>',
  festoso:'<path fill="#fff9ed" d="M5 6h7v3H5z"/><path fill="#99611d" d="M6 6h1v1h1v1H7v1H6V8H5V7h1z M10 6h1v1h1v1h-1v1h-1V8H9V7h1z"/>'
 };
 return animals.mucca.art+(faces[mood]||chibiFace('mucca'));
}
function cowMascot(mood,text,tips=[]){
 const all=[text,...tips.filter(t=>t&&t!==text)];
 return `<div class="mascot ${all.length>1?'talk':''}" ${all.length>1?`data-tips="${esc(JSON.stringify(all))}" data-i="0" tabindex="0" role="button" aria-label="Mù: tocca per un altro consiglio"`:''}>${pixelIcon(cowSprite(mood),'mu-sprite')}<div><strong>Mù</strong><p aria-live="polite">${esc(text)}</p></div></div>`;
}
const pixelIcon = (path,kind='')=>`<svg class="pixel-icon ${kind}" viewBox="0 0 16 16" shape-rendering="crispEdges" aria-hidden="true">${path}</svg>`;

/* ===== CCA SIEMMU · frontend collegato alle API ===== */
const LEVELS=[['Latte',0],['Cagliata',60],['Primo sale',300],['Stagionato',800],['Gran riserva',1600]];
const WEEKLY_CHEESE=12;
const main=document.querySelector('main');
const tumazzi=n=>`${n} ${Number(n)===1?'Tumuzzu':'Tumazzi'}`;
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const S={me:null,totals:{xp:0,cheese:0},invite:null,loaded:false,unread:0};
const bellIcon=()=>pixelIcon('<path fill="currentColor" d="M7 1h2v2h3v2h1v6h2v2H1v-2h2V5h1V3h3zM6 14h4v2H6z"/>','bell-icon');
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
function chibiFace(species){
 const faces={
  mucca:[6,6,10,6],pecora:[6,7,9,7],asino:[6,6,9,6],maiale:[5,6,10,6],
  capra:[6,6,9,6],cane:[6,6,9,6],civetta:[5,7,10,7],leone:[5,7,9,7]
 };
 const eyes=faces[species];
 if(!eyes)return '';
 const [x,y,a,b]=eyes;
 return `<path fill="#111111" d="M${x-.5} ${y}h2v2h-2z M${a-.5} ${b}h2v2h-2z"/>
  <path fill="#FFFFFF" d="M${x} ${y}h.5v.5h-.5z M${a} ${b}h.5v.5h-.5z"/>
  <path fill="#e996a1" d="M${x-1} ${y+2}h1v.5h-1z M${a+1} ${b+2}h1v.5h-1z"/>`;
}
const avatarDetails={
 mucca:['#fff7ef','M10 11h2v2h-2z M18 13h2v2h-2z'],
 pecora:['#c6c4ea','M10 6h3v1h-3z M20 7h2v2h-2z M9 12h2v2H9z'],
 gallina:['#f5b16b','M9 16h4v1H9z M14 16h2v1h-2z'],
 asino:['#dfc8d6','M9 4h1v4H9z M23 4h1v4h-1z M13 18h2v1h-2z'],
 maiale:['#ffd0d5','M8 7h2v3H8z M24 7h2v3h-2z M14 13h4v1h-4z'],
 capra:['#cfb3e2','M12 16h2v1h-2z M20 16h2v1h-2z M15 20h2v2h-2z'],
 ricotta:['#e1cfaf','M13 8h4v1h-4z M11 10h2v1h-2z M19 11h3v1h-3z'],
 ficodindia:['#d7f17d','M12 10h1v3h-1z M11 11h3v1h-3z M18 14h3v1h-3z M19 13h1v3h-1z'],
 torre:['#d28e54','M9 12h3v1H9z M20 9h3v1h-3z M21 19h3v1h-3z'],
 serpente:['#f1db7f','M21 7h3v1h-3z M8 20h2v1H8z M15 18h2v1h-2z'],
 cane:['#f7c58f','M8 9h2v3H8z M24 9h2v3h-2z M14 15h4v1h-4z'],
 civetta:['#f8cc80','M8 9h3v1H8z M22 9h3v1h-3z M13 18h2v1h-2z M19 18h2v1h-2z'],
 leone:['#fff1b6','M12 8h2v2h-2z M19 8h2v2h-2z']
};
const avatar=(species=pref.get('species','mucca'),color=pref.get('color','rosa'))=>{
 const key=Object.hasOwn(animals,species)?species:'mucca';
 const animal=animals[key];
 const accent=(Object.hasOwn(avatarColors,color)?avatarColors[color]:avatarColors.rosa)[1];
 const [highlight,detail]=avatarDetails[key];
 const colors=['#ff697b','#ffaf55','#f6df6c','#8bd294','#77bde9','#be9af0'];
 const backdrop=color==='arcobaleno'
  ?colors.map((fill,i)=>`<path fill="${fill}" d="M${1+i*5} 1h5v30h-5z"/>`).join('')
  :`<path fill="${accent}" d="M1 1h30v30H1z"/>`;
 return `<svg class="avatar" viewBox="0 0 32 32" shape-rendering="crispEdges" role="img" aria-label="Avatar pixel · ${animal.name}">
  ${backdrop}<path fill="#38283b" opacity=".25" d="M1 28h30v3H1z M28 3h3v28h-3z"/><path fill="#fff2cf" opacity=".82" d="M9 3h14v2h4v4h2v12h-2v4H5v-4H3V9h2V5h4z"/>
  <path fill="#937a8e" opacity=".45" d="M27 9h2v12h-2v3H6v-2h19v-2h2z"/>
  <path fill="#fff9e8" d="M7 4h4v1H7z M5 6h2v2H5z M4 10h1v4H4z"/>
  <path fill="#FFFFFF" d="M3 4h2v2H3z M27 5h2v2h-2z M3 21h1v1H3z M28 19h1v1h-1z"/>
  <g transform="translate(0 1) scale(2)">${animal.art}${chibiFace(key)}</g><path fill="${highlight}" d="${detail}"/>
  <path fill="#111111" d="M7 24h18v1h1v6H6v-6h1z"/><path fill="#FFFFFF" d="M8 25h16v5H8z"/>
  <path fill="#111111" d="M10 26h3v1h-2v1h2v2h-3v-1h2v-1h-2z M15 26h3v1h-2v2h1v-1h1v2h-3z M20 26h3v1h-2v2h1v-1h1v2h-3z"/>
 </svg>`;
};
function level(xp){
 const i=LEVELS.findLastIndex(([,t])=>xp>=t),[name,t]=LEVELS[i],next=LEVELS[i+1];
 return {number:i+1,name,xp,progress:xp-t,range:next?next[1]-t:1,left:next?next[1]-xp:0,top:!next};
}
function profileChip(){
 const l=level(S.totals.xp);
 return `<div class="row">${avatar()}<div><span class="eyebrow">LIVELLO ${l.number} / ${LEVELS.length}</span><div class="metric">${esc(S.me.pseudonym)}</div><p>${esc(l.name)}</p></div></div><progress value="${l.top?1:l.progress}" max="${l.range}" aria-label="Progresso del livello"></progress><p class="muted"><strong>${l.xp} XP permanenti</strong>${l.top?' · livello massimo':` · ${l.left} XP al livello ${l.number+1}`}</p>`;
}
const loading=()=>`<p role="status">Stamu arrivannu…</p>`;
const failCard=e=>card(`<h3>Qualcosa non ha funzionato</h3><p>${esc(e.message)}</p>${btn('Riprova','reload')}`);
const needLogin=()=>title('Serve l’accesso','Questa pagina è riservata a chi ha un account.')+card(`<p>Accedi con la tua email e la tua password.</p>${link('Accedi','accedi')}`);
const needOrganizer=()=>title('Area referenti','Riservata ai referenti.')+card('<p>Il tuo account non ha il ruolo di referente.</p>'+link('Torna alla Home','home'));

/* ---- navigazione ---- */
const navDefs={
 home:['Home','home'],calendario:['Calendario','calendario'],spazio:['Spazio','comunita'],comunita:['Comunità','comunita'],accedi:['Accedi','profilo'],
 missioni:['Missioni','missioni'],presenze:['Statistiche','comunita'],trofei:['Trofei','comunita'],putia:['Putìa','comunita'],banca:['Banca','comunita'],proposte:['Proposte','comunita'],referenti:['Referenti','referenti'],profilo:['Profilo','profilo']
};
function renderChrome(active){
 const ids=!S.me?['home','calendario','spazio','accedi']:isOrganizer()?['home','calendario','missioni','comunita','referenti','profilo']:['home','calendario','missioni','comunita','profilo'];
 const nav=document.querySelector('#nav');
 if(['banca','assemblea','proposte'].includes(active))active='comunita';
 nav.style.setProperty('--cols',ids.length);
 nav.innerHTML=ids.map(id=>`<a href="#${id}" ${active===id?'aria-current="page"':''}><span class="nav-icon-tile" aria-hidden="true">${pixelIcon(navIcons[navDefs[id][1]],'nav-icon')}</span>${navDefs[id][0]}</a>`).join('');
 const bell=document.querySelector('#notifications');
 bell.hidden=!S.me;
 if(S.me){bell.setAttribute('aria-label',S.unread?`Notifiche, ${S.unread} da leggere`:'Notifiche');bell.innerHTML=bellIcon()+(S.unread?`<span class="unread" aria-hidden="true">${S.unread}</span>`:'');}
 const wallet=document.querySelector('#wallet-link');
 wallet.hidden=!S.me;
 if(S.me){wallet.innerHTML=pixelIcon(cheese)+`<span>${S.totals.cheese}</span>`;wallet.setAttribute('aria-label',`${tumazzi(S.totals.cheese)} · apri la Putìa`);wallet.setAttribute('href','#putia');}
}

/* ---- orari, stato live, Mù, paese, albero, festa ---- */
const clockIcon=()=>pixelIcon('<path fill="#111111" d="M5 1h6v1h2v1h1v2h1v6h-1v2h-1v1h-2v1H5v-1H3v-1H2v-2H1V5h1V3h1V2h2z"/><path fill="#FFFFFF" d="M5 2h6v1h2v2h1v6h-1v2h-2v1H5v-1H3v-2H2V5h1V3h2z"/><path fill="#111111" d="M7 4h2v4h3v2H7z"/>');
const getStatus=async()=>{try{return await api('/status');}catch{return null;}};
const getCommunity=async()=>{try{return (await api('/community')).metrics;}catch{return null;}};
function liveLine(st){
 if(!st)return '';
 const n=st.count,label=st.open?(n===undefined?'Aperto ora':`Aperto ora · ${n} ${n===1?'persona dentro':'persone dentro'}`):'Chiuso al momento';
 return `<span class="live ${st.open?'live-on':'live-off'}"><span class="live-dot" aria-hidden="true"></span>${label}</span>`;
}
const openingDetails=st=>`<p><strong>${esc(st?.days||'Da lunedì a venerdì')} · ${esc(st?.hours||'16:00–20:00')}</strong></p>`;
const openDays=[['Mon','LU','Lunedì'],['Tue','MA','Martedì'],['Wed','ME','Mercoledì'],['Thu','GI','Giovedì'],['Fri','VE','Venerdì']];
const openingCard=st=>card(`<span class="eyebrow">ORARI DELLA SEDE</span><div class="stat-figure opening-time" data-opening-time>${clockIcon()}<div><strong class="metric">${esc(st?.hours||'16:00–20:00')}</strong><span class="stat-label">${esc(st?.days||'Da lunedì a venerdì')}</span></div><small class="opening-now" hidden>In orario di apertura</small></div>
 <div class="week" aria-label="Giorni di apertura">${openDays.map(([key,short,name])=>`<span data-opening-day="${key}" aria-label="${name}">${short}</span>`).join('')}</div>
 <div id="live" role="status" aria-live="polite">${liveLine(st)}</div>`,'opening');
function updateDateIndicators(){
 const {weekday,hour}=romeNow();
 const scheduled=openDays.some(([day])=>day===weekday)&&hour>=16&&hour<20;
 main.querySelectorAll('[data-opening-day]').forEach(el=>{
  if(el.dataset.openingDay===weekday)el.setAttribute('aria-current','date');
  else el.removeAttribute('aria-current');
 });
 main.querySelectorAll('[data-opening-time]').forEach(el=>{
  el.classList.toggle('is-scheduled',scheduled);
  el.querySelector('.opening-now').hidden=!scheduled;
 });
 main.querySelectorAll('[data-start].activity-countdown').forEach(el=>{
  const label=daysLabel(Number(el.dataset.start));
  el.textContent=label;
  el.hidden=!label;
 });
}
setInterval(async()=>{
 if(document.hidden)return;
 updateDateIndicators();
 if(!main.querySelector('#live'))return;
 const st=await getStatus(),again=main.querySelector('#live');
 if(st&&again&&again.innerHTML!==liveLine(st))again.innerHTML=liveLine(st);
},30000);
function streakMood(streak){
 if(!streak)return null;
 const {weekday,hour}=romeNow();
 if(openDays.some(([day])=>day===weekday)&&hour>=18&&hour<20&&streak.sede.current>=2&&!streak.sede.today)
  return ['triste','Mi manca vederti in sede. Se oggi non riesci, ci vediamo un’altra volta!'];
 if(streak.sede.today&&streak.sede.current>=2)
  return ['felice',`Che bello rivederti! ${streak.sede.current} giorni di apertura di fila in sede.`];
 if(streak.app.today&&streak.app.current>=2)
  return ['felice',`Bentornato! Hai aperto l’app per ${streak.app.current} giorni di fila.`];
 return null;
}
function monthlyGoal(goal){
 if(!goal)return '';
 const month=new Intl.DateTimeFormat('it-IT',{month:'long',year:'numeric',timeZone:'Europe/Rome'}).format(new Date(goal.month+'-01T12:00:00Z'));
 const number=new Intl.NumberFormat('it-IT',{maximumFractionDigits:1});
 const hours=seconds=>number.format(Math.floor(seconds/360)/10);
 return `<section class="card global-goal" aria-labelledby="global-goal-title">
 <div class="goal-heading">${pixelIcon(shapes.crown)}<div><span class="eyebrow">OBIETTIVO COMUNE · ${esc(month)}</span><h2 id="global-goal-title">${hours(goal.target)} ore insieme in sede</h2></div></div>
 <p><strong>${hours(goal.seconds)} / ${hours(goal.target)} ore</strong>${goal.reached?' · ✓ Obiettivo raggiunto!':''}</p>
 <progress value="${Math.min(goal.seconds,goal.target)}" max="${goal.target}" aria-labelledby="global-goal-title"></progress>
 <p>${goal.benefit?`<strong>${goal.reached?'Beneficio sbloccato':'Beneficio per tutti'}</strong> · ${esc(goal.benefit)}`:'Il beneficio per tutti è da concordare con l’associazione.'}</p>
 <small class="muted">Si sommano le ore di ciascun socio dopo l’uscita registrata.</small>
 </section>`;
}

function muSays(page,extra={}){
 const l=S.me?level(S.totals.xp):null;
 const mood=streakMood(extra.streak);
 if(mood)return mood;
 if(page==='home'){
  if(!l)return ['normale','E boni siemmu!'];
  if(l.top)return ['festoso','Sei Gran riserva! Dai una mano a chi sale.'];
  if(l.left<=20)return ['curioso',`Ci sei quasi: ${l.left} XP e arrivi al livello ${l.number+1}!`];
  return ['normale',`Ciao ${S.me.pseudonym}! Oggi che si fa?`];
 }
 if(page==='missioni')return extra.pending?['curioso',`${extra.pending} ${extra.pending===1?'richiesta aspetta':'richieste aspettano'} un referente. Pazienza!`]:['normale','Apri una missione per vedere i dettagli.'];
 if(page==='calendario')return ['curioso','Prenota un posto: ti aspettiamo!'];
 if(page==='profilo')return ['felice',l?`Livello ${l.number}: ${l.name}. Bella strada!`:'Bella strada!'];
 if(page==='paese')return ['felice',extra.reached?`Il paese cresce: ${extra.reached} ${extra.reached===1?"traguardo":"traguardi"} su ${extra.total}!`:'Il paese è appena nato. Ogni presenza lo fa crescere.'];
 return ['normale','E boni siemmu!'];
}
const MU_TIPS={
 home:['Hai già visto le missioni di oggi?','Hai un’idea per lo spazio? Scrivila nelle Proposte.','Controlla la Putìa: forse hai abbastanza Tumazzi!','Hai un’ora libera? La Banca del tempo ti aspetta.','Quando arrivi, inquadra il QR all’ingresso.'],
 missioni:['Ogni missione verificata ti avvicina al prossimo livello.','Le missioni ripetibili danno al massimo 12 Tumazzi a settimana.','Chiedi la verifica a un referente: non puoi verificare le tue.'],
 calendario:['Prenota presto: i posti volano!','Le attività consigliate per te hanno il bollino verde.','Non puoi più venire? Annulla, così il posto va a un altro.'],
 profilo:['Scegli i tuoi interessi: ti consiglio le attività giuste.','Puoi cambiare il tuo nome utente quando vuoi.','Guarda il Percorso: ogni esperienza verificata ti avvicina alla prossima corona.'],
 paese:['Ogni presenza fa crescere il paese.','Il paese è di tutte e tutti: grazie di esserci!'],
 generic:['E boni siemmu!','Un passo alla volta si arriva lontano.','Cca si sta bene insieme.']
};
function mu(page,extra){
 const [m,t]=muSays(page,extra);
 return `<button type="button" class="mu-launch" popovertarget="mu-popover" aria-label="Apri i consigli di Mù">${pixelIcon(cowSprite(m))}<span>Mù</span></button>
 <aside id="mu-popover" class="mu-popover" popover aria-label="I consigli di Mù">
  <button type="button" class="secondary mu-close" popovertarget="mu-popover" popovertargetaction="hide" aria-label="Chiudi i consigli">×</button>
  <div class="mu-advice" role="button" tabindex="0" aria-label="Mù: prossimo consiglio" data-tips="${esc(JSON.stringify([t,...(MU_TIPS[page]||[]),...MU_TIPS.generic]))}" data-i="0">
   ${cowMascot(m,t)}<span class="muted">Tocca per un altro consiglio</span>
  </div>
 </aside>`;
}
function advanceMu(el){
 const tips=JSON.parse(el.dataset.tips);
 const i=(Number(el.dataset.i)+1)%tips.length;
 el.querySelector('.mascot p').textContent=tips[i];
 el.dataset.i=i;
}
document.addEventListener('click',event=>{
 const popup=event.target.closest('#mu-popover');
 if(!popup||event.target.closest('button,a'))return;
 advanceMu(popup.querySelector('.mu-advice'));
});
document.addEventListener('keydown',event=>{
 if(!event.target.matches('.mu-advice')||!['Enter',' '].includes(event.key))return;
 event.preventDefault();
 advanceMu(event.target);
});

function nextTip(el){
 if(!el||!el.dataset.tips)return;
 let tips;try{tips=JSON.parse(el.dataset.tips);}catch{return;}
 const i=(Number(el.dataset.i)+1)%tips.length,p=el.querySelector('p');
 el.dataset.i=i;p.classList.add('tip-out');
 setTimeout(()=>{p.textContent=tips[i];p.classList.remove('tip-out');},220);
}
setInterval(()=>{if(document.hidden)return;document.querySelectorAll('.mascot.talk').forEach(nextTip);},12000);
document.addEventListener('click',e=>{const m=e.target.closest('.mascot.talk');if(m)nextTip(m);});
document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches?.('.mascot.talk')){e.preventDefault();nextTip(e.target);}});

const halfway=m=>m.value>=Math.ceil(m.target/2);
function villageScene(metrics){
 const reached=(metrics||[]).filter(halfway);
 return `<div class="village"><img class="scenery-day" src="sicani.svg" alt="Paese pixel ispirato a Cammarata e San Giovanni Gemini"><img class="scenery-night" src="sicani-notte.svg" alt="" aria-hidden="true"><div aria-hidden="true">${reached.map(m=>pixelIcon(shapes[m.icon])).join('')}</div></div>`;
}
function villageCard(metrics){
 if(!metrics)return '';
 const n=metrics.filter(halfway).length;
 return section('U paisi crisci',card(villageScene(metrics)+`<p>${n} ${n===1?"traguardo":"traguardi"} su ${metrics.length}. Il paese cresce con le presenze, le attività e le missioni fatte insieme.</p>${link('Guarda i numeri','paese')}`));
}
async function paese(){
 const metrics=await getCommunity();
 if(!metrics)throw new Error('I numeri del paese non sono disponibili.');
 const n=metrics.filter(halfway).length;
 return title('U paisi crisci','I numeri veri dello spazio. Nessun dato personale: contano solo i totali.')+
  section('Il paese prende forma',card(villageScene(metrics)+`<p>${n} ${n===1?"traguardo":"traguardi"} su ${metrics.length}. Ogni traguardo (metà di un obiettivo) aggiunge un elemento al borgo.</p>`))+
  section('Indicatori della comunità',grid(metrics.map(m=>card(`<span class="eyebrow">${m.target?'OBIETTIVO '+m.target:'IN CRESCITA'}</span><strong class="metric">${m.value}${m.target?' / '+m.target:''}</strong><h3>${esc(m.label)}</h3><p>${esc(m.note)}</p>${m.target?`<progress value="${Math.min(m.target,m.value)}" max="${m.target}" aria-label="${esc(m.label)}"></progress>`:''}`)),'two'))+
  mu('paese',{reached:n,total:metrics.length});
}

const PATHS=[['studio','Studio e conoscenza','book'],['creativita','Creatività e cultura','camera'],['socialita','Socialità e comunità','heart'],['cittadinanza','Cittadinanza e partecipazione','star'],['solidarieta','Solidarietà e cura','plant']];
const pathInfo=id=>PATHS.find(p=>p[0]===id)||PATHS[4];
function skillPath(counts,types){
 const milestones=[1,3,5];
 return section('Percorso delle competenze',`<p class="section-intro">Ogni unità ha tre corone, a 1, 3 e 5 esperienze verificate.</p>
 <ol class="skill-path">${PATHS.map(([id,name,icon],index)=>{
  const n=counts[id]||0,next=milestones.find(x=>x>n);
  const crowns=milestones.map(x=>`<li class="skill-crown ${n>=x?'earned':x===next?'next':''}">${pixelIcon(shapes.crown)}<span>${x} <small>${n>=x?'Ottenuta':x===next?'Prossima':'Da ottenere'}</small></span></li>`).join('');
  const linked=types.filter(t=>t.path===id);
  return `<li class="skill-unit">${pixelIcon(shapes[icon],'skill-marker')}${card(`<span class="eyebrow">UNITÀ ${index+1}</span><h3>${esc(name)}</h3><p><strong>${n} ${n===1?'esperienza verificata':'esperienze verificate'}</strong> · ${next?`Ne ${next-n===1?'manca 1':'mancano '+(next-n)} alla prossima corona`:'Tutte le corone ottenute'}</p><ol class="skill-crowns" aria-label="Corone di ${esc(name)}">${crowns}</ol>
  ${id==='socialita'?'<p class="muted">Contano anche le presenze verificate alle attività.</p>':''}
  ${linked.length?`<details class="disclosure"><summary>Missioni dell’unità</summary><ul>${linked.map(t=>`<li>${esc(t.name)}</li>`).join('')}</ul>${link('Vai alle missioni','missioni')}</details>`:''}`,'skill-card')}</li>`;
 }).join('')}</ol>`);
}

function checkLevelUp(){
 if(!S.me)return;
 const key='lvl-dairy-'+S.me.id,n=level(S.totals.xp).number,old=Number(pref.get(key,0));
 pref.set(key,n);
 if(old&&n>old)celebrate(n);
}
function celebrate(n){
 let box=document.querySelector('#celebration');
 if(!box){box=document.createElement('div');box.id='celebration';document.body.append(box);}
 const l=LEVELS[n-1];
 const colors=['#B30016','#B30016','#bdd9da','#FFD400','#FFD400'];
 const bits=Array.from({length:18},(_,i)=>`<i style="left:${(i*37)%100}%;background:${colors[i%5]};animation-delay:${(i%6)*90}ms"></i>`).join('');
 box.className='celebration';box.setAttribute('role','dialog');box.setAttribute('aria-label','Hai raggiunto un nuovo livello');
 box.innerHTML=`<div class="celebration-card"><div class="confetti" aria-hidden="true">${bits}</div><span class="eyebrow">NUOVO LIVELLO</span><h2>Livello ${n}: ${esc(l[0])}</h2>${cowMascot(n===LEVELS.length?'festoso':'felice',n===LEVELS.length?'Gran riserva! Un percorso da festeggiare insieme!':'Complimenti! Un altro passo per far crescere lo spazio.')}<button type="button" class="btn">Evviva!</button></div>`;
 box.hidden=false;
 const close=()=>{box.hidden=true;document.removeEventListener('keydown',esc_);};
 const esc_=e=>{if(e.key==='Escape')close();};
 document.addEventListener('keydown',esc_);
 const b=box.querySelector('button');b.onclick=close;b.focus();
}


/* ---- comunità: trofei, Putìa, banca del tempo, proposte ---- */
const ARTS=[['star','Stella'],['pin','Spilla'],['book','Libro'],['bag','Borsa'],['shirt','Maglietta'],['heart','Cuore'],['plant','Pianta'],['camera','Foto']];
const dayLong=sec=>fmt(sec,{day:'numeric',month:'long',year:'numeric'});
function timeBankCard(){
 return card(`<div class="feature-heading">${pixelIcon(navIcons.comunita)}<h3>Banca del tempo</h3></div><p>Metti a disposizione un’ora di quello che sai fare o chiedi una mano a un’altra persona dello spazio.</p>${link('Apri la Banca del tempo','banca')}`,'time-bank');
}
async function comunita(){
 if(!S.me)return needLogin();
 const [tr,prop]=await Promise.all([api('/trophies').catch(()=>({trophies:[]})),api('/proposals').catch(()=>({proposals:[]}))]);
 const got=tr.trophies.filter(t=>t.earned).length;
 const open=prop.proposals.filter(p=>p.status==='open').length;
 return title('Comunità','Scambia competenze, porta un’idea e partecipa alle decisioni dello spazio.')+await achievementBoard()+
 section('Partecipa alla vita dello spazio',grid([
  timeBankCard(),
  card('<span class="eyebrow">DECIDERE INSIEME</span><h3>Assemblea e decisioni</h3><p>Il prossimo incontro, l’ordine del giorno e le decisioni prese insieme.</p>'+link('Vai all’assemblea','assemblea')),
  card(`<span class="eyebrow">LE IDEE DEL GRUPPO</span><h3>Proposte e consultazioni</h3><p>${open} proposte aperte. Proponi un’attività o indica le idee che ti interessano.</p>${link('Proponi e vota','proposte')}`)
 ],'two'))+
 villageCard(await getCommunity())+
 section('Ricompense e percorso personale',`<div class="support-links"><a href="#putia">A Putìa · ${tumazzi(S.totals.cheese)} →</a><a href="#trofei">Trofei · ${got}/${tr.trophies.length} →</a><a href="#presenze">Le mie statistiche →</a></div>`)+mu('home');
}
async function trofei(){
 if(!S.me)return needLogin();
 const {trophies}=await api('/trophies');
 const groups=[...new Set(trophies.map(t=>t.group))];
 const got=trophies.filter(t=>t.earned).length;
 return title('Trofei',`${got} su ${trophies.length} conquistati. Arrivano da soli quando i dati verificati raggiungono la soglia, e ti avvisiamo anche per email.`)+
 await teamTrophies()+(S.trophies=trophies,groups.map(g=>section(g,grid(trophies.filter(t=>t.group===g).map(t=>card(`<div class="${t.earned?'':'locked'}">${art(t.icon)}</div><h3>${esc(t.name)}</h3><p>${esc(t.desc)}</p>${t.earned?`<p>${badge('Ottenuto')} <span class="muted">${dayLong(t.awardedAt)}</span></p>`:`<p>${badge('Bloccato')}</p><progress value="${t.count}" max="${t.target}" aria-label="Progresso: ${esc(t.name)}"></progress><p class="muted">${t.count} / ${t.target}</p>`}${btn(t.earned?'Apri il trofeo':'Come si sblocca','trophy',t.id,{secondary:true})}${t.earned?btn('Condividi trofeo','share-trophy',t.id):''}`,t.earned?'green':'')),'three'))).join(''));
}
async function putia(){
 if(!S.me)return needLogin();
 const [rw,rd]=await Promise.all([api('/rewards'),api('/redemptions')]);
 const bal=rw.balance;
 const list=rw.rewards.filter(r=>r.active);
 return title('A Putìa','Il negozietto dello spazio: spendi i Tumazzi guadagnati in premi. Si ritirano in sede.')+
 section('Il mio saldo',card(`<div class="stat-figure">${pixelIcon(cheese)}<strong class="metric">${tumazzi(bal)}</strong></div><p class="muted">${rw.earned} guadagnati · ${rw.spent} spesi</p>`))+
 section('Premi',list.length?grid(list.map(r=>{
  const out=r.stock!==null&&r.stock<=0,poor=bal<r.cost;
  return card(`${art(r.art)}<h3>${esc(r.name)}</h3><p>${esc(r.description)}</p><p><strong>${tumazzi(r.cost)}</strong>${r.stock!==null?` · ${out?'esaurito':`${r.stock} disponibili`}`:''}</p>${out?badge('Esaurito'):poor?`<p class="muted">Ti mancano ${tumazzi(r.cost-bal)}.</p>`:btn('Riscatta','redeem',r.id)}`);
 }),'three'):card('<p>I referenti non hanno ancora messo premi in vetrina.</p>'))+
 section('I miei riscatti',rd.redemptions.length?card(`<ul class="list">${rd.redemptions.map(x=>`<li><strong>${esc(x.rewardName)}</strong> · ${x.cost} F. · ${dateShort(x.createdAt)} · ${badge(x.status==='pending'?'Da ritirare':x.status==='delivered'?'Consegnato':'Annullato')}${x.status==='pending'?` ${btn('Annulla','redeemCancel',x.id,{secondary:true})}`:''}</li>`).join('')}</ul>`):card('<p>Non hai ancora riscattato nulla.</p>'))+
 `<p class="muted">Ogni premio riscattato ti arriva anche via email, con le istruzioni per il ritiro.</p>`;
}
async function banca(){
 if(!S.me)return title('Banca del tempo','Un’ora del tuo tempo vale quanto un’ora di chiunque altro.')+
  card('<h2>Come funziona</h2><p>Offri un’ora di quello che sai fare, per esempio ripetizioni, fotografia o riparazioni. Puoi anche chiedere un’ora a chi ha pubblicato un’offerta.</p>'+link('Accedi per scambiare tempo','accedi/banca'));

 const d=await api('/time-offers');
 const mine=d.offers.filter(o=>o.mine),others=d.offers.filter(o=>!o.mine);
 const statusLabel={requested:'In attesa',accepted:'Accettata',done:'Conclusa'};
 return title('Banca del tempo',`Offri un’ora di qualcosa che sai fare e chiedi l’ora di qualcun altro. Ogni scambio concluso vale ${d.reward.xp} XP e ${tumazzi(d.reward.cheese)} a testa (massimo ${d.reward.weekly} premiati a settimana).`)+
 `<div class="row subpage-back"><a class="btn" href="#banca/offri">Offri un’ora ↓</a><a class="btn" href="#banca/scambi">I miei scambi ↓</a></div>`+
 section('Offerte dei soci',others.length?grid(others.map(o=>card(`<h3>${esc(o.title)}</h3><p>${esc(o.description)}</p><p class="muted">di ${esc(o.memberName)}</p>${o.myStatus?badge(statusLabel[o.myStatus]):form('request',field('note','Un messaggio (facoltativo)','text','maxlength="300"').replace(' required',''),'Chiedi quest’ora',{id:o.id,cls:'inline-form'})}`)),'two'):card('<p>Ancora nessuna offerta. Pubblica la prima!</p>'))+
 section('I miei scambi',d.exchanges.length?card(`<ul class="list">${d.exchanges.map(x=>{
  const owner=x.ownerId===S.me.id;
  const who=owner?`${esc(x.requesterName)} chiede la tua ora`:`La tua richiesta a ${esc(x.ownerName)}`;
  const acts=x.status==='requested'?(owner?btn('Accetta','xAccept',x.id)+' '+btn('Rifiuta','xDecline',x.id,{secondary:true}):btn('Annulla','xCancel',x.id,{secondary:true})):x.status==='accepted'?(owner?'<span class="muted">Dopo l’incontro, chi ha ricevuto l’ora la conferma.</span> '+btn('Annulla','xCancel',x.id,{secondary:true}):btn('Ho ricevuto l’ora','xDone',x.id)+' '+btn('Annulla','xCancel',x.id,{secondary:true})):'';
  return `<li><strong>${esc(x.offerTitle)}</strong> · ${who} · ${badge(statusLabel[x.status])}${x.note?`<br><span class="muted">${esc(x.note)}</span>`:''}${acts?`<div class="row">${acts}</div>`:''}</li>`;}).join('')}</ul>`):card('<p>Nessuno scambio in corso.</p>'),'','time-exchanges')+
 section('Le mie offerte',(mine.length?grid(mine.map(o=>card(`<h3>${esc(o.title)}</h3><p>${esc(o.description)}</p>${btn('Chiudi l’offerta','offerClose',o.id,{secondary:true})}`)),'two'):'')+form('offer','<h3>Offri un’ora</h3>'+field('title','Cosa offri (es. ripetizioni di inglese)','text','required maxlength="80"')+field('description','Dettagli (facoltativo)','text','maxlength="400"').replace(' required',''),'Pubblica l’offerta'),'','time-offer');
}
async function proposte(){
 if(!S.me)return needLogin();
 const d=await api('/proposals');
 const open=d.proposals.filter(p=>p.status==='open'),closed=d.proposals.filter(p=>p.status!=='open');
 const org=isOrganizer();
 const item=p=>card(`<h3>${esc(p.title)}</h3><p>${esc(p.description)}</p><p class="muted">di ${esc(p.memberName)} · ${dateShort(p.createdAt)}</p><p><strong>${p.votes}</strong> ${p.votes===1?'voto':'voti'}</p>${p.status==='open'?`${p.mine?badge('La tua proposta'):btn(p.voted?'Togli il voto':'Vota','vote',p.id,{secondary:p.voted,extra:`data-on="${p.voted?0:1}"`})}${org?form('schedule',field('startsAt','Quando','datetime-local','required'),'Crea bozza nel calendario',{id:p.id,cls:'inline-form'})+btn('Non accolta','pdecline',p.id,{secondary:true}):''}`:badge(p.status==='scheduled'?'In programmazione':'Non accolta')}`);
 return title('Proposte e consultazioni','I voti online raccolgono orientamenti. L’assemblea decide su regole e priorità. Il gruppo operativo organizza turni e calendario.')+
 card(link('Assemblea e decisioni','assemblea'))+
 section('Consultazioni aperte',open.length?grid(open.map(item),'two'):card('<p>Nessuna proposta aperta. Fatti avanti!</p>'))+
 section('Fai una proposta',form('proposal','<h3>Un’idea per lo spazio</h3>'+field('title','Titolo','text','required maxlength="100"')+field('description','Descrivila in due righe','text','maxlength="600"').replace(' required',''),'Pubblica la proposta'))+
 (closed.length?section('Già decise',grid(closed.map(item),'two')):'');
}

const decisionStates={planned:'Da avviare',in_progress:'In corso',done:'Completata'};
async function assemblea(){
 if(!S.me)return needLogin();
 const {meeting,decisions}=await api('/assembly');
 const upcoming=meeting?.startsAt>Date.now()/1000;
 return title('Assemblea e decisioni','L’assemblea dei giovani decide sulle regole e sulle priorità. Il gruppo operativo coordina turni e calendario.')+
 section('Prossima assemblea',card(upcoming
  ? `<h3>${dateLong(meeting.startsAt)}</h3><p>${esc(meeting.location)}</p><p><strong>Ordine del giorno</strong></p><p class="meeting-notes">${esc(meeting.agenda)}</p>`
  : '<p>La prossima data sarà pubblicata qui.</p>'))+
 section('Decisioni dell’assemblea',decisions.length?grid(decisions.map(d=>card(
  `<p>${dayLong(Date.parse(d.decidedOn+'T12:00:00Z')/1000)} · ${badge(decisionStates[d.status])}</p><h3>${esc(d.title)}</h3>
   <p class="meeting-notes"><strong>Decisione</strong><br>${esc(d.decision)}</p>
   <p class="meeting-notes"><strong>Perché</strong><br>${esc(d.reason)}</p><p><strong>Chi se ne occupa</strong><br>${esc(d.responsible)}</p>`
 )),'two'):card('<p>Le sintesi delle decisioni saranno raccolte qui.</p>'))+
 card('<p>Usa le consultazioni per proporre idee o indicare le tue preferenze.</p>'+link('Proposte e consultazioni','proposte'))+
 (isOrganizer()? `<p>${link('Gestisci l’assemblea','referenti/assemblea')}</p>`:'');
}

/* ---- viste pubbliche ---- */
const venueAddress='Corso Francesco Crispi 34, San Giovanni Gemini';
const activityDescription=a=>`<details class="activity-description"><summary>Descrizione</summary><p>${esc(a.description||'La descrizione non è ancora disponibile.')}</p></details>`;
const activityBadges=a=>badge(a.access_mode==='open'?'Accesso libero':'Su prenotazione')+(a.public_event?' '+badge('Evento pubblico'):'');
const nextActivity=activities=>activities.find(a=>a.starts_at>Date.now()/1000);
const visitInfo=async()=>{try{return (await api('/space/visit')).visit;}catch{return null;}};
function firstVisit(st,details,upcoming){
 return section('Vieni per la prima volta',card(`
  <div class="grid two">
   <div><h3>Dove e quando</h3><p>${esc(details?.address||venueAddress)}</p><p class="muted">alla partenza del Carro</p>${openingDetails(st)}</div>
   <div><h3>Prossima attività</h3>${upcoming?`<p><strong>${esc(upcoming.name)}</strong><br>${activityDate(upcoming.starts_at)}</p><p>${activityBadges(upcoming)}</p>${activityDescription(upcoming)}`:'<p>Consulta il calendario per i prossimi appuntamenti.</p>'}</div>
   <div><h3>Come si entra</h3><p class="meeting-notes">${esc(details?.access||'Lo spazio è gratuito. Il calendario indica se puoi presentarti direttamente o se serve prenotare.')}</p></div>
   <div><h3>Accessibilità</h3><p class="meeting-notes">${details?.accessibility?esc(details.accessibility)+' ':''}Per informazioni sull’accesso alla sede, <a href="mailto:spaziogiovanigenerazioni@gmail.com">scrivici</a> prima di venire.</p></div>
  </div>
  <div class="row">${link('Apri il calendario','calendario')}</div>`,'visit-card'));
}
function homeIntro(){
 const artLabel='Cammarata e San Giovanni Gemini ai piedi di Monte Cammarata, in pixel art';
 return `<header class="hero home-hero ${S.me?'member-hero':''}"><div class="hero-copy"><span class="eyebrow">CAMMARATA + SAN GIOVANNI GEMINI</span><h1>CCA SIEMMU</h1>
 <p class="hero-motto">E boni siemmu</p><p class="hero-local">Uno spazio gratuito per incontrarsi, studiare e far nascere idee insieme.</p>
 <div class="row">${link('Apri il calendario','calendario')} ${link(S.me?'Vai alle missioni':'Accedi o chiedi un invito',S.me?'missioni':'accedi')}</div>
 ${S.me?'':'<p class="entry-hint">Il calendario si apre senza account.</p>'}</div>
 <div class="home-scenery"><img class="scenery-day" src="sicani.svg" alt="${artLabel}"><img class="scenery-night" src="sicani-notte.svg" alt="${artLabel} di notte"></div></header>
 ${!S.me?`<section class="space-signpost"><div><span class="eyebrow">LO SPAZIO GIOVANI</span><h2>Un posto da usare, uno spazio da fare insieme</h2>
 <p>Aula studio, laboratori tra pari e idee da portare in assemblea. Per chi ha dai 14 ai 30 anni a Cammarata e San Giovanni Gemini.</p></div>${link('Vieni per la prima volta?','spazio')}</section>`:''}`;
}
const wheelArt=`<div class="wheel-stage" aria-hidden="true"><svg class="wheel-disc" viewBox="0 0 64 64" shape-rendering="crispEdges"><path fill="#111" d="M20 0h24v4h8v8h8v8h4v24h-4v8h-8v8h-8v4H20v-4h-8v-8H4v-8H0V20h4v-8h8V4h8z"/><path fill="#FFD400" d="M20 6h24v6h8v8h6v24h-6v8h-8v6H20v-6h-8v-8H6V20h6v-8h8z"/><path fill="#B30016" d="M30 6h4v24h24v4H34v24h-4V34H6v-4h24zM14 12l38 38-4 4-38-38zM48 10l6 6-38 38-6-6z"/><path fill="#111" d="M24 24h16v16H24z"/><path fill="#FFF" d="M28 28h8v8h-8z"/></svg><span class="wheel-pointer">▼</span></div>`;
const dailyText=p=>p.kind==='xp'?'Hai trovato 5 XP!':p.kind==='boost'?'Moltiplicatore XP ×2 attivo fino a mezzanotte.':'Una curiosità dai Sicani';
async function dailyWheelPanel(){
 if(!S.me)return '';
 try{
  const {prize}=await api('/my/daily-wheel');
  return section('Ruota del giorno',card(wheelArt+(prize?`<h3>${dailyText(prize)}</h3>${prize.curiosity?`<p>${esc(prize.curiosity.text)}</p><a href="${esc(prize.curiosity.source)}" target="_blank" rel="noopener">Leggi la fonte · Italia.it ↗</a>`:''}<p class="muted">Il risultato di oggi è salvato nel tuo account. Riaprire l’app non lo cambia.</p>`:`<h3>Una sorpresa, se ti va</h3><p>Un solo giro al giorno per account, gratuito. Nessun tentativo extra e nessuna penalità se salti un giorno.</p>${btn('Gira la ruota del giorno','spin-wheel')}`)+`<details class="disclosure"><summary>Premi e probabilità</summary><p>Tre esiti equiprobabili (1 su 3): 5 XP, una curiosità storica, oppure XP ×2 sulle missioni individuali convalidate oggi. Il moltiplicatore aggiunge al massimo 50 XP al giorno; non raddoppia Tumazzi, premi della ruota, imprese o altre ricompense. Scade a mezzanotte, ora italiana.</p><p>Gli XP delle attività restano disponibili anche senza girare. Nessun acquisto, premio in denaro o classifica.</p></details>`,'daily-wheel'));
 }catch{return '';}
}
const teamStates={forming:'Squadra in formazione',ready:'Impresa attiva',completed:'Impresa completata',cancelled:'Impresa annullata'};
async function teamPanel(staff=false){
 try{
  const {quests,roster}=await api('/team-quests');
  const cards=quests.map(q=>{
   const people=roster.filter(r=>r.quest_id===q.id);
   let action='';
   if(staff){
    if(q.status==='ready'&&!people.some(r=>r.member_id===S.me.id))action=form('team-complete',`<p>Iscritti: ${people.map(r=>esc(r.pseudonym)).join(', ')}.</p><label><input type="checkbox" name="verified" required> Ho verificato dal vivo la partecipazione di tutta la squadra e il completamento del lavoro.</label>`,'Convalida impresa e assegna bonus',{id:q.id,cls:'plain'});
    if(q.status==='ready'&&people.some(r=>r.member_id===S.me.id))action+='<p class="muted">Fai parte della squadra: la convalida spetta a un altro referente.</p>';
    if(['forming','ready'].includes(q.status))action+=btn('Annulla impresa','team-cancel',q.id,{secondary:true});
   }else{
    if(q.status==='forming'&&!q.mine)action=btn('Unisciti alla squadra','team-join',q.id);
    if(q.mine&&['forming','ready'].includes(q.status))action+=btn('Ritira iscrizione','team-leave',q.id,{secondary:true});
   }
   return card(`<span class="eyebrow">IMPRESA DI SQUADRA</span><h3>${esc(q.title)}</h3><p>${badge(teamStates[q.status])} · ${q.joined}/${q.needed} persone</p><progress value="${q.joined}" max="${q.needed}" aria-label="Iscrizioni per ${esc(q.title)}"></progress><details class="disclosure"><summary>Obiettivo e ricompensa</summary><p>${esc(q.description)}</p><p>Bonus per persona: ${q.xp} XP e trofeo «${esc(q.badge)}», dopo convalida di un referente esterno alla squadra.</p></details>${q.status==='ready'?'<p>La squadra è completa: concordate lo svolgimento con il referente. L’iscrizione non assegna punti.</p>':''}${q.mine?'<p class="muted">Sei nella squadra.</p>':''}${action}`);
  });
  const create=staff?`<details class="disclosure"><summary>Crea un’impresa di squadra</summary>${form('team-create',field('title','Titolo','text','required maxlength="100" placeholder="Pulizia straordinaria del cortile"')+textArea('description','Lavoro, luogo e indicazioni pratiche',600,'',true)+field('needed','Persone necessarie','number','required min="2" max="20" value="4"')+field('xp','Bonus XP per persona','number','required min="0" max="100" value="40"')+field('badge','Nome del trofeo squadra','text','required maxlength="60" placeholder="Mastri d’Ascia"'),'Pubblica impresa',{cls:'plain'})}</details>`:'';
  return section(staff?'Gestisci imprese di squadra':'Imprese di squadra',`<p>Si attivano quando tutti i posti sono occupati da iscrizioni attive. Prima della convalida, un ritiro riapre la squadra. Premi solo dopo il lavoro reale.</p>${create}${cards.length?grid(cards,'two'):(staff?'':card('<p>Non ci sono imprese aperte.</p>'))}`);
 }catch{return card('<p>Le imprese non sono disponibili al momento. Riprova tra poco.</p>');}
}
async function teamTrophies(){
 const {badges}=await api('/team-quests');
 return section('Trofei di squadra',badges.length?grid(badges.map(b=>card(`${art('star')}<h3>${esc(b.name)}</h3><p>Conquistato con la tua squadra, dopo la verifica del referente.</p><p class="muted">${dayLong(b.awarded_at)}</p>`)),'two'):card('<p>I trofei delle imprese completate compariranno qui.</p>'));
}
let loggedAppDay='';
async function recordAppDay(){
 if(!S.me||document.visibilityState==='hidden')return;
 const key=S.me.id+'-'+new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Rome'}).format(new Date());
 if(loggedAppDay===key)return;
 try{await api('/my/app-visit',{method:'POST',body:{}});loggedAppDay=key;}catch{}
}
function getStreaks(){return api('/my/streaks').catch(()=>null);}
function streakPanel(d){
 return `<section class="card streak-compact" aria-labelledby="streak-title"><h2 id="streak-title">Giorni consecutivi</h2>${d?`<div class="streak-strip">
  <div>${pixelIcon(navIcons.calendario)}<strong>${d.app.current}</strong><span>App<small>Record ${d.app.best}</small></span></div>
  <div>${pixelIcon(navIcons.home)}<strong>${d.sede.current}</strong><span>In sede<small>Record ${d.sede.best}</small></span></div></div>
  <details><summary>Come contano i giorni</summary><p>Conta una visita all’app al giorno. Per la sede contano gli ingressi da lunedì a venerdì. Se salti un giorno, XP e record restano tuoi.</p></details>`:'<p class="muted">Contatori temporaneamente non disponibili.</p>'}</section>`;
}
function presenceCta(pres,mission=false){
 if(!pres)return card('<p>Presenza non disponibile. Riprova.</p>'+btn('Riprova','reload'));
 if(pres.inside)return `<section class="presence-focus is-inside"><div><strong>✓ Sei in sede</strong><span class="muted"> dalle ${fmt(pres.since,{hour:'2-digit',minute:'2-digit'})}</span></div>${mission?'':`<a class="btn presence-main" href="#missioni">Scegli una missione →</a>`}${btn('Registra uscita','checkout','',{secondary:true})}</section>`;
 return `<section class="presence-focus"><h2>Sei in sede?</h2>${btn('Fai il check-in in sede','checkin')}<p class="muted">Solo quando sei fisicamente in sede.</p></section>`;
}
async function achievementBoard(){
 try{
  const {latest}=await api('/achievement-board');
  return section('Bacheca dei traguardi',card(latest?`<span class="eyebrow">L’ULTIMO TRAGUARDO CONDIVISO</span><h3>${esc(latest.pseudonym)}</h3><p>Ha conquistato <strong>${esc(latest.trophy)}</strong>. Festeggiamo insieme!</p>`:'<h3>Il prossimo traguardo può essere il tuo</h3><p>Nessun traguardo condiviso per ora. La partecipazione alla bacheca è facoltativa.</p>')+'<p class="muted">Bacheca pubblica, senza classifica. Solo pseudonimo e trofeo, dopo il consenso nel Profilo. Nessun orario o elenco delle presenze.</p>');
 }catch{return '';}
}
async function home(){
 const [st,community,details,acts]=await Promise.all([getStatus(),api('/community').catch(()=>null),visitInfo(),api('/activities').catch(()=>({activities:[]}))]);
 return homeIntro()+monthlyGoal(community?.monthlyGoal)+await achievementBoard()+firstVisit(st,details,nextActivity(acts.activities))+
  section('Quando siamo aperti',openingCard(st))+
  section('Scambia tempo e competenze',timeBankCard())+
  section('Come funziona',grid([
   card('<h3>Vieni in sede</h3><p>Ingresso e uscita vengono registrati dai referenti: così sappiamo quante ore lo spazio resta vivo.</p>'),
   card('<h3>Partecipa</h3><p>Prenota le attività del calendario e dai una mano con le missioni: ogni impegno verificato vale XP e Tumazzi.</p>'),
   card('<h3>Cresci</h3><p>Sali di livello, guarda le tue presenze e contribuisci a far crescere lo spazio.</p>')
  ]))+mu('home');
}
function homeShortcuts(){
 const personal=[
  ['Prenota un’attività','calendario'],['Missioni','missioni'],['A Putìa','putia'],
  ['Banca del tempo','banca'],['Proposte e voti','proposte'],['Assemblea e decisioni','assemblea'],
  ['Trofei','trofei'],['Diario Youthpass','profilo/diario'],['Interessi e avatar','profilo'],
  ['Statistiche personali','presenze'],['Orari e sede','spazio']
 ];
 const staff=[
  ['Prenotazioni e presenze agli eventi','referenti/attivita'],
  ['Convalida missioni','referenti/missioni'],['Soci e inviti','referenti/soci'],
  ['Ingressi e uscite','referenti/presenze'],['Consegna ricompense','referenti/putia'],
  ['Convocazioni e decisioni','referenti/assemblea'],['Informazioni della sede','referenti/sede'],
  ['Statistiche della sede','referenti/statistiche']
 ];
 const links=items=>items.map(([name,route])=>`<a href="#${route}">${name}<span aria-hidden="true"> →</span></a>`).join('');
 return `<nav class="home-shortcuts" aria-label="Accessi rapidi">
  <h2>Cosa vuoi fare?</h2><div class="shortcut-links shortcut-primary">${links(personal.slice(0,3))}</div>
  <details class="shortcut-more"><summary>Comunità, percorso e informazioni</summary><div class="shortcut-links">${links(personal.slice(3))}</div></details>
  ${isOrganizer()?`<h3>Per i referenti</h3><div class="shortcut-links">${links(staff)}</div>`:''}
 </nav>`;
}

async function homeMember(){
 const [acts,mine,st,pres,details,progress,streak,community]=await Promise.all([api('/activities'),api('/my/bookings'),getStatus(),api('/checkin').catch(()=>null),visitInfo(),api('/my/progress').catch(()=>({firstVisitCompleted:false})),getStreaks(),api('/community').catch(()=>null)]);
 const booked=new Map(mine.bookings.map(b=>[b.activityId,b.status]));
 const upcoming=acts.activities.filter(a=>a.starts_at>Date.now()/1000-3600).slice(0,3);
 let extra='';
 if(isOrganizer()){
  const [inside,pending]=await Promise.all([api('/inside'),api('/chores?status=pending')]);
  const waiting=pending.chores.filter(c=>c.memberId!==S.me.id).length;
  extra=`<section class="admin-compact"><h2>Da gestire</h2><div class="admin-chips"><a href="#referenti/presenze">${pixelIcon(navIcons.comunita)}<strong>${inside.presenti.length}</strong><span>In sede →</span></a><a href="#referenti/missioni">${pixelIcon(navIcons.missioni)}<strong>${waiting}</strong><span>Da verificare →</span></a></div></section>`;
 }
 return homeIntro()+presenceCta(pres)+
 `<div class="grid stats home-stats" aria-label="Personaggio, Tumazzi, orari e giorni consecutivi">${card(profileChip()+`<a class="profile-wallet" href="#putia" aria-label="${tumazzi(S.totals.cheese)} · apri A Putìa">${pixelIcon(cheese)}<span>Tumazzi</span><strong>${S.totals.cheese}</strong></a>`,'profile-stat')}
 ${openingCard(st)}${streakPanel(streak)}</div>`+
 monthlyGoal(community?.monthlyGoal)+homeShortcuts()+extra+await dailyWheelPanel()+await achievementBoard()+
 (progress.firstVisitCompleted?'':firstVisit(st,details,nextActivity(acts.activities)))+
 section('Scambia tempo e competenze',timeBankCard())+
 section('Prossime attività',upcoming.length?grid(upcoming.map(a=>card(`<h3>${esc(a.name)}</h3><p>${activityDate(a.starts_at)}</p><p>${a.access_mode==='open'?'Accesso libero':a.available>0?`${a.available} posti liberi`:'Posti esauriti'}</p>${booked.has(a.id)?badge(statusText[booked.get(a.id)]):''}${activityDescription(a)}`)),'three')+link('Tutto il calendario','calendario'):card('<p>Non ci sono attività in calendario.</p>'))+mu('home',{streak});
}

async function calendario(){
 const [acts,mine]=await Promise.all([api('/activities'),S.me?api('/my/bookings'):{bookings:[]}]);
 const booked=new Map(mine.bookings.map(b=>[b.activityId,b]));
 const list=acts.activities;
 const body=list.length?grid(list.map(a=>{
  const b=booked.get(a.id),active=b&&['pending','confirmed'].includes(b.status);
  let action='';
  if(a.access_mode==='open')action='<p>Puoi presentarti direttamente.</p>';
  else if(!S.me)action=link('Accedi per prenotare','accedi')+(a.public_event?' <a href="mailto:spaziogiovanigenerazioni@gmail.com">Chiedi come partecipare</a>':'');
  else if(active)action=`${badge(statusText[b.status])}<div class="row">${btn('Annulla prenotazione','cancel',a.id,{secondary:true})}</div>`;
  else if(a.available<=0)action=badge('Posti esauriti');
  else action=btn('Prenota un posto','reserve',a.id)+(b&&b.status==='declined'?`<p class="muted">La richiesta precedente è stata rifiutata.</p>`:'');
  const rec=S.me&&a.path&&(S.me.interests||[]).includes(a.path);
  return card(`${rec?`<p>${badge('Consigliata per te')}</p>`:''}<h3>${esc(a.name)}</h3><p><strong>${activityDate(a.starts_at)}</strong></p><p>${activityBadges(a)}</p>${a.access_mode==='open'?'':`<p>${Math.max(0,a.available)} posti liberi su ${a.capacity}</p>`}${activityDescription(a)}<p class="muted">${esc(a.verification_rule)}</p>${action}`);
 }),'two'):card('<h3>Ancora nulla in calendario</h3><p>I referenti pubblicheranno qui le prossime attività.</p>');
 return title('Calendario','Per le attività ad accesso libero puoi presentarti direttamente. Dove serve una prenotazione, un referente conferma il posto.')+section('Prossime attività',body)+
  (S.me?section('Come funziona',card('<p>Quando prenoti, il posto resta riservato finché un referente decide. Alla fine il referente verifica di persona la tua presenza e ti assegna XP e Tumazzi.</p>')):'')+mu('calendario');
}

async function spazio(){
 const [st,details,acts]=await Promise.all([getStatus(),visitInfo(),api('/activities').catch(()=>({activities:[]}))]);
 return title('Lo spazio','Un luogo gratuito pensato e gestito dai giovani di Cammarata e San Giovanni Gemini.')+
 firstVisit(st,details,nextActivity(acts.activities))+
 section('Chi può partecipare',grid([
  card('<h3>A chi si rivolge</h3><p>Il progetto si rivolge principalmente a chi ha tra 14 e 30 anni e vive nei due paesi. Puoi venire per studiare, incontrare altre persone o proporre un’attività.</p>'+link(S.me?'Apri il calendario':'Prima volta?',S.me?'calendario':'accedi')),
  card(`<h3>Come entri</h3><p>All’ingresso e all’uscita puoi usare il QR. Un referente può aiutarti o registrare la tua presenza con la tessera.</p>${link(S.me?'Le mie presenze':'Accedi',S.me?'presenze':'accedi')}`,'green')
 ],'space-visit'))+
 section('Come si partecipa',card('<h3>Dall’idea all’assemblea</h3><p>Puoi proporre un laboratorio, dare una mano con le missioni o portare una questione all’assemblea in sede. Ascolta chi usa lo spazio, rispetta le differenze e lascia in ordine i materiali comuni.</p>'))+
 section('Il paese',card(`<p>Guarda come cresce il borgo con le attività dello spazio.</p>${link('U paisi crisci','paese')}`))+
 section('Il progetto',card('<p>Cca Siemmu è promosso da Spazio Giovani Generazioni ed è finanziato dal Corpo europeo di solidarietà. Contatti: <a href="mailto:spaziogiovanigenerazioni@gmail.com">spaziogiovanigenerazioni@gmail.com</a>.</p>'));
}

const privacyLink='<a href="#privacy">Privacy e cookie</a>';
function privacy(){
 const mail='spaziogiovanigenerazioni@gmail.com',contact=`<a href="mailto:${mail}">${mail}</a>`;
 return title('Privacy e cookie','Come Cca Siemmu usa i dati di chi visita il sito o partecipa alle attività.')+
 section('Chi gestisce il sito',card(`<p>Il titolare del trattamento è APS/ASD Spazio Giovani Generazioni. Per domande o richieste sui tuoi dati scrivi a ${contact}.</p>`))+
 section('Quali dati usiamo e perché',grid([
  card('<h3>Accesso e partecipazione</h3><p>Puoi consultare le pagine pubbliche e il calendario senza account. Per attivare il profilo e gestire prenotazioni, presenze, missioni e ricompense, trattiamo i dati necessari al servizio che richiedi. Usiamo nome, email, pseudonimo, ruolo e stato dell’account, oltre ai registri delle attività che svolgi. Telefono, interessi e tessera sono facoltativi. Le password sono conservate come impronte crittografiche.</p>'),
  card('<h3>Comunità e Youthpass</h3><p>Se usi la Banca del tempo o pubblichi una proposta, gli altri soci vedono lo pseudonimo e ciò che pubblichi. Le note di uno scambio sono visibili alle persone coinvolte. Il diario Youthpass è accessibile dal tuo account e resta fuori dal pannello referenti. Puoi svuotarlo e salvare per cancellare il testo.</p>'),
  card('<h3>Sicurezza</h3><p>Per proteggere gli account e limitare tentativi di accesso abusivi trattiamo le informazioni tecniche necessarie, compresa l’email usata nei tentativi falliti. La finestra usata per limitare i tentativi è di 15 minuti.</p>'),
  card('<h3>Condivisione facoltativa</h3><p>La card dei progressi o dei trofei si crea sul tuo dispositivo. Contiene il traguardo scelto o il tuo livello e gli XP, con l’avatar selezionato. È priva di nome, email, diario e storico delle presenze. Sei tu a scegliere dove inviarla. Quando usi un’app esterna si applica l’informativa di quell’app.</p>')
 ],'two'))+
 section('Su quale base usiamo i dati',card('<p>Per gestire l’account e le funzioni di partecipazione usiamo i dati necessari a fornire il servizio richiesto. Per proteggere il sito e gli account, il trattamento si basa sul legittimo interesse alla sicurezza del servizio. Quando la legge impone di conservare o comunicare dati, il trattamento si basa su quell’obbligo.</p>'))+
 section('Chi può accedere ai dati',card('<p>I referenti autorizzati usano i dati di iscrizione e partecipazione per organizzare le attività. Il sito è ospitato su Cloudflare. Quando è configurato l’invio di email di servizio, i dati necessari alla consegna vengono trasmessi al fornitore di invio, Brevo o Resend. Le statistiche pubbliche sono aggregate.</p><p>Per informazioni sui fornitori, sui luoghi in cui trattano i dati e sulle garanzie applicate, contatta l’associazione.</p>'))+
 section('Per quanto tempo',card(`<p>La sessione dura fino a 30 giorni. Le notifiche in-app oltre 90 giorni vengono eliminate quando apri l’elenco. I dati di account e di attività sono conservati secondo il tempo necessario a gestire la partecipazione e gli eventuali obblighi di rendicontazione. Per conoscere i tempi applicati a un dato specifico o chiedere la cancellazione, scrivi a ${contact}.</p>`))+
 section('Imprese e ruota del giorno',card('<p>Per le missioni personali conserviamo presa in carico, eventuale abbandono, dichiarazione di completamento e decisione del referente. L’invio del completamento richiede un check-in attivo. Conserviamo le iscrizioni alle imprese, la convalida del referente, i bonus XP e i trofei assegnati. Solo i referenti vedono l’elenco degli iscritti; gli altri soci vedono il numero di posti occupati. La ruota è facoltativa: salviamo un esito per account e giorno, il bonus e la sua eventuale scadenza. Nessun pagamento o strumento di profilazione; l’esito non dipende dai dati personali.</p>'))+
 section('Serie e bacheca pubblica',card('<p>Con account attivo salviamo una sola apertura della webapp per giorno, per mostrarti la tua serie personale senza attribuire premi. Le serie in sede derivano dagli ingressi registrati. La bacheca pubblica è disattivata inizialmente: puoi attivarla nel Profilo per condividere pseudonimo e nuovi trofei legati ad attività reali. Puoi ritirare la scelta in ogni momento; il tuo traguardo non sarà più esposto. Non pubblichiamo email, orari, storico delle presenze o dati del diario.</p>'))+
 section('Cookie e dati nel browser',card('<p>Dopo l’accesso, il cookie tecnico <code>__Host-cca_session</code> mantiene la sessione. Scade entro 30 giorni e viene rimosso all’uscita dall’account. Il browser conserva anche le tue preferenze locali, come tema, suono e avatar, e può ricordare temporaneamente la pagina a cui tornare dopo l’accesso. Puoi eliminare questi dati dalle impostazioni del browser. Il sito non usa strumenti di analisi o profilazione pubblicitaria.</p>'))+
 section('I tuoi diritti',card(`<p>Puoi scrivere a ${contact} per chiedere accesso, rettifica, cancellazione o limitazione del trattamento e, quando applicabili, portabilità e opposizione. Se sei minorenne, puoi farti aiutare da un adulto di fiducia. Puoi presentare reclamo al <a href="https://www.garanteprivacy.it/">Garante per la protezione dei dati personali</a>.</p>`));
}

/* ---- accesso ---- */
function accedi(destination){
 if(S.me)return title('Sei già dentro',`Accesso effettuato come ${esc(S.me.pseudonym)}.`)+card(link('Vai alla Home','home'));
 return title('Accedi','Usa l’email con cui i referenti ti hanno registrato.')+
 grid([form('login',(destination==='banca'?'<input type="hidden" name="next" value="#banca">':'')+field('email','Email','email','required autocomplete="username"')+field('password','Password','password','required autocomplete="current-password"'),'Accedi'),
  card('<h3>Prima volta?</h3><p>Non ti puoi iscrivere da solo: un referente ti registra in sede e ti invia un link per scegliere la password. Se non l’hai ricevuto, chiedi di rigenerarlo.</p><p>'+privacyLink+'</p>')],'two');
}
async function impostaPassword(token){
 if(!token)return title('Link non valido','')+card('<p>Il link è incompleto.</p>'+link('Accedi','accedi'));
 let info;
 try{info=await api('/auth/token?token='+encodeURIComponent(token));}
 catch(e){return title('Link non valido','')+card(`<p>${esc(e.message)}</p><p>Chiedi a un referente di generarne uno nuovo.</p>${link('Accedi','accedi')}`);}
 return title(info.purpose==='reset'?'Nuova password':'Benvenutə',`Ciao ${esc(info.name)}, scegli la tua password per completare il profilo.`)+
 form('setpw',`<input type="hidden" name="token" value="${esc(token)}">`+field('password','Password (almeno 10 caratteri)','password','required minlength="10" autocomplete="new-password"')+field('again','Ripeti la password','password','required minlength="10" autocomplete="new-password"'),'Salva e accedi');
}

/* ---- missioni ---- */
let missionCatalog=[],missionJobs=[],missionPresence=null,missionLegacyPending=[];
let missionCategory='recommended',missionPage=0,missionSearch='';
function availableMissions(){
 const busy=new Set([...missionJobs.filter(j=>['in_progress','submitted'].includes(j.state)).map(j=>j.type_id),...missionLegacyPending]);
 let choices=missionCatalog.filter(t=>t.active&&!busy.has(t.id));
 if(missionCategory!=='recommended')choices=choices.filter(t=>t.path===missionCategory);
 if(missionSearch)choices=choices.filter(t=>t.name.toLocaleLowerCase('it').includes(missionSearch.toLocaleLowerCase('it')));
 const interests=S.me.interests||[];
 choices.sort((a,b)=>Number(interests.includes(b.path))-Number(interests.includes(a.path))||a.name.localeCompare(b.name,'it'));
 const pages=Math.max(1,Math.ceil(choices.length/3));missionPage=Math.min(missionPage,pages-1);
 const cards=choices.slice(missionPage*3,missionPage*3+3).map(t=>`<article class="card mission-choice"><details><summary><h3>${esc(t.name)}</h3></summary><div class="mission-details">${art(pathInfo(t.path)[2])}<p>${esc(t.description||'Svolgi l’attività e chiedi la convalida in sede.')}</p><p class="muted">${esc(pathInfo(t.path)[1])} · ${t.xp} XP · ${tumazzi(t.cheese)}</p>${btn('Prendi in carico','assignment-take',t.id)}</div></details></article>`).join('');
 return (cards||'<p class="muted">Nessuna missione in questa categoria.</p>')+`<div class="mission-pager">${btn('←','mission-page','prev',{secondary:true,extra:missionPage===0?'disabled aria-label="Pagina precedente"':'aria-label="Pagina precedente"'})}<span>${missionPage+1}/${pages}</span>${btn('→','mission-page','next',{secondary:true,extra:missionPage>=pages-1?'disabled aria-label="Pagina successiva"':'aria-label="Pagina successiva"'})}</div>`;
}
async function missioni(){
 if(!S.me)return needLogin();
 const [types,logs,jobs,pres]=await Promise.all([api('/chore-types'),api('/chores?limit=100&memberId='+encodeURIComponent(S.me.id)),api('/my/assignments'),api('/checkin')]);
 missionCatalog=types.types;missionJobs=jobs.assignments;missionPresence=pres;missionLegacyPending=logs.chores.filter(c=>c.status==='pending').map(c=>c.typeId);
 const progress=missionJobs.filter(j=>j.state==='in_progress'),submitted=missionJobs.filter(j=>j.state==='submitted');
 const linked=new Set(missionJobs.map(j=>j.log_id));
 const legacy=logs.chores.filter(c=>c.status==='pending'&&!linked.has(c.id));
 const doing=progress.map(j=>card(`<h3>${esc(j.name)}</h3><p class="muted">${j.xp} XP dopo convalida</p><details class="mission-note"><summary>Aggiungi una nota</summary><label>Nota per il referente<textarea id="assignment-note-${j.id}" maxlength="500"></textarea></label></details>${btn('✓ Missione completata','assignment-finish',j.id,{extra:pres.inside?'':'disabled aria-describedby="mission-checkin-note"'})}${!pres.inside?'<p class="muted">Se sei in sede, fai il check-in prima di completare.</p>'+btn('Fai il check-in','checkin'):''}${btn('Abbandona missione','assignment-abandon',j.id,{secondary:true})}`)).join('')||'<p class="muted">Prendi in carico una missione per iniziare.</p>';
 const waiting=[...submitted.map(j=>({name:j.name,note:j.note})),...legacy.map(j=>({name:j.choreName,note:j.note}))].map(j=>card(`${badge('✓ In attesa')}<h3>${esc(j.name)}</h3>${j.note?`<details><summary>La tua nota</summary><p>${esc(j.note)}</p></details>`:''}<p class="muted">Il referente verifica e assegna i premi.</p>`)).join('')||'<p class="muted">Nessuna richiesta in attesa.</p>';
 return title('Missioni','Scegli, svolgi in sede, chiedi la convalida.')+presenceCta(pres,true)+
 `<p class="muted" id="mission-checkin-note">Premi dopo verifica. Massimo ${tumazzi(WEEKLY_CHEESE)} a settimana dalle missioni ripetibili; gli XP restano permanenti.</p>
 <div class="mission-filters" aria-label="Categorie missioni">${[['recommended','Per te'],...PATHS.map(([id,name])=>[id,name.split(' ')[0]])].map(([id,name])=>`<button type="button" data-action="mission-category" data-id="${id}" aria-pressed="${missionCategory===id}">${name}</button>`).join('')}</div>
 <label class="mission-search">Cerca una missione<input type="search" id="mission-search" value="${esc(missionSearch)}" placeholder="Titolo…"></label>
 <div class="mission-board"><section class="mission-column"><h2>1 · Disponibili</h2><p class="muted">Tre alla volta, dai tuoi interessi.</p><div id="mission-available">${availableMissions()}</div></section>
 <section class="mission-column" id="mission-running" tabindex="-1"><h2>2 · Le tue, in corso</h2>${doing}</section>
 <section class="mission-column" id="mission-waiting" tabindex="-1"><h2>3 · Da convalidare</h2>${waiting}</section></div>`+
 `<details class="mission-history"><summary>Missioni già convalidate o respinte</summary>${logs.chores.filter(c=>c.status!=='pending').map(c=>`<p><strong>${esc(c.choreName)}</strong> · ${statusText[c.status]} · ${dateShort(c.requestedAt)} · ${c.xp} XP · ${tumazzi(c.cheese)}${c.note?`<br>${esc(c.note)}`:''}</p>`).join('')||'<p>Nessuna convalida ancora.</p>'}</details>`+
 await teamPanel()+mu('missioni',{pending:submitted.length+legacy.length});
}

/* ---- presenze personali ---- */
const weekdayBars=(rows,key)=>{const max=Math.max(1,...rows.map(r=>r[key]));return rows.map(r=>bar(r[key],max,r.name.slice(0,3))).join('');};
async function presenze(){
 if(!S.me)return needLogin();
 const [stats,acc,prog,ctypes]=await Promise.all([api('/stats/members/'+S.me.id),api('/access?limit=40&memberId='+encodeURIComponent(S.me.id)),api('/my/progress').catch(()=>({counts:{}})),api('/chore-types').catch(()=>({types:[]}))]);
 const t=stats.totals,l=level(t.xp);
 const monthMax=Math.max(0.1,...stats.months.map(m=>m.hours));
 const pathRows=PATHS.map(([id,name])=>bar(prog.counts[id]||0,Math.max(1,...PATHS.map(([k])=>prog.counts[k]||0)),name.split(' ')[0]));
 return title('Le mie statistiche','Quanto tempo passi in sede, cosa hai guadagnato e come stai crescendo.')+
 section('Il mio livello',card(profileChip()+btn('Condividi progressi','share-progress')))+
 section('In breve',grid([
  card(`<span class="metric">${stats.visits}</span><h3>Visite</h3><p>${stats.insideNow?badge('Sei dentro adesso'):'Negli ultimi 12 mesi'}</p>`),
  card(`<span class="metric">${stats.hours}</span><h3>Ore in sede</h3><p>${stats.visits?`Media ${duration(stats.avgVisitMinutes)} a visita`:'Appena inizi a venire, le conteremo qui.'}</p>`),
  card(`<span class="metric">${stats.streak.current}</span><h3>Serie di giorni</h3><p>Giorni di apertura consecutivi con una tua visita · record ${stats.streak.best}</p>`)
 ]))+
 section('I miei guadagni',grid([
  card(`<span class="metric">${t.xp}</span><h3>XP</h3><p>${stats.activitiesAttended} attività · ${stats.choresVerified} missioni verificate</p>`),
  card(`<span class="metric">${t.cheese}</span><h3>Tumazzi guadagnati</h3><p>Il riscatto dei premi arriverà più avanti.</p>`)
 ],'two'))+
 section('Ore in sede per mese',stats.months.length?card(stats.months.map(m=>bar(m.hours,monthMax,m.month.slice(2),' h')).join('')):card('<p>Ancora nessun dato.</p>'))+
 section('Quando vieni',card(weekdayBars(stats.weekdays,'visits')))+
 skillPath(prog.counts,ctypes.types.filter(t=>t.active))+
 section('Ultime visite',stats.recent.length?card(`<ul class="list">${stats.recent.map(r=>`<li>${dateLong(r.start)} · ${duration(r.minutes)}</li>`).join('')}</ul>`):card('<p>Nessuna visita registrata.</p>'))+
 section('Registro ingressi e uscite',acc.accessi.length?card(`<ul class="list">${acc.accessi.map(a=>`<li>${a.direction==='IN'?'Ingresso':'Uscita'} · ${dateShort(a.at)}</li>`).join('')}</ul>`):card('<p>Ancora nessun movimento negli ultimi 30 giorni.</p>'));
}

/* ---- profilo ---- */
function learningJournal(entry){
 const prompts=[
  ['goal','Che cosa voglio imparare?','Es. Facilitare un confronto di gruppo'],
  ['evidence','Quale esperienza posso raccontare?','Es. Ho preparato i materiali e condotto un’attività'],
  ['reflection','Che cosa ho imparato? Cosa proverò la prossima volta?','Es. Ho imparato a spiegare il compito in piccoli passaggi']
 ];
 const fields=prompts.map(([key,label,example])=>`<label>${label}<textarea name="${key}" maxlength="1000" placeholder="${example}">${esc(entry[key])}</textarea></label>`).join('');
 return `<p>Raccogli esempi delle tue esperienze e delle competenze che stai sviluppando. Il diario è personale e ti aiuta a preparare la riflessione Youthpass.</p>
 <p class="muted">Premi Salva prima di uscire. Per svuotare il diario, cancella il testo e salva. Il diario non rilascia certificati.</p>`+
 form('learning',fields,'Salva la mia riflessione',{cls:'plain'});
}
async function journalCard(){
 try{
  const {entry}=await api('/my/learning-journal');
  return card(learningJournal(entry),'learning-journal');
 }catch(e){
  if(e.status===401)throw e;
  return failCard(e);
 }
}
async function profilo(){
 if(!S.me)return needLogin();
 const [prog,types,journal,streak]=await Promise.all([api('/my/progress').catch(()=>({counts:{}})),api('/chore-types').catch(()=>({types:[]})),journalCard(),getStreaks()]);
 const mine=S.me.interests||[];
 const interestsForm=`<h3>I miei interessi</h3><p class="muted">Scegli cosa ti piace: ti consigliamo missioni e attività.</p><fieldset><legend>Percorsi</legend>${PATHS.map(([id,name])=>`<label><input type="checkbox" name="interest" value="${id}" ${mine.includes(id)?'checked':''}> ${esc(name)}</label>`).join('')}</fieldset>`;
 const savedSpecies=pref.get('species','mucca');
 const species=Object.hasOwn(animals,savedSpecies)?savedSpecies:'mucca',color=pref.get('color','rosa');
 const picker=`<fieldset><legend>Avatar</legend><div class="animal-picker">${Object.entries(animals).map(([id,a])=>`<label><input type="radio" name="species" value="${id}" ${id===species?'checked':''}>${avatar(id,color)}<span>${a.name}</span></label>`).join('')}</div></fieldset><fieldset><legend>Colore</legend><div class="swatches">${Object.entries(avatarColors).map(([id,[name,hex]])=>`<label><input type="radio" name="color" value="${id}" ${id===color?'checked':''}><span class="swatch" style="background:${hex}"></span><span class="swatch-name">${name}</span></label>`).join('')}</div></fieldset>`;
 return title('Profilo','Il tuo personaggio e il tuo account.')+
 section('Il mio personaggio',card(profileChip()+`<div class="stat-figure">${pixelIcon(cheese)}<strong>${tumazzi(S.totals.cheese)}</strong></div><div class="support-links"><a href="#presenze">Le mie statistiche →</a></div><details class="disclosure profile-sharing"><summary>Condividi il tuo percorso</summary>${btn('Crea la mia card ↗','share-progress','',{extra:'aria-label="Crea e condividi la mia card dei progressi"'})}<p class="muted">Crea una card chibi con il tuo avatar, il livello e gli XP. Nome ed email restano privati.</p></details>`,'profile-overview'))+
 streakPanel(streak)+section('Le mie missioni',card('<div class="support-links">'+link('Apri le mie missioni','missioni')+link('I miei trofei','trofei')+'</div>'))+section('Diario di apprendimento Youthpass',journal,'','learning-journal')+
 skillPath(prog.counts,types.types.filter(t=>t.active))+
 section('Bacheca pubblica',card(form('achievement-sharing',`<label><input type="checkbox" name="enabled" ${streak?.sharing?'checked':''}> Voglio mostrare il mio pseudonimo e i prossimi trofei nella bacheca visibile a tutti.</label><p class="muted">Scelta facoltativa. Nessuna email, nome completo, orario o presenza pubblicati. Se disattivi la scelta e salvi, il tuo traguardo scompare dalla bacheca.</p>`,'Salva scelta bacheca',{cls:'plain'})))+
 section('Il mio account','<details class="disclosure account-settings"><summary>Gestisci nome, interessi e accesso</summary>'+grid([
  form('nick','<h3>Nome utente</h3><p class="muted">È il nome che vedono gli altri soci.</p>'+field('pseudonym','Il tuo nome utente','text',`required maxlength="28" value="${esc(S.me.pseudonym)}"`),'Salva nome utente'),
  form('interests',interestsForm,'Salva interessi'),
  card(`<h3>${esc(S.me.fullName||S.me.pseudonym)}</h3><p>${esc(S.me.email)}</p><p>${badge(isOrganizer()?'Referente':'Socio')}</p>${btn('Esci','logout','',{secondary:true})}`),
  form('changepw','<h3>Cambia password</h3>'+field('current','Password attuale','password','required autocomplete="current-password"')+field('next','Nuova password (almeno 10 caratteri)','password','required minlength="10" autocomplete="new-password"'),'Cambia password')
 ],'two')+'</details>')+
 section('Personalizza il profilo',card(`<details class="disclosure"><summary>Cambia avatar e colore</summary>${form('avatar',picker,'Salva avatar',{cls:'plain'})}<p class="muted">L’avatar è salvato solo su questo dispositivo.</p></details>`))+
 section('Preferenze',card(`<label class="sound-setting"><input type="checkbox" id="sound-toggle" ${pref.get('sound','off')==='on'?'checked':''}> Suoni dei pulsanti</label><p class="muted">Breve suono pixel quando usi un pulsante o un link. La scelta vale su questo browser.</p>`))+
 mu('profilo',{streak});
}

/* ---- pannello referenti ---- */
const tabs=[['panoramica','Panoramica'],['soci','Soci'],['presenze','Presenze'],['missioni','Missioni'],['putia','Putìa'],['attivita','Attività'],['assemblea','Assemblea'],['sede','Prima visita'],['statistiche','Statistiche']];
const tabBar=active=>`<div class="tabs" role="navigation" aria-label="Sezioni del pannello">${tabs.map(([id,name])=>`<a class="btn" href="#referenti/${id==='panoramica'?'':id}" ${id===active?'aria-current="page"':''}>${name}</a>`).join('')}</div>`;
const copyBox=(url)=>`<div class="invite-link"><input readonly value="${esc(url)}" aria-label="Link d’invito"><button type="button" data-action="copy" data-value="${esc(url)}">Copia</button></div>`;
const waNumber=raw=>{let d=String(raw||'').replace(/[^\d+]/g,'');if(d.startsWith('+'))d=d.slice(1);else if(d.startsWith('00'))d=d.slice(2);else if(d.startsWith('3')&&d.length>=9&&d.length<=10)d='39'+d;return /^\d{8,15}$/.test(d)?d:'';};
const waLink=(phone,name,url)=>{const n=waNumber(phone);if(!n)return '';const msg=`Ciao ${name||''}! Ti ho registrato su Cca Siemmu. Scegli la tua password da questo link (vale 7 giorni): ${url}`;return `https://wa.me/${n}?text=${encodeURIComponent(msg)}`;};
const inviteCard=inv=>card(`<h3>Link d’invito pronto</h3><p>${inv.emailSent?'Abbiamo anche inviato l’email.':`Email non inviata${inv.emailNote?` (${esc(inv.emailNote)})`:''}: manda tu questo link alla persona.`} Vale 7 giorni e si usa una volta sola.</p>${copyBox(inv.inviteUrl)}${waLink(inv.phone,inv.who,inv.inviteUrl)?`<p><a class="btn" href="${esc(waLink(inv.phone,inv.who,inv.inviteUrl))}" target="_blank" rel="noopener">Invia su WhatsApp →</a></p>`:'<p class="muted">Nessun numero di telefono valido: copia il link e mandalo tu.</p>'}<p class="muted">${esc(inv.who||'')}</p>${btn('Chiudi','closeInvite','',{secondary:true})}`,'green');
const datetimeLocal=sec=>{const d=new Date(sec*1000),p=n=>String(n).padStart(2,'0');return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;};

async function referenti(tab,extra){
 if(!S.me)return needLogin();
 if(!isOrganizer())return needOrganizer();
 const head=title('Area referenti','Gestione di soci, presenze, missioni e attività.')+tabBar(tab||'panoramica');
 const pages={panoramica:panPanoramica,soci:panSoci,presenze:panPresenze,missioni:panFaccende,putia:panPutia,attivita:()=>panAttivita(extra),assemblea:panAssemblea,sede:panPrimaVisita,statistiche:panStatistiche};
 const render=pages[tab||'panoramica'];
 if(!render)return head+card('<p>Sezione non trovata.</p>');
 return head+await render();
}
async function panPanoramica(){
 const [inside,chores,sede]=await Promise.all([api('/inside'),api('/chores?status=pending'),api('/stats/sede')]);
 const t=sede.totals;
 return section('Adesso',grid([
  card(`<span class="metric">${inside.presenti.length}</span><h3>In sede</h3><p>${inside.presenti.length?inside.presenti.map(p=>`${esc(p.name)} (dalle ${fmt(p.since,{hour:'2-digit',minute:'2-digit'})})`).join(', '):'Nessuno è registrato dentro.'}</p>${link('Registra','referenti/presenze')}`,'green'),
  card(`<span class="metric">${chores.chores.filter(c=>c.memberId!==S.me.id).length}</span><h3>Missioni da verificare</h3><p>Richieste degli altri soci. Le tue le verifica un altro referente.</p>${link('Verifica','referenti/missioni')}`)
 ],'two'))+
 section(`Ultimi ${sede.periodDays} giorni`,grid([
  card(`<span class="metric">${t.hoursOpen}</span><h3>Ore di apertura</h3><p>Ore con almeno una persona dentro</p>`),
  card(`<span class="metric">${t.visits}</span><h3>Visite</h3><p>${t.uniqueMembers} persone diverse</p>`)
 ],'two')+`<p>${link('Tutte le statistiche','referenti/statistiche')}</p>`);
}
async function panSoci(){
 const {members}=await api('/members');
 const newForm=form('member','<h3>Registra un nuovo socio</h3>'+field('fullName','Nome e cognome','text','required maxlength="80"')+field('email','Email','email','required')+field('pseudonym','Nome da mostrare (facoltativo)','text','maxlength="28"').replace(' required','')+field('phone','Telefono (facoltativo)','tel','maxlength="30"')+`<label>Ruolo<select name="role"><option value="participant">Socio</option><option value="organizer">Referente</option></select></label>`,'Registra e crea il link d’invito');
 const cards=members.map(m=>{
  const search=esc([m.fullName,m.pseudonym,m.email].filter(Boolean).join(' '));
  const self=m.id===S.me.id;
  return card(`<h3>${esc(m.fullName||m.pseudonym)}</h3><p>${esc(m.email)}</p><p>${badge(m.role==='organizer'?'Referente':'Socio')} ${badge(statusText[m.status])} ${m.hasPassword?badge('Profilo completo'):badge('Password da impostare')}</p><p class="muted">${m.xp} XP · ${tumazzi(m.cheese)}${m.phone?' · '+esc(m.phone):''}</p>
  <p class="muted">Tessera: ${m.uidTessera?`<code>${esc(m.uidTessera)}</code>`:'nessuna'}</p>
  <div class="row">${btn(m.hasPassword?'Link reset password':'Nuovo link d’invito','invite',m.id,{secondary:true,extra:`data-phone="${esc(m.phone||'')}"`})}${m.uidTessera?btn('Togli tessera','cardRemove',m.id,{secondary:true}):''}${!self?btn(m.role==='organizer'?'Rendi socio':'Rendi referente','role',m.id,{secondary:true,extra:`data-role="${m.role==='organizer'?'participant':'organizer'}"`}):''}${!self?btn(m.status==='disabled'?'Riattiva':'Disattiva','status',m.id,{secondary:true,extra:`data-status="${m.status==='disabled'?'approved':'disabled'}"`}):''}</div>
  ${form('card',field('uid','Codice tessera NFC','text','required maxlength="40" placeholder="Es. 04A1B2C3"'),m.uidTessera?'Cambia tessera':'Assegna tessera',{id:m.id,cls:'inline-form'})}`,m.status==='disabled'?'muted-card':'').replace('<article ',`<article data-member-search="${search}" `);
 });
 return (S.invite?section('Invito',inviteCard(S.invite)):'')+section(`Soci (${members.length})`,`<label>Cerca tra i soci<input type="search" id="member-search" placeholder="Nome, pseudonimo o email" autocomplete="off"></label><p id="member-search-status" class="muted" role="status" hidden></p>`+grid(cards,'two'))+section('Nuovo socio',newForm);
}
async function panPresenze(){
 const [inside,members,acc,codeInfo]=await Promise.all([api('/inside'),api('/members'),api('/access?from='+(Math.floor(Date.now()/1000)-3*86400)+'&limit=60'),api('/checkin-code'),loadQr().catch(()=>{})]);
 const qrCard=window.qrcode?card(`${qrSvg(checkinUrl(codeInfo.code),'QR code d’ingresso')}<p>Stampalo e attaccalo all’ingresso: i soci lo inquadrano per registrare ingresso e uscita.</p><p class="muted">Se il codice finisce in mani sbagliate, cambialo: il vecchio QR smette subito di funzionare e va ristampato.</p><div class="row">${link('Stampa il cartello','cartello')}${btn('Cambia il codice','rotate','',{secondary:true})}</div>`):card('<p>Non riesco a creare il QR in questo momento.</p>');
 const active=members.members.filter(m=>m.status==='approved');
 const insideIds=new Set(inside.presenti.map(p=>p.id));
 return section('QR d’ingresso',qrCard)+section('In sede adesso',inside.presenti.length?grid(inside.presenti.map(p=>card(`<h3>${esc(p.name)}</h3><p>Dentro dalle ${fmt(p.since,{hour:'2-digit',minute:'2-digit'})}</p>${btn('Registra uscita','out',p.id)}`)),'three'):card('<p>Nessuno è registrato dentro.</p>'))+
 section('Registra un movimento',form('access',`<label>Socio<select name="memberId" required>${active.map(m=>`<option value="${esc(m.id)}">${esc(m.pseudonym)}${insideIds.has(m.id)?' (dentro)':''}</option>`).join('')}</select></label><p class="muted">Il sistema alterna da solo ingresso e uscita.</p><label>Orario (vuoto = adesso)<input name="at" type="datetime-local" max="${datetimeLocal(Math.floor(Date.now()/1000))}"></label>`,'Registra'))+
 section('Ultimi tre giorni',acc.accessi.length?card(`<ul class="list">${acc.accessi.map(a=>`<li>${esc(a.name)} · ${a.direction==='IN'?'ingresso':'uscita'} · ${dateShort(a.at)}${a.source==='dispositivo'?' · lettore':''}</li>`).join('')}</ul>`):card('<p>Nessun movimento recente.</p>'));
}
const pathSelect=cur=>`<label>Percorso<select name="path">${PATHS.map(([id,name])=>`<option value="${id}" ${id===cur?'selected':''}>${name}</option>`).join('')}</select></label>`;
async function panFaccende(){
 const [pending,types,members]=await Promise.all([api('/chores?status=pending'),api('/chore-types'),api('/members')]);
 const active=members.members.filter(m=>m.status==='approved'&&m.id!==S.me.id);
 return await teamPanel(true)+section(`Da verificare (${pending.chores.length})`,pending.chores.length?grid(pending.chores.map(c=>card(`<h3>${esc(c.choreName)}</h3><p>${esc(c.memberName)} · ${dateShort(c.requestedAt)}</p>${c.note?`<p class="muted">${esc(c.note)}</p>`:''}<p>${c.xp||''}</p>${c.memberId===S.me.id?'<p class="muted">È una tua missione: la verifica un altro referente.</p>':`<div class="row">${btn('Conferma','verify',c.id)}${btn('Respingi','reject',c.id,{secondary:true})}</div>`}`.replace('<p></p>',''))),'two'):card('<p>Nessuna missione in attesa.</p>'))+
 section('Registra una missione fatta',types.types.some(t=>t.active)?form('logchore',`<label>Socio<select name="memberId" required>${active.map(m=>`<option value="${esc(m.id)}">${esc(m.pseudonym)}</option>`).join('')}</select></label><label>Missione<select name="typeId" required>${types.types.filter(t=>t.active).map(t=>`<option value="${esc(t.id)}">${esc(t.name)} (${t.xp} XP, ${t.cheese} F.)</option>`).join('')}</select></label>${field('note','Nota (facoltativa)','text','maxlength="200"').replace(' required','')}<p class="muted">Registrata da un referente, viene convalidata subito. Le tue missioni le richiedi dalla pagina Missioni e le verifica un altro referente.</p>`,'Registra e convalida'):card('<p>Crea prima una missione nel catalogo.</p>'))+
 section('Catalogo missioni',grid(types.types.map(t=>card(`<h3>${esc(t.name)}</h3><p>${esc(t.description)}</p><p>${t.xp} XP · ${tumazzi(t.cheese)} ${t.active?'':badge('Non attiva')}</p>${form('chorepath',pathSelect(t.path),'Salva',{id:t.id,cls:'inline-form'})}${btn(t.active?'Disattiva':'Riattiva','choreActive',t.id,{secondary:true,extra:`data-active="${t.active?0:1}"`})}`)),'two'))+
 section('Nuova missione nel catalogo',form('choretype','<h3>Aggiungi una missione</h3>'+field('name','Nome','text','required maxlength="80"')+field('description','Descrizione','text','maxlength="400"').replace(' required','')+field('xp','XP','number','required min="0" max="500" value="10"')+field('cheese','Tumazzi','number','required min="0" max="200" value="2"')+pathSelect('solidarieta'),'Aggiungi'));
}
async function panPutia(){
 const [pend,rw]=await Promise.all([api('/redemptions'),api('/rewards')]);
 return section(`Premi da consegnare (${pend.redemptions.length})`,pend.redemptions.length?grid(pend.redemptions.map(x=>card(`<h3>${esc(x.rewardName)}</h3><p>${esc(x.memberName)} · ${tumazzi(x.cost)} · ${dateShort(x.createdAt)}</p>${x.memberId===S.me.id?'<p class="muted">È un tuo premio: lo consegna un altro referente.</p>':`<div class="row">${btn('Consegnato','redDeliver',x.id)}${btn('Annulla','redeemCancel',x.id,{secondary:true})}</div>`}`)),'two'):card('<p>Nessun premio da consegnare.</p>'))+
 section('Premi in vetrina',grid(rw.rewards.map(r=>card(`<h3>${esc(r.name)} ${r.active?'':badge('Non attivo')}</h3><p>${tumazzi(r.cost)} · ${r.stock===null?'scorta illimitata':r.stock+' disponibili'}</p>${form('rewardedit',field('cost','Costo','number',`required min="1" max="5000" value="${r.cost}"`)+field('quantity','Quantità totale (vuoto = illimitata)','number',`min="0" max="10000" value="${r.quantity??''}"`).replace(' required',''),'Salva',{id:r.id,cls:'inline-form'})}${btn(r.active?'Togli dalla vetrina':'Rimetti in vetrina','rewardActive',r.id,{secondary:true,extra:`data-active="${r.active?0:1}"`})}`)),'two'))+
 section('Nuovo premio',form('reward','<h3>Aggiungi un premio</h3>'+field('name','Nome','text','required maxlength="80"')+field('description','Descrizione','text','maxlength="300"').replace(' required','')+field('cost','Costo in Tumazzi','number','required min="1" max="5000" value="20"')+field('quantity','Quantità (vuoto = illimitata)','number','min="0" max="10000"').replace(' required','')+`<label>Icona<select name="art">${ARTS.map(([k,n])=>`<option value="${k}">${n}</option>`).join('')}</select></label>`,'Aggiungi il premio'));
}
const textArea=(name,label,max,value='',required=false)=>`<label>${label}<textarea name="${name}" maxlength="${max}"${required?' required':''}>${esc(value)}</textarea></label>`;
async function panPrimaVisita(){
 const {visit}=await api('/space/visit');
 return section('Prima visita',form('visit', '<p>Queste informazioni sono pubbliche. Inserisci solo dettagli verificati sulla sede.</p>'+
  field('address','Indirizzo','text',`maxlength="200" value="${esc(visit?.address||venueAddress)}"`)+
  textArea('access','Modalità di accesso',600,visit?.access)+
  textArea('accessibility','Accessibilità della sede',600,visit?.accessibility),'Salva informazioni'));
}

function decisionForm(d={}){
 const status=`<label>Stato<select name="status">${Object.entries(decisionStates).map(([id,label])=>`<option value="${id}"${d.status===id?' selected':''}>${label}</option>`).join('')}</select></label>`;
 return form('decision',
  field('decidedOn','Data dell’assemblea','date',`required value="${esc(d.decidedOn)}"`)+
  field('title','Titolo','text',`required maxlength="120" value="${esc(d.title)}"`)+
  textArea('decision','Cosa è stato deciso',1000,d.decision,true)+textArea('reason','Perché',1000,d.reason,true)+
  field('responsible','Gruppo o ruolo che se ne occupa','text',`required maxlength="120" value="${esc(d.responsible)}"`)+status,
  d.id?'Aggiorna decisione':'Pubblica decisione',{id:d.id,cls:'plain'});
}

async function panAssemblea(){
 const {meeting,decisions}=await api('/assembly');
 const when=meeting?new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Rome',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}).format(new Date(meeting.startsAt*1000)).replace(' ','T'):'';
 return section('Prossima assemblea',form('assembly',field('startsAt','Data e ora (Italia)','datetime-local',`required value="${esc(when)}"`)+
  field('location','Luogo','text',`required maxlength="160" value="${esc(meeting?.location)}"`)+
  textArea('agenda','Ordine del giorno',1600,meeting?.agenda,true),'Pubblica convocazione')+
  (meeting?`<p class="subpage-back">${btn('Rimuovi convocazione','assembly-clear','',{secondary:true})}</p>`:''))+
 section('Registra una decisione',card('<p>Riporta una decisione già presa in assemblea. Usa il nome di un gruppo o di un ruolo ed evita dati personali.</p>'+decisionForm()))+
 section('Decisioni pubblicate',decisions.length?grid(decisions.map(d=>card(`<details class="disclosure"><summary>${esc(d.title)} · ${decisionStates[d.status]}</summary>${decisionForm(d)}</details>`)),'two'):card('<p>Ancora nessuna decisione.</p>'));
}

function activityAccessFields(a={}){
 return `<label>Modalità di accesso<select name="accessMode"><option value="booking">Su prenotazione</option><option value="open"${a.accessMode==='open'?' selected':''}>Accesso libero</option></select></label>
 <label class="sound-setting"><input name="publicEvent" type="checkbox"${a.publicEvent?' checked':''}> Mostra come evento pubblico</label>`;
}

async function panAttivita(id){
 if(id){
  const [{bookings},{activities}]=await Promise.all([api(`/activities/manage/${encodeURIComponent(id)}/bookings`),api('/activities/manage')]);
  const a=activities.find(x=>x.id===id);
  if(!a)return card('<p>Attività non trovata.</p>'+link('Torna alle attività','referenti/attivita'));
  let walkIn='';
  if(a.accessMode==='open'&&a.status==='published'){
   const {members}=await api('/members');
   const eligible=members.filter(m=>m.status==='approved'&&m.id!==S.me.id);
   if(eligible.length)walkIn=section('Presenze ad accesso libero',form('walkin',
    `<p>Registra solo persone verificate di persona, dopo l’inizio e nella stessa giornata.</p>
     <label>Partecipante<select name="memberId" required><option value="">Seleziona</option>${eligible.map(m=>`<option value="${esc(m.id)}">${esc(m.pseudonym)}</option>`).join('')}</select></label>`,
    'Registra presenza',{id:a.id}));
  }
  return section(esc(a.name),card(`<p>${activityDate(a.startsAt)} · ${statusText[a.status]} · ${a.capacity} posti</p><p class="muted">${esc(a.verificationRule)}</p><p>${a.xp} XP · ${tumazzi(a.cheese)} a chi partecipa</p>${activityDescription(a)}`)+`<p>${link('Tutte le attività','referenti/attivita')}</p>`)+
  section('Dettagli dell’attività',form('activity-access',textArea('description','Descrizione visibile nel calendario',1600,a.description)+activityAccessFields(a),'Salva dettagli',{id:a.id}))+walkIn+
  (a.accessMode==='open'?'':section('Prenotazioni',bookings.length?grid(bookings.map(b=>card(`<h3>${esc(b.name)}</h3><p>${badge(statusText[b.status])} ${b.attended?badge('Presenza registrata'):''}</p><div class="row">${b.status==='pending'?btn('Conferma','bk-confirm',a.id,{extra:`data-member="${esc(b.memberId)}"`})+btn('Rifiuta','bk-decline',a.id,{secondary:true,extra:`data-member="${esc(b.memberId)}"`}):''}${b.status==='confirmed'&&!b.attended&&b.memberId!==S.me.id?btn('Registra presenza','bk-attend',a.id,{extra:`data-member="${esc(b.memberId)}"`}):''}</div>`)),'two')+`<p class="muted">La presenza si registra dopo l’inizio dell’attività e nella stessa giornata, solo dopo averla verificata di persona.</p>`:card('<p>Nessuna prenotazione.</p>')));
 }
 const {activities}=await api('/activities/manage');
 const create=form('activity','<h3>Nuova attività</h3>'+field('name','Titolo','text','required maxlength="120"')+field('startsAt','Data e ora','datetime-local','required')+field('capacity','Posti','number','required min="1" max="500" value="25"')+textArea('description','Descrizione visibile nel calendario',1600)+activityAccessFields()+field('verificationRule','Come verifichi la presenza','text','required maxlength="300" value="Il referente verifica di persona la presenza durante l’evento e la registra nella stessa giornata."')+field('xp','XP','number','required min="0" max="500" value="30"')+field('cheese','Tumazzi','number','required min="0" max="200" value="5"')+`<label>Percorso (facoltativo, per i consigli)<select name="path"><option value="">Nessuno</option>${PATHS.map(([id,name])=>`<option value="${id}">${esc(name)}</option>`).join('')}</select></label><label>Stato<select name="status"><option value="draft">Bozza (non visibile)</option><option value="published">Pubblicata</option></select></label>`,'Crea attività');
 const prefill=`<p><button type="button" class="secondary" data-action="prefill">Precompila con la prima attività reale</button></p>`;
 return section('Nuova attività',prefill+create)+section(`Attività (${activities.length})`,activities.length?grid(activities.map(a=>card(`<h3>${esc(a.name)}</h3><p>${activityDate(a.startsAt)} · ${badge(statusText[a.status])}</p>${activityDescription(a)}<p>${a.pending} in attesa · ${a.confirmed} confermate · ${a.attended} presenze · ${a.capacity} posti</p><div class="row">${a.status!=='published'&&a.status!=='cancelled'?btn('Pubblica','act-status',a.id,{extra:'data-status="published"'}):''}${a.status==='published'?btn('Torna a bozza','act-status',a.id,{secondary:true,extra:'data-status="draft"'}):''}${a.status!=='cancelled'?btn('Annulla','act-status',a.id,{secondary:true,extra:'data-status="cancelled"'}):''}<a class="btn" href="#referenti/attivita/${esc(a.id)}">Gestisci attività →</a></div>`)),'two'):card('<p>Nessuna attività creata.</p>'));
}
async function panStatistiche(){
 const s=await api('/stats/sede?days=90').catch(()=>api('/stats/sede'));
 const t=s.totals;
 const hoursMax=Math.max(0.1,...s.hours.map(h=>h.hours));
 const dayMax=Math.max(0.1,...s.weekdays.map(d=>d.hoursOpen));
 const c=s.comparison;
 const cmp=c.thisMonth?`<p>Questo mese: <strong>${c.thisMonth.hours} h</strong> · ${c.thisMonth.sessions} visite${c.previousMonth?` — mese scorso: ${c.previousMonth.hours} h · ${c.previousMonth.sessions} visite`:''}</p>`:'<p class="muted">Nessun dato per il mese in corso.</p>';
 const trendMax=Math.max(0.1,...s.trend.map(m=>m.hours));
 const activeHours=s.hours.filter(h=>h.hours>0);
 return section(`Ultimi ${s.periodDays} giorni`,grid([
  card(`<span class="metric">${t.hoursOpen}</span><h3>Ore di apertura</h3><p>Con almeno una persona dentro</p>`),
  card(`<span class="metric">${t.visits}</span><h3>Visite</h3><p>${t.uniqueMembers} persone diverse</p>`),
  card(`<span class="metric">${s.streak.current}</span><h3>Serie</h3><p>Giorni di apertura consecutivi · record ${s.streak.best}</p>`)
 ],'two'))+section('Confronto mensile',card(cmp+s.trend.map(m=>bar(m.hours,trendMax,m.month.slice(2),' h')).join('')))+
 section('Ore di apertura per giorno',card(s.weekdays.map(d=>bar(d.hoursOpen,dayMax,d.name.slice(0,3),' h')).join('')))+
 section('Orari più frequentati',card(activeHours.length?activeHours.map(h=>bar(h.hours,hoursMax,String(h.hour).padStart(2,'0')+':00',' h')).join(''):'<p>Nessun dato.</p>'))+
 section('Classifica dei più presenti',s.ranking.length?card(`<ol class="list">${s.ranking.map(r=>`<li>${esc(r.name)} · ${r.hours} h · ${r.visits} visite</li>`).join('')}</ol>`):card('<p>Ancora nessun dato.</p>'));
}


/* ---- bacheca notifiche ---- */
const missionWording=text=>String(text??'').replace(/\bmansioni?\b/gi,word=>word[0]+(word.endsWith('i')?'issioni':'issione'));
const levelIcon={ok:'✓',error:'✕',info:'ℹ'};
async function notifiche(){
 if(!S.me)return needLogin();
 const d=await api('/notifications');
 const items=d.notifications;
 const html=title('Notifiche','Esiti delle operazioni e avvisi che ti riguardano.')+
  section('Bacheca',items.length?`<div class="notice-list">${items.map(n=>`<article class="card notice-item notice-${n.level} ${n.read?'':'notice-unread'}"><span class="notice-icon" aria-hidden="true">${levelIcon[n.level]||'ℹ'}</span><div><h3>${esc(missionWording(n.title))}${n.read?'':' '+badge('Nuova')}</h3>${n.body?`<p>${esc(missionWording(n.body))}</p>`:''}<p class="muted">${dateShort(n.createdAt)}</p></div></article>`).join('')}</div>`:card('<p>Nessuna notifica per ora. Qui compariranno gli esiti degli invii email e gli avvisi su prenotazioni e missioni.</p>'));
 if(d.unread){api('/notifications/read',{method:'POST',body:{all:true}}).then(r=>{S.unread=r.unread??0;renderChrome('');}).catch(()=>{});}
 return html;
}

/* ---- QR d'ingresso, presenza personale, modalità TV ---- */
const loadQr=()=>window.qrcode?Promise.resolve():new Promise((ok,ko)=>{const s=document.createElement('script');s.src='qrcode.js';s.onload=ok;s.onerror=ko;document.head.append(s);});
function qrSvg(text,label){const q=window.qrcode(0,'M');q.addData(text);q.make();return `<div class="qr-box" role="img" aria-label="${esc(label||'QR code')}">${q.createSvgTag({scalable:true,margin:2})}</div>`;}
const checkinUrl=code=>`${location.origin}/#ingresso/${code}`;
let scan=null;
async function ingressoPage(code){
 if(!code)return title('Ingresso in sede','')+card('<p>Inquadra il QR code all’ingresso con la fotocamera del telefono: il sito segna il tuo ingresso o la tua uscita.</p>');
 if(!S.me){
  try{sessionStorage.setItem('cca-after-login',location.hash);}catch{}
  return accedi().replace(/<header class="page-title">[\s\S]*?<\/header>/,title('Ingresso in sede','Accedi per registrare la tua presenza: ci pensa il sito.'));
 }
 if(!scan||scan.code!==code){scan={code,p:api('/checkin',{method:'POST',body:{code}}).then(r=>({r}),e=>({e}))};setTimeout(()=>{scan=null;},8000);}
 const {r,e}=await scan.p;
 if(e){scan=null;return title('Ingresso in sede','')+failCard(e);}
 history.replaceState(null,'','#home');
 const a=r.access,mins=a.sinceMinutes;
 const dur=mins?` dopo ${mins>=60?`${Math.floor(mins/60)} h ${mins%60} min`:`${mins} min`}`:'';
 const msg=a.direction==='IN'?`Ingresso registrato. Benvenutə, ${S.me.pseudonym}!`:`Uscita registrata${dur}. A presto, ${S.me.pseudonym}!`;
 await refreshTotals();renderChrome('home');say(msg);
 return await homeMember();
}
async function cartello(){
 if(!isOrganizer())return needLogin();
 const [{code}]=[await api('/checkin-code'),await loadQr()];
 return `<div class="poster"><span class="eyebrow">CAMMARATA + SAN GIOVANNI GEMINI</span><h1>CCA SIEMMU</h1><p class="poster-lead">Sei entratə o uscitə? Inquadra il QR.</p>${qrSvg(checkinUrl(code),'QR code per registrare ingresso e uscita')}<ol><li>Apri la fotocamera del telefono e inquadra il QR.</li><li>Accedi, se non l’hai già fatto.</li><li>Il sito segna il tuo ingresso. Quando esci, inquadralo di nuovo.</li></ol><p>E boni siemmu · Spazio Giovani Generazioni</p></div><p class="no-print">${btn('Stampa','print')} ${link('Torna alle presenze','referenti/presenze')}</p>`;
}
const tvTips=['Prenota un posto dal calendario: ti aspettiamo!','Apri una missione per vedere i dettagli.','Hai un’idea per lo spazio? Scrivila nelle Proposte e fai votare il gruppo.','Un’ora del tuo tempo vale un’ora di un altro socio: guarda la Banca del tempo.','Inquadra il QR all’ingresso per segnare la tua presenza.','Ogni presenza fa crescere il paese. Grazie di esserci!'];
const tvTime=()=>new Intl.DateTimeFormat('it-IT',{timeZone:'Europe/Rome',hour:'2-digit',minute:'2-digit'}).format(new Date());
const tvDate=()=>new Intl.DateTimeFormat('it-IT',{timeZone:'Europe/Rome',weekday:'long',day:'numeric',month:'long'}).format(new Date());
async function tvPage(){
 const [st,metrics,acts]=await Promise.all([getStatus(),getCommunity(),api('/activities').catch(()=>({activities:[]})),loadQr().catch(()=>{})]);
 const next=acts.activities.filter(a=>a.starts_at>Date.now()/1000-3600).slice(0,3);
 const reached=(metrics||[]).filter(halfway).length;
 const tip=st?.open&&Math.floor(Date.now()/60000)%3===0?'Siamo aperti: entra, ti aspettiamo!':tvTips[Math.floor(Date.now()/60000)%tvTips.length];
 try{navigator.wakeLock?.request('screen').catch(()=>{});}catch{}
 const z=Number(pref.get('tvzoom',1))||1;
 return `<div class="tv-frame"><div class="tv-screen" style="--tvz:${z}"><div class="tv-tools no-print">${btn('A−','tvzoom','down',{secondary:true})}${btn('A+','tvzoom','up',{secondary:true})}${btn('Tema','theme','',{secondary:true})}</div><div class="tv-top"><div class="tv-brand">CCA SIEMMU<small>e boni siemmu</small></div><div class="tv-clock"><strong id="tv-time">${tvTime()}</strong><span id="tv-date">${esc(tvDate())}</span></div></div>
 <div class="tv-main"><div class="tv-left"><div class="tv-live ${st?.open?'live-on':'live-off'}"><span class="live-dot" aria-hidden="true"></span>${st?.open?'Aperto ora':'Chiuso al momento'}</div><p class="tv-hours">${esc(st?.days||'Da lunedì a venerdì')} · ${esc(st?.hours||'16:00–20:00')}</p>
 <h2>Prossime attività</h2>${next.length?`<ul class="tv-acts">${next.map(a=>`<li><strong>${esc(a.name)}</strong><span>${activityDate(a.starts_at)}</span>${activityDescription(a)}<span>${a.access_mode==='open'?'Accesso libero':a.available>0?`${a.available} posti liberi`:'Posti esauriti'}</span></li>`).join('')}</ul>`:'<p class="tv-empty">Presto altre attività in calendario.</p>'}</div>
 <div class="tv-right">${villageScene(metrics)}<p class="tv-village">${reached} ${reached===1?'traguardo':'traguardi'} su ${(metrics||[]).length}: il paese cresce con le presenze, le attività e le missioni.</p></div></div>
 <div class="tv-foot">${cowMascot('curioso',tip,tvTips)}${window.qrcode?`<div class="tv-qr">${qrSvg(location.origin+'/#home','QR code del sito')}<span>Il sito dello spazio</span></div>`:''}</div></div></div>`;
}
// La TV è 16:9: la scena è un riquadro fisso 1920×1080 che si adatta allo schermo senza deformarsi.
function fitTv(){const st=document.querySelector('.tv-screen');if(!st)return;st.style.transform=`translate(-50%,-50%) scale(${Math.min(innerWidth/1920,innerHeight/1080)})`;}
window.addEventListener('resize',fitTv);
setInterval(()=>{if(location.hash!=='#tv'||document.hidden)return;const t=document.querySelector('#tv-time');if(t)t.textContent=tvTime();},15000);
setInterval(()=>{if(location.hash==='#tv'&&!document.hidden)render();},60000);

/* ---- router ---- */
const redirects={benvenuto:'accedi',formaggi:'putia',tumazzi:'putia',vasceddi:'missioni',paisi:'home',condividi:'profilo'};
let renderId=0;
const routeTrail=[location.hash||'#home'];
let goingBack=false;
async function render(focus=false){
 const id=++renderId;
 const [raw,detail,extra]=location.hash.slice(1).split('/');
 let page=raw||'home';
 if(redirects[page]){location.replace('#'+redirects[page]);return;}
 if(!S.loaded)await loadSession();
 else if(S.me){await refreshTotals();checkLevelUp();}
 document.body.classList.toggle('tv',page==='tv');
 const known=['comunita','assemblea','trofei','putia','banca','proposte','paese','notifiche','home','calendario','spazio','accedi','missioni','presenze','profilo','referenti','privacy','imposta-password'];
 const active=known.includes(page)?page:'';
 renderChrome(active);
 await recordAppDay();
 main.setAttribute('aria-busy','true');
 let html;
 try{
  if(page==='home')html=S.me?await homeMember():await home();
  else if(page==='calendario')html=await calendario();
  else if(page==='notifiche')html=await notifiche();
  else if(page==='spazio')html=await spazio();
  else if(page==='paese')html=await paese();
  else if(page==='comunita')html=await comunita();
  else if(page==='assemblea')html=await assemblea();
  else if(page==='trofei')html=await trofei();
  else if(page==='putia')html=await putia();
  else if(page==='banca')html=await banca();
  else if(page==='proposte')html=await proposte();
  else if(page==='privacy')html=privacy();
  else if(page==='tv')html=await tvPage();
  else if(page==='ingresso')html=await ingressoPage(detail);
  else if(page==='cartello')html=await cartello();
  else if(page==='accedi')html=accedi(detail);
  else if(page==='imposta-password')html=await impostaPassword(detail);
  else if(page==='missioni')html=await missioni();
  else if(page==='presenze')html=await presenze();
  else if(page==='profilo')html=await profilo();
  else if(page==='referenti')html=await referenti(detail,extra);
  else html=title('Ti pirdisti?','Questa pagina non c’è.')+card(link('Torna alla Home','home'));
 }catch(e){
  if(e.status===401){S.me=null;renderChrome(active);html=needLogin();}
  else html=title('Ops','')+failCard(e);
 }
 if(id!==renderId)return;
 main.innerHTML=(!['home','tv','cartello'].includes(page)?'<div class="back-row"><button type="button" class="secondary" data-action="back">← Indietro</button></div>':'')+html;
 updateDateIndicators();
 if(!['tv','cartello'].includes(page))main.insertAdjacentHTML('beforeend',`<footer class="foot site-foot">${document.querySelector('#project-logos').innerHTML}${privacyLink}</footer>`);
 if(!['tv','cartello'].includes(page)&&!main.querySelector('#mu-popover'))main.insertAdjacentHTML('beforeend',mu(page));
 main.removeAttribute('aria-busy');
 if(page==='tv')fitTv();
 if(focus){
  const target=page==='profilo'&&detail==='diario'?'learning-journal':page==='banca'&&(detail==='offri'?'time-offer':detail==='scambi'?'time-exchanges':null);
  const node=target&&document.getElementById(target);
  if(node){node.focus({preventScroll:true});node.scrollIntoView();}
  else{window.scrollTo(0,0);main.focus({preventScroll:true});}
 }
}
function banner(level,message,{sticky=false}={}){
 let box=document.querySelector('#banner');
 if(!box){box=document.createElement('div');box.id='banner';document.body.append(box);}
 const bad=level==='error';
 box.className='banner '+(bad?'banner-error':'banner-ok');
 box.setAttribute('role',bad?'alert':'status');
 box.innerHTML=`<span class="banner-icon" aria-hidden="true">${bad?'✕':'✓'}</span><span class="banner-text">${esc(message)}</span><button type="button" class="banner-close" aria-label="Chiudi avviso">×</button>`;
 box.hidden=false;
 box.querySelector('button').onclick=()=>{box.hidden=true;};
 clearTimeout(banner.t);
 if(!bad&&!sticky)banner.t=setTimeout(()=>{box.hidden=true;},6000);
}
function say(message,error=false){banner(error?'error':'ok',message);}
// Esito di un invio email, mostrato come banner e salvato anche nella bacheca.
function emailBanner(invite,who){
 if(invite.emailSent)banner('ok',`Email inviata a ${who}.`);
 else banner('error',`Email non inviata a ${who}${invite.emailNote?` (${invite.emailNote})`:''}. Copia il link qui sotto o mandalo su WhatsApp.`);
}
async function run(task,okMessage,{rerender=true}={}){
 try{await task();if(okMessage)say(okMessage);}
 catch(e){
  if(e.status===401){S.me=null;say('La sessione è scaduta. Accedi di nuovo.',true);location.hash='#accedi';render(true);return false;}
  say(e.message,true);return false;
 }
 if(rerender){const y=window.scrollY;await render();window.scrollTo(0,y);}
 return true;
}
async function refreshTotals(){try{const d=await api('/auth/me');if(d.member){S.me=d.member;S.totals=d.totals;S.unread=d.unread??0;}}catch{}}

/* ---- azioni ---- */
function openTrophy(t){
 let box=document.querySelector('#trophy-box');
 if(!box){box=document.createElement('div');box.id='trophy-box';document.body.append(box);}
 const left=Math.max(0,t.target-t.count),pct=Math.round(t.count/t.target*100);
 box.className='celebration';box.setAttribute('role','dialog');box.setAttribute('aria-label',`Trofeo: ${t.name}`);
 box.innerHTML=`<div class="celebration-card trophy-card ${t.earned?'trophy-on':'trophy-off'}">${t.earned?'<div class="confetti" aria-hidden="true">'+Array.from({length:14},(_,i)=>`<i style="left:${(i*41)%100}%;background:${['#B30016','#B30016','#bdd9da','#FFD400','#FFD400'][i%5]};animation-delay:${(i%6)*90}ms"></i>`).join('')+'</div>':''}
  <span class="eyebrow">${esc(t.group.toUpperCase())}</span><div class="trophy-art ${t.earned?'':'locked'}">${art(t.icon)}</div><h2>${esc(t.name)}</h2>
  <p>${badge(t.earned?'Ottenuto':'Bloccato')}</p><p>${esc(t.desc)}</p>
  ${t.earned?`<p class="muted">Conquistato il ${dayLong(t.awardedAt)}. Bravə!</p>`:`<progress value="${t.count}" max="${t.target}" aria-label="Progresso"></progress><p><strong>${t.count} / ${t.target}</strong> · ${pct}%</p><p class="muted">${left===1?'Ti manca 1 passo':`Ti mancano ${left} passi`} per sbloccarlo.</p>`}
  <button type="button" class="btn">Chiudi</button></div>`;
 box.hidden=false;
 const close=()=>{box.hidden=true;document.removeEventListener('keydown',k);};
 const k=e=>{if(e.key==='Escape')close();};
 document.addEventListener('keydown',k);
 box.onclick=e=>{if(e.target===box)close();};
 const b=box.querySelector('button');b.onclick=close;b.focus();
}
function shareCardImage({kicker,headline,subtitle,trophy}){
 const canvas=document.createElement('canvas');
 canvas.width=1080;
 canvas.height=1080;
 const ctx=canvas.getContext('2d');
 if(!ctx)throw new Error('La card non è disponibile in questo browser.');
 ctx.imageSmoothingEnabled=false;
 const ink='#111111',cream='#FFFFFF',gold='#c6a55b',sky='#bdd9da';
 const block=(color,x,y,w,h)=>{ctx.fillStyle=color;ctx.fillRect(x,y,w,h);};
 const text=(value,x,y,size,color=ink,max=880)=>{
  ctx.fillStyle=color;
  ctx.font=`900 ${size}px system-ui,sans-serif`;
  ctx.fillText(value,x,y,max);
 };
 function sprite(art,x,y,scale){
  ctx.save();
  ctx.translate(x,y);
  ctx.scale(scale,scale);
  for(const [,fill,d] of art.matchAll(/<path(?: fill="([^"]+)")? d="([^"]+)"\/>/g)){
   ctx.fillStyle=fill||ink;
   ctx.fill(new Path2D(d));
  }
  ctx.restore();
 }
 block(sky,0,0,1080,1080);
 // Each graphic unit is aligned to an 8px tile.
 for(const [x,y] of [[72,104],[856,72],[936,336]]){
  block('#FFFFFF',x,y,64,16);
  block('#FFFFFF',x+16,y-16,32,16);
 }
 block(ink,56,40,984,1008);
 block(cream,40,24,984,1008);
 block(ink,40,24,984,8);
 block(ink,40,24,8,1008);
 block(ink,1016,24,8,1008);
 block(ink,40,1024,984,8);
 ctx.textAlign='center';
 text('CCA SIEMMU',532,113,58);
 text('E BONI SIEMMU',532,151,23,'#506052');
 block(ink,104,198,856,62);
 block(trophy?gold:'#B30016',96,190,856,62);
 text(kicker,524,232,24);
 // A pixel stage frames the character like an RPG portrait.
 block('#F5F5F5',112,282,840,320);
 block('#96c3b0',112,530,840,72);
 block('#66937a',112,562,840,40);
 for(const [x,y,w] of [[112,506,128],[240,482,112],[352,522,104],[648,514,120],[768,490,184]]){
  block('#3e6b62',x,y,w,64);
  block('#85ac87',x+16,y+16,w-32,32);
 }
 block(ink,400,298,264,264);
 block(trophy?gold:'#F5F5F5',392,290,264,264);
 block(cream,408,306,232,232);
 const saved=pref.get('species','mucca');
 const species=Object.hasOwn(animals,saved)?saved:'mucca';
 sprite(trophy?navIcons.missioni:animals[species].art,428,318,12);
 if(!trophy)sprite(chibiFace(species),428,318,12);
 for(const [x,y] of [[288,344],[744,392],[680,300]]){
  block('#c6a55b',x-8,y-24,16,48);
  block('#c6a55b',x-24,y-8,48,16);
  block('#FFFFFF',x-4,y-12,8,24);
 }
 ctx.font='900 62px system-ui,sans-serif';
 const lines=[];
 let line='';
 for(const word of headline.split(' ')){
  const next=line?line+' '+word:word;
  if(line&&ctx.measureText(next).width>800){lines.push(line);line=word;}
  else line=next;
 }
 if(line)lines.push(line);
 lines.slice(0,3).forEach((value,i)=>text(value,532,686+i*64,62));
 const subtitleY=Math.max(794,710+(lines.length-1)*64);
 text(subtitle,532,subtitleY,30);
 const l=level(S.totals.xp);
 for(let i=0;i<16;i++){
  block(ink,148+i*48,866,40,24);
  block(trophy||l.top||i<Math.floor(l.progress/l.range*16)?'#c6a55b':'#c9c4ba',152+i*48,870,32,16);
 }
 text('CAMMARATA + SAN GIOVANNI GEMINI',532,960,21,'#506052');
 return canvas.toDataURL('image/png');
}

async function shareProgress(trophy){
 if(!S.me)return;
 const l=level(S.totals.xp);
 try{
  const png=shareCardImage(trophy
   ?{kicker:'TROFEO SBLOCCATO',headline:trophy.name,subtitle:'E boni siemmu!',trophy:true}
   :{kicker:'IL MIO PERCORSO',headline:l.name,subtitle:`Livello ${l.number} · ${l.xp} XP`});
  const filename=trophy?'cca-siemmu-trofeo.png':'cca-siemmu-progressi.png';
  if(typeof File==='function'&&navigator.share&&navigator.canShare){
   const bytes=Uint8Array.from(atob(png.split(',')[1]),c=>c.charCodeAt(0));
   const files=[new File([bytes],filename,{type:'image/png'})];
   if(navigator.canShare({files})){
    try{
     await navigator.share({files,title:'Cca Siemmu'});
     return;
    }catch(e){if(e.name==='AbortError')return;}
   }
  }
  const download=document.createElement('a');
  download.href=png;
  download.download=filename;
  document.body.append(download);
  download.click();
  download.remove();
  say('Card PNG pronta da condividere.');
 }catch(e){say(e.message||'Impossibile creare la card.',true);}
}

function taskFeedback(title,message,offer=false){
 const dialog=document.createElement('dialog');dialog.className='mu-task-dialog';
 dialog.setAttribute('aria-labelledby','mu-task-title');dialog.innerHTML=`<h2 id="mu-task-title">${esc(title)}</h2>${cowMascot('felice',message)}${offer?'<a href="#missioni" class="btn">Scegli una missione →</a>':''}<form method="dialog"><button>${offer?'Non ora':'Va bene'}</button></form>`;
 dialog.addEventListener('close',()=>{const next=dialog.dataset.focusTarget&&document.getElementById(dialog.dataset.focusTarget);dialog.remove();if(next){next.focus({preventScroll:true});next.scrollIntoView({block:'start'});}else main.focus({preventScroll:true});},{once:true});
 dialog.querySelector('a')?.addEventListener('click',()=>dialog.close());document.body.append(dialog);dialog.showModal();return dialog;
}
function refreshMissionChoices(){const el=document.querySelector('#mission-available');if(el)el.innerHTML=availableMissions();main.querySelectorAll('[data-action="mission-category"]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.id===missionCategory)));}
main.addEventListener('input',event=>{
 if(event.target.id==='mission-search'){missionSearch=event.target.value;missionPage=0;refreshMissionChoices();}
 if(event.target.id!=='member-search')return;
 const normalize=value=>value.normalize('NFD').replace(/\p{M}/gu,'').toLocaleLowerCase('it').trim();
 const query=normalize(event.target.value).split(/\s+/);
 let shown=0;
 main.querySelectorAll('[data-member-search]').forEach(el=>{
  const haystack=normalize(el.dataset.memberSearch);
  el.hidden=!query.every(word=>haystack.includes(word));
  if(!el.hidden)shown++;
 });
 const status=main.querySelector('#member-search-status');
 status.hidden=!event.target.value.trim();
 status.textContent=shown===0?'Nessun socio trovato.':shown===1?'1 socio trovato.':`${shown} soci trovati.`;
});
const actions={
 'mission-category'(id){missionCategory=id;missionPage=0;refreshMissionChoices();},
 'mission-page'(id){missionPage=Math.max(0,missionPage+(id==='next'?1:-1));refreshMissionChoices();},
 async 'assignment-take'(id){const ok=await run(()=>api('/my/assignments',{method:'POST',body:{typeId:id}}),'Missione presa in carico.');if(ok){const next=document.getElementById('mission-running');next?.focus({preventScroll:true});next?.scrollIntoView({block:'start'});}},
 async 'assignment-abandon'(id){await run(()=>api('/my/assignments/'+encodeURIComponent(id)+'/abandon',{method:'POST',body:{}}),'Missione abbandonata. Nessuna penalità.');},
 async 'assignment-finish'(id,el){
  const original=el.innerHTML;el.innerHTML='✓ Invio in corso…';el.classList.add('completion-tapped');
  const popup=taskFeedback('Hai finito!', 'Invio la richiesta al referente…');
  let failure='';
  const ok=await run(async()=>{try{await api('/my/assignments/'+encodeURIComponent(id)+'/finish',{method:'POST',body:{note:document.querySelector('#assignment-note-'+id)?.value||''}});}catch(e){failure=e.status===0?'Non ho ricevuto conferma dal server. Aggiorna la pagina prima di riprovare.':e.message;throw e;}},null,{rerender:false});
  popup.querySelector('h2').textContent=ok?'✓ Richiesta inviata':'Controlla la richiesta';
  popup.querySelector('.mascot p').textContent=ok?'Richiesta salvata. Ora il referente verifica il lavoro. XP e Tumazzi arrivano dopo la convalida.':failure||'Non ho ricevuto conferma. Aggiorna la pagina prima di riprovare.';
  if(ok){await render();popup.dataset.focusTarget='mission-waiting';}else{el.innerHTML=original;el.classList.remove('completion-tapped');}
 },
 async 'spin-wheel'(){
  main.querySelector('.wheel-stage')?.classList.add('wheel-spinning');
  let prize;
  await run(async()=>{const [d]=await Promise.all([api('/my/daily-wheel',{method:'POST',body:{}}),new Promise(r=>setTimeout(r,matchMedia('(prefers-reduced-motion: reduce)').matches?0:900))]);prize=d.prize;},null);
  if(prize)say(dailyText(prize));
 },
 async 'team-join'(id){await run(()=>api('/team-quests/'+encodeURIComponent(id)+'/join',{method:'POST',body:{}}),'Iscrizione alla squadra salvata.');},
 async 'team-leave'(id){await run(()=>api('/team-quests/'+encodeURIComponent(id)+'/leave',{method:'POST',body:{}}),'Iscrizione ritirata. Nessuna penalità.');},
 async 'team-cancel'(id){await run(()=>api('/team-quests/'+encodeURIComponent(id)+'/cancel',{method:'POST',body:{}}),'Impresa annullata.');},
 back(){if(routeTrail.length>1){routeTrail.pop();goingBack=true;location.hash=routeTrail.at(-1);}else location.hash='#home';},
 'share-progress':()=>shareProgress(),
 'share-trophy'(id){
  const trophy=(S.trophies||[]).find(t=>String(t.id)===id&&t.earned);
  if(trophy)return shareProgress(trophy);
 },
 async 'assembly-clear'(){await run(()=>api('/assembly/meeting',{method:'PUT',body:{clear:true}}),'Convocazione rimossa.');},
 reload:()=>render(),
 trophy(id){const t=(S.trophies||[]).find(x=>x.id===id);if(t)openTrophy(t);},
 theme(){document.querySelector('#theme-toggle').click();render();},
 tvzoom(id){const z=Math.min(1.6,Math.max(.6,Number(pref.get('tvzoom',1))+(id==='up'?.1:-.1)));pref.set('tvzoom',z.toFixed(2));const el=document.querySelector('.tv-screen');if(el)el.style.setProperty('--tvz',z);},
 async checkin(){const ok=await run(()=>api('/checkin',{method:'POST',body:{direction:'IN'}}),'Check-in registrato.');if(ok)taskFeedback('✓ Sei in sede!', 'Ti va di dare una mano? Scegli una missione: i premi arrivano dopo la verifica.',true);},
 print:()=>window.print(),
 async checkout(){await run(()=>api('/checkout',{method:'POST',body:{}}),'Uscita registrata. A presto!');},
 async rotate(){if(!await confirmAction('Il vecchio QR smetterà di funzionare e dovrai ristampare il cartello. Continuare?'))return;await run(()=>api('/checkin-code/rotate',{method:'POST',body:{}}),'Codice cambiato: ristampa il cartello.');},
 async redeem(id){let r;await run(async()=>{r=await api(`/rewards/${encodeURIComponent(id)}/redeem`,{method:'POST',body:{}});},null,{rerender:false})&&(say(`Premio riscattato! ${r.emailSent?'Ti abbiamo scritto una email con le istruzioni.':'Passa in sede per ritirarlo.'}`),await render());},
 async redeemCancel(id){await run(()=>api(`/redemptions/${encodeURIComponent(id)}/cancel`,{method:'POST',body:{}}),'Riscatto annullato: i Tumazzi sono tornati.');},
 async redDeliver(id){await run(()=>api(`/redemptions/${encodeURIComponent(id)}/deliver`,{method:'POST',body:{}}),'Premio consegnato. Il socio è stato avvisato anche via email.');},
 async rewardActive(id,el){await run(()=>api(`/rewards/${encodeURIComponent(id)}`,{method:'PATCH',body:{active:el.dataset.active==='1'}}),'Vetrina aggiornata.');},
 async xAccept(id){await run(()=>api(`/time-exchanges/${encodeURIComponent(id)}/accept`,{method:'POST',body:{}}),'Richiesta accettata.');},
 async xDecline(id){await run(()=>api(`/time-exchanges/${encodeURIComponent(id)}/decline`,{method:'POST',body:{}}),'Richiesta rifiutata.');},
 async xCancel(id){await run(()=>api(`/time-exchanges/${encodeURIComponent(id)}/cancel`,{method:'POST',body:{}}),'Scambio annullato.');},
 async xDone(id){let r;await run(async()=>{r=await api(`/time-exchanges/${encodeURIComponent(id)}/done`,{method:'POST',body:{}});},null,{rerender:false})&&(say(r.awarded?'Scambio concluso! Hai ricevuto XP e Tumazzi.':'Scambio concluso. Hai già raggiunto il limite di premi della settimana.'),await render());},
 async offerClose(id){await run(()=>api(`/time-offers/${encodeURIComponent(id)}/close`,{method:'POST',body:{}}),'Offerta chiusa.');},
 async vote(id,el){await run(()=>api(`/proposals/${encodeURIComponent(id)}/vote`,{method:'POST',body:{on:el.dataset.on==='1'}}),el.dataset.on==='1'?'Voto registrato.':'Voto tolto.');},
 async pdecline(id){await run(()=>api(`/proposals/${encodeURIComponent(id)}/decline`,{method:'POST',body:{}}),'Proposta segnata come non accolta.');},
 async reserve(id){await run(()=>api(`/activities/${encodeURIComponent(id)}/reserve`,{method:'POST',body:{}}),'Richiesta inviata: un referente la confermerà.');},
 async cancel(id){await run(()=>api(`/activities/${encodeURIComponent(id)}/cancel`,{method:'POST',body:{}}),'Prenotazione annullata.');},
 async logout(){await run(()=>api('/auth/logout',{method:'POST',body:{}}),null,{rerender:false});S.me=null;S.totals={xp:0,cheese:0};S.invite=null;location.hash='#home';render(true);},
 async copy(_,el){try{await navigator.clipboard.writeText(el.dataset.value);say('Link copiato.');}catch{const i=el.parentElement.querySelector('input');i.select();say('Seleziona e copia il link.');}},
 closeInvite(){S.invite=null;return render();},
 async invite(id,el){
  let out;
  const ok=await run(async()=>{out=await api(`/members/${encodeURIComponent(id)}/invite`,{method:'POST',body:{}});},null,{rerender:false});
  if(ok){const who=el.closest('article')?.querySelector('h3')?.textContent||'';S.invite={...out.invite,phone:el.dataset.phone,who};await render();window.scrollTo(0,0);emailBanner(out.invite,who);}
 },
 async role(id,el){await run(()=>api(`/members/${encodeURIComponent(id)}`,{method:'PATCH',body:{role:el.dataset.role}}),'Ruolo aggiornato.');},
 async status(id,el){await run(()=>api(`/members/${encodeURIComponent(id)}`,{method:'PATCH',body:{status:el.dataset.status}}),'Stato aggiornato.');},
 async cardRemove(id){await run(()=>api(`/members/${encodeURIComponent(id)}/card`,{method:'DELETE'}),'Tessera rimossa.');},
 async out(id){await run(()=>api('/access',{method:'POST',body:{memberId:id,direction:'OUT'}}),'Uscita registrata.');},
 async verify(id){let r;await run(async()=>{r=await api(`/chores/${encodeURIComponent(id)}/verify`,{method:'POST',body:{}});},null,{rerender:false})&&(say(r.outcome.cheeseCapped?'Confermata. I Tumazzi sono stati ridotti per il limite settimanale.':'Missione confermata.'),await render());},
 async reject(id){await run(()=>api(`/chores/${encodeURIComponent(id)}/reject`,{method:'POST',body:{}}),'Missione respinta.');},
 async choreActive(id,el){await run(()=>api(`/chore-types/${encodeURIComponent(id)}`,{method:'PATCH',body:{active:el.dataset.active==='1'}}),'Catalogo aggiornato.');},
 async 'act-status'(id,el){await run(()=>api(`/activities/manage/${encodeURIComponent(id)}`,{method:'PATCH',body:{status:el.dataset.status}}),'Attività aggiornata.');},
 async 'bk-confirm'(id,el){await run(()=>api(`/activities/${encodeURIComponent(id)}/confirm`,{method:'POST',body:{memberId:el.dataset.member}}),'Prenotazione confermata.');},
 async 'bk-decline'(id,el){await run(()=>api(`/activities/${encodeURIComponent(id)}/decline`,{method:'POST',body:{memberId:el.dataset.member}}),'Prenotazione rifiutata.');},
 async 'bk-attend'(id,el){await run(()=>api(`/activities/${encodeURIComponent(id)}/attendance`,{method:'POST',body:{memberId:el.dataset.member}}),'Presenza registrata, XP e Tumazzi assegnati.');},
 prefill(){
  const f=main.querySelector('form[data-form="activity"]');if(!f)return;
  f.elements.name.value='Giornata internazionale contro la violenza sulle donne';
  f.elements.startsAt.value='2026-11-25T17:30';f.elements.capacity.value='25';
  f.elements.status.value='draft';
  f.elements.accessMode.value='booking';f.elements.publicEvent.checked=true;
 }
};
function confirmAction(message){
 return new Promise(resolve=>{
  const dialog=document.createElement('dialog');dialog.className='confirm-dialog';
  dialog.setAttribute('aria-labelledby','confirm-title');dialog.setAttribute('aria-describedby','confirm-message');
  dialog.innerHTML=`<h2 id="confirm-title">Confermi l’operazione?</h2><p id="confirm-message">${esc(message)}</p><form method="dialog"><button value="cancel" class="secondary" autofocus>Torna indietro</button><button value="confirm">Conferma</button></form>`;
  dialog.addEventListener('close',()=>{const ok=dialog.returnValue==='confirm';dialog.remove();resolve(ok);},{once:true});
  document.body.append(dialog);dialog.showModal();
 });
}
const destructiveActions={
 'assignment-abandon':'Abbandonare questa missione? Potrai riprenderla in seguito, senza penalità.',
 'team-leave':'Ritirare la tua iscrizione? La squadra potrebbe tornare in formazione.',
 'team-cancel':'Annullare questa impresa per tutta la squadra?',
 'assembly-clear':'Rimuovere la convocazione dell’assemblea?',
 cancel:'Annullare la prenotazione? Potresti perdere il posto.',
 redeemCancel:'Annullare il riscatto e restituire i Tumazzi?',
 xCancel:'Annullare questo scambio?', xDecline:'Rifiutare questa richiesta di scambio?',
 offerClose:'Chiudere questa offerta della Banca del tempo?',
 pdecline:'Segnare la proposta come non accolta?',
 cardRemove:'Rimuovere la tessera associata a questo socio?',
 reject:'Respingere questa richiesta di verifica?',
 'bk-decline':'Rifiutare la prenotazione?',
 redeem:'Confermare il riscatto? I Tumazzi indicati verranno spesi.',
 redDeliver:'Confermare che il premio è stato consegnato?'
};
function actionConfirmation(el){
 const a=el.dataset.action;
 if(a==='status'&&el.dataset.status!=='active')return 'Cambiare lo stato del socio? Il suo accesso potrebbe essere limitato.';
 if(a==='role')return 'Cambiare il ruolo e i permessi di questo socio?';
 if(a==='act-status'&&el.dataset.status!=='published')return 'Ritirare o annullare questa attività? Non sarà più prenotabile.';
 if(['rewardActive','choreActive'].includes(a)&&el.dataset.active!=='1')return 'Disattivare questo elemento del catalogo?';
 return destructiveActions[a];
}
main.addEventListener('click',async event=>{
 const el=event.target.closest('button[data-action]');
 if(!el||el.disabled)return;
 const handler=actions[el.dataset.action];
 if(!handler)return;
 const message=actionConfirmation(el);
 el.disabled=true;
 if(message&&!await confirmAction(message)){el.disabled=false;return;}
 Promise.resolve(handler(el.dataset.id,el)).finally(()=>{el.disabled=false;});
});

const submits={
 async 'team-create'(f,v){await run(()=>api('/team-quests',{method:'POST',body:{title:v('title'),description:v('description'),needed:Number(v('needed')),xp:Number(v('xp')),badge:v('badge')}}),'Impresa pubblicata.');},
 async 'team-complete'(f,v,id){
  if(!await confirmAction('Convalidare il lavoro di tutta la squadra? XP e trofeo saranno assegnati a tutti gli iscritti.'))return;
  await run(()=>api('/team-quests/'+encodeURIComponent(id)+'/complete',{method:'POST',body:{verified:f.elements.verified.checked}}),'Impresa completata: bonus e trofei assegnati alla squadra.');
 },
 async 'achievement-sharing'(f){await run(()=>api('/my/achievement-sharing',{method:'PUT',body:{enabled:f.elements.enabled.checked}}),'Scelta bacheca salvata.');},
 async visit(_f,v){
  await run(()=>api('/space/visit',{method:'PUT',body:{address:v('address'),access:v('access'),accessibility:v('accessibility')}}),'Informazioni della sede aggiornate.');
 },
 async assembly(_f,v){
  await run(()=>api('/assembly/meeting',{method:'PUT',body:{startsAt:v('startsAt'),location:v('location'),agenda:v('agenda')}}),'Convocazione pubblicata.');
 },
 async decision(_f,v,id){
  const body={decidedOn:v('decidedOn'),title:v('title'),decision:v('decision'),reason:v('reason'),responsible:v('responsible'),status:v('status')};
  await run(()=>api(id?`/assembly/decisions/${encodeURIComponent(id)}`:'/assembly/decisions',{method:id?'PUT':'POST',body}),id?'Decisione aggiornata.':'Decisione pubblicata.');
 },
 async 'activity-access'(f,v,id){
  await run(()=>api(`/activities/manage/${encodeURIComponent(id)}`,{method:'PATCH',body:{accessMode:v('accessMode'),publicEvent:f.elements.publicEvent.checked,description:v('description')}}),'Dettagli dell’attività aggiornati.');
 },
 async walkin(_f,v,id){
  await run(()=>api(`/activities/${encodeURIComponent(id)}/attendance`,{method:'POST',body:{memberId:v('memberId')}}),'Presenza registrata.');
 },
 async learning(_f,v){
  await run(()=>api('/my/learning-journal',{method:'PUT',body:{goal:v('goal'),evidence:v('evidence'),reflection:v('reflection')}}),'Riflessione salvata nel tuo account.',{rerender:false});
 },
 async request(f,v){await run(()=>api(`/time-offers/${encodeURIComponent(f.dataset.id)}/request`,{method:'POST',body:{note:v('note')}}),'Richiesta inviata: chi offre l’ora riceve un avviso.');},
 async offer(f,v){await run(()=>api('/time-offers',{method:'POST',body:{title:v('title'),description:v('description')}}),'Offerta pubblicata.');},
 async proposal(f,v){await run(()=>api('/proposals',{method:'POST',body:{title:v('title'),description:v('description')}}),'Proposta pubblicata: ora il gruppo può votarla.');},
 async schedule(f,v){await run(()=>api(`/proposals/${encodeURIComponent(f.dataset.id)}/schedule`,{method:'POST',body:{startsAt:Math.floor(new Date(v('startsAt')).getTime()/1000)}}),'Proposta in calendario (bozza): completala in Referenti → Attività. Chi l’ha proposta è stato avvisato.');},
 async reward(f,v){await run(()=>api('/rewards',{method:'POST',body:{name:v('name'),description:v('description'),cost:Number(v('cost')),quantity:v('quantity')===''?null:Number(v('quantity')),art:v('art')}}),'Premio aggiunto alla vetrina.');},
 async rewardedit(f,v){await run(()=>api(`/rewards/${encodeURIComponent(f.dataset.id)}`,{method:'PATCH',body:{cost:Number(v('cost')),quantity:v('quantity')===''?null:Number(v('quantity'))}}),'Premio aggiornato.');},
 async login(f,v){
  const ok=await run(async()=>{const d=await api('/auth/login',{method:'POST',body:{email:v('email'),password:v('password')}});S.me=d.member;},null,{rerender:false});
  if(ok){await refreshTotals();let next=v('next')==='#banca'?'#banca':'#home';try{if(next==='#home')next=sessionStorage.getItem('cca-after-login')||next;sessionStorage.removeItem('cca-after-login');}catch{}location.hash=next;await render(true);say('Bentornatə!');}
 },
 async setpw(f,v){
  if(v('password')!==v('again')){say('Le due password non coincidono.',true);return;}
  const ok=await run(async()=>{const d=await api('/auth/set-password',{method:'POST',body:{token:v('token'),password:v('password')}});S.me=d.member;},null,{rerender:false});
  if(ok){await refreshTotals();location.hash='#home';await render(true);say('Profilo completo. Benvenutə!');}
 },
 async nick(f,v){await run(async()=>{const d=await api('/auth/profile',{method:'PATCH',body:{pseudonym:v('pseudonym')}});S.me=d.member;},'Nome utente aggiornato.');},
 async interests(f,v){const list=[...f.querySelectorAll('input[name=interest]:checked')].map(i=>i.value);await run(async()=>{const d=await api('/auth/profile',{method:'PATCH',body:{interests:list}});S.me=d.member;},'Interessi salvati.');},
 async changepw(f,v){if(await run(()=>api('/auth/change-password',{method:'POST',body:{current:v('current'),next:v('next')}}),'Password cambiata.',{rerender:false}))f.reset();},
 avatar(f,v){pref.set('species',v('species')||'mucca');pref.set('color',v('color')||'rosa');say('Avatar salvato.');return render();},
 async chore(f,v,id){if(await run(()=>api('/chores',{method:'POST',body:{typeId:id,note:v('note')}}),'Richiesta inviata: un referente la verificherà.'))return;},
 async member(f,v){
  let out;
  const ok=await run(async()=>{out=await api('/members',{method:'POST',body:{fullName:v('fullName'),email:v('email'),pseudonym:v('pseudonym')||undefined,phone:v('phone')||undefined,role:v('role')}});},null,{rerender:false});
  if(ok){const who=out.member.fullName||out.member.pseudonym;S.invite={...out.invite,phone:out.member.phone,who};await render();window.scrollTo(0,0);emailBanner(out.invite,who);}
 },
 async card(f,v,id){await run(()=>api(`/members/${encodeURIComponent(id)}/card`,{method:'PUT',body:{uidTessera:v('uid')}}),'Tessera assegnata.');},
 async access(f,v){
  const body={memberId:v('memberId')};
  if(v('at'))body.at=Math.floor(new Date(v('at')).getTime()/1000);
  let r;
  const ok=await run(async()=>{r=await api('/access',{method:'POST',body});},null,{rerender:false});
  if(ok){say(`${r.access.direction==='IN'?'Ingresso':'Uscita'} registrato per ${r.access.name}.`);await render();}
 },
 async logchore(f,v){await run(()=>api('/chores',{method:'POST',body:{typeId:v('typeId'),memberId:v('memberId'),note:v('note')}}),'Missione registrata e convalidata.');},
 async choretype(f,v){await run(()=>api('/chore-types',{method:'POST',body:{name:v('name'),description:v('description'),xp:Number(v('xp')),cheese:Number(v('cheese')),path:v('path')}}),'Missione aggiunta al catalogo.');},
 async chorepath(f,v){await run(()=>api(`/chore-types/${encodeURIComponent(f.dataset.id)}`,{method:'PATCH',body:{path:v('path')}}),'Percorso aggiornato.');},
 async activity(f,v){
  await run(()=>api('/activities/manage',{method:'POST',body:{name:v('name'),startsAt:Math.floor(new Date(v('startsAt')).getTime()/1000),capacity:Number(v('capacity')),verificationRule:v('verificationRule'),xp:Number(v('xp')),cheese:Number(v('cheese')),path:v('path')||null,status:v('status'),accessMode:v('accessMode'),publicEvent:f.elements.publicEvent.checked,description:v('description')}}),'Attività creata.');
 }
};
main.addEventListener('submit',async event=>{
 const f=event.target.closest('form[data-form]');
 if(!f)return;
 event.preventDefault();
 const handler=submits[f.dataset.form];
 if(!handler)return;
 if(f.dataset.form==='learning'&&['goal','evidence','reflection'].every(k=>!f.elements[k]?.value.trim())&&!await confirmAction('Salvare il diario vuoto? Il contenuto precedente sarà cancellato.'))return;
 const submit=f.querySelector('button:not([type])');
 if(submit)submit.disabled=true;
 const v=name=>{const e=f.elements[name];return e?String(e.value??'').trim():'';};
 try{await handler(f,v,f.dataset.id);}finally{if(submit)submit.disabled=false;}
});
let audio;
function playClick(){
 const Audio=window.AudioContext||window.webkitAudioContext;
 if(!Audio)return;
 try{
  audio??=new Audio();
  const play=()=>{
   const time=audio.currentTime;
   const oscillator=audio.createOscillator();
   const gain=audio.createGain();
   oscillator.type='triangle';
   oscillator.frequency.setValueAtTime(660,time);
   oscillator.frequency.setValueAtTime(480,time+.03);
   gain.gain.setValueAtTime(.055,time);
   gain.gain.exponentialRampToValueAtTime(.001,time+.075);
   oscillator.connect(gain).connect(audio.destination);
   oscillator.start(time);
   oscillator.stop(time+.08);
  };
  if(audio.state==='running')play();
  else audio.resume().then(play).catch(()=>{});
 }catch{}
}
document.addEventListener('click',event=>{
 const control=event.target.closest('button, a[href], summary');
 if(control&&!control.matches(':disabled,[aria-disabled="true"]')&&pref.get('sound','off')==='on')playClick();
},true);
main.addEventListener('change',event=>{
 if(event.target.matches('form[data-form="avatar"] input[name="color"]')){
  const form=event.target.form;
  form.querySelectorAll('input[name="species"]').forEach(input=>{
   input.nextElementSibling.outerHTML=avatar(input.value,event.target.value);
  });
 }

 if(event.target.id!=='sound-toggle')return;
 pref.set('sound',event.target.checked?'on':'off');
 if(event.target.checked)playClick();
});

document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'){updateDateIndicators();if(S.me)recordAppDay();}});
window.addEventListener('hashchange',()=>{if(location.hash==='#main')return;if(goingBack)goingBack=false;else if(routeTrail.at(-1)!==location.hash)routeTrail.push(location.hash||'#home');render(true);});
render();

const themeControl=document.querySelector('#theme-toggle');
function applyTheme(night){
 document.documentElement.dataset.theme=night?'night':'day';
 themeControl.setAttribute('aria-pressed',String(night));
 themeControl.innerHTML=pixelIcon(night?shapes.sun:shapes.moon);
 themeControl.setAttribute('aria-label',night?'Passa alla modalità giorno':'Passa alla modalità notte');
}
let night=false;
try{night=(localStorage.getItem('cca-theme')??(window.matchMedia('(prefers-color-scheme: dark)').matches?'night':'day'))==='night';}catch{}
applyTheme(night);
themeControl.addEventListener('click',()=>{night=!night;applyTheme(night);try{localStorage.setItem('cca-theme',night?'night':'day');}catch{}});
