import { Caprasimo, Noto_Sans } from 'next/font/google';

export const caprasimo = Caprasimo({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lekton',
  preload: true,
});

export const notoSans = Noto_Sans({
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-noto-sans',
  preload: true,
});
