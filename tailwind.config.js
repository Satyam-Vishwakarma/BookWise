/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E88E5',
        action: '#43A047',
        accent: '#FFD166',
        neutral: {
          dark: '#0F1724',
          mid: '#6B7280',
        },
        hero: {
          light: '#F5FAFF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite linear',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      transitionDuration: {
        'micro': '180ms',
        'medium': '320ms',
        'large': '600ms',
      },
    },
  },
  plugins: [],
}