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
const dbFile=join(mkdtempSync(join(tmpdir(),'cca-sede-')),'local.sqlite');
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
 method,headers:{...(actor?{Cookie:'__Host-cca_session='+sessions[actor]}:{}),Origin:'https://cca.example.test','Content-Type':'application/json'},
 body:body===undefined?undefined:JSON.stringify(body)
}),env);
const jobs=await import(pathToFileURL(join(root,'src/jobs.mjs')));
const now=Math.floor(Date.now()/1000);
const entry=(member,at)=>query("INSERT INTO accessi (member_id,direction,at,source) VALUES (?,?,?,'pannello')",[member,'IN',at]).meta.last_row_id;
const json=async res=>({status:res.status,body:await res.json()});

// Stato: dentro / fuori
assert.equal((await json(await request('/sede/stato','a'))).body.inside,false);
const id=entry('a',now-3*3600);
const st=(await json(await request('/sede/stato','a'))).body;
assert.deepEqual([st.inside,st.id],[true,id]);

// Non si risponde per l'ingresso di un altro, né con risposte inventate
assert.equal((await json(await request('/sede/risposta','b','POST',{id,answer:'uscito'}))).status,404);
assert.equal((await json(await request('/sede/risposta','a','POST',{id,answer:'boh'}))).status,400);

// «Sono ancora dentro»: niente uscita automatica, anche se il promemoria è partito da più di un'ora
query("INSERT INTO reminders_sent (kind,ref,member_id,sent_at) VALUES ('sede',?,?,?)",[String(id),'a',now-2*3600]);
assert.equal((await json(await request('/sede/risposta','a','POST',{id,answer:'ancora'}))).body.state,'ancora');
assert.equal(await jobs.autoCheckouts(env,Date.now()),0);
assert.equal(query("SELECT COUNT(*) AS n FROM accessi WHERE member_id='a' AND direction='OUT'",[],'first').n,0);
// Dopo tre ore la domanda si ripete, senza uscita automatica
query("UPDATE reminders_sent SET sent_at=? WHERE kind='sede-ancora'",[now-3*3600-5]);
assert.equal(await jobs.sendStillInsideReminders(env,Date.now()),1);
assert.ok(query("SELECT sent_at FROM reminders_sent WHERE kind='sede-ancora'",[],'first').sent_at>=now-5);
assert.equal(await jobs.autoCheckouts(env,Date.now()),0);

// «No, sono uscito»: uscita registrata adesso; una seconda risposta non fa danni
assert.equal((await json(await request('/sede/risposta','a','POST',{id,answer:'uscito'}))).body.state,'uscito');
assert.equal(query("SELECT COUNT(*) AS n FROM accessi WHERE member_id='a' AND direction='OUT'",[],'first').n,1);
assert.equal((await json(await request('/sede/risposta','a','POST',{id,answer:'uscito'}))).body.state,'gia-uscito');
assert.equal((await json(await request('/sede/stato','a'))).body.inside,false);

// App installata: la visita dall'app lo ricorda sull'account, quella dal browser no
assert.equal((await json(await request('/auth/me','b'))).body.appInstalled,false);
await request('/my/app-visit','b','POST',{});
assert.equal((await json(await request('/auth/me','b'))).body.appInstalled,false);
await request('/my/app-visit','b','POST',{standalone:true});
assert.equal((await json(await request('/auth/me','b'))).body.appInstalled,true);
console.log('OK: risposta «ancora dentro»/«sono uscito», domanda ripetuta dopo tre ore, app installata ricordata.');

// «Avvisa tutti i soci»: assemblea e attività, anche senza prenotazioni; solo referenti; niente doppio invio
query("INSERT INTO members (id,email,pseudonym,role,status) VALUES ('c','c@example.test','Terzo','participant','approved')");
const future=now+86400;
query("INSERT INTO app_settings (key,text_value) VALUES ('next_assembly',?)",[JSON.stringify({startsAt:future,location:'Sede',agenda:[]})]);
assert.equal((await json(await request('/assembly/notify','a','POST',{}))).status,403);
const r1=await json(await request('/assembly/notify','b','POST',{}));
assert.deepEqual([r1.status,r1.body.members],[200,2]);
assert.equal((await json(await request('/assembly/notify','b','POST',{}))).status,429);
assert.equal(query("SELECT COUNT(*) AS n FROM notifications WHERE title='Assemblea dei giovani'",[],'first').n,2);
query("INSERT INTO activities (id,name,starts_at,capacity,status,verification_rule) VALUES ('x1','Serata',?,10,'published','Presenza')",[future]);
assert.equal((await json(await request('/activities/manage/x1/notify','b','POST',{}))).body.members,2);
console.log('OK: avviso a tutti i soci da assemblea e attività.');

// Convocazione: avviso alla pubblicazione e promemoria automatici a tutti i soci
const start=now+9*3600;
const startRome=new Date((start+3600)*1000).toISOString().slice(0,16); // Italia = UTC+1 a fine novembre
query("DELETE FROM app_settings WHERE key='next_assembly'");
query("DELETE FROM notifications");
query("DELETE FROM reminders_sent WHERE kind='avviso-tutti'");
const pub=await json(await request('/assembly/meeting','b','PUT',{startsAt:startRome,location:'Sede',agenda:'Punto',notify:true}));
assert.equal(pub.status,200);
assert.equal(query("SELECT COUNT(*) AS n FROM notifications WHERE title LIKE 'Assemblea dei giovani%'",[],'first').n,2);
assert.equal((await json(await request('/assembly/reminders','a','PUT',{reminders:[480]}))).status,403);
assert.equal((await json(await request('/assembly/reminders','b','PUT',{reminders:[480,480]}))).status,400);
assert.equal((await json(await request('/assembly/reminders','b','PUT',{reminders:[480,null]}))).status,200);
// un aggiornamento della convocazione non cancella i promemoria
await request('/assembly/meeting','b','PUT',{startsAt:startRome,location:'Piazza',agenda:'Punto'});
assert.deepEqual((await json(await request('/assembly','a'))).body.meeting.reminders,[480]);
assert.equal(await jobs.sendAssemblyReminders(env,Date.now()),0);               // mancano 9 ore: non è ancora ora
assert.equal(await jobs.sendAssemblyReminders(env,(start-8*3600+60)*1000),3);   // 8 ore prima: tutti e tre i soci
assert.equal(await jobs.sendAssemblyReminders(env,(start-8*3600+120)*1000),0);  // una sola volta
assert.equal(query("SELECT COUNT(*) AS n FROM notifications WHERE title='Assemblea: inizia tra 8 ore'",[],'first').n,3);
console.log('OK: convocazione con avviso e promemoria a tutti i soci.');
