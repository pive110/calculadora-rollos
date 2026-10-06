const CACHE_NAME = "label-roll-calculator-v2";

const ARCHIVOS = [
    "./",
    "./index.html",
    "./manifest.json",
    "./icon-180.png",
    "./icon-512.png"
];

self.addEventListener("install", function(event) {

    event.waitUntil(

        caches.open(CACHE_NAME).then(function(cache) {

            return cache.addAll(ARCHIVOS);

        })

    );

});

self.addEventListener("fetch", function(event) {

    event.respondWith(

        caches.match(event.request).then(function(response) {

            return response || fetch(event.request);

        })

    );

});
