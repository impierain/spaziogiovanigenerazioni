import {fail, json, readJson, email, text, uid} from '../lib/http.mjs';
import {inviteEmail, sendEmail} from '../lib/email.mjs';
import {newToken} from '../tokens.mjs';
import {notify} from '../lib/notify.mjs';

const INVITE_SECONDS = 7 * 24 * 3600;
const ROLES = ['participant', 'organizer'];
const STATUSES = ['pending', 'approved', 'disabled'];

// Crea un link monouso per impostare la password e prova a spedirlo per email.
async function issueInvite(env, db, request, member, actorId) {
 const {token, hash} = await newToken();
 const purpose = member.has_password ? 'reset' : 'invito';
 await db.batch([
  db.prepare('UPDATE password_tokens SET consumed_at = unixepoch() WHERE member_id = ? AND consumed_at IS NULL').bind(member.id),
  db.prepare('INSERT INTO password_tokens (token_hash, member_id, purpose, expires_at) VALUES (?, ?, ?, unixepoch() + ?)')
   .bind(hash, member.id, purpose, INVITE_SECONDS)
 ]);
 const inviteUrl = `${new URL(request.url).origin}/#imposta-password/${token}`;
 const mail = inviteEmail({name: member.full_name || member.pseudonym, url: inviteUrl, purpose});
 const result = await sendEmail(env, {to: member.email, ...mail});
 const who = member.full_name || member.pseudonym;
 if (actorId) {
  await notify(db, actorId, result.sent
   ? {kind: 'email', level: 'ok', title: `Email inviata a ${who}`, body: `${purpose === 'reset' ? 'Link per la nuova password' : 'Invito al profilo'} spedito a ${member.email}.`}
   : {kind: 'email', level: 'error', title: `Email non inviata a ${who}`, body: `Motivo: ${result.reason}. Copia il link dal pannello Soci e mandalo tu, anche su WhatsApp.`});
 }
 return {inviteUrl, emailSent: result.sent, emailNote: result.sent ? null : result.reason, purpose};
}

const listSql = `SELECT m.id, m.email, m.pseudonym, m.full_name AS fullName, m.phone, m.role, m.status,
  m.uid_tessera AS uidTessera, m.password_hash IS NOT NULL AS hasPassword, m.created_at AS createdAt,
  t.xp, t.cheese_earned AS cheese
  FROM members m JOIN member_totals t ON t.member_id = m.id`;

const shape = row => row && ({...row, hasPassword: !!row.hasPassword});

export async function list({db}) {
 const {results} = await db.prepare(`${listSql} ORDER BY m.status = 'disabled', m.pseudonym COLLATE NOCASE`).all();
 return json({members: results.map(shape)});
}

export async function create({request, db, env, member: actor}) {
 const body = await readJson(request);
 const address = email(body.email);
 const fullName = text(body.fullName, 'Nome e cognome', {max: 80});
 const pseudonym = text(body.pseudonym ?? fullName.split(' ')[0], 'Nome scelto', {max: 28});
 const phone = text(body.phone, 'Telefono', {max: 30, optional: true});
 const role = body.role ?? 'participant';
 if (!ROLES.includes(role)) fail(400, 'Ruolo non valido.');
 const id = crypto.randomUUID();
 try {
  await db.prepare(`INSERT INTO members (id, email, pseudonym, full_name, phone, role, status)
   VALUES (?, ?, ?, ?, ?, ?, 'approved')`).bind(id, address, pseudonym, fullName, phone, role).run();
 } catch (error) {
  if (String(error).includes('UNIQUE')) fail(409, 'Esiste già un socio con questa email.');
  throw error;
 }
 const member = await db.prepare(`${listSql} WHERE m.id = ?`).bind(id).first();
 const invite = await issueInvite(env, db, request, {id, email: address, full_name: fullName, pseudonym, has_password: false}, actor.id);
 return json({member: shape(member), invite}, 201);
}

export async function reinvite({request, db, env, params, member: actor}) {
 const member = await db.prepare(`SELECT id, email, pseudonym, full_name, status, password_hash IS NOT NULL AS has_password
  FROM members WHERE id = ?`).bind(params.id).first();
 if (!member) fail(404, 'Socio non trovato.');
 if (member.status === 'disabled') fail(409, 'Il socio è disattivato.');
 return json({invite: await issueInvite(env, db, request, member, actor.id)});
}

export async function update({request, db, member, params}) {
 const body = await readJson(request);
 const target = await db.prepare('SELECT id, role, status FROM members WHERE id = ?').bind(params.id).first();
 if (!target) fail(404, 'Socio non trovato.');

 const sets = [];
 const values = [];
 const put = (column, value) => { sets.push(`${column} = ?`); values.push(value); };
 if ('fullName' in body) put('full_name', text(body.fullName, 'Nome e cognome', {max: 80}));
 if ('pseudonym' in body) put('pseudonym', text(body.pseudonym, 'Nome scelto', {max: 28}));
 if ('phone' in body) put('phone', text(body.phone, 'Telefono', {max: 30, optional: true}));
 if ('role' in body) {
  if (!ROLES.includes(body.role)) fail(400, 'Ruolo non valido.');
  put('role', body.role);
 }
 if ('status' in body) {
  if (!STATUSES.includes(body.status)) fail(400, 'Stato non valido.');
  put('status', body.status);
 }
 if (!sets.length) fail(400, 'Nessuna modifica indicata.');

 const losesOrganizer = target.role === 'organizer' && target.status === 'approved'
  && (('role' in body && body.role !== 'organizer') || ('status' in body && body.status !== 'approved'));
 if (losesOrganizer) {
  if (target.id === member.id) fail(409, 'Non puoi togliere a te stesso il ruolo di referente o disattivarti.');
  const others = await db.prepare(`SELECT COUNT(*) AS n FROM members WHERE role = 'organizer' AND status = 'approved' AND id <> ?`).bind(target.id).first();
  if (!others.n) fail(409, 'Deve restare almeno un referente attivo.');
 }
 const statements = [db.prepare(`UPDATE members SET ${sets.join(', ')} WHERE id = ?`).bind(...values, target.id)];
 if (('status' in body && body.status !== 'approved') || ('role' in body && body.role !== target.role)) {
  statements.push(db.prepare('DELETE FROM sessions WHERE member_id = ?').bind(target.id));
 }
 await db.batch(statements);
 return json({member: shape(await db.prepare(`${listSql} WHERE m.id = ?`).bind(target.id).first())});
}

export async function setCard({request, db, params}) {
 const body = await readJson(request);
 const code = uid(body.uid);
 try {
  const result = await db.prepare('UPDATE members SET uid_tessera = ? WHERE id = ?').bind(code, params.id).run();
  if (!result.meta.changes) fail(404, 'Socio non trovato.');
 } catch (error) {
  if (String(error).includes('UNIQUE')) fail(409, 'Questa tessera è già assegnata a un altro socio.');
  throw error;
 }
 return json({uidTessera: code});
}

export async function removeCard({db, params}) {
 const result = await db.prepare('UPDATE members SET uid_tessera = NULL WHERE id = ?').bind(params.id).run();
 if (!result.meta.changes) fail(404, 'Socio non trovato.');
 return json({uidTessera: null});
}
