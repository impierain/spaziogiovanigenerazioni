import {fail, json, readJson, integer, text} from '../lib/http.mjs';
import {notifyOrganizers} from '../lib/notify.mjs';

const DAY = 86400;
const MIN_VISIT_DAYS = 7; // giorni di utilizzo prima di chiedere una valutazione
const RATING_EVERY = 90 * DAY; // dopo una valutazione non si richiede per 90 giorni
const SNOOZE_FOR = 14 * DAY; // «più tardi» rimanda di due settimane
const RATING_COOLDOWN = 7 * DAY; // anche volontariamente, al massimo una a settimana
const SUGGESTIONS_PER_DAY = 5;
const KEEP_SECONDS = 365 * DAY;
const CATEGORIES = {modifica: 'Modifica', problema: 'Problema', idea: 'Idea', critica: 'Critica'};
const now = () => Math.floor(Date.now() / 1000);

const last = (db, memberId, kind) => db.prepare('SELECT MAX(created_at) AS at FROM feedback WHERE member_id = ? AND kind = ?').bind(memberId, kind).first();

// La richiesta di valutazione compare solo dopo qualche giorno d'uso e non troppo spesso.
export async function prompt({db, member}) {
 const [days, rated, snoozed] = await Promise.all([
  db.prepare('SELECT COUNT(*) AS n FROM app_visit_days WHERE member_id = ?').bind(member.id).first(),
  last(db, member.id, 'rating'),
  last(db, member.id, 'snooze')
 ]);
 const t = now();
 const due = days.n >= MIN_VISIT_DAYS && (!rated.at || t - rated.at > RATING_EVERY) && (!snoozed.at || t - snoozed.at > SNOOZE_FOR);
 return json({due});
}

export async function snooze({db, member}) {
 await db.prepare("INSERT INTO feedback (member_id, kind) VALUES (?, 'snooze')").bind(member.id).run();
 return json({ok: true});
}

// La valutazione è anonima per i referenti: vedono voto e commento, mai chi li ha scritti.
export async function rate({request, db, member}) {
 const body = await readJson(request);
 const rating = integer(body.rating, 'Voto', {min: 1, max: 5});
 const message = text(body.message, 'Commento', {max: 400, optional: true}) ?? '';
 const before = await last(db, member.id, 'rating');
 if (before.at && now() - before.at < RATING_COOLDOWN) fail(429, 'Hai già lasciato una valutazione da poco. Grazie!');
 await db.prepare("INSERT INTO feedback (member_id, kind, rating, message) VALUES (?, 'rating', ?, ?)").bind(member.id, rating, message).run();
 if (message) await notifyOrganizers(db, null, {kind: 'valutazione', level: 'info', title: `Valutazione ${rating}/5 (anonima)`, body: message});
 return json({ok: true}, 201);
}

// Suggerimento di modifica: arriva nella bacheca delle notifiche di tutti i referenti.
export async function suggest({request, db, member}) {
 const body = await readJson(request);
 const category = body.category;
 if (!Object.hasOwn(CATEGORIES, category)) fail(400, 'Scegli di che tipo di suggerimento si tratta.');
 const message = text(body.message, 'Suggerimento', {min: 10, max: 400});
 const anonymous = body.anonymous === true;
 const recent = await db.prepare("SELECT COUNT(*) AS n FROM feedback WHERE member_id = ? AND kind = 'suggestion' AND created_at > ?").bind(member.id, now() - DAY).first();
 if (recent.n >= SUGGESTIONS_PER_DAY) fail(429, `Al massimo ${SUGGESTIONS_PER_DAY} suggerimenti al giorno. Riprova domani.`);
 await db.prepare("INSERT INTO feedback (member_id, kind, category, message, anonymous) VALUES (?, 'suggestion', ?, ?, ?)").bind(member.id, category, message, anonymous ? 1 : 0).run();
 const who = anonymous ? 'anonimo' : member.pseudonym;
 await notifyOrganizers(db, null, {kind: 'suggerimento', level: 'info', title: `${CATEGORIES[category]} da ${who}`, body: message});
 return json({ok: true}, 201);
}

// Riepilogo per i referenti: medie e commenti, senza nomi. I dati più vecchi di un anno si cancellano.
export async function summary({db}) {
 await db.prepare('DELETE FROM feedback WHERE created_at < ?').bind(now() - KEEP_SECONDS).run();
 const totals = await db.prepare("SELECT COUNT(*) AS n, AVG(rating) AS average FROM feedback WHERE kind = 'rating'").first();
 const {results: spread} = await db.prepare("SELECT rating, COUNT(*) AS n FROM feedback WHERE kind = 'rating' GROUP BY rating").all();
 const {results: comments} = await db.prepare("SELECT rating, message, created_at AS createdAt FROM feedback WHERE kind = 'rating' AND message <> '' ORDER BY created_at DESC LIMIT 20").all();
 return json({
  count: totals.n, average: totals.average === null ? null : Math.round(totals.average * 10) / 10,
  spread: Object.fromEntries(spread.map(r => [r.rating, r.n])), comments
 });
}
