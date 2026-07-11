const CACHE = 'sip-book-of-presence-v4-presence-clarity';
const CORE = [
  './',
  './index.html',
  './assets/css/styles.css?v=4.0.0',
  './assets/js/app.js?v=4.0.0',
  './assets/img/sip-logo.png',
  './assets/img/promotion-ambient.jpg',
  './assets/img/girls-night-ambient.jpg',
  './assets/img/family-ambient.jpg',
  './assets/data/menu.json',
  './manifest.webmanifest?v=4.0.0'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)));
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

async function networkFirst(request) {
  const cache = await caches.open(CACHE);
  try {
    const fresh = await fetch(request, { cache: 'no-store' });
    if (fresh && fresh.ok) cache.put(request, fresh.clone());
    return fresh;
  } catch (_) {
    return (await cache.match(request)) || (request.mode === 'navigate' ? cache.match('./index.html') : Response.error());
  }
}

async function imageCache(request) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request);
  const update = fetch(request).then(response => {
    if (response && response.ok) cache.put(request, response.clone());
    return response;
  }).catch(() => null);
  return cached || update || Response.error();
}

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  if (event.request.destination === 'image') {
    event.respondWith(imageCache(event.request));
    return;
  }
  event.respondWith(networkFirst(event.request));
});
