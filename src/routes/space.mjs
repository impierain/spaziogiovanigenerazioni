import {romeDay, romeOffset} from '../lib/time.mjs';
import {fail, integer, json, readJson, text} from '../lib/http.mjs';

async function getSetting(db, key) {
 const row = await db.prepare('SELECT text_value FROM app_settings WHERE key = ?').bind(key).first();
 return row ? JSON.parse(row.text_value) : null;
}

async function setSetting(db, key, value) {
 await db.prepare(`INSERT INTO app_settings (key, text_value) VALUES (?, ?)
  ON CONFLICT(key) DO UPDATE SET text_value = excluded.text_value, updated_at = unixepoch()`)
  .bind(key, JSON.stringify(value)).run();
}

function lines(value, label, max, optional = false) {
 if (typeof value !== 'string' || value.length > max || (!optional && !value.trim())) {
  fail(400, `${label}: ${optional ? 'al massimo' : 'da 1 a'} ${max} caratteri.`);
 }
 return value.trim();
}

export async function visit({db}) {
 return json({visit: await getSetting(db, 'visit_public')});
}

export async function saveVisit({request, db}) {
 const body = await readJson(request);
 const details = {
  address: text(body.address, 'Indirizzo', {max: 200, optional: true}) ?? '',
  access: lines(body.access ?? '', 'Modalità di accesso', 600, true),
  accessibility: lines(body.accessibility ?? '', 'Accessibilità', 600, true)
 };
 await setSetting(db, 'visit_public', details);
 return json({visit: details});
}

export async function assembly({db}) {
 const [{results}, meeting] = await Promise.all([
  db.prepare(`SELECT id, decided_on AS decidedOn, title, decision, reason, responsible, status
   FROM assembly_decisions ORDER BY decided_on DESC, id DESC`).all(),
  getSetting(db, 'next_assembly')
 ]);
 return json({meeting, decisions: results});
}

function meetingTime(value) {
 if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) fail(400, 'Data e ora non valide.');
 const wall = Date.parse(value + ':00Z');
 if (!Number.isFinite(wall) || new Date(wall).toISOString().slice(0, 16) !== value) fail(400, 'Data e ora non valide.');
 const instant = wall - romeOffset(wall - romeOffset(wall));
 if (instant + romeOffset(instant) !== wall) fail(400, 'Ora locale non valida.');
 return integer(instant / 1000, 'Data e ora', {min: Math.floor(Date.now() / 1000), max: 4102444800});
}

export async function saveAssembly({request, db}) {
 const body = await readJson(request);
 const meeting = body.clear === true ? null : {
  startsAt: meetingTime(body.startsAt),
  location: text(body.location, 'Luogo', {max: 160}),
  agenda: lines(body.agenda, 'Ordine del giorno', 1600)
 };
 await setSetting(db, 'next_assembly', meeting);
 return json({meeting});
}

export async function saveDecision({request, db, params}) {
 const body = await readJson(request);
 const date = body.decidedOn;
 const parsed = typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)
  ? new Date(date + 'T00:00:00Z') : null;
 if (!parsed || !Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) {
  fail(400, 'Data della decisione non valida.');
 }
 const today = romeDay(Date.now());
 if (date > today) fail(400, 'La decisione deve essere già stata presa in assemblea.');
 if (!['planned', 'in_progress', 'done'].includes(body.status)) fail(400, 'Stato non valido.');
 const values = [date, text(body.title, 'Titolo', {max: 120}),
  lines(body.decision, 'Decisione', 1000), lines(body.reason, 'Motivazione', 1000),
  text(body.responsible, 'Gruppo o ruolo responsabile', {max: 120}), body.status];
 if (params.id === undefined) {
  const result = await db.prepare(`INSERT INTO assembly_decisions
   (decided_on, title, decision, reason, responsible, status) VALUES (?, ?, ?, ?, ?, ?)`).bind(...values).run();
  return json({id: result.meta.last_row_id}, 201);
 }
 const result = await db.prepare(`UPDATE assembly_decisions
  SET decided_on=?, title=?, decision=?, reason=?, responsible=?, status=?, updated_at=unixepoch()
  WHERE id=?`).bind(...values, integer(params.id, 'Decisione', {min: 1, max: Number.MAX_SAFE_INTEGER})).run();
 if (!result.meta.changes) fail(404, 'Decisione non trovata.');
 return json({saved: true});
}
