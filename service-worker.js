const CACHE='moriken-nextday-v0.2.0';
const ICONS=['./icons/icon-192.png','./icons/icon-512.png','./icons/icon-maskable-512.png'];
const ASSETS=['./','./index.html','./manifest.webmanifest',...ICONS,...ICONS.map(p=>p+'?v=0.2.0')];
const URLs=new Set(ASSETS.map(path=>new URL(path,self.registration.scope).href));
const imagePaths=new Set(ICONS.map(path=>new URL(path,self.registration.scope).origin+new URL(path,self.registration.scope).pathname));
self.addEventListener('install',e=>e.waitUntil((async()=>{const c=await caches.open(CACHE);await c.addAll(ASSETS.map(p=>new Request(new URL(p,self.registration.scope),{cache:'reload'})));await self.skipWaiting()})()));
self.addEventListener('activate',e=>e.waitUntil((async()=>{
 for(const name of await caches.keys()){
  if(!name.startsWith('moriken-nextday-')||name===CACHE)continue;
  const cache=await caches.open(name);
  for(const request of await cache.keys()){
   const u=new URL(request.url);if(imagePaths.has(u.origin+u.pathname))await cache.delete(request);
  }
 }
 await self.clients.claim();
})()));
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET'||!URLs.has(e.request.url))return;
 e.respondWith((async()=>{const c=await caches.open(CACHE);try{const response=await fetch(e.request,{cache:'no-store'});if(response.ok){await c.put(e.request,response.clone());return response}const old=await c.match(e.request);return old||response}catch(err){const old=await c.match(e.request);if(old)return old;throw err}})());
});
