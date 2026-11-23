import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

export function prepareRelease(root=process.cwd()) {
 const git=(...args)=>execFileSync('git',args,{cwd:root,encoding:'utf8'}).trim();
 if(git('status','--porcelain'))throw new Error('Pubblicazione bloccata: salva e invia tutte le modifiche a GitHub prima di pubblicare.');
 const commit=git('rev-parse','HEAD');
 const remote=git('ls-remote','origin','refs/heads/main').split(/\s/)[0];
 if(commit!==remote)throw new Error('Pubblicazione bloccata: questa copia non coincide con main su GitHub. Aggiorna la copia o completa prima l’unione.');
 const files=git('ls-files','-z','dist').split('\0').filter(Boolean).sort();
 const assets=Object.fromEntries(files.map(path=>[path.slice(5),createHash('sha256').update(readFileSync(join(root,path))).digest('hex')]));
 const release={sourceCommit:commit,sourceTree:git('rev-parse','HEAD^{tree}'),repository:'https://github.com/impierain/spaziogiovanigenerazioni',builtAt:new Date().toISOString(),assets};
 writeFileSync(join(root,'dist/release.json'),JSON.stringify(release,null,2)+'\n');
 return release;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
 try{console.log('Sorgenti verificati: '+prepareRelease().sourceCommit);}catch(error){console.error(error.message);process.exitCode=1;}
}
