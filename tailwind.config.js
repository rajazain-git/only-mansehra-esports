/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#070707',
        secondary: '#111111',
        primary: '#E50914',
        accent: '#FF6A00',
        gold: '#FFD166',
        textMain: '#F5F5F5',
        textMuted: '#8A8A8A',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Teko', 'sans-serif'], // Popular esports font
      },
    },
  },
  plugins: [],
}
