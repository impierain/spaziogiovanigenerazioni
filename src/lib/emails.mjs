// Email dell'app con lo stesso design dell'invito: titolo, testo, riquadro con elenco, pulsante.
import {sendEmail} from './email.mjs';

export const SITE = 'https://spaziogiovanigenerazioni.pierobongiovanni19.workers.dev';
const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));

export function layout({subject, title, intro, items = [], itemsTitle = '', button, url, note = ''}) {
 const ink = '#171523', paper = '#fff3d5', sky = '#8feafc', lime = '#caff4d', orange = '#fe4400';
 const text = `${title}\n\n${intro}\n${items.length ? `\n${itemsTitle ? itemsTitle + '\n' : ''}${items.map(i => `- ${i.title}${i.text ? ': ' + i.text : ''}`).join('\n')}\n` : ''}\n${button}: ${url}\n${note ? `\n${note}\n` : ''}\nE boni siemmu,\nSpazio Giovani Generazioni\n`;
 const list = items.length ? `<tr><td style="padding:8px 24px"><div style="background:${paper};border:2px solid ${ink};padding:14px 18px">${itemsTitle ? `<div style="font-weight:900;font-size:15px;margin-bottom:8px">${escapeHtml(itemsTitle)}</div>` : ''}${items.map(i => `<div style="margin:0 0 10px;font-size:15px;line-height:1.5"><strong>${escapeHtml(i.title)}</strong>${i.text ? `<br><span style="color:#444">${escapeHtml(i.text)}</span>` : ''}</div>`).join('')}</div></td></tr>` : '';
 const html = `<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(subject)}</title></head>
<body style="margin:0;padding:0;background:${paper};font-family:Arial,Helvetica,sans-serif;color:${ink}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(intro)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${paper}"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:3px solid ${ink}">
<tr><td style="background:${sky};padding:22px 24px;border-bottom:3px solid ${ink}">
<div style="font:700 12px 'Courier New',monospace;letter-spacing:2px">CAMMARATA + SAN GIOVANNI GEMINI</div>
<div style="font-size:30px;font-weight:900;letter-spacing:-1px;margin-top:6px">CCA SIEMMU</div>
<div style="font-size:15px;margin-top:2px">E boni siemmu</div></td></tr>
<tr><td style="padding:28px 24px 12px"><h1 style="margin:0 0 12px;font-size:24px;line-height:1.25">${escapeHtml(title)}</h1>
<p style="margin:0;font-size:16px;line-height:1.55">${escapeHtml(intro)}</p></td></tr>
${list}
<tr><td style="padding:16px 24px 8px"><table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="background:${orange};border:3px solid ${ink};box-shadow:4px 4px 0 ${ink}">
<a href="${escapeHtml(url)}" style="display:inline-block;padding:14px 22px;font-size:17px;font-weight:900;color:#ffffff;text-decoration:none">${escapeHtml(button)} →</a></td></tr></table>
${note ? `<p style="margin:14px 0 0;font-size:13px;color:#555">${escapeHtml(note)}</p>` : ''}</td></tr>
<tr><td style="background:${lime};padding:16px 24px;margin-top:16px;border-top:3px solid ${ink};font-size:13px;line-height:1.5"><strong>Spazio Giovani Generazioni</strong><br>Progetto finanziato dal Corpo europeo di solidarietà.</td></tr>
</table></td></tr></table></body></html>`;
 return {subject, text, html};
}

// Invia una email a un socio. Gli indirizzi di prova (@demo.test) non ricevono nulla.
export async function mailMember(env, db, memberId, message) {
 try {
  const row = await db.prepare('SELECT email, COALESCE(full_name, pseudonym) AS name FROM members WHERE id = ?').bind(memberId).first();
  if (!row || /@demo\.test$/i.test(row.email)) return {sent: false, reason: 'indirizzo non valido'};
  return await sendEmail(env, {to: row.email, ...(typeof message === 'function' ? message(row.name) : message)});
 } catch {
  return {sent: false, reason: 'errore'};
 }
}

export const trophyEmail = (name, trophies) => layout({
 subject: trophies.length === 1 ? `Nuovo trofeo: ${trophies[0].name} · CCA SIEMMU` : `Hai ${trophies.length} nuovi trofei · CCA SIEMMU`,
 title: trophies.length === 1 ? 'Hai ottenuto un trofeo!' : 'Hai ottenuto nuovi trofei!',
 intro: `Complimenti ${name}! Lo spazio si fa più bello anche grazie a te.`,
 itemsTitle: trophies.length === 1 ? 'Il tuo trofeo' : 'I tuoi trofei', items: trophies.map(t => ({title: t.name, text: t.desc})),
 button: 'Guarda i miei trofei', url: `${SITE}/#trofei`
});

export const redemptionEmail = (name, {reward, cost, balance, status}) => status === 'delivered'
 ? layout({subject: `Premio consegnato: ${reward} · CCA SIEMMU`, title: 'Premio consegnato!', intro: `Ciao ${name}, ti abbiamo consegnato il premio che avevi riscattato. Goditelo!`, items: [{title: reward, text: `${cost} Formaggi`}], button: 'Apri la Putìa', url: `${SITE}/#putia`})
 : layout({subject: `Hai riscattato: ${reward} · CCA SIEMMU`, title: 'Premio riscattato!', intro: `Ciao ${name}, hai riscattato un premio nella Putìa. Passa in sede negli orari di apertura (da lunedì a venerdì, 16:00–20:00): un referente te lo consegna.`, items: [{title: reward, text: `${cost} Formaggi spesi · te ne restano ${balance}`}], button: 'Apri la Putìa', url: `${SITE}/#putia`, note: 'Cambiato idea? Puoi annullare il riscatto finché non è consegnato: i Formaggi tornano subito tuoi.'});

export const reminderEmail = (name, {activity, when}) => layout({
 subject: `Promemoria: ${activity} · CCA SIEMMU`, title: 'Ti aspettiamo!',
 intro: `Ciao ${name}, ti ricordiamo che hai un posto confermato.`, items: [{title: activity, text: when}],
 button: 'Apri il calendario', url: `${SITE}/#calendario`, note: 'Non puoi più venire? Annulla la prenotazione dal calendario, così il posto va a un altro.'
});

export const weeklyEmail = (name, lines) => layout({
 subject: 'Riepilogo della settimana · CCA SIEMMU', title: 'La settimana in sede',
 intro: `Ciao ${name}, ecco cosa aspetta i referenti.`, itemsTitle: 'In breve', items: lines,
 button: 'Apri il pannello referenti', url: `${SITE}/#referenti`
});

export const exchangeEmail = (name, {title, text, button = 'Apri la banca del tempo'}) => layout({
 subject: `${title} · CCA SIEMMU`, title, intro: `Ciao ${name},`, items: text ? [{title: text}] : [], button, url: `${SITE}/#banca`
});

export const proposalEmail = (name, {proposal, when}) => layout({
 subject: `La tua proposta va in calendario · CCA SIEMMU`, title: 'La tua proposta è diventata un’attività!',
 intro: `Ciao ${name}, il gruppo ha votato e i referenti hanno portato la tua idea in calendario.`, items: [{title: proposal, text: when || ''}],
 button: 'Guarda il calendario', url: `${SITE}/#calendario`
});
