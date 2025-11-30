import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  // Integraciones
  integrations: [tailwind()],

  // Opciones de Vite
  vite: {
    // Aumentar timeout y excluir demos del watcher
    server: {
      hmr: { timeout: 120000 },
      watch: {
        timeout: 120000,
        // Ignora la carpeta de demos y archivos grandes
        ignored: [
          '**/public/protected/**',
          '**/node_modules/**',
          '**/dist/**'
        ]
      }
    }
  },

  // Opcional: soporte para otros formatos si los usas
  build: {
    assets: 'assets'
  }
});