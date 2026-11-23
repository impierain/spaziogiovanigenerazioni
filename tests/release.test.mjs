import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {prepareRelease} from '../scripts/prepare-release.mjs';

test('La pubblicazione richiede sorgenti puliti e identici a main; la release identifica gli asset',()=>{
 const dir=mkdtempSync(join(tmpdir(),'cca-release-')),remote=join(dir,'remote.git'),root=join(dir,'copy');
 const run=(cwd,...args)=>execFileSync('git',args,{cwd,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
 try{
  run(dir,'init','--bare',remote);mkdirSync(root);run(root,'init','-b','main');
  run(root,'config','user.name','Release test');run(root,'config','user.email','test@localhost');
  mkdirSync(join(root,'dist'));writeFileSync(join(root,'dist/index.html'),'<h1>Cca Siemmu</h1>');writeFileSync(join(root,'.gitignore'),'/dist/release.json\n');
  run(root,'add','.');run(root,'commit','-m','Prima versione');run(root,'remote','add','origin',remote);run(root,'push','origin','main');
  const first=prepareRelease(root);assert.equal(first.sourceCommit,run(root,'rev-parse','HEAD'));assert.match(first.assets['index.html'],/^[a-f0-9]{64}$/);
  assert.equal(JSON.parse(readFileSync(join(root,'dist/release.json'))).sourceCommit,first.sourceCommit);
  prepareRelease(root); // Il metadato generato non sporca la sorgente.
  writeFileSync(join(root,'dist/index.html'),'<h1>Modifica non salvata</h1>');assert.throws(()=>prepareRelease(root),/salva e invia/);
  run(root,'add','.');run(root,'commit','-m','Seconda versione');assert.throws(()=>prepareRelease(root),/non coincide/);
  run(root,'push','origin','main');assert.notEqual(prepareRelease(root).assets['index.html'],first.assets['index.html']);
  writeFileSync(join(root,'dist/non-versionato.js'),'alert(1)');assert.throws(()=>prepareRelease(root),/salva e invia/);
 }finally{rmSync(dir,{recursive:true,force:true});}
});
