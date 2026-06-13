/* 西国航路 · Service Worker：核心文件预缓存 + CDN/天气运行时缓存 */
const CORE_CACHE = 'atlas-core-v1';
const RUNTIME_CACHE = 'atlas-runtime-v1';
const CORE = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/icon-180.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CORE_CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CORE_CACHE && k !== RUNTIME_CACHE).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // 同源：缓存优先，导航请求离线回退到 index.html
  if (url.origin === location.origin) {
    e.respondWith(
      caches.match(req).then(hit => hit || fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CORE_CACHE).then(c => c.put(req, copy));
        return res;
      }).catch(() => req.mode === 'navigate' ? caches.match('./index.html') : Promise.reject('offline')))
    );
    return;
  }
  // 天气 API：网络优先，离线回退最近一次缓存
  if (url.hostname.includes('open-meteo.com')) {
    e.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(RUNTIME_CACHE).then(c => c.put(req, copy));
        return res;
      }).catch(() => caches.match(req))
    );
    return;
  }
  // CDN（three / lenis / qrcode / 字体）：stale-while-revalidate
  if (/(cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com|fonts\.googleapis\.com|fonts\.gstatic\.com)$/.test(url.hostname)) {
    e.respondWith(
      caches.match(req).then(hit => {
        const refresh = fetch(req).then(res => {
          const copy = res.clone();
          caches.open(RUNTIME_CACHE).then(c => c.put(req, copy));
          return res;
        }).catch(() => hit);
        return hit || refresh;
      })
    );
  }
});
