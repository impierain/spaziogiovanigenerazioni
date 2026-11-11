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
const dbFile=join(mkdtempSync(join(tmpdir(),'cca-review-')),'local.sqlite');
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
const db={prepare(sql){
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
// Additional members and sessions are fictitious and isolated in this database.
for(const id of ['c','d','e','f']){
 query("INSERT INTO members(id,email,pseudonym,status) VALUES(?,?,?,'approved')",[id,id+'@example.test',id]);
 const {token,hash}=await newToken();query('INSERT INTO sessions(token_hash,member_id,expires_at) VALUES(?,?,unixepoch()+1800)',[hash,id]);sessions[id]=token;
}
assert.equal((await request('/my/daily-wheel',null,'POST',{})).status,401);
assert.equal((await request('/team-quests','a','POST',{})).status,403);
const draft={title:'Cortile in squadra',description:'Lavoro reale verificato in sede.',needed:4,xp:40,badge:'Mastri d’Ascia'};
const created=await request('/team-quests','b','POST',draft);assert.equal(created.status,201);const quest=(await created.json()).id;
const joins=await Promise.all(['a','c','d','e','f'].map(id=>request('/team-quests/'+quest+'/join',id,'POST',{})));
assert.equal(joins.filter(r=>r.status===200).length,4);assert.equal(joins.filter(r=>r.status===409).length,1);
let q=query('SELECT * FROM team_quests WHERE id=?',[quest],'first');assert.equal(q.status,'ready');
assert.equal((await request('/team-quests/'+quest+'/complete','a','POST',{verified:true})).status,403);
assert.equal((await request('/team-quests/'+quest+'/complete','b','POST',{verified:false})).status,400);
const people=query('SELECT member_id FROM team_signups WHERE quest_id=?',[quest],'all').results.map(r=>r.member_id);
await request('/team-quests/'+quest+'/leave',people[0],'POST',{});
assert.equal(query('SELECT status FROM team_quests WHERE id=?',[quest],'first').status,'forming');
assert.equal((await request('/team-quests/'+quest+'/complete','b','POST',{verified:true})).status,409);
await request('/team-quests/'+quest+'/join',people[0],'POST',{});
const completes=await Promise.all([request('/team-quests/'+quest+'/complete','b','POST',{verified:true}),request('/team-quests/'+quest+'/complete','b','POST',{verified:true})]);
assert.equal(completes.filter(r=>r.status===200).length,1);assert.equal(completes.filter(r=>r.status===409).length,1);
assert.equal(query("SELECT COUNT(*) AS n,SUM(xp) AS total FROM bonus_xp WHERE source='team' AND ref=?",[quest],'first').n,4);
assert.equal(query("SELECT SUM(xp) AS n FROM bonus_xp WHERE source='team' AND ref=?",[quest],'first').n,160);
assert.equal(query('SELECT COUNT(*) AS n FROM team_badges WHERE quest_id=?',[quest],'first').n,4);
const secret=await (await request('/team-quests','a')).json();assert.equal(secret.roster.length,0);assert.equal(secret.badges.length,1);
const wheel=await Promise.all([request('/my/daily-wheel','b','POST',{}),request('/my/daily-wheel','b','POST',{})]);
const prizes=await Promise.all(wheel.map(r=>r.json()));assert.equal(prizes[0].prize.kind,prizes[1].prize.kind);
assert.equal(query('SELECT COUNT(*) AS n FROM daily_wheel WHERE member_id=?',['b'],'first').n,1);
const bxp=query("SELECT COALESCE(SUM(xp),0) AS n FROM bonus_xp WHERE member_id='b' AND source='wheel'",[],'first').n;assert.equal(bxp,prizes[0].prize.kind==='xp'?5:0);
const {romeDay,romeDayStart}=await import(pathToFileURL(join(root,'src/lib/time.mjs')));
const today=romeDay(Date.now()),end=romeDayStart(Date.parse(today+'T12:00:00Z')+86400000);
query("INSERT INTO daily_wheel(member_id,day,kind,expires_at) VALUES(?,?,'boost',?)",['a',today,end]);
query("INSERT INTO chore_types(id,name,xp,cheese,path) VALUES('boost-test','Prova 40 XP',40,0,'solidarieta')");
query("INSERT INTO accessi(member_id,direction,at,source,recorded_by) VALUES('a','IN',unixepoch()-10,'pannello','b')");
for(let i=0;i<3;i++){
 const r=await request('/chores','a','POST',{typeId:'boost-test'});const d=await r.json();assert.equal(r.status,201);
 assert.equal((await request('/chores/'+d.chore.id+'/verify','b','POST',{})).status,200);
 assert.equal((await request('/chores/'+d.chore.id+'/verify','b','POST',{})).status,409);
}
assert.equal(query("SELECT SUM(xp) AS n FROM bonus_xp WHERE member_id='a' AND source='boost'",[],'first').n,50);
assert.equal(query("SELECT xp FROM member_totals WHERE member_id='a'",[],'first').xp,210); // 40 team + 120 missioni + 50 boost
const self=(await (await request('/team-quests','b','POST',{...draft,needed:2})).json()).id;
await request('/team-quests/'+self+'/join','b','POST',{});await request('/team-quests/'+self+'/join','a','POST',{});
assert.equal((await request('/team-quests/'+self+'/complete','b','POST',{verified:true})).status,409);
console.log('OK: soglia atomica, quinto iscritto escluso, ritiri, convalida unica, 4 premi/trofei, privacy roster, giro unico, boost limitato a 50 XP e auto-convalida vietata.');
