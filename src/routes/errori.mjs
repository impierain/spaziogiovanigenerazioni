import {json, readJson} from '../lib/http.mjs';

// Errori del sito segnalati dal browser: finiscono nei log di Cloudflare, nessun dato salvato nel database.
export async function report({request, member}) {
 let body = {};
 try { body = await readJson(request); } catch { return json({ok: false}, 400); }
 const clip = (v, n) => String(v ?? '').replace(/[\r\n]+/g, ' ').slice(0, n);
 console.warn('Errore nel sito', JSON.stringify({message: clip(body.message, 500), where: clip(body.where, 300), page: clip(body.page, 60), agent: clip(body.agent, 160), member: member?.id ?? null}));
 return json({ok: true});
}
