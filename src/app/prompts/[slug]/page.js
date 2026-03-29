import { notFound } from 'next/navigation';

import PromptDetail from '@/components/PromptDetail';
import { getPromptBySlug, getPrompts } from '@/lib/prompts';

export function generateStaticParams() {
  return getPrompts().map((prompt) => ({
    slug: prompt.slug,
  }));
}

export default function PromptDetailPage({ params }) {
  const prompt = getPromptBySlug(params.slug);

  if (!prompt) {
    notFound();
  }

  return <PromptDetail prompt={prompt} />;
}
