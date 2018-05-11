/*global self, caches, fetch*/

const CACHE_NAME = "offline-cache";

self.addEventListener('install', function (event) {
    "use strict";
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll([
                '.',
                './css/core.css',
                './css/exercise.css',
                './css/jungle.css',
                './css/results.css',
                './css/scrollbar.css',
                './css/settings.css',
                './fonts/Amatic-Bold.ttf',
                './fonts/Amatic-Regular.ttf',
                './fonts/Petanque.otf',
                './fonts/Raleway-Bold.ttf',
                './fonts/Raleway-Light.ttf',
                './fonts/Roboto-Black.ttf',
                './html/exercise.html',
                './html/results.html',
                './html/settings.html',
                './images/billboard.svg',
                './images/favicon.ico',
                './images/jungle.svg',
                './images/jungleborder-left.svg',
                './images/jungleborder-right.svg',
                './images/monkey-happy.svg',
                './images/monkey-sad.svg',
                './images/monkey-thinking.svg',
                './images/sea.svg',
                './images/woodenframe.svg',
                './scripts/exercise.js',
                './scripts/keyboard.js',
                './scripts/localsettings.js',
                './scripts/results.js',
                './scripts/serviceworkerinit.js',
                './scripts/settings.js',
                './sound/click.mp3',
                './404.html',
                './error.html',
                './index.html',
                './manifest.json',
                './sw.js',
            ]);
        })
    );
});

self.addEventListener('fetch', function (event) {
    "use strict";
    event.respondWith(
        caches.match(event.request).then(function (response) {
            return response || fetchAndCache(event.request);
        })
    );
});

function fetchAndCache (url) {
    return fetch(url).then(function (response) {
        // Check if we received a valid response
        if (!response.ok) {
            throw Error(response.statusText, url);
        }
    
        return caches.open(CACHE_NAME).then(function (cache) {
            cache.put(url, response.clone());
            return response;
        });
    }).catch(function(error) {
        console.log('Request failed:', error, url);
        // You could return a custom offline 404 page here
    });
}
/*
self.addEventListener('fetch', function (event) {
    "use strict";
    event.respondWith(
        caches.open('offline-cache').then(function (cache) {
            return cache.match(event.request).then(function (response) {
                return response || fetch(event.request).then(function (response) {
                    cache.put(event.request, response.clone());
                    return response;
                });
            });
        })
    );
});*/