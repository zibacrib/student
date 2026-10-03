const CACHE_NAME = 'zibacrib-cache-v1';
const urlsToCache = [
    '/'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    // Only cache GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .catch(() => caches.match(event.request))
    );
});
