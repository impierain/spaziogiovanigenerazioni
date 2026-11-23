import {json,fail,readJson} from '../lib/http.mjs';
import {romeDay,romeWeekStart} from '../lib/time.mjs';
import {memberTotals} from './auth.mjs';

export const DECORATIONS={ulivo:'Cornice Ulivo',grano:'Cornice Grano',stelle:'Cornice Stelle dei Sicani'};
export const weekKey=ms=>romeDay(romeWeekStart(ms)*1000);
export function weeklyRun(weeks,todayWeek){
 const have=new Set(weeks),ordered=[...have].filter(w=>w<=todayWeek).sort();
 let best=0,run=0,last=0;
 for(const week of ordered){const time=Date.parse(week);run=last&&time-last===604800000?run+1:1;best=Math.max(best,run);last=time;}
 let cursor=Date.parse(todayWeek),current=0;
 if(!have.has(todayWeek))cursor-=604800000;
 while(have.has(new Date(cursor).toISOString().slice(0,10))){current++;cursor-=604800000;}
 return {current,best,active:have.has(todayWeek)};
}
async function weekly(db,id){
 const {results}=await db.prepare(`SELECT verified_at AS at FROM attendance WHERE member_id=?1
 UNION ALL SELECT decided_at FROM chore_logs WHERE member_id=?1 AND status='verified'
 UNION ALL SELECT awarded_at FROM team_badges WHERE member_id=?1
 UNION ALL SELECT created_at FROM awards WHERE member_id=?1`).bind(id).all();
 const week=weekKey(Date.now()),weeks=results.filter(r=>r.at).map(r=>weekKey(r.at*1000));
 const run=weeklyRun(weeks,week);
 const {results:claimed}=await db.prepare("SELECT ref FROM joy_rewards WHERE member_id=? AND kind='weekly'").bind(id).all();
 const paid=new Set(claimed.map(r=>r.ref));
 // Nessuna pressione ad aprire l'app entro domenica: recupera ogni settimana di contributi dal lancio della funzione.
 const pending=[...new Set(weeks)].filter(key=>key>='2026-11-16'&&key<=week&&!paid.has(key)).sort().map(key=>({week:key,weeks:weeklyRun(weeks,key).current}));
 return {...run,week,pending,bonus:Math.min(5,run.current),xp:Math.min(5,run.current)*5};
}
const parse=row=>({...row,payload:JSON.parse(row.payload)});
export async function microAward(db,id,action){
 await db.prepare(`INSERT OR IGNORE INTO joy_rewards(member_id,kind,ref,xp,payload) VALUES(?,'micro',?,2,?)`).bind(id,weekKey(Date.now())+':'+action,JSON.stringify({title:action==='voto'?'Hai dato voce a un’idea':action==='prenotazione'?'Un appuntamento da vivere insieme':'Hai scelto un interesse'})).run();
}
export async function state({db,member}){
 const id=member.id,week=await weekly(db,id),today=romeDay(Date.now());
 const [events,bundle,greeting,decorations,equipped,marks,progress,proposal,activity]=await Promise.all([
  db.prepare('SELECT * FROM joy_rewards WHERE member_id=? AND seen_at IS NULL ORDER BY id LIMIT 30').bind(id).all(),
  db.prepare("SELECT * FROM joy_rewards WHERE member_id=? AND kind='bundle' AND ref=?").bind(id,week.week).first(),
  db.prepare("SELECT 1 FROM joy_rewards WHERE member_id=? AND kind='greeting' AND ref=?").bind(id,today).first(),
  db.prepare("SELECT DISTINCT json_extract(payload,'$.prize') AS name FROM joy_rewards WHERE member_id=? AND kind='bundle' AND json_extract(payload,'$.prize')<>'boost'").bind(id).all(),
  db.prepare('SELECT decoration FROM joy_cosmetic WHERE member_id=?').bind(id).first(),
  db.prepare('SELECT mark FROM joy_marks WHERE member_id=?').bind(id).all(),
  db.prepare(`SELECT EXISTS(SELECT 1 FROM proposal_votes WHERE member_id=?1) AS voted,
   EXISTS(SELECT 1 FROM bookings WHERE member_id=?1 AND status IN ('pending','confirmed')) AS booked,
   EXISTS(SELECT 1 FROM accessi WHERE member_id=?1 AND direction='IN') AS visited,
   EXISTS(SELECT 1 FROM learning_journal WHERE member_id=?1 AND length(trim(goal||evidence||reflection))>0) AS journal,
   EXISTS(SELECT 1 FROM joy_rewards WHERE member_id=?1 AND kind='greeting') AS greeted`).bind(id).first(),
  db.prepare(`SELECT p.id,p.title FROM proposals p WHERE p.status='open' AND p.member_id<>?1 AND NOT EXISTS(SELECT 1 FROM proposal_votes v WHERE v.proposal_id=p.id AND v.member_id=?1) ORDER BY p.created_at DESC LIMIT 1`).bind(id).first(),
  db.prepare(`SELECT a.id,a.name FROM activities a WHERE a.status='published' AND a.access_mode='booking' AND a.starts_at>unixepoch() AND NOT EXISTS(SELECT 1 FROM bookings b WHERE b.activity_id=a.id AND b.member_id=?1 AND b.status IN ('pending','confirmed')) AND (SELECT COUNT(*) FROM bookings b WHERE b.activity_id=a.id AND b.status IN ('pending','confirmed'))<a.capacity ORDER BY a.starts_at LIMIT 1`).bind(id).first()
 ]);
 const steps=[['Profilo creato',true,'profilo'],['Scegli un interesse',!!member.interests,'profilo'],['Personalizza l’avatar',marks.results.some(m=>m.mark==='avatar'),'profilo'],['Saluta in piazza',!!progress.greeted,'home'],['Dai voce a una proposta',!!progress.voted,'proposte'],['Scegli un appuntamento',!!progress.booked,'calendario'],['Vieni a trovarci',!!progress.visited,'spazio'],['Lascia una riflessione',!!progress.journal,'profilo/diario']];
 return json({today,greeting:!greeting,weekly:week,bundle:bundle?parse(bundle):null,bundleCost:3,events:events.results.map(parse),decorations:decorations.results.map(d=>d.name).filter(d=>Object.hasOwn(DECORATIONS,d)),equipped:equipped?.decoration||'',onboarding:{done:steps.filter(s=>s[1]).length,total:steps.length,steps},micro:{proposal,activity},totals:await memberTotals(db,id)});
}
export async function greet({db,member}){
 const day=romeDay(Date.now());
 await db.prepare("INSERT OR IGNORE INTO joy_rewards(member_id,kind,ref,cheese,payload) VALUES(?,'greeting',?,1,?)").bind(member.id,day,JSON.stringify({title:'Saluto in Piazza'})).run();
 return json({saved:true,totals:await memberTotals(db,member.id)});
}
export async function claimWeek({db,member}){
 const w=await weekly(db,member.id);
 for(const earned of w.pending){const bonus=Math.min(5,earned.weeks);await db.prepare("INSERT OR IGNORE INTO joy_rewards(member_id,kind,ref,xp,cheese,payload) VALUES(?,'weekly',?,?,?,?)").bind(member.id,earned.week,bonus*5,bonus,JSON.stringify({title:'Fiamma della Settimana',weeks:earned.weeks,week:earned.week})).run();}
 return json({weekly:w,totals:await memberTotals(db,member.id)});
}
export async function bundle({db,member}){
 const week=weekKey(Date.now());
 // La scelta è registrata nella stessa operazione che addebita il costo.
 const prize=['boost','ulivo','grano','stelle'][crypto.getRandomValues(new Uint32Array(1))[0]%4];
 await db.prepare(`INSERT INTO joy_rewards(member_id,kind,ref,xp,cost,payload)
 SELECT ?1,'bundle',?2,5,3,?3 WHERE NOT EXISTS(SELECT 1 FROM joy_rewards WHERE member_id=?1 AND kind='bundle' AND ref=?2)
 AND (SELECT cheese_earned-cheese_spent FROM member_totals WHERE member_id=?1)>=3`).bind(member.id,week,JSON.stringify({title:'Fagotto del Mercante',prize})).run();
 const row=await db.prepare("SELECT * FROM joy_rewards WHERE member_id=? AND kind='bundle' AND ref=?").bind(member.id,week).first();
 if(!row)fail(409,'Servono 3 Tumazzi per il fagotto. Puoi guadagnarli partecipando alle attività.');
 return json({bundle:parse(row),totals:await memberTotals(db,member.id)});
}
export async function equip({db,member,request}){
 const {decoration}=await readJson(request);
 if(typeof decoration!=='string'||decoration!==''&&!Object.hasOwn(DECORATIONS,decoration))fail(400,'Decorazione non valida.');
 if(decoration&&!await db.prepare("SELECT 1 FROM joy_rewards WHERE member_id=? AND kind='bundle' AND json_extract(payload,'$.prize')=?").bind(member.id,decoration).first())fail(403,'Questa cornice non è ancora nella tua collezione.');
 await db.prepare('INSERT INTO joy_cosmetic(member_id,decoration) VALUES(?,?) ON CONFLICT(member_id) DO UPDATE SET decoration=excluded.decoration').bind(member.id,decoration).run();
 return json({saved:true});
}
export async function seen({db,member,request}){
 const {ids}=await readJson(request);
 if(!Array.isArray(ids)||ids.length>30||ids.some(id=>!Number.isSafeInteger(id)||id<1))fail(400,'Ricompense non valide.');
 if(ids.length)await db.prepare(`UPDATE joy_rewards SET seen_at=unixepoch() WHERE member_id=? AND id IN (${ids.map(()=>'?').join(',')}) AND seen_at IS NULL`).bind(member.id,...ids).run();
 return json({saved:true});
}
