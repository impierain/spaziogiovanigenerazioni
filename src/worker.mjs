import {handleParticipation} from './participation.mjs';

export default {
 async fetch(request, env) {
  const url = new URL(request.url);
  if (url.pathname.startsWith('/api/')) {
   return handleParticipation(request, env.DB);
  }
  return env.ASSETS.fetch(request);
 }
};
