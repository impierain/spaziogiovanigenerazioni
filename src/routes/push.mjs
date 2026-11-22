import {fail, json, readJson} from '../lib/http.mjs';
import {allowedEndpoint, vapidKeys, b64u} from '../lib/webpush.mjs';

const MAX_DEVICES = 5;

export async function key({env, db}) {
 return json({publicKey: (await vapidKeys(env, db)).publicKey});
}

export async function subscribe({request, db, member}) {
 const body = await readJson(request);
 const endpoint = typeof body.endpoint === 'string' ? body.endpoint : '';
 const p256dh = body.keys?.p256dh, auth = body.keys?.auth;
 if (!allowedEndpoint(endpoint)) fail(400, 'Questo browser non è supportato per le notifiche.');
 try {
  if (b64u.dec(p256dh).length !== 65 || b64u.dec(auth).length < 16) throw new Error();
 } catch { fail(400, 'Dati del dispositivo non validi.'); }
 const count = await db.prepare('SELECT COUNT(*) AS n FROM push_subscriptions WHERE member_id = ? AND endpoint <> ?').bind(member.id, endpoint).first();
 if (count.n >= MAX_DEVICES) fail(409, `Puoi attivare le notifiche su al massimo ${MAX_DEVICES} dispositivi.`);
 await db.prepare(`INSERT INTO push_subscriptions (member_id, endpoint, p256dh, auth) VALUES (?, ?, ?, ?)
  ON CONFLICT(endpoint) DO UPDATE SET member_id = excluded.member_id, p256dh = excluded.p256dh, auth = excluded.auth`).bind(member.id, endpoint, p256dh, auth).run();
 return json({ok: true}, 201);
}

export async function unsubscribe({request, db, member}) {
 const body = await readJson(request);
 await db.prepare('DELETE FROM push_subscriptions WHERE member_id = ? AND endpoint = ?').bind(member.id, String(body.endpoint ?? '')).run();
 return json({ok: true});
}
