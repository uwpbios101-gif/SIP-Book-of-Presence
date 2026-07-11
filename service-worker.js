const CACHE = 'sip-book-of-presence-v2-presence';
const ASSETS = [
  './',
  './index.html',
  './assets/css/styles.css',
  './assets/js/app.js',
  './assets/data/menu.json',
  './assets/img/sip-logo.png',
  './assets/img/promotion-ambient.jpg',
  './assets/img/girls-night-ambient.jpg',
  './assets/img/family-ambient.jpg',
  './assets/img/icon-192.png',
  './assets/img/icon-512.png',
  './manifest.webmanifest'
];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    const copy = response.clone(); caches.open(CACHE).then(cache => cache.put(event.request, copy)); return response;
  }).catch(() => caches.match('./index.html'))));
});
