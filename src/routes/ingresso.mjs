// QR all'ingresso: il socio lo scansiona, fa il login se serve e registra ingresso o uscita.
// Il codice nel QR è un segreto che i referenti possono rigenerare; l'uscita non richiede il codice.
import {fail, json, readJson} from '../lib/http.mjs';
import {lastAccess, recordAccess} from './accessi.mjs';
import {checkTrophies} from '../lib/trophies.mjs';

const STALE_SECONDS = 16 * 3600;
const ALPHABET = 'abcdefghjkmnpqrstuvwxyz23456789';

function newCode() {
 const bytes = crypto.getRandomValues(new Uint8Array(20));
 return Array.from(bytes, b => ALPHABET[b % ALPHABET.length]).join('');
}

export async function currentCode(db, {rotate = false} = {}) {
 if (!rotate) {
  const row = await db.prepare(`SELECT text_value FROM app_settings WHERE key = 'checkin_code'`).first();
  if (row) return row.text_value;
 }
 const code = newCode();
 await db.prepare(`INSERT INTO app_settings (key, text_value) VALUES ('checkin_code', ?)
  ON CONFLICT(key) DO UPDATE SET text_value = excluded.text_value, updated_at = unixepoch()`).bind(code).run();
 return code;
}

// Confronto a tempo costante.
function same(a, b) {
 if (typeof a !== 'string' || a.length !== b.length) return false;
 let diff = 0;
 for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
 return diff === 0;
}

async function myState(db, memberId, now) {
 const last = await lastAccess(db, memberId);
 const inside = last?.direction === 'IN' && now - last.at < STALE_SECONDS;
 return {inside, since: inside ? last.at : null};
}

export async function mine({db, member}) {
 return json(await myState(db, member.id, Math.floor(Date.now() / 1000)));
}

export async function checkin({request, env, db, member}) {
 const body = await readJson(request);
 const now = Math.floor(Date.now() / 1000);
 // Il codice del QR è facoltativo: chi registra da solo dal sito (senza QR) non lo manda.
 if (body.code !== undefined && !same(typeof body.code === 'string' ? body.code : '', await currentCode(db))) fail(403, 'Codice non valido o cambiato: scansiona il QR aggiornato all’ingresso.');
 const result = await recordAccess(db, {memberId: member.id, direction: undefined, at: now, source: 'pannello', recordedBy: member.id});
 if (result.direction === 'IN') await checkTrophies(env, db, member.id);
 return json({access: result});
}

// Uscita dal sito, senza QR: serve a chi dimentica di registrarla.
export async function checkout({db, member}) {
 const now = Math.floor(Date.now() / 1000);
 const state = await myState(db, member.id, now);
 if (!state.inside) fail(409, 'Non risulti dentro.');
 const result = await recordAccess(db, {memberId: member.id, direction: 'OUT', at: now, source: 'pannello', recordedBy: member.id});
 return json({access: result});
}

export async function getCode({db}) {
 return json({code: await currentCode(db)});
}

export async function rotateCode({db}) {
 return json({code: await currentCode(db, {rotate: true})});
}
