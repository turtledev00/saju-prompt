'use client';

import { useMemo, useState } from 'react';

export default function PromptDetail({ prompt }) {
  const [toastVisible, setToastVisible] = useState(false);

  const lines = useMemo(() => prompt.promptBody.split('\n'), [prompt.promptBody]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.promptBody);
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 1800);
    } catch (_error) {
      setToastVisible(false);
    }
  };

  return (
    <main className="app-shell detail-page">
      <p className="detail-tag">{prompt.tag}</p>
      <h1 className="detail-title">{prompt.title}</h1>

      <button type="button" className="copy-button" onClick={handleCopy}>
        &#128203; 프롬프트 복사
      </button>

      <section className="prompt-box" aria-label="프롬프트 원문">
        {lines.map((line, index) => (
          <p key={`${line}-${index}`} className="prompt-line">
            {line.length === 0 ? '\u00A0' : line}
          </p>
        ))}
      </section>

      {toastVisible ? <div className="toast">프롬프트를 복사했어요. &#128131;</div> : null}
    </main>
  );
}
