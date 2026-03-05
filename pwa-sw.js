var CACHE = 'cartographers-v1';
var PRECACHE = [
  'index.html',
  'CanvasGame.css',
  'canvasgame/canvasgame.nocache.js',
  'canvasgame/8949A5E1CE8B26CE0F3E947CDFEF7B4A.cache.js',
  'canvasgame/05520DFC4E38655F697E43D4A6BA8891.cache.js',
  'canvasgame/469B7F5DB3239379885A6839A11CDAF5.cache.js',
  'canvasgame/89D2AED60D928748B916190D4BC9B93B.cache.js',
  'canvasgame/968E3374ABB456EE336CC41B06F3E3B0.cache.js',
  'canvasgame/clear.cache.gif',
  'images/bg.jpg',
  'images/icon152.png',
  'images/icon192.png',
  'images/icon512.png'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(PRECACHE);
    }).then(function() { self.skipWaiting(); })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(
        names.filter(function(n) { return n !== CACHE; })
             .map(function(n) { return caches.delete(n); })
      );
    }).then(function() { self.clients.claim(); })
  );
});

// Cache-first, then network fallback (cache anything fetched)
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      if (cached) return cached;
      return fetch(e.request).then(function(resp) {
        if (resp.ok && e.request.method === 'GET') {
          var clone = resp.clone();
          caches.open(CACHE).then(function(cache) { cache.put(e.request, clone); });
        }
        return resp;
      });
    })
  );
});
