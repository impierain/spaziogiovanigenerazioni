const encoder = new TextEncoder();
const toHex = bytes => Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');

export async function tokenHash(token) {
 if (typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token)) return null;
 return toHex(new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(token))));
}

export async function newToken() {
 const token = toHex(crypto.getRandomValues(new Uint8Array(32)));
 return {token, hash: await tokenHash(token)};
}

export function sessionCookie(token, maxAgeSeconds) {
 if (!/^[a-f0-9]{64}$/.test(token) || !Number.isSafeInteger(maxAgeSeconds) || maxAgeSeconds <= 0) {
  throw new TypeError('Sessione non valida');
 }
 return `__Host-cca_session=${token}; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSeconds}`;
}

export function sessionToken(request) {
 const cookie = request.headers.get('Cookie') || '';
 const match = cookie.match(/(?:^|;\s*)__Host-cca_session=([a-f0-9]{64})(?=;|$)/);
 return match?.[1] ?? null;
}
