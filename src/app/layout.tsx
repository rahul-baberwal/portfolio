import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { JetBrains_Mono } from 'next/font/google';
import './globals.css';

import { ThemeProvider } from '../components/ThemeProvider';
import { TerminalProvider } from '../context/TerminalContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TerminalOverlay from '../components/TerminalOverlay';
import InteractiveEffects from '../components/InteractiveEffects';
import { PersonJsonLd, FaqJsonLd } from '../components/JsonLd';
import ServiceWorkerRegister from '../components/ServiceWorkerRegister';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'Rahul Baberwal | Full Stack Developer & AI Engineer',
  description:
    'Rahul Baberwal — Full Stack Developer at AdsToPlay. MSc CS at MGSU Bikaner, AI Major from IIT Ropar. Specializing in React, PHP, Python, Django, FastAPI & ML.',
  keywords: [
    'Rahul Baberwal',
    'Full Stack Developer',
    'Django Developer',
    'FastAPI',
    'Machine Learning',
    'IIT Ropar',
    'MGSU Bikaner',
    'AI Engineer',
  ],
  authors: [{ name: 'Rahul Baberwal', url: 'https://rahulbaberwal.com' }],
  creator: 'Rahul Baberwal',
  publisher: 'Rahul Baberwal',
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://rahulbaberwal.com/',
    languages: {
      'en-US': 'https://rahulbaberwal.com/',
      'x-default': 'https://rahulbaberwal.com/',
    },
  },
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/favicon-32x32.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  appLinks: {},
  // theme-color is declared via the separate viewport export below
  openGraph: {
    type: 'website',
    url: 'https://rahulbaberwal.com/',
    siteName: 'Rahul Baberwal Portfolio',
    title: 'Rahul Baberwal | Full Stack & AI',
    description: 'Full Stack Developer and AI Engineer. View my portfolio.',
    images: [
      {
        url: 'https://rahulbaberwal.com/og-image/og-banner_facebook_og_1200x630.webp',
        width: 1200,
        height: 630,
        alt: 'Rahul Baberwal — Full Stack Developer and AI Engineer.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rahul Baberwal | Full Stack Developer & AI Engineer',
    description:
      'Rahul Baberwal is a Full Stack Developer & AI Engineer specializing in React, PHP, Python, Django, FastAPI, and ML. Discover my projects, background, and skills.',
    site: '@rahulbaberwal',
    creator: '@rahulbaberwal',
    images: ['https://rahulbaberwal.com/og-image/og-banner_twitter_x_1200x675.webp'],
  },
};

// Viewport export — Next.js renders this as <meta name="theme-color"> + <meta name="viewport">
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)',  color: '#0d1117' },
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${jetbrainsMono.variable}`} data-scroll-behavior="smooth">
      <head>
        <PersonJsonLd />
        <FaqJsonLd />
        {/* Font Awesome — self-hosted for performance (no CDN round-trip) */}
        <link
          rel="preload"
          href="/vendor/fa/webfonts/fa-solid-900.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/vendor/fa/webfonts/fa-brands-400.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {/* Load CSS asynchronously to prevent render-blocking */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var l1 = document.createElement('link');
                l1.rel = 'stylesheet';
                l1.href = '/vendor/fa/css/all.min.css';
                document.head.appendChild(l1);

                var l2 = document.createElement('link');
                l2.rel = 'stylesheet';
                l2.href = '/vendor/devicon/devicon.min.css';
                document.head.appendChild(l2);
              })();
            `
          }}
        />
        <noscript>
          <link rel="stylesheet" href="/vendor/fa/css/all.min.css" />
          <link rel="stylesheet" href="/vendor/devicon/devicon.min.css" />
        </noscript>
      </head>
      <body className="antialiased select-none font-sans">
        <ServiceWorkerRegister />
        <ThemeProvider>
          <TerminalProvider>
            <InteractiveEffects />
            <Navbar />
            <TerminalOverlay />
            <main>{children}</main>
            <Footer />
          </TerminalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
