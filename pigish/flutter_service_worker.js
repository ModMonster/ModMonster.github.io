'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "9e00a8bf2324d921e2fad98b2be0e5ea",
"assets/assets/bagel_song.mp3": "c0f031e7851ee23ef917ffda2fd6ce61",
"assets/assets/goat_scream.mp3": "83481b3bef2d5c82ee43e202a89d7e5c",
"assets/assets/loader.gif": "6985bf9baf0391a51935fda58c5b2213",
"assets/assets/logo.png": "124d302686658a3a05c5b81c4ddb7bef",
"assets/assets/logo_round.png": "6f7d20afa275f349ac8a8c5a73f6866b",
"assets/assets/luigi_dance.gif": "21d1abf9acd673a6d904c4da09de7965",
"assets/assets/pig.png": "ee43788de3be2eb868c22a73f31d4143",
"assets/assets/pig_song.mp3": "37501ad77f688d545b119b7213e52b57",
"assets/assets/smarie_secret/bird.png": "d6863bedccaadf774fb836b8dc29f8cc",
"assets/assets/smarie_secret/nobirdiecame.ogg": "6f4439384d780f514148929e6627eefa",
"assets/assets/smarie_secret/smarie_dance_song.ogg": "ee35ac5db639805ff270cff91551475d",
"assets/assets/smarie_secret/tired.wav": "03f0acdbc36df0afca283dc5658f7586",
"assets/FontManifest.json": "7b2a36307916a9721811788013e65289",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"assets/NOTICES": "38894ef610f26377323e7e3797c346cc",
"favicon.png": "6f7d20afa275f349ac8a8c5a73f6866b",
"icons/Icon-192.png": "7224e4b3b55dccdbefda4c4aef400ed4",
"icons/Icon-512.png": "6f7d20afa275f349ac8a8c5a73f6866b",
"icons/Icon-maskable-192.png": "7224e4b3b55dccdbefda4c4aef400ed4",
"icons/Icon-maskable-512.png": "6f7d20afa275f349ac8a8c5a73f6866b",
"index.html": "a3ded889b364ced4c7b9ed0301b06558",
"/": "a3ded889b364ced4c7b9ed0301b06558",
"main.dart.js": "d37002f95e624a7112b707af380fe89c",
"manifest.json": "669cea889cabec49dbef578f44d8d71a",
"splash/img/dark-1x.png": "9254742d08e508d987014044315fe2ca",
"splash/img/dark-2x.png": "e18df857b65916ef8fbd14ae14d4413f",
"splash/img/dark-3x.png": "e285f19f137704e6efe9e3bb480b305f",
"splash/img/dark-4x.png": "f9a568e15d50d0cd6224f3309bf0d99e",
"splash/img/light-1x.png": "9254742d08e508d987014044315fe2ca",
"splash/img/light-2x.png": "e18df857b65916ef8fbd14ae14d4413f",
"splash/img/light-3x.png": "e285f19f137704e6efe9e3bb480b305f",
"splash/img/light-4x.png": "f9a568e15d50d0cd6224f3309bf0d99e",
"splash/splash.js": "c6a271349a0cd249bdb6d3c4d12f5dcf",
"splash/style.css": "aa5b47b5a0391f00a008a9b0fdaee9ef",
"version.json": "2f86ec66cb196bdddc1e2258865d16f7"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
