import {json, readJson} from '../lib/http.mjs';
import {sendPush} from '../lib/webpush.mjs';
import {romeWeekday, romeWall, romeDay} from '../lib/time.mjs';

const ASK_AGAIN_AFTER = 30 * 86400; // a chi non l'ha attivato la domanda si ripropone una volta al mese
const OPEN_FROM = 15 * 60 + 30;     // tolleranza di mezz'ora prima delle 16:00
const OPEN_UNTIL = 20 * 60;

// L'avviso parte al primo ingresso del giorno (di chiunque: se è dentro, ha il permesso di stare in sede),
// da lunedì a venerdì tra le 15:30 e le 20:00. Chi ha attivato l'avviso lo riceve sul telefono.
export async function announceStudyRoom(env, db, memberId, at) {
 try {
  const ms = at * 1000;
  if (romeWeekday(ms) > 4) return 0;
  const wall = romeWall(ms);
  const minutes = wall.getUTCHours() * 60 + wall.getUTCMinutes();
  if (minutes < OPEN_FROM || minutes >= OPEN_UNTIL) return 0;
  const first = await db.prepare(`INSERT OR IGNORE INTO reminders_sent (kind, ref, member_id, sent_at) VALUES ('aula', ?, ?, ?)`).bind(romeDay(ms), memberId, at).run();
  if (!first.meta.changes) return 0;
  // Un solo avviso al giorno in tutto: lo segna anche chi c'era già (chiave: giorno + primo che entra).
  const earlier = await db.prepare(`SELECT COUNT(*) AS n FROM reminders_sent WHERE kind = 'aula' AND ref = ?`).bind(romeDay(ms)).first();
  if (earlier.n > 1) return 0;
  const {results} = await db.prepare(`SELECT p.member_id AS id FROM aula_preferences p JOIN members m ON m.id = p.member_id
   WHERE p.enabled = 1 AND m.status = 'approved' AND p.member_id <> ?`).bind(memberId).all();
  let sent = 0;
  for (const r of results) {
   sent += await sendPush(env, db, r.id, {title: 'L’aula studio è aperta 📚', body: 'C’è qualcuno in sede: puoi venire a studiare.', url: '/#home', tag: 'cca-aula'}) ? 1 : 0;
  }
  return sent;
 } catch {
  return 0; // l'avviso non deve mai bloccare un ingresso
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
