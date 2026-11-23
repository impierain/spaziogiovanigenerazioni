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
const dbFile=join(mkdtempSync(join(tmpdir(),'cca-aula-')),'local.sqlite');
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
const {announceStudyRoom}=await import(pathToFileURL(join(root,'src/routes/aula.mjs')));
const ua=nc.createECDH('prime256v1');ua.generateKeys();
const keys=[wp.b64u.enc(ua.getPublicKey()),wp.b64u.enc(nc.randomBytes(16))];
// soci: a entra, b e c vogliono l'avviso, d no, e ha detto sì ma non ha il telefono collegato
for(const id of ['c','d','e'])query("INSERT INTO members (id,email,pseudonym,role,status) VALUES (?,?,?,?,'approved')",[id,id+'@example.test','Socio '+id,'participant']);
for(const id of ['c','d','e']){const {token,hash}=await newToken();query('INSERT INTO sessions (token_hash, member_id, expires_at) VALUES (?,?,unixepoch()+1800)',[hash,id]);sessions[id]=token;}
for(const id of ['b','c'])query("INSERT INTO push_subscriptions (member_id,endpoint,p256dh,auth) VALUES (?,?,?,?)",[id,'https://fcm.googleapis.com/fcm/send/'+id,keys[0],keys[1]]);
const origFetch=globalThis.fetch;let pushes=[];
globalThis.fetch=async(url)=>{pushes.push(String(url));return new Response('',{status:201});};

// preferenza: all'inizio la domanda va fatta, «Non ora» la rimanda di un mese, «Sì» la chiude
assert.deepEqual(await (await call('/aula/preferenza',{actor:'b'})).json(),{enabled:false,ask:true});
assert.equal((await call('/aula/preferenza',{actor:'b',method:'PUT',body:{enabled:false}})).status,200);
assert.deepEqual(await (await call('/aula/preferenza',{actor:'b'})).json(),{enabled:false,ask:false});
query("UPDATE aula_preferences SET asked_at = unixepoch() - 31*86400 WHERE member_id='b'");
assert.equal((await (await call('/aula/preferenza',{actor:'b'})).json()).ask,true);   // dopo un mese si riprova
for(const id of ['b','c','e'])assert.equal((await call('/aula/preferenza',{actor:id,method:'PUT',body:{enabled:true}})).status,200);
assert.deepEqual(await (await call('/aula/preferenza',{actor:'b'})).json(),{enabled:true,ask:false});
assert.equal((await call('/aula/preferenza')).status,401);

const at=(d,h,m)=>Math.floor(Date.UTC(2026,10,d,h,m)/1000);   // 23/11/2026 è lunedì; Roma = UTC+1
assert.equal(await announceStudyRoom(env,db,'a',at(23,14,20)),0);   // 15:20 a Roma: troppo presto
assert.equal(pushes.length,0);
assert.equal(await announceStudyRoom(env,db,'a',at(23,14,45)),2);   // 15:45: tolleranza, avvisa b e c
assert.equal(pushes.length,2);
assert.equal(await announceStudyRoom(env,db,'d',at(23,15,30)),0);   // secondo ingresso dello stesso giorno: niente
assert.equal(pushes.length,2);
assert.equal(await announceStudyRoom(env,db,'b',at(24,15,5)),1);   // il giorno dopo entra b: non avvisa se stesso, avvisa solo c
assert.equal(await announceStudyRoom(env,db,'a',at(28,15,5)),0);    // sabato: niente
assert.equal(await announceStudyRoom(env,db,'a',at(25,19,30)),0);   // 20:30 a Roma: chiuso
assert.equal(await announceStudyRoom(env,db,'a',at(25,18,59)),2);   // 19:59: ancora aperto
// Chi era già dentro prima delle 15:30: l'avviso parte alle 16:00 dal cron
const {announceIfAlreadyOpen}=await import(pathToFileURL(join(root,'src/routes/aula.mjs')));
const ms=(d,h,m)=>Date.UTC(2026,10,d,h,m);
query("INSERT INTO accessi(member_id,direction,at,source) VALUES('a','IN',?,'pannello')",[at(26,13,0)]);   // 14:00 a Roma, giovedì
pushes=[];
assert.equal(await announceIfAlreadyOpen(env,ms(26,14,45)),0);   // 15:45: non ancora le 16
assert.equal(await announceIfAlreadyOpen(env,ms(26,15,0)),2);    // 16:00: avvisa b e c
assert.equal(await announceIfAlreadyOpen(env,ms(26,15,15)),0);   // una volta sola
assert.equal(pushes.length,2);
assert.equal(await announceIfAlreadyOpen(env,ms(28,15,0)),0);    // sabato
// se l'ingresso delle 15:40 ha già fatto scattare l'avviso, il cron non lo ripete
query("INSERT INTO accessi(member_id,direction,at,source) VALUES('d','IN',?,'pannello')",[at(27,14,40)]);
assert.equal(await announceStudyRoom(env,db,'d',at(27,14,40)),2);
assert.equal(await announceIfAlreadyOpen(env,ms(27,15,0)),0);
// nessuno dentro alle 16: niente
assert.equal(await announceIfAlreadyOpen(env,ms(30,15,0)),0);
globalThis.fetch=origFetch;
console.log('OK: avviso «aula studio aperta»: primo ingresso, finestra 15:30–20:00, lun–ven, una volta al giorno, solo a chi lo vuole.');
