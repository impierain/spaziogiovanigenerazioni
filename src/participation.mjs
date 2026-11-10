import {tumazzi} from './lib/http.mjs';
import {sessionToken, tokenHash} from './tokens.mjs';
import {notify} from './lib/notify.mjs';
import {checkTrophies} from './lib/trophies.mjs';

const romeDate = new Intl.DateTimeFormat('sv-SE', {timeZone:'Europe/Rome', year:'numeric', month:'2-digit', day:'2-digit'});
const json = (body,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store'}});
const query = (db,sql,...bindings)=>db.prepare(sql).bind(...bindings);

const notifyMember=(db,memberId,level,title,body='')=>notify(db,memberId,{kind:'attivita',level,title,body});
const activityName=async(db,id)=>(await query(db,'SELECT name FROM activities WHERE id=?',id).first())?.name??'';

async function sessionMember(request,db){
 const hash=await tokenHash(sessionToken(request));
 if(!hash)return null;
 return query(db,`SELECT m.id,m.role,m.status FROM sessions s JOIN members m ON m.id=s.member_id
 WHERE s.token_hash=? AND s.expires_at>unixepoch() AND m.status='approved'`,hash).first();
}

export async function handleParticipation(request,db,env={}){
 const url=new URL(request.url);
 const path=url.pathname.split('/');
 const [,api,resource,activity,action]=path;
 if(api!=='api'||resource!=='activities'||path.length>5)return json({error:'Percorso non trovato.'},404);

 if(request.method==='GET'&&!activity){
  const {results}=await db.prepare(`SELECT a.id,a.name,a.description,a.starts_at,a.capacity,a.verification_rule,a.path,a.access_mode,a.public_event,
   a.capacity-COUNT(b.member_id) AS available
   FROM activities a LEFT JOIN bookings b ON b.activity_id=a.id AND b.status IN ('pending','confirmed')
   WHERE a.status='published' GROUP BY a.id ORDER BY a.starts_at`).all();
  return json({activities:results});
 }

 if(request.method!=='POST'||!activity||!action)return json({error:'Operazione non supportata.'},405);
 if(request.headers.get('Origin')!==url.origin)return json({error:'Origine della richiesta non valida.'},403);
 const actor=await sessionMember(request,db);
 if(!actor)return json({error:'Serve un account approvato.'},401);

 if(action==='reserve'){
  try {
   await query(db,`INSERT INTO bookings (activity_id,member_id,status)
    SELECT ?,?,'pending' WHERE EXISTS (SELECT 1 FROM activities WHERE id=? AND access_mode='booking')
    AND NOT EXISTS (SELECT 1 FROM bookings WHERE activity_id=? AND member_id=? AND status IN ('pending','confirmed'))
    ON CONFLICT(activity_id,member_id) DO UPDATE SET status='pending',updated_at=unixepoch()
    WHERE bookings.status IN ('declined','cancelled')`,activity,actor.id,activity,activity,actor.id).run();
  } catch(error){
   if(String(error).includes('booking_unavailable'))return json({error:'La prenotazione non è disponibile.'},409);
   throw error;
  }
  const booking=await query(db,'SELECT status FROM bookings WHERE activity_id=? AND member_id=?',activity,actor.id).first();
  return ['pending','confirmed'].includes(booking?.status)?json({status:booking.status}):json({error:'La prenotazione non è disponibile.'},409);
 }

 if(action==='cancel'){
  const result=await query(db,`UPDATE bookings SET status='cancelled',updated_at=unixepoch()
   WHERE activity_id=? AND member_id=? AND status IN ('pending','confirmed')`,activity,actor.id).run();
  return result.meta.changes?json({status:'cancelled'}):json({error:'Nessuna prenotazione attiva.'},404);
 }

 if(!['confirm','decline','attendance'].includes(action))return json({error:'Operazione non supportata.'},405);
 if(actor.role!=='organizer')return json({error:'Operazione riservata ai referenti.'},403);
 const body=await request.json().catch(()=>null);
 const member=body?.memberId;
 if(typeof member!=='string'||!member||member.length>128)return json({error:'Seleziona il partecipante.'},400);

 if(action==='confirm'||action==='decline'){
  const status=action==='confirm'?'confirmed':'declined';
  const result=await query(db,`UPDATE bookings SET status=?,updated_at=unixepoch()
   WHERE activity_id=? AND member_id=? AND status='pending'
   AND EXISTS (SELECT 1 FROM members WHERE id=? AND role='organizer' AND status='approved')
   AND EXISTS (SELECT 1 FROM activities WHERE id=? AND status='published' AND starts_at>unixepoch())`,
   status,activity,member,actor.id,activity).run();
  if(!result.meta.changes)return json({error:'La richiesta non è più in attesa o l’attività non è prenotabile.'},409);
  await notifyMember(db,member,status==='confirmed'?'ok':'info',status==='confirmed'?'Prenotazione confermata':'Prenotazione non accettata',await activityName(db,activity));
  return json({status});
 }

 const event=await query(db,`SELECT starts_at FROM activities WHERE id=? AND status='published'`,activity).first();
 const now=Date.now();
 if(!event||event.starts_at*1000>now||romeDate.format(event.starts_at*1000)!==romeDate.format(now)){
  return json({error:'La presenza si registra dopo l’inizio e nella stessa giornata.'},409);
 }
 let inserted;
 try {
  inserted=await query(db,`INSERT INTO attendance(activity_id,member_id,verified_by,xp,cheese)
   SELECT id,?,?,xp,cheese FROM activities WHERE id=? AND starts_at=?
   ON CONFLICT(activity_id,member_id) DO NOTHING`,member,actor.id,activity,event.starts_at).run();
 } catch(error){
  if(String(error).includes('attendance_not_authorized'))return json({error:'Questa presenza non può essere convalidata.'},409);
  throw error;
 }
 const attendance=await query(db,'SELECT xp,cheese FROM attendance WHERE activity_id=? AND member_id=?',activity,member).first();
 if(!attendance)return json({error:'L’attività è stata modificata. Riprova.'},409);
 if(inserted.meta.changes){
  await notifyMember(db,member,'ok','Presenza registrata',`${await activityName(db,activity)}: +${attendance.xp} XP e +${tumazzi(attendance.cheese)}.`);
  await checkTrophies(env,db,member);
 }
 return json({attendance});
}
