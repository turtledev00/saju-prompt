import PromptCatalog from '@/components/PromptCatalog';
import { getCategoryMeta, getPrompts } from '@/lib/prompts';

export default function Home() {
  const locale = 'ko';
  const prompts = getPrompts(locale);
  const categoryMeta = getCategoryMeta(locale);

  return <PromptCatalog prompts={prompts} categoryMeta={categoryMeta} locale={locale} />;
}
