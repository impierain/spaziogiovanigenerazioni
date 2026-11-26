import {microAward} from './joy.mjs';
import {tumazzi, fail, json, readJson, text, integer} from '../lib/http.mjs';
import {notify, notifyOrganizers, pushOrganizers} from '../lib/notify.mjs';
import {checkTrophies} from '../lib/trophies.mjs';

const MAX_OPEN = 3;
export const PROPOSAL_XP = 15;
export const PROPOSAL_CHEESE = 2;

export async function list({db, member}) {
 const {results} = await db.prepare(`SELECT p.id, p.title, p.description, p.status, p.activity_id AS activityId, p.created_at AS createdAt,
   p.member_id AS memberId, m.pseudonym AS memberName,
   (SELECT COUNT(*) FROM proposal_votes v WHERE v.proposal_id = p.id) AS votes,
   EXISTS (SELECT 1 FROM proposal_votes v WHERE v.proposal_id = p.id AND v.member_id = ?1) AS voted
   FROM proposals p JOIN members m ON m.id = p.member_id
   ORDER BY (p.status = 'open') DESC, votes DESC, p.created_at DESC LIMIT 100`).bind(member.id).all();
 return json({proposals: results.map(p => ({...p, voted: !!p.voted, mine: p.memberId === member.id})), reward: {xp: PROPOSAL_XP, cheese: PROPOSAL_CHEESE}});
}

export async function create({request, env, db, member}) {
 const body = await readJson(request);
 const open = (await db.prepare(`SELECT COUNT(*) AS n FROM proposals WHERE member_id = ? AND status = 'open'`).bind(member.id).first()).n;
 if (open >= MAX_OPEN) fail(409, `Puoi avere al massimo ${MAX_OPEN} proposte aperte.`);
 const res = await db.prepare('INSERT INTO proposals (member_id, title, description) VALUES (?, ?, ?)').bind(
  member.id, text(body.title, 'Titolo', {max: 100}), text(body.description, 'Descrizione', {max: 600, optional: true}) ?? '').run();
 await notifyOrganizers(db, member.id, {kind: 'proposta', level: 'info', title: `Nuova proposta: ${String(body.title).slice(0, 60)}`, body: `Di ${member.pseudonym}. Il gruppo può votarla.`});
 await pushOrganizers(env, db, member.id, {title: `Nuova proposta: ${String(body.title).slice(0, 60)}`, body: `Di ${member.pseudonym}. Il gruppo può votarla.`, url: '/#proposte'});
 await checkTrophies(env, db, member.id);
 return json({id: res.meta.last_row_id}, 201);
}

export async function vote({request, env, db, member, params}) {
 const body = await readJson(request);
 const p = await db.prepare(`SELECT id, member_id FROM proposals WHERE id = ? AND status = 'open'`).bind(Number(params.id)).first();
 if (!p) fail(404, 'Proposta non trovata o già chiusa.');
 if (p.member_id === member.id) fail(409, 'Non puoi votare una tua proposta.');
 if (body.on === false) await db.prepare('DELETE FROM proposal_votes WHERE proposal_id = ? AND member_id = ?').bind(p.id, member.id).run();
 else {
  const inserted=await db.prepare('INSERT OR IGNORE INTO proposal_votes (proposal_id, member_id) VALUES (?, ?)').bind(p.id, member.id).run();
  if(inserted.meta.changes)await microAward(db,member.id,'voto');
  await checkTrophies(env, db, member.id);
 }
 const votes = (await db.prepare('SELECT COUNT(*) AS n FROM proposal_votes WHERE proposal_id = ?').bind(p.id).first()).n;
 return json({votes, voted: body.on !== false});
}

// Un referente porta la proposta in calendario: nasce un'attività in bozza e chi l'ha proposta riceve un premio.
export async function schedule({request, env, db, member, params}) {
 const body = await readJson(request);
 const p = await db.prepare(`SELECT id, title, description, member_id FROM proposals WHERE id = ? AND status = 'open'`).bind(Number(params.id)).first();
 if (!p) fail(404, 'Proposta non trovata o già chiusa.');
 if (p.member_id === member.id) fail(409, 'Una proposta tua la porta in calendario un altro referente.');
 const now = Math.floor(Date.now() / 1000);
 const startsAt = Number(body.startsAt);
 if (!Number.isInteger(startsAt)) fail(400, 'Scegli la data e l’ora dell’evento.');
 if (startsAt <= now) fail(400, 'La data scelta è già passata: scegli un giorno e un’ora futuri.');
 if (startsAt > now + 365 * 86400) fail(400, 'La data è troppo lontana: scegli un giorno entro un anno.');
 const activityId = crypto.randomUUID();
 const results = await db.batch([
  db.prepare(`INSERT INTO activities (id, name, starts_at, capacity, status, verification_rule, xp, cheese, description) VALUES (?, ?, ?, 20, 'draft', ?, 30, 3, ?)`).bind(
   activityId, p.title.slice(0, 120), startsAt, 'Il referente verifica di persona la presenza durante l’evento e la registra nella stessa giornata.', p.description),
  db.prepare(`UPDATE proposals SET status = 'scheduled', activity_id = ? WHERE id = ? AND status = 'open'`).bind(activityId, p.id),
  // Il premio nasce solo se questa richiesta ha davvero spostato la proposta in calendario.
  db.prepare(`INSERT INTO awards (member_id, source, ref, title, xp, cheese)
   SELECT ?, 'proposta', ?, ?, ?, ? WHERE EXISTS (SELECT 1 FROM proposals WHERE id = ? AND activity_id = ? AND status = 'scheduled')`).bind(
   p.member_id, String(p.id), `Proposta accolta: ${p.title}`.slice(0, 120), PROPOSAL_XP, PROPOSAL_CHEESE, p.id, activityId)
 ]);
 if (!results[1].meta.changes) {
  // Un'altra richiesta contemporanea ha già portato in calendario questa proposta: tolgo la bozza in più.
  await db.prepare('DELETE FROM activities WHERE id = ?').bind(activityId).run();
  fail(409, 'Questa proposta è già stata portata in calendario.');
 }
 await notify(db, p.member_id, {kind: 'proposta', level: 'ok', title: `La tua proposta va in calendario: ${p.title}`, body: `+${PROPOSAL_XP} XP e +${tumazzi(PROPOSAL_CHEESE)}.`});
 const when = new Intl.DateTimeFormat('it-IT', {timeZone: 'Europe/Rome', weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'}).format(new Date(startsAt * 1000));
 await checkTrophies(env, db, p.member_id);
 return json({activityId}, 201);
}

export async function decline({db, params}) {
 const p = await db.prepare(`SELECT id, member_id, title FROM proposals WHERE id = ? AND status = 'open'`).bind(Number(params.id)).first();
 if (!p) fail(404, 'Proposta non trovata o già chiusa.');
 await db.prepare(`UPDATE proposals SET status = 'declined' WHERE id = ?`).bind(p.id).run();
 await notify(db, p.member_id, {kind: 'proposta', level: 'info', title: `Proposta non accolta: ${p.title}`, body: 'Per ora non entra in calendario. Puoi proporne un’altra.'});
 return json({status: 'declined'});
}
