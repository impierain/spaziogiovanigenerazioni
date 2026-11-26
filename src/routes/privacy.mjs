import {fail, json, readJson} from '../lib/http.mjs';
import {EXPIRED_COOKIE} from '../lib/session.mjs';
import {notifyOrganizers} from '../lib/notify.mjs';

// Tabelle con dati del socio (colonna member_id). Le chiavi segrete (sessioni, link, password, chiavi push) non si esportano.
const EXPORT_TABLES = ['accessi', 'bookings', 'attendance', 'chore_logs', 'chore_assignments', 'awards', 'trophies_awarded', 'redemptions',
 'time_offers', 'proposals', 'proposal_votes', 'notifications', 'learning_journal', 'achievement_sharing', 'team_signups', 'daily_wheel',
 'bonus_xp', 'team_badges', 'feedback', 'joy_rewards', 'joy_cosmetic', 'aula_preferences', 'app_visit_days'];

// GDPR art. 20: tutti i dati del socio in un file JSON.
export async function exportData({db, member}) {
 const profile = await db.prepare(`SELECT id, email, pseudonym, full_name AS fullName, phone, role, status, interests,
  avatar_species AS avatarSpecies, avatar_color AS avatarColor, created_at AS createdAt FROM members WHERE id = ?`).bind(member.id).first();
 const data = {exportedAt: new Date().toISOString(), profile};
 for (const table of EXPORT_TABLES) {
  try { data[table] = (await db.prepare(`SELECT * FROM ${table} WHERE member_id = ?`).bind(member.id).all()).results; }
  catch { /* tabella non presente in questa versione del database */ }
 }
 const devices = await db.prepare('SELECT created_at AS createdAt, confirmed_at AS confirmedAt FROM push_subscriptions WHERE member_id = ?').bind(member.id).all();
 data.pushDevices = devices.results;
 return new Response(JSON.stringify(data, null, 2), {headers: {
  'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff',
  'Content-Disposition': `attachment; filename="cca-siemmu-miei-dati.json"`
 }});
}

// GDPR art. 17: elimina l'account. Nome, email, contatti, notifiche, diario e testi scritti spariscono;
// ingressi, missioni e premi restano solo come numeri, legati a un «Ex socio» senza dati personali.
const DELETE_TABLES = ['sessions', 'login_links', 'password_tokens', 'push_subscriptions', 'notifications', 'learning_journal',
 'achievement_sharing', 'aula_preferences', 'time_offers', 'proposals', 'proposal_votes', 'feedback', 'joy_cosmetic', 'team_signups'];

export async function deleteAccount({request, db, member}) {
 const body = await readJson(request);
 if (String(body.confirm ?? '').trim().toUpperCase() !== 'ELIMINA') fail(400, 'Per confermare scrivi ELIMINA.');
 if (member.role === 'organizer') {
  const others = await db.prepare(`SELECT COUNT(*) AS n FROM members WHERE role = 'organizer' AND status = 'approved' AND id <> ?`).bind(member.id).first();
  if (!others.n) fail(400, 'Sei l’unico referente: prima nomina un altro referente, poi potrai eliminare il tuo account.');
 }
 const now = Math.floor(Date.now() / 1000);
 const statements = [];
 for (const table of DELETE_TABLES) statements.push(db.prepare(`DELETE FROM ${table} WHERE member_id = ?`).bind(member.id));
 statements.push(db.prepare(`DELETE FROM bookings WHERE member_id = ? AND activity_id IN (SELECT id FROM activities WHERE starts_at > ?)`).bind(member.id, now));
 statements.push(db.prepare(`UPDATE members SET email = 'eliminato-' || id || '@soci.invalid', pseudonym = 'Ex socio', full_name = NULL, phone = NULL,
  password_hash = NULL, interests = '', role = 'participant', status = 'disabled' WHERE id = ?`).bind(member.id));
 for (const s of statements) {
  try { await s.run(); } catch (error) { if (!/no such table/.test(String(error?.message))) throw error; }
 }
 await notifyOrganizers(db, member.id, {kind: 'accesso', title: 'Un socio ha eliminato il suo account', body: `${member.pseudonym} ha eliminato l’account: i dati personali sono stati cancellati.`});
 return json({ok: true}, 200, {'Set-Cookie': EXPIRED_COOKIE});
}
