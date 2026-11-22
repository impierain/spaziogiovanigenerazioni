// Notifiche push (Web Push, RFC 8030 + VAPID RFC 8292 + cifratura aes128gcm RFC 8291) con la sola WebCrypto.
const enc = new TextEncoder();
export const b64u = {
 enc: bytes => btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''),
 dec: text => Uint8Array.from(atob(String(text).replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(String(text).length / 4) * 4, '=')), c => c.charCodeAt(0))
};
const concat = (...parts) => { const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0)); let at = 0; for (const p of parts) { out.set(p, at); at += p.length; } return out; };

// Solo i servizi push dei browser: il Worker non deve poter chiamare indirizzi qualsiasi.
const PUSH_HOSTS = [/^fcm\.googleapis\.com$/, /^updates\.push\.services\.mozilla\.com$/, /(^|\.)push\.apple\.com$/, /(^|\.)notify\.windows\.com$/, /^updates-autopush\.(stage\.)?mozaws\.net$/];
export function allowedEndpoint(value) {
 try {
  const url = new URL(value);
  return url.protocol === 'https:' && !url.port && !url.username && PUSH_HOSTS.some(re => re.test(url.hostname)) && value.length <= 600;
 } catch { return false; }
}

// Le chiavi VAPID stanno nei segreti del Worker, se ci sono; altrimenti si creano una volta e restano nel database.
export async function vapidKeys(env, db) {
 if (env.VAPID_PUBLIC_KEY && env.VAPID_PRIVATE_KEY) return {publicKey: env.VAPID_PUBLIC_KEY, privateKey: env.VAPID_PRIVATE_KEY};
 const read = async () => {
  const {results} = await db.prepare("SELECT key, text_value FROM app_settings WHERE key IN ('vapid_public', 'vapid_private')").all();
  const map = Object.fromEntries(results.map(r => [r.key, r.text_value]));
  return map.vapid_public && map.vapid_private ? {publicKey: map.vapid_public, privateKey: map.vapid_private} : null;
 };
 const existing = await read();
 if (existing) return existing;
 const pair = await crypto.subtle.generateKey({name: 'ECDSA', namedCurve: 'P-256'}, true, ['sign']);
 const jwk = await crypto.subtle.exportKey('jwk', pair.privateKey);
 const publicKey = b64u.enc(concat(new Uint8Array([4]), b64u.dec(jwk.x), b64u.dec(jwk.y)));
 await db.batch([
  db.prepare("INSERT OR IGNORE INTO app_settings (key, text_value) VALUES ('vapid_public', ?)").bind(publicKey),
  db.prepare("INSERT OR IGNORE INTO app_settings (key, text_value) VALUES ('vapid_private', ?)").bind(jwk.d)
 ]);
 return await read();
}

async function vapidHeader(keys, endpoint, subject) {
 const pub = b64u.dec(keys.publicKey);
 const key = await crypto.subtle.importKey('jwk', {kty: 'EC', crv: 'P-256', d: keys.privateKey, x: b64u.enc(pub.slice(1, 33)), y: b64u.enc(pub.slice(33, 65)), ext: true}, {name: 'ECDSA', namedCurve: 'P-256'}, false, ['sign']);
 const head = b64u.enc(enc.encode(JSON.stringify({typ: 'JWT', alg: 'ES256'})));
 const body = b64u.enc(enc.encode(JSON.stringify({aud: new URL(endpoint).origin, exp: Math.floor(Date.now() / 1000) + 12 * 3600, sub: subject})));
 const signature = new Uint8Array(await crypto.subtle.sign({name: 'ECDSA', hash: 'SHA-256'}, key, enc.encode(`${head}.${body}`)));
 return `vapid t=${head}.${body}.${b64u.enc(signature)}, k=${keys.publicKey}`;
}

const hkdf = async (salt, ikm, info, bytes) => {
 const base = await crypto.subtle.importKey('raw', ikm, 'HKDF', false, ['deriveBits']);
 return new Uint8Array(await crypto.subtle.deriveBits({name: 'HKDF', hash: 'SHA-256', salt, info}, base, bytes * 8));
};

// Cifra il messaggio per un dispositivo (RFC 8291): un solo record da massimo 4096 byte.
export async function encryptPayload(plaintext, p256dh, auth) {
 const uaPublic = b64u.dec(p256dh);
 const authSecret = b64u.dec(auth);
 const pair = await crypto.subtle.generateKey({name: 'ECDH', namedCurve: 'P-256'}, true, ['deriveBits']);
 const asPublic = new Uint8Array(await crypto.subtle.exportKey('raw', pair.publicKey));
 const uaKey = await crypto.subtle.importKey('raw', uaPublic, {name: 'ECDH', namedCurve: 'P-256'}, false, []);
 const shared = new Uint8Array(await crypto.subtle.deriveBits({name: 'ECDH', public: uaKey}, pair.privateKey, 256));
 const prk = await hkdf(authSecret, shared, concat(enc.encode('WebPush: info\0'), uaPublic, asPublic), 32);
 const salt = crypto.getRandomValues(new Uint8Array(16));
 const cek = await hkdf(salt, prk, enc.encode('Content-Encoding: aes128gcm\0'), 16);
 const nonce = await hkdf(salt, prk, enc.encode('Content-Encoding: nonce\0'), 12);
 const data = concat(enc.encode(plaintext), new Uint8Array([2]));
 if (data.length > 4096 - 17) throw new Error('Messaggio troppo lungo');
 const aes = await crypto.subtle.importKey('raw', cek, 'AES-GCM', false, ['encrypt']);
 const cipher = new Uint8Array(await crypto.subtle.encrypt({name: 'AES-GCM', iv: nonce}, aes, data));
 return concat(salt, new Uint8Array([0, 0, 16, 0, asPublic.length]), asPublic, cipher);
}

// Manda la notifica a tutti i dispositivi attivi del socio. Ritorna quanti l'hanno ricevuta.
export async function sendPush(env, db, memberId, {title, body, url = '/'}) {
 try {
  const {results} = await db.prepare('SELECT id, endpoint, p256dh, auth FROM push_subscriptions WHERE member_id = ?').bind(memberId).all();
  if (!results.length) return 0;
  const keys = await vapidKeys(env, db);
  const payload = JSON.stringify({title, body, url});
  let delivered = 0;
  for (const sub of results) {
   try {
    const response = await fetch(sub.endpoint, {
     method: 'POST',
     headers: {Authorization: await vapidHeader(keys, sub.endpoint, env.VAPID_SUBJECT || 'mailto:spaziogiovanigenerazioni@gmail.com'), 'Content-Encoding': 'aes128gcm', 'Content-Type': 'application/octet-stream', TTL: '3600', Urgency: 'normal'},
     body: await encryptPayload(payload, sub.p256dh, sub.auth)
    });
    if (response.ok) delivered++;
    else if (response.status === 404 || response.status === 410) await db.prepare('DELETE FROM push_subscriptions WHERE id = ?').bind(sub.id).run();
   } catch { /* un dispositivo irraggiungibile non ferma gli altri */ }
  }
  return delivered;
 } catch {
  return 0;
 }
}
