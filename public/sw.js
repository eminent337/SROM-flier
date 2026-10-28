const CACHE_NAME = 'srom-flyer-pwa-v7';
const PRECACHE_ASSETS = [
  '/',
  '/?app=srom-mobile-v5',
  '/index.html',
  '/manifest.webmanifest',
  '/icon.svg',
  '/apple-touch-icon.png',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/pwa-maskable-512x512.png',
  '/assets/aistudio/srom_clean_template.png',
  '/assets/aistudio/image_ac3cca0a.png',
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) =>
        Promise.allSettled(
          PRECACHE_ASSETS.map((url) =>
            fetch(url, { credentials: 'same-origin' }).then((res) => {
              if (res.ok) return cache.put(url, res);
              return Promise.resolve();
            })
          )
        )
      )
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
          return Promise.resolve();
        })
      );
      await self.clients.claim();
    })()
  );
});

// Network-First strategy: always load fresh content when online, fallback to cache when offline
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Bypass Vite internal module paths
  if (url.pathname.startsWith('/@') || url.pathname.startsWith('/node_modules/')) {
    return;
  }

  // Always fetch live API responses directly
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(req));
    return;
  }

  event.respondWith(
    fetch(req)
      .then((networkRes) => {
        if (networkRes && networkRes.status === 200 && url.origin === self.location.origin) {
          const clone = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone)).catch(() => {});
        }
        return networkRes;
      })
      .catch(async () => {
        const cached = await caches.match(req);
        if (cached) return cached;
        if (req.mode === 'navigate') {
          const rootCached = (await caches.match('/')) || (await caches.match('/index.html'));
          if (rootCached) return rootCached;
        }
        return new Response('Offline', { status: 503, statusText: 'Offline' });
      })
  );
});
