import test from 'node:test';
import assert from 'node:assert/strict';
import {inviteEmail, sendEmail} from '../src/lib/email.mjs';
import {stillInsideEmail, reminderEmail, weeklyEmail, trophyEmail, redemptionEmail, exchangeEmail, proposalEmail} from '../src/lib/emails.mjs';

const url = 'https://cca.example/#imposta-password/token_segreto?one=1&two=2';
test('Invito e recupero mantengono link, scadenza e istruzioni anche in testo semplice', () => {
 for (const purpose of ['invito', 'reset']) {
  const mail = inviteEmail({name: 'Anna <script>alert(1)</script>', url, purpose});
  assert.ok(mail.text.includes(url));
  assert.match(mail.text, /7 giorni/);
  assert.match(mail.text, /una sola volta/);
  assert.match(mail.text, /almeno 10 caratteri/);
  assert.match(mail.html, /href="https:\/\/cca.example\/#imposta-password\/token_segreto\?one=1&amp;two=2"/);
  assert.ok(!mail.html.includes('<script>'));
  assert.match(mail.html, /Anna &lt;script&gt;/);
  assert.ok(mail.html.includes(purpose === 'reset' ? 'Scegli la nuova password' : 'Completa il mio profilo'));
 }
});

test('Tutti i messaggi producono HTML sicuro e una versione testuale con la destinazione', () => {
 const name = 'Ada <img src=x onerror=alert(1)>';
 const mails = [
  stillInsideEmail(name, {since: '16:30'}),
  reminderEmail(name, {activity: 'Cineforum <script>', when: 'Venerdì alle 18:00'}),
  weeklyEmail(name, [{title: 'Da verificare <script>', text: 'Due missioni'}]),
  trophyEmail(name, [{name: 'Cca sugnu! <script>', desc: 'Un primo passo'}]),
  redemptionEmail(name, {reward: 'Bicchiere <script>', cost: 5, balance: 3}),
  redemptionEmail(name, {reward: 'Bicchiere <script>', cost: 5, status: 'delivered'}),
  exchangeEmail(name, {title: 'Scambio <script>', text: 'Un’ora insieme'}),
  proposalEmail(name, {proposal: 'Serata <script>', when: 'Sabato alle 17:00'})
 ];
 for (const mail of mails) {
  assert.ok(mail.subject && mail.text && mail.html);
  assert.match(mail.text, /https:\/\/[^\s]+\/#/);
  assert.ok(!mail.html.includes('<script>'));
  assert.ok(!mail.html.includes('<img src=x'));
  assert.ok(Buffer.byteLength(mail.html) < 30000, 'messaggio transazionale leggero');
 }
 assert.ok(!mails[4].text.includes('da lunedì a venerdì'));
});

test('Brevo e Resend ricevono lo stesso contenuto HTML e testuale, senza invii reali', async () => {
 const originalFetch = globalThis.fetch;
 const requests = [];
 globalThis.fetch = async (endpoint, options) => {requests.push({endpoint, body: JSON.parse(options.body)}); return {ok: true};};
 try {
  const mail = inviteEmail({name: 'Ada', url, purpose: 'invito'});
  assert.deepEqual(await sendEmail({MAIL_FROM: 'Cca Siemmu <mail@example.test>', BREVO_API_KEY: 'test'}, {to: 'ada@example.test', ...mail}), {sent: true});
  assert.deepEqual(await sendEmail({MAIL_FROM: 'mail@example.test', RESEND_API_KEY: 'test'}, {to: 'ada@example.test', ...mail}), {sent: true});
  assert.equal(requests[0].body.htmlContent, mail.html);
  assert.equal(requests[0].body.textContent, mail.text);
  assert.equal(requests[1].body.html, mail.html);
  assert.equal(requests[1].body.text, mail.text);
  assert.equal(requests.length, 2);
 } finally {globalThis.fetch = originalFetch;}
});
