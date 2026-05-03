const activeTimers = new Map();

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'START_TIMER') {
    const { id, description, endTime } = event.data.payload;
    const now = Date.now();
    const delay = Math.max(0, endTime - now);

    // Cancel existing timer for this task if any
    if (activeTimers.has(id)) {
      clearTimeout(activeTimers.get(id));
    }

    const timerId = setTimeout(() => {
      activeTimers.delete(id);
      
      // Check if page is focused. If not, show notification.
      self.clients.matchAll({ type: 'window' }).then((clients) => {
        const isFocused = clients.some(client => client.focused);
        
        if (!isFocused) {
          self.registration.showNotification('Timer Klaar!', {
            body: `Ben je klaar met: ${description}?`,
            icon: '/favicon.svg',
            tag: `timer-${id}`,
            renotify: true,
            requireInteraction: true
          });
        }
      });
    }, delay);

    activeTimers.set(id, timerId);
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        let client = clientList[0];
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].focused) {
            client = clientList[i];
          }
        }
        return client.focus();
      }
      return self.clients.openWindow('/');
    })
  );
});
