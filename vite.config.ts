import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// If you rename the GitHub repo, update `base` to match: '/<repo-name>/'
export default defineConfig({
  base: '/cafe-helper/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192.png', 'icons/icon-512.png'],
      manifest: {
        name: 'Café Helper — Brew Calculator',
        short_name: 'Café Helper',
        description: 'Pour-over and French press brew calculator with a built-in pour timer.',
        start_url: '/cafe-helper/',
        scope: '/cafe-helper/',
        display: 'standalone',
        background_color: '#f4ede0',
        theme_color: '#f4ede0',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      },
    }),
  ],
})
