import { notFound } from 'next/navigation';

import PromptCatalog from '@/components/PromptCatalog';
import { SUPPORTED_LOCALES, getLocaleMeta, getLocalePrefix, normalizeLocale } from '@/lib/i18n';
import { getCategoryMeta, getPrompts } from '@/lib/prompts';

export const dynamicParams = false;

export function generateStaticParams() {
  return SUPPORTED_LOCALES.filter((locale) => locale !== 'ko').map((locale) => ({ lang: locale }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const locale = normalizeLocale(resolvedParams?.lang);
  const localeMeta = getLocaleMeta(locale);

  if (locale === 'ko') {
    return {};
  }

  return {
    title: localeMeta.siteName,
    description: localeMeta.description,
    alternates: {
      canonical: getLocalePrefix(locale),
      languages: {
        ko: '/',
        en: '/en',
        zh: '/zh',
        ja: '/ja',
      },
    },
  };
}

export default async function LocaleHome({ params }) {
  const resolvedParams = await params;
  const locale = normalizeLocale(resolvedParams?.lang);

  if (locale === 'ko') {
    notFound();
  }

  const prompts = getPrompts(locale);
  const categoryMeta = getCategoryMeta(locale);

  return <PromptCatalog prompts={prompts} categoryMeta={categoryMeta} locale={locale} />;
}
