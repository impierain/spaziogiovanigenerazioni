import {fail, json, readJson, integer, text} from '../lib/http.mjs';

const STALE_SECONDS = 16 * 3600; // un ingresso senza uscita dopo 16 ore si considera dimenticato

export async function lastAccess(db, memberId) {
 return db.prepare('SELECT direction, at FROM accessi WHERE member_id = ? ORDER BY at DESC, id DESC LIMIT 1').bind(memberId).first();
}

// Registra un ingresso o un'uscita. Se la direzione manca si alterna all'ultima.
export async function recordAccess(db, {memberId, direction, at, source, deviceId = null, recordedBy = null}) {
 const last = await lastAccess(db, memberId);
 const inside = last?.direction === 'IN' && at - last.at < STALE_SECONDS;
 const next = direction ?? (inside ? 'OUT' : 'IN');
 if (next === 'IN' && inside) fail(409, 'Il socio risulta già dentro.');
 if (next === 'OUT' && !inside) fail(409, 'Il socio non risulta dentro: manca un ingresso.');
 if (last && at < last.at) fail(409, 'Esiste già una registrazione più recente per questo socio.');
 try {
  await db.prepare(`INSERT INTO accessi (member_id, direction, at, source, device_id, recorded_by)
   VALUES (?, ?, ?, ?, ?, ?)`).bind(memberId, next, at, source, deviceId, recordedBy).run();
 } catch (error) {
  if (String(error).includes('UNIQUE')) fail(409, 'Registrazione già presente.');
  throw error;
 }
 return {direction: next, at, sinceMinutes: next === 'OUT' && last ? Math.round((at - last.at) / 60) : null};
}

export async function create({request, db, member}) {
 const body = await readJson(request);
 const memberId = text(body.memberId, 'Socio', {max: 64});
 const target = await db.prepare(`SELECT id, pseudonym FROM members WHERE id = ? AND status = 'approved'`).bind(memberId).first();
 if (!target) fail(404, 'Socio non trovato o non attivo.');
 const now = Math.floor(Date.now() / 1000);
 const at = body.at === undefined ? now : integer(body.at, 'Orario', {min: now - 14 * 86400, max: now});
 if (body.direction !== undefined && !['IN', 'OUT'].includes(body.direction)) fail(400, 'Direzione non valida.');
 const result = await recordAccess(db, {memberId, direction: body.direction, at, source: 'pannello', recordedBy: member.id});
 return json({access: {...result, memberId, name: target.pseudonym}}, 201);
}

export async function list({url, db, member}) {
 const isOrganizer = member.role === 'organizer';
 const requested = url.searchParams.get('memberId');
 const memberId = isOrganizer ? requested : member.id;
 if (!isOrganizer && requested && requested !== member.id) fail(403, 'Accesso non consentito.');
 const now = Math.floor(Date.now() / 1000);
 const from = integer(url.searchParams.get('from') || now - 30 * 86400, 'Da', {min: 0, max: now + 86400});
 const to = integer(url.searchParams.get('to') || now + 86400, 'A', {min: 0, max: now + 10 * 86400});
 const limit = integer(url.searchParams.get('limit') || 200, 'Limite', {min: 1, max: 1000});
 const filter = memberId ? 'AND a.member_id = ?' : '';
 const bindings = memberId ? [from, to, memberId, limit] : [from, to, limit];
 const {results} = await db.prepare(`SELECT a.id, a.member_id AS memberId, m.pseudonym AS name, a.direction, a.at, a.source
  FROM accessi a JOIN members m ON m.id = a.member_id
  WHERE a.at >= ? AND a.at <= ? ${filter} ORDER BY a.at DESC, a.id DESC LIMIT ?`).bind(...bindings).all();
 return json({accessi: results});
}

// Chi è in sede adesso: ultimo movimento = ingresso, non più vecchio di 16 ore.
export async function presenti({db}) {
 const since = Math.floor(Date.now() / 1000) - STALE_SECONDS;
 const {results} = await db.prepare(`SELECT m.id, m.pseudonym AS name, a.at AS since
  FROM members m JOIN accessi a ON a.id = (SELECT id FROM accessi WHERE member_id = m.id ORDER BY at DESC, id DESC LIMIT 1)
  WHERE a.direction = 'IN' AND a.at > ? AND m.status = 'approved' ORDER BY a.at`).bind(since).all();
 return json({presenti: results});
}

// Stato pubblico della sede: aperta quando c'è almeno una persona dentro.
// Il numero di persone lo vedono solo i soci con l'accesso.
export const OPENING = {days: 'Da lunedì a venerdì', hours: '16:00–20:00'};
export async function status({db, member}) {
 const since = Math.floor(Date.now() / 1000) - STALE_SECONDS;
 const row = await db.prepare(`SELECT COUNT(*) AS n FROM members m
  JOIN accessi a ON a.id = (SELECT id FROM accessi WHERE member_id = m.id ORDER BY at DESC, id DESC LIMIT 1)
  WHERE a.direction = 'IN' AND a.at > ? AND m.status = 'approved'`).bind(since).first();
 const count = row?.n ?? 0;
 const body = {open: count > 0, ...OPENING};
 if (member) body.count = count;
 return new Response(JSON.stringify(body), {status: 200, headers: {'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store'}});
}
