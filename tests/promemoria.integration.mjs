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
console.log('OK: promemoria «sei ancora in sede?» dopo due ore, una volta per ingresso, solo per chi è ancora dentro.');
