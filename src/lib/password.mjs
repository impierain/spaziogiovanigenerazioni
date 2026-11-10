const encoder = new TextEncoder();
const ITERATIONS = 100000; // massimo accettato da Cloudflare Workers per PBKDF2

const toBase64 = bytes => btoa(String.fromCharCode(...bytes));
const fromBase64 = text => Uint8Array.from(atob(text), char => char.charCodeAt(0));

async function derive(password, salt, iterations) {
 const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
 return new Uint8Array(await crypto.subtle.deriveBits({name: 'PBKDF2', hash: 'SHA-256', salt, iterations}, key, 256));
}

export async function hashPassword(password) {
 const salt = crypto.getRandomValues(new Uint8Array(16));
 const hash = await derive(password, salt, ITERATIONS);
 return `pbkdf2$${ITERATIONS}$${toBase64(salt)}$${toBase64(hash)}`;
}

// Impronta fittizia: serve a spendere lo stesso tempo anche se l'email non esiste.
const DUMMY = 'pbkdf2$100000$AAAAAAAAAAAAAAAAAAAAAA==$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=';

export async function verifyPassword(password, stored) {
 const parts = typeof stored === 'string' ? stored.split('$') : [];
 const valid = parts.length === 4 && parts[0] === 'pbkdf2';
 const [, iterations, salt, hash] = valid ? parts : DUMMY.split('$');
 const actual = await derive(String(password), fromBase64(salt), Number(iterations));
 const expected = fromBase64(hash);
 let diff = actual.length ^ expected.length;
 for (let i = 0; i < actual.length; i++) diff |= actual[i] ^ (expected[i] ?? 0);
 return valid && diff === 0;
}

export function passwordProblem(password) {
 if (typeof password !== 'string' || password.length < 10) return 'La password deve avere almeno 10 caratteri.';
 if (password.length > 128) return 'La password può avere al massimo 128 caratteri.';
 return null;
}
