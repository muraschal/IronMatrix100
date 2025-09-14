const CACHE = 'im100-v1';
const ASSETS = [
  '/',
  '/manifest.webmanifest',
  '/icon.svg'
];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (url.origin === location.origin && (url.pathname.startsWith('/content') || url.pathname === '/' )) {
    e.respondWith(caches.match(e.request).then((res) => res || fetch(e.request).then((r) => {
      const clone = r.clone();
      caches.open(CACHE).then((cache) => cache.put(e.request, clone));
      return r;
    })));
  }
});
