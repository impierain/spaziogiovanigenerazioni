/* CCA SIEMMU · 06-tv-e-router.js — parte 6 di 7. I file si caricano in ordine (index.html) e condividono le variabili globali. */
/* ---- bacheca notifiche ---- */
const missionWording=text=>String(text??'').replace(/\bmansioni?\b/gi,word=>word[0]+(word.endsWith('i')?'issioni':'issione'));
const levelIcon={ok:'✓',error:'✕',info:'ℹ'};
async function notifiche(){
 if(!S.me)return needLogin();
 const d=await api('/notifications');
 const items=d.notifications;
 const fb=isOrganizer()?await api('/feedback/summary').catch(()=>null):null;
 const fbCard=fb&&fb.count?section('Valutazioni della webapp',card(`<p><strong>${String(fb.average).replace('.',',')}</strong> su 5 · ${fb.count} ${fb.count===1?'valutazione':'valutazioni'} (anonime)</p>${[5,4,3,2,1].map(n=>bar(fb.spread[n]||0,Math.max(...Object.values(fb.spread)),n+' stelle')).join('')}${fb.comments.length?`<h3>Ultimi commenti</h3><ul>${fb.comments.map(c=>`<li>${c.rating}/5 · ${esc(c.message)} <span class="muted">${dateShort(c.createdAt)}</span></li>`).join('')}</ul>`:''}`)):'';
 const pv=isOrganizer()?await api('/push/overview').catch(()=>null):null;
 const pvCard=pv?section('Notifiche sul telefono',card(`<p><strong>${pv.members.length}</strong> su ${pv.totalMembers} soci hanno attivato le notifiche (${pv.members.filter(m=>m.verified).length} verificate).</p>${pv.members.length?`<ul>${pv.members.map(m=>`<li>${esc(m.name)} · ${m.verified?'✓ verificata':m.received?'notifica ricevuta, manca la conferma':'in attesa di conferma'}${m.devices>1?' · '+m.devices+' dispositivi':''}</li>`).join('')}</ul>`:''}`)):'';
 const html=title('Notifiche','Esiti delle operazioni e avvisi che ti riguardano.')+fbCard+pvCard+
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
async function cartello(kind){
 if(!isOrganizer())return needLogin();
 if(kind==='sito'){
  await loadQr();
  return `<div class="poster"><span class="eyebrow">CAMMARATA + SAN GIOVANNI GEMINI</span><h1>CCA SIEMMU</h1><p class="poster-lead">Scopri cosa facciamo: inquadra il QR.</p>${qrSvg(location.origin+'/#home','QR code del sito')}<ol><li>Apri la fotocamera del telefono e inquadra il QR.</li><li>Guarda calendario, attività, orari e spazio, senza account.</li><li>Sei socio? Accedi per prenotare, giocare e segnare la presenza.</li></ol><p>E boni siemmu · Spazio Giovani Generazioni</p></div><p class="no-print">${btn('Stampa','print')} ${link('Torna alle presenze','referenti/presenze')}</p>`;
 }
 const [{code}]=[await api('/checkin-code'),await loadQr()];
 return `<div class="poster"><span class="eyebrow">CAMMARATA + SAN GIOVANNI GEMINI</span><h1>CCA SIEMMU</h1><p class="poster-lead">Sei entratə o uscitə? Inquadra il QR.</p>${qrSvg(checkinUrl(code),'QR code per registrare ingresso e uscita')}<ol><li>Apri la fotocamera del telefono e inquadra il QR.</li><li>Accedi, se non l’hai già fatto.</li><li>Il sito segna il tuo ingresso. Quando esci, inquadralo di nuovo.</li></ol><p>E boni siemmu · Spazio Giovani Generazioni</p></div><p class="no-print">${btn('Stampa','print')} ${link('Torna alle presenze','referenti/presenze')}</p>`;
}
const tvTips=['Prenota un posto dal calendario: ti aspettiamo!','Apri una missione per vedere i dettagli.','Hai un’idea per lo spazio? Scrivila nelle Proposte e fai votare il gruppo.','Un’ora del tuo tempo vale un’ora di un altro socio: guarda la Banca del tempo.','Inquadra il QR all’ingresso per segnare la tua presenza.','Ogni presenza fa crescere il paese. Grazie di esserci!'];
const tvTime=()=>new Intl.DateTimeFormat('it-IT',{timeZone:'Europe/Rome',hour:'2-digit',minute:'2-digit'}).format(new Date());
const tvDate=()=>new Intl.DateTimeFormat('it-IT',{timeZone:'Europe/Rome',weekday:'long',day:'numeric',month:'long'}).format(new Date());
// La bacheca TV non richiede tocchi: mostra soltanto informazioni pubbliche.
const tvZoom=value=>Math.min(1.15,Math.max(.85,Number(value)||1));
function tvActivity(a,withDescription){
 const access=a.access_mode==='open'?'Accesso libero':a.available>0?`${a.available} posti liberi`:'Posti esauriti';
 return `<li><strong>${esc(a.name)}</strong><div class="tv-activity-date">${activityDate(a.starts_at)}</div>${withDescription&&a.description?`<p class="tv-activity-description">${esc(a.description)}</p>`:''}<div class="tv-activity-access">${esc(access)}</div></li>`;
}
async function tvPage(){
 const [st,metrics,acts]=await Promise.all([getStatus(),getCommunity(),api('/activities').catch(()=>({activities:[],unavailable:true})),loadQr().catch(()=>{})]);
 const next=acts.activities.filter(a=>a.starts_at>Date.now()/1000-3600).sort((a,b)=>a.starts_at-b.starts_at).slice(0,3);
 const reached=villageCount(metrics);
 const tip=st?.open&&Math.floor(Date.now()/60000)%3===0?'Siamo aperti: entra, ti aspettiamo!':tvTips[Math.floor(Date.now()/60000)%tvTips.length];
 try{navigator.wakeLock?.request('screen').catch(()=>{});}catch{}
 const z=tvZoom(pref.get('tvzoom',1));
 return `<div class="tv-frame"><div class="tv-screen" style="--tvz:${z}">
 <div class="tv-tools no-print" aria-label="Impostazioni della schermata TV">${btn('A−','tvzoom','down',{secondary:true})}${btn('A+','tvzoom','up',{secondary:true})}${btn('Tema','theme','',{secondary:true})}</div>
 <header class="tv-top"><div class="tv-brand"><img src="icon.svg" alt=""><div>CCA SIEMMU<small>e boni siemmu · Spazio Giovani Generazioni</small></div></div>
 <div class="tv-opening"><div class="tv-live ${st?.open?'live-on':'live-off'}"><span class="live-dot" aria-hidden="true"></span>${st?st.open?'Aperto ora':'Chiuso al momento':'Stato non disponibile'}</div><p class="tv-hours"><strong>${esc(st?.hours||'16:00–20:00')}</strong><span>${esc(st?.days||'Da mercoledì a domenica · novembre 2026')}</span></p></div>
 <div class="tv-clock"><strong id="tv-time">${tvTime()}</strong><span id="tv-date">${esc(tvDate())}</span></div></header>
 <div class="tv-main"><section class="tv-left tv-panel" aria-labelledby="tv-activities-title"><h2 id="tv-activities-title">Prossime attività</h2>
 ${next.length?`<ul class="tv-acts" data-count="${next.length}">${next.map(a=>tvActivity(a,next.length<3)).join('')}</ul>`:`<div class="tv-empty">${pixelIcon(shapes.calendario)}<p>${acts.unavailable?'Il calendario non è disponibile al momento.':'Presto altri appuntamenti da vivere insieme.'}</p><span>Inquadra il QR per consultare il sito.</span></div>`}
 <p class="tv-calendar-note">Il calendario completo è sul tuo telefono.</p></section>
 <section class="tv-right tv-panel" aria-labelledby="tv-village-title"><div class="tv-village-heading"><h2 id="tv-village-title">U paisi crisci</h2><span>${metrics?`${reached} / 12 trasformazioni`:'Il nostro borgo'}</span></div>
 ${villageScene(metrics)}<p class="tv-village">${metrics?'Persone, luci, attività e verde: il borgo cresce con ciò che facciamo insieme.':'I progressi del borgo torneranno visibili al prossimo aggiornamento.'}</p></section></div>
 <footer class="tv-foot"><aside class="tv-tip">${cowMascot('curioso',tip)}<span class="tv-territory">Cammarata + San Giovanni Gemini</span></aside>
 <div class="tv-join">${window.qrcode?qrSvg(location.origin+'/#home','QR code per aprire Cca Siemmu'):''}<div><strong>Entra nella nostra piazza</strong><p>Inquadra e scopri attività, missioni e idee.</p><span>${esc(location.host)}</span></div></div></footer>
 </div></div>`;
}
// La TV è 16:9: la scena è un riquadro fisso 1920×1080 che si adatta allo schermo senza deformarsi.
function fitTv(){const st=document.querySelector('.tv-screen');if(!st)return;st.style.transform=`translate(-50%,-50%) scale(${Math.min(innerWidth/1920,innerHeight/1080)})`;}
window.addEventListener('resize',fitTv);
setInterval(()=>{if(location.hash!=='#tv'||document.hidden)return;const t=document.querySelector('#tv-time');if(t)t.textContent=tvTime();const d=document.querySelector('#tv-date');if(d)d.textContent=tvDate();},15000);
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
 const known=['comunita','assemblea','trofei','mercato','putia','banca','proposte','paese','notifiche','home','calendario','spazio','accedi','missioni','presenze','profilo','referenti','privacy','suggerimenti','notifiche-ok','imposta-password','impostazioni'];
 const active=known.includes(page)?page:'';
 renderChrome(active);
 await recordAppDay();
 if(page==='home'&&S.me&&!popupUsed)appPromptKindCache=await appPromptKind().catch(()=>'');
 if(!['tv','cartello'].includes(page)){await window.CCAJoy?.sync();renderChrome(active);}
 main.setAttribute('aria-busy','true');
 let html;
 try{
  if(page==='home')html=S.me?await homeMember():await home();
  else if(page==='calendario')html=await calendario();
  else if(page==='impostazioni')html=await impostazioni();
  else if(page==='notifiche')html=await notifiche();
  else if(page==='spazio')html=await spazio();
  else if(page==='paese')html=await paese();
  else if(page==='comunita')html=await comunita();
  else if(page==='assemblea')html=await assemblea();
  else if(page==='trofei')html=await trofei();
  else if(page==='mercato')html=mercato();
  else if(page==='putia')html=await putia();
  else if(page==='banca')html=await banca();
  else if(page==='proposte')html=await proposte();
  else if(page==='privacy')html=privacy();
  else if(page==='suggerimenti')html=await suggerimenti();
  else if(page==='notifiche-ok')html=await notificheOk(detail);
  else if(page==='tv')html=await tvPage();
  else if(page==='ingresso')html=await ingressoPage(detail);
  else if(page==='cartello')html=await cartello(detail);
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
 if(!['tv','cartello'].includes(page))main.insertAdjacentHTML('beforeend',`<footer class="foot site-foot">${document.querySelector('#project-logos').innerHTML}${S.me?feedbackLink+' · ':''}${privacyLink}</footer>`);
 if(!['tv','cartello'].includes(page)&&!main.querySelector('#mu-popover'))main.insertAdjacentHTML('beforeend',mu(page));
 main.removeAttribute('aria-busy');
 if(!['tv','cartello','ingresso','imposta-password'].includes(page))appPrompt(page).catch(()=>{}).then(feedbackPrompt);
 if(page==='tv')fitTv();
 window.CCAJoy?.afterRender();
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
function say(message,error=false){
 banner(error?'error':'ok',message);
 if(!error)playSound('success');
}
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
