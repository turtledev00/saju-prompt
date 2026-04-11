import { notFound } from 'next/navigation';

import PromptDetail from '@/components/PromptDetail';
import { SUPPORTED_LOCALES, getLocaleMeta, getLocalePrefix, normalizeLocale } from '@/lib/i18n';
import { getPromptBySlug, getPrompts } from '@/lib/prompts';

export const dynamicParams = false;

export function generateStaticParams() {
  const locales = SUPPORTED_LOCALES.filter((locale) => locale !== 'ko');
  const prompts = getPrompts('ko');

  return locales.flatMap((lang) =>
    prompts.map((prompt) => ({
      lang,
      slug: prompt.slug,
    })),
  );
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const locale = normalizeLocale(resolvedParams?.lang);
  const slug = typeof resolvedParams?.slug === 'string' ? resolvedParams.slug : '';
  const localeMeta = getLocaleMeta(locale);
  const prompt = getPromptBySlug(slug, locale);

  if (locale === 'ko' || !prompt) {
    return {};
  }

  return {
    title: `${prompt.detailTitle || prompt.displayTitle || prompt.title} | ${localeMeta.siteName}`,
    description: localeMeta.description,
    alternates: {
      canonical: `${getLocalePrefix(locale)}/prompts/${slug}`,
      languages: {
        ko: `/prompts/${slug}`,
        en: `/en/prompts/${slug}`,
        zh: `/zh/prompts/${slug}`,
        ja: `/ja/prompts/${slug}`,
      },
    },
  };
}

export default async function LocalePromptDetailPage({ params }) {
  const resolvedParams = await params;
  const locale = normalizeLocale(resolvedParams?.lang);
  const slug = typeof resolvedParams?.slug === 'string' ? resolvedParams.slug : '';

  if (locale === 'ko') {
    notFound();
  }

  const prompt = getPromptBySlug(slug, locale);

  if (!prompt) {
    notFound();
  }

  return <PromptDetail prompt={prompt} locale={locale} />;
}
