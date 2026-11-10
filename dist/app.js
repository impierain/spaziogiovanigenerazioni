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
function cowMascot(mood,text){
 const eyes={normale:'M6 6h1v2H6z M10 6h1v2h-1z',felice:'M5 7h1V6h2v1H5z M9 7h1V6h2v1H9z',curioso:'M6 6h1v2H6z M10 7h1v1h-1z',festoso:'M5 6h2v1H5z M10 6h2v1h-2z'};
 const sprite='<path fill="#171523" d="M2 4h2V2h3v2h2V2h3v2h2v1h2v4h-3v3h-2v2H5v-2H3V9H0V5h2z"/><path fill="#b9954b" d="M5 3h1v2H5z M10 3h1v2h-1z"/><path fill="#fff3d5" d="M2 6h3V5h6v1h3v2h-2v3h-2v2H6v-2H4V8H2z"/><path fill="#73584e" d="M4 6h3v2H4z"/><path fill="#ee99aa" d="M5 9h6v3H5z"/><path fill="#171523" d="M6 9h1v1H6z M9 9h1v1H9z M7 11h2v1H7z"/>';
 return `<div class="mascot">${pixelIcon(sprite+`<path fill="#171523" d="${eyes[mood]}"/>`)}<div><strong>Mù</strong><p>${esc(text)}</p></div></div>`;
}
const pixelIcon = (path,kind='')=>`<svg class="pixel-icon ${kind}" viewBox="0 0 16 16" shape-rendering="crispEdges" aria-hidden="true">${path}</svg>`;

/* ===== CCA SIEMMU · frontend collegato alle API ===== */
const LEVELS=[['Noviziu',0],['Esploratore',60],['Cumpagnu',150],['Custode',300],['Capufila',520],['Maestru',800],['Pilastru',1150],['Leggenda di cca',1600]];
const WEEKLY_CHEESE=12;
const main=document.querySelector('main');
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const S={me:null,totals:{xp:0,cheese:0},invite:null,loaded:false};
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
 try{const d=await api('/auth/me');S.me=d.member;S.totals=d.totals??{xp:0,cheese:0};}
 catch{S.me=null;}
 S.loaded=true;
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
 home:['Home','home'],calendario:['Calendario','calendario'],spazio:['Spazio','comunita'],accedi:['Accedi','profilo'],
 missioni:['Missioni','missioni'],presenze:['Presenze','comunita'],referenti:['Referenti','comunita'],profilo:['Profilo','profilo']
};
function renderChrome(active){
 const ids=!S.me?['home','calendario','spazio','accedi']:isOrganizer()?['home','calendario','missioni','referenti','profilo']:['home','calendario','missioni','presenze','profilo'];
 const nav=document.querySelector('#nav');
 nav.style.setProperty('--cols',ids.length);
 nav.innerHTML=ids.map(id=>`<a href="#${id}" ${active===id?'aria-current="page"':''}><span class="nav-icon-tile" aria-hidden="true">${pixelIcon(navIcons[navDefs[id][1]],'nav-icon')}</span>${navDefs[id][0]}</a>`).join('');
 const wallet=document.querySelector('#wallet-link');
 wallet.hidden=!S.me;
 if(S.me){wallet.innerHTML=pixelIcon(cheese)+`<span>${S.totals.cheese}</span>`;wallet.setAttribute('aria-label',`${S.totals.cheese} Formaggi guadagnati · apri le missioni`);}
}

/* ---- viste pubbliche ---- */
function home(){
 if(!S.me)return `<div class="hero"><img class="scenery-day" src="sicani.svg" alt="Illustrazione pixel di un borgo tra i Monti Sicani"><img class="scenery-night" src="sicani-notte.svg" alt="Borgo dei Monti Sicani di notte, con luna e finestre illuminate"><div class="hero-copy"><span class="eyebrow">CAMMARATA + SAN GIOVANNI GEMINI</span><h1>CCA SIEMMU</h1><p class="hero-motto">E boni siemmu</p><p class="hero-local">Uno spazio gratuito per incontrarsi, studiare e far nascere idee insieme.</p>${link('Guarda il calendario','calendario')} ${link('Accedi','accedi')}<p class="muted entry-hint">Il calendario è aperto a tutti. Per prenotare e guadagnare Formaggi serve l’account che ti danno i referenti.</p></div></div>`+
  section('Come funziona',grid([
   card('<h3>Vieni in sede</h3><p>Ingresso e uscita vengono registrati dai referenti: così sappiamo quante ore lo spazio resta vivo.</p>'),
   card('<h3>Partecipa</h3><p>Prenota le attività del calendario e dai una mano con le faccende: ogni impegno verificato vale XP e Formaggi.</p>'),
   card('<h3>Cresci</h3><p>Sali di livello, guarda le tue presenze e contribuisci a far crescere lo spazio.</p>')
  ]))+cowMascot('normale','E boni siemmu!');
 return null;
}
async function homeMember(){
 const [acts,mine,chores]=await Promise.all([api('/activities'),api('/my/bookings'),api('/chores?status=pending')]);
 const booked=new Map(mine.bookings.map(b=>[b.activityId,b.status]));
 const upcoming=acts.activities.filter(a=>a.starts_at>Date.now()/1000-3600).slice(0,3);
 let extra='';
 if(isOrganizer()){
  const [inside,pending]=await Promise.all([api('/inside'),api('/chores?status=pending')]);
  const mineAll=pending.chores.length;
  extra=section('Da gestire',grid([
   card(`<span class="metric">${inside.presenti.length}</span><h3>In sede adesso</h3><p>${inside.presenti.length?esc(inside.presenti.map(p=>p.name).join(', ')):'Nessuno è registrato dentro.'}</p>${link('Registra ingressi','referenti/presenze')}`,'green'),
   card(`<span class="metric">${mineAll}</span><h3>Faccende da verificare</h3><p>Le richieste in attesa aspettano una decisione.</p>${link('Verifica','referenti/faccende')}`),
   card(`<h3>Pannello referenti</h3><p>Soci, presenze, faccende, attività e statistiche.</p>${link('Apri il pannello','referenti')}`)
  ]));
 }
 return title(`Ciao, ${esc(S.me.pseudonym)}`,'Ecco il tuo spazio.')+
  section('Il mio personaggio',grid([card(profileChip()+`<div class="stat-figure">${pixelIcon(cheese)}<strong>${S.totals.cheese} Formaggi guadagnati</strong></div>`),
   card(`<h3>Le mie richieste</h3><p>${chores.chores.length} faccende in attesa di verifica.</p>${link('Vai alle missioni','missioni')}${link('Le mie presenze','presenze')}`)],'two'))+
  extra+
  section('Prossime attività',upcoming.length?grid(upcoming.map(a=>card(`<h3>${esc(a.name)}</h3><p>${dateLong(a.starts_at)}</p><p>${a.available>0?`${a.available} posti liberi su ${a.capacity}`:'Posti esauriti'}</p>${booked.has(a.id)?badge(statusText[booked.get(a.id)]):''}`)),'three')+`<p>${link('Tutto il calendario','calendario')}</p>`:card('<p>Non ci sono ancora attività in calendario.</p>'));
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
  return card(`<h3>${esc(a.name)}</h3><p><strong>${dateLong(a.starts_at)}</strong></p><p>${Math.max(0,a.available)} posti liberi su ${a.capacity}</p><p class="muted">${esc(a.verification_rule)}</p>${action}`);
 }),'two'):card('<h3>Ancora nulla in calendario</h3><p>I referenti pubblicheranno qui le prossime attività.</p>');
 return title('Calendario','Le attività dello spazio. La prenotazione è una richiesta: un referente la conferma.')+section('Prossime attività',body)+
  (S.me?section('Come funziona',card('<p>Quando prenoti, il posto resta riservato finché un referente decide. Alla fine il referente verifica di persona la tua presenza e ti assegna XP e Formaggi.</p>')):'');
}

function spazio(){
 return title('Lo spazio','Un luogo gratuito pensato e gestito dai giovani di Cammarata e San Giovanni Gemini.')+
 section('Prima di venire',grid([
  card('<h3>A chi si rivolge</h3><p>Il progetto si rivolge principalmente a chi ha tra 14 e 30 anni e vive nei due paesi. Puoi venire per studiare, incontrare altre persone o proporre un’attività.</p>','audience'),
  card(`<h3>Come entri</h3><p>All’ingresso e all’uscita un referente (o il lettore della tessera) registra la tua presenza. Così calcoliamo le ore di apertura e i tuoi progressi.</p>${link('Accedi','accedi')}`,'green')
 ],'two'))+
 section('Come si partecipa',card('<h3>Dall’idea all’assemblea</h3><p>Puoi proporre un laboratorio, dare una mano con le faccende o portare una questione all’assemblea in sede. Ascolta chi usa lo spazio, rispetta le differenze e lascia in ordine i materiali comuni.</p>'))+
 section('Il progetto',card('<p>Cca Siemmu è promosso da Spazio Giovani Generazioni ed è finanziato dal Corpo europeo di solidarietà. Contatti: <a href="mailto:spaziogiovanigenerazioni@gmail.com">spaziogiovanigenerazioni@gmail.com</a>.</p>'));
}

function privacy(){
 const mail='spaziogiovanigenerazioni@gmail.com',c=`<a href="mailto:${mail}">${mail}</a>`;
 return title('Informativa sulla privacy','Cca Siemmu · Spazio Giovani Generazioni')+
 section('Chi gestisce i dati',card(`<p>Spazio Giovani Generazioni gestisce la piattaforma. Per domande o richieste sui tuoi dati scrivi a ${c}.</p><p class="muted"><strong>Stato dell’informativa.</strong> Questa pagina elenca i dati che il sistema registra davvero. Basi giuridiche, tempi di conservazione e ruoli (titolare, responsabili) devono essere definiti e firmati dall’associazione prima dell’uso con i soci reali.</p>`))+
 section('Quali dati registriamo',grid([
  card('<h3>Account</h3><p>Nome e cognome, email, telefono (facoltativo), pseudonimo, ruolo e stato dell’account. La password è conservata solo come impronta crittografica, mai in chiaro. Il codice della tessera, se assegnata.</p>'),
  card('<h3>Presenze in sede</h3><p>Data e ora di ingresso e uscita, e chi le ha registrate. Servono a calcolare le ore di apertura e le tue statistiche personali.</p>'),
  card('<h3>Attività e faccende</h3><p>Prenotazioni, presenze convalidate, richieste di faccende con eventuale nota, decisioni dei referenti, XP e Formaggi.</p>'),
  card('<h3>Sessione</h3><p>Dopo l’accesso usiamo un solo cookie tecnico di sessione, necessario al funzionamento. Non usiamo cookie di analisi o pubblicità. I tentativi di accesso falliti sono registrati per un breve periodo per limitare gli abusi.</p>')
 ],'two'))+
 section('Chi vede cosa',card('<p>Ogni socio vede i propri dati. I referenti autorizzati vedono l’elenco dei soci, le presenze, le faccende e le statistiche della sede. Le statistiche pubbliche non mostrano dati personali.</p>'))+
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

/* ---- missioni (faccende) ---- */
async function missioni(){
 if(!S.me)return needLogin();
 const [types,logs]=await Promise.all([api('/chore-types'),api('/chores?limit=30')]);
 const active=types.types.filter(t=>t.active);
 const pending=logs.chores.filter(c=>c.status==='pending').length;
 return title('Missioni','Le faccende che tengono vivo lo spazio. Falla, chiedi la verifica a un referente e ricevi XP e Formaggi.')+
 section('Faccende disponibili',active.length?grid(active.map(t=>card(`${art('heart')}<h3>${esc(t.name)}</h3><p>${esc(t.description)}</p><p><strong>${t.xp} XP</strong> · <strong>${t.cheese} Formaggi</strong></p>${form('chore',field('note','Nota (facoltativa)','text','maxlength="200" placeholder="Es. ho sistemato lo scaffale"').replace(' required',''),'Chiedi la verifica',{id:t.id,cls:'inline-form'})}`)),'two'):card('<p>I referenti non hanno ancora pubblicato faccende.</p>'))+
 `<p class="muted">Le faccende ripetibili danno al massimo ${WEEKLY_CHEESE} Formaggi a settimana (da lunedì a domenica). Gli XP si contano sempre.</p>`+
 section(`Le mie richieste${pending?` · ${pending} in attesa`:''}`,logs.chores.length?card(`<ul class="list">${logs.chores.map(c=>`<li><strong>${esc(c.choreName)}</strong> · ${dateShort(c.requestedAt)} · ${badge(statusText[c.status])}${c.status==='verified'?` · ${c.xp} XP, ${c.cheese} Formaggi`:''}${c.note?`<br><span class="muted">${esc(c.note)}</span>`:''}</li>`).join('')}</ul>`):card('<p>Non hai ancora richiesto nessuna faccenda.</p>'));
}

/* ---- presenze personali ---- */
const weekdayBars=(rows,key)=>{const max=Math.max(1,...rows.map(r=>r[key]));return rows.map(r=>bar(r[key],max,r.name.slice(0,3))).join('');};
async function presenze(){
 if(!S.me)return needLogin();
 const [stats,acc]=await Promise.all([api('/stats/members/'+S.me.id),api('/access?limit=40')]);
 const t=stats.totals;
 return title('Le mie presenze','Quanto tempo passi in sede e cosa hai guadagnato.')+
 section('In breve',grid([
  card(`<span class="metric">${stats.visits}</span><h3>Visite</h3><p>${stats.insideNow?badge('Sei dentro adesso'):'Negli ultimi 12 mesi'}</p>`),
  card(`<span class="metric">${stats.hours}</span><h3>Ore in sede</h3><p>Media ${duration(stats.avgVisitMinutes)} a visita</p>`),
  card(`<span class="metric">${stats.streak}</span><h3>Serie di giorni</h3><p>Giorni di apertura consecutivi con almeno una tua visita</p>`)
 ]))+
 section('I miei guadagni',grid([
  card(`<span class="metric">${t.xp}</span><h3>XP</h3><p>${stats.activitiesAttended} attività · ${stats.choresVerified} faccende verificate</p>`),
  card(`<span class="metric">${t.cheese}</span><h3>Formaggi guadagnati</h3><p>Il riscatto dei premi arriverà più avanti.</p>`)
 ],'two'))+
 section('Quando vieni',card(weekdayBars(stats.weekdays,'visits')))+
 section('Ultime visite',stats.recent.length?card(`<ul class="list">${stats.recent.map(r=>`<li>${dateLong(r.start)} · ${duration(r.minutes)}</li>`).join('')}</ul>`):card('<p>Nessuna visita registrata.</p>'))+
 section('Registro ingressi e uscite',acc.accessi.length?card(`<ul class="list">${acc.accessi.map(a=>`<li>${a.direction==='IN'?'Ingresso':'Uscita'} · ${dateShort(a.at)}</li>`).join('')}</ul>`):card('<p>Ancora nessun movimento negli ultimi 30 giorni.</p>'));
}

/* ---- profilo ---- */
function profilo(){
 if(!S.me)return needLogin();
 const species=pref.get('species','mucca'),color=pref.get('color','rosa');
 const picker=`<fieldset><legend>Avatar</legend><div class="animal-picker">${Object.entries(animals).map(([id,a])=>`<label><input type="radio" name="species" value="${id}" ${id===species?'checked':''}>${avatar(id,color)}<span>${a.name}</span></label>`).join('')}</div></fieldset><fieldset><legend>Colore</legend><div class="swatches">${Object.entries(avatarColors).map(([id,[name,hex]])=>`<label><input type="radio" name="color" value="${id}" ${id===color?'checked':''}><span class="swatch" style="background:${hex}"></span><span class="sr">${name}</span></label>`).join('')}</div></fieldset>`;
 return title('Profilo','Il tuo personaggio e il tuo account.')+
 section('Il mio personaggio',grid([card(profileChip()+`<div class="stat-figure">${pixelIcon(cheese)}<strong>${S.totals.cheese} Formaggi guadagnati</strong></div>${link('Le mie presenze','presenze')}`),
  card(`<details class="disclosure"><summary>Cambia avatar</summary>${form('avatar',picker,'Salva avatar',{cls:'plain'})}<p class="muted">L’avatar è salvato solo su questo dispositivo.</p></details>`)],'two'))+
 section('Account',grid([
  card(`<h3>${esc(S.me.fullName||S.me.pseudonym)}</h3><p>${esc(S.me.email)}</p><p>${badge(isOrganizer()?'Referente':'Socio')}</p>${btn('Esci','logout','',{secondary:true})}`),
  form('changepw','<h3>Cambia password</h3>'+field('current','Password attuale','password','required autocomplete="current-password"')+field('next','Nuova password (almeno 10 caratteri)','password','required minlength="10" autocomplete="new-password"'),'Cambia password')
 ],'two'))+
 `<p><a href="#privacy">Informativa sulla privacy</a></p>`;
}

/* ---- pannello referenti ---- */
const tabs=[['panoramica','Panoramica'],['soci','Soci'],['presenze','Presenze'],['faccende','Faccende'],['attivita','Attività'],['statistiche','Statistiche']];
const tabBar=active=>`<div class="tabs" role="navigation" aria-label="Sezioni del pannello">${tabs.map(([id,name])=>`<a class="btn" href="#referenti/${id==='panoramica'?'':id}" ${id===active?'aria-current="page"':''}>${name}</a>`).join('')}</div>`;
const copyBox=(url)=>`<div class="invite-link"><input readonly value="${esc(url)}" aria-label="Link d’invito"><button type="button" data-action="copy" data-value="${esc(url)}">Copia</button></div>`;
const waNumber=raw=>{let d=String(raw||'').replace(/[^\d+]/g,'');if(d.startsWith('+'))d=d.slice(1);else if(d.startsWith('00'))d=d.slice(2);else if(d.startsWith('3')&&d.length>=9&&d.length<=10)d='39'+d;return /^\d{8,15}$/.test(d)?d:'';};
const waLink=(phone,name,url)=>{const n=waNumber(phone);if(!n)return '';const msg=`Ciao ${name||''}! Ti ho registrato su Cca Siemmu. Scegli la tua password da questo link (vale 7 giorni): ${url}`;return `https://wa.me/${n}?text=${encodeURIComponent(msg)}`;};
const inviteCard=inv=>card(`<h3>Link d’invito pronto</h3><p>${inv.emailSent?'Abbiamo anche inviato l’email.':`Email non inviata${inv.emailNote?` (${esc(inv.emailNote)})`:''}: manda tu questo link alla persona.`} Vale 7 giorni e si usa una volta sola.</p>${copyBox(inv.inviteUrl)}${waLink(inv.phone,inv.who,inv.inviteUrl)?`<p><a class="btn" href="${esc(waLink(inv.phone,inv.who,inv.inviteUrl))}" target="_blank" rel="noopener">Invia su WhatsApp →</a></p>`:'<p class="muted">Nessun numero di telefono valido: copia il link e mandalo tu.</p>'}<p class="muted">${esc(inv.who||'')}</p>${btn('Chiudi','closeInvite','',{secondary:true})}`,'green');
const datetimeLocal=sec=>{const d=new Date(sec*1000),p=n=>String(n).padStart(2,'0');return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;};

async function referenti(tab,extra){
 if(!S.me)return needLogin();
 if(!isOrganizer())return needOrganizer();
 const head=title('Area referenti','Gestione di soci, presenze, faccende e attività.')+tabBar(tab||'panoramica');
 const pages={panoramica:panPanoramica,soci:panSoci,presenze:panPresenze,faccende:panFaccende,attivita:()=>panAttivita(extra),statistiche:panStatistiche};
 const render=pages[tab||'panoramica'];
 if(!render)return head+card('<p>Sezione non trovata.</p>');
 return head+await render();
}
async function panPanoramica(){
 const [inside,chores,sede]=await Promise.all([api('/inside'),api('/chores?status=pending'),api('/stats/sede')]);
 const t=sede.totals;
 return section('Adesso',grid([
  card(`<span class="metric">${inside.presenti.length}</span><h3>In sede</h3><p>${inside.presenti.length?inside.presenti.map(p=>`${esc(p.name)} (dalle ${fmt(p.since,{hour:'2-digit',minute:'2-digit'})})`).join(', '):'Nessuno è registrato dentro.'}</p>${link('Registra','referenti/presenze')}`,'green'),
  card(`<span class="metric">${chores.chores.length}</span><h3>Faccende da verificare</h3><p>Richieste in attesa di una decisione.</p>${link('Verifica','referenti/faccende')}`)
 ],'two'))+
 section(`Ultimi ${sede.periodDays} giorni`,grid([
  card(`<span class="metric">${t.hoursOpen}</span><h3>Ore di apertura</h3><p>Ore con almeno una persona dentro</p>`),
  card(`<span class="metric">${t.visits}</span><h3>Visite</h3><p>${t.uniqueMembers} persone diverse</p>`),
  card(`<span class="metric">${t.personHours}</span><h3>Ore-persona</h3><p>Media ${duration(t.avgVisitMinutes)} a visita</p>`)
 ])+`<p>${link('Tutte le statistiche','referenti/statistiche')}</p>`);
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
 const [inside,members,acc]=await Promise.all([api('/inside'),api('/members'),api('/access?from='+(Math.floor(Date.now()/1000)-3*86400)+'&limit=60')]);
 const active=members.members.filter(m=>m.status==='approved');
 const insideIds=new Set(inside.presenti.map(p=>p.id));
 return section('In sede adesso',inside.presenti.length?grid(inside.presenti.map(p=>card(`<h3>${esc(p.name)}</h3><p>Dentro dalle ${fmt(p.since,{hour:'2-digit',minute:'2-digit'})}</p>${btn('Registra uscita','out',p.id)}`)),'three'):card('<p>Nessuno è registrato dentro.</p>'))+
 section('Registra un movimento',form('access',`<label>Socio<select name="memberId" required>${active.map(m=>`<option value="${esc(m.id)}">${esc(m.pseudonym)}${insideIds.has(m.id)?' (dentro)':''}</option>`).join('')}</select></label><p class="muted">Il sistema alterna da solo ingresso e uscita.</p><label>Orario (vuoto = adesso)<input name="at" type="datetime-local" max="${datetimeLocal(Math.floor(Date.now()/1000))}"></label>`,'Registra'))+
 section('Ultimi tre giorni',acc.accessi.length?card(`<ul class="list">${acc.accessi.map(a=>`<li>${esc(a.name)} · ${a.direction==='IN'?'ingresso':'uscita'} · ${dateShort(a.at)}${a.source==='dispositivo'?' · lettore':''}</li>`).join('')}</ul>`):card('<p>Nessun movimento recente.</p>'));
}
async function panFaccende(){
 const [pending,types,members]=await Promise.all([api('/chores?status=pending'),api('/chore-types'),api('/members')]);
 const active=members.members.filter(m=>m.status==='approved');
 return section(`Da verificare (${pending.chores.length})`,pending.chores.length?grid(pending.chores.map(c=>card(`<h3>${esc(c.choreName)}</h3><p>${esc(c.memberName)} · ${dateShort(c.requestedAt)}</p>${c.note?`<p class="muted">${esc(c.note)}</p>`:''}<p>${c.xp||''}</p><div class="row">${btn('Conferma','verify',c.id)}${btn('Respingi','reject',c.id,{secondary:true})}</div>`.replace('<p></p>',''))),'two'):card('<p>Nessuna faccenda in attesa.</p>'))+
 section('Registra una faccenda fatta',types.types.some(t=>t.active)?form('logchore',`<label>Socio<select name="memberId" required>${active.map(m=>`<option value="${esc(m.id)}">${esc(m.pseudonym)}</option>`).join('')}</select></label><label>Faccenda<select name="typeId" required>${types.types.filter(t=>t.active).map(t=>`<option value="${esc(t.id)}">${esc(t.name)} (${t.xp} XP, ${t.cheese} F.)</option>`).join('')}</select></label>${field('note','Nota (facoltativa)','text','maxlength="200"').replace(' required','')}<p class="muted">Registrata da un referente, viene convalidata subito.</p>`,'Registra e convalida'):card('<p>Crea prima una faccenda nel catalogo.</p>'))+
 section('Catalogo faccende',grid(types.types.map(t=>card(`<h3>${esc(t.name)}</h3><p>${esc(t.description)}</p><p>${t.xp} XP · ${t.cheese} Formaggi ${t.active?'':badge('Non attiva')}</p>${btn(t.active?'Disattiva':'Riattiva','choreActive',t.id,{secondary:true,extra:`data-active="${t.active?0:1}"`})}`)),'two'))+
 section('Nuova faccenda nel catalogo',form('choretype','<h3>Aggiungi una faccenda</h3>'+field('name','Nome','text','required maxlength="80"')+field('description','Descrizione','text','maxlength="400"').replace(' required','')+field('xp','XP','number','required min="0" max="500" value="10"')+field('cheese','Formaggi','number','required min="0" max="200" value="2"'),'Aggiungi'));
}
async function panAttivita(id){
 if(id){
  const [{bookings},{activities}]=await Promise.all([api(`/activities/manage/${encodeURIComponent(id)}/bookings`),api('/activities/manage')]);
  const a=activities.find(x=>x.id===id);
  if(!a)return card('<p>Attività non trovata.</p>'+link('Torna alle attività','referenti/attivita'));
  return section(esc(a.name),card(`<p>${dateLong(a.startsAt)} · ${statusText[a.status]} · ${a.capacity} posti</p><p class="muted">${esc(a.verificationRule)}</p><p>${a.xp} XP · ${a.cheese} Formaggi a chi partecipa</p>`)+`<p>${link('Tutte le attività','referenti/attivita')}</p>`)+
  section('Prenotazioni',bookings.length?grid(bookings.map(b=>card(`<h3>${esc(b.name)}</h3><p>${badge(statusText[b.status])} ${b.attended?badge('Presenza registrata'):''}</p><div class="row">${b.status==='pending'?btn('Conferma','bk-confirm',a.id,{extra:`data-member="${esc(b.memberId)}"`})+btn('Rifiuta','bk-decline',a.id,{secondary:true,extra:`data-member="${esc(b.memberId)}"`}):''}${b.status==='confirmed'&&!b.attended?btn('Registra presenza','bk-attend',a.id,{extra:`data-member="${esc(b.memberId)}"`}):''}</div>`)),'two')+`<p class="muted">La presenza si registra dopo l’inizio dell’attività e nella stessa giornata, solo dopo averla verificata di persona.</p>`:card('<p>Nessuna prenotazione.</p>'));
 }
 const {activities}=await api('/activities/manage');
 const create=form('activity','<h3>Nuova attività</h3>'+field('name','Titolo','text','required maxlength="120"')+field('startsAt','Data e ora','datetime-local','required')+field('capacity','Posti','number','required min="1" max="500" value="25"')+field('verificationRule','Come verifichi la presenza','text','required maxlength="300" value="Il referente verifica di persona la presenza durante l’evento e la registra nella stessa giornata."')+field('xp','XP','number','required min="0" max="500" value="30"')+field('cheese','Formaggi','number','required min="0" max="200" value="5"')+`<label>Stato<select name="status"><option value="draft">Bozza (non visibile)</option><option value="published">Pubblicata</option></select></label>`,'Crea attività');
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
  card(`<span class="metric">${t.personHours}</span><h3>Ore-persona</h3><p>Media ${duration(t.avgVisitMinutes)}</p>`),
  card(`<span class="metric">${s.streak}</span><h3>Serie</h3><p>Giorni di apertura consecutivi</p>`)
 ],'two'))+section('Confronto mensile',card(cmp+s.trend.map(m=>bar(m.hours,trendMax,m.month.slice(2),' h')).join('')))+
 section('Ore di apertura per giorno',card(s.weekdays.map(d=>bar(d.hoursOpen,dayMax,d.name.slice(0,3),' h')).join('')))+
 section('Orari più frequentati',card(activeHours.length?activeHours.map(h=>bar(h.hours,hoursMax,String(h.hour).padStart(2,'0')+':00',' h')).join(''):'<p>Nessun dato.</p>'))+
 section('Classifica dei più presenti',s.ranking.length?card(`<ol class="list">${s.ranking.map(r=>`<li>${esc(r.name)} · ${r.hours} h · ${r.visits} visite</li>`).join('')}</ol>`):card('<p>Ancora nessun dato.</p>'));
}

/* ---- router ---- */
const redirects={benvenuto:'accedi',comunita:'home',formaggi:'missioni',vasceddi:'missioni',notifiche:'home',paisi:'home',condividi:'profilo'};
let renderId=0;
async function render(focus=false){
 const id=++renderId;
 const [raw,detail,extra]=location.hash.slice(1).split('/');
 let page=raw||'home';
 if(redirects[page]){location.replace('#'+redirects[page]);return;}
 if(!S.loaded)await loadSession();
 const known=['home','calendario','spazio','accedi','missioni','presenze','profilo','referenti','privacy','imposta-password'];
 const active=known.includes(page)?page:'';
 renderChrome(active);
 main.setAttribute('aria-busy','true');
 let html;
 try{
  if(page==='home')html=S.me?await homeMember():home();
  else if(page==='calendario')html=await calendario();
  else if(page==='spazio')html=spazio();
  else if(page==='privacy')html=privacy();
  else if(page==='accedi')html=accedi();
  else if(page==='imposta-password')html=await impostaPassword(detail);
  else if(page==='missioni')html=await missioni();
  else if(page==='presenze')html=await presenze();
  else if(page==='profilo')html=profilo();
  else if(page==='referenti')html=await referenti(detail,extra);
  else html=title('Ti pirdisti?','Questa pagina non c’è.')+card(link('Torna alla Home','home'));
 }catch(e){
  if(e.status===401){S.me=null;renderChrome(active);html=needLogin();}
  else html=title('Ops','')+failCard(e);
 }
 if(id!==renderId)return;
 main.innerHTML=html;
 main.removeAttribute('aria-busy');
 if(focus){window.scrollTo(0,0);main.focus({preventScroll:true});}
}
function say(message,error=false){
 const status=document.querySelector('#status');
 status.textContent=message;status.classList.toggle('error',error);
 clearTimeout(say.t);say.t=setTimeout(()=>{status.textContent='';},5000);
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
async function refreshTotals(){try{const d=await api('/auth/me');if(d.member){S.me=d.member;S.totals=d.totals;}}catch{}}

/* ---- azioni ---- */
const actions={
 reload:()=>render(),
 async reserve(id){await run(()=>api(`/activities/${encodeURIComponent(id)}/reserve`,{method:'POST',body:{}}),'Richiesta inviata: un referente la confermerà.');},
 async cancel(id){await run(()=>api(`/activities/${encodeURIComponent(id)}/cancel`,{method:'POST',body:{}}),'Prenotazione annullata.');},
 async logout(){await run(()=>api('/auth/logout',{method:'POST',body:{}}),null,{rerender:false});S.me=null;S.totals={xp:0,cheese:0};S.invite=null;location.hash='#home';render(true);},
 async copy(_,el){try{await navigator.clipboard.writeText(el.dataset.value);say('Link copiato.');}catch{const i=el.parentElement.querySelector('input');i.select();say('Seleziona e copia il link.');}},
 closeInvite(){S.invite=null;return render();},
 async invite(id,el){
  let out;
  const ok=await run(async()=>{out=await api(`/members/${encodeURIComponent(id)}/invite`,{method:'POST',body:{}});},null,{rerender:false});
  if(ok){S.invite={...out.invite,phone:el.dataset.phone,who:el.closest('article')?.querySelector('h3')?.textContent||''};await render();window.scrollTo(0,0);}
 },
 async role(id,el){await run(()=>api(`/members/${encodeURIComponent(id)}`,{method:'PATCH',body:{role:el.dataset.role}}),'Ruolo aggiornato.');},
 async status(id,el){await run(()=>api(`/members/${encodeURIComponent(id)}`,{method:'PATCH',body:{status:el.dataset.status}}),'Stato aggiornato.');},
 async cardRemove(id){await run(()=>api(`/members/${encodeURIComponent(id)}/card`,{method:'DELETE'}),'Tessera rimossa.');},
 async out(id){await run(()=>api('/access',{method:'POST',body:{memberId:id,direction:'OUT'}}),'Uscita registrata.');},
 async verify(id){let r;await run(async()=>{r=await api(`/chores/${encodeURIComponent(id)}/verify`,{method:'POST',body:{}});},null,{rerender:false})&&(say(r.outcome.cheeseCapped?'Confermata. I Formaggi sono stati ridotti per il limite settimanale.':'Faccenda confermata.'),await render());},
 async reject(id){await run(()=>api(`/chores/${encodeURIComponent(id)}/reject`,{method:'POST',body:{}}),'Faccenda respinta.');},
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
 async login(f,v){
  const ok=await run(async()=>{const d=await api('/auth/login',{method:'POST',body:{email:v('email'),password:v('password')}});S.me=d.member;},null,{rerender:false});
  if(ok){await refreshTotals();location.hash='#home';await render(true);say('Bentornatə!');}
 },
 async setpw(f,v){
  if(v('password')!==v('again')){say('Le due password non coincidono.',true);return;}
  const ok=await run(async()=>{const d=await api('/auth/set-password',{method:'POST',body:{token:v('token'),password:v('password')}});S.me=d.member;},null,{rerender:false});
  if(ok){await refreshTotals();location.hash='#home';await render(true);say('Profilo completo. Benvenutə!');}
 },
 async changepw(f,v){if(await run(()=>api('/auth/change-password',{method:'POST',body:{current:v('current'),next:v('next')}}),'Password cambiata.',{rerender:false}))f.reset();},
 avatar(f,v){pref.set('species',v('species')||'mucca');pref.set('color',v('color')||'rosa');say('Avatar salvato.');return render();},
 async chore(f,v,id){if(await run(()=>api('/chores',{method:'POST',body:{typeId:id,note:v('note')}}),'Richiesta inviata: un referente la verificherà.'))return;},
 async member(f,v){
  let out;
  const ok=await run(async()=>{out=await api('/members',{method:'POST',body:{fullName:v('fullName'),email:v('email'),pseudonym:v('pseudonym')||undefined,phone:v('phone')||undefined,role:v('role')}});},null,{rerender:false});
  if(ok){S.invite={...out.invite,phone:out.member.phone,who:out.member.fullName||out.member.pseudonym};say('Socio registrato.');await render();window.scrollTo(0,0);}
 },
 async card(f,v,id){await run(()=>api(`/members/${encodeURIComponent(id)}/card`,{method:'PUT',body:{uidTessera:v('uid')}}),'Tessera assegnata.');},
 async access(f,v){
  const body={memberId:v('memberId')};
  if(v('at'))body.at=Math.floor(new Date(v('at')).getTime()/1000);
  let r;
  const ok=await run(async()=>{r=await api('/access',{method:'POST',body});},null,{rerender:false});
  if(ok){say(`${r.access.direction==='IN'?'Ingresso':'Uscita'} registrato per ${r.access.name}.`);await render();}
 },
 async logchore(f,v){await run(()=>api('/chores',{method:'POST',body:{typeId:v('typeId'),memberId:v('memberId'),note:v('note')}}),'Faccenda registrata e convalidata.');},
 async choretype(f,v){await run(()=>api('/chore-types',{method:'POST',body:{name:v('name'),description:v('description'),xp:Number(v('xp')),cheese:Number(v('cheese'))}}),'Faccenda aggiunta al catalogo.');},
 async activity(f,v){
  await run(()=>api('/activities/manage',{method:'POST',body:{name:v('name'),startsAt:Math.floor(new Date(v('startsAt')).getTime()/1000),capacity:Number(v('capacity')),verificationRule:v('verificationRule'),xp:Number(v('xp')),cheese:Number(v('cheese')),status:v('status')}}),'Attività creata.');
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
