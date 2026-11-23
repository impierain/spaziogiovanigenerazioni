import {tumazzi} from './http.mjs';
// Stesso modello e palette per tutti i messaggi dell’app.
import {sendEmail} from './email.mjs';
import {SITE, layout} from './email-template.mjs';
export {SITE, layout};

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
 ? layout({subject: `Premio consegnato: ${reward} · CCA SIEMMU`, title: 'Premio consegnato!', intro: `Ciao ${name}, ti abbiamo consegnato il premio che avevi riscattato. Goditelo!`, items: [{title: reward, text: `${tumazzi(cost)}`}], button: 'Apri la Putìa', url: `${SITE}/#putia`})
 : layout({subject: `Hai riscattato: ${reward} · CCA SIEMMU`, title: 'Premio riscattato!', intro: `Ciao ${name}, hai riscattato un premio nella Putìa. Consulta gli orari aggiornati nella sezione Spazio e passa in sede: un referente te lo consegna.`, items: [{title: reward, text: `${tumazzi(cost)} spesi · te ne restano ${balance}`}], button: 'Apri la Putìa', url: `${SITE}/#putia`, note: 'Cambiato idea? Puoi annullare il riscatto finché non è consegnato: i Tumazzi tornano subito tuoi.'});

export const reminderEmail = (name, {activity, when}) => layout({
 subject: `Promemoria: ${activity} · CCA SIEMMU`, title: 'Ti aspettiamo!',
 intro: `Ciao ${name}, ti ricordiamo che hai un posto confermato.`, items: [{title: activity, text: when}],
 button: 'Apri il calendario', url: `${SITE}/#calendario`, note: 'Non puoi più venire? Annulla la prenotazione dal calendario, così il posto va a un altro.'
});

export const stillInsideEmail = (name, {since}) => layout({
 subject: 'Sei ancora in sede? · CCA SIEMMU', title: 'Sei ancora in sede?',
 intro: `Ciao ${name}, hai registrato l’ingresso alle ${since}, più di due ore fa. Se sei già uscito, ricordati di registrare l’uscita: così le ore e le statistiche restano giuste.`,
 button: 'Apri CCA SIEMMU', url: `${SITE}/#home`, note: 'Ti scriviamo una sola volta per ogni ingresso. Se entro un’ora non risulta l’uscita, la registriamo noi all’orario di fine delle due ore.'
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
