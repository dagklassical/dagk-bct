// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // 🔑 Añade esta línea (reemplaza con tu dominio real)
  site: 'https://dagkbct.vercel.app',

  integrations: [
    tailwind(),
    sitemap()
  ],

  vite: {
    server: {
      hmr: { timeout: 120000 },
      watch: {
        timeout: 120000,
        ignored: [
          '**/public/protected/**',
          '**/node_modules/**',
          '**/dist/**'
        ]
      }
    }
  },

  build: {
    assets: 'assets'
  }
});