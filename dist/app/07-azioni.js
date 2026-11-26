/* CCA SIEMMU · 07-azioni.js — parte 7 di 7. I file si caricano in ordine (index.html) e condividono le variabili globali. */
/* ---- azioni ---- */
function openTrophy(t){
 let box=document.querySelector('#trophy-box');
 if(!box){box=document.createElement('div');box.id='trophy-box';document.body.append(box);}
 const left=Math.max(0,t.target-t.count),pct=Math.round(t.count/t.target*100);
 box.className='celebration';box.setAttribute('role','dialog');box.setAttribute('aria-label',`Trofeo: ${t.name}`);
 box.innerHTML=`<div class="celebration-card trophy-card ${t.earned?'trophy-on':'trophy-off'}">${t.earned?'<div class="confetti" aria-hidden="true">'+Array.from({length:14},(_,i)=>`<i style="left:${(i*41)%100}%;background:${['#B30016','#B30016','#bdd9da','#FFD400','#FFD400'][i%5]};animation-delay:${(i%6)*90}ms"></i>`).join('')+'</div>':''}
  <span class="eyebrow">${esc(t.group.toUpperCase())}</span><div class="trophy-art ${t.earned?'':'locked'}">${trophyArt(t)}</div><h2>${esc(t.name)}</h2>
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
async function shareCardImage({headline,subtitle,trophy,trophyId}){
 await document.fonts.ready;
 const night=document.documentElement.dataset.theme==='night';
 const load=src=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>reject(new Error('Impossibile caricare la grafica della card.'));im.src=src;});
 const species=Object.hasOwn(animals,S.me?.avatarSpecies)?S.me.avatarSpecies:'mucca';
 const tid=Object.hasOwn(window.CCAArt.trofei,trophyId)?trophyId:'cca';
 const [scene,portrait]=await Promise.all([load(`art/paesaggi/borgo-v2-${night?'notte':'giorno'}.webp`),load(trophy?`art/trofei/${tid}.svg`:`art/avatar-v2/${species}.svg`)]);
 const canvas=document.createElement('canvas');canvas.width=canvas.height=1080;
 const ctx=canvas.getContext('2d');if(!ctx)throw new Error('La card non è disponibile in questo browser.');
 ctx.imageSmoothingEnabled=false;
 const bg=night?'#253841':'#FFF1CB',ink=night?'#FFF1CB':'#29251F';
 const block=(c,x,y,w,h)=>{ctx.fillStyle=c;ctx.fillRect(x,y,w,h);};
 const text=(value,x,y,size,max)=>{ctx.fillStyle=ink;ctx.font=`700 ${size}px "Atkinson Hyperlegible Next",sans-serif`;ctx.fillText(value,x,y,max);};
 block(bg,0,0,1080,1080);ctx.strokeStyle=ink;ctx.lineWidth=8;ctx.strokeRect(24,24,1032,1032);
 const crop=scene.height-(scene.width*470/1024);ctx.drawImage(scene,0,Math.max(0,crop/2),scene.width,scene.width*470/1024,28,28,1024,470);
 block(bg,60,60,402,100);ctx.lineWidth=6;ctx.strokeRect(60,60,402,100);text('CCA SIEMMU',88,123,47,360);
 block('#E4D3A4',76,544,288,288);ctx.lineWidth=8;ctx.strokeRect(76,544,288,288);ctx.drawImage(portrait,92,560,256,256);
 text(trophy?'TRAGUARDO RAGGIUNTO':'IL TUO PERCORSO',414,587,28,570);
 text(headline,414,657,46,570);text(subtitle,414,719,29,570);
 block('#423A2C',414,764,570,30);const l=level(S.totals.xp);block('#E6B94D',418,768,Math.max(0,Math.min(562,trophy||l.top?562:562*l.progress/l.range)),22);
 text('E boni siemmu.',78,921,47,900);text('Cammarata + San Giovanni Gemini',78,974,27,930);
 return canvas.toDataURL('image/png');
}

async function shareProgress(trophy){
 if(!S.me)return;
 const l=level(S.totals.xp);
 try{
  const png=await shareCardImage(trophy
   ?{kicker:'TROFEO SBLOCCATO',headline:trophy.name,subtitle:'E boni siemmu!',trophy:true,trophyId:trophy.id}
   :{kicker:'IL MIO PERCORSO',headline:`Livello ${l.number} · ${l.name}`,subtitle:`${l.xp} XP permanenti`});
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
 dialog.querySelector('a')?.addEventListener('click',()=>dialog.close());document.body.append(dialog);dialog.showModal();playSound('open');return dialog;
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
 'joy-all-missions'(){missionSearch='';missionCategory='recommended';missionPage=0;const input=document.querySelector('#mission-search');if(input)input.value='';refreshMissionChoices();},
 async 'joy-greeting'(){await run(()=>api('/my/joy/greeting',{method:'POST',body:{}}),'Un saluto dalla piazza: +1 Tumazzu.');},
 async 'joy-bundle'(_id,el){await window.CCAJoy?.openBundle(el);},
 async 'joy-equip'(id){await run(()=>api('/my/joy/decoration',{method:'PUT',body:{decoration:id}}),'Cornice salvata nel tuo account.');},
 async 'joy-interest'(id){await run(()=>api('/auth/profile',{method:'PATCH',body:{interests:[...new Set([...(S.me.interests||[]),id])]}}),'Interesse salvato: i consigli si adattano a te.');},
 async 'approve-access'(id){
  await run(async()=>{const d=await api('/members/'+encodeURIComponent(id)+'/approve',{method:'POST',body:{}});S.invite=d.invite;emailBanner(d.invite,'il nuovo socio');},null);
 },
 async 'push-confirm'(){let msg='';if(await run(async()=>{const d=await api('/push/confirm',{method:'POST',body:{}});if(d.reward)await refreshTotals();msg=d.reward?'Notifiche verificate! Ti abbiamo regalato 1 Tumazzu.':'Notifiche verificate.';},null))say(msg);},
 async 'push-resend'(){let msg='';if(await run(async()=>{const sub=await (await navigator.serviceWorker.ready).pushManager.getSubscription();if(!sub)throw new Error('Attiva prima le notifiche.');const d=await api('/push/subscribe',{method:'POST',body:sub.toJSON()});msg=d.testSent?'Notifica di prova inviata: toccala per confermare.':'Non siamo riusciti a mandare la prova. Riprova tra poco.';},null))say(msg);},
 async 'aula-si'(){let msg='';if(await run(async()=>{await api('/aula/preferenza',{method:'PUT',body:{enabled:true}});msg='Fatto: ti avvisiamo quando l’aula studio è aperta.';if(pushSupported()&&!iosNotInstalled()&&!await pushOn()){try{msg=await togglePush()+' '+msg;}catch{msg+=' Per riceverla sul telefono attiva le notifiche dal profilo.';}}},null,{rerender:true}))say(msg);},
 async 'sede-ancora'(id){await run(()=>api('/sede/risposta',{method:'POST',body:{id:Number(id),answer:'ancora'}}),'Va bene, ti lasciamo in sede. Ti richiediamo tra qualche ora.',{rerender:true});},
 async 'sede-uscito'(id){await run(()=>api('/sede/risposta',{method:'POST',body:{id:Number(id),answer:'uscito'}}),'Uscita registrata. A presto!',{rerender:true});},
 async 'aula-no'(){await run(()=>api('/aula/preferenza',{method:'PUT',body:{enabled:false}}),'Va bene: l’avviso è disattivato.',{rerender:true});},
 async 'push-toggle'(){let msg='';if(await run(async()=>{msg=await togglePush();},null))say(msg);},
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
  if(ok){playSound('success');window.CCAJoy?.stamp('IN VERIFICA',false);await render();popup.dataset.focusTarget='mission-waiting';}else{el.innerHTML=original;el.classList.remove('completion-tapped');}
 },
 async 'spin-wheel'(){
  main.querySelector('.wheel-stage')?.classList.add('wheel-spinning');
  let prize;
  await run(async()=>{const [d]=await Promise.all([api('/my/daily-wheel',{method:'POST',body:{}}),new Promise(r=>setTimeout(r,matchMedia('(prefers-reduced-motion: reduce)').matches?0:1600))]);prize=d.prize;},null);
  if(prize){
   say(dailyText(prize));
   const wheel=main.querySelector('.daily-wheel');
   if(wheel&&!matchMedia('(prefers-reduced-motion: reduce)').matches)wheel.classList.add('wheel-result');
  }
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
 async 'assembly-notify'(){let msg='';if(await run(async()=>{const d=await api('/assembly/notify',{method:'POST',body:{}});msg=`Avviso inviato a ${d.members} soci (${d.pushed} sul telefono).`;},null,{rerender:false}))say(msg);},
 async 'activity-notify'(id){let msg='';if(await run(async()=>{const d=await api('/activities/manage/'+encodeURIComponent(id)+'/notify',{method:'POST',body:{}});msg=`Avviso inviato a ${d.members} soci (${d.pushed} sul telefono).`;},null,{rerender:false}))say(msg);},
 async 'assembly-clear'(){await run(()=>api('/assembly/meeting',{method:'PUT',body:{clear:true}}),'Convocazione rimossa.');},
 reload:()=>render(),
 trophy(id){const t=(S.trophies||[]).find(x=>x.id===id);if(t)openTrophy(t);},
 theme(){setThemeMode(night?'day':'night');render();},
 tvzoom(id){const z=tvZoom(tvZoom(pref.get('tvzoom',1))+(id==='up'?.05:-.05));pref.set('tvzoom',z.toFixed(2));const el=document.querySelector('.tv-screen');if(el)el.style.setProperty('--tvz',z);},
 async checkin(){const ok=await run(()=>api('/checkin',{method:'POST',body:{direction:'IN'}}),'Check-in registrato.');if(ok){taskFeedback('✓ Sei in sede!', 'Ti va di dare una mano? Scegli una missione: i premi arrivano dopo la verifica.',true);window.CCAJoy?.stamp('INGRESSO REGISTRATO',false);}},
 print:()=>window.print(),
 async copy(id){try{await navigator.clipboard.writeText(id);say('Link copiato.');}catch{window.prompt('Copia il link:',id);}},
 async checkout(){await run(()=>api('/checkout',{method:'POST',body:{}}),'Uscita registrata. A presto!');},
 async 'install-app'(){if(!installEvent){say('Usa il menu del browser: «Installa app» o «Aggiungi a schermata Home».');return;}try{installEvent.prompt();await installEvent.userChoice;}catch{}render();},
 async rotate(){if(!await confirmAction('Il vecchio QR smetterà di funzionare e dovrai ristampare il cartello. Continuare?'))return;await run(()=>api('/checkin-code/rotate',{method:'POST',body:{}}),'Codice cambiato: ristampa il cartello.');},
 async redeem(id){let r;await run(async()=>{r=await api(`/rewards/${encodeURIComponent(id)}/redeem`,{method:'POST',body:{}});},null,{rerender:false})&&(say(`Premio riscattato! ${r.emailSent?'Ti abbiamo scritto una email con le istruzioni.':'Passa in sede per ritirarlo.'}`),await render());},
 async redeemCancel(id){await run(()=>api(`/redemptions/${encodeURIComponent(id)}/cancel`,{method:'POST',body:{}}),'Riscatto annullato: i Tumazzi sono tornati.');},
 async redDeliver(id){await run(()=>api(`/redemptions/${encodeURIComponent(id)}/deliver`,{method:'POST',body:{}}),'Premio consegnato. Il socio trova la conferma nelle notifiche.');},
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
 async logout(){await run(()=>api('/auth/logout',{method:'POST',body:{}}),null,{rerender:false});S.me=null;S.totals={xp:0,cheese:0};S.invite=null;try{await caches.delete('cca-dati');}catch{}location.hash='#home';render(true);},
 async copy(_,el){try{await navigator.clipboard.writeText(el.dataset.value);say('Link copiato.');}catch{const i=el.parentElement.querySelector('input');i.select();say('Seleziona e copia il link.');}},
 closeInvite(){S.invite=null;return render();},
 async invite(id,el){
  let out;
  const ok=await run(async()=>{out=await api(`/members/${encodeURIComponent(id)}/invite`,{method:'POST',body:{}});},null,{rerender:false});
  if(ok){const who=el.closest('article')?.querySelector('h3')?.textContent||'';S.invite={...out.invite,phone:el.dataset.phone,who};await render();window.scrollTo(0,0);emailBanner(out.invite,who);}
 },
 async role(id,el){await run(()=>api(`/members/${encodeURIComponent(id)}`,{method:'PATCH',body:{role:el.dataset.role}}),'Ruolo aggiornato.');},
 async status(id,el){await run(()=>api(`/members/${encodeURIComponent(id)}`,{method:'PATCH',body:{status:el.dataset.status}}),'Stato aggiornato.');},
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
  document.body.append(dialog);dialog.showModal();playSound('open');
 });
}
const destructiveActions={
 'assignment-abandon':'Abbandonare questa missione? Potrai riprenderla in seguito, senza penalità.',
 'team-leave':'Ritirare la tua iscrizione? La squadra potrebbe tornare in formazione.',
 'team-cancel':'Annullare questa impresa per tutta la squadra?',
 'assembly-clear':'Rimuovere la convocazione dell’assemblea?',
 'assembly-notify':'Mandare ora una notifica a tutti i soci?',
 'activity-notify':'Mandare ora una notifica a tutti i soci?',
 cancel:'Annullare la prenotazione? Potresti perdere il posto.',
 redeemCancel:'Annullare il riscatto e restituire i Tumazzi?',
 xCancel:'Annullare questo scambio?', xDecline:'Rifiutare questa richiesta di scambio?',
 offerClose:'Chiudere questa offerta della Banca del tempo?',
 pdecline:'Segnare la proposta come non accolta?',
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
 async 'joy-idea'(f,v){await run(()=>api('/proposals',{method:'POST',body:{title:v('title'),description:''}}),'La tua idea è in piazza: ora il gruppo può votarla.');},
 async 'joy-goal'(f,v){await run(async()=>{const {entry}=await api('/my/learning-journal');await api('/my/learning-journal',{method:'PUT',body:{...entry,goal:v('goal')}});},'Obiettivo salvato nel Diario Youthpass.');},
 async 'team-create'(f,v){await run(()=>api('/team-quests',{method:'POST',body:{title:v('title'),description:v('description'),needed:Number(v('needed')),xp:Number(v('xp')),badge:v('badge')}}),'Impresa pubblicata.');},
 async 'team-complete'(f,v,id){
  if(!await confirmAction('Convalidare il lavoro di tutta la squadra? XP e trofeo saranno assegnati a tutti gli iscritti.'))return;
  let result;const ok=await run(async()=>{result=await api('/team-quests/'+encodeURIComponent(id)+'/complete',{method:'POST',body:{verified:f.elements.verified.checked}});},'Impresa completata: bonus e trofei assegnati alla squadra.');
  if(ok&&result.party){window.CCAJoy?.stamp('FESTA DI PAESE');say('Festa di Paese! 5 Tumazzi extra a ogni componente della squadra.');}
 },
 async 'achievement-sharing'(f){await run(()=>api('/my/achievement-sharing',{method:'PUT',body:{enabled:f.elements.enabled.checked}}),'Scelta bacheca salvata.');},
 async visit(_f,v){
  await run(()=>api('/space/visit',{method:'PUT',body:{address:v('address'),access:v('access'),accessibility:v('accessibility')}}),'Informazioni della sede aggiornate.');
 },
 async assembly(_f,v){
  await run(()=>api('/assembly/meeting',{method:'PUT',body:{startsAt:v('startsAt'),location:v('location'),agenda:v('agenda'),notify:_f.elements.notify?.checked===true}}),_f.elements.notify?.checked?'Convocazione pubblicata e soci avvisati.':'Convocazione pubblicata.');
 },
 async decision(_f,v,id){
  const body={decidedOn:v('decidedOn'),title:v('title'),decision:v('decision'),reason:v('reason'),responsible:v('responsible'),status:v('status')};
  await run(()=>api(id?`/assembly/decisions/${encodeURIComponent(id)}`:'/assembly/decisions',{method:id?'PUT':'POST',body}),id?'Decisione aggiornata.':'Decisione pubblicata.');
 },
 async 'assembly-reminders'(f,v){
  const minutes=n=>{const raw=v('reminder'+n).trim();return raw===''?null:Math.round(Number(raw)*Number(v('reminder'+n+'Unit')));};
  await run(()=>api('/assembly/reminders',{method:'PUT',body:{reminders:[minutes(1),minutes(2)]}}),'Promemoria salvati.');
 },
 async 'activity-reminders'(f,v,id){
  const minutes=n=>{const raw=v('reminder'+n).trim();return raw===''?null:Math.round(Number(raw)*Number(v('reminder'+n+'Unit')));};
  await run(()=>api(`/activities/manage/${encodeURIComponent(id)}`,{method:'PATCH',body:{reminders:[minutes(1),minutes(2)]}}),'Promemoria salvati.');
 },
 async 'activity-access'(f,v,id){
  await run(()=>api(`/activities/manage/${encodeURIComponent(id)}`,{method:'PATCH',body:{accessMode:v('accessMode'),publicEvent:f.elements.publicEvent.checked,description:v('description')}}),'Dettagli dell’attività aggiornati.');
 },
 async walkin(_f,v,id){
  await run(()=>api(`/activities/${encodeURIComponent(id)}/attendance`,{method:'POST',body:{memberId:v('memberId')}}),'Presenza registrata.');
 },
 async learning(_f,v){
  const ok=await run(()=>api('/my/learning-journal',{method:'PUT',body:{goal:v('goal'),evidence:v('evidence'),reflection:v('reflection')}}),'Riflessione salvata nel tuo account.',{rerender:false});
  if(ok){await window.CCAJoy?.sync();window.CCAJoy?.afterRender();}
 },
 async request(f,v){await run(()=>api(`/time-offers/${encodeURIComponent(f.dataset.id)}/request`,{method:'POST',body:{note:v('note')}}),'Richiesta inviata: chi offre l’ora riceve un avviso.');},
 async offer(f,v){await run(()=>api('/time-offers',{method:'POST',body:{title:v('title'),description:v('description')}}),'Offerta pubblicata.');},
 async feedbacksuggest(f,v){const ok=await run(()=>api('/feedback/suggestions',{method:'POST',body:{category:v('category'),message:v('message'),anonymous:f.elements.anonymous.checked}}),'Grazie! Il suggerimento è arrivato ai referenti.',{rerender:false});if(ok)f.reset();},
 async feedbackrate(f,v){const rating=f.elements.rating.value;const ok=await run(()=>api('/feedback/rating',{method:'POST',body:{rating:Number(rating),message:v('message')}}),'Grazie! La tua valutazione è arrivata.',{rerender:false});if(ok)f.reset();},
 async proposal(f,v){await run(()=>api('/proposals',{method:'POST',body:{title:v('title'),description:v('description')}}),'Proposta pubblicata: ora il gruppo può votarla.');},
 async schedule(f,v){if(!v('startsAt')){say('Scegli la data e l’ora dell’evento.');return;}await run(()=>api(`/proposals/${encodeURIComponent(f.dataset.id)}/schedule`,{method:'POST',body:{startsAt:Math.floor(new Date(v('startsAt')).getTime()/1000)}}),'Proposta in calendario (bozza): completala in Referenti → Attività. Chi l’ha proposta è stato avvisato.');},
 async reward(f,v){await run(()=>api('/rewards',{method:'POST',body:{name:v('name'),description:v('description'),cost:Number(v('cost')),quantity:v('quantity')===''?null:Number(v('quantity')),art:v('art')}}),'Premio aggiunto alla vetrina.');},
 async rewardedit(f,v){await run(()=>api(`/rewards/${encodeURIComponent(f.dataset.id)}`,{method:'PATCH',body:{cost:Number(v('cost')),quantity:v('quantity')===''?null:Number(v('quantity'))}}),'Premio aggiornato.');},
 async 'request-access'(f,v){
  const ok=await run(async()=>{const d=await api('/auth/request-access',{method:'POST',body:{fullName:v('fullName'),email:v('email')}});say(d.message);},null,{rerender:false});
  if(ok)f.reset();
 },
 async login(f,v){
  const ok=await run(async()=>{const d=await api('/auth/login',{method:'POST',body:{email:v('email'),password:v('password')}});S.me=d.member;},null,{rerender:false});
  if(ok){await refreshTotals();let next=v('next')==='#banca'?'#banca':'#home';try{if(next==='#home')next=sessionStorage.getItem('cca-after-login')||next;sessionStorage.removeItem('cca-after-login');}catch{}location.hash=next;await render(true);say('Bentornatə!');}
 },
 async setpw(f,v){
  if(v('password')!==v('again')){say('Le due password non coincidono.',true);return;}
  const ok=await run(async()=>{const d=await api('/auth/set-password',{method:'POST',body:{token:v('token'),password:v('password')}});S.me=d.member;},null,{rerender:false});
  if(ok){await refreshTotals();location.hash='#home';await render(true);say('Profilo completo. Benvenutə!');}
 },
 async 'delete-account'(f,v){
  if(!await confirmAction('Eliminare davvero il tuo account? Non si può annullare.'))return;
  if(await run(()=>api('/me/delete',{method:'POST',body:{confirm:v('confirm')}}),null,{rerender:false})){
   S.me=null;S.totals={xp:0,cheese:0};try{await caches.delete('cca-dati');}catch{}
   location.hash='#home';render(true);say('Account eliminato. Grazie di essere passato da qui.');
  }
 },
 async nick(f,v){await run(async()=>{const d=await api('/auth/profile',{method:'PATCH',body:{pseudonym:v('pseudonym')}});S.me=d.member;},'Nome utente aggiornato.');},
 async interests(f,v){const list=[...f.querySelectorAll('input[name=interest]:checked')].map(i=>i.value);await run(async()=>{const d=await api('/auth/profile',{method:'PATCH',body:{interests:list}});S.me=d.member;},'Interessi salvati.');},
 async changepw(f,v){if(await run(()=>api('/auth/change-password',{method:'POST',body:{current:v('current'),next:v('next')}}),'Password cambiata.',{rerender:false}))f.reset();},
 async avatar(f,v){await run(async()=>{const d=await api('/auth/profile',{method:'PATCH',body:{avatarSpecies:v('species'),avatarColor:v('color')}});S.me=d.member;},'Avatar salvato.');},
 async chore(f,v,id){if(await run(()=>api('/chores',{method:'POST',body:{typeId:id,note:v('note')}}),'Richiesta inviata: un referente la verificherà.'))return;},
 async member(f,v){
  let out;
  const ok=await run(async()=>{out=await api('/members',{method:'POST',body:{fullName:v('fullName'),email:v('email'),pseudonym:v('pseudonym')||undefined,phone:v('phone')||undefined,role:v('role')}});},null,{rerender:false});
  if(ok){const who=out.member.fullName||out.member.pseudonym;S.invite={...out.invite,phone:out.member.phone,who};await render();window.scrollTo(0,0);emailBanner(out.invite,who);}
 },
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
const soundNotes = {
 click: [660],
 open: [440, 587],
 success: [523, 659, 784]
};
function playSound(cue){
 if(pref.get('sound','off')!=='on')return;
 const Audio=window.AudioContext||window.webkitAudioContext;
 if(!Audio)return;
 try{
  audio??=new Audio();
  const play=()=>{
   soundNotes[cue].forEach((frequency,index)=>{
    const time=audio.currentTime+index*.055;
    const oscillator=audio.createOscillator();
    const gain=audio.createGain();
    oscillator.type='square';
    oscillator.frequency.setValueAtTime(frequency,time);
    gain.gain.setValueAtTime(.025,time);
    gain.gain.exponentialRampToValueAtTime(.001,time+.05);
    oscillator.connect(gain).connect(audio.destination);
    oscillator.start(time);
    oscillator.stop(time+.055);
   });
  };
  if(audio.state==='running')play();
  else audio.resume().then(play).catch(()=>{});
 }catch{}
}
document.addEventListener('click',event=>{
 const control=event.target.closest('button, a[href], summary');
 if(!control||control.matches(':disabled,[aria-disabled="true"]'))return;
 const opensDetails=control.matches('summary')&&control.parentElement.matches('details:not([open])');
 playSound(opensDetails?'open':'click');
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
 if(event.target.checked)playSound('click');
});

document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'){updateDateIndicators();if(S.me)recordAppDay();}});
window.addEventListener('hashchange',()=>{if(location.hash==='#main')return;if(goingBack)goingBack=false;else if(routeTrail.at(-1)!==location.hash)routeTrail.push(location.hash||'#home');render(true);});
render();

function applyTheme(night){
 document.documentElement.dataset.theme=night?'night':'day';
}
// Tema: 'auto' segue il telefono (anche quando cambia da solo la sera), 'day' e 'night' sono scelte fisse.
const systemDark=window.matchMedia('(prefers-color-scheme: dark)');
function themeMode(){try{return localStorage.getItem('cca-theme')||'auto';}catch{return 'auto';}}
function setThemeMode(mode){try{if(mode==='auto')localStorage.removeItem('cca-theme');else localStorage.setItem('cca-theme',mode);}catch{}night=mode==='auto'?systemDark.matches:mode==='night';applyTheme(night);}
let night=themeMode()==='auto'?systemDark.matches:themeMode()==='night';
applyTheme(night);
systemDark.addEventListener?.('change',()=>{if(themeMode()==='auto'){night=systemDark.matches;applyTheme(night);}});
document.addEventListener('change',e=>{if(e.target.matches?.('input[name=theme-mode]')){setThemeMode(e.target.value);say(e.target.value==='auto'?'Il tema seguirà il telefono.':e.target.value==='night'?'Tema scuro.':'Tema chiaro.');}});
