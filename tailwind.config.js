/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neu-bg': '#e6ecf5',
        'neu-text': '#2d3748',
        'neu-muted': '#718096',
        'neu-primary': '#3b82f6',
        'neu-success': '#10b981',
        'neu-danger': '#ef4444',
        'neu-warning': '#f59e0b',
        'neu-info': '#06b6d4',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      }
    },
  },
  plugins: [],
}