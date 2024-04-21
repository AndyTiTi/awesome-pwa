// service-worker.js

// Service Worker 缓存名称(版本号)
const CACHE_NAME = "my-site-cache-v3";

// 需要缓存的资源
const urlsToCache = [
  "./index.html",
  "./index.css",
  // Font Awesome的CSS
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css",
  // 如果Font Awesome的CSS文件已经下载，可以将其添加到缓存中以便离线使用
  // 注意，由于跨域问题，只有从HTTPS或本地服务器提供的资源才能被Service Worker缓存
  // 如果Font Awesome的CDN不支持Service Worker缓存，您可能需要下载文件并托管在您的服务器上
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/webfonts/fa-brands-400.woff2", // 字体文件，同上
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/webfonts/fa-regular-400.woff2",
  // 其他需要缓存的文件...
];

// 设置缓存的最大存活时间（单位：秒）
const MAX_AGE_SECONDS = 24 * 60 * 60; // 24 hours
// const MAX_AGE_SECONDS = 10; // 24 hours

console.log("self", self);

self.addEventListener('install', function (event) {
  console.log('install');
  event.waitUntil(
    // 这里可以做一些缓存的操作
    // 注意：event.waitUntil不要乱用，它会阻塞浏览器的安装，如果你的Promise对象一直没有完成，那么浏览器就会一直处于安装的状态，这样会影响到浏览器的正常使用。
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// 更新事件 (更改 Service Worker 缓存版本号 触发)
// 当新的 Service Worker 激活时，清理旧缓存
self.addEventListener("activate", (event) => {
  console.log("activate--event", event);
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      console.log("cacheNames", cacheNames);
      return Promise.all(
        // cacheNames.map((cacheName) => {
        //   // 删除旧版本缓存
        //   if (cacheName !== CACHE_NAME) {
        //     return caches.delete(cacheName);
        //   }
        // })
        cacheNames
          .filter((cacheName) => {
            // 过滤出需要更新的缓存名称
            return (
              cacheName.startsWith("my-site-cache-") && cacheName !== CACHE_NAME
            );
          })
          .map((cacheName) => {
            return caches.delete(cacheName); // 删除旧版本的缓存
          })
      );
    })
  );
});

// 拦截请求并返回缓存或网络请求
self.addEventListener("fetch", (event) => {
  console.log("fetch--event", event.request.url);
  // 检查请求的 URL 或其他属性，判断是否为特殊请求（如来自 Chrome 扩展程序的请求）
  if (event.request.url.startsWith("chrome-extension://")) {
    // 如果是特殊请求，可以选择直接返回，不继续处理
    return;
  }

  // 对于非特殊请求，继续执行缓存策略
  // event.respondWith() 拦截网络请求并提供自定义响应
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        const ageInSeconds =
          (Date.now() -
            new Date(cachedResponse.headers.get("date")).getTime()) /
          1000;
        console.log("ageInSeconds", ageInSeconds, MAX_AGE_SECONDS);
        if (ageInSeconds < MAX_AGE_SECONDS) {
          return cachedResponse;
        }
      }

      // 超过缓存时间后，重新请求资源，并更新缓存
      return fetch(event.request).then((response) => {
        console.log("puting", response.url);
        if (response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      });
    })
  );
});