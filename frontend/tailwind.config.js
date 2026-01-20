/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2eb8b5',
        'primary-dark': '#259694',
        secondary: '#4F46E5',
        'secondary-light': '#E0E7FF',
        'background-light': '#f6f8f8',
        'background-dark': '#131f1f',
        'text-main': '#101919',
        'text-muted': '#578e8d',
        'slate-text-main': '#1e293b',
        'slate-text-muted': '#64748b',
        'accent-coral': '#F27B66',
        'accent-pink': '#F56B9E',
        'card-white': '#FFFFFF',
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

