import prompts from '../data/prompts.static.json';

const CATEGORY_META = {
  all: { label: '전체', icon: '' },
  saju: { label: '사주', icon: '🇰🇷' },
  tarot: { label: '타로', icon: '🔮' },
  astrology: { label: '점성술', icon: '🌠' },
  fengshui: { label: '풍수지리', icon: '🏠' },
  physiognomy: { label: '관상', icon: '🐵' },
};

export function getCategoryMeta() {
  return CATEGORY_META;
}

export function getPrompts() {
  return prompts;
}

export function getPromptBySlug(slug) {
  return prompts.find((prompt) => prompt.slug === slug) || null;
}
