
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: { sans: ['"Inter"', 'sans-serif'] },
      colors: {
        navy: { 
          900: '#151b2b', // Retour au bleu nuit original
          800: '#1e293b'  // Retour au gris/bleu slate pour les composants
        },
        gold: { 400: '#c5a065', 500: '#b08d55', 600: '#8c6b3a' }
      },
      animation: {
        'in': 'fadeIn 0.5s ease-out forwards',
        'in-up': 'fadeInUp 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        fadeInUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } }
      }
    }
  },
  plugins: [],
}
