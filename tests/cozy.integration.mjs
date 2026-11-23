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


for(const species of ['esploratrice','mago','cavaliere','artigiana']){
 const response=await call('/auth/profile',{actor:'a',method:'PATCH',body:{avatarSpecies:species,avatarColor:'arcobaleno'}});
 assert.equal(response.status,200);
 const fresh=await (await call('/auth/me',{actor:'a'})).json();
 assert.equal(fresh.member.avatarSpecies,species);assert.equal(fresh.member.avatarColor,'arcobaleno');
}
assert.equal((await call('/auth/profile',{actor:'a',method:'PATCH',body:{avatarSpecies:'../municipio',avatarColor:'rosa'}})).status,400);
assert.equal((await (await call('/auth/me',{actor:'b'})).json()).member.avatarSpecies,'mucca');
const now=Math.floor(Date.now()/1000);
for(let i=0;i<5;i++){
 const start=now-(20+i)*86400;
 for(const id of ['a','b']){
  query("INSERT INTO accessi(member_id,direction,at,source) VALUES(?,'IN',?,'pannello')",[id,start]);
  query("INSERT INTO accessi(member_id,direction,at,source) VALUES(?,'OUT',?,'pannello')",[id,start+5*3600]);
 }
}
let data=await (await call('/community')).json();
let opening=data.metrics.find(m=>m.key==='apertura');
assert.equal(opening.value,0);assert.equal(opening.growthValue,25);assert.equal(opening.growthStage,1);
query('DELETE FROM accessi');data=await (await call('/community')).json();
assert.equal(data.metrics.find(m=>m.key==='apertura').growthStage,1);
const {runInNewContext}=await import('node:vm');
const context={window:{}};
runInNewContext(readFileSync(join(root,'dist/cozy-art.js'),'utf8'),context);
assert.equal(Object.keys(context.window.CCAArt.avatars).length,18);
assert.ok(context.window.CCAArt.edifici.municipio.includes('<rect'));
const source=readFileSync(join(root,'dist/app.js'),'utf8');
const code=source.slice(source.indexOf('const villageThresholds='),source.indexOf('const PATHS='));
const visual=runInNewContext(code+';({villageScene,villageCount})',context);
const metrics=['giovani','apertura','attivita','missioni'].map(key=>({key,growthStage:3}));
const grown=visual.villageScene(metrics),empty=visual.villageScene(metrics.map(m=>({...m,growthStage:0})));
assert.equal(visual.villageCount(metrics),12);
assert.ok(grown.includes('quarter-layer-day')&&grown.includes('quarter-layer-night'));
assert.equal(grown.includes('<image'),false);assert.equal(grown.includes('sicani.svg'),false);
assert.ok((empty.match(/display:none/g)||[]).length>(grown.match(/display:none/g)||[]).length);
const mapContext={S:{me:null},animals:{mucca:{}},pref:{get:(key,fallback)=>fallback},section:(title,body)=>body};
const mapCode=source.slice(source.indexOf('const worldPlaces='),source.indexOf('function openWorldMenu()'));
const mapUI=runInNewContext(mapCode+';({worldMap,worldPlaces,worldPlaceInfo})',mapContext);
const markup=mapUI.worldMap();
assert.equal((markup.match(/class="world-pin"/g)||[]).length,9);
assert.match(markup,/<button[^>]+data-world-place="municipio"[^>]*><span>3<\/span>/);
assert.equal(markup.includes('world-municipio'),false);
for(const [id] of mapUI.worldPlaces){
 assert.ok(mapUI.worldPlaceInfo[id].features.length>=2);
 assert.ok(mapUI.worldPlaceInfo[id].actions.length>=1);
}
assert.equal(mapUI.worldPlaceInfo.municipio.actions[0][1],'comunita');
console.log('OK: nuovi avatar persistenti, whitelist, crescita cumulativa permanente, scene integrate e municipio.');
