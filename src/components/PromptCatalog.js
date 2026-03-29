'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

const CATEGORY_ORDER = ['all', 'saju', 'tarot', 'astrology', 'fengshui', 'physiognomy'];

export default function PromptCatalog({ prompts, categoryMeta }) {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredPrompts = useMemo(() => {
    return prompts.filter((prompt) => {
      const byCategory = selectedCategory === 'all' || prompt.category === selectedCategory;
      const bySearch =
        searchText.trim().length === 0 ||
        prompt.title.includes(searchText.trim()) ||
        prompt.searchText.includes(searchText.trim());
      return byCategory && bySearch;
    });
  }, [prompts, searchText, selectedCategory]);

  return (
    <main className="app-shell">
      <section className="search-row">
        <span className="search-icon" aria-hidden="true">
          &#128269;
        </span>
        <input
          className="search-input"
          type="text"
          placeholder="유사과학 프롬프트 검색 (ex. 신년운세)"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />
      </section>

      <section className="chip-wrap" aria-label="카테고리 필터">
        {CATEGORY_ORDER.map((key) => {
          const item = categoryMeta[key];
          const isActive = selectedCategory === key;
          const iconPrefix = item.icon ? `${item.icon} ` : '';

          return (
            <button
              key={key}
              className={`chip ${isActive ? 'active' : ''}`}
              type="button"
              onClick={() => setSelectedCategory(key)}
            >
              {iconPrefix}
              {item.label}
            </button>
          );
        })}
      </section>

      <section className="card-grid" aria-label="프롬프트 목록">
        {filteredPrompts.map((prompt) => (
          <Link key={prompt.slug} href={`/prompts/${prompt.slug}`} className="prompt-card">
            <img className="card-image" src={prompt.imageSrc} alt={prompt.imageAlt} loading="lazy" />
            <h2 className="card-title">{prompt.title}</h2>
            <p className="card-tag">{prompt.tag}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
