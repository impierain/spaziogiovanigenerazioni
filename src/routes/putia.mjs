import {tumazzi, fail, json, readJson, integer, text} from '../lib/http.mjs';
import {notify, notifyOrganizers} from '../lib/notify.mjs';
import {mailMember, redemptionEmail} from '../lib/emails.mjs';

const ARTS = ['star', 'pin', 'book', 'bag', 'shirt', 'heart', 'plant', 'camera'];
const slug = name => name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 30) || 'premio';

export async function balance(db, memberId) {
 const row = await db.prepare('SELECT cheese_earned AS earned, cheese_spent AS spent FROM member_totals WHERE member_id = ?').bind(memberId).first();
 return {earned: row?.earned ?? 0, spent: row?.spent ?? 0, balance: (row?.earned ?? 0) - (row?.spent ?? 0)};
}

const rewardSql = `SELECT r.id, r.name, r.description, r.cost, r.quantity, r.art, r.active,
  CASE WHEN r.quantity IS NULL THEN NULL ELSE r.quantity - (SELECT COUNT(*) FROM redemptions x WHERE x.reward_id = r.id AND x.status <> 'cancelled') END AS stock
  FROM rewards r`;

export async function list({db, member}) {
 const where = member.role === 'organizer' ? '' : 'WHERE r.active = 1';
 const {results} = await db.prepare(`${rewardSql} ${where} ORDER BY r.active DESC, r.cost, r.name`).all();
 return json({rewards: results.map(r => ({...r, active: !!r.active})), ...(await balance(db, member.id))});
}

export async function create({request, db}) {
 const body = await readJson(request);
 const name = text(body.name, 'Nome', {max: 80});
 const id = `${slug(name)}-${crypto.randomUUID().slice(0, 5)}`;
 const quantity = body.quantity === null || body.quantity === '' || body.quantity === undefined ? null : integer(body.quantity, 'Quantità', {min: 0, max: 10000});
 const art = ARTS.includes(body.art) ? body.art : 'star';
 await db.prepare('INSERT INTO rewards (id, name, description, cost, quantity, art) VALUES (?, ?, ?, ?, ?, ?)').bind(
  id, name, text(body.description, 'Descrizione', {max: 300, optional: true}) ?? '', integer(body.cost, 'Costo', {min: 1, max: 5000}), quantity, art).run();
 return json({reward: await db.prepare(`${rewardSql} WHERE r.id = ?`).bind(id).first()}, 201);
}

export async function update({request, db, params}) {
 const body = await readJson(request);
 const sets = [];
 const values = [];
 const put = (c, v) => { sets.push(`${c} = ?`); values.push(v); };
 if ('name' in body) put('name', text(body.name, 'Nome', {max: 80}));
 if ('description' in body) put('description', text(body.description, 'Descrizione', {max: 300, optional: true}) ?? '');
 if ('cost' in body) put('cost', integer(body.cost, 'Costo', {min: 1, max: 5000}));
 if ('quantity' in body) put('quantity', body.quantity === null || body.quantity === '' ? null : integer(body.quantity, 'Quantità', {min: 0, max: 10000}));
 if ('active' in body) put('active', body.active ? 1 : 0);
 if (!sets.length) fail(400, 'Nessuna modifica indicata.');
 const res = await db.prepare(`UPDATE rewards SET ${sets.join(', ')} WHERE id = ?`).bind(...values, params.id).run();
 if (!res.meta.changes) fail(404, 'Premio non trovato.');
 return json({reward: await db.prepare(`${rewardSql} WHERE r.id = ?`).bind(params.id).first()});
}

// Riscatto atomico: un solo comando controlla premio attivo, scorte e saldo.
export async function redeem({env, db, member, params}) {
 const reward = await db.prepare('SELECT id, name, cost FROM rewards WHERE id = ? AND active = 1').bind(params.id).first();
 if (!reward) fail(404, 'Premio non disponibile.');
 const res = await db.prepare(`INSERT INTO redemptions (reward_id, member_id, cost)
  SELECT r.id, ?1, r.cost FROM rewards r
  WHERE r.id = ?2 AND r.active = 1
   AND (r.quantity IS NULL OR r.quantity > (SELECT COUNT(*) FROM redemptions x WHERE x.reward_id = r.id AND x.status <> 'cancelled'))
   AND (SELECT cheese_earned - cheese_spent FROM member_totals WHERE member_id = ?1) >= r.cost`).bind(member.id, params.id).run();
 if (!res.meta.changes) {
  const bal = await balance(db, member.id);
  fail(409, bal.balance < reward.cost ? `Ti servono ${tumazzi(reward.cost)}: ne hai ${bal.balance}.` : 'Questo premio è esaurito.');
 }
 const bal = await balance(db, member.id);
 await notify(db, member.id, {kind: 'putia', level: 'ok', title: `Premio riscattato: ${reward.name}`, body: `Passa in sede per ritirarlo. Ti restano ${tumazzi(bal.balance)}.`});
 await notifyOrganizers(db, member.id, {kind: 'putia', level: 'info', title: `Premio da consegnare: ${reward.name}`, body: `Richiesto da ${member.pseudonym}. Vai in Referenti → Putìa.`});
 const mail = await mailMember(env, db, member.id, name => redemptionEmail(name, {reward: reward.name, cost: reward.cost, balance: bal.balance, status: 'pending'}));
 return json({redemption: {rewardId: reward.id, cost: reward.cost}, balance: bal.balance, emailSent: !!mail.sent}, 201);
}

const redSql = `SELECT x.id, x.reward_id AS rewardId, r.name AS rewardName, x.member_id AS memberId, m.pseudonym AS memberName,
  x.cost, x.status, x.created_at AS createdAt, x.decided_at AS decidedAt
  FROM redemptions x JOIN rewards r ON r.id = x.reward_id JOIN members m ON m.id = x.member_id`;

export async function redemptions({url, db, member}) {
 const isOrganizer = member.role === 'organizer';
 const scope = url.searchParams.get('scope');
 const mine = !isOrganizer || scope === 'mine';
 const where = mine ? 'WHERE x.member_id = ?' : `WHERE x.status = 'pending'`;
 const stmt = db.prepare(`${redSql} ${where} ORDER BY x.created_at DESC LIMIT 100`);
 const {results} = await (mine ? stmt.bind(member.id) : stmt).all();
 return json({redemptions: results});
}

async function loadRedemption(db, id) {
 const row = await db.prepare(`${redSql} WHERE x.id = ?`).bind(Number(id)).first();
 if (!row) fail(404, 'Riscatto non trovato.');
 return row;
}

export async function deliver({env, db, member, params}) {
 const row = await loadRedemption(db, params.id);
 if (row.status !== 'pending') fail(409, 'Questo riscatto è già stato chiuso.');
 try {
  const res = await db.prepare(`UPDATE redemptions SET status = 'delivered', decided_at = unixepoch(), decided_by = ? WHERE id = ? AND status = 'pending'`).bind(member.id, row.id).run();
  if (!res.meta.changes) fail(409, 'Questo riscatto è già stato chiuso.');
 } catch (error) {
  if (String(error).includes('redemption_not_authorized')) fail(403, 'Il premio riscattato da te lo consegna un altro referente.');
  throw error;
 }
 await notify(db, row.memberId, {kind: 'putia', level: 'ok', title: `Premio consegnato: ${row.rewardName}`, body: 'Goditelo!'});
 await mailMember(env, db, row.memberId, name => redemptionEmail(name, {reward: row.rewardName, cost: row.cost, status: 'delivered'}));
 return json({status: 'delivered'});
}

// Annulla il riscatto: lo può fare chi l'ha chiesto o un referente, finché non è consegnato. I Tumazzi tornano nel saldo.
export async function cancel({db, member, params}) {
 const row = await loadRedemption(db, params.id);
 if (row.memberId !== member.id && member.role !== 'organizer') fail(403, 'Operazione non consentita.');
 const res = await db.prepare(`UPDATE redemptions SET status = 'cancelled', decided_at = unixepoch(), decided_by = ? WHERE id = ? AND status = 'pending'`).bind(member.id, row.id).run();
 if (!res.meta.changes) fail(409, 'Questo riscatto è già stato chiuso.');
 if (row.memberId !== member.id) await notify(db, row.memberId, {kind: 'putia', level: 'info', title: `Riscatto annullato: ${row.rewardName}`, body: 'I Tumazzi sono tornati nel tuo saldo.'});
 return json({status: 'cancelled'});
}
