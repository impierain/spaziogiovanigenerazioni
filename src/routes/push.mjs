import {fail, json, readJson} from '../lib/http.mjs';
import {allowedEndpoint, vapidKeys, sendPush, b64u} from '../lib/webpush.mjs';
import {newToken, tokenHash} from '../tokens.mjs';

const MAX_DEVICES = 5;

export async function key({env, db}) {
 return json({publicKey: (await vapidKeys(env, db)).publicKey});
}

// Attiva le notifiche su un dispositivo e manda una notifica di prova con un codice monouso.
// Il Tumazzu arriva solo quando il socio conferma di averla ricevuta (vedi confirm).
export async function subscribe({request, env, db, member}) {
 const body = await readJson(request);
 const endpoint = typeof body.endpoint === 'string' ? body.endpoint : '';
 const p256dh = body.keys?.p256dh, auth = body.keys?.auth;
 if (!allowedEndpoint(endpoint)) fail(400, 'Questo browser non è supportato per le notifiche.');
 try {
  if (b64u.dec(p256dh).length !== 65 || b64u.dec(auth).length < 16) throw new Error();
 } catch { fail(400, 'Dati del dispositivo non validi.'); }
 const count = await db.prepare('SELECT COUNT(*) AS n FROM push_subscriptions WHERE member_id = ? AND endpoint <> ?').bind(member.id, endpoint).first();
 if (count.n >= MAX_DEVICES) fail(409, `Puoi attivare le notifiche su al massimo ${MAX_DEVICES} dispositivi.`);
 const before = await db.prepare('SELECT member_id, confirmed_at FROM push_subscriptions WHERE endpoint = ?').bind(endpoint).first();
 const sameOwner = before?.member_id === member.id;
 await db.prepare(`INSERT INTO push_subscriptions (member_id, endpoint, p256dh, auth) VALUES (?, ?, ?, ?)
  ON CONFLICT(endpoint) DO UPDATE SET member_id = excluded.member_id, p256dh = excluded.p256dh, auth = excluded.auth,
   confirmed_at = CASE WHEN push_subscriptions.member_id = excluded.member_id THEN push_subscriptions.confirmed_at ELSE NULL END`).bind(member.id, endpoint, p256dh, auth).run();
 if (sameOwner && before.confirmed_at) return json({ok: true, confirmed: true, testSent: false}, 201);
 const {token, hash} = await newToken();
 await db.prepare('UPDATE push_subscriptions SET test_token = ? WHERE endpoint = ?').bind(hash, endpoint).run();
 const delivered = await sendPush(env, db, member.id, {
  title: 'Notifiche attive ✓', body: 'Ti è arrivata la notifica? Toccala per confermare e ricevere 1 Tumazzu.',
  url: `/#notifiche-ok/${token}`, token, tag: 'cca-prova', actions: [{action: 'ok', title: 'Sì, tutto ok'}]
 }, {endpoint});
 return json({ok: true, confirmed: false, testSent: delivered > 0}, 201);
}

// Il socio conferma di aver ricevuto la notifica di prova: il codice è nel messaggio cifrato, quindi prova la ricezione.
export async function confirm({request, db, member}) {
 const body = await readJson(request);
 const token = typeof body.token === 'string' ? body.token : '';
 if (!/^[0-9a-f]{64}$/.test(token)) fail(400, 'Conferma non valida.');
 const row = await db.prepare('SELECT id FROM push_subscriptions WHERE member_id = ? AND test_token = ?').bind(member.id, await tokenHash(token)).first();
 if (!row) fail(400, 'Conferma non valida o già usata. Dal profilo puoi rimandare la notifica di prova.');
 await db.prepare('UPDATE push_subscriptions SET confirmed_at = unixepoch(), test_token = NULL WHERE id = ?').bind(row.id).run();
 // Un Tumazzu una sola volta in assoluto (chiave: socio + tipo + riferimento).
 const gift = await db.prepare("INSERT OR IGNORE INTO joy_rewards (member_id, kind, ref, cheese, payload) VALUES (?, 'micro', 'notifiche', 1, ?)")
  .bind(member.id, JSON.stringify({title: 'Notifiche verificate'})).run();
 return json({ok: true, reward: gift.meta.changes > 0 ? {cheese: 1} : null});
}

export async function unsubscribe({request, db, member}) {
 const body = await readJson(request);
 await db.prepare('DELETE FROM push_subscriptions WHERE member_id = ? AND endpoint = ?').bind(member.id, String(body.endpoint ?? '')).run();
 return json({ok: true});
}

// Stato per il socio: ha almeno un dispositivo verificato?
export async function status({db, member}) {
 const row = await db.prepare('SELECT COUNT(*) AS devices, COALESCE(SUM(confirmed_at IS NOT NULL), 0) AS confirmed FROM push_subscriptions WHERE member_id = ?').bind(member.id).first();
 return json({devices: row.devices, confirmed: row.confirmed > 0});
}

// Per i referenti: chi ha attivato le notifiche e se la prova è andata a buon fine (mai l'identificativo del dispositivo).
export async function overview({db}) {
 const {results} = await db.prepare(`SELECT m.pseudonym AS name, COUNT(*) AS devices, SUM(p.confirmed_at IS NOT NULL) AS confirmed, MIN(p.created_at) AS since
  FROM push_subscriptions p JOIN members m ON m.id = p.member_id WHERE m.status = 'approved' GROUP BY m.id ORDER BY since`).all();
 const total = await db.prepare("SELECT COUNT(*) AS n FROM members WHERE status = 'approved'").first();
 return json({members: results.map(r => ({name: r.name, devices: r.devices, verified: r.confirmed > 0, since: r.since})), totalMembers: total.n});
}
