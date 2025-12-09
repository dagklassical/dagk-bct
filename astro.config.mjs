// astro.config.mjs
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Salida para servidor (necesario si usas API endpoints o VPS)
  output: 'server',
  
  // Adaptador para Node.js (compatible con VPS o serverless)
  adapter: node({
    mode: 'standalone'
  }),

  // Generación automática de sitemap
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.8,
      exclude: ['/privado/*', '/login'], // ajusta según rutas sensibles
    }),
  ],

  // Configuración de Vite (para inyectar variables en build)
  vite: {
    envPrefix: ['MATIC_', 'USDC_', 'TOTAL_', 'LAST_', 'DAG_'],
  },

  // Opcional: si usas assets públicos o ajustes de servidor
  server: {
    port: 4321,
    host: '0.0.0.0', // importante para Docker o VPS
  },
});