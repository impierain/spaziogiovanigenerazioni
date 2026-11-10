import {json, readJson} from '../lib/http.mjs';

const KEEP_SECONDS = 90 * 86400;

export async function unreadCount(db, memberId) {
 const row = await db.prepare('SELECT COUNT(*) AS n FROM notifications WHERE member_id = ? AND read_at IS NULL').bind(memberId).first();
 return row?.n ?? 0;
}

export async function list({db, member}) {
 const now = Math.floor(Date.now() / 1000);
 await db.prepare('DELETE FROM notifications WHERE member_id = ? AND created_at < ?').bind(member.id, now - KEEP_SECONDS).run();
 const {results} = await db.prepare(`SELECT id, kind, level, title, body, created_at AS createdAt, read_at IS NOT NULL AS read
  FROM notifications WHERE member_id = ? ORDER BY created_at DESC, id DESC LIMIT 60`).bind(member.id).all();
 return json({notifications: results.map(r => ({...r, read: !!r.read})), unread: await unreadCount(db, member.id)});
}

export async function markRead({request, db, member}) {
 const body = await readJson(request);
 if (Array.isArray(body.ids) && body.ids.length) {
  const ids = body.ids.filter(Number.isInteger).slice(0, 100);
  for (const id of ids) await db.prepare('UPDATE notifications SET read_at = unixepoch() WHERE id = ? AND member_id = ? AND read_at IS NULL').bind(id, member.id).run();
 } else {
  await db.prepare('UPDATE notifications SET read_at = unixepoch() WHERE member_id = ? AND read_at IS NULL').bind(member.id).run();
 }
 return json({unread: await unreadCount(db, member.id)});
}
