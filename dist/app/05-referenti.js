/* CCA SIEMMU · 05-referenti.js — parte 5 di 7. I file si caricano in ordine (index.html) e condividono le variabili globali. */
/* ---- pannello referenti ---- */
const tabs=[['panoramica','Oggi'],['soci','Soci'],['attivita','Attività'],['gioco','Gioco'],['sede','Sede']];
// Vecchi indirizzi delle schede: portano alla scheda che ora le contiene.
const tabAlias={presenze:'panoramica',missioni:'gioco',putia:'gioco',assemblea:'attivita',statistiche:'sede'};
const tabBar=active=>(active=tabAlias[active]||active,`<div class="tabs" role="navigation" aria-label="Sezioni del pannello">${tabs.map(([id,name])=>`<a class="btn" href="#referenti/${id==='panoramica'?'':id}" ${id===active?'aria-current="page"':''}>${name}</a>`).join('')}</div>`);
const copyBox=(url)=>`<div class="invite-link"><input readonly value="${esc(url)}" aria-label="Link d’invito"><button type="button" data-action="copy" data-value="${esc(url)}">Copia</button></div>`;
const waNumber=raw=>{let d=String(raw||'').replace(/[^\d+]/g,'');if(d.startsWith('+'))d=d.slice(1);else if(d.startsWith('00'))d=d.slice(2);else if(d.startsWith('3')&&d.length>=9&&d.length<=10)d='39'+d;return /^\d{8,15}$/.test(d)?d:'';};
const waLink=(phone,name,url)=>{const n=waNumber(phone);if(!n)return '';const msg=`Ciao ${name||''}! Ti ho registrato su Cca Siemmu. Scegli la tua password da questo link (vale 7 giorni): ${url}`;return `https://wa.me/${n}?text=${encodeURIComponent(msg)}`;};
const inviteCard=inv=>card(`<h3>Link d’invito pronto</h3><p>${inv.emailSent?'Abbiamo anche inviato l’email.':`Email non inviata${inv.emailNote?` (${esc(inv.emailNote)})`:''}: manda tu questo link alla persona.`} Vale 7 giorni e si usa una volta sola.</p>${copyBox(inv.inviteUrl)}${waLink(inv.phone,inv.who,inv.inviteUrl)?`<p><a class="btn" href="${esc(waLink(inv.phone,inv.who,inv.inviteUrl))}" target="_blank" rel="noopener">Invia su WhatsApp →</a></p>`:'<p class="muted">Nessun numero di telefono valido: copia il link e mandalo tu.</p>'}<p class="muted">${esc(inv.who||'')}</p>${btn('Chiudi','closeInvite','',{secondary:true})}`,'green');
const datetimeLocal=sec=>{const d=new Date(sec*1000),p=n=>String(n).padStart(2,'0');return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;};

async function referenti(tab,extra){
 if(!S.me)return needLogin();
 if(!isOrganizer())return needOrganizer();
 const head=title('Area referenti','Gestione di soci, presenze, missioni e attività.')+tabBar(tab||'panoramica');
 const both=async(...fns)=>(await Promise.all(fns.map(f=>f()))).join('');
 const pages={
  panoramica:()=>both(panPanoramica,panPresenze),
  soci:panSoci,
  attivita:()=>extra?panAttivita(extra):both(()=>panAttivita(extra),panAssemblea),
  gioco:()=>both(panFaccende,panPutia),
  sede:async()=>`<p class="subpage-back"><a class="btn" href="#impostazioni">${gearIcon()} QR d’ingresso e tag NFC: Impostazioni → Sede</a></p>`+await both(panPrimaVisita,panStatistiche)
 };
 const key=tabAlias[tab]||tab||'panoramica';
 const render=pages[key];
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
  <div class="row">${m.status==='pending'?btn('Approva e invia invito','approve-access',m.id):''}${btn(m.hasPassword?'Link reset password':'Nuovo link d’invito','invite',m.id,{secondary:true,extra:`data-phone="${esc(m.phone||'')}"`})}${!self?btn(m.role==='organizer'?'Rendi socio':'Rendi referente','role',m.id,{secondary:true,extra:`data-role="${m.role==='organizer'?'participant':'organizer'}"`}):''}${!self?btn(m.status==='disabled'?'Riattiva':m.status==='pending'?'Rifiuta richiesta':'Disattiva','status',m.id,{secondary:true,extra:`data-status="${m.status==='disabled'?'approved':'disabled'}"`}):''}</div>`,m.status==='disabled'?'muted-card':'').replace('<article ',`<article data-member-search="${search}" `);
 });
 return (S.invite?section('Invito',inviteCard(S.invite)):'')+section(`Soci (${members.length})`,`<label>Cerca tra i soci<input type="search" id="member-search" placeholder="Nome, pseudonimo o email" autocomplete="off"></label><p id="member-search-status" class="muted" role="status" hidden></p>`+grid(cards,'two'))+section('Nuovo socio',newForm);
}
async function panPresenze(){
 const [inside,members,acc]=await Promise.all([api('/inside'),api('/members'),api('/access?from='+(Math.floor(Date.now()/1000)-3*86400)+'&limit=60')]);
 const active=members.members.filter(m=>m.status==='approved');
 const insideIds=new Set(inside.presenti.map(p=>p.id));
 return section('In sede adesso',inside.presenti.length?grid(inside.presenti.map(p=>card(`<h3>${esc(p.name)}</h3><p>Dentro dalle ${fmt(p.since,{hour:'2-digit',minute:'2-digit'})}</p>${btn('Registra uscita','out',p.id)}`)),'three'):card('<p>Nessuno è registrato dentro.</p>'))+
 section('Registra un movimento',form('access',`<label>Socio<select name="memberId" required>${active.map(m=>`<option value="${esc(m.id)}">${esc(m.pseudonym)}${insideIds.has(m.id)?' (dentro)':''}</option>`).join('')}</select></label><p class="muted">Il sistema alterna da solo ingresso e uscita.</p><label>Orario (vuoto = adesso)<input name="at" type="datetime-local" max="${datetimeLocal(Math.floor(Date.now()/1000))}"></label>`,'Registra'))+
 section('Ultimi tre giorni',acc.accessi.length?card(`<ul class="list">${acc.accessi.map(a=>`<li>${esc(a.name)} · ${a.direction==='IN'?'ingresso':'uscita'} · ${dateShort(a.at)}</li>`).join('')}</ul>`):card('<p>Nessun movimento recente.</p>'));
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

function reminderFields(a={}){
 const row=(n,minutes)=>{
  const unit=minutes&&minutes%1440===0?1440:(minutes&&minutes%60===0?60:(minutes?1:60));
  const value=minutes?minutes/unit:'';
  return `<label>Promemoria ${n}<span class="row"><input name="reminder${n}" type="number" min="1" max="20160" inputmode="numeric" value="${value}" placeholder="vuoto = nessuno" aria-label="Promemoria ${n}: quanto tempo prima"><select name="reminder${n}Unit" aria-label="Unità"><option value="1"${unit===1?' selected':''}>minuti</option><option value="60"${unit===60?' selected':''}>ore</option><option value="1440"${unit===1440?' selected':''}>giorni</option></select></span></label>`;
 };
 return `<p class="muted">Un promemoria arriva ai soci con la prenotazione confermata, prima dell’inizio. Se non ne imposti nessuno, resta quello automatico del giorno prima.</p>${row(1,a.reminder1)}${row(2,a.reminder2)}`;
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
  section('Dettagli dell’attività',form('activity-access',textArea('description','Descrizione visibile nel calendario',1600,a.description)+activityAccessFields(a),'Salva dettagli',{id:a.id}))+section('Promemoria',form('activity-reminders',reminderFields(a),'Salva promemoria',{id:a.id}))+walkIn+
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
