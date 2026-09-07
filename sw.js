// Этот сервис-воркер нужен ТОЛЬКО чтобы iOS видела, что PWA существует,
// но сам он ничего жестко в память не сохраняет. Позволяет сайту обновляться мгновенно.

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Просто пропускаем все запросы напрямую в интернет
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
