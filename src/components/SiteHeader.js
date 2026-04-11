import Link from 'next/link';

import { getLocaleMeta, getLocalePrefix, normalizeLocale } from '@/lib/i18n';

export default function SiteHeader({ locale = 'ko' }) {
  const normalized = normalizeLocale(locale);
  const localeMeta = getLocaleMeta(normalized);

  return (
    <header className="top-header">
      <Link href={getLocalePrefix(normalized) || '/'} className="brand-link">
        <img className="brand-logo" src="/assets/logo/ssseregi_logo.png" alt={`${localeMeta.siteName} logo`} width="32" height="32" />
        <strong className="brand-title">{localeMeta.siteName}</strong>
      </Link>

      <a href="https://litt.ly/ssseregi" target="_blank" rel="noreferrer" style={{ marginLeft: 'auto', fontSize: '12px', textDecoration: 'underline' }}>
        @ssseregi
      </a>
    </header>
  );
}
