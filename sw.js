if(!self.define){let e,n={};const s=(s,i)=>(s=new URL(s+".js",i).href,n[s]||new Promise((n=>{if("document"in self){const e=document.createElement("script");e.src=s,e.onload=n,document.head.appendChild(e)}else e=s,importScripts(s),n()})).then((()=>{let e=n[s];if(!e)throw new Error(`Module ${s} didn’t register its module`);return e})));self.define=(i,t)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(n[c])return;let r={};const o=e=>s(e,c),a={module:{uri:c},exports:r,require:o};n[c]=Promise.all(i.map((e=>a[e]||o(e)))).then((e=>(t(...e),r)))}}define(["./workbox-74f2ef77"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-CE1ra2OV.js",revision:null},{url:"index.html",revision:"4dd7a88eaec4091cfe9f2a1cf7b6d8d7"},{url:"registerSW.js",revision:"637c267b25969a39c37ffa76a9d3280b"},{url:"manifest.webmanifest",revision:"515f35c84a36568aab858ac944c2ae36"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html"))),e.registerRoute(/^https:\/\/cdn\.tailwindcss\.com/,new e.CacheFirst({cacheName:"tailwind-cache",plugins:[new e.ExpirationPlugin({maxEntries:10,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/^https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/jszip/,new e.CacheFirst({cacheName:"jszip-cache",plugins:[new e.ExpirationPlugin({maxEntries:5,maxAgeSeconds:2592e3})]}),"GET")}));
