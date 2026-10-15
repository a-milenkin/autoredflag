import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#14161A', soft: '#5B6070', faint: '#8A90A0' },
        line: '#E7E9EE',
        paper: '#F5F6F8',
        mist: '#F1F2F4',
        flag: { DEFAULT: '#E5372F', dark: '#C42A23', soft: '#FDECEB' },
        warn: { DEFAULT: '#E08A00', soft: '#FFF4E0' },
        ok: { DEFAULT: '#1F9D55', soft: '#E7F6EE' },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      borderRadius: { xl2: '1.25rem' },
      maxWidth: { page: '76rem' },
    },
  },
  plugins: [],
};
export default config;
