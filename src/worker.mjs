import {HttpError, json} from './lib/http.mjs';
import {currentMember} from './lib/session.mjs';
import {handleParticipation} from './participation.mjs';
import * as activities from './routes/activities.mjs';
import * as accessi from './routes/accessi.mjs';
import * as auth from './routes/auth.mjs';
import * as chores from './routes/chores.mjs';
import * as members from './routes/members.mjs';
import * as notifications from './routes/notifications.mjs';
import * as stats from './routes/stats.mjs';

// access: 'public' = senza accesso, 'member' = socio o referente, 'organizer' = solo referenti.
const routes = [
 ['POST', '/api/auth/login', 'public', auth.login],
 ['POST', '/api/auth/logout', 'public', auth.logout],
 ['GET', '/api/auth/me', 'public', auth.me],
 ['GET', '/api/auth/token', 'public', auth.checkToken],
 ['POST', '/api/auth/set-password', 'public', auth.setPassword],
 ['POST', '/api/auth/change-password', 'member', auth.changePassword],

 ['GET', '/api/members', 'organizer', members.list],
 ['POST', '/api/members', 'organizer', members.create],
 ['PATCH', '/api/members/:id', 'organizer', members.update],
 ['POST', '/api/members/:id/invite', 'organizer', members.reinvite],
 ['PUT', '/api/members/:id/card', 'organizer', members.setCard],
 ['DELETE', '/api/members/:id/card', 'organizer', members.removeCard],

 ['POST', '/api/access', 'organizer', accessi.create],
 ['GET', '/api/access', 'member', accessi.list],
 ['GET', '/api/inside', 'organizer', accessi.presenti],

 ['GET', '/api/chore-types', 'member', chores.listTypes],
 ['POST', '/api/chore-types', 'organizer', chores.createType],
 ['PATCH', '/api/chore-types/:id', 'organizer', chores.updateType],
 ['GET', '/api/chores', 'member', chores.listLogs],
 ['POST', '/api/chores', 'member', chores.createLog],
 ['POST', '/api/chores/:id/verify', 'organizer', chores.verify],
 ['POST', '/api/chores/:id/reject', 'organizer', chores.reject],

 ['GET', '/api/stats/sede', 'organizer', stats.sede],
 ['GET', '/api/stats/members/:id', 'member', stats.socio],

 ['GET', '/api/activities/manage', 'organizer', activities.manage],
 ['POST', '/api/activities/manage', 'organizer', activities.create],
 ['PATCH', '/api/activities/manage/:id', 'organizer', activities.update],
 ['GET', '/api/activities/manage/:id/bookings', 'organizer', activities.bookings],
 ['GET', '/api/my/bookings', 'member', activities.mine],
 ['GET', '/api/notifications', 'member', notifications.list],
 ['POST', '/api/notifications/read', 'member', notifications.markRead]
].map(([method, pattern, access, handler]) => ({method, access, handler, parts: pattern.split('/')}));

function match(route, method, parts) {
 if (route.method !== method || route.parts.length !== parts.length) return null;
 const params = {};
 for (let i = 0; i < parts.length; i++) {
  if (route.parts[i].startsWith(':')) params[route.parts[i].slice(1)] = decodeURIComponent(parts[i]);
  else if (route.parts[i] !== parts[i]) return null;
 }
 return params;
}

async function handle(request, env) {
 const url = new URL(request.url);
 const parts = url.pathname.replace(/\/+$/, '').split('/');
 const db = env.DB;

 for (const route of routes) {
  const params = match(route, request.method, parts);
  if (!params) continue;
  if (request.method !== 'GET' && request.headers.get('Origin') !== url.origin) {
   return json({error: 'Origine della richiesta non valida.'}, 403);
  }
  const member = await currentMember(request, db);
  if (route.access !== 'public' && !member) return json({error: 'Accedi per continuare.'}, 401);
  if (route.access === 'organizer' && member.role !== 'organizer') return json({error: 'Operazione riservata ai referenti.'}, 403);
  return route.handler({request, env, db, url, params, member});
 }

 // Attività e prenotazioni del pilota (elenco, prenota, annulla, conferma, convalida).
 if (parts[1] === 'api' && parts[2] === 'activities') return handleParticipation(request, db);
 return json({error: 'Percorso non trovato.'}, 404);
}

export default {
 async fetch(request, env) {
  const url = new URL(request.url);
  if (!url.pathname.startsWith('/api/')) return env.ASSETS.fetch(request);
  try {
   return await handle(request, env);
  } catch (error) {
   if (error instanceof HttpError) return json({error: error.message}, error.status);
   console.error('Errore API', request.method, url.pathname, error?.stack ?? error);
   return json({error: 'Errore interno. Riprova tra poco.'}, 500);
  }
 }
};
