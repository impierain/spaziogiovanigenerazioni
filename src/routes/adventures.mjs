import {json,fail,readJson,text,integer} from '../lib/http.mjs';
import {notify} from '../lib/notify.mjs';
import {romeDay,romeDayStart} from '../lib/time.mjs';

export const CURIOSITIES=[
 {text:'Sui Sicani si conservano tracce delle neviere: erano usate per conservare il ghiaccio prima dei frigoriferi.',source:'https://www.italia.it/it/sicilia/cammarata'},
 {text:'Il castello medievale normanno domina Cammarata: un segno della lunga storia del borgo, tra le pendici dei Sicani.',source:'https://www.italia.it/it/sicilia/cammarata'}
];
function result(row){return row?{kind:row.kind,day:row.day,expiresAt:row.expires_at,curiosity:row.kind==='curiosity'?CURIOSITIES[row.curiosity]:null}:null;}
export function randomPrize(){
 let n;do{n=crypto.getRandomValues(new Uint32Array(1))[0];}while(n>=4294967295);
 return ['xp','curiosity','boost'][n%3];
}
export async function daily({db,member}){
 const row=await db.prepare('SELECT * FROM daily_wheel WHERE member_id=? AND day=?').bind(member.id,romeDay(Date.now())).first();
 return json({prize:result(row)});
}
export async function spin({db,member}){
 const day=romeDay(Date.now()),kind=randomPrize();
 const expires=romeDayStart(Date.parse(day+'T12:00:00Z')+86400000);
 const pick=crypto.getRandomValues(new Uint32Array(1))[0]%CURIOSITIES.length;
 await db.prepare('INSERT OR IGNORE INTO daily_wheel(member_id,day,kind,curiosity,expires_at) VALUES(?,?,?,?,?)').bind(member.id,day,kind,pick,expires).run();
 const row=await db.prepare('SELECT * FROM daily_wheel WHERE member_id=? AND day=?').bind(member.id,day).first();
 return json({prize:result(row)});
}
export async function teams({db,member}){
 const {results}=await db.prepare(`SELECT q.*,(SELECT COUNT(*) FROM team_signups WHERE quest_id=q.id) AS joined,
 EXISTS(SELECT 1 FROM team_signups WHERE quest_id=q.id AND member_id=?) AS mine FROM team_quests q ORDER BY q.rowid DESC`).bind(member.id).all();
 const {results:badges}=await db.prepare('SELECT quest_id,name,awarded_at FROM team_badges WHERE member_id=? ORDER BY awarded_at DESC').bind(member.id).all();
 let roster=[];
 if(member.role==='organizer')roster=(await db.prepare(`SELECT s.quest_id,s.member_id,m.pseudonym FROM team_signups s JOIN members m ON m.id=s.member_id`).all()).results;
 return json({quests:results,badges,roster});
}
export async function createTeam({db,member,request}){
 const b=await readJson(request),id=crypto.randomUUID();
 await db.prepare('INSERT INTO team_quests(id,title,description,needed,xp,badge,created_by) VALUES(?,?,?,?,?,?,?)').bind(id,text(b.title,'Titolo',{max:100}),text(b.description,'Descrizione',{max:600,optional:true})||'',integer(b.needed,'Persone',{min:2,max:20}),integer(b.xp,'Bonus XP',{max:100}),text(b.badge,'Trofeo squadra',{max:60}),member.id).run();
 return json({id},201);
}
export async function join({db,member,params}){
 if(await db.prepare('SELECT 1 FROM team_signups WHERE quest_id=? AND member_id=?').bind(params.id,member.id).first())return json({joined:true});
 try{await db.prepare('INSERT INTO team_signups(quest_id,member_id) SELECT ?,? WHERE NOT EXISTS(SELECT 1 FROM team_signups WHERE quest_id=? AND member_id=?)').bind(params.id,member.id,params.id,member.id).run();}
 catch(e){if(String(e).includes('team_full'))fail(409,'Squadra completa o impresa non più disponibile.');throw e;}
 return json({joined:true});
}
export async function leave({db,member,params}){
 try{await db.prepare(`DELETE FROM team_signups WHERE quest_id=? AND member_id=? AND EXISTS(SELECT 1 FROM team_quests WHERE id=? AND status IN ('forming','ready'))`).bind(params.id,member.id,params.id).run();}
 catch{fail(409,'L’impresa è già conclusa.');}
 return json({left:true});
}
export async function complete({db,member,params,request}){
 const b=await readJson(request);
 if(b.verified!==true)fail(400,'Conferma di aver verificato il lavoro e la presenza di tutta la squadra.');
 try{
  const r=await db.prepare(`UPDATE team_quests SET status='completed',verified_by=?,completed_at=unixepoch() WHERE id=? AND status='ready'`).bind(member.id,params.id).run();
  if(!r.meta.changes)fail(409,'Impresa non pronta o già conclusa.');
 }catch(e){if(String(e).includes('team_not_verifiable'))fail(409,'Squadra incompleta, socio non attivo oppure stai verificando una tua impresa.');throw e;}
 const {results}=await db.prepare('SELECT member_id FROM team_signups WHERE quest_id=?').bind(params.id).all();
 await Promise.all(results.map(r=>notify(db,r.member_id,{kind:'impresa',title:'Impresa completata!',body:'Hai ricevuto il bonus XP e il trofeo di squadra. Li trovi nel Profilo e nei Trofei.'})));
 return json({completed:true});
}
export async function cancel({db,params}){
 const r=await db.prepare("UPDATE team_quests SET status='cancelled' WHERE id=? AND status IN ('forming','ready')").bind(params.id).run();
 if(!r.meta.changes)fail(409,'Impresa già conclusa o annullata.');
 return json({cancelled:true});
}
