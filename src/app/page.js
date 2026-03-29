import PromptCatalog from '@/components/PromptCatalog';
import { getCategoryMeta, getPrompts } from '@/lib/prompts';

export default function Home() {
  const prompts = getPrompts();
  const categoryMeta = getCategoryMeta();

  return <PromptCatalog prompts={prompts} categoryMeta={categoryMeta} />;
}
