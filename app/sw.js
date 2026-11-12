/* トライさくせんボード Service Worker
 * 一度開けば、ネットがなくても開き直せるようにする。
 * - アプリ本体（index.html, sw.js）：先に入れておき、キャッシュから出す。裏で新しいものを取りに行き、次に開いたときに反映する。
 * - 文字の形（Google Fonts）：使ったものだけを、使ったときにキャッシュする。
 * 子どものデータ（名簿・作戦）は localStorage にあり、ここでは扱わない。どこにも送らない。
 * アプリを直したら VERSION を上げること（古いキャッシュが消える）。
 */
var VERSION = 'v10';
var APP_CACHE = 'tryapp-app-' + VERSION;
var FONT_CACHE = 'tryapp-fonts-v1';
var APP_FILES = ['./', './index.html'];
var FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(APP_CACHE).then(function (c) { return c.addAll(APP_FILES); }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) {
        return k.indexOf('tryapp-') === 0 && k !== APP_CACHE && k !== FONT_CACHE;
      }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

function fromCacheThenUpdate(req, cacheName, cacheKey) {
  return caches.open(cacheName).then(function (c) {
    return c.match(cacheKey || req, { ignoreSearch: true }).then(function (hit) {
      var net = fetch(req).then(function (res) {
        if (res && (res.ok || res.type === 'opaque')) c.put(cacheKey || req, res.clone());
        return res;
      });
      if (hit) { net.catch(function () {}); return hit; }
      return net;
    });
  });
}

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);

  // 文字の形：キャッシュにあればそれを使う。なければ取りに行って入れる。
  if (FONT_HOSTS.indexOf(url.hostname) >= 0) {
    e.respondWith(caches.open(FONT_CACHE).then(function (c) {
      return c.match(req).then(function (hit) {
        return hit || fetch(req).then(function (res) {
          if (res && (res.ok || res.type === 'opaque')) c.put(req, res.clone());
          return res;
        });
      });
    }));
    return;
  }

  if (url.origin !== self.location.origin) return;

  // ページを開くとき：いつも index.html をキャッシュから出す（裏で新しいものに入れかえる）。
  if (req.mode === 'navigate') {
    e.respondWith(fromCacheThenUpdate(req, APP_CACHE, './index.html'));
    return;
  }
  e.respondWith(fromCacheThenUpdate(req, APP_CACHE));
});
