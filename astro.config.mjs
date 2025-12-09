// astro.config.mjs
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  // ✅ Dominio base para sitemap, OpenGraph y enlaces absolutos
  site: 'https://dagkbct.vercel.app',

  // ✅ Modo estático (obligatorio para Vercel)
  output: 'static',

  // ✅ Integraciones
  integrations: [
    tailwind(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.8,
      // ✅ Usa 'filter' en lugar de 'exclude' (sintaxis actual de @astrojs/sitemap)
      filter: (page) => !page.startsWith('/privado') && !page.startsWith('/login'),
    }),
  ],
});