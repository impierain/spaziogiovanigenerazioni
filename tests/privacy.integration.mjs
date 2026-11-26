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
const dbFile=join(mkdtempSync(join(tmpdir(),'cca-privacy-')),'local.sqlite');
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

// dati di a: un ingresso, una notifica, un dispositivo, una proposta
query("INSERT INTO accessi(member_id,direction,at,source) VALUES('a','IN',unixepoch()-3600,'pannello')");
query("INSERT INTO notifications(member_id,kind,level,title,body) VALUES('a','info','info','Ciao','Prova')");
query("INSERT INTO push_subscriptions(member_id,endpoint,p256dh,auth) VALUES('a','https://fcm.googleapis.com/fcm/send/a','x','y')");
assert.equal((await call('/proposals',{actor:'a',method:'POST',body:{title:'Serata giochi',description:'Una sera'}})).status,201);

// scarica i miei dati: solo i propri, senza chiavi segrete
const ex=await call('/me/export',{actor:'a'});
assert.equal(ex.status,200);
assert.match(ex.headers.get('Content-Disposition'),/attachment/);
const data=await ex.json();
assert.equal(data.profile.id,'a');
assert.equal(data.accessi.length,1);
assert.equal(data.notifications.length>=1,true);
assert.equal(data.pushDevices.length,1);
assert.equal(JSON.stringify(data).includes('fcm.googleapis.com'),false);   // niente endpoint/chiavi push
assert.equal(JSON.stringify(data).includes('password_hash'),false);
assert.equal((await call('/me/export')).status,401);

// elimina: serve la conferma; l'unico referente non può
assert.equal((await call('/me/delete',{actor:'a',method:'POST',body:{confirm:'no'}})).status,400);
const onlyOrg=query("SELECT COUNT(*) AS n FROM members WHERE role='organizer' AND status='approved'",[],'first').n;
if(onlyOrg===1)assert.equal((await call('/me/delete',{actor:'b',method:'POST',body:{confirm:'ELIMINA'}})).status,400);
const del=await call('/me/delete',{actor:'a',method:'POST',body:{confirm:'elimina'}});
assert.equal(del.status,200);
assert.match(del.headers.get('Set-Cookie'),/Max-Age=0/);
const row=query("SELECT email,pseudonym,full_name,password_hash,status FROM members WHERE id='a'",[],'first');
assert.equal(row.pseudonym,'Ex socio');assert.equal(row.status,'disabled');assert.equal(row.full_name,null);assert.equal(row.password_hash,null);
assert.match(row.email,/@soci\.invalid$/);
for(const t of ['sessions','notifications','push_subscriptions','proposals'])assert.equal(query(`SELECT COUNT(*) AS n FROM ${t} WHERE member_id='a'`,[],'first').n,0,t);
assert.equal(query("SELECT COUNT(*) AS n FROM accessi WHERE member_id='a'",[],'first').n,1);   // le presenze restano, senza nome
assert.equal((await call('/auth/me',{actor:'a'})).status===200&&(await (await call('/auth/me',{actor:'a'})).json()).member,null);   // sessione chiusa
// errori del sito: accettati, nessun dato salvato
assert.equal((await call('/client-error',{method:'POST',body:{message:'TypeError: x',where:'app.js:1:2',page:'#home'}})).status,200);
console.log('OK: scarica i miei dati, elimina l’account (anonimizzazione), segnalazione errori.');
