const C="gidran-kviz-v16",F=["./","index.html","manifest.json","icon-192.png","icon-512.png","icon-180.png","icon-maskable-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F.map(u=>new Request(u,{cache:"reload"})))));self.skipWaiting()});
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==C).map(n=>caches.delete(n)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=="GET"||u.origin!==location.origin||u.search) return; /* a frissítés-ellenőrzés (?_=) mindig a hálózatra megy */
  e.respondWith((async()=>{
    const c=await caches.open(C);
    const hit=await c.match(r,{ignoreSearch:true});
    const net=fetch(r).then(x=>{if(x&&x.ok)c.put(r,x.clone());return x}).catch(()=>null);
    if(hit){e.waitUntil(net);return hit}
    const x=await net;
    return x||(r.mode==="navigate"?(await c.match("index.html")||await c.match("./")):Response.error());
  })());
});
