import { notFound } from 'next/navigation';

import PromptDetail from '@/components/PromptDetail';
import { getPromptBySlug, getPrompts } from '@/lib/prompts';
import { buildPromptMetadata } from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams() {
  const prompts = getPrompts('ko');
  return prompts.map((prompt) => ({ slug: prompt.slug }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = typeof resolvedParams?.slug === 'string' ? resolvedParams.slug : '';
  const locale = 'en';
  const prompt = getPromptBySlug(slug, locale);

  if (!prompt) {
    return {};
  }

  return buildPromptMetadata({ locale, prompt, slug });
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
