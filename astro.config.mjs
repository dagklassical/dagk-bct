// astro.config.mjs
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  // ✅ Modo estático (obligatorio para Vercel)
  output: 'static',

  // ✅ Integraciones
  integrations: [
    tailwind(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.8,
      exclude: ['/privado/*', '/login'],
    }),
  ],
});