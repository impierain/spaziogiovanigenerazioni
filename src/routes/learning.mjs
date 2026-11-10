import {fail, json, readJson} from '../lib/http.mjs';

export async function get({db, member}) {
 const entry = await db.prepare(
  'SELECT goal, evidence, reflection FROM learning_journal WHERE member_id = ?'
 ).bind(member.id).first();
 return json({entry: entry ?? {goal: '', evidence: '', reflection: ''}});
}

export async function save({request, db, member}) {
 const body = await readJson(request);
 const {goal, evidence, reflection} = body;
 if ([goal, evidence, reflection].some(value => typeof value !== 'string' || value.length > 1000)) {
  fail(400, 'Ogni campo del diario deve contenere al massimo 1000 caratteri.');
 }
 if (![goal, evidence, reflection].some(value => value.trim())) {
  await db.prepare('DELETE FROM learning_journal WHERE member_id = ?').bind(member.id).run();
 } else {
  await db.prepare(`INSERT INTO learning_journal (member_id, goal, evidence, reflection)
   VALUES (?, ?, ?, ?) ON CONFLICT(member_id) DO UPDATE SET
   goal = excluded.goal, evidence = excluded.evidence, reflection = excluded.reflection`)
   .bind(member.id, goal, evidence, reflection).run();
 }
 return json({saved: true});
}
