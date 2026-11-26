// Riceve le notifiche push, apre l'app quando si tocca la notifica e tiene una copia delle pagine per usarle senza rete. Versione 5.
// La nuova versione si attiva subito, senza aspettare che tutte le finestre dell'app si chiudano (su iPhone restano aperte a lungo).
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

// Senza rete: prima si prova la rete (dati sempre aggiornati), se manca si usa l'ultima copia salvata.
// Solo richieste GET dello stesso sito; i dati personali (/api) restano sul telefono e si cancellano all'uscita dall'account.
const PAGES = 'cca-pagine', DATA = 'cca-dati';
const NO_COPY = ['/api/push/', '/api/auth/check', '/api/auth/token', '/api/ingresso', '/api/client-error', '/api/me/export'];
self.addEventListener('fetch', event => {
 const req = event.request;
 if (req.method !== 'GET') return;
 const url = new URL(req.url);
 if (url.origin !== self.location.origin || NO_COPY.some(p => url.pathname.startsWith(p))) return;
 const store = url.pathname.startsWith('/api/') ? DATA : PAGES;
 event.respondWith(fetch(req).then(res => {
  if (res.ok && res.type === 'basic') { const copy = res.clone(); caches.open(store).then(c => c.put(req, copy)).catch(() => {}); }
  return res;
 }).catch(async () => {
  const hit = await caches.match(req, {ignoreSearch: store === PAGES && !url.pathname.startsWith('/api/')}) || (req.mode === 'navigate' ? await caches.match('/', {ignoreSearch: true}) : null);
  if (hit) return hit;
  return store === DATA ? new Response(JSON.stringify({error: 'Sei offline: questi dati non sono ancora salvati sul telefono.'}), {status: 503, headers: {'Content-Type': 'application/json'}}) : Response.error();
 }));
});
const post = (path, token) => fetch(path, {method: 'POST', credentials: 'same-origin', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({token})});
self.addEventListener('push', event => {
 let data = {};
 try { data = event.data ? event.data.json() : {}; } catch { /* messaggio non valido */ }
 const shown = self.registration.showNotification(data.title || 'CCA SIEMMU', {
  body: data.body || '', icon: 'icon-192.png', badge: 'icon-192.png', tag: data.tag || 'cca',
  actions: Array.isArray(data.actions) ? data.actions.slice(0, 2) : [], data: {url: data.url || '/', token: data.token || '', ref: data.ref || ''}
 });
 // Notifica di prova: il dispositivo avvisa da solo il sito che è arrivata (verifica tecnica, senza bisogno di toccarla).
 const ack = data.token ? post('/api/push/received', data.token).catch(() => {}) : Promise.resolve();
 event.waitUntil(Promise.all([shown, ack]));
});
const openApp = url => self.clients.matchAll({type: 'window', includeUncontrolled: true}).then(list => {
 const target = new URL(url || '/', self.location.origin).href;
 const open = list.find(c => c.url.startsWith(self.location.origin));
 if (!open) return self.clients.openWindow(target);
 // Si avvisa la pagina aperta (più affidabile di navigate, che su alcuni telefoni non funziona) e la si porta in primo piano.
 open.postMessage({type: 'cca-open', url: target});
 return open.focus().catch(() => {});
});
self.addEventListener('notificationclick', event => {
 event.notification.close();
 const {url, token, ref} = event.notification.data || {};
 // Pulsante «Sì, tutto ok»: conferma senza aprire l'app (dove il browser mostra i pulsanti); altrimenti si apre la pagina di conferma.
 if (event.action === 'ok' && token) {
  event.waitUntil(post('/api/push/confirm', token)
   .then(r => r.ok ? self.registration.showNotification('Perfetto!', {body: 'Notifiche verificate. Il tuo Tumazzu è nell’app.', tag: 'cca-prova-ok', icon: 'icon-192.png'}) : openApp(url))
   .catch(() => openApp(url)));
  return;
 }
 // Pulsanti di «Sei ancora in sede?»: la risposta parte senza aprire l'app; se non riesce si apre la pagina con gli stessi pulsanti.
 if ((event.action === 'ancora' || event.action === 'uscito') && ref) {
  event.waitUntil(fetch('/api/sede/risposta', {method: 'POST', credentials: 'same-origin', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({id: Number(ref), answer: event.action})})
   .then(r => r.ok ? self.registration.showNotification(event.action === 'uscito' ? 'Uscita registrata' : 'Va bene, ti lasciamo in sede', {body: event.action === 'uscito' ? 'Grazie! A presto in sede.' : 'Ti richiediamo tra qualche ora.', tag: 'cca-sede', icon: 'icon-192.png'}) : openApp(url))
   .catch(() => openApp(url)));
  return;
 }
 event.waitUntil(openApp(url));
});
