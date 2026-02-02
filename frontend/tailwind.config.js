/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-blue': {
          50: '#e6f0ff',
          100: '#b3d1ff',
          200: '#80b3ff',
          300: '#4d94ff',
          400: '#1a75ff',
          500: '#0056e6',
          600: '#0044b3',
          700: '#003380',
          800: '#0a1628',
          900: '#060d17',
          950: '#030810',
        },
        'neon-purple': {
          50: '#f5e6ff',
          100: '#e6b3ff',
          200: '#d480ff',
          300: '#c24dff',
          400: '#b01aff',
          500: '#9900e6',
          600: '#7700b3',
          700: '#550080',
          800: '#33004d',
          900: '#1a0026',
        },
        'cyber': {
          blue: '#00d4ff',
          purple: '#b01aff',
          pink: '#ff1a75',
          green: '#00ff94',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient': 'gradient 8s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 20px #b01aff, 0 0 40px #b01aff, 0 0 60px #b01aff' },
          '100%': { boxShadow: '0 0 30px #00d4ff, 0 0 60px #00d4ff, 0 0 90px #00d4ff' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': 'radial-gradient(ellipse at top, #1a0033 0%, #0a1628 50%, #030810 100%)',
      },
    },
  },
  plugins: [],
}
