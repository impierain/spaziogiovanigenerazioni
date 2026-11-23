import {layout} from './email-template.mjs';

// Invio email opzionale: Brevo (BREVO_API_KEY) oppure Resend (RESEND_API_KEY),
// sempre con MAIL_FROM, es. "Spazio Giovani Generazioni <indirizzo@gmail.com>".
// Se manca la configurazione non parte nulla: il referente copia il link e lo manda a mano.
function parseFrom(value) {
 const match = String(value).match(/^\s*(?:"?([^"<]*?)"?\s*)?<([^>]+)>\s*$/);
 return match ? {name: match[1]?.trim() || undefined, email: match[2].trim()} : {email: String(value).trim()};
}

export async function sendEmail(env, {to, subject, text, html}) {
 if (!env.MAIL_FROM || !(env.BREVO_API_KEY || env.RESEND_API_KEY)) return {sent: false, reason: 'non configurata'};
 try {
  let response;
  if (env.BREVO_API_KEY) {
   response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {'api-key': env.BREVO_API_KEY, 'Content-Type': 'application/json', Accept: 'application/json'},
    body: JSON.stringify({sender: parseFrom(env.MAIL_FROM), to: [{email: to}], subject, textContent: text, ...(html ? {htmlContent: html} : {})})
   });
  } else {
   response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json'},
    body: JSON.stringify({from: env.MAIL_FROM, to: [to], subject, text, ...(html ? {html} : {})})
   });
  }
  if (response.ok) {
   // Ricorda l'ultimo invio riuscito: serve ad avvisare prima che la chiave del servizio email scada per inattività.
   try { await env.DB?.prepare(`INSERT INTO app_state (key, value) VALUES ('mail_last_ok', unixepoch()) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = unixepoch()`).run(); } catch { /* tabella non ancora creata: nessun problema */ }
   return {sent: true};
  }
  return {sent: false, reason: `errore ${response.status}`};
 } catch {
  return {sent: false, reason: 'rete non raggiungibile'};
 }
}

export function inviteEmail({name, url, purpose}) {
 const reset = purpose === 'reset';
 const subject = reset ? 'Scegli una nuova password · CCA SIEMMU' : 'Benvenutə a CCA SIEMMU · completa il tuo profilo';
 const title = reset ? 'Nuova password' : 'Benvenutə a CCA SIEMMU!';
 const intro = reset
  ? 'Un referente ha avviato il ripristino della tua password. Basta un minuto per sceglierne una nuova.'
  : 'Ti abbiamo aggiunto a CCA SIEMMU, lo spazio gratuito per giovani di Cammarata e San Giovanni Gemini. Per entrare devi solo scegliere la tua password.';
 const button = reset ? 'Scegli la nuova password' : 'Completa il mio profilo';
 const steps = reset
  ? ['Apri il link.', 'Scegli una password di almeno 10 caratteri.', 'Accedi con la tua email e la nuova password.']
  : ['Apri il link.', 'Scegli una password di almeno 10 caratteri.', 'Da quel momento puoi prenotare le attività, chiedere la verifica delle missioni e vedere i tuoi progressi.'];

 return layout({
  subject, title, intro, greeting: `Ciao ${name},`, button, url, steps,
  eyebrow: reset ? 'IL TUO ACCESSO AL BORGO' : 'BENVENUTƏ NEL BORGO',
  note: 'Il link vale 7 giorni e si usa una sola volta.',
  footerNote: "Se non te l’aspettavi, ignora questa email: non succede nulla.",
  showLink: true
 });
}
