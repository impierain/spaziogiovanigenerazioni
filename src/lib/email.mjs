// Invio email opzionale: Brevo (BREVO_API_KEY) oppure Resend (RESEND_API_KEY),
// sempre con MAIL_FROM, es. "Spazio Giovani Generazioni <indirizzo@gmail.com>".
// Se manca la configurazione non parte nulla: il referente copia il link e lo manda a mano.
function parseFrom(value) {
 const match = String(value).match(/^\s*(?:"?([^"<]*?)"?\s*)?<([^>]+)>\s*$/);
 return match ? {name: match[1]?.trim() || undefined, email: match[2].trim()} : {email: String(value).trim()};
}

export async function sendEmail(env, {to, subject, text}) {
 if (!env.MAIL_FROM || !(env.BREVO_API_KEY || env.RESEND_API_KEY)) return {sent: false, reason: 'non configurata'};
 try {
  let response;
  if (env.BREVO_API_KEY) {
   response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {'api-key': env.BREVO_API_KEY, 'Content-Type': 'application/json', Accept: 'application/json'},
    body: JSON.stringify({sender: parseFrom(env.MAIL_FROM), to: [{email: to}], subject, textContent: text})
   });
  } else {
   response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json'},
    body: JSON.stringify({from: env.MAIL_FROM, to: [to], subject, text})
   });
  }
  return response.ok ? {sent: true} : {sent: false, reason: `errore ${response.status}`};
 } catch {
  return {sent: false, reason: 'rete non raggiungibile'};
 }
}

export function inviteEmail({name, url, purpose}) {
 const subject = purpose === 'reset' ? 'Reimposta la tua password · CCA SIEMMU' : 'Completa il tuo profilo · CCA SIEMMU';
 const intro = purpose === 'reset'
  ? 'Un referente ha avviato il ripristino della tua password.'
  : 'Sei stato aggiunto a CCA SIEMMU, lo spazio giovani di Cammarata e San Giovanni Gemini.';
 return {
  subject,
  text: `Ciao ${name},\n\n${intro}\nPer scegliere la password apri questo link. È valido 7 giorni e si usa una sola volta:\n\n${url}\n\nSe non ti aspettavi questa email, ignorala.\n`
 };
}
