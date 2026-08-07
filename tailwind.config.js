/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          lime: '#E2FF6F',      // Gen Z electric lime
          neon: '#C5F92C',      // Vibrant green-lime
          orange: '#FF5500',    // Cyber orange
          purple: '#9D4EDD',    // Electric violet
          dark: '#0A0A0C',      // Ultra dark onyx
          card: '#141417',      // Dark card surface
          cardBorder: '#26262B',// Sleek border
          lightCard: '#FFFFFF',
          lightBg: '#F4F4F6',
          lightBorder: '#E5E5EB'
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'glow-lime': '0 0 25px -5px rgba(226, 255, 111, 0.4)',
        'glow-orange': '0 0 25px -5px rgba(255, 85, 0, 0.4)',
        'glow-sm': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
        'float': '0 12px 32px -8px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-light': 'bounce 2s infinite',
        'shimmer': 'shimmer 2s infinite linear',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
