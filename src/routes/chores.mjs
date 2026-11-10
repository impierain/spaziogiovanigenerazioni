import {tumazzi, fail, json, readJson, integer, text} from '../lib/http.mjs';
import {romeWeekStart} from '../lib/time.mjs';
import {notify, notifyOrganizers} from '../lib/notify.mjs';
import {checkTrophies} from '../lib/trophies.mjs';

// Come per le missioni ripetibili: al massimo 12 Tumazzi a settimana dalle missioni.
export const WEEKLY_CHEESE_CAP = 12;
export const PATHS = ['studio', 'creativita', 'socialita', 'cittadinanza', 'solidarieta'];
const pathOf = value => PATHS.includes(value) ? value : fail(400, 'Percorso non valido.');

const slug = name => name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
 .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'faccenda';

const typeShape = row => ({...row, active: !!row.active});

export async function listTypes({db, member}) {
 const where = member.role === 'organizer' ? '' : 'WHERE active = 1';
 const {results} = await db.prepare(`SELECT id, name, description, xp, cheese, active, path FROM chore_types ${where} ORDER BY active DESC, name COLLATE NOCASE`).all();
 return json({types: results.map(typeShape)});
}

export async function createType({request, db}) {
 const body = await readJson(request);
 const name = text(body.name, 'Nome', {max: 80});
 const id = `${slug(name)}-${crypto.randomUUID().slice(0, 6)}`;
 await db.prepare('INSERT INTO chore_types (id, name, description, xp, cheese, path) VALUES (?, ?, ?, ?, ?, ?)').bind(
  id, name, text(body.description, 'Descrizione', {max: 400, optional: true}) ?? '',
  integer(body.xp ?? 0, 'XP', {max: 500}), integer(body.cheese ?? 0, 'Tumazzi', {max: 200}), pathOf(body.path ?? 'solidarieta')
 ).run();
 const row = await db.prepare('SELECT id, name, description, xp, cheese, active, path FROM chore_types WHERE id = ?').bind(id).first();
 return json({type: typeShape(row)}, 201);
}

export async function updateType({request, db, params}) {
 const body = await readJson(request);
 const sets = [];
 const values = [];
 const put = (column, value) => { sets.push(`${column} = ?`); values.push(value); };
 if ('name' in body) put('name', text(body.name, 'Nome', {max: 80}));
 if ('description' in body) put('description', text(body.description, 'Descrizione', {max: 400, optional: true}) ?? '');
 if ('xp' in body) put('xp', integer(body.xp, 'XP', {max: 500}));
 if ('cheese' in body) put('cheese', integer(body.cheese, 'Tumazzi', {max: 200}));
 if ('path' in body) put('path', pathOf(body.path));
 if ('active' in body) put('active', body.active ? 1 : 0);
 if (!sets.length) fail(400, 'Nessuna modifica indicata.');
 const result = await db.prepare(`UPDATE chore_types SET ${sets.join(', ')} WHERE id = ?`).bind(...values, params.id).run();
 if (!result.meta.changes) fail(404, 'Missione non trovata.');
 const row = await db.prepare('SELECT id, name, description, xp, cheese, active, path FROM chore_types WHERE id = ?').bind(params.id).first();
 return json({type: typeShape(row)});
}

const logSql = `SELECT l.id, l.chore_type_id AS typeId, c.name AS choreName, l.member_id AS memberId,
  m.pseudonym AS memberName, l.note, l.status, l.xp, l.cheese, l.requested_at AS requestedAt, l.decided_at AS decidedAt
  FROM chore_logs l JOIN chore_types c ON c.id = l.chore_type_id JOIN members m ON m.id = l.member_id`;

export async function listLogs({url, db, member}) {
 const isOrganizer = member.role === 'organizer';
 const conditions = [];
 const bindings = [];
 const memberId = isOrganizer ? url.searchParams.get('memberId') : member.id;
 if (memberId) { conditions.push('l.member_id = ?'); bindings.push(memberId); }
 const status = url.searchParams.get('status');
 if (status) {
  if (!['pending', 'verified', 'rejected'].includes(status)) fail(400, 'Stato non valido.');
  conditions.push('l.status = ?'); bindings.push(status);
 }
 const limit = integer(url.searchParams.get('limit') || 100, 'Limite', {min: 1, max: 500});
 const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
 const {results} = await db.prepare(`${logSql} ${where} ORDER BY l.status = 'pending' DESC, l.requested_at DESC LIMIT ?`).bind(...bindings, limit).all();
 return json({chores: results});
}

// Applica la decisione del referente. Il tetto settimanale taglia i Tumazzi, non gli XP.
async function decide(db, logId, organizerId, verdict, env = {}) {
 const log = await db.prepare(`SELECT l.id, l.member_id, l.status, c.xp, c.cheese, c.name
  FROM chore_logs l JOIN chore_types c ON c.id = l.chore_type_id WHERE l.id = ?`).bind(logId).first();
 if (!log) fail(404, 'Missione non trovata.');
 if (log.status !== 'pending') fail(409, 'Questa missione è già stata decisa.');
 let xp = 0;
 let cheese = 0;
 if (verdict === 'verified') {
  const week = await db.prepare(`SELECT COALESCE(SUM(cheese), 0) AS n FROM chore_logs
   WHERE member_id = ? AND status = 'verified' AND decided_at >= ?`).bind(log.member_id, romeWeekStart(Date.now())).first();
  xp = log.xp;
  cheese = Math.max(0, Math.min(log.cheese, WEEKLY_CHEESE_CAP - week.n));
 }
 try {
  const result = await db.prepare(`UPDATE chore_logs SET status = ?, xp = ?, cheese = ?, decided_at = unixepoch(), decided_by = ?
   WHERE id = ? AND status = 'pending'`).bind(verdict, xp, cheese, organizerId, logId).run();
  if (!result.meta.changes) fail(409, 'Questa missione è già stata decisa.');
 } catch (error) {
  if (String(error).includes('chore_not_authorized')) fail(403, 'Non puoi decidere su una tua missione.');
  throw error;
 }
 const cheeseCapped = verdict === 'verified' && cheese < log.cheese;
 await notify(db, log.member_id, verdict === 'verified'
  ? {kind: 'faccenda', level: 'ok', title: `Missione confermata: ${log.name}`, body: `Hai ricevuto ${xp} XP e ${tumazzi(cheese)}.${cheeseCapped ? ' I Tumazzi sono ridotti per il limite settimanale.' : ''}`}
  : {kind: 'faccenda', level: 'info', title: `Missione non confermata: ${log.name}`, body: 'Un referente non l’ha convalidata. Chiedi a lui il motivo.'});
 if (verdict === 'verified') await checkTrophies(env, db, log.member_id);
 return {id: logId, status: verdict, xp, cheese, cheeseCapped};
}

export async function createLog({request, env, db, member}) {
 const body = await readJson(request);
 const choreType = await db.prepare('SELECT id FROM chore_types WHERE id = ? AND active = 1').bind(text(body.typeId, 'Missione', {max: 80})).first();
 if (!choreType) fail(404, 'Missione non trovata.');
 const onBehalf = member.role === 'organizer' && body.memberId && body.memberId !== member.id;
 const memberId = onBehalf ? text(body.memberId, 'Socio', {max: 64}) : member.id;
 const target = await db.prepare(`SELECT id FROM members WHERE id = ? AND status = 'approved'`).bind(memberId).first();
 if (!target) fail(404, 'Socio non trovato o non attivo.');
 const note = text(body.note, 'Nota', {max: 500, optional: true}) ?? '';
 const inserted = await db.prepare('INSERT INTO chore_logs (chore_type_id, member_id, note) VALUES (?, ?, ?)').bind(choreType.id, memberId, note).run();
 const id = inserted.meta.last_row_id;
 if (!onBehalf) {
  const name = await db.prepare('SELECT pseudonym FROM members WHERE id = ?').bind(memberId).first();
  const type = await db.prepare('SELECT name FROM chore_types WHERE id = ?').bind(choreType.id).first();
  await notifyOrganizers(db, memberId, {kind: 'faccenda', level: 'info', title: `Nuova missione da verificare: ${type?.name ?? ''}`, body: `Richiesta di ${name?.pseudonym ?? 'un socio'}. Vai in Referenti → Missioni.`});
 }
 // Un referente che registra la missione di un altro socio la convalida subito.
 const outcome = onBehalf ? await decide(db, id, member.id, 'verified', env) : null;
 const row = await db.prepare(`${logSql} WHERE l.id = ?`).bind(id).first();
 return json({chore: row, outcome}, 201);
}

const choreId = params => {
 const id = Number(params.id);
 if (!Number.isInteger(id)) fail(404, 'Missione non trovata.');
 return id;
};

export async function verify({env, db, member, params}) {
 return json({outcome: await decide(db, choreId(params), member.id, 'verified', env)});
}

export async function reject({db, member, params}) {
 return json({outcome: await decide(db, choreId(params), member.id, 'rejected')});
}
