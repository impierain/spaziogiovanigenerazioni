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
const dbFile=join(mkdtempSync(join(tmpdir(),'cca-pushevento-')),'local.sqlite');
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
env.RESEND_API_KEY=undefined;
const call=(path,{actor,method='GET',body,ip}={})=>worker.fetch(new Request('https://cca.example.test/api'+path,{
 method,headers:{...(actor?{Cookie:'__Host-cca_session='+sessions[actor]}:{}),...(ip?{'CF-Connecting-IP':ip}:{}),Origin:'https://cca.example.test','Content-Type':'application/json'},
 body:body===undefined?undefined:JSON.stringify(body)
}),env);

const nc=await import('node:crypto');
const wp=await import(pathToFileURL(join(root,'src/lib/webpush.mjs')));
const ua=nc.createECDH('prime256v1');ua.generateKeys();
const keys=[wp.b64u.enc(ua.getPublicKey()),wp.b64u.enc(nc.randomBytes(16))];
// a = socio (no push), b = referente (push), r = secondo referente (push), c = socio (push), d = socio senza push
for(const [id,role] of [['r','organizer'],['c','participant'],['d','participant']]){query("INSERT INTO members (id,email,pseudonym,role,status) VALUES (?,?,?,?,'approved')",[id,id+'@example.test','Socio '+id,role]);const {token,hash}=await newToken();query('INSERT INTO sessions (token_hash, member_id, expires_at) VALUES (?,?,unixepoch()+1800)',[hash,id]);sessions[id]=token;}
for(const id of ['b','r','c'])query("INSERT INTO push_subscriptions (member_id,endpoint,p256dh,auth) VALUES (?,?,?,?)",[id,'https://fcm.googleapis.com/fcm/send/'+id,keys[0],keys[1]]);
const origFetch=globalThis.fetch;let pushes=[];
globalThis.fetch=async(url)=>{pushes.push(String(url).split('/').pop());return new Response('',{status:201});};
const who=()=>{const l=[...pushes].sort();pushes=[];return l.join(',');};

// proposta di c: push ai referenti b e r (non a chi l'ha scritta)
assert.equal((await call('/proposals',{actor:'c',method:'POST',body:{title:'Serata giochi',description:'Una sera a settimana'}})).status,201);
assert.equal(who(),'b,r');
// richiesta di accesso: push ai referenti
assert.equal((await call('/auth/request-access',{method:'POST',body:{fullName:'Nuova Persona',email:'nuova@example.test'}})).status,200);
assert.equal(who(),'b,r');
// attività pubblicata da b: push ai soci con notifiche (c, e anche r), non a chi la pubblica; se resta bozza nessuno
const start=Math.floor(Date.now()/1000)+3*86400;
const draft=await (await call('/activities/manage',{actor:'b',method:'POST',body:{name:'Cineforum',startsAt:start,capacity:10,status:'draft',verificationRule:'Presenza'}})).json();
assert.equal(who(),'');
assert.equal((await call('/activities/manage/'+draft.activity.id,{actor:'b',method:'PATCH',body:{status:'published'}})).status,200);
assert.equal(who(),'c,r');
assert.equal((await call('/activities/manage/'+draft.activity.id,{actor:'b',method:'PATCH',body:{name:'Cineforum 2'}})).status,200);
assert.equal(who(),'');                       // una modifica successiva non riavvisa
assert.equal((await call('/activities/manage/'+draft.activity.id,{actor:'b',method:'PATCH',body:{status:'published'}})).status,200);
assert.equal(who(),'');                       // già pubblicata: nessun doppione
// prenotazione di c, confermata da b: push a c
assert.equal((await call('/activities/'+draft.activity.id+'/reserve',{actor:'c',method:'POST'})).status,200);
assert.equal(who(),'');
assert.equal((await call('/activities/'+draft.activity.id+'/confirm',{actor:'b',method:'POST',body:{memberId:'c'}})).status,200);
assert.equal(who(),'c');
// una persona senza dispositivo non fa errori: d prenota, b rifiuta
assert.equal((await call('/activities/'+draft.activity.id+'/reserve',{actor:'d',method:'POST'})).status,200);
assert.equal((await call('/activities/'+draft.activity.id+'/decline',{actor:'b',method:'POST',body:{memberId:'d'}})).status,200);
assert.equal(who(),'');
globalThis.fetch=origFetch;
console.log('OK: push ai referenti (proposte, accessi) e ai soci (nuove attività, prenotazioni).');
