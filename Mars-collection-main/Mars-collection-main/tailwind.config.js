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
        gold: {
          light: '#F3E5AB',
          DEFAULT: '#D4AF37', // Gold Accent
          dark: '#AA7C11',
          muted: '#C5A880',
        },
        beige: {
          50: '#FAF9F6', // Off White/Alabaster
          100: '#F5F5F0', // Light Beige
          200: '#EAEAE0', // Medium Beige
          300: '#D1C7BD',
          DEFAULT: '#C5A880',
        },
        luxury: {
          black: '#0A0A0A', // Soft rich black
          charcoal: '#1A1A1A',
          border: '#2A2A2A',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Playfair Display', 'serif'],
        sans: ['"Outfit"', 'Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'slide-down': 'slideDown 0.4s ease-out forwards',
        'pulse-subtle': 'pulseSubtle 2s infinite ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        }
      }
    },
  },
  plugins: [],
}
