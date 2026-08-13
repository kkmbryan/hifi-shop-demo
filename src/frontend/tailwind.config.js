/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        hifi: {
          dark: '#0f172a',
          card: '#1e293b',
          accent: '#d97706', // Gold / Amber audiophile accent
          accentHover: '#b45309',
          gold: '#f59e0b',
          silver: '#94a3b8',
        }
      }
    },
  },
  plugins: [],
}
