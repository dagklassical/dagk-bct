// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte,md,mdx}",
    "./public/**/*.html"
  ],
  theme: {
    extend: {
      fontSize: {
        'h1': ['3.2rem', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['2.4rem',   { lineHeight: '1.25', fontWeight: '700' }],
        'h3': ['1.6rem', { lineHeight: '1.3', fontWeight: '700' }],
      },
      colors: {
        gray95: '#f2f2f2',
        platinum: '#e5e5e5',
        'dag-black': '#000000',
        'dag-burgundy': '#800020',
      },
    },
    fontFamily: {
      advent: ['"Advent Pro"', 'sans-serif'],
      // Montserrat seguirá siendo la fuente por defecto para el cuerpo
    },
  },
  plugins: [],
}