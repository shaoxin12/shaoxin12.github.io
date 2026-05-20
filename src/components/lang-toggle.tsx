'use client';

import { useEffect, useState } from 'react';

export default function LangToggle() {
  const [lang, setLang] = useState('zh-CN');

  useEffect(() => {
    const saved = localStorage.getItem('lang') || 'zh-CN';
    setLang(saved);
    document.documentElement.lang = saved;
  }, []);

  function toggle() {
    const next = lang === 'zh-CN' ? 'en' : 'zh-CN';
    setLang(next);
    document.documentElement.lang = next;
    localStorage.setItem('lang', next);
  }

  return (
    <button className="lang-toggle" onClick={toggle} aria-label="Switch language">
      <span data-zh>中</span>
      <span className="lang-slash">/</span>
      <span data-en>EN</span>
    </button>
  );
}
