(function() {
  var version         = 'v1::',
      cacheIdentifier = 'static',
      cacheKey        = version + cacheIdentifier;

  var installAssets = [
    '/',
    '/index.html'
  ];

  function cacheInstallAssets() {
    return caches.open().then(function(cache) {
      return cache.addAll(installAssets);
    });
  };

  function cleanCache() {
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(key) {
        return key.indexOf(version) !== 0;
      })).map(function(key) {
        return caches.delete(key);
      });
    });
  };

  self.addEventListener('install', function(event) {
    event.waitUntil(cacheInstallAssets());
  });

  self.addEventListener('activate', function(event) {
    event.waitUntil(cleanCache());
  });

  self.addEventListener('fetch', function(event) {
    var request;
    request = event.request;
    if (request.headers.get('Accept').indexOf('text/html') !== -1) {
      event.respondWith(fetch(request).then(function(response) {
        caches.open(cacheKey).then(function(cache) {
          return cache.put(request, response.clone());
        });
        return response;
      }).catch(function() {
        return caches.match(request).then(function(response) {
          return response;
        });
      }));

      return;
    }

    return event.respondWith(caches.match(request).then(function(response) {
      debugger
      return response || fetch(request, { mode: 'no-cors' });
    }));
  });
})();