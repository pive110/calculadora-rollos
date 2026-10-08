
const CACHE_NAME = 'label-roll-calculator-v2';

const APP_SHELL = [
  './',
  './index.html',
  './manifest.json'
];

// INSTALACIÓN
self.addEventListener('install', (event) => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL);
    })
  );
});

// ACTIVACIÓN Y LIMPIEZA DE CACHÉ
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();

      await Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );

      await self.clients.claim();
    })()
  );
});

// ACTUALIZACIÓN AUTOMÁTICA
self.addEventListener('fetch', (event) => {
  const request = event.request;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) return;

  // HTML: consultar siempre la versión publicada
  if (
    request.mode === 'navigate' ||
    url.pathname.endsWith('/index.html')
  ) {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(request, {
            cache: 'no-store'
          });

          if (response.ok) {
            const cache = await caches.open(CACHE_NAME);

            await cache.put(
              request,
              response.clone()
            );
          }

          return response;
        } catch (error) {
          return (
            (await caches.match(request)) ||
            (await caches.match('./index.html')) ||
            Response.error()
          );
        }
      })()
    );

    return;
  }

  // Otros archivos: usar caché o red
  event.respondWith(
    caches.match(request).then((cached) => {
      return cached || fetch(request);
    })
  );
});
