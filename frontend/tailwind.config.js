/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          DEFAULT: '#2563EB', // blue-600
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          light: '#60A5FA', // blue-400
          dark: '#1D4ED8', // blue-700
        },
        // Dark mode specific colors
        dark: {
          bg: {
            primary: '#0F172A',    // slate-900
            secondary: '#1E293B',  // slate-800
            tertiary: '#334155',   // slate-700
            hover: '#475569',      // slate-600
          },
          text: {
            primary: '#F1F5F9',    // slate-100
            secondary: '#CBD5E1',  // slate-300
            tertiary: '#94A3B8',   // slate-400
          },
          border: {
            primary: '#334155',    // slate-700
            secondary: '#475569',  // slate-600
          }
        },
        secondary: '#64748B', // slate-500
        success: '#22C55E', // green-500
        warning: '#EAB308', // yellow-500
        danger: '#EF4444', // red-500
        background: {
          light: '#F9FAFB', // gray-50
          dark: '#0F172A', // slate-900
        },
        surface: {
          light: '#FFFFFF',
          dark: '#1E293B', // slate-800
        },
        text: {
          main: '#111827', // gray-900
          muted: '#6B7280', // gray-500
          inverted: '#FFFFFF'
        },
        // Legacy support mapping
        'background-light': '#F9FAFB',
        'background-dark': '#0F172A',
        'text-main': '#111827',
        'text-muted': '#6B7280',
        'card-white': '#FFFFFF',
      },
      backgroundColor: {
        'card-light': '#FFFFFF',
        'card-dark': '#1E293B',
      },
      transitionProperty: {
        'colors': 'color, background-color, border-color, text-decoration-color, fill, stroke',
      },
      animation: {
        'theme-transition': 'theme-transition 0.3s ease-in-out',
      },
      keyframes: {
        'theme-transition': {
          '0%': { opacity: '0.8' },
          '100%': { opacity: '1' },
        }
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        soft: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        glow: '0 0 15px rgba(37, 99, 235, 0.3)',
      },
    },
  },
  plugins: [],
}

