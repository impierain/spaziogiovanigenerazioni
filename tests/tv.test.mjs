import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {test} from 'node:test';
import assert from 'node:assert/strict';

const source=(await import('node:fs')).readdirSync(new URL('../dist/app/',import.meta.url)).sort().map(f=>readFileSync(new URL('../dist/app/'+f,import.meta.url),'utf8')).join('\n');
const code=source.slice(source.indexOf('const tvTips='),source.indexOf('// La TV è 16:9:'));
const escaping=source.slice(source.indexOf('const esc=value'),source.indexOf('const S='));
async function renderTV({activities=[],failed=false,metrics=[],status={open:true},qr=true}={}){
 const context={Date,Intl,Math,Number,navigator:{},location:{origin:'https://cca.test',host:'cca.test'},window:{qrcode:qr},pref:{get:()=>9},
  getStatus:async()=>status,getCommunity:async()=>metrics,api:async()=>{if(failed)throw Error('offline');return {activities};},loadQr:async()=>{},
  villageCount:()=>0,villageScene:()=>'<div class="village"></div>',activityDate:time=>`<time>${time}</time>`,
  pixelIcon:()=>'',shapes:{},cowMascot:()=>'<div class="mascot"></div>',btn:()=>'',qrSvg:url=>`<div class="qr-box">${url}</div>`};
 return runInNewContext(escaping+code+';tvPage()',context);
}
const activity=(name,delta,extra={})=>({name,starts_at:Date.now()/1000+delta,description:'Descrizione <sicura>',access_mode:'booking',available:0,...extra});

test('La TV seleziona tre appuntamenti in ordine e nasconde quelli conclusi',async()=>{
 const html=await renderTV({activities:[activity('Quarto',400),activity('Secondo',200),activity('Concluso',-7200),activity('<Primo>',100,{access_mode:'open'}),activity('Terzo',300)]});
 assert.match(html,/data-count="3"/);
 assert.ok(html.indexOf('&lt;Primo&gt;')<html.indexOf('Secondo'));
 assert.ok(html.indexOf('Secondo')<html.indexOf('Terzo'));
 assert.doesNotMatch(html,/Quarto|Concluso|<Primo>|<details|<summary|tv-activity-description/);
 assert.match(html,/Accesso libero/);assert.match(html,/Posti esauriti/);
 assert.match(html,/https:\/\/cca.test\/#home/);
 assert.match(html,/--tvz:1.15/);
});
test('Uno o due appuntamenti mostrano la descrizione senza interazione',async()=>{
 for(const activities of [[activity('Uno',100,{available:3})],[activity('Uno',100),activity('Due',200)]]){
  const html=await renderTV({activities});
  assert.match(html,/class="tv-activity-description">Descrizione &lt;sicura&gt;/);
  assert.doesNotMatch(html,/<details|<summary/);
 }
});
test('Calendario vuoto e dati indisponibili hanno messaggi distinti',async()=>{
 assert.match(await renderTV(),/Presto altri appuntamenti/);
 const offline=await renderTV({failed:true,status:null,metrics:null,qr:false});
 assert.match(offline,/calendario non è disponibile/);
 assert.match(offline,/Stato non disponibile/);
 assert.match(offline,/progressi del borgo torneranno visibili/);
 assert.doesNotMatch(offline,/Chiuso al momento|0 \/ 12 trasformazioni|qr-box/);
});
