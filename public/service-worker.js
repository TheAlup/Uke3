const CACHE_NAME = "deck-app-cache-v1";
const urlsToCache = [
    "/",
    "/index.html",
    "/script.js",
    "/manifest.json",
];

// Install event - caches assets
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
});

// Fetch event - serves files from cache
self.addEventListener("fetch", (event) => {
    if (event.request.url.includes("/api/")) {
        return; // Ignore API requests
    }

    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

// Activate event - clears old caches
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            );
        })
    );
});
