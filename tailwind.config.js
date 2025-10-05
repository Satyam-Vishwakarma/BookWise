/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
        },
        action: 'var(--color-action)',
        accent: 'var(--color-accent)',
        neutral: {
          dark: 'var(--color-neutral-dark)',
          mid: 'var(--color-neutral-mid)',
        },
        hero: {
          light: 'var(--color-bg-hero)',
        },
        border: 'var(--color-border)',
      },
      backgroundColor: {
        'hero-light': 'var(--color-bg-hero)',
        'card': 'var(--color-bg-card)',
        'body': 'var(--color-bg-body)',
      },
      textColor: {
        primary: 'var(--color-primary)',
        'neutral-dark': 'var(--color-neutral-dark)',
        'neutral-mid': 'var(--color-neutral-mid)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite linear',
        'pulse-subtle': 'pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
        },
      },
      transitionDuration: {
        'micro': '180ms',
        'medium': '320ms',
        'large': '600ms',
      },
      boxShadow: {
        'card': 'var(--shadow-sm)',
        'card-hover': 'var(--shadow-md)',
      },
    },
  },
  plugins: [
    function({ addBase, theme }) {
      addBase({
        ':root': {
          '--color-primary-opacity-90': 'rgba(var(--color-primary-rgb), 0.9)',
          '--color-primary-opacity-50': 'rgba(var(--color-primary-rgb), 0.5)',
          '--color-action-opacity-90': 'rgba(var(--color-action-rgb), 0.9)',
          '--color-action-opacity-50': 'rgba(var(--color-action-rgb), 0.5)',
        },
      });
    },
  ],
  safelist: [
    'hover:bg-primary-hover',
    'focus:ring-primary',
    'focus:border-primary',
    'hover:bg-action-hover',
    'focus:ring-action',
  ],
}