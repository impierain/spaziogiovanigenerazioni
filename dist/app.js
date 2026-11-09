const pages = [['home','Home'],['calendario','Calendario'],['missioni','Missioni'],['comunita','Comunità'],['profilo','Profilo']];
const navIcons = {
 home:'<path d="M1 7h2V5h2V3h2V1h2v2h2v2h2v2h2v3h-2v5H3v-5H1z"/><path fill="#fe4400" d="M3 8h2V6h2V4h2v2h2v2h2v1H3z"/><path fill="#fff3d5" d="M5 10h6v3H9v-2H7v2H5z"/>',
 calendario:'<path d="M4 1h2v2h4V1h2v2h3v12H1V3h3z"/><path fill="#fe4400" d="M3 5h10v2H3z"/><path fill="#fff3d5" d="M3 8h10v5H3z"/><path fill="#6f440f" d="M4 9h2v1H4z M7 9h2v1H7z M10 9h2v1h-2z M4 11h2v1H4z M7 11h2v1H7z"/>',
 missioni:'<path d="M4 1h8v2h3v5h-2v2h-3v2h3v3H3v-3h3v-2H3V8H1V3h3z"/><path fill="#b9954b" d="M5 3h6v5h-1v1H6V8H5z M7 10h2v2H7z M5 13h6v1H5z"/><path fill="#fff3d5" d="M7 4h2v2H7z M3 5h1v2H3z M12 5h1v2h-1z"/>',
 comunita:'<path d="M2 2h4v1h1v4H6v1h4V7H9V3h1V2h4v1h1v4h-1v2h1v1h1v4H0v-4h1V9h1V7H1V3h1z"/><path fill="#8feafc" d="M3 4h2v2H3z M2 10h4v2H2z"/><path fill="#caff4d" d="M11 4h2v2h-2z M10 10h4v2h-4z"/>',
 profilo:'<path d="M2 1h12v1h1v12h-1v1H2v-1H1V2h1z"/><path fill="#fff3d5" d="M3 3h10v10H3z"/><path d="M6 4h4v4H6z M5 9h6v1h1v2H4v-2h1z"/><path fill="#b9954b" d="M7 5h2v2H7z"/><path fill="#fe4400" d="M6 10h4v1H6z"/>'
};
const interests = ['Studio','Arte','Natura','Comunità'];
const days = ['Lunedì','Martedì','Mercoledì','Giovedì','Venerdì'];
const events = [
  {id:'foto',name:'Cartoline dai due paesi',type:'Eventi',date:'Ven 13 nov · 16:00–18:00',day:'Venerdì',interest:'Arte',free:6,max:12,art:'camera',desc:'Laboratorio in sede: componiamo cartoline a partire da scatti di Cammarata e San Giovanni Gemini.'},
  {id:'studio',name:'Aula studio condivisa',type:'Aula studio',date:'Mar 17 nov · 16:00–18:00',day:'Martedì',interest:'Studio',free:3,max:8,art:'book',desc:'Una postazione per studiare in sede. Il progetto prevede anche momenti di supporto tra pari e metodo di studio.'},
  {id:'verde',name:'Semi dei Sicani',type:'Eventi',date:'Gio 19 nov · 16:30–18:00',day:'Giovedì',interest:'Natura',free:8,max:12,art:'plant',desc:'Prepariamo insieme le cassette per il verde della sede.'},
  {id:'studio2',name:'Aula studio pomeridiana',type:'Aula studio',date:'Gio 19 nov · 17:00–19:00',day:'Giovedì',interest:'Studio',free:0,max:8,art:'book',desc:'Turno di studio in sede. Tutte le postazioni sono occupate.'}
];
const missions = [
  {id:'studio',name:'Un tavolo tra due paesi',art:'book',interest:'Studio',day:'Martedì',xp:20,coins:4,group:false,desc:'Partecipa a una sessione di studio in sede.'},
  {id:'foto',name:'Cartoline dai due paesi',art:'camera',interest:'Arte',day:'Venerdì',xp:35,coins:7,group:false,desc:'Partecipa al laboratorio di fotografia e condividi uno scatto.'},
  {id:'verde',name:'Semi dei Sicani',art:'plant',interest:'Natura',day:'Giovedì',xp:30,coins:6,group:true,desc:'Contribuisci a preparare le cassette per il verde della sede.'},
  {id:'scambio',name:'Un’ora cca',art:'heart',interest:'Comunità',day:'Giovedì',xp:25,coins:5,group:true,desc:'Realizza uno scambio di competenze concordato con i referenti.'},
  {id:'prima-visita',name:'Prima volta cca',type:'visita',art:'star',interest:'Comunità',day:'Lunedì',xp:15,coins:3,group:false,minutes:15,desc:'Passa in sede e chiedi al referente di registrare la tua prima visita.'},
  {id:'serata',name:'Una serata in paese',type:'evento',art:'heart',interest:'Comunità',day:'Venerdì',xp:30,coins:5,group:true,minutes:90,desc:'Partecipa a un evento della comunità e fai verificare la presenza.'},
  {id:'assemblea',name:'A vuci di cca',type:'assemblea',art:'star',interest:'Comunità',day:'Mercoledì',xp:35,coins:6,group:true,minutes:60,desc:'Partecipa a un’assemblea in sede e chiedi la convalida della presenza.'},
  {id:'turno',name:'Una manu in sede',type:'turno',art:'heart',interest:'Comunità',day:'Giovedì',xp:40,coins:8,group:true,minutes:60,desc:'Svolgi il turno di accoglienza che hai concordato con il referente.'},
  {id:'proposta',name:'Un’idea pigghia forma',type:'proposta',art:'book',interest:'Comunità',day:'Mercoledì',xp:25,coins:5,group:false,minutes:20,desc:'Porta una proposta al gruppo e chiedi la convalida dopo che è stata pubblicata.'}
];
const rewards = [
 {id:'adesivi',name:'Sticker pixel art',cost:10,art:'star',quantity:12,desc:'Una piccola collezione di simboli di Cca Siemmu.'},
 {id:'spille',name:'Spille e magneti',cost:25,art:'pin',quantity:8,desc:'Due modi per portare con te un pezzo dello spazio.'},
 {id:'zine',name:'Mini-zine artistica',cost:35,art:'book',quantity:6,desc:'Una piccola pubblicazione illustrata.'},
 {id:'shopper',name:'Tote bag Cca Siemmu',cost:100,art:'bag',quantity:4,desc:'Una borsa per libri, zine e materiali.'},
 {id:'maglietta',name:'Maglietta Cca Siemmu',cost:200,art:'shirt',quantity:3,desc:'Una maglietta con il simbolo del progetto.'},
 {id:'taccuino',name:'Taccuino in carta riciclata',cost:35,art:'book',quantity:1,desc:'Voce della prima demo, conservata anche nello storico.'}
];
const initial = {...defaultRpg,bookings:[], bookingStates:{}, ideas:[], offers:[], survey:'', vote:'', volunteer:false, redeemed:[], interests:['Studio','Arte'], days:['Martedì','Venerdì'], avatar:'rosa', species:'mucca', bankVisible:false, persona:'giovane', account:'approvato', notifications:[], learning:{}, nick:'Esploratore', verified:[], requests:[], reports:[], assignment:false, hours:'Da lunedì a venerdì · 16:00–20:00', extraEvents:[], extraMissions:[], extraRewards:[], capacities:{}, hidden:[], questions:{survey:'Quale fascia oraria ti aiuterebbe a frequentare la sede?',vote:'Quale tema esploriamo nel prossimo laboratorio?'}, open:{survey:true,vote:true}};
const key = 'cca-siemmu-demo-v1';
let state = structuredClone(initial);
let savedState={};
try {savedState=JSON.parse(localStorage.getItem(key)||'{}')||{};state={...state,...savedState};} catch {}
if(Object.keys(savedState).length&&!Object.hasOwn(savedState,'startingXP')){
 state.startingXP=1840;
 state.startingCheese=55;
 state.seedVisit=true;
 state.levels=savedState.levels??legacyLevels;
}
if(!Object.hasOwn(savedState,'legacyBadges')&&Object.keys(savedState).length){
 const done=state.verified;
 state.legacyBadges=[
  ['Primo passo',true],['Tra i banchi',done.some(m=>m.interest==='Studio')],
  ['Occhio ai Sicani',done.some(m=>m.interest==='Arte')],['Radici sicane',done.some(m=>m.id==='verde')],
  ['Mani in comune',done.some(m=>m.group)],['Sentieri diversi',new Set(done.map(m=>m.interest)).size>=3]
 ].filter(([,earned])=>earned).map(([name])=>name);
}
for(const id of state.redeemed){
 const item=rewards.find(r=>r.id===id)??state.extraRewards.find(r=>r.id===id);
 state.spends[id]??={cost:spend(id),name:({adesivi:'Adesivi pixel dei Sicani',shopper:'Shopper Cca Siemmu'}[id]??item?.name??id)};
}
if(state.hours==='Martedì, giovedì e sabato · 15:00–19:00')state.hours=initial.hours;
state.days=[...new Set(state.days.map(day=>day==='Sabato'?'Venerdì':day))];
const baseline = {events:[...events], missions:[...missions], rewards:[...rewards]};
const refresh = ()=>{
 for(const [list, original, extra] of [[events,baseline.events,state.extraEvents],[missions,baseline.missions,state.extraMissions],[rewards,baseline.rewards,state.extraRewards]])list.splice(0,list.length,...original,...extra);
 for(const [list,edits] of [[missions,state.missionEdits],[rewards,state.rewardEdits]]){
  list.forEach((item,i)=>{list[i]={...item,...edits[item.id]};});
 }
 for(const e of events){
  const original = baseline.events.find(x=>x.id===e.id);
  e.max = state.capacities[e.id] ?? original?.seedMax ?? e.seedMax ?? e.max;
  e.free = Math.max(0,e.max-e.occupied);
 }
};
for(const e of events){e.seedMax=e.max;e.occupied=e.max-e.free;}
const hidden = item=>state.hidden.includes(item.id)&&!Object.hasOwn(item,'xp');
const verified = ()=>state.verified.reduce((sum,entry)=>({xp:sum.xp+entry.xp,coins:sum.coins+entry.coins}),{xp:0,coins:0});
const totalXP = ()=>state.startingXP+verified().xp;
const isStaff = ()=>state.persona==='referente';
const approved = ()=>state.account==='approvato';
const access = ()=>approved()&&!isStaff();
const labNotice = 'Simulazione locale. I ruoli sono liberamente commutabili e i dati sono leggibili dal browser. Usa esclusivamente dati inventati.';
let calendarTab = 'Tutti', missionTab = 'Tutte', timer;
const main = document.querySelector('main');
const esc = value => String(value).replace(/[&<>"']/g, char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const systemCopy = text=>text.replace(/Trionfi/g,'Trofei').replace(/Trionfo/g,'Trofeo').replace(/Vasceddi/g,'Formaggi').replace(/Cumannu completato/g,'Missione completata').replace(/Cumannu aggiornato/g,'Missione aggiornata').replace(/Nuovo Cumannu/g,'Nuova missione');
const badge = x=>`<span class="pill">${esc(x)}</span>`;
const card = (html, color='')=>`<article class="card ${color}">${html}</article>`;
const button = (label, action, id='', disabled=false)=>`<button type="button" data-action="${action}" class="${['staffDecline','staffCancel','reject','dismissCelebration','hide','reset'].includes(action)||(action==='booking'&&label.startsWith('Annulla'))?'secondary':''}" data-id="${esc(id)}" ${disabled?'disabled':''}>${esc(label)}</button>`;
const link = (label, href)=>`<a class="btn" href="#${href}">${label} →</a>`;
const section = (title, content, action='')=>`<section><div class="section-head"><h2>${title}</h2>${action}</div>${content}</section>`;
const grid = (items, size='three')=>`<div class="grid ${size}">${items.join('')}</div>`;
const title = (name, desc)=>`<header class="page-title"><span class="eyebrow">CCA SIEMMU / DEMO</span><h1>${name}</h1><p>${desc}</p></header>`;
const items = (values, empty)=> values.length ? `<ul class="list">${values.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>` : `<p>${empty}</p>`;
const coins = ()=>state.startingCheese+verified().coins-state.redeemed.reduce((sum,id)=>sum+spend(id),0);
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
function avatar(color=state.avatar,species=state.species){
 const animal=Object.hasOwn(animals,species)?animals[species]:animals.mucca;
 const accent=(Object.hasOwn(avatarColors,color)?avatarColors[color]:avatarColors.rosa)[1];
 return `<svg class="avatar" viewBox="0 0 16 16" shape-rendering="crispEdges" role="img" aria-label="Avatar pixel · ${animal.name}"><path fill="#fff3d5" d="M0 0h16v16H0z"/>${animal.art}<path fill="#171523" d="M4 13h8v1h1v2H3v-2h1z"/><path fill="${accent}" d="M4 14h8v2H4z"/></svg>`;
}
const animalPicker = ()=>`<fieldset><legend>Scegli il tuo avatar</legend><div class="animal-picker">${Object.entries(animals).map(([id,animal])=>`<label><input type="radio" name="species" value="${id}" ${id===state.species?'checked':''} required>${avatar(state.avatar,id)}<span>${animal.name}</span></label>`).join('')}</div></fieldset>`;
const profileChip = ()=>{
 const level=progressLevel();
 return `<div class="row">${avatar()}<div><span class="eyebrow">LIVELLO ${level.number} / 8</span><div class="metric">${esc(state.nick)}</div><p>${esc(level.name)}</p></div></div><progress value="${level.left?level.progress:1}" max="${level.range}" aria-label="Progresso del livello"></progress><p class="muted"><strong>${level.xp} XP permanenti</strong> · ${level.left?`${level.left} XP al livello ${level.number+1}`:'Livello massimo raggiunto'}</p>`;
};
function missionCard(m){
 const pending=state.requests.includes(m.id), completed=state.verified.some(v=>v.id===m.id), ready=mayComplete(m);
 const activity=events.some(e=>e.id===m.id&&!hidden(e));
 const route=activity?'calendario/'+m.id:({scambio:'comunita/banca',assemblea:'comunita',turno:'comunita',proposta:'comunita',visita:'spazio'}[typeOf(m)]||'calendario');
 return card(`${art(m.art)}<div class="row">${badge(missionTypes[typeOf(m)])}${badge(m.group?'Collettivo':'Individuale')}</div><h3>${esc(m.name)}</h3><p>${esc(m.desc)}</p><p class="muted">Circa ${m.minutes??60} min · ${esc(m.day)}</p><div class="row">${badge('+'+m.xp+' XP')}${badge((repeatable(m)?'Fino a ':'+')+m.coins+' Formaggi')}</div>
 <p><strong>Requisiti.</strong> ${esc(m.requirement||'Svolgi l’attività e falla verificare dal referente.')}</p><p class="muted">${repeatable(m)?'Una convalida al giorno per categoria. Fino a 12 Formaggi a settimana dalle missioni ripetibili; gli XP continuano ad accumularsi.':'Una convalida per questa missione.'}</p>
 ${badge(pending?'In attesa di verifica':completed?'Già convalidato':'Da completare')}
 ${link('Partecipa',route)}${button(pending?'Verifica richiesta':ready?'Chiedi verifica':'Limite raggiunto','request',m.id,!access()||pending||!ready)}`);
}
const bookingState = id=>state.bookingStates[id]??(state.bookings.includes(id)?'confirmed':null);
const bookingLabels={pending:'In attesa di conferma',confirmed:'Confermata',declined:'Non accettata',cancelled:'Annullata dal referente'};
function eventCard(e){
 const booked=state.bookings.includes(e.id), status=bookingState(e.id);
 const available=Math.max(0,e.free-Number(booked));
 return card(`${art(e.art)}${badge(e.type)}<h3>${esc(e.name)}</h3><p><strong>${esc(e.date)}</strong></p><p>${esc(e.desc)}</p><p class="muted">${available} / ${e.max} posti disponibili · Gratuito</p>${status?badge(bookingLabels[status]):''}${button(booked?'Annulla richiesta':hidden(e)?'Attività archiviata':available?'Richiedi un posto':'Turno completo','booking',e.id,!access()||(!booked&&(!available||hidden(e))))}`);
}
const bookings = ()=>items(events.filter(e=>bookingState(e.id)).map(e=>e.name+' · '+e.date+' · '+bookingLabels[bookingState(e.id)]),'Nessuna richiesta di prenotazione.');
const tabs = (labels,current,action)=>`<div class="tabs" role="group" aria-label="${action==='mission'?'Filtra le missioni':'Filtra il calendario'}">${labels.map(label=>`<button type="button" data-action="${action}" data-id="${label}" aria-pressed="${label===current}"><span class="filter-check" aria-hidden="true">${label===current?'✓':''}</span>${label}</button>`).join('')}</div>`;
const goalCount = ()=>7+Number(state.verified.some(x=>x.id==='verde'));
function commonGoal(){
 const count=goalCount();
 return card(`<span class="eyebrow">OBIETTIVO COLLETTIVO · DEMO</span><h3>Un angolo verde in sede</h3><progress value="${count}" max="10" aria-label="${count} cassette su 10"></progress><p><strong>${count} / 10 cassette</strong> preparate per il verde della sede.</p><p>La demo parte da 7 cassette. Quando il referente convalida <em>Semi dei Sicani</em>, il contributo di prova aggiunge una cassetta al totale. La prenotazione lascia il conteggio invariato.</p>${link('Scopri la missione','missioni/verde')}`,'green');
}
function badgeProgress(){
 const done=state.verified, badges=trionfi(), earned=earnedTrionfi();
 const summary=card(`<h3>Il diario delle presenze</h3><div class="presence-summary"><div><strong>${done.length+Number(state.seedVisit)}</strong> Verificate</div><div><strong>${state.requests.length}</strong> In attesa</div><div><strong>${earned.length} / ${badges.length}</strong> Trofei</div></div>
 <ol class="presence-log">${[...done].reverse().map(m=>`<li>${pixelIcon(navIcons.missioni)}<div><strong>${esc(m.name)}</strong><p class="muted">${esc(m.date||'Convalida precedente')}</p><div class="row">${badge('+'+m.xp+' XP')}${badge('+'+m.coins+' Formaggi')}</div></div></li>`).join('')}${state.seedVisit?`<li>${pixelIcon(navIcons.missioni)}<div><strong>Accoglienza in sede</strong><p class="muted">Presenza iniziale di esempio</p></div></li>`:''}</ol>${!done.length&&!state.seedVisit?'<p>Le presenze appariranno qui dopo la prima convalida.</p>':''}`,'presence');
 return section('Progressi e Trofei',summary+
 trionfoGroups.map((group,i)=>`<h3 class="trionfo-group">${group}</h3><div class="badge-grid">${badges.filter(t=>t.group===i).map(t=>card(`${art(t.icon)}${badge(t.count===t.target?'Sbloccato':'Da sbloccare')}<h3>${esc(t.name)}</h3><p>${esc(t.desc)}</p><progress value="${t.count}" max="${t.target}" aria-label="Progresso ${esc(t.name)}"></progress><p>${t.count} / ${t.target}</p>`,t.count===t.target?'green':'')).join('')}</div>`).join(''));
}
const pixelIcon = (path,kind='')=>`<svg class="pixel-icon ${kind}" viewBox="0 0 16 16" shape-rendering="crispEdges" aria-hidden="true">${path}</svg>`;
const coinIcon = ()=>pixelIcon(cheese);
const clockIcon = ()=>pixelIcon('<path fill="#6f440f" d="M4 1h8v1h2v2h1v8h-1v2h-2v1H4v-1H2v-2H1V4h1V2h2z"/><path fill="#fff3d5" d="M4 3h8v1h1v8h-1v1H4v-1H3V4h1z"/><path fill="#6f440f" d="M7 4h2v4h3v2H7z"/>');
const bellIcon = ()=>pixelIcon('<path fill="currentColor" d="M7 1h2v2h3v2h1v6h2v2H1v-2h2V5h1V3h3zM6 14h4v2H6z"/>','bell-icon');
function homeStats(){
 const normal=state.hours===initial.hours;
 return `<div class="grid stats">${card(profileChip(),'yellow')}
 ${card(`<span class="eyebrow">FORMAGGI</span><div class="stat-figure">${coinIcon()}<div><strong class="metric">${coins()}</strong><span class="stat-label">Formaggi disponibili</span></div></div>${link('A Putìa','missioni/ricompense')}`,'wallet')}
 ${card(`<span class="eyebrow">ORARI DELLA SEDE</span><div class="stat-figure">${clockIcon()}<div>${normal?'<strong class="metric">16:00–20:00</strong><span class="stat-label">Da lunedì a venerdì</span>':`<strong>${esc(state.hours)}</strong>`}</div></div>${normal?'<div class="week" aria-hidden="true"><span>LU</span><span>MA</span><span>ME</span><span>GI</span><span>VE</span></div>':''}`,'opening')}</div>`;
}
const inboxEntries = ()=>state.notifications.filter(entry=>entry.role===state.persona);
function notify(role,text){
 state.notifications=[{id:crypto.randomUUID(),role,text,read:false},...state.notifications].slice(0,100);
}
function inbox(){
 const entries=inboxEntries();
 return title('Notifiche','Aggiornamenti di prova sul tuo ruolo, salvati in questo browser.')+
 section('La tua casella',entries.length?grid([
 ...entries.map(entry=>card(`${badge(entry.read?'Letta':'Da leggere')}<p>${esc(systemCopy(entry.text))}</p>${entry.read?'':button('Segna come letta','readNotice',entry.id)}`,entry.read?'':'green'))
 ],'two'):card(cowMascot('curioso','Qui arrivano le notizie sulle attività in sede.')+'<p>Nessun aggiornamento per questo ruolo.</p>'));
}
const program = [
 ['book','Aula studio e aiuto tra pari','Studia da solo o in gruppo. Il progetto prevede anche tutoraggio informale e brevi sessioni su organizzazione, concentrazione e metodo di studio.'],
 ['camera','Laboratori tra pari','Competenze digitali, conversazione in altre lingue e in siciliano, zine, serigrafia e podcast. Puoi imparare una tecnica o proporre di condividerne una.'],
 ['plant','Riuso e cura dello spazio','Usare materiali di recupero, riparare oggetti e preparare insieme segnaletica o piccoli arredi sono modi concreti per prendersi cura del luogo.'],
 ['heart','Eventi aperti alla comunità','Cineforum, serate culturali, musica e incontri con scuole e associazioni. Le date e le modalità di accesso saranno indicate nel calendario.']
];
function space(){
 return title('Lo spazio','Un luogo gratuito pensato e gestito dai giovani di Cammarata e San Giovanni Gemini.')+
 section('Prima di venire',grid([
 card(`<h3>A chi si rivolge</h3><p>Il progetto si rivolge principalmente a chi ha tra 14 e 30 anni e vive nei due paesi. Puoi venire per studiare, incontrare altre persone o proporre un’attività.</p>${link('Prima volta?','benvenuto')}`,'audience'),
 card(`<h3>Quando ci trovi</h3><p><strong>${esc(state.hours)}</strong></p><p>Consulta il calendario per distinguere i turni dell’aula studio dagli appuntamenti con posti limitati.</p>${link('Apri il calendario','calendario')}`,'green')
 ],'two'))+
 section('Cosa fare in sede',`<p class="section-intro">Questi sono i format previsti dalla candidatura. Il calendario della demo contiene appuntamenti di prova.</p>`+
 grid(program.map(([icon,name,description])=>card(`${art(icon)}<h3>${name}</h3><p>${description}</p>`)),'two'))+
 section('Come si partecipa alla gestione',card(`<h3>Dall’idea all’assemblea</h3><p>Puoi proporre un laboratorio, dare una mano nei turni o portare una questione all’assemblea mensile in sede. Il progetto prevede anche riunioni operative per organizzare attività, materiali e accoglienza.</p><p>Ascolta chi usa lo spazio, rispetta le differenze, lascia in ordine i materiali comuni e segnala ai referenti eventuali ostacoli alla partecipazione.</p>${link('Vai a Comunità','comunita')}`));
}
function learningJournal(){
 const fields=[
  ['goal','Che cosa voglio imparare?','Es. Facilitare un confronto di gruppo'],
  ['evidence','Quale esperienza posso raccontare?','Es. Ho preparato i materiali e condotto un’attività'],
  ['reflection','Che cosa ho imparato e cosa provo la prossima volta?','Es. Ho imparato a spiegare il compito in piccoli passaggi']
 ];
 const prompts=fields.map(([key,label,example])=>`<label>${label}<textarea name="${key}" maxlength="300" placeholder="${example}">${esc(state.learning[key]||'')}</textarea></label>`).join('');
 return section('Diario di apprendimento',card(`<h3>Una traccia per Youthpass</h3><p>Il progetto prevede di fissare obiettivi, raccogliere esempi e riflettere sulle competenze sviluppate. Questo diario di prova resta nel browser e non rilascia attestati. Usa solo esempi inventati.</p>${access()?form('learning',prompts,'Salva la mia riflessione'):'<p>Apri il ruolo giovane approvato per usare il diario.</p>'}`,'green'));
}
function home(){
 const chosen = missions.filter(m=>!hidden(m)&&state.interests.includes(m.interest) && state.days.includes(m.day));
 return `<div class="hero"><img class="scenery-day" src="sicani.svg" alt="Illustrazione pixel di un borgo tra i Monti Sicani"><img class="scenery-night" src="sicani-notte.svg" alt="Borgo dei Monti Sicani di notte, con luna e finestre illuminate"><div class="hero-copy"><span class="eyebrow">CAMMARATA + SAN GIOVANNI GEMINI</span><h1>CCA SIEMMU</h1><p class="hero-motto">E boni siemmu</p><p class="hero-local">Uno spazio gratuito per incontrarsi, studiare e far nascere idee insieme.</p>${link('Esplora come ospite','calendario')} ${link('Ho un invito','benvenuto')}<p class="muted entry-hint">Come ospite puoi aprire il calendario senza compilare moduli.</p></div></div>
 ${homeStats()}
 <section class="space-signpost"><div><span class="eyebrow">LO SPAZIO GIOVANI</span><h2>Un posto da usare, uno spazio da fare insieme</h2><p>Aula studio, laboratori tra pari e idee da portare in assemblea. Per chi ha dai 14 ai 30 anni a Cammarata e San Giovanni Gemini.</p></div>${link('Scopri lo spazio','spazio')}</section>
 ${section('Missioni per te',chosen.length?grid(chosen.map(missionCard)):'<p>Scegli interessi e giorni per trovare attività compatibili.</p>',link(chosen.length?'Tutte':'Preferenze',chosen.length?'missioni':'profilo'))}
 ${section('Prossimi eventi',grid(events.filter(e=>!hidden(e)&&e.type==='Eventi').map(eventCard),'two'),link('Calendario','calendario'))}
 ${section('U paisi crisci',commonGoal(),link('Progressi del paese','paisi'))}`;
}
function pilotEvent(){
 return card(`${badge('Attività reale · in preparazione')}<h3>Giornata internazionale contro la violenza sulle donne</h3>
 <p><strong>Mercoledì 25 novembre 2026, ore 17:30</strong></p><p>Capienza prevista: 25 persone.</p>
 <p>Il referente verifica la presenza dal vivo e la registra nella stessa giornata.</p><p class="muted">Prenotazioni reali non ancora aperte.</p>`,'audience');
}
function calendario(detail){
 const chosen = events.find(e=>e.id===detail);
 const visible = events.filter(e=>(!hidden(e)||state.bookings.includes(e.id))&&(calendarTab==='Tutti'||e.type===calendarTab));
 return title('Calendario','Eventi, laboratori e turni dell’aula studio.')+
 (!chosen&&calendarTab!=='Aula studio'?section('In preparazione',pilotEvent()):'')+
 (chosen ? section(chosen.type,grid([eventCard(chosen)]),link('Tutte le attività','calendario')) : section('Appuntamenti della demo',tabs(['Tutti','Eventi','Aula studio'],calendarTab,'calendar')+grid(visible.map(eventCard))))+
 section('Le mie prenotazioni',card(bookings()+events.filter(e=>state.bookings.includes(e.id)).map(e=>`<div class="row">${esc(e.name)} ${button('Annulla richiesta','booking',e.id,!access())}</div>`).join(''),'yellow'));
}
function missioni(detail){
 if(['trionfi','trofei','percorsi'].includes(detail)){
  return title(detail!=='percorsi'?'Trofei':'Competenze','Il tuo percorso si aggiorna con le esperienze verificate in sede.')+
  link('Torna alle missioni','missioni')+(detail!=='percorsi'?badgeProgress():progressTree());
 }
 const focused=missions.find(m=>m.id===detail&&!hidden(m));
 const catalog = section('A Putìa',`<p class="section-intro">Scaffali di prova. Prezzi e quantità sono simulati. I riscatti non danno diritto al ritiro di oggetti reali.</p><div class="putia-shelves">${grid(rewards.filter(r=>!hidden(r)).map(r=>{
  const redeemed=state.redeemed.includes(r.id), available=Math.max(0,(r.quantity??1)-Number(redeemed));
  return card(`${art(r.art)}<h3>${esc(r.name)}</h3><p>${esc(r.desc||'Ricompensa dimostrativa.')}</p><div class="stat-figure">${coinIcon()}<strong>${r.cost} Formaggi</strong></div><p class="muted">${available} pezzi nel catalogo demo</p>
  ${button(redeemed?(state.delivery[r.id]?'Verificato in demo':'Riscatto in verifica'):!available?'Esaurito nella demo':coins()<r.cost?'Formaggi insufficienti':'Prova il riscatto','redeem',r.id,!access()||redeemed||available<=0||coins()<r.cost)}`);
 }))}</div>`);
 return title('Missioni','Missioni per la vita in sede. Gli XP fanno crescere il livello. I Formaggi si spendono nella Putìa. Le presenze verificate assegnano i premi.')+
 (detail==='ricompense'?'<div class="subpage-back">'+link('Torna alle missioni','missioni')+'</div>'+catalog:focused?section('Scheda missione',missionCard(focused),link('Tutte le missioni','missioni')):
 section('Il tuo percorso',`<div class="row quiet-actions">${link('Trofei','missioni/trofei')}${link('Competenze','missioni/percorsi')}${link('A Putìa','missioni/ricompense')}</div>`)+tabs(['Tutte','Individuali','Collettive'],missionTab,'mission')+
 grid(missions.filter(m=>!hidden(m)&&(missionTab==='Tutte'||m.group===(missionTab==='Collettive'))).map(missionCard)));
}
function community(detail){
 const bank = card(`<h3>Banca del tempo</h3><p>Riconosci chi offre o cerca una competenza dal nome scelto e dall’animale. Lo scambio si concorda con i referenti in sede.</p>
 <div class="bank-person">${avatar('verde','pecora')}<div><strong>Nespola</strong> ${badge('Esempio')}<p>Offro · Ripetizioni</p><p>Cerco · Una mano con la fotografia</p></div></div>
 ${approved()&&state.bankVisible&&state.offers.length?`<div class="bank-person">${avatar()}<div><strong>${esc(state.nick)}</strong> ${badge('La tua scheda demo')}${items(state.offers,'')}</div></div>`:''}
 ${access()?`<form class="card" data-form="offer"><label>Tipo<select name="kind"><option>Offro</option><option>Cerco</option></select></label><label>Competenza o attività<input name="text" maxlength="100" required placeholder="Es. Impaginare una locandina"></label><button>Salva voce demo</button></form>
 <p class="muted">Se rendi visibile la scheda, compaiono pseudonimo, avatar e tutte le voci Offro/Cerco salvate. La visibilità vale solo nella demo locale.</p>
 ${button(state.bankVisible?'Nascondi la mia scheda':'Mostra la mia scheda','bankVisibility','',!state.offers.length)}`:'<p>Serve il profilo giovane approvato.</p>'}`,'green');
 const idea = card(`<h3>Proponi un’idea</h3>${access()?`<form class="card" data-form="idea"><label>La tua idea<textarea name="text" maxlength="280" required placeholder="Es. Una serata di giochi da tavolo"></textarea></label><button>Salva nel profilo demo</button></form>`:'<p>Serve il profilo giovane approvato.</p>'}`);
 const report = card(`<h3>Segnalazione di prova</h3><p>${labNotice}</p>${access()?`<form class="card" data-form="report"><label>Scenario inventato<textarea name="text" maxlength="280" required placeholder="Es. La luce della sala studio non funziona"></textarea></label><button>Registra scenario demo</button></form>`:''}`,'pink');
 const poll = (name,desc,kind,options)=>card(`<h3>${name}</h3><p>${esc(state.questions[kind])}</p><p class="muted">${desc}</p>${state.open[kind]&&access()?`<form class="card" data-form="${kind}"><fieldset><legend>Scegli un’opzione</legend>${options.map(v=>`<label><input type="radio" name="choice" value="${v}" ${state[kind]===v?'checked':''} required> ${v}</label>`).join('')}</fieldset><button>Salva risposta di prova</button></form>`:`<p>${state.open[kind]?'Accesso giovane approvato richiesto.':'Consultazione chiusa.'}</p>`}`);
 return title('Comunità','Idee, scambi e modi per prendersi cura dello spazio.')+
 section('Partecipa',grid(detail==='banca'?[bank,idea,report]:[idea,bank,report]))+
 section('Questionari e votazioni',grid([
 poll('Questionario demo','Raccoglie preferenze sugli orari.','survey',['Pomeriggio','Prima serata']),
 poll('Voto consultivo demo','Il risultato orienta la programmazione.','vote',['Fotografia','Fumetto','Orto'])
 ],'two'))+
 section('Assemblea e vita dello spazio',card(`<h3>Porta un tema all’assemblea</h3><p>L’assemblea mensile in sede discute priorità e regole comuni. Il box idee raccoglie temi da sottoporre ai referenti. Questionari e voti consultivi aiutano a preparare il confronto.</p>${link('Come funziona lo spazio','spazio')}`,'yellow'))+
 section('Volontariato',card(`<h3>Accoglienza ai laboratori</h3><p>Candidati per preparare i materiali, accogliere chi arriva e indicare dove si svolge il laboratorio. Il referente concorda il turno con te e assegna l’incarico. <strong>${state.assignment?'Incarico assegnato':state.volunteer?'Candidatura in attesa':'Candidature aperte nella demo'}.</strong></p>${button(state.volunteer?'Ritira interesse demo':'Prova la candidatura','volunteer','',!access())}`,'green'));
}
function profile(){
 const checks = (legend,key,options)=>`<fieldset><legend>${legend}</legend>${options.map(x=>`<label><input type="checkbox" name="${key}" value="${x}" ${state[key].includes(x)?'checked':''}> ${x}</label>`).join('')}</fieldset>`;
 return title('Profilo','Il tuo percorso di prova a Cca Siemmu.')+section('Il mio personaggio',grid([
 card(`${profileChip()}<div class="stat-figure">${coinIcon()}<strong>${coins()} Formaggi</strong></div>${link('Registro Formaggi','formaggi')}${!isStaff()?link('Condividi i progressi','condividi'):''}<p class="muted">Profilo personale. Nella Banca del tempo puoi rendere visibile una scheda con pseudonimo e avatar. Il resto del profilo resta personale nella demo.</p>`,'yellow'),
 card(`<details class="disclosure"><summary>Le mie preferenze</summary><form class="card" data-form="profile"><label>Nome del personaggio<input name="nick" maxlength="28" value="${esc(state.nick)}" required></label>${animalPicker()}<fieldset><legend>Colore avatar</legend><div class="swatches">${Object.entries(avatarColors).map(([key,[name,hex]])=>`<label><input type="radio" name="avatar" value="${key}" ${key===state.avatar?'checked':''} required><span class="swatch" style="background:${hex}" aria-hidden="true"></span><span>${name}</span></label>`).join('')}</div><div id="avatar-preview">${avatar()}</div></fieldset>${checks('Interessi','interests',interests)}${checks('Disponibilità','days',days)}<button>Salva preferenze demo</button></form></details>`)
 ],'two'))+
 section('Il mio registro',grid([
 card('<h3>Prenotazioni</h3>'+bookings()+link('Gestisci','calendario')),
 card('<h3>Idee e scambi</h3>'+items([...state.ideas,...state.offers],'Nessuna idea o scambio salvato.')+link('Comunità','comunita')),
 card('<h3>Candidature e riscatti</h3>'+items([...(state.volunteer?[state.assignment?'Accoglienza ai laboratori · incarico assegnato':'Accoglienza ai laboratori · candidatura in attesa']:[]),...rewards.filter(r=>state.redeemed.includes(r.id)).map(r=>r.name)],'Nessuna candidatura o ricompensa di prova.'))
 ]))+inventory()+section('Il tuo percorso',`<div class="row">${link('Trofei','missioni/trofei')}${link('Competenze','missioni/percorsi')}</div>`)+learningJournal()+section('Accesso di prova',accountPanel())+section('Dati di prova',card('<p>Preferenze e azioni demo sono salvate solo in questo browser.</p>'+button('Azzera i dati demo','reset')));
}
function accountPanel(){
 return card(`<h3>Banco di prova</h3><p>${labNotice}</p><p><strong>Ruolo attivo:</strong> ${isStaff()?'Referente demo':'Giovane demo'} · Iscrizione ${state.account}</p>
 <div class="row">${button(isStaff()?'Torna al profilo giovane':'Entra come referente demo','role')}${isStaff()?link('Pannello referenti','referenti'):button('Prova una nuova iscrizione','onboard','',!approved())}</div>
 ${!isStaff()&&state.account==='da invitare'?`<form class="card" data-form="invite"><label>Codice di prova <small>Usa SICANI-DEMO</small><input name="code" required maxlength="32"></label><button>Richiedi accesso</button></form>`:''}`);
}
const field = (name,label,type='text',extra='')=>`<label>${label}<input name="${name}" type="${type}" required ${extra}></label>`;
const select = (name,label,options)=>`<label>${label}<select name="${name}">${options.map(x=>`<option>${x}</option>`).join('')}</select></label>`;
const form = (kind,body,label,extra='')=>`<form class="card" data-form="${kind}" ${extra}>${body}<button>${label}</button></form>`;
const consultationTypes = {survey:'Questionario',vote:'Voto consultivo'};
function adminQueue(detail){
 const bookingsPage=detail==='prenotazioni';
 const back=link('Torna al pannello','referenti');
 if(bookingsPage){
  const current=events.filter(e=>state.bookings.includes(e.id));
  const sorted=[...current.filter(e=>bookingState(e.id)==='pending'),...current.filter(e=>bookingState(e.id)==='confirmed')];
  return title('Gestisci prenotazioni','Le richieste in attesa tengono un posto fino alla decisione. La conferma o il rifiuto inviano un avviso al profilo giovane.')+
  section('Richieste e conferme',sorted.length?grid(sorted.map(e=>{
   const pending=bookingState(e.id)==='pending';
   return card(`<h3>${esc(e.name)}</h3><p>${esc(e.date)} · ${esc(state.nick)}</p>${badge(bookingLabels[bookingState(e.id)])}<div class="row">${pending?button('Accetta prenotazione','staffAccept',e.id)+button('Rifiuta prenotazione','staffDecline',e.id):button('Annulla prenotazione','staffCancel',e.id)}</div>`);
  }),'two'):card('<p>Nessuna richiesta o prenotazione da gestire.</p>'),back);
 }
 const pending=state.requests.map(id=>missions.find(m=>m.id===id)).filter(Boolean);
 return title('Conferma presenze','Controlla che l’attività si sia svolta prima di assegnare i premi.')+
 section('Da verificare',pending.length?grid(pending.map(m=>card(`<h3>${esc(m.name)}</h3><p>${esc(state.nick)} · ${m.xp} XP e ${missionCheese(m)} Formaggi</p><div class="row">${button('Conferma presenza','verify',m.id)}${button('Respingi richiesta','reject',m.id)}</div>`)),'two'):card('<p>Nessuna presenza da verificare.</p>'),back)+
 section('Già convalidate',card(items(state.verified.map(m=>m.name+(m.date?' · '+m.date:'')),'Nessuna presenza convalidata.')));
}
function admin(detail){
 const head=title('Area referenti','Banco di prova per chi coordina lo spazio giovani.');
 if(!isStaff())return head+section('Accesso demo',accountPanel());
 if(['prenotazioni','presenze'].includes(detail))return adminQueue(detail);
 const schedule = events.map(e=>card(`<h3>${esc(e.name)}</h3><p>${esc(e.date)} · ${e.occupied+Number(state.bookings.includes(e.id))} posti occupati</p>${form('capacity',field('capacity','Capienza','number',`min="${Math.max(1,e.occupied+Number(state.bookings.includes(e.id)))}" max="200" value="${e.max}"`),'Aggiorna capienza',`data-id="${e.id}"`)}${button(hidden(e)?'Ripubblica attività':'Archivia attività','hide',e.id)}`));
 const entryName=field('name','Titolo','text','maxlength="65"');
 const description=field('desc','Descrizione','text','maxlength="180"');
 const context=select('interest','Interesse',interests)+select('day','Giorno',days);
 const pending=state.bookings.filter(id=>bookingState(id)==='pending').length;
 const shortcut=(url,count,label,caption)=>`<a class="card shortcut" href="#referenti/${url}"><strong class="metric">${count}</strong><h3>${label} →</h3><p>${caption}</p></a>`;
 return head+section('Da gestire',grid([
 shortcut('prenotazioni',pending,'Gestisci prenotazioni',`${pending} in attesa · ${state.bookings.length-pending} confermate`),
 shortcut('presenze',state.requests.length,'Conferma presenze',`${state.requests.length} da verificare · ${state.verified.length} già convalidate`),
 card(`<strong class="metric">${state.redeemed.length}</strong><h3>Riscatti registrati</h3><p>Controllali nella configurazione RPG.</p>`)
 ]))+
 section('Accesso e iscrizioni',grid([accountPanel(),card(`<h3>Iscrizione giovane demo</h3><p>Stato · ${state.account}</p>${state.account==='in attesa'?button('Approva iscrizione','approve'):'<p>Le richieste inviate con il codice di prova compaiono qui.</p>'}`)],'two'))+
 section('Sede e calendario',grid([
 form('hours',field('hours','Orari sede','text',`maxlength="100" value="${esc(state.hours)}"`),'Aggiorna orari'),
 form('event',entryName+description+select('type','Tipo',['Eventi','Aula studio'])+field('date','Data e fascia oraria','text','maxlength="50" placeholder="Ven 27 nov · 16:00–18:00"')+context+field('capacity','Capienza','number','min="1" max="200"'),'Pubblica attività demo'),
 ...schedule
 ],'two'))+
 section('Missioni e ricompense',grid([
 form('newMission',entryName+description+context+select('group','Tipo',['Individuale','Collettiva'])+select('missionType','Categoria',Object.values(missionTypes))+field('minutes','Durata indicativa in minuti','number','min="5" max="720" value="60"')+field('requirement','Requisito','text','maxlength="180"')+field('xp','XP','number','min="1" max="500"')+field('coins','Formaggi','number','min="0" max="200"'),'Crea missione demo'),
 form('reward',entryName+description+field('cost','Costo in Formaggi','number','min="1" max="5000"')+field('quantity','Quantità demo','number','min="0" max="10000"'),'Aggiungi ricompensa'),
 card('<h3>Catalogo</h3>'+rewards.map(r=>`<div class="row">${esc(r.name)} · ${r.cost} ◈ ${button(hidden(r)?'Ripristina':'Archivia','hide',r.id)}</div>`).join('')),
 ],'two'))+rpgAdmin()+
 section('Consultazioni',grid(Object.entries(consultationTypes).map(([kind,label])=>card(`<h3>${label}</h3>${form('question',field('prompt','Domanda','text',`maxlength="150" value="${esc(state.questions[kind])}"`),'Aggiorna domanda',`data-id="${kind}"`)}${button(state.open[kind]?'Chiudi raccolta':'Apri raccolta','togglePoll',kind)}<p>Risposte demo: ${state[kind]?1:0}${!state.open[kind]&&state[kind]?' · '+esc(state[kind]):''}</p>`))))+
 section('Comunità e volontariato',grid([
 card('<h3>Proposte</h3>'+(state.ideas.length?state.ideas.map((x,i)=>`<p>${esc(x)} · ${state.reviewed?.includes(i)?'Esaminata':button('Segna esaminata','review',String(i))}</p>`).join(''):'<p>Nessuna proposta demo.</p>')),
 card(`<h3>Accoglienza ai laboratori</h3><p>${state.volunteer?(state.assignment?'Incarico assegnato':'Una candidatura demo'):'Nessuna candidatura'}</p>${state.volunteer?button(state.assignment?'Revoca incarico':'Assegna incarico','assign'):''}`),
 card('<h3>Scenari di segnalazione</h3><p>'+labNotice+'</p>'+items(state.reports,'Nessuno scenario demo.'),'pink')
 ]));
}
function welcome(){
 const waiting=state.account==='in attesa';
 const intro=title('Benvenutə a Cca Siemmu','Puoi esplorare subito oppure provare l’iscrizione con un invito.');
 const guest=card(`<h3>Esplora come ospite</h3><p>Vai direttamente al calendario della demo.</p>${link('Apri il calendario','calendario')}`);
 let invitation;
 if(waiting){
  invitation=card(`<h3>Richiesta in attesa</h3><p>Un referente deve approvare l’iscrizione. Puoi esplorare il calendario nel frattempo.</p>${link('Vai al cambio ruolo','profilo')}`);
 } else if(isStaff()){
  invitation=card(`<h3>Accesso con invito</h3><p>Passa al ruolo giovane per provare l’iscrizione.</p>${link('Vai al cambio ruolo','profilo')}`);
 } else {
  const custom=`<details class="disclosure"><summary>Personalizza nome e avatar (facoltativo)</summary><label>Pseudonimo<input name="nick" maxlength="28" value="${esc(state.nick)}"></label>${animalPicker()}</details>`;
  invitation=card(`<h3>Ho un invito</h3><p>Per provare l’iscrizione usa <strong>SICANI-DEMO</strong>.</p>${form('invite',field('code','Codice invito','text','maxlength="32" autocapitalize="characters" spellcheck="false"')+custom,'Invia richiesta demo')}<p class="muted">Il referente approva la richiesta. Il simulatore usa il profilo di questo browser. <a href="#privacy">Privacy della demo</a>.</p>`);
 }
 return intro+section('Scegli come iniziare',grid([guest,invitation],'two'))+cowMascot('normale','E boni siemmu!');
}
function privacyPage(){
 const email='spaziogiovanigenerazioni@gmail.com';
 const contact=`<a href="mailto:${email}">${email}</a>`;
 return title('Informativa sulla privacy','Cca Siemmu · Spazio Giovani Generazioni')+
 section('Chi gestisce i dati',card(`<p>Spazio Giovani Generazioni gestisce la piattaforma. Per domande o richieste sui tuoi dati puoi scrivere a ${contact}.</p><p class="muted"><strong>Stato dell’informativa.</strong> I trattamenti sotto descritti per il pilota sono previsti. In questa bozza privata è attiva soltanto la demo locale.</p>`))+
 section('Dati e finalità del pilota',grid([
 card('<h3>Inviti e accesso</h3><p>L’indirizzo email servirà a inviare l’invito e il link di accesso monouso. Il profilo userà uno pseudonimo e potrai personalizzare l’avatar. Senza un indirizzo email potrai consultare le informazioni pubbliche, mentre l’accesso alle funzioni riservate richiederà un invito.</p>'),
 card('<h3>Prenotazioni e presenze</h3><p>I referenti autorizzati useranno le richieste di prenotazione per gestire i posti. Quando verificheranno una presenza in sede, il sistema registrerà l’attività e aggiornerà i progressi del profilo.</p>'),
 card('<h3>Visibilità del profilo</h3><p>Email, prenotazioni e diario non fanno parte delle schede pubbliche. Se scegli di mostrare la tua scheda nella Banca del tempo, saranno visibili pseudonimo, avatar e voci che hai scelto di condividere.</p>'),
 card('<h3>Condivisione e segnalazioni</h3><p>La scheda dei progressi si genera sul dispositivo e viene inviata solo se scegli una destinazione. Il canale per segnalazioni reali richiede un accesso riservato ai referenti autorizzati. Nella demo usa solo situazioni inventate.</p>')
 ],'two'))+
 section('I tuoi diritti',card(`<p>Puoi scrivere a ${contact} per chiedere accesso, rettifica o cancellazione dei tuoi dati, limitazione del trattamento e, quando applicabili, portabilità, opposizione o revoca del consenso.</p><p>Puoi presentare un <a href="https://garanteprivacy.it/diritti/come-agire-per-tutelare-i-tuoi-dati-personali/reclamo">reclamo al Garante per la protezione dei dati personali</a>.</p>`))+
 section('Memoria del browser e dati di prova',card(`<p>La demo salva profilo, preferenze, attività e testi di prova nel browser finché li azzeri o cancelli i dati del sito. L’app di prova non installa cookie e non usa strumenti di analisi o pubblicità. I ruoli sono simulati e chi usa lo stesso browser può accedere ai dati locali.</p><p>Prima di attivare gli account reali, l’associazione completerà qui le basi giuridiche, i tempi di conservazione, i fornitori coinvolti e gli eventuali trasferimenti. La versione con account userà un cookie di sessione per mantenere l’accesso.</p>${button('Azzera i dati demo','reset')}`));
}
const views = {home,privacy:privacyPage,condividi:sharePage,formaggi:wallet,vasceddi:wallet,paisi:village,spazio:space,notifiche:inbox,benvenuto:welcome,calendario,missioni,comunita:community,profilo:profile,referenti:admin};
function render(focus=false){
 refresh();
 const unread=inboxEntries().filter(entry=>!entry.read).length;
 const bell=document.querySelector('#notifications');
 bell.setAttribute('aria-label',unread?`Notifiche, ${unread} da leggere`:'Notifiche');
 bell.innerHTML=bellIcon()+(unread?`<span class="unread" aria-hidden="true">${unread}</span>`:'');
 const [page,detail]=location.hash.slice(1).split('/');
 const active=Object.hasOwn(views,page)?page:page?'missing':'home';
 document.querySelector('#nav').innerHTML=pages.map(([id,name])=>`<a href="#${id}" ${active===id?'aria-current="page"':''}><span class="nav-icon-tile" aria-hidden="true">${pixelIcon(navIcons[id],'nav-icon')}</span>${name}</a>`).join('');
 const banner = `<div class="mode"><span>${isStaff()?'REFERENTE DEMO':approved()?'GIOVANE DEMO':'ISCRIZIONE '+state.account.toUpperCase()}</span><a href="#${isStaff()?'referenti':'profilo'}">${isStaff()?'Pannello referenti':'Cambia ruolo nel profilo'}</a></div>`;
 document.querySelector('#wallet-link').innerHTML=coinIcon()+`<span>${coins()}</span>`;
 document.querySelector('#wallet-link').setAttribute('aria-label',`${coins()} Formaggi · apri il registro`);
 const celebration=!isStaff()&&state.celebrations[0];
 main.innerHTML=banner+(celebration?`<div class="reward-celebration">${cowMascot(celebration.startsWith('Bonu')?'felice':'festoso',systemCopy(celebration))}${button('Chiudi avviso','dismissCelebration')}</div>`:'')+(views[active]?.(detail)??title('Ti pirdisti?','Questa pagina non c’è.')+section('Ritrova la strada',link('Torna alla Home','home')))+`<aside class="notice"><p><strong>Demo privata.</strong> Ruoli, accessi e flussi sono simulati. Il browser conserva solo i dati di prova di questo dispositivo. Usa esclusivamente contenuti fittizi.</p></aside><footer class="foot">${document.querySelector('#project-logos').innerHTML}<a href="#spazio">Lo spazio</a><a href="#privacy">Privacy e dati della demo</a><a href="#referenti">Schema area referenti</a></footer>`;
 if(active==='condividi')initSharing();
 if(focus){window.scrollTo(0,0);main.focus({preventScroll:true});}
}
function save(message,action,id){
 const status=document.querySelector('#status');
 try {localStorage.setItem(key,JSON.stringify(state));} catch {message+=' Salvataggio limitato alla sessione.';}
 render();
 const previous = [...main.querySelectorAll('button')].find(b=>action && b.dataset.action===action && b.dataset.id===id && !b.disabled);
 (previous || main).focus({preventScroll:true});
 status.textContent=message;
 clearTimeout(timer);
 timer=setTimeout(()=>status.textContent='',4200);
}
main.addEventListener('click',event=>{
 const control=event.target.closest('button[data-action]');
 if(!control)return;
 const {action,id}=control.dataset;
 if(['booking','redeem','volunteer','request','bankVisibility'].includes(action)&&!access())return;
 if(['approve','verify','reject','assign','staffCancel','staffAccept','staffDecline','togglePoll','review','hide','deliver'].includes(action)&&!isStaff())return;
 let message='Modifica demo salvata.';
 switch(action){
 case 'calendar':calendarTab=id; render();main.querySelector('[aria-pressed=true]').focus();return;
 case 'mission':missionTab=id; render();main.querySelector('[aria-pressed=true]').focus();return;
 case 'booking':{
  const e=events.find(x=>x.id===id);
  if(state.bookings.includes(id)){state.bookings=state.bookings.filter(x=>x!==id);delete state.bookingStates[id];message='Richiesta annullata. Il posto è di nuovo disponibile.';}
  else if(e?.free&&!hidden(e)){state.bookings.push(id);state.bookingStates[id]='pending';notify('referente','Nuova richiesta di prenotazione per '+e.name+'.');message='Richiesta inviata. Attendi la conferma del referente.';}
  break;
 }
 case 'redeem':{
  const reward=rewards.find(x=>x.id===id);
  if(!reward||hidden(reward)||(reward.quantity??1)<1||coins()<reward.cost||state.redeemed.includes(id))return;
  state.redeemed.push(id);
  state.spends[id]={cost:reward.cost,name:reward.name};
  audit(`Riscatto demo · ${reward.name} · −${reward.cost} Formaggi`);
  celebrate('Bonu ci jisti! '+reward.name+' è in attesa di verifica di prova.');
  message='Riscatto di prova registrato.';
  break;
 }
 case 'dismissCelebration':
  if(isStaff())return;
  state.celebrations.shift();
  break;
 case 'deliver':
  if(!state.redeemed.includes(id)||state.delivery[id])return;
  state.delivery[id]=true;
  audit('Riscatto verificato in demo · '+state.spends[id].name);
  notify('giovane',state.spends[id].name+' · riscatto verificato in demo.');
  break;
 case 'bankVisibility':if(state.offers.length)state.bankVisible=!state.bankVisible;break;
 case 'volunteer':state.volunteer=!state.volunteer;if(!state.volunteer)state.assignment=false;break;
 case 'role':state.persona=isStaff()?'giovane':'referente';break;
 case 'onboard':if(!isStaff())location.hash='benvenuto';return;
 case 'readNotice':{
  const notice=inboxEntries().find(entry=>entry.id===id);
  if(!notice||notice.read)return;
  notice.read=true;
  message='Notifica segnata come letta.';
  break;
 }
 case 'approve':
  if(state.account!=='in attesa')return;
  state.account='approvato';
  notify('giovane','Iscrizione approvata. Ora puoi prenotare e candidarti.');
  break;
 case 'request':{
  const mission=missions.find(m=>m.id===id&&!hidden(m));
  if(!mission||state.requests.includes(id)||!mayComplete(mission))return;
  state.requests.push(id);
  notify('referente',`Richiesta di convalida per ${mission.name}.`);
  break;
 }
 case 'verify':
 case 'reject':{
  const mission=missions.find(m=>m.id===id);
  if(!mission||!state.requests.includes(id))return;
  let awarded=0;
  if(action==='verify'){
   const date=today();
   if(!mayComplete(mission,date)){save('Limite di convalida raggiunto. Puoi respingere la richiesta.');return;}
   const before=progressLevel().number, prior=new Set(earnedTrionfi().map(t=>t.id));
   awarded=missionCheese(mission,date);
   state.verified.push({...mission,coins:awarded,type:typeOf(mission),date});
   const gained=earnedTrionfi().filter(t=>!prior.has(t.id)).map(t=>t.name);
   const level=progressLevel();
   const bonus=(gained.length?' Hai sbloccato un Trofeo! '+gained.join(', ')+'.':'')+(level.number>before?` Livello ${level.number} · ${level.name}!`:'');
   celebrate(`Missione completata! +${mission.xp} XP e +${awarded} Formaggi.`+bonus);
   audit(`Convalida · ${mission.name} · +${mission.xp} XP · +${awarded} Formaggi`);
  }
  state.requests=state.requests.filter(x=>x!==id);
  notify('giovane',action==='verify'?`${mission.name} · presenza convalidata. +${mission.xp} XP e +${awarded} Formaggi.`:`${mission.name} · il referente ha respinto la richiesta di convalida.`);
  message=action==='verify'?`Presenza convalidata · +${mission.xp} XP e +${awarded} Formaggi.`:'Richiesta respinta nel simulatore.';
  break;
 }
 case 'assign':
  if(!state.volunteer)return;
  state.assignment=!state.assignment;
  notify('giovane',state.assignment?'Accoglienza ai laboratori · incarico assegnato.':'Accoglienza ai laboratori · incarico revocato.');
  break;
 case 'staffAccept':
 case 'staffDecline':
 case 'staffCancel':{
  const e=events.find(item=>item.id===id);
  if(!e||!state.bookings.includes(id))return;
  const status=bookingState(id);
  if(action==='staffCancel'?status!=='confirmed':status!=='pending')return;
  const next={staffAccept:'confirmed',staffDecline:'declined',staffCancel:'cancelled'}[action];
  state.bookingStates[id]=next;
  if(next!=='confirmed')state.bookings=state.bookings.filter(x=>x!==id);
  message=`${e.name} · ${bookingLabels[next]}.`;
  notify('giovane',message);
  break;
 }
 case 'togglePoll':if(Object.hasOwn(consultationTypes,id))state.open[id]=!state.open[id];break;
 case 'review':state.reviewed=[...new Set([...(state.reviewed||[]),Number(id)])];break;
 case 'hide':state.hidden=state.hidden.includes(id)?state.hidden.filter(x=>x!==id):[...state.hidden,id];break;
 case 'reset':if(!confirm('Azzerare tutte le modifiche demo in questo browser?'))return;state=structuredClone(initial);message='Dati di prova ripristinati.';break;
 default:return;
 }
 save(message,action,id);
});
main.addEventListener('change',event=>{
 if(!['avatar','species'].includes(event.target.name))return;
 const preview=main.querySelector('#avatar-preview');
 if(preview){
  const data=new FormData(event.target.form);
  preview.innerHTML=avatar(data.get('avatar'),data.get('species'));
 }
});
main.addEventListener('submit',event=>{
 event.preventDefault();
 const data=new FormData(event.target);
 const {form:kind,id}=event.target.dataset;
 const value=name=>String(data.get(name)??'').trim();
 const rpgForms=['levels','trionfo','metrics','editMission','editReward'];
 const staffForms=['hours','event','capacity','newMission','reward','question',...rpgForms];
 if(staffForms.includes(kind)&&!isStaff())return;
 if(!staffForms.includes(kind)&&!['invite','profile'].includes(kind)&&!access())return;
 if(kind!=='learning'&&[...data.entries()].some(([name,x])=>!(kind==='invite'&&name==='nick')&&typeof x==='string'&&!x.trim()))return;
 if(rpgForms.includes(kind)){save(saveRpg(kind,id,value));return;}
 if(kind==='profile'){
  state.interests=data.getAll('interests');state.days=data.getAll('days');state.avatar=value('avatar');state.species=value('species');state.nick=value('nick');
 } else if(kind==='learning'){
  state.learning={goal:value('goal'),evidence:value('evidence'),reflection:value('reflection')};
 } else if(kind==='invite'){
  if(isStaff()||state.account==='in attesa')return;
  if(value('code').toUpperCase()!=='SICANI-DEMO'){
   const field=event.target.elements.code;
   field.setCustomValidity('Per la prova usa SICANI-DEMO.');
   field.reportValidity();
   field.addEventListener('input',()=>field.setCustomValidity(''),{once:true});
   return;
  }
  if(value('nick'))state.nick=value('nick');
  if(Object.hasOwn(animals,value('species')))state.species=value('species');
  state.account='in attesa';
  notify('referente','Nuova richiesta di iscrizione da esaminare.');
 } else if(kind==='idea'||kind==='offer'||kind==='report'){
  if(kind==='idea')state.ideas.push(value('text'));
  else if(kind==='report')state.reports.push(value('text'));
  else state.offers.push(value('kind')+' · '+value('text'));
 } else if(Object.hasOwn(consultationTypes,kind)){
  if(!state.open[kind])return;
  state[kind]=value('choice');
 } else if(kind==='hours')state.hours=value('hours');
 else if(kind==='question'){
  if(!Object.hasOwn(consultationTypes,id))return;
  const changed=state.questions[id]!==value('prompt');
  state.questions[id]=value('prompt');
  if(changed){state[id]='';state.open[id]=false;}
 } else if(kind==='capacity'){
  const e=events.find(x=>x.id===id);
  const capacity=Number(value('capacity'));
  if(!e||capacity<e.occupied+Number(state.bookings.includes(id)))return;
  state.capacities[id]=capacity;
 } else if(['event','newMission','reward'].includes(kind)){
  const entry={id:crypto.randomUUID(),name:value('name')};
  if(kind==='reward')state.extraRewards.push({...entry,art:'star',cost:Number(value('cost')),quantity:Number(value('quantity')||1),desc:value('desc')});
  else {
   const activity={...entry,desc:value('desc'),interest:value('interest'),day:value('day')};
   if(kind==='newMission')state.extraMissions.push({...activity,art:'star',type:Object.keys(missionTypes).find(key=>missionTypes[key]===value('missionType')),minutes:Number(value('minutes')||60),requirement:value('requirement'),xp:Number(value('xp')),coins:Number(value('coins')),group:value('group')==='Collettiva'});
   else state.extraEvents.push({...activity,art:value('type')==='Aula studio'?'book':'camera',type:value('type'),date:value('date'),occupied:0,max:Number(value('capacity')),seedMax:Number(value('capacity'))});
  }
 } else return;
 if(kind==='newMission'||kind==='reward')audit((kind==='newMission'?'Nuova missione · ':'Nuova ricompensa · ')+value('name'));
 save('Salvato in questo browser.');
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
try {night=(localStorage.getItem('cca-theme') ?? (window.matchMedia('(prefers-color-scheme: dark)').matches?'night':'day'))==='night';} catch {}
applyTheme(night);
themeControl.addEventListener('click',()=>{
 night=!night;
 applyTheme(night);
 try {localStorage.setItem('cca-theme',night?'night':'day');} catch {}
});
