// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte,md,mdx}",
    "./public/**/*.html"
  ],
  theme: {
    extend: {
      colors: {
        gray95: '#f2f2f2',
        platinum: '#e5e5e5',
        // Nuevos colores corporativos
        'dag-black': '#000000',
        'dag-burgundy': '#800020', // o el código exacto que uses
      },
    },
    fontFamily: {
      advent: ['"Advent Pro"', 'sans-serif'],
    },
  },
  plugins: [],
}