/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./index.tsx",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          400: '#38bdf8',
          500: '#1392ec',
          600: '#0284c7',
          700: '#0369a1',
          900: '#0c2340',
        },
        slate: {
          850: '#16222d',
          900: '#101a22',
        }
      }
    },
  },
  darkMode: 'class',
  plugins: [],
}
