import {spawnSync} from 'node:child_process';
import {prepareRelease} from './prepare-release.mjs';

try {
 if(Number(process.versions.node.split('.')[0])<22)throw new Error('Per pubblicare serve Node.js 22 o successivo.');
 const release=prepareRelease();
 const cli=process.env.CCA_WRANGLER_PATH;
 const args=['deploy','--message',`GitHub main ${release.sourceCommit}`,...process.argv.slice(2)];
 const result=spawnSync(cli?process.execPath:'wrangler',cli?[cli,...args]:args,{stdio:'inherit'});
 if(result.error)throw result.error;
 process.exitCode=result.status??1;
}catch(error){console.error(error.message);process.exitCode=1;}
