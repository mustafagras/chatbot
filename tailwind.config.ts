import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'
import tailwindcssAnimate from 'tailwindcss-animate'

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      container: {
        center: true,
        padding: '2rem',
        screens: {
          '2xl': '1400px',
        },
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        neo: {
          yellow: '#FFE66D',
          pink: '#FF6B9D',
          blue: '#4ECDC4',
          mint: '#A8E6CF',
          orange: '#FF8A5C',
          purple: '#C3A6FF',
          red: '#FF6B6B',
          bg: '#FEF9EF',
          card: '#FFFFFF',
          black: '#1a1a2e',
          border: '#1a1a2e',
          'gray-100': '#F5F5F5',
          'gray-200': '#E5E5E5',
          'gray-300': '#D4D4D4',
          'gray-400': '#A3A3A3',
          'gray-500': '#737373',
          'gray-600': '#525252',
          'gray-700': '#404040',
          'gray-800': '#262626',
          'chat-me': '#FFE66D',
          'chat-other': '#FFFFFF',
          'chat-unread': '#FFF3D4',
        },
      },
      boxShadow: {
        'neo-sm': '2px 2px 0px 0px #1a1a2e',
        neo: '4px 4px 0px 0px #1a1a2e',
        'neo-lg': '6px 6px 0px 0px #1a1a2e',
        'neo-xl': '8px 8px 0px 0px #1a1a2e',
        'neo-inner': 'inset 2px 2px 0px 0px #1a1a2e',
        'neo-none': '0px 0px 0px 0px #1a1a2e',
      },
      borderWidth: {
        neo: '2.5px',
      },
      borderRadius: {
        neo: '0px',
        'neo-sm': '4px',
        'neo-md': '8px',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'neo-xs': ['0.75rem', { lineHeight: '1rem', fontWeight: '600' }],
        'neo-sm': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '600' }],
        'neo-base': ['1rem', { lineHeight: '1.5rem', fontWeight: '600' }],
        'neo-lg': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '700' }],
        'neo-xl': ['1.5rem', { lineHeight: '2rem', fontWeight: '800' }],
        'neo-2xl': ['2rem', { lineHeight: '2.5rem', fontWeight: '900' }],
        'neo-3xl': ['2.5rem', { lineHeight: '3rem', fontWeight: '900' }],
      },
      keyframes: {
        'neo-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'neo-shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' },
        },
        'neo-pop': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '50%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'neo-slide-up': {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'neo-fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'neo-pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.15)' },
        },
      },
      animation: {
        'neo-bounce': 'neo-bounce 0.5s ease-in-out',
        'neo-shake': 'neo-shake 0.4s ease-in-out',
        'neo-pop': 'neo-pop 0.3s ease-out forwards',
        'neo-slide-up': 'neo-slide-up 0.3s ease-out forwards',
        'neo-fade-in': 'neo-fade-in 0.2s ease-out forwards',
        'neo-pulse': 'neo-pulse 1.5s ease-in-out infinite',
      },
      zIndex: {
        999999: '999999',
        99999: '99999',
        9999: '9999',
        999: '999',
        99: '99',
        9: '9',
        8: '8',
        7: '7',
        6: '6',
        5: '5',
        4: '4',
        3: '3',
        2: '2',
        1: '1',
      },
      transitionProperty: {
        neo: 'transform, box-shadow, background-color, border-color',
      },
      transitionDuration: {
        neo: '150ms',
      },
    },
  },
  plugins: [
    tailwindcssAnimate,
    plugin(function ({ addComponents, addBase, addUtilities }) {
      addBase({})
      addComponents({})
      addUtilities({
        '.neo-border': {
          'border-width': '2.5px',
          'border-style': 'solid',
          'border-color': '#1a1a2e',
        },
        '.neo-hover-up': {
          '&:hover': {
            transform: 'translate(-2px, -2px)',
            'box-shadow': '6px 6px 0px 0px #1a1a2e',
          },
          '&:active': {
            transform: 'translate(2px, 2px)',
            'box-shadow': '0px 0px 0px 0px #1a1a2e',
          },
        },
      })
    }),
  ],
}

export default config
