import {fail, json, readJson, integer, text} from '../lib/http.mjs';

const STATUSES = ['draft', 'published', 'cancelled'];
const PATH_IDS = ['studio', 'creativita', 'socialita', 'cittadinanza', 'solidarieta'];
const activityPath = value => {
 if (value === undefined || value === null || value === '') return null;
 if (!PATH_IDS.includes(value)) fail(400, 'Percorso non valido.');
 return value;
};

const accessMode = value => {
 if (!['booking', 'open'].includes(value)) fail(400, 'Modalità di accesso non valida.');
 return value;
};
const publicFlag = value => {
 if (typeof value !== 'boolean') fail(400, 'Visibilità evento non valida.');
 return Number(value);
};

// Accetta un istante in secondi Unix oppure una data ISO.
function startsAt(value) {
 const seconds = typeof value === 'number' ? value : Math.floor(Date.parse(String(value)) / 1000);
 if (!Number.isInteger(seconds) || seconds < 946684800 || seconds > 4102444800) fail(400, 'Data e ora non valide.');
 return seconds;
}

const manageSql = `SELECT a.id, a.name, a.starts_at AS startsAt, a.capacity, a.status, a.verification_rule AS verificationRule,
  a.xp, a.cheese, a.path, a.access_mode AS accessMode, a.public_event AS publicEvent,
  (SELECT COUNT(*) FROM bookings b WHERE b.activity_id = a.id AND b.status = 'pending') AS pending,
  (SELECT COUNT(*) FROM bookings b WHERE b.activity_id = a.id AND b.status = 'confirmed') AS confirmed,
  (SELECT COUNT(*) FROM attendance t WHERE t.activity_id = a.id) AS attended
  FROM activities a`;

export async function manage({db}) {
 const {results} = await db.prepare(`${manageSql} ORDER BY a.starts_at DESC LIMIT 200`).all();
 return json({activities: results});
}

export async function create({request, db}) {
 const body = await readJson(request);
 const id = crypto.randomUUID();
 const status = body.status ?? 'draft';
 if (!STATUSES.includes(status)) fail(400, 'Stato non valido.');
 await db.prepare(`INSERT INTO activities (id, name, starts_at, capacity, status, verification_rule, xp, cheese, path, access_mode, public_event)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).bind(
  id, text(body.name, 'Nome', {max: 120}), startsAt(body.startsAt), integer(body.capacity, 'Posti', {min: 1, max: 500}), status,
  text(body.verificationRule, 'Criterio di convalida', {max: 300}),
  integer(body.xp ?? 0, 'XP', {max: 500}), integer(body.cheese ?? 0, 'Formaggi', {max: 200}), activityPath(body.path),
  accessMode(body.accessMode ?? 'booking'), publicFlag(body.publicEvent ?? false)
 ).run();
 return json({activity: await db.prepare(`${manageSql} WHERE a.id = ?`).bind(id).first()}, 201);
}

export async function update({request, db, params}) {
 const body = await readJson(request);
 const sets = [];
 const values = [];
 const put = (column, value) => { sets.push(`${column} = ?`); values.push(value); };
 if ('name' in body) put('name', text(body.name, 'Nome', {max: 120}));
 if ('startsAt' in body) put('starts_at', startsAt(body.startsAt));
 if ('capacity' in body) put('capacity', integer(body.capacity, 'Posti', {min: 1, max: 500}));
 if ('verificationRule' in body) put('verification_rule', text(body.verificationRule, 'Criterio di convalida', {max: 300}));
 if ('xp' in body) put('xp', integer(body.xp, 'XP', {max: 500}));
 if ('cheese' in body) put('cheese', integer(body.cheese, 'Formaggi', {max: 200}));
 if ('path' in body) put('path', activityPath(body.path));
 if ('accessMode' in body) put('access_mode', accessMode(body.accessMode));
 if ('publicEvent' in body) put('public_event', publicFlag(body.publicEvent));
 if ('status' in body) {
  if (!STATUSES.includes(body.status)) fail(400, 'Stato non valido.');
  put('status', body.status);
 }
 if (!sets.length) fail(400, 'Nessuna modifica indicata.');
 try {
  const result = await db.prepare(`UPDATE activities SET ${sets.join(', ')} WHERE id = ?`).bind(...values, params.id).run();
  if (!result.meta.changes) fail(404, 'Attività non trovata.');
 } catch (error) {
  if (String(error).includes('activity_has_bookings')) fail(409, 'Ci sono prenotazioni attive. Mantieni la modalità su prenotazione.');
  if (String(error).includes('capacity_below_bookings')) fail(409, 'I posti non possono essere meno delle prenotazioni attive.');
  throw error;
 }
 return json({activity: await db.prepare(`${manageSql} WHERE a.id = ?`).bind(params.id).first()});
}

export async function bookings({db, params}) {
 const {results} = await db.prepare(`SELECT m.id AS memberId, m.pseudonym AS name, b.status, b.updated_at AS updatedAt,
  EXISTS (SELECT 1 FROM attendance t WHERE t.activity_id = b.activity_id AND t.member_id = b.member_id) AS attended
  FROM bookings b JOIN members m ON m.id = b.member_id WHERE b.activity_id = ?
  ORDER BY b.status = 'pending' DESC, m.pseudonym COLLATE NOCASE`).bind(params.id).all();
 return json({bookings: results.map(r => ({...r, attended: !!r.attended}))});
}

export async function mine({db, member}) {
 const {results} = await db.prepare(`SELECT b.activity_id AS activityId, b.status,
  EXISTS (SELECT 1 FROM attendance t WHERE t.activity_id = b.activity_id AND t.member_id = b.member_id) AS attended
  FROM bookings b WHERE b.member_id = ?`).bind(member.id).all();
 return json({bookings: results.map(r => ({...r, attended: !!r.attended}))});
}
