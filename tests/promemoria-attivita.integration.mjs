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
const dbFile=join(mkdtempSync(join(tmpdir(),'cca-promattivita-')),'local.sqlite');
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
const nc=await import('node:crypto');
for(const id of ['c','d']){query("INSERT INTO members (id,email,pseudonym,role,status) VALUES (?,?,?,?,'approved')",[id,id+'@example.test','Socio '+id,'participant']);const {token,hash}=await newToken();query('INSERT INTO sessions (token_hash, member_id, expires_at) VALUES (?,?,unixepoch()+1800)',[hash,id]);sessions[id]=token;}
const patch=(id,body,actor='b')=>call('/activities/manage/'+id,{actor,method:'PATCH',body});
const start=Math.floor(Date.now()/1000)+3*86400;
const created=await call('/activities/manage',{actor:'b',method:'POST',body:{name:'Cineforum',startsAt:start,capacity:10,status:'published',verificationRule:'Presenza',reminders:[2*1440,3*60]}});
assert.equal(created.status,201);
const act=(await created.json()).activity;
assert.equal(act.reminder1,2880);assert.equal(act.reminder2,180);
query("INSERT INTO bookings(activity_id,member_id,status) VALUES (?,?,'confirmed'),(?,?,'confirmed'),(?,?,'pending')",[act.id,'c',act.id,'d',act.id,'a']);

// validazione: solo referenti, max due, orari diversi, tra 5 minuti e 14 giorni
assert.equal((await patch(act.id,{reminders:[60]},'c')).status,403);
assert.equal((await patch(act.id,{reminders:[60,120,180]})).status,400);
assert.equal((await patch(act.id,{reminders:[60,60]})).status,400);
assert.equal((await patch(act.id,{reminders:[1,60]})).status,400);
assert.equal((await patch(act.id,{reminders:[30000,null]})).status,400);
assert.equal((await patch(act.id,{reminders:[2880,180]})).status,200);

const T=sec=>sec*1000;
const count=()=>query("SELECT COUNT(*) AS n FROM notifications WHERE kind='promemoria'",[],'first').n;
assert.equal(await jobs.sendActivityReminders(env,T(start-2880*60-600)),0);        // 10 minuti prima del primo: troppo presto
assert.equal(await jobs.sendActivityReminders(env,T(start-2880*60+60)),2);         // primo promemoria: c e d (non a, in attesa)
assert.equal(await jobs.sendActivityReminders(env,T(start-2880*60+900)),0);        // non si ripete
assert.equal(count(),2);
assert.equal(await jobs.sendActivityReminders(env,T(start-180*60+120)),2);         // secondo promemoria
assert.match(query("SELECT title FROM notifications WHERE kind='promemoria' ORDER BY id DESC LIMIT 1",[],'first').title,/inizia tra 3 ore/);
assert.equal(await jobs.sendActivityReminders(env,T(start-60)),0);                 // niente di nuovo prima dell'inizio

// il promemoria automatico del giorno prima non parte per le attività con promemoria personalizzati
const before=count();
await jobs.sendReminders(env,T(start-3600));
assert.equal(count(),before);
// impostato in ritardo (già passato da più di un'ora): non parte
assert.equal((await patch(act.id,{reminders:[10080,null]})).status,200);
assert.equal(await jobs.sendActivityReminders(env,T(start-3600)),0);
// senza promemoria personalizzati resta quello automatico
assert.equal((await patch(act.id,{reminders:[null,null]})).status,200);
await jobs.sendReminders(env,T(start-3600));
assert.equal(count(),before+2);
console.log('OK: promemoria personalizzati delle attività (due per attività, soci confermati, nessun doppione).');
