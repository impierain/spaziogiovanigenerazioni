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
const {hashPassword}=await import(pathToFileURL(join(root,'src/lib/password.mjs')));
env.RESEND_API_KEY=undefined;
const call=(path,{actor,method='GET',body,ip}={})=>worker.fetch(new Request('https://cca.example.test/api'+path,{
 method,headers:{...(actor?{Cookie:'__Host-cca_session='+sessions[actor]}:{}),...(ip?{'CF-Connecting-IP':ip}:{}),Origin:'https://cca.example.test','Content-Type':'application/json'},
 body:body===undefined?undefined:JSON.stringify(body)
}),env);

// 1. Blocco dei login: per email e indirizzo, la vittima da un altro indirizzo entra.
query('INSERT INTO members (id,email,pseudonym,role,status,password_hash) VALUES (?,?,?,?,?,?)',['v','vittima@example.test','Vittima','participant','approved',await hashPassword('password-corretta-1')]);
for(let i=0;i<8;i++)assert.equal((await call('/auth/login',{method:'POST',ip:'203.0.113.9',body:{email:'vittima@example.test',password:'sbagliata'}})).status,401);
assert.equal((await call('/auth/login',{method:'POST',ip:'203.0.113.9',body:{email:'vittima@example.test',password:'password-corretta-1'}})).status,429);
assert.equal((await call('/auth/login',{method:'POST',ip:'198.51.100.7',body:{email:'vittima@example.test',password:'password-corretta-1'}})).status,200);
// tetto complessivo per email anche cambiando indirizzo
query('DELETE FROM auth_attempts');
for(let i=0;i<30;i++)query("INSERT INTO auth_attempts(email,ip,at) VALUES('vittima@example.test',?,unixepoch())",['10.0.0.'+i]);
assert.equal((await call('/auth/login',{method:'POST',ip:'198.51.100.8',body:{email:'vittima@example.test',password:'password-corretta-1'}})).status,429);
query('DELETE FROM auth_attempts');

// 2. Cambio password: chiude le altre sessioni, non la corrente.
const second=await newToken();
query('INSERT INTO sessions (token_hash, member_id, expires_at) VALUES (?,?,unixepoch()+1800)',[second.hash,'a']);
query("UPDATE members SET password_hash=? WHERE id='a'",[await hashPassword('vecchia-password-1')]);
assert.equal((await call('/auth/change-password',{actor:'a',method:'POST',body:{current:'sbagliata',next:'nuova-password-lunga-2'}})).status,403);
assert.equal((await call('/auth/change-password',{actor:'a',method:'POST',body:{current:'vecchia-password-1',next:'nuova-password-lunga-2'}})).status,200);
assert.equal(query("SELECT COUNT(*) AS n FROM sessions WHERE member_id='a'",[],'first').n,1);
assert.equal((await call('/auth/me',{actor:'a'})).status,200);

// 3. Proposte: niente auto-calendarizzazione, un solo premio anche con richieste contemporanee.
query("INSERT INTO proposals(id,member_id,title) VALUES(1,'b','Mia proposta'),(2,'a','Serata giochi')");
assert.equal((await call('/proposals/1/schedule',{actor:'b',method:'POST',body:{startsAt:Math.floor(Date.now()/1000)+86400}})).status,409);
query("INSERT INTO members (id,email,pseudonym,role,status) VALUES ('b2','b2@example.test','Referente2','organizer','approved')");
{const t=await newToken();query('INSERT INTO sessions (token_hash, member_id, expires_at) VALUES (?,?,unixepoch()+1800)',[t.hash,'b2']);sessions.b2=t.token;}
const when=Math.floor(Date.now()/1000)+86400;
const sched=await Promise.all([call('/proposals/2/schedule',{actor:'b',method:'POST',body:{startsAt:when}}),call('/proposals/2/schedule',{actor:'b2',method:'POST',body:{startsAt:when}})]);
assert.equal(sched.filter(r=>r.status===201).length,1);
assert.equal(query("SELECT COUNT(*) AS n FROM awards WHERE source='proposta' AND ref='2'",[],'first').n,1);
assert.equal(query("SELECT COUNT(*) AS n FROM activities WHERE name='Serata giochi'",[],'first').n,1);
assert.throws(()=>query("INSERT INTO awards(member_id,source,ref,title,xp,cheese) VALUES('a','proposta','2','doppio',1,1)"),/UNIQUE/);

// 4. Putìa: al massimo 5 riscatti al giorno, anche annullati.
query("INSERT INTO awards(member_id,source,ref,title,xp,cheese) VALUES('v','scambio','soldi','Saldo di prova',0,100)");
query("INSERT INTO rewards(id,name,cost) VALUES('r1','Premio',1)");
{const t=await newToken();query('INSERT INTO sessions (token_hash, member_id, expires_at) VALUES (?,?,unixepoch()+1800)',[t.hash,'v']);sessions.v=t.token;}
for(let i=0;i<5;i++){const r=await call('/rewards/r1/redeem',{actor:'v',method:'POST'});assert.equal(r.status,201);const id=(await r.json()).redemption?.id??query("SELECT MAX(id) AS id FROM redemptions",[],'first').id;await call('/redemptions/'+id+'/cancel',{actor:'v',method:'POST'});}
assert.equal((await call('/rewards/r1/redeem',{actor:'v',method:'POST'})).status,429);

// 5. Ultimo referente: il database lo impedisce, anche fuori dall'API.
query("UPDATE members SET status='disabled' WHERE id='b2'");
assert.throws(()=>query("UPDATE members SET role='participant' WHERE id='b'"),/ultimo_organizzatore/);
assert.throws(()=>query("UPDATE members SET status='disabled' WHERE id='b'"),/ultimo_organizzatore/);
assert.equal((await call('/members/b',{actor:'b',method:'PATCH',body:{role:'participant'}})).status,409);
query("UPDATE members SET status='approved' WHERE id='b2'");
assert.equal((await call('/members/b2',{actor:'b',method:'PATCH',body:{role:'participant'}})).status,200);

// 6. Banca del tempo: dal terzo scambio della settimana non arrivano altri premi.
for(let i=1;i<=3;i++){
 query("INSERT INTO time_offers(id,member_id,title) VALUES(?, 'b', ?)",[i,'Ora '+i]);
 query("INSERT INTO time_exchanges(id,offer_id,requester_id,status) VALUES(?,?,'a','accepted')",[i,i]);
 assert.equal((await call('/time-exchanges/'+i+'/done',{actor:'a',method:'POST'})).status,200);
}
assert.equal(query("SELECT COUNT(*) AS n FROM awards WHERE member_id='a' AND source='scambio'",[],'first').n,2);

// 7. Riscatto contemporaneo dell'ultima scorta e intestazioni.
assert.equal((await call('/auth/me')).headers.get('X-Content-Type-Options'),'nosniff');
console.log('OK: blocco login per email e indirizzo, cambio password chiude le altre sessioni, proposte senza auto-premio e con premio unico, tetto riscatti, ultimo referente protetto dal database, tetto settimanale della banca.');

// 8. Valutazioni e suggerimenti.
query("DELETE FROM notifications");
assert.equal((await call('/feedback/prompt',{actor:'a'})).status,200);
assert.equal((await (await call('/feedback/prompt',{actor:'a'})).json()).due,false);
for(let i=0;i<7;i++)query("INSERT INTO app_visit_days(member_id,day) VALUES('a',?)",['2030-01-0'+(i+1)]);
assert.equal((await (await call('/feedback/prompt',{actor:'a'})).json()).due,true);
await call('/feedback/snooze',{actor:'a',method:'POST',body:{}});
assert.equal((await (await call('/feedback/prompt',{actor:'a'})).json()).due,false);
query("DELETE FROM feedback WHERE kind='snooze'");
assert.equal((await call('/feedback/rating',{actor:'a',method:'POST',body:{rating:6}})).status,400);
assert.equal((await call('/feedback/rating',{actor:'a',method:'POST',body:{rating:4,message:'Bella ma lenta'}})).status,201);
assert.equal((await call('/feedback/rating',{actor:'a',method:'POST',body:{rating:5}})).status,429);
assert.equal((await (await call('/feedback/prompt',{actor:'a'})).json()).due,false);
const note=query("SELECT title,body FROM notifications WHERE member_id='b' AND kind='valutazione'",[],'first');
assert.ok(note&&!/Esploratore/.test(note.title+note.body));
assert.equal((await call('/feedback/suggestions',{actor:'a',method:'POST',body:{category:'x',message:'Un suggerimento valido'}})).status,400);
assert.equal((await call('/feedback/suggestions',{actor:'a',method:'POST',body:{category:'idea',message:'corto'}})).status,400);
assert.equal((await call('/feedback/suggestions',{actor:'a',method:'POST',body:{category:'idea',message:'Aggiungere un angolo giochi da tavolo'}})).status,201);
assert.equal((await call('/feedback/suggestions',{actor:'a',method:'POST',body:{category:'critica',message:'Il calendario è confuso sul telefono',anonymous:true}})).status,201);
const sug=query("SELECT title FROM notifications WHERE member_id='b' AND kind='suggerimento' ORDER BY id",[],'all').results;
assert.equal(sug.length,2);assert.match(sug[0].title,/Esploratore/);assert.match(sug[1].title,/anonimo/);assert.doesNotMatch(sug[1].title,/Esploratore/);
for(let i=0;i<3;i++)await call('/feedback/suggestions',{actor:'a',method:'POST',body:{category:'idea',message:'Altro suggerimento numero '+i}});
assert.equal((await call('/feedback/suggestions',{actor:'a',method:'POST',body:{category:'idea',message:'Sesto suggerimento oggi'}})).status,429);
assert.equal((await call('/feedback/summary',{actor:'a'})).status,403);
const sum=await (await call('/feedback/summary',{actor:'b'})).json();
assert.equal(sum.count,1);assert.equal(sum.average,4);assert.equal(JSON.stringify(sum).includes('Esploratore'),false);
console.log('OK: valutazioni e suggerimenti: soglia d’uso, rinvio, limiti, anonimato verso i referenti, notifiche ai referenti.');
