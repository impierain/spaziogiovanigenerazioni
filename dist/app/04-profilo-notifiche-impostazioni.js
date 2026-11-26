/* CCA SIEMMU · 04-profilo-notifiche-impostazioni.js — parte 4 di 7. I file si caricano in ordine (index.html) e condividono le variabili globali. */
/* ---- accesso ---- */
function accedi(destination){
 if(S.me)return title('Sei già dentro',`Accesso effettuato come ${esc(S.me.pseudonym)}.`)+card(link('Vai alla Home','home'));
 return title('Accedi','Usa l’email con cui i referenti ti hanno registrato.')+
 grid([form('login',(destination==='banca'?'<input type="hidden" name="next" value="#banca">':'')+field('email','Email','email','required autocomplete="username"')+field('password','Password','password','required autocomplete="current-password"'),'Accedi'),
  card('<h3>Non hai le credenziali?</h3><p>Chiedi di accedere a Cca Siemmu. Un referente esamina la richiesta e ti invia il link per scegliere la password.</p>'+form('request-access',field('fullName','Nome e cognome','text','required maxlength="80" autocomplete="name"')+field('email','Email','email','required maxlength="254" autocomplete="email"')+'<p>Usiamo questi dati per gestire la richiesta. '+privacyLink+'</p>','Richiedi le credenziali',{cls:'plain'})+'<p>Hai già ricevuto un invito? Apri il link nella tua email per impostare la password.</p>')],'two');
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
 return (cards||'<div class="joy-empty"><h3>Proviamo un altro percorso?</h3><p>Cambia categoria o svuota la ricerca per trovare una missione adatta.</p>'+btn('Mostra tutte le missioni','joy-all-missions')+'</div>')+`<div class="mission-pager">${btn('←','mission-page','prev',{secondary:true,extra:missionPage===0?'disabled aria-label="Pagina precedente"':'aria-label="Pagina precedente"'})}<span>${missionPage+1}/${pages}</span>${btn('→','mission-page','next',{secondary:true,extra:missionPage>=pages-1?'disabled aria-label="Pagina successiva"':'aria-label="Pagina successiva"'})}</div>`;
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
 `<p class="muted" id="mission-checkin-note">Premi dopo verifica. Massimo ${tumazzi(WEEKLY_CHEESE)} a settimana dalle missioni ripetibili; gli XP restano permanenti. Dopo la convalida: 15% di probabilità di XP extra pari al premio base, fino a 50; il bonus non si somma a ruota o Fagotto.</p>
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
  window.CCAJoy?.weeklyPanel()||card('<h3>Fiamma della Settimana</h3><p>Partecipa a un’attività o contribuisci una volta a settimana.</p>')
 ]))+
 section('I miei guadagni',grid([
  card(`<span class="metric">${t.xp}</span><h3>XP</h3><p>${stats.activitiesAttended} attività · ${stats.choresVerified} missioni verificate</p>`),
  card(`<span class="metric">${t.cheese}</span><h3>Tumazzi guadagnati</h3><p>Il saldo disponibile tiene conto dei premi già riscattati nella Putìa.</p>`)
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
/* ---- notifiche push ---- */
const pushSupported=()=>'serviceWorker' in navigator&&'PushManager' in window&&'Notification' in window;
const keyBytes=text=>Uint8Array.from(atob(text.replace(/-/g,'+').replace(/_/g,'/').padEnd(Math.ceil(text.length/4)*4,'=')),c=>c.charCodeAt(0));
async function pushOn(){
 if(!pushSupported()||Notification.permission!=='granted')return false;
 try{return !!await (await navigator.serviceWorker.ready).pushManager.getSubscription();}catch{return false;}
}
const iosNotInstalled=()=>/iPhone|iPad|iPod/.test(navigator.userAgent)&&!(navigator.standalone||matchMedia('(display-mode: standalone)').matches);
async function notificheOk(token){
 if(!S.me)return needLogin();
 try{
  const d=await api('/push/confirm',{method:'POST',body:{token:token||''}});
  if(d.reward)await refreshTotals();
  return title('Notifiche verificate!','Ti è arrivata la notifica: funziona.')+card(`<p>${d.reward?'Ti abbiamo regalato <strong>1 Tumazzu</strong>. Grazie!':'Le notifiche su questo dispositivo sono verificate.'}</p>${link('Vai alla home','#home')}`);
 }catch(e){return title('Conferma non riuscita','')+card(`<p>${esc(e.message)}</p>${link('Vai al profilo','#profilo')}`);}
}
async function aulaCard(always){
 if(!S.me)return '';
 const d=await api('/aula/preferenza').catch(()=>null);
 if(!d||(!always&&!d.ask))return '';
 if(always)return card(`<h3>Avviso «aula studio aperta»</h3><p>${d.enabled?'Ricevi una notifica quando in sede arriva qualcuno e l’aula studio è aperta (da lunedì a venerdì pomeriggio, una volta al giorno).':'Vuoi sapere quando l’aula studio è aperta? Ti mandiamo una notifica sul telefono quando arriva qualcuno in sede.'}</p>${btn(d.enabled?'Disattiva l’avviso':'Attiva l’avviso',d.enabled?'aula-no':'aula-si','',{secondary:d.enabled})}`);
 return card(`<h3>Vuoi sapere quando l’aula studio è aperta? 📚</h3><p>Appena arriva qualcuno in sede nel pomeriggio ti mandiamo una notifica sul telefono: una al giorno, mai di più. Puoi cambiare idea dal profilo.</p>${btn('Sì, avvisami','aula-si')} ${btn('Non ora','aula-no','',{secondary:true})}`,'aula-ask');
}
/* ---- invito a installare l'app e ad attivare le notifiche ---- */
let installEvent=null;
addEventListener('beforeinstallprompt',e=>{e.preventDefault();installEvent=e;});
const isStandalone=()=>!!(navigator.standalone||matchMedia('(display-mode: standalone)').matches);
const isMobile=()=>/Android|iPhone|iPad|iPod/.test(navigator.userAgent);
const isIos=()=>/iPhone|iPad|iPod/.test(navigator.userAgent);
const snoozed=(key,days)=>Date.now()-Number(pref.get(key,0))<days*864e5;
// Con l'app installata ma senza notifiche: serve a far comparire l'invito nella home e nel pop-up.
async function wantsPushPrompt(){
 return isStandalone()&&pushSupported()&&Notification.permission!=='denied'&&!await pushOn();
}
async function pushNudge(){
 if(!S.me||!await wantsPushPrompt())return '';
 return card(`<h3>Attiva le notifiche 🔔</h3><p>Hai l’app: attiva le notifiche per non perdere promemoria, aula studio aperta e novità. Se ti arriva la notifica di prova e la confermi, ricevi <strong>1 Tumazzu</strong> in regalo.</p>${btn('Attiva le notifiche','push-toggle')}`,'push-nudge');
}
let appPromptShown=false;
// Un solo pop-up per visita, in quest'ordine: installa l'app / attiva le notifiche, poi il saluto del giorno, poi la valutazione.
let popupUsed=false,appPromptKindCache='';
function claimPopup(kind){
 if(popupUsed||(kind!=='app'&&appPromptKindCache))return false;
 popupUsed=true;return true;
}
window.ccaClaimPopup=claimPopup;
async function appPromptKind(){
 if(appPromptShown||!S.me)return '';
 if(!isStandalone())return isMobile()&&!snoozed('install-later',7)?'install':'';
 return !snoozed('push-later',3)&&await wantsPushPrompt()?'push':'';
}
async function appPrompt(page){
 if(appPromptShown||page!=='home'||!S.me)return;
 const kind=appPromptKindCache||await appPromptKind();
 appPromptKindCache='';
 if(!kind||document.querySelector('dialog[open]')||!claimPopup('app'))return;
 appPromptShown=true;
 const dialog=document.createElement('dialog');dialog.className='confirm-dialog';dialog.setAttribute('aria-labelledby','app-prompt-title');
 const steps=installSteps();
 dialog.innerHTML=kind==='install'
  ?`<h2 id="app-prompt-title">Porta l’app con te 📲</h2><p>Aggiungi CCA SIEMMU alla schermata Home: si apre come un’app, più veloce, e potrai ricevere le notifiche.</p>${installEvent?'':steps}<form method="dialog">${installEvent?'<button type="button" data-do="install">Installa l’app</button>':''}<button value="later" class="secondary">Più tardi</button></form>`
  :`<h2 id="app-prompt-title">Attiva le notifiche 🔔</h2><p>Ti avvisiamo di promemoria, aula studio aperta e novità, anche a sito chiuso. Se confermi la notifica di prova ricevi <strong>1 Tumazzu</strong> in regalo.</p><form method="dialog"><button type="button" data-do="push">Attiva le notifiche</button><button value="later" class="secondary">Più tardi</button></form>`;
 dialog.addEventListener('click',async e=>{
  const what=e.target.closest('[data-do]')?.dataset.do;if(!what)return;
  if(what==='install'){try{installEvent.prompt();await installEvent.userChoice;}catch{}dialog.close();return;}
  try{say(await togglePush());}catch(err){say(err.message||'Non sono riuscito ad attivarle.',true);}
  dialog.close();render();
 });
 dialog.addEventListener('close',()=>{pref.set(kind==='install'?'install-later':'push-later',String(Date.now()));dialog.remove();},{once:true});
 document.body.append(dialog);dialog.showModal();
}

async function pushCard(){
 if(iosNotInstalled())return card('<h3>Notifiche sul telefono</h3><p class="muted">Su iPhone funzionano dopo aver aggiunto il sito alla schermata Home: in Safari tocca Condividi → «Aggiungi alla schermata Home», poi apri CCA SIEMMU da lì.</p>');
 if(!pushSupported())return card('<h3>Notifiche sul telefono</h3><p class="muted">Questo browser non supporta le notifiche. Continuerai a ricevere i promemoria via email.</p>');
 const on=await pushOn();
 const st=on?await api('/push/status').catch(()=>({confirmed:true})):{confirmed:false,received:false};
 const text=!on?'Vuoi ricevere notifiche dall’app? Attivale: ti mandiamo una notifica di prova e, se ti arriva e la confermi, ricevi 1 Tumazzu in regalo (una sola volta). Poi i promemoria arrivano sul telefono, senza email, e puoi disattivarle quando vuoi.'
  :st.confirmed?'Sono attive e verificate su questo dispositivo: il promemoria «Sei ancora in sede?» arriva qui, senza email.'
  :st.received?'La notifica di prova è arrivata sul tuo dispositivo! Conferma per ricevere 1 Tumazzu.'
  :'Sono attive, ma la notifica di prova non risulta ancora arrivata. Se la vedi sul telefono toccala; altrimenti rimandala.';
 return card(`<h3>Notifiche sul telefono</h3><p>${text}</p>${btn(on?'Disattiva le notifiche':'Attiva le notifiche','push-toggle','',{secondary:on})}${on&&st.received&&!st.confirmed?' '+btn('Sì, mi è arrivata','push-confirm'):''}${on&&!st.confirmed&&!st.received?' '+btn('Rimanda la notifica di prova','push-resend'):''}`);
}
async function togglePush(){
 const reg=await navigator.serviceWorker.ready;
 const current=await reg.pushManager.getSubscription();
 if(current&&Notification.permission==='granted'){
  await api('/push/subscribe',{method:'DELETE',body:{endpoint:current.endpoint}}).catch(()=>{});
  await current.unsubscribe();
  return 'Notifiche disattivate su questo dispositivo.';
 }
 if(await Notification.requestPermission()!=='granted')throw Object.assign(new Error('Per attivarle devi consentire le notifiche nel browser.'),{status:0});
 const {publicKey}=await api('/push/key');
 const sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:keyBytes(publicKey)});
 const done=await api('/push/subscribe',{method:'POST',body:sub.toJSON()});
 return done.testSent?'Notifiche attivate. Ti abbiamo mandato una notifica di prova: toccala per ricevere 1 Tumazzu.':done.confirmed?'Notifiche attivate su questo dispositivo.':'Notifiche attivate, ma la prova non è partita. Riprova con «Rimanda la notifica di prova».';
}
/* ---- errori e rete ---- */
// Gli errori del sito vengono segnalati al server (finiscono nei log di Cloudflare), al massimo 5 per visita.
let reportedErrors=0;
function reportError(message,where=''){
 if(reportedErrors++>=5)return;
 try{fetch('/api/client-error',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:String(message).slice(0,500),where:String(where).slice(0,300),page:location.hash.slice(0,60),agent:navigator.userAgent.slice(0,160)}),keepalive:true}).catch(()=>{});}catch{}
}
addEventListener('error',e=>reportError(e.message,`${e.filename||''}:${e.lineno||''}:${e.colno||''}`));
addEventListener('unhandledrejection',e=>{const r=e.reason;if(r&&'status' in r)return;reportError(r?.message||r,r?.stack?.split('\n')[1]||'promise');});
function offlineBanner(){
 let b=document.querySelector('#offline-banner');
 if(navigator.onLine){b?.remove();return;}
 if(b)return;
 b=document.createElement('p');b.id='offline-banner';b.className='offline-banner';b.setAttribute('role','status');
 b.textContent='Sei offline: vedi i dati dell’ultima volta che hai aperto l’app.';
 document.body.prepend(b);
}
addEventListener('online',()=>{offlineBanner();render();});
addEventListener('offline',offlineBanner);
offlineBanner();

if('serviceWorker' in navigator){
 navigator.serviceWorker.register('sw.js').then(reg=>reg.update()).catch(()=>{});
 navigator.serviceWorker.addEventListener('message',e=>{if(e.data?.type==='cca-open'){try{const h=new URL(e.data.url).hash;if(h)location.hash=h;else render();}catch{}}});
}

async function profilo(){
 if(!S.me)return needLogin();
 const [prog,types,journal,streak]=await Promise.all([api('/my/progress').catch(()=>({counts:{}})),api('/chore-types').catch(()=>({types:[]})),journalCard(),getStreaks()]);
 const mine=S.me.interests||[];
 const interestsForm=`<p class="muted">Scegli cosa ti piace: ti consigliamo missioni e attività.</p><fieldset><legend>Percorsi</legend>${PATHS.map(([id,name])=>`<label><input type="checkbox" name="interest" value="${id}" ${mine.includes(id)?'checked':''}> ${esc(name)}</label>`).join('')}</fieldset>`;
 return title('Profilo','Il tuo personaggio e il tuo percorso.')+
 `<p class="subpage-back"><a class="btn secondary" href="#impostazioni">${gearIcon()} Impostazioni: account, notifiche, privacy</a></p>`+
 section('Il mio personaggio',card(profileChip()+`<div class="stat-figure">${pixelIcon(cheese)}<strong>${tumazzi(S.totals.cheese)}</strong></div><div class="support-links"><a href="#presenze">Le mie statistiche →</a></div><details class="disclosure profile-sharing"><summary>Condividi il tuo percorso</summary>${btn('Crea la mia card ↗','share-progress','',{extra:'aria-label="Crea e condividi la mia card dei progressi"'})}<p class="muted">Crea una card chibi con il tuo avatar, il livello e gli XP. Nome ed email restano privati.</p></details>`,'profile-overview'))+
 streakPanel(streak)+section('Le mie missioni',card('<div class="support-links">'+link('Apri le mie missioni','missioni')+link('I miei trofei','trofei')+'</div>'))+section('Diario di apprendimento Youthpass',journal,'','learning-journal')+
 skillPath(prog.counts,types.types.filter(t=>t.active))+
 section('I miei interessi',form('interests',interestsForm,'Salva interessi'))+
 (window.CCAJoy?.decorations()||'')+
 mu('profilo',{streak});
}

/* ---- impostazioni (account, notifiche, app, privacy, sede) ---- */
const gearIcon=()=>'<svg class="pixel-icon gear-icon" viewBox="0 0 16 16" width="20" height="20" aria-hidden="true" shape-rendering="crispEdges"><path fill="currentColor" d="M7 1h2v2h2V2h2v2h-1v2h2v2h-2v2h1v2h-2v-1h-2v2H7v-2H5v1H3v-2h1V8H2V6h2V4H3V2h2v1h2zM7 6v3h2V6z"/></svg>';
const installSteps=()=>isIos()?'<ol><li>Apri questo sito in <strong>Safari</strong>.</li><li>Tocca <strong>Condividi</strong> (il quadrato con la freccia).</li><li>Scegli <strong>«Aggiungi alla schermata Home»</strong>.</li><li>Apri <strong>CCA SIEMMU</strong> dalla Home: lì potrai anche attivare le notifiche.</li></ol>'
 :'<ol><li>Tocca il menu del browser (<strong>⋮</strong>).</li><li>Scegli <strong>«Installa app»</strong> o <strong>«Aggiungi a schermata Home»</strong>.</li><li>Apri <strong>CCA SIEMMU</strong> dalla Home.</li></ol>';
async function sedeCards(){
 const [codeInfo]=await Promise.all([api('/checkin-code'),loadQr().catch(()=>{})]);
 const qrCard=window.qrcode?card(`${qrSvg(checkinUrl(codeInfo.code),'QR code d’ingresso')}<p>Stampalo e attaccalo all’ingresso: i soci lo inquadrano per registrare ingresso e uscita.</p><p class="muted">Se il codice finisce in mani sbagliate, cambialo: il vecchio QR e i tag NFC smettono subito di funzionare: vanno ristampati e riscritti.</p><div class="row">${link('Stampa il cartello','cartello')}${btn('Cambia il codice','rotate','',{secondary:true})}</div>`):card('<p>Non riesco a creare il QR in questo momento. Riprova tra poco.</p>');
 const nfcCard=card(`<p>Scrivi sul tag NFC un record di tipo <strong>URL</strong> con questo indirizzo (è lo stesso del QR):</p><p><input readonly value="${esc(checkinUrl(codeInfo.code))}" aria-label="Indirizzo da scrivere sul tag NFC"></p><div class="row">${btn('Copia l’indirizzo','copy',checkinUrl(codeInfo.code))}</div><ol class="reading-copy"><li>Apri un’app come «NFC Tools» (gratis, iPhone e Android) → Scrivi → Aggiungi un record → URL.</li><li>Incolla l’indirizzo, scegli «Scrivi» e avvicina il telefono al tag.</li><li>Prova: avvicina il telefono, si apre il sito e registra ingresso o uscita.</li><li>Non bloccare il tag: se cambi il codice qui sopra va riscritto, e un tag bloccato non si può più cambiare.</li></ol>`);
 const siteUrl=location.origin+'/#home';
 const siteCard=window.qrcode?card(`${qrSvg(siteUrl,'QR code del sito')}<p>Per chiunque: apre il sito senza account e mostra calendario, spazio, orari e attività. Chi ha un account può accedere da lì.</p><p class="muted">${esc(siteUrl)}</p><div class="row">${link('Stampa il cartello','cartello/sito')}${btn('Copia il link','copy',siteUrl,{secondary:true})}</div>`):'';
 return section('QR d’ingresso',qrCard)+section('Tag NFC all’ingresso',nfcCard)+(siteCard?section('QR del sito, per tutti',siteCard):'');
}
async function impostazioni(){
 if(!S.me)return needLogin();
 const streak=await getStreaks();
 const {avatarSpecies:species,avatarColor:color}=S.me;
 const picker=`<fieldset><legend>Avatar</legend><div class="animal-picker">${Object.entries(animals).map(([id,a])=>`<label><input type="radio" name="species" value="${id}" ${id===species?'checked':''}>${avatar(id,color)}<span>${a.name}</span></label>`).join('')}</div></fieldset><fieldset><legend>Colore</legend><div class="swatches">${Object.entries(avatarColors).map(([id,[name,hex]])=>`<label><input type="radio" name="color" value="${id}" ${id===color?'checked':''}><span class="swatch" style="background:${hex}"></span><span class="swatch-name">${name}</span></label>`).join('')}</div></fieldset>`;
 const install=isStandalone()?card('<h3>App installata ✓</h3><p class="muted">Stai usando CCA SIEMMU come app.</p>')
  :card(`<h3>Installa l’app</h3><p>Aggiungi CCA SIEMMU alla schermata Home: si apre come un’app e puoi ricevere le notifiche.</p>${installEvent?btn('Installa l’app','install-app'):installSteps()}`);
 return title('Impostazioni','Account, notifiche, app e privacy.')+
 section('Account',grid([
  card(`<h3>${esc(S.me.fullName||S.me.pseudonym)}</h3><p>${esc(S.me.email)}</p><p>${badge(isOrganizer()?'Referente':'Socio')}</p>${btn('Esci','logout','',{secondary:true})}`),
  form('nick','<h3>Nome utente</h3><p class="muted">È il nome che vedono gli altri soci.</p>'+field('pseudonym','Il tuo nome utente','text',`required maxlength="28" value="${esc(S.me.pseudonym)}"`),'Salva nome utente'),
  form('changepw','<h3>Cambia password</h3>'+field('current','Password attuale','password','required autocomplete="current-password"')+field('next','Nuova password (almeno 10 caratteri)','password','required minlength="10" autocomplete="new-password"'),'Cambia password')
 ],'two'))+
 section('Notifiche',await pushCard()+await aulaCard(true))+
 section('App e aspetto',install+card(`<details class="disclosure"><summary>Cambia avatar e colore</summary>${form('avatar',picker,'Salva avatar',{cls:'plain'})}</details>`)+
  card(`<label class="sound-setting"><input type="checkbox" id="sound-toggle" ${pref.get('sound','off')==='on'?'checked':''}> Suoni 8-bit</label><p class="muted">Suoni brevi per pulsanti, finestre e azioni completate. La scelta vale su questo browser.</p>${window.CCAJoy?.settings()||''}`)+
  card(form('achievement-sharing',`<h3>Bacheca pubblica</h3><label><input type="checkbox" name="enabled" ${streak?.sharing?'checked':''}> Voglio mostrare il mio pseudonimo e i prossimi trofei nella bacheca visibile a tutti.</label><p class="muted">Scelta facoltativa. Nessuna email, nome completo, orario o presenza pubblicati.</p>`,'Salva scelta bacheca',{cls:'plain'})))+
 section('Privacy',grid([
  card(`<h3>I miei dati</h3><p>Scarica in un file tutto quello che il sito conserva su di te: profilo, presenze, missioni, premi, notifiche e diario.</p><p><a class="btn" href="/api/me/export" download>Scarica i miei dati</a></p><p class="muted">${link('Leggi l’informativa privacy','privacy')}</p>`),
  form('delete-account',`<h3>Elimina il mio account</h3><p>Cancelliamo nome, email, telefono, password, notifiche, diario, proposte e suggerimenti. Presenze, missioni e premi restano solo come numeri, senza il tuo nome, per le statistiche della sede.</p><p class="muted">Non si può annullare. Per rientrare servirà un nuovo invito.</p>`+field('confirm','Scrivi ELIMINA per confermare','text','required autocomplete="off" pattern="[Ee][Ll][Ii][Mm][Ii][Nn][Aa]"'),'Elimina il mio account')
 ],'two'))+
 (isOrganizer()?`<h2 class="settings-group">Sede (solo referenti)</h2>`+await sedeCards():'');
}
