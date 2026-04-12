import PromptCatalog from '@/components/PromptCatalog';
import { getCategoryMeta, getPrompts } from '@/lib/prompts';
import { buildHomeMetadata } from '@/lib/seo';

export const dynamicParams = false;

export async function generateMetadata() {
  return buildHomeMetadata('zh');
}

export default function ZhHome() {
  const locale = 'zh';
  const prompts = getPrompts(locale);
  const categoryMeta = getCategoryMeta(locale);

  return <PromptCatalog prompts={prompts} categoryMeta={categoryMeta} locale={locale} />;
}
