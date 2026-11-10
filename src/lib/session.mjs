import {newToken, sessionCookie, sessionToken, tokenHash} from '../tokens.mjs';

export const SESSION_SECONDS = 60 * 60 * 24 * 30;
export const EXPIRED_COOKIE = '__Host-cca_session=; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=0';

export async function currentMember(request, db) {
 const hash = await tokenHash(sessionToken(request));
 if (!hash) return null;
 return db.prepare(`SELECT m.id, m.email, m.pseudonym, m.full_name, m.role, m.status
  FROM sessions s JOIN members m ON m.id = s.member_id
  WHERE s.token_hash = ? AND s.expires_at > unixepoch() AND m.status = 'approved'`).bind(hash).first();
}

export async function startSession(db, memberId) {
 const {token, hash} = await newToken();
 const expires = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
 await db.batch([
  db.prepare('DELETE FROM sessions WHERE expires_at <= unixepoch()'),
  db.prepare('INSERT INTO sessions (token_hash, member_id, expires_at) VALUES (?, ?, ?)').bind(hash, memberId, expires)
 ]);
 return sessionCookie(token, SESSION_SECONDS);
}

export async function endSession(request, db) {
 const hash = await tokenHash(sessionToken(request));
 if (hash) await db.prepare('DELETE FROM sessions WHERE token_hash = ?').bind(hash).run();
}
