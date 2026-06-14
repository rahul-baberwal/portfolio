import type { Metadata } from 'next';
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
  title: 'Rahul Baberwal | Python Backend Developer & AI Engineer',
  description:
    'Rahul Baberwal — Backend Developer at Groww Per Click. MSc CS at MGSU Bikaner, AI Major from IIT Ropar. Specializing in Python, Django, FastAPI & ML.',
  keywords: [
    'Rahul Baberwal',
    'Python Backend Developer',
    'Django Developer',
    'FastAPI',
    'Machine Learning',
    'IIT Ropar',
    'MGSU Bikaner',
    'AI Engineer',
  ],
  authors: [{ name: 'Rahul Baberwal' }],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://rahulbaberwal.com/',
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
  openGraph: {
    type: 'website',
    url: 'https://rahulbaberwal.com/',
    siteName: 'Rahul Baberwal Portfolio',
    title: 'Rahul Baberwal | Python Backend Developer & AI Engineer',
    description:
      'Backend Developer at Groww Per Click. AI Major from IIT Ropar. Building intelligent systems with Python, Django & ML. View my projects.',
    images: [
      {
        url: 'https://rahulbaberwal.com/og-image/og-banner_facebook_og_1200x630.webp',
        width: 1200,
        height: 630,
        alt: 'Rahul Baberwal — Backend Developer and AI Engineer.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rahul Baberwal | Python Backend Developer & AI Engineer',
    description:
      'Backend Developer at Groww Per Click. AI Major from IIT Ropar. Building with Python, Django & ML. View my projects.',
    images: ['https://rahulbaberwal.com/og-image/og-banner_twitter_x_1200x675.webp'],
  },
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
        {/* FontAwesome integration for icons */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        {/* Devicon integration for skills */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
        />
      </head>
      <body className="antialiased select-none font-sans">
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
