import {fail, json, readJson, integer, text} from '../lib/http.mjs';
import {lastAccess, recordAccess} from './accessi.mjs';

// Risposta al promemoria «Sei ancora in sede?»: arriva dai due pulsanti della notifica o dalla pagina dell'app.
// «uscito» registra l'uscita adesso; «ancora» toglie l'uscita automatica per questo ingresso (il promemoria si ripete dopo qualche ora).
export async function stato({db, member}) {
 const last = await lastAccess(db, member.id);
 const row = last?.direction === 'IN' ? await db.prepare('SELECT id, at FROM accessi WHERE member_id = ? AND direction = ? AND at = ? ORDER BY id DESC LIMIT 1').bind(member.id, 'IN', last.at).first() : null;
 return json({inside: !!row, id: row?.id ?? null, at: row?.at ?? null});
}

export async function risposta({request, db, member}) {
 const body = await readJson(request);
 const answer = text(body.answer, 'Risposta', {max: 10});
 if (!['ancora', 'uscito'].includes(answer)) fail(400, 'Risposta non valida.');
 const id = integer(body.id, 'Ingresso', {min: 1, max: 1e12});
 const entry = await db.prepare(`SELECT id, at FROM accessi WHERE id = ? AND member_id = ? AND direction = 'IN'`).bind(id, member.id).first();
 if (!entry) fail(404, 'Ingresso non trovato.');
 const last = await lastAccess(db, member.id);
 // Se nel frattempo l'uscita è già stata registrata (da lui, da un referente o in automatico) non c'è più nulla da fare.
 if (!last || last.direction !== 'IN' || last.at !== entry.at) return json({ok: true, state: 'gia-uscito'});
 const now = Math.floor(Date.now() / 1000);
 if (answer === 'uscito') {
  await recordAccess(db, {memberId: member.id, direction: 'OUT', at: Math.max(now, entry.at), source: 'pannello', recordedBy: null});
  return json({ok: true, state: 'uscito'});
 }
 await db.prepare(`INSERT OR REPLACE INTO reminders_sent (kind, ref, member_id, sent_at) VALUES ('sede-ancora', ?, ?, ?)`).bind(String(entry.id), member.id, now).run();
 return json({ok: true, state: 'ancora'});
}
