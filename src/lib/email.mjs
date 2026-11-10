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
  return response.ok ? {sent: true} : {sent: false, reason: `errore ${response.status}`};
 } catch {
  return {sent: false, reason: 'rete non raggiungibile'};
 }
}

const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));

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

 const text = `${title}\n\nCiao ${name},\n${intro}\n\n${button}:\n${url}\n\nCome si fa\n${steps.map((step, i) => `${i + 1}. ${step}`).join('\n')}\n\nIl link vale 7 giorni e si usa una sola volta. Se non te l'aspettavi, ignora questa email: non succede nulla.\n\nE boni siemmu,\nSpazio Giovani Generazioni\n`;

 const ink = '#171523', paper = '#fff3d5', sky = '#8feafc', lime = '#caff4d', orange = '#fe4400';
 const safeUrl = escapeHtml(url);
 const html = `<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(subject)}</title></head>
<body style="margin:0;padding:0;background:${paper};font-family:Arial,Helvetica,sans-serif;color:${ink}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(intro)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${paper}"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:3px solid ${ink}">
<tr><td style="background:${sky};padding:22px 24px;border-bottom:3px solid ${ink}">
<div style="font:700 12px 'Courier New',monospace;letter-spacing:2px;color:${ink}">CAMMARATA + SAN GIOVANNI GEMINI</div>
<div style="font-size:30px;font-weight:900;letter-spacing:-1px;margin-top:6px;color:${ink}">CCA SIEMMU</div>
<div style="font-size:15px;margin-top:2px;color:${ink}">E boni siemmu</div>
</td></tr>
<tr><td style="padding:28px 24px 8px">
<h1 style="margin:0 0 12px;font-size:24px;line-height:1.25;color:${ink}">${escapeHtml(title)}</h1>
<p style="margin:0 0 20px;font-size:16px;line-height:1.55">Ciao ${escapeHtml(name)},<br>${escapeHtml(intro)}</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 6px"><tr><td style="background:${orange};border:3px solid ${ink};box-shadow:4px 4px 0 ${ink}">
<a href="${safeUrl}" style="display:inline-block;padding:14px 22px;font-size:17px;font-weight:900;color:#ffffff;text-decoration:none">${escapeHtml(button)} →</a>
</td></tr></table>
<p style="margin:14px 0 0;font-size:13px;color:#555">Il link vale 7 giorni e si usa una sola volta.</p>
</td></tr>
<tr><td style="padding:12px 24px 8px">
<div style="background:${paper};border:2px solid ${ink};padding:16px 18px">
<div style="font-weight:900;font-size:15px;margin-bottom:8px">Come si fa</div>
<ol style="margin:0;padding-left:20px;font-size:15px;line-height:1.6">${steps.map(step => `<li>${escapeHtml(step)}</li>`).join('')}</ol>
</div></td></tr>
<tr><td style="padding:16px 24px 24px">
<p style="margin:0 0 6px;font-size:13px;color:#555">Il pulsante non funziona? Copia questo indirizzo nel browser:</p>
<p style="margin:0;font-size:12px;word-break:break-all;color:${ink}"><a href="${safeUrl}" style="color:${ink}">${safeUrl}</a></p>
</td></tr>
<tr><td style="background:${lime};padding:16px 24px;border-top:3px solid ${ink};font-size:13px;line-height:1.5">
<strong>Spazio Giovani Generazioni</strong><br>Progetto finanziato dal Corpo europeo di solidarietà.<br>
Se non te l'aspettavi, ignora questa email: non succede nulla.
</td></tr>
</table></td></tr></table></body></html>`;
 return {subject, text, html};
}
