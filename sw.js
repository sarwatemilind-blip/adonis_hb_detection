const CACHE='adonis-hb-v2-8';
const ASSETS=['./','./index.html','./manifest.json','./assets/MV30.png','./assets/AMINO-GLOBIN-XT.png','./model.onnx','./model.onnx.data','https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.1/cropper.min.css','https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.1/cropper.min.js','./feature_extractor.js','./eye_app_training_v1/hgb_regressor_image_only.onnx'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));
