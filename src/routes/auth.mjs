import {fail, json, readJson, email, text} from '../lib/http.mjs';
import {hashPassword, passwordProblem, verifyPassword} from '../lib/password.mjs';
import {EXPIRED_COOKIE, endSession, startSession} from '../lib/session.mjs';
import {tokenHash} from '../tokens.mjs';
import {unreadCount} from './notifications.mjs';

const MAX_FAILED = 8;
const WINDOW_SECONDS = 15 * 60;

export const publicMember = member => ({
 id: member.id, email: member.email, pseudonym: member.pseudonym,
 fullName: member.full_name, role: member.role,
 interests: String(member.interests || '').split(',').filter(Boolean)
});

export async function memberTotals(db, memberId) {
 const row = await db.prepare('SELECT xp, cheese_earned, cheese_spent FROM member_totals WHERE member_id = ?').bind(memberId).first();
 return {xp: row?.xp ?? 0, cheese: (row?.cheese_earned ?? 0) - (row?.cheese_spent ?? 0), earned: row?.cheese_earned ?? 0};
}

export async function login({request, db}) {
 const body = await readJson(request);
 const address = email(body.email);
 const password = typeof body.password === 'string' ? body.password : '';
 const since = Math.floor(Date.now() / 1000) - WINDOW_SECONDS;
 const failed = await db.prepare('SELECT COUNT(*) AS n FROM auth_attempts WHERE email = ? AND at > ?').bind(address, since).first();
 if (failed.n >= MAX_FAILED) fail(429, 'Troppi tentativi. Riprova tra qualche minuto.');

 const member = await db.prepare(`SELECT id, email, pseudonym, full_name, role, status, interests, password_hash
  FROM members WHERE email = ?`).bind(address).first();
 const valid = await verifyPassword(password, member?.password_hash);
 if (!member || !valid || member.status !== 'approved') {
  await db.batch([
   db.prepare('DELETE FROM auth_attempts WHERE at <= ?').bind(since),
   db.prepare('INSERT INTO auth_attempts (email, at) VALUES (?, unixepoch())').bind(address)
  ]);
  fail(401, 'Email o password non corretti.');
 }
 await db.prepare('DELETE FROM auth_attempts WHERE email = ?').bind(address).run();
 const cookie = await startSession(db, member.id);
 return json({member: publicMember(member)}, 200, {'Set-Cookie': cookie});
}

export async function logout({request, db}) {
 await endSession(request, db);
 return json({ok: true}, 200, {'Set-Cookie': EXPIRED_COOKIE});
}

export async function me({member, db}) {
 if (!member) return json({member: null});
 return json({member: publicMember(member), totals: await memberTotals(db, member.id), unread: await unreadCount(db, member.id)});
}

async function tokenRow(db, token) {
 const hash = await tokenHash(token);
 if (!hash) return null;
 return db.prepare(`SELECT t.purpose, m.id AS member_id, m.pseudonym, m.full_name, m.status
  FROM password_tokens t JOIN members m ON m.id = t.member_id
  WHERE t.token_hash = ? AND t.consumed_at IS NULL AND t.expires_at > unixepoch()`).bind(hash).first();
}

// Controlla il link senza consumarlo: le anteprime automatiche dei client email non lo esauriscono.
export async function checkToken({url, db}) {
 const row = await tokenRow(db, url.searchParams.get('token'));
 if (!row || row.status === 'disabled') fail(404, 'Il link non è valido o è scaduto.');
 return json({valid: true, purpose: row.purpose, name: row.full_name || row.pseudonym});
}

export async function setPassword({request, db}) {
 const body = await readJson(request);
 const problem = passwordProblem(body.password);
 if (problem) fail(400, problem);
 const hash = await tokenHash(body.token);
 const row = await tokenRow(db, body.token);
 if (!row || row.status === 'disabled') fail(404, 'Il link non è valido o è scaduto.');

 const passwordHash = await hashPassword(body.password);
 // Prima aggiorna la password solo se il link è ancora libero, poi lo consuma: tutto in una transazione.
 const [updated] = await db.batch([
  db.prepare(`UPDATE members SET password_hash = ? WHERE id = ? AND status = 'approved'
   AND EXISTS (SELECT 1 FROM password_tokens WHERE token_hash = ? AND consumed_at IS NULL AND expires_at > unixepoch())`)
   .bind(passwordHash, row.member_id, hash),
  db.prepare('UPDATE password_tokens SET consumed_at = unixepoch() WHERE token_hash = ? AND consumed_at IS NULL').bind(hash),
  db.prepare('DELETE FROM sessions WHERE member_id = ?').bind(row.member_id)
 ]);
 if (!updated.meta.changes) fail(404, 'Il link non è valido o è scaduto.');
 const cookie = await startSession(db, row.member_id);
 const member = await db.prepare('SELECT id, email, pseudonym, full_name, role, interests FROM members WHERE id = ?').bind(row.member_id).first();
 return json({member: publicMember(member)}, 200, {'Set-Cookie': cookie});
}

export async function changePassword({request, db, member}) {
 const body = await readJson(request);
 const problem = passwordProblem(body.next);
 if (problem) fail(400, problem);
 const row = await db.prepare('SELECT password_hash FROM members WHERE id = ?').bind(member.id).first();
 if (!await verifyPassword(text(body.current, 'Password attuale', {max: 128}), row?.password_hash)) {
  fail(403, 'La password attuale non è corretta.');
 }
 await db.prepare('UPDATE members SET password_hash = ? WHERE id = ?').bind(await hashPassword(body.next), member.id).run();
 return json({ok: true});
}

// Il socio cambia da solo il proprio nome utente e i propri interessi.
const INTEREST_PATHS = ['studio', 'creativita', 'socialita', 'cittadinanza', 'solidarieta'];
export async function updateProfile({request, db, member}) {
 const body = await readJson(request);
 const sets = [];
 const values = [];
 if ('pseudonym' in body) { sets.push('pseudonym = ?'); values.push(text(body.pseudonym, 'Nome utente', {max: 28})); }
 if ('interests' in body) {
  if (!Array.isArray(body.interests) || body.interests.some(i => !INTEREST_PATHS.includes(i))) fail(400, 'Interessi non validi.');
  sets.push('interests = ?'); values.push([...new Set(body.interests)].join(','));
 }
 if (!sets.length) fail(400, 'Nessuna modifica indicata.');
 await db.prepare(`UPDATE members SET ${sets.join(', ')} WHERE id = ?`).bind(...values, member.id).run();
 const row = await db.prepare('SELECT id, email, pseudonym, full_name, role, interests FROM members WHERE id = ?').bind(member.id).first();
 return json({member: publicMember(row)});
}
