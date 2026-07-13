import type { Metadata } from 'next';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import './global.css';

const title = 'Zagvar — Trading foundations';
const description =
  'Documentation for Mosaic trading interfaces and Relay market-data infrastructure.';
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL === undefined
    ? 'http://localhost:3000'
    : `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: 'Zagvar Docs',
  title: {
    default: title,
    template: '%s | Zagvar',
  },
  description,
  keywords: [
    'trading UI',
    'market data',
    'React trading components',
    'WebSocket market data',
    'order book',
    'fintech infrastructure',
  ],
  authors: [{ name: 'Zagvar', url: 'https://github.com/zagvar' }],
  creator: 'Zagvar',
  openGraph: {
    type: 'website',
    siteName: 'Zagvar',
    title,
    description,
  },
  twitter: {
    card: 'summary',
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
