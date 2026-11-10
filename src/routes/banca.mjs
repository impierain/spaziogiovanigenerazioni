import {fail, json, readJson, text} from '../lib/http.mjs';
import {romeWeekStart} from '../lib/time.mjs';
import {notify} from '../lib/notify.mjs';
import {mailMember, exchangeEmail} from '../lib/emails.mjs';
import {checkTrophies} from '../lib/trophies.mjs';

// Banca del tempo: un'ora offerta da un socio a un altro. A scambio concluso entrambi ricevono un piccolo premio,
// con un massimo di 2 scambi premiati a settimana per socio.
export const EXCHANGE_XP = 10;
export const EXCHANGE_CHEESE = 1;
export const WEEKLY_EXCHANGES = 2;
const MAX_OPEN_OFFERS = 3;

export async function list({db, member}) {
 const {results: offers} = await db.prepare(`SELECT o.id, o.title, o.description, o.created_at AS createdAt, o.member_id AS memberId, m.pseudonym AS memberName,
   (SELECT status FROM time_exchanges x WHERE x.offer_id = o.id AND x.requester_id = ?1 AND x.status IN ('requested','accepted') LIMIT 1) AS myStatus
   FROM time_offers o JOIN members m ON m.id = o.member_id
   WHERE o.status = 'open' AND m.status = 'approved' ORDER BY o.created_at DESC LIMIT 100`).bind(member.id).all();
 const {results: exchanges} = await db.prepare(`SELECT x.id, x.status, x.note, x.created_at AS createdAt, o.title AS offerTitle, o.member_id AS ownerId, om.pseudonym AS ownerName,
   x.requester_id AS requesterId, rm.pseudonym AS requesterName
   FROM time_exchanges x JOIN time_offers o ON o.id = x.offer_id
   JOIN members om ON om.id = o.member_id JOIN members rm ON rm.id = x.requester_id
   WHERE (x.requester_id = ?1 OR o.member_id = ?1) AND x.status IN ('requested','accepted','done')
   ORDER BY x.created_at DESC LIMIT 50`).bind(member.id).all();
 return json({offers: offers.map(o => ({...o, mine: o.memberId === member.id})), exchanges, reward: {xp: EXCHANGE_XP, cheese: EXCHANGE_CHEESE, weekly: WEEKLY_EXCHANGES}});
}

export async function createOffer({request, db, member}) {
 const body = await readJson(request);
 const open = (await db.prepare(`SELECT COUNT(*) AS n FROM time_offers WHERE member_id = ? AND status = 'open'`).bind(member.id).first()).n;
 if (open >= MAX_OPEN_OFFERS) fail(409, `Puoi avere al massimo ${MAX_OPEN_OFFERS} offerte aperte.`);
 const res = await db.prepare('INSERT INTO time_offers (member_id, title, description) VALUES (?, ?, ?)').bind(
  member.id, text(body.title, 'Titolo', {max: 80}), text(body.description, 'Descrizione', {max: 400, optional: true}) ?? '').run();
 return json({id: res.meta.last_row_id}, 201);
}

export async function closeOffer({db, member, params}) {
 const owned = member.role === 'organizer' ? '' : 'AND member_id = ?2';
 const stmt = db.prepare(`UPDATE time_offers SET status = 'closed' WHERE id = ?1 ${owned}`);
 const res = await (member.role === 'organizer' ? stmt.bind(Number(params.id)) : stmt.bind(Number(params.id), member.id)).run();
 if (!res.meta.changes) fail(404, 'Offerta non trovata.');
 await db.prepare(`UPDATE time_exchanges SET status = 'cancelled' WHERE offer_id = ? AND status = 'requested'`).bind(Number(params.id)).run();
 return json({status: 'closed'});
}

export async function requestOffer({request, env, db, member, params}) {
 const body = await readJson(request);
 const offer = await db.prepare(`SELECT o.id, o.title, o.member_id FROM time_offers o JOIN members m ON m.id = o.member_id WHERE o.id = ? AND o.status = 'open' AND m.status = 'approved'`).bind(Number(params.id)).first();
 if (!offer) fail(404, 'Offerta non trovata.');
 if (offer.member_id === member.id) fail(409, 'Non puoi chiedere una tua offerta.');
 try {
  await db.prepare('INSERT INTO time_exchanges (offer_id, requester_id, note) VALUES (?, ?, ?)').bind(offer.id, member.id, text(body.note, 'Messaggio', {max: 300, optional: true}) ?? '').run();
 } catch (error) {
  if (String(error).includes('UNIQUE')) fail(409, 'Hai già chiesto questa offerta.');
  throw error;
 }
 await notify(db, offer.member_id, {kind: 'banca', level: 'info', title: `${member.pseudonym} vuole la tua ora: ${offer.title}`, body: 'Apri la banca del tempo per accettare o rifiutare.'});
 return json({status: 'requested'}, 201);
}

async function loadExchange(db, id) {
 const x = await db.prepare(`SELECT x.id, x.status, x.requester_id AS requesterId, o.member_id AS ownerId, o.title, rm.pseudonym AS requesterName, om.pseudonym AS ownerName
  FROM time_exchanges x JOIN time_offers o ON o.id = x.offer_id JOIN members rm ON rm.id = x.requester_id JOIN members om ON om.id = o.member_id WHERE x.id = ?`).bind(Number(id)).first();
 if (!x) fail(404, 'Scambio non trovato.');
 return x;
}

export async function decide(verdict, {env, db, member, params}) {
 const x = await loadExchange(db, params.id);
 if (x.ownerId !== member.id) fail(403, 'Solo chi offre l’ora può decidere.');
 const status = verdict === 'accept' ? 'accepted' : 'declined';
 const res = await db.prepare(`UPDATE time_exchanges SET status = ?, decided_at = unixepoch() WHERE id = ? AND status = 'requested'`).bind(status, x.id).run();
 if (!res.meta.changes) fail(409, 'Questa richiesta non è più in attesa.');
 const title = status === 'accepted' ? `${x.ownerName} ha accettato: ${x.title}` : `${x.ownerName} non può questa volta: ${x.title}`;
 await notify(db, x.requesterId, {kind: 'banca', level: status === 'accepted' ? 'ok' : 'info', title, body: status === 'accepted' ? 'Accordatevi su quando incontrarvi. Alla fine conferma di aver ricevuto l’ora.' : ''});
 if (status === 'accepted') await mailMember(env, db, x.requesterId, name => exchangeEmail(name, {title: 'La tua richiesta è stata accettata', text: `${x.ownerName} ti darà un’ora: ${x.title}. Accordatevi su quando incontrarvi.`}));
 return json({status});
}

export const accept = ctx => decide('accept', ctx);
export const decline = ctx => decide('decline', ctx);

// Chi ha ricevuto l'ora la conferma: entrambi ricevono XP e Formaggi (con il limite settimanale).
export async function done({env, db, member, params}) {
 const x = await loadExchange(db, params.id);
 if (x.requesterId !== member.id) fail(403, 'Solo chi ha ricevuto l’ora può confermarla.');
 const res = await db.prepare(`UPDATE time_exchanges SET status = 'done', done_at = unixepoch() WHERE id = ? AND status = 'accepted'`).bind(x.id).run();
 if (!res.meta.changes) fail(409, 'Lo scambio deve prima essere accettato.');
 const weekStart = romeWeekStart(Date.now());
 const outcome = {};
 for (const who of [x.ownerId, x.requesterId]) {
  const used = (await db.prepare(`SELECT COUNT(*) AS n FROM awards WHERE member_id = ? AND source = 'scambio' AND created_at >= ?`).bind(who, weekStart).first()).n;
  if (used >= WEEKLY_EXCHANGES) { outcome[who] = false; continue; }
  await db.prepare(`INSERT INTO awards (member_id, source, ref, title, xp, cheese) VALUES (?, 'scambio', ?, ?, ?, ?)`).bind(who, String(x.id), `Banca del tempo: ${x.title}`.slice(0, 120), EXCHANGE_XP, EXCHANGE_CHEESE).run();
  outcome[who] = true;
  await notify(db, who, {kind: 'banca', level: 'ok', title: `Scambio concluso: ${x.title}`, body: `+${EXCHANGE_XP} XP e +${EXCHANGE_CHEESE} Formaggio.`});
 }
 for (const who of [x.ownerId, x.requesterId]) await checkTrophies(env, db, who);
 return json({status: 'done', awarded: outcome[x.requesterId] ?? false});
}

export async function cancel({db, member, params}) {
 const x = await loadExchange(db, params.id);
 if (x.requesterId !== member.id && x.ownerId !== member.id) fail(403, 'Operazione non consentita.');
 const res = await db.prepare(`UPDATE time_exchanges SET status = 'cancelled' WHERE id = ? AND status IN ('requested','accepted')`).bind(x.id).run();
 if (!res.meta.changes) fail(409, 'Lo scambio è già chiuso.');
 return json({status: 'cancelled'});
}
