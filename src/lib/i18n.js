export const DEFAULT_LOCALE = 'ko';
export const SUPPORTED_LOCALES = ['ko', 'en', 'zh', 'ja'];

const LOCALE_META = {
  ko: {
    lang: 'ko',
    siteName: '유사과학 프롬프트 위키',
    description: '사주팔자, 타로, 점성술 프롬프트를 모아둔 정적 웹사이트',
    searchPlaceholder: '유사과학 프롬프트 검색 (ex. 신년운세)',
    categoryAriaLabel: '카테고리 필터',
    listAriaLabel: '프롬프트 목록',
    copyPrompt: '프롬프트 복사',
    copiedToast: '프롬프트를 복사했어요. \u{1F483}',
    promptBodyAria: '프롬프트 원문',
    langLabel: '한국어',
  },
  en: {
    lang: 'en',
    siteName: 'Fortune Prompt Hub',
    description: 'A static website collecting Saju, Tarot, and Astrology prompts',
    searchPlaceholder: 'Prompt Search (ex. Fortune)',
    categoryAriaLabel: 'Category filter',
    listAriaLabel: 'Prompt list',
    copyPrompt: 'Copy Prompt',
    copiedToast: 'Prompt copied. \u{1F483}',
    promptBodyAria: 'Prompt body',
    langLabel: 'English',
  },
  zh: {
    lang: 'zh',
    siteName: '命理提示词平台',
    description: '收录四柱、塔罗与占星提示词的静态网站',
    searchPlaceholder: '运势提示词搜索（如：新年运势）',
    categoryAriaLabel: '分类筛选',
    listAriaLabel: '提示词列表',
    copyPrompt: '复制提示词',
    copiedToast: '提示词已复制。\u{1F483}',
    promptBodyAria: '提示词正文',
    langLabel: '中文',
  },
  ja: {
    lang: 'ja',
    siteName: '疑似科学プロンプトWiki',
    description: '四柱推命・タロット・占星術プロンプトを集めた静的サイト',
    searchPlaceholder: '運勢プロンプト検索（例：新年運勢）',
    categoryAriaLabel: 'カテゴリーフィルター',
    listAriaLabel: 'プロンプト一覧',
    copyPrompt: 'プロンプトをコピー',
    copiedToast: 'プロンプトをコピーしました。\u{1F483}',
    promptBodyAria: 'プロンプト本文',
    langLabel: '日本語',
  },
};

export function normalizeLocale(locale) {
  return SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
}

export function getLocaleMeta(locale) {
  return LOCALE_META[normalizeLocale(locale)];
}

export function getLocalePrefix(locale) {
  const normalized = normalizeLocale(locale);
  return normalized === DEFAULT_LOCALE ? '' : `/${normalized}`;
}

export function getLocalizedCategoryMeta(locale) {
  const normalized = normalizeLocale(locale);

  const localized = {
    ko: {
      all: { label: '전체', icon: '' },
      saju: { label: '사주', icon: '☯️' },
      tarot: { label: '타로', icon: '🔮' },
      astrology: { label: '점성술', icon: '🌠' },
      fengshui: { label: '풍수지리', icon: '🏠' },
      physiognomy: { label: '관상', icon: '🐵' },
    },
    en: {
      all: { label: 'All', icon: '' },
      saju: { label: 'Four Pillars', icon: '☯️' },
      tarot: { label: 'Tarot', icon: '🔮' },
      astrology: { label: 'Astrology', icon: '🌠' },
      fengshui: { label: 'Feng Shui', icon: '🏠' },
      physiognomy: { label: 'Physiognomy', icon: '🐵' },
    },
    zh: {
      all: { label: '全部', icon: '' },
      saju: { label: '八字', icon: '☯️' },
      tarot: { label: '塔罗', icon: '🔮' },
      astrology: { label: '占星术', icon: '🌠' },
      fengshui: { label: '风水综合', icon: '🏠' },
      physiognomy: { label: '面相', icon: '🐵' },
    },
    ja: {
      all: { label: 'すべて', icon: '' },
      saju: { label: '四柱推命', icon: '☯️' },
      tarot: { label: 'タロット', icon: '🔮' },
      astrology: { label: '占星術', icon: '🌠' },
      fengshui: { label: '風水総合', icon: '🏠' },
      physiognomy: { label: '人相 顔', icon: '🐵' },
    },
  };

  return localized[normalized];
}
