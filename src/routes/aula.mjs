import {json, readJson} from '../lib/http.mjs';
import {sendPush} from '../lib/webpush.mjs';
import {romeWeekday, romeWall, romeDay} from '../lib/time.mjs';

const ASK_AGAIN_AFTER = 30 * 86400; // a chi non l'ha attivato la domanda si ripropone una volta al mese
const OPEN_FROM = 15 * 60 + 30;     // tolleranza di mezz'ora prima delle 16:00
const OPEN_UNTIL = 20 * 60;
const OPENING_TIME = 16 * 60;      // chi era già dentro prima delle 15:30 viene annunciato alle 16:00

const minutesOfDay = ms => { const w = romeWall(ms); return w.getUTCHours() * 60 + w.getUTCMinutes(); };

// Un solo avviso al giorno in tutto: la riga è «giorno + primo che l'ha fatto scattare», vince chi arriva per primo.
async function claimDay(db, ms, memberId) {
 const day = romeDay(ms);
 const res = await db.prepare(`INSERT OR IGNORE INTO reminders_sent (kind, ref, member_id, sent_at) VALUES ('aula', ?, ?, ?)`).bind(day, memberId, Math.floor(ms / 1000)).run();
 if (!res.meta.changes) return false;
 const n = await db.prepare(`SELECT COUNT(*) AS n FROM reminders_sent WHERE kind = 'aula' AND ref = ?`).bind(day).first();
 return n.n === 1;
}

async function sendToSubscribers(env, db, excludeIds) {
 const {results} = await db.prepare(`SELECT p.member_id AS id FROM aula_preferences p JOIN members m ON m.id = p.member_id
  WHERE p.enabled = 1 AND m.status = 'approved'`).all();
 let sent = 0;
 for (const r of results) {
  if (excludeIds.includes(r.id)) continue;
  sent += await sendPush(env, db, r.id, {title: 'L’aula studio è aperta 📚', body: 'C’è qualcuno in sede: puoi venire a studiare.', url: '/#home', tag: 'cca-aula'}) ? 1 : 0;
 }
 return sent;
}

// L'avviso parte al primo ingresso del giorno (di chiunque: se è dentro, ha il permesso di stare in sede),
// da lunedì a venerdì tra le 15:30 e le 20:00. Chi ha attivato l'avviso lo riceve sul telefono.
export async function announceStudyRoom(env, db, memberId, at) {
 try {
  const ms = at * 1000;
  if (romeWeekday(ms) > 4) return 0;
  const minutes = minutesOfDay(ms);
  if (minutes < OPEN_FROM || minutes >= OPEN_UNTIL) return 0;
  if (!await claimDay(db, ms, memberId)) return 0;
  return await sendToSubscribers(env, db, [memberId]);
 } catch {
  return 0; // l'avviso non deve mai bloccare un ingresso
 }
}

// Cron ogni 15 minuti: se alle 16 qualcuno era già dentro da prima (e nessuno ha fatto scattare l'avviso), lo manda ora.
export async function announceIfAlreadyOpen(env, nowMs = Date.now()) {
 try {
  if (romeWeekday(nowMs) > 4) return 0;
  const minutes = minutesOfDay(nowMs);
  if (minutes < OPENING_TIME || minutes >= OPEN_UNTIL) return 0;
  const now = Math.floor(nowMs / 1000);
  const {results} = await env.DB.prepare(`SELECT m.id FROM members m
   JOIN accessi a ON a.id = (SELECT id FROM accessi WHERE member_id = m.id ORDER BY at DESC, id DESC LIMIT 1)
   WHERE a.direction = 'IN' AND a.at > ? AND m.status = 'approved' ORDER BY a.at`).bind(now - 16 * 3600).all();
  if (!results.length) return 0;
  if (!await claimDay(env.DB, nowMs, results[0].id)) return 0;
  return await sendToSubscribers(env, env.DB, results.map(r => r.id));
 } catch {
  return 0;
 }
}

export async function get({db, member}) {
 const row = await db.prepare('SELECT enabled, asked_at AS askedAt FROM aula_preferences WHERE member_id = ?').bind(member.id).first();
 const now = Math.floor(Date.now() / 1000);
 return json({enabled: row?.enabled === 1, ask: row?.enabled !== 1 && (!row || now - row.askedAt > ASK_AGAIN_AFTER)});
}

// {enabled: true|false}: salva la scelta; «Non ora» manda enabled:false e la domanda torna fra un mese.
export async function set({request, db, member}) {
 const body = await readJson(request);
 const enabled = body.enabled === true ? 1 : 0;
 await db.prepare(`INSERT INTO aula_preferences (member_id, enabled, asked_at) VALUES (?, ?, unixepoch())
  ON CONFLICT(member_id) DO UPDATE SET enabled = excluded.enabled, asked_at = excluded.asked_at`).bind(member.id, enabled).run();
 return json({ok: true, enabled: enabled === 1});
}
