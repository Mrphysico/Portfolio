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
        void: {
          950: '#030712',
          900: '#060B18',
          800: '#0B132B',
          700: '#1C2541',
        },
        cyan: {
          glow: '#00f7ff',
          neon: '#0df',
          dim: '#008b94',
        },
        flare: {
          glow: '#ff7700',
          neon: '#ffaa00',
          crimson: '#ff0055',
        },
        singularity: {
          purple: '#a855f7',
          violet: '#7c3aed',
          event: '#ec4899',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Space Grotesk', 'Cabinet Grotesk', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
