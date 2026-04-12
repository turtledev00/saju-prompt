import { getLocaleMeta, getLocalePrefix } from './i18n';

const OG_LOCALE_BY_LANG = {
  ko: 'ko_KR',
  en: 'en_US',
  zh: 'zh_CN',
  ja: 'ja_JP',
};

const LANGUAGE_ALTERNATES = {
  ko: '/',
  en: '/en',
  zh: '/zh',
  ja: '/ja',
};

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
}

function getDefaultOgImage(locale) {
  return `/assets/images/${locale}/prompt-1.png`;
}

function buildSocialMetadata({ locale, title, description, canonicalPath, imagePath, type }) {
  const localeMeta = getLocaleMeta(locale);
  const image = imagePath || getDefaultOgImage(locale);

  return {
    openGraph: {
      type: type || 'website',
      locale: OG_LOCALE_BY_LANG[locale] || OG_LOCALE_BY_LANG.ko,
      siteName: localeMeta.siteName,
      title,
      description,
      url: canonicalPath,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export function buildHomeMetadata(locale) {
  const localeMeta = getLocaleMeta(locale);
  const canonicalPath = getLocalePrefix(locale) || '/';

  return {
    title: localeMeta.siteName,
    description: localeMeta.description,
    alternates: {
      canonical: canonicalPath,
      languages: LANGUAGE_ALTERNATES,
    },
    ...buildSocialMetadata({
      locale,
      title: localeMeta.siteName,
      description: localeMeta.description,
      canonicalPath,
      imagePath: getDefaultOgImage(locale),
      type: 'website',
    }),
  };
}

export function buildPromptMetadata({ locale, prompt, slug }) {
  const localeMeta = getLocaleMeta(locale);
  const promptTitle = prompt?.detailTitle || prompt?.displayTitle || prompt?.title || '';
  const title = `${promptTitle} | ${localeMeta.siteName}`;
  const description = localeMeta.description;
  const canonicalPath = `${getLocalePrefix(locale)}/prompts/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
      languages: {
        ko: `/prompts/${slug}`,
        en: `/en/prompts/${slug}`,
        zh: `/zh/prompts/${slug}`,
        ja: `/ja/prompts/${slug}`,
      },
    },
    ...buildSocialMetadata({
      locale,
      title,
      description,
      canonicalPath,
      imagePath: prompt?.imageSrc || getDefaultOgImage(locale),
      type: 'article',
    }),
  };
}
