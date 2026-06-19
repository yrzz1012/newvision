import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#ffffff',
          secondary: '#f5f5f7',
          tertiary: '#fafafa',
        },
        glass: {
          DEFAULT: 'rgba(255, 255, 255, 0.72)',
          hover: 'rgba(255, 255, 255, 0.92)',
          border: 'rgba(0, 0, 0, 0.06)',
          focus: 'rgba(0, 0, 0, 0.12)',
        },
        text: {
          primary: '#1d1d1f',
          secondary: '#6e6e73',
          tertiary: '#aeaeb2',
        },
        accent: {
          DEFAULT: '#2759cd',
          hover: '#1e4ab5',
          light: 'rgba(39, 89, 205, 0.10)',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', "'SF Pro Display'", "'Segoe UI'", 'Roboto', 'sans-serif'],
      },
      backdropBlur: { glass: '24px' },
      borderRadius: { '2xl': '16px', '3xl': '24px' },
      boxShadow: {
        glow: '0 0 0 1px rgba(39,89,205,0.12), 0 4px 24px rgba(0,0,0,0.04), 0 0 80px rgba(39,89,205,0.08)',
        card: '0 1px 3px rgba(0,0,0,0.04)',
        cardHover: '0 16px 48px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.03), 0 0 0 1px rgba(39,89,205,0.08)',
      },
      animation: {
        shimmer: 'shimmer 1.5s ease-in-out infinite',
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.4,0,0.2,1)',
      },
      keyframes: {
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};

export default config;
