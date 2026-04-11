import { Noto_Sans_KR } from 'next/font/google';

import SiteLayoutFrame from '@/components/SiteLayoutFrame';
import { getLocaleMeta } from '@/lib/i18n';

import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
const koMeta = getLocaleMeta('ko');

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: koMeta.siteName,
  description: koMeta.description,
  icons: {
    icon: [{ url: '/favicon.ico', sizes: 'any' }],
    shortcut: ['/favicon.ico'],
  },
  alternates: {
    canonical: '/',
    languages: {
      ko: '/',
      en: '/en',
      zh: '/zh',
      ja: '/ja',
    },
  },
  openGraph: {
    title: koMeta.siteName,
    description: koMeta.description,
    images: ['/assets/images/prompt-1.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: koMeta.siteName,
    description: koMeta.description,
    images: ['/assets/images/prompt-1.png'],
  },
};

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-noto-sans-kr',
});

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className={notoSansKr.variable}>
        <SiteLayoutFrame>{children}</SiteLayoutFrame>
      </body>
    </html>
  );
}
