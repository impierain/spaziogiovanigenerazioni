// Riceve le notifiche push e apre l'app quando si tocca la notifica.
const post = (path, token) => fetch(path, {method: 'POST', credentials: 'same-origin', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({token})});
self.addEventListener('push', event => {
 let data = {};
 try { data = event.data ? event.data.json() : {}; } catch { /* messaggio non valido */ }
 const shown = self.registration.showNotification(data.title || 'CCA SIEMMU', {
  body: data.body || '', icon: 'icon-192.png', badge: 'icon-192.png', tag: data.tag || 'cca',
  actions: Array.isArray(data.actions) ? data.actions.slice(0, 2) : [], data: {url: data.url || '/', token: data.token || ''}
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
 const {url, token} = event.notification.data || {};
 // Pulsante «Sì, tutto ok»: conferma senza aprire l'app (dove il browser mostra i pulsanti); altrimenti si apre la pagina di conferma.
 if (event.action === 'ok' && token) {
  event.waitUntil(post('/api/push/confirm', token)
   .then(r => r.ok ? self.registration.showNotification('Perfetto!', {body: 'Notifiche verificate. Il tuo Tumazzu è nell’app.', tag: 'cca-prova-ok', icon: 'icon-192.png'}) : openApp(url))
   .catch(() => openApp(url)));
  return;
 }
 event.waitUntil(openApp(url));
});
