// astro.config.mjs
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'server', // ← Mantener 'server' (única opción válida en Astro 3.x)
  adapter: vercel(),
  trailingSlash: 'never',
  site: 'https://www.dagklassical.com',
  integrations: [
    sitemap({
      filter: (page) => 
        !page.includes('test') && 
        !page.includes('preview') &&
        !page.includes('store/reservar') &&
        !page.includes('api/'),
      customPages: [
        'https://www.dagklassical.com/blockchain',
        'https://www.dagklassical.com/blockchain/music-cards',
        'https://www.dagklassical.com/contacto',
        'https://www.dagklassical.com/inversion'
      ]
    })
  ],
  vite: {
    build: {
      sourcemap: true,
    },
  },
});