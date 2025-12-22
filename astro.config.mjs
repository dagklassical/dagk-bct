// astro.config.mjs
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  // Activa Server-Side Rendering (necesario para rutas dinámicas como /[token])
  output: 'server',
  
  // Usa el adapter oficial de Vercel para SSR
  adapter: vercel(),

  // Opcional: mejora el manejo de rutas
  trailingSlash: 'never',

  // Si usas variables de entorno, las puedes cargar aquí
  // vite: {
  //   envDir: '.'
  // }
});