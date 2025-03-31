import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/image-converter/',
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'WebP Image Converter',
        short_name: 'WebP Converter',
        description: 'Convert images to WebP format online and offline',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff'
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/cdn\.tailwindcss\.com/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'tailwind-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 1 week
              }
            }
          },
          {
            urlPattern: /^https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/jszip/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'jszip-cache',
              expiration: {
                maxEntries: 5,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 1 month
              }
            }
          }
        ]
      }
    })
  ]
});
