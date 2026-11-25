// Integration checks: real Worker + isolated SQLite, Node and Python standard libraries only.
import {spawnSync} from 'node:child_process';
import {mkdtempSync, readFileSync, readdirSync} from 'node:fs';
import {createServer} from 'node:http';
import {tmpdir} from 'node:os';
import {pathToFileURL} from 'node:url';
import {join} from 'node:path';
import {webcrypto} from 'node:crypto';
import assert from 'node:assert/strict';
globalThis.crypto ??= webcrypto;
const root=process.cwd();
const worker=(await import(pathToFileURL(join(root,'src/worker.mjs')))).default;
const {newToken}=await import(pathToFileURL(join(root,'src/tokens.mjs')));
const dbFile=join(mkdtempSync(join(tmpdir(),'cca-sicurezza-')),'local.sqlite');
function query(sql,params=[],mode='run') {
 const result=spawnSync('python3',['-c',`
import sqlite3,sys,json
con=sqlite3.connect(sys.argv[1])
con.create_function('random',0,lambda:2147483647)  # niente colpi critici a caso nei test (15% di probabilità)
con.execute('PRAGMA foreign_keys=ON')
con.row_factory=sqlite3.Row
sql,params,mode=json.load(sys.stdin)
if mode=='script':
 con.executescript(sql)
 print('{}')
else:
 cur=con.execute(sql,params)
 if mode=='run': print(json.dumps({'meta':{'changes':max(cur.rowcount,0),'last_row_id':cur.lastrowid}}))
 elif mode=='first':
  row=cur.fetchone()
  print(json.dumps(dict(row) if row is not None else None))
 else: print(json.dumps({'results':[dict(r) for r in cur]}))
con.commit()
 `,dbFile],{input:JSON.stringify([sql,params,mode]),encoding:'utf8'});
 if(result.status!==0)throw new Error(result.stderr);
 return JSON.parse(result.stdout);
}
for(const file of readdirSync(join(root,'migrations')).filter(x=>x.endsWith('.sql')).sort())query(readFileSync(join(root,'migrations',file),'utf8'),[],'script');
const db={batch:async stmts=>stmts.map(s=>s.run()),prepare(sql){
 const build=(params=[])=>({bind:(...values)=>build(values),first:()=>query(sql,params,'first'),all:()=>query(sql,params,'all'),run:()=>query(sql,params)});
 return build();
}};
const env={DB:db,ASSETS:{fetch(request){
 const path=new URL(request.url).pathname;
 const mime={html:'text/html; charset=utf-8',js:'text/javascript; charset=utf-8',css:'text/css; charset=utf-8',svg:'image/svg+xml',png:'image/png'};
 if(path!=='/'&&!/^\/[\w.-]+$/.test(path))return new Response('',{status:404});
 const name=path==='/'?'index.html':path.slice(1);
 try{return new Response(readFileSync(join(root,'dist',name)),{headers:{'Content-Type':mime[name.split('.').pop()]||'application/octet-stream'}});}catch{return new Response('',{status:404});}
}}};
const sessions={};
for(const [id,role] of [['a','participant'],['b','organizer']]){
 query('INSERT INTO members (id,email,pseudonym,role,status) VALUES (?,?,?,?,?)',[id,id+'@example.test','Esploratore',role,'approved']);
 const {token,hash}=await newToken();
 query('INSERT INTO sessions (token_hash, member_id, expires_at) VALUES (?,?,unixepoch()+1800)',[hash,id]);
 sessions[id]=token;
}
const request=(path,actor,method='GET',body)=>worker.fetch(new Request('https://cca.example.test/api'+path,{
 method,headers:{...(actor?{Cookie:'__Host-cca_session='+sessions[actor]}:{}),Origin:'https://cca.example.test'},
 body:body===undefined?undefined:JSON.stringify(body)
}),env);
env.RESEND_API_KEY=undefined;
const call=(path,{actor,method='GET',body,ip}={})=>worker.fetch(new Request('https://cca.example.test/api'+path,{
 method,headers:{...(actor?{Cookie:'__Host-cca_session='+sessions[actor]}:{}),...(ip?{'CF-Connecting-IP':ip}:{}),Origin:'https://cca.example.test','Content-Type':'application/json'},
 body:body===undefined?undefined:JSON.stringify(body)
}),env);

const jobs=await import(pathToFileURL(join(root,'src/jobs.mjs')));
const T=1800000000;
const ins=(member,dir,at)=>query("INSERT INTO accessi(member_id,direction,at,source) VALUES(?,?,?,'pannello')",[member,dir,at]);
query("DELETE FROM notifications");
ins('a','IN',T-7300);          // dentro da più di 2 ore: promemoria
ins('b','IN',T-3600);          // dentro da 1 ora: ancora presto
query("INSERT INTO members (id,email,pseudonym,role,status) VALUES ('c','c@example.test','Terza','participant','approved'),('d','d@example.test','Quarta','participant','approved')");
ins('c','IN',T-8000);ins('c','OUT',T-7600); // già uscita: niente
ins('d','IN',T-5*3600);        // troppo vecchio: niente
assert.equal(await jobs.sendStillInsideReminders(env,T*1000),1);
assert.equal(query("SELECT COUNT(*) AS n FROM notifications WHERE kind='promemoria' AND title='Sei ancora in sede?'",[],'first').n,1);
assert.equal(query("SELECT member_id FROM notifications WHERE title='Sei ancora in sede?'",[],'first').member_id,'a');
assert.equal(await jobs.sendStillInsideReminders(env,T*1000+60000),0);          // una sola volta per ingresso
assert.equal(await jobs.sendStillInsideReminders(env,(T+3600)*1000),1);         // b ora ha superato le due ore
ins('a','OUT',T+10);ins('a','IN',T+20);                                           // nuovo ingresso: nuovo promemoria dopo due ore
assert.equal(await jobs.sendStillInsideReminders(env,(T+20+7300)*1000),1);

// Notifiche push: cifratura verificata con un'implementazione indipendente (node:crypto) e invio con ripiego via email.
const nc=await import('node:crypto');
const wp=await import(pathToFileURL(join(root,'src/lib/webpush.mjs')));
const ua=nc.createECDH('prime256v1');ua.generateKeys();
const authSecret=nc.randomBytes(16);
const msg=JSON.stringify({title:'Sei ancora in sede?',body:'Prova àè'});
const body=Buffer.from(await wp.encryptPayload(msg,wp.b64u.enc(ua.getPublicKey()),wp.b64u.enc(authSecret)));
const salt=body.subarray(0,16),idlen=body[20],asPub=body.subarray(21,21+idlen),cipher=body.subarray(21+idlen);
assert.equal(body.readUInt32BE(16),4096);assert.equal(idlen,65);
const secret=ua.computeSecret(asPub);
const prk=Buffer.from(nc.hkdfSync('sha256',secret,authSecret,Buffer.concat([Buffer.from('WebPush: info\0'),ua.getPublicKey(),asPub]),32));
const cek=Buffer.from(nc.hkdfSync('sha256',prk,salt,Buffer.from('Content-Encoding: aes128gcm\0'),16));
const nonce=Buffer.from(nc.hkdfSync('sha256',prk,salt,Buffer.from('Content-Encoding: nonce\0'),12));
const d=nc.createDecipheriv('aes-128-gcm',cek,nonce);d.setAuthTag(cipher.subarray(cipher.length-16));
const plain=Buffer.concat([d.update(cipher.subarray(0,cipher.length-16)),d.final()]);
assert.equal(plain.toString('utf8'),msg+'\u0002');
assert.equal(wp.allowedEndpoint('https://fcm.googleapis.com/fcm/send/abc'),true);
assert.equal(wp.allowedEndpoint('https://web.push.apple.com/xyz'),true);
assert.equal(wp.allowedEndpoint('https://evil.example.com/x'),false);
assert.equal(wp.allowedEndpoint('http://fcm.googleapis.com/x'),false);
assert.equal(wp.allowedEndpoint('https://fcm.googleapis.com.evil.com/x'),false);
// iscrizione e invio
sessions.a??=null;
const subBody={endpoint:'https://fcm.googleapis.com/fcm/send/xyz',keys:{p256dh:wp.b64u.enc(ua.getPublicKey()),auth:wp.b64u.enc(authSecret)}};
assert.equal((await call('/push/subscribe',{actor:'a',method:'POST',body:{endpoint:'https://evil.example.com/x',keys:subBody.keys}})).status,400);
// Attivazione: notifica di prova con codice; il Tumazzu arriva solo alla conferma.
let sentPayloads=0;const origFetch=globalThis.fetch;
let lastBody=null;
globalThis.fetch=async(url,opt)=>{if(String(url).includes('fcm.googleapis.com')){sentPayloads++;lastBody=Buffer.from(opt.body);return new Response('',{status:201});}return new Response('{}',{status:200});};
const first=await call('/push/subscribe',{actor:'a',method:'POST',body:subBody});
assert.equal(first.status,201);const fj=await first.json();assert.equal(fj.testSent,true);assert.equal(fj.confirmed,false);assert.equal(sentPayloads,1);
assert.equal(query("SELECT COUNT(*) AS n FROM joy_rewards WHERE member_id='a' AND ref='notifiche'",[],'first').n,0);   // niente premio senza conferma
assert.equal(query("SELECT COUNT(*) AS n FROM notifications WHERE member_id='a' AND title LIKE 'Notifiche attive%'",[],'first').n,0); // la prova non va in bacheca
assert.equal((await call('/push/confirm',{actor:'a',method:'POST',body:{token:'0'.repeat(64)}})).status,400);          // codice inventato
assert.equal((await call('/push/confirm',{actor:'a',method:'POST',body:{}})).status,400);
// Il dispositivo decifra il messaggio (implementazione indipendente) e legge il codice di conferma.
const decrypt=(buf)=>{const salt=buf.subarray(0,16),idl=buf[20],asP=buf.subarray(21,21+idl),ct=buf.subarray(21+idl);
 const prk2=Buffer.from(nc.hkdfSync('sha256',ua.computeSecret(asP),authSecret,Buffer.concat([Buffer.from('WebPush: info\0'),ua.getPublicKey(),asP]),32));
 const k=Buffer.from(nc.hkdfSync('sha256',prk2,salt,Buffer.from('Content-Encoding: aes128gcm\0'),16)),n=Buffer.from(nc.hkdfSync('sha256',prk2,salt,Buffer.from('Content-Encoding: nonce\0'),12));
 const dd=nc.createDecipheriv('aes-128-gcm',k,n);dd.setAuthTag(ct.subarray(ct.length-16));
 return JSON.parse(Buffer.concat([dd.update(ct.subarray(0,ct.length-16)),dd.final()]).toString('utf8').replace(/\u0002$/,''));};
const pushed1=decrypt(lastBody);const knownToken=pushed1.token;
assert.match(knownToken,/^[0-9a-f]{64}$/);assert.equal(pushed1.url,'/#notifiche-ok/'+knownToken);assert.equal(pushed1.actions[0].action,'ok');
assert.equal((await call('/push/status',{actor:'a'})).status,200);
assert.equal((await (await call('/push/status',{actor:'a'})).json()).confirmed,false);
assert.equal((await call('/push/confirm',{actor:'b',method:'POST',body:{token:knownToken}})).status,400);               // il codice vale solo per chi l'ha ricevuto
const ok=await call('/push/confirm',{actor:'a',method:'POST',body:{token:knownToken}});
assert.equal(ok.status,200);assert.deepEqual((await ok.json()).reward,{cheese:1});
assert.equal(query("SELECT cheese FROM joy_rewards WHERE member_id='a' AND kind='micro' AND ref='notifiche'",[],'first').cheese,1);
assert.equal((await call('/push/confirm',{actor:'a',method:'POST',body:{token:knownToken}})).status,400);               // codice monouso
assert.equal((await (await call('/push/status',{actor:'a'})).json()).confirmed,true);
const again=await call('/push/subscribe',{actor:'a',method:'POST',body:subBody});                                       // già verificato: niente nuova prova
assert.equal((await again.json()).testSent,false);assert.equal(sentPayloads,1);
assert.equal((await call('/push/overview',{actor:'a'})).status,403);
const ov=await (await call('/push/overview',{actor:'b'})).json();
assert.equal(ov.members.length,1);assert.equal(ov.members[0].verified,true);assert.equal(JSON.stringify(ov).includes('fcm.googleapis'),false);
// Percorso senza toccare la notifica: il dispositivo segnala la ricezione e il socio conferma dall'app.
const {tokenHash}=await import(pathToFileURL(join(root,'src/tokens.mjs')));
{const t2=await newToken();query('INSERT INTO sessions (token_hash, member_id, expires_at) VALUES (?,?,unixepoch()+1800)',[t2.hash,'c']);sessions.c=t2.token;}
const ua2=nc.createECDH('prime256v1');ua2.generateKeys();
const sub2={endpoint:'https://fcm.googleapis.com/fcm/send/second',keys:{p256dh:wp.b64u.enc(ua2.getPublicKey()),auth:wp.b64u.enc(nc.randomBytes(16))}};
assert.equal((await call('/push/subscribe',{actor:'c',method:'POST',body:sub2})).status,201);
assert.equal((await call('/push/confirm',{actor:'c',method:'POST',body:{}})).status,400);                  // senza ricezione non si conferma a mano
const tok2='cd'.repeat(32);query("UPDATE push_subscriptions SET test_token=? WHERE member_id='c'",[await tokenHash(tok2)]);
assert.equal((await call('/push/received',{actor:'c',method:'POST',body:{token:'ef'.repeat(32)}})).status,400);  // codice sbagliato
assert.equal((await call('/push/received',{actor:'b',method:'POST',body:{token:tok2}})).status,400);            // codice di un altro socio
assert.equal((await call('/push/received',{actor:'c',method:'POST',body:{token:tok2}})).status,200);
const st2=await (await call('/push/status',{actor:'c'})).json();assert.equal(st2.received,true);assert.equal(st2.confirmed,false);
const ov2=await (await call('/push/overview',{actor:'b'})).json();const rowC=ov2.members.find(m=>m.name==='Terza');assert.equal(rowC.received,true);assert.equal(rowC.verified,false);
const okc=await call('/push/confirm',{actor:'c',method:'POST',body:{}});assert.equal(okc.status,200);assert.deepEqual((await okc.json()).reward,{cheese:1});
assert.equal((await (await call('/push/status',{actor:'c'})).json()).confirmed,true);
const again2=await call('/push/confirm',{actor:'c',method:'POST',body:{}});assert.equal(again2.status,200);assert.equal((await again2.json()).reward,null);   // seconda chiamata: nessun errore
globalThis.fetch=origFetch;
assert.equal(typeof (await (await call('/push/key',{actor:'a'})).json()).publicKey,'string');
let pushed=0,mails=0;const realFetch=globalThis.fetch;
globalThis.fetch=async(url,opt)=>{if(String(url).includes('fcm.googleapis.com')){pushed++;return new Response('',{status:201});}mails++;return new Response('{}',{status:200});};
env.MAIL_FROM='Test <t@example.test>';env.BREVO_API_KEY='x';
ins('a','OUT',T+9000);ins('a','IN',T+9100);
assert.equal(await jobs.sendStillInsideReminders(env,(T+9100+7300)*1000),1);
assert.equal(pushed,1);                        // chi ha la push la riceve
ins('b','OUT',T+9200);ins('b','IN',T+9300);
const mailsBefore=mails;
assert.equal(await jobs.sendStillInsideReminders(env,(T+9300+7300)*1000),1);
assert.equal(mails-mailsBefore,1);             // chi non l'ha attivata riceve l'email
globalThis.fetch=async()=>new Response('',{status:410});
ins('a','OUT',T+20000);ins('a','IN',T+20100);
await jobs.sendStillInsideReminders(env,(T+20100+7300)*1000);
assert.equal(query("SELECT COUNT(*) AS n FROM push_subscriptions WHERE member_id='a'",[],'first').n,0);  // dispositivo scaduto rimosso
globalThis.fetch=realFetch;

// Uscita automatica: un'ora dopo il promemoria, registrata alla fine delle due ore, solo se il promemoria è partito.
globalThis.fetch=async()=>new Response('{}',{status:200});
query("INSERT INTO members (id,email,pseudonym,role,status) VALUES ('e','e@example.test','Quinta','participant','approved'),('f','f@example.test','Sesta','participant','approved')");
query("DELETE FROM reminders_sent WHERE kind='sede'");   // si riparte da zero: i promemoria delle prove precedenti non contano
const T2=T+50000;
ins('e','IN',T2);ins('f','IN',T2);
assert.equal(await jobs.sendStillInsideReminders(env,(T2+7300)*1000),2);
query("DELETE FROM reminders_sent WHERE kind='sede' AND member_id='f'");           // f: promemoria mai partito
assert.equal(await jobs.autoCheckouts(env,(T2+7300+1800)*1000),0);                  // troppo presto
assert.equal(await jobs.autoCheckouts(env,(T2+7300+3700)*1000),1);                  // e: uscita automatica
const out=query("SELECT direction,at,recorded_by,source FROM accessi WHERE member_id='e' ORDER BY at DESC,id DESC LIMIT 1",[],'first');
assert.equal(out.direction,'OUT');assert.equal(out.at,T2+7200);assert.equal(out.recorded_by,null);
assert.equal(query("SELECT COUNT(*) AS n FROM notifications WHERE member_id='e' AND title='Uscita registrata in automatico'",[],'first').n,1);
assert.equal(await jobs.autoCheckouts(env,(T2+7300+7200)*1000),0);                  // una volta sola
assert.equal(query("SELECT direction FROM accessi WHERE member_id='f' ORDER BY at DESC,id DESC LIMIT 1",[],'first').direction,'IN'); // f senza promemoria resta dentro
ins('e','IN',T2+20000);                                                              // rientro: niente uscita automatica senza nuovo promemoria
assert.equal(await jobs.autoCheckouts(env,(T2+20000+7300+3700)*1000),0);
globalThis.fetch=realFetch;
console.log('OK: promemoria «sei ancora in sede?» dopo due ore, una volta per ingresso, solo per chi è ancora dentro.');
