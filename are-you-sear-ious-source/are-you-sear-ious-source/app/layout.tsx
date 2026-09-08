import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import './experience.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Are You Sear-ious — Your grill. Your rules.',
  description:
    'Mustard-bound gas-grill recipes scaled to your cut and weight, with protein-specific temperatures, choose-your-own burner layouts, cooking science, and printable instructions.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Let the page paint into the notch area; the safe-area padding in
  // experience.css keeps content clear of it.
  viewportFit: 'cover',
  themeColor: '#141514',
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
