import PromptCatalog from '@/components/PromptCatalog';
import { getCategoryMeta, getPrompts } from '@/lib/prompts';
import { buildHomeMetadata } from '@/lib/seo';

export const dynamicParams = false;

export async function generateMetadata() {
  return buildHomeMetadata('en');
}

export default function EnHome() {
  const locale = 'en';
  const prompts = getPrompts(locale);
  const categoryMeta = getCategoryMeta(locale);

  return <PromptCatalog prompts={prompts} categoryMeta={categoryMeta} locale={locale} />;
}
