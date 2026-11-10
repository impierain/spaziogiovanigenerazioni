// Invio email opzionale tramite Resend. Se mancano RESEND_API_KEY e MAIL_FROM
// non parte nulla: il referente copia il link d'invito e lo manda a mano.
export async function sendEmail(env, {to, subject, text}) {
 if (!env.RESEND_API_KEY || !env.MAIL_FROM) return {sent: false, reason: 'non configurata'};
 try {
  const response = await fetch('https://api.resend.com/emails', {
   method: 'POST',
   headers: {Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json'},
   body: JSON.stringify({from: env.MAIL_FROM, to: [to], subject, text})
  });
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
