// Riceve le notifiche push e apre l'app quando si tocca la notifica.
self.addEventListener('push', event => {
 let data = {};
 try { data = event.data ? event.data.json() : {}; } catch { /* messaggio non valido */ }
 event.waitUntil(self.registration.showNotification(data.title || 'CCA SIEMMU', {body: data.body || '', icon: 'icon.svg', badge: 'icon.svg', tag: data.tag || 'cca', data: {url: data.url || '/'}}));
});
self.addEventListener('notificationclick', event => {
 event.notification.close();
 const url = new URL(event.notification.data?.url || '/', self.location.origin).href;
 event.waitUntil(self.clients.matchAll({type: 'window', includeUncontrolled: true}).then(list => {
  const open = list.find(c => c.url.startsWith(self.location.origin));
  return open ? open.focus().then(c => c.navigate(url)) : self.clients.openWindow(url);
 }));
});
