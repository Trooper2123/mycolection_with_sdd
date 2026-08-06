/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f7fa',
          100: '#eaeef4',
          200: '#d0daf2',
          300: '#a7bcff',
          400: '#7594ff',
          500: '#4365f5',
          600: '#2b44d9',
          700: '#2032b3',
          800: '#1e2c91',
          900: '#1b2675',
          950: '#101747',
        }
      }
    },
  },
  plugins: [],
}
