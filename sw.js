const CACHE_NAME = 'offline-v1';
// Укажите здесь все файлы, которые нужны вашему сайту (css, js, картинки)
const ASSETS = [
  'index.html',
  'manifest.json',
  'icon.png'
];

// Установка: кешируем файлы
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Активация: чистим старый кэш
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
});

// Перехват запросов: сначала ищем в кэше, если нет — берем из сети
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
