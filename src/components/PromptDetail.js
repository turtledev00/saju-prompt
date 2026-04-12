'use client';

import { useMemo, useState } from 'react';

import { getLocaleMeta } from '@/lib/i18n';

function stripUserInputSection(text) {
  const lines = String(text || '').split('\n');
  const start = lines.findIndex((line) => /^\s*0\.\s*사용자 입력/.test(line));
  if (start < 0) return text;

  let end = lines.findIndex((line, idx) => idx > start && /^\s*1\./.test(line));
  if (end < 0) end = lines.length;

  const kept = [...lines.slice(0, start), ...lines.slice(end)];
  return kept.join('\n').replace(/^\s+/, '');
}

function stripFengshuiInputSection(text) {
  let lines = String(text || '').split('\n');

  const currentStart = lines.findIndex((line) => /^\s*\[현재 거주 공간\]/.test(line));
  if (currentStart >= 0) {
    const currentEnd = lines.findIndex((line, idx) => idx > currentStart && /^\s*당신은/.test(line));
    if (currentEnd > currentStart) {
      lines = [...lines.slice(0, currentStart), ...lines.slice(currentEnd)];
    }
  }

  const moveStartExplicit = lines.findIndex((line) => /^\s*이사 고민이나 현재 집 상황/.test(line));
  const moveStart = moveStartExplicit >= 0 ? moveStartExplicit : lines.findIndex((line) => /^\s*\[구조 입력 - 선택\]/.test(line));
  if (moveStart >= 0) {
    const moveEnd = lines.findIndex((line, idx) => idx > moveStart && /^\s*1\.\s*해석 원칙/.test(line));
    if (moveEnd > moveStart) {
      lines = [...lines.slice(0, moveStart), ...lines.slice(moveEnd)];
    }
  }

  return lines.join('\n').replace(/^\s+/, '');
}

function getTarotType(title) {
  if (title.includes('재물운')) return 'wealth';
  if (title.includes('배우자운')) return 'spouse';
  if (title.includes('연애운')) return 'love';
  if (title.includes('직업운')) return 'career';
  return 'generic';
}

function getCurrentYearNumber() {
  return new Date().getFullYear();
}

function resolveAnalysisYear(rawYear) {
  const value = String(rawYear || '').trim();
  if (!value) {
    const current = getCurrentYearNumber();
    return { label: `${current}년`, yearNumber: String(current) };
  }

  const digits = value.match(/\d{4}/)?.[0];
  if (!digits) {
    return { label: value, yearNumber: String(getCurrentYearNumber()) };
  }

  return {
    label: value.includes('년') ? value : `${digits}년`,
    yearNumber: digits,
  };
}

function hasValue(value) {
  return String(value ?? '').trim().length > 0;
}

function getBasicInputI18n(locale) {
  if (locale === 'en') {
    return {
      sectionAria: 'Basic input information',
      birthDateLabel: 'Date of Birth',
      birthTimeLabel: 'Time of Birth',
      birthPlaceLabel: 'Place of Birth',
      genderLabel: 'Gender',
      analysisYearLabel: 'Analysis Year',
      concernLabel: 'Question',
      yearUnit: 'Y',
      monthUnit: 'M',
      dayUnit: 'D',
      hourUnit: 'h',
      minuteUnit: 'm',
      lunarLabel: 'Lunar',
      solarLabel: 'Solar',
      maleLabel: 'Male',
      femaleLabel: 'Female',
      privateLabel: 'Private',
      countryPlaceholder: 'Country',
      cityPlaceholder: 'City/Region',
      concernPlaceholder: 'Enter your situation or focus point',
      headerUserInput: '0. User Input',
      headerBirthDate: 'Date of Birth',
      headerBirthTime: 'Time of Birth',
      headerBirthPlace: 'Place of Birth',
      headerGender: 'Gender',
      headerAnalysisYear: 'Analysis Year',
      headerConcern: 'Current Situation / Question',
    };
  }

  if (locale === 'zh') {
    return {
      sectionAria: '基础输入信息',
      birthDateLabel: '出生日期',
      birthTimeLabel: '出生时间',
      birthPlaceLabel: '出生地',
      genderLabel: '性别',
      analysisYearLabel: '分析年份',
      concernLabel: '关注问题',
      yearUnit: '年',
      monthUnit: '月',
      dayUnit: '日',
      hourUnit: '时',
      minuteUnit: '分',
      lunarLabel: '农历',
      solarLabel: '阳历',
      maleLabel: '男',
      femaleLabel: '女',
      privateLabel: '不公开',
      countryPlaceholder: '国家',
      cityPlaceholder: '地区',
      concernPlaceholder: '请输入当前情况或关注点',
      headerUserInput: '0. 用户输入',
      headerBirthDate: '出生日期',
      headerBirthTime: '出生时间',
      headerBirthPlace: '出生地',
      headerGender: '性别',
      headerAnalysisYear: '分析年份',
      headerConcern: '当前情况/疑问',
    };
  }

  if (locale === 'ja') {
    return {
      sectionAria: '基本入力情報',
      birthDateLabel: '生年月日',
      birthTimeLabel: '出生時間',
      birthPlaceLabel: '出生地',
      genderLabel: '性別',
      analysisYearLabel: '分析年',
      concernLabel: '気になること',
      yearUnit: '年',
      monthUnit: '月',
      dayUnit: '日',
      hourUnit: '時',
      minuteUnit: '分',
      lunarLabel: '旧暦',
      solarLabel: '新暦',
      maleLabel: '男',
      femaleLabel: '女',
      privateLabel: '非公開',
      countryPlaceholder: '国',
      cityPlaceholder: '地域',
      concernPlaceholder: '現在の状況や確認したいポイントを入力',
      headerUserInput: '0. ユーザー入力',
      headerBirthDate: '生年月日',
      headerBirthTime: '出生時間',
      headerBirthPlace: '出生地',
      headerGender: '性別',
      headerAnalysisYear: '分析対象年',
      headerConcern: '現在の状況・質問',
    };
  }

  return {
    sectionAria: '기본 입력 정보',
    birthDateLabel: '생년월일',
    birthTimeLabel: '태어난 시간',
    birthPlaceLabel: '태어난 장소',
    genderLabel: '성별',
    analysisYearLabel: '분석 연도',
    concernLabel: '궁금한 점',
    yearUnit: '년',
    monthUnit: '월',
    dayUnit: '일',
    hourUnit: '시',
    minuteUnit: '분',
    lunarLabel: '음력',
    solarLabel: '양력',
    maleLabel: '남',
    femaleLabel: '여',
    privateLabel: '미공개',
    countryPlaceholder: '국가',
    cityPlaceholder: '지역',
    concernPlaceholder: '현재 상황, 보고 싶은 포인트를 입력',
    headerUserInput: '0. 사용자 입력',
    headerBirthDate: '생년월일',
    headerBirthTime: '태어난 시간',
    headerBirthPlace: '태어난 장소',
    headerGender: '성별',
    headerAnalysisYear: '분석 대상 연도',
    headerConcern: '현재 상황/궁금한 점',
  };
}

function getFormLabel(locale, key) {
  const labels = {
    en: {
      '타로 입력 정보': 'Tarot Input',
      '풍수지리 입력 정보': 'Feng Shui Input',
      '관상/손금 안내': 'Physiognomy Guide',
      '돈 상황': 'Money Situation',
      '재정 상태': 'Financial Status',
      '수입 형태': 'Income Type',
      '주요 고민': 'Main Concern',
      '선택 상황': 'Choice Scenario',
      '단기/장기': 'Short/Long Term',
      '현재 고민': 'Current Concern',
      '현재 상태': 'Current Status',
      '상대 존재': 'Partner Presence',
      '관계 단계': 'Relationship Stage',
      '나이/시기': 'Age/Timing',
      '궁금한 것': 'Question',
      '특정 인물': 'Specific Person',
      '현재 상황': 'Current Situation',
      상태: 'Status',
      '상황 분야': 'Situation Area',
      '관련 인물': 'Related Person',
      '궁금한 포인트': 'Focus Point',
      '위치 정보': 'Location Info',
      '집 유형': 'Home Type',
      '집 구조': 'Home Layout',
      고민: 'Concern',
      '중요 기준': 'Priority',
      도시: 'City',
      '집 방향': 'Home Direction',
      '집 형태': 'Home Style',
      '침실 방향': 'Bedroom Direction',
      작업공간: 'Workspace',
      '머무는 위치': 'Frequent Spot',
    },
    zh: {
      '타로 입력 정보': '塔罗输入信息',
      '풍수지리 입력 정보': '风水输入信息',
      '관상/손금 안내': '面相/手相说明',
      '돈 상황': '财务现状',
      '재정 상태': '财务状态',
      '수입 형태': '收入类型',
      '주요 고민': '主要困惑',
      '선택 상황': '选择情境',
      '단기/장기': '短期/长期',
      '현재 고민': '当前困惑',
      '현재 상태': '当前状态',
      '상대 존재': '是否有对象',
      '관계 단계': '关系阶段',
      '나이/시기': '年龄/时期',
      '궁금한 것': '想了解的问题',
      '특정 인물': '特定对象',
      '현재 상황': '当前情况',
      상태: '状态',
      '상황 분야': '问题领域',
      '관련 인물': '相关人物',
      '궁금한 포인트': '关注点',
      '위치 정보': '位置信息',
      '집 유형': '房屋类型',
      '집 구조': '房屋结构',
      고민: '烦恼',
      '중요 기준': '优先标准',
      도시: '城市',
      '집 방향': '房屋朝向',
      '집 형태': '房屋形态',
      '침실 방향': '卧室朝向',
      작업공간: '工作空间',
      '머무는 위치': '常待位置',
    },
    ja: {
      '타로 입력 정보': 'タロット入力情報',
      '풍수지리 입력 정보': '風水入力情報',
      '관상/손금 안내': '観相/手相ガイド',
      '돈 상황': 'お金の状況',
      '재정 상태': '財政状態',
      '수입 형태': '収入形態',
      '주요 고민': '主な悩み',
      '선택 상황': '選択状況',
      '단기/장기': '短期/長期',
      '현재 고민': '現在の悩み',
      '현재 상태': '現在の状態',
      '상대 존재': '相手の有無',
      '관계 단계': '関係段階',
      '나이/시기': '年齢/時期',
      '궁금한 것': '知りたいこと',
      '특정 인물': '特定の相手',
      '현재 상황': '現在の状況',
      상태: '状態',
      '상황 분야': '状況分野',
      '관련 인물': '関連人物',
      '궁금한 포인트': '気になるポイント',
      '위치 정보': '位置情報',
      '집 유형': '住宅タイプ',
      '집 구조': '住宅構造',
      고민: '悩み',
      '중요 기준': '重視基準',
      도시: '都市',
      '집 방향': '家の方角',
      '집 형태': '家の形態',
      '침실 방향': '寝室の方角',
      작업공간: '作業スペース',
      '머무는 위치': 'よくいる場所',
    },
  };

  return labels[locale]?.[key] || key;
}

function localizeHeaderText(text, locale) {
  if (locale === 'ko') return text;

  const replacementsByLocale = {
    en: [
      ['0. 사용자 입력', '0. User Input'],
      ['다음 정보를 바탕으로 분석하세요.', 'Analyze based on the following information.'],
      ['[자유 입력]', '[Free Input]'],
      ['[구조 입력 - 선택]', '[Structured Input - Select]'],
      ['현재 돈 상황이나 고민:', 'Current money situation or concern:'],
      ['현재 재정 상태:', 'Current financial status:'],
      ['수입 형태:', 'Income type:'],
      ['주요 고민:', 'Main concern:'],
      ['선택 상황:', 'Choice scenario:'],
      ['단기 vs 장기 중 보고 싶은 것:', 'Preferred horizon (short vs long):'],
      ['현재 연애 상황이나 궁금한 점:', 'Current romance situation or question:'],
      ['현재 연애 상황 또는 배우자 관련 고민:', 'Current romance status or spouse-related concern:'],
      ['현재 직업/진로 상황이나 고민:', 'Current career situation or concern:'],
      ['현재 상태:', 'Current status:'],
      ['상대 존재:', 'Partner status:'],
      ['관계 단계:', 'Relationship stage:'],
      ['궁금한 것:', 'Question:'],
      ['나이 / 시기:', 'Age / Timing:'],
      ['특정 인물 여부:', 'Specific person:'],
      ['상황 분야:', 'Situation area:'],
      ['관련 인물:', 'Related person:'],
      ['궁금한 포인트:', 'Focus point:'],
      ['선택 상황 (있다면):', 'Choice scenario (if any):'],
      ['※ 일부만 작성해도 됨', '* You can fill only part of it'],
      ['[현재 거주 공간]', '[Current Living Space]'],
      ['도시:', 'City:'],
      ['집 방향 (현관 기준 or 창 기준 명확히):', 'Home direction (entrance/window basis):'],
      ['집 형태:', 'Home type:'],
      ['[공간 구성]', '[Space Setup]'],
      ['침실 방향:', 'Bedroom direction:'],
      ['작업공간 방향:', 'Workspace direction:'],
      ['자주 머무는 위치:', 'Frequent spot:'],
      ['위치 정보:', 'Location info:'],
      ['집 구조:', 'Home layout:'],
      ['고민:', 'Concern:'],
      ['중요 기준:', 'Priority:'],
      ['생년월일:', 'Date of Birth:'],
      ['태어난 시간:', 'Time of Birth:'],
      ['태어난 장소:', 'Place of Birth:'],
      ['성별:', 'Gender:'],
      ['분석 대상 연도:', 'Analysis Year:'],
      ['현재 상황/궁금한 점:', 'Current Situation / Question:'],
      ['본인의 얼굴 사진과 같이 입력하세요.', 'Please provide your own face photo together with the prompt.'],
      ['본인의 손금 사진과 함께 입력하세요.', 'Please provide your own palm photo together with the prompt.'],
      ['본인의 이미지와 함께 입력하세요.', 'Please provide your own image together with the prompt.'],
      ['(24시간 기준)', '(24h)'],
      ['안정', 'Stable'],
      ['불안정', 'Unstable'],
      ['적자', 'Deficit'],
      ['여유 있음', 'Surplus'],
      ['고정 수입', 'Fixed income'],
      ['프리랜서', 'Freelancer'],
      ['투자', 'Investment'],
      ['없음', 'None'],
      ['돈이 안 모이는 이유', 'Why money is not accumulating'],
      ['수입 증가 가능성', 'Possibility of income increase'],
      ['투자/사업 방향', 'Investment/Business direction'],
      ['이직 vs 유지', 'Change jobs vs Stay'],
      ['직접 입력', 'Custom input'],
      ['단기+장기 모두', 'Both short-term and long-term'],
      ['단기', 'Short-term'],
      ['장기', 'Long-term'],
      ['솔로', 'Single'],
      ['썸', 'Talking stage'],
      ['연애 중', 'In a relationship'],
      ['이별 후', 'After breakup'],
      ['복잡한 관계', 'Complicated relationship'],
      ['배우자운 전반', 'Overall spouse fortune'],
      ['언제 결혼 흐름이 오는지', 'When marriage momentum comes'],
      ['어떤 사람을 만나게 되는지', 'What kind of person you may meet'],
      ['현재 만나는 사람이 배우자인지', 'Whether current partner is a spouse match'],
      ['결혼이 가능한 관계인지', 'Whether this relationship can lead to marriage'],
      ['상대 속마음', "Partner's true feelings"],
      ['관계 발전 가능성', 'Relationship growth potential'],
      ['재회 가능성', 'Possibility of reconciliation'],
      ['새로운 인연 가능성', 'Possibility of new relationship'],
      ['고백/관계진전 타이밍', 'Confession/relationship progress timing'],
      ['주요 고민 직접 입력', 'Enter main concern'],
      ['선택 입력', 'Enter your choice'],
      ['이 사람 vs 다른 가능성', 'This person vs another possibility'],
      ['궁금한 것 직접 입력', 'Enter your question'],
      ['A회사 vs B회사', 'Company A vs Company B'],
      ['기타 상황 분야 직접 입력', 'Enter other situation area'],
      ['예: 썸, 갈등 중, 고민 중', 'e.g., talking stage, in conflict, undecided'],
      ['예: 나 / 상대 / 여러 명 관계', 'e.g., me / partner / multiple people'],
      ['예: 상대 심리, 관계 흐름, 선택 고민', 'e.g., partner psychology, relationship flow, choice dilemma'],
      ['A vs B 형태', 'A vs B format'],
      ['가능하면 지역 / 방향 / 층수 등', 'If possible: area / direction / floor, etc.'],
      ['대략적인 구조 or 특징 (예: 바로 방 / 창문 위치 / 화장실 위치 등)', 'Approximate layout or features (e.g., room right away / window location / bathroom location)'],
      ['예: 이 집 가도 되는지, 현재 집 계속 살아도 되는지, 이사 타이밍, A 집 vs B 집 비교', 'e.g., whether to move into this house, whether to stay, moving timing, House A vs House B'],
      ['돈 / 건강 / 인간관계 / 안정감 등', 'Money / health / relationships / stability, etc.'],
      ['예: 서울', 'e.g., Seoul'],
      ['현관 기준 또는 창 기준 명확히', 'Specify entrance or window as the basis'],
      ['아파트 / 주택 / 원룸 등', 'Apartment / house / studio, etc.'],
      ['예: 동향', 'e.g., East-facing'],
      ['작업공간 방향', 'Workspace direction'],
      ['자주 머무는 위치', 'Frequent spot'],
      ['있음', 'Yes'],
      ['없음', 'No'],
      ['재직 중', 'Employed'],
      ['구직 중', 'Job seeking'],
      ['이직 준비', 'Preparing job change'],
      ['사업', 'Business'],
      ['이직 시기', 'Job change timing'],
      ['합격 가능성', 'Chance of acceptance'],
      ['직장 내 관계', 'Workplace relationships'],
      ['수입 상승', 'Income growth'],
      ['연애', 'Romance'],
      ['인간관계', 'Relationships'],
      ['진로', 'Career path'],
      ['금전', 'Finance'],
      ['기타', 'Other'],
      ['거주 중', 'Currently living'],
      ['이사 고민', 'Considering moving'],
      ['이미 계약', 'Already contracted'],
      ['선택 중', 'Choosing'],
      ['원룸', 'Studio'],
      ['아파트', 'Apartment'],
      ['오피스텔', 'Officetel'],
      ['주택', 'House'],
      ['양력', 'Solar'],
      ['음력', 'Lunar'],
      ['미공개', 'Private'],
    ],
    zh: [
      ['0. 사용자 입력', '0. 用户输入'],
      ['다음 정보를 바탕으로 분석하세요.', '请基于以下信息进行分析。'],
      ['[자유 입력]', '[自由输入]'],
      ['[구조 입력 - 선택]', '[结构输入 - 选择]'],
      ['현재 돈 상황이나 고민:', '当前财务情况或烦恼:'],
      ['현재 재정 상태:', '当前财务状态:'],
      ['수입 형태:', '收入类型:'],
      ['주요 고민:', '主要困惑:'],
      ['선택 상황:', '选择情境:'],
      ['단기 vs 장기 중 보고 싶은 것:', '希望查看（短期/长期）:'],
      ['현재 연애 상황이나 궁금한 점:', '当前恋爱情况或疑问:'],
      ['현재 연애 상황 또는 배우자 관련 고민:', '当前恋爱状态或配偶相关烦恼:'],
      ['현재 직업/진로 상황이나 고민:', '当前职业/发展情况或烦恼:'],
      ['현재 상태:', '当前状态:'],
      ['상대 존재:', '是否有对象:'],
      ['관계 단계:', '关系阶段:'],
      ['궁금한 것:', '想了解的问题:'],
      ['나이 / 시기:', '年龄/时期:'],
      ['특정 인물 여부:', '是否有特定对象:'],
      ['상황 분야:', '问题领域:'],
      ['관련 인물:', '相关人物:'],
      ['궁금한 포인트:', '关注点:'],
      ['선택 상황 (있다면):', '选择情境（如有）:'],
      ['※ 일부만 작성해도 됨', '* 可只填写部分内容'],
      ['[현재 거주 공간]', '[当前居住空间]'],
      ['도시:', '城市:'],
      ['집 방향 (현관 기준 or 창 기준 명확히):', '房屋朝向（请注明基准）:'],
      ['집 형태:', '房屋类型:'],
      ['[공간 구성]', '[空间构成]'],
      ['침실 방향:', '卧室朝向:'],
      ['작업공간 방향:', '工作空间朝向:'],
      ['자주 머무는 위치:', '常待位置:'],
      ['위치 정보:', '位置信息:'],
      ['집 구조:', '房屋结构:'],
      ['고민:', '烦恼:'],
      ['중요 기준:', '优先标准:'],
      ['생년월일:', '出生日期:'],
      ['태어난 시간:', '出生时间:'],
      ['태어난 장소:', '出生地:'],
      ['성별:', '性别:'],
      ['분석 대상 연도:', '分析年份:'],
      ['현재 상황/궁금한 점:', '当前情况/疑问:'],
      ['본인의 얼굴 사진과 같이 입력하세요.', '请附上本人面部照片一起输入。'],
      ['본인의 손금 사진과 함께 입력하세요.', '请附上本人手相照片一起输入。'],
      ['본인의 이미지와 함께 입력하세요.', '请附上本人图片一起输入。'],
      ['(24시간 기준)', '(24小时制)'],
      ['안정', '稳定'],
      ['불안정', '不稳定'],
      ['적자', '赤字'],
      ['여유 있음', '有余裕'],
      ['고정 수입', '固定收入'],
      ['프리랜서', '自由职业'],
      ['투자', '投资'],
      ['없음', '无'],
      ['돈이 안 모이는 이유', '钱存不下来的原因'],
      ['수입 증가 가능성', '收入增长可能性'],
      ['투자/사업 방향', '投资/事业方向'],
      ['이직 vs 유지', '跳槽 vs 维持'],
      ['직접 입력', '直接输入'],
      ['단기+장기 모두', '短期+长期都'],
      ['단기', '短期'],
      ['장기', '长期'],
      ['솔로', '单身'],
      ['썸', '暧昧期'],
      ['연애 중', '恋爱中'],
      ['이별 후', '分手后'],
      ['복잡한 관계', '复杂关系'],
      ['배우자운 전반', '配偶运总体'],
      ['언제 결혼 흐름이 오는지', '何时出现结婚趋势'],
      ['어떤 사람을 만나게 되는지', '会遇到怎样的人'],
      ['현재 만나는 사람이 배우자인지', '当前对象是否适合成为配偶'],
      ['결혼이 가능한 관계인지', '是否是可结婚的关系'],
      ['상대 속마음', '对方真实想法'],
      ['관계 발전 가능성', '关系发展可能性'],
      ['재회 가능성', '复合可能性'],
      ['새로운 인연 가능성', '新缘分可能性'],
      ['고백/관계진전 타이밍', '告白/关系推进时机'],
      ['주요 고민 직접 입력', '直接输入主要困惑'],
      ['선택 입력', '输入选项'],
      ['이 사람 vs 다른 가능성', '此人 vs 其他可能性'],
      ['궁금한 것 직접 입력', '直接输入问题'],
      ['A회사 vs B회사', 'A公司 vs B公司'],
      ['기타 상황 분야 직접 입력', '直接输入其他问题领域'],
      ['예: 썸, 갈등 중, 고민 중', '例如：暧昧期、冲突中、犹豫中'],
      ['예: 나 / 상대 / 여러 명 관계', '例如：我 / 对方 / 多人关系'],
      ['예: 상대 심리, 관계 흐름, 선택 고민', '例如：对方心理、关系走势、选择困惑'],
      ['A vs B 형태', 'A vs B 形式'],
      ['가능하면 지역 / 방향 / 층수 등', '尽量填写地区 / 朝向 / 楼层等'],
      ['대략적인 구조 or 특징 (예: 바로 방 / 창문 위치 / 화장실 위치 등)', '大致结构或特点（例如：进门就是房间 / 窗户位置 / 卫生间位置等）'],
      ['예: 이 집 가도 되는지, 현재 집 계속 살아도 되는지, 이사 타이밍, A 집 vs B 집 비교', '例如：是否适合搬到这套房、是否继续住现在的房、搬家时机、A房 vs B房比较'],
      ['돈 / 건강 / 인간관계 / 안정감 등', '金钱 / 健康 / 人际关系 / 安定感等'],
      ['예: 서울', '例如：首尔'],
      ['현관 기준 또는 창 기준 명확히', '请明确以玄关或窗户为基准'],
      ['아파트 / 주택 / 원룸 등', '公寓 / 住宅 / 单间等'],
      ['예: 동향', '例如：朝东'],
      ['작업공간 방향', '工作空间朝向'],
      ['자주 머무는 위치', '经常停留的位置'],
      ['있음', '有'],
      ['없음', '无'],
      ['재직 중', '在职中'],
      ['구직 중', '求职中'],
      ['이직 준비', '准备跳槽'],
      ['사업', '创业'],
      ['이직 시기', '跳槽时机'],
      ['합격 가능성', '录取可能性'],
      ['직장 내 관계', '职场人际关系'],
      ['수입 상승', '收入上升'],
      ['연애', '恋爱'],
      ['인간관계', '人际关系'],
      ['진로', '职业方向'],
      ['금전', '金钱'],
      ['기타', '其他'],
      ['거주 중', '居住中'],
      ['이사 고민', '考虑搬家'],
      ['이미 계약', '已签约'],
      ['선택 중', '选择中'],
      ['원룸', '单间'],
      ['아파트', '公寓'],
      ['오피스텔', '商住公寓'],
      ['주택', '住宅'],
      ['양력', '阳历'],
      ['음력', '农历'],
      ['미공개', '不公开'],
    ],
    ja: [
      ['0. 사용자 입력', '0. ユーザー入力'],
      ['다음 정보를 바탕으로 분석하세요.', '次の情報をもとに分析してください。'],
      ['[자유 입력]', '[自由入力]'],
      ['[구조 입력 - 선택]', '[構造入力 - 選択]'],
      ['현재 돈 상황이나 고민:', '現在のお金の状況や悩み:'],
      ['현재 재정 상태:', '現在の財政状態:'],
      ['수입 형태:', '収入形態:'],
      ['주요 고민:', '主な悩み:'],
      ['선택 상황:', '選択状況:'],
      ['단기 vs 장기 중 보고 싶은 것:', '短期/長期の希望:'],
      ['현재 연애 상황이나 궁금한 점:', '現在の恋愛状況や質問:'],
      ['현재 연애 상황 또는 배우자 관련 고민:', '現在の恋愛状況または配偶者に関する悩み:'],
      ['현재 직업/진로 상황이나 고민:', '現在の仕事/進路状況や悩み:'],
      ['현재 상태:', '現在の状態:'],
      ['상대 존재:', '相手の有無:'],
      ['관계 단계:', '関係の段階:'],
      ['궁금한 것:', '知りたいこと:'],
      ['나이 / 시기:', '年齢/時期:'],
      ['특정 인물 여부:', '特定人物の有無:'],
      ['상황 분야:', '状況分野:'],
      ['관련 인물:', '関連人物:'],
      ['궁금한 포인트:', '気になるポイント:'],
      ['선택 상황 (있다면):', '選択状況（ある場合）:'],
      ['※ 일부만 작성해도 됨', '* 一部のみ入力でも可'],
      ['[현재 거주 공간]', '[現在の居住空間]'],
      ['도시:', '都市:'],
      ['집 방향 (현관 기준 or 창 기준 명확히):', '家の方角（基準を明記）:'],
      ['집 형태:', '家の形態:'],
      ['[공간 구성]', '[空間構成]'],
      ['침실 방향:', '寝室の方角:'],
      ['작업공간 방향:', '作業空間の方角:'],
      ['자주 머무는 위치:', 'よくいる場所:'],
      ['위치 정보:', '位置情報:'],
      ['집 구조:', '家の構造:'],
      ['고민:', '悩み:'],
      ['중요 기준:', '重視基準:'],
      ['생년월일:', '生年月日:'],
      ['태어난 시간:', '出生時間:'],
      ['태어난 장소:', '出生地:'],
      ['성별:', '性別:'],
      ['분석 대상 연도:', '分析対象年:'],
      ['현재 상황/궁금한 점:', '現在の状況・質問:'],
      ['본인의 얼굴 사진과 같이 입력하세요.', 'ご本人の顔写真を一緒に入力してください。'],
      ['본인의 손금 사진과 함께 입력하세요.', 'ご本人の手相写真を一緒に入力してください。'],
      ['본인의 이미지와 함께 입력하세요.', 'ご本人の画像を一緒に入力してください。'],
      ['(24시간 기준)', '(24時間制)'],
      ['안정', '安定'],
      ['불안정', '不安定'],
      ['적자', '赤字'],
      ['여유 있음', '余裕あり'],
      ['고정 수입', '固定収入'],
      ['프리랜서', 'フリーランス'],
      ['투자', '投資'],
      ['없음', 'なし'],
      ['돈이 안 모이는 이유', 'お金が貯まらない理由'],
      ['수입 증가 가능성', '収入増加の可能性'],
      ['투자/사업 방향', '投資/事業の方向性'],
      ['이직 vs 유지', '転職 vs 維持'],
      ['직접 입력', '直接入力'],
      ['단기+장기 모두', '短期+長期の両方'],
      ['단기', '短期'],
      ['장기', '長期'],
      ['솔로', 'シングル'],
      ['썸', '曖昧な関係'],
      ['연애 중', '交際中'],
      ['이별 후', '別れた後'],
      ['복잡한 관계', '複雑な関係'],
      ['배우자운 전반', '配偶者運全般'],
      ['언제 결혼 흐름이 오는지', '結婚の流れがいつ来るか'],
      ['어떤 사람을 만나게 되는지', 'どんな人と出会うか'],
      ['현재 만나는 사람이 배우자인지', '今の相手が配偶者になる可能性'],
      ['결혼이 가능한 관계인지', '結婚可能な関係か'],
      ['상대 속마음', '相手の本音'],
      ['관계 발전 가능성', '関係発展の可能性'],
      ['재회 가능성', '復縁の可能性'],
      ['새로운 인연 가능성', '新しい縁の可能性'],
      ['고백/관계진전 타이밍', '告白/関係進展のタイミング'],
      ['주요 고민 직접 입력', '主な悩みを直接入力'],
      ['선택 입력', '入力'],
      ['이 사람 vs 다른 가능성', 'この人 vs 他の可能性'],
      ['궁금한 것 직접 입력', '知りたいことを直接入力'],
      ['A회사 vs B회사', 'A社 vs B社'],
      ['기타 상황 분야 직접 입력', 'その他の状況分野を直接入力'],
      ['예: 썸, 갈등 중, 고민 중', '例：曖昧な関係、対立中、悩み中'],
      ['예: 나 / 상대 / 여러 명 관계', '例：自分 / 相手 / 複数人の関係'],
      ['예: 상대 심리, 관계 흐름, 선택 고민', '例：相手の心理、関係の流れ、選択の悩み'],
      ['A vs B 형태', 'A vs B 形式'],
      ['가능하면 지역 / 방향 / 층수 등', '可能なら地域 / 方角 / 階数など'],
      ['대략적인 구조 or 특징 (예: 바로 방 / 창문 위치 / 화장실 위치 등)', 'おおよその間取りや特徴（例：すぐ部屋 / 窓の位置 / トイレの位置など）'],
      ['예: 이 집 가도 되는지, 현재 집 계속 살아도 되는지, 이사 타이밍, A 집 vs B 집 비교', '例：この家に住んでよいか、今の家に住み続けるべきか、引っ越し時期、A物件 vs B物件比較'],
      ['돈 / 건강 / 인간관계 / 안정감 등', 'お金 / 健康 / 人間関係 / 安定感 など'],
      ['예: 서울', '例：ソウル'],
      ['현관 기준 또는 창 기준 명확히', '玄関基準か窓基準かを明確に'],
      ['아파트 / 주택 / 원룸 등', 'アパート / 住宅 / ワンルーム など'],
      ['예: 동향', '例：東向き'],
      ['작업공간 방향', '作業空間の方角'],
      ['자주 머무는 위치', 'よくいる場所'],
      ['있음', 'あり'],
      ['없음', 'なし'],
      ['재직 중', '在職中'],
      ['구직 중', '求職中'],
      ['이직 준비', '転職準備中'],
      ['사업', '事業'],
      ['이직 시기', '転職の時期'],
      ['합격 가능성', '合格可能性'],
      ['직장 내 관계', '職場内の人間関係'],
      ['수입 상승', '収入上昇'],
      ['연애', '恋愛'],
      ['인간관계', '人間関係'],
      ['진로', '進路'],
      ['금전', '金銭'],
      ['기타', 'その他'],
      ['거주 중', '居住中'],
      ['이사 고민', '引っ越し検討中'],
      ['이미 계약', '契約済み'],
      ['선택 중', '選択中'],
      ['원룸', 'ワンルーム'],
      ['아파트', 'アパート'],
      ['오피스텔', 'オフィステル'],
      ['주택', '住宅'],
      ['양력', '新暦'],
      ['음력', '旧暦'],
      ['미공개', '非公開'],
    ],
  };

  let localized = String(text || '');
  for (const [from, to] of replacementsByLocale[locale] || []) {
    localized = localized.split(from).join(to);
  }

  return localized;
}

function applyYearReplacement(text, analysisYearInput) {
  const { yearNumber } = resolveAnalysisYear(analysisYearInput);
  let updated = String(text || '');
  updated = updated.replace(/\b(19|20)\d{2}\s*년/g, `${yearNumber}년`);
  updated = updated.replace(/\b(19|20)\d{2}\s*年/g, `${yearNumber}年`);
  updated = updated.replace(/\b(19|20)\d{2}\b/g, yearNumber);
  return updated;
}

function resolveWealthMainConcern(tarotForm) {
  const custom = String(tarotForm.mainConcernCustom || '').trim();
  if (tarotForm.mainConcern === '직접 입력') return custom;
  return String(tarotForm.mainConcern || '').trim();
}

function resolveCareerQuestion(tarotForm) {
  const custom = String(tarotForm.careerQuestionCustom || '').trim();
  if (tarotForm.careerQuestion === '직접 입력') return custom;
  return String(tarotForm.careerQuestion || '').trim();
}

function resolveGenericSituationArea(tarotForm) {
  const custom = String(tarotForm.genericSituationAreaCustom || '').trim();
  if (tarotForm.genericSituationArea === '기타' && hasValue(custom)) return custom;
  return String(tarotForm.genericSituationArea || '').trim();
}

function getPhysiognomyGuide(title) {
  if (String(title || '').includes('얼굴')) return '본인의 얼굴 사진과 같이 입력하세요.';
  if (String(title || '').includes('손금')) return '본인의 손금 사진과 함께 입력하세요.';
  return '본인의 이미지와 함께 입력하세요.';
}

function buildFengshuiHeader(fengshuiForm, isMovingFengshui) {
  if (isMovingFengshui) {
    const moveStatus = String(fengshuiForm.moveStatus || '').trim();
    const moveHomeType = String(fengshuiForm.moveHomeType || '').trim();
    const moveLocationInfo = String(fengshuiForm.moveLocationInfo || '').trim();
    const moveHomeStructure = String(fengshuiForm.moveHomeStructure || '').trim();
    const moveConcern = String(fengshuiForm.moveConcern || '').trim();
    const movePriority = String(fengshuiForm.movePriority || '').trim();

    const hasAny = [moveStatus, moveHomeType, moveLocationInfo, moveHomeStructure, moveConcern, movePriority].some(hasValue);
    if (!hasAny) return '';

    const lines = ['[구조 입력 - 선택]', ''];
    if (hasValue(moveStatus)) lines.push(`현재 상태: ${moveStatus}`);
    if (hasValue(moveHomeType)) lines.push(`집 유형: ${moveHomeType}`);
    if (hasValue(moveLocationInfo)) lines.push(`위치 정보: ${moveLocationInfo}`);
    if (hasValue(moveHomeStructure)) lines.push(`집 구조: ${moveHomeStructure}`);
    if (hasValue(moveConcern)) lines.push(`고민: ${moveConcern}`);
    if (hasValue(movePriority)) lines.push(`중요 기준: ${movePriority}`);
    lines.push('');
    return lines.join('\n');
  }

  const city = String(fengshuiForm.city || '').trim();
  const homeDirection = String(fengshuiForm.homeDirection || '').trim();
  const homeType = String(fengshuiForm.homeType || '').trim();
  const bedroomDirection = String(fengshuiForm.bedroomDirection || '').trim();
  const workspaceDirection = String(fengshuiForm.workspaceDirection || '').trim();
  const stayingPosition = String(fengshuiForm.stayingPosition || '').trim();

  const hasCurrent = [city, homeDirection, homeType].some(hasValue);
  const hasSpace = [bedroomDirection, workspaceDirection, stayingPosition].some(hasValue);
  if (!hasCurrent && !hasSpace) return '';

  const lines = [];

  if (hasCurrent) {
    lines.push('[현재 거주 공간]', '');
    if (hasValue(city)) lines.push(`도시: ${city}`);
    if (hasValue(homeDirection)) lines.push(`집 방향 (현관 기준 or 창 기준 명확히): ${homeDirection}`);
    if (hasValue(homeType)) lines.push(`집 형태: ${homeType}`);
    lines.push('');
  }

  if (hasSpace) {
    lines.push('[공간 구성]', '');
    if (hasValue(bedroomDirection)) lines.push(`침실 방향: ${bedroomDirection}`);
    if (hasValue(workspaceDirection)) lines.push(`작업공간 방향: ${workspaceDirection}`);
    if (hasValue(stayingPosition)) lines.push(`자주 머무는 위치: ${stayingPosition}`);
    lines.push('');
  }

  return lines.join('\n');
}

function buildBasicHeader(form) {
  const calendarLabel = form.calendarType === 'lunar' ? '음력' : '양력';
  const genderLabel = form.gender === 'male' ? '남' : form.gender === 'female' ? '여' : form.gender === 'private' ? '미공개' : '';
  const year = String(form.birthYear || '').trim();
  const month = String(form.birthMonth || '').trim();
  const day = String(form.birthDay || '').trim();
  const hour = String(form.birthHour || '').trim();
  const minute = String(form.birthMinute || '').trim();
  const country = String(form.birthCountry || '').trim();
  const city = String(form.birthCity || '').trim();
  const analysisYear = resolveAnalysisYear(form.analysisYear).label;
  const concern = String(form.concern || '').trim();

  const lines = ['0. 사용자 입력', ''];

  if (hasValue(year) || hasValue(month) || hasValue(day)) {
    const dateParts = [];
    if (hasValue(year)) dateParts.push(`${year}년`);
    if (hasValue(month)) dateParts.push(`${month}월`);
    if (hasValue(day)) dateParts.push(`${day}일`);
    lines.push(`생년월일: ${dateParts.join(' ')} (${calendarLabel})`);
  }

  if (hasValue(hour) || hasValue(minute)) {
    const timeParts = [];
    if (hasValue(hour)) timeParts.push(`${hour}시`);
    if (hasValue(minute)) timeParts.push(`${minute}분`);
    lines.push(`태어난 시간: ${timeParts.join(' ')} (24시간 기준)`);
  }

  if (hasValue(country) || hasValue(city)) {
    lines.push(`태어난 장소: ${[country, city].filter(hasValue).join(' ')}`);
  }

  if (hasValue(genderLabel)) {
    lines.push(`성별: ${genderLabel}`);
  }

  lines.push(`분석 대상 연도: ${analysisYear}`);

  if (hasValue(concern)) {
    lines.push(`현재 상황/궁금한 점: ${concern}`);
  }

  lines.push('');
  return lines.join('\n');
}

function buildBasicHeaderByLocale(form, locale) {
  if (locale === 'ko') return buildBasicHeader(form);

  const i18n = getBasicInputI18n(locale);
  const calendarLabel = form.calendarType === 'lunar' ? i18n.lunarLabel : i18n.solarLabel;
  const genderLabel =
    form.gender === 'male' ? i18n.maleLabel : form.gender === 'female' ? i18n.femaleLabel : form.gender === 'private' ? i18n.privateLabel : '';
  const year = String(form.birthYear || '').trim();
  const month = String(form.birthMonth || '').trim();
  const day = String(form.birthDay || '').trim();
  const hour = String(form.birthHour || '').trim();
  const minute = String(form.birthMinute || '').trim();
  const country = String(form.birthCountry || '').trim();
  const city = String(form.birthCity || '').trim();
  const { yearNumber } = resolveAnalysisYear(form.analysisYear);
  const concern = String(form.concern || '').trim();

  const lines = [i18n.headerUserInput, ''];

  if (hasValue(year) || hasValue(month) || hasValue(day)) {
    if (locale === 'en') {
      const yyyy = hasValue(year) ? year : 'YYYY';
      const mm = hasValue(month) ? month.padStart(2, '0') : 'MM';
      const dd = hasValue(day) ? day.padStart(2, '0') : 'DD';
      lines.push(`${i18n.headerBirthDate}: ${yyyy}-${mm}-${dd} (${calendarLabel})`);
    } else {
      const dateParts = [];
      if (hasValue(year)) dateParts.push(`${year}${i18n.yearUnit}`);
      if (hasValue(month)) dateParts.push(`${month}${i18n.monthUnit}`);
      if (hasValue(day)) dateParts.push(`${day}${i18n.dayUnit}`);
      lines.push(`${i18n.headerBirthDate}: ${dateParts.join(' ')} (${calendarLabel})`);
    }
  }

  if (hasValue(hour) || hasValue(minute)) {
    if (locale === 'en') {
      const hh = hasValue(hour) ? hour.padStart(2, '0') : '00';
      const mm = hasValue(minute) ? minute.padStart(2, '0') : '00';
      lines.push(`${i18n.headerBirthTime}: ${hh}:${mm} (24h)`);
    } else {
      const timeParts = [];
      if (hasValue(hour)) timeParts.push(`${hour}${i18n.hourUnit}`);
      if (hasValue(minute)) timeParts.push(`${minute}${i18n.minuteUnit}`);
      lines.push(`${i18n.headerBirthTime}: ${timeParts.join(' ')} (24h)`);
    }
  }

  if (hasValue(country) || hasValue(city)) {
    lines.push(`${i18n.headerBirthPlace}: ${[country, city].filter(hasValue).join(' ')}`);
  }

  if (hasValue(genderLabel)) {
    lines.push(`${i18n.headerGender}: ${genderLabel}`);
  }

  const analysisYearValue = locale === 'en' ? yearNumber : `${yearNumber}${i18n.yearUnit}`;
  lines.push(`${i18n.headerAnalysisYear}: ${analysisYearValue}`);

  if (hasValue(concern)) {
    lines.push(`${i18n.headerConcern}: ${concern}`);
  }

  lines.push('');
  return lines.join('\n');
}

function applyBasicReplacements(text, form, promptTitle) {
  const calendarLabel = form.calendarType === 'lunar' ? '음력' : '양력';
  const genderLabel =
    form.gender === 'male'
      ? '남'
      : form.gender === 'female'
        ? '여'
        : form.gender === 'private'
          ? '미공개'
          : '';
  const year = String(form.birthYear || '').trim();
  const month = String(form.birthMonth || '').trim();
  const day = String(form.birthDay || '').trim();
  const hour = String(form.birthHour || '').trim();
  const minute = String(form.birthMinute || '').trim();
  const country = String(form.birthCountry || '').trim();
  const city = String(form.birthCity || '').trim();
  const { label: analysisYear, yearNumber } = resolveAnalysisYear(form.analysisYear);

  let updated = text;

  if (hasValue(year) || hasValue(month) || hasValue(day)) {
    const dateParts = [];
    if (hasValue(year)) dateParts.push(`${year}년`);
    if (hasValue(month)) dateParts.push(`${month}월`);
    if (hasValue(day)) dateParts.push(`${day}일`);
    updated = updated.replace(/생년월일:\s*[^\n]*/g, `생년월일: ${dateParts.join(' ')} (${calendarLabel})`);
  }

  if (hasValue(hour) || hasValue(minute)) {
    const timeParts = [];
    if (hasValue(hour)) timeParts.push(`${hour}시`);
    if (hasValue(minute)) timeParts.push(`${minute}분`);
    updated = updated.replace(/(태어난 시간|출생시간):\s*[^\n]*/g, (m, label) => `${label}: ${timeParts.join(' ')} (24시간 기준)`);
  }

  if (hasValue(country) || hasValue(city)) {
    updated = updated.replace(/(태어난 장소|출생지):\s*[^\n]*/g, (m, label) => `${label}: ${[country, city].filter(hasValue).join(' ')}`);
  }

  if (hasValue(genderLabel)) {
    updated = updated.replace(/성별:\s*[^\n]*/g, `성별: ${genderLabel}`);
  }

  updated = updated.replace(/분석 대상 연도:\s*[^\n]*/g, `분석 대상 연도: ${analysisYear}`);
  updated = updated.replace(/\b(19|20)\d{2}\s*년/g, `${yearNumber}년`);
  updated = updated.replace(/\b(19|20)\d{2}\b/g, yearNumber);

  if (String(promptTitle || '').includes('연애운 사주')) {
    updated = updated.replace(/^(\s*6\.\s*)\d{4}년(\s*연애운)([^\n]*)/m, `$1${yearNumber}년$2$3`);
    updated = updated.replace(/^(\s*7\.\s*)\d{4}년(\s*월별 연애운)([^\n]*)/m, `$1${yearNumber}년$2$3`);
  }

  if (String(promptTitle || '').includes('배우자운 사주')) {
    updated = updated.replace(/^(\s*\d+\.\s*)\d{4}년(\s*배우자운[^\n]*)/m, `$1${yearNumber}년$2`);
    updated = updated.replace(/^(\s*\d+\.\s*)\d{4}년(\s*월별 배우자운[^\n]*)/m, `$1${yearNumber}년$2`);
  }

  if (String(promptTitle || '').includes('재물운 사주')) {
    updated = updated.replace(/^(\s*\d+\.\s*)\d{4}년(\s*재물운[^\n]*)/m, `$1${yearNumber}년$2`);
  }

  if (String(promptTitle || '').includes('건강운 사주')) {
    updated = updated.replace(/^(\s*\d+\.\s*)\d{4}년(\s*건강운[^\n]*)/m, `$1${yearNumber}년$2`);
  }

  if (String(promptTitle || '').includes('직업운 사주')) {
    updated = updated.replace(/^(\s*\d+\.\s*)\d{4}년(\s*취업\/직업운[^\n]*)/m, `$1${yearNumber}년$2`);
  }

  if (String(promptTitle || '').includes('연애운 점성술')) {
    updated = updated.replace(/^(\s*\d+\.\s*)\d{4}년(\s*연애운[^\n]*)/m, `$1${yearNumber}년$2`);
  }

  if (String(promptTitle || '').includes('배우자운 점성술')) {
    updated = updated.replace(/^(\s*\d+\.\s*)\d{4}년(\s*배우자운[^\n]*)/m, `$1${yearNumber}년$2`);
  }

  if (String(promptTitle || '').includes('재물운 점성술')) {
    updated = updated.replace(/^(\s*\d+\.\s*)\d{4}년(\s*재물운[^\n]*)/m, `$1${yearNumber}년$2`);
  }

  if (String(promptTitle || '').includes('건강운 점성술')) {
    updated = updated.replace(/^(\s*\d+\.\s*)\d{4}년(\s*건강운[^\n]*)/m, `$1${yearNumber}년$2`);
  }

  if (String(promptTitle || '').includes('직업운 점성술')) {
    updated = updated.replace(/^(\s*\d+\.\s*)\d{4}년(\s*취업\/직업운[^\n]*)/m, `$1${yearNumber}년$2`);
  }

  return updated;
}

function buildTarotHeader(type, tarotForm) {
  if (type === 'wealth') {
    const money = String(tarotForm.currentMoneySituation || '').trim();
    const mainConcern = resolveWealthMainConcern(tarotForm);
    const hasStructured = [tarotForm.financialStatus, tarotForm.incomeType, mainConcern, tarotForm.choiceSituation, tarotForm.timeHorizon].some(hasValue);
    const lines = ['0. 사용자 입력', ''];

    if (hasValue(money)) {
      lines.push('[자유 입력]', '', '현재 돈 상황이나 고민:', '', `→ ${money}`, '');
    }

    if (hasStructured) {
      lines.push('[구조 입력 - 선택]');
      if (hasValue(tarotForm.financialStatus)) lines.push(`현재 재정 상태: ${tarotForm.financialStatus}`);
      if (hasValue(tarotForm.incomeType)) lines.push(`수입 형태: ${tarotForm.incomeType}`);
      if (hasValue(mainConcern)) lines.push(`주요 고민: ${mainConcern}`);
      if (hasValue(tarotForm.choiceSituation)) lines.push(`선택 상황: ${tarotForm.choiceSituation}`);
      if (hasValue(tarotForm.timeHorizon)) lines.push(`단기 vs 장기 중 보고 싶은 것: ${tarotForm.timeHorizon}`);
      lines.push('');
    }

    if (hasValue(money) || hasStructured) {
      lines.push('※ 일부만 작성해도 됨', '');
    }

    return lines.join('\n');
  }

  if (type === 'love') {
    const free = String(tarotForm.currentSituation || '').trim();
    const hasStructured = [tarotForm.status, tarotForm.hasPartner, tarotForm.relationshipStage, tarotForm.questionType, tarotForm.choiceSituation].some(hasValue);
    const lines = ['0. 사용자 입력', ''];

    if (hasValue(free)) {
      lines.push('[자유 입력]', '', '', '현재 연애 상황이나 궁금한 점:', free, '');
    }

    if (hasStructured) {
      lines.push('[구조 입력 - 선택]');
      if (hasValue(tarotForm.status)) lines.push(`현재 상태: ${tarotForm.status}`);
      if (hasValue(tarotForm.hasPartner)) lines.push(`상대 존재: ${tarotForm.hasPartner}`);
      if (hasValue(tarotForm.relationshipStage)) lines.push(`관계 단계: ${tarotForm.relationshipStage}`);
      if (hasValue(tarotForm.questionType)) lines.push(`궁금한 것: ${tarotForm.questionType}`);
      if (hasValue(tarotForm.choiceSituation)) lines.push(`선택 상황: ${tarotForm.choiceSituation}`);
      lines.push('');
    }

    if (hasValue(free) || hasStructured) {
      lines.push('※ 일부만 작성해도 됨', '');
    }

    return lines.join('\n');
  }

  if (type === 'spouse') {
    const concern = String(tarotForm.spouseConcern || '').trim();
    const hasStructured = [tarotForm.status, tarotForm.agePeriod, tarotForm.spouseQuestion, tarotForm.specificPerson, tarotForm.choiceSituation].some(hasValue);
    const lines = ['다음 정보를 바탕으로 분석하세요.', ''];

    if (hasValue(concern)) {
      lines.push('[자유 입력]', '', '', `현재 연애 상황 또는 배우자 관련 고민: ${concern}`, '');
    }

    if (hasStructured) {
      lines.push('[구조 입력 - 선택]');
      if (hasValue(tarotForm.status)) lines.push(`현재 상태: ${tarotForm.status}`);
      if (hasValue(tarotForm.agePeriod)) lines.push(`나이 / 시기: ${tarotForm.agePeriod}`);
      if (hasValue(tarotForm.spouseQuestion)) lines.push(`궁금한 것: ${tarotForm.spouseQuestion}`);
      if (hasValue(tarotForm.specificPerson)) lines.push(`특정 인물 여부: ${tarotForm.specificPerson}`);
      if (hasValue(tarotForm.choiceSituation)) lines.push(`선택 상황: ${tarotForm.choiceSituation}`);
      lines.push('');
    }

    if (hasValue(concern) || hasStructured) {
      lines.push('※ 일부만 작성해도 됨', '');
    }

    return lines.join('\n');
  }

  if (type === 'career') {
    const situation = String(tarotForm.careerSituation || '').trim();
    const careerQuestion = resolveCareerQuestion(tarotForm);
    const hasStructured = [tarotForm.careerStatus, careerQuestion, tarotForm.choiceSituation, tarotForm.timeHorizon].some(hasValue);
    const lines = ['0. 사용자 입력', ''];

    if (hasValue(situation)) {
      lines.push('[자유 입력]', '', '', '현재 직업/진로 상황이나 고민:', situation, '');
    }

    if (hasStructured) {
      lines.push('[구조 입력 - 선택]');
      if (hasValue(tarotForm.careerStatus)) lines.push(`현재 상태: ${tarotForm.careerStatus}`);
      if (hasValue(careerQuestion)) lines.push(`궁금한 것: ${careerQuestion}`);
      if (hasValue(tarotForm.choiceSituation)) lines.push(`선택 상황: ${tarotForm.choiceSituation}`);
      if (hasValue(tarotForm.timeHorizon)) lines.push(`단기 vs 장기 중 보고 싶은 것: ${tarotForm.timeHorizon}`);
      lines.push('');
    }

    if (hasValue(situation) || hasStructured) {
      lines.push('※ 일부만 작성해도 됨', '');
    }

    return lines.join('\n');
  }

  const genericSituationArea = resolveGenericSituationArea(tarotForm);
  const hasStructured = [
    genericSituationArea,
    tarotForm.genericCurrentStatus,
    tarotForm.genericRelatedPeople,
    tarotForm.genericQuestionPoint,
    tarotForm.genericChoiceSituation,
  ].some(hasValue);
  const lines = ['0. 사용자 입력', ''];

  if (hasStructured) {
    lines.push('[구조 입력 - 선택]');
    if (hasValue(genericSituationArea)) lines.push(`상황 분야: ${genericSituationArea}`);
    if (hasValue(tarotForm.genericCurrentStatus)) lines.push(`현재 상태: ${tarotForm.genericCurrentStatus}`);
    if (hasValue(tarotForm.genericRelatedPeople)) lines.push(`관련 인물: ${tarotForm.genericRelatedPeople}`);
    if (hasValue(tarotForm.genericQuestionPoint)) lines.push(`궁금한 포인트: ${tarotForm.genericQuestionPoint}`);
    if (hasValue(tarotForm.genericChoiceSituation)) lines.push(`선택 상황 (있다면): ${tarotForm.genericChoiceSituation}`);
    lines.push('');
  }

  if (hasStructured) {
    lines.push('※ 일부만 작성해도 됨', '');
  }

  return lines.join('\n');
}

export default function PromptDetail({ prompt, locale = 'ko' }) {
  const localeMeta = getLocaleMeta(locale);
  const [toastVisible, setToastVisible] = useState(false);
  const [form, setForm] = useState({
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    calendarType: 'solar',
    birthHour: '',
    birthMinute: '',
    birthCountry: '',
    birthCity: '',
    gender: '',
    analysisYear: '',
    concern: '',
  });
  const [tarotForm, setTarotForm] = useState({
    currentSituation: '',
    status: '',
    hasPartner: '',
    relationshipStage: '',
    questionType: '',
    choiceSituation: '',
    currentMoneySituation: '',
    financialStatus: '',
    incomeType: '',
    mainConcern: '',
    mainConcernCustom: '',
    timeHorizon: '',
    careerSituation: '',
    careerStatus: '',
    careerQuestion: '',
    careerQuestionCustom: '',
    spouseConcern: '',
    agePeriod: '',
    spouseQuestion: '',
    specificPerson: '',
    genericSituationArea: '',
    genericSituationAreaCustom: '',
    genericCurrentStatus: '',
    genericRelatedPeople: '',
    genericQuestionPoint: '',
    genericChoiceSituation: '',
  });
  const [fengshuiForm, setFengshuiForm] = useState({
    city: '',
    homeDirection: '',
    homeType: '',
    bedroomDirection: '',
    workspaceDirection: '',
    stayingPosition: '',
    moveStatus: '',
    moveHomeType: '',
    moveLocationInfo: '',
    moveHomeStructure: '',
    moveConcern: '',
    movePriority: '',
  });

  const tarotType = useMemo(() => getTarotType(prompt.title), [prompt.title]);
  const isPhysiognomy = useMemo(() => prompt.category === 'physiognomy', [prompt.category]);
  const physiognomyGuide = useMemo(() => getPhysiognomyGuide(prompt.title), [prompt.title]);
  const localizedPhysiognomyGuide = useMemo(
    () => (locale === 'ko' ? physiognomyGuide : localizeHeaderText(physiognomyGuide, locale)),
    [locale, physiognomyGuide]
  );
  const isMovingFengshui = useMemo(() => prompt.category === 'fengshui' && prompt.title.includes('이사'), [prompt.category, prompt.title]);
  const basicInputI18n = useMemo(() => getBasicInputI18n(locale), [locale]);
  const promptBodyForDisplay = useMemo(() => {
    const withoutUserInput = stripUserInputSection(prompt.promptBody);
    return prompt.category === 'fengshui' ? stripFengshuiInputSection(withoutUserInput) : withoutUserInput;
  }, [prompt.promptBody, prompt.category]);
  const lines = useMemo(() => promptBodyForDisplay.split('\n'), [promptBodyForDisplay]);
  const currentYearNumber = useMemo(() => String(getCurrentYearNumber()), []);
  const formLabel = (key) => getFormLabel(locale, key);
  const uiText = (text) => (locale === 'ko' ? text : localizeHeaderText(text, locale));
  const selectOptionLabel = locale === 'en' ? 'Select' : locale === 'zh' ? '选择' : locale === 'ja' ? '選択' : '선택';
  const koBirthLabelClassName = locale === 'ko' ? 'detail-form-label detail-form-label-ko-nowrap' : 'detail-form-label';

  const handleCopy = async () => {
    const koHeader =
      prompt.category === 'tarot'
        ? buildTarotHeader(tarotType, tarotForm)
        : prompt.category === 'fengshui'
          ? buildFengshuiHeader(fengshuiForm, isMovingFengshui)
          : isPhysiognomy
            ? `${physiognomyGuide}\n\n`
            : buildBasicHeader(form);
    const header =
      prompt.category === 'tarot' || prompt.category === 'fengshui' || isPhysiognomy
        ? locale === 'ko'
          ? koHeader
          : localizeHeaderText(koHeader, locale)
        : buildBasicHeaderByLocale(form, locale);
    const body =
      locale === 'ko'
        ? prompt.category === 'tarot' || prompt.category === 'fengshui' || isPhysiognomy
          ? promptBodyForDisplay
          : applyBasicReplacements(promptBodyForDisplay, form, prompt.title)
        : applyYearReplacement(promptBodyForDisplay, form.analysisYear);
    const copyText = `${header}${body}`;

    try {
      await navigator.clipboard.writeText(copyText);
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 1800);
    } catch (_error) {
      setToastVisible(false);
    }
  };

  const handleInputChange = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handleTarotInputChange = (key) => (event) => {
    setTarotForm((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handleFengshuiInputChange = (key) => (event) => {
    setFengshuiForm((prev) => ({ ...prev, [key]: event.target.value }));
  };

  return (
    <main className="app-shell detail-page">
      <p className="detail-tag">{prompt.tag}</p>
      <h1 className="detail-title">{prompt.detailTitle || prompt.displayTitle || prompt.title}</h1>

      <button type="button" className="copy-button" onClick={handleCopy}>
        &#128203; {localeMeta.copyPrompt}
      </button>

      {prompt.category === 'tarot' ? (
        <section className="detail-form" aria-label={formLabel('타로 입력 정보')}>
          {tarotType === 'wealth' ? (
            <>
              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('돈 상황')}</span>
                <textarea
                  className="detail-input detail-textarea"
                  value={tarotForm.currentMoneySituation}
                  onChange={handleTarotInputChange('currentMoneySituation')}
                  placeholder={uiText('현재 돈 상황이나 고민')}
                />
              </div>
              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('재정 상태')}</span>
                <select className="detail-input detail-select" value={tarotForm.financialStatus} onChange={handleTarotInputChange('financialStatus')}>
                  <option value="">{selectOptionLabel}</option>
                  <option value="안정">{uiText('안정')}</option>
                  <option value="불안정">{uiText('불안정')}</option>
                  <option value="적자">{uiText('적자')}</option>
                  <option value="여유 있음">{uiText('여유 있음')}</option>
                </select>
              </div>
              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('수입 형태')}</span>
                <select className="detail-input detail-select" value={tarotForm.incomeType} onChange={handleTarotInputChange('incomeType')}>
                  <option value="">{selectOptionLabel}</option>
                  <option value="고정 수입">{uiText('고정 수입')}</option>
                  <option value="프리랜서">{uiText('프리랜서')}</option>
                  <option value="투자">{uiText('투자')}</option>
                  <option value="없음">{uiText('없음')}</option>
                </select>
              </div>
              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('주요 고민')}</span>
                <select className="detail-input detail-select" value={tarotForm.mainConcern} onChange={handleTarotInputChange('mainConcern')}>
                  <option value="">{selectOptionLabel}</option>
                  <option value="돈이 안 모이는 이유">{uiText('돈이 안 모이는 이유')}</option>
                  <option value="수입 증가 가능성">{uiText('수입 증가 가능성')}</option>
                  <option value="투자/사업 방향">{uiText('투자/사업 방향')}</option>
                  <option value="이직 vs 유지">{uiText('이직 vs 유지')}</option>
                  <option value="직접 입력">{uiText('직접 입력')}</option>
                </select>
                {tarotForm.mainConcern === '직접 입력' ? (
                  <input
                    className="detail-input detail-input-long"
                    type="text"
                    value={tarotForm.mainConcernCustom}
                    onChange={handleTarotInputChange('mainConcernCustom')}
                    placeholder={uiText('주요 고민 직접 입력')}
                  />
                ) : null}
              </div>
              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('선택 상황')}</span>
                <input
                  className="detail-input detail-input-long"
                  type="text"
                  value={tarotForm.choiceSituation}
                  onChange={handleTarotInputChange('choiceSituation')}
                  placeholder="A vs B"
                />
              </div>
              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('단기/장기')}</span>
                <select
                  className="detail-input detail-select"
                  value={tarotForm.timeHorizon}
                  onChange={handleTarotInputChange('timeHorizon')}
                >
                  <option value="">{selectOptionLabel}</option>
                  <option value="단기">{uiText('단기')}</option>
                  <option value="장기">{uiText('장기')}</option>
                  <option value="단기+장기 모두">{uiText('단기+장기 모두')}</option>
                </select>
              </div>
            </>
          ) : tarotType === 'love' ? (
            <>
              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('현재 고민')}</span>
                <textarea
                  className="detail-input detail-textarea"
                  value={tarotForm.currentSituation}
                  onChange={handleTarotInputChange('currentSituation')}
                  placeholder={uiText('현재 연애 상황이나 궁금한 점')}
                />
              </div>
              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('현재 상태')}</span>
                <select className="detail-input detail-select" value={tarotForm.status} onChange={handleTarotInputChange('status')}>
                  <option value="">{selectOptionLabel}</option>
                  <option value="솔로">{uiText('솔로')}</option>
                  <option value="썸">{uiText('썸')}</option>
                  <option value="연애 중">{uiText('연애 중')}</option>
                  <option value="이별 후">{uiText('이별 후')}</option>
                  <option value="복잡한 관계">{uiText('복잡한 관계')}</option>
                </select>
              </div>
              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('상대 존재')}</span>
                <select className="detail-input detail-select" value={tarotForm.hasPartner} onChange={handleTarotInputChange('hasPartner')}>
                  <option value="">{selectOptionLabel}</option>
                  <option value="있음">{uiText('있음')}</option>
                  <option value="없음">{uiText('없음')}</option>
                </select>
              </div>
              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('관계 단계')}</span>
                <select className="detail-input detail-select" value={tarotForm.relationshipStage} onChange={handleTarotInputChange('relationshipStage')}>
                  <option value="">{selectOptionLabel}</option>
                  <option value="썸">{uiText('썸')}</option>
                  <option value="연애 중">{uiText('연애 중')}</option>
                  <option value="이별 후">{uiText('이별 후')}</option>
                  <option value="복잡한 관계">{uiText('복잡한 관계')}</option>
                </select>
              </div>
              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('궁금한 것')}</span>
                <select className="detail-input detail-select" value={tarotForm.questionType} onChange={handleTarotInputChange('questionType')}>
                  <option value="">{selectOptionLabel}</option>
                  <option value="상대 속마음">{uiText('상대 속마음')}</option>
                  <option value="관계 발전 가능성">{uiText('관계 발전 가능성')}</option>
                  <option value="재회 가능성">{uiText('재회 가능성')}</option>
                  <option value="새로운 인연 가능성">{uiText('새로운 인연 가능성')}</option>
                  <option value="고백/관계진전 타이밍">{uiText('고백/관계진전 타이밍')}</option>
                </select>
              </div>
              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('선택 상황')}</span>
                <input
                  className="detail-input detail-input-long"
                  type="text"
                  value={tarotForm.choiceSituation}
                  onChange={handleTarotInputChange('choiceSituation')}
                  placeholder="A vs B"
                />
              </div>
            </>
          ) : tarotType === 'spouse' ? (
            <>
              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('현재 고민')}</span>
                <textarea
                  className="detail-input detail-textarea"
                  value={tarotForm.spouseConcern}
                  onChange={handleTarotInputChange('spouseConcern')}
                  placeholder={uiText('현재 연애 상황 또는 배우자 관련 고민')}
                />
              </div>
              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('현재 상태')}</span>
                <select className="detail-input detail-select" value={tarotForm.status} onChange={handleTarotInputChange('status')}>
                  <option value="">{selectOptionLabel}</option>
                  <option value="솔로">{uiText('솔로')}</option>
                  <option value="썸">{uiText('썸')}</option>
                  <option value="연애 중">{uiText('연애 중')}</option>
                  <option value="이별 후">{uiText('이별 후')}</option>
                  <option value="복잡한 관계">{uiText('복잡한 관계')}</option>
                </select>
              </div>
              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('나이/시기')}</span>
                <input
                  className="detail-input detail-input-choice"
                  type="text"
                  value={tarotForm.agePeriod}
                  onChange={handleTarotInputChange('agePeriod')}
                  placeholder={uiText('선택 입력')}
                />
              </div>
              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('궁금한 것')}</span>
                <select className="detail-input detail-select" value={tarotForm.spouseQuestion} onChange={handleTarotInputChange('spouseQuestion')}>
                  <option value="">{selectOptionLabel}</option>
                  <option value="배우자운 전반">{uiText('배우자운 전반')}</option>
                  <option value="언제 결혼 흐름이 오는지">{uiText('언제 결혼 흐름이 오는지')}</option>
                  <option value="어떤 사람을 만나게 되는지">{uiText('어떤 사람을 만나게 되는지')}</option>
                  <option value="현재 만나는 사람이 배우자인지">{uiText('현재 만나는 사람이 배우자인지')}</option>
                  <option value="결혼이 가능한 관계인지">{uiText('결혼이 가능한 관계인지')}</option>
                </select>
              </div>
              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('특정 인물')}</span>
                <select className="detail-input detail-select" value={tarotForm.specificPerson} onChange={handleTarotInputChange('specificPerson')}>
                  <option value="">{selectOptionLabel}</option>
                  <option value="있음">{uiText('있음')}</option>
                  <option value="없음">{uiText('없음')}</option>
                </select>
              </div>
              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('선택 상황')}</span>
                <input
                  className="detail-input detail-input-choice"
                  type="text"
                  value={tarotForm.choiceSituation}
                  onChange={handleTarotInputChange('choiceSituation')}
                  placeholder={uiText('이 사람 vs 다른 가능성')}
                />
              </div>
            </>
          ) : tarotType === 'career' ? (
            <>
              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('현재 상황')}</span>
                <textarea
                  className="detail-input detail-textarea"
                  value={tarotForm.careerSituation}
                  onChange={handleTarotInputChange('careerSituation')}
                  placeholder={uiText('현재 직업/진로 상황이나 고민')}
                />
              </div>
              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('상태')}</span>
                <select className="detail-input detail-select" value={tarotForm.careerStatus} onChange={handleTarotInputChange('careerStatus')}>
                  <option value="">{selectOptionLabel}</option>
                  <option value="재직 중">{uiText('재직 중')}</option>
                  <option value="구직 중">{uiText('구직 중')}</option>
                  <option value="이직 준비">{uiText('이직 준비')}</option>
                  <option value="프리랜서">{uiText('프리랜서')}</option>
                  <option value="사업">{uiText('사업')}</option>
                </select>
              </div>
              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('궁금한 것')}</span>
                <select className="detail-input detail-select" value={tarotForm.careerQuestion} onChange={handleTarotInputChange('careerQuestion')}>
                  <option value="">{selectOptionLabel}</option>
                  <option value="이직 시기">{uiText('이직 시기')}</option>
                  <option value="합격 가능성">{uiText('합격 가능성')}</option>
                  <option value="직장 내 관계">{uiText('직장 내 관계')}</option>
                  <option value="수입 상승">{uiText('수입 상승')}</option>
                  <option value="직접 입력">{uiText('직접 입력')}</option>
                </select>
                {tarotForm.careerQuestion === '직접 입력' ? (
                  <input
                    className="detail-input detail-input-long"
                    type="text"
                    value={tarotForm.careerQuestionCustom}
                    onChange={handleTarotInputChange('careerQuestionCustom')}
                    placeholder={uiText('궁금한 것 직접 입력')}
                  />
                ) : null}
              </div>
              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('선택 상황')}</span>
                <input
                  className="detail-input detail-input-long"
                  type="text"
                  value={tarotForm.choiceSituation}
                  onChange={handleTarotInputChange('choiceSituation')}
                  placeholder={uiText('A회사 vs B회사')}
                />
              </div>
              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('단기/장기')}</span>
                <select
                  className="detail-input detail-select"
                  value={tarotForm.timeHorizon}
                  onChange={handleTarotInputChange('timeHorizon')}
                >
                  <option value="">{selectOptionLabel}</option>
                  <option value="단기">{uiText('단기')}</option>
                  <option value="장기">{uiText('장기')}</option>
                  <option value="단기+장기 모두">{uiText('단기+장기 모두')}</option>
                </select>
              </div>
            </>
          ) : (
            <>
              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('상황 분야')}</span>
                <select className="detail-input detail-select" value={tarotForm.genericSituationArea} onChange={handleTarotInputChange('genericSituationArea')}>
                  <option value="">{selectOptionLabel}</option>
                  <option value="연애">{uiText('연애')}</option>
                  <option value="인간관계">{uiText('인간관계')}</option>
                  <option value="진로">{uiText('진로')}</option>
                  <option value="금전">{uiText('금전')}</option>
                  <option value="기타">{uiText('기타')}</option>
                </select>
                {tarotForm.genericSituationArea === '기타' ? (
                  <input
                    className="detail-input detail-input-long"
                    type="text"
                    value={tarotForm.genericSituationAreaCustom}
                    onChange={handleTarotInputChange('genericSituationAreaCustom')}
                    placeholder={uiText('기타 상황 분야 직접 입력')}
                  />
                ) : null}
              </div>
              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('현재 상태')}</span>
                <input
                  className="detail-input detail-input-long"
                  type="text"
                  value={tarotForm.genericCurrentStatus}
                  onChange={handleTarotInputChange('genericCurrentStatus')}
                  placeholder={uiText('예: 썸, 갈등 중, 고민 중')}
                />
              </div>
              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('관련 인물')}</span>
                <input
                  className="detail-input detail-input-long"
                  type="text"
                  value={tarotForm.genericRelatedPeople}
                  onChange={handleTarotInputChange('genericRelatedPeople')}
                  placeholder={uiText('예: 나 / 상대 / 여러 명 관계')}
                />
              </div>
              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('궁금한 포인트')}</span>
                <input
                  className="detail-input detail-input-long"
                  type="text"
                  value={tarotForm.genericQuestionPoint}
                  onChange={handleTarotInputChange('genericQuestionPoint')}
                  placeholder={uiText('예: 상대 심리, 관계 흐름, 선택 고민')}
                />
              </div>
              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('선택 상황')}</span>
                <input
                  className="detail-input detail-input-long"
                  type="text"
                  value={tarotForm.genericChoiceSituation}
                  onChange={handleTarotInputChange('genericChoiceSituation')}
                  placeholder={uiText('A vs B 형태')}
                />
              </div>
            </>
          )}
        </section>
      ) : prompt.category === 'fengshui' ? (
        <section className="detail-form" aria-label={formLabel('풍수지리 입력 정보')}>
          {isMovingFengshui ? (
            <>
              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('현재 상태')}</span>
                <select className="detail-input detail-select" value={fengshuiForm.moveStatus} onChange={handleFengshuiInputChange('moveStatus')}>
                  <option value="">{selectOptionLabel}</option>
                  <option value="거주 중">{uiText('거주 중')}</option>
                  <option value="이사 고민">{uiText('이사 고민')}</option>
                  <option value="이미 계약">{uiText('이미 계약')}</option>
                  <option value="선택 중">{uiText('선택 중')}</option>
                </select>
              </div>

              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('집 유형')}</span>
                <select className="detail-input detail-select" value={fengshuiForm.moveHomeType} onChange={handleFengshuiInputChange('moveHomeType')}>
                  <option value="">{selectOptionLabel}</option>
                  <option value="원룸">{uiText('원룸')}</option>
                  <option value="아파트">{uiText('아파트')}</option>
                  <option value="오피스텔">{uiText('오피스텔')}</option>
                  <option value="주택">{uiText('주택')}</option>
                </select>
              </div>

              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('위치 정보')}</span>
                <input
                  className="detail-input detail-input-long"
                  type="text"
                  value={fengshuiForm.moveLocationInfo}
                  onChange={handleFengshuiInputChange('moveLocationInfo')}
                  placeholder={uiText('가능하면 지역 / 방향 / 층수 등')}
                />
              </div>

              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('집 구조')}</span>
                <textarea
                  className="detail-input detail-textarea"
                  value={fengshuiForm.moveHomeStructure}
                  onChange={handleFengshuiInputChange('moveHomeStructure')}
                  placeholder={uiText('대략적인 구조 or 특징 (예: 바로 방 / 창문 위치 / 화장실 위치 등)')}
                />
              </div>

              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('고민')}</span>
                <textarea
                  className="detail-input detail-textarea"
                  value={fengshuiForm.moveConcern}
                  onChange={handleFengshuiInputChange('moveConcern')}
                  placeholder={uiText('예: 이 집 가도 되는지, 현재 집 계속 살아도 되는지, 이사 타이밍, A 집 vs B 집 비교')}
                />
              </div>

              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('중요 기준')}</span>
                <input
                  className="detail-input detail-input-long"
                  type="text"
                  value={fengshuiForm.movePriority}
                  onChange={handleFengshuiInputChange('movePriority')}
                  placeholder={uiText('돈 / 건강 / 인간관계 / 안정감 등')}
                />
              </div>
            </>
          ) : (
            <>
              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('도시')}</span>
                <input className="detail-input detail-input-long" type="text" value={fengshuiForm.city} onChange={handleFengshuiInputChange('city')} placeholder={uiText('예: 서울')} />
              </div>

              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('집 방향')}</span>
                <input
                  className="detail-input detail-input-long"
                  type="text"
                  value={fengshuiForm.homeDirection}
                  onChange={handleFengshuiInputChange('homeDirection')}
                  placeholder={uiText('현관 기준 또는 창 기준 명확히')}
                />
              </div>

              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('집 형태')}</span>
                <input
                  className="detail-input detail-input-long"
                  type="text"
                  value={fengshuiForm.homeType}
                  onChange={handleFengshuiInputChange('homeType')}
                  placeholder={uiText('아파트 / 주택 / 원룸 등')}
                />
              </div>

              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('침실 방향')}</span>
                <input
                  className="detail-input detail-input-long"
                  type="text"
                  value={fengshuiForm.bedroomDirection}
                  onChange={handleFengshuiInputChange('bedroomDirection')}
                  placeholder={uiText('예: 동향')}
                />
              </div>

              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('작업공간')}</span>
                <input
                  className="detail-input detail-input-long"
                  type="text"
                  value={fengshuiForm.workspaceDirection}
                  onChange={handleFengshuiInputChange('workspaceDirection')}
                  placeholder={uiText('작업공간 방향')}
                />
              </div>

              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('머무는 위치')}</span>
                <input
                  className="detail-input detail-input-long"
                  type="text"
                  value={fengshuiForm.stayingPosition}
                  onChange={handleFengshuiInputChange('stayingPosition')}
                  placeholder={uiText('자주 머무는 위치')}
                />
              </div>
            </>
          )}
        </section>
      ) : isPhysiognomy ? (
        <section className="detail-form" aria-label={formLabel('관상/손금 안내')}>
          <p className="detail-guide">{localizedPhysiognomyGuide}</p>
        </section>
      ) : (
        <section className="detail-form" aria-label={basicInputI18n.sectionAria}>
          <div className="detail-form-row">
            <span className="detail-form-label">{basicInputI18n.birthDateLabel}</span>
            <input className="detail-input detail-input-year" type="text" value={form.birthYear} onChange={handleInputChange('birthYear')} placeholder="YYYY" maxLength={4} />
            <span className="detail-unit">{basicInputI18n.yearUnit}</span>
            <input className="detail-input detail-input-month" type="text" value={form.birthMonth} onChange={handleInputChange('birthMonth')} placeholder="MM" maxLength={2} />
            <span className="detail-unit">{basicInputI18n.monthUnit}</span>
            <input className="detail-input detail-input-day" type="text" value={form.birthDay} onChange={handleInputChange('birthDay')} placeholder="DD" maxLength={2} />
            <span className="detail-unit">{basicInputI18n.dayUnit}</span>
            <label className="detail-radio">
              <input type="radio" name="calendarType" value="lunar" checked={form.calendarType === 'lunar'} onChange={handleInputChange('calendarType')} />
              {basicInputI18n.lunarLabel}
            </label>
            <label className="detail-radio">
              <input type="radio" name="calendarType" value="solar" checked={form.calendarType === 'solar'} onChange={handleInputChange('calendarType')} />
              {basicInputI18n.solarLabel}
            </label>
          </div>

          <div className="detail-form-row">
            <span className={koBirthLabelClassName}>{basicInputI18n.birthTimeLabel}</span>
            <input className="detail-input detail-input-month" type="text" value={form.birthHour} onChange={handleInputChange('birthHour')} placeholder="HH" />
            <span className="detail-unit">{basicInputI18n.hourUnit}</span>
            <input className="detail-input detail-input-month" type="text" value={form.birthMinute} onChange={handleInputChange('birthMinute')} placeholder="MM" />
            <span className="detail-unit">{basicInputI18n.minuteUnit}</span>
          </div>

          <div className="detail-form-row">
            <span className={koBirthLabelClassName}>{basicInputI18n.birthPlaceLabel}</span>
            <input className="detail-input detail-input-place" type="text" value={form.birthCountry} onChange={handleInputChange('birthCountry')} placeholder={basicInputI18n.countryPlaceholder} />
            <input className="detail-input detail-input-place" type="text" value={form.birthCity} onChange={handleInputChange('birthCity')} placeholder={basicInputI18n.cityPlaceholder} />
          </div>

          <div className="detail-form-row">
            <span className="detail-form-label">{basicInputI18n.genderLabel}</span>
            <label className="detail-radio">
              <input type="radio" name="gender" value="male" checked={form.gender === 'male'} onChange={handleInputChange('gender')} />
              {basicInputI18n.maleLabel}
            </label>
            <label className="detail-radio">
              <input type="radio" name="gender" value="female" checked={form.gender === 'female'} onChange={handleInputChange('gender')} />
              {basicInputI18n.femaleLabel}
            </label>
            <label className="detail-radio">
              <input type="radio" name="gender" value="private" checked={form.gender === 'private'} onChange={handleInputChange('gender')} />
              {basicInputI18n.privateLabel}
            </label>
          </div>

          <div className="detail-form-row">
            <span className="detail-form-label">{basicInputI18n.analysisYearLabel}</span>
            <input
              className="detail-input detail-input-place"
              type="text"
              value={form.analysisYear}
              onChange={handleInputChange('analysisYear')}
              placeholder={locale === 'ko' ? `${currentYearNumber}년` : currentYearNumber}
              maxLength={4}
            />
          </div>

          <div className="detail-form-row">
            <span className="detail-form-label">{basicInputI18n.concernLabel}</span>
            <textarea className="detail-input detail-textarea" value={form.concern} onChange={handleInputChange('concern')} placeholder={basicInputI18n.concernPlaceholder} />
          </div>
        </section>
      )}

      <section className="prompt-box" aria-label={localeMeta.promptBodyAria}>
        {lines.map((line, index) => (
          <p key={`${line}-${index}`} className="prompt-line">
            {line.length === 0 ? '\u00A0' : line}
          </p>
        ))}
      </section>

      {toastVisible ? <div className="toast">{localeMeta.copiedToast}</div> : null}
    </main>
  );
}
