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

for(let i=1;i<=6;i++)query("INSERT INTO chore_types(id,name,description,path,xp,cheese) VALUES(?,?,?,'solidarieta',40,2)",['flow-'+i,'Mansione prova '+i,'Riordina i materiali con cura.']);
assert.equal((await request('/my/assignments',null)).status,401);
const get=async id=>(await (await request('/my/assignments',id)).json()).assignments;
const takes=await Promise.all([request('/my/assignments','a','POST',{typeId:'flow-1'}),request('/my/assignments','a','POST',{typeId:'flow-1'})]);
assert.ok(takes.every(r=>r.status===200));
let jobs=await get('a');assert.equal(jobs.length,1);const id=jobs[0].id;
assert.equal((await get('b')).length,0);
assert.equal((await request('/my/assignments/'+id+'/finish','b','POST',{})).status,409);
assert.equal((await request('/my/assignments/'+id+'/finish','a','POST',{})).status,409);
assert.equal(query('SELECT COUNT(*) AS n FROM chore_logs',[],'first').n,0);
assert.equal((await request('/chores','a','POST',{typeId:'flow-1'})).status,409);
await request('/checkin','a','POST',{direction:'IN'});await request('/checkin','a','POST',{direction:'IN'});
assert.equal(query("SELECT COUNT(*) AS n FROM accessi WHERE member_id='a' AND direction='OUT'",[],'first').n,0);
assert.equal((await request('/chores','a','POST',{typeId:'flow-1'})).status,409);
const finishes=await Promise.all([request('/my/assignments/'+id+'/finish','a','POST',{note:'Fatto in sede.'}),request('/my/assignments/'+id+'/finish','a','POST',{})]);
assert.equal(finishes.filter(r=>r.status===200).length,1);assert.equal(finishes.filter(r=>r.status===409).length,1);
jobs=await get('a');assert.equal(jobs[0].state,'submitted');assert.ok(jobs[0].log_id);
assert.equal(query('SELECT xp FROM member_totals WHERE member_id=?',['a'],'first').xp,0);
await request('/chores/'+jobs[0].log_id+'/verify','b','POST',{});
assert.equal((await get('a'))[0].state,'completed');
assert.equal(query('SELECT xp FROM member_totals WHERE member_id=?',['a'],'first').xp,40);
query("INSERT INTO accessi(member_id,direction,at,source,recorded_by) VALUES('a','OUT',unixepoch()+1,'pannello','b')");
await request('/my/assignments','a','POST',{typeId:'flow-2'});jobs=await get('a');
const running=jobs.find(j=>j.state==='in_progress');assert.ok(running);
assert.equal((await request('/my/assignments/'+running.id+'/finish','a','POST',{})).status,409);
assert.equal((await request('/my/assignments/'+running.id+'/abandon','a','POST',{})).status,200);
assert.equal((await get('a')).find(j=>j.id===running.id).state,'abandoned');
query("INSERT INTO accessi(member_id,direction,at,source,recorded_by) VALUES('b','IN',unixepoch()-60000,'pannello','b')");
await request('/my/assignments','b','POST',{typeId:'flow-3'});const old=(await get('b'))[0];
assert.equal((await request('/my/assignments/'+old.id+'/finish','b','POST',{})).status,409);
query("INSERT INTO chore_logs(chore_type_id,member_id) VALUES('flow-4','a')");
assert.equal((await request('/my/assignments','a','POST',{typeId:'flow-4'})).status,409);
console.log('OK: presa in carico unica, isolamento account, check-in obbligatorio anche su API precedente, ingresso non alternato, invio unico, premi solo dopo convalida, uscita e ingresso scaduto bloccano invio, abbandono senza penalità.');

// Two overlapping visits count separately; the previous month's time and open visits do not.
const realNow = Date.now;
Date.now = () => Date.parse('2030-07-01T08:00:00Z');
try {
 const addAccess = (member, direction, iso) => query(
  "INSERT INTO accessi(member_id,direction,at,source,recorded_by) VALUES(?,?,?,'pannello','b')",
  [member,direction,Date.parse(iso)/1000]
 );
 addAccess('a','IN','2030-06-30T21:30:00Z');
 addAccess('a','OUT','2030-06-30T22:30:00Z');
 addAccess('b','IN','2030-06-30T22:15:00Z');
 addAccess('b','OUT','2030-06-30T23:00:00Z');
 addAccess('a','IN','2030-07-01T07:00:00Z');
 const response = await request('/community');
 assert.equal(response.status,200);
 const {monthlyGoal} = await response.json();
 assert.deepEqual(monthlyGoal,{month:'2030-07',seconds:4500,target:360000,reached:false,benefit:null});
 env.COMMUNITY_GOAL_HOURS = '1';
 env.COMMUNITY_GOAL_BENEFIT = 'Festa sociale';
 const reached = (await (await request('/community')).json()).monthlyGoal;
 assert.equal(reached.reached,true);
 assert.equal(reached.benefit,'Festa sociale');
} finally {
 Date.now = realNow;
}
