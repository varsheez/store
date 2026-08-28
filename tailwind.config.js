/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        themeBg: '#FFF5F7',
        cardBg: '#FFFFFF',
        brandPink: '#FF2A7A',
        brandGreen: '#00C853',
      },
    },
  },
  plugins: [],
}
