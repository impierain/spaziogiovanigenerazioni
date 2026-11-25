// Lavori pianificati (Cron Trigger giornaliero): promemoria delle attività e riepilogo settimanale ai referenti.
import {notify} from './lib/notify.mjs';
import {sendPush} from './lib/webpush.mjs';
import {recordAccess} from './routes/accessi.mjs';
import {announceIfAlreadyOpen} from './routes/aula.mjs';
import {mailMember, stillInsideEmail} from './lib/emails.mjs';
import {romeDay, romeWeekday} from './lib/time.mjs';

const when = sec => new Intl.DateTimeFormat('it-IT', {timeZone: 'Europe/Rome', weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'}).format(new Date(sec * 1000));

export async function sendReminders(env, nowMs = Date.now()) {
 const db = env.DB;
 const now = Math.floor(nowMs / 1000);
 const {results} = await db.prepare(`SELECT a.id AS activityId, a.name, a.starts_at AS startsAt, b.member_id AS memberId
  FROM activities a JOIN bookings b ON b.activity_id = a.id AND b.status = 'confirmed'
  JOIN members m ON m.id = b.member_id AND m.status = 'approved'
  WHERE a.status = 'published' AND a.starts_at > ? AND a.starts_at <= ?
   AND a.reminder1_min IS NULL AND a.reminder2_min IS NULL`).bind(now, now + 36 * 3600).all();
 let sent = 0;
 for (const r of results) {
  const res = await db.prepare(`INSERT OR IGNORE INTO reminders_sent (kind, ref, member_id) VALUES ('activity', ?, ?)`).bind(r.activityId, r.memberId).run();
  if (!res.meta.changes) continue;
  sent++;
  await notify(db, r.memberId, {kind: 'promemoria', level: 'info', title: `Domani o oggi: ${r.name}`, body: when(r.startsAt)});
 }
 return sent;
}

const MISSED_AFTER = 3600; // un promemoria già scaduto da più di un'ora (es. impostato tardi) non parte

const lead = minutes => {
 if (minutes % 1440 === 0) { const d = minutes / 1440; return d === 1 ? 'tra 1 giorno' : `tra ${d} giorni`; }
 if (minutes % 60 === 0) { const h = minutes / 60; return h === 1 ? 'tra 1 ora' : `tra ${h} ore`; }
 return `tra ${minutes} minuti`;
};

// Promemoria personalizzati dai referenti (fino a due per attività), ai soci con prenotazione confermata.
export async function sendActivityReminders(env, nowMs = Date.now()) {
 const db = env.DB;
 const now = Math.floor(nowMs / 1000);
 const {results: activities} = await db.prepare(`SELECT id, name, starts_at AS startsAt, reminder1_min AS r1, reminder2_min AS r2
  FROM activities WHERE status = 'published' AND starts_at > ? AND (reminder1_min IS NOT NULL OR reminder2_min IS NOT NULL)`).bind(now).all();
 let sent = 0;
 for (const a of activities) {
  for (const [slot, minutes] of [[1, a.r1], [2, a.r2]]) {
   if (minutes === null) continue;
   const fireAt = a.startsAt - minutes * 60;
   if (fireAt > now || now - fireAt > MISSED_AFTER) continue;
   const {results: people} = await db.prepare(`SELECT b.member_id AS memberId FROM bookings b JOIN members m ON m.id = b.member_id
    WHERE b.activity_id = ? AND b.status = 'confirmed' AND m.status = 'approved'`).bind(a.id).all();
   for (const {memberId} of people) {
    // La chiave comprende l'orario di inizio: se l'attività viene spostata, i promemoria ripartono.
    const res = await db.prepare(`INSERT OR IGNORE INTO reminders_sent (kind, ref, member_id, sent_at) VALUES ('activity-custom', ?, ?, ?)`).bind(`${a.id}:${slot}:${a.startsAt}`, memberId, now).run();
    if (!res.meta.changes) continue;
    sent++;
    const title = `${a.name}: inizia ${lead(minutes)}`;
    await notify(db, memberId, {kind: 'promemoria', level: 'info', title, body: when(a.startsAt)});
    await sendPush(env, db, memberId, {title, body: when(a.startsAt), url: '/#home'});
   }
  }
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
 }
 return sent;
}

// La chiave del servizio email (Brevo) scade dopo 90 giorni senza invii: a 85 giorni avvisiamo i referenti.
// L'avviso viene mostrato soltanto ai referenti nella webapp.
export const MAIL_IDLE_DAYS = 85;
export async function checkMailIdle(env, nowMs = Date.now()) {
 const db = env.DB;
 const now = Math.floor(nowMs / 1000);
 try {
  const get = async key => (await db.prepare('SELECT value FROM app_state WHERE key = ?').bind(key).first())?.value ?? null;
  const set = (key, value) => db.prepare(`INSERT INTO app_state (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = unixepoch()`).bind(key, value).run();
  const last = await get('mail_last_ok');
  if (last === null) { await set('mail_last_ok', now); return 0; }
  if (now - last < MAIL_IDLE_DAYS * 86400) return 0;
  const warned = await get('mail_idle_warned');
  if (warned !== null && now - warned < 7 * 86400) return 0;
  await set('mail_idle_warned', now);
  const days = Math.floor((now - last) / 86400);
  const {results: organizers} = await db.prepare(`SELECT id FROM members WHERE role = 'organizer' AND status = 'approved'`).all();
  for (const {id} of organizers) {
   await notify(db, id, {kind: 'riepilogo', level: 'error', title: 'Le email rischiano di fermarsi', body: `Nessuna email inviata da ${days} giorni: la chiave del servizio email scade dopo 90 giorni di inattività.`});

  }
  return organizers.length;
 } catch {
  return 0;
 }
}

const STILL_INSIDE_AFTER = 2 * 3600; // promemoria dopo due ore dall'ingresso
const STILL_INSIDE_UNTIL = 4 * 3600; // oltre le quattro ore non lo mandiamo più (cron saltato)
const hourMinute = sec => new Intl.DateTimeFormat('it-IT', {timeZone: 'Europe/Rome', hour: '2-digit', minute: '2-digit'}).format(new Date(sec * 1000));

// «Sei ancora in sede?»: una volta per ingresso, solo se l'ultimo movimento del socio è ancora quell'ingresso.
export async function sendStillInsideReminders(env, nowMs = Date.now()) {
 const db = env.DB;
 const now = Math.floor(nowMs / 1000);
 const {results} = await db.prepare(`SELECT a.id, a.member_id AS memberId, a.at FROM accessi a
  JOIN members m ON m.id = a.member_id AND m.status = 'approved'
  WHERE a.direction = 'IN' AND a.at <= ? AND a.at > ?
   AND a.id = (SELECT id FROM accessi WHERE member_id = a.member_id ORDER BY at DESC, id DESC LIMIT 1)`).bind(now - STILL_INSIDE_AFTER, now - STILL_INSIDE_UNTIL).all();
 let sent = 0;
 for (const r of results) {
  const res = await db.prepare(`INSERT OR IGNORE INTO reminders_sent (kind, ref, member_id, sent_at) VALUES ('sede', ?, ?, ?)`).bind(String(r.id), r.memberId, now).run();
  if (!res.meta.changes) continue;
  sent++;
  await notify(db, r.memberId, {kind: 'promemoria', level: 'info', title: 'Sei ancora in sede?', body: `Hai registrato l'ingresso alle ${hourMinute(r.at)}. Se sei già uscito, registra l'uscita con il QR o chiedi a un referente: se entro un'ora non la registri, lo facciamo noi.`});
  // Notifica sul telefono per chi l'ha attivata; l'email solo per gli altri.
  const pushed = await sendPush(env, db, r.memberId, {title: 'Sei ancora in sede?', body: `Hai registrato l'ingresso alle ${hourMinute(r.at)}. Se sei già uscito, registra l'uscita: tra un'ora lo facciamo noi.`, url: '/#home'});
  if (!pushed) await mailMember(env, db, r.memberId, name => stillInsideEmail(name, {since: hourMinute(r.at)}));
 }
 return sent;
}

const AUTO_OUT_AFTER_REMINDER = 3600; // se un'ora dopo il promemoria l'ingresso è ancora aperto, l'uscita si registra da sé

// Uscita automatica: scatta solo dopo un promemoria già mandato e solo se l'ultimo movimento è ancora quell'ingresso.
// Si registra all'orario in cui sono finite le due ore (non all'orario di chiusura) e senza «registrato da» (recorded_by vuoto).
export async function autoCheckouts(env, nowMs = Date.now()) {
 const db = env.DB;
 const now = Math.floor(nowMs / 1000);
 const {results} = await db.prepare(`SELECT a.id, a.member_id AS memberId, a.at FROM reminders_sent r
  JOIN accessi a ON a.id = CAST(r.ref AS INTEGER) AND a.member_id = r.member_id
  WHERE r.kind = 'sede' AND r.sent_at <= ? AND r.sent_at > ? AND a.direction = 'IN'
   AND a.id = (SELECT id FROM accessi WHERE member_id = a.member_id ORDER BY at DESC, id DESC LIMIT 1)`).bind(now - AUTO_OUT_AFTER_REMINDER, now - 86400).all();
 let done = 0;
 for (const r of results) {
  const outAt = r.at + STILL_INSIDE_AFTER;
  try {
   await recordAccess(db, {memberId: r.memberId, direction: 'OUT', at: outAt, source: 'pannello', recordedBy: null});
  } catch { continue; }
  done++;
  const text = `Non hai risposto al promemoria, quindi abbiamo registrato la tua uscita alle ${hourMinute(outAt)} (due ore dopo l'ingresso). Se sei rimasto in sede più a lungo, chiedi a un referente di correggere.`;
  await notify(db, r.memberId, {kind: 'promemoria', level: 'info', title: 'Uscita registrata in automatico', body: text});
  await sendPush(env, db, r.memberId, {title: 'Uscita registrata in automatico', body: `Abbiamo registrato la tua uscita alle ${hourMinute(outAt)}.`, url: '/#home'});
 }
 return done;
}

// Cron ogni 15 minuti.
export async function runFrequent(env, nowMs = Date.now()) {
 return {stillInside: await sendStillInsideReminders(env, nowMs), autoOut: await autoCheckouts(env, nowMs), aula: await announceIfAlreadyOpen(env, nowMs), custom: await sendActivityReminders(env, nowMs)};
}

export async function runDaily(env, nowMs = Date.now()) {
 const reminders = await sendReminders(env, nowMs);
 const weekly = romeWeekday(nowMs) === 0 ? await sendWeeklySummary(env, nowMs) : 0;
 const idle = await checkMailIdle(env, nowMs);
 return {reminders, weekly, idle};
}
