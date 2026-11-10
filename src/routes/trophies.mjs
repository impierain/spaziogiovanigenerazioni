import {json} from '../lib/http.mjs';
import {checkTrophies, trophyList} from '../lib/trophies.mjs';

export async function list({env, db, member}) {
 await checkTrophies(env, db, member.id); // recupera eventuali trofei maturati senza evento
 return json({trophies: await trophyList(db, member.id)});
}
