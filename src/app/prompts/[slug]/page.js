import { notFound } from 'next/navigation';

import PromptDetail from '@/components/PromptDetail';
import { buildPromptMetadata } from '@/lib/seo';
import { getPromptBySlug, getPrompts } from '@/lib/prompts';

export function generateStaticParams() {
  return getPrompts().map((prompt) => ({
    slug: prompt.slug,
  }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = typeof resolvedParams?.slug === 'string' ? resolvedParams.slug : '';
  const locale = 'ko';
  const prompt = getPromptBySlug(slug, locale);

  if (!prompt) {
    return {};
  }

  return buildPromptMetadata({ locale, prompt, slug });
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
