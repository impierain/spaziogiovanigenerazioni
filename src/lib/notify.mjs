// Notifiche in bacheca. Non devono mai far fallire l'operazione che le genera.
const clip = (value, max) => String(value ?? '').slice(0, max);

export async function notify(db, memberId, {kind, level = 'info', title, body = ''}) {
 try {
  await db.prepare('INSERT INTO notifications (member_id, kind, level, title, body) VALUES (?, ?, ?, ?, ?)')
   .bind(memberId, clip(kind, 40), level, clip(title, 120), clip(body, 400)).run();
 } catch { /* la bacheca è accessoria */ }
}

export async function notifyOrganizers(db, exceptId, data) {
 try {
  const {results} = await db.prepare(`SELECT id FROM members WHERE role = 'organizer' AND status = 'approved' AND id <> ?`).bind(exceptId ?? '').all();
  for (const row of results) await notify(db, row.id, data);
 } catch { /* idem */ }
}
