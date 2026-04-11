import { notFound } from 'next/navigation';

import PromptDetail from '@/components/PromptDetail';
import { getPromptBySlug, getPrompts } from '@/lib/prompts';

export function generateStaticParams() {
  return getPrompts().map((prompt) => ({
    slug: prompt.slug,
  }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = typeof resolvedParams?.slug === 'string' ? resolvedParams.slug : '';
  const prompt = getPromptBySlug(slug, 'ko');

  if (!prompt) {
    return {};
  }

  return {
    title: `${prompt.detailTitle || prompt.displayTitle || prompt.title} | 유사과학 프롬프트 위키`,
    description: '사주팔자, 타로, 점성술 프롬프트를 모아둔 정적 웹사이트',
    alternates: {
      canonical: `/prompts/${slug}`,
      languages: {
        ko: `/prompts/${slug}`,
        en: `/en/prompts/${slug}`,
        zh: `/zh/prompts/${slug}`,
        ja: `/ja/prompts/${slug}`,
      },
    },
  };
}

export default async function PromptDetailPage({ params }) {
  const locale = 'ko';
  const resolvedParams = await params;
  const slug = typeof resolvedParams?.slug === 'string' ? resolvedParams.slug : '';
  const prompt = getPromptBySlug(slug, locale);

  if (!prompt) {
    notFound();
  }

  return <PromptDetail prompt={prompt} locale={locale} />;
}
