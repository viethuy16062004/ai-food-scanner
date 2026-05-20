/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'scan-laser': 'laser 2.5s infinite linear',
      },
      keyframes: {
        laser: {
          '0%, 100%': { top: '0%' },
          '50%': { top: '100%' },
        }
      }
    },
  },
  plugins: [],
}
