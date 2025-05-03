/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // enables class-based dark mode (controlled manually)
  theme: {
    extend: {
      colors: {
        // Optional: your custom colors
        primary: '#4f46e5',
        background: '#f9fafb',
        darkBackground: '#111827',
      },
    },
  },
  plugins: [],
}
