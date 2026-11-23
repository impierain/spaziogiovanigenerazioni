// Riceve le notifiche push e apre l'app quando si tocca la notifica.
self.addEventListener('push', event => {
 let data = {};
 try { data = event.data ? event.data.json() : {}; } catch { /* messaggio non valido */ }
 event.waitUntil(self.registration.showNotification(data.title || 'CCA SIEMMU', {
  body: data.body || '', icon: 'icon-192.png', badge: 'icon-192.png', tag: data.tag || 'cca',
  actions: Array.isArray(data.actions) ? data.actions.slice(0, 2) : [], data: {url: data.url || '/', token: data.token || ''}
 }));
});
const openApp = url => self.clients.matchAll({type: 'window', includeUncontrolled: true}).then(list => {
 const target = new URL(url || '/', self.location.origin).href;
 const open = list.find(c => c.url.startsWith(self.location.origin));
 return open ? open.focus().then(c => c.navigate(target)) : self.clients.openWindow(target);
});
self.addEventListener('notificationclick', event => {
 event.notification.close();
 const {url, token} = event.notification.data || {};
 // Pulsante «Sì, tutto ok»: conferma senza aprire l'app (dove il browser mostra i pulsanti); altrimenti si apre la pagina di conferma.
 if (event.action === 'ok' && token) {
  event.waitUntil(fetch('/api/push/confirm', {method: 'POST', credentials: 'same-origin', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({token})})
   .then(r => r.ok ? self.registration.showNotification('Perfetto!', {body: 'Notifiche verificate. Il tuo Tumazzu è nell’app.', tag: 'cca-prova-ok', icon: 'icon-192.png'}) : openApp(url))
   .catch(() => openApp(url)));
  return;
 }
 event.waitUntil(openApp(url));
});
