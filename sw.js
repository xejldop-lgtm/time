const CACHE_NAME = 'offline-final';
const ASSETS = [
  '.',
  'index.html',
  'manifest.json',
  'icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((key) => { if (key !== CACHE_NAME) return caches.delete(key); })
    )).then(() => self.clients.claim())
  );
});

// СТРАТЕГИЯ: Сначала сеть, если сети нет — берем из кэша
self.addEventListener('fetch', (event) => {
  // Проверяем только обычные запросы (GET)
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Если сеть ответила успешно, обновляем кэш свежим файлом
        if (networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Если интернета нет (ошибка сети), достаем файл из кэша
        return caches.match(event.request);
      })
  );
});
