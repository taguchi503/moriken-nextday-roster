const CACHE='moriken-nextday-v0.1.1';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'];
const URLs=new Set(ASSETS.map(path=>new URL(path,self.registration.scope).href));
self.addEventListener('install',e=>e.waitUntil((async()=>{const c=await caches.open(CACHE);await c.addAll(ASSETS.map(p=>new Request(new URL(p,self.registration.scope),{cache:'reload'})));await self.skipWaiting()})()));
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET'||!URLs.has(e.request.url))return;
 e.respondWith((async()=>{const c=await caches.open(CACHE);try{const response=await fetch(e.request,{cache:'no-store'});if(response.ok){await c.put(e.request,response.clone());return response}const old=await c.match(e.request);return old||response}catch(err){const old=await c.match(e.request);if(old)return old;throw err}})());
});
