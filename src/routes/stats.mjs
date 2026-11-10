import {fail, json, integer} from '../lib/http.mjs';
import {romeDay, romeDayStart, romeHour, romeMonth, romeWeekday, romeWeekStart} from '../lib/time.mjs';

const STALE_SECONDS = 16 * 3600;
const DAY_NAMES = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
const round = (value, digits = 1) => Math.round(value * 10 ** digits) / 10 ** digits;

// Abbina ogni ingresso alla sua uscita, socio per socio. Un ingresso senza uscita
// dopo 16 ore si scarta; uno recente è ancora "dentro".
export function buildSessions(rows, nowSeconds) {
 const byMember = new Map();
 for (const row of rows) {
  if (!byMember.has(row.member_id)) byMember.set(row.member_id, []);
  byMember.get(row.member_id).push(row);
 }
 const sessions = [];
 const inside = [];
 for (const [memberId, list] of byMember) {
  list.sort((a, b) => a.at - b.at || a.id - b.id);
  let open = null;
  for (const row of list) {
   if (row.direction === 'IN') open = row;
   else if (open && row.at > open.at) {
    sessions.push({memberId, start: open.at, end: row.at});
    open = null;
   } else open = null;
  }
  if (open && nowSeconds - open.at < STALE_SECONDS) inside.push({memberId, since: open.at});
 }
 return {sessions, inside};
}

// Unisce gli intervalli sovrapposti: i minuti in cui c'è almeno una persona in sede.
function mergeIntervals(sessions) {
 const sorted = sessions.map(s => [s.start, s.end]).sort((a, b) => a[0] - b[0]);
 const merged = [];
 for (const [start, end] of sorted) {
  const last = merged.at(-1);
  if (last && start <= last[1]) last[1] = Math.max(last[1], end);
  else merged.push([start, end]);
 }
 return merged;
}

// Distribuisce i minuti di un intervallo sulle ore del giorno (ora di Roma).
function addMinutesPerHour(target, start, end) {
 let cursor = start;
 while (cursor < end) {
  const next = Math.min(end, (Math.floor(cursor / 3600) + 1) * 3600);
  target[romeHour(cursor * 1000)] += (next - cursor) / 60;
  cursor = next;
 }
}

// Serie di giorni di apertura consecutivi. La sede è aperta da lunedì a venerdì:
// il fine settimana non interrompe la serie e le visite di sabato e domenica non contano.
const DAY = 86400000;
const isWeekend = ms => [0, 6].includes(new Date(ms).getUTCDay());
function previousOpenDay(ms) {
 let cursor = ms - DAY;
 while (isWeekend(cursor)) cursor -= DAY;
 return cursor;
}
function streakDays(daySet, nowMs) {
 const days = [...daySet].map(day => Date.parse(day)).filter(ms => !isWeekend(ms)).sort((a, b) => a - b);
 const have = new Set(days);
 let best = 0;
 let run = 0;
 let previous = null;
 for (const ms of days) {
  run = previous !== null && previousOpenDay(ms) === previous ? run + 1 : 1;
  best = Math.max(best, run);
  previous = ms;
 }
 // La serie in corso parte da oggi (se è un giorno di apertura e c'è già una visita) o dall'ultimo giorno di apertura.
 const today = Date.parse(romeDay(nowMs));
 let cursor = !isWeekend(today) && have.has(today) ? today : previousOpenDay(today);
 let current = 0;
 while (have.has(cursor)) { current++; cursor = previousOpenDay(cursor); }
 return {current, best};
}

async function loadRows(db, from, memberId = null) {
 const filter = memberId ? 'AND a.member_id = ?' : '';
 const bindings = memberId ? [from, memberId] : [from];
 const {results} = await db.prepare(`SELECT a.id, a.member_id, a.direction, a.at FROM accessi a
  JOIN members m ON m.id = a.member_id WHERE a.at >= ? ${filter} ORDER BY a.at LIMIT 20000`).bind(...bindings).all();
 return results;
}

export async function sede({url, db}) {
 const nowMs = Date.now();
 const now = Math.floor(nowMs / 1000);
 const days = integer(url.searchParams.get('days') || 365, 'Giorni', {min: 7, max: 730});
 const rows = await loadRows(db, now - days * 86400);
 const {sessions, inside} = buildSessions(rows, now);
 const merged = mergeIntervals(sessions);

 const hoursOpen = merged.reduce((sum, [a, b]) => sum + (b - a), 0) / 3600;
 const personHours = sessions.reduce((sum, s) => sum + (s.end - s.start), 0) / 3600;
 const perWeekday = DAY_NAMES.map(name => ({name, sessions: 0, hoursOpen: 0}));
 const minutesPerHour = Array(24).fill(0);
 const months = new Map();
 const openDays = new Set();
 for (const session of sessions) {
  const ms = session.start * 1000;
  perWeekday[romeWeekday(ms)].sessions++;
  const month = months.get(romeMonth(ms)) ?? {month: romeMonth(ms), sessions: 0, hours: 0, members: new Set()};
  month.sessions++;
  month.hours += (session.end - session.start) / 3600;
  month.members.add(session.memberId);
  months.set(month.month, month);
 }
 for (const [start, end] of merged) {
  perWeekday[romeWeekday(start * 1000)].hoursOpen += (end - start) / 3600;
  addMinutesPerHour(minutesPerHour, start, end);
  openDays.add(romeDay(start * 1000));
 }

 const hoursByMember = new Map();
 for (const session of sessions) {
  const entry = hoursByMember.get(session.memberId) ?? {memberId: session.memberId, hours: 0, visits: 0};
  entry.hours += (session.end - session.start) / 3600;
  entry.visits++;
  hoursByMember.set(session.memberId, entry);
 }
 const ranking = [...hoursByMember.values()].sort((a, b) => b.hours - a.hours).slice(0, 10);
 if (ranking.length) {
  const {results} = await db.prepare(`SELECT id, pseudonym FROM members WHERE id IN (${ranking.map(() => '?').join(',')})`)
   .bind(...ranking.map(r => r.memberId)).all();
  const names = new Map(results.map(r => [r.id, r.pseudonym]));
  ranking.forEach(r => { r.name = names.get(r.memberId) ?? 'Socio'; r.hours = round(r.hours); });
 }

 const trend = [...months.values()].sort((a, b) => a.month.localeCompare(b.month)).slice(-12)
  .map(m => ({month: m.month, sessions: m.sessions, hours: round(m.hours), members: m.members.size}));
 const thisMonth = trend.find(m => m.month === romeMonth(nowMs));
 const previous = trend.filter(m => m.month < romeMonth(nowMs)).at(-1);

 return json({
  periodDays: days,
  totals: {
   visits: sessions.length,
   hoursOpen: round(hoursOpen),
   personHours: round(personHours),
   avgVisitMinutes: sessions.length ? round(personHours * 60 / sessions.length, 0) : 0,
   uniqueMembers: hoursByMember.size
  },
  insideNow: inside.length,
  weekdays: perWeekday.map(d => ({...d, hoursOpen: round(d.hoursOpen)})),
  hours: minutesPerHour.map((minutes, hour) => ({hour, hours: round(minutes / 60)})),
  trend,
  comparison: {thisMonth: thisMonth ?? null, previousMonth: previous ?? null},
  ranking,
  streak: streakDays(openDays, nowMs)
 });
}

export async function socio({db, member, params}) {
 const isOrganizer = member.role === 'organizer';
 if (!isOrganizer && params.id !== member.id) fail(403, 'Accesso non consentito.');
 const target = await db.prepare(`SELECT m.id, m.pseudonym, t.xp, t.cheese_earned AS cheese FROM members m
  JOIN member_totals t ON t.member_id = m.id WHERE m.id = ?`).bind(params.id).first();
 if (!target) fail(404, 'Socio non trovato.');
 const nowMs = Date.now();
 const now = Math.floor(nowMs / 1000);
 const rows = await loadRows(db, now - 365 * 86400, target.id);
 const {sessions, inside} = buildSessions(rows, now);
 const hours = sessions.reduce((sum, s) => sum + (s.end - s.start), 0) / 3600;
 const perWeekday = DAY_NAMES.map(name => ({name, visits: 0}));
 const visitDays = new Set();
 const monthHours = new Map();
 for (const session of sessions) {
  perWeekday[romeWeekday(session.start * 1000)].visits++;
  visitDays.add(romeDay(session.start * 1000));
  const month = romeMonth(session.start * 1000);
  monthHours.set(month, (monthHours.get(month) ?? 0) + (session.end - session.start) / 3600);
 }
 const [attendance, chores] = await Promise.all([
  db.prepare('SELECT COUNT(*) AS n FROM attendance WHERE member_id = ?').bind(target.id).first(),
  db.prepare(`SELECT COUNT(*) AS n FROM chore_logs WHERE member_id = ? AND status = 'verified'`).bind(target.id).first()
 ]);
 return json({
  member: {id: target.id, name: target.pseudonym},
  totals: {xp: target.xp, cheese: target.cheese},
  visits: sessions.length,
  hours: round(hours),
  avgVisitMinutes: sessions.length ? round(hours * 60 / sessions.length, 0) : 0,
  insideNow: inside.length > 0,
  streak: streakDays(visitDays, nowMs),
  weekdays: perWeekday,
  months: [...monthHours.entries()].sort((x, y) => x[0].localeCompare(y[0])).slice(-6).map(([month, h]) => ({month, hours: round(h)})),
  recent: sessions.slice(-10).reverse().map(s => ({start: s.start, end: s.end, minutes: Math.round((s.end - s.start) / 60)})),
  activitiesAttended: attendance.n,
  choresVerified: chores.n
 });
}

// Numeri pubblici del paese: nessun dato personale.
export async function community({db}) {
 const now = Math.floor(Date.now() / 1000);
 const weekStart = romeWeekStart(now * 1000);
 const rows = await loadRows(db, weekStart);
 const {sessions} = buildSessions(rows, now);
 const merged = mergeIntervals(sessions);
 const hoursWeek = merged.reduce((sum, [a, b]) => sum + (b - a), 0) / 3600;
 const one = async sql => (await db.prepare(sql).first())?.n ?? 0;
 const [youngs, activities, chores] = await Promise.all([
  one("SELECT COUNT(*) AS n FROM members WHERE status = 'approved'"),
  one('SELECT COUNT(DISTINCT activity_id) AS n FROM attendance'),
  one("SELECT COUNT(*) AS n FROM chore_logs WHERE status = 'verified'")
 ]);
 return json({metrics: [
  {key: 'giovani', label: 'Giovani coinvolti', value: youngs, target: 120, note: 'Obiettivo del primo anno', icon: 'heart'},
  {key: 'apertura', label: 'Ore di apertura questa settimana', value: round(hoursWeek), target: 20, note: 'Obiettivo settimanale', icon: 'book'},
  {key: 'attivita', label: 'Attività svolte', value: activities, target: 18, note: 'Obiettivo del primo anno', icon: 'star'},
  {key: 'missioni', label: 'Missioni verificate', value: chores, target: 50, note: 'Cura dello spazio, fatta insieme', icon: 'plant'}
 ]});
}

// Albero delle competenze: esperienze verificate per percorso. Le attività
// a cui hai partecipato contano per «Socialità e comunità».
export async function progress({db, member}) {
 const {results} = await db.prepare(`SELECT c.path AS path, COUNT(*) AS n FROM chore_logs l
  JOIN chore_types c ON c.id = l.chore_type_id WHERE l.member_id = ? AND l.status = 'verified' GROUP BY c.path`).bind(member.id).all();
 const counts = Object.fromEntries(results.map(r => [r.path, r.n]));
 const attended = (await db.prepare('SELECT COUNT(*) AS n FROM attendance WHERE member_id = ?').bind(member.id).first())?.n ?? 0;
 counts.socialita = (counts.socialita ?? 0) + attended;
 return json({counts, attended});
}
