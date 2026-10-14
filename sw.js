
const C="gidran-kviz-v12";
const A=["./","./index.html","./manifest.json","./icon-192.png","./icon-512.png","./icon-180.png","./icon-maskable-512.png","./hajtaslanc.jpg","./motor-hutorendszer.jpg"];

self.addEventListener("install",e=>{
  e.waitUntil(
    caches.open(C).then(c=>c.addAll(A))
  );
  self.skipWaiting();
});

self.addEventListener("activate",e=>{
  e.waitUntil(
    caches.keys().then(keys=>
      Promise.all(keys.filter(k=>k!==C).map(k=>caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET") return;
  e.respondWith(
    caches.match(e.request).then(cached=>{
      if(cached) return cached;
      return fetch(e.request).then(response=>{
        if(response && response.ok && new URL(e.request.url).origin===self.location.origin){
          const copy=response.clone();
          caches.open(C).then(c=>c.put(e.request,copy));
        }
        return response;
      });
    })
  );
});
