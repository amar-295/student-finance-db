/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#14adb8',
        'primary-dark': '#0e8a94',
        secondary: '#4F46E5',
        'secondary-light': '#E0E7FF',
        'background-light': '#f9fafa',
        'background-dark': '#1f242e',
        'text-main': '#111718',
        'text-muted': '#638688',
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['Noto Sans', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        lg: '1rem',
        xl: '1.5rem',
        full: '9999px',
      },
      boxShadow: {
        soft: '0 10px 40px -10px rgba(0, 0, 0, 0.08)',
        glow: '0 0 20px rgba(20, 173, 184, 0.3)',
      },
    },
  },
  plugins: [],
}

