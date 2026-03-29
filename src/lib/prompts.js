import fs from 'node:fs';
import path from 'node:path';

const IMAGE_DIR = path.join(process.cwd(), 'public', 'assets', 'images');

const CATEGORY_META = {
  all: { label: '전체', icon: '' },
  saju: { label: '사주', icon: '🇰🇷' },
  tarot: { label: '타로', icon: '🔮' },
  astrology: { label: '점성술', icon: '🌠' },
  fengshui: { label: '풍수지리', icon: '🏠' },
  physiognomy: { label: '관상', icon: '🐵' },
};

const CARD_PRIORITY = {
  '연애운 사주': 1,
  '일반 사주': 2,
  '신년운세 사주': 3,
  '건강운 사주': 4,
  '직업운 사주': 5,
  '재물운 사주': 6,
};

function detectCategory(name) {
  if (name.includes('풍수지리')) return 'fengshui';
  if (name.includes('관상')) return 'physiognomy';
  if (name.includes('점성술')) return 'astrology';
  if (name.includes('타로')) return 'tarot';
  return 'saju';
}

function makeKoreanTitle(baseName) {
  const normalized = baseName.normalize('NFC').replace('-1', '');
  if (normalized === '일반 사주') {
    return '(일반) 사주 프롬프트';
  }
  return `${normalized} 프롬프트`;
}

function makePromptBody(titleText) {
  return `생년월일: YYYY년 MM월 DD일 (양력/음력 반드시 명시)\n태어난 시간: HH시 MM분 (24시간 기준)\n태어난 장소: 도시 + 국가\n성별: 남/여\n\n1. 기본 구조 (핵심 해석 기반)\n일간 및 일지 분석\n배우자궁(일지)의 특성\n연애/결혼 관련 주요 십신 구조 분석\n\n2. 연애 성향 분석\n도화살, 홍염살 등 매력 요소\n감정 표현 방식 (직설형/간접형)\n연애에서 주도/수동 성향\n집착/거리두기 경향\n\n※ 반드시 사주 구조 근거 포함\n\n3. 이성 유형 분석\n내가 끌리는 이성 유형 (욕망 기준)\n실제로 잘 맞는 유형 (궁합 기준)\n피해야 할 유형 (충/극 관계 기반)\n\n4. 연애 패턴 및 반복 문제\n사주 구조상 반복되는 연애 문제\n관계에서 무너지는 포인트\n실제 행동 수준에서의 개선 조언\n\n5. 대운 기반 연애 흐름\n현재 대운에서 연애운의 위치\n연애/결혼운이 강해지는 시기\n관계 변화가 생기는 전환점\n\n6. 2026년 연애운 (병오년)\n원국과의 합/충/형 관계\n연애 기회 vs 갈등 가능성\n어떤 유형의 인연이 들어오는지\n\n7. 2026년 월별 연애운 (간단 X, 구조 기반)\n각 달의 흐름 (기회 / 주의 / 정체)\n왜 그런 흐름이 나오는지 (간지 충합 기준)\n\n요청 주제: ${titleText}`;
}

export function getCategoryMeta() {
  return CATEGORY_META;
}

export function getPrompts() {
  const files = fs
    .readdirSync(IMAGE_DIR)
    .filter((file) => file.toLowerCase().endsWith('.png'))
    .sort((a, b) => a.localeCompare(b, 'ko'));

  const prompts = files.map((fileName, index) => {
    const baseName = fileName.replace(/\.png$/i, '').normalize('NFC');
    const category = detectCategory(baseName);
    const cleanedName = baseName.replace('-1', '');

    return {
      id: index + 1,
      slug: `prompt-${index + 1}`,
      category,
      categoryLabel: CATEGORY_META[category].label,
      imageSrc: `/assets/images/${encodeURIComponent(fileName)}`,
      imageAlt: `${cleanedName} 이미지`,
      title: makeKoreanTitle(baseName),
      tag: `#${CATEGORY_META[category].label}`,
      searchText: `${cleanedName} ${CATEGORY_META[category].label}`,
      cardPriority: CARD_PRIORITY[cleanedName] ?? 999,
      promptBody: makePromptBody(makeKoreanTitle(baseName)),
    };
  });

  return prompts.sort((a, b) => {
    if (a.category === 'saju' && b.category === 'saju') {
      if (a.cardPriority !== b.cardPriority) return a.cardPriority - b.cardPriority;
    }
    if (a.category !== b.category) return a.category.localeCompare(b.category, 'ko');
    return a.id - b.id;
  });
}

export function getPromptBySlug(slug) {
  return getPrompts().find((prompt) => prompt.slug === slug) || null;
}
