const CACHE = 'sip-book-of-presence-v6-2-batch-2-photography';
const CORE = [
  './',
  './index.html',
  './assets/css/styles.css?v=6.1.0',
  './assets/js/app.js?v=6.0.0',
  './assets/img/sip-logo.png',
  './assets/img/promotion-ambient.jpg',
  './assets/img/girls-night-ambient.jpg',
  './assets/img/family-ambient.jpg',
  './assets/data/menu.json',
  './assets/img/01-presence.png',
  './assets/img/02-clarity.png',
  './assets/img/03-legacy.png',
  './assets/img/04-renaissance.png',
  './assets/img/05-the-sovereign.png',
  './assets/img/06-midnight-gold.png',
  './assets/img/07-quiet-authority.png',
  './assets/img/08-afterglow.png',
  './assets/img/09-grounded.png',
  './assets/img/10-provision.png',
  './assets/img/11-green-wisdom.png',
  './assets/img/12-roots-and-reason.png',
  './assets/img/13-first-light.png',
  './assets/img/14-jubilee.png',
  './assets/img/15-golden-hour.png',
  './assets/img/16-celebration.png',
  './assets/img/17-restore.png',
  './assets/img/18-focus.png',
  './assets/img/19-balance.png',
  './assets/img/20-renewal.png',
  './manifest.webmanifest?v=6.1.0'
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
