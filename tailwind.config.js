// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
  ],
  theme: {
    extend: {
      colors: {
        // Anterior: ivory: '#fffff0',
        // Nuevo: Gray95
        gray95: '#f2f2f2', // Nombre más profesional y descriptivo
        platinum: '#e5e5e5',
      },
    },
  },
  plugins: [],
}