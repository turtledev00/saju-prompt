import prompts from '../data/prompts.static.json';
import classificationsBySlug from '../data/classifications.i18n.json';
import promptBodiesBySlug from '../data/promptBodies.i18n.json';

import { getLocalizedCategoryMeta, normalizeLocale } from './i18n';

const IMAGE_FOLDER_BY_LOCALE = {
  ko: 'ko',
  en: 'en',
  ja: 'ja',
  zh: 'zh',
};

const PROMPT_SUFFIX_BY_LOCALE = {
  ko: '프롬프트',
  en: 'Prompt',
  zh: '提示词',
  ja: 'プロンプト',
};

function localizeImageSrc(imageSrc, locale) {
  const folder = IMAGE_FOLDER_BY_LOCALE[normalizeLocale(locale)] || '';
  if (!folder) return imageSrc;

  const prefix = '/assets/images/';
  if (!String(imageSrc || '').startsWith(prefix)) {
    return imageSrc;
  }

  return `${prefix}${folder}/${imageSrc.slice(prefix.length)}`;
}

function localizePrompt(prompt, locale) {
  const normalized = normalizeLocale(locale);
  const localizedClassifications = classificationsBySlug?.[prompt.slug]?.[normalized] || classificationsBySlug?.[prompt.slug]?.ko || null;
  const localizedPromptBody = promptBodiesBySlug?.[prompt.slug]?.[normalized]?.promptBody || promptBodiesBySlug?.[prompt.slug]?.ko?.promptBody || prompt.promptBody;
  const classification1 = localizedClassifications?.classification1 || prompt.categoryLabel || '';
  const classification2 = localizedClassifications?.classification2 || '';
  const localizedTag = classification2 ? `#${classification1} · #${classification2}` : `#${classification1}`;
  const localizedSearchText = [prompt.searchText, classification1, classification2].filter(Boolean).join(' ');
  const promptSuffix = PROMPT_SUFFIX_BY_LOCALE[normalized] || PROMPT_SUFFIX_BY_LOCALE.ko;
  const displayTitle = [classification2, classification1, promptSuffix].filter(Boolean).join(' ');

  return {
    ...prompt,
    imageSrc: localizeImageSrc(prompt.imageSrc, normalized),
    promptBody: localizedPromptBody,
    classification1,
    classification2,
    displayTitle,
    detailTitle: displayTitle || prompt.title,
    tag: localizedTag,
    searchText: localizedSearchText,
    locale: normalized,
  };
}

export function getCategoryMeta(locale = 'ko') {
  return getLocalizedCategoryMeta(locale);
}

export function getPrompts(locale = 'ko') {
  return prompts.map((prompt) => localizePrompt(prompt, locale));
}

export function getPromptBySlug(slug, locale = 'ko') {
  const prompt = prompts.find((item) => item.slug === slug) || null;

  if (!prompt) return null;

  return localizePrompt(prompt, locale);
}
