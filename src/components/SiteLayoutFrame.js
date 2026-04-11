'use client';

import Script from 'next/script';
import { useMemo } from 'react';
import { usePathname } from 'next/navigation';

import GoogleAnalytics from '@/components/GoogleAnalytics';
import SiteHeader from '@/components/SiteHeader';
import { SUPPORTED_LOCALES } from '@/lib/i18n';

function detectLocaleFromPathname(pathname) {
  const firstSegment = String(pathname || '/')
    .split('/')
    .filter(Boolean)[0];

  if (SUPPORTED_LOCALES.includes(firstSegment)) {
    return firstSegment;
  }

  return 'ko';
}

export default function SiteLayoutFrame({ children }) {
  const pathname = usePathname();
  const locale = useMemo(() => detectLocaleFromPathname(pathname), [pathname]);

  return (
    <>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2881048601217100"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      <GoogleAnalytics />
      <div className="page-wrap">
        <main className="phone">
          <SiteHeader locale={locale} />
          {children}
        </main>
      </div>
    </>
  );
}
