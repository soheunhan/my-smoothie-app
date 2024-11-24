import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        green: {
          100: '#7DDE5D',
          200: '#5BAD44',
          300: '#3C732D',
          400: '#274A1D',
          500: '#1C3615',
        },
        lilac: {
          100: '#CEBDF2',
          200: '#AD9FCC',
          300: '#8D81A6',
          400: '#6C6380',
          500: '#4C4659',
        },
      },
      fontFamily: {
        serif: ['var(--font-lekton)'],
        sans: ['var(--font-noto-sans)'],
      },
    },
  },
  plugins: [],
} satisfies Config;
