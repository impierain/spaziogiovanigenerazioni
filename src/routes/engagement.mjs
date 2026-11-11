import {json, readJson, fail} from '../lib/http.mjs';
import {romeDay} from '../lib/time.mjs';
import {streakDays} from './stats.mjs';
import {TROPHIES} from '../lib/trophies.mjs';

export function calendarStreak(days, today) {
 const sorted=[...new Set(days)].filter(d=>d<=today).sort();
 const step=86400000;
 let best=0, run=0, previous=null;
 for(const day of sorted){const value=Date.parse(day);run=previous!==null&&value-previous===step?run+1:1;best=Math.max(best,run);previous=value;}
 const have=new Set(sorted);let cursor=Date.parse(today),current=0;
 if(!have.has(today))cursor-=step;
 while(have.has(new Date(cursor).toISOString().slice(0,10))){current++;cursor-=step;}
 return {current,best};
}
export async function visit({db, member}) {
 const today=romeDay(Date.now());
 await db.prepare('INSERT OR IGNORE INTO app_visit_days (member_id, day) VALUES (?, ?)').bind(member.id,today).run();
 return json({saved:true,day:today});
}
export async function streaks({db, member}) {
 const [opens,visits,sharing]=await Promise.all([
  db.prepare('SELECT day FROM app_visit_days WHERE member_id = ? ORDER BY day').bind(member.id).all(),
  db.prepare("SELECT at FROM accessi WHERE member_id = ? AND direction = 'IN' ORDER BY at").bind(member.id).all(),
  db.prepare('SELECT enabled_at FROM achievement_sharing WHERE member_id = ?').bind(member.id).first()
 ]);
 return json({app:calendarStreak(opens.results.map(r=>r.day),romeDay(Date.now())),sede:streakDays(new Set(visits.results.map(r=>romeDay(r.at*1000))),Date.now()),sharing:!!sharing});
}
export async function share({db, member, request}) {
 const body=await readJson(request);
 if(typeof body.enabled!=='boolean')fail(400,'Scegli se partecipare alla bacheca.');
 if(body.enabled)await db.prepare('INSERT OR IGNORE INTO achievement_sharing (member_id) VALUES (?)').bind(member.id).run();
 else await db.prepare('DELETE FROM achievement_sharing WHERE member_id = ?').bind(member.id).run();
 return json({enabled:body.enabled});
}
export async function board({db}) {
 // Only real-world achievements, voluntarily shared after consent. No location or account IDs.
 const eligible=TROPHIES.filter(t=>!['votes','proposals'].includes(t.metric));
 const ids=eligible.map(t=>t.id);
 const row=await db.prepare(`SELECT m.pseudonym, t.trophy_id, t.awarded_at FROM trophies_awarded t
 JOIN achievement_sharing s ON s.member_id=t.member_id
 JOIN members m ON m.id=t.member_id
 WHERE m.status='approved' AND t.awarded_at>=s.enabled_at AND t.trophy_id IN (${ids.map(()=>'?').join(',')})
 ORDER BY t.awarded_at DESC, t.rowid DESC LIMIT 1`).bind(...ids).first();
 const team=await db.prepare(`SELECT m.pseudonym,t.name,t.awarded_at FROM team_badges t JOIN achievement_sharing s ON s.member_id=t.member_id JOIN members m ON m.id=t.member_id WHERE m.status='approved' AND t.awarded_at>=s.enabled_at ORDER BY t.awarded_at DESC,t.rowid DESC LIMIT 1`).first();
 if(team&&(!row||team.awarded_at>=row.awarded_at))return json({latest:{pseudonym:team.pseudonym,trophy:team.name}});
 return json({latest:row?{pseudonym:row.pseudonym,trophy:eligible.find(t=>t.id===row.trophy_id).name}:null});
}
