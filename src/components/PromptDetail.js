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

  const handleCopy = async () => {
    const koHeader =
      prompt.category === 'tarot'
        ? buildTarotHeader(tarotType, tarotForm)
        : prompt.category === 'fengshui'
          ? buildFengshuiHeader(fengshuiForm, isMovingFengshui)
          : isPhysiognomy
            ? `${physiognomyGuide}\n\n`
            : buildBasicHeader(form);
    const header = locale === 'ko' ? koHeader : localizeHeaderText(koHeader, locale);
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
                  placeholder="현재 돈 상황이나 고민"
                />
              </div>
              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('재정 상태')}</span>
                <select className="detail-input detail-select" value={tarotForm.financialStatus} onChange={handleTarotInputChange('financialStatus')}>
                  <option value="">선택</option>
                  <option value="안정">안정</option>
                  <option value="불안정">불안정</option>
                  <option value="적자">적자</option>
                  <option value="여유 있음">여유 있음</option>
                </select>
              </div>
              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('수입 형태')}</span>
                <select className="detail-input detail-select" value={tarotForm.incomeType} onChange={handleTarotInputChange('incomeType')}>
                  <option value="">선택</option>
                  <option value="고정 수입">고정 수입</option>
                  <option value="프리랜서">프리랜서</option>
                  <option value="투자">투자</option>
                  <option value="없음">없음</option>
                </select>
              </div>
              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('주요 고민')}</span>
                <select className="detail-input detail-select" value={tarotForm.mainConcern} onChange={handleTarotInputChange('mainConcern')}>
                  <option value="">선택</option>
                  <option value="돈이 안 모이는 이유">돈이 안 모이는 이유</option>
                  <option value="수입 증가 가능성">수입 증가 가능성</option>
                  <option value="투자/사업 방향">투자/사업 방향</option>
                  <option value="이직 vs 유지">이직 vs 유지</option>
                  <option value="직접 입력">직접 입력</option>
                </select>
                {tarotForm.mainConcern === '직접 입력' ? (
                  <input
                    className="detail-input detail-input-long"
                    type="text"
                    value={tarotForm.mainConcernCustom}
                    onChange={handleTarotInputChange('mainConcernCustom')}
                    placeholder="주요 고민 직접 입력"
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
                  <option value="">선택</option>
                  <option value="단기">단기</option>
                  <option value="장기">장기</option>
                  <option value="단기+장기 모두">단기+장기 모두</option>
                </select>
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
                  placeholder="현재 연애 상황 또는 배우자 관련 고민"
                />
              </div>
              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('현재 상태')}</span>
                <select className="detail-input detail-select" value={tarotForm.status} onChange={handleTarotInputChange('status')}>
                  <option value="">선택</option>
                  <option value="솔로">솔로</option>
                  <option value="썸">썸</option>
                  <option value="연애 중">연애 중</option>
                  <option value="이별 후">이별 후</option>
                  <option value="복잡한 관계">복잡한 관계</option>
                </select>
              </div>
              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('나이/시기')}</span>
                <input
                  className="detail-input detail-input-choice"
                  type="text"
                  value={tarotForm.agePeriod}
                  onChange={handleTarotInputChange('agePeriod')}
                  placeholder="선택 입력"
                />
              </div>
              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('궁금한 것')}</span>
                <select className="detail-input detail-select" value={tarotForm.spouseQuestion} onChange={handleTarotInputChange('spouseQuestion')}>
                  <option value="">선택</option>
                  <option value="배우자운 전반">배우자운 전반</option>
                  <option value="언제 결혼 흐름이 오는지">언제 결혼 흐름이 오는지</option>
                  <option value="어떤 사람을 만나게 되는지">어떤 사람을 만나게 되는지</option>
                  <option value="현재 만나는 사람이 배우자인지">현재 만나는 사람이 배우자인지</option>
                  <option value="결혼이 가능한 관계인지">결혼이 가능한 관계인지</option>
                </select>
              </div>
              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('특정 인물')}</span>
                <select className="detail-input detail-select" value={tarotForm.specificPerson} onChange={handleTarotInputChange('specificPerson')}>
                  <option value="">선택</option>
                  <option value="있음">있음</option>
                  <option value="없음">없음</option>
                </select>
              </div>
              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('선택 상황')}</span>
                <input
                  className="detail-input detail-input-choice"
                  type="text"
                  value={tarotForm.choiceSituation}
                  onChange={handleTarotInputChange('choiceSituation')}
                  placeholder="이 사람 vs 다른 가능성"
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
                  placeholder="현재 직업/진로 상황이나 고민"
                />
              </div>
              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('상태')}</span>
                <select className="detail-input detail-select" value={tarotForm.careerStatus} onChange={handleTarotInputChange('careerStatus')}>
                  <option value="">선택</option>
                  <option value="재직 중">재직 중</option>
                  <option value="구직 중">구직 중</option>
                  <option value="이직 준비">이직 준비</option>
                  <option value="프리랜서">프리랜서</option>
                  <option value="사업">사업</option>
                </select>
              </div>
              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('궁금한 것')}</span>
                <select className="detail-input detail-select" value={tarotForm.careerQuestion} onChange={handleTarotInputChange('careerQuestion')}>
                  <option value="">선택</option>
                  <option value="이직 시기">이직 시기</option>
                  <option value="합격 가능성">합격 가능성</option>
                  <option value="직장 내 관계">직장 내 관계</option>
                  <option value="수입 상승">수입 상승</option>
                  <option value="직접 입력">직접 입력</option>
                </select>
                {tarotForm.careerQuestion === '직접 입력' ? (
                  <input
                    className="detail-input detail-input-long"
                    type="text"
                    value={tarotForm.careerQuestionCustom}
                    onChange={handleTarotInputChange('careerQuestionCustom')}
                    placeholder="궁금한 것 직접 입력"
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
                  placeholder="A회사 vs B회사"
                />
              </div>
              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('단기/장기')}</span>
                <select
                  className="detail-input detail-select"
                  value={tarotForm.timeHorizon}
                  onChange={handleTarotInputChange('timeHorizon')}
                >
                  <option value="">선택</option>
                  <option value="단기">단기</option>
                  <option value="장기">장기</option>
                  <option value="단기+장기 모두">단기+장기 모두</option>
                </select>
              </div>
            </>
          ) : (
            <>
              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('상황 분야')}</span>
                <select className="detail-input detail-select" value={tarotForm.genericSituationArea} onChange={handleTarotInputChange('genericSituationArea')}>
                  <option value="">선택</option>
                  <option value="연애">연애</option>
                  <option value="인간관계">인간관계</option>
                  <option value="진로">진로</option>
                  <option value="금전">금전</option>
                  <option value="기타">기타</option>
                </select>
                {tarotForm.genericSituationArea === '기타' ? (
                  <input
                    className="detail-input detail-input-long"
                    type="text"
                    value={tarotForm.genericSituationAreaCustom}
                    onChange={handleTarotInputChange('genericSituationAreaCustom')}
                    placeholder="기타 상황 분야 직접 입력"
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
                  placeholder="예: 썸, 갈등 중, 고민 중"
                />
              </div>
              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('관련 인물')}</span>
                <input
                  className="detail-input detail-input-long"
                  type="text"
                  value={tarotForm.genericRelatedPeople}
                  onChange={handleTarotInputChange('genericRelatedPeople')}
                  placeholder="예: 나 / 상대 / 여러 명 관계"
                />
              </div>
              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('궁금한 포인트')}</span>
                <input
                  className="detail-input detail-input-long"
                  type="text"
                  value={tarotForm.genericQuestionPoint}
                  onChange={handleTarotInputChange('genericQuestionPoint')}
                  placeholder="예: 상대 심리, 관계 흐름, 선택 고민"
                />
              </div>
              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('선택 상황')}</span>
                <input
                  className="detail-input detail-input-long"
                  type="text"
                  value={tarotForm.genericChoiceSituation}
                  onChange={handleTarotInputChange('genericChoiceSituation')}
                  placeholder="A vs B 형태"
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
                  <option value="">선택</option>
                  <option value="거주 중">거주 중</option>
                  <option value="이사 고민">이사 고민</option>
                  <option value="이미 계약">이미 계약</option>
                  <option value="선택 중">선택 중</option>
                </select>
              </div>

              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('집 유형')}</span>
                <select className="detail-input detail-select" value={fengshuiForm.moveHomeType} onChange={handleFengshuiInputChange('moveHomeType')}>
                  <option value="">선택</option>
                  <option value="원룸">원룸</option>
                  <option value="아파트">아파트</option>
                  <option value="오피스텔">오피스텔</option>
                  <option value="주택">주택</option>
                </select>
              </div>

              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('위치 정보')}</span>
                <input
                  className="detail-input detail-input-long"
                  type="text"
                  value={fengshuiForm.moveLocationInfo}
                  onChange={handleFengshuiInputChange('moveLocationInfo')}
                  placeholder="가능하면 지역 / 방향 / 층수 등"
                />
              </div>

              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('집 구조')}</span>
                <textarea
                  className="detail-input detail-textarea"
                  value={fengshuiForm.moveHomeStructure}
                  onChange={handleFengshuiInputChange('moveHomeStructure')}
                  placeholder="대략적인 구조 or 특징 (예: 바로 방 / 창문 위치 / 화장실 위치 등)"
                />
              </div>

              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('고민')}</span>
                <textarea
                  className="detail-input detail-textarea"
                  value={fengshuiForm.moveConcern}
                  onChange={handleFengshuiInputChange('moveConcern')}
                  placeholder="예: 이 집 가도 되는지, 현재 집 계속 살아도 되는지, 이사 타이밍, A 집 vs B 집 비교"
                />
              </div>

              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('중요 기준')}</span>
                <input
                  className="detail-input detail-input-long"
                  type="text"
                  value={fengshuiForm.movePriority}
                  onChange={handleFengshuiInputChange('movePriority')}
                  placeholder="돈 / 건강 / 인간관계 / 안정감 등"
                />
              </div>
            </>
          ) : (
            <>
              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('도시')}</span>
                <input className="detail-input detail-input-long" type="text" value={fengshuiForm.city} onChange={handleFengshuiInputChange('city')} placeholder="예: 서울" />
              </div>

              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('집 방향')}</span>
                <input
                  className="detail-input detail-input-long"
                  type="text"
                  value={fengshuiForm.homeDirection}
                  onChange={handleFengshuiInputChange('homeDirection')}
                  placeholder="현관 기준 또는 창 기준 명확히"
                />
              </div>

              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('집 형태')}</span>
                <input
                  className="detail-input detail-input-long"
                  type="text"
                  value={fengshuiForm.homeType}
                  onChange={handleFengshuiInputChange('homeType')}
                  placeholder="아파트 / 주택 / 원룸 등"
                />
              </div>

              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('침실 방향')}</span>
                <input
                  className="detail-input detail-input-long"
                  type="text"
                  value={fengshuiForm.bedroomDirection}
                  onChange={handleFengshuiInputChange('bedroomDirection')}
                  placeholder="예: 동향"
                />
              </div>

              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('작업공간')}</span>
                <input
                  className="detail-input detail-input-long"
                  type="text"
                  value={fengshuiForm.workspaceDirection}
                  onChange={handleFengshuiInputChange('workspaceDirection')}
                  placeholder="작업공간 방향"
                />
              </div>

              <div className="detail-form-row">
                <span className="detail-form-label">{formLabel('머무는 위치')}</span>
                <input
                  className="detail-input detail-input-long"
                  type="text"
                  value={fengshuiForm.stayingPosition}
                  onChange={handleFengshuiInputChange('stayingPosition')}
                  placeholder="자주 머무는 위치"
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
            <span className="detail-form-label">{basicInputI18n.birthTimeLabel}</span>
            <input className="detail-input detail-input-month" type="text" value={form.birthHour} onChange={handleInputChange('birthHour')} placeholder="HH" />
            <span className="detail-unit">{basicInputI18n.hourUnit}</span>
            <input className="detail-input detail-input-month" type="text" value={form.birthMinute} onChange={handleInputChange('birthMinute')} placeholder="MM" />
            <span className="detail-unit">{basicInputI18n.minuteUnit}</span>
          </div>

          <div className="detail-form-row">
            <span className="detail-form-label">{basicInputI18n.birthPlaceLabel}</span>
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

      <section className="prompt-box" aria-label="프롬프트 원문">
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
