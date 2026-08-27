const CACHE_NAME = 'vac-regulations-v7';
const APP_SHELL = ['/', '/index.html', '/manifest.webmanifest', '/favicon.svg', '/offline.html'];

// Install: pre-cache app shell and activate immediately
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

// Activate: clean up ALL old caches and claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => {
              console.log('[SW] Clearing old cache:', key);
              return caches.delete(key);
            })
        )
      )
      .then(() => self.clients.claim())
      .then(() => {
        // Notify all open clients that cache was updated
        return self.clients.matchAll({ type: 'window' }).then((clients) => {
          clients.forEach((client) => {
            client.postMessage({ type: 'CACHE_CLEARED', version: CACHE_NAME });
          });
        });
      })
  );
});

// Listen for messages from client (manual clear cache or skip waiting)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'CLEAR_ALL_CACHES') {
    event.waitUntil(
      caches.keys()
        .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
        .then(() => self.skipWaiting())
        .then(() => {
          if (event.source) {
            event.source.postMessage({ type: 'ALL_CACHES_CLEARED' });
          }
        })
    );
  }
});

// Fetch Strategy:
// 1. Navigation requests (HTML): Network-first with cache fallback to ensure freshest app shell.
// 2. Static Assets (JS/CSS/Vite chunks): Network-first with cache fallback.
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  // Navigation (HTML entry point) -> Always fetch from network to detect new version
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put('/index.html', copy));
          }
          return response;
        })
        .catch(() => caches.match('/index.html').then((response) => response || caches.match('/offline.html')))
    );
    return;
  }

  // Assets (JS, CSS, images, etc.) -> Network-first with fallback to cache for offline support
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (!response || !response.ok || response.type === 'opaque') return response;
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        return response;
      })
      .catch(() => caches.match(request))
  );
});
