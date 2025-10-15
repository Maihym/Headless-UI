import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { generateLocalBusinessSchema } from '@/lib/schema';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://firstelectric.pro'),
  title: {
    default: 'First Electric | Licensed Electrician in La Mirada, CA',
    template: '%s | First Electric',
  },
  description: 'Licensed La Mirada electricians for homes & businesses. EV chargers, panels, repairs. 24/7 emergency. Lifetime workmanship guarantee.',
  keywords: [
    'electrician in La Mirada',
    'EV charger installation La Mirada',
    'residential electrician La Mirada',
    'emergency electrician near me',
    'commercial electrical contractor La Mirada',
  ],
  authors: [{ name: 'First Electric' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'First Electric',
    title: 'First Electric | Licensed Electrician in La Mirada, CA',
    description: 'Licensed La Mirada electricians for homes & businesses. EV chargers, panels, repairs. 24/7 emergency. Lifetime workmanship guarantee.',
    images: [
      {
        url: '/Logo.svg',
        width: 1200,
        height: 630,
        alt: 'First Electric Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'First Electric | Licensed Electrician in La Mirada, CA',
    description: 'Licensed La Mirada electricians for homes & businesses. EV chargers, panels, repairs. 24/7 emergency.',
    images: ['/Logo.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // User will replace this
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schema = generateLocalBusinessSchema();

  return (
    <html lang="en" className={inter.variable} data-scroll-behavior="smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        <script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          async
          defer
        />
      </head>
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}

