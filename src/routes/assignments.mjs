import {notifyOrganizers} from '../lib/notify.mjs';
import {json,fail,readJson,text,integer} from '../lib/http.mjs';
export async function list({db,member}){
 const {results}=await db.prepare(`SELECT a.*,t.name,t.description,t.path,t.xp,t.cheese FROM chore_assignments a JOIN chore_types t ON t.id=a.type_id WHERE a.member_id=? ORDER BY a.taken_at DESC,a.id DESC LIMIT 200`).bind(member.id).all();
 return json({assignments:results});
}
export async function take({db,member,request}){
 const b=await readJson(request),id=text(b.typeId,'Mansione',{max:80});
 try{
  await db.prepare(`INSERT INTO chore_assignments(member_id,type_id) SELECT ?,? WHERE NOT EXISTS(SELECT 1 FROM chore_assignments WHERE member_id=? AND type_id=? AND state IN ('in_progress','submitted'))`).bind(member.id,id,member.id,id).run();
 }catch(e){if(String(e).includes('assignment_unavailable'))fail(409,'Mansione non disponibile.');throw e;}
 const assignment=await db.prepare("SELECT id,state FROM chore_assignments WHERE member_id=? AND type_id=? AND state IN ('in_progress','submitted')").bind(member.id,id).first();
 return json({assignment});
}
export async function finish({db,member,request,params}){
 const b=await readJson(request),id=integer(Number(params.id),'Mansione',{min:1});
 const note=text(b.note,'Nota',{max:500,optional:true})||'';
 try{
  const r=await db.prepare("UPDATE chore_assignments SET note=?,state='submitted' WHERE id=? AND member_id=? AND state='in_progress'").bind(note,id,member.id).run();
  if(!r.meta.changes)fail(409,'Mansione già inviata o non presa in carico.');
 }catch(e){if(String(e).includes('assignment_checkin_required'))fail(409,'Prima di dichiarare il completamento devi fare il check-in in sede.');throw e;}
 await notifyOrganizers(db,member.id,{kind:'faccenda',title:'Mansione da convalidare',body:'Una mansione è stata dichiarata completata. Controlla Referenti → Missioni.'});
 return json({submitted:true});
}
export async function abandon({db,member,params}){
 const id=integer(Number(params.id),'Mansione',{min:1});
 const r=await db.prepare("UPDATE chore_assignments SET state='abandoned' WHERE id=? AND member_id=? AND state='in_progress'").bind(id,member.id).run();
 if(!r.meta.changes)fail(409,'Questa mansione non è più in corso.');
 return json({abandoned:true});
}
