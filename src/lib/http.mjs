export const json = (body, status = 200, headers = {}) =>
 Response.json(body, {status, headers: {'Cache-Control': 'no-store', ...headers}});

export class HttpError extends Error {
 constructor(status, message) {
  super(message);
  this.status = status;
 }
}

export const fail = (status, message) => {
 throw new HttpError(status, message);
};

export async function readJson(request, maxChars = 16384) {
 const text = await request.text();
 if (text.length > maxChars) fail(413, 'Richiesta troppo grande.');
 try {
  const body = JSON.parse(text || '{}');
  if (body === null || typeof body !== 'object' || Array.isArray(body)) fail(400, 'Dati non validi.');
  return body;
 } catch (error) {
  if (error instanceof HttpError) throw error;
  fail(400, 'Dati non validi.');
 }
}

// Testo obbligatorio o facoltativo, ripulito e con lunghezza massima.
export function text(value, label, {max = 120, min = 1, optional = false} = {}) {
 if (value === undefined || value === null || value === '') {
  if (optional) return null;
  fail(400, `${label}: campo obbligatorio.`);
 }
 if (typeof value !== 'string') fail(400, `${label}: valore non valido.`);
 const clean = value.trim().replace(/\s+/g, ' ');
 if (clean.length < min || clean.length > max) fail(400, `${label}: da ${min} a ${max} caratteri.`);
 return clean;
}

export function email(value) {
 const clean = text(value, 'Email', {max: 254}).toLowerCase();
 if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) fail(400, 'Email non valida.');
 return clean;
}

export function integer(value, label, {min = 0, max = 1000000, optional = false} = {}) {
 if (value === undefined || value === null || value === '') {
  if (optional) return null;
  fail(400, `${label}: campo obbligatorio.`);
 }
 const number = Number(value);
 if (!Number.isInteger(number) || number < min || number > max) fail(400, `${label}: numero da ${min} a ${max}.`);
 return number;
}

// Normalizza l'UID di una tessera NFC: esadecimale maiuscolo senza separatori.
export function uid(value) {
 const clean = text(value, 'Codice tessera', {max: 40}).replace(/[-: ]/g, '').toUpperCase();
 if (!/^[0-9A-F]{8,20}$/.test(clean) || clean.length % 2) fail(400, 'Codice tessera non valido.');
 return clean;
}

export const tumazzi = n => `${n} ${Number(n) === 1 ? 'Tumuzzu' : 'Tumazzi'}`;
