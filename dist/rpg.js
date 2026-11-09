const legacyLevels = [
 ['Noviziu',0],['Esploratore',500],['Cumpagnu',1000],['Custode',1500],
 ['Capufila',2000],['Maestru',2750],['Pilastru',3750],['Leggenda di cca',5000]
];
const levelDefaults=legacyLevels.map(([name],i)=>[name,[0,60,150,300,520,800,1150,1600][i]]);
const weeklyCheeseLimit=12;
const missionTypes = {
 visita:'Visita',studio:'Studio',laboratorio:'Laboratorio',evento:'Evento comunitario',
 assemblea:'Assemblea',turno:'Volontariato',scambio:'Scambio di competenze',cura:'Cura dello spazio',proposta:'Proposta pubblicata'
};
const paths = [
 ['studio','Studio e conoscenza','book',['studio']],
 ['creativita','Creatività e cultura','camera',['laboratorio']],
 ['socialita','Socialità e comunità','heart',['visita','evento']],
 ['cittadinanza','Cittadinanza e partecipazione','star',['assemblea','proposta']],
 ['solidarieta','Solidarietà e cura','plant',['turno','scambio','cura']]
];
const communityMetrics = [
 ['giovani','Giovani coinvolti',120,'Obiettivo del primo anno'],
 ['apertura','Ore di apertura',20,'Obiettivo settimanale'],
 ['laboratori','Laboratori realizzati',18,'Obiettivo del primo anno'],
 ['eventi','Eventi pubblici',6,'Obiettivo del primo anno'],
 ['proposte','Proposte diventate attività',0,'Indicatore di partecipazione'],
 ['scambi','Scambi completati',0,'Indicatore di mutualismo']
];
const trionfoGroups=['Esplorazione','Studio e apprendimento','Socialità','Partecipazione civica','Speciali'];
const trionfoDefaults = [
 ['cca','Cca sugnu!',0,'Prima visita verificata in sede.',1,'visita','star'],
 ['casa','Di casa',0,'Cinque giornate di presenza verificate.',5,'giornate','star'],
 ['famiglia','Quasi di famiglia',0,'Quindici giornate di presenza verificate.',15,'giornate','star'],
 ['cervellone','Cervellone',1,'Prima sessione di studio verificata.',1,'studio','book'],
 ['sapientone','Sapientone',1,'Dieci sessioni di studio verificate.',10,'studio','book'],
 ['curiosu','Curiosu',1,'Tre laboratori diversi convalidati.',3,'laboratoriDistinti','camera'],
 ['cumpagnu','Cumpagnu',2,'Prima attività di gruppo verificata.',1,'gruppo','heart'],
 ['manu','Dammi na manu',2,'Primo scambio di competenze verificato.',1,'scambio','heart'],
 ['mutualista','Mutualista',2,'Cinque scambi di competenze verificati.',5,'scambio','heart'],
 ['vuci','A vuci è mia',3,'Prima proposta pubblicata e verificata dal referente.',1,'proposta','star'],
 ['cittadinu','Cittadinu attivu',3,'Prima assemblea con presenza verificata.',1,'assemblea','star'],
 ['ainuzzu','Ainuzzu d’oro',4,'Convalida della missione ambientale Semi dei Sicani.',1,'verde','plant']
];
const trionfoRules={giornate:'Giornate distinte',gruppo:'Attività di gruppo',laboratoriDistinti:'Laboratori distinti',verde:'Semi dei Sicani',...missionTypes};
const legacyPrices={adesivi:15,taccuino:35,shopper:70};
const defaultRpg = {startingXP:0,startingCheese:0,seedVisit:false,legacyBadges:[],levels:levelDefaults, trionfi:[], community:{}, missionEdits:{}, rewardEdits:{}, spends:{}, delivery:{}, history:[], celebrations:[]};
const typeOf = m=>m.type || ({studio:'studio',foto:'laboratorio',verde:'cura',scambio:'scambio'}[m.id]) || ({Studio:'studio',Arte:'laboratorio',Natura:'cura'}[m.interest]) || 'evento';
const today = ()=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Rome',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const repeatable = m=>['studio','scambio','turno'].includes(typeOf(m));
function mayComplete(m,date=today()){
 return !state.verified.some(v=>repeatable(m)?typeOf(v)===typeOf(m)&&(v.date===date||(!v.date&&v.id===m.id&&date===today())):v.id===m.id);
}
function missionCheese(m,date=today()){
 if(!repeatable(m))return m.coins;
 const monday=new Date(date+'T00:00:00Z');
 monday.setUTCDate(monday.getUTCDate()-(monday.getUTCDay()+6)%7);
 const start=monday.toISOString().slice(0,10);
 monday.setUTCDate(monday.getUTCDate()+7);
 const end=monday.toISOString().slice(0,10);
 const used=state.verified.filter(v=>repeatable(v)&&v.date>=start&&v.date<end).reduce((total,v)=>total+v.coins,0);
 return Math.min(m.coins,Math.max(0,weeklyCheeseLimit-used));
}
function progressLevel(){
 const xp=totalXP();
 const index=state.levels.findLastIndex(([,threshold])=>xp>=threshold);
 const [name,threshold]=state.levels[index], next=state.levels[index+1];
 return {number:index+1,name,xp,progress:xp-threshold,range:next?next[1]-threshold:1,left:next?next[1]-xp:0};
}
function trionfi(){
 const done=state.verified;
 const count={
  visita:Number(state.seedVisit)+done.filter(m=>typeOf(m)==='visita').length,
  giornate:new Set(done.map(m=>m.date).filter(Boolean)).size+Number(state.seedVisit),
  gruppo:done.filter(m=>m.group).length,
  laboratoriDistinti:new Set(done.filter(m=>typeOf(m)==='laboratorio').map(m=>m.id)).size,
  verde:Number(done.some(m=>m.id==='verde'))
 };
 for(const kind of Object.keys(missionTypes))if(kind!=='visita')count[kind]=done.filter(m=>typeOf(m)===kind).length;
 return [...trionfoDefaults,...state.trionfi].map(([id,name,group,desc,target,rule,icon])=>({id,name,group,desc,target,icon,count:Math.min(count[rule]||0,target)}));
}
const earnedTrionfi = ()=>trionfi().filter(t=>t.count===t.target);
const cheese='<path fill="#171523" d="M10 1h2v1h2v2h1v10H1V7h2V6h2V5h2V4h2V2h1z"/><path fill="#f4bf57" d="M10 3h2v1h1v2H5V5h2V4h3z"/><path fill="#ffd782" d="M3 8h10v4H3z"/><path fill="#a96a32" d="M5 9h2v2H5z M10 10h2v1h-2z"/>';
function cowMascot(mood,text){
 const eyes={normale:'M6 6h1v2H6z M10 6h1v2h-1z',felice:'M5 7h1V6h2v1H5z M9 7h1V6h2v1H9z',curioso:'M6 6h1v2H6z M10 7h1v1h-1z',festoso:'M5 6h2v1H5z M10 6h2v1h-2z'};
 const sprite='<path fill="#171523" d="M2 4h2V2h3v2h2V2h3v2h2v1h2v4h-3v3h-2v2H5v-2H3V9H0V5h2z"/><path fill="#b9954b" d="M5 3h1v2H5z M10 3h1v2h-1z"/><path fill="#fff3d5" d="M2 6h3V5h6v1h3v2h-2v3h-2v2H6v-2H4V8H2z"/><path fill="#73584e" d="M4 6h3v2H4z"/><path fill="#ee99aa" d="M5 9h6v3H5z"/><path fill="#171523" d="M6 9h1v1H6z M9 9h1v1H9z M7 11h2v1H7z"/>';
 return `<div class="mascot">${pixelIcon(sprite+`<path fill="#171523" d="${eyes[mood]}"/>`)}<div><strong>Mù</strong><p>${esc(text)}</p></div></div>`;
}
function progressTree(){
 return section('Albero delle competenze',`<p class="section-intro">Le tappe raccontano le esperienze convalidate in sede. Prima tappa a 1 esperienza, poi 3 e 5.</p>`+grid(paths.map(([,name,icon,kinds])=>{
  const count=state.verified.filter(m=>kinds.includes(typeOf(m))).length;
  const linked=missions.filter(m=>kinds.includes(typeOf(m)));
  const next=[1,3,5].find(n=>n>count);
  return card(`${art(icon)}<h3>${name}</h3><p><strong>${count}</strong> esperienze verificate · ${next?'Prossima tappa '+next:'Traguardo iniziale raggiunto'}</p><progress value="${next?count:5}" max="${next||5}" aria-label="Progresso in ${name}"></progress><ul class="list">${linked.map(m=>`<li><a href="#missioni/${esc(m.id)}">${esc(m.name)}</a></li>`).join('')}</ul>`);
 })));
}
function wallet(){
 const gains=state.verified.map(m=>`<li><strong>+${m.coins}</strong> · ${esc(m.name)}${m.date?' · '+esc(m.date):''}</li>`).reverse().join('');
 const costs=state.redeemed.map(id=>`<li><strong>−${spend(id)}</strong> · ${esc(state.spends[id]?.name??rewards.find(r=>r.id===id)?.name??id)} · ${state.delivery[id]?'Verificato in demo':'In attesa di verifica'}</li>`).reverse().join('');
 return title('I miei Formaggi','Valuta di prova guadagnata in sede. Puoi spenderla nella Putìa. Acquisto con denaro, trasferimento e conversione in contanti sono esclusi.')+
 section('Registro dei Formaggi',card(`<div class="stat-figure">${pixelIcon(cheese)}<strong class="metric">${coins()} Formaggi</strong></div><h3>Entrate</h3>${state.startingCheese||gains?`<ul class="list">${state.startingCheese?`<li><strong>+${state.startingCheese}</strong> · Saldo iniziale della vecchia demo</li>`:''}${gains}</ul>`:'<p>Nessuna entrata. I Formaggi arrivano con le presenze convalidate.</p>'}<h3>Uscite</h3>${costs?`<ul class="list">${costs}</ul>`:'<p>Nessun riscatto.</p>'}${link('Vai alla Putìa','missioni/ricompense')}`));
}
const spend = id=>state.spends[id]?.cost??legacyPrices[id]??state.extraRewards.find(r=>r.id===id)?.cost??0;
function inventory(){
 return section('U Casciuni',grid([
 card(`<h3>Trofei ottenuti</h3><div class="inventory-items">${earnedTrionfi().map(t=>`<span>${pixelIcon(shapes[t.icon])}${esc(t.name)}</span>`).join('')}</div>${state.legacyBadges.length?'<p class="muted">Dalla prima collezione</p>'+items(state.legacyBadges,''):''}`),
 card(`<h3>Ricompense riscattate</h3>${items(state.redeemed.map(id=>(state.spends[id]?.name??rewards.find(r=>r.id===id)?.name??id)+' · '+(state.delivery[id]?'Verificato in demo':'In attesa di verifica')),'Il tuo scaffale è vuoto.')}${link('Registro Formaggi','formaggi')}`)
 ],'two'));
}
function village(){
 const milestones=communityMetrics.filter(([key,,target])=>target>0&&(state.community[key]||0)>=target).length;
 return title('U paisi crisci','Gli indicatori qui sotto sono dimostrativi. Partono da zero e si aggiornano dal pannello referenti dopo la verifica di prova.')+
 section('Il paese prende forma',card(`<div class="village"><img src="sicani.svg" alt="Paese pixel ispirato a Cammarata e San Giovanni Gemini"><div aria-hidden="true">${['plant','book','heart','star'].slice(0,milestones).map(icon=>pixelIcon(shapes[icon])).join('')}</div></div><p>${milestones} traguardi raggiunti nella demo. Ogni traguardo aggiunge un elemento al borgo.</p>`))+
 section('Indicatori della comunità',grid(communityMetrics.map(([key,name,target,note])=>card(`<span class="eyebrow">DATI DEMO</span><strong class="metric">${state.community[key]||0}${target?' / '+target:''}</strong><h3>${name}</h3><p>${note}</p>${target?`<progress value="${Math.min(target,state.community[key]||0)}" max="${target}" aria-label="${name}"></progress>`:''}`))));
}
function celebrate(text){
 state.celebrations.unshift(text);
 state.celebrations=state.celebrations.slice(0,12);
}
const audit = text=>state.history.unshift(today()+' · '+text);
function rpgAdmin(){
 const number=(name,label,value=0,min=0,max=100000)=>field(name,label,'number',`min="${min}" max="${max}" value="${value}"`);
 const names=trionfoGroups;
 const editMissions=missions.map(m=>`<details class="rpg-edit"><summary>${esc(m.name)}</summary>${form('editMission',field('name','Titolo','text',`maxlength="65" value="${esc(m.name)}"`)+field('desc','Descrizione','text',`maxlength="180" value="${esc(m.desc)}"`)+field('requirement','Requisito','text',`maxlength="180" value="${esc(m.requirement||'Attività svolta e verificata in sede.')}"`)+number('minutes','Durata indicativa in minuti',m.minutes??60,5,720)+number('xp','XP',m.xp,0,500)+number('coins','Formaggi',m.coins,0,200),'Salva missione',`data-id="${esc(m.id)}"`)}</details>`).join('');
 const editRewards=rewards.map(r=>`<details class="rpg-edit"><summary>${esc(r.name)}</summary>${form('editReward',field('name','Titolo','text',`maxlength="65" value="${esc(r.name)}"`)+field('desc','Descrizione','text',`maxlength="180" value="${esc(r.desc||'Ricompensa dimostrativa.')}"`)+number('cost','Costo in Formaggi',r.cost,1,5000)+number('quantity','Quantità demo',r.quantity??1,Number(state.redeemed.includes(r.id)),10000),'Salva ricompensa',`data-id="${esc(r.id)}"`)}</details>`).join('');
 const deliveries=state.redeemed.map(id=>`<div class="row"><span>${esc(state.spends[id]?.name??id)} · ${spend(id)} Formaggi</span>${state.delivery[id]?badge('Verificato in demo'):button('Verifica riscatto demo','deliver',id)}</div>`).join('');
 return section('Configurazione RPG',grid([
 card('<h3>Modifica le missioni</h3><p>Le convalide conservano XP, Formaggi e requisiti assegnati al momento della verifica.</p>'+editMissions),
 card('<h3>A Putìa · prezzi e quantità</h3>'+editRewards),
 card('<h3>Riscatti dimostrativi</h3><p>La verifica registra solo un esito nella prova.</p>'+(deliveries||'<p>Nessun riscatto.</p>')),
 form('levels','<h3>Otto livelli</h3><p>Le soglie devono crescere. Il livello 1 parte da zero.</p>'+state.levels.map(([name,xp],i)=>field('name'+i,'Titolo del livello '+(i+1),'text',`maxlength="35" value="${esc(name)}"`)+(i?number('xp'+i,'Soglia XP',xp,1,1000000):'')).join(''),'Salva livelli'),
 form('trionfo','<h3>Nuovo Trofeo</h3>'+field('name','Titolo','text','maxlength="40"')+field('desc','Requisito leggibile','text','maxlength="140"')+select('group','Categoria',names)+select('rule','Dato verificato',Object.values(trionfoRules))+number('target','Soglia',1,1,1000),'Aggiungi trofeo'),
 form('metrics','<h3>U paisi crisci</h3><p>Registra i numeri verificati nel simulatore. Le ore si riferiscono a una settimana.</p>'+communityMetrics.map(([key,label])=>number(key,label,state.community[key]||0)).join(''),'Salva indicatori demo'),
 card('<h3>Storico RPG</h3>'+items(state.history.map(systemCopy),'Nessuna modifica registrata.'))
 ],'two'));
}
function saveRpg(kind,id,value){
 const integer=(key,min,max)=>{
  const n=Number(value(key));
  return Number.isInteger(n)&&n>=min&&n<=max?n:null;
 };
 if(kind==='levels'){
  const levels=state.levels.map((_,i)=>[value('name'+i),i===0?0:integer('xp'+i,1,1000000)]);
  if(levels.some(([name,xp],i)=>!name||xp===null||(i&&xp<=levels[i-1][1])))return 'Imposta otto titoli e soglie XP crescenti.';
  state.levels=levels;
  audit('Soglie e titoli dei livelli aggiornati.');
 } else if(kind==='trionfo'){
  const group=trionfoGroups.indexOf(value('group'));
  const rule=Object.keys(trionfoRules).find(key=>trionfoRules[key]===value('rule'));
  const target=integer('target',1,1000);
  if(group<0||!rule||target===null)return 'Requisito o soglia non validi.';
  state.trionfi.push([crypto.randomUUID(),value('name'),group,value('desc'),target,rule,'star']);
  audit('Nuovo Trofeo · '+value('name'));
 } else if(kind==='metrics'){
  const entries=communityMetrics.map(([key])=>[key,integer(key,0,100000)]);
  if(entries.some(([,n])=>n===null))return 'Inserisci valori interi non negativi.';
  state.community=Object.fromEntries(entries);
  audit('Indicatori della comunità aggiornati.');
 } else if(kind==='editMission'){
  const mission=missions.find(m=>m.id===id);
  const xp=integer('xp',0,500), coins=integer('coins',0,200), minutes=integer('minutes',5,720);
  if(!mission||[xp,coins,minutes].includes(null))return 'Controlla durata e premi della missione.';
  state.missionEdits[id]={name:value('name'),desc:value('desc'),requirement:value('requirement'),xp,coins,minutes};
  audit('Missione aggiornata · '+value('name'));
 } else if(kind==='editReward'){
  const reward=rewards.find(r=>r.id===id);
  const cost=integer('cost',1,5000), quantity=integer('quantity',Number(state.redeemed.includes(id)),10000);
  if(!reward||[cost,quantity].includes(null))return 'Controlla prezzo e quantità della ricompensa.';
  state.rewardEdits[id]={name:value('name'),desc:value('desc'),cost,quantity};
  audit('Catalogo aggiornato · '+value('name'));
 }
 return 'Configurazione demo salvata.';
}
