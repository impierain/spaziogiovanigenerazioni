// Trofei: si assegnano da soli quando i dati verificati raggiungono la soglia.
import {notify} from './notify.mjs';
import {mailMember, trophyEmail} from './emails.mjs';

export const TROPHIES = [
 ['cca', 'Cca sugnu!', 'Esplorazione', 'Prima visita registrata in sede.', 1, 'visits', 'star'],
 ['casa', 'Di casa', 'Esplorazione', 'Cinque giornate di presenza.', 5, 'days', 'star'],
 ['famiglia', 'Quasi di famiglia', 'Esplorazione', 'Quindici giornate di presenza.', 15, 'days', 'star'],
 ['cervellone', 'Cervellone', 'Studio e apprendimento', 'Prima missione di studio verificata.', 1, 'studio', 'book'],
 ['sapientone', 'Sapientone', 'Studio e apprendimento', 'Dieci missioni di studio verificate.', 10, 'studio', 'book'],
 ['curiosu', 'Curiosu', 'Studio e apprendimento', 'Tre missioni creative verificate.', 3, 'creativita', 'camera'],
 ['cumpagnu', 'Cumpagnu', 'Socialità', 'Prima attività di gruppo con presenza verificata.', 1, 'attended', 'heart'],
 ['manu', 'Dammi na manu', 'Socialità', 'Primo scambio nella banca del tempo.', 1, 'exchanges', 'heart'],
 ['mutualista', 'Mutualista', 'Socialità', 'Cinque scambi nella banca del tempo.', 5, 'exchanges', 'heart'],
 ['vuci', 'A vuci è mia', 'Partecipazione civica', 'Prima proposta pubblicata.', 1, 'proposals', 'star'],
 ['votante', 'Una vuci in cchiù', 'Partecipazione civica', 'Cinque proposte votate.', 5, 'votes', 'star'],
 ['cittadinu', 'Cittadinu attivu', 'Partecipazione civica', 'Prima assemblea con presenza verificata.', 1, 'assemblea', 'star'],
 ['ainuzzu', 'Ainuzzu d’oro', 'Speciali', 'Missione ambientale «Semi dei Sicani» verificata.', 1, 'verde', 'plant']
].map(([id, name, group, desc, target, metric, icon]) => ({id, name, group, desc, target, metric, icon}));

async function count(db, sql, ...bind) {
 return (await db.prepare(sql).bind(...bind).first())?.n ?? 0;
}

export async function metricsFor(db, id) {
 const [visits, days, studio, creativita, attended, exchanges, proposals, votes, assemblea, verde] = await Promise.all([
  count(db, `SELECT COUNT(*) AS n FROM accessi WHERE member_id = ? AND direction = 'IN'`, id),
  count(db, `SELECT COUNT(DISTINCT date(at + 3600, 'unixepoch')) AS n FROM accessi WHERE member_id = ? AND direction = 'IN'`, id),
  count(db, `SELECT COUNT(*) AS n FROM chore_logs l JOIN chore_types c ON c.id = l.chore_type_id WHERE l.member_id = ? AND l.status = 'verified' AND c.path = 'studio'`, id),
  count(db, `SELECT COUNT(*) AS n FROM chore_logs l JOIN chore_types c ON c.id = l.chore_type_id WHERE l.member_id = ? AND l.status = 'verified' AND c.path = 'creativita'`, id),
  count(db, 'SELECT COUNT(*) AS n FROM attendance WHERE member_id = ?', id),
  count(db, `SELECT COUNT(*) AS n FROM time_exchanges x JOIN time_offers o ON o.id = x.offer_id WHERE x.status = 'done' AND (x.requester_id = ? OR o.member_id = ?)`, id, id),
  count(db, 'SELECT COUNT(*) AS n FROM proposals WHERE member_id = ?', id),
  count(db, 'SELECT COUNT(*) AS n FROM proposal_votes WHERE member_id = ?', id),
  count(db, `SELECT COUNT(*) AS n FROM chore_logs WHERE member_id = ? AND status = 'verified' AND chore_type_id = 'assemblea'`, id),
  count(db, `SELECT COUNT(*) AS n FROM chore_logs WHERE member_id = ? AND status = 'verified' AND chore_type_id = 'verde'`, id)
 ]);
 return {visits, days, studio, creativita, attended, exchanges, proposals, votes, assemblea, verde};
}

export async function trophyList(db, memberId) {
 const [metrics, {results}] = await Promise.all([
  metricsFor(db, memberId),
  db.prepare('SELECT trophy_id, awarded_at FROM trophies_awarded WHERE member_id = ?').bind(memberId).all()
 ]);
 const earned = new Map(results.map(r => [r.trophy_id, r.awarded_at]));
 return TROPHIES.map(t => ({...t, count: Math.min(metrics[t.metric] ?? 0, t.target), earned: earned.has(t.id), awardedAt: earned.get(t.id) ?? null}));
}

// Assegna i trofei maturati, avvisa in bacheca e per email. Non fa mai fallire l'operazione che lo chiama.
export async function checkTrophies(env, db, memberId) {
 try {
  const metrics = await metricsFor(db, memberId);
  const fresh = [];
  for (const t of TROPHIES) {
   if ((metrics[t.metric] ?? 0) < t.target) continue;
   const res = await db.prepare('INSERT OR IGNORE INTO trophies_awarded (member_id, trophy_id) VALUES (?, ?)').bind(memberId, t.id).run();
   if (res.meta.changes) fresh.push(t);
  }
  if (!fresh.length) return [];
  for (const t of fresh) await notify(db, memberId, {kind: 'trofeo', level: 'ok', title: `Nuovo trofeo: ${t.name}`, body: t.desc});
  await mailMember(env, db, memberId, name => trophyEmail(name, fresh));
  return fresh;
 } catch {
  return [];
 }
}
