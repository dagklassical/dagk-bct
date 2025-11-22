// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte,md,mdx}",
    "./public/**/*.html" // Si usas HTML en public
  ],
  theme: {
    extend: {
      colors: {
        gray95: '#f2f2f2',
        platinum: '#e5e5e5',
      },
    },
  },
  plugins: [],
}