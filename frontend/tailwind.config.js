/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'floral-pink': '#FFB6C1',
        'lavender': '#E6E6FA',
        'mint-green': '#98FB98',
        'sunshine-yellow': '#FFFF99',
        'rose-gold': '#F4C2C2',
        'butterfly-blue': '#87CEEB',
        'petal-white': '#FFF8F8',
        'bee-gold': '#FFD700',
        'leaf-green': '#90EE90',
        'violet': '#8A2BE2'
      },
      fontFamily: {
        'heading': ['Georgia', 'serif'],
        'body': ['Inter', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'butterfly': 'butterfly 4s ease-in-out infinite',
        'bloom': 'bloom 0.6s ease-out',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        butterfly: {
          '0%, 100%': { transform: 'translateX(0px) rotate(0deg)' },
          '25%': { transform: 'translateX(10px) rotate(5deg)' },
          '75%': { transform: 'translateX(-10px) rotate(-5deg)' },
        },
        bloom: {
          '0%': { transform: 'scale(0.8) rotate(-10deg)', opacity: '0' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0', transform: 'scale(0)' },
          '50%': { opacity: '1', transform: 'scale(1)' },
        }
      }
    },
  },
  plugins: []
}