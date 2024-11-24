import type { Metadata } from 'next';
import { caprasimo, notoSans } from '@/lib/fonts';

import './globals.css';

export const metadata: Metadata = {
  title: 'My Smoothie App',
  description: 'Create your own smoothie recipes!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${caprasimo.variable} ${notoSans.variable} antialiased font-sans font-light font-foreground mx-auto`}
      >
        {children}
      </body>
    </html>
  );
}
