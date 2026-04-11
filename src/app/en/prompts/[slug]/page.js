import { notFound } from 'next/navigation';

import PromptDetail from '@/components/PromptDetail';
import { getLocaleMeta, getLocalePrefix } from '@/lib/i18n';
import { getPromptBySlug, getPrompts } from '@/lib/prompts';

export const dynamicParams = false;

export function generateStaticParams() {
  const prompts = getPrompts('ko');
  return prompts.map((prompt) => ({ slug: prompt.slug }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = typeof resolvedParams?.slug === 'string' ? resolvedParams.slug : '';
  const locale = 'en';
  const localeMeta = getLocaleMeta(locale);
  const prompt = getPromptBySlug(slug, locale);

  if (!prompt) {
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

export default async function EnPromptDetailPage({ params }) {
  const resolvedParams = await params;
  const slug = typeof resolvedParams?.slug === 'string' ? resolvedParams.slug : '';
  const locale = 'en';
  const prompt = getPromptBySlug(slug, locale);

  if (!prompt) {
    notFound();
  }

  return <PromptDetail prompt={prompt} locale={locale} />;
}
