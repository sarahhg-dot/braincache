// Brain Cache PWA service worker
const CACHE_NAME = 'brain-cache-v3';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkFetch = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);
      return cached || networkFetch;
    })
  );
});

// IndexedDB helper for queueing notification action intents
function openIntentDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('brain-cache-intents', 1);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('intents')) {
        db.createObjectStore('intents', { keyPath: 'id', autoIncrement: true });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function queueIntent(intent) {
  try {
    const db = await openIntentDB();
    return new Promise((resolve) => {
      const tx = db.transaction('intents', 'readwrite');
      tx.objectStore('intents').add({ ...intent, ts: Date.now() });
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch (e) { /* ignore */ }
}

// Handle clicks on notifications (body or actions)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const taskId = event.notification.data?.taskId;
  const action = event.action || 'open';

  event.waitUntil((async () => {
    // Queue the intent so the page can process it on next load if not currently open
    if (taskId && (action === 'done' || action === 'snooze-1h' || action === 'snooze-tonight')) {
      await queueIntent({ taskId, action });
    }

    const allClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    // Try to message an existing client first
    for (const client of allClients) {
      try {
        client.postMessage({ type: 'notification-action', taskId, action });
        if ('focus' in client) {
          await client.focus();
          return;
        }
      } catch {}
    }
    // No client open — open the app
    if (self.clients.openWindow) {
      await self.clients.openWindow('./');
    }
  })());
});
