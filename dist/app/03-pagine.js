/* CCA SIEMMU · 03-pagine.js — parte 3 di 7. I file si caricano in ordine (index.html) e condividono le variabili globali. */
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

const worldPlaces=[
 ['casa','Casa','Profilo personale','profilo',9.5,61],
 ['sede','Sede della gilda','Orari e sede','spazio',51,57],
 ['municipio','Municipio','Comunità','comunita',78,40],
 ['mercato','Mercato','Putìa e banca del tempo','mercato',38,69],
 ['castello','Castello','Trofei e statistiche','trofei',23,30],
 ['albero','Albero della piazza','Missioni','missioni',44,66],
 ['riserva','Riserva naturale','Diario Youthpass','profilo/diario',80,85],
 ['antenne','Antenne del monte','Assemblea e decisioni','assemblea',59,10],
 ['piazza','Piazza e 4 Canti','Proposte e voti','proposte',76,47]
];
const worldPlaceInfo={
 casa:{intro:'Il tuo personaggio e il tuo percorso nello spazio.',features:['personalizzare avatar, colore e interessi.','consultare livello, XP e preferenze.','gestire il tuo account.'],actions:[['Apri il profilo','profilo']]},
 sede:{intro:'Tutto quello che serve per organizzare la tua visita.',features:['consultare gli orari di apertura.','trovare sede, contatti e modalità di accesso.','informarti sull’accessibilità dello spazio.'],actions:[['Orari e sede','spazio'],['Calendario','calendario']]},
 municipio:{intro:'Partecipa alla vita della comunità di Cca Siemmu.',features:['scoprire i traguardi condivisi.','accedere a scambi, assemblee e proposte.','guardare come cresce il paese.'],actions:[['Apri la Comunità','comunita']]},
 mercato:{intro:'Metti in circolo oggetti, tempo e competenze.',features:['usare i Tumazzi per richiedere ricompense alla Putìa.','offrire una competenza o chiedere una mano nella Banca del tempo.'],actions:[['Apri la Putìa','putia'],['Banca del tempo','banca']]},
 castello:{intro:'Ripercorri i tuoi progressi e scopri i prossimi traguardi.',features:['consultare i trofei ottenuti e quelli da sbloccare.','guardare visite, ore in sede, XP e competenze.'],actions:[['I miei trofei','trofei'],['Le mie statistiche','presenze']]},
 albero:{intro:'Scegli una missione e dai una mano allo spazio.',features:['esplorare le missioni dei diversi percorsi.','prendere in carico una missione e chiedere la verifica.','partecipare alle imprese di squadra.'],actions:[['Scegli una missione','missioni']]},
 riserva:{intro:'Dai un nome a ciò che stai imparando.',features:['annotare esperienze e riflessioni nel Diario Youthpass.','riconoscere e descrivere le competenze che stai sviluppando.'],actions:[['Apri il Diario Youthpass','profilo/diario']]},
 antenne:{intro:'Preparati all’assemblea e segui le decisioni del gruppo.',features:['leggere convocazione e ordine del giorno.','consultare le decisioni condivise.'],actions:[['Assemblea e decisioni','assemblea']]},
 piazza:{intro:'Porta un’idea e partecipa alle scelte.',features:['pubblicare una proposta per lo spazio.','leggere le idee delle altre persone.','votare le proposte aperte.'],actions:[['Proposte e voti','proposte']]}
};
function worldLinks(explain=false){return worldPlaces.map(([id,name,desc,route],i)=>`<a class="world-place-card" href="#${route}" data-world-place="${id}" ${explain?'data-world-preview aria-haspopup="dialog"':''}><span class="world-place-number">${i+1}</span><img src="art/edifici/${id}.svg" width="64" height="64" alt=""><span><strong>${name}</strong><small>${desc}</small></span></a>`).join('');}
function worldMap(){
 const last=worldPlaces.find(p=>p[0]===pref.get('world-place-'+(S.me?.id||'guest'),''));
 const key=Object.hasOwn(animals,S.me?.avatarSpecies)?S.me.avatarSpecies:'mucca';
 return section('Esplora il paese',`<div class="world-section"><p class="section-intro">Scegli un luogo per scoprire cosa puoi fare.</p><div class="world-map"><img class="scenery-day" src="art/paesaggi/borgo-v2-giorno.webp" loading="lazy" decoding="async" width="1536" height="1024" alt="Mappa di Cca Siemmu, tra borghi, boschi e pareti calcaree"><img class="scenery-night" src="art/paesaggi/borgo-v2-notte.webp" loading="lazy" decoding="async" width="1536" height="1024" alt="La mappa del paese di notte">${worldPlaces.map(([id,name,desc,route,x,y],i)=>`<button type="button" class="world-pin" data-world-place="${id}" style="left:${x}%;top:${y}%" aria-haspopup="dialog" aria-label="${name}: ${desc}. Scopri cosa puoi fare"><span>${i+1}</span><strong>${name}<small>${desc}</small></strong></button>`).join('')}<img class="world-player" style="left:${last?last[4]:49}%;top:${last?last[5]+6:68}%" src="art/micro/${key}.svg" width="48" height="48" alt="Il tuo minisprite sulla mappa"></div><div class="world-mobile-route">${worldLinks(true)}</div><div class="world-map-tools"><label class="world-walk-option"><input type="checkbox" data-world-walk ${pref.get('world-walk','false')==='true'?'checked':''}> Anima il minisprite</label><button type="button" class="secondary" data-world-menu>Menu rapido</button><a class="text-link" href="#paese">U paisi crisci →</a></div></div>`);
}
function openWorldPlace(id){
 const place=worldPlaces.find(p=>p[0]===id),info=worldPlaceInfo[id];if(!place||!info)return;
 let dialog=document.getElementById('world-place-info');
 if(!dialog){dialog=document.createElement('dialog');dialog.id='world-place-info';document.body.append(dialog);}
 dialog.setAttribute('aria-labelledby','world-place-title');dialog.setAttribute('aria-describedby','world-place-intro');
 dialog.innerHTML=`<div class="world-info-heading"><img src="art/edifici/${id}.svg" width="64" height="64" alt=""><div><p class="eyebrow">LUOGO ${worldPlaces.indexOf(place)+1} · ${esc(place[2])}</p><h2 id="world-place-title">${esc(place[1])}</h2></div><form method="dialog"><button class="secondary" aria-label="Chiudi informazioni sul luogo">×</button></form></div><p id="world-place-intro">${esc(info.intro)}</p><h3>Qui puoi…</h3><ul class="world-info-features">${info.features.map(text=>`<li>${esc(text)}</li>`).join('')}</ul><div class="world-info-actions">${info.actions.map(([label,route],i)=>`<a class="btn ${i?'secondary':''}" href="#${route}" data-world-enter="${id}">${esc(label)} →</a>`).join('')}</div>`;
 dialog.showModal();
}
let worldTravelTimer,worldStepTimer;
function stopWorldTravel(){clearTimeout(worldTravelTimer);clearInterval(worldStepTimer);}
function openWorldMenu(){
 let dialog=document.getElementById('world-menu');if(!dialog){dialog=document.createElement('dialog');dialog.id='world-menu';document.body.append(dialog);}
 dialog.innerHTML=`<div class="world-menu-head"><h2>Menu rapido</h2><form method="dialog"><button aria-label="Chiudi il menu rapido" class="secondary">×</button></form></div><div class="world-menu-grid">${worldLinks()}</div><div class="world-extra"><a href="#calendario">Calendario</a><a href="#banca">Banca del tempo</a><a href="#presenze">Statistiche personali</a>${isOrganizer()?'<a href="#referenti">Area referenti</a>':''}${!S.me?'<a href="#accedi">Accedi o richiedi le credenziali</a>':''}</div>`;
 dialog.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>dialog.close()));
 dialog.showModal();
}
document.addEventListener('click',event=>{
 if(event.target.closest('[data-world-menu]')){openWorldMenu();return;}
 const place=event.target.closest('.world-pin[data-world-place], [data-world-preview]');
 if(place&&!event.ctrlKey&&!event.metaKey&&!event.shiftKey&&!event.altKey){event.preventDefault();openWorldPlace(place.dataset.worldPlace);return;}
 const enter=event.target.closest('[data-world-enter]');
 if(enter&&!event.ctrlKey&&!event.metaKey&&!event.shiftKey&&!event.altKey){
  const destination=worldPlaces.find(p=>p[0]===enter.dataset.worldEnter);
  if(destination){
   document.getElementById('world-place-info')?.close();stopWorldTravel();
   pref.set('world-place-'+(S.me?.id||'guest'),destination[0]);
   const map=document.querySelector('.world-map'),player=map?.querySelector('.world-player');
   if(player&&map.offsetParent!==null&&pref.get('world-walk','false')==='true'&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
    event.preventDefault();player.classList.add('is-walking');
    player.style.left=destination[4]+'%';player.style.top=(destination[5]+6)+'%';
    const species=Object.hasOwn(animals,S.me?.avatarSpecies)?S.me.avatarSpecies:'mucca';let frame=0;
    worldStepTimer=setInterval(()=>{player.src=`art/micro/${species}-passo-${1+(frame++%2)}.svg`;},150);
    worldTravelTimer=setTimeout(()=>{clearInterval(worldStepTimer);player.src=`art/micro/${species}.svg`;location.hash=enter.hash;},650);
   }
  }
 }
 const focus=event.target.closest('[data-village-focus]');if(!focus)return;
 const group=focus.closest('.cozy-growth-panel');if(!group)return;
 group.querySelectorAll('[data-village-focus]').forEach(b=>b.setAttribute('aria-pressed',String(b===focus)));
 group.querySelectorAll('.cozy-village svg').forEach(svg=>{svg.setAttribute('viewBox',(villageFocus[focus.dataset.villageFocus]||[0,0,384,240]).join(' '));svg.setAttribute('preserveAspectRatio','xMidYMid slice');});
 group.querySelector('.cozy-village').scrollIntoView({block:'center',behavior:'instant'});
});
document.addEventListener('change',event=>{if(event.target.matches('[data-world-walk]'))pref.set('world-walk',String(event.target.checked));});
window.addEventListener('hashchange',()=>{stopWorldTravel();document.getElementById('world-menu')?.close();document.getElementById('world-place-info')?.close();});

function homeIntro(){
 const artLabel='Cammarata e San Giovanni Gemini ai piedi di Monte Cammarata, in pixel art';
 return `<header class="hero home-hero ${S.me?'member-hero':''}"><div class="hero-copy"><span class="eyebrow">CAMMARATA + SAN GIOVANNI GEMINI</span><h1>CCA SIEMMU</h1>
 <p class="hero-motto">E boni siemmu</p><p class="hero-local">Uno spazio da vivere insieme: incontri, idee e piccoli gesti che fanno crescere la comunità.</p>
 <div class="row">${link('Apri il calendario','calendario')} ${link(S.me?'Vai alle missioni':'Accedi o chiedi un invito',S.me?'missioni':'accedi')}</div>
 ${S.me?'':'<p class="entry-hint">Il calendario si apre senza account.</p>'}</div>
 <div class="home-scenery"><img class="scenery-day" src="art/paesaggi/borgo-v2-giorno.webp" loading="lazy" decoding="async" alt="${artLabel}"><img class="scenery-night" src="art/paesaggi/borgo-v2-notte.webp" loading="lazy" decoding="async" alt="${artLabel} di notte"></div></header>
 ${!S.me?`<section class="space-signpost"><div><span class="eyebrow">LO SPAZIO GIOVANI</span><h2>Un posto da usare, uno spazio da fare insieme</h2>
 <p>Aula studio, laboratori tra pari e idee da portare in assemblea. Per chi ha dai 14 ai 30 anni a Cammarata e San Giovanni Gemini.</p></div>${link('Vieni per la prima volta?','spazio')}</section>`:''}`;
}
const wheelArt=`<div class="wheel-stage" aria-hidden="true"><svg class="wheel-disc" viewBox="0 0 64 64" shape-rendering="crispEdges">${window.CCAArt.interfaccia.ruota}</svg><span class="wheel-pointer"><img src="art/interfaccia/indicatore-ruota.svg" width="32" height="32" alt=""></span></div>`;
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
  return section(staff?'Gestisci imprese di squadra':'Imprese di squadra',`<p>Si attivano quando tutti i posti sono occupati da iscrizioni attive. Prima della convalida, un ritiro riapre la squadra. Premi solo dopo il lavoro reale. Alla convalida c’è il 20% di probabilità di una Festa di Paese: 5 Tumazzi extra a ogni componente, con un solo sorteggio per tutta la squadra.</p>${create}${cards.length?grid(cards,'two'):(staff?'':card('<p>Non ci sono imprese aperte.</p>'))}`);
 }catch{return card('<p>Le imprese non sono disponibili al momento. Riprova tra poco.</p>');}
}
async function teamTrophies(){
 const {badges}=await api('/team-quests');
 return section('Trofei di squadra',badges.length?grid(badges.map(b=>card(`${art('star')}<h3>${esc(b.name)}</h3><p>Conquistato con la tua squadra, dopo la verifica del referente.</p><p class="muted">${dayLong(b.awarded_at)}</p>`)),'two'):card('<p>I trofei delle imprese completate compariranno qui.</p>'));
}
let loggedAppDay='';
async function recordAppDay(){
 if(!S.me||document.visibilityState==='hidden')return;
 const standalone=!!(navigator.standalone||matchMedia('(display-mode: standalone)').matches);
 if(standalone){pref.set('app-installed','1');S.appInstalled=true;}
 const key=standalone+S.me.id+'-'+new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Rome'}).format(new Date());
 if(loggedAppDay===key)return;
 try{await api('/my/app-visit',{method:'POST',body:{standalone}});loggedAppDay=key;}catch{}
}
function getStreaks(){return api('/my/streaks').catch(()=>null);}
function streakPanel(d){
 if(window.CCAJoy)return window.CCAJoy.weeklyPanel();
 return `<section class="card streak-compact" aria-labelledby="streak-title"><h2 id="streak-title">Giorni consecutivi</h2>${d?`<div class="streak-strip">
  <div>${pixelIcon(navIcons.calendario)}<strong>${d.app.current}</strong><span>App<small>Record ${d.app.best}</small></span></div>
  <div>${pixelIcon(navIcons.home)}<strong>${d.sede.current}</strong><span>In sede<small>Record ${d.sede.best}</small></span></div></div>
  <details><summary>Come contano i giorni</summary><p>Conta una visita all’app al giorno. Per la sede contano gli ingressi da lunedì a venerdì. Se salti un giorno, XP e record restano tuoi.</p></details>`:'<p class="muted">Contatori temporaneamente non disponibili.</p>'}</section>`;
}
function presenceCta(pres,mission=false){
 if(!pres)return card('<p>Presenza non disponibile. Riprova.</p>'+btn('Riprova','reload'));
 if(pres.inside)return `<section class="presence-focus is-inside"><div><strong>✓ Sei in sede</strong><span class="muted"> dalle ${fmt(pres.since,{hour:'2-digit',minute:'2-digit'})}</span></div>${mission?'':`<a class="btn presence-main" href="#missioni">Scegli una missione →</a>`}${btn('Registra uscita','checkout','',{secondary:true})}</section>`;
 return `<section class="presence-focus"><h2>Sei in sede?</h2>${btn('Registra il tuo ingresso','checkin')}<p class="muted">Solo quando sei fisicamente in sede.</p></section>`;
}
async function achievementBoard(){
 try{
  const {latest}=await api('/achievement-board');
  return section('Bacheca dei traguardi',card(latest?`<span class="eyebrow">L’ULTIMO TRAGUARDO CONDIVISO</span><h3>${esc(latest.pseudonym)}</h3><p>Ha conquistato <strong>${esc(latest.trophy)}</strong>. Festeggiamo insieme!</p>`:'<h3>Il prossimo traguardo può essere il tuo</h3><p>Nessun traguardo condiviso per ora. La partecipazione alla bacheca è facoltativa.</p>')+'<p class="muted">Bacheca pubblica, senza classifica. Solo pseudonimo e trofeo, dopo il consenso nel Profilo. Nessun orario o elenco delle presenze.</p>');
 }catch{return '';}
}
async function home(){
 const [st,community,details,acts]=await Promise.all([getStatus(),api('/community').catch(()=>null),visitInfo(),api('/activities').catch(()=>({activities:[]}))]);
 return homeIntro()+worldMap()+monthlyGoal(community?.monthlyGoal)+await achievementBoard()+firstVisit(st,details,nextActivity(acts.activities))+
  section('Quando siamo aperti',openingCard(st))+
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
  extra=`<section class="admin-compact"><h2>Da gestire (per i referenti)</h2><div class="admin-chips"><a href="#referenti/presenze">${pixelIcon(navIcons.comunita)}<strong>${inside.presenti.length}</strong><span>In sede →</span></a><a href="#referenti/missioni">${pixelIcon(navIcons.missioni)}<strong>${waiting}</strong><span>Da verificare →</span></a></div></section>`;
 }
 return homeIntro()+presenceCta(pres)+await pushNudge()+await aulaCard(false)+(window.CCAJoy?.homePanel()||'')+
 `<div class="grid stats home-stats" aria-label="Personaggio, Tumazzi, orari e partecipazione settimanale">${card(profileChip()+`<a class="profile-wallet" href="#putia" aria-label="${tumazzi(S.totals.cheese)} · apri A Putìa">${pixelIcon(cheese)}<span>Tumazzi</span><strong>${S.totals.cheese}</strong></a>`,'profile-stat')}
 ${openingCard(st)}${streakPanel(streak)}</div>`+
 worldMap()+monthlyGoal(community?.monthlyGoal)+homeShortcuts()+extra+await dailyWheelPanel()+await achievementBoard()+
 (progress.firstVisitCompleted?'':firstVisit(st,details,nextActivity(acts.activities)))+
 section('Scambia tempo e competenze',timeBankCard())+
 section('Prossime attività',upcoming.length?grid(upcoming.map(a=>card(`<h3>${esc(a.name)}</h3><p>${activityDate(a.starts_at)}</p><p>${a.access_mode==='open'?'Accesso libero':a.available>0?`${a.available} posti liberi`:'Posti esauriti'}</p>${booked.has(a.id)?badge(statusText[booked.get(a.id)]):''}${activityDescription(a)}`)),'three')+link('Tutto il calendario','calendario'):card('<p>Non ci sono attività in calendario.</p>'))+mu('home',{streak});
}

async function calendario(){
 const [acts,mine,{meeting}]=await Promise.all([api('/activities'),S.me?api('/my/bookings'):{bookings:[]},api('/calendar/assembly')]);
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
 const assemblyCard=meeting?.startsAt>Date.now()/1000?section('Prossima assemblea',card(`<h3>Assemblea dei giovani</h3><p><strong>${dateLong(meeting.startsAt)}</strong></p><p>${esc(meeting.location)}</p><p class="meeting-notes">${esc(meeting.agenda)}</p>${S.me?link('Assemblea e decisioni','assemblea'):''}`)):section('Assemblea',card('<p>La prossima convocazione sarà pubblicata qui.</p>'));
 return title('Calendario','Per le attività ad accesso libero puoi presentarti direttamente. Dove serve una prenotazione, un referente conferma il posto.')+assemblyCard+section('Prossime attività',body)+
  (S.me?section('Come funziona',card('<p>Quando prenoti, il posto resta riservato finché un referente decide. Alla fine il referente verifica di persona la tua presenza e ti assegna XP e Tumazzi.</p>')):'')+mu('calendario');
}

async function spazio(){
 const [st,details,acts]=await Promise.all([getStatus(),visitInfo(),api('/activities').catch(()=>({activities:[]}))]);
 return title('Lo spazio','Un luogo gratuito pensato e gestito dai giovani di Cammarata e San Giovanni Gemini.')+
 firstVisit(st,details,nextActivity(acts.activities))+
 section('Chi può partecipare',grid([
  card('<h3>A chi si rivolge</h3><p>Il progetto si rivolge principalmente a chi ha tra 14 e 30 anni e vive nei due paesi. Puoi venire per studiare, incontrare altre persone o proporre un’attività.</p>'+link(S.me?'Apri il calendario':'Prima volta?',S.me?'calendario':'accedi')),
  card(`<h3>Come entri</h3><p>All’ingresso e all’uscita puoi usare il QR. Puoi anche avvicinare il telefono al tag NFC. Un referente può aiutarti se hai dimenticato di registrarti.</p>${link(S.me?'Le mie presenze':'Accedi',S.me?'presenze':'accedi')}`,'green')
 ],'space-visit'))+
 section('Come si partecipa',card('<h3>Dall’idea all’assemblea</h3><p>Puoi proporre un laboratorio, dare una mano con le missioni o portare una questione all’assemblea in sede. Ascolta chi usa lo spazio, rispetta le differenze e lascia in ordine i materiali comuni.</p>'))+
 section('Il paese',card(`<p>Guarda come cresce il borgo con le attività dello spazio.</p>${link('U paisi crisci','paese')}`))+
 section('Il progetto',card('<p>Cca Siemmu è promosso da Spazio Giovani Generazioni ed è finanziato dal Corpo europeo di solidarietà. Contatti: <a href="mailto:spaziogiovanigenerazioni@gmail.com">spaziogiovanigenerazioni@gmail.com</a>.</p>'));
}

/* ---- valutazione e suggerimenti ---- */
const feedbackLink='<a href="#suggerimenti">Suggerisci una modifica</a>';
const stars=name=>`<fieldset class="stars"><legend>Quanto ti piace Cca Siemmu?</legend>${[1,2,3,4,5].map(n=>`<label><input type="radio" name="${name}" value="${n}" required> ${n}<span class="sr-only"> su 5</span></label>`).join('')}</fieldset>`;
async function suggerimenti(){
 if(!S.me)return needLogin();
 return title('Suggerisci una modifica','Hai notato qualcosa che non va o ti viene un’idea? Scrivilo qui: arriva nella bacheca dei referenti.')+
 section('Il tuo suggerimento',form('feedbacksuggest',
  `<label>Di che cosa si tratta?<select name="category" required><option value="">Scegli…</option><option value="modifica">Una modifica</option><option value="problema">Un problema</option><option value="idea">Un’idea</option><option value="critica">Una critica</option></select></label>`+
  textArea('message','Scrivi qui (da 10 a 400 caratteri)',400,'',true)+
  `<label class="check"><input type="checkbox" name="anonymous"> Invia in modo anonimo (i referenti non vedono il tuo pseudonimo)</label>`,'Invia ai referenti'))+
 section('Valuta la webapp',form('feedbackrate',stars('rating')+textArea('message','Vuoi aggiungere qualcosa? (facoltativo)',400),'Invia la valutazione')+card('<p class="muted">La valutazione è anonima per i referenti: vedono voto e commento, non chi li ha scritti.</p>'));
}
let feedbackChecked='';
async function feedbackPrompt(){
 if(!S.me||feedbackChecked===S.me.id||location.hash.startsWith('#suggerimenti'))return;
 feedbackChecked=S.me.id;
 let due=false;
 try{due=(await api('/feedback/prompt')).due;}catch{return;}
 if(!due||document.querySelector('#feedback-box')||!claimPopup('feedback'))return;
 const box=document.createElement('div');
 box.id='feedback-box';box.className='feedback-prompt';box.setAttribute('role','dialog');box.setAttribute('aria-label','Valutazione di Cca Siemmu');
 box.innerHTML=`<form><h2>Come ti trovi con Cca Siemmu?</h2><p class="muted">Ci vuole un minuto e ci aiuta a migliorare. La risposta è anonima per i referenti.</p>${stars('rating')}${textArea('message','Un commento, un suggerimento, una critica (facoltativo)',400)}<div class="feedback-actions"><button>Invia</button><button type="button" class="secondary" data-later>Più tardi</button></div></form>`;
 document.body.append(box);
 box.querySelector('[data-later]').addEventListener('click',async()=>{box.remove();try{await api('/feedback/snooze',{method:'POST',body:{}});}catch{}});
 box.querySelector('form').addEventListener('submit',async event=>{
  event.preventDefault();
  const f=event.target;
  const ok=await run(()=>api('/feedback/rating',{method:'POST',body:{rating:Number(f.elements.rating.value),message:f.elements.message.value.trim()}}),'Grazie! La tua valutazione è arrivata.',{rerender:false});
  if(ok)box.remove();
 });
}

const privacyLink='<a href="#privacy">Privacy e cookie</a>';
function privacy(){
 const mail='spaziogiovanigenerazioni@gmail.com',contact=`<a href="mailto:${mail}">${mail}</a>`;
 return title('Privacy e cookie','Come Cca Siemmu usa i dati di chi visita il sito o partecipa alle attività.')+
 section('Chi gestisce il sito',card(`<p class="reading-copy">Il titolare del trattamento è APS/ASD Spazio Giovani Generazioni. Per domande o richieste sui tuoi dati scrivi a ${contact}.</p>`))+
 section('Quali dati usiamo e perché',grid([
  card('<h3>Accesso e partecipazione</h3><p class="reading-copy">Puoi consultare le pagine pubbliche e il calendario senza account. Per attivare il profilo e gestire prenotazioni, presenze, missioni e ricompense, trattiamo i dati necessari al servizio che richiedi. Usiamo nome, email, pseudonimo, ruolo e stato dell’account, oltre ai registri delle attività che svolgi. Telefono, interessi e tessera sono facoltativi. Le password sono conservate come impronte crittografiche.</p>'),
  card('<h3>Comunità e Youthpass</h3><p class="reading-copy">Se usi la Banca del tempo o pubblichi una proposta, gli altri soci vedono lo pseudonimo e ciò che pubblichi. Le note di uno scambio sono visibili alle persone coinvolte. Il diario Youthpass è accessibile dal tuo account e resta fuori dal pannello referenti. Puoi svuotarlo e salvare per cancellare il testo.</p>'),
  card('<h3>Sicurezza</h3><p class="reading-copy">Per proteggere gli account e limitare tentativi di accesso abusivi trattiamo le informazioni tecniche necessarie, compresi l’email e l’indirizzo IP usati nei tentativi di accesso falliti e nei tentativi di cambio password. I tentativi contano per 15 minuti; quelli più vecchi non vengono più considerati e si eliminano alla successiva operazione di accesso. Cloudflare, che ospita il sito, tratta l’indirizzo IP anche per erogare e proteggere il servizio.</p>'),
  card('<h3>Valutazioni e suggerimenti</h3><p class="reading-copy">Dopo alcuni giorni d’uso ti chiediamo, in modo facoltativo, una valutazione da 1 a 5 con un commento. I referenti vedono voto e commento senza il tuo nome. Nella pagina «Suggerisci una modifica» puoi scrivere un suggerimento, una critica o un’idea: arriva nella bacheca dei referenti con il tuo pseudonimo, a meno che tu scelga l’invio anonimo. Anche i suggerimenti anonimi restano collegati al tuo account nel database, solo per limitarne l’abuso; i referenti non lo vedono. Non scrivere dati personali tuoi o di altri nel testo. Conserviamo valutazioni e suggerimenti per un anno, poi vengono cancellati; le copie in bacheca si eliminano dopo 90 giorni.</p>'),
  card('<h3>Notifiche sul telefono</h3><p class="reading-copy">Se le attivi dal profilo, salviamo l’identificativo tecnico del tuo dispositivo fornito dal browser (indirizzo del servizio push e chiavi di cifratura) per inviarti i promemoria, per esempio «Sei ancora in sede?». Ti mandiamo una notifica di prova e registriamo se l’hai confermata. I referenti vedono il tuo pseudonimo, se hai attivato le notifiche e se la prova è riuscita, ma non l’identificativo del dispositivo. Passano dal servizio push del tuo browser (Google, Apple o Mozilla). Puoi disattivarle in qualsiasi momento dal profilo e il dato viene cancellato. Chi non le attiva riceve gli stessi promemoria via email.</p>'),
  card('<h3>Condivisione facoltativa</h3><p class="reading-copy">La card dei progressi o dei trofei si crea sul tuo dispositivo. Contiene il traguardo scelto o il tuo livello e gli XP, con l’avatar selezionato. Salviamo personaggio e colore nel tuo profilo. È priva di nome, email, diario e storico delle presenze. Sei tu a scegliere dove inviarla. Quando usi un’app esterna si applica l’informativa di quell’app.</p>')
 ],'two'))+
 section('Su quale base usiamo i dati',card('<p class="reading-copy">Per gestire l’account e le funzioni di partecipazione usiamo i dati necessari a fornire il servizio richiesto. Per proteggere il sito e gli account, il trattamento si basa sul legittimo interesse alla sicurezza del servizio. Quando la legge impone di conservare o comunicare dati, il trattamento si basa su quell’obbligo.</p>'))+
 section('Chi può accedere ai dati',card('<p class="reading-copy">I referenti autorizzati usano i dati di iscrizione e partecipazione per organizzare le attività. Il sito è ospitato su Cloudflare. Quando è configurato l’invio di email di servizio, i dati necessari alla consegna vengono trasmessi al fornitore di invio, Brevo o Resend. Le statistiche pubbliche sono aggregate.</p><p class="reading-copy">Per informazioni sui fornitori, sui luoghi in cui trattano i dati e sulle garanzie applicate, contatta l’associazione.</p>'))+
 section('Per quanto tempo',card(`<p class="reading-copy">La sessione dura fino a 30 giorni. Le notifiche in-app oltre 90 giorni vengono eliminate quando apri l’elenco. I dati di account e di attività sono conservati secondo il tempo necessario a gestire la partecipazione e gli eventuali obblighi di rendicontazione. Per conoscere i tempi applicati a un dato specifico o chiedere la cancellazione, scrivi a ${contact}.</p>`))+
 section('Imprese e ruota del giorno',card('<p class="reading-copy">Per le missioni personali conserviamo presa in carico, eventuale abbandono, dichiarazione di completamento e decisione del referente. L’invio del completamento richiede un check-in attivo. Conserviamo le iscrizioni alle imprese, la convalida del referente, i bonus XP e i trofei assegnati. Solo i referenti vedono l’elenco degli iscritti; gli altri soci vedono il numero di posti occupati. La ruota è facoltativa: salviamo un esito per account e giorno, il bonus e la sua eventuale scadenza. Nessun pagamento o strumento di profilazione; l’esito non dipende dai dati personali.</p>'))+
 section('Serie e bacheca pubblica',card('<p class="reading-copy">Con account attivo salviamo una sola apertura della webapp per giorno, per mostrarti la tua serie personale senza attribuire premi. Le serie in sede derivano dagli ingressi registrati. La bacheca pubblica è disattivata inizialmente: puoi attivarla nel Profilo per condividere pseudonimo e nuovi trofei legati ad attività reali. Puoi ritirare la scelta in ogni momento; il tuo traguardo non sarà più esposto. Non pubblichiamo email, orari, storico delle presenze o dati del diario.</p>'))+
 section('Cookie e dati nel browser',card('<p class="reading-copy">Dopo l’accesso, il cookie tecnico <code>__Host-cca_session</code> mantiene la sessione. Scade entro 30 giorni e viene rimosso all’uscita dall’account. Il browser conserva anche le tue preferenze locali, come tema e suono, e può ricordare temporaneamente la pagina a cui tornare dopo l’accesso. Puoi eliminare questi dati dalle impostazioni del browser. Il sito non usa strumenti di analisi o profilazione pubblicitaria.</p>'))+
 section('I tuoi diritti',card(`<p class="reading-copy">Da <a href="#impostazioni">Impostazioni → Privacy</a> puoi scaricare in autonomia tutti i tuoi dati in un file ed eliminare il tuo account: nome, email, telefono, password, notifiche, diario, proposte e suggerimenti vengono cancellati; presenze, missioni e premi restano solo come numeri, senza il tuo nome. Gli errori tecnici del sito (messaggio, pagina e tipo di browser) finiscono nei log di Cloudflare per poterli correggere.</p><p class="reading-copy">Puoi anche scrivere a ${contact} per chiedere accesso, rettifica, cancellazione o limitazione del trattamento e, quando applicabili, portabilità e opposizione. Se sei minorenne, puoi farti aiutare da un adulto di fiducia. Puoi presentare reclamo al <a href="https://www.garanteprivacy.it/">Garante per la protezione dei dati personali</a>.</p>`));
}
