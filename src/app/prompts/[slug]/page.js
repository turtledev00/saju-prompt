import { notFound } from 'next/navigation';

import PromptDetail from '@/components/PromptDetail';
import { getPromptBySlug, getPrompts } from '@/lib/prompts';

export function generateStaticParams() {
  return getPrompts().map((prompt) => ({
    slug: prompt.slug,
  }));
}

export default async function PromptDetailPage({ params }) {
  const resolvedParams = await params;
  const slug = typeof resolvedParams?.slug === 'string' ? resolvedParams.slug : '';
  const prompt = getPromptBySlug(slug);

  if (!prompt) {
    notFound();
  }

  return <PromptDetail prompt={prompt} />;
}
