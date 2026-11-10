/* CCA SIEMMU · sito collegato alle API del Worker */
const navIcons = {
 home:'<path d="M1 7h2V5h2V3h2V1h2v2h2v2h2v2h2v3h-2v5H3v-5H1z"/><path fill="#fe4400" d="M3 8h2V6h2V4h2v2h2v2h2v1H3z"/><path fill="#fff3d5" d="M5 10h6v3H9v-2H7v2H5z"/>',
 calendario:'<path d="M4 1h2v2h4V1h2v2h3v12H1V3h3z"/><path fill="#fe4400" d="M3 5h10v2H3z"/><path fill="#fff3d5" d="M3 8h10v5H3z"/><path fill="#6f440f" d="M4 9h2v1H4z M7 9h2v1H7z M10 9h2v1h-2z M4 11h2v1H4z M7 11h2v1H7z"/>',
 missioni:'<path d="M4 1h8v2h3v5h-2v2h-3v2h3v3H3v-3h3v-2H3V8H1V3h3z"/><path fill="#b9954b" d="M5 3h6v5h-1v1H6V8H5z M7 10h2v2H7z M5 13h6v1H5z"/><path fill="#fff3d5" d="M7 4h2v2H7z M3 5h1v2H3z M12 5h1v2h-1z"/>',
 comunita:'<path d="M2 2h4v1h1v4H6v1h4V7H9V3h1V2h4v1h1v4h-1v2h1v1h1v4H0v-4h1V9h1V7H1V3h1z"/><path fill="#8feafc" d="M3 4h2v2H3z M2 10h4v2H2z"/><path fill="#caff4d" d="M11 4h2v2h-2z M10 10h4v2h-4z"/>',
 profilo:'<path d="M2 1h12v1h1v12h-1v1H2v-1H1V2h1z"/><path fill="#fff3d5" d="M3 3h10v10H3z"/><path d="M6 4h4v4H6z M5 9h6v1h1v2H4v-2h1z"/><path fill="#b9954b" d="M7 5h2v2H7z"/><path fill="#fe4400" d="M6 10h4v1H6z"/>'
};
const shapes = {
 book:'<path fill="#161525" d="M1 3h6v1h2V3h6v10H9v1H7v-1H1z"/><path fill="#fff0bd" d="M2 4h4v1h1v7H6v-1H2z M9 5h1V4h4v7h-4v1H9z"/><path fill="#5876df" d="M3 6h3v1H3z M3 8h3v1H3z M10 6h3v1h-3z M10 8h3v1h-3z"/>',
 camera:'<path fill="#161525" d="M1 5h3V3h7v2h4v9H1z"/><path fill="#fff0bd" d="M2 6h12v6H2z"/><path fill="#2048ef" d="M6 6h5v1h1v4h-1v1H6v-1H5V7h1z"/><path fill="#9de2ff" d="M7 7h3v3H7z"/>',
 plant:'<path fill="#161525" d="M1 2h5v2h2v2h1V4h2V2h4v6h-2v2h-3v2h3v3H3v-3h4v-2H4V8H1z"/><path fill="#a8ef69" d="M2 3h3v2h2v4H5V7H2z M11 5h1V3h2v4h-2v2h-2V6h1z"/><path fill="#d37c4a" d="M4 13h8v1H4z"/>',
 heart:'<path fill="#161525" d="M1 3h5v1h4V3h5v6h-2v2h-2v2H9v2H7v-2H5v-2H3V9H1z"/><path fill="#ff55a1" d="M2 4h3v1h2v1h2V5h2V4h3v4h-2v2h-2v2H8v1H7v-1H6v-2H4V8H2z"/>',
 pin:'<path fill="#171523" d="M3 2h9v2h2v9h-2v2H3v-2H1V4h2z"/><path fill="#fe4400" d="M4 4h7v1h1v7h-1v1H4v-1H3V5h1z"/><path fill="#fff3d5" d="M7 5h2v2h2v2H9v2H7V9H5V7h2z"/>',
 bag:'<path fill="#171523" d="M5 1h6v2h1v3h2v9H2V6h2V3h1z"/><path fill="#b9954b" d="M6 3h4v3H9V4H7v2H6z M4 8h8v5H4z"/><path fill="#fff3d5" d="M7 9h2v2H7z"/>',
 shirt:'<path fill="#171523" d="M5 1h6v1h2v2h2v5h-3v6H4V9H1V4h2V2h2z"/><path fill="#8feafc" d="M3 5h2V3h1v2h4V3h1v2h2v2h-3v6H6V7H3z"/><path fill="#6f440f" d="M7 7h2v2H7z"/>',
 star:'<path fill="#161525" d="M7 1h2v3h2v2h4v3h-3v3h1v3h-3v-2H6v2H3v-3h1V9H1V6h4V4h2z"/><path fill="#ffe043" d="M7 3h2v3h2v1h3v1h-3v4H9v-1H7v1H5V8H2V7h3V6h2z"/>'
};
const art = name=>`<div class="sprite-box"><svg class="sprite" viewBox="0 0 16 16" shape-rendering="crispEdges" aria-hidden="true">${shapes[name]}</svg></div>`;
const avatarColors = {
 rosa:['Rosa fichidindia','#ff55a1'],verde:['Verde salvia','#bce98d'],blu:['Blu cielo','#699cff'],
 sole:['Giallo ginestra','#ffce39'],terracotta:['Terracotta','#dc7046'],viola:['Viola tramonto','#ad82ed'],
 ottanio:['Verde ottanio','#138f91'],crema:['Crema pietra','#fff3d5'],rosso:['Rosso melograno','#e9435d'],
 bosco:['Verde bosco','#428357'],cobalto:['Blu cobalto','#3456c7'],prugna:['Prugna','#953c83']
};
const animals = {
 mucca:{name:'Mucca',art:'<path fill="#b9954b" d="M4 2h2v3H4z M10 2h2v3h-2z"/><path fill="#171523" d="M2 4h4V3h4v1h4v4h-2v4H4V8H2z"/><path fill="#fffdf4" d="M4 5h8v5H4z"/><path fill="#73584e" d="M4 5h3v3H4z"/><path fill="#171523" d="M6 6h1v2H6z M10 6h1v2h-1z"/><path fill="#ee99aa" d="M5 9h6v2H5z"/><path fill="#171523" d="M6 9h1v1H6z M9 9h1v1H9z"/>'},
 pecora:{name:'Pecora',art:'<path fill="#171523" d="M4 3h2V2h4v1h2v2h2v5h-2v2H4v-2H2V5h2z"/><path fill="#fffdf4" d="M5 4h2V3h2v1h2v2h2v3h-2v2H5V9H3V6h2z"/><path fill="#7e6e80" d="M5 6h6v4H5z"/><path fill="#171523" d="M6 7h1v1H6z M9 7h1v1H9z M7 9h2v1H7z"/>'},
 gallina:{name:'Gallina',art:'<path fill="#171523" d="M7 2h4v2h1v2h3v3h-3v3H3v-2H2V6h3v1h1V4h1z"/><path fill="#fe4400" d="M8 3h2v2H8z M10 9h1v2h-1z"/><path fill="#fffdf4" d="M3 7h2v2h2V5h4v6H4V9H3z"/><path fill="#ffbd37" d="M11 7h3v1h-3z"/><path fill="#171523" d="M9 6h1v1H9z"/>'},
 asino:{name:'Asino',art:'<path fill="#171523" d="M3 1h3v3h4V1h3v5h-1v6H4V6H3z"/><path fill="#a8a0ad" d="M4 2h1v4h6V2h1v3h-1v6H5V5H4z"/><path fill="#fff3d5" d="M5 9h6v2H5z"/><path fill="#171523" d="M6 6h1v2H6z M9 6h1v2H9z M7 9h2v1H7z"/>'},
 maiale:{name:'Maiale',art:'<path fill="#171523" d="M2 3h4v2h4V3h4v5h-1v3h-2v1H5v-1H3V8H2z"/><path fill="#ee99aa" d="M3 4h2v2h6V4h2v3h-1v3h-2v1H6v-1H4V7H3z"/><path fill="#cf6789" d="M6 8h4v2H6z"/><path fill="#171523" d="M5 6h1v1H5z M10 6h1v1h-1z M6 9h1v1H6z M9 9h1v1H9z"/>'},
 capra:{name:'Capra',art:'<path fill="#171523" d="M4 1h2v3h4V1h2v4h3v3h-3v2h-2v2H6v-2H4V8H1V5h3z"/><path fill="#b9954b" d="M5 2h1v3H5z M10 2h1v3h-1z"/><path fill="#fffdf4" d="M2 6h3V5h6v1h3v1h-3v2H9v2H7V9H5V7H2z"/><path fill="#171523" d="M6 6h1v1H6z M9 6h1v1H9z M7 8h2v1H7z"/>'},
 ricotta:{name:'Vascello di ricotta',art:'<path fill="#171523" d="M6 2h4v1h2v2h2v4h-1v2h-2v1H5v-1H3V9H2V5h2V3h2z"/><path fill="#fffdf4" d="M6 3h4v1h2v2h1v1H3V6h2V4h1z"/><path fill="#b9954b" d="M3 8h10v1h-1v2H4V9H3z"/><path fill="#6f440f" d="M5 8h1v3H5z M8 8h1v3H8z M11 8h1v2h-1z"/>'},
 ficodindia:{name:'Pala di fico d’India',art:'<path fill="#171523" d="M6 2h4v1h2v3h1v3h-2v2H9v1H6v-1H4V9H3V6h1V3h2z"/><path fill="#69a650" d="M6 3h4v1h1v3h1v1h-2v2H8v1H6v-1H5V8H4V6h1V4h1z"/><path fill="#fff3d5" d="M6 5h1v1H6z M9 6h1v1H9z M6 8h1v1H6z"/><path fill="#fe4400" d="M9 1h2v2H9z"/>'},
 torre:{name:'Torre in rovina',art:'<path fill="#171523" d="M3 2h3v2h2v1h2V3h3v9H3z"/><path fill="#b9954b" d="M4 3h1v2h3v1h3V4h1v7H4z"/><path fill="#fff3d5" d="M4 6h3v1H4z M9 7h3v1H9z"/><path fill="#171523" d="M7 7h2v4H7z M5 9h1v1H5z M10 9h1v1h-1z"/>'},
 serpente:{name:'Serpente',art:'<path fill="#171523" d="M9 2h4v1h2v5h-3v4H2V9h2V7h5z"/><path fill="#69a650" d="M10 3h3v1h1v3h-3v4H3v-1h2V8h5z"/><path fill="#caff4d" d="M4 10h6v1H4z"/><path fill="#171523" d="M12 4h1v1h-1z"/><path fill="#fe4400" d="M13 7h3v1h-3z"/>'},
 cane:{name:'Cane',art:'<path fill="#171523" d="M2 3h4v1h4V3h4v7h-2v2H4v-2H2z"/><path fill="#b9954b" d="M3 4h2v5H3z M11 4h2v5h-2z"/><path fill="#fff3d5" d="M5 5h6v6H5z"/><path fill="#171523" d="M6 6h1v1H6z M9 6h1v1H9z M7 8h2v1H7z"/><path fill="#ee99aa" d="M7 10h2v1H7z"/>'},
 civetta:{name:'Civetta',art:'<path fill="#171523" d="M2 2h3v2h6V2h3v8h-2v2H4v-2H2z"/><path fill="#b9954b" d="M3 3h1v2h8V3h1v6h-2v2H5V9H3z"/><path fill="#fff3d5" d="M4 6h3v3H4z M9 6h3v3H9z"/><path fill="#171523" d="M5 7h1v1H5z M10 7h1v1h-1z"/><path fill="#fe4400" d="M7 9h2v1H7z"/>'}
};
const cheese='<path fill="#171523" d="M10 1h2v1h2v2h1v10H1V7h2V6h2V5h2V4h2V2h1z"/><path fill="#f4bf57" d="M10 3h2v1h1v2H5V5h2V4h3z"/><path fill="#ffd782" d="M3 8h10v4H3z"/><path fill="#a96a32" d="M5 9h2v2H5z M10 10h2v1h-2z"/>';
function cowMascot(mood,text,tips=[]){
 const eyes={normale:'M6 6h1v2H6z M10 6h1v2h-1z',felice:'M5 7h1V6h2v1H5z M9 7h1V6h2v1H9z',curioso:'M6 6h1v2H6z M10 7h1v1h-1z',festoso:'M5 6h2v1H5z M10 6h2v1h-2z'};
 const sprite='<path fill="#171523" d="M2 4h2V2h3v2h2V2h3v2h2v1h2v4h-3v3h-2v2H5v-2H3V9H0V5h2z"/><path fill="#b9954b" d="M5 3h1v2H5z M10 3h1v2h-1z"/><path fill="#fff3d5" d="M2 6h3V5h6v1h3v2h-2v3h-2v2H6v-2H4V8H2z"/><path fill="#73584e" d="M4 6h3v2H4z"/><path fill="#ee99aa" d="M5 9h6v3H5z"/><path fill="#171523" d="M6 9h1v1H6z M9 9h1v1H9z M7 11h2v1H7z"/>';
 const all=[text,...tips.filter(t=>t&&t!==text)];
 return `<div class="mascot ${all.length>1?'talk':''}" ${all.length>1?`data-tips="${esc(JSON.stringify(all))}" data-i="0" tabindex="0" role="button" aria-label="Mù: tocca per un altro consiglio"`:''}>${pixelIcon(sprite+`<path fill="#171523" d="${eyes[mood]}"/>`,'mu-sprite')}<div><strong>Mù</strong><p aria-live="polite">${esc(text)}</p></div></div>`;
}
const pixelIcon = (path,kind='')=>`<svg class="pixel-icon ${kind}" viewBox="0 0 16 16" shape-rendering="crispEdges" aria-hidden="true">${path}</svg>`;

/* ===== CCA SIEMMU · frontend collegato alle API ===== */
const LEVELS=[['Noviziu',0],['Esploratore',60],['Cumpagnu',150],['Custode',300],['Capufila',520],['Maestru',800],['Pilastru',1150],['Leggenda di cca',1600]];
const WEEKLY_CHEESE=12;
const main=document.querySelector('main');
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const S={me:null,totals:{xp:0,cheese:0},invite:null,loaded:false,unread:0};
const bellIcon=()=>pixelIcon('<path fill="currentColor" d="M7 1h2v2h3v2h1v6h2v2H1v-2h2V5h1V3h3zM6 14h4v2H6z"/>','bell-icon');
const pref={get(k,d){try{return localStorage.getItem('cca-'+k)??d;}catch{return d;}},set(k,v){try{localStorage.setItem('cca-'+k,v);}catch{}}};

/* ---- rete ---- */
async function api(path,{method='GET',body}={}){
 let response;
 try{response=await fetch('/api'+path,{method,credentials:'same-origin',headers:body===undefined?{}:{'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)});}
 catch{const e=new Error('Connessione non riuscita. Controlla la rete e riprova.');e.status=0;throw e;}
 let data=null;try{data=await response.json();}catch{}
 if(!response.ok){const e=new Error(data?.error||`Errore ${response.status}`);e.status=response.status;throw e;}
 return data;
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
const section=(name,content,action='')=>`<section><div class="section-head"><h2>${name}</h2>${action}</div>${content}</section>`;
const title=(name,desc,eyebrow='CCA SIEMMU')=>`<header class="page-title"><span class="eyebrow">${eyebrow}</span><h1>${name}</h1>${desc?`<p>${desc}</p>`:''}</header>`;
const link=(label,href)=>`<a class="btn" href="#${href}">${label} →</a>`;
const btn=(label,action,id='',{secondary=false,extra=''}={})=>`<button type="button" data-action="${action}" data-id="${esc(id)}" ${extra} class="${secondary?'secondary':''}">${esc(label)}</button>`;
const field=(name,label,type='text',extra='')=>`<label>${label}<input name="${name}" type="${type}" ${extra}></label>`;
const form=(kind,body,label,{id='',cls='card'}={})=>`<form class="${cls}" data-form="${kind}" data-id="${esc(id)}">${body}<button>${label}</button></form>`;
const bar=(value,max,label,suffix='')=>`<div class="bar-row"><span class="bar-label">${esc(label)}</span><span class="bar-track"><span class="bar-fill" style="width:${max?Math.max(2,Math.round(value/max*100)):0}%"></span></span><span class="bar-value">${value}${suffix}</span></div>`;
const empty=text=>`<p class="muted">${text}</p>`;
const fmt=(sec,opts)=>new Intl.DateTimeFormat('it-IT',{timeZone:'Europe/Rome',...opts}).format(new Date(sec*1000));
const dateLong=sec=>fmt(sec,{weekday:'short',day:'numeric',month:'long',hour:'2-digit',minute:'2-digit'});
const dateShort=sec=>fmt(sec,{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});
const duration=min=>min>=60?`${Math.floor(min/60)} h ${min%60?String(min%60).padStart(2,'0')+' min':''}`.trim():`${min} min`;
const statusText={pending:'In attesa',verified:'Verificata',rejected:'Respinta',confirmed:'Confermata',declined:'Rifiutata',cancelled:'Annullata',draft:'Bozza',published:'Pubblicata',approved:'Attivo',disabled:'Disattivato'};
const avatar=(species=pref.get('species','mucca'),color=pref.get('color','rosa'))=>{
 const animal=Object.hasOwn(animals,species)?animals[species]:animals.mucca;
 const accent=(Object.hasOwn(avatarColors,color)?avatarColors[color]:avatarColors.rosa)[1];
 return `<svg class="avatar" viewBox="0 0 16 16" shape-rendering="crispEdges" role="img" aria-label="Avatar pixel · ${animal.name}"><path fill="#fff3d5" d="M0 0h16v16H0z"/>${animal.art}<path fill="#171523" d="M4 13h8v1h1v2H3v-2h1z"/><path fill="${accent}" d="M4 14h8v2H4z"/></svg>`;
};
function level(xp){
 const i=LEVELS.findLastIndex(([,t])=>xp>=t),[name,t]=LEVELS[i],next=LEVELS[i+1];
 return {number:i+1,name,xp,progress:xp-t,range:next?next[1]-t:1,left:next?next[1]-xp:0,top:!next};
}
function profileChip(){
 const l=level(S.totals.xp);
 return `<div class="row">${avatar()}<div><span class="eyebrow">LIVELLO ${l.number} / ${LEVELS.length}</span><div class="metric">${esc(S.me.pseudonym)}</div><p>${esc(l.name)}</p></div></div><progress value="${l.top?1:l.progress}" max="${l.range}" aria-label="Progresso del livello"></progress><p class="muted"><strong>${l.xp} XP</strong>${l.top?' · livello massimo':` · mancano ${l.left} XP al prossimo livello`}</p>`;
}
const loading=()=>`<p role="status">Stamu arrivannu…</p>`;
const failCard=e=>card(`<h3>Qualcosa non ha funzionato</h3><p>${esc(e.message)}</p>${btn('Riprova','reload')}`);
const needLogin=()=>title('Serve l’accesso','Questa pagina è riservata a chi ha un account.')+card(`<p>Accedi con la tua email e la tua password.</p>${link('Accedi','accedi')}`);
const needOrganizer=()=>title('Area referenti','Riservata ai referenti.')+card('<p>Il tuo account non ha il ruolo di referente.</p>'+link('Torna alla Home','home'));

/* ---- navigazione ---- */
const navDefs={
 home:['Home','home'],calendario:['Calendario','calendario'],spazio:['Spazio','comunita'],comunita:['Comunità','comunita'],accedi:['Accedi','profilo'],
 missioni:['Missioni','missioni'],presenze:['Statistiche','comunita'],trofei:['Trofei','comunita'],putia:['Putìa','comunita'],banca:['Banca','comunita'],proposte:['Proposte','comunita'],referenti:['Referenti','comunita'],profilo:['Profilo','profilo']
};
function renderChrome(active){
 const ids=!S.me?['home','calendario','spazio','accedi']:isOrganizer()?['home','calendario','missioni','comunita','referenti','profilo']:['home','calendario','missioni','comunita','profilo'];
 const nav=document.querySelector('#nav');
 nav.style.setProperty('--cols',ids.length);
 nav.innerHTML=ids.map(id=>`<a href="#${id}" ${active===id?'aria-current="page"':''}><span class="nav-icon-tile" aria-hidden="true">${pixelIcon(navIcons[navDefs[id][1]],'nav-icon')}</span>${navDefs[id][0]}</a>`).join('');
 const bell=document.querySelector('#notifications');
 bell.hidden=!S.me;
 if(S.me){bell.setAttribute('aria-label',S.unread?`Notifiche, ${S.unread} da leggere`:'Notifiche');bell.innerHTML=bellIcon()+(S.unread?`<span class="unread" aria-hidden="true">${S.unread}</span>`:'');}
 const wallet=document.querySelector('#wallet-link');
 wallet.hidden=!S.me;
 if(S.me){wallet.innerHTML=pixelIcon(cheese)+`<span>${S.totals.cheese}</span>`;wallet.setAttribute('aria-label',`${S.totals.cheese} Formaggi · apri la Putìa`);wallet.setAttribute('href','#putia');}
}

/* ---- orari, stato live, Mù, paese, albero, festa ---- */
const clockIcon=()=>pixelIcon('<path fill="#171523" d="M5 1h6v1h2v1h1v2h1v6h-1v2h-1v1h-2v1H5v-1H3v-1H2v-2H1V5h1V3h1V2h2z"/><path fill="#fff3d5" d="M5 2h6v1h2v2h1v6h-1v2h-2v1H5v-1H3v-2H2V5h1V3h2z"/><path fill="#171523" d="M7 4h2v4h3v2H7z"/>');
const getStatus=async()=>{try{return await api('/status');}catch{return null;}};
const getCommunity=async()=>{try{return (await api('/community')).metrics;}catch{return null;}};
function liveLine(st){
 if(!st)return '';
 const n=st.count,label=st.open?(n===undefined?'Aperto ora':`Aperto ora · ${n} ${n===1?'persona dentro':'persone dentro'}`):'Chiuso al momento';
 return `<span class="live ${st.open?'live-on':'live-off'}"><span class="live-dot" aria-hidden="true"></span>${label}</span>`;
}
const openingCard=st=>card(`<span class="eyebrow">ORARI DELLA SEDE</span><div class="stat-figure">${clockIcon()}<div><strong class="metric">${esc(st?.hours||'16:00–20:00')}</strong><span class="stat-label">${esc(st?.days||'Da lunedì a venerdì')}</span></div></div><div id="live" role="status" aria-live="polite">${liveLine(st)}</div><p class="muted">“Aperto ora” si accende quando c’è almeno una persona in sede.${S.me?'':' Il numero delle persone lo vedono i soci.'}</p>`,'green');
setInterval(async()=>{const el=document.querySelector('#live');if(!el||document.hidden)return;const st=await getStatus();const again=document.querySelector('#live');if(st&&again)again.innerHTML=liveLine(st);},60000);

function muSays(page,extra={}){
 const l=S.me?level(S.totals.xp):null;
 if(page==='home'){
  if(!l)return ['normale','E boni siemmu!'];
  if(l.top)return ['festoso','Sei Leggenda di cca! Dai una mano a chi sale.'];
  if(l.left<=20)return ['curioso',`Ci sei quasi: ${l.left} XP e arrivi al livello ${l.number+1}!`];
  return ['normale',`Ciao ${S.me.pseudonym}! Oggi che si fa?`];
 }
 if(page==='missioni')return extra.pending?['curioso',`${extra.pending} ${extra.pending===1?'richiesta aspetta':'richieste aspettano'} un referente. Pazienza!`]:['normale','Una missione fatta bene vale più di mille parole.'];
 if(page==='calendario')return ['curioso','Prenota un posto: ti aspettiamo!'];
 if(page==='profilo')return ['felice',l?`Livello ${l.number}: ${l.name}. Bella strada!`:'Bella strada!'];
 if(page==='paese')return ['felice',extra.reached?`Il paese cresce: ${extra.reached} ${extra.reached===1?"traguardo":"traguardi"} su ${extra.total}!`:'Il paese è appena nato. Ogni presenza lo fa crescere.'];
 return ['normale','E boni siemmu!'];
}
const MU_TIPS={
 home:['Hai già visto le missioni di oggi?','Hai un’idea per lo spazio? Scrivila nelle Proposte.','Controlla la Putìa: forse hai abbastanza Formaggi!','Hai un’ora libera? La Banca del tempo ti aspetta.','Quando arrivi, inquadra il QR all’ingresso.'],
 missioni:['Ogni missione verificata ti avvicina al prossimo livello.','Le missioni ripetibili danno al massimo 12 Formaggi a settimana.','Chiedi la verifica a un referente: non puoi verificare le tue.'],
 calendario:['Prenota presto: i posti volano!','Le attività consigliate per te hanno il bollino verde.','Non puoi più venire? Annulla, così il posto va a un altro.'],
 profilo:['Scegli i tuoi interessi: ti consiglio le attività giuste.','Puoi cambiare il tuo nome utente quando vuoi.','Guarda l’albero: ogni ramo cresce con le tue esperienze.'],
 paese:['Ogni presenza fa crescere il paese.','Il paese è di tutte e tutti: grazie di esserci!'],
 generic:['E boni siemmu!','Un passo alla volta si arriva lontano.','Cca si sta bene insieme.']
};
const mu=(page,extra)=>{const [m,t]=muSays(page,extra);return cowMascot(m,t,[...(MU_TIPS[page]||[]),...MU_TIPS.generic]);};
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
function treeGraphic(counts){
 const xs=[9,25,41,57,73],cols=['#8feafc','#ff9fc8','#ff8a4d','#c8a8ff','#caff4d'];
 let svg='<rect x="0" y="52" width="82" height="4" fill="#6f440f"/><rect x="38" y="34" width="6" height="19" fill="#6f440f"/>';
 PATHS.forEach(([id],i)=>{
  const x=xs[i],n=counts[id]||0;
  svg+=`<rect x="${Math.min(x,41)}" y="34" width="${Math.abs(x-41)+1}" height="2" fill="#6f440f"/><rect x="${x}" y="8" width="2" height="28" fill="#6f440f"/>`;
  [[1,28],[3,19],[5,10]].forEach(([need,y])=>{const on=n>=need;svg+=`<rect x="${x-3}" y="${y}" width="8" height="8" fill="#171523"/><rect x="${x-2}" y="${y+1}" width="6" height="6" fill="${on?cols[i]:'#e6e0cf'}" class="${on?'tree-on':''}"/>`;});
 });
 return `<div class="tree-box"><svg viewBox="0 0 82 56" shape-rendering="crispEdges" role="img" aria-label="Albero delle competenze: cinque rami, tre tappe ciascuno">${svg}</svg></div>`;
}
function skillTree(counts,types){
 return section('Albero delle competenze',`<p class="section-intro">Le tappe raccontano le esperienze verificate in sede. Prima tappa a 1 esperienza, poi 3 e 5.</p>`+card(treeGraphic(counts))+grid(PATHS.map(([id,name,icon])=>{
  const n=counts[id]||0,next=[1,3,5].find(x=>x>n);
  const dots=[1,3,5].map(x=>`<span class="stage ${n>=x?'done':''}" title="Tappa ${x}">${x}</span>`).join('');
  const linked=types.filter(t=>t.path===id);
  return card(`${art(icon)}<h3>${esc(name)}</h3><div class="stages" aria-hidden="true">${dots}</div><p><strong>${n}</strong> ${n===1?'esperienza verificata':'esperienze verificate'} · ${next?'Prossima tappa '+next:'Tutte le tappe raggiunte'}</p><progress value="${next?n:5}" max="${next||5}" aria-label="Progresso in ${esc(name)}"></progress>${id==='socialita'?'<p class="muted">Conta anche la partecipazione alle attività.</p>':''}${linked.length?`<ul class="list">${linked.map(t=>`<li><a href="#missioni">${esc(t.name)}</a></li>`).join('')}</ul>`:''}`);
 })));
}

function checkLevelUp(){
 if(!S.me)return;
 const key='lvl-'+S.me.id,n=level(S.totals.xp).number,old=Number(pref.get(key,0));
 pref.set(key,n);
 if(old&&n>old)celebrate(n);
}
function celebrate(n){
 let box=document.querySelector('#celebration');
 if(!box){box=document.createElement('div');box.id='celebration';document.body.append(box);}
 const l=LEVELS[n-1];
 const colors=['#caff4d','#fe4400','#8feafc','#ffe043','#ff55a1'];
 const bits=Array.from({length:18},(_,i)=>`<i style="left:${(i*37)%100}%;background:${colors[i%5]};animation-delay:${(i%6)*90}ms"></i>`).join('');
 box.className='celebration';box.setAttribute('role','dialog');box.setAttribute('aria-label','Hai raggiunto un nuovo livello');
 box.innerHTML=`<div class="celebration-card"><div class="confetti" aria-hidden="true">${bits}</div><span class="eyebrow">NUOVO LIVELLO</span><h2>Livello ${n}: ${esc(l[0])}</h2>${cowMascot(n===LEVELS.length?'festoso':'felice',n===LEVELS.length?'Sei una Leggenda di cca! Che orgoglio!':'Complimenti! Un altro passo per far crescere lo spazio.')}<button type="button" class="btn">Evviva!</button></div>`;
 box.hidden=false;
 const close=()=>{box.hidden=true;document.removeEventListener('keydown',esc_);};
 const esc_=e=>{if(e.key==='Escape')close();};
 document.addEventListener('keydown',esc_);
 const b=box.querySelector('button');b.onclick=close;b.focus();
}


/* ---- comunità: trofei, Putìa, banca del tempo, proposte ---- */
const ARTS=[['star','Stella'],['pin','Spilla'],['book','Libro'],['bag','Borsa'],['shirt','Maglietta'],['heart','Cuore'],['plant','Pianta'],['camera','Foto']];
const dayLong=sec=>fmt(sec,{day:'numeric',month:'long',year:'numeric'});
async function comunita(){
 if(!S.me)return needLogin();
 const [tr,prop,offers]=await Promise.all([api('/trophies').catch(()=>({trophies:[]})),api('/proposals').catch(()=>({proposals:[]})),api('/time-offers').catch(()=>({offers:[]}))]);
 const got=tr.trophies.filter(t=>t.earned).length;
 const open=prop.proposals.filter(p=>p.status==='open').length;
 return title('Comunità','Qui si spendono i Formaggi, si scambia tempo, si propone e si vota.')+
 section('Cosa vuoi fare?',grid([
  card(`<span class="metric">${S.totals.cheese}</span><h3>A Putìa</h3><p>Spendi i tuoi Formaggi in premi dello spazio.</p>${link('Apri la Putìa','putia')}`,'green'),
  card(`<span class="metric">${got}/${tr.trophies.length}</span><h3>Trofei</h3><p>Si conquistano da soli: basta esserci.</p>${link('I miei trofei','trofei')}`),
  card(`<span class="metric">${offers.offers.length}</span><h3>Banca del tempo</h3><p>Un’ora tua per un’ora di qualcun altro.</p>${link('Scambia tempo','banca')}`),
  card(`<span class="metric">${open}</span><h3>Proposte</h3><p>Proponi un’attività e vota quelle degli altri: le più votate vanno in calendario.</p>${link('Proponi e vota','proposte')}`),
  card(`<h3>U paisi crisci</h3><p>Come cresce il borgo con quello che facciamo insieme.</p>${link('Guarda il paese','paese')}`),
  card(`<h3>Le mie statistiche</h3><p>Ore in sede, serie, XP e percorsi.</p>${link('Le mie statistiche','presenze')}`)
 ]))+mu('home');
}
async function trofei(){
 if(!S.me)return needLogin();
 const {trophies}=await api('/trophies');
 const groups=[...new Set(trophies.map(t=>t.group))];
 const got=trophies.filter(t=>t.earned).length;
 return title('Trofei',`${got} su ${trophies.length} conquistati. Arrivano da soli quando i dati verificati raggiungono la soglia, e ti avvisiamo anche per email.`)+
 (S.trophies=trophies,groups.map(g=>section(g,grid(trophies.filter(t=>t.group===g).map(t=>card(`<div class="${t.earned?'':'locked'}">${art(t.icon)}</div><h3>${esc(t.name)}</h3><p>${esc(t.desc)}</p>${t.earned?`<p>${badge('Ottenuto')} <span class="muted">${dayLong(t.awardedAt)}</span></p>`:`<p>${badge('Bloccato')}</p><progress value="${t.count}" max="${t.target}" aria-label="Progresso: ${esc(t.name)}"></progress><p class="muted">${t.count} / ${t.target}</p>`}${btn(t.earned?'Apri il trofeo':'Come si sblocca','trophy',t.id,{secondary:true})}`,t.earned?'green':'')),'three'))).join(''));
}
async function putia(){
 if(!S.me)return needLogin();
 const [rw,rd]=await Promise.all([api('/rewards'),api('/redemptions')]);
 const bal=rw.balance;
 const list=rw.rewards.filter(r=>r.active);
 return title('A Putìa','Il negozietto dello spazio: spendi i Formaggi guadagnati in premi. Si ritirano in sede.')+
 section('Il mio saldo',card(`<div class="stat-figure">${pixelIcon(cheese)}<strong class="metric">${bal} Formaggi</strong></div><p class="muted">${rw.earned} guadagnati · ${rw.spent} spesi</p>`))+
 section('Premi',list.length?grid(list.map(r=>{
  const out=r.stock!==null&&r.stock<=0,poor=bal<r.cost;
  return card(`${art(r.art)}<h3>${esc(r.name)}</h3><p>${esc(r.description)}</p><p><strong>${r.cost} Formaggi</strong>${r.stock!==null?` · ${out?'esaurito':`${r.stock} disponibili`}`:''}</p>${out?badge('Esaurito'):poor?`<p class="muted">Ti mancano ${r.cost-bal} Formaggi.</p>`:btn('Riscatta','redeem',r.id)}`);
 }),'three'):card('<p>I referenti non hanno ancora messo premi in vetrina.</p>'))+
 section('I miei riscatti',rd.redemptions.length?card(`<ul class="list">${rd.redemptions.map(x=>`<li><strong>${esc(x.rewardName)}</strong> · ${x.cost} F. · ${dateShort(x.createdAt)} · ${badge(x.status==='pending'?'Da ritirare':x.status==='delivered'?'Consegnato':'Annullato')}${x.status==='pending'?` ${btn('Annulla','redeemCancel',x.id,{secondary:true})}`:''}</li>`).join('')}</ul>`):card('<p>Non hai ancora riscattato nulla.</p>'))+
 `<p class="muted">Ogni premio riscattato ti arriva anche via email, con le istruzioni per il ritiro.</p>`;
}
async function banca(){
 if(!S.me)return needLogin();
 const d=await api('/time-offers');
 const mine=d.offers.filter(o=>o.mine),others=d.offers.filter(o=>!o.mine);
 const statusLabel={requested:'In attesa',accepted:'Accettata',done:'Conclusa'};
 return title('Banca del tempo',`Offri un’ora di qualcosa che sai fare e chiedi l’ora di qualcun altro. Ogni scambio concluso vale ${d.reward.xp} XP e ${d.reward.cheese} Formaggio a testa (massimo ${d.reward.weekly} premiati a settimana).`)+
 section('Offerte dei soci',others.length?grid(others.map(o=>card(`<h3>${esc(o.title)}</h3><p>${esc(o.description)}</p><p class="muted">di ${esc(o.memberName)}</p>${o.myStatus?badge(statusLabel[o.myStatus]):form('request',field('note','Un messaggio (facoltativo)','text','maxlength="300"').replace(' required',''),'Chiedi quest’ora',{id:o.id,cls:'inline-form'})}`)),'two'):card('<p>Ancora nessuna offerta. Pubblica la prima!</p>'))+
 section('I miei scambi',d.exchanges.length?card(`<ul class="list">${d.exchanges.map(x=>{
  const owner=x.ownerId===S.me.id;
  const who=owner?`${esc(x.requesterName)} chiede la tua ora`:`La tua richiesta a ${esc(x.ownerName)}`;
  const acts=x.status==='requested'?(owner?btn('Accetta','xAccept',x.id)+' '+btn('Rifiuta','xDecline',x.id,{secondary:true}):btn('Annulla','xCancel',x.id,{secondary:true})):x.status==='accepted'?(owner?'<span class="muted">Dopo l’incontro, chi ha ricevuto l’ora la conferma.</span> '+btn('Annulla','xCancel',x.id,{secondary:true}):btn('Ho ricevuto l’ora','xDone',x.id)+' '+btn('Annulla','xCancel',x.id,{secondary:true})):'';
  return `<li><strong>${esc(x.offerTitle)}</strong> · ${who} · ${badge(statusLabel[x.status])}${x.note?`<br><span class="muted">${esc(x.note)}</span>`:''}${acts?`<div class="row">${acts}</div>`:''}</li>`;}).join('')}</ul>`):card('<p>Nessuno scambio in corso.</p>'))+
 section('Le mie offerte',(mine.length?grid(mine.map(o=>card(`<h3>${esc(o.title)}</h3><p>${esc(o.description)}</p>${btn('Chiudi l’offerta','offerClose',o.id,{secondary:true})}`)),'two'):'')+form('offer','<h3>Offri un’ora</h3>'+field('title','Cosa offri (es. ripetizioni di inglese)','text','required maxlength="80"')+field('description','Dettagli (facoltativo)','text','maxlength="400"').replace(' required',''),'Pubblica l’offerta'));
}
async function proposte(){
 if(!S.me)return needLogin();
 const d=await api('/proposals');
 const open=d.proposals.filter(p=>p.status==='open'),closed=d.proposals.filter(p=>p.status!=='open');
 const org=isOrganizer();
 const item=p=>card(`<h3>${esc(p.title)}</h3><p>${esc(p.description)}</p><p class="muted">di ${esc(p.memberName)} · ${dateShort(p.createdAt)}</p><p><strong>${p.votes}</strong> ${p.votes===1?'voto':'voti'}</p>${p.status==='open'?`${p.mine?badge('La tua proposta'):btn(p.voted?'Togli il voto':'Vota','vote',p.id,{secondary:p.voted,extra:`data-on="${p.voted?0:1}"`})}${org?form('schedule',field('startsAt','Quando','datetime-local','required'),'Porta in calendario',{id:p.id,cls:'inline-form'})+btn('Non accolta','pdecline',p.id,{secondary:true}):''}`:badge(p.status==='scheduled'?'In calendario':'Non accolta')}`);
 return title('Proposte e votazioni',`Proponi un’attività e vota quelle degli altri. Le più votate i referenti le portano in calendario, e chi ha avuto l’idea riceve ${d.reward.xp} XP e ${d.reward.cheese} Formaggi.`)+
 section('In votazione',open.length?grid(open.map(item),'two'):card('<p>Nessuna proposta aperta. Fatti avanti!</p>'))+
 section('Fai una proposta',form('proposal','<h3>Un’idea per lo spazio</h3>'+field('title','Titolo','text','required maxlength="100"')+field('description','Descrivila in due righe','text','maxlength="600"').replace(' required',''),'Pubblica la proposta'))+
 (closed.length?section('Già decise',grid(closed.map(item),'two')):'');
}

/* ---- viste pubbliche ---- */
async function home(){
 if(!S.me){const [st,metrics]=await Promise.all([getStatus(),getCommunity()]);return `<div class="hero"><img class="scenery-day" src="sicani.svg" alt="Illustrazione pixel di un borgo tra i Monti Sicani"><img class="scenery-night" src="sicani-notte.svg" alt="Borgo dei Monti Sicani di notte, con luna e finestre illuminate"><div class="hero-copy"><span class="eyebrow">CAMMARATA + SAN GIOVANNI GEMINI</span><h1>CCA SIEMMU</h1><p class="hero-motto">E boni siemmu</p><p class="hero-local">Uno spazio gratuito per incontrarsi, studiare e far nascere idee insieme.</p>${link('Guarda il calendario','calendario')} ${link('Accedi','accedi')}<p class="muted entry-hint">Il calendario è aperto a tutti. Per prenotare e guadagnare Formaggi serve l’account che ti danno i referenti.</p></div></div>`+
  section('Quando siamo aperti',openingCard(st))+
  section('Come funziona',grid([
   card('<h3>Vieni in sede</h3><p>Ingresso e uscita vengono registrati dai referenti: così sappiamo quante ore lo spazio resta vivo.</p>'),
   card('<h3>Partecipa</h3><p>Prenota le attività del calendario e dai una mano con le missioni: ogni impegno verificato vale XP e Formaggi.</p>'),
   card('<h3>Cresci</h3><p>Sali di livello, guarda le tue presenze e contribuisci a far crescere lo spazio.</p>')
  ]))+villageCard(metrics)+mu('home');}
 return null;
}
async function homeMember(){
 const [acts,mine,chores,st,metrics,pres]=await Promise.all([api('/activities'),api('/my/bookings'),api('/chores?status=pending&memberId='+encodeURIComponent(S.me.id)),getStatus(),getCommunity(),api('/checkin').catch(()=>null)]);
 const presenceCard=pres?card('<span class="eyebrow">LA MIA PRESENZA</span>'+(pres.inside?`<h3>Sei in sede dalle ${fmt(pres.since,{hour:'2-digit',minute:'2-digit'})}</h3><p>Quando esci registra l’uscita da qui, oppure inquadra il QR all’ingresso.</p>${btn('Registra la mia uscita','checkout')}`:`<h3>Non hai ancora registrato l’ingresso</h3><p>Se sei in sede, segna la tua presenza: basta un tocco, senza approvazione. Puoi anche inquadrare il QR all’ingresso.</p>${btn('Registra il mio ingresso','checkin')}`)):'';
 const booked=new Map(mine.bookings.map(b=>[b.activityId,b.status]));
 const upcoming=acts.activities.filter(a=>a.starts_at>Date.now()/1000-3600).slice(0,3);
 let extra='';
 if(isOrganizer()){
  const [inside,pending]=await Promise.all([api('/inside'),api('/chores?status=pending')]);
  const mineAll=pending.chores.filter(c=>c.memberId!==S.me.id).length;
  extra=section('Da gestire',grid([
   card(`<span class="metric">${inside.presenti.length}</span><h3>In sede adesso</h3><p>${inside.presenti.length?esc(inside.presenti.map(p=>p.name).join(', ')):'Nessuno è registrato dentro.'}</p>${link('Registra ingressi','referenti/presenze')}`,'green'),
   card(`<span class="metric">${mineAll}</span><h3>Missioni da verificare</h3><p>Le richieste in attesa aspettano una decisione.</p>${link('Verifica','referenti/missioni')}`)
  ],'two'));
 }
 return title(`Ciao, ${esc(S.me.pseudonym)}`,'Ecco il tuo spazio.')+
  section('Il mio personaggio',grid([card(profileChip()+`<div class="stat-figure">${pixelIcon(cheese)}<strong>${S.totals.cheese} Formaggi</strong></div>`),
   card(`<h3>Le mie richieste</h3><p>${chores.chores.length} missioni in attesa di verifica.</p>${link('Vai alle missioni','missioni')}${link('Le mie statistiche','presenze')}`)],'two'))+
  (presenceCard?section('Presenza',presenceCard):'')+
  section('Quando siamo aperti',openingCard(st))+
  extra+
  section('Prossime attività',upcoming.length?grid(upcoming.map(a=>card(`<h3>${esc(a.name)}</h3><p>${dateLong(a.starts_at)}</p><p>${a.available>0?`${a.available} posti liberi su ${a.capacity}`:'Posti esauriti'}</p>${booked.has(a.id)?badge(statusText[booked.get(a.id)]):''}`)),'three')+`<p>${link('Tutto il calendario','calendario')}</p>`:card('<p>Non ci sono ancora attività in calendario.</p>'))+villageCard(metrics)+mu('home');
}

async function calendario(){
 const [acts,mine]=await Promise.all([api('/activities'),S.me?api('/my/bookings'):{bookings:[]}]);
 const booked=new Map(mine.bookings.map(b=>[b.activityId,b]));
 const list=acts.activities;
 const body=list.length?grid(list.map(a=>{
  const b=booked.get(a.id),active=b&&['pending','confirmed'].includes(b.status);
  let action='';
  if(!S.me)action=link('Accedi per prenotare','accedi');
  else if(active)action=`${badge(statusText[b.status])}<div class="row">${btn('Annulla prenotazione','cancel',a.id,{secondary:true})}</div>`;
  else if(a.available<=0)action=badge('Posti esauriti');
  else action=btn('Prenota un posto','reserve',a.id)+(b&&b.status==='declined'?`<p class="muted">La richiesta precedente è stata rifiutata.</p>`:'');
  const rec=S.me&&a.path&&(S.me.interests||[]).includes(a.path);
  return card(`${rec?`<p>${badge('Consigliata per te')}</p>`:''}<h3>${esc(a.name)}</h3><p><strong>${dateLong(a.starts_at)}</strong></p><p>${Math.max(0,a.available)} posti liberi su ${a.capacity}</p><p class="muted">${esc(a.verification_rule)}</p>${action}`);
 }),'two'):card('<h3>Ancora nulla in calendario</h3><p>I referenti pubblicheranno qui le prossime attività.</p>');
 return title('Calendario','Le attività dello spazio. La prenotazione è una richiesta: un referente la conferma.')+section('Prossime attività',body)+
  (S.me?section('Come funziona',card('<p>Quando prenoti, il posto resta riservato finché un referente decide. Alla fine il referente verifica di persona la tua presenza e ti assegna XP e Formaggi.</p>')):'')+mu('calendario');
}

async function spazio(){
 const st=await getStatus();
 return title('Lo spazio','Un luogo gratuito pensato e gestito dai giovani di Cammarata e San Giovanni Gemini.')+
 section('Quando siamo aperti',openingCard(st))+
 section('Prima di venire',grid([
  card('<h3>A chi si rivolge</h3><p>Il progetto si rivolge principalmente a chi ha tra 14 e 30 anni e vive nei due paesi. Puoi venire per studiare, incontrare altre persone o proporre un’attività.</p>','audience'),
  card(`<h3>Come entri</h3><p>All’ingresso e all’uscita un referente (o il lettore della tessera) registra la tua presenza. Così calcoliamo le ore di apertura e i tuoi progressi.</p>${link('Accedi','accedi')}`,'green')
 ],'two'))+
 section('Come si partecipa',card('<h3>Dall’idea all’assemblea</h3><p>Puoi proporre un laboratorio, dare una mano con le missioni o portare una questione all’assemblea in sede. Ascolta chi usa lo spazio, rispetta le differenze e lascia in ordine i materiali comuni.</p>'))+
 section('Il paese',card(`<p>Guarda come cresce il borgo con le attività dello spazio.</p>${link('U paisi crisci','paese')}`))+
 section('Il progetto',card('<p>Cca Siemmu è promosso da Spazio Giovani Generazioni ed è finanziato dal Corpo europeo di solidarietà. Contatti: <a href="mailto:spaziogiovanigenerazioni@gmail.com">spaziogiovanigenerazioni@gmail.com</a>.</p>'));
}

function privacy(){
 const mail='spaziogiovanigenerazioni@gmail.com',c=`<a href="mailto:${mail}">${mail}</a>`;
 return title('Informativa sulla privacy','Cca Siemmu · Spazio Giovani Generazioni')+
 section('Chi gestisce i dati',card(`<p>Spazio Giovani Generazioni gestisce la piattaforma. Per domande o richieste sui tuoi dati scrivi a ${c}.</p><p class="muted"><strong>Stato dell’informativa.</strong> Questa pagina elenca i dati che il sistema registra davvero. Basi giuridiche, tempi di conservazione e ruoli (titolare, responsabili) devono essere definiti e firmati dall’associazione prima dell’uso con i soci reali.</p>`))+
 section('Quali dati registriamo',grid([
  card('<h3>Account</h3><p>Nome e cognome, email, telefono (facoltativo), pseudonimo, ruolo e stato dell’account. La password è conservata solo come impronta crittografica, mai in chiaro. Il codice della tessera, se assegnata.</p>'),
  card('<h3>Presenze in sede</h3><p>Data e ora di ingresso e uscita, e chi le ha registrate. Servono a calcolare le ore di apertura e le tue statistiche personali.</p>'),
  card('<h3>Attività e missioni</h3><p>Prenotazioni, presenze convalidate, richieste di missioni con eventuale nota, decisioni dei referenti, XP e Formaggi.</p>'),
  card('<h3>Sessione</h3><p>Dopo l’accesso usiamo un solo cookie tecnico di sessione, necessario al funzionamento. Non usiamo cookie di analisi o pubblicità. I tentativi di accesso falliti sono registrati per un breve periodo per limitare gli abusi.</p>')
 ],'two'))+
 section('Chi vede cosa',card('<p>Ogni socio vede i propri dati. I referenti autorizzati vedono l’elenco dei soci, le presenze, le missioni e le statistiche della sede. Le statistiche pubbliche non mostrano dati personali.</p>'))+
 section('I tuoi diritti',card(`<p>Puoi scrivere a ${c} per chiedere accesso, rettifica o cancellazione dei tuoi dati, limitazione del trattamento e, quando applicabili, portabilità e opposizione. Puoi presentare reclamo al <a href="https://www.garanteprivacy.it/">Garante per la protezione dei dati personali</a>.</p>`));
}

/* ---- accesso ---- */
function accedi(){
 if(S.me)return title('Sei già dentro',`Accesso effettuato come ${esc(S.me.pseudonym)}.`)+card(link('Vai alla Home','home'));
 return title('Accedi','Usa l’email con cui i referenti ti hanno registrato.')+
 grid([form('login',field('email','Email','email','required autocomplete="username"')+field('password','Password','password','required autocomplete="current-password"'),'Accedi'),
  card('<h3>Prima volta?</h3><p>Non ti puoi iscrivere da solo: un referente ti registra in sede e ti invia un link per scegliere la password. Se non l’hai ricevuto, chiedi di rigenerarlo.</p>')],'two');
}
async function impostaPassword(token){
 if(!token)return title('Link non valido','')+card('<p>Il link è incompleto.</p>'+link('Accedi','accedi'));
 let info;
 try{info=await api('/auth/token?token='+encodeURIComponent(token));}
 catch(e){return title('Link non valido','')+card(`<p>${esc(e.message)}</p><p>Chiedi a un referente di generarne uno nuovo.</p>${link('Accedi','accedi')}`);}
 return title(info.purpose==='reset'?'Nuova password':'Benvenutə',`Ciao ${esc(info.name)}, scegli la tua password per completare il profilo.`)+
 form('setpw',`<input type="hidden" name="token" value="${esc(token)}">`+field('password','Password (almeno 10 caratteri)','password','required minlength="10" autocomplete="new-password"')+field('again','Ripeti la password','password','required minlength="10" autocomplete="new-password"'),'Salva e accedi');
}

/* ---- missioni (missioni) ---- */
async function missioni(){
 if(!S.me)return needLogin();
 const [types,logs]=await Promise.all([api('/chore-types'),api('/chores?limit=30&memberId='+encodeURIComponent(S.me.id))]);
 const active=types.types.filter(t=>t.active);
 const pending=logs.chores.filter(c=>c.status==='pending').length;
 return title('Missioni','Le missioni che tengono vivo lo spazio. Falla, chiedi la verifica a un referente e ricevi XP e Formaggi.')+
 section('Missioni disponibili',active.length?grid(active.map(t=>card(`${art(pathInfo(t.path)[2])}<h3>${esc(t.name)}</h3><p>${badge(pathInfo(t.path)[1])}${(S.me.interests||[]).includes(t.path)?' '+badge('Consigliata per te'):''}</p><p>${esc(t.description)}</p><p><strong>${t.xp} XP</strong> · <strong>${t.cheese} Formaggi</strong></p>${form('chore',field('note','Nota (facoltativa)','text','maxlength="200" placeholder="Es. ho sistemato lo scaffale"').replace(' required',''),'Chiedi la verifica',{id:t.id,cls:'inline-form'})}`)),'two'):card('<p>I referenti non hanno ancora pubblicato missioni.</p>'))+
 `<p class="muted">Le missioni ripetibili danno al massimo ${WEEKLY_CHEESE} Formaggi a settimana (da lunedì a domenica). Gli XP si contano sempre.</p>`+
 section(`Le mie richieste${pending?` · ${pending} in attesa`:''}`,logs.chores.length?card(`<ul class="list">${logs.chores.map(c=>`<li><strong>${esc(c.choreName)}</strong> · ${dateShort(c.requestedAt)} · ${badge(statusText[c.status])}${c.status==='verified'?` · ${c.xp} XP, ${c.cheese} Formaggi`:''}${c.note?`<br><span class="muted">${esc(c.note)}</span>`:''}</li>`).join('')}</ul>`):card('<p>Non hai ancora richiesto nessuna missione.</p>'))+mu('missioni',{pending});
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
 section('Il mio livello',card(profileChip()))+
 section('In breve',grid([
  card(`<span class="metric">${stats.visits}</span><h3>Visite</h3><p>${stats.insideNow?badge('Sei dentro adesso'):'Negli ultimi 12 mesi'}</p>`),
  card(`<span class="metric">${stats.hours}</span><h3>Ore in sede</h3><p>${stats.visits?`Media ${duration(stats.avgVisitMinutes)} a visita`:'Appena inizi a venire, le conteremo qui.'}</p>`),
  card(`<span class="metric">${stats.streak.current}</span><h3>Serie di giorni</h3><p>Giorni di apertura consecutivi con una tua visita · record ${stats.streak.best}</p>`)
 ]))+
 section('I miei guadagni',grid([
  card(`<span class="metric">${t.xp}</span><h3>XP</h3><p>${stats.activitiesAttended} attività · ${stats.choresVerified} missioni verificate</p>`),
  card(`<span class="metric">${t.cheese}</span><h3>Formaggi guadagnati</h3><p>Il riscatto dei premi arriverà più avanti.</p>`)
 ],'two'))+
 section('Ore in sede per mese',stats.months.length?card(stats.months.map(m=>bar(m.hours,monthMax,m.month.slice(2),' h')).join('')):card('<p>Ancora nessun dato.</p>'))+
 section('Quando vieni',card(weekdayBars(stats.weekdays,'visits')))+
 skillTree(prog.counts,ctypes.types.filter(t=>t.active))+
 section('Ultime visite',stats.recent.length?card(`<ul class="list">${stats.recent.map(r=>`<li>${dateLong(r.start)} · ${duration(r.minutes)}</li>`).join('')}</ul>`):card('<p>Nessuna visita registrata.</p>'))+
 section('Registro ingressi e uscite',acc.accessi.length?card(`<ul class="list">${acc.accessi.map(a=>`<li>${a.direction==='IN'?'Ingresso':'Uscita'} · ${dateShort(a.at)}</li>`).join('')}</ul>`):card('<p>Ancora nessun movimento negli ultimi 30 giorni.</p>'));
}

/* ---- profilo ---- */
async function profilo(){
 if(!S.me)return needLogin();
 const [prog,types,acts]=await Promise.all([api('/my/progress').catch(()=>({counts:{}})),api('/chore-types').catch(()=>({types:[]})),api('/activities').catch(()=>({activities:[]}))]);
 const mine=S.me.interests||[];
 const recMissions=types.types.filter(t=>t.active&&mine.includes(t.path)).slice(0,4);
 const recActs=acts.activities.filter(a=>a.path&&mine.includes(a.path)&&a.starts_at>Date.now()/1000-3600).slice(0,3);
 const interestsForm=`<h3>I miei interessi</h3><p class="muted">Scegli cosa ti piace: ti consigliamo missioni e attività.</p><fieldset><legend>Percorsi</legend>${PATHS.map(([id,name])=>`<label><input type="checkbox" name="interest" value="${id}" ${mine.includes(id)?'checked':''}> ${esc(name)}</label>`).join('')}</fieldset>`;
 const recommend=section('Consigliato per te',mine.length?(recMissions.length||recActs.length?grid([
   ...recActs.map(a=>card(`<span class="eyebrow">ATTIVITÀ</span><h3>${esc(a.name)}</h3><p>${dateLong(a.starts_at)}</p>${link('Apri il calendario','calendario')}`)),
   ...recMissions.map(t=>card(`<span class="eyebrow">MISSIONE</span><h3>${esc(t.name)}</h3><p>${esc(t.description)}</p>${link('Vai alle missioni','missioni')}`))
  ],'two'):card('<p>Per ora non ci sono attività o missioni nei tuoi percorsi. Controlla più avanti!</p>')):card('<p>Scegli i tuoi interessi qui sotto e ti consigliamo missioni e attività su misura.</p>'));
 const species=pref.get('species','mucca'),color=pref.get('color','rosa');
 const picker=`<fieldset><legend>Avatar</legend><div class="animal-picker">${Object.entries(animals).map(([id,a])=>`<label><input type="radio" name="species" value="${id}" ${id===species?'checked':''}>${avatar(id,color)}<span>${a.name}</span></label>`).join('')}</div></fieldset><fieldset><legend>Colore</legend><div class="swatches">${Object.entries(avatarColors).map(([id,[name,hex]])=>`<label><input type="radio" name="color" value="${id}" ${id===color?'checked':''}><span class="swatch" style="background:${hex}"></span><span class="sr">${name}</span></label>`).join('')}</div></fieldset>`;
 return title('Profilo','Il tuo personaggio e il tuo account.')+
 section('Il mio personaggio',grid([card(profileChip()+`<div class="stat-figure">${pixelIcon(cheese)}<strong>${S.totals.cheese} Formaggi</strong></div>${link('Le mie statistiche','presenze')}${link('I miei trofei','trofei')}`),
  card(`<details class="disclosure"><summary>Cambia avatar</summary>${form('avatar',picker,'Salva avatar',{cls:'plain'})}<p class="muted">L’avatar è salvato solo su questo dispositivo.</p></details>`)],'two'))+
recommend+skillTree(prog.counts,types.types.filter(t=>t.active))+
 section('Il mio account',grid([
  form('nick','<h3>Nome utente</h3><p class="muted">È il nome che vedono gli altri soci.</p>'+field('pseudonym','Il tuo nome utente','text',`required maxlength="28" value="${esc(S.me.pseudonym)}"`),'Salva nome utente'),
  form('interests',interestsForm,'Salva interessi'),
  card(`<h3>${esc(S.me.fullName||S.me.pseudonym)}</h3><p>${esc(S.me.email)}</p><p>${badge(isOrganizer()?'Referente':'Socio')}</p>${btn('Esci','logout','',{secondary:true})}`),
  form('changepw','<h3>Cambia password</h3>'+field('current','Password attuale','password','required autocomplete="current-password"')+field('next','Nuova password (almeno 10 caratteri)','password','required minlength="10" autocomplete="new-password"'),'Cambia password')
 ],'two'))+
 mu('profilo')+`<p><a href="#privacy">Informativa sulla privacy</a></p>`;
}

/* ---- pannello referenti ---- */
const tabs=[['panoramica','Panoramica'],['soci','Soci'],['presenze','Presenze'],['missioni','Missioni'],['putia','Putìa'],['attivita','Attività'],['statistiche','Statistiche']];
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
 const pages={panoramica:panPanoramica,soci:panSoci,presenze:panPresenze,missioni:panFaccende,putia:panPutia,attivita:()=>panAttivita(extra),statistiche:panStatistiche};
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
  const self=m.id===S.me.id;
  return card(`<h3>${esc(m.fullName||m.pseudonym)}</h3><p>${esc(m.email)}</p><p>${badge(m.role==='organizer'?'Referente':'Socio')} ${badge(statusText[m.status])} ${m.hasPassword?badge('Profilo completo'):badge('Password da impostare')}</p><p class="muted">${m.xp} XP · ${m.cheese} Formaggi${m.phone?' · '+esc(m.phone):''}</p>
  <p class="muted">Tessera: ${m.uidTessera?`<code>${esc(m.uidTessera)}</code>`:'nessuna'}</p>
  <div class="row">${btn(m.hasPassword?'Link reset password':'Nuovo link d’invito','invite',m.id,{secondary:true,extra:`data-phone="${esc(m.phone||'')}"`})}${m.uidTessera?btn('Togli tessera','cardRemove',m.id,{secondary:true}):''}${!self?btn(m.role==='organizer'?'Rendi socio':'Rendi referente','role',m.id,{secondary:true,extra:`data-role="${m.role==='organizer'?'participant':'organizer'}"`}):''}${!self?btn(m.status==='disabled'?'Riattiva':'Disattiva','status',m.id,{secondary:true,extra:`data-status="${m.status==='disabled'?'approved':'disabled'}"`}):''}</div>
  ${form('card',field('uid','Codice tessera NFC','text','required maxlength="40" placeholder="Es. 04A1B2C3"'),m.uidTessera?'Cambia tessera':'Assegna tessera',{id:m.id,cls:'inline-form'})}`,m.status==='disabled'?'muted-card':'');
 });
 return (S.invite?section('Invito',inviteCard(S.invite)):'')+section('Nuovo socio',newForm)+section(`Soci (${members.length})`,grid(cards,'two'));
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
 return section(`Da verificare (${pending.chores.length})`,pending.chores.length?grid(pending.chores.map(c=>card(`<h3>${esc(c.choreName)}</h3><p>${esc(c.memberName)} · ${dateShort(c.requestedAt)}</p>${c.note?`<p class="muted">${esc(c.note)}</p>`:''}<p>${c.xp||''}</p>${c.memberId===S.me.id?'<p class="muted">È una tua missione: la verifica un altro referente.</p>':`<div class="row">${btn('Conferma','verify',c.id)}${btn('Respingi','reject',c.id,{secondary:true})}</div>`}`.replace('<p></p>',''))),'two'):card('<p>Nessuna missione in attesa.</p>'))+
 section('Registra una missione fatta',types.types.some(t=>t.active)?form('logchore',`<label>Socio<select name="memberId" required>${active.map(m=>`<option value="${esc(m.id)}">${esc(m.pseudonym)}</option>`).join('')}</select></label><label>Missione<select name="typeId" required>${types.types.filter(t=>t.active).map(t=>`<option value="${esc(t.id)}">${esc(t.name)} (${t.xp} XP, ${t.cheese} F.)</option>`).join('')}</select></label>${field('note','Nota (facoltativa)','text','maxlength="200"').replace(' required','')}<p class="muted">Registrata da un referente, viene convalidata subito. Le tue missioni le richiedi dalla pagina Missioni e le verifica un altro referente.</p>`,'Registra e convalida'):card('<p>Crea prima una missione nel catalogo.</p>'))+
 section('Catalogo missioni',grid(types.types.map(t=>card(`<h3>${esc(t.name)}</h3><p>${esc(t.description)}</p><p>${t.xp} XP · ${t.cheese} Formaggi ${t.active?'':badge('Non attiva')}</p>${form('chorepath',pathSelect(t.path),'Salva',{id:t.id,cls:'inline-form'})}${btn(t.active?'Disattiva':'Riattiva','choreActive',t.id,{secondary:true,extra:`data-active="${t.active?0:1}"`})}`)),'two'))+
 section('Nuova missione nel catalogo',form('choretype','<h3>Aggiungi una missione</h3>'+field('name','Nome','text','required maxlength="80"')+field('description','Descrizione','text','maxlength="400"').replace(' required','')+field('xp','XP','number','required min="0" max="500" value="10"')+field('cheese','Formaggi','number','required min="0" max="200" value="2"')+pathSelect('solidarieta'),'Aggiungi'));
}
async function panPutia(){
 const [pend,rw]=await Promise.all([api('/redemptions'),api('/rewards')]);
 return section(`Premi da consegnare (${pend.redemptions.length})`,pend.redemptions.length?grid(pend.redemptions.map(x=>card(`<h3>${esc(x.rewardName)}</h3><p>${esc(x.memberName)} · ${x.cost} Formaggi · ${dateShort(x.createdAt)}</p>${x.memberId===S.me.id?'<p class="muted">È un tuo premio: lo consegna un altro referente.</p>':`<div class="row">${btn('Consegnato','redDeliver',x.id)}${btn('Annulla','redeemCancel',x.id,{secondary:true})}</div>`}`)),'two'):card('<p>Nessun premio da consegnare.</p>'))+
 section('Premi in vetrina',grid(rw.rewards.map(r=>card(`<h3>${esc(r.name)} ${r.active?'':badge('Non attivo')}</h3><p>${r.cost} Formaggi · ${r.stock===null?'scorta illimitata':r.stock+' disponibili'}</p>${form('rewardedit',field('cost','Costo','number',`required min="1" max="5000" value="${r.cost}"`)+field('quantity','Quantità totale (vuoto = illimitata)','number',`min="0" max="10000" value="${r.quantity??''}"`).replace(' required',''),'Salva',{id:r.id,cls:'inline-form'})}${btn(r.active?'Togli dalla vetrina':'Rimetti in vetrina','rewardActive',r.id,{secondary:true,extra:`data-active="${r.active?0:1}"`})}`)),'two'))+
 section('Nuovo premio',form('reward','<h3>Aggiungi un premio</h3>'+field('name','Nome','text','required maxlength="80"')+field('description','Descrizione','text','maxlength="300"').replace(' required','')+field('cost','Costo in Formaggi','number','required min="1" max="5000" value="20"')+field('quantity','Quantità (vuoto = illimitata)','number','min="0" max="10000"').replace(' required','')+`<label>Icona<select name="art">${ARTS.map(([k,n])=>`<option value="${k}">${n}</option>`).join('')}</select></label>`,'Aggiungi il premio'));
}
async function panAttivita(id){
 if(id){
  const [{bookings},{activities}]=await Promise.all([api(`/activities/manage/${encodeURIComponent(id)}/bookings`),api('/activities/manage')]);
  const a=activities.find(x=>x.id===id);
  if(!a)return card('<p>Attività non trovata.</p>'+link('Torna alle attività','referenti/attivita'));
  return section(esc(a.name),card(`<p>${dateLong(a.startsAt)} · ${statusText[a.status]} · ${a.capacity} posti</p><p class="muted">${esc(a.verificationRule)}</p><p>${a.xp} XP · ${a.cheese} Formaggi a chi partecipa</p>`)+`<p>${link('Tutte le attività','referenti/attivita')}</p>`)+
  section('Prenotazioni',bookings.length?grid(bookings.map(b=>card(`<h3>${esc(b.name)}</h3><p>${badge(statusText[b.status])} ${b.attended?badge('Presenza registrata'):''}</p><div class="row">${b.status==='pending'?btn('Conferma','bk-confirm',a.id,{extra:`data-member="${esc(b.memberId)}"`})+btn('Rifiuta','bk-decline',a.id,{secondary:true,extra:`data-member="${esc(b.memberId)}"`}):''}${b.status==='confirmed'&&!b.attended&&b.memberId!==S.me.id?btn('Registra presenza','bk-attend',a.id,{extra:`data-member="${esc(b.memberId)}"`}):''}</div>`)),'two')+`<p class="muted">La presenza si registra dopo l’inizio dell’attività e nella stessa giornata, solo dopo averla verificata di persona.</p>`:card('<p>Nessuna prenotazione.</p>'));
 }
 const {activities}=await api('/activities/manage');
 const create=form('activity','<h3>Nuova attività</h3>'+field('name','Titolo','text','required maxlength="120"')+field('startsAt','Data e ora','datetime-local','required')+field('capacity','Posti','number','required min="1" max="500" value="25"')+field('verificationRule','Come verifichi la presenza','text','required maxlength="300" value="Il referente verifica di persona la presenza durante l’evento e la registra nella stessa giornata."')+field('xp','XP','number','required min="0" max="500" value="30"')+field('cheese','Formaggi','number','required min="0" max="200" value="5"')+`<label>Percorso (facoltativo, per i consigli)<select name="path"><option value="">Nessuno</option>${PATHS.map(([id,name])=>`<option value="${id}">${esc(name)}</option>`).join('')}</select></label><label>Stato<select name="status"><option value="draft">Bozza (non visibile)</option><option value="published">Pubblicata</option></select></label>`,'Crea attività');
 const prefill=`<p><button type="button" class="secondary" data-action="prefill">Precompila con la prima attività reale</button></p>`;
 return section('Nuova attività',prefill+create)+section(`Attività (${activities.length})`,activities.length?grid(activities.map(a=>card(`<h3>${esc(a.name)}</h3><p>${dateLong(a.startsAt)} · ${badge(statusText[a.status])}</p><p>${a.pending} in attesa · ${a.confirmed} confermate · ${a.attended} presenze · ${a.capacity} posti</p><div class="row">${a.status!=='published'&&a.status!=='cancelled'?btn('Pubblica','act-status',a.id,{extra:'data-status="published"'}):''}${a.status==='published'?btn('Torna a bozza','act-status',a.id,{secondary:true,extra:'data-status="draft"'}):''}${a.status!=='cancelled'?btn('Annulla','act-status',a.id,{secondary:true,extra:'data-status="cancelled"'}):''}<a class="btn" href="#referenti/attivita/${esc(a.id)}">Prenotazioni →</a></div>`)),'two'):card('<p>Nessuna attività creata.</p>'));
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
const levelIcon={ok:'✓',error:'✕',info:'ℹ'};
async function notifiche(){
 if(!S.me)return needLogin();
 const d=await api('/notifications');
 const items=d.notifications;
 const html=title('Notifiche','Esiti delle operazioni e avvisi che ti riguardano.')+
  section('Bacheca',items.length?`<div class="notice-list">${items.map(n=>`<article class="card notice-item notice-${n.level} ${n.read?'':'notice-unread'}"><span class="notice-icon" aria-hidden="true">${levelIcon[n.level]||'ℹ'}</span><div><h3>${esc(n.title)}${n.read?'':' '+badge('Nuova')}</h3>${n.body?`<p>${esc(n.body)}</p>`:''}<p class="muted">${dateShort(n.createdAt)}</p></div></article>`).join('')}</div>`:card('<p>Nessuna notifica per ora. Qui compariranno gli esiti degli invii email e gli avvisi su prenotazioni e missioni.</p>'));
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
const tvTips=['Prenota un posto dal calendario: ti aspettiamo!','Una missione fatta bene vale più di mille parole.','Hai un’idea per lo spazio? Scrivila nelle Proposte e fai votare il gruppo.','Un’ora del tuo tempo vale un’ora di un altro socio: guarda la Banca del tempo.','Inquadra il QR all’ingresso per segnare la tua presenza.','Ogni presenza fa crescere il paese. Grazie di esserci!'];
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
 <h2>Prossime attività</h2>${next.length?`<ul class="tv-acts">${next.map(a=>`<li><strong>${esc(a.name)}</strong><span>${dateLong(a.starts_at)}</span><span>${a.available>0?`${a.available} posti liberi`:'Posti esauriti'}</span></li>`).join('')}</ul>`:'<p class="tv-empty">Presto altre attività in calendario.</p>'}</div>
 <div class="tv-right">${villageScene(metrics)}<p class="tv-village">${reached} ${reached===1?'traguardo':'traguardi'} su ${(metrics||[]).length}: il paese cresce con le presenze, le attività e le missioni.</p></div></div>
 <div class="tv-foot">${cowMascot('curioso',tip,tvTips)}${window.qrcode?`<div class="tv-qr">${qrSvg(location.origin+'/#home','QR code del sito')}<span>Il sito dello spazio</span></div>`:''}</div></div></div>`;
}
// La TV è 16:9: la scena è un riquadro fisso 1920×1080 che si adatta allo schermo senza deformarsi.
function fitTv(){const st=document.querySelector('.tv-screen');if(!st)return;st.style.transform=`translate(-50%,-50%) scale(${Math.min(innerWidth/1920,innerHeight/1080)})`;}
window.addEventListener('resize',fitTv);
setInterval(()=>{if(location.hash!=='#tv'||document.hidden)return;const t=document.querySelector('#tv-time');if(t)t.textContent=tvTime();},15000);
setInterval(()=>{if(location.hash==='#tv'&&!document.hidden)render();},60000);

/* ---- router ---- */
const redirects={benvenuto:'accedi',formaggi:'putia',vasceddi:'missioni',paisi:'home',condividi:'profilo'};
let renderId=0;
async function render(focus=false){
 const id=++renderId;
 const [raw,detail,extra]=location.hash.slice(1).split('/');
 let page=raw||'home';
 if(redirects[page]){location.replace('#'+redirects[page]);return;}
 if(!S.loaded)await loadSession();
 else if(S.me){await refreshTotals();checkLevelUp();}
 document.body.classList.toggle('tv',page==='tv');
 const known=['comunita','trofei','putia','banca','proposte','paese','notifiche','home','calendario','spazio','accedi','missioni','presenze','profilo','referenti','privacy','imposta-password'];
 const active=known.includes(page)?page:'';
 renderChrome(active);
 main.setAttribute('aria-busy','true');
 let html;
 try{
  if(page==='home')html=S.me?await homeMember():await home();
  else if(page==='calendario')html=await calendario();
  else if(page==='notifiche')html=await notifiche();
  else if(page==='spazio')html=await spazio();
  else if(page==='paese')html=await paese();
  else if(page==='comunita')html=await comunita();
  else if(page==='trofei')html=await trofei();
  else if(page==='putia')html=await putia();
  else if(page==='banca')html=await banca();
  else if(page==='proposte')html=await proposte();
  else if(page==='privacy')html=privacy();
  else if(page==='tv')html=await tvPage();
  else if(page==='ingresso')html=await ingressoPage(detail);
  else if(page==='cartello')html=await cartello();
  else if(page==='accedi')html=accedi();
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
 main.innerHTML=html;
 main.removeAttribute('aria-busy');
 if(page==='tv')fitTv();
 if(focus){window.scrollTo(0,0);main.focus({preventScroll:true});}
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
 box.innerHTML=`<div class="celebration-card trophy-card ${t.earned?'trophy-on':'trophy-off'}">${t.earned?'<div class="confetti" aria-hidden="true">'+Array.from({length:14},(_,i)=>`<i style="left:${(i*41)%100}%;background:${['#caff4d','#fe4400','#8feafc','#ffe043','#ff55a1'][i%5]};animation-delay:${(i%6)*90}ms"></i>`).join('')+'</div>':''}
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
const actions={
 reload:()=>render(),
 trophy(id){const t=(S.trophies||[]).find(x=>x.id===id);if(t)openTrophy(t);},
 theme(){document.querySelector('#theme-toggle').click();render();},
 tvzoom(id){const z=Math.min(1.6,Math.max(.6,Number(pref.get('tvzoom',1))+(id==='up'?.1:-.1)));pref.set('tvzoom',z.toFixed(2));const el=document.querySelector('.tv-screen');if(el)el.style.setProperty('--tvz',z);},
 async checkin(){await run(async()=>{const r=await api('/checkin',{method:'POST',body:{}});say(`Ingresso registrato. Benvenutə, ${S.me.pseudonym}!`);return r;},null);},
 print:()=>window.print(),
 async checkout(){await run(()=>api('/checkout',{method:'POST',body:{}}),'Uscita registrata. A presto!');},
 async rotate(){if(!confirm('Il vecchio QR smetterà di funzionare e dovrai ristampare il cartello. Continuare?'))return;await run(()=>api('/checkin-code/rotate',{method:'POST',body:{}}),'Codice cambiato: ristampa il cartello.');},
 async redeem(id){let r;await run(async()=>{r=await api(`/rewards/${encodeURIComponent(id)}/redeem`,{method:'POST',body:{}});},null,{rerender:false})&&(say(`Premio riscattato! ${r.emailSent?'Ti abbiamo scritto una email con le istruzioni.':'Passa in sede per ritirarlo.'}`),await render());},
 async redeemCancel(id){await run(()=>api(`/redemptions/${encodeURIComponent(id)}/cancel`,{method:'POST',body:{}}),'Riscatto annullato: i Formaggi sono tornati.');},
 async redDeliver(id){await run(()=>api(`/redemptions/${encodeURIComponent(id)}/deliver`,{method:'POST',body:{}}),'Premio consegnato. Il socio è stato avvisato anche via email.');},
 async rewardActive(id,el){await run(()=>api(`/rewards/${encodeURIComponent(id)}`,{method:'PATCH',body:{active:el.dataset.active==='1'}}),'Vetrina aggiornata.');},
 async xAccept(id){await run(()=>api(`/time-exchanges/${encodeURIComponent(id)}/accept`,{method:'POST',body:{}}),'Richiesta accettata.');},
 async xDecline(id){await run(()=>api(`/time-exchanges/${encodeURIComponent(id)}/decline`,{method:'POST',body:{}}),'Richiesta rifiutata.');},
 async xCancel(id){await run(()=>api(`/time-exchanges/${encodeURIComponent(id)}/cancel`,{method:'POST',body:{}}),'Scambio annullato.');},
 async xDone(id){let r;await run(async()=>{r=await api(`/time-exchanges/${encodeURIComponent(id)}/done`,{method:'POST',body:{}});},null,{rerender:false})&&(say(r.awarded?'Scambio concluso! Hai ricevuto XP e Formaggi.':'Scambio concluso. Hai già raggiunto il limite di premi della settimana.'),await render());},
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
 async verify(id){let r;await run(async()=>{r=await api(`/chores/${encodeURIComponent(id)}/verify`,{method:'POST',body:{}});},null,{rerender:false})&&(say(r.outcome.cheeseCapped?'Confermata. I Formaggi sono stati ridotti per il limite settimanale.':'Missione confermata.'),await render());},
 async reject(id){await run(()=>api(`/chores/${encodeURIComponent(id)}/reject`,{method:'POST',body:{}}),'Missione respinta.');},
 async choreActive(id,el){await run(()=>api(`/chore-types/${encodeURIComponent(id)}`,{method:'PATCH',body:{active:el.dataset.active==='1'}}),'Catalogo aggiornato.');},
 async 'act-status'(id,el){await run(()=>api(`/activities/manage/${encodeURIComponent(id)}`,{method:'PATCH',body:{status:el.dataset.status}}),'Attività aggiornata.');},
 async 'bk-confirm'(id,el){await run(()=>api(`/activities/${encodeURIComponent(id)}/confirm`,{method:'POST',body:{memberId:el.dataset.member}}),'Prenotazione confermata.');},
 async 'bk-decline'(id,el){await run(()=>api(`/activities/${encodeURIComponent(id)}/decline`,{method:'POST',body:{memberId:el.dataset.member}}),'Prenotazione rifiutata.');},
 async 'bk-attend'(id,el){await run(()=>api(`/activities/${encodeURIComponent(id)}/attendance`,{method:'POST',body:{memberId:el.dataset.member}}),'Presenza registrata, XP e Formaggi assegnati.');},
 prefill(){
  const f=main.querySelector('form[data-form="activity"]');if(!f)return;
  f.elements.name.value='Giornata internazionale contro la violenza sulle donne';
  f.elements.startsAt.value='2026-11-25T17:30';f.elements.capacity.value='25';
  f.elements.status.value='draft';
 }
};
main.addEventListener('click',event=>{
 const el=event.target.closest('button[data-action]');
 if(!el||el.disabled)return;
 const handler=actions[el.dataset.action];
 if(!handler)return;
 el.disabled=true;
 Promise.resolve(handler(el.dataset.id,el)).finally(()=>{el.disabled=false;});
});

const submits={
 async request(f,v){await run(()=>api(`/time-offers/${encodeURIComponent(f.dataset.id)}/request`,{method:'POST',body:{note:v('note')}}),'Richiesta inviata: chi offre l’ora riceve un avviso.');},
 async offer(f,v){await run(()=>api('/time-offers',{method:'POST',body:{title:v('title'),description:v('description')}}),'Offerta pubblicata.');},
 async proposal(f,v){await run(()=>api('/proposals',{method:'POST',body:{title:v('title'),description:v('description')}}),'Proposta pubblicata: ora il gruppo può votarla.');},
 async schedule(f,v){await run(()=>api(`/proposals/${encodeURIComponent(f.dataset.id)}/schedule`,{method:'POST',body:{startsAt:Math.floor(new Date(v('startsAt')).getTime()/1000)}}),'Proposta in calendario (bozza): completala in Referenti → Attività. Chi l’ha proposta è stato avvisato.');},
 async reward(f,v){await run(()=>api('/rewards',{method:'POST',body:{name:v('name'),description:v('description'),cost:Number(v('cost')),quantity:v('quantity')===''?null:Number(v('quantity')),art:v('art')}}),'Premio aggiunto alla vetrina.');},
 async rewardedit(f,v){await run(()=>api(`/rewards/${encodeURIComponent(f.dataset.id)}`,{method:'PATCH',body:{cost:Number(v('cost')),quantity:v('quantity')===''?null:Number(v('quantity'))}}),'Premio aggiornato.');},
 async login(f,v){
  const ok=await run(async()=>{const d=await api('/auth/login',{method:'POST',body:{email:v('email'),password:v('password')}});S.me=d.member;},null,{rerender:false});
  if(ok){await refreshTotals();let next='#home';try{next=sessionStorage.getItem('cca-after-login')||'#home';sessionStorage.removeItem('cca-after-login');}catch{}location.hash=next;await render(true);say('Bentornatə!');}
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
  await run(()=>api('/activities/manage',{method:'POST',body:{name:v('name'),startsAt:Math.floor(new Date(v('startsAt')).getTime()/1000),capacity:Number(v('capacity')),verificationRule:v('verificationRule'),xp:Number(v('xp')),cheese:Number(v('cheese')),path:v('path')||null,status:v('status')}}),'Attività creata.');
 }
};
main.addEventListener('submit',async event=>{
 const f=event.target.closest('form[data-form]');
 if(!f)return;
 event.preventDefault();
 const handler=submits[f.dataset.form];
 if(!handler)return;
 const submit=f.querySelector('button:not([type])');
 if(submit)submit.disabled=true;
 const v=name=>{const e=f.elements[name];return e?String(e.value??'').trim():'';};
 try{await handler(f,v,f.dataset.id);}finally{if(submit)submit.disabled=false;}
});
window.addEventListener('hashchange',()=>{if(location.hash!=='#main')render(true);});
render();

const themeControl=document.querySelector('#theme-toggle');
function applyTheme(night){
 document.documentElement.dataset.theme=night?'night':'day';
 themeControl.setAttribute('aria-pressed',String(night));
 themeControl.textContent=night?'☀':'☾';
 themeControl.setAttribute('aria-label',night?'Passa alla modalità giorno':'Passa alla modalità notte');
}
let night=false;
try{night=(localStorage.getItem('cca-theme')??(window.matchMedia('(prefers-color-scheme: dark)').matches?'night':'day'))==='night';}catch{}
applyTheme(night);
themeControl.addEventListener('click',()=>{night=!night;applyTheme(night);try{localStorage.setItem('cca-theme',night?'night':'day');}catch{}});
