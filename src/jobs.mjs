// Lavori pianificati (Cron Trigger giornaliero): promemoria delle attività e riepilogo settimanale ai referenti.
import {notify} from './lib/notify.mjs';
import {mailMember, reminderEmail, weeklyEmail} from './lib/emails.mjs';
import {romeDay, romeWeekday} from './lib/time.mjs';

const when = sec => new Intl.DateTimeFormat('it-IT', {timeZone: 'Europe/Rome', weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'}).format(new Date(sec * 1000));

export async function sendReminders(env, nowMs = Date.now()) {
 const db = env.DB;
 const now = Math.floor(nowMs / 1000);
 const {results} = await db.prepare(`SELECT a.id AS activityId, a.name, a.starts_at AS startsAt, b.member_id AS memberId
  FROM activities a JOIN bookings b ON b.activity_id = a.id AND b.status = 'confirmed'
  JOIN members m ON m.id = b.member_id AND m.status = 'approved'
  WHERE a.status = 'published' AND a.starts_at > ? AND a.starts_at <= ?`).bind(now, now + 36 * 3600).all();
 let sent = 0;
 for (const r of results) {
  const res = await db.prepare(`INSERT OR IGNORE INTO reminders_sent (kind, ref, member_id) VALUES ('activity', ?, ?)`).bind(r.activityId, r.memberId).run();
  if (!res.meta.changes) continue;
  sent++;
  await notify(db, r.memberId, {kind: 'promemoria', level: 'info', title: `Domani o oggi: ${r.name}`, body: when(r.startsAt)});
  await mailMember(env, db, r.memberId, name => reminderEmail(name, {activity: r.name, when: when(r.startsAt)}));
 }
 return sent;
}

export async function sendWeeklySummary(env, nowMs = Date.now()) {
 const db = env.DB;
 const now = Math.floor(nowMs / 1000);
 const week = romeDay(nowMs);
 const n = async (sql, ...b) => (await db.prepare(sql).bind(...b).first())?.n ?? 0;
 const {results: organizers} = await db.prepare(`SELECT id FROM members WHERE role = 'organizer' AND status = 'approved'`).all();
 const visits = await n(`SELECT COUNT(*) AS n FROM accessi WHERE direction = 'IN' AND at > ?`, now - 7 * 86400);
 const people = await n(`SELECT COUNT(DISTINCT member_id) AS n FROM accessi WHERE direction = 'IN' AND at > ?`, now - 7 * 86400);
 const bookings = await n(`SELECT COUNT(*) AS n FROM bookings b JOIN activities a ON a.id = b.activity_id WHERE b.status = 'pending' AND a.status = 'published' AND a.starts_at > ?`, now);
 const proposals = await n(`SELECT COUNT(*) AS n FROM proposals WHERE status = 'open'`);
 let sent = 0;
 for (const {id} of organizers) {
  const res = await db.prepare(`INSERT OR IGNORE INTO reminders_sent (kind, ref, member_id) VALUES ('weekly', ?, ?)`).bind(week, id).run();
  if (!res.meta.changes) continue;
  sent++;
  const missions = await n(`SELECT COUNT(*) AS n FROM chore_logs WHERE status = 'pending' AND member_id <> ?`, id);
  const prizes = await n(`SELECT COUNT(*) AS n FROM redemptions WHERE status = 'pending' AND member_id <> ?`, id);
  const lines = [
   {title: `${visits} ${visits === 1 ? 'visita' : 'visite'} negli ultimi 7 giorni`, text: `${people} ${people === 1 ? 'persona diversa' : 'persone diverse'}`},
   {title: `${missions} ${missions === 1 ? 'missione' : 'missioni'} da verificare`},
   {title: `${bookings} ${bookings === 1 ? 'prenotazione' : 'prenotazioni'} in attesa`},
   {title: `${prizes} ${prizes === 1 ? 'premio' : 'premi'} da consegnare`},
   {title: `${proposals} ${proposals === 1 ? 'proposta aperta' : 'proposte aperte'} da guardare`}
  ];
  await notify(db, id, {kind: 'riepilogo', level: 'info', title: 'Riepilogo della settimana', body: lines.map(l => l.title).join(' · ')});
  await mailMember(env, db, id, name => weeklyEmail(name, lines));
 }
 return sent;
}

export async function runDaily(env, nowMs = Date.now()) {
 const reminders = await sendReminders(env, nowMs);
 const weekly = romeWeekday(nowMs) === 0 ? await sendWeeklySummary(env, nowMs) : 0;
 return {reminders, weekly};
}
