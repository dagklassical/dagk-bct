// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://dagkbct.vercel.app',
  output: 'static',
  integrations: [sitemap(), tailwind()],
});