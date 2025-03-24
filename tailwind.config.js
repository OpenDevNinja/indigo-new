// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Active le mode sombre via la classe 'dark'
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8E3088',
          50: '#F0D9EF',
          100: '#E6C0E4',
          200: '#D39DCE',
          300: '#C079B8',
          400: '#A75AA2',
          500: '#8E3088', // Votre couleur principale
          600: '#752870',
          700: '#5C2058',
          800: '#431840',
          900: '#291028',
          950: '#1C0A1C',
        },
      },
      screens: {
        'xs': '475px',
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
        display: ['Montserrat', 'sans-serif'],
      },
      fontSize: {
        '2xs': '0.65rem',
      },
      boxShadow: {
        'custom': '0 4px 20px rgba(0, 123, 255, 0.2)',
        'hover': '0 8px 30px rgba(0, 123, 255, 0.3)',
      },
      animation: {
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'slide-in-bottom': 'slide-in-bottom 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'slide-in-bottom': {
          '0%': { transform: 'translateY(50px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-tech': 'linear-gradient(135deg, #007BFF 0%, #00D4FF 100%)',
      },
      gridTemplateColumns: {
        'responsive': 'repeat(auto-fit, minmax(300px, 1fr))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}