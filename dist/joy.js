/* Cca Siemmu · feedback brevi, ricompense reali e preferenze accessibili. */
window.CCAJoy=(()=>{
 let state=null,account='',previous=null,delta=null,source={x:innerWidth/2,y:innerHeight*.55},busy=false,showing=false;
 const statsBefore=new Map();
 const handled=new Set(),names={boost:'XP ×2 sulla prossima attività o missione convalidata (massimo 50 XP extra, entro 7 giorni)',ulivo:'Cornice Ulivo',grano:'Cornice Grano',stelle:'Cornice Stelle dei Sicani'};
 const torch='<path fill="#29251F" d="M7 0h2v3h3v2h1v4h-2v2H5V9H3V5h2V3h2zM5 10h6v3H9v3H7v-3H5z"/><path fill="#BF694C" d="M7 3h2v2h2v4H5V6h2z"/><path fill="#E6B94D" d="M7 5h2v2h1v2H6V7h1z"/><path fill="#FFE79C" d="M7 7h2v2H7z"/><path fill="#9B744B" d="M6 11h4v1H8v3H7v-3H6z"/>';
 const motion=()=>pref.get('effects','on')==='on'&&!matchMedia('(prefers-reduced-motion: reduce)').matches;
 function haptic(ms=15){if(pref.get('haptic','off')==='on'&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&navigator.vibrate)try{navigator.vibrate(ms);}catch{}}
 function particles(big=false){
  if(!motion()||document.body.classList.contains('tv'))return;
  const layer=document.createElement('div');layer.className='joy-particles';layer.setAttribute('aria-hidden','true');
  const colors=['#E6B94D','#78B4C5','#A5B865','#DD9690'];
  layer.innerHTML=Array.from({length:big?32:12},(_,i)=>`<i style="--x:${(i*47)%100}vw;--drift:${(i%2?1:-1)*(20+i%5*12)}px;--delay:${i%5*30}ms;background:${colors[i%4]}"></i>`).join('');
  (document.querySelector('dialog[open]')||document.body).append(layer);setTimeout(()=>layer.remove(),1400);
 }
 function stamp(text='CONFERMATO',large=true){
  haptic(20);if(!motion())return;
  const el=document.createElement('div');el.className='joy-stamp';el.textContent=text;el.setAttribute('aria-hidden','true');(document.querySelector('dialog[open]')||document.body).append(el);setTimeout(()=>el.remove(),1100);
  if(large)particles(true);
 }
 function clink(){
  if(pref.get('sound','off')!=='on')return;
  try{const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;audio??=new Audio();
   const play=()=>[880,1320,1760].forEach((hz,i)=>{const o=audio.createOscillator(),g=audio.createGain(),t=audio.currentTime+i*.025;o.type='sine';o.frequency.setValueAtTime(hz,t);g.gain.setValueAtTime(.018,t);g.gain.exponentialRampToValueAtTime(.0001,t+.17);o.connect(g).connect(audio.destination);o.start(t);o.stop(t+.18);});
   if(audio.state==='running')play();else audio.resume().then(play).catch(()=>{});
  }catch{}
 }
 function coins(amount){
  if(amount<=0)return;clink();haptic();if(!motion())return;
  const wallet=document.querySelector('#wallet-link'),target=wallet?.getBoundingClientRect();if(!target||!target.width)return;
  for(let i=0;i<Math.min(6,amount);i++){
   const el=document.createElement('div');el.className='joy-coin';el.setAttribute('aria-hidden','true');el.innerHTML=pixelIcon(cheese);document.body.append(el);
   const x=Math.max(24,Math.min(innerWidth-24,source.x)),y=Math.max(24,Math.min(innerHeight-24,source.y)),endX=target.x+target.width/2,endY=target.y+target.height/2;
   const animation=el.animate([{transform:`translate(${x-16}px,${y-16}px) scale(.7)`,opacity:0},{transform:`translate(${x+(endX-x)*.4-32+i*8}px,${Math.min(y,endY)-100-i*9}px) scale(1.1)`,opacity:1,offset:.45},{transform:`translate(${endX-16}px,${endY-16}px) scale(.45)`,opacity:1}],{duration:760,delay:i*65,easing:'cubic-bezier(.2,.65,.3,1)'});
   animation.finished.catch(()=>{}).finally(()=>el.remove());
  }
  wallet.classList.add('joy-wallet-glow');setTimeout(()=>wallet.classList.remove('joy-wallet-glow'),1200);
 }
 function count(el,from,to){
  if(!motion()||from===to){el.textContent=to;return;}
  const start=performance.now();function frame(now){if(!el.isConnected)return;const p=Math.min(1,(now-start)/650);el.textContent=Math.round(from+(to-from)*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(frame);}requestAnimationFrame(frame);
 }
 async function sync(){
  if(!S.me){state=null;previous=null;account='';return;}
  if(account!==S.me.id){state=null;previous=null;handled.clear();statsBefore.clear();account=S.me.id;}
  try{
   let d=await api('/my/joy');
   if(d.weekly.pending?.length){const w=await api('/my/joy/weekly',{method:'POST',body:{}});if(w.totals.xp!==d.totals.xp||w.totals.cheese!==d.totals.cheese)d=await api('/my/joy');}
   const before=previous||S.totals;
   delta=previous?{xp:d.totals.xp-before.xp,cheese:d.totals.cheese-before.cheese,from:before}:null;
   previous={...d.totals};S.totals=d.totals;state=d;
  }catch{}
 }
 function rail(){
  document.querySelector('#journey-bar')?.remove();
  const eligible=S.me&&state&&!['tv','cartello','ingresso','imposta-password'].includes(location.hash.slice(1).split('/')[0]);
  document.body.classList.toggle('has-journey',!!eligible);if(!eligible)return;
  const o=state.onboarding,l=level(S.totals.xp),onboarding=o.done<o.total,pct=onboarding?o.done/o.total*100:l.top?100:l.progress/l.range*100,next=o.steps.find(s=>!s[1]);
  const el=document.createElement('a');el.id='journey-bar';el.className='journey-bar';el.href='#'+(onboarding?'profilo': 'trofei');
  el.setAttribute('aria-label',`${S.totals.xp} XP. ${onboarding?`Primi passi: ${o.done} su ${o.total}. Prossimo: ${next[0]}`:`Livello ${l.number}: ${l.name}`}`);
  el.innerHTML=`<span class="journey-level" aria-hidden="true">${onboarding?'★':l.number}</span><span class="journey-numbers"><strong data-joy-xp>${S.totals.xp}</strong> XP <small>${onboarding?`Primi passi ${o.done}/${o.total}`:esc(l.name)}</small></span><span class="journey-track" role="progressbar" aria-label="${onboarding?'Primi passi':'Progresso del livello'}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(pct)}"><i style="width:${pct}%"></i></span><span class="journey-next">${onboarding?(o.done===1?'Profilo creato!':next[0]):l.top?'Gran riserva':`${l.left} XP al prossimo livello`}</span>`;
  document.body.append(el);
 }
 function weeklyPanel(){
  const w=state?.weekly;
  return `<section class="card streak-compact joy-weekly"><h2>Fiamma della Settimana</h2>${w?`${pixelIcon(torch,w.active?'weekly-torch is-lit':'weekly-torch is-unlit')}<p><strong>${w.current} ${w.current===1?'settimana':'settimane'} insieme</strong> · record ${w.best}</p><p>${w.active?'La torcia del Castello è accesa!':'Basta un’attività o un contributo verificato questa settimana.'}</p><small>Un contributo a settimana mantiene la serie. Bonus: 5–25 XP e 1–5 Tumazzi, una sola volta a settimana. Se salti, conservi punti e record.</small>`:'<p>La fiamma tornerà visibile al prossimo aggiornamento.</p>'}</section>`;
 }
 function homePanel(){
  if(!state)return '';
  const cards=[];
  if(state.micro.proposal)cards.push(card(`<span class="eyebrow">DAI VOCE A UN’IDEA</span><h3>${esc(state.micro.proposal.title)}</h3><p>Un voto per indicare che ti interessa. 2 XP sul primo voto della settimana.</p>${btn('Mi interessa','vote',state.micro.proposal.id,{extra:'data-on="1"'})}`));
  if(state.micro.activity)cards.push(card(`<span class="eyebrow">SCEGLI UN APPUNTAMENTO</span><h3>${esc(state.micro.activity.name)}</h3><p>Chiedi un posto. Un referente confermerà la prenotazione. 2 XP sulla prima richiesta della settimana.</p>${btn('Chiedi un posto','reserve',state.micro.activity.id)}`));
  if(!(S.me.interests||[]).length)cards.push(card(`<span class="eyebrow">UN PASSO DA 10 SECONDI</span><h3>Cosa ti piacerebbe fare?</h3><p>Scegli un interesse per ricevere consigli più adatti. Puoi cambiarlo nel Profilo.</p><div class="joy-interest-picks">${PATHS.slice(0,3).map(([id,name])=>btn(esc(name),'joy-interest',id)).join('')}</div>`));
  if(cards.length<3)cards.push(card(`<span class="eyebrow">UN’IDEA IN UNA RIGA</span><h3>Cosa vorresti fare qui?</h3>${form('joy-idea',field('title','La tua idea','text','required maxlength="100" placeholder="Un cineforum sui film d’animazione"'),'Proponi al gruppo',{cls:'plain'})}`));
  if(cards.length<3)cards.push(card(`<span class="eyebrow">IL TUO PROSSIMO PASSO</span><h3>Lascia un piccolo obiettivo</h3><p>Una cosa che ti piacerebbe imparare o condividere.</p>${form('joy-goal',field('goal','Vorrei…','text','required maxlength="150" placeholder="Imparare a montare il nostro reel"'),'Salva nel diario',{cls:'plain'})}`));
  return section('Hai 30 secondi?',`<p class="section-intro">Piccoli passi utili alla comunità. Le ricompense dei voti, degli interessi e delle prenotazioni sono limitate a una per tipo a settimana.</p>${grid(cards.slice(0,3),cards.length===2?'two':'three')}`)+(state.greeting?section('Saluto in Piazza',card(`<h3>Un saluto e un piccolo benvenuto</h3><p>Il borgo ti lascia 1 Tumazzu, una volta al giorno. Saltare un giorno non toglie nulla.</p>${btn('Saluta e ricevi 1 Tumazzu','joy-greeting')}`)): '');
 }
 function bundlePanel(){
  if(!state)return '';
  const b=state.bundle;
  return section('Fagotto del Mercante',card(`<div class="joy-merchant">${pixelIcon(scaledArt('artigiana','avatar-v2',128),'joy-merchant-sprite')}<div><span class="eyebrow">UNA VOLTA A SETTIMANA</span><h3>Un piccolo tesoro sotto il banco</h3><p>3 Tumazzi · 5 XP garantiti e una sorpresa.</p></div></div>${b?`<p>Il fagotto di questa settimana contiene: <strong>${esc(names[b.payload.prize])}</strong>.</p>${b.payload.prize==='boost'?'<p class="muted">Il bonus si applica automaticamente, non si somma al moltiplicatore della ruota e scade dopo 7 giorni.</p>':'<a class="btn" href="#profilo">Indossa la cornice</a>'}<p class="muted">Un nuovo fagotto sarà disponibile da lunedì.</p>`:S.totals.cheese>=3?btn('Apri il fagotto · 3 Tumazzi','joy-bundle'): `<p>Ti mancano ${tumazzi(3-S.totals.cheese)}.</p><a class="btn" href="#missioni">Scegli come dare una mano</a>`}<details class="disclosure"><summary>Cosa puoi trovare</summary><p>Quattro esiti, ognuno con probabilità del 25%: bonus XP sulla prossima attività verificata, Cornice Ulivo, Cornice Grano o Cornice Stelle dei Sicani. I 5 XP arrivano sempre. Una cornice può ricapitare: resta nella collezione. Si usano solo Tumazzi guadagnati nello spazio. I premi fisici restano nella vetrina, con la disponibilità indicata.</p></details>`,'joy-bundle'));
 }
 function decorations(){
  if(!state)return '';
  return section('Il baule del borgo',card(`<p>Le cornici del Fagotto restano tue e si salvano nel tuo account.</p>${state.decorations.length?`<div class="joy-decoration-picks">${btn('Senza cornice','joy-equip','',{secondary:true})}${state.decorations.map(id=>btn(esc(names[id]),'joy-equip',id,{secondary:id!==state.equipped})).join('')}</div>`:'<h3>La tua prima cornice ti aspetta</h3><a class="btn" href="#putia">Scopri il Fagotto del Mercante</a>'}<details class="disclosure"><summary>I tuoi primi passi · ${state.onboarding.done}/${state.onboarding.total}</summary><ul>${state.onboarding.steps.map(([name,done,route])=>`<li>${done?'✓ ':''}${done?esc(name):`<a href="#${route}">${esc(name)}</a>`}</li>`).join('')}</ul><p>“Profilo creato” è il primo passo reale su otto: 12,5%. Gli XP mostrano sempre il valore effettivo.</p></details>`));
 }
 const settings=()=>`<label><input type="checkbox" id="joy-effects" ${pref.get('effects','on')==='on'?'checked':''}> Effetti di ricompensa e numeri animati</label><label><input type="checkbox" id="joy-haptic" ${pref.get('haptic','off')==='on'?'checked':''}> Micro-vibrazioni, se supportate dal telefono</label><p class="muted">Le animazioni ridotte del dispositivo hanno sempre la precedenza. Le vibrazioni non sono disponibili su tutti i browser.</p>`;
 function showGreeting(){
  if(!state?.greeting||location.hash!=='#home'||document.querySelector('dialog[open],.celebration:not([hidden])'))return;
  const key='greeting-dismiss-'+account;if(pref.get(key,'')===state.today)return;
  if(window.ccaClaimPopup&&!window.ccaClaimPopup('greeting'))return;
  pref.set(key,state.today);
  const d=document.createElement('dialog');d.className='joy-greeting';d.setAttribute('aria-labelledby','joy-greeting-title');
  d.innerHTML=`<h2 id="joy-greeting-title">Saluto in Piazza</h2>${cowMascot('felice','Oggi c’è movimento in Piazza: tieni un Tumazzu per cominciare!')}<p>1 Tumazzu al giorno, con un saluto. Nessuna penalità se passi domani o la prossima settimana.</p><div class="joy-dialog-actions"><button data-greet>Saluta e ricevi 1 Tumazzu</button><button class="secondary" data-later>Magari dopo</button></div>`;
  d.querySelector('[data-later]').onclick=()=>d.close();d.querySelector('[data-greet]').onclick=async e=>{e.target.disabled=true;await actions['joy-greeting']();d.close();};
  d.addEventListener('close',()=>{d.remove();main.focus({preventScroll:true});},{once:true});document.body.append(d);d.showModal();
 }
 function rollStats(){
  main.querySelectorAll('.metric,.stat-figure>strong').forEach((el,i)=>{
   if(el.closest('.profile-stat .row,.profile-overview .row'))return;
   const match=el.textContent.trim().match(/^(\d+(?:[.,]\d+)?)(\s*(?:XP|Tumazz[ui]|ore)?$)/);if(!match)return;
   const value=Number(match[1].replace(',','.')),key=location.hash+':'+i,old=statsBefore.get(key);statsBefore.set(key,value);
   if(old===undefined||old===value||!motion())return;
   const decimals=match[1].includes(',')||match[1].includes('.')?1:0,unit=match[2],start=performance.now();
   function frame(now){if(!el.isConnected)return;const p=Math.min(1,(now-start)/600);el.textContent=(old+(value-old)*(1-Math.pow(1-p,3))).toLocaleString('it-IT',{minimumFractionDigits:decimals,maximumFractionDigits:decimals})+unit;if(p<1)requestAnimationFrame(frame);}requestAnimationFrame(frame);
  });
 }
 function emptyStates(){
  if(document.body.classList.contains('tv'))return;
  const page=location.hash.slice(1).split('/')[0]||'home';
  const routes={putia:['Scegli una missione','missioni'],trofei:['Inizia da una missione','missioni'],banca:['Offri una tua competenza','banca/offri'],calendario:[S.me?'Proponi un’attività':'Scopri lo spazio',S.me?'proposte':'spazio'],proposte:['Scrivi la tua prima idea','home'],profilo:['Scegli il prossimo passo','missioni']};
  for(const p of main.querySelectorAll('p')){
   if(!/^(Non ci sono|Non hai ancora|Nessun[ao]? |I trofei delle|I referenti non hanno|La prossima convocazione|Prendi in carico|Nessuna convalida|I referenti pubblicheranno)/i.test(p.textContent.trim())||/non disponibili|non disponibile/i.test(p.textContent))continue;
   const box=p.closest('.card')||p.parentElement;if(box.querySelector('a[href],button,input,textarea'))continue;
   const [label,route]=routes[page]||['Esplora le attività','calendario'];const a=document.createElement('a');a.className='btn secondary joy-empty-action';a.href='#'+route;a.textContent=label;box.append(a);
  }
 }
 async function afterRender(){
  rail();emptyStates();rollStats();document.documentElement.dataset.joyEffects=motion()?'on':'off';
  if(!state||document.body.classList.contains('tv'))return;
  document.querySelectorAll('.profile-stat .avatar,.profile-overview .avatar').forEach(el=>{if(state.equipped)el.classList.add('joy-frame',`joy-frame-${state.equipped}`);});
  if(state.weekly.active){const pin=document.querySelector('.world-pin[data-world-place="castello"]');if(pin){pin.classList.add('joy-torch-on');pin.setAttribute('aria-label',pin.getAttribute('aria-label')+' Torcia settimanale accesa.');}}
  const change=delta;delta=null;
  if(change){document.querySelectorAll('#wallet-link>span,.profile-wallet>strong').forEach(el=>count(el,change.from.cheese,S.totals.cheese));const xp=document.querySelector('[data-joy-xp]');if(xp)count(xp,change.from.xp,S.totals.xp);if(change.cheese>0)coins(change.cheese);}
  const events=state.events.filter(e=>!handled.has(e.id));
  if(events.length&&!showing){
   showing=true;events.forEach(e=>handled.add(e.id));
   const major=events.find(e=>['receipt','team_party','critical','bundle_use','weekly'].includes(e.kind));
   if(major){const party=events.some(e=>e.kind==='team_party'),receipt=events.find(e=>e.kind==='receipt');
    if(!document.querySelector('.celebration:not([hidden])'))stamp(party?'FESTA DI PAESE':receipt?.payload.stamp||'TRAGUARDO RAGGIUNTO');
    const lines=events.filter(e=>e.kind!=='greeting').map(e=>`${e.payload.title||'Ricompensa'}${e.xp?' · +'+e.xp+' XP':''}${e.cheese?' · +'+tumazzi(e.cheese):''}${e.kind==='receipt'?` · ${e.payload.xp} XP e ${tumazzi(e.payload.cheese)}`:''}`);
    banner('ok',lines.slice(0,4).join(' · '));
   }else haptic();
   if(!change)coins(events.reduce((n,e)=>n+e.cheese+(e.kind==='receipt'?e.payload.cheese||0:0),0));
   showing=false;
  }
  if(state.events.length)try{await api('/my/joy/seen',{method:'POST',body:{ids:state.events.map(e=>e.id)}});}catch{}
  if(change?.xp>0&&motion())document.querySelectorAll('progress,.journey-track i').forEach(el=>el.animate(Array.from({length:30},(_,i)=>{const t=i/29;return {scale:`${.9+.1*(1-Math.exp(-7*t)*Math.cos(14*t))} 1`};}),{duration:600,easing:'linear'}));
  showGreeting();
 }
 async function openBundle(el){
  if(busy)return;busy=true;
  const stage=document.createElement('dialog');stage.className='joy-bundle-dialog';stage.setAttribute('aria-labelledby','joy-bundle-title');stage.innerHTML=`<h2 id="joy-bundle-title">Il mercante cerca sotto il banco…</h2><div class="joy-rummage">${pixelIcon(scaledArt('artigiana','avatar-v2',128))}${pixelIcon(shapes.bag)}</div><p>Il fagotto viene salvato nel tuo account.</p>`;stage.addEventListener('close',()=>{stage.remove();main.focus({preventScroll:true});},{once:true});document.body.append(stage);stage.showModal();
  try{const [r]=await Promise.all([api('/my/joy/bundle',{method:'POST',body:{}}),new Promise(r=>setTimeout(r,motion()?2000:0))]);stage.querySelector('h2').textContent='Ecco il tuo fagotto!';stage.querySelector('.joy-rummage').classList.add('is-revealed');stage.querySelector('.joy-rummage').innerHTML=r.bundle.payload.prize==='boost'?pixelIcon(shapes.star):`<div class="joy-prize-portrait joy-frame joy-frame-${r.bundle.payload.prize}">${avatar()}</div>`;stage.querySelector('p').textContent=`5 XP e ${names[r.bundle.payload.prize]}.`;
   const close=document.createElement('button');close.textContent='Metti nel baule';close.onclick=()=>stage.close();stage.append(close);close.focus();particles();haptic();playSound('success');await render();
  }catch(e){stage.close();say(e.message,true);}finally{busy=false;}
 }
 document.addEventListener('pointerdown',e=>{if(document.body.classList.contains('tv'))return;const target=e.target.closest('button,a[href],summary,.card:has(a[href],button),.world-place-card');if(!target||target.matches(':disabled,[aria-disabled=true]')||e.target.closest('input,textarea,select'))return;source={x:e.clientX,y:e.clientY};target.classList.add('joy-pressed');const release=()=>{target.classList.remove('joy-pressed');window.removeEventListener('pointerup',release);window.removeEventListener('pointercancel',release);};window.addEventListener('pointerup',release,{once:true});window.addEventListener('pointercancel',release,{once:true});});
 document.addEventListener('change',e=>{if(!['joy-effects','joy-haptic'].includes(e.target.id))return;pref.set(e.target.id==='joy-effects'?'effects':'haptic',e.target.checked?'on':'off');document.documentElement.dataset.joyEffects=motion()?'on':'off';if(e.target.id==='joy-haptic'&&e.target.checked)haptic();});
 return {sync,afterRender,homePanel,weeklyPanel,bundlePanel,decorations,settings,stamp,particles,haptic,openBundle,getState:()=>state};
})();
