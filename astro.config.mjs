// astro.config.mjs
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  // ✅ Activa Server-Side Rendering (SSR) para rutas dinámicas como /[token]
  //    Las páginas con `prerender = true` se generan estáticamente.
  output: 'server',

  // ✅ Usa el adaptador oficial de Vercel (sin deprecación)
  adapter: vercel(),

  // ✅ Elimina trailing slashes en todas las URLs
  trailingSlash: 'never',

  // ✅ Opcional: si usas Tailwind CSS, asegúrate de que esté bien integrado
  // vite: {
  //   build: {
  //     sourcemap: true,
  //   },
  // },

  // ✅ Si usas contenido estático (noticias, etc.), esto mejora el rendimiento
  //    (no es obligatorio, pero recomendado)
  integrations: [
    // Ejemplo si usas Astro Content Collections:
    // contentCollections(),
  ],
});