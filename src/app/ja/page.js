import PromptCatalog from '@/components/PromptCatalog';
import { getLocaleMeta, getLocalePrefix } from '@/lib/i18n';
import { getCategoryMeta, getPrompts } from '@/lib/prompts';

export const dynamicParams = false;

export async function generateMetadata() {
  const locale = 'ja';
  const localeMeta = getLocaleMeta(locale);

  return {
    title: localeMeta.siteName,
    description: localeMeta.description,
    alternates: {
      canonical: getLocalePrefix(locale),
      languages: {
        ko: '/',
        en: '/en',
        zh: '/zh',
        ja: '/ja',
      },
    },
  };
}

export default function JaHome() {
  const locale = 'ja';
  const prompts = getPrompts(locale);
  const categoryMeta = getCategoryMeta(locale);

  return <PromptCatalog prompts={prompts} categoryMeta={categoryMeta} locale={locale} />;
}
