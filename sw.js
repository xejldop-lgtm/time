const CACHE_NAME = 'offline-v3'; // Просто поменяйте цифру
const CACHE_NAME = 'offline-v2'; // Меняйте этот номер (v3, v4...), когда хотите принудительно обновить всех пользователей
const ASSETS = [
  '.',
  'index.html',
  'manifest.json',
  'icon.png'
];

// Установка: кешируем файлы и заставляем новый SW сразу стать активным
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting()) // Пропускаем режим ожидания
  );
});

// Активация: удаляем старый кэш и берем управление страницами
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    }).then(() => self.clients.claim()) // Сразу берем под контроль все открытые вкладки
  );
});

// Стратегия: Сначала кэш для скорости, но параллельно обновляем его из сети в реальном времени
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Создаем запрос в сеть для обновления кэша в фоне
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
          });
        }
        return networkResponse;
      }).catch(() => {
        // Если интернета нет, fetch упадет, но мы просто проигнорируем ошибку
      });

      // Возвращаем то, что нашли в кэше (чтобы сайт открылся мгновенно), 
      // либо дожидаемся сети, если в кэше этого файла еще не было
      return cachedResponse || fetchPromise;
    })
  );
});
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

