/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        brand: {
          purple: '#8A2387',
          orange: '#F27121',
          salmon: '#E94057',
        },
        overlay: {
          white: 'rgba(255, 255, 255, 0.8)',
        }
      },
      backgroundImage: {
        'gradient-main': 'linear-gradient(to bottom, #F27121, #E94057, #8A2387)',
        'gradient-button-orange': 'linear-gradient(to right, #F27121, #E94057)',
        'gradient-button-pink': 'linear-gradient(to right, #E94057, #8A2387)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
} 