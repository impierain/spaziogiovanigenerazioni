/* CCA SIEMMU · 02-home-e-paese.js — parte 2 di 7. I file si caricano in ordine (index.html) e condividono le variabili globali. */
/* ---- navigazione ---- */
const navDefs={
 home:['Home','home'],calendario:['Calendario','calendario'],spazio:['Spazio','comunita'],comunita:['Comunità','comunita'],accedi:['Accedi','profilo'],
 missioni:['Missioni','missioni'],presenze:['Statistiche','comunita'],trofei:['Trofei','comunita'],putia:['Putìa','comunita'],banca:['Banca','comunita'],proposte:['Proposte','comunita'],referenti:['Referenti','referenti'],profilo:['Profilo','profilo']
};
function renderChrome(active){
 const ids=!S.me?['home','calendario','spazio','accedi']:isOrganizer()?['home','calendario','missioni','comunita','referenti','profilo']:['home','calendario','missioni','comunita','profilo'];
 const nav=document.querySelector('#nav');
 if(['banca','assemblea','proposte','mercato'].includes(active))active='comunita';
 nav.style.setProperty('--cols',ids.length);
 nav.innerHTML=ids.map(id=>`<a href="#${id}" ${active===id?'aria-current="page"':''}><span class="nav-icon-tile" aria-hidden="true">${pixelIcon(navIcons[navDefs[id][1]],'nav-icon')}</span>${navDefs[id][0]}</a>`).join('');
 const bell=document.querySelector('#notifications');
 bell.hidden=!S.me;
 if(S.me){bell.setAttribute('aria-label',S.unread?`Notifiche, ${S.unread} da leggere`:'Notifiche');bell.innerHTML=bellIcon()+(S.unread?`<span class="unread" aria-hidden="true">${S.unread}</span>`:'');}
 const gear=document.querySelector('#settings-link');
 if(gear){gear.hidden=!S.me;if(!gear.innerHTML.includes('svg'))gear.innerHTML=gearIcon();if(active==='impostazioni')gear.setAttribute('aria-current','page');else gear.removeAttribute('aria-current');}
 const wallet=document.querySelector('#wallet-link');
 wallet.hidden=!S.me;
 if(S.me){wallet.innerHTML=pixelIcon(cheese)+`<span>${S.totals.cheese}</span>`;wallet.setAttribute('aria-label',`${tumazzi(S.totals.cheese)} · apri la Putìa`);wallet.setAttribute('href','#putia');}
}

/* ---- orari, stato live, Mù, paese, albero, festa ---- */
const clockIcon=()=>pixelIcon(shapes.clock);
const getStatus=async()=>{try{return await api('/status');}catch{return null;}};
const getCommunity=async()=>{try{return (await api('/community')).metrics;}catch{return null;}};
function liveLine(st){
 if(!st)return '';
 const n=st.count,label=st.open?(n===undefined?'Aperto ora':`Aperto ora · ${n} ${n===1?'persona dentro':'persone dentro'}`):'Chiuso al momento';
 return `<span class="live ${st.open?'live-on':'live-off'}"><span class="live-dot" aria-hidden="true"></span>${label}</span>`;
}
const openingDetails=st=>`<p><strong>${esc(st?.days||'Da mercoledì a domenica · novembre 2026')} · ${esc(st?.hours||'16:00–20:00')}</strong></p>`;
const weekDays=[['Mon','LU','Lunedì'],['Tue','MA','Martedì'],['Wed','ME','Mercoledì'],['Thu','GI','Giovedì'],['Fri','VE','Venerdì'],['Sat','SA','Sabato'],['Sun','DO','Domenica']];
const openDays=[['Wed','ME','Mercoledì'],['Thu','GI','Giovedì'],['Fri','VE','Venerdì'],['Sat','SA','Sabato'],['Sun','DO','Domenica']];
const openingCard=st=>card(`<span class="eyebrow">ORARI DELLA SEDE</span><div class="stat-figure opening-time" data-opening-time>${clockIcon()}<div><strong class="metric">${esc(st?.hours||'16:00–20:00')}</strong><span class="stat-label">${esc(st?.days||'Da mercoledì a domenica · novembre 2026')}</span></div><small class="opening-now" hidden>In orario di apertura</small></div>
 <div class="week" aria-label="Giorni di apertura">${weekDays.map(([key,short,name])=>`<span class="${openDays.some(([day])=>day===key)?'day-open':'day-closed'}" data-opening-day="${key}" aria-label="${name}${openDays.some(([day])=>day===key)?'':', chiuso'}">${short}</span>`).join('')}</div>
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
function streakMood(){
 const w=window.CCAJoy?.getState()?.weekly;
 return w?.active?['felice',`La Fiamma della Settimana è accesa: ${w.current} ${w.current===1?'settimana':'settimane'} di contributi insieme.`]:null;
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

const villageThresholds=[.25,.5,1];
const villageStage=m=>m.growthStage??villageThresholds.filter(t=>(m.growthValue??m.value)>=Math.ceil((m.growthTarget??m.target)*t)).length;
const villageCount=metrics=>(metrics||[]).reduce((total,m)=>total+villageStage(m),0);
const villageKeys={giovani:'partecipazione',apertura:'aperture',attivita:'attivita',missioni:'cura'};
const villageFocus={giovani:[102,105,160,94],apertura:[116,52,158,132],attivita:[216,89,128,82],missioni:[33,134,314,89]};
function villageScene(metrics){
 const stages=Object.fromEntries((metrics||[]).map(m=>[villageKeys[m.key],Math.min(3,Math.max(0,villageStage(m)))]));
 const scene=theme=>window.CCAQuarter[theme]
  .replace(/<g data-goal="([^"]+)" data-stage="(\d)"/g,(_,key,n)=>`<g${(stages[key]||0)>=Number(n)?'':' style="display:none"'}`)
  .replace(/<g data-exact-goal="([^"]+)" data-exact-stage="(\d)"/g,(_,key,n)=>`<g${(stages[key]||0)===Number(n)?'':' style="display:none"'}`);
 return `<div class="village cozy-village" role="img" aria-label="Quartiere della sede: ${villageCount(metrics)} trasformazioni permanenti su 12"><div class="quarter-layer quarter-layer-day">${scene('giorno')}</div><div class="quarter-layer quarter-layer-night">${scene('notte')}</div></div>`;
}
const villageLabels={giovani:'Persone e luoghi d’incontro',apertura:'Finestre e lampioni',attivita:'Libri, murales e piazza animata',missioni:'Alberi, fiori e orti'};
function villageLegend(metrics){
 return `<ul class="village-legend">${(metrics||[]).map(m=>`<li><strong>${villageLabels[m.key]||esc(m.label)}</strong><span>Stadio ${villageStage(m)}/3 · ${[0,25,50,100][villageStage(m)]}%</span><button type="button" class="secondary" data-village-focus="${esc(m.key)}">Guarda la zona ↗</button></li>`).join('')}</ul><button type="button" class="secondary" data-village-focus="all">Vista d’insieme</button>`;
}
function villageCard(metrics){
 if(!metrics)return '';
 return section('U paisi crisci',card('<div class="cozy-growth-panel">'+villageScene(metrics)+`<p><strong>${villageCount(metrics)} trasformazioni su 12.</strong> Ogni obiettivo fa crescere il borgo al 25%, al 50% e al 100%. Gli elementi sbloccati restano.</p>`+villageLegend(metrics)+link('Guarda i numeri','paese')+'</div>'));
}
async function paese(){
 const metrics=await getCommunity();
 if(!metrics)throw new Error('I numeri del paese non sono disponibili.');
 const n=villageCount(metrics);
 return title('U paisi crisci','Il borgo cresce con ciò che facciamo insieme. Ogni trasformazione sbloccata resta nel paesaggio.')+
  section('Il paese prende forma',card('<div class="cozy-growth-panel">'+villageScene(metrics)+`<p><strong>${n} trasformazioni su 12.</strong> Tre stadi per ciascun obiettivo: 25%, 50% e 100%.</p>`+villageLegend(metrics)+'</div>'))+
  section('Indicatori della comunità',grid(metrics.map(m=>{
   const target=m.growthTarget??m.target;
   const unit=m.key==='apertura'?' ore':'';
   return card(`<span class="eyebrow">OBIETTIVO ${m.target}</span><strong class="metric">${m.value} / ${m.target}</strong><h3>${esc(m.label)}</h3><p>${esc(m.note)}</p><progress value="${Math.min(m.target,m.value)}" max="${m.target}" aria-label="${esc(m.label)}"></progress>${m.key==='apertura'?`<p>Aperture cumulative: <strong>${m.growthValue??0} / ${target} ore</strong></p>`:''}<p>Sblocchi a ${villageThresholds.map(t=>Math.ceil(target*t)+unit).join(' · ')}. Stadio permanente ${villageStage(m)}/3.</p>`);
  }),'two'))+mu('paese',{reached:n,total:12});
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
 window.CCAJoy?.haptic(20);
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
const ARTS=[['star','Stella'],['pin','Spilla'],['book','Libro'],['bag','Borsa'],['shirt','Maglietta'],['heart','Cuore'],['plant','Pianta'],['camera','Foto'],['cup','Bicchiere']];
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
  card('<span class="eyebrow">DECIDERE INSIEME</span><h3>Assemblea e decisioni</h3><p>Il prossimo incontro, l’ordine del giorno e le decisioni prese insieme.</p>'+link('Vai all’assemblea','assemblea')),
  card(`<span class="eyebrow">LE IDEE DEL GRUPPO</span><h3>Proposte e consultazioni</h3><p>${open} proposte aperte. Proponi un’attività o indica le idee che ti interessano.</p>${link('Proponi e vota','proposte')}`)
 ],'two'))+
 section('Scambi e ricompense',`<div class="support-links"><a href="#banca">Banca del tempo: offri o chiedi un’ora →</a><a href="#mercato">Il mercato →</a><a href="#putia">A Putìa · ${tumazzi(S.totals.cheese)} →</a></div>`)+
 villageCard(await getCommunity())+
 section('Il mio percorso',`<div class="support-links"><a href="#trofei">Trofei · ${got}/${tr.trophies.length} →</a><a href="#presenze">Le mie statistiche →</a></div>`)+mu('home');
}
async function trofei(){
 if(!S.me)return needLogin();
 const {trophies}=await api('/trophies');
 const groups=[...new Set(trophies.map(t=>t.group))];
 const got=trophies.filter(t=>t.earned).length;
 return title('Trofei',`${got} su ${trophies.length} conquistati. Arrivano da soli quando i dati verificati raggiungono la soglia, e li trovi qui nella webapp.`)+
 `<div class="row">${link('Le mie statistiche','presenze')}</div>`+await teamTrophies()+(S.trophies=trophies,groups.map(g=>section(g,grid(trophies.filter(t=>t.group===g).map(t=>card(`<div class="${t.earned?'':'locked'}">${trophyArt(t)}</div><h3>${esc(t.name)}</h3><p>${esc(t.desc)}</p>${t.earned?`<p>${badge('Ottenuto')} <span class="muted">${dayLong(t.awardedAt)}</span></p>`:`<p>${badge('Bloccato')}</p><progress value="${t.count}" max="${t.target}" aria-label="Progresso: ${esc(t.name)}"></progress><p class="muted">${t.count} / ${t.target}</p>`}${btn(t.earned?'Apri il trofeo':'Come si sblocca','trophy',t.id,{secondary:true})}${t.earned?btn('Condividi trofeo','share-trophy',t.id):''}`,t.earned?'green':'')),'three'))).join(''));
}
function mercato(){
 if(!S.me)return needLogin();
 return title('Il mercato','Oggetti da usare e riusare, tempo e competenze da mettere in comune.')+section('Scegli dove andare',grid([card(`${art('bag')}<h3>A Putìa</h3><p>Scopri le ricompense e scegli come usare i tuoi Tumazzi.</p>${link('Apri la Putìa','putia')}`),timeBankCard()],'two'));
}
async function putia(){
 if(!S.me)return needLogin();
 const [rw,rd]=await Promise.all([api('/rewards'),api('/redemptions')]);
 const bal=rw.balance;
 const list=rw.rewards.filter(r=>r.active);
 return title('A Putìa','Il negozietto dello spazio: spendi i Tumazzi guadagnati in premi. Si ritirano in sede.')+
 section('Il mio saldo',card(`<div class="stat-figure">${pixelIcon(cheese)}<strong class="metric">${tumazzi(bal)}</strong></div><p class="muted">${rw.earned} guadagnati · ${rw.spent} spesi</p>`))+
 (window.CCAJoy?.bundlePanel()||'')+section('Premi',list.length?grid(list.map(r=>{
  const out=r.stock!==null&&r.stock<=0,poor=bal<r.cost;
  return card(`${art(r.art)}<h3>${esc(r.name)}</h3><p>${esc(r.description)}</p><p><strong>${tumazzi(r.cost)}</strong>${r.stock!==null?` · ${out?'esaurito':`${r.stock} disponibili`}`:''}</p>${out?badge('Esaurito'):poor?`<p class="muted">Ti mancano ${tumazzi(r.cost-bal)}.</p>`:btn('Riscatta','redeem',r.id)}`);
 }),'three'):card('<p>I referenti non hanno ancora messo premi in vetrina.</p>'))+
 section('I miei riscatti',rd.redemptions.length?card(`<ul class="list">${rd.redemptions.map(x=>`<li><strong>${esc(x.rewardName)}</strong> · ${tumazzi(x.cost)} · ${dateShort(x.createdAt)} · ${badge(x.status==='pending'?'Da ritirare':x.status==='delivered'?'Consegnato':'Annullato')}${x.status==='pending'?` ${btn('Annulla','redeemCancel',x.id,{secondary:true})}`:''}</li>`).join('')}</ul>`):card('<p>Non hai ancora riscattato nulla.</p>'))+
 `<p class="muted">I riscatti sono salvati qui e nelle notifiche. Ritira i premi in sede: nessuna email aggiuntiva.</p>`;
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
 const item=p=>card(`<h3>${esc(p.title)}</h3><p>${esc(p.description)}</p><p class="muted">di ${esc(p.memberName)} · ${dateShort(p.createdAt)}</p><p><strong>${p.votes}</strong> ${p.votes===1?'voto':'voti'}</p>${p.status==='open'?`${p.mine?badge('La tua proposta'):btn(p.voted?'Togli il voto':'Vota','vote',p.id,{secondary:p.voted,extra:`data-on="${p.voted?0:1}"`})}${org?form('schedule',field('startsAt','Quando','datetime-local',`required min="${new Date(Date.now()-new Date().getTimezoneOffset()*60000).toISOString().slice(0,16)}"`),'Crea bozza nel calendario',{id:p.id,cls:'inline-form'})+btn('Non accolta','pdecline',p.id,{secondary:true}):''}`:badge(p.status==='scheduled'?'In programmazione':'Non accolta')}`);
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
