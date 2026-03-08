/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        income: '#16a34a',
        expense: '#ef4444',
        reserve: '#0ea5e9',
        trust: '#1e3a8a'
      }
    }
  },
  plugins: []
};
