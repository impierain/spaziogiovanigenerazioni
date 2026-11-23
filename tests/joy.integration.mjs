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
let testRandom=99;
function query(sql,params=[],mode='run') {
 const result=spawnSync('python3',['-c',`
import sqlite3,sys,json
con=sqlite3.connect(sys.argv[1])
con.execute('PRAGMA foreign_keys=ON')
con.row_factory=sqlite3.Row
sql,params,mode,testRandom=json.load(sys.stdin)
con.create_function('random',0,lambda:testRandom)
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
 `,dbFile],{input:JSON.stringify([sql,params,mode,testRandom]),encoding:'utf8'});
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

const route='/my/joy';
const state=async actor=>(await (await request(route,actor)).json());
const totals=id=>query('SELECT * FROM member_totals WHERE member_id=?',[id],'first');
assert.equal((await request(route,null)).status,401);
let start=await state('a');assert.equal(start.onboarding.done,1);assert.equal(start.onboarding.total,8);assert.equal(start.weekly.current,0);
await Promise.all([request(route+'/greeting','a','POST',{}),request(route+'/greeting','a','POST',{}),request(route+'/greeting','a','POST',{})]);
assert.equal(totals('a').cheese_earned,1);assert.equal((await state('a')).greeting,false);
assert.equal((await request(route+'/bundle','a','POST',{})).status,409);
assert.equal((await request(route+'/decoration','a','PUT',{decoration:'stelle'})).status,403);
// Persistent wallet: enough earned currency, weekly purchase and races are idempotent.
query("INSERT INTO joy_rewards(member_id,kind,ref,cheese) VALUES('a','micro','fixture',10)");
const bundle=await Promise.all([request(route+'/bundle','a','POST',{}),request(route+'/bundle','a','POST',{})]);
const bundleData=await Promise.all(bundle.map(r=>r.json()));assert.equal(bundleData[0].bundle.id,bundleData[1].bundle.id);
assert.equal(totals('a').cheese_spent,3);assert.equal(totals('a').xp,5);
const prize=bundleData[0].bundle.payload.prize;
if(prize!=='boost'){assert.equal((await request(route+'/decoration','a','PUT',{decoration:prize})).status,200);assert.equal((await state('a')).equipped,prize);}
const ids=(await state('a')).events.map(e=>e.id);
await request(route+'/seen','b','POST',{ids});assert.equal((await state('a')).events.length,ids.length);
await request(route+'/seen','a','POST',{ids});assert.equal((await state('a')).events.length,0);
assert.equal((await request(route+'/seen','a','POST',{ids:['1) OR 1=1']})).status,400);
// Two real members for missions and an independent organizer. Randomness is controlled only in the local SQLite harness.
query("INSERT INTO members(id,email,pseudonym,status) VALUES('c','c@example.test','Secondo','approved')");
query("INSERT INTO chore_types(id,name,xp,cheese,path) VALUES('joy-test','Aiuto logistico',30,2,'solidarieta')");
query("INSERT INTO accessi(member_id,direction,at,source) VALUES('a','IN',unixepoch()-10,'pannello')");
const makeMission=async()=>{const r=await request('/chores','a','POST',{typeId:'joy-test'});assert.equal(r.status,201);return (await r.json()).chore.id;};
const first=await makeMission();testRandom=0;
// Remove the random bundle so the critical branch is predictable.
query("UPDATE joy_rewards SET payload=json_object('title','Fagotto','prize','ulivo') WHERE member_id='a' AND kind='bundle'");
assert.equal((await request('/chores/'+first+'/verify','b','POST',{})).status,200);
assert.equal(query("SELECT xp FROM joy_rewards WHERE member_id='a' AND kind='critical' AND ref=?",['chore:'+first],'first').xp,30);
assert.equal((await request('/chores/'+first+'/verify','b','POST',{})).status,409);
assert.equal(query("SELECT COUNT(*) AS n FROM joy_rewards WHERE member_id='a' AND kind='critical'",[],'first').n,1);
// One weekly reward from verified work. Opening the app or greeting does not keep the flame alive.
assert.equal((await state('b')).weekly.active,false);
const flame=(await state('a')).weekly;assert.equal(flame.active,true);assert.equal(flame.current,1);
await Promise.all([request(route+'/weekly','a','POST',{}),request(route+'/weekly','a','POST',{})]);
assert.equal(query("SELECT COUNT(*) AS n FROM joy_rewards WHERE member_id='a' AND kind='weekly'",[],'first').n,1);
// Bundle bonus applies once, avoids a simultaneous critical and never exceeds 50 XP.
query("INSERT INTO joy_rewards(member_id,kind,ref,payload) VALUES('a','bundle','boost-fixture',json_object('prize','boost'))");
const second=await makeMission();await request('/chores/'+second+'/verify','b','POST',{});
assert.equal(query("SELECT kind,xp FROM joy_rewards WHERE member_id='a' AND ref=? AND kind IN ('critical','bundle_use')",['chore:'+second],'first').kind,'bundle_use');
const third=await makeMission();testRandom=99;await request('/chores/'+third+'/verify','b','POST',{});
assert.equal(query("SELECT COUNT(*) AS n FROM joy_rewards WHERE member_id='a' AND kind='bundle_use'",[],'first').n,1);
assert.equal(query("SELECT COUNT(*) AS n FROM joy_rewards WHERE ref=? AND kind='critical'",['chore:'+third],'first').n,0);
// One shared team roll, same bonus for every member, no repeated completion.
const draft={title:'Il reel di Cca Siemmu',description:'Un lavoro vero di squadra.',needed:2,xp:40,badge:'Narratori del borgo'};
const q=(await (await request('/team-quests','b','POST',draft)).json()).id;
query('INSERT INTO team_signups(quest_id,member_id) VALUES(?,?)',[q,'a']);query('INSERT INTO team_signups(quest_id,member_id) VALUES(?,?)',[q,'c']);
testRandom=0;assert.equal((await request('/team-quests/'+q+'/complete','b','POST',{verified:true})).status,200);
assert.equal(query("SELECT COUNT(*) AS n,SUM(cheese) AS c FROM joy_rewards WHERE kind='team_party' AND ref=?",[q],'first').n,2);
assert.equal(query("SELECT SUM(cheese) AS c FROM joy_rewards WHERE kind='team_party' AND ref=?",[q],'first').c,10);
assert.equal((await request('/team-quests/'+q+'/complete','b','POST',{verified:true})).status,409);
const {weeklyRun,weekKey}=await import('../src/routes/joy.mjs');
assert.deepEqual(weeklyRun(['2026-10-19','2026-10-26','2026-11-02'],'2026-11-02'),{current:3,best:3,active:true});
assert.deepEqual(weeklyRun(['2026-10-19','2026-10-26'],'2026-11-02'),{current:2,best:2,active:false});
assert.equal(weekKey(Date.parse('2026-10-25T23:30:00Z')),'2026-10-26');
assert.equal(weekKey(Date.parse('2026-10-25T22:30:00Z')),'2026-10-19');
console.log('OK: premi idempotenti, portafoglio, acquisto settimanale, cornici persistenti, privacy ricevute, bonus convalidati, moltiplicatore singolo, sorteggio squadra condiviso e cambio ora legale.');

// Il premio non si perde se si riapre l'app nella settimana seguente.
const realNow=Date.now;Date.now=()=>realNow()+7*86400000;
try{
 const {claimWeek}=await import('../src/routes/joy.mjs');
 const before=totals('c').xp;
 await claimWeek({db,member:{id:'c'}});
 assert.equal(totals('c').xp,before+5);
 await claimWeek({db,member:{id:'c'}});
 assert.equal(totals('c').xp,before+5);
}finally{Date.now=realNow;}
console.log('OK: bonus settimanale conservato anche aprendo l’app la settimana successiva.');
