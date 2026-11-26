import {readFileSync, writeFileSync, readdirSync} from 'node:fs';
import {join} from 'node:path';

// Compatta script e stili di dist/ prima della pubblicazione (spazi e commenti via, nomi intatti:
// gli script del sito condividono le variabili globali, quindi i nomi non vanno rinominati).
// Se esbuild non c'è, si pubblica senza compattare.
export async function minifyDist(root = process.cwd()) {
 let esbuild;
 try { esbuild = await import('esbuild'); } catch { console.warn('esbuild non disponibile: pubblico senza compattare.'); return {saved: 0}; }
 let before = 0, after = 0;
 const files = [...readdirSync(join(root, 'dist')).map(n => join(root, 'dist', n)), ...readdirSync(join(root, 'dist', 'app')).map(n => join(root, 'dist', 'app', n))];
 for (const path of files) {
  const loader = path.endsWith('.js') ? 'js' : path.endsWith('.css') ? 'css' : null;
  if (!loader) continue;
  const code = readFileSync(path, 'utf8');
  const out = esbuild.transformSync(code, {loader, minifyWhitespace: true, minifySyntax: true, minifyIdentifiers: false, legalComments: 'none', target: 'es2020'}).code;
  before += code.length; after += out.length;
  writeFileSync(path, out);
 }
 console.log(`Script e stili compattati: ${Math.round(before / 1024)} KB → ${Math.round(after / 1024)} KB.`);
 return {saved: before - after};
}
