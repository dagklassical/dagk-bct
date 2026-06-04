// astro.config.mjs
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  trailingSlash: 'never',
  site: 'https://www.dagklassical.com',
  middleware: './src/middleware.ts',
  integrations: [
    react(),
    tailwind(),
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