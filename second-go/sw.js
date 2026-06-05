const CACHE_NAME = 'melodify-v1';
const ASSETS = [
  './index.html',
  './styles.css',
  './script.js',
  './manifest.json'
];

// Install Service Worker and cache core files
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Serve cached content when offline
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});