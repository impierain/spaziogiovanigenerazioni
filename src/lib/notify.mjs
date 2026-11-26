import {sendPush} from './webpush.mjs';

// Notifiche in bacheca. Non devono mai far fallire l'operazione che le genera.
const clip = (value, max) => String(value ?? '').slice(0, max);

export async function notify(db, memberId, {kind, level = 'info', title, body = ''}) {
 try {
  await db.prepare('INSERT INTO notifications (member_id, kind, level, title, body) VALUES (?, ?, ?, ?, ?)')
   .bind(memberId, clip(kind, 40), level, clip(title, 120), clip(body, 400)).run();
 } catch { /* la bacheca è accessoria */ }
}

// Notifica push sul telefono (solo a chi ha attivato le notifiche). Non blocca mai l'operazione che la genera.
export async function pushMember(env, db, memberId, {title, body = '', url = '/#notifiche'}) {
 try { return await sendPush(env, db, memberId, {title: clip(title, 120), body: clip(body, 200), url}); } catch { return 0; }
}

export async function pushOrganizers(env, db, exceptId, data) {
 try {
  const {results} = await db.prepare(`SELECT id FROM members WHERE role = 'organizer' AND status = 'approved' AND id <> ?`).bind(exceptId ?? '').all();
  for (const row of results) await pushMember(env, db, row.id, data);
 } catch { /* idem */ }
}

// A tutti i soci approvati che hanno almeno un dispositivo con le notifiche attive.
export async function pushAllMembers(env, db, exceptId, data) {
 try {
  const {results} = await db.prepare(`SELECT DISTINCT m.id FROM members m JOIN push_subscriptions p ON p.member_id = m.id
   WHERE m.status = 'approved' AND m.id <> ?`).bind(exceptId ?? '').all();
  for (const row of results) await pushMember(env, db, row.id, data);
 } catch { /* idem */ }
}

export async function notifyOrganizers(db, exceptId, data) {
 try {
  const {results} = await db.prepare(`SELECT id FROM members WHERE role = 'organizer' AND status = 'approved' AND id <> ?`).bind(exceptId ?? '').all();
  for (const row of results) await notify(db, row.id, data);
 } catch { /* idem */ }
}

// Avviso a tutti i soci approvati (tranne chi lo invia): in bacheca per tutti, sul telefono per chi ha le notifiche.
// Un secondo invio identico entro dieci minuti viene rifiutato (doppio tocco).
export async function announceToAll(env, db, senderId, key, {title, body = '', url = '/#home'}) {
 const bucket = Math.floor(Date.now() / 600000);
 const res = await db.prepare(`INSERT OR IGNORE INTO reminders_sent (kind, ref, member_id) VALUES ('avviso-tutti', ?, ?)`).bind(`${key}:${bucket}`, senderId).run();
 if (!res.meta.changes) return null;
 const {results} = await db.prepare(`SELECT id FROM members WHERE status = 'approved' AND id <> ?`).bind(senderId).all();
 let pushed = 0;
 for (const row of results) {
  await notify(db, row.id, {kind: 'promemoria', level: 'info', title, body});
  pushed += await pushMember(env, db, row.id, {title, body, url}) ? 1 : 0;
 }
 return {members: results.length, pushed};
}
